 # Backend Deployment on Render

 This deployment uses Render for FastAPI and Vercel for frontend.
 No external database setup needed — SQLite creates automatically on first run.

 Backend (Render)
 1) Create a new Web Service in Render
 2) Connect the GitHub repo
 3) Set root directory to backend
 4) Build command:
    - `pip install -r requirements.txt`
 5) Start command:
    - `uvicorn main:app --host 0.0.0.0 --port $PORT`
 6) Add environment variables:
    - `GROQ_API_KEY`
    - `HF_API_KEY`

 Backend Smoke Checks
 - `GET /health`
 - `GET /api/farmers`
 - `POST /api/chat`

 Frontend (Vercel)
 - Set `NEXT_PUBLIC_API_URL` to Render backend base URL
 - Deploy as usual (frontend work not described here)

 URL Wiring
 - Example demo URL pattern:
   - `https://<vercel-app>/chat?farmer_id=<uuid>`
 - Farmer IDs are retrieved from `GET /api/farmers`

 Notes
 - Vercel is used for frontend only; backend remains on Render.
 - SQLite database file is ephemeral on Render (resets on deploy). For a hackathon demo this is fine.
 - Demo profiles (Karim, Fatima) are auto-seeded on first startup.
