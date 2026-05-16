import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JarvisLfla7 — مستشارك الزراعي",
  description: "Voice-first AI agronomist for Moroccan farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
