# Vercel Deployment Configuration for web-portal-rust-three

## Project Details
- **Vercel Project ID**: `prj_HGoahA7eYIM8WGpoe0b2k68kmAlq`
- **Vercel Account**: `iamdamified-7952`
- **Production URL**: `https://web-portal-rust-three.vercel.app`
- **GitHub Repository**: `https://github.com/iamdamified/insighta-web-portal`
- **Branch**: `master`

## Required Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Development & Preview
```
NEXT_PUBLIC_API_URL=https://intelligence-query-engine.vercel.app
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_REDIRECT_URI=https://web-portal-rust-three.vercel.app/api/auth/callback
```

### Production
Same as above (all environments)

## Deployment Steps

### Initial Setup (One-time)
1. Go to: https://vercel.com/iamdamified-7952/web-portal-rust-three/settings/environment-variables
2. Add all environment variables listed above
3. Verify GitHub integration is connected

### Triggering Redeployment
After pushing code to GitHub (`master` branch):
1. **Automatic**: Vercel should automatically deploy on push
2. **Manual**: https://vercel.com/iamdamified-7952/web-portal-rust-three/deployments → Click "Redeploy"

## Verification

After deployment completes:
1. Visit: https://web-portal-rust-three.vercel.app
2. Verify login flow works
3. Check that API calls go to: https://intelligence-query-engine.vercel.app

## Notes

- `.env.local` is for local development only
- Production secrets must be set in Vercel Dashboard
- Never commit `.env.local` with real credentials (already in .gitignore)
- API proxy routes forward authenticated requests to backend
- Session tokens use HTTP-only cookies for security
