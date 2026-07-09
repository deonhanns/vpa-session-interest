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
      <body className={`${roboto.className} text-gray-900 antialiased`} style={{background:"#F5F0EB"}}>
        {children}
      </body>
    </html>
  );
}
