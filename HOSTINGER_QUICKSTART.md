# Quick Start: Hostinger Deployment

## Problem

Docker Compose is **not supported** by Hostinger. Hostinger is a shared hosting provider that primarily supports:

- Static HTML/CSS/JS files
- PHP applications  
- Node.js (on some plans)

## Solution

Deploy your application using a **split architecture**:

```text
┌─────────────────────────────────────────────────┐
│                                                 │
│  Frontend (React) → Hostinger                   │
│  Backend (FastAPI) → Railway/Render/Heroku      │
│  Database (PostgreSQL) → Neon/Supabase          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Quick Deployment Steps

### 1️⃣ Deploy Database (5 minutes)

#### Option: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up → Create project → Create database `learnflow`
3. Copy connection string: `postgresql://user:pass@host/db`
4. Save for later ✅

### 2️⃣ Deploy Backend (10 minutes)

#### Option: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize and deploy
railway init
railway up
```

**Add these environment variables in Railway Dashboard:**

- `DATABASE_URL` = Your Neon connection string
- `POSTGRES_USER` = Your database username
- `POSTGRES_PASSWORD` = Your database password
- `POSTGRES_DB` = learnflow
- `SECRET_KEY` = (generate random secure key)
- `CORS_ORIGINS` = <https://yourdomain.com>

**Copy your Railway URL** (e.g., `https://your-app.railway.app`) ✅

### 3️⃣ Build Frontend (5 minutes)

**Windows Users:**

```bash
cd frontend
.\prepare-hostinger.bat
```

**Mac/Linux Users:**

```bash
cd frontend
chmod +x prepare-hostinger.sh
./prepare-hostinger.sh
```

This will:

- Install dependencies
- Build production bundle
- Create .htaccess file
- Prepare files in `build/` folder ✅

### 4️⃣ Upload to Hostinger (10 minutes)

#### Method 1: File Manager (Easiest)

1. Log in to Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html` folder
4. Delete any existing files
5. Upload **ALL** files from `frontend/build/` folder
6. Make sure `.htaccess` is uploaded too

#### Method 2: FTP

1. Get FTP credentials from Hostinger
2. Use FileZilla or WinSCP
3. Connect to your hosting
4. Upload all files from `frontend/build/` to `public_html`

### 5️⃣ Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Open browser console (F12) to check for errors
3. Test user registration/login
4. Verify API calls are working

---

## Common Issues & Fixes

### ❌ CORS Error

**Problem:** Frontend can't connect to backend

**Fix:**

1. Update `backend/server.py` CORS settings:

```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

1. Redeploy backend: `railway up`

### ❌ 404 Error on Page Refresh

**Problem:** React Router not working

**Fix:**

- Ensure `.htaccess` file is uploaded to `public_html`
- Check if file is visible in File Manager
- If not, re-upload it

### ❌ API Connection Failed

**Problem:** Backend not responding

**Fix:**

1. Test backend URL directly: `https://your-backend.railway.app/docs`
2. Check if backend is running in Railway dashboard
3. Verify environment variables are set correctly

### ❌ Blank Page

**Problem:** Build files not loading

**Fix:**

1. Check browser console for errors
2. Verify all files from `build/` folder are uploaded
3. Check file permissions in Hostinger (should be 644 for files, 755 for folders)

---

## Environment Variables Checklist

### Backend (Railway Dashboard)

```env
✅ DATABASE_URL=postgresql://...
✅ POSTGRES_USER=your_user
✅ POSTGRES_PASSWORD=your_password
✅ POSTGRES_DB=learnflow
✅ SECRET_KEY=your_secret_key
✅ CORS_ORIGINS=https://yourdomain.com
```

### Frontend (Build Time)

If you need to configure API URL, create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-backend.railway.app
```

Then rebuild: `npm run build`

---

## Cost Breakdown (Free Tier)

| Service | Purpose | Free Tier |
| --- | --- | --- |
| **Neon** | PostgreSQL | 10 GB storage |
| **Railway** | Backend | $5 credit/month |
| **Hostinger** | Frontend | Your existing plan |

---

## Need Help?

1. **Check logs:**
   - Railway: Dashboard → Deployments → View Logs
   - Hostinger: Control Panel → Error Logs
   - Browser: F12 → Console tab

2. **Read full guide:**
   - See `HOSTINGER_DEPLOYMENT.md` for detailed instructions

3. **Test locally first:**

   ```bash
   # Backend
   cd backend
   uvicorn server:app --reload
   
   # Frontend
   cd frontend
   npm start
   ```

---

## Quick Commands Reference

```bash
# Build frontend for production
cd frontend
npm run build

# Deploy backend to Railway
cd backend
railway up

# Check Railway logs
railway logs

# Rebuild and redeploy
npm run build && railway up
```

---

**Last Updated:** January 2026  
**Status:** ✅ Production Ready

For detailed step-by-step instructions, see: **HOSTINGER_DEPLOYMENT.md**
