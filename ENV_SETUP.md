# Web Portal Environment Setup

## Development Setup

### 1. Clone the repository
```bash
cd web-portal
npm install
```

### 2. Create `.env.local`
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback
EOF
```

### 3. Get GitHub OAuth Credentials

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: Insighta Labs
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback
4. Copy `Client ID` and `Client Secret` to `.env.local`

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## Production Setup

### 1. Build the application
```bash
npm run build
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Set Production Environment Variables

In Vercel dashboard:
- Set `NEXT_PUBLIC_API_URL` to your production backend URL
- Set GitHub OAuth credentials for production domain
- Update GitHub OAuth callback URL to production domain

---

## Troubleshooting

### Issue: "No code provided" on callback
- Check that GitHub is redirecting to the correct callback URL
- Verify `NEXT_PUBLIC_REDIRECT_URI` matches GitHub OAuth settings

### Issue: "Unauthorized" on API calls
- Ensure backend is running and accessible
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify tokens are in cookies (check DevTools)

### Issue: Cookies not being set
- In development: cookies work on localhost
- In production: requires HTTPS and proper domain

---

## Testing the Portal

### 1. Test Login Flow
```bash
# 1. Go to http://localhost:3000
# 2. Click "Continue with GitHub"
# 3. Authenticate with your GitHub account
# 4. Should be redirected to dashboard
```

### 2. Test Profile Listing
```bash
# On dashboard, click "View Profiles"
# Should see list of profiles from backend
```

### 3. Test Search
```bash
# On search page, try:
# "male adults from Nigeria"
# "females age 20-30"
```

### 4. Verify Cookies
```javascript
// In browser console:
document.cookie // Should be empty (HTTP-only)

// Tokens are in HTTP-only cookies, visible only in Network tab
```
