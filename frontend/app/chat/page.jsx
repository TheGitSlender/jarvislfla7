"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Orb from "@/components/orb";
import CameraView from "@/components/camera";
import useAudioLevel from "@/hooks/useAudioLevel";
import { getProfile, sendChat, transcribeAudio, fetchTTS } from "@/lib/api";

function AssistantScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const farmerId = params.get("farmer_id") ?? "";

  const audio = useAudioLevel();
  const [sessionId] = React.useState(() => crypto.randomUUID());
  const [camOpen, setCamOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [phase, setPhase] = React.useState("idle");
  const [transcript, setTranscript] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [recording, setRecording] = React.useState(false);
  const [transcribing, setTranscribing] = React.useState(false);
  const transcriptRef = React.useRef(null);
  const mediaRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const abortRef = React.useRef(null);

  React.useEffect(() => {
    if (!farmerId) { router.push("/"); return; }
    getProfile(farmerId)
      .then((d) => setProfile(d.profile))
      .catch(() => router.push("/"));
  }, [farmerId, router]);

  React.useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  React.useEffect(() => {
    if (!audio.active) { setPhase("idle"); return; }
    if (!transcribing) setPhase("listening");
  }, [audio.active, transcribing]);

  const speak = React.useCallback(async (text) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const audioUrl = await fetchTTS(text, ac.signal);
    if (ac.signal.aborted) return;
    if (audioUrl) {
      const el = new Audio(audioUrl);
      el.onended = () => URL.revokeObjectURL(audioUrl);
      el.play().catch(() => {});
      return;
    }
    if (ac.signal.aborted) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }, []);

  const sendMessage = React.useCallback(async (text) => {
    if (!text.trim() || loading) return;
    setTranscript("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    setPhase("idle");
    try {
      const res = await sendChat(farmerId, text, sessionId);
      const reply = res.response;
      setMessages((m) => [...m, { role: "assistant", text: reply, lowConfidence: res.low_confidence }]);
      speak(reply);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "حدث خطأ. يرجى المحاولة مجددًا." }]);
    } finally {
      setLoading(false);
    }
  }, [farmerId, sessionId, loading, speak]);

  const startRecording = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setTranscribing(true);
        setPhase("idle");
        try {
          const t = await transcribeAudio(blob);
          setTranscript(t);
          sendMessage(t);
        } catch {
          setTranscript("");
        } finally {
          setTranscribing(false);
        }
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      audio.start();
    } catch {
      setTranscript("");
    }
  }, [audio, sendMessage]);

  const stopRecording = React.useCallback(() => {
    mediaRef.current?.stop();
    mediaRef.current = null;
    setRecording(false);
    audio.stop();
  }, [audio]);

  const level = audio.active ? audio.level : Math.max(0.04, Math.sin(Date.now() / 1400) * 0.02 + 0.06);
  const listening = audio.active;

  return (
    <div className="screen-assistant">
      <div className="bg-grain" />
      <div className="bg-wash" />

      <header className="topbar">
        <button className="brand" onClick={() => router.push("/")}>
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#283618" /><circle cx="12" cy="12" r="5.5" fill="#FEFAE0" /></svg>
          </span>
          <span className="brand-name">JarvisLfla7</span>
        </button>
        <nav className="topnav">
          <span className="topnav-status">
            <span className={`status-dot ${listening ? "status-listening" : ""}`} />
            <span>{transcribing ? "Transcribing…" : listening ? "Listening" : "Standby"}</span>
          </span>
          <button className="iconbtn" aria-label="History">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 8v5l3 2" /></svg>
          </button>
          <button className="iconbtn" aria-label="Profile" onClick={() => setSettingsOpen(true)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
          </button>
        </nav>
      </header>

      <main className="stage">
        {messages.length === 0 ? (
          <>
            <div className="orb-wrap">
              <Orb
                variant="bloom"
                level={level}
                listening={listening}
                intensity={1}
                size={Math.min(440, typeof window !== "undefined" ? window.innerWidth * 0.5 : 440)}
              />
              <div className="orb-rings" aria-hidden="true">
                <div className="orb-ring" />
                <div className="orb-ring" />
                <div className="orb-ring" />
              </div>
            </div>

            <div className="speech">
              {phase === "idle" ? (
                <h1 className="speech-greeting">
                  <span className="speech-eyebrow">السلام · Salut · Hello</span>
                  <span>I'm <em>JarvisLfla7</em>. <br/>Tap the mic when you're ready.</span>
                </h1>
              ) : (
                <div className="speech-transcript" ref={transcriptRef}>
                  <span className="speech-quote">"</span>
                  <span>{transcript || "go ahead, I'm listening…"}</span>
                  <span className="speech-caret" />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="chat-history">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "chat-msg-user" : "chat-msg-assist"}`} style={{
                display: "flex", marginBottom: 16,
                justifyContent: m.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div className="chat-msg-content">
                  {m.text}
                  {m.lowConfidence && (
                    <div className="chat-msg-lowconf">
                      ⚠️ معلومات محدودة
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                <div className="chat-typing">
                  <div className="typing-dots" style={{ display: "flex", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--olive)", animation: "status-pulse 1.4s infinite" }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--olive)", animation: "status-pulse 1.4s infinite", animationDelay: "0.2s" }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--olive)", animation: "status-pulse 1.4s infinite", animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bars" aria-hidden="true">
          {Array.from({ length: 32 }).map((_, i) => {
            const b = audio.bands[i % 3];
            const phase = (i / 32) * Math.PI * 2;
            const h = 6 + (b * 100 + Math.sin(Date.now() / 400 + phase) * (listening ? 14 : 3));
            return <span key={i} style={{ height: Math.max(4, Math.min(80, h)) }} />;
          })}
        </div>

        <div className="controls">
          <button className="ctrl ctrl-cam" onClick={() => setCamOpen(true)} aria-label="Open camera">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="4" /></svg>
            <span className="ctrl-label">Camera</span>
          </button>

          <button
            className={`ctrl ctrl-mic ${recording ? "is-on" : ""}`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={loading || transcribing}
            aria-label={recording ? "Stop" : "Start"}
          >
            <span className="ctrl-mic-ring" />
            <span className="ctrl-mic-ring ctrl-mic-ring-2" />
            <span className="ctrl-mic-pulse" style={{ transform: `scale(${1 + level * 1.5})` }} />
            <span className="ctrl-mic-core">
              {recording ? (
                <svg viewBox="0 0 24 24" width="24" height="24"><rect x="7" y="7" width="10" height="10" rx="2" fill="#FEFAE0" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#FEFAE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /><path d="M9 21h6" /></svg>
              )}
            </span>
            <span className="ctrl-label ctrl-mic-label">{transcribing ? "Transcribing…" : recording ? "Release to send" : "Hold to speak"}</span>
          </button>

          <button className="ctrl ctrl-keyboard" aria-label="Type instead">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></svg>
            <span className="ctrl-label">Type</span>
          </button>
        </div>

        <div className="hint">
          <kbd>Space</kbd> to talk · <kbd>C</kbd> camera · <kbd>S</kbd> settings
        </div>
      </main>

      {camOpen && <CameraView onClose={() => setCamOpen(false)} />}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
      />
    </div>
  );
}

function SettingsDrawer({ open, onClose, profile }) {
  return (
    <>
      <div className={`drawer-scrim ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "is-open" : ""}`}>
        <div className="drawer-hd">
          <div>
            <div className="drawer-eyebrow">Profile</div>
            <h2 className="drawer-title">{profile?.name || "Farmer"}</h2>
            <div className="drawer-sub">{profile?.region || ""}</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="close">✕</button>
        </div>
        <div className="drawer-body">
          <section className="drawer-sect">
            <div className="drawer-sect-label">Farm</div>
            <div className="drawer-card">
              <label className="drawer-row"><span>Soil</span><strong>{profile?.soil_type || "—"}</strong></label>
              <label className="drawer-row"><span>Water</span><strong>{profile?.water_source || "—"}</strong></label>
              <label className="drawer-row"><span>Area</span><strong>{profile?.land_size_ha ? `${profile.land_size_ha} ha` : "—"}</strong></label>
              <label className="drawer-row"><span>Irrigation</span><strong>{profile?.has_irrigation ? "Yes" : "No"}</strong></label>
            </div>
          </section>
          <section className="drawer-sect">
            <div className="drawer-sect-label">Voice</div>
            <div className="drawer-card">
              <label className="drawer-row"><span>Language</span><strong>Darija · English · Français</strong></label>
              <label className="drawer-row"><span>Voice</span><strong>Olive · warm</strong></label>
            </div>
          </section>
          <section className="drawer-sect">
            <div className="drawer-sect-label">Memory</div>
            <div className="drawer-card">
              <label className="drawer-row"><span>Per-session only</span><span className="pill pill-on">On</span></label>
            </div>
          </section>
        </div>
        <footer className="drawer-ft">
          <button className="drawer-signout" onClick={() => {}}>Sign out</button>
          <div className="drawer-build">build a7-0516 · made in Casablanca</div>
        </footer>
      </aside>
    </>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={<div className="screen-assistant" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>جاري التحميل...</div>}>
      <AssistantScreen />
    </React.Suspense>
  );
}
