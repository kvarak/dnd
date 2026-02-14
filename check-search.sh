#!/bin/bash
# Tool to verify what's searchable in the site
# Usage: ./check-search.sh [search-term]

set -e

echo "🔍 Checking searchable content..."
echo ""

# Build site if needed
if [ ! -f "_site/search.json" ] || [ "search.json" -nt "_site/search.json" ]; then
    echo "📦 Building site..."
    bundle exec jekyll build --baseurl /dnd --quiet
    echo "✅ Build complete"
    echo ""
fi

# Check search.json exists and is valid JSON
if [ ! -f "_site/search.json" ]; then
    echo "❌ ERROR: _site/search.json not found"
    exit 1
fi

echo "📊 Search index statistics:"
echo "----------------------------"

# Count total entries
TOTAL=$(jq '. | length' _site/search.json)
echo "Total entries: $TOTAL"

# Count by collection
echo ""
echo "By collection:"
jq -r '.[] | .collection' _site/search.json | sort | uniq -c | sort -rn

# If search term provided, search for it
if [ -n "$1" ]; then
    echo ""
    echo "🔎 Searching for: '$1'"
    echo "----------------------------"
    # Search both title and content (like the website does)
    jq -r --arg term "$1" '.[] | select((.title | ascii_downcase | contains($term | ascii_downcase)) or (.content | ascii_downcase | contains($term | ascii_downcase))) | "[\(.collection)] \(.title)\n   → \(.url)\n"' _site/search.json
fi

echo ""
echo "📄 Full search.json location: _site/search.json"
echo "   View with: jq . _site/search.json | less"
