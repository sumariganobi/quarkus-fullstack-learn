# Script untuk menjalankan MariaDB dengan Podman di WSL2
Write-Host "Starting MariaDB container with Podman in WSL2..." -ForegroundColor Green

# Load environment variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "Loaded credentials from .env file" -ForegroundColor Cyan
} else {
    Write-Host "Warning: .env file not found. Using default values." -ForegroundColor Yellow
    Write-Host "Copy .env.example to .env and configure your credentials." -ForegroundColor Yellow
}

# Get credentials from environment or use defaults
$DB_USERNAME = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "ns" }
$DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "password" }
$DB_ROOT_PASSWORD = if ($env:DB_ROOT_PASSWORD) { $env:DB_ROOT_PASSWORD } else { "root" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "quarkus_db" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "3306" }

# Jalankan container
wsl podman run -d `
  --name quarkus-mariadb `
  -e MYSQL_ROOT_PASSWORD=$DB_ROOT_PASSWORD `
  -e MYSQL_DATABASE=$DB_NAME `
  -e MYSQL_USER=$DB_USERNAME `
  -e MYSQL_PASSWORD=$DB_PASSWORD `
  -p ${DB_PORT}:3306 `
  docker.io/library/mariadb:10.11

if ($LASTEXITCODE -eq 0) {
    Write-Host "MariaDB container started successfully!" -ForegroundColor Green
    Write-Host "Checking container status..." -ForegroundColor Yellow
    wsl podman ps
} else {
    Write-Host "Failed to start container. Trying to start existing container..." -ForegroundColor Yellow
    wsl podman start quarkus-mariadb
    wsl podman ps
}

Write-Host "`nYou can now run: .\mvnw.cmd quarkus:dev" -ForegroundColor Cyan
