#!/bin/bash

# Wait for MySQL to be ready
while ! nc -z db 3306; do   
  echo "Waiting for MySQL connection..."
  sleep 2
done

echo "MySQL is up and running"
exec "$@"