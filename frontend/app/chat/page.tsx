"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { sendChat, transcribeAudio, getProfile } from "@/lib/api";
import { Suspense } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
  lowConfidence?: boolean;
}

function ChatInterface() {
  const params = useSearchParams();
  const router = useRouter();
  const farmerId = params.get("farmer_id") ?? "";
  const [sessionId] = useState(() => crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [profile, setProfile] = useState<{ name: string; region: string } | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!farmerId) { router.push("/"); return; }
    getProfile(farmerId)
      .then((d) => setProfile({ name: d.profile.name, region: d.profile.region }))
      .catch(() => {});

    // Opening greeting
    setMessages([{
      role: "assistant",
      text: "السلام عليكم! أنا AgroCopilot، مستشارك الزراعي. كيف يمكنني مساعدتك اليوم؟ 🌱",
    }]);
  }, [farmerId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }, []);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await sendChat(farmerId, text, sessionId);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: res.response, lowConfidence: res.low_confidence },
      ]);
      speak(res.response);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "حدث خطأ. يرجى المحاولة مجددًا." }]);
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setTranscribing(true);
        try {
          const transcript = await transcribeAudio(blob);
          setInput(transcript);
        } catch {
          // fallback: leave input empty, user types
        } finally {
          setTranscribing(false);
        }
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch {
      alert("تعذر الوصول إلى الميكروفون.");
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    mediaRef.current = null;
    setRecording(false);
  }

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-green-700 text-white shadow-sm">
        <button onClick={() => router.push("/")} className="text-green-200 hover:text-white text-sm">
          ← رجوع
        </button>
        <div className="text-center">
          <div className="font-semibold text-sm">🌿 AgroCopilot</div>
          {profile && (
            <div className="text-xs text-green-200">{profile.name} — {profile.region}</div>
          )}
        </div>
        <div className="w-12" />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white border border-stone-200 text-stone-800 rounded-bl-sm shadow-xs"
              }`}
            >
              {m.text}
              {m.lowConfidence && (
                <div className="mt-1.5 text-xs text-amber-600 border-t border-amber-100 pt-1">
                  ⚠️ معلومات محدودة — يُنصح باستشارة متخصص
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xs">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-stone-200 safe-bottom">
        <div className="flex items-center gap-2">
          {/* Voice button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={loading || transcribing}
            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition ${
              recording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            } disabled:opacity-40`}
            title="اضغط مع الاستمرار للتسجيل"
          >
            {transcribing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 014 4v7a4 4 0 01-8 0V5a4 4 0 014-4zm0 2a2 2 0 00-2 2v7a2 2 0 004 0V5a2 2 0 00-2-2zm6 8a1 1 0 012 0 8 8 0 01-7 7.938V21h3a1 1 0 010 2H8a1 1 0 010-2h3v-2.062A8 8 0 014 11a1 1 0 012 0 6 6 0 0012 0z" />
              </svg>
            )}
          </button>

          {/* Text input */}
          <input
            className="flex-1 border border-stone-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-stone-50"
            placeholder={recording ? "جاري التسجيل..." : "اكتب سؤالك هنا..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            disabled={loading || recording}
            dir="rtl"
          />

          {/* Send button */}
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40"
          >
            <svg className="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {recording && (
          <p className="text-center text-xs text-red-500 mt-1.5 animate-pulse">
            🔴 جاري التسجيل — ارفع إصبعك للإيقاف
          </p>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">جاري التحميل...</div>}>
      <ChatInterface />
    </Suspense>
  );
}
