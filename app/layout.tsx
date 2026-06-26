import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFVP Summit 2026 — Session Interest",
  description: "Express your interest in sessions at the IFVP Cape Town Summit 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
