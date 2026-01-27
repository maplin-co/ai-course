# Deployment Settings Guide

Use this guide to configure your application for **any** domain.

## Frontend Settings (Hostinger / Vercel / Netlify)

### 1. Environment Variables

Create a file named `.env.production` in your `frontend` folder **before building**.

```env
# URL where your backend is hosted (Railway, Render, VPS)
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 2. package.json "homepage"

If your site is in a subdirectory (e.g., `example.com/course`), add this to `frontend/package.json`:

```json
"homepage": "https://example.com/course",
```

*If hosting on the root domain (e.g., `example.com`), you do NOT need this.*

---

## Backend Settings (Railway / Render / Heroku)

Set these **Variable Keys** in your hosting dashboard:

| Variable Key | Value Example | Description |
| :--- | :--- | :--- |
| `CORS_ORIGINS` | `https://your-frontend-domain.com,http://localhost:3000` | Domains allowed to access API |
| `PORT` | `8080` | Internal port (Default: 8080) |
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Database connection string |
| `SECRET_KEY` | `super_secret_random_string` | Used for security/auth |

---

## Database (Neon / Supabase)

Ensure your `DATABASE_URL` is correct. The backend will automatically create the `courses` table on startup.
