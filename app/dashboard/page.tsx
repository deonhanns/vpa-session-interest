"use client";

import { useState, useEffect, useCallback } from "react";

type Row = {
  id: string;
  session_id: string;
  session_title: string;
  session_day: string;
  session_time: string;
  name: string;
  email: string;
  created_at: string;
};

type GroupedSession = {
  sessionId: string;
  sessionTitle: string;
  sessionDay: string;
  count: number;
  rows: Row[];
  expanded: boolean;
};

export default function Dashboard() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Row[]>([]);
  const [grouped, setGrouped] = useState<GroupedSession[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for key in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get("key");
    if (urlKey) {
      setKey(urlKey);
      fetchData(urlKey);
    }
  }, []);

  const fetchData = useCallback(async (k: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard?key=${encodeURIComponent(k)}`);
      const json = await res.json();
      if (res.status === 401) {
        setError("Invalid key. Try again.");
        return;
      }
      if (json.error) {
        setError(json.error);
        return;
      }
      setData(json.data ?? []);
      setAuthed(true);
      buildGrouped(json.data ?? []);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  function buildGrouped(rows: Row[]) {
    const map: Record<string, GroupedSession> = {};
    for (const row of rows) {
      if (!map[row.session_id]) {
        map[row.session_id] = {
          sessionId: row.session_id,
          sessionTitle: row.session_title,
          sessionDay: row.session_day,
          count: 0,
          rows: [],
          expanded: false,
        };
      }
      map[row.session_id].rows.push(row);
      map[row.session_id].count++;
    }
    setGrouped(
      Object.values(map).sort((a, b) => b.count - a.count)
    );
  }

  function toggleExpand(sessionId: string) {
    setGrouped((prev) =>
      prev.map((g) => g.sessionId === sessionId ? { ...g, expanded: !g.expanded } : g)
    );
  }

  function downloadCSV() {
    const headers = ["session_id", "session_title", "session_day", "session_time", "name", "email", "submitted_at"];
    const rows = data.map((r) => [
      r.session_id, r.session_title, r.session_day, r.session_time,
      r.name, r.email, new Date(r.created_at).toLocaleString()
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vpa-session-interest-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Organiser Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">IFVP Cape Town Summit 2026 — session interest data</p>
          <form onSubmit={(e) => { e.preventDefault(); fetchData(key); }} className="space-y-3">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Dashboard key"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Access dashboard →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold">Session Interest Dashboard</h1>
          <p className="text-xs text-slate-400">IFVP Cape Town Summit 2026 · {data.length} total expressions of interest</p>
        </div>
        <button
          onClick={downloadCSV}
          className="text-xs bg-white text-slate-800 font-semibold rounded-lg px-4 py-2 hover:bg-slate-100"
        >
          Export CSV
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {grouped.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No expressions of interest yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {grouped.map((g) => (
              <div key={g.sessionId} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleExpand(g.sessionId)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-bold text-gray-900 truncate">{g.sessionTitle}</p>
                    <p className="text-xs text-gray-400">{g.sessionDay}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-0.5">
                      {g.count} interested
                    </span>
                    <span className="text-gray-400 text-sm">{g.expanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {g.expanded && (
                  <div className="border-t border-gray-100">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-4 py-2 text-gray-500 font-semibold">Name</th>
                          <th className="text-left px-4 py-2 text-gray-500 font-semibold">Email</th>
                          <th className="text-left px-4 py-2 text-gray-500 font-semibold">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.rows.map((row, i) => (
                          <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 text-gray-900">{row.name}</td>
                            <td className="px-4 py-2 text-gray-600">{row.email}</td>
                            <td className="px-4 py-2 text-gray-400">
                              {new Date(row.created_at).toLocaleDateString("en-ZA", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
