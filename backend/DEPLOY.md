# 🚀 Render Deployment Guide

## Quick Start
1. **Login**: `render login`
2. **Build**: `npm run build`
3. **Deploy**: `render deploy`

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase key
- `JWT_SECRET` - JWT signing secret

## Commands
```bash
# Install CLI
npm install -g render-cli

# Deploy
render deploy

# Check status
render ps
```

## Health Check
Endpoint: `/health` (configured in render.yaml)
