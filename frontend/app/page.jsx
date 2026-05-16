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
          <a href="#voices">Voices</a>
          <a href="#trust">Trust & memory</a>
          <a href="#dev">For developers</a>
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
            <span>Now in private beta · مغربي · v0.7</span>
          </div>
          <h1 className="ln-h1">
            A calm voice
            <br />
            for a <em>loud</em> day.
          </h1>
          <p className="ln-lede">
            JarvisLfla7 is a conversational assistant that listens — really listens — in darija,
            english and french. It plans your day, drafts your emails, watches what your camera
            sees, and remembers only what you tell it to.
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
              <span>plan a day</span><span>◆</span>
              <span>read me my mail</span><span>◆</span>
              <span>translate this</span><span>◆</span>
              <span>identify what I'm holding</span><span>◆</span>
              <span>summarize the meeting</span><span>◆</span>
              <span>call mama at 7</span><span>◆</span>
              <span>where did I park</span><span>◆</span>
              <span>what's halal nearby</span><span>◆</span>
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
            { n: "i.", t: "Press once.", d: "The orb wakes up. No wake-word gymnastics, no \"are you there?\". Just press." },
            { n: "ii.", t: "Speak however.", d: "Darija, english, french, code-switch mid-sentence. Jarvis follows. Pause as long as you need." },
            { n: "iii.", t: "Show, don't tell.", d: "Pop the camera if it's easier. Point at a recipe, a receipt, a bug on screen — it sees what you see." },
          ].map((s) => (
            <article key={s.n} className="ln-step">
              <div className="ln-step-n">{s.n}</div>
              <h3 className="ln-step-t">{s.t}</h3>
              <p className="ln-step-d">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ln-features">
        <div className="ln-feature ln-feature-big">
          <div className="ln-feature-eyebrow">Trust</div>
          <h3 className="ln-feature-h">Your memory, not ours.</h3>
          <p className="ln-feature-p">
            Every fact Jarvis stores is visible, editable, deletable. We never train on what you say.
            On-device wake-word, end-to-end encrypted transport, and a memory drawer that's actually readable.
          </p>
          <ul className="ln-feature-list">
            <li>· On-device wake word</li>
            <li>· E2EE transport (libsignal)</li>
            <li>· Per-fact retention rules</li>
            <li>· No training on user data</li>
          </ul>
        </div>
        <div className="ln-feature-stack">
          <div className="ln-feature">
            <div className="ln-feature-eyebrow">Voice</div>
            <h3 className="ln-feature-h">Sounds like a friend, not a kiosk.</h3>
            <p className="ln-feature-p">Six voice characters tuned for moroccan ears. Olive is the default — warm, slow, a little dry.</p>
          </div>
          <div className="ln-feature">
            <div className="ln-feature-eyebrow">Eyes</div>
            <h3 className="ln-feature-h">Bring the camera into the conversation.</h3>
            <p className="ln-feature-p">Frame a scene, Jarvis describes it back. Useful for recipes, receipts, repair work, and accessibility.</p>
          </div>
        </div>
      </section>

      <section className="ln-quote">
        <div className="ln-quote-mark">"</div>
        <p>
          Jarvis is the first assistant that doesn't <em>perform</em> being smart.
          You speak. It thinks. It comes back. That's it.
        </p>
        <footer>
          <span className="ln-quote-name">Salma El Idrissi</span>
          <span className="ln-quote-role">design lead · Outlierz Ventures</span>
        </footer>
      </section>

      <section className="ln-footer-cta">
        <h2 className="ln-h2">Ready when you are.</h2>
        <p>Open Jarvis in your browser. No install, no signup gate — sign in when you want to keep your memory.</p>
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
          <span>© 2026 JarvisLfla7 · Casablanca · Made for humans, halalified for the rest.</span>
        </div>
        <div className="ln-foot-r">
          <a>Privacy</a><a>Memory policy</a><a>Status</a><a>Careers</a>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return <LandingScreen />;
}
