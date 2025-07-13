#!/bin/bash

echo "🚀 Goalee iOS App Setup"
echo "========================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Building Docker container..."
docker build -t goalee-app .

echo "🚀 Starting Goalee app..."
docker-compose up -d

echo "✅ Goalee is now running!"
echo ""
echo "🌐 Access your app at: http://localhost:3000"
echo ""
echo "📱 For iOS development:"
echo "   1. Open Safari on your iPhone/iPad"
echo "   2. Go to http://localhost:3000"
echo "   3. Tap the share button and 'Add to Home Screen'"
echo ""
echo "💻 For development with hot reload:"
echo "   docker-compose --profile dev up"
echo ""
echo "🛑 To stop the app:"
echo "   docker-compose down"
echo ""
echo "📚 For more options, see ios-setup.md" 