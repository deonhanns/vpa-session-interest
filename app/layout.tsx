import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "IFVP Summit 2026 - Return to Africa",
  description: "Sessions, speakers and registration for the IFVP International Summit 2026 in Cape Town",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} text-gray-900 antialiased`}>
        {/* Full-screen overlay background */}
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,26,26,0.85)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflowY: "auto",
          padding: "24px 16px",
        }}>
          {/* Modal card */}
          <div style={{
            background: "#F5F0EB",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "672px",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            marginTop: "24px",
            marginBottom: "24px",
          }}>
            {/* Close button — top right */}
            <a
              href="https://www.visualpractitionersafrica.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "none",
                background: "#1A1A1A",
                color: "#E07B39",
                fontSize: "16px",
                fontWeight: "700",
                textDecoration: "none",
                cursor: "pointer",
                zIndex: 10,
                lineHeight: 1,
              }}
              aria-label="Close and return to VPA"
            >
              ✕
            </a>

            {/* Back to VPA link — top left */}
            <div style={{ padding: "16px 20px 0" }}>
              <a
                href="https://www.visualpractitionersafrica.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#E07B39",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ← Back to VPA
              </a>
            </div>

            {/* Page content */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
