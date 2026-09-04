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

.PHONY: help serve build extract clean find-broken-links ci-build ci-link-check lint-md lint-md-fix test-structure test-structure-full test test-verbose

# Docker configuration
# Works on Mac (Intel & Apple Silicon), Linux, and Windows
# Uses named volume for gem caching across runs
DOCKER_IMAGE = dnd-jekyll
CONTAINER_NAME = dnd-site
BUNDLE_CACHE = dnd-bundle-cache

# Default: show help
help:
	@echo "🎲 D&D Site Development (Docker-based)"
	@echo ""
	@echo "Daily workflow:"
	@echo "  make serve    - Start development server (does everything)"
	@echo ""
	@echo "Manual operations:"
	@echo "  make build              - Rebuild Docker image"
	@echo "  make clean              - Stop containers and clean up"
	@echo "  make minify             - Regenerate minified CSS/JS"
	@echo "  make extract            - Re-extract searchable content"
	@echo ""
	@echo "Utilities:"
	@echo "  make find-broken-links   - Find placeholder images to replace"
	@echo "  make test                - Run all validation (lint-md)"
	@echo "  make test-verbose        - Run validation with detailed output"
	@echo "  make lint-md             - Validate markdown formatting and structure"
	@echo "  make lint-md-quiet       - Validate markdown with minimal output"
	@echo "  make lint-md-fix         - Auto-fix markdown formatting issues (trailing whitespace, blank lines, bold/italic)"
	@echo "  make test-structure      - Validate Varlyn patterns for MVP files (Human+Elf+Tiefling, Fighter+Wizard+Cursed)"
	@echo "  make test-structure-quiet - Validate Varlyn patterns with minimal output"
	@echo "  make test-structure-full - Validate Varlyn patterns for all Folk/Class files"
	@echo ""
	@echo "🐳 Everything runs in Docker - no local setup needed!"

# Build Docker image with Jekyll
build:
	@echo "🐳 Building Docker image with Jekyll..."
	docker build -t $(DOCKER_IMAGE) .

# Extract searchable content (skills, familiars, feats, etc.)
extract: build
	@echo "🔍 Extracting searchable content..."
	@docker run --rm -v $(PWD):/srv/jekyll -v $(BUNDLE_CACHE):/usr/local/bundle $(DOCKER_IMAGE) ruby tools/extract-searchable.rb

# Start development server (does extract automatically)
serve: clean build extract
	@echo "🚀 Starting Jekyll development server..."
	@echo "📍 http://localhost:4000/dnd/"
	@docker run --rm --name $(CONTAINER_NAME) -v $(PWD):/srv/jekyll -v $(BUNDLE_CACHE):/usr/local/bundle --env JEKYLL_ROOTLESS=1 -p 4000:4000 $(DOCKER_IMAGE) sh -c "bundle install && bundle exec jekyll serve --host 0.0.0.0 --port 4000 --baseurl /dnd --watch"

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

# CI internal link check (used by GitHub Actions after ci-build)
ci-link-check:
	@echo "🔗 Checking internal links..."
	bundle exec htmlproofer ./_site \
		--ignore-urls "/assets/campaigns/,/assets/images/,https://,http://" \
		--ignore-files "spells.html,equipment.html" \
		--disable-external

# Validate markdown formatting and structure
lint-md: build
	@echo "📝 Validating markdown formatting and structure..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js docs"

lint-md-fix: build
	@echo "🔧 Auto-fixing markdown formatting issues..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js --fix docs"

test-structure: build
	@echo "🔬 Testing Varlyn structure patterns (MVP: 3 Folk + 3 Classes)..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/test-structure.js --mvp"

test-structure-full: build
	@echo "🔬 Testing Varlyn structure patterns (Full dataset)..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/test-structure.js --full"

test-verbose: build
	@echo "🚀 Running validation tools..."
	@echo ""
	@echo "📝 Markdown linting..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js docs"

# Quiet mode versions (minimal output with dots)
test: build
	@echo "🚀 Running validation (quiet mode)..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js --quiet docs"

lint-md-quiet: build
	@echo "📝 Markdown linting (quiet)..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js --quiet docs"

test-structure-quiet: build
	@echo "🔬 Structure testing (quiet, MVP)..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/test-structure.js --mvp --quiet"

