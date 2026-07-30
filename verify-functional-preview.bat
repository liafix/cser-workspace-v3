@echo off
cd /d "%~dp0legacy\v2-reference"
call npm run verify
pause
