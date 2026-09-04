# D&D Site Development (Docker)

> Jekyll site for dnd.rigo.nu - Custom Varlyn rules and campaign documentation
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

Run `make help` to see all available commands.

## Setup

`make serve` builds Docker image, mounts current directory, and starts Jekyll server on port 4000 with auto-reload.

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

1. Create markdown file in appropriate collection (e.g., `docs/_Classes/`, `docs/_Folk/`, `docs/_Campaigns/`)
2. Add YAML frontmatter (see existing files)
3. Update `_data/` if adding characters/scenery
4. Run `make lint-md` (formatting)

## Troubleshooting

**Container won't start:**
```bash
make clean        # Clean everything
make build        # Rebuild Docker image
make serve        # Try again
```

**Common Issues:**
- Port in use: `make clean`
- Build failures: `docker ps` and `docker logs`
- Changes not reflected: `Ctrl+C` and `make serve`

## Deployment

Site deploys automatically to **https://dnd.rigo.nu** when pushing to `main` branch via GitHub Pages.

## Developer Tools

See `tools/README.md` for complete tool documentation and usage.

## Adding New Archetypes

1. **Add archetype to class file** — Add a new heading/section following the existing archetype structure
2. **Add internal anchor** — Use `{: #internal-archetypeName}` and matching TOC entry
3. **Add folk restrictions (optional)** — Note folk-specific restrictions in the archetype's description
4. **Update search** — Run `make extract` to include in searchable content

For archetype patterns, reference existing class files in `docs/_Classes/`.

---

## Campaign Statistics: Level Duration Analysis

### Overview

The Level Duration Matrix visualizes how many real-world days each campaign spent at each character level (1-20). Accounts for characters joining at different levels and fills gaps via interpolation.

### Algorithm

**1. Data Collection**

For each campaign, filter characters by `path` (campaign number):

```javascript
campaignChars = characterData.filter(c => c.path == campaign.nr)
```

**2. Per-Character Duration Calculation**

For each character with valid `start`, `end`, `startlevel`, and `maxlvl`:

```javascript
totalDays = daysBetween(start, end)
startLvl = startlevel
endLvl = maxlvl - maxlvl2  // Account for multiclassing
levelsGained = endLvl - startLvl

if (levelsGained >= 0 && totalDays > 0) {
  // Include both start and end level (character played at both)
  levelsExperienced = levelsGained + 1
  daysPerLevel = totalDays / levelsExperienced

  // Distribute days-per-level to all levels played (inclusive)
  for (lvl = startLvl; lvl <= endLvl; lvl++) {
    levelDurations[lvl] += daysPerLevel
    levelCounts[lvl] += 1
  }
}
```

**Example:**
- Character played 100 days, started at level 3, reached level 8
- Levels gained: 8 - 3 = 5
- Levels experienced: 5 + 1 = 6 (played at levels 3, 4, 5, 6, 7, 8)
- Days per level: 100 / 6 = 16.7 days
- Contributes 16.7 days to levels 3, 4, 5, 6, 7, 8
**4. Gap Interpolation**

Characters often join campaigns at current level (e.g., new player joins level 11 campaign). This creates gaps where no characters played certain levels.

```javascript
allLevels = sortedKeys(avgByLevel)
minLvl = allLevels[0]
maxLvl = allLevels[last]

for (lvl = minLvl; lvl <= maxLvl; lvl++) {
  if (!avgByLevel[lvl]) {
    // Find nearest levels with data
    leftLvl = findNearestLeft(lvl, avgByLevel)
    rightLvl = findNearestRight(lvl, avgByLevel)

    if (leftLvl exists && rightLvl exists) {
      // Interpolate between adjacent levels
      avgByLevel[lvl] = round((avgByLevel[leftLvl] + avgByLevel[rightLvl]) / 2)
    } else if (leftLvl exists) {
      avgByLevel[lvl] = avgByLevel[leftLvl]
    } else if (rightLvl exists) {
      avgByLevel[lvl] = avgByLevel[rightLvl]
    }
  }
}
```

**Example Gap Fill:**
- Level 9: 43 days (actual data)
- Level 10: missing (no characters)
- Level 11: 21 days (actual data)
- **Interpolated:** Level 10 = (43 + 21) / 2 = 32 days

**5. Per-Row Color Scaling**

Each campaign row uses its own min/max for color intensity:

```javascript
campaignDays = values(campaign.levels).filter(d => d > 0)
minDays = min(campaignDays)
maxDays = max(campaignDays)

getColorIntensity(days) {
  if (!days) return lightGray
  normalized = (days - minDays) / (maxDays - minDays)
  lightness = 85% - (normalized * 30%)  // Range: 85% to 55%
  return hsl(210, 80%, lightness)
}
```

This ensures each campaign's internal variation is visible, even if absolute day counts differ significantly between campaigns.

**Implementation Files:**
- `assets/js/campaign-stats.js` - `renderLevelDurationMatrix()` function
- `assets/js/campaign-data.js` - Data fetching and caching from Google Sheets
- `tools/statistics.html` - Matrix container and styling

