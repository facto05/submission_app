#!/bin/bash
# Reset React Native Android Project
# Fixes common issues like "SubmissionApp has not been registered"

echo "🔧 React Native Android Reset Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Stopping Metro bundler...${NC}"
killall -9 node 2>/dev/null || true
sleep 2

echo -e "${YELLOW}Step 2: Cleaning npm cache...${NC}"
npm cache clean --force

echo -e "${YELLOW}Step 3: Removing node_modules...${NC}"
rm -rf node_modules

echo -e "${YELLOW}Step 4: Reinstalling dependencies...${NC}"
npm install

echo -e "${YELLOW}Step 5: Cleaning Android build...${NC}"
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..

echo -e "${YELLOW}Step 6: Removing Android build artifacts...${NC}"
rm -rf android/app/build
rm -rf android/.gradle

echo ""
echo -e "${GREEN}✅ Reset complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Terminal 1: npm start"
echo "2. Terminal 2: npm run android"
echo ""
