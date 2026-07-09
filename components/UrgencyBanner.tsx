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

export const PRICE_TIERS: { until: Date; label: string; price: number }[] = [
  { until: new Date("2026-08-01T00:00:00"), label: "Early Bird", price: 550 },
  { until: new Date("2026-09-01T00:00:00"), label: "Standard", price: 700 },
  { until: new Date("2026-10-01T00:00:00"), label: "Late", price: 850 },
  { until: new Date("2026-10-10T00:00:00"), label: "Last Minute", price: 1100 },
];

export function getTierInfo(now: Date): TierInfo {
  for (let i = 0; i < PRICE_TIERS.length; i++) {
    if (now < PRICE_TIERS[i].until) {
      return {
        current: { label: PRICE_TIERS[i].label, price: PRICE_TIERS[i].price },
        next: i + 1 < PRICE_TIERS.length ? { label: PRICE_TIERS[i + 1].label, price: PRICE_TIERS[i + 1].price } : null,
        deadline: PRICE_TIERS[i].until,
      };
    }
  }
  // Past all tiers — show highest price, no countdown
  const last = PRICE_TIERS[PRICE_TIERS.length - 1];
  return {
    current: { label: last.label, price: last.price },
    next: null,
    deadline: null,
  };
}

function formatCountdown(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff <= 0) return "";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
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
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const info = getTierInfo(now);
      setTierInfo(info);
      if (info.deadline) {
        setCountdown(formatCountdown(info.deadline));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isStandalone = variant === "standalone";
  const hasCountdown = tierInfo.deadline !== null;

  const inner = (
    <>
      {/* Headline */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span style={{ fontSize: "14px" }}>⏰</span>
        <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.01em", color: embedded ? "#F5F0EB" : "#F5F0EB" }}>
          Time is running out! Get your ticket
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

        {/* Countdown */}
        {hasCountdown ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            flex: 1,
            minWidth: "180px",
          }}>
            <div style={{
              background: "rgba(224,123,57,0.1)",
              border: "1px solid rgba(224,123,57,0.25)",
              borderRadius: "8px",
              padding: "10px 12px",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: isStandalone ? "20px" : "16px",
                fontWeight: "700",
                color: "#E07B39",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.02em",
              }}>
                {countdown}
              </div>
            </div>
            {tierInfo.next && (
              <p style={{
                fontSize: "11px",
                color: "#999",
                margin: 0,
                textAlign: "center",
              }}>
                Price increases to <strong style={{ color: "#E07B39" }}>${tierInfo.next.price}</strong> on {formatDeadlineDate(tierInfo.deadline!)}
              </p>
            )}
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>
            Final price. Secure your spot before we sell out.
          </p>
        )}
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
