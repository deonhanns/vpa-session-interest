"use client";

import { useState } from "react";
import type { Session } from "@/lib/sessions";
import { trackConfig } from "@/lib/sessions";
import InterestModal from "./InterestModal";

type Props = {
  session: Session;
  initialCount: number;
};

export default function SessionCard({ session, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const track = trackConfig[session.track];

  function handleSuccess() {
    setDone(true);
    setCount((c) => c + 1);
    setShowModal(false);
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col gap-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-2 ${track.bg} ${track.text} ${track.border}`}>
              {track.label}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">{session.title}</h3>
            {session.presenter && (
              <p className="text-xs text-stone-500 mt-1">{session.presenter}</p>
            )}
          </div>
          <span className="text-xs text-stone-400 whitespace-nowrap flex-shrink-0 mt-0.5">{session.time}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
          <span className="text-xs text-stone-400">
            {count > 0
              ? `${count} ${count === 1 ? "person" : "people"} interested`
              : "Be the first to express interest"}
          </span>
          {done ? (
            <span className="text-xs font-semibold rounded-full px-3 py-1"
              style={{background:"#FEF0E7", color:"#E07B39", border:"1px solid #F4B896"}}>
              ✓ You&apos;re on the list
            </span>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold rounded-full px-3 py-1 transition-colors hover:opacity-90"
              style={{background:"#FEF0E7", color:"#E07B39", border:"1px solid #F4B896"}}
            >
              I&apos;m interested →
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <InterestModal
          session={session}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
