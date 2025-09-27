@echo off

setlocal enabledelayedexpansion

set PROJECT_NAME=board-yet
set DOCKER_COMPOSE_FILE=docker-compose.yml
set ENV_FILE=.env

echo 🚀 Board Yet Production Deployment
echo ==================================
echo.

docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

if not exist "%ENV_FILE%" (
    echo [WARNING] .env file not found. Creating from env.example...
    if exist "env.example" (
        copy env.example .env >nul
        echo [WARNING] Please update .env file with your production values before continuing.
        echo [WARNING] Press any key when ready to continue...
        pause >nul
    ) else (
        echo [ERROR] env.example file not found. Please create .env file manually.
        pause
        exit /b 1
    )
)

echo [INFO] Creating backup of current deployment...
if exist "backups" (
    set BACKUP_DIR=backups\backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
    set BACKUP_DIR=!BACKUP_DIR: =0!
    mkdir "!BACKUP_DIR!" 2>nul
    
    if exist "build" (
        xcopy build "!BACKUP_DIR!\build" /E /I /Q >nul
        echo [INFO] Backed up current build
    )
    
    if exist ".env" (
        copy .env "!BACKUP_DIR!\" >nul
        echo [INFO] Backed up current .env
    )
    
    echo [SUCCESS] Backup created at !BACKUP_DIR!
)

echo [INFO] Stopping existing containers...
docker-compose down

echo [INFO] Cleaning up old Docker images...
docker image prune -f

echo [INFO] Building and starting new containers...
docker-compose up --build -d

echo [INFO] Waiting for services to be healthy...
timeout /t 30 /nobreak >nul

echo [INFO] Checking service status...
docker-compose ps

echo [INFO] Performing health check...
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Health check failed, but deployment may still be successful
    echo [WARNING] Check logs with: docker-compose logs
) else (
    echo [SUCCESS] Application is healthy
)

echo.
echo [SUCCESS] Deployment completed successfully!
echo.
echo Application URLs:
echo   - Main application: http://localhost
echo   - Health check: http://localhost/health
echo.
echo Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop services: docker-compose down
echo   - Restart services: docker-compose restart
echo   - View container status: docker-compose ps
echo.
pause
