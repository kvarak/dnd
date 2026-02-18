# Archetype Addition Checklist

> Quick reference for adding class archetypes to the questionnaire
>
> **For detailed explanations, see:** [ARCHETYPE_GUIDE.md](ARCHETYPE_GUIDE.md)

---

## Quick Start (30 minutes)

### Phase 1: Plan (5 min)

```bash
# Check existing traits
grep -E '^\s+[a-z]+-[a-z]+:' _data/question-bank.yml | sed 's/:.*//' | sed 's/^[[:space:]]*//' | sort -u

# Search for specific trait
grep "trait-name" _data/question-bank.yml
```

**⚠️ CRITICAL - Archetype-Specific Traits:**
**Don't just use generic traits!** Add 1-2 traits that capture what makes this archetype UNIQUE:
- Arcane Archer → needs "archery-specialist" (not just "ranged-expert")
- Bulwark → needs "shield-specialist" (not just "tactical-value")
- Shadow Monk → needs "shadow-magic" (not just "stealth-master")

**Identify:**
- [ ] Archetype name (kebab-case): `_____________`
- [ ] **1-2 archetype-defining traits** (NEW, captures uniqueness): `[_____________]`
- [ ] 2-3 supporting traits (existing): `[_____________]`
- [ ] Magic type (if override): `_____________`
- [ ] New questions needed (2-3 per new trait): `_____________`

---

### Phase 2: Update Class File (10 min)

**File:** `docs/_Classes/{class}.md`

```yaml
---
title: ClassName
layout: default
profile:
  generic:
    magicType: "versatile"                    # one of: healing, damage, utility, control, versatile, none
    originBackground: ["noble", "scholarly"]  # array of backgrounds
  specific: ["base-trait-1", "base-trait-2"]
  archetypes:
    new-archetype-name:                       # ← ADD kebab-case name
      generic:                                # ← ONLY if overriding base
        magicType: "damage"                   # ← different from base
      specific: ["trait-1", "trait-2", "trait-3", "philosophy-value"]  # ← 3-5 traits
---

<div class="toc" markdown="1">
<a href="#internal-newArchetypeName">New Archetype Name</a><br/>  <!-- ← ADD camelCase anchor -->
</div>
```

**Checklist:**
- [ ] Added to `archetypes:` section
- [ ] Used kebab-case for key
- [ ] `specific:` is array with 3-5 traits
- [ ] Only included `generic:` if overriding
- [ ] Added TOC link with camelCase anchor
- [ ] YAML indentation correct (2 spaces)
- [ ] **Anchor naming:** `kebab-case` → `camelCase` (e.g., `arcane-archer` → `internal-arcaneArcher`)

---

### Phase 3: Add Questions (10 min, if needed)

**File:** `_data/question-bank.yml`

**⚠️ CRITICAL - Search Before Creating:**
**ALWAYS search for existing questions first!** Adding redundant questions wastes tokens and creates inconsistency.

**MANDATORY Search Process:**

```bash
# Step 0: Overview of ALL questions (see full list with line numbers)
grep "text:" _data/question-bank.yml -n

# Step 1: Search by category (e.g., combat-style, combat-range)
grep -B 2 -A 15 "category: combat-style" _data/question-bank.yml | grep -E "id:|text:|category:"

# Step 2: Search by keywords in question text (e.g., "ranged", "distance", "archery")
grep -B 1 -A 1 "text:.*ranged\|distance\|archery" _data/question-bank.yml | grep -E "id:|text:"

# Step 3: Check what traits a specific question already scores
grep -A 8 "id: ranged-combat" _data/question-bank.yml | grep -E "      [a-z-]+:"
```

**Decision Tree:**
1. **Found related question?** → Update it to include new trait
2. **No related question?** → Safe to create new question
3. **Uncertain?** → Review all questions in same category

**Why:** Prevents duplicate questions like `ranged-combat` + `archery-preference` both asking about range preference.

**Template (only if new question needed):**
```yaml
- id: unique-question-id                # kebab-case, unique
  text: "Clear question text?"          # conversational
  category: combat-style                # or magic-preference, playstyle, etc.
  answers:
    "yes":
      primary-trait: +4                 # strong alignment
      related-trait: +1                 # weak alignment
      opposite-trait: -2                # opposition
    "maybe":
      primary-trait: +1                 # weak preference
      alternative-trait: +2             # alternative direction
    "no":
      primary-trait: -2                 # rejection
      opposite-trait: +4                # strong opposite preference
    dont-know: {}                       # ALWAYS empty
```

**Checklist:**
- [ ] Reviewed ALL existing questions for thematic fit
- [ ] Added new trait to 2+ existing questions (preferred)
- [ ] Created new questions only if necessary
- [ ] 2+ questions total per new trait (existing + new)
- [ ] Each question has unique `id`
- [ ] All answers: yes, maybe, no, dont-know
- [ ] `dont-know: {}` always empty
- [ ] Each answer scores 3-5 traits
- [ ] Trait names match exactly (case-sensitive)

---

### Phase 4: Test (10 min)

```bash
# Run all validations (profiles + questions + markdown)
make test

# Or run individual validators:
make validate-profiles  # Check archetype anchors
make validate-questions # Check question bank

# Build site
make build

# Start server
make serve
```

**Browser testing:**
```javascript
// Open: http://localhost:4000/dnd/tools/questionnaire.html
// Check console for:
📚 Loaded data: { questions: 34, classes: 18 }

// Verify profile:
console.log(CLASS_PROFILES['ClassName'].archetypes['new-archetype-name']);
```

**Checklist:**
- [ ] `make test` passes all validations
- [ ] Anchor naming correct (kebab-case → camelCase)
- [ ] Build succeeds without errors
- [ ] Profile appears in `CLASS_PROFILES`
- [ ] Archetype has correct `specific` array
- [ ] Take questionnaire, answer 20+ questions
- [ ] Archetype appears in results
- [ ] Match percentage > 0%
- [ ] Trait badges display correctly

---

### Phase 5: Deploy (5 min)

```bash
git add docs/_Classes/{class}.md
git add _data/question-bank.yml  # if updated

git commit -m "Add {Archetype Name} archetype for {Class}

- Add {archetype-name} to {Class} profile
- Include traits: {trait-1}, {trait-2}, {trait-3}
- Add {N} questions covering new traits (if applicable)
- Update TOC with anchor link
"

git push origin main
```

**Checklist:**
- [ ] Commit message ≤50 chars in subject
- [ ] Uses imperative mood ("Add" not "Added")
- [ ] Wait 2-5 min for GitHub Pages deploy
- [ ] Test on live site: https://dnd.rigo.nu

---

## Common Patterns

### Pattern 1: Archetype-Specific Traits (RECOMMENDED)
```yaml
archetypes:
  arcane-archer:
    generic:
      magicType: "utility"  # Override base "none"
    # 2 archetype-specific + 2 supporting
    specific: ["archery-specialist", "magic-student", "ranged-expert", "dual-nature"]

  bulwark:
    # 2 archetype-specific + 2 supporting
    specific: ["shield-specialist", "defensive-expert", "tactical-value", "disciplined-value"]
```
**Key**: Add NEW traits that capture what makes archetype unique!

### Pattern 2: Only Generic Traits (TOO VAGUE)
```yaml
archetypes:
  shadow-monk:
    # ❌ BAD: Uses only existing generic traits
    specific: ["stealth-master", "tactical-value", "disciplined-value"]
    # ✅ BETTER: Add archetype-defining trait
    specific: ["shadow-magic", "stealth-master", "tactical-value"]
```

### Pattern 3: Multiple Archetypes
```yaml
archetypes:
  archetype-a:
    generic: { magicType: "damage" }
    specific: ["unique-trait-a", "supporting-trait-1"]
  archetype-b:
    generic: { magicType: "healing" }
    specific: ["trait-b1", "trait-b2"]
```

---

## Quick Reference

### Trait Categories

| Suffix | Category | Examples |
|--------|----------|----------|
| `-magic` | Magic Affinity | `healing-magic`, `arcane-averse-magic` |
| `-background` | Origin | `military-background`, `scholarly-background` |
| `-value` | Philosophy | `tactical-value`, `chaotic-value` |
| (none) | Key Traits | `stealth-master`, `draconic-heritage` |

### Magic Type Values

| Profile | Trait | Use Case |
|---------|-------|----------|
| `"healing"` | `healing-magic` | Clerics, support casters |
| `"damage"` | `damage-magic` | Blaster casters |
| `"utility"` | `utility-magic` | Practical/tool magic |
| `"control"` | `control-magic` | Battlefield control |
| `"versatile"` | `versatile-magic` | Broad magic users |
| `"none"` | `arcane-averse-magic` | Non-magical classes |

### Name Conversions

**CRITICAL:** Anchor names must use camelCase (first word lowercase, rest capitalized)

| Context | Format | Example |
|---------|--------|---------|
| Profile key | kebab-case | `wild-magic-bloodline` |
| TOC anchor | camelCase | `#internal-wildMagicBloodline` |
| Section heading | camelCase | `name="internal-wildMagicBloodline"` |
| Display | Title Case | "Wild Magic Bloodline" |

**Examples:**
- `arcane-archer` → `internal-arcaneArcher` (NOT `ArcaneArcher`)
- `eldritch-knight` → `internal-eldritchKnight`
- `champion` → `internal-champion` (single word stays lowercase)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check YAML indentation (2 spaces, no tabs) |
| `make test` anchor error | Use camelCase: `arcane-archer` → `internal-arcaneArcher` (lowercase first word) |
| Archetype missing | Check profile key in `CLASS_PROFILES` console |
| Match always 0% | Verify trait names match question-bank exactly (case-sensitive) |
| Link broken | Ensure TOC, list, and section heading all use same camelCase anchor |
| No questions | Add 2+ questions with new trait scoring |

---

## Validation Commands

```bash
# List all traits in question bank
grep -E '^\s+[a-z]+-[a-z]+:' _data/question-bank.yml | sed 's/:.*//' | sed 's/^[[:space:]]*//' | sort -u

# Check trait coverage
grep -c "trait-name:" _data/question-bank.yml

# Find questions with trait
grep -B 3 "trait-name:" _data/question-bank.yml | grep "id:"

# Validate YAML syntax
ruby -ryaml -e "YAML.load_file('_data/question-bank.yml'); puts 'Valid'"
```

---

**For full details:** [ARCHETYPE_GUIDE.md](ARCHETYPE_GUIDE.md)
**Last Updated:** February 18, 2026
