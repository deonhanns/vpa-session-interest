"use client";

import { useState } from "react";
import type { Session } from "@/lib/sessions";
import { trackConfig } from "@/lib/sessions";

type Props = {
  session: Session;
  onClose: () => void;
  onSuccess: () => void;
};

export default function InterestModal({ session, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

      if (json.already) {
        onSuccess();
        return;
      }

      if (!res.ok || json.error) {
        setError("Something went wrong. Please try again.");
        return;
      }

      onSuccess();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        {/* Modal header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-2 ${track.bg} ${track.text} ${track.border}`}>
              {track.label}
            </span>
            <h2 className="text-base font-bold text-gray-900 leading-tight">{session.title}</h2>
            {session.presenter && (
              <p className="text-sm text-stone-500 mt-1">{session.presenter}</p>
            )}
            <p className="text-xs text-stone-400 mt-0.5">{session.day} · {session.time}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl leading-none flex-shrink-0"
          >×</button>
        </div>

        <p className="text-sm text-stone-600 mb-4">
          Enter your details and we'll note your interest. You'll receive a confirmation email — and a nudge to register if you haven't yet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{"--tw-ring-color": "#E07B39"} as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-stone-300 text-stone-600 rounded-lg py-2 text-sm font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{background:"#E07B39"}}
            >
              {loading ? "Saving…" : "I'm interested →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
