check_mongodb_health() {
  nc -z mongodb 27017
}

until check_mongodb_health; do
  echo "Waiting for MongoDB to be healthy..."
  sleep 2
done

echo "MongoDB is healthy. Running npm run seed..."

npm run seed

echo "Seeding completed. Starting the application..."

echo "Starting the application..."
node dist/app.js