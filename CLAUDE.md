# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# JarvisLfla7 — Context for Claude Code

**What this is:** A voice-first AI agronomist for Moroccan smallholder farmers. Speaks Darija, holds a persistent farm profile, answers agricultural questions via a RAG-backed LLM pipeline.

**Pitch:** Hackathon judges. Demo runs in Chrome on mobile.

---

## Commands

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload          # dev server on :8000
python seed_kb.py                  # embed knowledge chunks into DB (run once)
pytest tests/                      # run all tests
pytest tests/test_chat.py          # run a single test file
```

Requires `backend/.env` with at minimum:
```
GROQ_API_KEY=...
HF_API_KEY=...   # optional — STT/TTS return 503 without it
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # dev server on :3000
npm run build
```

Requires `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              FARMER (User) — Chrome mobile              │
│        Voice input → MediaRecorder API (browser)        │
└──────────────────────┬──────────────────────────────────┘
                       │ audio blob POST
                       ▼
┌─────────────────────────────────────────────────────────┐
│               FRONTEND — Next.js 14 (App Router)        │
│  app/page.jsx      → landing / farmer select            │
│  app/chat/page.jsx → voice chat UI + TTS playback       │
│  app/auth/page.jsx → sign-in (stub)                     │
│  lib/api.ts        → fetch helpers for all endpoints    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│               BACKEND — FastAPI (Python 3.13)           │
│                                                         │
│  POST /api/stt      stt.py         → HF Whisper Darija  │
│  POST /api/chat     chat.py        → RAG + LLM pipeline │
│  POST /api/tts      tts.py         → HF MMS-TTS Arabic  │
│  POST /api/profile  farmer_profile.py → create profile  │
│  GET  /api/profile/{id}            → load profile       │
│  GET  /api/farmers                 → list demo farmers  │
│                                                         │
│  guardrails.py  → topic classifier + pattern checks     │
│  rag.py         → in-memory cosine search               │
│  models.py      → Pydantic schemas                      │
│  db.py          → SQLite singleton (auto-seeds demos)   │
└────────────┬───────────────────┬────────────────────────┘
             │                   │
             ▼                   ▼
┌────────────────────┐  ┌────────────────────────────────┐
│  SQLite (local)    │  │  multilingual-e5-base (local)  │
│  farm_profiles     │  │  768-dim, in-process           │
│  conversations     │  │  knowledge loaded from         │
│                    │  │  knowledge/chunks.py at boot   │
└────────────────────┘  └────────────────────────────────┘
```

---

## /api/chat — The Core Pipeline

```
[LAYER 1]  GUARDRAIL — keyword topic classifier (guardrails.py)
           Non-agricultural? → canned Darija redirect, no LLM call.
           Skipped if conversation history already exists (follow-up detection).

[LAYER 2]  RAG RETRIEVAL — in-memory cosine search over knowledge/chunks.py
           multilingual-e5-base embeddings, top-5 results.
           Confidence gate: best score < 0.72 → low_confidence = True

[LAYER 3]  PROMPT ASSEMBLY
           [3a] System prompt (Darija identity + hard rules) — chat.py SYSTEM_PROMPT
           [3b] Farm context — profile injected as structured French text
           [3c] RAG chunks — retrieved agronomic knowledge
           [3d] Conversation history — last 6 turns from SQLite
           [3e] Current user message

[LAYER 4]  LLM CALL — Groq, llama-3.3-70b-versatile, max_tokens=400

[LAYER 5]  POST-PROCESS — CJK character strip, dangerous-pattern check,
           disclaimer injection, save both turns to DB.
```

---

## Tech Stack

| Component | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind |
| Backend | FastAPI (Python 3.13), venv at `backend/venv/` |
| DB | SQLite via `db.py`; auto-creates + seeds demo profiles on first run |
| Embeddings | `intfloat/multilingual-e5-base` 768-dim, runs in-process at startup |
| STT | `ychafiqui/whisper-small-darija` via HF Inference API |
| LLM | Groq — `llama-3.3-70b-versatile` |
| TTS | `facebook/mms-tts-ara` via HF Inference API; falls back to browser `speechSynthesis` |

---

## Key Constraints

- `multilingual-e5-base` → **768 dims**; don't change embedding model without updating all stored vectors.
- **`farmer_profile.py` named intentionally** — `profile.py` shadows Python's `cProfile` and breaks torch imports.
- `transformers` pinned to `<4.52.0` — 4.52+ breaks with `sentence-transformers==3.3.1` on Python 3.13.
- All LLM responses must be in Darija — enforced via the system prompt in `chat.py`, not model fine-tuning.
- RAG is purely in-memory (no pgvector). `rag.py` loads `knowledge/chunks.py` and embeds at first request; results are cached for the process lifetime.
- TTS truncates input at 500 chars to avoid silent cutoff by MMS-TTS.
- `schema.sql` documents the original Supabase schema (with pgvector) but is **not currently used** — SQLite is the runtime DB.

---

## Demo Profiles

Two profiles are auto-seeded on first `init_db()`:
- **Karim Benali** — 2 ha tomatoes, Béni Mellal-Khénifra, drip irrigation, mildiou + Tuta absoluta history
- **Fatima Ouhammou** — 5 ha wheat + olive, Marrakech-Safi, rain-fed, recurring drought

`/api/farmers` returns these IDs; the landing page picks the first one automatically.

---

## Knowledge Base

46 hand-curated French/Darija agronomic chunks in `backend/knowledge/chunks.py`. Topics: tomato diseases/pests/irrigation/fertilization, wheat diseases/pests/calendar, olive diseases/pests/pruning/harvest, general soil/rotation/weather/subsidies, and two regional context chunks (Béni Mellal-Khénifra, Marrakech-Safi).

`seed_kb.py` exists for future Supabase migration but is not needed for local SQLite operation.
