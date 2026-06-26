import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "IFVP Summit 2026 — Session Interest",
  description: "Express your interest in sessions at the IFVP Cape Town Summit 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-stone-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
