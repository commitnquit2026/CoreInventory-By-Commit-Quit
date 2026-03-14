#!/bin/bash

# Backend Startup Script
# Run this to start the Flask backend API

echo "🚀 CoreInventory Backend Startup"
echo "================================="
echo ""

cd "$(dirname "$0")/backend"

# Check if requirements are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "✅ Backend starting on http://localhost:5000"
echo ""
echo "API Endpoints:"
echo "  - Health Check: GET http://localhost:5000/health"
echo "  - API Base: http://localhost:5000/api/v1"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 app.py
