"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { sessions, days, trackConfig } from "@/lib/sessions";
import type { Session } from "@/lib/sessions";
import Toast from "@/components/Toast";
import { Suspense } from "react";
import UrgencyBanner from "@/components/UrgencyBanner";

type Counts = Record<string, number>;

function BreakRow({ session }: { session: Session }) {
  return (
    <div className="flex items-center gap-3 py-1 px-2">
      <span className="text-xs text-stone-400 whitespace-nowrap w-24 flex-shrink-0">{session.time}</span>
      <div className="flex-1 h-px bg-stone-200" />
      <span className="text-xs text-stone-400 whitespace-nowrap">{session.title}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

function SessionCard({
  session,
  count,
  onSuccess,
  highlight,
}: {
  session: Session;
  count: number;
  onSuccess: (sessionId: string) => void;
  highlight: boolean;
}) {
  const [localCount, setLocalCount] = useState(count);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isInteractable =
    session.track !== "social" &&
    session.track !== "plenary" &&
    session.track !== "keynote" &&
    session.track !== "break";

  const track =
    session.track !== "break"
      ? trackConfig[session.track as Exclude<typeof session.track, "break">]
      : null;

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
        setLocalCount((c) => c + 1);
        setExpanded(false);
        onSuccess(session.id);
        return;
      }

      setError("Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id={session.id}
      className="bg-white rounded-lg border shadow-sm overflow-hidden transition-all"
      style={{
        borderColor: highlight ? "#E07B39" : "#e7e5e4",
        boxShadow: highlight ? "0 0 0 2px #E07B3940" : undefined,
      }}
    >
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
              {localCount > 0
                ? `${localCount} ${localCount === 1 ? "person" : "people"} interested`
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

      {expanded && !done && (
        <div className="border-t border-stone-100 px-4 pb-4 pt-3" style={{ background: "#FEF9F5" }}>
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
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
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
  );
}

function ScheduleInner() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const [activeDay, setActiveDay] = useState(dayParam ? parseInt(dayParam) : 0);
  const [counts, setCounts] = useState<Counts>({});
  const [toastTitle, setToastTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/counts")
      .then((r) => r.json())
      .then((data) => setCounts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (dayParam !== null) {
      const day = parseInt(dayParam);
      if (!isNaN(day)) setActiveDay(day);
    }
  }, [dayParam]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setHighlightId(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, [activeDay]);

  function handleSuccess(sessionId: string) {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setToastTitle(session.title.length > 40 ? session.title.slice(0, 40) + "…" : session.title);
      setShowToast(true);
    }
  }

  const dayLabels = ["Tue 6 Oct", "Wed 7 Oct", "Thu 8 Oct", "Fri 9 Oct"];

  return (
    <div className="min-w-0 px-4 py-6" style={{ minHeight: "2400px" }}>
      <div className="bg-[#1A1A1A] rounded-xl px-5 py-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#E07B39" }}>
          IFVP Cape Town Summit 2026
        </p>
        <h1 className="text-xl font-bold text-white leading-tight mb-2">The Schedule</h1>
        <p className="text-sm text-stone-300 leading-relaxed">
          Browse sessions by day. See something you want to attend?{" "}
          <span style={{ color: "#E07B39" }} className="font-semibold">Express your interest</span>{" "}
          and we&apos;ll be in touch. Not registered yet?{" "}
          <a
            href="https://book.stripe.com/14AaEZ6ZE6N88ql1eJ5Rm02"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: "#E07B39" }}
          >
            Register here →
          </a>
        </p>
      </div>

      {/* Urgency countdown banner */}
      <div className="mb-6">
        <UrgencyBanner variant="inline" />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.entries(trackConfig) as [string, typeof trackConfig[keyof typeof trackConfig]][]).map(([key, t]) => (
          <span key={key} className={`text-xs font-medium px-2 py-0.5 rounded border ${t.bg} ${t.text} ${t.border}`}>
            {t.label}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {dayLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={
              activeDay === i
                ? { background: "#E07B39", color: "#ffffff", border: "1px solid #E07B39" }
                : { background: "#ffffff", color: "#E07B39", border: "1px solid #F4B896" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg px-4 py-3 mb-4" style={{ background: "#E07B39" }}>
        <h2 className="text-sm font-bold text-white tracking-wide">{days[activeDay]}</h2>
      </div>

      <div className="flex flex-col gap-2">
        {sessions
          .filter((s) => s.day === days[activeDay])
          .map((session) =>
            session.track === "break" ? (
              <BreakRow key={session.id} session={session} />
            ) : (
              <SessionCard
                key={session.id}
                session={session}
                count={counts[session.id] ?? 0}
                onSuccess={handleSuccess}
                highlight={highlightId === session.id}
              />
            )
          )}
      </div>

      <p className="text-xs text-stone-400 mt-6 text-center italic">Schedule is subject to change.</p>

      <div className="border-t border-stone-200 pt-6 mt-4 text-center">
        <p className="text-xs text-stone-400 mb-3">
          Century City Conference Centre · Cape Town · 6–9 October 2026
        </p>
        <a
          href="https://book.stripe.com/14AaEZ6ZE6N88ql1eJ5Rm02"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white text-sm font-semibold rounded-lg px-6 py-2.5 transition-opacity hover:opacity-90"
          style={{ background: "#E07B39" }}
        >
          Register for the full summit →
        </a>
      </div>

      {showToast && (
        <Toast
          message="You're on the list!"
          sub={toastTitle}
          onDone={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense>
      <ScheduleInner />
    </Suspense>
  );
}
