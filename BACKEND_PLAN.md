# Backend Plan — Expert Visiteur (caveman version)

## What we have now

- Website = React + Vite. Lives on GitHub Pages (`https://NourTLIBA.github.io/ComissionDeSante`).
- No backend. Everything sits in the browser's `localStorage` (`expertVisiteur_v1` in `src/data/referentiel.js`).
- Login is fake: any ID works (`LoginPage.jsx` just waits 900 ms and lets you in).
- Grades live in `appState.grades` (`{ criterionId: 0-100 number }`), final score in `appState.scores`, hospitals hardcoded in `ESTABLISHMENTS`.
- Problem: close browser on another PC = grades gone. Anyone can log in.

## What we want

1. Real accounts. Only people we create can enter.
2. Grades from each hospital visit saved on a server, not in one browser.
3. Deploy super easy. Frontend stays on GitHub Pages.
4. All backend code in the same GitHub repo, so you can download it and run it on any other server.

---

## The choice (one stack, no magic)

| Piece | Pick | Why |
|---|---|---|
| Language | **Node.js + Express** | Same JavaScript as the frontend. Small. Runs anywhere. |
| Database | **PostgreSQL** | Free hosted copies exist (Neon). Same DB runs on any server or in Docker. |
| Passwords | **bcrypt** hash | Never store the real password. |
| Login token | **JWT** in `Authorization: Bearer …` header | GitHub Pages and the backend are on different domains; cookies across domains are pain. Header token just works. |
| Free hosting | **Render** (backend) + **Neon** (database) | Both free, both connect to GitHub, push = deploy. No credit card. |
| Escape hatch | **Dockerfile + docker-compose.yml** | On your own server: `docker compose up -d`. Done. |

Why not Firebase / Supabase cloud: fast to start, but your logic lives inside their service. Hard to "download and move". Express + Postgres = plain code you own.

Downside to know: Render free plan sleeps after ~15 min no traffic. First request after sleep takes ~30–60 s. Fine for a few experts. Paid plan ($7/month) or own server removes it.

---

## Folder layout (new `backend/` next to `expert-visiteur/`)

```
ComissionDeSante/
├─ expert-visiteur/          (frontend, already exists)
└─ backend/
   ├─ package.json
   ├─ .env.example           (list of settings, no secrets)
   ├─ Dockerfile
   ├─ docker-compose.yml     (backend + postgres for self-hosting)
   ├─ render.yaml            (one-click Render setup)
   ├─ README.md              (how to run locally / Render / own server)
   ├─ db/
   │  ├─ schema.sql          (tables)
   │  └─ seed.js             (creates first admin + hospitals list)
   └─ src/
      ├─ server.js           (start Express, CORS, routes)
      ├─ db.js               (Postgres connection)
      ├─ auth.js             (login, JWT check, role check)
      └─ routes/
         ├─ auth.routes.js
         ├─ users.routes.js
         ├─ establishments.routes.js
         └─ evaluations.routes.js
```

Settings (`.env`):
```
DATABASE_URL=postgres://user:pass@host:5432/expertvisiteur
JWT_SECRET=long-random-string
CORS_ORIGIN=https://nourtliba.github.io
PORT=3000
ADMIN_ID=admin
ADMIN_PASSWORD=change-me-on-first-login
```

---

## Database (4 tables)

**users** — who can enter
- `id` (pk), `login` (unique, e.g. `EV-2024-0001`), `full_name`, `password_hash`
- `role`: `admin` (makes accounts, sees everything) or `expert` (does visits)
- `active` (true/false — turn off without deleting), `created_at`

**establishments** — hospitals
- `id` (text pk, like `CHU-MUSTAPHA`), `name`, `city`, `wilaya`, `type`, `beds`, `services`, `code`
- Seeded from current `ESTABLISHMENTS` array. Admin can add more later.

**evaluations** — one visit of one hospital
- `id` (pk), `establishment_id` → establishments, `expert_id` → users
- `status`: `draft` / `finished`
- `final_score` (0–100, filled when finished), `accreditation_level` (text)
- `comment` (the text from the Dashboard comment modal)
- `started_at`, `finished_at`, `updated_at`

**grades** — one score per criterion per visit
- `evaluation_id` → evaluations, `criterion_id` (e.g. `D1C1`), `score` (0–100)
- primary key = (`evaluation_id`, `criterion_id`) → saving again just overwrites
- `updated_at`

Criteria/domains stay in frontend `referentiel.js` (they are fixed official text). Backend only stores criterion IDs + numbers. Backend recomputes final score with the same weights (copy `computeScore` logic) so nobody can fake it from the browser.

---

## API (what the website calls)

Auth:
- `POST /api/auth/login` `{login, password}` → `{token, user}`
- `GET  /api/auth/me` → current user (check token still good)
- `POST /api/auth/change-password`

Accounts (admin only):
- `GET /api/users` · `POST /api/users` · `PATCH /api/users/:id` (rename, role, active, reset password)

Hospitals:
- `GET /api/establishments` (all logged-in users)
- `POST / PATCH /api/establishments` (admin only)

Visits & grades:
- `POST /api/evaluations` `{establishmentId}` → new draft (or return your open draft for that hospital)
- `GET  /api/evaluations` → expert sees own; admin sees all (filter `?establishment=`)
- `GET  /api/evaluations/:id` → visit + all grades
- `PUT  /api/evaluations/:id/grades/:criterionId` `{score}` → save one grade (called on each slider change, debounced)
- `PATCH /api/evaluations/:id` `{comment}`
- `POST /api/evaluations/:id/finish` → server computes score, locks visit
- `GET  /api/rankings` → best final score per hospital (feeds `RankingList` on Results page)
- `GET  /api/health` → "ok" (for Render check + wake-up ping)

Rules:
- No token → 401. Wrong role → 403.
- Expert can only touch own visits. Finished visit = read-only (admin can reopen).
- Login: 5 wrong tries → wait (rate limit with `express-rate-limit`).
- `helmet` for safe headers, CORS only allows `CORS_ORIGIN`.

---

## Frontend changes (small, one by one)

1. **`src/api.js`** (new): tiny `fetch` wrapper. Base URL from `import.meta.env.VITE_API_URL`. Adds token header. On 401 → back to login.
2. **`.env.production`** in `expert-visiteur/`: `VITE_API_URL=https://expert-visiteur-api.onrender.com`. `.env.development`: `http://localhost:3000`.
3. **`LoginPage.jsx`**: replace the `setTimeout` fake with `POST /api/auth/login`. Show real error. Show "server waking up…" message if it takes long.
4. **`App.jsx`**:
   - Keep token in `localStorage` (only token + current evaluation id, not grades).
   - `handleSelectEstablishment` → create/get evaluation on server.
   - `handleGrade` → update screen right away, then save to server (debounce ~500 ms). Show small "saved / saving / offline" dot.
   - `handleFinish` → call `/finish`, use score the server returns.
   - `handleLogout` → drop token.
5. **`VisitConfigPage.jsx`**: hospitals from `GET /api/establishments` (fallback to local list if offline).
6. **`ResultsPage.jsx`**: rankings from `GET /api/rankings`.
7. **New `AdminPage.jsx`** (only for role admin): table of accounts, add/disable/reset password; list of all visits with scores; button "export CSV".
8. **Optional later**: keep a local copy of unsaved grades so a bad connection never loses work; re-send when back online.

GitHub Pages deploy stays the same: `npm run deploy`. The `VITE_API_URL` gets baked in at build time.

---

## Deployment — easy path (Render + Neon, free)

1. Neon.tech → sign in with GitHub → new project → copy `DATABASE_URL`.
2. Render.com → sign in with GitHub → "New Blueprint" → pick `ComissionDeSante` repo → it reads `backend/render.yaml`.
3. In Render, fill env vars: `DATABASE_URL`, `JWT_SECRET` (Render can generate), `CORS_ORIGIN`, `ADMIN_PASSWORD`.
4. Render builds → runs `npm run migrate && npm run seed && npm start` (schema + first admin + hospitals, safe to run every time).
5. Copy Render URL → put in `expert-visiteur/.env.production` → `npm run deploy`.
6. Log in as admin → change password → create expert accounts.

After that: `git push` to `main` → Render redeploys backend by itself.

`render.yaml` sketch:
```yaml
services:
  - type: web
    name: expert-visiteur-api
    runtime: node
    rootDir: backend
    plan: free
    buildCommand: npm ci
    startCommand: npm run migrate && npm run seed && npm start
    healthCheckPath: /api/health
    envVars:
      - key: JWT_SECRET
        generateValue: true
      - key: DATABASE_URL
        sync: false
      - key: CORS_ORIGIN
        value: https://nourtliba.github.io
      - key: ADMIN_PASSWORD
        sync: false
```

## Deployment — own server path (move anytime)

On any Linux box with Docker:
```
git clone https://github.com/NourTLIBA/ComissionDeSante.git
cd ComissionDeSante/backend
cp .env.example .env      # fill values
docker compose up -d      # starts postgres + backend
```
Put Nginx/Caddy in front for HTTPS (Caddy does HTTPS by itself). Point frontend `VITE_API_URL` at the new address, redeploy frontend.

Move the data: `pg_dump` from Neon → `psql` into new server. One command each, written in `backend/README.md`.

Without Docker: install Node 22 + Postgres, `npm ci`, `npm run migrate`, `npm run seed`, `npm start` (use `pm2` to keep it alive).

Everything is in the git repo → "Download ZIP" on GitHub = whole frontend + backend.

---

## Safety basics

- Never commit `.env` (add to `.gitignore`). Only `.env.example`.
- Passwords bcrypt (cost 12). JWT expires in 8 h.
- First admin password from env, forced change on first login.
- Neon does daily backups on free plan (short history). Add a weekly `pg_dump` (GitHub Action or cron on own server) for long-term copies.
- All SQL with parameters (`$1, $2`) — no string gluing.

---

## Build order (steps)

1. Make `backend/` skeleton: Express, `/api/health`, Postgres connect, Dockerfile, docker-compose. Run locally.
2. `schema.sql` + migrate script + seed (admin + hospitals from `referentiel.js`).
3. Auth: login, JWT middleware, role check, rate limit.
4. Users routes (admin).
5. Establishments + evaluations + grades routes; server-side score calc (same weights as `computeScore`).
6. Frontend: `api.js`, real login, save grades to server, load hospitals + rankings.
7. Admin page (accounts + all visits + CSV export).
8. Deploy: Neon + Render blueprint, set `VITE_API_URL`, `npm run deploy`.
9. Test full loop on the live site: admin makes expert → expert logs in on phone → grades → other PC sees same grades → finish → ranking shows.
10. Write `backend/README.md` (local, Render, own server, backup/restore).

Rough size: backend ~600–800 lines, frontend changes ~300 lines + admin page.

## Open questions for you

- Can two experts grade the same hospital at the same time (shared visit) or one expert per visit? Plan assumes one expert per visit.
- Do hospitals themselves need accounts to see their own results? Plan assumes no (only admin + experts).
- Keep history of all visits per hospital (plan: yes) or only latest?
