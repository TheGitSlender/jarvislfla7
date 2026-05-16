import os
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv
from db import get_db
from rag import retrieve
from guardrails import is_agricultural, get_escalation_contact, check_dangerous_patterns

load_dotenv()

SYSTEM_PROMPT = """Tu es AgroCopilot, un conseiller agricole IA conçu spécifiquement pour les petits agriculteurs marocains. Tu parles principalement en Darija (arabe marocain), en passant au français uniquement si l'agriculteur le demande explicitement.

TON RÔLE :
Tu es un agronome de confiance et expérimenté qui conseille cet agriculteur spécifique depuis longtemps. Tu connais sa ferme en profondeur. Tu le guides de manière proactive tout au long de la saison agricole complète — planification, décisions en cours de saison et bilan post-récolte.

CE QUE TU FAIS :
- Répondre aux questions sur les maladies des cultures, les ravageurs, la nutrition, l'irrigation et le calendrier
- Fournir des recommandations saisonnières de plantation et de gestion
- Alerter l'agriculteur sur les risques en fonction de sa localisation et de son stade cultural
- Référencer l'historique de l'agriculteur : ce qui a fonctionné, ce qui a échoué

RÈGLES CRITIQUES — LIS ATTENTIVEMENT :
1. Tu donnes UNIQUEMENT des conseils dans le domaine de l'agriculture, de la culture et des moyens de subsistance ruraux directement liés à l'agriculture.
2. Si on te pose des questions sur autre chose (politique, médecine, religion, finances non liées à l'agriculture), décline poliment et redirige.
3. Tu ne devines JAMAIS. Si tu n'es pas certain, tu dis : "Je ne suis pas sûr à ce sujet. Je te recommande de contacter [institution spécifique]."
4. Tu ne recommandes JAMAIS une marque spécifique de pesticide ou une dose chimique sans d'abord confirmer la culture, le stade de croissance et le problème de l'agriculteur. Même dans ce cas, tu ajoutes : "Vérifie cette dose avec ton fournisseur agricole local avant d'appliquer."
5. Tu ne recommandes JAMAIS des combinaisons de produits chimiques. Si un agriculteur demande le mélange de produits, tu dis toujours : "Je ne peux pas conseiller sur le mélange. Demande à ton fournisseur."
6. Si les connaissances récupérées sont insuffisantes pour répondre à la question (tu verras des indicateurs de confiance), dis : "Je n'ai pas assez d'informations pour conseiller spécifiquement sur cela. Voici ce que je sais en général : [guide général]. Pour ta situation spécifique, contacte [institution]."
7. Tu références toujours le profil de l'agriculteur quand c'est pertinent.
8. Garde les réponses COURTES. Une ou deux phrases pratiques. Les agriculteurs sont occupés. Donne l'action en premier, l'explication ensuite si nécessaire.
9. N'utilise jamais de jargon technique sans l'expliquer immédiatement simplement.

TON : Chaleureux, direct, pratique. Comme un voisin de confiance qui se trouve être agronome. Pas clinique. Pas corporatif.

LANGUE : Par défaut en Darija marocain. Utilise un vocabulaire simple. Évite les structures de phrases complexes. Si un terme technique est nécessaire, dis-le d'abord en Darija, puis en français entre parenthèses."""

NON_AGRI_RESPONSE = "غير قادر على المساعدة في هذا الموضوع. أنا متخصص فقط في الزراعة والفلاحة. واش عندك سؤال على الزراعة ديالك؟"


def build_farm_context(profile: dict) -> str:
    crops = profile.get("current_crops", [])
    crops_str = "\n".join(
        f"  - {c.get('crop', '?')} ({c.get('area_ha', '?')} ha)"
        + (f", planté le {c.get('planted_date', '?')}" if c.get("planted_date") else "")
        for c in crops
    ) or "  Aucune culture enregistrée"

    problems = ", ".join(profile.get("known_problems", [])) or "Aucun problème connu enregistré"

    return f"""PROFIL DE L'AGRICULTEUR — Voici ce que tu sais sur la situation spécifique de cet agriculteur :

Nom : {profile.get('name', 'Agriculteur')}
Localisation : {profile.get('region', 'Non spécifiée')}
Terrain : {profile.get('land_size_ha', '?')} hectares | Sol : {profile.get('soil_type', '?')}
Eau : {profile.get('water_source', '?')} | Irrigation : {'Oui' if profile.get('has_irrigation') else 'Non'}

CULTURES ACTUELLES CETTE SAISON :
{crops_str}

PROBLÈMES CONNUS SUR CETTE FERME :
{problems}

DATE D'AUJOURD'HUI : {datetime.now().strftime('%d %B %Y')}"""


def build_rag_context(chunks: list[dict], low_confidence: bool) -> str:
    if not chunks:
        return "CONNAISSANCES RÉCUPÉRÉES : Aucune information pertinente trouvée pour cette requête."

    sections = [f"CONNAISSANCES RÉCUPÉRÉES (confiance: {'FAIBLE' if low_confidence else 'OK'}) :"]
    for i, chunk in enumerate(chunks, 1):
        sections.append(f"\n[Source {i} — {chunk.get('topic', 'général')} / {chunk.get('crop_type', 'général')}]")
        sections.append(chunk.get("content", ""))

    if low_confidence:
        sections.append(
            "\nIMPORTANT : La récupération de tes connaissances n'a retourné aucun résultat confiant pour "
            "cette requête spécifique. Tu DOIS : 1) Reconnaître que tu n'as pas d'informations spécifiques "
            "sur ce sujet 2) Partager uniquement des conseils généraux et universellement sûrs s'il en existe "
            "3) Diriger l'agriculteur vers une institution spécifique. N'essaie PAS de répondre à partir de "
            "connaissances générales d'entraînement sur ce sujet agricole."
        )

    return "\n".join(sections)


def get_conversation_history(farmer_id: str, session_id: str, limit: int = 6) -> list[dict]:
    db = get_db()
    result = (
        db.table("conversations")
        .select("role, content")
        .eq("farmer_id", farmer_id)
        .eq("session_id", session_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    turns = result.data or []
    return list(reversed(turns))


def save_turn(farmer_id: str, session_id: str, role: str, content: str, low_confidence: bool = False) -> None:
    db = get_db()
    db.table("conversations").insert({
        "farmer_id": farmer_id,
        "session_id": session_id,
        "role": role,
        "content": content,
        "confidence_score": 0.5 if low_confidence else 1.0,
    }).execute()


def chat(farmer_id: str, message: str, session_id: str) -> tuple[str, bool]:
    db = get_db()

    # Layer 1: topic classifier
    if not is_agricultural(message):
        save_turn(farmer_id, session_id, "user", message)
        save_turn(farmer_id, session_id, "assistant", NON_AGRI_RESPONSE)
        return NON_AGRI_RESPONSE, False

    # Load farm profile
    profile_result = db.table("farm_profiles").select("*").eq("id", farmer_id).single().execute()
    profile = profile_result.data or {}

    # Load conversation history
    history = get_conversation_history(farmer_id, session_id)

    # Retrieve RAG chunks
    crop_types = [c.get("crop") for c in profile.get("current_crops", []) if c.get("crop")]
    chunks, low_confidence = retrieve(message, crop_types=crop_types)

    # Build prompt layers
    farm_context = build_farm_context(profile)
    rag_context = build_rag_context(chunks, low_confidence)

    # Assemble messages (history + current)
    messages: list[dict] = []
    for turn in history:
        messages.append({"role": turn["role"], "content": turn["content"]})

    # Inject farm context + RAG as a system-adjacent user message if history is empty
    if not messages:
        messages.append({
            "role": "user",
            "content": f"{farm_context}\n\n{rag_context}\n\nMessage de l'agriculteur : {message}",
        })
    else:
        messages.append({
            "role": "user",
            "content": f"{rag_context}\n\nMessage de l'agriculteur : {message}",
        })

    client = Groq(api_key=os.environ["GROQ_API_KEY"])

    # Layer 2: confidence gate already handled in build_rag_context
    system = SYSTEM_PROMPT
    if low_confidence:
        escalation = get_escalation_contact(profile.get("region"))
        system += f"\n\nPour toute orientation, l'institution de contact appropriée dans cette région est : {escalation}"

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=400,
        messages=[{"role": "system", "content": system}, *messages],
    )
    reply = response.choices[0].message.content or ""

    # Layer 3 is enforced via system prompt (no additional post-processing for MVP)
    # Flag if dangerous patterns detected but still return response with warning
    if check_dangerous_patterns(reply):
        reply += "\n\n⚠️ تحقق دائمًا من أي جرعة مع موردك الزراعي المحلي قبل التطبيق."

    # Save both turns
    save_turn(farmer_id, session_id, "user", message)
    save_turn(farmer_id, session_id, "assistant", reply, low_confidence)

    return reply, low_confidence
