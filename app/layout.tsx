import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        <nav style={{background:"#1A1A1A", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px"}}>
          <a href="https://www.visualpractitionersafrica.com" target="_blank" rel="noopener noreferrer" style={{color:"#E07B39", fontSize:"12px", fontWeight:"600", textDecoration:"none"}}>
            ← Back to VPA
          </a>
          <div style={{display:"flex", gap:"8px"}}>
            <Link href="/" style={{color:"white", fontSize:"12px", fontWeight:"500", textDecoration:"none", padding:"4px 12px", borderRadius:"20px", border:"1px solid #444"}}>
              Sessions
            </Link>
            <Link href="/speakers" style={{color:"white", fontSize:"12px", fontWeight:"500", textDecoration:"none", padding:"4px 12px", borderRadius:"20px", border:"1px solid #444"}}>
              Speakers
            </Link>
            <Link href="/schedule" style={{color:"white", fontSize:"12px", fontWeight:"500", textDecoration:"none", padding:"4px 12px", borderRadius:"20px", border:"1px solid #444"}}>
              Schedule
            </Link>
            <a href="https://book.stripe.com/14AaEZ6ZE6N88ql1eJ5Rm02" target="_blank" rel="noopener noreferrer" style={{color:"#1A1A1A", fontSize:"12px", fontWeight:"700", textDecoration:"none", padding:"4px 12px", borderRadius:"20px", background:"#E07B39"}}>
              Register
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
