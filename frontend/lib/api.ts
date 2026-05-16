const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchFarmers(): Promise<{ id: string; name: string; region: string }[]> {
  const res = await fetch(`${API}/api/farmers`);
  if (!res.ok) throw new Error("Failed to load farmers");
  return res.json();
}

export async function getProfile(farmerId: string) {
  const res = await fetch(`${API}/api/profile/${farmerId}`);
  if (!res.ok) throw new Error("Profile not found");
  return res.json();
}

export async function createProfile(data: Record<string, unknown>): Promise<{ farmer_id: string }> {
  const res = await fetch(`${API}/api/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create profile");
  return res.json();
}

export async function sendChat(
  farmerId: string,
  message: string,
  sessionId: string
): Promise<{ response: string; session_id: string; low_confidence: boolean }> {
  const res = await fetch(`${API}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ farmer_id: farmerId, message, session_id: sessionId }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", blob, "recording.webm");
  const res = await fetch(`${API}/api/stt`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Transcription failed");
  const data = await res.json();
  return data.transcript as string;
}

/**
 * Calls /api/tts (facebook/mms-tts-ara via HF Inference).
 * Returns an object URL for the audio blob, or null if the backend
 * returned an error (caller should fall back to browser speechSynthesis).
 */
export async function fetchTTS(text: string): Promise<string | null> {
  try {
    const res = await fetch(`${API}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (blob.size === 0) return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
