"use client";

import { useEffect, useState } from "react";

type Props = {
  message: string;
  sub?: string;
  onDone: () => void;
};

export default function Toast({ message, sub, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Slide out after 3.5s
    const hideTimer = setTimeout(() => setVisible(false), 3500);
    // Remove from DOM after animation
    const doneTimer = setTimeout(() => onDone(), 4200);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "100px"})`,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        opacity: visible ? 1 : 0,
        zIndex: 9999,
        minWidth: "280px",
        maxWidth: "90vw",
      }}
    >
      <div
        style={{
          background: "#1A1A1A",
          borderRadius: "12px",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Checkmark circle */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#E07B39",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, color: "#ffffff", fontSize: "14px", fontWeight: 700, fontFamily: "Roboto, Arial, sans-serif" }}>
            {message}
          </p>
          {sub && (
            <p style={{ margin: "2px 0 0", color: "#999999", fontSize: "12px", fontFamily: "Roboto, Arial, sans-serif" }}>
              {sub}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
