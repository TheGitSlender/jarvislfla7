# Deploy — Hackathon Checklist

> [!WARNING]
> **Superseded.** See `docs/DEPLOY_RENDER.md` for the current deployment guide.
> The app now uses SQLite (no Supabase) and only requires GROQ_API_KEY + HF_API_KEY.

## Step 1 — Supabase (5 min)

1. Create free project at supabase.com
2. Go to **SQL Editor** → paste contents of `backend/schema.sql` → Run
3. Copy **Project URL** and **anon key** from Settings → API

## Step 2 — Backend on Railway (10 min)

```bash
cd backend
cp .env.example .env
# Fill in .env with your keys

# Install Railway CLI if needed:
npm i -g @railway/cli
railway login
railway init       # "New project"
railway up

# Set env vars on Railway dashboard (Variables tab):
# ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_KEY, HF_API_KEY
```

Or use **Render**: New Web Service → connect GitHub → Root dir: `backend` → Build: `pip install -r requirements.txt` → Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Step 3 — Seed knowledge base (5 min, run locally against Supabase)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Make sure .env has SUPABASE_URL and SUPABASE_KEY
python seed_kb.py
```

This embeds and inserts all 46 knowledge chunks into Supabase. Takes ~2 minutes (model download on first run).

## Step 4 — Frontend on Vercel (5 min)

```bash
cd frontend
npm install

# Set env var for Vercel:
# NEXT_PUBLIC_API_URL = https://your-railway-backend.up.railway.app

npx vercel deploy --prod
```

Or connect GitHub repo on vercel.com → set `Root Directory: frontend` → set env var.

## Step 5 — Verify demo profiles

The schema.sql already inserts Karim and Fatima profiles.
Check in Supabase Table Editor → `farm_profiles` to confirm.

Hit `GET /api/farmers` on your backend URL to see their IDs.

## Demo URL pattern

```
https://your-vercel-app.vercel.app/chat?farmer_id=<karim-uuid>
```

Grab the UUID from Supabase → `farm_profiles` table.

---

## Local dev (fastest iteration)

```bash
# Terminal 1 — backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Terminal 2 — frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:8000
API docs: http://localhost:8000/docs
