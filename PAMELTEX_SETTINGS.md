# Pameltex.com Deployment Settings

Use these exact settings when configuring your hosting environments.

## 1. Frontend (Hostinger)

**File:** `frontend/package.json`  
**Setting:** `homepage`  
**Value:** `https://www.pameltex.com`

**Environment Variables (.env.production)**  
*Create this file in the frontend folder before building*

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
# Replace with your actual backend URL after deploying backend
```

## 2. Backend (Railway / Render / Heroku)

**Environment Variables (Dashboard)**

| Variable | Value | Description |
| :--- | :--- | :--- |
| `CORS_ORIGINS` | `https://www.pameltex.com,https://pameltex.com,http://localhost:3000` | Allows your site to talk to the backend |
| `PORT` | `8080` | Required port |
| `DATABASE_URL` | *(Your PostgreSQL String)* | e.g. from Neon/Supabase |
| `SECRET_KEY` | *(Random String)* | Security key for passwords |

## 3. Database (Neon / Supabase)

Ensure your database is active and provides a PostgreSQL connection string starting with `postgresql://`.
