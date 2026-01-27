# Conn-Unity — Community Platform (College Group Project)

A full-stack community platform inspired by Reddit, built as a group project at Softwarica College of IT & E‑Commerce, Kathmandu (Dillibazar). The app enables users to create/join communities, post content with media, vote, comment, save posts, manage profiles, and chat — with secure JWT authentication and email-based OTP verification.

**Team (Softwarica College of IT & E‑Commerce)**
- Dipendra Kumar Sah — Scrum Master
- Sumit Shah — Developer
- Birendra Mukhiya — Developer
- Sujal Purbey — Developer
- Sumit Kumar Sah — Developer


**Tech Stack**
- Frontend: React 18, Vite, CSS
- Backend: Node.js, Express, JWT (jsonwebtoken)
- Database: PostgreSQL (pg)
- Storage/CDN: Cloudinary (images/videos)
- Email: Nodemailer (SMTP) with support for SendGrid/Ethereal/mock
- Realtime: Socket.IO (chat widget)


**Monorepo Structure**
- [backend](backend)
  - API server (Express), authentication, file uploads, database access
  - Config, controllers, routes, services, middleware
- [frontend](frontend)
  - Vite + React app, pages for auth, dashboard, profile, admin

Key files and folders:
- Backend
  - [backend/index.js](backend/index.js) — server bootstrap (Express + Socket.IO)
  - [backend/server.js](backend/server.js) — legacy/mock server entry
  - [backend/config/schema.sql](backend/config/schema.sql) — PostgreSQL schema (users, posts, comments, votes, saved_posts, notifications, communities, etc.)
  - [backend/routes](backend/routes) — route modules (auth, users, posts, comments, communities, admin, dashboard)
  - [backend/controllers](backend/controllers) — request handlers
  - [backend/middleware](backend/middleware) — auth, upload (multer), error handlers
  - [backend/services](backend/services) — db.service, cloudinary.service, email.service
- Frontend
  - [frontend/auth.html](frontend/auth.html) — Auth shell (login/register/verify/reset)
  - [frontend/src/auth_main.jsx](frontend/src/auth_main.jsx) — Hash-based router for auth pages
  - [frontend/src/pages](frontend/src/pages) — Login, Register, VerifyOtp, ResetPassword, Admin, etc.
  - [frontend/src/Dashboard.jsx](frontend/src/Dashboard.jsx) — main app experience after login
  - [frontend/src/authService.js](frontend/src/authService.js) — API helpers (login/register/verify OTP, forgot/reset password)


**Major Features**
- Authentication
  - Register with OTP email verification, login with JWT
  - “Forgot password” with OTP + reset page link
  - Persistent session; dashboard loads on refresh when token is valid
- Communities & Posts
  - Create/join/leave communities, post text + media (image/video upload)
  - Upvote/downvote with server persistence; save/unsave posts
  - Infinite/efficient feed loading (client-side patterns)
- Comments & Notifications
  - Comment on posts; notification stubs and APIs for reads/clear
- Profiles & Avatars
  - View/update profile; upload avatar to Cloudinary
- Admin & Dashboard
  - Admin demo page; dashboard UI with sidebar panels and actions
- Chat (demo)
  - Socket.IO-based chat widget (client + server)


**CRUD Overview**
- Users
  - Create: register (POST /api/register)
  - Read: GET /api/users/:id
  - Update: PUT /api/users/:id (profile), PUT /api/users/:id/avatar (avatar)
  - Delete: (not exposed publicly; handled administratively if needed)
- Communities
  - Create: admin/user flow (POST /api/communities)
  - Read: GET /api/communities, GET /api/communities/:id
  - Update: PUT /api/communities/:id
  - Delete: DELETE /api/communities/:id
- Posts
  - Create: POST /api/posts (multipart: text + optional media)
  - Read: GET /api/posts, GET /api/posts/:id
  - Update: PUT /api/posts/:id (author only)
  - Delete: DELETE /api/posts/:id (author only)
- Comments
  - Create: POST /api/posts/:id/comments
  - Read: GET /api/posts/:id (includes comments), GET /api/comments?postId=...
  - Update: PUT /api/comments/:id (author only)
  - Delete: DELETE /api/comments/:id (author only)

Additional actions:
- Voting: POST /api/posts/:id/vote with { voteType: 1 | -1 }
- Save/Unsave: POST /api/posts/:id/save
- Notifications: GET /api/notifications, mark read/clear endpoints


**Getting Started**
- Prerequisites
  - Node.js 18+
  - PostgreSQL 12+
  - Cloudinary account (or set CLOUDINARY_URL)
  - SMTP credentials (or use mock/ethereal/sendgrid as configured)

- 1) Backend setup
  - Create a PostgreSQL database (e.g., connunity)
  - Import schema: run the SQL in [backend/config/schema.sql](backend/config/schema.sql)
  - Create .env in backend/ (example):

```
# Core
PORT=4000
JWT_SECRET=super-secret-jwt
DATABASE_URL=postgres://user:pass@localhost:5432/connunity

# Emails (choose one mode)
EMAIL_MODE=smtp           # smtp | sendgrid | ethereal | mock
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_FROM="Connunity <no-reply@connunity.com>"
# or SendGrid
# SENDGRID_API_KEY=...
# SENDGRID_FROM="Connunity <no-reply@connunity.com>"
# or Ethereal (dev testing)
# ETHEREAL_USER=...
# ETHEREAL_PASS=...

# OTP
OTP_EXPIRY_MINUTES=10

# Cloudinary (either explicit or CLOUDINARY_URL)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
# CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Frontend base (for email links)
FRONTEND_BASE_URL=http://localhost:5173
```

  - Install and run backend:

```bash
cd backend
npm install
npm run dev
# Server: http://localhost:4000
```

- 2) Frontend setup
  - Install and run frontend:

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
# Auth demo: http://localhost:5173/auth.html#login
```


**Authentication Flow**
- Register: POST /api/register → send email OTP → verify via POST /api/verify-otp → returns JWT + user
- Login: POST /api/login → returns JWT + user (forces verification if email not verified)
- Token Check: GET /api/check-auth with Authorization: Bearer <token>
- Forgot Password: POST /api/forgot-password → sends OTP + link to auth.html#reset?email=...
- Reset Password: POST /api/reset-password with { email, otp, newPassword }

Frontend entry points:
- Auth shell: [frontend/auth.html](frontend/auth.html) using [frontend/src/auth_main.jsx](frontend/src/auth_main.jsx)
  - Pages: Login, Register, VerifyOtp, ResetPassword
- Dashboard app: [frontend/src/Dashboard.jsx](frontend/src/Dashboard.jsx) mounted by [frontend/src/main.jsx](frontend/src/main.jsx)


**Media Uploads**
- Client
  - Client-side compression for images before upload to speed up posting and avatar updates
  - Forms use multipart/form-data for media
- Server
  - multer in-memory storage streams to Cloudinary
  - Cloudinary transformations apply q_auto and f_auto for optimal delivery


**Database Schema (Highlights)**
- Tables: users, communities, posts, comments, votes, saved_posts, community_members, notifications, otp_codes
- Triggers maintain counts: vote counts on posts/comments, comment counts on posts, member counts on communities
- Indexes for performance on common filters and lookups


**Scripts**
- Backend
  - npm run dev → runs Express server with nodemon
  - npm start → runs server with Node
- Frontend
  - npm run dev → Vite dev server
  - npm run build → production build
  - npm run preview → preview production build


**Environment Modes for Emails**
- EMAIL_MODE=smtp → real SMTP (recommended for production)
- EMAIL_MODE=sendgrid → SendGrid API (set SENDGRID_API_KEY)
- EMAIL_MODE=ethereal → dev/testing inbox (preview URLs in console)
- EMAIL_MODE=mock → no real email; OTP printed in server logs


**Security Notes**
- Always set a strong JWT_SECRET
- Use HTTPS in production
- Validate file uploads; current filter allows images/videos; size limit ~20MB
- Sanitize and validate inputs on client and server


**Contributing & Project Process**
- Agile approach with Scrum ceremonies
- Branching strategy per feature; PR reviews by team
- Issue tracking via GitHub Projects/Issues


**License**
This project is created for educational purposes by the above team at Softwarica College of IT & E‑Commerce.
