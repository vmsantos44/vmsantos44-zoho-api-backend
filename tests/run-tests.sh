#!/bin/bash

# Zoho CRM GPT API - Test Runner Script
# Usage: chmod +x run-tests.sh && ./run-tests.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
API_URL="https://vmsantos44-zoho-api-backend.vercel.app"
TEST_SCRIPT="api-error-tests.js"
RESULTS_DIR="results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_FILE="${RESULTS_DIR}/test-results-${TIMESTAMP}.txt"
MARKDOWN_RESULTS="${RESULTS_DIR}/test-results-${TIMESTAMP}.md"

# Print banner
echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Zoho CRM GPT API - Error Test Suite Runner              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} detected${NC}"

# Check if test script exists
if [ ! -f "$TEST_SCRIPT" ]; then
    echo -e "${RED}Error: Test script '${TEST_SCRIPT}' not found${NC}"
    echo "Make sure you're running this from the tests directory"
    exit 1
fi

echo -e "${GREEN}✓ Test script found${NC}"

# Create results directory if it doesn't exist
mkdir -p "$RESULTS_DIR"
echo -e "${GREEN}✓ Results directory ready${NC}"

# Check API availability
echo ""
echo -e "${BLUE}Checking API availability...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "${API_URL}/api/privacy-policy" | grep -q "200"; then
    echo -e "${GREEN}✓ API is reachable${NC}"
else
    echo -e "${YELLOW}⚠ Warning: API may not be reachable${NC}"
    echo "Continuing anyway, but tests may fail..."
fi

# Run the tests
echo ""
echo -e "${BOLD}${BLUE}Starting test execution...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Run tests and capture output
if node "$TEST_SCRIPT" 2>&1 | tee "$RESULTS_FILE"; then
    TEST_EXIT_CODE=0
    echo ""
    echo -e "${GREEN}${BOLD}✓ All tests passed!${NC}"
else
    TEST_EXIT_CODE=$?
    echo ""
    echo -e "${RED}${BOLD}✗ Some tests failed${NC}"
fi

# Generate summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Test Execution Complete${NC}"
echo ""

# Parse results from the output file
TOTAL_TESTS=$(grep -o "Total Tests:" "$RESULTS_FILE" | wc -l)
if [ "$TOTAL_TESTS" -gt 0 ]; then
    PASSED=$(grep "Passed:" "$RESULTS_FILE" | awk '{print $2}')
    FAILED=$(grep "Failed:" "$RESULTS_FILE" | awk '{print $2}')
    DURATION=$(grep "Duration:" "$RESULTS_FILE" | awk '{print $2}')

    echo -e "Results saved to: ${GREEN}${RESULTS_FILE}${NC}"
    echo ""
    echo "Summary:"
    echo "  Tests Passed: ${GREEN}${PASSED}${NC}"
    echo "  Tests Failed: ${RED}${FAILED}${NC}"
    echo "  Duration: ${DURATION}"
else
    echo -e "${YELLOW}Unable to parse test results${NC}"
fi

# Copy template and create markdown report
echo ""
echo -e "${BLUE}Generating markdown report...${NC}"
cp test-results-template.md "$MARKDOWN_RESULTS"

# Add timestamp to markdown
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\[YYYY-MM-DD HH:MM:SS\]/$(date '+%Y-%m-%d %H:%M:%S')/" "$MARKDOWN_RESULTS"
else
    # Linux
    sed -i "s/\[YYYY-MM-DD HH:MM:SS\]/$(date '+%Y-%m-%d %H:%M:%S')/" "$MARKDOWN_RESULTS"
fi

echo -e "${GREEN}✓ Markdown template created: ${MARKDOWN_RESULTS}${NC}"
echo ""
echo -e "${YELLOW}Please fill in the markdown report with detailed results${NC}"

# Generate artifact archive
ARCHIVE_NAME="test-results-${TIMESTAMP}.tar.gz"
echo ""
echo -e "${BLUE}Creating archive...${NC}"
tar -czf "${RESULTS_DIR}/${ARCHIVE_NAME}" "$RESULTS_FILE" "$MARKDOWN_RESULTS" 2>/dev/null || true
echo -e "${GREEN}✓ Archive created: ${RESULTS_DIR}/${ARCHIVE_NAME}${NC}"

# Cleanup old results (keep last 10)
echo ""
echo -e "${BLUE}Cleaning up old results...${NC}"
cd "$RESULTS_DIR"
ls -t test-results-*.txt 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
ls -t test-results-*.md 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
ls -t test-results-*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
cd ..
echo -e "${GREEN}✓ Cleanup complete${NC}"

# Final summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Next Steps:${NC}"
echo ""
echo "1. Review the test output in: ${RESULTS_FILE}"
echo "2. Fill in the markdown report: ${MARKDOWN_RESULTS}"
echo "3. Archive is available at: ${RESULTS_DIR}/${ARCHIVE_NAME}"
echo ""

if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo -e "${YELLOW}Tests completed with failures. Please review the output.${NC}"
else
    echo -e "${GREEN}All tests passed successfully!${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Exit with the same code as the test script
exit $TEST_EXIT_CODE
