#!/bin/bash

echo "Database is ready!"

# Run the seed settings script
echo "Seeding settings..."
docker-compose exec node-app ts-node src/db/seedSettings.ts

# Run the seed questions script
echo "Seeding questions..."
docker exec node-app ts-node src/db/seedQuestions.ts

echo "Seeding completed!"