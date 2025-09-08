@echo off
echo Starting Board Yet in Docker (Production Mode)
echo =================================================

REM Build and start production containers
docker-compose up --build -d

echo Production server running at http://localhost:3000
echo Nginx proxy running at http://localhost:80
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
pause
