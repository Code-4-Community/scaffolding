#!/bin/bash

# Test script for PandaDoc webhook endpoint
# Usage: ./test-webhook.sh [port]
# Default port is 3000

PORT=${1:-3000}
BASE_URL="http://localhost:${PORT}/api/applications/webhook/pandadoc"

echo "Testing PandaDoc webhook endpoint at: ${BASE_URL}"

# Send the mock webhook payload
curl -X POST "${BASE_URL}" \
  -H "Content-Type: application/json" \
  -d @mock-pandadoc-webhook.json \
  -v

echo "Test completed!"
