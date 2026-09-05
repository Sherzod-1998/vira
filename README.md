# Vira API

The backend for [Vira](https://github.com/Sherzod-1998/vira-next), a fine
jewelry marketplace: a NestJS GraphQL API with MongoDB, JWT auth, and a raw
WebSocket gateway for chat/notifications.

**Frontend repo:** https://github.com/Sherzod-1998/vira-next

## Features

- **GraphQL API** (code-first, `@nestjs/graphql`) covering members, products,
  community board articles, comments, likes, follows, notices, CS inquiries,
  and notifications.
- **Auth** — JWT issued on login/signup/Google OAuth, verified server-side on
  every guarded resolver (`AuthGuard`/`RolesGuard`) — a client-held token's
  claims are never trusted without this re-verification.
- **Role-based access** — `USER` / `SELLER` / `ADMIN`, enforced with
  `@Roles()` + `RolesGuard` on admin-only queries and mutations, plus a
  role-agnostic `checkMyRole` query the frontend uses to gate its admin UI
  server-side.
- **Image uploads** — GraphQL multipart uploads, stored on Cloudinary in
  production (falls back to local disk when `CLOUDINARY_URL` isn't set, which
  is convenient for local dev but not durable — see Deployment below).
- **WebSocket gateway** — a lightweight `ws`-based gateway for chat/presence,
  authenticated via a post-connect `{event: 'auth', token}` message (a legacy
  `?token=` query-string fallback is also accepted).
- **Unit tests** for auth, member, product, and notification services.

## Tech stack

- **NestJS** + **TypeScript**, two apps in one Nest workspace: `vira-api`
  (the GraphQL/HTTP/WS server) and `vira-batch` (a scheduled worker for
  ranking/aggregate updates)
- **MongoDB** via Mongoose
- **GraphQL** (code-first schema, `@nestjs/apollo`)
- **JWT** (`@nestjs/jwt` + `bcryptjs`) for auth
- **Cloudinary** for production image storage

## Getting started

```bash
npm install
cp .env.example .env    # fill in MONGO_DEV, SECRET_TOKEN, etc.
npm run start:dev       # http://localhost:3007/graphql
```

### Environment variables

| Variable | Description |
|---|---|
| `PORT_API` | HTTP/GraphQL/WS port (default 3007) |
| `PORT_BATCH` | Batch worker port |
| `MONGO_DEV` / `MONGO_PROD` | MongoDB connection string per environment |
| `SECRET_TOKEN` | JWT signing secret |
| `CORS_ORIGINS` | Allowed frontend origin(s), comma-separated |
| `CLOUDINARY_URL` | Optional — enables Cloudinary image storage in production |

## Testing

```bash
npm test          # unit tests (Jest)
npm run test:cov  # with coverage
```

`npm run test:e2e` is wired up but currently has no e2e suite under
`apps/vira-api/test/` — add one before relying on this script.

## Deployment

The repo includes a `render.yaml` Blueprint for the `vira-api` service,
tracking the `master` branch.

1. Push to `master`.
2. In Render, create a new Blueprint from this repository.
3. Set `MONGO_PROD`, `CORS_ORIGINS` (the deployed frontend URL), and
   `CLOUDINARY_URL` (recommended — Render's free-tier filesystem is
   ephemeral, so uploads saved to local disk are lost on every restart or
   redeploy).

```text
HTTP:      https://your-api.onrender.com
GraphQL:   https://your-api.onrender.com/graphql
WebSocket: wss://your-api.onrender.com
```

`vira-batch` is not part of the free Blueprint — deploy it separately as a
worker if you need scheduled ranking updates.

## License

UNLICENSED (private project)
