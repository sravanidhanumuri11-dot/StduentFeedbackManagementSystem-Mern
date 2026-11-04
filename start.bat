@echo off
echo ==================================================================
echo   Starting FeedbackHub (MERN Stack)...
echo ==================================================================
echo Starting Backend on port 5050...
start "FeedbackHub Backend" cmd /k "cd /d %~dp0MERN-Project\backend && node server.js"

echo Starting Frontend on port 5173...
start "FeedbackHub Frontend" cmd /k "cd /d %~dp0MERN-Project\frontend && node node_modules\vite\bin\vite.js --port 5173"

echo.
echo ==================================================================
echo   FeedbackHub services launched!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5050/api
echo ==================================================================

