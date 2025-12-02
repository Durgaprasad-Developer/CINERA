Here you go bro — **your entire text converted into clean, proper GitHub-ready Markdown.**
I removed the outer triple backticks (since it was wrapped incorrectly) and converted *everything* into a **proper `.md` document** you can directly copy-paste into `backend.README.md`.

---

# ✅ **CINERA — Backend Documentation (Final GitHub Markdown)**

Below is your **fully cleaned & corrected Markdown README**.

---

# CINERA — Backend Documentation

Backend README for the **CINERA Streaming Platform**
*(Node.js + Supabase + Razorpay + AI Embeddings)*

---

## 📌 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Environment Variables](#environment-variables)
5. [Authentication (Admin + User)](#authentication-admin--user)
6. [Unified Endpoint List](#unified-endpoint-list)
7. [Detailed Endpoint Documentation](#detailed-endpoint-documentation)
8. [Middlewares](#middlewares)
9. [Utilities](#utilities)
10. [Supabase Tables & RPC Requirements](#supabase-tables--rpc-requirements)
11. [Billing & Razorpay Webhook Guide](#billing--razorpay-webhook-guide)
12. [Streaming Signed URLs](#streaming-signed-urls)
13. [Recommendation Engine](#recommendation-engine)
14. [Error Handling](#error-handling)
15. [Testing Guide](#testing-guide)
16. [Deployment Notes](#deployment-notes)
17. [Troubleshooting](#troubleshooting)

---

# Overview

CINERA Backend powers a scalable streaming platform with:

* User & Admin authentication
* AI-powered recommendation engine (Gemini + vector search)
* Supabase signed URL video streaming
* Watch history, favorites, likes
* Razorpay payments & subscriptions
* Strong search (full-text + vector + partial match)
* Notification & Email system
* Admin CMS panel + analytics

Backend follows **clean modular MVC architecture**.

---

# Tech Stack

* **Node.js (ESM)**
* **Express.js**
* **Supabase** (DB + Auth + Storage + RPC)
* **Razorpay API**
* **Google Gemini (`text-embedding-004`)**
* **JWT Authentication**
* **Resend Email API**
* Helmet, CORS, Morgan, Cookie-parser

---

# Folder Structure

```
Server/
├── Controllers/
├── Middlewares/
├── Routes/
├── Utils/
├── Config/
├── app.js
├── server.js
└── backend.README.md
```

---

# Environment Variables

```
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# JWT
JWT_SECRET=
ADMIN_JWT_SECRET=

# Server
PORT=5000
NODE_ENV=development

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# AI / Google
GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
```

---

# Authentication (Admin + User)

## Admin Auth

* Admin logs in via `POST /api/auth/login`
* Signed with `ADMIN_JWT_SECRET`

Header:

```
Authorization: Bearer <ADMIN_JWT>
```

## User Auth

* Login sets cookie `cinera_auth`
* `verifyUser` middleware validates JWT

## Subscription Auth

Checks:

* subscription exists
* status = active
* expiry_date >= now()

---

# Unified Endpoint List

## Admin Routes

| Method | Endpoint                | Description      |
| ------ | ----------------------- | ---------------- |
| POST   | `/api/auth/login`       | Admin login      |
| GET    | `/api/admin/status`     | Check admin auth |
| GET    | `/api/admin/dashboard`  | Analytics        |
| POST   | `/api/admin/genres`     | Add genre        |
| GET    | `/api/admin/genres`     | List genres      |
| DELETE | `/api/admin/genres/:id` | Delete genre     |
| POST   | `/api/admin/plans`      | Create plan      |
| PUT    | `/api/admin/plans/:id`  | Update plan      |
| DELETE | `/api/admin/plans/:id`  | Delete           |

---

## Content (Admin)

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| GET    | `/api/admin/content`               |
| POST   | `/api/admin/content`               |
| PUT    | `/api/admin/content/:id`           |
| DELETE | `/api/admin/content/:id`           |
| PUT    | `/api/admin/content/:id/publish`   |
| PUT    | `/api/admin/content/:id/unpublish` |

---

## Uploads

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | `/api/admin/upload/upload-url` |

---

## User Auth & Profile

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | `/api/user/signup`          |
| POST   | `/api/user/login`           |
| POST   | `/api/user/google`          |
| POST   | `/api/user/logout`          |
| POST   | `/api/user/forgot-password` |
| POST   | `/api/user/reset-password`  |
| GET    | `/api/user/profile`         |

---

## Billing / Payments

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| POST   | `/api/billing/create-order`        |
| POST   | `/api/billing/verify`              |
| GET    | `/api/billing/status`              |
| GET    | `/api/billing/history`             |
| POST   | `/api/billing/create-payment-link` |
| POST   | `/api/billing/webhook/razorpay`    |

---

## Streaming

```
GET /api/stream/:id
```

---

## Home

| Endpoint                 |
| ------------------------ |
| `/api/home/trending`     |
| `/api/home/popular`      |
| `/api/home/recent`       |
| `/api/home/genre/:genre` |

---

## Search

```
GET /api/search?q=
```

---

## Recommendations

| Endpoint                                   |
| ------------------------------------------ |
| `/api/recommendations/content/:id/similar` |
| `/api/recommendations/personal`            |
| `/api/recommendations/because`             |

---

## Watch History

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | `/api/user/history`            |
| GET    | `/api/user/history`            |
| GET    | `/api/user/history/continue`   |
| GET    | `/api/user/history/:contentId` |

---

## Favorites

| Method | Endpoint                                  |
| ------ | ----------------------------------------- |
| POST   | `/api/user/favorites/like`                |
| DELETE | `/api/user/favorites/like/:contentId`     |
| POST   | `/api/user/favorites/favorite`            |
| DELETE | `/api/user/favorites/favorite/:contentId` |
| GET    | `/api/user/favorites`                     |
| GET    | `/api/user/favorites/likes`               |

---

## Notifications

| Method | Endpoint                        |
| ------ | ------------------------------- |
| GET    | `/api/notifications`            |
| GET    | `/api/notifications/test-email` |

---

# Detailed Endpoint Documentation

---

## Admin Login

### `POST /api/auth/login`

**Body:**

```json
{ "email": "admin@example.com", "password": "secret" }
```

**Response:**

```json
{
  "message": "Admin login success",
  "token": "<ADMIN_JWT>"
}
```

---

## Create Content

### `POST /api/admin/content`

Generates embedding using **Gemini**.

**Body:**

```json
{
  "title": "Movie Title",
  "description": "Desc",
  "tags": ["drama"],
  "genre": "Drama",
  "storage_path": "videos/file.mp4",
  "thumbnail": "thumb.jpg",
  "duration_seconds": 120,
  "published": false
}
```

---

## Streaming (Signed URL)

### `GET /api/stream/:id`

Returns signed URL valid for 1 hour.

```json
{
  "success": true,
  "streamUrl": "https://supabase...signed..."
}
```

---

# Billing

### Create Order

`POST /api/billing/create-order`

### Verify Payment

`POST /api/billing/verify`

---

# Middlewares

* **verifyUser** — JWT cookie
* **verifyAdmin** — Admin JWT
* **verifySubscription** — Checks active plan

---

# Utilities

* `generateEmbedding()` – Gemini
* `sendEmail()` – Resend
* Analytics tracking

---

# Supabase Tables & RPC

### Required Tables

* content
* plans
* subscriptions
* favorites
* watch_history
* analytics
* user_taste
* notifications
* password_reset_codes
* admins

### Required RPC Functions

* match_content
* recommend_for_user
* generate_query_embedding
* search_fulltext
* get_trending_content
* get_popular_content
* genre_popularity
* views_last_30_days

---

# Billing & Razorpay Webhook Guide

Webhook:

```
POST /api/billing/webhook/razorpay
```

### Must enable raw body parser:

```js
express.raw({ type: "application/json" })
```

---

# Streaming Signed URLs

* Generated via Supabase Storage
* Valid: 1 hour
* Stored path: `bucket/path/video.mp4`

---

# Recommendation Engine

Uses:

* AI embeddings
* Vector RPC match
* Full-text search
* Hybrid scoring

---

# Error Handling

| Type                  | Status |
| --------------------- | ------ |
| Validation            | 400    |
| Unauthorized          | 401    |
| Forbidden             | 403    |
| Subscription Required | 402    |
| Not Found             | 404    |
| Server Error          | 500    |

---

# Testing Guide (Postman)

### Admin Login

```
POST /api/auth/login
```

### User Login

```
POST /api/user/login
```

### Streaming Test

```
GET /api/stream/1
```

### Webhook Test

Use ngrok.

---

# Deployment Notes

* Use secure cookies:

```
secure: true
sameSite: "none"
```

* Restrict CORS
* Don't expose SERVICE_KEY
* Webhook must be HTTPS

---

# Troubleshooting

**Webhook invalid signature** → raw body missing
**Embedding errors** → check Gemini key
**Google login fail** → wrong client ID
**RPC errors** → create SQL RPCs

---

# 🎉 End of CINERA Backend README

