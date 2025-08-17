# 🌐 Web-Based Render Deployment

Since the Render CLI has compatibility issues, use the web dashboard instead:

## 🚀 **Step-by-Step Deployment:**

### 1. **Go to Render Dashboard**
- Visit: https://dashboard.render.com
- Sign up/Login with GitHub

### 2. **Create New Web Service**
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 3. **Configure Service**
- **Name**: `one-click-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`

### 4. **Build Settings**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 5. **Environment Variables**
Add these in the dashboard:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=*
```

### 6. **Deploy**
- Click "Create Web Service"
- Wait for build and deployment

## ✅ **Your backend will be available at:**
`https://your-service-name.onrender.com`

## 🔧 **Auto-Deploy Enabled**
- Every push to main branch triggers deployment
- Health checks at `/health` endpoint
