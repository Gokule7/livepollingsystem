# Deployment Guide

## Backend Deployment on Render

### Step 1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster if you haven't already
3. Get your connection string (Database → Connect → Connect your application)
4. Whitelist all IPs: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Step 2: Deploy to Render
1. Go to [Render.com](https://render.com) and sign up/login with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Gokule7/Live_Polling_System`
4. Configure the service:
   - **Name**: `live-polling-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/polling-system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=*
   NODE_ENV=production
   PORT=5000
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://live-polling-backend.onrender.com`

## Frontend Deployment on Vercel

### Step 1: Update Environment Variables
1. In your frontend folder, create `.env.production`:
   ```env
   REACT_APP_API_URL=https://live-polling-backend.onrender.com
   REACT_APP_SOCKET_URL=https://live-polling-backend.onrender.com
   REACT_APP_TEACHER_PASSWORD=teacher123
   ```

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository: `Gokule7/Live_Polling_System`
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variables in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://live-polling-backend.onrender.com
   REACT_APP_SOCKET_URL=https://live-polling-backend.onrender.com
   REACT_APP_TEACHER_PASSWORD=teacher123
   ```

6. Click **"Deploy"**
7. Wait for deployment (3-5 minutes)
8. Copy your frontend URL: `https://live-polling-system.vercel.app`

### Step 3: Update Backend CORS
Go back to Render dashboard → Your service → Environment → Edit `CORS_ORIGIN`:
```
CORS_ORIGIN=https://live-polling-system.vercel.app
```
Save and wait for redeployment.

## Alternative: Deploy Both on Railway

1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add two services:
   - Backend (root: `backend`)
   - Frontend (root: `frontend`)
4. Add environment variables for each
5. Railway provides URLs automatically

## Testing Your Deployment

1. Visit your frontend URL
2. Test teacher signup/login
3. Test student signup/login
4. Create a poll and verify real-time updates
5. Test in multiple browsers/devices

## Troubleshooting

- **CORS errors**: Update `CORS_ORIGIN` in backend env vars
- **MongoDB connection fails**: Check connection string and whitelist IPs
- **Socket.io not connecting**: Ensure both URLs match in frontend env vars
- **404 errors**: Check root directory settings in deployment platforms
