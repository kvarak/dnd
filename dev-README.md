# D&D Site Development (Docker)

> Jekyll site for dnd.rigo.nu - Custom 5e Darker Dungeons rules and campaign documentation
>
> 🐳 **Fully containerized development environment**

## Quick Start

```bash
# Start local development server
make serve
```

Site will be available at: **http://localhost:4000/dnd/**

## Prerequisites

- **Docker** - The only requirement! No Ruby, Jekyll, or gems needed on your machine

## Development Commands

- `make serve` - Start local server with auto-reload (builds Docker image first)
- `make build` - Build for production
- `make test` - Run basic tests
- `make clean` - Clean build artifacts and Docker cache
- `make shell` - Open shell in Jekyll container for debugging
- `make logs` - Show container logs
- `make stop` - Stop running container
- `make status` - Show repo and site status
- `make deploy` - Deploy to GitHub Pages
- `make help` - Show all commands

## How Docker Setup Works

The `make serve` command:
1. **Builds Docker image** with Jekyll and all dependencies
2. **Creates volume mount** to sync your files with container
3. **Starts Jekyll server** with auto-reload and live reload
4. **Exposes port 4000** for local access
5. **Watches for changes** and rebuilds automatically

## Docker Image Details

- **Base:** `jekyll/jekyll:4.2.2` (official Jekyll image)
- **Gems:** GitHub Pages compatible versions
- **Port:** 4000 (mapped to host)
- **Volume:** Current directory mounted to `/srv/jekyll`
- **Auto-reload:** Enabled with live refresh

## Site Structure

- **docs/** - Jekyll collections for content
  - `_Campaigns/` - Campaign documentation
  - `_Classes/` - Character classes
  - `_Folk/` - Races and peoples
  - `_Rules*/` - Game rules organized by category
- **assets/** - Static assets (CSS, JS, images)
- **_data/** - Site data (characters, navigation, etc.)
- **_includes/** - Reusable templates
- **_layouts/** - Page layouts
- **Dockerfile** - Container configuration
- **Gemfile** - Ruby dependencies

## Adding Content

**New Campaign:**
```bash
make new-campaign NAME=YourCampaignName
```

**Manual Content:**
1. Create markdown file in appropriate `docs/_Collection/`
2. Add proper YAML frontmatter
3. Update `_data/` files for characters/scenery if needed
4. Changes auto-reload in browser

## Troubleshooting

**Container won't start:**
```bash
make clean        # Clean everything
make build-image  # Rebuild image
make serve        # Try again
```

**Need to debug:**
```bash
make shell  # Get shell inside container
make logs   # Check container logs
```

**Port already in use:**
```bash
make stop   # Stop any running containers
```

## Deployment

Site deploys automatically to **https://dnd.rigo.nu** when pushing to `main` branch via GitHub Pages.

```bash
make deploy  # Pushes to main branch
```

No Docker needed for deployment - GitHub Pages handles building and serving.