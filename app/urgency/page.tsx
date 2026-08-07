"use client";

import UrgencyBanner, { PRICE_TIERS, getTierInfo } from "@/components/UrgencyBanner";
import { useState, useEffect } from "react";

const STRIPE_URL = "https://book.stripe.com/14AaEZ6ZE6N88ql1eJ5Rm02";

export default function UrgencyPage() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "0",
      background: "transparent",
    }}>
      {/* Single unified card — fills full width */}
      <div style={{
        background: "#1A1A1A",
        borderRadius: "0",
        padding: "24px 24px",
        width: "100%",
        color: "white",
        fontFamily: "inherit",
      }}>
        {/* Urgency banner — embedded (no outer wrapper) */}
        <UrgencyBanner variant="standalone" embedded />

        {/* Separator */}
        <div style={{ borderTop: "1px solid #333", margin: "16px 0" }} />

        {/* Flat price callout */}
        <div style={{
          background: "rgba(224,123,57,0.12)",
          border: "2px solid #E07B39",
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center",
        }}>
          <span style={{ fontSize: "28px", fontWeight: "700", color: "#E07B39" }}>$550</span>
          <p style={{ fontSize: "12px", color: "#F5F0EB", margin: "6px 0 0 0" }}>
            Summit Ticket · Full Access · Single Price
          </p>
        </div>

        <p style={{
          fontSize: "11px",
          color: "#777",
          textAlign: "center",
          margin: "14px 0 0 0",
          lineHeight: 1.5,
        }}>
          💡 One price. All sessions. Secure your spot before we sell out.
        </p>
      </div>
    </div>
  );
}
