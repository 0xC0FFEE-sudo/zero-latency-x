#!/usr/bin/env bash
set -e

# Start all services
echo "Bringing up services..."
docker-compose up -d
sleep 10

# Test JSON-RPC
echo "Testing ZLChain RPC..."
RPC_RESP=$(curl -s -X POST http://localhost:8545/rpc -H "Content-Type: application/json" -d '{"method":"propose_block","params":[]}')
echo "RPC response: $RPC_RESP"

# Test gRPC Preprocessor
echo "Testing AI Preprocessor gRPC..."
if command -v grpcurl &> /dev/null; then
  grpcurl -plaintext localhost:50051 list | sed -n '1,5p'
else
  echo "grpcurl not installed, skipping."  
fi

# Test Kafka topics
echo "Listing Kafka topics..."
docker-compose exec -T kafka kafka-topics --list --bootstrap-server kafka:9092

# Produce a test sentiment tick
echo '{"symbol":"BTC","ts":123456789,"payload":"{\"price\":60000}"}' \
  | docker-compose exec -T kafka kafka-console-producer --broker-list kafka:9092 --topic sentiment > /dev/null
sleep 5

# Consume from orders
echo "Consuming orders topic..."
docker-compose exec -T kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic orders --from-beginning --max-messages 1

echo "E2E test complete."
