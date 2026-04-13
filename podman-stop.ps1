# Script untuk stop MariaDB container
Write-Host "Stopping MariaDB container..." -ForegroundColor Yellow

wsl podman stop quarkus-mariadb

if ($LASTEXITCODE -eq 0) {
    Write-Host "MariaDB container stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to stop container or container not running." -ForegroundColor Red
}
