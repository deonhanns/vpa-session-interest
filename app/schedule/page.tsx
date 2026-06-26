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
 
