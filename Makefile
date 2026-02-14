# Simplified Makefile for Jekyll D&D site (following simplification principle)

.PHONY: help serve build build-site clean link-checker ci-build ci-link-check

# Docker configuration
DOCKER_IMAGE = dnd-jekyll
CONTAINER_NAME = dnd-site

# Default target
help:
	@echo "D&D Site Development Commands:"
	@echo "  serve       - Start development server"
	@echo "  build-site  - Build Jekyll site (static files only)"
	@echo "  link-checker- Check internal links locally (Docker)"
	@echo "  ci-build    - Build site for CI/CD (no Docker)"
	@echo "  ci-link-check- Check internal links for CI/CD (no Docker)"
	@echo "  extract     - Extract searchable content (skills, familiars)"
	@echo "  build       - Build Docker image"
	@echo "  clean       - Clean Docker artifacts"
	@echo "  help        - Show this help"

# Build Docker image
build:
	@echo "🐳 Building Jekyll Docker image..."
	docker build -t $(DOCKER_IMAGE) .
	@echo "✅ Docker image built!"

# Extract searchable content before building
extract:
	@echo "🔍 Extracting searchable content (skills, combat skills, familiars)..."
	ruby extract-searchable.rb
	@echo "✅ Extraction complete!"

# Build Jekyll site (static files in _site/)
build-site: build extract
	@echo "🏗️  Building Jekyll site..."
	docker run --rm \
		-v $(PWD):/srv/jekyll \
		$(DOCKER_IMAGE) \
		bundle exec jekyll build --baseurl="/dnd"
	@echo "✅ Site built in _site/ directory"

# Start development server
serve: clean build extract
	@echo "🚀 Starting Jekyll development server..."
	@echo "📍 Site will be available at: http://localhost:4000/dnd/"
	docker run --rm --name $(CONTAINER_NAME) \
		-v $(PWD):/srv/jekyll \
		-p 4000:4000 \
		$(DOCKER_IMAGE)

# Clean up
clean:
	@echo "🧹 Cleaning Docker artifacts..."
	docker stop $(CONTAINER_NAME) 2>/dev/null || true
	docker rm $(CONTAINER_NAME) 2>/dev/null || true
	docker rmi $(DOCKER_IMAGE) 2>/dev/null || true
	@echo "✅ Clean complete"

# Development build (faster, for testing)
dev-build: build-image ## Quick development build
	@echo "⚡ Quick development build in Docker..."
	$(DOCKER_RUN) $(DOCKER_IMAGE) bundle exec jekyll build --incremental --baseurl="/dnd"

# Check internal links with html-proofer
link-checker: build-site ## Check internal links locally
	@echo "🔗 Checking internal links with html-proofer in Docker..."
	docker run --rm \
		-v $(PWD):/srv/jekyll \
		$(DOCKER_IMAGE) \
		bundle exec htmlproofer _site \
			--ignore-urls "/assets/campaigns/,/assets/images/,https://,http://" \
			--ignore-files "spells.html,equipment.html" \
			--disable-external
	@echo "✅ Link checking complete!"

# CI/CD targets (no Docker required)
ci-build: extract ## Build Jekyll site for CI/CD
	@echo "🏠 Building Jekyll site for CI/CD..."
	bundle exec jekyll build --baseurl="/dnd"
	@echo "✅ CI build complete!"

ci-link-check: ## Check internal links for CI/CD (assumes site already built)
	@echo "🔗 Checking internal links with html-proofer for CI/CD..."
	bundle exec htmlproofer ./_site \
		--ignore-urls "/assets/campaigns/,/assets/images/,https://,http://" \
		--ignore-files "spells.html,equipment.html" \
		--disable-external
	@echo "✅ CI link checking complete!"

# Check site health
test: dev-build ## Run basic site tests
	@echo "🔍 Testing site..."
	@for file in $$(find _site -name "*.html" | head -5); do \
		echo "Checking $$file..."; \
		if ! grep -q "<!doctype html>" "$$file"; then \
			echo "⚠️  Missing doctype in $$file"; \
		fi; \
	done
	@echo "✅ Basic tests complete"

# Shell into container for debugging
shell: build-image ## Open shell in Jekyll container
	@echo "🐚 Opening shell in Jekyll container..."
	docker run --rm -it \
		-v $(PWD):/srv/jekyll \
		$(DOCKER_IMAGE) /bin/bash

# Show container logs
logs: ## Show logs from running container
	@echo "📋 Container logs:"
	docker logs $(CONTAINER_NAME) 2>/dev/null || echo "No running container found"

# Show git status and uncommitted changes
status: ## Show git status and site info
	@echo "📊 Repository Status:"
	@echo "===================="
	@git status --short
	@echo ""
	@echo "📈 Site Statistics:"
	@echo "  Content files: $$(find docs -name '*.md' | wc -l | tr -d ' ')"
	@echo "  Collections: $$(ls docs | grep '^_' | wc -l | tr -d ' ')"
	@echo "  Total assets: $$(find assets -type f | wc -l | tr -d ' ')"
	@echo "  Asset size: $$(du -sh assets 2>/dev/null | cut -f1 || echo 'N/A')"
	@docker images $(DOCKER_IMAGE) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" 2>/dev/null || true

# Deploy to GitHub Pages (pushes to main branch)
deploy: test ## Deploy to GitHub Pages
	@echo "🚀 Deploying to GitHub Pages..."
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "⚠️  You have uncommitted changes:"; \
		git status --short; \
		echo ""; \
		read -p "Continue with deployment? (y/N): " confirm; \
		if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then \
			echo "❌ Deployment cancelled"; \
			exit 1; \
		fi; \
	fi
	git push origin main
	@echo "✅ Deployed! Site will update at https://dnd.rigo.nu in a few minutes"

# Update dependencies
update: build-image ## Update Ruby gems to latest versions
	@echo "⬆️  Updating dependencies in Docker..."
	$(DOCKER_RUN) $(DOCKER_IMAGE) bundle update
	@echo "✅ Dependencies updated"

# Create a new campaign template
new-campaign: ## Create a new campaign template (usage: make new-campaign NAME=CampaignName)
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Please provide a campaign name: make new-campaign NAME=YourCampaignName"; \
		exit 1; \
	fi
	@echo "📝 Creating new campaign: $(NAME)"
	@mkdir -p "assets/campaigns/$(NAME)"
	@echo "---" > "docs/_Campaigns/$(NAME).md"
	@echo "title: $(NAME)" >> "docs/_Campaigns/$(NAME).md"
	@echo "layout: default" >> "docs/_Campaigns/$(NAME).md"
	@echo "---" >> "docs/_Campaigns/$(NAME).md"
	@echo "" >> "docs/_Campaigns/$(NAME).md"
	@echo "# $(NAME)" >> "docs/_Campaigns/$(NAME).md"
	@echo "" >> "docs/_Campaigns/$(NAME).md"
	@echo "## The Cast" >> "docs/_Campaigns/$(NAME).md"
	@echo "" >> "docs/_Campaigns/$(NAME).md"
	@echo "{% include characters.html path=X %}" >> "docs/_Campaigns/$(NAME).md"
	@echo "" >> "docs/_Campaigns/$(NAME).md"
	@echo "## The Scenery" >> "docs/_Campaigns/$(NAME).md"
	@echo "" >> "docs/_Campaigns/$(NAME).md"
	@echo "{% include scenery.html path=X %}" >> "docs/_Campaigns/$(NAME).md"
	@echo "✅ Campaign template created at docs/_Campaigns/$(NAME).md"
	@echo "📁 Asset directory created at assets/campaigns/$(NAME)/"
	@echo "💡 Don't forget to update _data/characters.yml and _data/scenery.yml"

# Stop running container
stop: ## Stop the development server
	@echo "🛑 Stopping Jekyll container..."
	docker stop $(CONTAINER_NAME) 2>/dev/null || echo "No container running"
	@echo "✅ Container stopped"