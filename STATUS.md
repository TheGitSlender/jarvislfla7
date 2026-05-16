# JarvisLfla7 — Build Status & Decisions Log

Last updated: 2026-05-16

---

## Build Phases

### ✅ Phase 0 — Architecture & Research
- Reviewed full product spec (`JarvisLfla7_Architecture.md`)
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

### ✅ PD-1 — LLM Choice → **Groq / llama-3.3-70b-versatile**

**Decided:** Groq free tier, `llama-3.3-70b-versatile`.
- `chat.py` now uses `groq` SDK (OpenAI-compatible `.chat.completions.create`)
- `anthropic` package removed from `requirements.txt`
- `.env` key renamed `ANTHROPIC_API_KEY` → `GROQ_API_KEY`
- System prompt instructs Darija output — model follows reliably

**Get key:** console.groq.com → sign up → API Keys → Create Key (instant, no credit card)

**Free tier limits:**
- `llama-3.3-70b-versatile`: 6,000 tokens/min, 14,400 requests/day, 30 req/min
- More than enough for a hackathon demo

---

### ✅ PD-2 — TTS Choice → **facebook/mms-tts-ara via HF Inference + browser fallback**

**Decided:** `facebook/mms-tts-ara` as primary, browser `speechSynthesis(lang='ar')` as fallback.
- New `backend/tts.py` — `POST /api/tts` → calls HF, returns `audio/flac` bytes
- `frontend/lib/api.ts` — `fetchTTS()` fetches audio, creates object URL
- `frontend/app/chat/page.tsx` — `speak()` now async: tries backend TTS first, falls back to browser
- Uses the same `HF_API_KEY` already needed for STT — no extra key

**HuggingFace free tier limits (Inference API):**
- ~1,000 requests/day on free tier across all models
- Rate limit: varies, typically 10–30 req/min
- Model: returns FLAC audio, ~50–200 KB per clip
- Input capped at 500 chars in `tts.py` to avoid silent truncation

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
