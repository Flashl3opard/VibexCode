# VibeXcode

A developer community platform — real-time forum chat, a multi-language code playground, leaderboards, and a Q&A space — built on Next.js 15.

**Live:** https://vibexcode.netlify.app

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) + React 19 | File-based routing, server components for SEO/metadata, API routes in the same project — one deploy, no CORS |
| Language | TypeScript | The frontend/backend contract is the riskiest surface; type-checking catches it at compile time |
| Styling | Tailwind 4 | Small bundle, no custom CSS, fast iteration |
| State | Redux Toolkit | Centralizes auth and theme state shared across pages |
| Editor | Monaco (`@monaco-editor/react`) | Same engine as VS Code, multi-language, familiar to devs |
| Auth | Firebase Auth | Mature social-login flows (Google/GitHub/Facebook) and email/password without me handling tokens or password hashing |
| DB | MongoDB Atlas + Mongoose | Document model fits chat messages, submissions, and user profiles; Mongoose layers schemas + validation on top |
| Code execution | Judge0 (RapidAPI) | Sandboxes user code in containers — submissions never run on our infrastructure |
| Real-time | Socket.IO (dev) / pluggable | Rooms keyed by conversation ID; messages also persisted to Mongo so refresh shows history (see "Known issues" for the deploy-time caveat) |
| Hosting | Netlify | Static + serverless functions, generous free tier |

---

## What's interesting

The features are conventional. The decisions inside them are where the depth lives.

### Code execution: never on our servers

The playground compiles user code in **Judge0**, an external sandbox. Flow:

1. Client `POST /api/judge0/submit` with source + language ID
2. Our route forwards to RapidAPI's Judge0 endpoint, returns a `token`
3. Client polls `/api/judge0/result/<token>` until `status.id > 2` (completed)
4. UI renders stdout / stderr / time / memory

If a user submits malicious code, the blast radius is their own Judge0 container — not our app. The trade-off is network latency (typically 1–4 s) and an external dependency. The polling is a known limitation; webhook callback would be better and is a planned change.

### Real-time chat with persistent history

Each conversation has an ID. On open, the client joins a Socket.IO room keyed by that ID. New messages emit only to that room **and** are persisted to the `Message` collection in Mongo, so a refresh re-fetches history without missing anything sent in-flight. Real-time without persistence is amnesia; persistence without real-time is polling. You need both.

### Auth: one source of truth

Firebase handles auth end-to-end. An earlier version of this codebase ran Appwrite + Firebase in parallel, which was a real production wart (Appwrite Cloud's free tier auto-pauses after a week of inactivity → red 403s on every page that called `authservice.checkUser()`). The current code uses Firebase only; the legacy `authservice` interface is preserved as a Firebase-backed shim so the consolidation didn't ripple through every page.

### Page metadata, properly

Root layout exports rich Open Graph + Twitter card metadata + canonical URL, with a per-route `title` template (`Playground · VibeXcode`). Each major route has its own minimal `layout.tsx` that overrides title/description so link previews and search results are page-accurate, not site-default.

---

## Project structure

```
.
├── app/
│   ├── layout.tsx              # Root layout, full SEO metadata
│   ├── page.tsx                # Landing
│   ├── api/                    # Next.js API routes (REST)
│   │   ├── judge0/             # Submit + poll for code execution
│   │   ├── messages/           # Chat history
│   │   ├── questions/          # Q&A questions
│   │   ├── submit/             # Solution submissions
│   │   ├── tasks/              # Personal todos
│   │   └── ...
│   ├── playground/             # Monaco editor + Judge0 flow
│   ├── community/, Forums/     # Real-time chat
│   ├── Dashboard/, Profile/    # User-scoped views
│   ├── Leaderboards/           # Top performers
│   ├── login/, signup/         # Auth flows (Firebase)
│   ├── appwrite/auth.ts        # Firebase-backed auth service (legacy folder name)
│   └── components/             # Shared UI
├── lib/
│   ├── firebase.ts             # Firebase client init
│   ├── mongodb.ts              # Lazy Mongoose connection
│   ├── judge0.ts               # Submit + poll wrapper
│   └── useSocket.ts            # Socket.IO React hook
├── models/                     # Mongoose schemas
│   ├── Users.ts
│   ├── Messages.ts
│   ├── Questions.ts
│   ├── Submissions.ts
│   └── Tasks.ts
├── pages/api/socketio.ts       # Pages-router Socket.IO server (legacy; see "Known issues")
└── public/
```

---

## Running locally

Requirements: **Node ≥ 18**.

```bash
git clone https://github.com/Valkyriezz/VibexCode.git
cd VibexCode
npm install
cp .env.example .env.local      # then fill in the values
npm run dev                     # http://localhost:3000
```

`.env.local` needs (see `.env.example` for the full list):

- `MONGODB_URI` — MongoDB Atlas or local
- `RAPIDAPI_KEY` — Judge0 (Run button fails with 401 without this)
- Firebase web SDK config (`NEXT_PUBLIC_FIREBASE_*`)

Build the production bundle and serve it:

```bash
npm run build
npm start
```

---

## Deploying

The app is deploy-target-agnostic. Configure the env vars above on the host and `npm run build` works. Netlify is the current target (auto-builds on push to `main`, ~2 min).

---

## Known issues / what's next

- **Real-time chat on serverless.** `pages/api/socketio.ts` requires a long-lived process. Netlify Functions are short-lived, so the deployed `/api/socketio` route returns 500. Local dev is fine. Fix is to migrate to a managed real-time service (Pusher / Ably) or move the host to Render/Railway.
- **Judge0 polling.** Polling every second up to 10 attempts is brittle for slow programs. Webhook callback is the right answer — Judge0 supports it on paid tiers.
- **Reset password URL.** With Firebase, the reset email carries `oobCode` instead of Appwrite's `userId`+`secret`. The `/resetPassword` page still reads the legacy params; needs updating.
- **No automatic DB migrations.** Mongo schemas are defined inline; for v2 a `_migrations` collection + numbered scripts would be the right shape.
- **No rate limiting.** API routes are open. Realistic to add via `@vercel/edge` or middleware before scale.
- **No tests for the chat layer.** API route tests for Judge0 are planned.

---

## Things I intentionally did *not* build

- A heavyweight design system (MUI etc.). Tailwind keeps the bundle small and review attention on the logic.
- Per-tenant auth / multi-org. Single-tenant by design; a real product would need this.
- A separate frontend host. One URL is simpler to operate; we can split later if traffic justifies it.
- Premature abstractions (repository pattern, service layer, DI containers). At this size they cost more than they save.

---

## Why these trade-offs

The brief I built this against valued **depth and production-readiness over breadth of features**. The visible features (chat, playground, forum, leaderboard) are conventional. The interesting parts are the seams: how user code is sandboxed, how auth was consolidated, how chat persistence and real-time delivery share the same data path, how metadata is structured. Where I cut a corner I tried to leave a clean seam (`Known issues` above) so the next iteration is small.
