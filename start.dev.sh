check_mongodb_health() {
  nc -z mongodb 27017
}

until check_mongodb_health; do
  echo "Waiting for MongoDB to be healthy..."
  sleep 2
done

echo "Running database seeding..."
npm run seed

# Start the application
echo "Starting the application..."
npm run dev