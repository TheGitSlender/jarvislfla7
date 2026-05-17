"use client";
import { Orb as ReactAiOrb } from "react-ai-orb";

const brandPalette = {
  mainBgStart: "#606C38",
  mainBgEnd: "#283618",
  shadowColor1: "rgba(40, 54, 24, 0)",
  shadowColor2: "rgba(40, 54, 24, 0.5)",
  shadowColor3: "rgba(254, 250, 224, 0.8)",
  shadowColor4: "#A7B47A",
  shapeAStart: "#FEFAE0",
  shapeAEnd: "rgba(96, 108, 56, 0)",
  shapeBStart: "#F5EFD3",
  shapeBMiddle: "#7C8B45",
  shapeBEnd: "rgba(40, 54, 24, 0)",
  shapeCStart: "rgba(254, 250, 224, 0)",
  shapeCMiddle: "rgba(167, 180, 122, 0.5)",
  shapeCEnd: "#7C8B45",
  shapeDStart: "rgba(254, 250, 224, 0)",
  shapeDMiddle: "rgba(96, 108, 56, 0.5)",
  shapeDEnd: "#283618",
};

export default function Orb({ variant, level = 0, listening = false, intensity = 1, size = 360 }) {
  const orbSize = Math.max(0.5, size / 82);

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <ReactAiOrb
        palette={brandPalette}
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
