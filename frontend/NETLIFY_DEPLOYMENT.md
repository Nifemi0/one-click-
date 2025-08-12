# 🚀 Netlify Deployment Guide

## 📋 Prerequisites
- Netlify account
- GitHub repository connected to Netlify
- Backend API deployed and accessible

## 🔧 Configuration Steps

### 1. **Connect Repository to Netlify**
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select the repository branch (usually `main` or `master`)

### 2. **Build Settings**
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: `18` (or higher)

### 3. **Environment Variables**
Set these in Netlify dashboard → Site settings → Environment variables:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_CHAIN_ID=560048
NEXT_PUBLIC_NETWORK_NAME=Hoodi Testnet
NEXT_PUBLIC_BLOCK_EXPLORER=https://hoodi.etherscan.io
NEXT_PUBLIC_RPC_URL=https://eth-hoodi.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

### 4. **Deploy Settings**
- **Auto deploy**: Enabled
- **Branch deploy**: Your main branch
- **Preview deploy**: Enabled for pull requests

## 🚨 Common Issues & Solutions

### **404 Errors**
- ✅ **Fixed**: Added `_redirects` file
- ✅ **Fixed**: Updated `netlify.toml` configuration
- ✅ **Fixed**: Set correct publish directory

### **Build Failures**
- ✅ **Fixed**: Updated Next.js config for static export
- ✅ **Fixed**: Added proper build scripts
- ✅ **Fixed**: Set Node.js version

### **Routing Issues**
- ✅ **Fixed**: Added client-side routing support
- ✅ **Fixed**: Configured proper redirects

## 🔄 Deployment Process

1. **Push to GitHub**: Your changes will trigger auto-deploy
2. **Build Process**: Netlify runs `npm run build`
3. **Static Export**: Next.js generates static files in `out/` directory
4. **Deploy**: Files are served from Netlify's CDN

## 📱 Testing After Deployment

1. **Check Homepage**: Should load without 404 errors
2. **Test Navigation**: All routes should work
3. **Verify API Calls**: Check browser console for errors
4. **Test Wallet Connection**: Ensure Web3 functionality works

## 🛠️ Troubleshooting

### **Still Getting 404s?**
1. Check `_redirects` file exists in `public/` folder
2. Verify `netlify.toml` configuration
3. Ensure publish directory is set to `out`
4. Check build logs for errors

### **Build Failing?**
1. Verify Node.js version (18+)
2. Check all dependencies are installed
3. Review build logs for specific errors
4. Test build locally with `npm run build`

### **Environment Variables Not Working?**
1. Check variable names start with `NEXT_PUBLIC_`
2. Verify variables are set in Netlify dashboard
3. Redeploy after adding variables
4. Check browser console for undefined values

## 📞 Support

If you continue to experience issues:
1. Check Netlify build logs
2. Review browser console errors
3. Verify backend API is accessible
4. Test locally with `npm run dev`

---

**🎉 Your Next.js app should now deploy successfully on Netlify!**