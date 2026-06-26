"use client";

import { useState } from "react";
import type { Session } from "@/lib/sessions";
import { trackConfig } from "@/lib/sessions";
import Toast from "./Toast";

type Props = {
  session: Session;
  initialCount: number;
};

export default function SessionCard({ session, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const track = trackConfig[session.track as Exclude<typeof session.track, "break">];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          sessionTitle: session.title,
          sessionDay: session.day,
          sessionTime: session.time,
          sessionTrack: session.track,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const json = await res.json();

      if (json.already || (res.ok && !json.error)) {
        setDone(true);
        setCount((c) => c + 1);
        setExpanded(false);
        setShowToast(true);
        return;
      }

      setError("Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isInteractable =
    session.track !== "social" &&
    session.track !== "plenary" &&
    session.track !== "break";

  return (
    <>
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {track && (
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-2 ${track.bg} ${track.text} ${track.border}`}>
                  {track.label}
                </span>
              )}
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{session.title}</h3>
              {session.presenter && (
                <p className="text-xs text-stone-500 mt-1">{session.presenter}</p>
              )}
            </div>
            <span className="text-xs text-stone-400 whitespace-nowrap flex-shrink-0 mt-0.5">
              {session.time}
            </span>
          </div>

          {isInteractable && (
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-stone-100">
              <span className="text-xs text-stone-400">
                {count > 0
                  ? `${count} ${count === 1 ? "person" : "people"} interested`
                  : "Be the first to express interest"}
              </span>
              {done ? (
                <span
                  className="text-xs font-semibold rounded-full px-3 py-1"
                  style={{ background: "#FEF0E7", color: "#E07B39", border: "1px solid #F4B896" }}
                >
                  ✓ You&apos;re on the list
                </span>
              ) : (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="text-xs font-semibold rounded-full px-3 py-1 transition-opacity hover:opacity-90"
                  style={{ background: "#FEF0E7", color: "#E07B39", border: "1px solid #F4B896" }}
                >
                  {expanded ? "Cancel ✕" : "I'm interested →"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Inline form — expands below card */}
        {expanded && !done && (
          <div
            className="border-t border-stone-100 px-4 pb-4 pt-3"
            style={{ background: "#FEF9F5" }}
          >
            <p className="text-xs text-stone-500 mb-3">
              Enter your details and we&apos;ll send you a confirmation email.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white"
                style={{ "--tw-ring-color": "#E07B39" } as React.CSSProperties}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ background: "#E07B39" }}
              >
                {loading ? "Saving…" : "Confirm interest →"}
              </button>
            </form>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message="You're on the list!"
          sub={
            session.title.length > 40
              ? session.title.slice(0, 40) + "…"
              : session.title
          }
          onDone={() => setShowToast(false)}
        />
      )}
    </>
  );
}
