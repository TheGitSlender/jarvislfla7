 # Verification and Demo Checklist

 This checklist verifies backend readiness for the hackathon demo.

 Health and Connectivity
 - `GET /health` returns `{"status": "ok"}`
 - Backend can reach Supabase (no errors in logs)

 Data and RAG
 - `GET /api/farmers` returns Karim + Fatima
 - `knowledge_chunks` table has ~46 rows
 - `POST /api/chat` with Karim's ID and tomato question returns relevant guidance
 - Low-confidence question triggers escalation

 Guardrails
 - Non-agricultural query returns canned redirect
 - Responses with dangerous patterns include disclaimer

 Voice Pipeline
 - STT: `POST /api/stt` with audio returns transcript
 - TTS: `POST /api/tts` with short text returns audio/flac
 - Frontend fallback to browser TTS if HF TTS fails

 Session and Persistence
 - `POST /api/chat` with same session_id accumulates history
 - Conversations saved in `conversations` table

 Demo Flow (Minimal)
 - Load chat with Karim ID
 - Ask about tomatoes (blight or yellow leaves)
 - Ask a non-agri question (guardrail)
 - Ask an unknown question (low confidence escalation)
