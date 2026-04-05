@echo off
echo Starting Local MongoDB Server...
cd /d "%~dp0"
START /B "" ".\mongodb-win32-x86_64-windows-8.0.0\bin\mongod.exe" --dbpath "mongodb_data"
echo Database is currently initializing optimally in the background.
echo You can now run "py backend\app.py" flawlessly.
timeout /t 5
