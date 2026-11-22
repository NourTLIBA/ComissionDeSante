# Expert Visiteur — backend

Node 22 + Express + PostgreSQL. Stores accounts, hospitals, visits and grades.
The website (`../expert-visiteur`, on GitHub Pages) talks to it through `/api`.

```
backend/
  src/        server, auth, routes, scoring, referentiel.js (copy of the website's referential)
  db/         schema.sql, migrate.js, seed.js
  scripts/    sync-referentiel.js
  Dockerfile, docker-compose.yml, .env.example
../render.yaml   one-click Render setup
```

## Settings (`.env`)

| Name | Meaning |
|---|---|
| `DATABASE_URL` | Postgres address. Neon / Render add `?sslmode=require` themselves. |
| `JWT_SECRET` | Long random text that signs login tokens. Change it = everybody is logged out. |
| `CORS_ORIGIN` | Website address(es) allowed to call the API, comma separated. Only the origin: `https://nourtliba.github.io` (no `/ComissionDeSante`). |
| `PORT` | Default 3000. |
| `ADMIN_LOGIN`, `ADMIN_PASSWORD` | Only used once, to create the first admin when no admin exists. The admin must change it at first login. |

## Run on your computer

Needs Node 22 and a Postgres (or Docker).

```bash
cd backend
cp .env.example .env          # then edit it
npm ci
npm run migrate               # creates the tables (safe to repeat)
npm run seed                  # hospitals + first admin (safe to repeat)
npm run dev                   # http://localhost:3000/api/health
```

Website side: `expert-visiteur/.env.development` already points to `http://localhost:3000`.
Add `http://localhost:5173` to `CORS_ORIGIN` (already in `.env.example`), then `npm run dev` in `expert-visiteur`.

## Deploy: Render (backend) + Neon (database), free

1. **Neon** (neon.tech, sign in with GitHub): create a project, copy the connection string.
2. **Render** (render.com, sign in with GitHub): *New → Blueprint*, pick this repository. It reads `render.yaml`.
3. Fill the two secret values Render asks for: `DATABASE_URL` (the Neon string) and `ADMIN_PASSWORD`.
4. When it is live, open `https://<your-service>.onrender.com/api/health` → `{"status":"ok"}`.
5. Put that address in `expert-visiteur/.env.production` (`VITE_API_URL=…`), then from `expert-visiteur`: `npm run deploy`.
6. Log in as `admin`, choose a new password, create the expert accounts in *Administration → Comptes*.

Every `git push` to the repository redeploys the backend automatically.
The free Render plan sleeps after ~15 min without visits; the first request then takes 30–60 s
(the login page tells the user). A free uptime ping on `/api/health` every 10 min avoids that.

## Deploy: your own server (Docker)

```bash
git clone https://github.com/NourTLIBA/ComissionDeSante.git
cd ComissionDeSante/backend
cp .env.example .env     # set JWT_SECRET, CORS_ORIGIN, ADMIN_PASSWORD (DATABASE_URL is set by compose)
docker compose up -d     # postgres + api on port 3000
```

Put HTTPS in front (the website is https, so the API must be too). With Caddy, `Caddyfile`:

```
api.example.com {
    reverse_proxy localhost:3000
}
```

Then set `VITE_API_URL=https://api.example.com` in `expert-visiteur/.env.production` and run `npm run deploy`.

Without Docker: install Node 22 and Postgres, then follow *Run on your computer* and keep it alive with `pm2 start src/server.js --name expert-api`.

## Move the data to another server

```bash
pg_dump "$OLD_DATABASE_URL" --no-owner -Fc -f expert.dump
pg_restore --no-owner -d "$NEW_DATABASE_URL" expert.dump
```

Do this regularly as a backup too (a weekly cron job is enough). Free Neon only keeps a short history.

## API (all under `/api`, token in `Authorization: Bearer …`)

| Method + path | Who | What |
|---|---|---|
| `GET /health` | anyone | alive check |
| `POST /auth/login` | anyone | `{login, password}` → `{token, user}` (10 failed tries / 15 min / IP) |
| `GET /auth/me` · `POST /auth/change-password` | logged in | |
| `GET/POST /users` · `PATCH /users/:id` | admin | create, rename, role, disable, reset password |
| `GET /establishments` | logged in | hospital list |
| `POST /establishments` · `PATCH /establishments/:id` | admin | add / edit hospital |
| `POST /evaluations` `{establishmentId}` | logged in | start or resume your open visit for that hospital |
| `GET /evaluations[?status=&establishment=]` | logged in | experts: own visits; admin: all |
| `GET /evaluations/:id` | owner / admin | visit + grades |
| `PUT /evaluations/:id/grades/:criterionId` `{score}` | owner / admin | save one grade (0–100) |
| `PATCH /evaluations/:id` `{comment}` | owner / admin | save comment |
| `POST /evaluations/:id/finish` | owner / admin | server computes the official score, locks the visit |
| `POST /evaluations/:id/reset` | owner / admin | erase grades of an open visit |
| `POST /evaluations/:id/reopen` | admin | unlock a closed visit |
| `GET /evaluations/export.csv` | admin | all visits as CSV |
| `GET /rankings` | logged in | `{scores: {hospitalId: latest closed score}}` |

## Changing the referential

The criteria, weights and hospital list live in `expert-visiteur/src/data/referentiel.js`.
After editing it, run `npm run sync-referentiel` in `backend/` (copies the file into `backend/src`),
commit both, and redeploy. New hospitals in the list are added on the next start (`seed`);
existing ones are never overwritten, so admin edits are kept.

## Security notes

- Passwords are stored as bcrypt hashes. Tokens last 8 h. A disabled account is cut off immediately.
- Never commit `.env`. Only `.env.example` is in git.
- Scores are always recomputed on the server; the browser cannot fake a score.
- A closed visit is locked. Experts see only their own visits.
