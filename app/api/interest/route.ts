import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, confirmationEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, sessionTitle, sessionDay, sessionTime, sessionTrack, name, email } = body;

    if (!sessionId || !sessionTitle || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from("session_interest")
      .select("id")
      .eq("session_id", sessionId)
      .eq("email", emailLower)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ already: true });
    }

    // Insert
    const { error: insertError } = await supabaseAdmin
      .from("session_interest")
      .insert({
        session_id: sessionId,
        session_title: sessionTitle,
        session_day: sessionDay,
        session_time: sessionTime,
        session_track: sessionTrack || null,
        name: name.trim(),
        email: emailLower,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Send confirmation email
    try {
      await resend.emails.send(
        confirmationEmail({ name: name.trim(), email: emailLower, sessionTitle, sessionDay, sessionTime })
      );
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if email fails — data is saved
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Interest API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
