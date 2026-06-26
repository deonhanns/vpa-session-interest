import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60; // revalidate every 60 seconds

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("session_interest")
      .select("session_id");

    if (error) {
      console.error("Counts error:", error);
      return NextResponse.json({});
    }

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.session_id] = (counts[row.session_id] ?? 0) + 1;
    }

    return NextResponse.json(counts);
  } catch (err) {
    console.error("Counts API error:", err);
    return NextResponse.json({});
  }
}
