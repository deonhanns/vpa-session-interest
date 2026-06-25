# CAPTAIN'S LOG — vpa-session-interest
**Stardate:** 2026-06-26  
**Mission:** Bootstrap and build the VPA Session Interest Tool  
**Engineer:** O'Brien  
**Repo:** deonhanns/vpa-session-interest  
**Deployment target:** Vercel (auto-deploys on push to main)

---

## Situation

The repo currently contains only `MISSION_BRIEF.md` (the full build spec) and this log. Vercel is connected and waiting. The first push of a working Next.js app will trigger a successful deployment automatically.

Read `MISSION_BRIEF.md` in full before writing a single line of code.

---

## Your first orders

### 1. Bootstrap the Next.js app

Run this in the repo root:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

Accept all defaults. This creates the standard Next.js 14 App Router structure in the current directory.

### 2. Install dependencies

```bash
npm install @supabase/supabase-js resend
```

### 3. Build the app

Follow `MISSION_BRIEF.md` exactly. The full spec is there — file structure, Supabase schema, API routes, session data, email templates, dashboard, styling. No clarification needed.

Key reminders:
- All env vars are already set in Vercel — do not hardcode any secrets
- Use `NEXT_PUBLIC_` prefix only for vars needed client-side (Supabase URL and anon key)
- The public page must work in a narrow iframe (380px minimum width) — mobile-first
- Deduplicate submissions: check email + session_id before inserting
- Dashboard protected by `?key=` query param checked against `DASHBOARD_KEY` env var

### 4. Push to main

```bash
git add .
git commit -m "feat: initial build — VPA session interest tool"
git push origin main
```

Vercel will auto-deploy. Check the deployment logs for errors.

### 5. Confirm definition of done

Before declaring mission complete, verify every item in the checklist at the bottom of `MISSION_BRIEF.md`.

---

## Environment variables

All set in Vercel already. For local dev, create `.env.local` with the same values (Captain will supply).

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM=
ORGANISER_EMAIL=
DASHBOARD_KEY=
```

---

## Standing orders

- Worf protocol: no Chinese-jurisdiction AI in this build
- Write clean, typed TypeScript throughout
- No unnecessary dependencies — keep it lean
- This is a temporary volunteer tool — pragmatic over perfect
- When in doubt, refer to MISSION_BRIEF.md
