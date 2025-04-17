#!/usr/bin/env bash
set -e

# Start all services
echo "Starting services..."
docker-compose up -d
sleep 10

# Produce a valid sentiment tick
echo "Sending dummy sentiment tick..."
TS=$(date +%s)
echo "{\"symbol\":\"BTC\",\"ts\":${TS},\"sentiment\":0.9}" \
  | docker-compose exec -T kafka kafka-console-producer --broker-list kafka:9092 --topic sentiment > /dev/null

# Consume from orders topic with timeout
echo "Waiting for order..."
if command -v timeout &> /dev/null; then
  timeout 10s docker-compose exec -T kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic orders --from-beginning --max-messages 1
else
  docker-compose exec -T kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic orders --from-beginning --max-messages 1 &
  PID=$!
  (sleep 10 && kill $PID) &
  wait $PID || true
fi

echo "Dummy E2E test complete."
