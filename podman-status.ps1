# Script untuk cek status Podman containers
Write-Host "Checking Podman containers status in WSL2..." -ForegroundColor Cyan

wsl podman ps -a
