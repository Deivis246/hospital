# Vercel Deployment Instructions

## 🔧 Environment Variables Configuration

**CRITICAL**: You MUST configure these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variable:

```
DATABASE_URL=mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test
```

## 🚀 Deployment Steps

1. **Push changes to GitHub:**
```bash
git add .
git commit -m "Fixed Vercel deployment with SSL and proper error handling"
git push origin main
```

2. **Verify Environment Variables in Vercel:**
   - Go to your Vercel project
   - Check Settings → Environment Variables
   - Ensure `DATABASE_URL` is exactly as shown above

3. **Redeploy if needed:**
   - In Vercel dashboard, click "Redeploy" or push new commit

## 🔍 Troubleshooting

### If you still get 500 errors:

1. **Check Vercel Function Logs:**
   - Go to your Vercel project
   - Click on the "Functions" tab
   - Look for `/api/auth` function logs
   - Check for specific error messages

2. **Common Issues:**
   - ❌ `DATABASE_URL not set` → Environment variable missing
   - ❌ `insecure transport` → SSL configuration issue
   - ❌ `authentication failed` → Wrong credentials in DATABASE_URL
   - ❌ `connection refused` → Network/firewall issue

3. **Test the API directly:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/auth \
     -H "Content-Type: application/json" \
     -d '{"ci":"1700000001","birthDate":"1990-05-20"}'
   ```

## ✅ Verification

The application should work with these test credentials:
- **CI**: `1700000001`
- **Birth Date**: `1990-05-20`
- **Expected Result**: Login as JUAN CARLOS PEREZ LOPEZ (PATIENT role)

## 📝 What was fixed:

1. **SSL/TLS Connection**: Proper SSL configuration for TiDB Cloud
2. **Database Queries**: Correct table structure and column names
3. **Error Handling**: Detailed logging for debugging
4. **Environment Variables**: Proper handling in serverless functions
5. **CORS**: Headers configured for cross-origin requests

## 🚨 Important Notes

- The `.env` file is for local development only
- Vercel uses its own environment variable system
- All database connections are properly closed in serverless functions
- Connection pooling is disabled for serverless compatibility
