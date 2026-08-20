# 🎬 CINERA — Next-Gen AI-Powered Video Streaming Platform

Welcome to **CINERA**, a comprehensive, enterprise-ready, modular video streaming platform. Engineered with a cutting-edge hybrid architecture, CINERA features secure media streaming via Supabase signed URLs, a sub-second AI recommendation engine utilizing Google Gemini vector embeddings, subscription billing through Razorpay *(Under Process)*, smart notifications *(Under Process)*, real-time platform analytics, and a bespoke administrator CMS.

---

## 📌 Architecture & System Design

CINERA is designed using a multi-workspace structure, separating concerns cleanly into **Client**, **Server**, and **Admin Dashboard** directories.

```mermaid
graph TD
    %% Styling
    classDef clientStyle fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef adminStyle fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef serverStyle fill:#18181b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef externalStyle fill:#27272a,stroke:#f59e0b,stroke-width:1px,color:#fff;

    subgraph ClientWorkspace [Client Frontend App]
        UI[Framer Motion & Tailwind UI] -->|State / Actions| Zustand[Zustand Store]
        UI -->|API Hooks| RQ[React Query]
        RQ -->|HTTP / Axios| APIClient[Client API Handler]
    end

    subgraph AdminWorkspace [Admin Dashboard]
        AdminUI[CMS Panel & Recharts Analytics] -->|HTTP / Axios| AdminAPIClient[Admin API Handler]
    end

    subgraph ServerWorkspace [Express API Server]
        Router[API Route Orchestrator] --> AuthMiddleware[Auth & Subscription Guards]
        Router --> ContentCtrl[Content Controller]
        Router --> RecommendCtrl[AI Recommendation Controller]
        Router --> BillingCtrl["Razorpay Subscription Controller (Under Process)"]
        Router --> NotificationCtrl["Resend Email Controller (Under Process)"]
    end

    subgraph CoreServices [Data & AI Layer]
        SupabaseDB[Supabase DB / PostgreSQL]
        SupabaseStorage[Supabase Storage Buckets]
        GeminiAI[Google Gemini AI Embeddings]
        Razorpay["Razorpay Gateway (Under Process)"]
        Resend["Resend Mail Service (Under Process)"]
    end

    %% Interactions
    APIClient -->|Secure JSON Exchange| Router
    AdminAPIClient -->|Authorized Admin Exchange| Router
    
    ContentCtrl -->|Store Metadata / RPC Search| SupabaseDB
    ContentCtrl -->|Stream Signed URLs| SupabaseStorage
    ContentCtrl -->|Generate Movie Embeddings| GeminiAI
    
    RecommendCtrl -->|Execute Vector Similarity RPC| SupabaseDB
    
    BillingCtrl -->|Webhook & Subscriptions| Razorpay
    
    NotificationCtrl -->|System & Welcome Emails| Resend

    %% Class Assigns
    class UI,Zustand,RQ,APIClient clientStyle;
    class AdminUI,AdminAPIClient adminStyle;
    class Router,AuthMiddleware,ContentCtrl,RecommendCtrl,BillingCtrl,NotificationCtrl serverStyle;
    class SupabaseDB,SupabaseStorage,GeminiAI,Razorpay,Resend externalStyle;
```

---

## 🛠️ The Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Core Runtime** | Node.js (ESM) | High-performance, modular backend JavaScript runtime. |
| **Backend Framework** | Express.js (v5.1) | Fast, opinionated minimalist web framework for routing and middleware. |
| **Database & Auth** | Supabase | Postgres relational database, authentication provider, and object storage. |
| **User Frontend** | React (v19) + Vite | Extremely fast, reactive component architecture and builds. |
| **Admin Panel** | React (v19) + Vite + Recharts | Powerful interactive charts, analytics, and content CMS. |
| **Styling & UI** | Tailwind CSS (v4) | Utility-first styling framework with next-generation compiler. |
| **Animations** | Framer Motion | Smooth, organic interactions and fluid page/micro-transitions. |
| **State Management** | Zustand | Ultra-lightweight, high-performance central store for frontend state. |
| **Data Fetching** | TanStack React Query (v5) | Robust caching, synchronization, and automated UI state management. |
| **AI / Machine Learning** | Google Gemini Embeddings | `text-embedding-004` generates dense semantic vector representations. |
| **Payment Gateway** | Razorpay SDK *(Under Process)* | Enterprise subscription billing, orders, and secure webhook validation *(Under Process)*. |
| **Email Delivery** | Resend API *(Under Process)* | Low-latency transactional and marketing email pipeline *(Under Process)*. |

---

## 📁 Repository Structure

```
CINERA/
├── Client/                      # User-Facing Streaming App
│   ├── src/
│   │   ├── app/                 # Routing, Global Providers
│   │   ├── components/          # Reusable Layouts & UI Components
│   │   ├── features/            # Auth, Content, Search, History, Notifications (Under Process), Billing (Under Process), Player
│   │   ├── lib/                 # Axios configurations and SDK wrappers
│   │   └── styles/              # Global Tailwind styling configs
│   ├── package.json
│   └── vite.config.js
│
├── CINERA_ADMIN_DASHBOARD/      # Platform CMS & Admin Panel
│   ├── src/
│   │   ├── app/                 # Routes & Setup
│   │   ├── components/          # Dashboard layouts & navigation elements
│   │   ├── features/            # CMS Actions: Content, Genres, Analytics, Auth
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── Server/                      # Backend Express Application
    ├── Config/                  # Database connections & API client orchestrators
    ├── Controllers/             # Modular request/response pipeline controllers
    ├── Middlewares/             # JWT Auth, Admin, and Active Subscription check guards
    ├── Routes/                  # Endpoint routers (Content, Search, Stream, Billing, History, etc.)
    ├── Utils/                   # AI embedding helpers, Resend email senders, loggers
    ├── app.js                   # Application middlewares & CORS
    ├── server.js                # Port initialization and listener
    └── package.json
```

---

## ⚡ Core Features

1. **AI Recommendation System**: Generates embedding vectors for cinematic description metadata using **Google Gemini**. Executes cosine-similarity math inside Supabase via specialized Postgres functions (`RPC`) to fetch similar titles based on a movie or a user's tastes.
2. **Secure signed-URL Video Streaming**: Restricts video access. Signed streaming URLs are dynamically generated with a 1-hour expiration limit, stopping direct resource extraction.
3. **Enterprise Subscriptions (Razorpay) [Under Process]**: Integrates deep Razorpay subscription schemas with a reliable, raw-body parsed webhook handling system to process payment updates in real-time.
4. **Platform-Wide CMS & Analytics**: Enables content publishers to upload movies, tag metadata, define custom subscription plans *(Under Process)*, manage genres, and inspect overall platform activity through real-time charts.
5. **Smart Notifications & Transactional Emails [Under Process]**: Sends transactional updates (such as passwords, plans, and receipts) using the **Resend API**.

---

## ⚙️ Environment Variables & Configuration

To run CINERA locally, create a `.env` file in the directories specified below.

### 1. Backend Server (`Server/.env`)
```env
PORT=5000
NODE_ENV=development

# Supabase Credentials
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_KEY=<your-secret-service-role-key>
SUPABASE_ANON_KEY=<your-anon-public-key>

# JWT Keys
JWT_SECRET=<your-user-jwt-secret-string>
ADMIN_JWT_SECRET=<your-admin-jwt-secret-string>
JWT_EXPIRES_IN=2h

# Google AI & OAuth
GEMINI_API_KEY=<your-google-gemini-api-key>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>

# Transactional Emails (Under Process)
RESEND_API_KEY=<your-resend-api-key>

# Payments Integration (Under Process)
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-razorpay-webhook-secret>

# Cors
FRONTEND_URL=http://localhost:5173
```

### 2. Client Application (`Client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Admin Dashboard (`CINERA_ADMIN_DASHBOARD/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

Follow these steps to run all CINERA components locally.

### Step 1: Install Dependencies
Navigate into each module folder and install the required Node modules:
```bash
# Install Server modules
cd Server && npm install

# Install Client modules
cd ../Client && npm install

# Install Admin Dashboard modules
cd ../CINERA_ADMIN_DASHBOARD && npm install
```

### Step 2: Running the Server
Run the Express backend with hot-reload enabled via Nodemon:
```bash
cd Server
npm run dev
```
The server will boot and run on `http://localhost:5000`.

### Step 3: Running the Client Frontend
Launch the user-facing application:
```bash
cd Client
npm run dev
```
The application will boot and run on `http://localhost:5173`.

### Step 4: Running the Admin Dashboard
Launch the admin CMS and analytics platform:
```bash
cd CINERA_ADMIN_DASHBOARD
npm run dev
```
The platform will boot and run on another free local port (usually `http://localhost:5174` or configured accordingly).

---

## 🗄️ Database & RPC Requirements

CINERA utilizes highly optimized Supabase PostgreSQL database tables and Remote Procedure Calls (RPCs). Below is the list of requirements for deployment:

### Required Tables
- `content` — Movie metadata, duration, tags, embeddings vector.
- `plans` — Platform-wide subscription pricing configurations *(Under Process)*.
- `subscriptions` — User payment profiles, expiry dates, and billing states *(Under Process)*.
- `favorites` — User bookmark records.
- `watch_history` — User progress tracking across videos.
- `user_taste` — Dynamic user search behavior and interest markers.
- `notifications` — In-app alerts queue *(Under Process)*.
- `password_reset_codes` — Temporary secure keys for credential recovery.
- `admins` — Credentials for dashboard operators.
- `analytics` — Page views, interactions, and generic session metrics.

### Required Database RPC Functions
- `match_content` — Executes cosine similarity vector math to retrieve matching content vectors.
- `recommend_for_user` — Resolves and orders titles closest to a user's recent favorites and watch history.
- `search_fulltext` — Standard text search index querying.
- `get_trending_content` / `get_popular_content` — Analytics aggregates measuring view counts and likes over the last 30 days.

---

## 🛡️ License & Attributions

This project is proprietary. Developed by the CINERA team for high-throughput video delivery.

* **Created by Developer:** Durga Prasad (Github: @Durgaprasad-Developer)
* For additional queries regarding Razorpay webhook structures or Supabase RPC scripts, see `/Server/backend.md`.