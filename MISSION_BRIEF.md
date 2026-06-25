# BUILD_SPEC — VPA Session Interest Tool
**Mission:** `vpa-session-interest`  
**Repo:** `deonhanns/vpa-session-interest`  
**Stack:** Next.js 14 (App Router) · Supabase · Resend · Vercel  
**Status:** Greenfield — build from scratch  
**Worf protocol:** No Chinese-jurisdiction AI in this build.

---

## What we're building

A lightweight session interest capture tool for the IFVP Cape Town Summit 2026. Visitors browse the full session schedule, click "I'm interested" on any session, enter their name and email, and submit. They get a confirmation email. Organisers get a live dashboard showing interest counts and registrant details per session.

The tool lives at a Vercel URL and is embedded in the Google Sites schedule page via iframe.

---

## Supabase schema

Use an **existing Supabase project**. Create the following table:

```sql
create table session_interest (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  session_title text not null,
  session_day text not null,
  session_time text not null,
  session_track text,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

-- Public read access for counters (no auth required)
create policy "Public can read counts"
  on session_interest for select
  using (true);

-- Anyone can insert (no auth required to register interest)
create policy "Anyone can insert"
  on session_interest for insert
  with check (true);

-- Enable RLS
alter table session_interest enable row level security;
```

Add these to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_existing_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Resend setup

Use the Captain's existing Resend account and verified sender domain.

```
RESEND_API_KEY=your_existing_resend_api_key
RESEND_FROM=noreply@thesanscribe.com  (or whatever verified domain exists)
ORGANISER_EMAIL=lita@3stickmen.com
```

Two emails to send:

**1. Attendee confirmation** — triggered on each submission  
**2. Daily digest to organiser** — summary of interest counts per session (optional, can be a manual export from dashboard for now — defer if scope is tight)

---

## Sessions data

Hard-code the session list as a static data file `lib/sessions.ts`. No CMS needed — this is a one-event tool.

```typescript
export type Session = {
  id: string
  day: string
  time: string
  title: string
  presenter: string
  track: 'art' | 'facilitation' | 'business' | 'plenary' | 'social'
}

export const sessions: Session[] = [
  // TUESDAY 6 OCTOBER
  { id: 'tue-cocktail', day: 'Tuesday 6 Oct', time: '18:00–20:00', title: 'Cocktail Evening – Two Oceans Aquarium', presenter: '', track: 'social' },

  // WEDNESDAY 7 OCTOBER
  { id: 'wed-opening', day: 'Wednesday 7 Oct', time: '08:30–10:00', title: 'Opening Address + IFVP AGM', presenter: '', track: 'plenary' },
  { id: 'wed-flare', day: 'Wednesday 7 Oct', time: '10:30–12:00', title: 'Drawing Tricky Concepts More Creatively with FLARE', presenter: 'Ben Crothers', track: 'art' },
  { id: 'wed-nnm', day: 'Wednesday 7 Oct', time: '10:30–12:00', title: 'Neuronarrative Mapping', presenter: 'Deon Hanns & Jo Hobson', track: 'facilitation' },
  { id: 'wed-ai', day: 'Wednesday 7 Oct', time: '10:30–12:00', title: 'Drawing the Line: A Privacy-First, Human-First AI Blueprint', presenter: 'Matthias Weitbrecht', track: 'business' },
  { id: 'wed-symbol', day: 'Wednesday 7 Oct', time: '13:00–14:30', title: 'Symbol Safari: Co-creating Meaning', presenter: 'Gill Cromhout & Maaike Borsboom', track: 'art' },
  { id: 'wed-partnership', day: 'Wednesday 7 Oct', time: '13:00–14:30', title: 'Leveraging the Facilitation & Graphic Recorder Partnership', presenter: 'Nora Sheffe & James Durno', track: 'facilitation' },
  { id: 'wed-survival', day: 'Wednesday 7 Oct', time: '13:00–14:30', title: "Don't Panic! A Survival Guide for Recorders", presenter: 'Jim Nuttle', track: 'business' },
  { id: 'wed-ai-plenary', day: 'Wednesday 7 Oct', time: '15:00–16:30', title: 'Plenary: The Ethical Use of AI in Visual Practice', presenter: 'Panel discussion', track: 'plenary' },
  { id: 'wed-graphicjam', day: 'Wednesday 7 Oct', time: '16:30–17:00', title: 'Graphic Jam with Drinks', presenter: 'Donatella Pastorino & Jim Nuttle', track: 'social' },

  // THURSDAY 8 OCTOBER
  { id: 'thu-characters', day: 'Thursday 8 Oct', time: '08:30–10:00', title: 'Drawing Characters that Speak', presenter: 'Nick Walsh', track: 'art' },
  { id: 'thu-visual-tools', day: 'Thursday 8 Oct', time: '08:30–10:00', title: 'Visual Tools to Change an Industry – Meeting by Meeting', presenter: 'Axelle Vanquallie', track: 'facilitation' },
  { id: 'thu-tourism', day: 'Thursday 8 Oct', time: '08:30–10:00', title: 'The Visual Journey: Transforming Tourism Experience', presenter: '', track: 'business' },
  { id: 'thu-soulcollage', day: 'Thursday 8 Oct', time: '10:30–12:00', title: 'Soul Collage® as an Entry Point into Visual Thinking', presenter: 'Adriana Contreras', track: 'art' },
  { id: 'thu-draw', day: 'Thursday 8 Oct', time: '10:30–12:00', title: 'Draw from Everything', presenter: 'Elise White', track: 'facilitation' },
  { id: 'thu-community', day: 'Thursday 8 Oct', time: '10:30–12:00', title: "From Idea to Impact: Building a Visual Practitioner's Community", presenter: 'Dana Rulf', track: 'business' },
  { id: 'thu-openspace', day: 'Thursday 8 Oct', time: '13:00–16:30', title: 'Open Space Sessions', presenter: 'Facilitated by Kati Orav', track: 'plenary' },

  // FRIDAY 9 OCTOBER
  { id: 'fri-situating', day: 'Friday 9 Oct', time: '08:30–10:00', title: 'Situating Graphic Recording within the Visual Arts', presenter: 'Alice Edy', track: 'art' },
  { id: 'fri-scribe', day: 'Friday 9 Oct', time: '08:30–10:00', title: 'From Scribe to Strategic Ally: Designing Partnership in Facilitation', presenter: 'Erin Gordon', track: 'facilitation' },
  { id: 'fri-brazil', day: 'Friday 9 Oct', time: '08:30–10:00', title: 'Drawing Voices: Graphic Facilitation with Traditional Peoples in Brazil', presenter: 'Jess Tenorio', track: 'business' },
  { id: 'fri-visual-thinking', day: 'Friday 9 Oct', time: '08:30–10:00', title: 'Through Visual Thinking', presenter: 'Sonia Garcia Farina', track: 'facilitation' },
  { id: 'fri-signature', day: 'Friday 9 Oct', time: '10:30–12:00', title: 'The Signature Behind Your Sketch', presenter: 'Ben Crothers & Axelle Vanquallie', track: 'art' },
  { id: 'fri-somatic', day: 'Friday 9 Oct', time: '10:30–12:00', title: 'Embodying Change with the Somatic Scribing Lab', presenter: 'Kate Morales', track: 'facilitation' },
  { id: 'fri-education', day: 'Friday 9 Oct', time: '10:30–12:00', title: 'Bringing Visual Practices into Education: Beyond a Global Framework for Teachers', presenter: 'Kati Orav', track: 'business' },
  { id: 'fri-gala', day: 'Friday 9 Oct', time: '19:00', title: 'Gala Dinner – Drum Café', presenter: '', track: 'social' },
]
```

---

## App structure

```
/
├── app/
│   ├── page.tsx                  # Public: session list + interest buttons + counters
│   ├── api/
│   │   ├── interest/route.ts     # POST: save interest + send confirmation email
│   │   └── counts/route.ts       # GET: public interest counts per session
│   └── dashboard/
│       └── page.tsx              # Organiser dashboard: full name+email list per session
├── components/
│   ├── SessionCard.tsx           # Session card with counter + interest button
│   ├── InterestModal.tsx         # Name + email form modal
│   └── DaySection.tsx            # Groups sessions by day
├── lib/
│   ├── sessions.ts               # Static session data (above)
│   ├── supabase.ts               # Supabase client
│   └── resend.ts                 # Resend client + email templates
└── .env.local
```

---

## Page behaviour — `app/page.tsx` (public)

- Renders sessions grouped by day (Tuesday → Friday)
- Each session card shows:
  - Track colour indicator (art=amber, facilitation=green, business=blue, plenary=navy, social=teal)
  - Session title + presenter
  - Time
  - Live interest counter: `X people interested` (fetched from `/api/counts` on load)
  - `I'm interested →` button
- Clicking the button opens `InterestModal`
- After successful submission: button changes to `✓ You're on the list` and counter increments by 1
- One person can only submit once per session per email — deduplicate on insert (check existing record before inserting)

**iframe-friendly:** No fixed headers, no popups that break iframe context. Scrolls naturally inside the embed.

---

## API — `POST /api/interest`

Request body:
```json
{
  "sessionId": "wed-nnm",
  "sessionTitle": "Neuronarrative Mapping",
  "sessionDay": "Wednesday 7 Oct",
  "sessionTime": "10:30–12:00",
  "sessionTrack": "facilitation",
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

Logic:
1. Check if `email + session_id` already exists in `session_interest` → return `{ already: true }` if so
2. Insert record into Supabase
3. Send confirmation email via Resend
4. Return `{ success: true }`

Confirmation email (plain, warm tone):
```
Subject: You're on the list — [Session Title]

Hi [Name],

You've expressed interest in:
[Session Title]
[Day] · [Time]
IFVP Cape Town Summit 2026 · 6–9 October · Century City Conference Centre

We'll be in touch as the summit gets closer. In the meantime, 
if you haven't registered yet, you can secure your spot here:
https://book.stripe.com/bJe14pfwa0oK9upf5z5Rm00

See you in Cape Town.

The VPA Team
visualpractitionersafrica.com
```

---

## API — `GET /api/counts`

Returns public interest counts per session. No auth.

Response:
```json
{
  "wed-nnm": 7,
  "wed-flare": 3,
  "fri-brazil": 12
}
```

Query: `select session_id, count(*) from session_interest group by session_id`

---

## Dashboard — `app/dashboard/page.tsx`

**Simple password protection:** Check for query param `?key=YOUR_DASHBOARD_KEY` against an env var `DASHBOARD_KEY`. Not OAuth — this is a temporary volunteer tool. If key doesn't match, show a password input form.

Display:
- Total interest registrations (all sessions)
- Sessions sorted by interest count (descending)
- Each session expandable to show: name, email, submitted date
- Export button: downloads CSV of all data

Add to `.env.local`:
```
DASHBOARD_KEY=choose_a_strong_passphrase
```

Dashboard URL: `https://your-vercel-url.vercel.app/dashboard?key=YOUR_DASHBOARD_KEY`

---

## Styling

- Tailwind CSS
- Track colours:
  - `art` → amber (`bg-amber-100 text-amber-800 border-amber-300`)
  - `facilitation` → green (`bg-green-100 text-green-800 border-green-300`)
  - `business` → blue (`bg-blue-100 text-blue-800 border-blue-300`)
  - `plenary` → navy (`bg-slate-100 text-slate-800 border-slate-300`)
  - `social` → teal (`bg-teal-100 text-teal-800 border-teal-300`)
- Font: system sans — no custom font needed
- Mobile-first — must work cleanly in a narrow iframe (~380px)
- Day headers: full-width dark band with white text
- Session cards: white card, subtle shadow, track colour badge top-left
- Interest counter: small muted text below session title
- Button: outline style → fills green on success

---

## Google Sites embed instructions (for Captain after deployment)

1. Copy the deployed Vercel URL
2. On the Schedule page in Google Sites editor, click `+` → `Embed` → `By URL`
3. Paste the Vercel URL
4. Set height to `1800px` (enough to show all sessions without internal scroll)
5. Publish

---

## Environment variables summary

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM=
ORGANISER_EMAIL=
DASHBOARD_KEY=
```

All go into Vercel environment variables after deployment.

---

## Out of scope for this build

- User accounts or auth beyond dashboard password
- Payment integration
- SMS notifications
- Editing or cancelling interest after submission
- Multi-language support

---

## Definition of done

- [ ] Public page loads and shows all sessions grouped by day
- [ ] Interest counter shows correct live count per session
- [ ] Submitting name + email saves to Supabase and sends confirmation email
- [ ] Duplicate submission (same email + session) is gracefully handled
- [ ] Dashboard accessible via password key showing all data + CSV export
- [ ] Deployed to Vercel — public URL working
- [ ] Embeds cleanly in Google Sites iframe at 380px+ width
- [ ] Mobile responsive
