"use client";
import React from "react";

const ORB_COLORS = {
  forest: "#283618",
  olive: "#606C38",
  oliveBright: "#7C8B45",
  cornsilk: "#FEFAE0",
  cream: "#F5EFD3",
  mint: "#A7B47A",
};

function OrbBloom({ level, listening, intensity, size }) {
  const ref = React.useRef(null);
  const seedRef = React.useRef(Math.random() * 100);
  const tRef = React.useRef(0);
  React.useEffect(() => {
    let raf;
    const loop = () => {
      tRef.current += 0.016;
      const t = tRef.current;
      const node = ref.current;
      if (node) {
        const turb = node.querySelector("feTurbulence");
        const disp = node.querySelector("feDisplacementMap");
        const breath = (Math.sin(t * 0.9) + 1) / 2;
        const baseFreq = 0.012 + breath * 0.008 + level * 0.02 * intensity;
        if (turb) {
          turb.setAttribute("baseFrequency", baseFreq.toFixed(4));
          turb.setAttribute("seed", String(Math.floor(seedRef.current + t * 4)));
        }
        if (disp) {
          const scale = 18 + level * 60 * intensity + breath * 6;
          disp.setAttribute("scale", scale.toFixed(2));
        }
        const blob = node.querySelector(".orb-bloom-blob");
        if (blob) {
          const s = 1 + level * 0.18 * intensity + breath * 0.03;
          const rot = t * 12;
          blob.setAttribute("transform", `rotate(${rot} 200 200) scale(${s})`);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [level, intensity]);

  const filterId = React.useId();
  const gradId = filterId + "-g";
  const highlightId = filterId + "-h";
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 400 400" style={{ display: "block" }}>
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="20" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <radialGradient id={gradId} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor={ORB_COLORS.cream} stopOpacity="1" />
          <stop offset="22%" stopColor={ORB_COLORS.mint} />
          <stop offset="55%" stopColor={ORB_COLORS.olive} />
          <stop offset="100%" stopColor={ORB_COLORS.forest} />
        </radialGradient>
        <radialGradient id={highlightId} cx="32%" cy="26%" r="30%">
          <stop offset="0%" stopColor={ORB_COLORS.cornsilk} stopOpacity="0.95" />
          <stop offset="100%" stopColor={ORB_COLORS.cornsilk} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="orb-bloom-blob" style={{ transformOrigin: "200px 200px" }}>
        <g filter={`url(#${filterId})`}>
          <circle cx="200" cy="200" r="140" fill={`url(#${gradId})`} />
          <ellipse cx="160" cy="150" rx="60" ry="40" fill={`url(#${highlightId})`} />
          <ellipse cx="240" cy="260" rx="50" ry="30" fill={ORB_COLORS.forest} opacity="0.35" />
        </g>
      </g>
    </svg>
  );
}

function OrbPetals({ level, listening, intensity, size }) {
  const tRef = React.useRef(0);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const loop = () => {
      tRef.current += 0.016;
      setTick((x) => x + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const t = tRef.current;
  const lobes = 6;
  const baseR = size * 0.34;
  const lift = level * intensity * size * 0.08;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${ORB_COLORS.olive}28 0%, transparent 55%)`,
        transform: `scale(${1 + level * 0.25 * intensity})`,
        transition: "transform 80ms linear",
      }} />
      {Array.from({ length: lobes }).map((_, i) => {
        const a = (i / lobes) * Math.PI * 2 + t * 0.4;
        const r = baseR * (0.55 + Math.sin(t * 1.3 + i) * 0.1) + lift;
        const x = size / 2 + Math.cos(a) * (size * 0.08 + level * size * 0.06 * intensity);
        const y = size / 2 + Math.sin(a) * (size * 0.08 + level * size * 0.06 * intensity);
        const hue = i % 2 === 0 ? ORB_COLORS.olive : ORB_COLORS.forest;
        return (
          <div key={i} style={{
            position: "absolute",
            left: x - r, top: y - r, width: r * 2, height: r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, ${ORB_COLORS.cream}cc 0%, ${hue} 55%, ${ORB_COLORS.forest} 100%)`,
            mixBlendMode: "multiply",
            filter: "blur(2px)",
            opacity: 0.85,
          }} />
        );
      })}
      <div style={{
        position: "absolute",
        left: size * 0.5 - size * 0.22, top: size * 0.5 - size * 0.22,
        width: size * 0.44, height: size * 0.44,
        borderRadius: "50%",
        background: `radial-gradient(circle at 38% 30%, ${ORB_COLORS.cornsilk} 0%, ${ORB_COLORS.mint} 38%, ${ORB_COLORS.olive} 70%, ${ORB_COLORS.forest} 100%)`,
        boxShadow: `inset -10px -14px 30px ${ORB_COLORS.forest}66, 0 10px 40px ${ORB_COLORS.olive}55`,
        transform: `scale(${1 + level * 0.18 * intensity})`,
      }} />
      <div style={{
        position: "absolute",
        left: size * 0.36, top: size * 0.32,
        width: size * 0.14, height: size * 0.08,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${ORB_COLORS.cornsilk} 0%, transparent 70%)`,
        opacity: 0.85,
      }} />
    </div>
  );
}

function OrbMesh({ level, listening, intensity, size }) {
  const ref = React.useRef(null);
  const tRef = React.useRef(0);
  const pointsRef = React.useRef(null);

  React.useEffect(() => {
    const N = 380;
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, n: Math.random() });
    }
    pointsRef.current = pts;
  }, []);

  React.useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = size * dpr;
    c.height = size * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    let raf;
    const loop = () => {
      tRef.current += 0.016;
      const t = tRef.current;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const baseR = size * 0.34;
      const pts = pointsRef.current || [];
      const cosY = Math.cos(t * 0.25);
      const sinY = Math.sin(t * 0.25);
      const cosX = Math.cos(t * 0.17);
      const sinX = Math.sin(t * 0.17);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.5);
      g.addColorStop(0, `${ORB_COLORS.olive}33`);
      g.addColorStop(1, `${ORB_COLORS.olive}00`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      const wobble = 1 + level * 0.22 * intensity;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        let y = p.y;
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y2; z = z2;
        const noise = Math.sin(t * 2 + p.n * 7) * 0.08 + Math.cos(t * 3 + p.n * 13) * 0.05;
        const r = baseR * wobble * (1 + noise * (0.4 + level * 0.6 * intensity));
        const px = cx + x * r;
        const py = cy + y * r;
        const depth = (z + 1) / 2;
        const sz = 0.6 + depth * 2.4;
        const alpha = 0.18 + depth * 0.82;
        const back = depth < 0.5;
        const color = back ? ORB_COLORS.forest : ORB_COLORS.olive;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = depth > 0.85 ? ORB_COLORS.mint : color;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      const cg = ctx.createRadialGradient(cx - baseR * 0.15, cy - baseR * 0.2, 0, cx, cy, baseR * 0.9);
      cg.addColorStop(0, `${ORB_COLORS.cornsilk}55`);
      cg.addColorStop(0.5, `${ORB_COLORS.olive}22`);
      cg.addColorStop(1, `${ORB_COLORS.forest}00`);
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * wobble, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [size, level, intensity]);

  return <canvas ref={ref} style={{ width: size, height: size, display: "block" }} />;
}

function OrbRibbon({ level, listening, intensity, size }) {
  const tRef = React.useRef(0);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const loop = () => {
      tRef.current += 0.016;
      force((x) => x + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const t = tRef.current;
  const points = 14;
  const baseR = 130;
  const pathFor = (offset, ampMul) => {
    const pts = [];
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const w1 = Math.sin(a * 3 + t * 1.5 + offset) * (10 + level * 30 * intensity * ampMul);
      const w2 = Math.cos(a * 5 - t * 1.1 + offset * 1.7) * (6 + level * 18 * intensity * ampMul);
      const r = baseR + w1 + w2;
      pts.push([200 + Math.cos(a) * r, 200 + Math.sin(a) * r]);
    }
    return smoothClosed(pts);
  };
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ display: "block" }}>
      <defs>
        <radialGradient id="orb-ribbon-core" cx="40%" cy="34%" r="70%">
          <stop offset="0%" stopColor={ORB_COLORS.cornsilk} />
          <stop offset="35%" stopColor={ORB_COLORS.mint} />
          <stop offset="70%" stopColor={ORB_COLORS.olive} />
          <stop offset="100%" stopColor={ORB_COLORS.forest} />
        </radialGradient>
        <filter id="orb-ribbon-blur"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <circle cx="200" cy="200" r={baseR * (1.25 + level * 0.2)} fill={`${ORB_COLORS.olive}1e`} />
      <path d={pathFor(0, 1.3)} fill="none" stroke={ORB_COLORS.olive} strokeOpacity="0.45" strokeWidth="1.4" filter="url(#orb-ribbon-blur)" />
      <path d={pathFor(1.4, 1.1)} fill="none" stroke={ORB_COLORS.forest} strokeOpacity="0.55" strokeWidth="1.2" />
      <path d={pathFor(2.9, 0.9)} fill="none" stroke={ORB_COLORS.mint} strokeOpacity="0.55" strokeWidth="1.1" />
      <circle cx="200" cy="200" r={86 + level * 14 * intensity} fill="url(#orb-ribbon-core)"
              style={{ filter: `drop-shadow(0 18px 40px ${ORB_COLORS.olive}55)` }} />
      <ellipse cx="172" cy="168" rx="22" ry="14" fill={ORB_COLORS.cornsilk} opacity="0.6" />
    </svg>
  );
}

function smoothClosed(pts) {
  const n = pts.length;
  let d = `M ${pts[0][0]} ${pts[0][1]} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d + "Z";
}

function Orb({ variant = "bloom", level = 0, listening = false, intensity = 1, size = 360 }) {
  const orbitRef = React.useRef(null);
  const stateRef = React.useRef({ t: 0 });
  const levelRef = React.useRef(level);
  const listeningRef = React.useRef(listening);
  const intensityRef = React.useRef(intensity);
  levelRef.current = level;
  listeningRef.current = listening;
  intensityRef.current = intensity;

  React.useEffect(() => {
    let raf;
    const loop = () => {
      stateRef.current.t += 0.016;
      const t = stateRef.current.t;
      const node = orbitRef.current;
      if (node) {
        const lvl = levelRef.current;
        const lst = listeningRef.current;
        const int = intensityRef.current;
        const driftX = Math.sin(t * 0.55) * (8 + (lst ? 22 : 0) + lvl * 26 * int);
        const driftY = Math.cos(t * 0.4) * (6 + (lst ? 16 : 0) + lvl * 20 * int);
        const rotate = Math.sin(t * 0.3) * 4;
        node.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${rotate}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const Comp = { bloom: OrbBloom, petals: OrbPetals, mesh: OrbMesh, ribbon: OrbRibbon }[variant] || OrbBloom;
  return (
    <div ref={orbitRef} style={{
      width: size, height: size, position: "relative",
      transition: "transform 60ms linear",
      filter: listening ? `drop-shadow(0 30px 60px ${ORB_COLORS.olive}55)` : `drop-shadow(0 20px 40px ${ORB_COLORS.forest}33)`,
    }}>
      <Comp level={level} listening={listening} intensity={intensity} size={size} />
    </div>
  );
}

export default Orb;
export { ORB_COLORS };
