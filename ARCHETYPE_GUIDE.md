# Archetype Addition Guide

> Comprehensive guide for adding new class archetypes to the questionnaire system
>
> **Target Audience:** Developers (including AI agents) implementing new content
>
> **Version:** 1.0 (February 2026)

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Trait Taxonomy](#trait-taxonomy)
3. [Profile Structure Requirements](#profile-structure-requirements)
4. [Step-by-Step Addition Process](#step-by-step-addition-process)
5. [Testing & Validation](#testing--validation)
6. [Common Pitfalls](#common-pitfalls)
7. [Reference Examples](#reference-examples)

---

## System Architecture Overview

### How the Questionnaire Works

```
┌─────────────────┐
│ Player answers  │
│   questions     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Questions score multiple traits     │
│ (healing-magic, stealth-master,     │
│  tactical-value, etc.)              │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Adaptive Algorithm selects          │
│ next question targeting             │
│ lowest-ranked archetype's           │
│ unexplored traits                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Player's trait profile built        │
│ as percentages (0-100%)             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Match against all class/archetype   │
│ profiles (generic + specific)       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Recommendations ranked by            │
│ compatibility percentage             │
└──────────────────────────────────────┘
```

### Key Files & Their Roles

| File | Purpose | Format |
|------|---------|--------|
| `docs/_Classes/{class}.md` | Class content + profile data | Markdown with YAML frontmatter |
| `_data/question-bank.yml` | Question definitions + trait scoring | YAML |
| `_layouts/questionnaire.html` | Questionnaire engine + matching logic | HTML + JavaScript |
| `dev-README.md` | Developer documentation | Markdown |
| `ARCHETYPE_GUIDE.md` | This guide | Markdown |

---

## Trait Taxonomy

### Trait Categories

Traits are organized into **4 categories** based on suffix patterns:

#### 1. Magic Affinity (`*-magic`)
Defines the type of magic a character uses or avoids.

**Available traits:**
- `healing-magic` - Support/healing spells
- `damage-magic` - Offensive spells
- `utility-magic` - Practical/tool spells
- `control-magic` - Battlefield control/debuffs
- `versatile-magic` - Broad magical capability
- `arcane-averse-magic` - Explicitly non-magical (formerly `no-magic`)

**Generic profile field:** `magicType: "healing" | "damage" | "utility" | "control" | "versatile" | "none"`

#### 2. Background (`*-background`)
Character's origin/upbringing influencing their perspective.

**Available traits:**
- `military-background` - Military/guard training
- `criminal-background` - Underworld/illicit origins
- `noble-background` - Aristocratic upbringing
- `rural-background` - Farm/village origins
- `urban-background` - City-dwelling experience
- `scholarly-background` - Academic/research background
- `tribal-background` - Tribal/nomadic heritage

**Generic profile field:** `originBackground: ["military", "urban", ...]` (array of strings)

#### 3. Philosophy & Values (`*-value`)
Character's core beliefs and decision-making approach.

**Available traits:**
- `tactical-value` - Strategic planning
- `disciplined-value` - Order and structure
- `cunning-value` - Clever/sneaky approach
- `opportunistic-value` - Seize the moment
- `chaotic-value` - Embrace randomness
- `patient-value` - Long-term planning
- `proud-value` - Honor and dignity
- `modern-value` - Progress and innovation
- `intuitive-value` - Gut feeling/instinct

**Generic profile field:** None (these are specific traits only)

#### 4. Key Traits (everything else)
Specific abilities, skills, or characteristics unique to archetypes.

**Examples:**
- `stealth-master` - Expert at hiding/sneaking
- `weapon-specialist` - Focus on martial weapons
- `innate-power` - Natural magical ability
- `social-manipulator` - Persuasion/deception expert
- `draconic-heritage` - Dragon ancestry
- `pure-warrior` - No-frills combatant

**Complete list:** See `_data/question-bank.yml` for all 50+ traits

### Special Trait: `arcane-averse-magic`

**CRITICAL:** The trait for "no magic" is `arcane-averse-magic`, NOT `no-magic`.

```yaml
# ❌ WRONG
profile:
  generic:
    magicType: "no-magic"  # Will not match!

# ✅ CORRECT
profile:
  generic:
    magicType: "none"      # Maps to arcane-averse-magic trait
```

**Mapping:**
- Profile field: `magicType: "none"`
- Question trait: `arcane-averse-magic: +4`
- Display name: "Arcane Averse" (suffix stripped)

---

## Profile Structure Requirements

### Anatomy of a Class Profile

```yaml
---
title: ClassName
layout: default
profile:
  # BASE CLASS PROFILE
  generic:
    magicType: "versatile"                    # REQUIRED: Magic type
    originBackground: ["noble", "scholarly"]  # REQUIRED: Array of backgrounds
  specific: ["innate-power", "raw-talent"]   # REQUIRED: Key distinguishing traits

  # ARCHETYPES (nested under base class)
  archetypes:
    archetype-name:                          # kebab-case name
      generic:                               # OPTIONAL: Override base class magic
        magicType: "damage"                  # Only if different from base
      specific: ["draconic-heritage", "proud-value"]  # REQUIRED: Unique traits

    another-archetype:
      # If generic not specified, inherits from base class
      specific: ["wild-surges", "chaotic-value"]
---
```

### Field Requirements

#### `generic` (Object)
**When to include:** At base class level (REQUIRED). At archetype level (OPTIONAL - only if overriding).

**Fields:**
- `magicType` (String): One of `"healing"`, `"damage"`, `"utility"`, `"control"`, `"versatile"`, `"none"`
- `originBackground` (Array): List of applicable backgrounds (e.g., `["military", "urban"]`)

**Behavior:**
- Archetype `generic` **overrides** base class (not merged)
- If archetype omits `generic`, it **inherits** from base class

#### `specific` (Array)
**When to include:** At base class level (REQUIRED). At archetype level (REQUIRED).

**Contents:** List of trait names (kebab-case strings)

**Behavior:**
- Archetype `specific` **adds to** base class (arrays are merged)
- Final archetype traits = `base.specific + archetype.specific`

**Best practices:**
- Base class: 3-5 traits (broad class identity)
- Archetype: 3-5 traits (unique specialization)
- Total per archetype: 6-10 traits recommended

#### `archetypes` (Object)
**When to include:** At base class level (if class has archetypes)

**Structure:** Map of `archetype-name` → `{generic?, specific}`

**Naming convention:**
- Key: `kebab-case` (e.g., `draconic-bloodline`, `eldritch-knight`)
- Will be converted to anchor: `draconicBloodline`, `eldritchKnight`
- Display name: auto-generated from kebab-case ("Draconic Bloodline")

### Profile Resolution Example

```yaml
# Base Sorcerer profile
profile:
  generic:
    magicType: "versatile"
    originBackground: ["noble", "rural"]
  specific: ["innate-power", "raw-talent"]
  archetypes:
    draconic-bloodline:
      generic:
        magicType: "damage"  # Override: now damage instead of versatile
      specific: ["draconic-heritage", "proud-value"]
```

**Resolved Draconic Bloodline profile:**
```javascript
{
  generic: {
    magicType: "damage",              // From archetype (overridden)
    originBackground: ["noble", "rural"]  // From base (inherited)
  },
  specific: [
    "innate-power",                   // From base
    "raw-talent",                     // From base
    "draconic-heritage",              // From archetype
    "proud-value"                     // From archetype
  ]
}
```

---

## Step-by-Step Addition Process

### Prerequisites Checklist

- [ ] Class markdown file exists in `docs/_Classes/`
- [ ] Questions exist in `question-bank.yml` covering archetype's traits
- [ ] Archetype name chosen (kebab-case)
- [ ] 3-5 specific traits identified
- [ ] Magic type determined (if different from base class)

### Process Overview

```
1. Research & Planning (15 min)
   ├─ Identify archetype characteristics
   ├─ Map to existing traits
   └─ Determine if new traits needed

2. Update Class File (5 min)
   ├─ Add archetype to profile.archetypes
   ├─ Add anchor link to TOC
   └─ Verify YAML syntax

3. Update Question Bank (10 min, if needed)
   ├─ Add new trait questions
   └─ Update existing questions to include new traits

4. Validate & Test (10 min)
   └─ Run through testing checklist

5. Document & Deploy (5 min)
   ├─ Git commit with descriptive message
   └─ Test on live site
```

---

### Step 1: Research & Planning

#### 1.1 Identify Archetype Characteristics

**Questions to answer:**
- What makes this archetype unique?
- What combat role does it fill?
- What's its approach to problem-solving?
- What background fits this archetype?
- Does it use magic? What kind?

**Example: Wild Magic Bloodline (Sorcerer)**
- **Unique:** Unpredictable magical surges
- **Combat role:** Versatile caster with chaos element
- **Approach:** Embraces randomness, risk-taking
- **Background:** Any (magic is innate)
- **Magic:** Versatile (any type, unpredictably)

#### 1.2 Map to Existing Traits

**Check existing traits first:** See [Trait Taxonomy](#trait-taxonomy)

**Example mapping:**
```
Wild Magic Bloodline characteristics:
  "Unpredictable power"     → wild-surges (NEW TRAIT)
  "Embrace chaos"           → chaotic-value (EXISTS)
  "Fate touched"            → fate-touched (NEW TRAIT)
  "Versatile magic"         → versatile-magic (EXISTS via magicType)
```

#### 1.3 Determine New Traits Needed

**When to create a new trait:**
- ✅ Specific to this archetype (e.g., `wild-surges`)
- ✅ Could apply to future archetypes (e.g., `fate-touched`)
- ✅ Not covered by existing traits
- ❌ Too generic/broad
- ❌ Only cosmetic difference from existing trait

**Naming conventions:**
- Use kebab-case
- Be specific and descriptive
- Avoid abbreviations
- Include category suffix where applicable (`-magic`, `-background`, `-value`)

---

### Step 2: Update Class File

#### 2.1 Locate Class File

```bash
cd /Users/kvarak/repos/kvarak/dnd/dnd
ls docs/_Classes/
```

Find the appropriate class (e.g., `sorcerer.md`).

#### 2.2 Add Archetype to Profile

**Location:** YAML frontmatter at top of file

**Template:**
```yaml
---
title: ClassName
layout: default
profile:
  generic:
    magicType: "versatile"
    originBackground: ["noble", "rural"]
  specific: ["base-trait-1", "base-trait-2"]
  archetypes:
    existing-archetype:
      specific: ["trait-1", "trait-2"]

    # ADD NEW ARCHETYPE HERE
    new-archetype-name:
      generic:  # ONLY if overriding base class
        magicType: "damage"  # Different magic type
      specific: ["unique-trait-1", "unique-trait-2", "philosophy-value"]
---
```

**Example (Wild Magic Bloodline):**
```yaml
archetypes:
  draconic-bloodline:
    generic:
      magicType: "damage"
    specific: ["draconic-heritage", "proud-value", "elemental-affinity"]

  wild-magic-bloodline:  # ← NEW
    generic:
      magicType: "versatile"  # Keep base class magic type
    specific: ["chaotic-value", "unpredictable-power", "fate-touched", "wild-surges"]
```

**Validation:**
- [ ] Archetype name is kebab-case
- [ ] `specific` is an array of strings
- [ ] Each trait uses kebab-case
- [ ] If `generic` included, has valid `magicType` value
- [ ] YAML indentation is consistent (2 spaces)
- [ ] No trailing commas or syntax errors

#### 2.3 Add Anchor Link to TOC

**Location:** Below YAML frontmatter, in Table of Contents `<div>`

**Template:**
```html
<div class="toc" markdown="1">

##### [Section Name](#internal-SectionName)
<a href="#internal-existingArchetype">Existing Archetype</a><br/>
<a href="#internal-newArchetypeName">New Archetype Name</a><br/>  <!-- ADD THIS -->

</div>
```

**Anchor naming convention:**
- Convert `kebab-case` → `camelCase`
- Examples:
  - `wild-magic-bloodline` → `wildMagicBloodline`
  - `eldritch-knight` → `eldritchKnight`
  - `arcane-trickster` → `arcaneTrickster`

**Example:**
```html
<div class="toc" markdown="1">

##### [Sorcerous Origins](#internal-SorcerousOrigins)
<a href="#internal-draconicBloodline">Draconic Bloodline</a><br/>
<a href="#internal-wildMagicBloodline">Wild Magic Bloodline</a><br/>  <!-- NEW -->

</div>
```

**Validation:**
- [ ] Anchor uses `#internal-` prefix
- [ ] Anchor is camelCase
- [ ] Display text is Title Case
- [ ] Link is in alphabetical order (recommended)
- [ ] Closing `<br/>` tag present

#### 2.4 Verify YAML Syntax

**Method 1: Build the site**
```bash
cd /Users/kvarak/repos/kvarak/dnd/dnd
make serve
```

Look for errors like:
```
Error: Invalid YAML frontmatter
Line 12: mapping values are not allowed in this context
```

**Method 2: Test YAML parsing**
```bash
# Extract and validate YAML
head -n 30 docs/_Classes/sorcerer.md | grep -A 100 "^---" | head -n -1 > /tmp/test.yml
ruby -ryaml -e "YAML.load_file('/tmp/test.yml')"
```

If no output, YAML is valid. If error, fix syntax.

**Common errors:**
- Inconsistent indentation (use 2 spaces, not tabs)
- Missing colons after keys
- Quotes inside unquoted strings
- Arrays using `- item` instead of `["item"]` format

---

### Step 3: Update Question Bank (If Needed)

**When to update:** If you created new traits that aren't covered by existing questions.

#### 3.1 Analyze Trait Coverage

**Check which traits need questions:**
```bash
cd /Users/kvarak/repos/kvarak/dnd/dnd

# List all traits in question bank
grep -E '^\s+[a-z]+-[a-z]+:' _data/question-bank.yml | \
  sed 's/:.*//' | sed 's/^[[:space:]]*//' | sort -u

# Check if your new trait exists
grep "wild-surges" _data/question-bank.yml
```

If grep returns nothing, you need to add questions.

#### 3.2 Add Trait Coverage to Questions

**⚠️ BEST PRACTICE - Prefer Updating Over Creating:**

When adding coverage for a new trait, follow this priority order:

1. **First Priority:** Review ALL existing questions for thematic fit
2. **Second Priority:** Add new trait to existing related questions
3. **Last Resort:** Create new questions only if no existing questions fit

**Why this order:**
- ✅ Keeps question bank concise and maintainable
- ✅ Improves multi-dimensional scoring (questions affect more traits)
- ✅ Faster questionnaires (fewer total questions needed)
- ✅ Better user experience (avoid repetitive questions)

**Search for related questions:**
```bash
# Find questions about similar concepts
grep -B 5 "similar-trait:" _data/question-bank.yml | grep -E "id:|text:"

# Find questions in same category
grep -A 20 "category: playstyle" _data/question-bank.yml | grep -E "id:|text:"
```

##### 3.2.1 Add Trait to Existing Questions

**When appropriate:** If a new trait is conceptually related to existing questions.
```yaml
- id: unique-question-id              # kebab-case, unique across all questions
  text: "Question text here?"         # Clear, conversational question
  category: category-name             # combat-style, magic-preference, etc.
  answers:
    "yes":
      primary-trait: +4               # Strong alignment with primary trait
      related-trait: +1               # Weak alignment with related trait
      opposite-trait: -2              # Moderate opposition to opposite
    "maybe":
      primary-trait: +1               # Weak alignment
      alternative-trait: +2           # Stronger alignment with alternative
    "no":
      primary-trait: -2               # Rejection of primary
      opposite-trait: +4              # Strong preference for opposite
    dont-know: {}                     # Always include, always empty
```

**Example (wild-surges trait):**
```yaml
- id: embrace-chaos
  text: "Do you enjoy unpredictable, chaotic effects in gameplay?"
  category: playstyle
  answers:
    "yes":
      wild-surges: +4                 # Direct preference for chaos
      chaotic-value: +2               # Philosophical alignment
      unpredictable-power: +2         # Thematic match
      disciplined-value: -2           # Opposition to discipline
    "maybe":
      wild-surges: +1                 # Weak preference
      versatile-magic: +2             # Prefers flexibility
    "no":
      wild-surges: -2                 # Rejection of chaos
      disciplined-value: +4           # Strong preference for order
      tactical-value: +2              # Prefers planning
    dont-know: {}
```

**Example:** Adding `fate-touched` to an existing question about destiny/luck:

**Example:** Adding `fate-touched` to an existing question about destiny/luck:

```yaml
# BEFORE
- id: destiny-belief
  text: "Do you believe in fate or destiny?"
  answers:
    "yes":
      philosophical-value: +3
      intuitive-value: +2

# AFTER (with fate-touched added)
- id: destiny-belief
  text: "Do you believe in fate or destiny?"
  answers:
    "yes":
      philosophical-value: +3
      intuitive-value: +2
      fate-touched: +2              # ← ADDED
    "no":
      tactical-value: +3
      fate-touched: -1              # ← ADDED (opposition)
```

**Best practices for adding to existing questions:**
- [ ] Trait fits thematically with question concept
- [ ] Scores are consistent with answer meanings (yes/no/maybe)
- [ ] Add to both positive and negative answers where appropriate
- [ ] Maintain balance (don't bloat questions with 10+ traits)

##### 3.2.2 Create New Questions (Last Resort)

**Location:** `_data/question-bank.yml`

**Only create new questions if:**
- No existing questions fit the trait thematically
- Trait represents a completely new concept
- Existing questions are already scoring 5+ traits

**Template:**
```yaml
- id: unique-question-id              # kebab-case, unique across all questions
  text: "Question text here?"         # Clear, conversational question
  category: category-name             # combat-style, magic-preference, etc.
  answers:
    "yes":
      primary-trait: +4               # Strong alignment with primary trait
      related-trait: +1               # Weak alignment with related trait
      opposite-trait: -2              # Moderate opposition to opposite
    "maybe":
      primary-trait: +1               # Weak alignment
      alternative-trait: +2           # Stronger alignment with alternative
    "no":
      primary-trait: -2               # Rejection of primary
      opposite-trait: +4              # Strong preference for opposite
    dont-know: {}                     # Always include, always empty
```

**Question design principles:**
- **Natural language:** Ask "Do you want X?" not "Rate your X on a scale"
- **One concept:** Each question targets one primary trait
- **Multidimensional scoring:** Each answer affects 3-5 traits in different directions
- **Balanced totals:** Sum of scores across all answer options should be ~ 0 for each trait (prevents bias)
- **Clear opposites:** "yes" and "no" should score opposite traits positively

**Validation:**
- [ ] Each question has unique `id`
- [ ] All answers include `yes`, `maybe`, `no`, `dont-know`
- [ ] `dont-know` is always empty object `{}`
- [ ] Trait names match exactly (case-sensitive)
- [ ] Scores are integers (positive or negative)
- [ ] YAML syntax is valid

#### 3.3 Test Question Coverage

**Goal:** Ensure new archetype has 5+ questions covering its traits.

**Method:**
```bash
# Count questions mentioning a trait
grep -c "wild-surges:" _data/question-bank.yml
# Should return >= 2

# Find which questions cover the trait
grep -B 3 "wild-surges:" _data/question-bank.yml | grep "id:"
```

**Coverage targets:**
- **Minimum:** 2 questions per new trait
- **Recommended:** 3-5 questions per trait
- **Why:** Allows nuanced profiling, adaptive algorithm has options

---

### Step 4: Validate & Test

#### 4.1 Syntax Validation

```bash
cd /Users/kvarak/repos/kvarak/dnd/dnd

# Validate YAML in question bank
ruby -ryaml -e "YAML.load_file('_data/question-bank.yml'); puts 'Valid'"

# Build site to check all files
make build
```

**Expected output:**
```
Configuration file: /srv/jekyll/_config.yml
            Source: /srv/jekyll
       Destination: /srv/jekyll/_site
 Incremental build: disabled
      Generating...
                    done in X.XXX seconds.
```

**Look for errors:**
- `Error: Invalid YAML`
- `Error: Liquid syntax error`
- `Warning: No profile found for CLASS`

#### 4.2 Profile Resolution Test

**Start local server:**
```bash
make serve
```

**Open browser console:**
```
http://localhost:4000/dnd/tools/questionnaire.html
```

**Check browser console log:**
```javascript
// Should see:
📚 Loaded data: {
  questions: 34,
  classes: 18
}
```

**Test profile loading:**
```javascript
// In browser console
console.log(CLASS_PROFILES['Sorcerer']);

// Should show:
{
  generic: { magicType: "versatile", originBackground: [...] },
  specific: ["innate-power", "raw-talent"],
  archetypes: {
    "draconic-bloodline": {...},
    "wild-magic-bloodline": {
      generic: { magicType: "versatile" },
      specific: ["chaotic-value", "unpredictable-power", ...]
    }
  }
}
```

**Validation:**
- [ ] Class appears in `CLASS_PROFILES`
- [ ] Archetype appears in `archetypes` object
- [ ] All traits exist in `specific` array
- [ ] `generic` fields have correct types (string for magicType, array for originBackground)

#### 4.3 Questionnaire Flow Test

**Manual testing procedure:**

1. **Start questionnaire:**
   - Go to `http://localhost:4000/dnd/tools/questionnaire.html`
   - Click "Start" or refresh to reset

2. **Answer questions targeting new archetype:**
   - Look at Live Match Progress sidebar
   - Find your new archetype in rankings
   - Answer questions to explore its traits

3. **Verify adaptive selection:**
   - After 5-10 questions, check which questions are asked
   - Should target unexplored traits of bottom-ranked archetypes
   - New archetype should be thoroughly explored

4. **Check results display:**
   - Answer minimum 20 questions
   - Click "Get Results"
   - Verify new archetype appears in recommendations
   - Check trait badges display correctly

**What to look for:**
- [ ] Archetype name displays correctly (Title Case)
- [ ] Percentage match calculates (not NaN or 0%)
- [ ] Trait badges show with colored bars
- [ ] Link to class page works
- [ ] Anchor link scrolls to archetype section (if applicable)

#### 4.4 Edge Case Testing

**Test 1: Archetype without generic override**
- Create archetype with only `specific` traits
- Verify it inherits base class `generic` fields
- Check magic type displays correctly

**Test 2: Archetype with all traits explored**
- Answer questions until archetype fully explored
- Verify adaptive algorithm skips to next archetype
- Check progress bar updates correctly

**Test 3: Multiple archetypes of same class**
- Add 3+ archetypes to same class
- Verify all appear in recommendations separately
- Check rankings can differentiate between them

---

### Step 5: Document & Deploy

#### 5.1 Git Commit

**Commit message format:** Follow [Git Best Practices](https://kvarak.github.io/git-best-practices/)

```bash
cd /Users/kvarak/repos/kvarak/dnd/dnd

# Stage changes
git add docs/_Classes/sorcerer.md
git add _data/question-bank.yml  # if updated

# Commit with descriptive message
git commit -m "Add Wild Magic Bloodline archetype for Sorcerer

- Add wild-magic-bloodline to Sorcerer profile
- Include traits: chaotic-value, unpredictable-power, fate-touched, wild-surges
- Add 3 new questions to question-bank covering wild magic traits
- Update TOC with anchor link to wildMagicBloodline section
"
```

**Commit message checklist:**
- [ ] Subject line ≤ 50 characters
- [ ] Subject uses imperative mood ("Add" not "Added")
- [ ] Subject capitalized, no period
- [ ] Body explains what and why (not how)
- [ ] Body wrapped at 72 characters

#### 5.2 Deploy to GitHub Pages

```bash
# Push to GitHub
git push origin main

# GitHub Pages will auto-deploy
# Check status at: https://github.com/kvarak/dnd/actions
```

**Wait 2-5 minutes for deployment.**

#### 5.3 Live Site Testing

**Visit live site:**
```
https://dnd.rigo.nu/tools/questionnaire.html
```

**Repeat validation:**
- [ ] Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
- [ ] Check browser console for errors
- [ ] Take questionnaire, verify new archetype appears
- [ ] Test on mobile device (responsive display)
- [ ] Verify dark mode compatibility

---

## Testing & Validation

### Automated Tests

**Run basic tests:**
```bash
make test
```

**What it checks:**
- Site builds without errors
- All links are valid (internal)
- YAML syntax is correct
- JavaScript loads without errors

### Manual Testing Checklist

#### Pre-Commit Checks
- [ ] YAML frontmatter syntax valid
- [ ] All trait names exist in question bank
- [ ] Archetype name is kebab-case
- [ ] TOC anchor link matches camelCase conversion
- [ ] No duplicate archetype names within class
- [ ] Site builds locally without errors

#### Post-Commit Checks
- [ ] Changes visible on live site (after deployment)
- [ ] Archetype appears in questionnaire recommendations
- [ ] Match percentage calculates correctly
- [ ] Trait badges display with correct colors
- [ ] Link to class page works
- [ ] Mobile display is correct
- [ ] Dark mode displays correctly

### Validation Scripts

**Check trait coverage:**
```bash
# List all traits in profiles but not in question bank
cd /Users/kvarak/repos/kvarak/dnd/dnd

# Extract traits from profiles
grep -rh "specific:" docs/_Classes/*.md | \
  sed 's/.*\[//; s/\].*//; s/"//g; s/,/\n/g' | \
  sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | \
  sort -u > /tmp/profile_traits.txt

# Extract traits from question bank
grep -E '^\s+[a-z]+-[a-z]+:' _data/question-bank.yml | \
  sed 's/:.*//' | sed 's/^[[:space:]]*//' | \
  sort -u > /tmp/question_traits.txt

# Find traits in profiles but not in questions
comm -23 /tmp/profile_traits.txt /tmp/question_traits.txt
```

**Expected output:** Empty (all profile traits have questions)

If output lists traits, either:
1. Add questions for those traits, OR
2. Remove unused traits from profiles

**Check for orphaned questions:**
```bash
# Find traits in questions but not in any profile
comm -13 /tmp/profile_traits.txt /tmp/question_traits.txt
```

**This is OK** - questions can cover generic concepts not tied to specific archetypes.

### Common Test Scenarios

#### Scenario 1: Archetype with unique magic type
```yaml
# Fighter (base: none) with Eldritch Knight (override: utility)
profile:
  generic:
    magicType: "none"
  archetypes:
    eldritch-knight:
      generic:
        magicType: "utility"  # Override
      specific: ["magic-student", "dual-nature"]
```

**Expected behavior:**
- Questions about magical utility affect Eldritch Knight
- Questions about non-magic affect base Fighter (Champion)
- Eldritch Knight doesn't match `arcane-averse-magic` questions

#### Scenario 2: Archetype with 10+ traits
```yaml
archetypes:
  master-of-many:
    specific: [
      "trait-1", "trait-2", "trait-3", "trait-4", "trait-5",
      "trait-6", "trait-7", "trait-8", "trait-9", "trait-10",
      "trait-11", "trait-12"
    ]
```

**Expected behavior:**
- Takes longer to fully explore (needs more questions)
- May rank higher if many traits match
- Adaptive algorithm targets unexplored traits efficiently

**Recommendation:** Keep to 6-8 traits for best user experience.

#### Scenario 3: Two archetypes with overlapping traits
```yaml
archetypes:
  shadow-ninja:
    specific: ["stealth-master", "patient-value", "assassin-training"]

  forest-stalker:
    specific: ["stealth-master", "patient-value", "nature-affinity"]
```

**Expected behavior:**
- Both rank similarly if user scores high on shared traits
- Differentiation comes from unique traits (`assassin-training` vs `nature-affinity`)
- Questions about unique traits determine which ranks higher

**This is OK** - overlap is natural for similar archetypes.

---

## Common Pitfalls

### 1. Trait Name Typos

**Problem:**
```yaml
specific: ["stelth-master", "tactical-value"]  # Typo: "stelth"
```

**Result:**
- Archetype never matches questions about stealth
- Match percentage always low
- Players complain about poor recommendations

**Prevention:**
- Copy trait names from existing code
- Use autocomplete/search to verify
- Run trait coverage validation script

### 2. Wrong Magic Type Mapping

**Problem:**
```yaml
generic:
  magicType: "no-magic"  # WRONG - should be "none"
```

**Result:**
- Archetype doesn't match `arcane-averse-magic` questions
- Treated as having unknown magic type
- Algorithm can't target properly

**Fix:**
```yaml
generic:
  magicType: "none"  # Maps to arcane-averse-magic trait
```

### 3. YAML Indentation Errors

**Problem:**
```yaml
archetypes:
  new-archetype:
  specific: ["trait-1"]  # WRONG - not indented under archetype
```

**Result:**
- Build fails with YAML parsing error
- Site doesn't generate

**Fix:**
```yaml
archetypes:
  new-archetype:
    specific: ["trait-1"]  # CORRECT - 2 spaces indented
```

### 4. Missing `dont-know` Answer

**Problem:**
```yaml
- id: my-question
  text: "Question?"
  answers:
    "yes": { trait: +4 }
    "maybe": { trait: +2 }
    "no": { trait: -2 }
    # Missing dont-know!
```

**Result:**
- JavaScript error when player clicks "Don't Know"
- Questionnaire breaks

**Fix:**
```yaml
    "yes": { trait: +4 }
    "maybe": { trait: +2 }
    "no": { trait: -2 }
    dont-know: {}  # ALWAYS include, always empty
```

### 5. Archetype Name Mismatch

**Problem:**
```yaml
# In profile:
archetypes:
  wild-magic-sorcerer:
    specific: [...]

# In TOC:
<a href="#internal-wildMagicBloodline">Wild Magic Bloodline</a>
```

**Result:**
- Link in TOC points to wrong anchor
- Players can't navigate to archetype description
- 404 or scroll to wrong section

**Fix:** Use consistent name in profile and anchor:
```yaml
# Profile:
archetypes:
  wild-magic-bloodline:  # Match this

# TOC:
<a href="#internal-wildMagicBloodline">  # kebab → camelCase conversion
```

### 6. Forgetting to Add Questions

**Problem:**
- Add new archetype with unique traits
- Don't add questions covering those traits
- Archetype appears in results but never ranks high

**Result:**
- Algorithm can't explore archetype properly
- Match percentage always ~0%
- Players never recommended this archetype

**Prevention:**
- Use trait coverage validation script
- Ensure 2+ questions per new trait
- Test questionnaire after adding archetype

### 7. Too Generic Traits

**Problem:**
```yaml
specific: ["good-at-fighting", "likes-magic", "very-smart"]
```

**Result:**
- Traits are too broad, don't differentiate archetypes
- Every archetype matches these
- Recommendations aren't meaningful

**Fix:** Use specific, distinctive traits:
```yaml
specific: ["dual-wielding-master", "illusion-specialist", "tactical-genius"]
```

### 8. Overusing Magic Type Override

**Problem:**
```yaml
# Every archetype overrides
archetypes:
  archetype-a:
    generic: { magicType: "damage" }
  archetype-b:
    generic: { magicType: "healing" }
  archetype-c:
    generic: { magicType: "utility" }
```

**Result:**
- Loses base class identity
- Archetypes feel disconnected from parent class
- Harder to maintain

**Guidance:**
- Only override when archetype fundamentally changes magic approach
- Most archetypes should inherit base class magic type
- Example: Eldritch Knight (Fighter) overriding `none` → `utility` is justified

---

## Reference Examples

### Example 1: Simple Archetype (No Override)

**Scenario:** Adding "Thief" archetype to Rogue (inherits all base class traits)

```yaml
---
title: Rogue
layout: default
profile:
  generic:
    magicType: "none"
    originBackground: ["urban", "criminal", "rural"]
  specific: ["stealth-master", "cunning-value"]
  archetypes:
    thief:
      # No generic override - inherits none magic type
      specific: ["classic-rogue", "treasure-hunter", "acrobatic", "lock-picker", "fast-hands"]
---

<div class="toc" markdown="1">

##### [Roguish Archetypes](#internal-RoguishArchetypes)
<a href="#internal-thief">Thief</a><br/>

</div>
```

**Traits checklist:**
- Base class: 3 traits (identity of all rogues)
- Archetype: 5 traits (specific to thief specialization)
- Magic type: Inherited `none` (arcane-averse-magic)
- Backgrounds: Inherited from base

### Example 2: Archetype with Magic Override

**Scenario:** Adding "Arcane Trickster" to Rogue (adds magic to normally non-magical class)

```yaml
---
title: Rogue
layout: default
profile:
  generic:
    magicType: "none"
    originBackground: ["urban", "criminal", "rural"]
  specific: ["stealth-master", "cunning-value"]
  archetypes:
    arcane-trickster:
      generic:
        magicType: "utility"  # OVERRIDE: now uses magic
      specific: ["magic-student", "illusion-specialist", "scholarly-rogue", "mage-hand-master"]
---

<div class="toc" markdown="1">

##### [Roguish Archetypes](#internal-RoguishArchetypes)
<a href="#internal-arcaneTrickster">Arcane Trickster</a><br/>

</div>
```

**Why override is justified:**
- Base Rogue: explicitly non-magical
- Arcane Trickster: defined by magical abilities
- Fundamental change in class mechanics

### Example 3: Multiple Archetypes

**Scenario:** Multiple Sorcerer bloodlines with different magic focuses

```yaml
---
title: Sorcerer
layout: default
profile:
  generic:
    magicType: "versatile"
    originBackground: ["noble", "tribal", "rural", "scholarly"]
  specific: ["innate-power", "raw-talent", "intuitive-value"]
  archetypes:
    draconic-bloodline:
      generic:
        magicType: "damage"  # Focused on offense
      specific: ["draconic-heritage", "proud-value", "elemental-affinity", "natural-armor"]

    wild-magic-bloodline:
      generic:
        magicType: "versatile"  # Keeps base versatility
      specific: ["chaotic-value", "unpredictable-power", "fate-touched", "wild-surges"]

    divine-soul:
      generic:
        magicType: "healing"  # Focused on support
      specific: ["blessed-heritage", "faithful-value", "divine-magic", "celestial-connection"]
---

<div class="toc" markdown="1">

##### [Sorcerous Origins](#internal-SorcerousOrigins)
<a href="#internal-divinesoul">Divine Soul</a><br/>
<a href="#internal-draconicBloodline">Draconic Bloodline</a><br/>
<a href="#internal-wildMagicBloodline">Wild Magic Bloodline</a><br/>

</div>
```

**Key points:**
- Each archetype defines unique identity
- Magic type overrides create clear differentiation
- Specific traits don't overlap (each archetype is distinctive)
- TOC links are alphabetically sorted

### Example 4: Adding New Questions

**Scenario:** New trait `wild-surges` needs question coverage

```yaml
# Add to _data/question-bank.yml

- id: embrace-chaos-magic
  text: "Do you enjoy unpredictable, chaotic magical effects?"
  category: magic-preference
  answers:
    "yes":
      wild-surges: +4              # Primary trait
      chaotic-value: +2            # Related philosophy
      versatile-magic: +1          # Versatility through chaos
      disciplined-value: -2        # Opposition to discipline
    "maybe":
      wild-surges: +1              # Weak preference
      versatile-magic: +2          # Prefers controlled versatility
    "no":
      wild-surges: -2              # Rejection of chaos
      disciplined-value: +4        # Strong preference for control
      tactical-value: +2           # Prefers planning
    dont-know: {}

- id: risk-vs-reliability
  text: "Do you prefer taking risks over reliable outcomes?"
  category: playstyle
  answers:
    "yes":
      wild-surges: +3              # Risk-taking aligns with wild magic
      opportunistic-value: +3      # Seize the moment
      patient-value: -2            # Opposition to careful planning
    "maybe":
      wild-surges: +1              # Some risk tolerance
      tactical-value: +1           # Calculated risks
    "no":
      wild-surges: -2              # Avoids uncertainty
      patient-value: +4            # Prefers careful planning
      disciplined-value: +2        # Structured approach
    dont-know: {}

- id: fate-belief
  text: "Do you believe in destiny or fate?"
  category: philosophy
  answers:
    "yes":
      fate-touched: +4             # Direct alignment
      intuitive-value: +2          # Trust in higher powers
      wild-surges: +1              # Fate can be chaotic
    "maybe":
      fate-touched: +2             # Weak belief
      tactical-value: +1           # Still plan, but acknowledge fate
    "no":
      fate-touched: -2             # Rejection of predetermination
      tactical-value: +4           # Make your own path
      disciplined-value: +2        # Control through effort
    dont-know: {}
```

**Coverage achieved:**
- `wild-surges`: 3 questions
- `fate-touched`: 1 question (shares with other archetypes)
- `chaotic-value`: Enhanced in 1 question (already has others)

---

## Agent Execution Checklist

**Use this checklist when implementing a new archetype as an AI agent:**

### Phase 1: Planning
- [ ] Read archetype description from user
- [ ] Identify 3-5 unique characteristics
- [ ] Map characteristics to existing traits (search question-bank.yml)
- [ ] Identify 2-3 new traits needed (if any)
- [ ] Determine if magic type override needed
- [ ] Choose kebab-case archetype name

### Phase 2: Profile Update
- [ ] Locate class file in `docs/_Classes/`
- [ ] Read existing profile structure
- [ ] Add archetype to `profile.archetypes` object
- [ ] Include `generic` only if overriding
- [ ] Add `specific` array with 3-5 traits
- [ ] Validate YAML syntax (proper indentation)
- [ ] Convert archetype name to camelCase for anchor
- [ ] Add TOC link with correct anchor

### Phase 3: Question Bank Update (if new traits)
- [ ] Review ALL existing questions for thematic fit with new traits
- [ ] Add new traits to 2+ existing related questions (PREFERRED)
- [ ] Create new questions only if no existing questions fit
- [ ] Ensure 2+ questions total per new trait (existing + new combined)
- [ ] Follow question template (yes/maybe/no/dont-know)
- [ ] Score 3-5 traits per question (positive + negative)
- [ ] Ensure `dont-know: {}` always present
- [ ] Validate YAML syntax

### Phase 4: Validation
- [ ] Run `make build` - check for errors
- [ ] Run `make serve` - start local server
- [ ] Open questionnaire in browser
- [ ] Check browser console for JavaScript errors
- [ ] Verify `CLASS_PROFILES` includes new archetype
- [ ] Take questionnaire, answer 20+ questions
- [ ] Verify archetype appears in results
- [ ] Check trait badges display correctly

### Phase 5: Deployment
- [ ] Stage changes with `git add`
- [ ] Write descriptive commit message (subject ≤ 50 chars)
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Wait for GitHub Pages deployment (2-5 min)
- [ ] Test on live site (dnd.rigo.nu)
- [ ] Verify mobile + dark mode

---

## Quick Reference

### Trait Categories

| Category | Suffix | Count | Example |
|----------|--------|-------|---------|
| Magic Affinity | `-magic` | 6 | `healing-magic`, `arcane-averse-magic` |
| Background | `-background` | 7 | `military-background`, `scholarly-background` |
| Philosophy | `-value` | 9 | `tactical-value`, `chaotic-value` |
| Key Traits | (various) | 30+ | `stealth-master`, `draconic-heritage` |

### Magic Type Mapping

| Profile Value | Trait Name | Display |
|--------------|------------|---------|
| `"healing"` | `healing-magic` | "Healing" |
| `"damage"` | `damage-magic` | "Damage" |
| `"utility"` | `utility-magic` | "Utility" |
| `"control"` | `control-magic` | "Control" |
| `"versatile"` | `versatile-magic` | "Versatile" |
| `"none"` | `arcane-averse-magic` | "Arcane Averse" |

### Name Conventions

| Context | Format | Example |
|---------|--------|---------|
| Profile archetype key | kebab-case | `wild-magic-bloodline` |
| TOC anchor link | camelCase | `#internal-wildMagicBloodline` |
| Display name | Title Case | "Wild Magic Bloodline" |
| Trait names | kebab-case | `chaotic-value` |
| Question IDs | kebab-case | `embrace-chaos-magic` |

### File Paths

| File Type | Path |
|-----------|------|
| Class files | `/docs/_Classes/{class}.md` |
| Question bank | `/_data/question-bank.yml` |
| Questionnaire | `/_layouts/questionnaire.html` |
| Development docs | `/dev-README.md` |
| This guide | `/ARCHETYPE_GUIDE.md` |

---

## Troubleshooting

### Issue: Archetype doesn't appear in recommendations

**Possible causes:**
1. YAML syntax error in profile
2. Trait names misspelled
3. No questions covering archetype's traits
4. Profile not loaded by Jekyll

**Debug steps:**
```javascript
// In browser console at questionnaire page
console.log(Object.keys(CLASS_PROFILES));  // Check if class exists
console.log(CLASS_PROFILES['ClassName']);  // Check profile structure
console.log(CLASS_PROFILES['ClassName'].archetypes);  // Check archetypes
```

### Issue: Match percentage always 0%

**Possible causes:**
1. Trait names don't match between profile and questions
2. All traits are specific (need generic traits too)
3. Questions don't score the archetype's traits

**Debug steps:**
```bash
# Check if traits exist in question bank
grep "trait-name:" _data/question-bank.yml

# Count coverage
grep -c "trait-name:" _data/question-bank.yml
```

### Issue: Build fails with YAML error

**Common causes:**
1. Inconsistent indentation
2. Missing colon after key
3. Unquoted string with special characters
4. Trailing comma in array

**Fix:**
```bash
# Test YAML syntax
ruby -ryaml -e "YAML.load_file('docs/_Classes/class.md')"
```

### Issue: TOC link leads to wrong section

**Cause:** Anchor name mismatch

**Fix:**
1. Check actual anchor in markdown: `<a class="internal-link" name="internal-actualName">`
2. Ensure TOC uses same name: `<a href="#internal-actualName">`
3. Remember: profile key uses kebab-case, anchor might use camelCase

---

## Additional Resources

- **Git Best Practices:** https://kvarak.github.io/git-best-practices/
- **Jekyll Documentation:** https://jekyllrb.com/docs/
- **YAML Syntax:** https://yaml.org/spec/1.2/spec.html
- **Questionnaire Algorithm:** See `dev-README.md` "Adaptive Question Selection Algorithm" section
- **Site Development:** See `dev-README.md` "Quick Start" section

---

**Last Updated:** February 18, 2026
**Guide Version:** 1.0
**Maintained By:** kvarak
