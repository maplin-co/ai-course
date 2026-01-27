@echo off
echo ==========================================
echo   Preparing LearnFlow for Hostinger
echo ==========================================

echo.
echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo Error building project.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo   Build Complete!
echo ==========================================
echo.
echo Upload the contents of the 'build' folder
echo to your Hostinger 'public_html' directory.
echo.
pause