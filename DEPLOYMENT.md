# Deployment Guide

This guide explains how to deploy the Employee Attendance System to production.

## Architecture

The application consists of two parts:
1. **Frontend** (React) - Can be deployed on Vercel, Netlify, or any static hosting
2. **Backend** (Node.js/Express) - Needs a Node.js hosting service (Render, Railway, Heroku, etc.)

## Option 1: Deploy Frontend on Vercel + Backend on Render (Recommended)

### Step 1: Deploy Backend on Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service:**
   - **Name:** attendance-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

4. **Add Environment Variables:**
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

5. **Deploy** - Render will automatically deploy your backend

6. **Note the URL:** You'll get a URL like `https://attendance-backend.onrender.com`

### Step 2: Deploy Frontend on Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**

3. **Configure the project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://attendance-backend.onrender.com/api
   ```

5. **Update frontend/vercel.json** with your backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://attendance-backend.onrender.com/api/$1"
       }
     ]
   }
   ```

6. **Deploy** - Vercel will automatically deploy your frontend

## Option 2: Deploy Both on Vercel

Vercel can also host the backend using Serverless Functions, but it requires some modifications.

### Backend Deployment on Vercel

1. Create `api/index.js` in the root:
   ```javascript
   const express = require('express');
   const app = express();
   
   // Import your routes
   app.use('/auth', require('../backend/routes/auth'));
   app.use('/attendance', require('../backend/routes/attendance'));
   app.use('/dashboard', require('../backend/routes/dashboard'));
   
   module.exports = app;
   ```

2. Update `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       },
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "api/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/$1"
       }
     ]
   }
   ```

## Option 3: Deploy Backend on Railway

1. **Sign up** at [railway.app](https://railway.app)

2. **Create New Project** → "Deploy from GitHub repo"

3. **Select your repository**

4. **Configure:**
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`

5. **Add Environment Variables** (same as Render)

6. **Deploy** - Railway will provide a URL

## Option 4: Deploy Backend on Heroku

1. **Install Heroku CLI** and login

2. **Create Heroku app:**
   ```bash
   cd backend
   heroku create attendance-backend
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   heroku config:set JWT_EXPIRE=7d
   heroku config:set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## MongoDB Atlas Setup (Required for Production)

1. **Create MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster** (Free tier M0)

3. **Create database user:**
   - Database Access → Add New User
   - Create username and password

4. **Whitelist IP addresses:**
   - Network Access → Add IP Address
   - For production, add `0.0.0.0/0` (allows all IPs) or specific server IPs

5. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add database name: `/attendance_system`

## Common Deployment Issues

### 404 Error on Vercel

**Problem:** Getting 404 errors when accessing routes

**Solution:**
1. Ensure `vercel.json` has proper rewrites
2. Check that `REACT_APP_API_URL` is set correctly
3. Make sure backend is deployed and accessible
4. Check browser console for API errors

### CORS Errors

**Problem:** CORS errors when frontend calls backend

**Solution:**
Update `backend/server.js` to allow your frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### MongoDB Connection Errors

**Problem:** Cannot connect to MongoDB

**Solution:**
1. Check MongoDB Atlas IP whitelist includes your server IP
2. Verify connection string is correct
3. Ensure database user has proper permissions

### Environment Variables Not Working

**Problem:** Environment variables not being read

**Solution:**
1. Restart the deployment after adding env vars
2. For Vercel, ensure variables start with `REACT_APP_` for frontend
3. Check variable names match exactly (case-sensitive)

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend environment variable `REACT_APP_API_URL` points to backend
- [ ] MongoDB Atlas is configured and accessible
- [ ] CORS is configured for frontend domain
- [ ] Test login functionality
- [ ] Test attendance check-in/out
- [ ] Verify API endpoints are working

## Quick Deploy Commands

### Render (Backend)
```bash
# Just connect GitHub repo and configure in dashboard
```

### Vercel (Frontend)
```bash
npm i -g vercel
cd frontend
vercel
# Follow prompts
```

### Heroku (Backend)
```bash
cd backend
heroku create attendance-backend
git push heroku main
```

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB connection
5. Review CORS settings

