Perfect bro — here is the **FULL backend README converted into clean Markdown**, ready to **copy-paste directly into `backend.README.md`** or any `.md` file in your GitHub repo.

---

# ✅ **FULL BACKEND README (Markdown Version)**

Copy-paste this **exactly** into your `backend.README.md` file.

---

```markdown
# CINERA — Backend Documentation
Backend README for the CINERA Streaming Platform  
(Node.js + Supabase + Razorpay + AI Embeddings).

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

- Authentication for Users & Admin
- AI-powered recommendation engine (content embeddings + vector matching)
- Streaming via Supabase signed URLs
- Watch history, favorites, likes
- Razorpay payments & subscriptions
- Strong search system (full text + vector semantic + partial match)
- Notification & Email system (Resend)
- Admin analytics, CMS, and dashboard

The backend is modular and follows MVC + clean route design.

---

# Tech Stack
- **Node.js (ESM)**
- **Express.js**
- **Supabase** (DB + Auth Admin + Storage + RPC)
- **Razorpay API**
- **Google Gemini (`text-embedding-004`)**
- **JWT Authentication**
- **Resend Email API**
- `helmet`, `cors`, `morgan`, `cookie-parser`

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
- Admin logs in via `POST /api/auth/login`
- If in `admins` table → JWT signed using `ADMIN_JWT_SECRET`
- Required on all admin routes using:
```

Authorization: Bearer <ADMIN_JWT>

````

## User Auth
- Users login → server sets cookie `cinera_auth`
- `verifyUser` middleware validates JWT cookie

## Subscription Auth
`verifySubscription` checks:
- Subscription exists
- status = active
- expiry_date ≥ now()

---

# Unified Endpoint List

## Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/status` | Check admin auth |
| GET | `/api/admin/dashboard` | Analytics stats |
| POST | `/api/admin/genres` | Create genre |
| GET | `/api/admin/genres` | List genres |
| DELETE | `/api/admin/genres/:id` | Delete genre |
| POST | `/api/admin/plans` | Create plan |
| GET | `/api/admin/plans` | List plans |
| PUT | `/api/admin/plans/:id` | Update plan |
| DELETE | `/api/admin/plans/:id` | Delete plan |

---

## Content (Admin)
| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/content` |
| POST | `/api/admin/content` |
| PUT | `/api/admin/content/:id` |
| DELETE | `/api/admin/content/:id` |
| PUT | `/api/admin/content/:id/publish` |
| PUT | `/api/admin/content/:id/unpublish` |

---

## Uploads (Admin)
| POST | `/api/admin/upload/upload-url` |

---

## User
| Method | Endpoint |
|--------|----------|
| POST | `/api/user/signup` |
| POST | `/api/user/login` |
| POST | `/api/user/google` |
| POST | `/api/user/logout` |
| POST | `/api/user/forgot-password` |
| POST | `/api/user/reset-password` |
| GET | `/api/user/profile` |

---

## Billing / Payments
| Method | Endpoint |
|--------|----------|
| POST | `/api/billing/create-order` |
| POST | `/api/billing/verify` |
| GET | `/api/billing/status` |
| GET | `/api/billing/history` |
| POST | `/api/billing/create-payment-link` |
| POST | `/api/billing/webhook/razorpay` |

---

## Streaming
| GET | `/api/stream/:id` |

---

## Home (Trending, Popular, Recent)
| GET | `/api/home/trending` |
| GET | `/api/home/popular` |
| GET | `/api/home/recent` |
| GET | `/api/home/genre/:genre` |

---

## Search
| GET | `/api/search?q=` |

---

## Recommendations
| GET | `/api/recommendations/content/:id/similar` |
| GET | `/api/recommendations/personal` |
| GET | `/api/recommendations/because` |

---

## History
| Method | Endpoint |
|--------|----------|
| POST | `/api/user/history` |
| GET | `/api/user/history` |
| GET | `/api/user/history/continue` |
| GET | `/api/user/history/:contentId` |

---

## Favorites
| Method | Endpoint |
|--------|----------|
| POST | `/api/user/favorites/like` |
| DELETE | `/api/user/favorites/like/:contentId` |
| POST | `/api/user/favorites/favorite` |
| DELETE | `/api/user/favorites/favorite/:contentId` |
| GET | `/api/user/favorites` |
| GET | `/api/user/favorites/likes` |

---

## Notifications
| GET | `/api/notifications` |
| GET | `/api/notifications/test-email` |

---

# Detailed Endpoint Documentation

---

## Admin Login  
### POST `/api/auth/login`
**Body**
```json
{ "email": "admin@example.com", "password": "secret" }
````

**Response**

```json
{
  "message": "Admin login success",
  "token": "<ADMIN_JWT>"
}
```

---

## Create Content

### POST `/api/admin/content`

Generates an AI embedding using **Google Gemini**.

**Body**

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

## Signed Streaming URL

### GET `/api/stream/:id`

Returns a signed Supabase URL valid for **1 hour**.

```json
{
  "success": true,
  "streamUrl": "https://supabase...signedurl..."
}
```

---

## Billing — Create Razorpay Order

### POST `/api/billing/create-order`

```json
{ "plan_id": 1 }
```

---

## Billing — Verify Payment

### POST `/api/billing/verify`

Verifies signature & activates subscription.

---

## Recommendations

### GET `/api/recommendations/personal`

Uses:

* user_taste vector
* trending fallback
* removes completed items

---

# Middlewares

### `verifyUser`

Validates cookie-based JWT.

### `verifyAdmin`

Requires:

```
Authorization: Bearer <token>
```

### `verifySubscription`

Ensures subscription is active & not expired.

---

# Utilities

### Embeddings

`generateEmbedding(text)`
Uses Gemini model: `text-embedding-004`.

### Email

`sendEmail({...})`
Uses Resend API (must configure after deployment).

### Analytics

All important actions tracked in `analytics` table.

---

# Supabase Tables & RPC Requirements

### Required Tables:

* content
* plans
* subscriptions
* favorites
* watch_history
* analytics
* notifications
* user_taste
* password_reset_codes
* admins

### Required RPC Functions:

* match_content
* recommend_for_user
* generate_query_embedding
* search_fulltext
* get_trending_content
* get_popular_content
* views_last_30_days
* completion_rate
* watch_time_per_content
* genre_popularity

---

# Billing & Razorpay Webhook Guide

Webhook endpoint:

```
POST /api/billing/webhook/razorpay
```

### ⚠️ MUST use raw body parser:

```js
app.post("/api/billing/webhook/razorpay",
  express.raw({ type: "application/json" })
)
```

### Workflow

* Validate signature using `RAZORPAY_WEBHOOK_SECRET`
* Activate subscription on events:

  * `payment.captured`
  * `order.paid`

---

# Streaming Signed URLs

* Stored path:
  `bucket/path/file.mp4`
* Signed for **1 hour**
* Generated using Supabase Storage

---

# Recommendation Engine

Uses:

* **AI embeddings** from Gemini
* **Vector RPC** match_content
* Full text search
* Partial search
* Hybrid scoring (text + vector + partial)

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

Global handler logs all unhandled exceptions.

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

Use ngrok to expose local server.

---

# Deployment Notes

* Set **secure cookies** in production:

```
secure: true
sameSite: "none"
```

* Limit CORS to trusted domains
* Never expose `SUPABASE_SERVICE_KEY`
* Webhook must be HTTPS
* Configure Resend sending domain

---

# Troubleshooting

### ❌ Webhook signature invalid

→ Raw body parser not applied.

### ❌ Embedding missing

→ Ensure GEMINI_API_KEY is valid.

### ❌ Google login fail

→ Wrong GOOGLE_CLIENT_ID.

### ❌ RPC errors

→ Create RPCs in Supabase SQL editor.

---

# 🎉 End of CINERA Backend README

```

---

## ✅ Your Markdown file is ready.

If you want, I can also:

✅ Generate a **Postman Collection JSON**  
✅ Create **API diagrams**  
✅ Create a **Swagger/OpenAPI** documentation file  

Just tell me bro 🔥
```
