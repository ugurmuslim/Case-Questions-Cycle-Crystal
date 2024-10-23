#!/bin/bash

echo "Database is ready!"

# Run the seed settings script
echo "Seeding settings..."
docker-compose exec node-app ts-node src/db/seed-settings.ts

# Run the seed questions script
echo "Seeding questions..."
docker exec node-app ts-node src/db/seed-questions.ts

echo "Seeding questions..."
docker exec node-app ts-node src/db/seed-crystal-ball-question.ts

echo "Seeding questions..."
docker exec node-app ts-node src/db/seed-users.ts

echo "Seeding completed!"