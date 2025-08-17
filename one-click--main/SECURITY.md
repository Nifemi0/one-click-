# 🔒 Security Guide - Drosera Security Trap System

## ⚠️ **CRITICAL SECURITY WARNINGS**

### **NEVER COMMIT SECRETS TO VERSION CONTROL**
- ❌ Never commit `.env` files
- ❌ Never commit `.env.local` files  
- ❌ Never commit API keys, passwords, or private keys
- ❌ Never commit database connection strings
- ❌ Never commit JWT secrets or encryption keys

### **ALWAYS USE ENVIRONMENT VARIABLES**
- ✅ Store all secrets in `.env` files
- ✅ Use `.env.example` as templates
- ✅ Add `.env*` to `.gitignore`
- ✅ Use `process.env` in code

## 🗂️ **Environment File Structure**

### **Backend (.env) - CONTAINS ALL SECRETS**
```
backend/.env          # 🔴 REAL SECRETS - NEVER COMMIT
backend/.env.example  # 🟢 TEMPLATE - SAFE TO COMMIT
```

### **Frontend (.env.local) - PUBLIC KEYS ONLY**
```
frontend/.env.local   # 🔴 REAL VALUES - NEVER COMMIT
frontend/.env.example # 🟢 TEMPLATE - SAFE TO COMMIT
```

## 🔐 **Secret Management Best Practices**

### **1. Database Secrets**
```bash
# ✅ GOOD - Use environment variables
DATABASE_URL=postgresql://postgres:password@host:port/db

# ❌ BAD - Hardcoded in code
const dbUrl = "postgresql://postgres:password@host:port/db";
```

### **2. API Keys**
```bash
# ✅ GOOD - Environment variables
CURSOR_API_KEY=key_abc123
GEMINI_API_KEY=AIzaSy_abc123

# ❌ BAD - Hardcoded in code
const cursorKey = "key_abc123";
```

### **3. JWT Secrets**
```bash
# ✅ GOOD - Long, random secret
JWT_SECRET=dd68e8ca9a71cbe8a2950074dce8a5a2f5a57be29d3cf249e38c5de8d50324e9be29300fde6de28a3c1b3ff7f0a50d7bb6a7e8d949fe32e126b1af1e0b386ed4

# ❌ BAD - Weak secret
JWT_SECRET=mysecret123
```

## 🚨 **Security Checklist**

### **Before Committing Code:**
- [ ] No `.env` files in commit
- [ ] No hardcoded secrets in code
- [ ] No API keys in comments
- [ ] No passwords in logs
- [ ] No private keys in files

### **Before Deploying:**
- [ ] All secrets in environment variables
- [ ] Production secrets different from development
- [ ] Database connections use SSL
- [ ] JWT secrets are strong and unique
- [ ] API keys are rotated regularly

## 🔍 **Secret Scanning**

### **Automated Scanning**
```bash
# Install secret scanning tools
npm install -g detect-secrets
npm install -g trufflehog

# Scan for secrets
detect-secrets scan .
trufflehog --only-verified .
```

### **Manual Checks**
```bash
# Search for common secret patterns
grep -r "password" . --exclude-dir=node_modules
grep -r "api_key" . --exclude-dir=node_modules
grep -r "0x[a-fA-F0-9]{40}" . --exclude-dir=node_modules
```

## 🛡️ **Encryption & Hashing**

### **Sensitive Data Storage**
```typescript
// ✅ GOOD - Hash passwords
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 12);

// ✅ GOOD - Encrypt sensitive data
import crypto from 'crypto';
const encrypted = crypto.createCipher('aes-256-cbc', key).update(data);
```

### **Never Store Plain Text**
- ❌ Passwords
- ❌ Private keys
- ❌ API keys
- ❌ Database credentials
- ❌ JWT secrets

## 🔄 **Secret Rotation**

### **Regular Rotation Schedule**
- **API Keys**: Every 90 days
- **JWT Secrets**: Every 180 days
- **Database Passwords**: Every 90 days
- **Encryption Keys**: Every 365 days

### **Rotation Process**
1. Generate new secret
2. Update environment variable
3. Restart application
4. Verify functionality
5. Delete old secret

## 🚪 **Access Control**

### **Environment File Permissions**
```bash
# ✅ GOOD - Restrict access
chmod 600 .env
chmod 600 .env.local

# ❌ BAD - Too permissive
chmod 644 .env
```

### **User Access**
- Only developers need access to `.env` files
- Use different secrets for each environment
- Rotate secrets when team members change

## 🚨 **Emergency Procedures**

### **If Secrets Are Compromised:**
1. **IMMEDIATELY** rotate all affected secrets
2. Revoke compromised API keys
3. Change database passwords
4. Update JWT secrets
5. Notify security team
6. Audit access logs
7. Document incident

### **Recovery Steps:**
1. Stop affected services
2. Update all environment variables
3. Restart services
4. Verify functionality
5. Monitor for suspicious activity

## 📚 **Additional Resources**

### **Security Tools**
- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

### **Secret Management Services**
- [HashiCorp Vault](https://www.vaultproject.io/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

## 📞 **Security Contacts**

### **Report Security Issues:**
- **Email**: security@drosera.com
- **Emergency**: +1-XXX-XXX-XXXX
- **Slack**: #security-alerts

### **Security Team:**
- **Lead**: [Security Lead Name]
- **Backup**: [Backup Contact Name]

---

**Remember: Security is everyone's responsibility!** 🛡️✨