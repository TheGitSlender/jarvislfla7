# JarvisLfla7 — Context for Claude Code

**What this is:** A voice-first AI agronomist for Moroccan smallholder farmers. Speaks Darija, holds a persistent farm profile, answers agricultural questions via a RAG-backed LLM pipeline.

**Pitch:** Hackathon judges. Demo runs in Chrome on mobile. Full product spec → `JarvisLfla7_Architecture.md`.

---

## Architecture (as built)

```
┌─────────────────────────────────────────────────────────┐
│              FARMER (User) — Chrome mobile              │
│        Voice input → MediaRecorder API (browser)        │
└──────────────────────┬──────────────────────────────────┘
                       │ audio blob POST
                       ▼
┌─────────────────────────────────────────────────────────┐
│               FRONTEND — Next.js 14 (Vercel)            │
│  app/page.tsx      → onboarding form                    │
│  app/chat/page.tsx → voice chat UI + TTS playback       │
│  lib/api.ts        → fetch helpers for all endpoints    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│               BACKEND — FastAPI (Railway/Render)        │
│                                                         │
│  POST /api/stt      stt.py         → HF Whisper Darija  │
│  POST /api/chat     chat.py        → RAG + LLM pipeline │
│  POST /api/profile  farmer_profile.py → create profile  │
│  GET  /api/profile/{id}            → load profile       │
│  GET  /api/farmers                 → list demo farmers  │
│                                                         │
│  guardrails.py  → topic classifier + pattern checks     │
│  rag.py         → embed query + pgvector search         │
│  models.py      → Pydantic schemas                      │
│  db.py          → Supabase client singleton             │
└────────────┬───────────────────┬────────────────────────┘
             │                   │
             ▼                   ▼
┌────────────────────┐  ┌────────────────────────────────┐
│   Supabase (free)  │  │   multilingual-e5-base (local) │
│   PostgreSQL DB    │  │   768-dim embeddings            │
│   farm_profiles    │  │   runs in venv on backend       │
│   conversations    │  │   no external API needed        │
│   knowledge_chunks │  └────────────────────────────────┘
│   + pgvector ext.  │
└────────────────────┘
```

---

## /api/chat — The Core Pipeline

Every message goes through 5 layers before the LLM sees it:

```
[LAYER 1]  GUARDRAIL — topic classifier (keyword check)
           Non-agricultural? → canned redirect, no LLM call.

[LAYER 2]  RAG RETRIEVAL — embed query → pgvector cosine search
           Returns top 4 chunks from knowledge_chunks table.
           Confidence gate: best score < 0.72 → low_confidence = True

[LAYER 3]  PROMPT ASSEMBLY — 5 sub-layers stacked:
           [3a] System prompt — identity, language (Darija), hard rules
           [3b] Farm context — profile injected as structured text
           [3c] RAG chunks — retrieved agronomic knowledge
           [3d] Conversation history — last 6 turns from DB
           [3e] Current user message

[LAYER 4]  LLM CALL — ⚠️ model TBD (see STATUS.md)

[LAYER 5]  POST-PROCESS — dangerous pattern check, disclaimer injection
           Save both turns (user + assistant) to conversations table.
```

---

## Tech Stack (confirmed)

| Component | Choice | Status |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind | ✅ written |
| Backend | FastAPI (Python 3.13) | ✅ written |
| DB | Supabase — PostgreSQL + pgvector | ✅ schema written, not run yet |
| Embeddings | `intfloat/multilingual-e5-base` 768-dim, local | ✅ in venv |
| STT | `ychafiqui/whisper-small-darija` via HF Inference API | ✅ written |
| LLM | **⚠️ PENDING DECISION** — see STATUS.md | ❌ |
| TTS | **⚠️ PENDING DECISION** — see STATUS.md | ❌ |
| Deploy | Vercel (frontend) + Railway (backend) | ❌ not deployed |

---

## Guardrails (implemented)

- **Layer 1** `guardrails.py` — keyword topic classifier, blocks non-agri queries before any LLM call
- **Layer 2** `rag.py` — confidence gate, injects `low_confidence` flag into prompt when RAG returns nothing useful
- **Layer 3** system prompt — hard rules: no chemical mixing, no brand doses, escalate when uncertain
- **Layer 4** `chat.py` post-process — regex scan for dangerous patterns, appends disclaimer if triggered

---

## Knowledge Base

46 hand-curated French/Darija agronomic chunks in `backend/knowledge/chunks.py`:
- Tomatoes: disease (mildiou, oïdium, fusariose, TYLCV), pests (Tuta absoluta, aleurodes), irrigation, fertilization, planting
- Wheat: disease (rouille jaune, septoriose, carie), irrigation, pests, planting calendar, fertilization
- Olives: disease (œil de paon, verticilliose), pests (mouche olive, psylle), irrigation, pruning, harvest
- General: soil types, organic amendment, pest management, rotation, weather (frost, heat), institutions, safety, subsidies
- Regional: Béni Mellal-Khénifra context, Marrakech-Safi context

**Not yet embedded** — `seed_kb.py` must be run once Supabase is live.

---

## Demo Profiles (in schema.sql)

- **Karim Benali** — 2ha tomatoes, Béni Mellal-Khénifra, drip irrigation, had late blight + Tuta absoluta last season
- **Fatima Ouhammou** — 5ha wheat + olive, Marrakech-Safi, rain-fed, recurring drought, limited market access

---

## Key Technical Constraints

- `multilingual-e5-base` → **768 dims** (schema uses `vector(768)`, not 1536)
- `farmer_profile.py` named intentionally — `profile.py` shadows Python stdlib `cProfile` and breaks torch imports
- `transformers` pinned to `<4.52.0` — 4.57+ breaks with `sentence-transformers==3.3.1` on Python 3.13
- All LLM calls must respond in Darija — enforced via system prompt, not model fine-tune

---

## Deferred (post-hackathon)

- Proactive push alerts (F4)
- Market price integration (F7)
- Image upload for disease detection
- Multi-season history tracking
- Async memory extraction from conversations
- Real PDF ingestion (INRA, FAO, MAPMDREF docs)
- Full multi-step onboarding wizard
- Pitch / landing page
