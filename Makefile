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

.PHONY: help serve build extract extract-archetypes clean find-broken-links ci-build update-creator-data check-creator-sync test-creator-data lint-md lint-md-fix test-structure test-structure-full test test-verbose validate-profiles validate-questions analyze-question-traits test-class-scoring test-ranking-system

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
	@echo "  make build              - Rebuild Docker image"
	@echo "  make clean              - Stop containers and clean up"
	@echo "  make minify             - Regenerate minified CSS/JS"
	@echo "  make extract            - Re-extract searchable content and archetypes"
	@echo "  make extract-archetypes - Extract archetypes from class files to _data/archetypes.yml"
	@echo ""
	@echo "Character Creator:"
	@echo "  make update-creator-data - Extract data from markdown for character creator"
	@echo "  make check-creator-sync  - Check if creator data needs update"
	@echo "  make test-creator-data   - Validate creator data structure"
	@echo ""
	@echo "Utilities:"
	@echo "  make find-broken-links   - Find placeholder images to replace"
	@echo "  make test                - Run all validation (lint-md + validate-questions)"
	@echo "  make test-verbose        - Run validation with detailed output"
	@echo "  make lint-md             - Validate markdown formatting and structure"
	@echo "  make lint-md-quiet       - Validate markdown with minimal output"
	@echo "  make lint-md-fix         - Auto-fix markdown formatting issues (trailing whitespace, blank lines, bold/italic)"
	@echo "  make test-structure      - Validate Varlyn patterns for MVP files (Human+Elf+Tiefling, Fighter+Wizard+Cursed)"
	@echo "  make test-structure-quiet - Validate Varlyn patterns with minimal output"
	@echo "  make test-structure-full - Validate Varlyn patterns for all Folk/Class files"
	@echo "  make validate-profiles   - Validate class profile frontmatter schema (checks archetype anchor naming)"
	@echo "  make validate-questions  - Validate class selector question bank coverage"
	@echo "  make analyze-question-traits - Analyze multi-trait vs single-trait questions"
	@echo "  make test-class-scoring  - Test class recommendation scoring algorithm"
	@echo "  make test-ranking-system - Test class recommendation ranking and explanations"
	@echo ""
	@echo "🐳 Everything runs in Docker - no local setup needed!"

# Build Docker image with Jekyll
build:
	@echo "🐳 Building Docker image with Jekyll..."
	docker build -t $(DOCKER_IMAGE) .

# Extract searchable content (skills, familiars, feats, etc.)
extract: build extract-archetypes
	@echo "🔍 Extracting searchable content..."
	@docker run --rm -v $(PWD):/srv/jekyll $(DOCKER_IMAGE) ruby tools/extract-searchable.rb

# Extract archetypes from class files
extract-archetypes: build
	@echo "🎭 Extracting archetypes from class files..."
	@docker run --rm -v $(PWD):/srv/jekyll $(DOCKER_IMAGE) ruby tools/extract-archetypes.rb

# Start development server (does extract automatically)
serve: clean build extract
	@echo "🚀 Starting Jekyll development server..."
	@echo "📍 http://localhost:4000/dnd/"
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

# Character Creator Data Management
# Update character creator data from markdown files
update-creator-data: build
	@echo "🎲 Extracting character creation data from Jekyll collections..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		npm run build-creator-data"
	@echo "✅ Creator data updated: assets/data/creator-data.json"
	@echo "   Last sync: $$(date)"

# Check if creator data is in sync with source files
check-creator-sync: build
	@echo "🔍 Checking if creator data is in sync..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		npm run check-creator-sync"

# Validate creator data structure
test-creator-data: build
	@echo "🧪 Validating creator data structure..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		npm test"

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
	@echo "📝 Step 1: Markdown linting..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js docs" && \
	echo "" && \
	echo "🎯 Step 2: Question bank validation..." && \
	docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/validate-question-bank.js"

# Quiet mode versions (minimal output with dots)
test: build
	@echo "🚀 Running validation (quiet mode)..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent && \
		node tools/lint-markdown.js --quiet docs" && \
	echo "" && \
	echo "📋 Validating class profiles..." && \
	docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/validate-class-profiles.js" && \
	echo "" && \
	echo "🎯 Validating question bank..." && \
	docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/validate-question-bank.js" && \
	echo "" && \
	echo "🔤 Checking for problematic answer characters..." && \
	docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/validate-answer-characters.js"

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

# Validate class profile frontmatter schema
validate-profiles: build
	@echo "🎭 Validating class profile schemas..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/validate-class-profiles.js"

# Validate question bank coverage and structure
validate-questions: build
	@echo "🎯 Validating question bank..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/validate-question-bank.js"

# Analyze question bank trait distribution
analyze-question-traits: build
	@echo "🔍 Analyzing question trait coverage..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/analyze-question-traits.js"

# Test class recommendation scoring algorithm
test-class-scoring: build
	@echo "🧪 Testing class scoring algorithm..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/test-class-scoring.js"

# Test class recommendation ranking and explanations
test-ranking-system: build
	@echo "🏆 Testing recommendation ranking system..."
	@docker run --rm -v $(PWD):/srv/jekyll -w /srv/jekyll $(DOCKER_IMAGE) sh -c " \
		npm install --silent js-yaml && \
		node tools/test-ranking-system.js"
