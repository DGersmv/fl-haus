#!/bin/bash
# Security check before deployment

echo "SECURITY CHECK: COUNTRY-HOUSE"
echo "======================================"

# 1. Check React/Next.js versions
echo ""
echo "1) Check React/Next.js versions..."
REACT_VERSION=$(grep -oP '"react"\s*:\s*"[\^~]?\K[0-9.]+' package.json | head -1)
NEXT_VERSION=$(grep -oP '"next"\s*:\s*"[\^~]?\K[0-9.]+' package.json | head -1)

echo "React: $REACT_VERSION"
echo "Next.js: $NEXT_VERSION"

version_ge() {
    [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

REQUIRED_REACT="19.0.1"
REQUIRED_NEXT="16.0.7"

if [ -z "$REACT_VERSION" ]; then
    echo "FAIL: React version not found."
    exit 1
fi

if version_ge "$REACT_VERSION" "$REQUIRED_REACT"; then
    echo "OK: React version is safe."
else
    echo "FAIL: React version is below ${REQUIRED_REACT}."
    exit 1
fi

if [ -z "$NEXT_VERSION" ]; then
    echo "FAIL: Next.js version not found."
    exit 1
fi

if version_ge "$NEXT_VERSION" "$REQUIRED_NEXT"; then
    echo "OK: Next.js version is safe."
else
    echo "FAIL: Next.js version is below ${REQUIRED_NEXT}."
    exit 1
fi

# 2. Check .npmrc
echo ""
echo "2) Check .npmrc..."
if [ ! -f ".npmrc" ]; then
    echo "FAIL: .npmrc not found."
    exit 1
fi

if grep -q "ignore-scripts=true" .npmrc; then
    echo "OK: .npmrc has ignore-scripts=true."
else
    echo "FAIL: ignore-scripts=true not found in .npmrc."
    exit 1
fi

# 3. Check package.json scripts
echo ""
echo "3) Check suspicious scripts..."
SUSPICIOUS=$(grep -E '"(preinstall|prebuild)"' package.json || true)
if [ ! -z "$SUSPICIOUS" ]; then
    echo "WARN: Suspicious scripts found:"
    echo "$SUSPICIOUS"
    exit 1
else
    echo "OK: No suspicious preinstall/prebuild scripts."
fi

POSTINSTALL=$(grep -oP '"postinstall"\s*:\s*"\K[^"]+' package.json | head -1)
if [ ! -z "$POSTINSTALL" ] && [ "$POSTINSTALL" != "prisma generate" ]; then
    echo "FAIL: Unsafe postinstall script detected: $POSTINSTALL"
    exit 1
else
    echo "OK: postinstall is safe."
fi

# 4. Check for malicious files
echo ""
echo "4) Scan for malicious files..."
MALICIOUS=$(find . -name "*.x86_64" -o -name "*miner*" 2>/dev/null | grep -v node_modules || true)
if [ ! -z "$MALICIOUS" ]; then
    echo "FAIL: Suspicious files found:"
    echo "$MALICIOUS"
    exit 1
else
    echo "OK: No suspicious files found."
fi

# 5. npm audit
echo ""
echo "5) npm audit..."
npm audit --audit-level=high
AUDIT_RESULT=$?
if [ $AUDIT_RESULT -eq 0 ]; then
    echo "OK: No high severity vulnerabilities."
else
    echo "WARN: Vulnerabilities found. Review npm audit output."
fi

echo ""
echo "======================================"
echo "SECURITY CHECK COMPLETE"
echo "======================================"
