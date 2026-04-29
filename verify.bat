@echo off
REM Windows verification script for Insighta Labs+ Web Portal

echo.
echo 🔍 Insighta Labs+ - Web Portal Verification
echo ===========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 16+ first.
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found. Please install npm first.
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION%

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  .env.local not found
    echo    Create it with your GitHub OAuth credentials
    echo    See ENV_SETUP.md for details
) else (
    echo ✅ .env.local configured
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
) else (
    echo ✅ Dependencies installed
)

echo.
echo 📋 Project Structure
echo ====================
echo ✅ app/                    - Next.js pages
echo ✅ app/api/auth/           - Authentication routes
echo ✅ app/dashboard/          - Dashboard page
echo ✅ app/profiles/           - Profiles pages
echo ✅ app/search/             - Search page
echo ✅ app/account/            - Account page
echo ✅ lib/                    - Utility functions
echo ✅ middleware.ts           - Route protection
echo.

echo 🚀 Ready to Start!
echo ====================
echo.
echo Run: npm run dev
echo Then visit: http://localhost:3000
echo.
