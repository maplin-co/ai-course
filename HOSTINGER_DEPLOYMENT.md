# Hostinger Deployment Guide

## Overview

Hostinger doesn't support Docker Compose deployments. This guide provides alternative deployment strategies for your AI Course Platform.

## Recommended Deployment Architecture

```
Frontend (Static Files) → Hostinger
Backend (FastAPI) → Railway/Render/Heroku
Database (PostgreSQL) → Neon/Supabase/ElephantSQL
```

---

## Step 1: Deploy Database (PostgreSQL)

### Option A: Neon (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Create a database named `learnflow`
4. Copy the connection string (format: `postgresql://user:password@host/database`)
5. Save this for backend configuration

### Option B: Supabase (Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Enable connection pooling for better performance

### Option C: ElephantSQL (Free Tier Available)

1. Go to [elephantsql.com](https://www.elephantsql.com)
2. Create a new instance (Tiny Turtle - Free)
3. Copy the connection URL
4. Note: Free tier has 20MB limit

---

## Step 2: Deploy Backend (FastAPI)

### Option A: Railway (Recommended)

1. **Install Railway CLI**:

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:

   ```bash
   railway login
   ```

3. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

4. **Initialize Railway project**:

   ```bash
   railway init
   ```

5. **Add environment variables in Railway Dashboard**:
   - `DATABASE_URL` - Your PostgreSQL connection string from Step 1
   - `POSTGRES_USER` - Database username
   - `POSTGRES_PASSWORD` - Database password
   - `POSTGRES_DB` - Database name (learnflow)
   - `SECRET_KEY` - Generate a secure random key
   - `CORS_ORIGINS` - Your Hostinger domain (e.g., <https://yourdomain.com>)

6. **Deploy**:

   ```bash
   railway up
   ```

7. **Get your backend URL** from Railway dashboard (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new **Web Service**
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
5. Add environment variables (same as Railway above)
6. Deploy and copy your service URL

### Option C: Heroku

1. **Install Heroku CLI**:

   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login**:

   ```bash
   heroku login
   ```

3. **Create app**:

   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set environment variables**:

   ```bash
   heroku config:set DATABASE_URL=your_postgres_url
   heroku config:set SECRET_KEY=your_secret_key
   heroku config:set CORS_ORIGINS=https://yourdomain.com
   ```

5. **Deploy**:

   ```bash
   git subtree push --prefix backend heroku main
   # OR if using a monorepo
   git push heroku main
   ```

---

## Step 3: Build Frontend for Hostinger

### 3.1 Update API Endpoint

1. **Find API configuration** in your frontend code:

   ```bash
   cd frontend/src
   ```

2. **Create/Update environment file** (`frontend/.env.production`):

   ```env
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

3. **Update API calls** to use the environment variable:

   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
   ```

### 3.2 Build the Frontend

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

   This creates a `build` folder with optimized static files.

---

## Step 4: Deploy to Hostinger

### 4.1 Prepare Files

1. **Locate your build folder**: `frontend/build`
2. **Contents should include**:
   - `index.html`
   - `static/` folder (CSS, JS, media)
   - Other assets

### 4.2 Upload to Hostinger

**Method 1: File Manager (Web Interface)**

1. Log in to Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html` folder
4. Delete default files (if any)
5. Upload all contents from `frontend/build` folder
6. Ensure `index.html` is in the root of `public_html`

**Method 2: FTP/SFTP**

1. Get FTP credentials from Hostinger:
   - Go to **Hosting** → **FTP Accounts**
   - Note: hostname, username, password, port

2. Use an FTP client (FileZilla, WinSCP):
   - **Host**: Your FTP hostname
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21 (FTP) or 22 (SFTP)

3. Connect and navigate to `public_html`
4. Upload all files from `frontend/build`

**Method 3: Git Deployment (if available)**

1. Some Hostinger plans support Git deployment
2. Check if available in your control panel
3. Connect your repository
4. Set build command: `cd frontend && npm install && npm run build`
5. Set publish directory: `frontend/build`

### 4.3 Configure .htaccess for React Router

Create a `.htaccess` file in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

---

## Step 5: Configure CORS

Update your backend CORS settings to allow requests from Hostinger:

1. **Edit `backend/server.py`** (or wherever CORS is configured):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://www.yourdomain.com",
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

1. **Redeploy backend** after making changes

---

## Step 6: Testing

### 6.1 Test Backend

1. Visit your backend URL: `https://your-backend.railway.app/docs`
2. Verify API documentation loads
3. Test a few endpoints

### 6.2 Test Frontend

1. Visit your Hostinger domain: `https://yourdomain.com`
2. Check browser console for errors (F12)
3. Test user registration/login
4. Test course creation
5. Verify API calls are working

### 6.3 Common Issues

**CORS Errors**:

- Check backend CORS configuration
- Ensure Hostinger domain is in `allow_origins`
- Verify backend is deployed and accessible

**404 Errors on Refresh**:

- Ensure `.htaccess` file is uploaded
- Check if mod_rewrite is enabled on Hostinger

**API Connection Failed**:

- Verify `REACT_APP_API_URL` is correct
- Check if backend is running
- Test backend URL directly in browser

---

## Step 7: Environment Variables Summary

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/learnflow
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=learnflow

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# AI Provider
OPENAI_API_KEY=sk_live_xxx

# Optional: Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Frontend Environment Variables

```env
# Production (.env.production)
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## Alternative: Deploy Everything to Vercel/Netlify

If Hostinger doesn't work well, consider these alternatives:

### Vercel (Recommended for Next.js/React)

1. Connect GitHub repository
2. Configure build settings:
   - **Framework**: Create React App
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
3. Add environment variables
4. Deploy

### Netlify

1. Connect GitHub repository
2. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
3. Add environment variables
4. Deploy

---

## Cost Breakdown (Free Tier Options)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Neon** | PostgreSQL Database | 10 GB storage, 1 project |
| **Railway** | Backend Hosting | $5 free credit/month |
| **Render** | Backend Hosting | 750 hours/month |
| **Hostinger** | Frontend Hosting | Depends on your plan |
| **Vercel** | Full-stack (alternative) | Unlimited personal projects |

---

## Next Steps

1. ✅ Set up PostgreSQL database (Neon/Supabase)
2. ✅ Deploy backend to Railway/Render
3. ✅ Build frontend with production API URL
4. ✅ Upload frontend to Hostinger
5. ✅ Configure CORS and test
6. ✅ Set up custom domain (if needed)
7. ✅ Enable SSL certificate on Hostinger

---

## Support

If you encounter issues:

1. **Check logs**:
   - Railway: View logs in dashboard
   - Hostinger: Check error logs in control panel
   - Browser: Check console (F12)

2. **Common fixes**:
   - Clear browser cache
   - Rebuild and redeploy frontend
   - Restart backend service
   - Check environment variables

3. **Get help**:
   - Railway Discord: [discord.gg/railway](https://discord.gg/railway)
   - Hostinger Support: Via control panel
   - Stack Overflow: Tag with `fastapi`, `react`, `deployment`

---

**Last Updated**: January 2026
**Version**: 1.0.0
