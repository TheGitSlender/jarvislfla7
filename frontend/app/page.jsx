"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Orb from "@/components/orb";
import { fetchFarmers } from "@/lib/api";

const ORB_COLORS = {
  forest: "#283618",
  olive: "#606C38",
  oliveBright: "#7C8B45",
  cornsilk: "#FEFAE0",
  cream: "#F5EFD3",
  mint: "#A7B47A",
  oliveSoft: "#A7B47A",
};

function LandingScreen() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleTalk = async () => {
    setLoading(true);
    try {
      const farmers = await fetchFarmers();
      if (farmers.length > 0) {
        router.push(`/chat?farmer_id=${farmers[0].id}`);
      }
    } catch {
      alert("تعذر الاتصال بالخادم. تحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-landing">
      <div className="bg-grain" />
      <div className="bg-wash" />

      <header className="ln-nav">
        <div className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#283618" /><circle cx="12" cy="12" r="5.5" fill="#FEFAE0" /></svg>
          </span>
          <span className="brand-name">JarvisLfla7</span>
        </div>
        <nav className="ln-nav-links">
          <a href="#how">How it works</a>
          <a href="#voices">For farmers</a>
          <a href="#trust">Guardrails</a>
          <a href="#impact">Our mission</a>
        </nav>
        <div className="ln-nav-cta">
          <button className="btn-ghost" onClick={() => router.push("/auth")}>Sign in</button>
          <button className="btn-primary" onClick={handleTalk} disabled={loading}>
            {loading ? "Loading…" : "Open Jarvis →"}
          </button>
        </div>
      </header>

      <section className="ln-hero">
        <div className="ln-hero-copy">
          <div className="ln-eyebrow">
            <span className="ln-eyebrow-dot" />
            <span>AI agronomist for Moroccan farmers · مغربي · v0.7</span>
          </div>
          <h1 className="ln-h1">
            An agronomist
            <br />
            that <em>knows</em> your land.
          </h1>
          <p className="ln-lede">
            JarvisLfla7 is a voice-first AI agronomist that knows your specific farm —
            your soil, your crops, your history. Ask about disease, pests, irrigation, or
            seasonal planning in darija, english or french. It remembers everything,
            never guesses, and always says <em>"I don't know"</em> before it gets it wrong.
          </p>
          <div className="ln-cta-row">
            <button className="btn-primary btn-lg" onClick={handleTalk} disabled={loading}>
              Talk to Jarvis
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <button className="btn-ghost btn-lg">Watch the 90-sec demo</button>
          </div>
          <div className="ln-trust">
            <div className="ln-trust-meta">
              <strong>4.9</strong>
              <span>average rating across 1.2k hackathon testers</span>
            </div>
            <div className="ln-trust-logos">
              <span>1337</span><span>·</span><span>UM6P</span><span>·</span><span>Outlierz</span><span>·</span><span>HPS</span>
            </div>
          </div>
        </div>
        <div className="ln-hero-orb">
          <div className="ln-orb-frame">
            <div className="ln-orb-label-tl">orb · live preview</div>
            <div className="ln-orb-label-br">bloom</div>
            <Orb
              variant="bloom"
              level={0.18}
              listening={false}
              intensity={1}
              size={420}
            />
          </div>
          <div className="ln-orb-cap">
            <span className="ln-orb-cap-num">01</span>
            <span>The orb breathes when idle, leans into you when you speak, and flares when it understands.</span>
          </div>
        </div>
      </section>

      <div className="ln-marquee">
        <div className="ln-marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="ln-marquee-group">
              <span>identify that disease</span><span>◆</span>
              <span>when to irrigate</span><span>◆</span>
              <span>treat tomato blight</span><span>◆</span>
              <span>olive harvest timing</span><span>◆</span>
              <span>plan my season</span><span>◆</span>
              <span>wheat rust treatment</span><span>◆</span>
              <span>what fertilizer to use</span><span>◆</span>
              <span>check the market price</span><span>◆</span>
            </div>
          ))}
        </div>
      </div>

      <section className="ln-section" id="how">
        <div className="ln-section-hd">
          <div className="ln-section-num">02</div>
          <h2 className="ln-h2">Three taps, then it just works.</h2>
        </div>
        <div className="ln-steps">
          {[
            { n: "i.", t: "Describe what you see.", d: "\"Yellow leaves on my tomatoes.\" Press the mic and speak in darija, english, or french. No wake word, no menu. Just hold and talk." },
            { n: "ii.", t: "Jarvis thinks with context.", d: "It checks your farm profile, searches its agronomic knowledge base, and responds. It never guesses — if uncertain, it directs you to a local expert." },
            { n: "iii.", t: "Act with confidence.", d: "A clear recommendation in seconds. Verified against curated Moroccan agronomic data. Everything saved to your farm journal for next season." },
          ].map((s) => (
            <article key={s.n} className="ln-step">
              <div className="ln-step-n">{s.n}</div>
              <h3 className="ln-step-t">{s.t}</h3>
              <p className="ln-step-d">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ln-features" id="trust">
        <div className="ln-feature ln-feature-big">
          <div className="ln-feature-eyebrow">Safety</div>
          <h3 className="ln-feature-h">Your farm, remembered.</h3>
          <p className="ln-feature-p">
            Your farm profile persists across sessions — soil, crops, history, known problems.
            Jarvis never starts from zero. Every piece of advice is grounded in validated agronomic
            knowledge. When confidence is low, it tells you and sends you to an expert.
          </p>
          <ul className="ln-feature-list">
            <li>· Farm profile persists across sessions</li>
            <li>· RAG-grounded answers, not hallucinated</li>
            <li>· 5 guardrail layers per response</li>
            <li>· No training on your conversations</li>
          </ul>
        </div>
        <div className="ln-feature-stack">
          <div className="ln-feature" id="voices">
            <div className="ln-feature-eyebrow">Voice</div>
            <h3 className="ln-feature-h">Speaks your language — Darija first.</h3>
            <p className="ln-feature-p">Voice-first by design — no literacy barrier. Press, speak, get an answer. Three languages supported: Darija, English, Français. Olive is the default voice — warm, calm, built for Moroccan ears.</p>
          </div>
          <div className="ln-feature">
            <div className="ln-feature-eyebrow">Eyes</div>
            <h3 className="ln-feature-h">Show Jarvis what you see.</h3>
            <p className="ln-feature-p">Point the camera at a sick leaf, a pest on a fruit, or a wilting stem. Jarvis cross-references its knowledge base to give you a likely diagnosis — no typing needed.</p>
          </div>
        </div>
      </section>

      <section className="ln-quote" id="impact">
        <div className="ln-quote-mark">"</div>
        <p>
          Before Jarvis, I had no one to ask about my olive trees.
          The extension agent comes once a year if I'm lucky.
          Now I just hold the mic and speak.
        </p>
        <footer>
          <span className="ln-quote-name">Fatima Ouhammou</span>
          <span className="ln-quote-role">olive & wheat farmer · Marrakech-Safi</span>
        </footer>
      </section>

      <section className="ln-footer-cta">
        <h2 className="ln-h2">Ready when you are.</h2>
        <p>Open Jarvis in your browser. No install, no signup — your farm profile is stored locally. Sign in when you want to keep your memory across sessions.</p>
        <div className="ln-cta-row">
          <button className="btn-primary btn-lg" onClick={handleTalk} disabled={loading}>Open Jarvis →</button>
          <button className="btn-ghost btn-lg" onClick={() => router.push("/auth")}>Create an account</button>
        </div>
      </section>

      <footer className="ln-foot">
        <div className="ln-foot-l">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="#283618" /><circle cx="12" cy="12" r="5.5" fill="#FEFAE0" /></svg>
          </span>
          <span>© 2026 JarvisLfla7 · Casablanca · Made for Moroccan farmers.</span>
        </div>
        <div className="ln-foot-r">
          <a>Privacy</a><a>Memory policy</a><a>Status</a><a>Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return <LandingScreen />;
}
