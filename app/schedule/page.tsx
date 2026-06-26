"use client";

import { useState, useEffect } from "react";
import { sessions, days, trackConfig } from "@/lib/sessions";
import type { Session } from "@/lib/sessions";
import InterestModal from "@/components/InterestModal";
import Toast from "@/components/Toast";

type Counts = Record<string, number>;
type DoneSet = Set<string>;

function BreakRow({ session }: { session: Session }) {
  return (
    <div className="flex items-center gap-3 py-1 px-2">
      <span className="text-xs text-stone-400 whitespace-nowrap w-20 flex-shrink-0">{session.time}</span>
      <div className="flex-1 h-px bg-stone-200" />
      <span className="text-xs text-stone-400 whitespace-nowrap">{session.title}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

function SessionCard({
  session,
  count,
  done,
  onInterest,
}: {
  session: Session;
  count: number;
  done: boolean;
  onInterest: (session: Session) => void;
}) {
  const isInteractable = session.track !== "social" && session.track !== "plenary" && session.track !== "break";
  const track = session.track !== "break" ? trackConfig[session.track as Exclude<typeof session.track, "break">] : null;

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col gap-3 shadow-sm">
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
        <span className="text-xs text-stone-400 whitespace-nowrap flex-shrink-0 mt-0.5">{session.time}</span>
      </div>

      {isInteractable && (
        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
          <span className="text-xs text-stone-400">
            {count > 0
              ? `${count} ${count === 1 ? "person" : "people"} interested`
              : "Be the first to express interest"}
          </span>
          {done ? (
            <span className="text-xs font-semibold rounded-full px-3 py-1"
              style={{ background: "#FEF0E7", color: "#E07B39", border: "1px solid #F4B896" }}>
              ✓ You&apos;re on the list
            </span>
          ) : (
            <button
              onClick={() => onInterest(session)}
              className="text-xs font-semibold rounded-full px-3 py-1 transition-opacity hover:opacity-90"
              style={{ background: "#FEF0E7", color: "#E07B39", border: "1px solid #F4B896" }}>
              I&apos;m interested →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(0);
  const [counts, setCounts] = useState<Counts>({});
  const [done, setDone] = useState<DoneSet>(new Set());
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastSession, setToastSession] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/counts")
      .then((r) => r.json())
      .then((data) => setCounts(data))
      .catch(() => {});
  }, []);

  function handleSuccess() {
    if (!activeSession) return;
    setDone((prev) => new Set(prev).add(activeSession.id));
    setCounts((prev) => ({
      ...prev,
      [activeSession.id]: (prev[activeSession.id] ?? 0) + 1,
    }));
    setToastSession(activeSession);
    setActiveSession(null);
    setShowToast(true);
  }

  const dayLabels = ["Tue 6 Oct", "Wed 7 Oct", "Thu 8 Oct", "Fri 9 Oct"];

  return (
    <div className="min-w-0 px-4 py-6">

      {/* Header */}
      <div className="bg-[#1A1A1A] rounded-xl px-5 py-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#E07B39" }}>
          IFVP Cape Town Summit 2026
        </p>
        <h1 className="text-xl font-bold text-white leading-tight mb-2">The Schedule</h1>
        <p className="text-sm text-stone-300 leading-relaxed">
          Browse sessions by day. See something you want to attend?{" "}
          <span style={{ color: "#E07B39" }} className="font-semibold">Express your interest</span>{" "}
          and we&apos;ll be in touch. Not registered yet?{" "}
          <a href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00" target="_blank" rel="noopener noreferrer"
            className="font-semibold underline" style={{ color: "#E07B39" }}>
            Register here →
          </a>
        </p>
      </div>

      {/* Track legend */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.entries(trackConfig) as [string, typeof trackConfig[keyof typeof trackConfig]][]).map(([key, t]) => (
          <span key={key} className={`text-xs font-medium px-2 py-0.5 rounded border ${t.bg} ${t.text} ${t.border}`}>
            {t.label}
          </span>
        ))}
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {dayLabels.map((label, i) => (
          <button key={i} onClick={() => setActiveDay(i)}
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={activeDay === i
              ? { background: "#E07B39", color: "#ffffff", border: "1px solid #E07B39" }
              : { background: "#ffffff", color: "#E07B39", border: "1px solid #F4B896" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Active day heading */}
      <div className="rounded-lg px-4 py-3 mb-4" style={{ background: "#E07B39" }}>
        <h2 className="text-sm font-bold text-white tracking-wide">{days[activeDay]}</h2>
      </div>

      {/* Sessions */}
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
                done={done.has(session.id)}
                onInterest={(s) => setActiveSession(s)}
              />
            )
          )}
      </div>

      {/* Note */}
      <p className="text-xs text-stone-400 mt-6 text-center italic">Schedule is subject to change.</p>

      {/* Footer */}
      <div className="border-t border-stone-200 pt-6 mt-4 text-center">
        <p className="text-xs text-stone-400 mb-3">
          Century City Conference Centre · Cape Town · 6–9 October 2026
        </p>
        <a href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00" target="_blank" rel="noopener noreferrer"
          className="inline-block text-white text-sm font-semibold rounded-lg px-6 py-2.5 transition-opacity hover:opacity-90"
          style={{ background: "#E07B39" }}>
          Register for the full summit →
        </a>
      </div>

      {activeSession && (
        <InterestModal session={activeSession} onClose={() => setActiveSession(null)} onSuccess={handleSuccess} />
      )}

      {showToast && toastSession && (
        <Toast
          message="You're on the list!"
          sub={toastSession.title.length > 40 ? toastSession.title.slice(0, 40) + "…" : toastSession.title}
          onDone={() => { setShowToast(false); setToastSession(null); }}
        />
      )}
    </div>
  );
}
