 # Supabase Setup — SUPERSEDED

 As of the SQLite refactor, AgroCopilot no longer uses Supabase.
 This doc is kept as reference only.

 ## What Changed
 - Database: Supabase (PostgreSQL + pgvector) → SQLite (file-based)
 - RAG: pgvector RPC → in-memory numpy cosine similarity
 - Seeding: manual `seed_kb.py` → auto-embedded at first `rag.retrieve()` call

 ## Why
 The SQLite + in-memory RAG approach eliminated the need for:
 - A Supabase project
 - API keys (SUPABASE_URL, SUPABASE_KEY)
 - Running schema.sql manually
 - Running seed_kb.py manually

 The app now starts with `pip install` + `uvicorn` and works immediately with just two env vars: GROQ_API_KEY and HF_API_KEY.

 ## If you want to restore Supabase later
 The schema is preserved in `backend/schema.sql` for reference.
 The old `backend/db.py` pattern using Supabase client is in git history.
