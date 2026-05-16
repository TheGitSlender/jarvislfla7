 # Supabase Setup and Knowledge Base Seeding

 This is the authoritative setup flow for the Supabase backend used by JarvisLfla7.
 It is derived from `backend/schema.sql` and `backend/seed_kb.py`.

 Step 1 - Create Supabase Project
 - Go to https://supabase.com and create a free project
 - Keep database password and project region noted

 Step 2 - Apply Schema
 - Open Supabase SQL Editor
 - Paste the contents of `backend/schema.sql`
 - Run the script
 - This creates:
   - `farm_profiles`
   - `conversations`
   - `knowledge_chunks`
   - RPC `match_knowledge_chunks`
   - Demo profiles (Karim, Fatima)

 Step 3 - Collect API Credentials
 - Supabase Dashboard → Settings → API
 - Copy these values:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (anon key)

 Step 4 - Seed Knowledge Base
 - Run locally, not in Supabase
 - From `backend/`:
   - Create virtual environment
   - Install requirements
   - Create `.env` from `.env.example`
   - Fill in:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `GROQ_API_KEY` (for chat testing)
     - `HF_API_KEY` (for STT/TTS testing)
 - Execute:
   - `python seed_kb.py`
 - Expected output: 46 chunks inserted

 Step 5 - Verify
 - In Supabase Table Editor:
   - `farm_profiles` contains demo profiles
   - `knowledge_chunks` contains ~46 rows

 Notes
 - RLS is not configured by schema; leave disabled for hackathon demo.
 - `knowledge_chunks.embedding` is vector(768) and must match `multilingual-e5-base`.
