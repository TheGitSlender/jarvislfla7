# JarvisLfla7

An AI-powered agricultural advisor for smallholder farmers in Morocco. It speaks Darija (Moroccan Arabic) and provides voice-first, context-aware farming advice using RAG over a curated agronomy knowledge base.

---

## What it does

Farmers talk to Jarvis using their voice. Jarvis listens (Darija STT), looks up relevant agronomic knowledge, and responds with short practical advice — by voice or text. It knows each farmer's profile (land, crops, region, known problems) and maintains conversation history across a session.

**Key behaviors:**
- Answers questions about crop diseases, pests, irrigation, fertilization, and seasonal planning
- Refuses non-agricultural topics without calling the LLM (topic filter runs first)
- Cites uncertainty explicitly and escalates to regional institutions (ONSSA, MAPMDREF) when confidence is low
- Never recommends specific pesticide doses or chemical mixtures without safety disclaimers
- Appends a mandatory warning if dangerous patterns are detected in its own output

---

## Architecture

```
User (mobile browser)
      │ audio blob (MediaRecorder)
      ▼
Frontend — Next.js 14 (Vercel)
      │ HTTPS
      ▼
Backend — FastAPI (Render)
      ├── POST /api/stt    → Whisper Darija (HuggingFace)
      ├── POST /api/chat   → 5-layer RAG + LLM pipeline
      ├── POST /api/tts    → mms-tts-ara (HuggingFace)
      ├── GET  /api/profile
      ├── POST /api/profile
      └── GET  /api/farmers
```

### Chat pipeline (5 layers)

1. **Topic filter** — keyword classifier (Arabic/French/English/Darija transliterations) blocks non-agricultural messages before the LLM is called
2. **RAG** — query embedded with `multilingual-e5-base` (local, no API cost), cosine similarity search over 46 agronomic knowledge chunks; confidence threshold 0.72 — below it the model is instructed to say it doesn't know
3. **Prompt assembly** — system prompt (identity + 10 rules in Darija) + farm profile + RAG chunks + conversation history (last 6 turns) + current message
4. **LLM** — `llama-3.3-70b-versatile` via Groq, max 400 tokens
5. **Post-check** — regex scan for dangerous output patterns (specific doses, mixing advice); warning appended if triggered

### Voice pipeline

- **STT**: audio webm → `POST /api/stt` → `ychafiqui/whisper-small-darija` (HuggingFace Inference)
- **TTS**: reply → `facebook/mms-tts-ara` (HuggingFace Inference) → FLAC played in browser; fallback to `speechSynthesis(lang='ar')` if the API fails; `AbortController` cancels any in-flight TTS on a new message

### Database

SQLite, two tables:
- `farm_profiles` — name, region, land size, soil type, water source, irrigation flag, current crops (crop + area + planted date), known problems
- `conversations` — per-session turn history with confidence scores

Two demo profiles are seeded on startup: Karim Benali (tomatoes, Béni Mellal) and Fatima Ouhammou (wheat + olive, Marrakech).

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Python, FastAPI, SQLite |
| LLM | Llama 3.3 70B via Groq |
| STT | `ychafiqui/whisper-small-darija` (HuggingFace Inference) |
| TTS | `facebook/mms-tts-ara` (HuggingFace Inference) |
| Embeddings | `intfloat/multilingual-e5-base` (local, no API cost) |

---

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# fill in GROQ_API_KEY and HF_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

### Environment variables

| Variable | Service | Required |
|---|---|---|
| `GROQ_API_KEY` | backend | Yes |
| `HF_API_KEY` | backend | Yes (STT + TTS) |
| `ELEVENLABS_API_KEY` | backend | No |
| `NEXT_PUBLIC_API_URL` | frontend | Yes |

---

## Pages

- `/` — Landing with animated orb and "Talk to Jarvis" CTA (auto-selects first demo profile)
- `/chat?farmer_id=...` — Voice interface: orb, mic button, message history, profile drawer, simulated camera view
- `/auth` — Login/signup screen (visual mockup, not wired up)

---

## Tests

```bash
cd backend
pytest
```

---

## Deployment

- **Backend**: any service with Docker support (Render, Railway, Fly); set env vars in the dashboard; entry point is `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend**: Vercel; set `NEXT_PUBLIC_API_URL` to the backend URL

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full technical deep-dive.
