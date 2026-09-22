🇬🇧 **English** (this page) | 🇹🇷 [Türkçe](README.md)

<div align="center">
  <br />
  <img src="https://img.shields.io/badge/TART-Discussion%20Community-2C2C28?style=for-the-badge&logo=react&logoColor=61DAFB" alt="TART" />
  <br /><br />

  <p><strong>A modern, cross-platform (Web + Mobile) discussion and community platform for university students and thinkers, where ideas are debated in a balanced way and criticism turns into growth.</strong></p>

  <br />

  ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
  ![React Native / Expo](https://img.shields.io/badge/React_Native-Expo_54-000000?style=flat-square&logo=expo&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-404D59?style=flat-square&logo=express&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
  ![Supabase Security](https://img.shields.io/badge/Supabase_RLS-Active-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
  ![License](https://img.shields.io/github/license/fatmanurkaragozz/TART?style=flat-square)

  <br /><br />

  [Key Features](#-key-features) • [Security & RLS](#-security--rls-layer) • [Setup Guide](#-setup-guide) • [Architecture](#-architecture) • [API Endpoints](#-api-endpoints) • [Roadmap](#-roadmap) • [Contributing](#-contributing) • [License](#-license)

  <br />
</div>

---

## ✨ Key Features

TART brings every feature a modern community platform needs to both web and mobile (cross-platform) with top-tier performance:

*   🔐 **Secure Authentication:** JWT (JSON Web Token) and Bcryptjs-based secure registration/login. Forgot/Reset Password flow with email integration.
*   💬 **Dynamic Discussions & Comments:** Create discussion topics, comment, add nested replies, and an Upvote/Downvote system to drive engagement.
*   👥 **Social Features:** Follower/Following mechanics, personalized profile modals and views, a dynamic "Suggested Users" algorithm.
*   🔔 **Real-time Notifications:** In-app notifications triggered instantly when a discussion gets a new comment or a vote.
*   🎨 **Signature "Notebook" Aesthetic:** A consistent "Paper/Notebook" design language across web and mobile, minimal color accents, and eye-catching Framer Motion animations.
*   🛡️ **Hardened Security:** Infrastructure protected by Helmet, CORS, Morgan, and Supabase Row Level Security (RLS).

---

## 🛡️ Security & RLS Layer

TART pushes client-side security down to the database layer. **Row Level Security (RLS)** and **Column-Level Security (CLS)** are active on Supabase PostgreSQL:

1.  **Column-Level Access Restriction (CLS):** The `password`, `reset_password_token`, and `reset_password_expire` columns on the `users` table are fully closed to direct client `SELECT` requests. Clients can only read safe, public fields.
2.  **Row-Level Control (RLS):**
    *   Comments and discussions are readable by anyone, but can only be created by authenticated, logged-in users.
    *   Only the owner of a piece of content (`author_id`) can update or delete it (discussion/comment).
    *   User notifications can only be viewed and marked as read by the notification's owner.
    *   Contact messages (`contact_messages`) can only be queried by users with the `admin` role.

---

## 🚀 Setup Guide

The project consists of 3 main layers: **Server (Backend)**, **Web UI (Frontend)**, and **Mobile App (Expo React Native)**.

### System Requirements
*   Node.js `v20` or higher
*   PostgreSQL database (a local instance or a Supabase cloud database is recommended)

### Step 1: Clone the Repo and Install Dependencies
```bash
# Download the project to your machine
git clone https://github.com/fatmanurkaragozz/TART.git
cd TART

# Install shared packages in the root and web frontend
npm install
```

### Step 2: Configure Environment Variables
Copy the template in the root directory and fill in your real database and email credentials:
```bash
cp .env.example .env
```
Open `.env` in a code editor and set your database URLs (`DATABASE_URL`, `DIRECT_URL`), your JWT secret (`JWT_SECRET`), and your SMTP credentials for sending email.

### Step 3: Create the Database Schema and Tables
Use Prisma ORM to create the tables and update your database:
```bash
npx prisma generate
npx prisma migrate dev
```

### Step 4: Start the Apps

#### A. Run the Server & Web Frontend (from the root directory)
```bash
# Start the backend server (http://localhost:5000)
npm run server

# Start the web frontend (Vite - http://localhost:5173)
npm run dev
```

#### B. Run the Mobile App (Expo - `mobile` directory)
To run the mobile app, switch to the `mobile` directory in a new terminal window:
```bash
cd mobile
npm install

# Start the Expo development server
npm run start
```
*   **For Android:** Press `a` on your keyboard (requires an Android Emulator or a connected physical device).
*   **For iOS:** Press `i` on your keyboard (requires macOS and Xcode).
*   **With a QR Code:** Install the **Expo Go** app on your phone and scan the QR code shown on screen to run it instantly on your own device.

---

## 🏗️ Architecture

TART's backend is built with the industry-standard **Layered Architecture** pattern:

```
TART/
├── 📁 prisma/                 # Prisma schemas and migrations
│   └── schema.prisma          # Carefully designed PostgreSQL models
│
├── 📁 server/                 # Server layer (Node.js & Express)
│   ├── routes/                # Route / endpoint definitions (API router)
│   ├── controllers/           # Layer that receives HTTP requests and manages responses
│   ├── services/               # Service layer where core business logic runs
│   ├── middleware/            # JWT auth checks, Morgan error loggers
│   ├── config/                # Database connection initializers (Prisma Client)
│   └── utils/                 # Error objects (ApiError), helper utilities
│
├── 📁 src/                    # Web UI (React 19 + Vite 6 + TS)
│   ├── app/
│   │   ├── pages/             # Login, Register, Home, Contact, Profile...
│   │   └── components/        # Reusable premium UI elements
│   ├── services/               # Axios-based client API services
│   └── lib/                   # Interceptor mechanism that auto-attaches JWT
│
└── 📁 mobile/                 # Mobile UI (React Native + Expo Router + NativeWind)
    ├── app/                   # Expo Router-based routes and tabs
    ├── src/
    │   ├── services/          # Mobile-specific API service layer
    │   └── components/        # Mobile screen components
    └── assets/                # Media and design assets
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|:---:|---|---|:---:|
| `POST` | `/api/v1/auth/register` | Register a new user | Public |
| `POST` | `/api/v1/auth/login` | User login (returns JWT) | Public |
| `POST` | `/api/v1/auth/forgot-password` | Send password reset email | Public |
| `POST` | `/api/v1/auth/reset-password` | Save new password | Public |
| `GET` | `/api/v1/discussions` | List all discussions | Public |
| `POST` | `/api/v1/discussions` | Create a new discussion | Auth required |
| `GET` | `/api/v1/discussions/:id` | Get discussion detail with comments | Public |
| `PUT` | `/api/v1/discussions/:id` | Update a discussion (author/admin only) | Auth required |
| `POST` | `/api/v1/comments` | Post a comment on a discussion | Auth required |
| `POST` | `/api/v1/discussions/:id/vote` | Vote on a discussion (Upvote/Downvote) | Auth required |

---

## 🗺️ Roadmap

The project went beyond its planned 12-week scope, successfully completing all critical and advanced features:

*   [x] **Phase 1 (Weeks 1-3):** Architecture setup, UI design, and JWT authentication
*   [x] **Phase 2 (Weeks 4-5):** Discussions, threaded comments, nested replies, and voting systems
*   [x] **Phase 3 (Weeks 6-7):** Follow system, profile pages, email integration, and mobile-web data sync
*   [x] **Phase 4 (Weeks 8-9):** Supabase RLS security hardening and database indexing optimizations (speed improvements)
*   [x] **Phase 5 (Weeks 10-11):** Mobile UI/UX polish (Expo Go + NativeWind), Azure CI/CD pipeline setup
*   [x] **Phase 6 (Week 12):** Open-source release and documentation (secure distribution via `.env.example`)

---

## 🤝 Contributing

Contributions are welcome! Use the [Issues](../../issues) tab to report a bug or suggest a feature — templates are available. See [CONTRIBUTING.md](CONTRIBUTING.md) for code-contribution details and process.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for third-party assets and their licenses.

---

<div align="center">
  <sub>Made with ☕, passion and genuine criticism · <strong>TART © 2026</strong></sub>
</div>
