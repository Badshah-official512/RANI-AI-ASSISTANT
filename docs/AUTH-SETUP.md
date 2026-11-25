# RANI AI — Auth & Database Setup (Supabase + Firebase Auth)

Same system as **BADSHAH AI**: Supabase as the database/auth backend,
Firebase Auth for sign-in (email + password, and Google). Structure only —
**no live keys anywhere in this repo.**

## Architecture

```
Phone (web app / Android WebView)
   │  email+password / Google sign-in
   ├─► Firebase Auth  ──► user identity (UID, email, provider)
   └─► Supabase       ──► Postgres tables, Row-Level Security, storage
```

- **Firebase Auth** owns sign-in: email+password and Google provider.
  (BADSHAH AI also enabled Firebase third-party auth; same pattern here.)
- **Supabase** owns data: user profiles, chat history, generated websites,
  admin flags. The web app talks to Supabase with the **anon key only**;
  Row-Level Security (RLS) decides what a signed-in user may read/write.
- **Never** put a Supabase **service-role key** in the web app, the Android
  wrapper, or any client file. Service keys are server-side only.

## 1. Supabase project

### OPEN DECISION — do not decide this yourself, Badshah decides:

> **Option A (recommended): create a NEW Supabase project for RANI.**
> Separation from BADSHAH AI: separate users, separate tables, separate
> quotas. If RANI ever breaks or is deleted, BADSHAH AI is untouched.
>
> **Option B: reuse BADSHAH AI's Supabase project** (`Badshah ai voice
> assistant`). Saves a project, but RANI users and BADSHAH users would share
> one database — needs separate tables + RLS care, and any mistake affects
> the live BADSHAH app.
>
> **Recommendation: Option A — new project.** Cost: free tier is enough to
> start (same as BADSHAH AI's Free plan).

Steps (either option):
1. Supabase dashboard → New project (Option A) → name it `rani-ai`,
   region closest to users (BADSHAH AI used `ap-southeast-1`).
2. Settings → API → copy **Project URL** and **anon public key**.
3. Paste them into `rani-web/js/config.js` (copied from
   `js/config.example.js`) as `supabaseUrl` / `supabaseAnonKey`.

## 2. Firebase Auth

1. Firebase console → create/use a project (BADSHAH AI's is
   `badshah-ai-badshah222` — for RANI, a new Firebase project is the clean
   choice, matching a new Supabase project).
2. Build → Authentication → Sign-in method → enable **Email/Password**
   and **Google**.
3. Project Settings → General → Your apps → Web app → copy the web config
   (`apiKey`, `authDomain`, `projectId`, `appId`) into `rani-web/js/config.js`
   as the `firebase*` fields.
4. Google provider: add the app's SHA-1 in Firebase (Android) when the
   release keystore exists — same step BADSHAH AI did for its keystore SHAs.

## 3. Suggested Supabase tables (create when the project exists)

```sql
-- Profiles: one row per user, linked to Firebase UID.
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text unique not null,
  email text not null,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
-- Users read/update only their own row; admins read all (add an admin policy).
create policy "own profile" on public.profiles
  for all using (auth.uid()::text = firebase_uid);

-- Chat history (optional — store only if the user wants history synced).
create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_uid text not null,
  role text not null check (role in ('user','rani')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.chats enable row level security;

-- Websites built with the in-app builder.
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  user_uid text not null,
  title text not null,
  prompt text,
  html text,
  created_at timestamptz not null default now()
);
alter table public.sites enable row level security;
```

> Full RLS policies (per-user read/write, admin read-all) are a wiring step
> for when the project is created — do not invent permissive "allow all"
> policies. Until then the app works signed-out in demo/local mode.

## 4. Admin panel

`rani-web/admin.html` is a **login-gated shell**: it asks for an admin
email + password, shows users/stats placeholders, and refuses entry until
auth is configured. Real behaviour after setup:

- Sign-in via Supabase/Firebase; check `profiles.is_admin` for that UID.
- Non-admins are turned away even if they open the page directly — the
  check is in the database (RLS), not in the page.
- Stats (user count, chats, sites built) read from the tables above.

## 5. Local config (the only place keys live)

```
rani-web/js/config.example.js   → copy to →
rani-web/js/config.js           → fill in YOUR keys (git-ignored, never commit)
```

Fields: `geminiApiKey`, `supabaseUrl`, `supabaseAnonKey`,
`firebaseApiKey`, `firebaseAuthDomain`, `firebaseProjectId`, `firebaseAppId`.

## Checklist before first real login

- [ ] Decision made: new Supabase project (recommended) vs reuse BADSHAH's
- [ ] Supabase project created, URL + anon key in `js/config.js`
- [ ] Firebase project created, Email/Password + Google enabled, web config in `js/config.js`
- [ ] Tables + RLS created (SQL above, policies tightened)
- [ ] Admin account created and `is_admin = true` set for it in Supabase
- [ ] `admin.html` login tested with that admin account
