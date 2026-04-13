#!/bin/bash
# Script untuk menjalankan MariaDB dengan Podman di WSL2

echo "Starting MariaDB container with Podman..."

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded credentials from .env file"
else
    echo "⚠️  Warning: .env file not found. Using default values."
    echo "Copy .env.example to .env and configure your credentials."
fi

# Get credentials from environment or use defaults
DB_USERNAME=${DB_USERNAME:-ns}
DB_PASSWORD=${DB_PASSWORD:-password}
DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD:-root}
DB_NAME=${DB_NAME:-quarkus_db}
DB_PORT=${DB_PORT:-3306}

podman run -d \
  --name quarkus-mariadb \
  -e MYSQL_ROOT_PASSWORD=$DB_ROOT_PASSWORD \
  -e MYSQL_DATABASE=$DB_NAME \
  -e MYSQL_USER=$DB_USERNAME \
  -e MYSQL_PASSWORD=$DB_PASSWORD \
  -p ${DB_PORT}:3306 \
  docker.io/library/mariadb:10.11

if [ $? -eq 0 ]; then
    echo "✅ MariaDB container started successfully!"
    echo "Checking container status..."
    podman ps
else
    echo "⚠️  Container already exists. Starting existing container..."
    podman start quarkus-mariadb
    podman ps
fi

echo ""
echo "🚀 You can now run the Quarkus app from Windows:"
echo "   .\mvnw.cmd quarkus:dev"
