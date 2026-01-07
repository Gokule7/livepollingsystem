# Deployment Guide - Resilient Live Polling System

## Overview
This guide covers deploying the Resilient Live Polling System to production.

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Deployment platform accounts (Render/Railway for backend, Vercel/Netlify for frontend)

---

## Part 1: MongoDB Setup (Database)

### Using MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new organization and project

2. **Create Cluster**
   - Click "Build a Cluster"
   - Choose FREE tier (M0 Sandbox)
   - Select region closest to your users
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username and password (SAVE THESE!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your server's IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" in left sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Choose Driver: Node.js, Version: 4.1 or later
   - Copy connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your credentials
   - Add database name at the end:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/polling-system?retryWrites=true&w=majority
     ```

---

## Part 2: Backend Deployment

### Option A: Deploy to Render

1. **Prepare Repository**
   ```bash
   # In backend folder, ensure package.json has start script
   "scripts": {
     "start": "node src/server.js"
   }
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `polling-system-backend`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: Free

4. **Add Environment Variables**
   - In "Environment" tab, add:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/polling-system?retryWrites=true&w=majority
     PORT=5000
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```
   - Note: Update CORS_ORIGIN after frontend deployment

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://polling-system-backend.onrender.com`

### Option B: Deploy to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select "backend" as root directory

3. **Add Environment Variables**
   - Go to "Variables" tab
   - Add all environment variables (same as Render)

4. **Deploy**
   - Railway auto-deploys
   - Get your URL from "Settings" → "Domains"

---

## Part 3: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

1. **Update Environment Variables**
   - In `frontend/.env`:
     ```env
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
     ```

2. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Create React App
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`

4. **Add Environment Variables**
   - In "Environment Variables" section:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Get your URL: `https://your-project.vercel.app`

6. **Update Backend CORS**
   - Go back to backend deployment
   - Update `CORS_ORIGIN` to your Vercel URL
   - Redeploy backend

### Option B: Deploy to Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up with GitHub

2. **Create Build Configuration**
   - In `frontend/` create `netlify.toml`:
     ```toml
     [build]
       base = "frontend"
       command = "npm run build"
       publish = "build"

     [[redirects]]
       from = "/*"
       to = "/index.html"
       status = 200
     ```

3. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select repository
   - Build settings auto-detected

4. **Add Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add same variables as Vercel

5. **Deploy**
   - Click "Deploy site"
   - Get your URL and update backend CORS

---

## Part 4: Verification

### Test Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend-url.onrender.com/health
   # Should return: {"status":"OK","message":"Server is running"}
   ```

2. **Test Frontend**
   - Open `https://your-frontend-url.vercel.app`
   - Should see role selection screen

3. **Test Complete Flow**
   - Open as Teacher in one browser
   - Open as Student in another browser
   - Create poll and verify real-time updates

4. **Test State Recovery**
   - Start a poll as teacher
   - Refresh the page
   - Poll should resume with correct time

5. **Test Database**
   - Create and complete a poll
   - Go to MongoDB Atlas
   - Check `polling-system` database
   - Verify `polls` and `votes` collections have data

---

## Part 5: Post-Deployment

### Monitor Application

1. **Backend Logs**
   - Render: Dashboard → Logs tab
   - Railway: Dashboard → Deployments → View logs

2. **Database Monitoring**
   - MongoDB Atlas Dashboard
   - Check "Metrics" tab
   - Monitor connections and operations

### Custom Domain (Optional)

1. **Vercel**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records

2. **Render**
   - Go to "Settings" → "Custom Domains"
   - Add domain
   - Update DNS records

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/polling-system
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SOCKET_URL=https://your-backend.onrender.com
```

---

## Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to MongoDB"
- Solution: Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check username/password

**Problem**: "CORS error"
- Solution: Verify CORS_ORIGIN matches frontend URL exactly
- Include protocol (https://)
- No trailing slash

**Problem**: "Application error" on Render
- Solution: Check logs
- Verify all environment variables set
- Ensure package.json has correct start script

### Frontend Issues

**Problem**: "Cannot connect to backend"
- Solution: Check REACT_APP_SOCKET_URL is correct
- Verify backend is running
- Check browser console for errors

**Problem**: Build fails
- Solution: Check for missing dependencies
- Verify all imports are correct
- Check for syntax errors

**Problem**: WebSocket connection fails
- Solution: Ensure backend supports WebSocket
- Check for proxy/firewall blocking WebSocket
- Verify Socket.io versions match

---

## Free Tier Limitations

### MongoDB Atlas (Free M0)
- 512 MB storage
- Shared RAM
- Enough for 1000s of polls

### Render (Free)
- Spins down after 15 minutes of inactivity
- Cold starts take 30-60 seconds
- 750 hours/month

### Vercel (Free)
- 100 GB bandwidth/month
- Unlimited deployments
- Fast CDN

### Railway (Free Trial)
- $5 credit
- Pay-as-you-go after

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for any IP)
- [ ] Backend deployed to Render/Railway
- [ ] Backend environment variables set
- [ ] Backend health endpoint responding
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend environment variables set
- [ ] Backend CORS_ORIGIN updated with frontend URL
- [ ] Teacher flow tested (create poll, view results)
- [ ] Student flow tested (join, vote, view results)
- [ ] State recovery tested (page refresh during poll)
- [ ] Chat feature tested
- [ ] Poll history verified in database

---

## Next Steps

1. Share the frontend URL with users
2. Monitor usage via platform dashboards
3. Check database growth in MongoDB Atlas
4. Consider upgrading to paid tiers for production use
5. Set up custom domain for professional appearance

## Support

For deployment issues:
- Render: [docs.render.com](https://docs.render.com)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
