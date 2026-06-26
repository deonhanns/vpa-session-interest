import { sessions, days, trackConfig } from "@/lib/sessions";
import { supabaseAdmin } from "@/lib/supabase";
import SessionCard from "@/components/SessionCard";

async function getCounts(): Promise<Record<string, number>> {
  try {
    const { data } = await supabaseAdmin
      .from("session_interest")
      .select("session_id");
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.session_id] = (counts[row.session_id] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

export const revalidate = 60;

export default async function Home() {
  const counts = await getCounts();

  return (
    <div className="min-w-0 px-4 py-6 max-w-2xl mx-auto" style={{minHeight: "2400px"}}>

      {/* Header */}
      <div className="bg-[#1A1A1A] rounded-xl px-5 py-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:"#E07B39"}}>
          IFVP Cape Town Summit 2026
        </p>
        <h1 className="text-xl font-bold text-white leading-tight mb-2">
          Which sessions are you interested in?
        </h1>
        <p className="text-sm text-stone-300 leading-relaxed">
          Let us know which sessions you&apos;d like to attend. We&apos;ll send you a confirmation
          and use this to help plan the programme. Not registered yet?{" "}
          <a
            href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{color:"#E07B39"}}
          >
            Register here →
          </a>
        </p>
      </div>

      {/* Track legend — exclude break */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.entries(trackConfig) as [string, typeof trackConfig[keyof typeof trackConfig]][]).map(([key, t]) => (
          <span key={key} className={`text-xs font-medium px-2 py-0.5 rounded border ${t.bg} ${t.text} ${t.border}`}>
            {t.label}
          </span>
        ))}
      </div>

      {/* Sessions by day — skip break slots */}
      {days.map((day) => {
        const daySessions = sessions.filter((s) => s.day === day && s.track !== "break");
        if (!daySessions.length) return null;
        return (
          <div key={day} className="mb-8">
            <div className="rounded-lg px-4 py-3 mb-3" style={{background:"#E07B39"}}>
              <h2 className="text-sm font-bold text-white tracking-wide">{day}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {daySessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  initialCount={counts[session.id] ?? 0}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="border-t border-stone-200 pt-6 mt-2 text-center">
        <p className="text-xs text-stone-400 mb-3">
          Century City Conference Centre · Cape Town · 6–9 October 2026
        </p>
        <a
          href="https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white text-sm font-semibold rounded-lg px-6 py-2.5 transition-opacity hover:opacity-90"
          style={{background:"#E07B39"}}
        >
          Register for the full summit →
        </a>
      </div>
    </div>
  );
}
