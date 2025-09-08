@echo off
echo Starting Board Yet in Docker (Development Mode)
echo ==================================================

REM Build and start development container
docker-compose -f docker-compose.dev.yml up --build

echo Development server running at http://localhost:5173
pause
