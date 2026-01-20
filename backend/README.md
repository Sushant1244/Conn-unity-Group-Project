# Conn-unity Backend

A simple Express + Socket.IO backend that supports:
- Health check: GET /api/health
- Auth (mock): POST /api/register, POST /api/login
- Admin login (strict demo): POST /api/admin-login
- Realtime chat: Socket.IO on the same server

## Requirements
- Node.js 18+

## Install

```bash
cd backend
npm install
```

## Run (development)

```bash
npm run dev
```

Starts on http://localhost:4000 with hot-reload via nodemon.

## Run (production)

```bash
npm start
```

## Files you may be looking for
- Entry point: [index.js](index.js) → starts the server (delegates to [server.js](server.js))
- Admin Dashboard UI component is a frontend file: [frontend/src/pages/AdminDashboard.jsx](../frontend/src/pages/AdminDashboard.jsx)
  - Backend route that powers it: `GET /api/admin/dashboard`

## API

- `GET /api/health` → `{ ok: true, ts: <number> }`
- `POST /api/register` → `{ success: boolean, message?: string }`
  - body: `{ username, email, password }`
- `POST /api/login` → `{ success: boolean, token?: string, message?: string }`
  - body: `{ email, password }`
- `POST /api/admin-login` → `{ success: boolean, token?: string, message?: string }`
  - body: `{ username, password, code }`
  - Accepts only the exact demo credentials:
    - username: developer@gmail.com
    - password: connunity@123
    - code: 99390D

## Realtime Chat
- Connect Socket.IO client to `http://localhost:4000`
- Events:
  - `chat:join` → `{ room, username }`
  - `chat:set-username` → `{ username }`
  - `chat:message` → `{ room, text, username }` (broadcasts `chat:message` with `{ id, room, text, username, ts }`)
  - `chat:typing` → `{ room, username }` (broadcasts `chat:typing`)
  - Presence events: server emits `chat:presence` with `{ room, members, count }`

## Notes
- CORS enabled for development.
- Serves frontend statically when deployed together, but you can run frontend via Vite dev server using its proxy to `:4000`.
