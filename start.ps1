Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Starting FeedbackHub (MERN Stack)..." -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Start-Process cmd.exe -ArgumentList "/k cd /d `"$baseDir\MERN-Project\backend`" && node server.js"
Start-Process cmd.exe -ArgumentList "/k cd /d `"$baseDir\MERN-Project\frontend`" && node node_modules\vite\bin\vite.js --port 5173"

Write-Host ""
Write-Host "FeedbackHub services launched!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5050/api" -ForegroundColor Yellow

