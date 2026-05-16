 # Hackathon Execution Plan (Backend + Infra Only)

 Scope
 - Backend services, database, RAG pipeline, and deployment.
 - Frontend work is excluded by request; only environment wiring is mentioned.

 Time Budget
 - Target: complete in under 6 hours.
 - Priority is a stable end-to-end demo usable by judges.

 Critical Path (Must-Have)
 1) Supabase project created + schema applied
 2) Knowledge base seeded into Supabase
 3) Backend deployed on Render with env vars
 4) Frontend on Vercel pointed at backend
 5) Smoke tests pass

 Phase 1 - Supabase Setup (20-30 min)
 - Create a new Supabase project (free tier is sufficient)
 - Open SQL Editor and run `backend/schema.sql`
 - Copy API settings from Supabase:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (anon key)
 - Verify that demo profiles exist in `farm_profiles` table

 Phase 2 - Knowledge Base Seeding (15-25 min)
 - Install backend dependencies locally
 - Create `backend/.env` from `backend/.env.example`
 - Fill in: `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `HF_API_KEY`
 - Run `python seed_kb.py` to insert 46 curated chunks

 Phase 3 - Backend Deploy to Render (30-45 min)
 - Create a Render Web Service from GitHub repo
 - Root directory: `backend`
 - Build command: `pip install -r requirements.txt`
 - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
 - Add env vars in Render dashboard:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `HF_API_KEY`
 - Note: `HF_API_KEY` enables both STT and TTS in this repo

 Phase 4 - Frontend Wiring (Vercel) (10-15 min)
 - Set `NEXT_PUBLIC_API_URL` to the Render backend base URL
 - No frontend code changes required for backend wiring

 Phase 5 - Verification and Demo Readiness (15-30 min)
 - `GET /health` returns status
 - `GET /api/farmers` returns demo profiles
 - `POST /api/chat` with Karim ID yields contextual reply + RAG chunk usage
 - Non-agricultural query is rejected by guardrails
 - Unknown question triggers low-confidence escalation
 - Voice path: STT + TTS works; if TTS fails, browser fallback should be used

 Risk Management
 - HF Inference can rate-limit or fail; fallback is browser TTS in frontend
 - Supabase RLS should remain disabled for hackathon (schema assumes open access)
 - LLM token limits are generous on Groq free tier but still avoid overly long prompts

 Keys and Where to Place Them
 - Local backend: `backend/.env`
 - Render backend env vars: `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `HF_API_KEY`
 - Vercel frontend env var: `NEXT_PUBLIC_API_URL`

 Deliverables
 - Live backend URL (Render)
 - Live frontend URL (Vercel)
 - Supabase project with seeded KB and demo profiles
