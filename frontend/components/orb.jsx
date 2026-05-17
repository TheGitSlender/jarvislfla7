"use client";
import { Orb as ReactAiOrb, goldenGlowPreset } from "react-ai-orb";

export default function Orb({ variant, level = 0, listening = false, intensity = 1, size = 360 }) {
  const orbSize = Math.max(0.5, size / 82);

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <ReactAiOrb
        palette={goldenGlowPreset.palette}
        size={orbSize}
        animationSpeedBase={listening ? 0.5 + level * 2.0 * intensity : 0.2}
        animationSpeedHue={listening ? 0.3 + level * 0.8 * intensity : 0.1}
        blobAOpacity={listening ? 0.2 + level * 0.6 * intensity : 0.05}
        blobBOpacity={listening ? Math.min(0.3 + level * 0.7 * intensity, 1) : 0.08}
        noShadow={!listening}
        mainOrbHueAnimation={listening}
        hueRotation={0}
      />
    </div>
  );
}
