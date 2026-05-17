# Architecture & fonctionnement

## Vue d'ensemble

```
Utilisateur (Chrome mobile)
       │ audio blob (MediaRecorder)
       ▼
Frontend — Next.js 14 (Vercel)
       │ requêtes HTTPS
       ▼
Backend — FastAPI (Render)
       │
       ├── POST /api/stt    → Whisper Darija (HuggingFace)
       ├── POST /api/chat   → Pipeline RAG + LLM
       ├── POST /api/tts    → mms-tts-ara (HuggingFace)
       ├── GET /api/profile → Chargement profil agricole
       ├── POST /api/profile→ Création profil agricole
       └── GET /api/farmers → Liste agriculteurs (démo)
```

---

## Pipeline `/api/chat` — 5 couches

Chaque message agricole traverse 5 étapes avant de recevoir une réponse :

### Couche 1 — Filtre thématique
Un classifieur par mots-clés (français, arabe, anglais, translittérations darija) vérifie si la question est agricole. Si non, l'utilisateur est redirigé sans appeler le LLM. Si la conversation est déjà établie (messages en historique), ce filtre est sauté pour ne pas bloquer les questions de suivi.

### Couche 2 — Recherche documentaire (RAG)
La question est convertie en vecteur 768 dimensions via `intfloat/multilingual-e5-base` (modèle local, pas de coût API). Ce vecteur cherche dans une base de 46 connaissances agronomiques en mémoire via similarité cosinus.

Les connaissances couvrent :
- **Tomate** : mildiou, oïdium, fusariose, nécrose apicale, Tuta absoluta, aleurodes, irrigation, fertilisation
- **Blé** : rouille jaune, septoriose, carie, pucerons, irrigation, calendrier, fertilisation
- **Olivier** : œil de paon, verticilliose, mouche de l'olive, psylle, irrigation, taille, récolte
- **Général** : types de sols, amendement organique, rotation des cultures, lutte intégrée, gel, canicule, institutions ONSSA/MAPMDREF, subventions

**Seuil de confiance** : si la meilleure similarité est < 0,72, le système passe en mode basse confiance et l'IA est instruite de dire qu'elle ne sait pas.

### Couche 3 — Assemblage du prompt
Le prompt final contient 5 sous-couches empilées :
1. **Prompt système** — identité, 10 règles absolues en Darija, langue, ton
2. **Contexte ferme** — profil de l'agriculteur injecté (nom, région, sol, cultures, problèmes connus)
3. **Connaissances RAG** — les chunks récupérés avec leurs scores
4. **Historique conversation** — les 6 derniers échanges de la session
5. **Message actuel** — la question de l'agriculteur

### Couche 4 — LLM (Llama 3.3 70B via Groq)
Le modèle reçoit le prompt assemblé et génère une réponse. Le prompt système lui impose 10 règles strictes en Darija :
- Ne jamais deviner
- Ne jamais recommander une marque sans disclaimer
- Ne jamais conseiller le mélange de produits chimiques
- Toujours dire *« vérifiez avec votre fournisseur »*
- Si basse confiance → dire *« je n'ai pas assez d'informations »* et orienter vers une institution
- Garder les réponses courtes (1-2 phrases pratiques)

### Couche 5 — Post-vérification
Un scan regex cherche des motifs dangereux dans la réponse (doses spécifiques sans contexte, mélanges recommandés, promesses excessives, absence de disclaimer sur un avis pesticide). Si détecté, un avertissement est ajouté : *⚠️ تحقق دائمًا من أي جرعة مع موردك الزراعي المحلي قبل التطبيق.*

---

## Pipeline vocal

### Entrée (STT)
1. L'utilisateur maintient le bouton micro → `MediaRecorder` capture l'audio en webm
2. Relâche → le blob audio est envoyé à `POST /api/stt`
3. Le backend appelle le modèle `ychafiqui/whisper-small-darija` via l'API HuggingFace Inference
4. Le texte transcrit est retourné au frontend

### Sortie (TTS)
1. Le backend appelle `facebook/mms-tts-ara` via HuggingFace Inference
2. L'audio FLAC est retourné et joué dans le navigateur
3. Si l'API TTS échoue, le navigateur utilise `speechSynthesis(lang='ar')` comme fallback
4. Les appels TTS sont protégés par `AbortController` : un nouvel appel annule le précédent (pas d'audio qui se chevauche)

---

## Base de données (SQLite)

Deux tables :
- **farm_profiles** : profil agricole persistant (nom, région, superficie, sol, eau, irrigation, cultures actuelles, problèmes connus)
- **conversations** : historique des échanges par session

Deux profils sont auto-amorcés au démarrage :
- **Karim Benali** — 2 ha tomates, Béni Mellal-Khénifra, goutte-à-goutte, mildiou + Tuta absoluta
- **Fatima Ouhammou** — 5 ha blé + olive, Marrakech-Safi, pluvial, sécheresse récurrente

---

## Frontend — Pages

- `/` — Page d'accueil avec orb animée, présentation du projet, bouton "Talk to Jarvis" qui auto-sélectionne le premier profil démo
- `/chat?farmer_id=...` — Interface vocale complète : orb, micro, historique des messages, tiroir profil, caméra simulée
- `/auth` — Page de connexion/inscription (maquette visuelle uniquement)

### Composants notables
- **Orb** : 4 variantes d'animations SVG/Canvas (bloom, petals, mesh, ribbon) qui réagissent au niveau audio et à l'état d'écoute
- **CameraView** : Simulateur de viseur avec scène animée (pas de vraie caméra en démo)
- **useAudioLevel** : Hook qui capture le microphone via `getUserMedia` → `AudioContext` → analyseur de fréquence, avec fallback simulé

---

## Librairies et services externes

| Service | Usage | Clé API nécessaire |
|---|---|---|
| Groq (`llama-3.3-70b-versatile`) | LLM pour les réponses agricoles | `GROQ_API_KEY` |
| HuggingFace Inference (`whisper-small-darija`) | Transcription vocale Darija | `HF_API_KEY` |
| HuggingFace Inference (`mms-tts-ara`) | Synthèse vocale arabe | `HF_API_KEY` |
| sentence-transformers (`multilingual-e5-base`) | Recherche RAG (local, dans le backend) | Aucune |

Tous les services externes ont des limites généreuses en gratuit (Groq : 14 400 requêtes/jour, HF : ~1000/jour).

---

## Déploiement

- **Backend** : `uvicorn main:app --host 0.0.0.0 --port $PORT` — nécessite `GROQ_API_KEY` et `HF_API_KEY` dans l'environnement
- **Frontend** : `npm run build && npm start` — nécessite `NEXT_PUBLIC_API_URL` pointant vers le backend
