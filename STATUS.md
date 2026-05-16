# AgroCopilot — Build Status & Decisions Log

Last updated: 2026-05-16

---

## Build Phases

### ✅ Phase 0 — Architecture & Research
- Reviewed full product spec (`AgroCopilot_Architecture.md`)
- Researched Darija NLP landscape (STT, LLM, TTS, embeddings)
- Audited architecture doc, identified over-engineering for hackathon timeline
- Key cuts: Alembic migrations, async memory extraction, multi-step onboarding, journal page
- Key corrections: embedding dim is 768 not 1536, Web Speech API unreliable for Darija

### ✅ Phase 1 — Backend Scaffold
All backend modules written and import-verified:

| File | Purpose |
|---|---|
| `main.py` | FastAPI app, CORS, route registration |
| `db.py` | Supabase client singleton |
| `models.py` | Pydantic request/response schemas |
| `rag.py` | Embed query + pgvector retrieval + confidence gate |
| `chat.py` | Full /api/chat pipeline (5-layer prompt, guardrails, DB save) |
| `farmer_profile.py` | /api/profile CRUD + /api/farmers list |
| `stt.py` | /api/stt → HuggingFace Whisper Darija proxy |
| `guardrails.py` | Topic classifier (Layer 1) + pattern checks (Layer 4) |
| `schema.sql` | Supabase tables + pgvector RPC function + demo profiles |
| `seed_kb.py` | One-shot script: embed chunks → insert to Supabase |
| `knowledge/chunks.py` | 46 curated agronomic chunks (FR/Darija) |
| `requirements.txt` | Python deps |

**Bug fixed:** `profile.py` renamed to `farmer_profile.py` — `profile` is a Python stdlib module name that breaks torch/transformers imports on Python 3.13.

**Dep fix:** `transformers` downgraded to `4.51.3` — version `4.57+` breaks `sentence-transformers==3.3.1` on Python 3.13.

### ✅ Phase 2 — Knowledge Base Written
46 chunks covering:
- Tomatoes (8 chunks): mildiou, oïdium, fusariose, TYLCV, Tuta absoluta, aleurodes, irrigation, fertilization, planting
- Wheat (7 chunks): rouille jaune, septoriose, carie, irrigation, pests, planting calendar, fertilization
- Olives (7 chunks): œil de paon, verticilliose, mouche olive, psylle, irrigation, pruning, harvest
- General (12 chunks): soil types, organic amendment, rotation, IPM, frost/heat, institutions, pesticide safety, subsidies
- Regional (2 chunks): Béni Mellal-Khénifra context, Marrakech-Safi context

**Not yet embedded** — needs Supabase live + keys in `.env`.

### ✅ Phase 3 — Frontend Scaffold
All frontend files written:

| File | Purpose |
|---|---|
| `app/page.tsx` | Onboarding form (single page, region/crops/soil/water) + demo shortcut button |
| `app/chat/page.tsx` | Voice chat UI: MediaRecorder → STT → LLM → TTS, message bubbles, low-confidence badge |
| `app/layout.tsx` | Root layout, RTL direction, Arabic lang |
| `lib/api.ts` | Typed fetch helpers for all backend endpoints |
| `next.config.js` | `NEXT_PUBLIC_API_URL` env passthrough |
| `tailwind.config.ts` | Tailwind setup |
| `package.json` | Next.js 14 + React 18 |

`node_modules` not installed yet — run `npm install` in `frontend/`.

---

## Pending Decisions

### ⚠️ PD-1 — LLM Choice

**Context:** Originally Claude API. Switching to open-source only. No Anthropic.

**Options:**

| Option | Model | API | Darija | Speed | Tradeoff |
|---|---|---|---|---|---|
| **A** | `llama-3.3-70b-versatile` | Groq free | Good (prompted) | ~300 tok/s, instant | Not Darija-fine-tuned |
| **B** | `MBZUAI-Paris/Atlas-Chat-9B` | HF Inference free | Best (built for Darija) | Slow, cold starts 20–30s | May die during demo |
| **C** | `qwen2.5:7b` | Ollama local | Good | Depends on hardware | No API key needed |

**Leaning toward:** Option A (Groq) — demo reliability trumps Darija specialization. System prompt instructs Darija output; Llama 3.3 70B follows this reliably.

**Impact on code:** `chat.py` needs Anthropic client replaced with Groq SDK (`groq` package, OpenAI-compatible).

**Decision needed from:** You. Confirm Groq, HF, or Ollama.

---

### ⚠️ PD-2 — TTS Choice

**Context:** Originally ElevenLabs. Switching to open-source only.

**Options:**

| Option | Model | How | Arabic quality | Tradeoff |
|---|---|---|---|---|
| **A** | Browser `speechSynthesis` | Built-in, zero setup | Poor MSA | No API, instant, sounds robotic |
| **B** | `facebook/mms-tts-ara` | HF Inference API | Decent MSA Arabic | Not Darija-specific, free |
| **C** | `medmac01/Darija-Arabic-TTS` | HF Space/API | Darija-tuned | Experimental, may be flaky |

**Leaning toward:** Option B (`mms-tts-ara`) as primary, Option A as fallback. Returns audio bytes → play client-side. Sounds better than browser TTS.

**Impact on code:** `stt.py` (or new `tts.py`) needs an endpoint that calls HF `mms-tts-ara` and returns audio. Frontend plays the response audio blob instead of calling `speechSynthesis`.

**Decision needed from:** You. Confirm TTS approach.

---

## What Still Needs to Be Built / Run

### Code changes (blocked on PD-1 + PD-2)
- [ ] Replace Anthropic client in `chat.py` with Groq SDK (or HF/Ollama)
- [ ] Add `tts.py` backend endpoint → HF `mms-tts-ara` → return audio bytes
- [ ] Update `frontend/app/chat/page.tsx` to play audio blob from backend instead of `speechSynthesis`
- [ ] Update `requirements.txt` with `groq` package (drop `anthropic`)
- [ ] Update `.env.example` to replace `ANTHROPIC_API_KEY` with `GROQ_API_KEY`

### Setup (requires you to act)
- [ ] **Fill `.env`** with actual keys (GROQ_API_KEY, SUPABASE_URL, SUPABASE_KEY, HF_API_KEY)
- [ ] **Run `schema.sql`** in Supabase SQL Editor (creates tables + demo profiles)
- [ ] **Run `seed_kb.py`** to embed + insert the 46 knowledge chunks
- [ ] **Run `npm install`** in `frontend/`

### Verification checklist (run locally before deploy)
- [ ] `GET /health` returns `{"status": "ok"}`
- [ ] `GET /api/farmers` returns Karim + Fatima with their UUIDs
- [ ] `POST /api/chat` with Karim's ID + "feuilles jaunes sur mes tomates" → relevant RAG chunk returned
- [ ] `POST /api/chat` with "élections politiques" → topic classifier blocks, no LLM call
- [ ] `POST /api/chat` with unknown question → low_confidence flag = true, escalation message
- [ ] Voice record → transcript → AI response → audio plays

### Deploy
- [ ] Backend → Railway or Render
- [ ] Frontend → Vercel
- [ ] Set env vars on both platforms

### Pitch landing page
- [ ] Single long-scroll page: problem → solution → how it works → differentiation → sources (empty)
- [ ] Separate from the app, links to the demo
- [ ] Not yet started

---

## Architecture Principles Followed

1. **Farm context injected on every call** — profile loaded from DB and formatted as Layer 3b of the prompt. AI always knows who it's talking to.
2. **RAG gates the LLM** — knowledge retrieved before the LLM call, not during. Low-confidence queries switch the system prompt to "defer mode."
3. **Conservative by default** — guardrails fire before LLM (topic classifier), inside LLM (system prompt rules), and after LLM (regex scan). When in doubt, escalate.
4. **Voice-first but text-safe** — MediaRecorder → server-side Whisper → text. Text input always available as fallback if mic fails.
5. **No over-engineering** — no Alembic, no background workers, no async memory extraction. Everything is synchronous and inspectable.
6. **Open source throughout** — embeddings local, STT and TTS via HF Inference, LLM via free-tier API. No paid proprietary APIs.
