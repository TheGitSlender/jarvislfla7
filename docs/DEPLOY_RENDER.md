 # Backend Deployment on Render

 This deployment uses Render for FastAPI and Vercel for frontend.
 It follows the repo's current backend structure.

 Backend (Render)
 1) Create a new Web Service in Render
 2) Connect the GitHub repo
 3) Set root directory to `backend`
 4) Build command:
    - `pip install -r requirements.txt`
 5) Start command:
    - `uvicorn main:app --host 0.0.0.0 --port $PORT`
 6) Add environment variables:
    - `GROQ_API_KEY`
    - `SUPABASE_URL`
    - `SUPABASE_KEY`
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
