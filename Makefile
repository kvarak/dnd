# Simplified Makefile for Jekyll D&D site (following simplification principle)

.PHONY: help serve build clean

# Docker configuration
DOCKER_IMAGE = dnd-jekyll
CONTAINER_NAME = dnd-site

# Default target
help:
	@echo "D&D Site Development Commands:"
	@echo "  serve    - Start development server"
	@echo "  build    - Build Docker image"
	@echo "  clean    - Clean Docker artifacts"
	@echo "  help     - Show this help"

# Build Docker image
build:
	@echo "🐳 Building Jekyll Docker image..."
	docker build -t $(DOCKER_IMAGE) .
	@echo "✅ Docker image built!"

# Start development server
serve: build
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