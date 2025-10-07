#!/bin/bash
set -e

echo "🧪 Shenna's Studio - Test Runner Script"
echo "=========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        echo "Stopping backend server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Trap EXIT to ensure cleanup runs
trap cleanup EXIT INT TERM

# Check if backend .env exists
if [ ! -f "ocean-backend/.env" ]; then
    echo -e "${RED}❌ Error: ocean-backend/.env file not found${NC}"
    echo "Please create ocean-backend/.env with your Railway credentials"
    exit 1
fi

# Start the backend server
echo -e "\n${BLUE}🚀 Starting Medusa backend server...${NC}"
cd ocean-backend
npm run dev > ../backend-test.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${BLUE}Backend server started with PID: $BACKEND_PID${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
MAX_WAIT=60
COUNTER=0
BACKEND_READY=false

while [ $COUNTER -lt $MAX_WAIT ]; do
    if curl -f http://localhost:9000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        BACKEND_READY=true
        break
    fi

    # Check if backend process is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend process died unexpectedly${NC}"
        echo -e "${YELLOW}Last 20 lines of backend log:${NC}"
        tail -n 20 backend-test.log
        exit 1
    fi

    echo "Waiting... ($COUNTER/$MAX_WAIT seconds)"
    sleep 2
    COUNTER=$((COUNTER + 2))
done

if [ "$BACKEND_READY" = "false" ]; then
    echo -e "${RED}❌ Backend failed to start within ${MAX_WAIT} seconds${NC}"
    echo -e "${YELLOW}Last 50 lines of backend log:${NC}"
    tail -n 50 backend-test.log
    exit 1
fi

# Run the tests
echo -e "\n${BLUE}🧪 Running Vitest tests...${NC}"
echo "=========================================="

if npm run test:run; then
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    TEST_EXIT_CODE=0
else
    echo -e "\n${RED}❌ Some tests failed${NC}"
    TEST_EXIT_CODE=1
fi

# Show backend log if tests failed
if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo -e "\n${YELLOW}📋 Backend server log (last 100 lines):${NC}"
    tail -n 100 backend-test.log
fi

echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "=========================================="
echo "Backend PID: $BACKEND_PID"
echo "Backend Log: backend-test.log"
echo "Exit Code: $TEST_EXIT_CODE"

exit $TEST_EXIT_CODE
