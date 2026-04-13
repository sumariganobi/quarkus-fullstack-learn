#!/bin/bash
# Script untuk stop MariaDB container

echo "Stopping MariaDB container..."

podman stop quarkus-mariadb

if [ $? -eq 0 ]; then
    echo "✅ MariaDB container stopped successfully!"
else
    echo "❌ Failed to stop container or container not running."
fi
