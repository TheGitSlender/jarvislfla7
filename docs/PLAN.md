 # Hackathon Execution Plan (Backend + Infra Only)

 Scope
 - Backend services, database, RAG pipeline, and deployment.
 - Frontend work is excluded by request; only environment wiring is mentioned.

 Time Budget
 - Target: complete in under 6 hours.
 - Priority is a stable end-to-end demo usable by judges.

 Critical Path (Must-Have)
 1) Database initialized (SQLite, auto-created)
 2) Knowledge base embedded (in-memory, auto-seeded)
 3) Backend deployed on Render with env vars
 4) Frontend on Vercel pointed at backend
 5) Smoke tests pass

 Status
 - ✅ Phase 0: Backend deps installed (venv/, requirements pinned, transformers=4.51.3)
 - ✅ Code fixes: optional session_id, 404 on missing profile, Darija system prompt, farm context every turn, startup env validation, Unicode guardrails, updated_at trigger
 - ✅ Tests: 9 unit tests passing (guardrails, models, rag, chat)
 - ✅ Docs: 6 files in docs/ covering plan, state, setup, deploy, checklist
 - ✅ Database: Supabase replaced with SQLite (db.py). No external DB setup needed.
 - ✅ RAG: Supabase pgvector replaced with in-memory numpy cosine similarity (rag.py). No API keys needed.
 - ❌ Phase 2: Backend not deployed to Render
 - ❌ Phase 3: Frontend not wired (NEXT_PUBLIC_API_URL not set)
 - ❌ Phase 4: Smoke tests not run (waiting on .env keys + deploy)

 Phase 1 - Setup (5 min)
 - Add GROQ_API_KEY and HF_API_KEY to backend/.env
 - No Supabase setup needed — SQLite database auto-creates on first run
 - Demo profiles (Karim, Fatima) auto-seeded on first init

 Phase 2 - Backend Deploy to Render (30-45 min)
 - Create a Render Web Service from GitHub repo
 - Root directory: backend
 - Build command: pip install -r requirements.txt
 - Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
 - Add env vars in Render dashboard:
   - GROQ_API_KEY
   - HF_API_KEY

 Phase 3 - Frontend Wiring (Vercel) (10-15 min)
 - Set NEXT_PUBLIC_API_URL to the Render backend base URL

 Phase 4 - Verification and Demo Readiness (15-30 min)
 - GET /health returns status
 - GET /api/farmers returns demo profiles
 - POST /api/chat with Karim ID yields contextual reply + RAG chunk usage
 - Non-agricultural query is rejected by guardrails
 - Unknown question triggers low-confidence escalation
 - Voice path: STT + TTS works; if TTS fails, browser fallback should be used

 Risk Management
 - HF Inference can rate-limit or fail; fallback is browser TTS in frontend
 - LLM token limits are generous on Groq free tier but still avoid overly long prompts
 - RAG embeddings compute on first chat request (~2s cold start), then cached
 - SQLite file is ephemeral on Render (resets on deploy) — fine for hackathon demo

 Keys and Where to Place Them
 - Local backend: backend/.env
 - Render backend env vars: GROQ_API_KEY, HF_API_KEY
 - Vercel frontend env var: NEXT_PUBLIC_API_URL

 Deliverables
 - Live backend URL (Render)
 - Live frontend URL (Vercel)
 - SQLite-backed app with seeded KB and demo profiles
