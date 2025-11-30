# Quick Vercel Deployment Guide

## The Problem
Vercel shows 404 errors because:
1. **Backend is not deployed** - Vercel only hosts the frontend
2. **API calls fail** - Frontend tries to call `localhost:5000` which doesn't exist in production

## Solution: Deploy Backend First, Then Frontend

### Step 1: Deploy Backend (Choose One)

#### Option A: Render (Easiest - Free)
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** attendance-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Deploy and **copy the URL** (e.g., `https://attendance-backend.onrender.com`)

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repo → Set root directory to `backend`
4. Add same environment variables
5. Copy the URL

### Step 2: Deploy Frontend on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login

2. **Import your GitHub repository**

3. **Configure Project Settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend` (IMPORTANT!)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Add Environment Variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
   (Replace with your actual backend URL from Step 1)

5. **Deploy!**

6. **After deployment, update backend CORS:**
   - Go back to Render/Railway
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

### Step 3: Test

1. Visit your Vercel URL
2. Try to login
3. Check browser console (F12) for any errors
4. If you see CORS errors, make sure `FRONTEND_URL` in backend matches your Vercel URL

## Quick Checklist

- [ ] Backend deployed on Render/Railway
- [ ] Backend URL copied
- [ ] MongoDB Atlas connection string ready
- [ ] Frontend deployed on Vercel
- [ ] `REACT_APP_API_URL` set in Vercel environment variables
- [ ] `FRONTEND_URL` set in backend environment variables
- [ ] Test login functionality

## Common Issues

### Still getting 404?
- Check that `REACT_APP_API_URL` is set correctly in Vercel
- Make sure backend is actually running (visit backend URL + `/api/health`)
- Check browser console for API errors

### CORS Errors?
- Update `FRONTEND_URL` in backend environment variables
- Redeploy backend after updating

### MongoDB Connection Failed?
- Check MongoDB Atlas IP whitelist includes Render/Railway IPs
- Or use `0.0.0.0/0` for all IPs (development only)

## Example Environment Variables

**Backend (Render):**
```
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/attendance_system
JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://attendance-system.vercel.app
```

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://attendance-backend.onrender.com/api
```

## Need Help?

1. Check deployment logs in Render/Vercel dashboard
2. Test backend API directly: `https://your-backend-url/api/health`
3. Check browser console for errors
4. Verify all environment variables are set

