"use client";
import React from "react";

function useAudioLevel() {
  const [level, setLevel] = React.useState(0);
  const [bands, setBands] = React.useState([0, 0, 0]);
  const [active, setActive] = React.useState(false);
  const [source, setSource] = React.useState("idle");

  const rafRef = React.useRef(0);
  const ctxRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const dataRef = React.useRef(null);
  const tRef = React.useRef(0);

  const tick = React.useCallback(() => {
    if (analyserRef.current && dataRef.current) {
      analyserRef.current.getByteFrequencyData(dataRef.current);
      const data = dataRef.current;
      const n = data.length;
      const lo = avg(data, 0, Math.floor(n * 0.15));
      const mid = avg(data, Math.floor(n * 0.15), Math.floor(n * 0.5));
      const hi = avg(data, Math.floor(n * 0.5), n);
      const total = (lo + mid + hi) / 3 / 255;
      setLevel((prev) => prev * 0.6 + total * 0.4);
      setBands([lo / 255, mid / 255, hi / 255]);
    } else {
      tRef.current += 0.016;
      const t = tRef.current;
      const breath = (Math.sin(t * 1.6) + 1) / 2;
      const burst = Math.max(0, Math.sin(t * 5.7) * Math.sin(t * 2.3));
      const noise = Math.random() * 0.15;
      const sim = clamp(breath * 0.35 + burst * 0.5 + noise, 0, 1);
      setLevel((prev) => prev * 0.5 + sim * 0.5);
      setBands([
        clamp(Math.sin(t * 2.1) * 0.5 + 0.5, 0, 1) * sim,
        clamp(Math.sin(t * 3.3 + 1) * 0.5 + 0.5, 0, 1) * sim,
        clamp(Math.sin(t * 5.1 + 2) * 0.5 + 0.5, 0, 1) * sim,
      ]);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = React.useCallback(async () => {
    if (active) return;
    setActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.7;
      src.connect(an);
      analyserRef.current = an;
      dataRef.current = new Uint8Array(an.frequencyBinCount);
      setSource("mic");
    } catch (e) {
      analyserRef.current = null;
      dataRef.current = null;
      setSource("sim");
    }
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [active, tick]);

  const stop = React.useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (ctxRef.current) {
      try { ctxRef.current.close(); } catch (e) {}
      ctxRef.current = null;
    }
    analyserRef.current = null;
    dataRef.current = null;
    setActive(false);
    setSource("idle");
    setLevel(0);
    setBands([0, 0, 0]);
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  return { level, bands, active, start, stop, source };
}

function avg(arr, a, b) {
  let s = 0;
  for (let i = a; i < b; i++) s += arr[i];
  return s / Math.max(1, b - a);
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

export default useAudioLevel;
