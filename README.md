# 🎉 Grushon's Birthday Invitation App

A monorepo for a premium birthday-invitation site. The host adds invitees, picks an
invitation scope, and the app auto-generates a **unique personal invitation link** for each
guest that can be copied or shared over WhatsApp. Each guest opens their own
`/invite/[token]` page with scope-aware wording, a countdown, an RSVP button, and a map.

```
brithday_ini/
├─ packages/shared/   # Shared TypeScript types + helpers (Guest, InvitationScope, messages)
├─ apps/api/          # NestJS REST API + Prisma (Neon Postgres)
└─ apps/web/          # Next.js (App Router) + Tailwind + Framer Motion
```

| Layer | Tech |
|------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, sonner |
| Backend | NestJS 10, Prisma, class-validator |
| Database | Postgres (Neon) |
| Monorepo | npm workspaces |

---

## 1. Prerequisites

- Node.js **18.18+** (Node 20/22 recommended)
- A Postgres database. The easiest is a free [Neon](https://neon.tech) project. (Any
  Postgres works — local or Docker — for development.)

## 2. Install

```bash
npm install
```

This installs all workspaces. The shared types package is built automatically on the first
`npm run dev` / `npm run build`.

## 3. Configure environment

Copy the example files and fill them in:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**apps/api/.env**

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (Neon → Connection Details → *Pooled connection*). |
| `PORT` | API port (default `3001`). |
| `FRONTEND_ORIGIN` | Allowed browser origin(s) for CORS. Comma-separate multiple. |
| `PUBLIC_SITE_URL` | Public base URL of the **frontend** — used to build each `formUrl`. |

**apps/web/.env**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API (e.g. `http://localhost:3001`). |
| `NEXT_PUBLIC_SITE_URL` | Public base URL of this site. |
| `NEXT_PUBLIC_EVENT_DATE` | (Optional) ISO date for the countdown. |
| `NEXT_PUBLIC_MAPS_URL` | (Optional) Google Maps link for the venue. |
| `NEXT_PUBLIC_GOOGLE_FORM_BASE_URL` + `NEXT_PUBLIC_GF_ENTRY_*` | (Optional) RSVP pre-fill — see §7. |

## 4. Create the database tables

```bash
npm run db:migrate        # first run: creates the migration + tables in your DB
# (for an already-migrated DB / production: npm run db:deploy)
```

## 5. Run in development

```bash
npm run dev
```

- Web → http://localhost:3000
- API → http://localhost:3001
- **Invitation Manager** → http://localhost:3000/admin/invitees

> `npm run dev` builds the shared package once, then runs the API (`nest start --watch`)
> and the web app (`next dev`) together.

---

## 6. How the pieces fit together

**Data model** (`packages/shared/src/index.ts`):

```ts
type InvitationScope = "single" | "couple" | "family";
type Guest = {
  id: string;
  name: string;
  token: string;
  invitationScope: InvitationScope;
  formUrl: string;     // derived: `${SITE_URL}/invite/${token}`
  createdAt: string;
};
```

**API endpoints** (`apps/api`):

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/guests` | Create invitee + auto-generate token |
| `GET` | `/guests` | List all invitees |
| `GET` | `/guests/:token` | Fetch one by token (public invite page) |
| `PATCH` | `/guests/:id` | Edit name / scope |
| `DELETE` | `/guests/:id` | Delete invitee |

**Token generation** (`apps/api/src/common/token.util.ts`): `slug(name)` + optional scope +
random suffix, e.g. `nimal-perera-a8x92`, `saman-family-k72q1`, `dinuka-couple-p9x21`.
Uniqueness is guaranteed by a DB unique constraint, with automatic retry on collision.

**Scope wording** (public invite page):

- single → *"Hi {name}, you are invited to Grushon's Birthday Celebration."*
- couple → *"Hi {name}, you and your partner are invited…"*
- family → *"Hi {name}, you and your family are invited…"*

---

## 7. Google Form RSVP pre-fill (optional)

To pre-fill the guest's name, token, and scope into your RSVP form:

1. Create your Google Form. Add short-answer questions for **Name**, **Token**, **Scope**.
2. In the form, click **⋮ → Get pre-filled link**, fill dummy values, click **Get link**.
3. Copy the generated URL. Each answer appears as `entry.123456789=...`.
4. Put the values in `apps/web/.env`:
   - `NEXT_PUBLIC_GOOGLE_FORM_BASE_URL` → the form's `.../viewform` URL
   - `NEXT_PUBLIC_GF_ENTRY_NAME` / `_TOKEN` / `_SCOPE` → the matching `entry.xxxx` keys

If these are left blank, the RSVP button still appears and shows a friendly
"being set up" message instead of breaking.

---

## 8. Deploy

### Database (Neon)
Create a Neon project, copy the **pooled** connection string into the API's `DATABASE_URL`,
then run migrations against it: `npm run db:deploy`.

### Frontend → Vercel
1. Import the repo into Vercel. Set **Root Directory** to `apps/web`.
2. Build command `npm run build`, output handled by Next automatically.
3. Add env vars: `NEXT_PUBLIC_API_URL` (your deployed API URL), `NEXT_PUBLIC_SITE_URL`
   (your Vercel domain), and any optional Google Form vars.

### Backend (NestJS) — choose one
> NestJS is a long-running Node server, so it doesn't deploy to Vercel like the frontend.

**Option A — Render / Railway (recommended):**
- New **Web Service** from this repo, root `apps/api`.
- Build: `npm install && npm run db:generate && npm run build && npm run db:deploy`
- Start: `npm run start`
- Env: `DATABASE_URL`, `PORT` (platform-provided), `FRONTEND_ORIGIN` (your Vercel domain),
  `PUBLIC_SITE_URL` (your Vercel domain).

**Option B — Vercel serverless:**
- Wrap the Nest app in a serverless handler and deploy as a separate Vercel project.
  Note the cold-start trade-off. (Render/Railway is simpler for a persistent API.)

Finally, point the frontend's `NEXT_PUBLIC_API_URL` at the deployed API and set the API's
`FRONTEND_ORIGIN` + `PUBLIC_SITE_URL` to the Vercel domain.

---

## 9. Client guide — adding invitees (no code needed)

1. Go to **`/admin/invitees`**.
2. Type the **guest name**.
3. Choose the **invitation scope**: *Single Person*, *Couple*, or *Family*.
4. Click **Generate invitation link** — a unique link appears instantly.
5. Click **Copy link**, or **Share on WhatsApp** to send the pre-written message.
6. Manage anyone in the list below: copy/share, **edit** details, or **delete**.

Every guest's link works on its own (e.g. `https://your-site.com/invite/nimal-perera-a8x92`)
and shows wording matched to their scope.

> **Note on access:** the admin screen currently has **no password** (per project decision).
> The write endpoints are isolated in `apps/api/src/guests`, so a NestJS auth guard +
> shared secret can be added later without touching the rest of the app.

---

## Useful scripts (run from the repo root)

| Script | Description |
|---|---|
| `npm run dev` | Run API + web together (dev) |
| `npm run build` | Build shared → api → web |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:deploy` | Apply migrations (prod) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate the Prisma client |
