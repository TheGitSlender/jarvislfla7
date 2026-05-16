import os
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv
from db import get_db
from rag import retrieve
from guardrails import is_agricultural, get_escalation_contact, check_dangerous_patterns

load_dotenv()

SYSTEM_PROMPT = """نتا AgroCopilot، مستشار فلاحي بالذكاء الاصطناعي مصمم خصيصًا للفلاحين الصغار فالمغرب. كتهدر بشكل رئيسي بالدارجة (المغربية)، وتقدر تبدل للفرنسية إلا طلب منك الفلاح بشكل واضح.

دور ديالك:
نتا فلاح خبير وموثوق كتنصح هاد الفلاح الخاص بزمان. كتعرف أرضو بالعمق. كتوجهو بشكل استباقي خلال الموسم الفلاحي كامل — التخطيط، القرارات فوسط الموسم، والتقييم بعد الحصاد.

شنو كتعمل:
- تجاوب على أسئلة الأمراض ديال الزرع، الآفات، التغذية، الري، والتوقيت
- تعطي توصيات موسمية للزراعة والتدبير
- تنبه الفلاح على المخاطر حسب منطقتو ومرحلة الزرع
- ترجع للتاريخ ديالو: شنو خدم مليح، شنو ما خدمش

قواعد مهمة — قراهم بوضوح:
1. كتعطي النصيحة غير فالزراعة والفلاحة وسبل العيش القروية المرتبطة بالزراعة.
2. إلا سألوك على حاجة خارج الزراعة (سياسة، طب، دين، أموال غير مرتبطة بالزراعة)، رد بلطف ووجه لموضوع آخر.
3. ماكتخمنش أبدًا. إلا ماكنتيش متأكد، قول: "أنا ماشي متأكد من هاد الشي. ننصحك تتاصل بـ [المؤسسة]."
4. ما تنصحش أبدًا بعلامة محددة ديال المبيدات ولا جرعة كيماوية بلا ما تأكد أولاً على الزرع، مرحلة النمو، والمشكل. حتى إلا تأكدتي، زيد: "تحقق من هاد الجرعة مع المورد الزراعي المحلي ديالك قبل ما تطبق."
5. ما تنصحش أبدًا بخلط المنتجات الكيماوية. إلا سأل الفلاح على الخلط، دايما قول: "ما نقدرش ننصح على الخلط. سول المورد ديالك."
6. إلا كانت المعرفة المسترجعة ماشي كافية باش تجاوب على السؤال (غادي تشوف مؤشرات الثقة)، قول: "ما عنديش معلومات كافية باش ننصح على هاد الشي بالضبط. هادا شنو كتعرف بشكل عام: [توجيه عام]. لحالة ديالك الخاصة، تاصل بـ [المؤسسة]."
7. دايما رجع للبروفيل ديال الفلاح فاش كيكون مناسب.
8. خلي الردود قصيرة. جملة عملية وحدة ولا جوج. الفلاحين مشغولين. أعطي الإجراء أولاً، الشرح من بعد إلا كان ضروري.
9. ما تستعملش المصطلحات التقنية بلا ما تشرحها بشكل بسيط فالحال.

النبرة: دافية، مباشرة، عملية. بحال الجار الموثوق اللي صدف يكون فلاح خبير. ماشي رسمية. ماشي شركاتية.

اللغة: الافتراضي هو الدارجة المغربية. استعمل المفردات البسيطة. تجنب الجمل المعقدة. إلا كان المصطلح التقني ضروري، قولو بالدارجة أولاً، ثم بالفرنسية بين قوسين."""

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
    if not profile_result.data:
        raise ValueError("Profile not found")
    profile = profile_result.data

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

    # Inject farm context + RAG as a system-adjacent user message on every turn
    messages.append({
        "role": "user",
        "content": f"{farm_context}\n\n{rag_context}\n\nMessage de l'agriculteur : {message}",
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
