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

1. Create markdown file in `docs/_Collection/`
2. Add YAML frontmatter (see existing files)
3. Update `_data/` if adding characters/scenery
4. Run `make validate-profiles` (classes) or `make lint-md` (formatting)

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

## Questionnaire Scoring System

### Multi-Dimensional Trait Scoring

Each answer affects multiple traits with positive/negative values. Player scores are calculated as percentages and matched against class profile requirements.

**Data Structure:**
```yaml
# _data/question-bank.yml
- id: healing-magic
  text: "Do you want to heal and protect your allies?"
  answers:
    "yes":
      healing-magic: +4      # Strong FOR healing
      damage-magic: -2       # Moderate AGAINST damage
      utility-magic: +1      # Slight toward utility
    "no":
      healing-magic: -2      # Against healing
      damage-magic: +4       # Strong for damage
```

**Scoring Algorithm:**

1. **Accumulate scores** as player answers:
   ```javascript
   traitScores = {
     'healing-magic': { current: 0, min: 0, max: 0 },
     'damage-magic': { current: 0, min: 0, max: 0 },
     // ... etc
   }

   // For each question, update all affected traits
   for (question in questions) {
     for (trait in question.answer[playerChoice]) {
       traitScores[trait].current += trait.value
       traitScores[trait].min += (min possible value this Q)
       traitScores[trait].max += (max possible value this Q)
     }
   }
   ```

2. **Calculate alignment percentage:**
   ```javascript
   percentage = (current - min) / (max - min) * 100

   // Example: healing-magic
   // current: +6, min: -4, max: +10
   // percentage = (6 - (-4)) / (10 - (-4)) = 10/14 = 71%
   ```

3. **Match to class profiles:**
   ```yaml
   # docs/_Classes/cleric.md
   profile:
     generic:
       magicType: healing    # Wants healing-magic trait
     specific: ["divine-power", "channel-divinity"]
   ```

   Match score = Player's percentage in required traits

**Implementation Files:**
- `_data/question-bank.yml` - Question definitions with trait scoring
- `_layouts/questionnaire.html` - Scoring engine (JavaScript)
- `docs/_Classes/*.md` - Class profiles with required traits

**Files:**
- `_data/question-bank.yml` - Questions with trait scoring
- `_layouts/questionnaire.html` - Scoring engine
- `docs/_Classes/*.md` - Class profiles with trait requirements

---

## Adaptive Question Selection

Questions adapt to explore unexplored traits for top recommended classes. Starts random, then targets traits needed by lowest-ranked recommendations, ensuring all archetypes get fair evaluation.



## Adding New Archetypes

The questionnaire system automatically includes new archetypes when they're properly structured in class files:

1. **Add archetype to class file** - Follow existing YAML structure with traits array
2. **Define trait mappings** - Use consistent trait names across archetypes
3. **Validate schema** - Run `make validate-profiles` to check structure
4. **Test scoring** - Run `make test-class-scoring` to verify recommendation logic
5. **Update search** - Run `make extract` to include in searchable content

For trait naming and archetype patterns, reference existing class files in `docs/_Classes/`.
