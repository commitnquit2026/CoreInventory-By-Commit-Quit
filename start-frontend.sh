#!/bin/bash

# Frontend & Backend Startup Script
# Run this file to start both servers automatically

echo "🚀 CoreInventory Frontend & Backend Startup"
echo "==========================================="
echo ""

# Check if backend is running
echo "📡 Checking backend..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "⚠️  Backend is NOT running"
    echo "   Start it in another terminal:"
    echo "   cd backend && python3 app.py"
fi

echo ""
echo "🎨 Starting frontend development server..."
echo "==========================================="
echo ""

cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time)..."
    npm install
fi

echo ""
echo "✅ Frontend starting on http://localhost:5173"
echo ""

npm run dev
