# Shawty Links

A URL shortener with accounts, click tracking, and automatic QR codes.

- `backend/` — Express 5 + MongoDB REST API
- `frontend/` — Vite + React 19 SPA (shadcn/ui, Tailwind v4)

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev            # http://localhost:5000
```

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `FRONTEND_URL` | Public frontend origin; short URLs are `${FRONTEND_URL}/${shortCode}` |
| `NODE_ENV` | `development` locally, `production` when deployed |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

`VITE_API_URL` must include the `/api` suffix (e.g. `http://localhost:5000/api`).
In production, set it in the Vercel project settings — real environment variables
take precedence over a committed `.env` file.

## API

All responses use the envelope `{ success, message, data }`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Sets the `token` httpOnly cookie (7 days) |
| POST | `/api/auth/logout` | — | Clears the cookie |
| GET | `/api/auth/me` | cookie | Current user |
| POST | `/api/links` | cookie | Create a short link (10/min/IP) |
| GET | `/api/links/my` | cookie | List the user's links with `shortUrl` and `qrCode` |
| GET | `/:shortCode` | — | 302 redirect; JSON callers get the original URL |
| GET | `/api/health` | — | Liveness/readiness probe: `200` when MongoDB is connected, `503` when degraded |

## Deployment

- **API** on Render. Set `NODE_ENV=production`, `FRONTEND_URL` to the Vercel domain,
  and a strong `JWT_SECRET`. Cookies are then issued with `SameSite=None; Secure`.

  Render's free tier sleeps after idle time, which makes the first login take
  30–60s. Point a free uptime pinger (or Render's own cron) at
  `GET /api/health` every 5–10 minutes to keep the instance warm. The frontend
  times out after 20s with a "server may be waking up" message rather than
  hanging forever.
- **Frontend** on Vercel. `frontend/vercel.json` rewrites `/dashboard`, `/login`,
  `/register` and `/(.*)` to `index.html`, and forwards `/:slug([a-zA-Z0-9_-]{6,12})`
  to the backend so short links redirect server-side.
