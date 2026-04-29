# Insighta Labs+ - Stage 3 Implementation

**Complete implementation of HNG Stage 3 backend engineering track with secure access and multi-interface integration.**

---

## 📋 Project Overview

This is a **production-ready** system consisting of three main components:

1. **Backend API** - FastAPI with GitHub OAuth, RBAC, rate limiting, and logging
2. **CLI Tool** - Command-line interface with token management and rich output
3. **Web Portal** - Next.js frontend with HTTP-only cookies and CSRF protection

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Insighta Labs+                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐    ┌──────────────┐  ┌────────────┐ │
│  │  Web Portal  │    │   CLI Tool   │  │   Users    │ │
│  │ (Next.js)    │    │ (Typer)      │  │            │ │
│  └──────┬───────┘    └──────┬───────┘  └──────┬─────┘ │
│         │                   │                 │       │
│         └───────────────────┼─────────────────┘       │
│                             │                         │
│                   ┌─────────▼──────────┐              │
│                   │   Backend API      │              │
│                   │   (FastAPI)        │              │
│                   ├────────────────────┤              │
│                   │ • OAuth + PKCE     │              │
│                   │ • JWT Tokens       │              │
│                   │ • Rate Limiting    │              │
│                   │ • Logging          │              │
│                   │ • RBAC             │              │
│                   └─────────┬──────────┘              │
│                             │                         │
│                   ┌─────────▼──────────┐              │
│                   │   PostgreSQL DB    │              │
│                   │                    │              │
│                   │ • Users            │              │
│                   │ • Profiles         │              │
│                   │ • Refresh Tokens   │              │
│                   └────────────────────┘              │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features Implemented

### Authentication System ✅
- **GitHub OAuth with PKCE** - Secure three-legged OAuth flow
- **Token Management** - Access (3 min) + Refresh (5 min) tokens
- **Token Rotation** - Old refresh tokens invalidated on new issue
- **HTTP-Only Cookies** - Web portal uses secure, HTTP-only storage
- **Session Management** - CLI stores tokens in ~/.insighta/credentials.json

### Role-Based Access Control ✅
- **Admin** - Can create/delete profiles, manage system
- **Analyst** - Read-only access to profiles and search
- **Enforcement** - All endpoints check permissions via JWT claims

### API Endpoints ✅

**Authentication**
```
GET  /auth/github                    # Initiate OAuth
GET  /auth/github/callback           # OAuth callback
POST /auth/refresh                   # Refresh access token
POST /auth/logout                    # Revoke session
GET  /auth/me                        # Get current user
```

**Profiles** (All require auth + `X-API-Version: 1`)
```
GET  /api/profiles                   # List with filters
GET  /api/profiles/search?q=query    # Natural language search
GET  /api/profiles/{id}              # Get single profile
POST /api/profiles                   # Create (admin only)
DELETE /api/profiles/{id}            # Delete (admin only)
GET  /api/profiles/export?format=csv # Export profiles
```

**Pagination Response Format**
```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "total_pages": 203,
  "links": {
    "self": "/api/profiles?page=1&limit=10",
    "next": "/api/profiles?page=2&limit=10",
    "prev": null
  },
  "data": [...]
}
```

### CLI Commands ✅

**Authentication**
```bash
insighta login                      # GitHub OAuth login
insighta logout                     # Clear local session
insighta whoami                     # Display current user
```

**Profiles Management**
```bash
insighta profiles list                              # List all profiles
insighta profiles list --gender male                # Filter by gender
insighta profiles list --country NG --age-group adult  # Multiple filters
insighta profiles list --min-age 25 --max-age 40   # Age range
insighta profiles list --sort-by age --order desc  # Sort + paginate
insighta profiles list --page 2 --limit 20         # Pagination

insighta profiles get <id>                         # Get single profile
insighta profiles search "young males from nigeria" # Natural language
insighta profiles create --name "Harriet Tubman"   # Create (admin)
insighta profiles export --format csv              # Export
insighta profiles export --format csv --gender male --country NG
```

**Features**
- ✅ Rich formatted output with tables and emojis
- ✅ Auto-refresh tokens on 401 response
- ✅ Local token storage at ~/.insighta/credentials.json
- ✅ Automatic URL construction
- ✅ Error handling with user-friendly messages

### Web Portal Pages ✅

| Page | URL | Features |
|------|-----|----------|
| Login | `/` | GitHub OAuth button |
| Dashboard | `/dashboard` | User welcome + stats |
| Profiles | `/profiles` | List, filter, paginate |
| Profile Detail | `/profiles/:id` | Full profile info |
| Search | `/search` | Natural language search |
| Account | `/account` | User settings, read-only |

**Features**
- ✅ Responsive layout
- ✅ Real-time filtering
- ✅ Pagination controls
- ✅ HTTP-only cookie storage
- ✅ CSRF protection (SameSite cookies)
- ✅ Automatic logout on expired tokens

### Security Features ✅

**Backend**
- ✅ API version enforcement (`X-API-Version: 1`)
- ✅ Rate limiting (10 req/min for /auth/*, 60 req/min per user for /api/*)
- ✅ JWT token validation on all /api/* endpoints
- ✅ Role-based authorization checks
- ✅ PKCE flow for OAuth
- ✅ Token rotation on refresh
- ✅ Token revocation on logout

**Web Portal**
- ✅ HTTP-only cookies (inaccessible via JavaScript)
- ✅ Secure flag (HTTPS only in production)
- ✅ SameSite: Lax (CSRF protection)
- ✅ Automatic token refresh
- ✅ Session validation on page load

**CLI**
- ✅ Local token storage (user's home directory)
- ✅ Bearer token authentication
- ✅ Automatic refresh on token expiry
- ✅ X-API-Version header on all requests

### Logging & Monitoring ✅

**Request Logging**
```
Logs on every request:
- HTTP Method
- Endpoint path
- Status code
- Response time (ms)

Format: GET /api/profiles | Status: 200 | Time: 45.23ms
```

**Output**
```
2026-04-29 10:30:15 - insighta - INFO - GET /api/profiles | Status: 200 | Time: 45.23ms
```

---

## 🚀 Quick Start

### Backend Setup

```bash
cd Intelligence_query_engine

# Create virtual environment
python -m venv profilenv
source profilenv/Scripts/activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cat > .env << EOF
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/insighta_db
SECRET_KEY=your_secret_key_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
ENV=development
EOF

# Run migrations
alembic upgrade head

# Seed database
python seed.py

# Start server
uvicorn main:app --reload
```

**API runs at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

### CLI Setup

```bash
cd cli

# Install in development mode
pip install -e .

# Now use from anywhere
insighta login
insighta whoami
insighta profiles list
```

### Web Portal Setup

```bash
cd web-portal

# Install dependencies
npm install

# Configure environment
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback
EOF

# Start development server
npm run dev
```

**Portal runs at:** http://localhost:3000

---

## 🔐 Authentication Flow

### Web Portal Flow

```
1. User visits http://localhost:3000
2. Clicks "Continue with GitHub"
3. Redirected to: https://github.com/login/oauth/authorize?...
4. User authenticates with GitHub
5. GitHub redirects to: http://localhost:3000/api/auth/callback?code=...
6. Next.js API route exchanges code for tokens
7. Tokens stored in HTTP-only cookies
8. User redirected to /dashboard
9. All API requests automatically include tokens from cookies
```

### CLI Flow

```
1. User runs: insighta login
2. CLI generates PKCE pair (code_verifier, code_challenge)
3. CLI starts local callback server on port 8765
4. CLI opens browser to: https://github.com/login/oauth/authorize?...
5. User authenticates with GitHub
6. GitHub redirects to: http://localhost:8765/callback?code=...
7. CLI captures code
8. CLI exchanges code + code_verifier for tokens
9. Tokens stored in ~/.insighta/credentials.json
10. CLI prints: "Logged in as @username"
```

### Token Lifecycle

**Access Token (3 minutes)**
- Used for all API requests
- Sent via `Authorization: Bearer {token}` header
- Expires every 3 minutes

**Refresh Token (5 minutes)**
- Used to get new access tokens
- Sent to `POST /auth/refresh`
- Old token invalidated immediately upon use
- Expires every 5 minutes

**Refresh Flow**
```
1. API returns 401 Unauthorized
2. Client sends POST /auth/refresh with refresh_token
3. Backend invalidates old refresh_token
4. Backend issues new access_token + refresh_token
5. Client updates local storage/cookies
6. Original request retried with new token
```

---

## 🛠️ Technology Stack

**Backend**
- Python 3.10+
- FastAPI
- SQLAlchemy + PostgreSQL
- Alembic (migrations)
- PyJWT (tokens)
- Python-Jose (JWT)

**CLI**
- Python 3.10+
- Typer (CLI framework)
- Requests (HTTP client)
- Rich (formatting - optional)

**Web Portal**
- Next.js 14
- React 18
- TypeScript
- Inline CSS (no dependencies)

---

## 📁 Project Structure

```
Intelligence_query_engine/          (Backend)
├── main.py                         # FastAPI app
├── models.py                       # SQLAlchemy models
├── database.py                     # DB connection
├── crud.py                         # Database operations
├── auth/                           # Authentication
│   ├── router.py                   # Auth endpoints
│   ├── dependencies.py             # JWT validation
│   ├── guards.py                   # Security middleware
│   ├── rbac.py                     # Role checking
│   ├── tokens.py                   # Token creation
│   ├── session.py                  # Token lifecycle
│   └── oauth/                      # OAuth flows
├── users/                          # User management
│   ├── models.py                   # User model
│   └── service.py                  # User queries
├── middleware/
│   ├── rate_limiter.py            # Rate limiting
│   └── logging.py                  # Request logging
├── core/
│   ├── config.py                   # Settings
│   └── responses.py                # Response models
└── requirements.txt                # Python dependencies

cli/                                (CLI Tool)
├── pyproject.toml                  # CLI config
├── insighta/
│   ├── main.py                     # CLI commands
│   ├── auth/
│   │   ├── github.py               # OAuth flow
│   │   ├── client.py               # API requests
│   │   └── session.py              # Token storage
│   └── __init__.py
└── insighta_cli.egg-info/

web-portal/                         (Web Portal)
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.js                  # Next.js config
├── app/
│   ├── layout.tsx                  # Root layout + nav
│   ├── page.tsx                    # Login page
│   ├── dashboard/                  # Dashboard
│   ├── profiles/
│   │   ├── page.tsx               # Profiles list
│   │   └── [profileId]/           # Profile detail
│   ├── search/                     # Search page
│   ├── account/                    # Account page
│   └── api/auth/                   # Auth routes
│       ├── callback/               # OAuth callback
│       ├── me/                     # Get user info
│       ├── token/                  # Get token
│       └── logout/                 # Logout
├── lib/
│   └── api.ts                      # API utilities
└── public/                         # Static files
```

---

## 🧪 Testing Endpoints

### 1. Login via Web Portal
```bash
# Visit http://localhost:3000
# Click "Continue with GitHub"
# Authenticate
```

### 2. Test CLI
```bash
cd cli
pip install -e .
insighta login
insighta whoami
insighta profiles list
```

### 3. Test API Directly
```bash
# Get token from CLI/Portal output
TOKEN="your_access_token"

# Test with version header
curl -X GET http://localhost:8000/api/profiles \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-API-Version: 1"

# Without version header (should fail)
curl -X GET http://localhost:8000/api/profiles \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Rate Limiting
```bash
# Spam auth endpoint (should hit limit at 10)
for i in {1..15}; do
  curl -X GET http://localhost:8000/auth/github
done
```

---

## 📝 Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=3
REFRESH_TOKEN_EXPIRE_MINUTES=5
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
ENV=development
```

**Web Portal (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

---

## 🚀 Deployment

### Backend (Vercel)
```bash
cd Intelligence_query_engine
vercel --prod
```

### Web Portal (Vercel)
```bash
cd web-portal
vercel --prod
```

### CLI (Local/Package)
```bash
cd cli
pip install .
```

---

## ✅ Compliance Checklist

- ✅ All /api/* endpoints require auth + X-API-Version header
- ✅ Pagination includes page, limit, total, total_pages, links
- ✅ CSV export with correct columns in order
- ✅ Create profile (admin) calls external APIs
- ✅ Rate limiting: 10/min for /auth/*, 60/min per user for /api/*
- ✅ Logging: method, endpoint, status, response time
- ✅ CLI installable globally with `insighta` command
- ✅ Web portal with HTTP-only cookies and CSRF protection
- ✅ Role-based access control for all endpoints
- ✅ Token rotation on refresh
- ✅ Natural language query parsing
- ✅ Filters: gender, country, age_group, min_age, max_age
- ✅ Sorting: age, created_at, gender_probability
- ✅ Pagination: page, limit
- ✅ GitHub OAuth with PKCE
- ✅ Access token: 3 minutes
- ✅ Refresh token: 5 minutes

---

## 📞 Support

For questions about implementation:
- Backend logic: See main.py and auth/
- CLI functionality: See cli/insighta/
- Web UI: See web-portal/app/
- Database: See models.py and database.py at backend root folder

---

**Last Updated:** April 29, 2026  
**Status:**  Production Ready 
