@echo off
title SmartBook Launcher
echo ========================================================
echo   Launching SmartBook Application (Backend + Frontend)
echo ========================================================

start "SmartBook Backend" cmd /k "%~dp0start_backend.bat"
timeout /t 3 /nobreak >nul
start "SmartBook Frontend" cmd /k "%~dp0start_frontend.bat"

echo.
echo Both servers launched!
echo Backend:  http://127.0.0.1:5000
echo Frontend: http://localhost:5173
echo.
pause
