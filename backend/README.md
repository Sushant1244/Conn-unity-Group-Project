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

## Email Delivery

Supports multiple email providers via `EMAIL_MODE` in `.env`:

- `smtp` (Gmail or any SMTP)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - Example (Gmail):
    ```env
    EMAIL_MODE=smtp
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_SECURE=true
    SMTP_USER=your@gmail.com
    SMTP_PASS=app_password_here
    SMTP_FROM="Connunity <your@gmail.com>"
    ```
- `sendgrid`
  - `SENDGRID_API_KEY`, `SENDGRID_FROM` (must be a verified sender)
    ```env
    EMAIL_MODE=sendgrid
    SENDGRID_API_KEY=SG.xxxxx
    SENDGRID_FROM="Connunity <sender@yourdomain.com>"
    ```
- `ethereal` (development-only preview inbox)
  - No extra envs needed; a test account is created at runtime.
  - Preview URLs are logged in the backend (click to view the email).
    ```env
    EMAIL_MODE=ethereal
    ```
- `mock` (no real send, logs OTP in backend)
  ```env
  EMAIL_MODE=mock
  ```

Optional fallback:

- `EMAIL_FALLBACK=mock` → Falls back to mock mode when provider errors occur.

### OTP Endpoints

- `POST /api/register` → Sends verification OTP
- `POST /api/resend-otp` → Resends OTP
- `POST /api/verify-otp` → Verifies OTP and returns JWT + user

### Quick Test

```bash
cd backend
npm run dev
```

- Register on the frontend to trigger an OTP.
- Ethereal: check backend logs for `Preview URL` and open it.
- SMTP/SendGrid: check your inbox; also verify sender configuration.

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
