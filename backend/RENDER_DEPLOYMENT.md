# 🚀 Render Deployment Guide for One-Click Backend

This guide covers deploying your backend to Render using the Render CLI.

## 📋 Prerequisites

- [Render Account](https://render.com) (free tier available)
- Node.js 18+ installed
- Git repository with your backend code
- Environment variables configured

## 🔧 Setup Steps

### 1. **Install Render CLI**
```bash
npm install -g render-cli
```

### 2. **Login to Render**
```bash
render login
```

### 3. **Configure Environment Variables**
Copy `env.example` to `.env` and fill in your values:
- `DATABASE_URL` - Your PostgreSQL connection string
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `JWT_SECRET` - A secure random string for JWT signing

## 🚀 Deployment Methods

### **Method 1: Render CLI (Recommended)**
```bash
# Navigate to backend directory
cd backend

# Build and deploy
npm run build
render deploy
```

### **Method 2: PowerShell Script (Windows)**
```powershell
# Run the deployment script
.\deploy-render.ps1
```

### **Method 3: Bash Script (Linux/Mac)**
```bash
# Make script executable and run
chmod +x deploy-render.sh
./deploy-render.sh
```

### **Method 4: Manual Web Deployment**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
5. Add environment variables
6. Deploy!

## ⚙️ Configuration Files

### **render.yaml**
- Service configuration for Render
- Environment variables setup
- Health check configuration

### **Dockerfile**
- Containerized deployment option
- Optimized for production
- Health checks included

## 🔍 Health Check Endpoint

Your backend includes a health check endpoint at `/health` that Render will use to monitor the service.

## 📊 Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: Response times, error rates
- **Uptime**: Automatic monitoring and alerts

## 🔄 Auto-Deploy

The service is configured for auto-deploy on Git pushes to the main branch.

## 🚨 Troubleshooting

### **Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build script in package.json

### **Runtime Errors**
- Verify environment variables are set
- Check database connectivity
- Review application logs in Render dashboard

### **Port Issues**
- Render automatically assigns ports
- Use `process.env.PORT` in your code
- Don't hardcode port numbers

## 🌐 Post-Deployment

1. **Test your endpoints** using the provided URL
2. **Update frontend** to use the new backend URL
3. **Monitor logs** for any issues
4. **Set up custom domain** if needed

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practices-security.html)

---

**Happy Deploying! 🚀✨**
