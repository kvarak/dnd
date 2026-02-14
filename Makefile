# Simplified Makefile for Jekyll D&D site
#
# DEVELOPMENT PRINCIPLE: 100% Docker-based development
# - NO local tool installation (npm, node, ruby gems, etc.)
# - ALL development tools run inside Docker containers
# - Keeps host machine clean and ensures consistent environments
# - Dev/prod parity through identical tooling
#
# SIMPLIFICATION PRINCIPLE: Only essential targets
# - Removed unused/broken targets
# - Focus on daily development workflow
# - Everything works out of the box

.PHONY: help serve build extract minify clean find-broken-links ci-build

# Docker configuration
DOCKER_IMAGE = dnd-jekyll
CONTAINER_NAME = dnd-site

# Default: show help
help:
	@echo "🎲 D&D Site Development (Docker-based)"
	@echo ""
	@echo "Daily workflow:"
	@echo "  make serve    - Start development server (does everything)"
	@echo ""
	@echo "Manual operations:"
	@echo "  make build    - Rebuild Docker image"
	@echo "  make clean    - Stop containers and clean up"
	@echo "  make minify   - Regenerate minified CSS/JS"
	@echo "  make extract  - Re-extract searchable content"
	@echo ""
	@echo "Utilities:"
	@echo "  make find-broken-links - Find placeholder images to replace"
	@echo ""
	@echo "🐳 Everything runs in Docker - no local setup needed!"

# Build Docker image with Jekyll + Node.js + minification tools
build:
	@echo "🐳 Building Docker image with Jekyll + Node.js..."
	docker build -t $(DOCKER_IMAGE) .

# Extract searchable content (skills, familiars, etc.)
extract: build
	@echo "🔍 Extracting searchable content..."
	@docker run --rm -v $(PWD):/srv/jekyll $(DOCKER_IMAGE) ruby extract-searchable.rb

# Minify CSS and JS inside Docker container
minify: build
	@echo "⚡ Minifying assets inside Docker..."
	@docker run --rm -v $(PWD):/srv/jekyll $(DOCKER_IMAGE) sh -c " \
		cleancss -o assets/css/style.min.css assets/css/style.css && \
		cleancss -o assets/css/newstyle.min.css assets/css/newstyle.css && \
		terser assets/js/search.js -o assets/js/search.min.js -c -m && \
		terser assets/js/skills-anchors.js -o assets/js/skills-anchors.min.js -c -m && \
		terser assets/js/function.js -o assets/js/function.min.js -c -m"
	@echo "✅ Minified: $$(du -h assets/css/style.min.css | cut -f1) CSS, $$(du -h assets/js/search.min.js | cut -f1) JS"

# Start development server (does extract & minify automatically)
serve: clean build extract minify
	@echo "🚀 Starting Jekyll development server..."
	@echo "📍 http://localhost:4000/dnd/"
	@echo "✅ Using minified assets (dev/prod parity)"
	@docker run --rm --name $(CONTAINER_NAME) -v $(PWD):/srv/jekyll -p 4000:4000 $(DOCKER_IMAGE)

# Clean up containers and images
clean:
	@echo "🧹 Cleaning up Docker..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi $(DOCKER_IMAGE) 2>/dev/null || true

# Find images that need replacement
find-broken-links:
	@echo "🔍 Finding placeholder images..."
	@grep -r -n "Placeholder.*image" docs/ --include="*.md" | sed 's/:.*: /: /' || echo "✅ No placeholders found"

# CI/CD build (used by GitHub Actions)
ci-build: extract
	@echo "🏗️  Building for CI/CD..."
	bundle exec jekyll build --baseurl="/dnd"
