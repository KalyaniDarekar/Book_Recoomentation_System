@echo off
title SmartBook - Flask Backend Server
echo ========================================================
echo   Starting SmartBook Backend Server (Flask + SQLite)
echo ========================================================
cd /d "%~dp0smartbook\backend"
python app.py
pause
