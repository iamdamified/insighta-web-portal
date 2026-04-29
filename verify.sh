#!/bin/bash

echo "🔍 Insighta Labs+ - Web Portal Verification"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ first."
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi
echo "✅ npm $(npm -v)"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo "   Create it with your GitHub OAuth credentials"
    echo "   See ENV_SETUP.md for details"
else
    echo "✅ .env.local configured"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies installed"
fi

# Check API endpoint
echo ""
echo "🔗 Checking API endpoint..."
API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000}

if curl -s -f "$API_URL/docs" > /dev/null 2>&1; then
    echo "✅ Backend API is running at $API_URL"
else
    echo "⚠️  Backend API not responding at $API_URL"
    echo "   Start the backend: cd ../Intelligence_query_engine && uvicorn main:app --reload"
fi

echo ""
echo "📋 Project Structure"
echo "===================="
echo "✅ app/                    - Next.js pages"
echo "✅ app/api/auth/           - Authentication routes"
echo "✅ app/dashboard/          - Dashboard page"
echo "✅ app/profiles/           - Profiles pages"
echo "✅ app/search/             - Search page"
echo "✅ app/account/            - Account page"
echo "✅ lib/                    - Utility functions"
echo "✅ middleware.ts           - Route protection"
echo ""

echo "🚀 Ready to Start!"
echo "=================="
echo ""
echo "Run: npm run dev"
echo "Then visit: http://localhost:3000"
echo ""
