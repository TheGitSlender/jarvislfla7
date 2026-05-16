import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const geist = localFont({
  src: [
    { path: "../public/fonts/geist-300.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/geist-400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/geist-500.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/geist-600.ttf", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-sans",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});
