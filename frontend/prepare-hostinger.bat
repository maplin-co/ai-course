@echo off
REM Hostinger Deployment Preparation Script (Windows)
REM This script prepares your frontend for Hostinger deployment

echo =========================================
echo Hostinger Deployment Preparation
echo =========================================
echo.

REM Step 1: Check if we're in the frontend directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the frontend directory.
    exit /b 1
)

echo [OK] Found package.json
echo.

REM Step 2: Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 3: Build the project
echo Building production bundle...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    exit /b 1
)
echo [OK] Build completed successfully
echo.

REM Step 4: Copy .htaccess to build folder
echo Copying .htaccess to build folder...
if exist ".htaccess" (
    copy /Y .htaccess build\.htaccess >nul
    echo [OK] .htaccess copied to build folder
) else (
    echo Warning: .htaccess file not found. Creating one...
    (
        echo ^<IfModule mod_rewrite.c^>
        echo   RewriteEngine On
        echo   RewriteBase /
        echo   RewriteRule ^^index\.html$ - [L]
        echo   RewriteCond %%{REQUEST_FILENAME} !-f
        echo   RewriteCond %%{REQUEST_FILENAME} !-d
        echo   RewriteCond %%{REQUEST_FILENAME} !-l
        echo   RewriteRule . /index.html [L]
        echo ^</IfModule^>
    ) > build\.htaccess
    echo [OK] .htaccess created in build folder
)
echo.

REM Step 5: Create deployment info
echo Creating deployment instructions...
(
    echo =========================================
    echo HOSTINGER DEPLOYMENT INSTRUCTIONS
    echo =========================================
    echo.
    echo Your build is ready in the 'build' folder!
    echo.
    echo Next steps:
    echo 1. Log in to your Hostinger control panel
    echo 2. Go to File Manager
    echo 3. Navigate to public_html folder
    echo 4. Delete existing files ^(if any^)
    echo 5. Upload ALL files from the 'build' folder
    echo.
    echo IMPORTANT:
    echo - Make sure your backend API is deployed
    echo - Update API URLs in your configuration
    echo - Test the deployment after uploading
    echo.
    echo Build location: %CD%\build
    echo.
    echo =========================================
) > DEPLOYMENT_INSTRUCTIONS.txt

echo [OK] Deployment instructions created
echo.

REM Step 6: Display summary
echo =========================================
echo Deployment Preparation Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Log in to your Hostinger control panel
echo 2. Go to File Manager
echo 3. Navigate to public_html folder
echo 4. Delete existing files ^(if any^)
echo 5. Upload all files from the 'build' folder
echo.
echo Files ready for deployment:
echo   - Location: .\build\
echo   - Instructions: .\DEPLOYMENT_INSTRUCTIONS.txt
echo.
echo IMPORTANT:
echo   - Make sure your backend API is deployed and accessible
echo   - Update API URLs in your environment configuration
echo   - Test the deployment after uploading
echo.
echo =========================================
echo.
pause
