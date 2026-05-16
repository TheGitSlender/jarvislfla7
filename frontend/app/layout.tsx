import type { Metadata } from "next";
import { instrumentSerif, geist, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "JarvisLfla7 — مستشارك الزراعي",
  description: "Voice-first AI agronomist for Moroccan farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  );
}
