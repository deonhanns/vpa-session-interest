"use client";

import { useState } from "react";
import { speakers } from "@/lib/speakers";
import { trackConfig } from "@/lib/sessions";
import type { Speaker } from "@/lib/speakers";

function VideoPlaceholder() {
  return (
    <div
      className="w-full rounded-lg flex items-center justify-center gap-2 py-3"
      style={{ background: "#1A1A1A", minHeight: "52px" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#E07B39" strokeWidth="1.5" />
        <polygon points="10,8 16,12 10,16" fill="#E07B39" />
      </svg>
      <span className="text-xs font-medium" style={{ color: "#E07B39" }}>Video coming soon</span>
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = url.includes("vimeo.com");

  let embedUrl = url;
  if (isYouTube) {
    const id = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]
      : new URL(url).searchParams.get("v");
    embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (isVimeo) {
    const id = url.split("vimeo.com/")[1];
    embedUrl = `https://player.vimeo.com/video/${id}`;
  }

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const [expanded, setExpanded] = useState(false);
  const track = speaker.track !== "plenary"
    ? trackConfig[speaker.track as Exclude<typeof speaker.track, "plenary">]
    : { label: "Plenary", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };

  const shortBio = speaker.bio.length > 180
    ? speaker.bio.slice(0, 180).trim() + "…"
    : speaker.bio;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Photo */}
      <div
        className="w-full flex items-center justify-center"
        style={{ background: "#F5F0EB", height: "200px" }}
      >
        {speaker.photo ? (
          <img
            src={speaker.photo}
            alt={speaker.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: "#E07B39", color: "white" }}
            >
              {speaker.name.charAt(0)}
            </div>
            <span className="text-xs text-stone-400">Photo coming soon</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Track badge */}
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-2 ${track.bg} ${track.text} ${track.border}`}>
          {track.label}
        </span>

        {/* Name & role */}
        <h2 className="text-base font-bold text-gray-900 leading-snug">{speaker.name}</h2>
        <p className="text-xs text-stone-500 mt-0.5 mb-1">
          {speaker.role}{speaker.company ? ` · ${speaker.company}` : ""}
        </p>
        <p className="text-xs mb-3" style={{ color: "#E07B39" }}>
          {speaker.flag} {speaker.country}
        </p>

        {/* Session title */}
        <div
          className="rounded-lg px-3 py-2 mb-3"
          style={{ background: "#FEF0E7", border: "1px solid #F4B896" }}
        >
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-0.5">Session</p>
          <p className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{speaker.sessionTitle}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-stone-600 leading-relaxed mb-1">
          {expanded ? speaker.bio : shortBio}
        </p>
        {speaker.bio.length > 180 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs font-semibold mb-3"
            style={{ color: "#E07B39" }}
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}

        {/* Session description — only when expanded */}
        {expanded && (
          <div className="mt-2 mb-3 border-t border-stone-100 pt-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">About the session</p>
            <p className="text-sm text-stone-600 leading-relaxed">{speaker.sessionDescription}</p>
          </div>
        )}

        {/* Video */}
        <div className="mb-3">
          {speaker.videoUrl ? (
            <VideoEmbed url={speaker.videoUrl} />
          ) : (
            <VideoPlaceholder />
          )}
        </div>

        {/* Links */}
        <div className="flex gap-2 flex-wrap">
          {speaker.website && (
            <a
              href={speaker.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={{ color: "#E07B39", borderColor: "#F4B896", background: "#FEF9F5" }}
            >
              Website →
            </a>
          )}
          <a
            href={`/schedule`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80"
            style={{ color: "#1A1A1A", borderColor: "#D5D5D5", background: "#F5F0EB" }}
          >
            View in schedule →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SpeakersPage() {
  const [filter, setFilter] = useState<string>("all");

  const tracks = [
    { key: "all", label: "All speakers" },
    { key: "keynote", label: "Keynote" },
    { key: "art", label: "Art of the Line" },
    { key: "facilitation", label: "Drawn to Facilitation" },
    { key: "business", label: "Business Builders" },
  ];

  const filtered = filter === "all"
    ? speakers
    : speakers.filter(s => s.track === filter);

  return (
    <div className="min-w-0 px-4 py-6">

      {/* Header */}
      <div className="bg-[#1A1A1A] rounded-xl px-5 py-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#E07B39" }}>
          IFVP Cape Town Summit 2026
        </p>
        <h1 className="text-xl font-bold text-white leading-tight mb-2">The Speakers</h1>
        <p className="text-sm text-stone-300 leading-relaxed">
          Meet the practitioners, pioneers, and thinkers joining us in Cape Town this October.{" "}
          <a
            href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: "#E07B39" }}
          >
            Register here →
          </a>
        </p>
      </div>

      {/* Track filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {tracks.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={
              filter === t.key
                ? { background: "#E07B39", color: "#ffffff", border: "1px solid #E07B39" }
                : { background: "#ffffff", color: "#E07B39", border: "1px solid #F4B896" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Speaker count */}
      <p className="text-xs text-stone-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "speaker" : "speakers"}
        {filter !== "all" ? ` in this track` : " confirmed"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map(speaker => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-stone-200 pt-6 mt-8 text-center">
        <p className="text-xs text-stone-400 mb-3">
          Century City Conference Centre · Cape Town · 6–9 October 2026
        </p>
        <a
          href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white text-sm font-semibold rounded-lg px-6 py-2.5 transition-opacity hover:opacity-90"
          style={{ background: "#E07B39" }}
        >
          Register for the full summit →
        </a>
      </div>
    </div>
  );
}
