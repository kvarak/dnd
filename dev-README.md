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

## Questionnaire Scoring System

### Multi-Dimensional Trait Scoring

The class recommendation questionnaire uses a sophisticated **multi-dimensional trait scoring** system that builds nuanced player profiles.

**Core Concept:**
Each answer contributes positive or negative scores across multiple trait dimensions simultaneously. This reveals both preferences (high scores) and aversions (negative scores).

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

**Benefits:**
- ✅ Natural questions vs. rating scales
- ✅ Shows preferences AND aversions
- ✅ Transparent scoring for players
- ✅ Single question influences multiple dimensions
- ✅ Nuanced profiles, not binary buckets

**Example Player Profile:**
```
Trait Scores:
  healing-magic: 71% (strong preference)
  utility-magic: 50% (moderate preference)
  damage-magic: 22% (aversion)
  stealth-master: 85% (very strong preference)

Recommendations:
  1. Trickery Cleric - 78% match (healing + stealth)
  2. Bard - 65% match (utility + social)
  3. Wizard - 34% match (damage misalignment)
```

---

## Adaptive Question Selection Algorithm

The questionnaire uses **intelligent question ordering** to maximize recommendation accuracy with minimal questions. Instead of random/fixed ordering, questions adapt based on current Live Match Progress.

### Algorithm Flow

**Question 1:** Random selection from all questions

**Question 2+:** Adaptive selection based on Live Match Progress:

1. **Get current recommendations** (sorted by match percentage)
2. **Iterate through recommendations in reverse** (starting from last/lowest-ranked)
3. **For each recommendation:**
   - Get the archetype's required traits (merged profile: base class + archetype)
   - Find traits the user **hasn't been asked about yet**
   - If unanswered traits exist → select a question affecting one of those traits
   - If ALL traits for this archetype explored → move to next archetype
4. **If all top archetypes fully explored** → randomize from unused questions
5. **If all questions exhausted** → allow viewing results or restart

### Example Progression

**After 5 questions:**
```
Live Match Progress:
  #1 Rogue - Assassin: 65% (4 of 9 traits explored)
  #2 Fighter - Champion: 58% (3 of 10 traits explored)
  ...
  #10 Wizard - Enchanter: 42% (1 of 8 traits explored)

Next question: Targets unanswered Enchanter trait (explores lowest-ranked first)
```

**After 15 questions:**
```
Live Match Progress:
  #1 Rogue - Assassin: 75% (6 of 9 traits explored)
  #2 Fighter - Champion: 68% (8 of 10 traits explored)
  ...
  #10 Wizard - Enchanter: 58% (8 of 8 traits ✓ fully explored)

Next question: Targets #9's unexplored traits (skip Enchanter, move up)
```

**After 40 questions:**
```
Live Match Progress:
  Top 10 archetypes: All traits fully explored ✓

Next question: Random from remaining unused questions
```

### Implementation Details

**Data Structures:**
```javascript
// Track which questions have been shown
this.askedQuestionIds = new Set();

// Map questions to the traits they affect
this.questionToTraitsMap = {
  'healing-magic': ['healing-magic', 'damage-magic', 'utility-magic'],
  'destructive-magic': ['damage-magic', 'control-magic'],
  // ... etc
};

// Track which traits have been explored
getExploredTraits() {
  const exploredTraits = new Set();
  for (const questionId of this.askedQuestionIds) {
    const traits = this.questionToTraitsMap[questionId] || [];
    traits.forEach(t => exploredTraits.add(t));
  }
  return exploredTraits;
}
```

**Selection Logic:**
```javascript
selectNextAdaptiveQuestion() {
  // 1. Calculate current recommendations
  const recommendations = this.calculateRecommendations();
  const exploredTraits = this.getExploredTraits();

  // 2. Find archetype with unexplored traits
  for (const rec of recommendations) {
    const requiredTraits = this.getArchetypeTraits(rec);
    const unexploredTraits = requiredTraits.filter(t => !exploredTraits.has(t));

    if (unexploredTraits.length > 0) {
      // 3. Find question targeting this trait
      return this.findQuestionForTrait(unexploredTraits[0]);
    }
  }

  // 4. Fallback: random from unused questions
  return this.getRandomUnusedQuestion();
}
```

### Benefits

✅ **Efficient** - Focuses on traits that matter for top matches
✅ **Adaptive** - Responds to user's evolving profile
✅ **Thorough** - Fully explores top candidates before moving on
✅ **Smart fallback** - Never gets stuck, always has a next question
✅ **Natural flow** - Questions feel conversational and relevant
✅ **Fast convergence** - Reaches accurate recommendations quickly

---

## Adding New Archetypes

**Quick Start:** [ARCHETYPE_CHECKLIST.md](ARCHETYPE_CHECKLIST.md) - Concise 5-phase workflow (~300 lines)

**Full Reference:** [ARCHETYPE_GUIDE.md](ARCHETYPE_GUIDE.md) - Comprehensive guide with examples (~1100 lines)

Use the checklist for standard archetypes, consult the full guide for complex cases or troubleshooting.
