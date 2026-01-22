@echo off
echo ========================================
echo LearnFlow Setup Script
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)
echo ✓ Python found
echo.

echo [2/5] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

echo [3/5] Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
cd ..
echo.

echo [4/5] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
cd ..
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Configure your environment variables:
echo    - Edit backend\.env with your credentials
echo    - Add your Stripe API keys
echo    - Update MongoDB connection string
echo.
echo 2. Start the backend server:
echo    cd backend
echo    uvicorn server:app --reload
echo.
echo 3. Start the frontend (in a new terminal):
echo    cd frontend
echo    npm start
echo.
echo 4. Open your browser:
echo    http://localhost:3000
echo.
echo For detailed setup instructions, see README.md
echo For deployment guide, see DEPLOYMENT.md
echo.
echo ========================================
pause
