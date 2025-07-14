#!/bin/bash

# Test script for the reconstructor website
echo "🧪 Testing UNDERNET Memory Reconstructor..."

# Check if required files exist
echo "📁 Checking required files..."
if [ -f "website/public/encrypted_memories.csv" ]; then
    echo "✅ encrypted_memories.csv found"
else
    echo "❌ encrypted_memories.csv missing"
fi

if [ -f "website/public/DB.csv" ]; then
    echo "✅ DB.csv found"
else
    echo "❌ DB.csv missing"
fi

if [ -f "website/api/database.js" ]; then
    echo "✅ API endpoint found"
else
    echo "❌ API endpoint missing"
fi

# Count memory fragments
echo "📊 Memory fragment statistics..."
TOTAL_FRAGMENTS=$(wc -l < website/public/encrypted_memories.csv)
echo "Total entries in database: $((TOTAL_FRAGMENTS - 1))" # Subtract header

# Check for each memory type
echo "🧬 Memory types in database:"
for TYPE in VIRAL BUILD SAIL DREAM LIVE DESIGN HIKE ADVENTURE; do
    COUNT=$(grep -c "$TYPE" website/public/encrypted_memories.csv)
    echo "  $TYPE: $COUNT fragments"
done

echo "🚀 Website should be running at: http://localhost:4322/reconstructor"
echo ""
echo "🔧 To test:"
echo "1. Upload 5 fragments from the same memory type (e.g., all VIRAL1-5)"
echo "2. Check that non-matching fragments are rejected"
echo "3. Verify completed groups show in popup"
echo "4. Test that same group cannot be completed twice"
