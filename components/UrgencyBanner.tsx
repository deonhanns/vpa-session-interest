"use client";

import { useState, useEffect } from "react";

type PriceTier = {
  label: string;
  price: number;
};

type TierInfo = {
  current: PriceTier;
  next: PriceTier | null;
  deadline: Date | null;
};

const STRIPE_URL = "https://book.stripe.com/14AaEZ6ZE6N88ql1eJ5Rm02";
const VPA_URL = "https://www.visualpractitionersafrica.com";

// Single flat price — no incremental tiers
export const PRICE_TIERS: { until: Date; label: string; price: number }[] = [
  { until: new Date("2026-10-10T00:00:00"), label: "Summit Ticket", price: 550 },
];

export function getTierInfo(now: Date): TierInfo {
  for (let i = 0; i < PRICE_TIERS.length; i++) {
    if (now < PRICE_TIERS[i].until) {
      return {
        current: { label: PRICE_TIERS[i].label, price: PRICE_TIERS[i].price },
        next: null,
        deadline: null,
      };
    }
  }
  const last = PRICE_TIERS[PRICE_TIERS.length - 1];
  return {
    current: { label: last.label, price: last.price },
    next: null,
    deadline: null,
  };
}

function formatDeadlineDate(d: Date): string {
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

type Props = {
  variant: "inline" | "standalone";
  embedded?: boolean;
};

export default function UrgencyBanner({ variant, embedded = false }: Props) {
  const [tierInfo, setTierInfo] = useState<TierInfo>(() => getTierInfo(new Date()));

  useEffect(() => {
    const now = new Date();
    const info = getTierInfo(now);
    setTierInfo(info);
  }, []);

  const isStandalone = variant === "standalone";

  const inner = (
    <>
      {/* Headline */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span style={{ fontSize: "14px" }}>🎟️</span>
        <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.01em", color: "#F5F0EB" }}>
          Ticket now only $550!
        </span>
      </div>

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: isStandalone ? "space-between" : "flex-start",
      }}>
        {/* Price + CTA */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "2px",
        }}>
          <span style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "#E07B39",
            lineHeight: 1,
          }}>
            ${tierInfo.current.price}
          </span>
          <span style={{
            fontSize: "11px",
            color: "#999",
            fontWeight: "500",
          }}>
            {tierInfo.current.label}
          </span>
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#E07B39",
              color: "#1A1A1A",
              fontSize: "12px",
              fontWeight: "700",
              textDecoration: "none",
              padding: "6px 16px",
              borderRadius: "8px",
              marginTop: "8px",
              transition: "opacity 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Register Now →
          </a>
        </div>

        {/* No countdown — flat price */}
        <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>
          Secure your spot today. Full summit access included.
        </p>
      </div>
    </>
  );

  if (embedded) {
    return inner;
  }

  return (
    <div
      style={{
        background: "#1A1A1A",
        borderRadius: isStandalone ? "12px" : "12px",
        padding: isStandalone ? "20px 24px" : "16px 16px",
        color: "white",
        fontFamily: "inherit",
        maxWidth: isStandalone ? "600px" : undefined,
        margin: isStandalone ? "0 auto" : undefined,
      }}
    >
      {inner}
    </div>
  );
}
