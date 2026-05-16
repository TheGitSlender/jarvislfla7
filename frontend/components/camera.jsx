import React from "react";

function CameraView({ onClose }) {
  const tRef = React.useRef(0);
  const [, force] = React.useState(0);
  const [shutter, setShutter] = React.useState(false);
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
  const recBlink = Math.sin(t * 4) > 0;
  const capture = () => {
    setShutter(true);
    setTimeout(() => setShutter(false), 240);
  };
  return (
    <div className="cam-root">
      <div className="cam-feed">
        <div className="cam-bg" />
        <div className="cam-noise" />
        <svg viewBox="0 0 800 600" className="cam-scene" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="cam-light" cx="55%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#FEFAE0" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#FEFAE0" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FEFAE0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" fill="url(#cam-light)" />
          <rect y="380" width="800" height="220" fill="#1d2812" opacity="0.55" />
          <g transform={`translate(120 ${380 + Math.sin(t * 0.8) * 2})`}>
            <rect x="-26" y="0" width="52" height="60" fill="#3b4a22" rx="3" />
            <path d="M 0 0 C -40 -40 -60 -90 -30 -130 C -10 -100 -8 -50 0 0 Z" fill="#5f6e34" opacity="0.85" />
            <path d="M 0 0 C 40 -50 50 -100 20 -140 C 8 -100 4 -50 0 0 Z" fill="#4a5828" opacity="0.85" />
            <path d="M 0 0 C 0 -60 30 -110 60 -120 C 50 -70 30 -30 0 0 Z" fill="#6f7f44" opacity="0.85" />
          </g>
          <g transform="translate(640 360)">
            <rect x="-30" y="20" width="60" height="14" fill="#283618" rx="2" />
            <rect x="-2" y="-110" width="4" height="130" fill="#283618" />
            <path d="M -30 -120 L 30 -120 L 18 -150 L -18 -150 Z" fill="#606C38" />
            <circle cx="0" cy="-130" r="14" fill="#FEFAE0" opacity="0.7" />
          </g>
          <g opacity="0.18">
            <rect x="0" y={50 + Math.sin(t * 0.3) * 6} width="800" height="40" fill="#FEFAE0" />
            <rect x="0" y={120 + Math.cos(t * 0.4) * 6} width="800" height="14" fill="#FEFAE0" />
          </g>
        </svg>
        <div className="cam-vignette" />
        <div className="cam-grid">
          <div className="cam-grid-v" /><div className="cam-grid-v" />
          <div className="cam-grid-h" /><div className="cam-grid-h" />
        </div>
        <span className="cam-corner cam-tl" />
        <span className="cam-corner cam-tr" />
        <span className="cam-corner cam-bl" />
        <span className="cam-corner cam-br" />
        <div className="cam-hud-top">
          <div className="cam-rec" style={{ opacity: recBlink ? 1 : 0.3 }}>
            <span className="cam-rec-dot" /> LIVE · 1080p
          </div>
          <div className="cam-hud-meta">
            <span>f/1.8</span><span>·</span><span>ISO 320</span><span>·</span><span>1/60</span>
          </div>
        </div>
        <div className="cam-hud-bottom">
          <div className="cam-hud-label">JarvisLfla7 is watching the scene</div>
          <div className="cam-hud-coords">
            <span>34.020°N</span><span>·</span><span>-6.841°W</span><span>·</span><span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="cam-focus" style={{
          left: `${48 + Math.sin(t * 0.7) * 6}%`,
          top: `${52 + Math.cos(t * 0.5) * 4}%`,
        }} />
        <div className="cam-shutter" style={{ opacity: shutter ? 1 : 0 }} />
      </div>
      <div className="cam-actions">
        <button className="cam-btn cam-btn-ghost" onClick={onClose}>Close</button>
        <button className="cam-shutter-btn" onClick={capture} aria-label="capture">
          <span /></button>
        <button className="cam-btn cam-btn-ghost" onClick={onClose}>Send to Jarvis</button>
      </div>
    </div>
  );
}

export default CameraView;
