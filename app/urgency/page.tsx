"use client";

import UrgencyBanner, { PRICE_TIERS, getTierInfo } from "@/components/UrgencyBanner";
import { useState, useEffect } from "react";

const STRIPE_URL = "https://book.stripe.com/14AaEZ6ZE6N88ql1eJ5Rm02";

const TIER_MONTHS = ["Jul", "Aug", "Sep", "Oct"];

export default function UrgencyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const info = getTierInfo(new Date());
    const idx = PRICE_TIERS.findIndex(t => t.price === info.current.price);
    setCurrentIndex(idx >= 0 ? idx : 0);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px 16px",
      background: "transparent",
      gap: "16px",
    }}>
      <UrgencyBanner variant="standalone" />

      {/* Tier cards */}
      <div style={{
        background: "#1A1A1A",
        borderRadius: "12px",
        padding: "20px 16px",
        maxWidth: "600px",
        width: "100%",
      }}>
        <p style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#999",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          textAlign: "center",
          margin: "0 0 14px 0",
        }}>
          Price Progression
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
        }}>
          {PRICE_TIERS.map((tier, i) => {
            const isCurrent = i === currentIndex;
            const isPast = i < currentIndex;
            const month = TIER_MONTHS[i] ?? "";
            return (
              <div
                key={tier.price}
                style={{
                  background: isCurrent ? "rgba(224,123,57,0.12)" : "rgba(255,255,255,0.04)",
                  border: isCurrent ? "2px solid #E07B39" : "1px solid #333",
                  borderRadius: "10px",
                  padding: "12px 8px",
                  textAlign: "center",
                  opacity: isPast ? 0.4 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: isCurrent ? "#E07B39" : "#666",
                }}>
                  ${tier.price}
                </span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: isCurrent ? "#F5F0EB" : "#777",
                }}>
                  {tier.label}
                </span>
                <span style={{
                  fontSize: "9px",
                  color: "#555",
                  fontWeight: "600",
                }}>
                  {month}
                </span>
                {isCurrent && (
                  <span style={{
                    fontSize: "8px",
                    fontWeight: "700",
                    color: "#E07B39",
                    background: "rgba(224,123,57,0.15)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    marginTop: "2px",
                  }}>
                    NOW
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p style={{
          fontSize: "11px",
          color: "#777",
          textAlign: "center",
          margin: "14px 0 0 0",
          lineHeight: 1.5,
        }}>
          💡 Lock in the current price before it increases. All tickets include full summit access.
        </p>
      </div>
    </div>
  );
}
