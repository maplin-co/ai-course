#!/bin/bash

# Hostinger Deployment Preparation Script
# This script prepares your frontend for Hostinger deployment

echo "========================================="
echo "Hostinger Deployment Preparation"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the frontend directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found package.json${NC}"
echo ""

# Step 2: Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build the project
echo "Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build completed successfully${NC}"
echo ""

# Step 4: Copy .htaccess to build folder
echo "Copying .htaccess to build folder..."
if [ -f ".htaccess" ]; then
    cp .htaccess build/.htaccess
    echo -e "${GREEN}✓ .htaccess copied to build folder${NC}"
else
    echo -e "${YELLOW}⚠ Warning: .htaccess file not found. Creating one...${NC}"
    cat > build/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOF
    echo -e "${GREEN}✓ .htaccess created in build folder${NC}"
fi
echo ""

# Step 5: Create deployment package
echo "Creating deployment package..."
cd build
zip -r ../hostinger-deployment.zip .
cd ..
echo -e "${GREEN}✓ Deployment package created: hostinger-deployment.zip${NC}"
echo ""

# Step 6: Display summary
echo "========================================="
echo "Deployment Preparation Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Log in to your Hostinger control panel"
echo "2. Go to File Manager"
echo "3. Navigate to public_html folder"
echo "4. Delete existing files (if any)"
echo "5. Upload all files from the 'build' folder"
echo "   OR upload and extract 'hostinger-deployment.zip'"
echo ""
echo "Files ready for deployment:"
echo "  - Location: ./build/"
echo "  - Package: ./hostinger-deployment.zip"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "  - Make sure your backend API is deployed and accessible"
echo "  - Update API URLs in your environment configuration"
echo "  - Test the deployment after uploading"
echo ""
echo "========================================="
