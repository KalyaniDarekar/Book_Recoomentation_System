@echo off
title SmartBook - React Vite Frontend
echo ========================================================
echo   Starting SmartBook Frontend (React + Vite)
echo ========================================================
cd /d "%~dp0smartbook\frontend"
call npm run dev
pause
