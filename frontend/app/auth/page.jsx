"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Orb from "@/components/orb";

function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = React.useState("signin");
  return (
    <div className="screen-auth">
      <div className="bg-grain" />
      <div className="bg-wash" />
      <div className="auth-shell">
        <aside className="auth-side">
          <button className="brand" onClick={() => router.push("/")}>
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#FEFAE0" /><circle cx="12" cy="12" r="5.5" fill="#283618" /></svg>
            </span>
            <span className="brand-name">JarvisLfla7</span>
          </button>
          <div className="auth-orb">
            <Orb variant="bloom" level={0.18} listening={false} intensity={1} size={300} />
          </div>
          <blockquote className="auth-quote">
            <p>&ldquo;It&apos;s the first assistant that lets me speak in darija without auto-correcting my <em>identity</em>.&rdquo;</p>
            <footer>— Kenza, alpha tester</footer>
          </blockquote>
          <div className="auth-foot">
            <span>01 / 03</span>
            <span>Calm. Bilingual. Yours.</span>
          </div>
        </aside>
        <main className="auth-main">
          <div className="auth-switch">
            <button className={mode === "signin" ? "is-on" : ""} onClick={() => setMode("signin")}>Sign in</button>
            <button className={mode === "signup" ? "is-on" : ""} onClick={() => setMode("signup")}>Create account</button>
          </div>
          <h1 className="auth-h1">
            {mode === "signin" ? <>Welcome back.</> : <>Make Jarvis <em>yours</em>.</>}
          </h1>
          <p className="auth-sub">
            {mode === "signin" ? "Sign in to restore your memory and voice settings." : "A few details so Jarvis can call you by name and remember what matters."}
          </p>

          <div className="auth-providers">
            <button className="auth-prov"><span className="auth-prov-dot" style={{ background: "#283618" }} />Continue with Apple</button>
            <button className="auth-prov"><span className="auth-prov-dot" style={{ background: "#606C38" }} />Continue with Google</button>
            <button className="auth-prov"><span className="auth-prov-dot" style={{ background: "#7C8B45" }} />Continue with phone (SMS)</button>
          </div>
          <div className="auth-or"><span /> or with email <span /></div>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); }}>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Your name</span>
                <input type="text" placeholder="Yassir Bensouda" />
              </label>
            )}
            <label className="auth-field">
              <span>Email</span>
              <input type="email" placeholder="you@jarvislfla7.ma" />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" placeholder="••••••••" />
            </label>
            {mode === "signup" && (
              <label className="auth-check">
                <input type="checkbox" defaultChecked />
                <span>I&apos;d like Jarvis to remember things across sessions. I can clear memory anytime.</span>
              </label>
            )}
            <button className="btn-primary btn-lg auth-submit" type="submit">
              {mode === "signin" ? "Sign in" : "Create account"} →
            </button>
            {mode === "signin" && <a className="auth-forgot">Forgot your password?</a>}
          </form>

          <div className="auth-legal">
            By continuing you agree to the <a>terms</a> and <a>memory policy</a>. Made in Casablanca with care.
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return <AuthScreen />;
}
