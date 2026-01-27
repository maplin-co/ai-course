#!/bin/bash

echo "=========================================="
echo "  Preparing LearnFlow for Hostinger"
echo "=========================================="

echo ""
echo "[1/2] Installing dependencies..."
npm install

echo ""
echo "[2/2] Building for production..."
npm run build

echo ""
echo "=========================================="
echo "  Build Complete!"
echo "=========================================="
echo ""
echo "Upload the contents of the 'build' folder"
echo "to your Hostinger 'public_html' directory."