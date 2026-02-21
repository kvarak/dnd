# Archetype Trait Modification Strategy

**Date:** 2026-02-21
**Status:** Planned

---

## 🎯 Core Insight: Modify Archetypes, Not Questions

Instead of adding 3 new questions (Phase 4A) then removing 16 (Phase 4B), we can achieve better balance by:

1. **Adding strategic traits to under-represented class archetypes** (to benefit from existing questions)
2. **Removing strategic traits from over-represented class archetypes** (to reduce their advantage)
3. **Removing 13 questions** (61 → 48) targeting redundancy

**Advantages:**
- More surgical: Directly addresses root cause (trait distribution)
- More sustainable: Fewer questions to maintain long-term
- More balanced: Fixes multiple classes simultaneously
- Cleaner: Reaches 48 questions directly without add-then-remove

---

## 📊 Current State Analysis

### Critical Under-Representation
| Class | Ratio | Opportunities | Gap from Average |
|-------|-------|---------------|------------------|
| Inquisitor | 0.59x | 183 | -43% |
| Alchemist | 0.64x | 199 | -36% |
| Feyblood | 0.75x | 234 | -25% |
| Ranger | 0.78x | 244 | -22% |

### Critical Over-Representation
| Class | Ratio | Opportunities | Gap from Average |
|-------|-------|---------------|------------------|
| Bard | 1.45x | 452 | +45% |
| Cleric | 1.36x | 424 | +36% |
| Fighter | 1.24x | 388 | +24% |
| Warlock | 1.22x | 381 | +22% |

---

## 🔧 Archetype Trait Additions (Under-Represented Classes)

### Inquisitor Modifications

**Problem:** Inquisitor has 100% trait coverage but only 0.59x ratio because their traits are GENERIC shared traits (disciplined-value in 35 questions, cunning-value in 34) where they get LOW point values.

**Solution:** Add distinctive traits that exist in high-frequency questions but aren't currently on inquisitor archetypes.

#### Traits to Add:

**1. `knowledge-seeker` (10 questions, avg 2.1 pts)**
- Add to: `mission-of-witchhunter`, `mission-of-infiltration`
- Rationale: Studying heresy, investigating corruption requires knowledge
- Impact: +15-20 opportunities

**2. `urban-background` (13 questions, avg 1.8 pts)**
- Add to: `mission-of-infiltration`
- Rationale: Faith infiltrators work in cities
- Impact: +8-12 opportunities

**3. `scholar` (13 questions, avg 2.2 pts)**
- Add to: `mission-of-witchhunter`
- Rationale: Studying magic, heresy, religious law
- Impact: +10-15 opportunities

**4. `truth-seeker` (existing in 1 question, but distinctive)**
- Add to: `mission-of-infiltration`, `mission-of-witchhunter`
- Rationale: Core inquisitor identity
- Impact: +2-3 opportunities (low but thematically important)

**5. `monster-hunter` (appears in questions)**
- Add to: `mission-of-the-hunter` (already has demon-hunter, hunting-expert, monster-hunter - ALREADY HAS IT)
- Skip this one

**Projected Impact:** Inquisitor 0.59x → ~0.75x-0.80x (+27-36%)

---

### Alchemist Modifications

**Problem:** Alchemist only has 0.64x ratio despite Phase 2 adding craftsman/innovation questions.

**Solution:** Add traits that benefit from existing high-frequency questions.

#### Traits to Add:

**1. `scholar` (13 questions, avg 2.2 pts)**
- Add to: All alchemist archetypes (class-level)
- Rationale: Alchemy is fundamentally scholarly/academic
- Impact: +15-20 opportunities

**2. `urban-background` (13 questions, avg 1.8 pts)**
- Add to: `apothecary`, `poisoner`
- Rationale: Urban alchemists, city shops
- Impact: +8-12 opportunities

**3. `academic-background` (11 questions, avg 1.4 pts)**
- Add to: All alchemist archetypes (class-level)
- Rationale: Academic study, experimentation
- Impact: +10-15 opportunities

**Projected Impact:** Alchemist 0.64x → ~0.75x-0.82x (+17-28%)

---

### Ranger Modifications (Minor)

**Problem:** Ranger 0.78x ratio, already has good trait coverage.

**Solution:** Minor additions to boost into acceptable range.

#### Traits to Add:

**1. `survival-expert` (10 questions, avg 2.1 pts)**
- Check if already exists (likely does) - if not, add to class-level
- Impact: +0-5 opportunities (may already have)

---

## ➖ Archetype Trait Reductions (Over-Represented Classes)

### Bard Modifications

**Problem:** Bard 1.45x ratio (+45% over average), receives massive benefits from artistic/social/musical traits.

**Solution:** Reduce trait assignments on bard archetypes to lower point accumulation.

#### Traits to Remove/Reduce:

**1. Remove duplicate `social-manipulator` from some bard archetypes**
- Remove from: 2-3 bard archetypes that have both social-manipulator AND charismatic
- Impact: -10-15 opportunities

**2. Remove `versatile-magic` from combat-focused bard archetypes**
- Remove from: College of Swords, College of Valor
- Rationale: These are combat specialists, not versatile casters
- Impact: -8-12 opportunities

**Projected Impact:** Bard 1.45x → ~1.25x-1.30x (-10-14%)

---

### Cleric Modifications

**Problem:** Cleric 1.36x ratio (+36%), massive benefits from divine-magic, healing-magic, religious-value.

**Solution:** Remove redundant traits from specific cleric domains.

#### Traits to Remove:

**1. Remove `healing-magic` from non-healer domains**
- Remove from: War Domain, Tempest Domain, Forge Domain
- Rationale: These aren't healer-focused
- Impact: -12-18 opportunities

**2. Remove duplicate `divine-magic` + `holy-power` + `religious-value` stacking**
- Consolidate: Some domains have all three, reduce to two
- Impact: -8-12 opportunities

**Projected Impact:** Cleric 1.36x → ~1.20x-1.25x (-11-16%)

---

### Fighter Modifications

**Problem:** Fighter 1.24x ratio (+24%), benefits from tactical-value (29 questions), disciplined-value (35 questions), physical (22 questions).

**Solution:** Remove generic traits from specialized fighter archetypes.

#### Traits to Remove:

**1. Remove `disciplined-value` from chaotic/reckless fighter archetypes**
- Remove from: Daredevil (reckless fighter)
- Impact: -10-15 opportunities

**2. Remove `tactical-value` from instinct-based fighters**
- Remove from: Berserker-style fighters
- Impact: -8-12 opportunities

**Projected Impact:** Fighter 1.24x → ~1.10x-1.15x (-9-14%)

---

### Warlock Modifications

**Problem:** Warlock 1.22x ratio (+22%), benefits heavily from arcane-magic (18 questions).

**Solution:** Minor trait reductions.

#### Traits to Remove:

**1. Remove `scholar` from some warlock patrons**
- Remove from: Archfey, Great Old One (instinctive, not scholarly)
- Impact: -6-10 opportunities

**Projected Impact:** Warlock 1.22x → ~1.12x-1.18x (-4-10%)

---

## 📉 Question Removals (13 Questions: 61 → 48)

With archetype modifications helping balance, we can target purely REDUNDANT questions for removal:

### Removal Categories:

**1. Trait Over-Saturation (Remove 7)**
- Questions with traits appearing in 30+ questions:
  - `disciplined-value` (35 questions) - Remove 2 lowest-impact
  - `cunning-value` (34 questions) - Remove 2 lowest-impact
  - `tactical-value` (29 questions) - Remove 2 lowest-impact
  - `versatile-magic` (23 questions) - Remove 1 lowest-impact

**2. Low Distinctiveness (Remove 4)**
- Questions that don't strongly differentiate archetypes:
  - `pleasure-seeking` - Narrow hedonistic focus
  - `crowd-combat` - Redundant with multitasking
  - Generic combat preference questions with low impact
  - Generic background questions with low impact

**3. Compound Over-Representation (Remove 2)**
- Questions giving high values to MULTIPLE over-represented classes:
  - Questions benefiting bard + cleric + warlock simultaneously
  - Questions benefiting fighter + barbarian + paladin simultaneously

---

## 📈 Projected Final Outcomes

### Question Count
**Final:** 48 questions ✅

### Projected Class Balance

| Class | Current | After Trait Mods | After 13 Removals | Final Status |
|-------|---------|------------------|-------------------|--------------|
| **Inquisitor** | 0.59x | **0.75x** (+27%) | **0.78x-0.82x** | ✅ FIXED |
| **Alchemist** | 0.64x | **0.78x** (+22%) | **0.80x-0.85x** | ✅ FIXED |
| **Ranger** | 0.78x | 0.80x (+3%) | **0.85x-0.90x** | ✅ GOOD |
| **Feyblood** | 0.75x | 0.75x | **0.80x-0.85x** | ⚠️ GOOD |
| Swashbuckler | 0.84x | 0.84x | **0.90x-0.95x** | ✅ GOOD |
| **Bard** | 1.45x | **1.28x** (-12%) | **1.15x-1.20x** | ✅ FIXED |
| **Cleric** | 1.36x | **1.22x** (-10%) | **1.12x-1.18x** | ✅ FIXED |
| **Fighter** | 1.24x | **1.12x** (-10%) | **1.05x-1.10x** | ✅ FIXED |
| **Warlock** | 1.22x | **1.15x** (-6%) | **1.08x-1.12x** | ✅ FIXED |

### Success Criteria Achievement

✅ **Question Count:** 48 (target: 40-50)
✅ **All Classes:** Within 0.75x-1.25x range
✅ **Inquisitor:** 0.78x-0.82x (target: >0.75x)
✅ **Alchemist:** 0.80x-0.85x (target: >0.75x)
✅ **No Critical Failures:** All >0.75x
✅ **More Sustainable:** Fewer questions to maintain
✅ **More Surgical:** Direct trait fixes vs question workarounds

---

## 🎯 Execution Plan

### Phase 1: Archetype Trait Additions (Under-Represented)
1. Modify `inquisitor.md` - Add knowledge-seeker, urban-background, scholar, truth-seeker to appropriate archetypes
2. Modify `alchemist.md` - Add scholar, academic-background to class-level; urban-background to specific archetypes
3. Validate with `ruby tools/analyze_class_bias.rb`

### Phase 2: Archetype Trait Reductions (Over-Represented)
1. Modify `bard.md` - Remove redundant social-manipulator, versatile-magic from specific archetypes
2. Modify `cleric.md` - Remove healing-magic from non-healer domains, consolidate divine stacking
3. Modify `fighter.md` - Remove disciplined-value, tactical-value from contradictory archetypes
4. Modify `warlock.md` - Remove scholar from instinctive patrons
5. Validate with `ruby tools/analyze_class_bias.rb`

### Phase 3: Question Removals (13 Questions)
1. Identify specific question IDs matching removal criteria
2. Remove from `_data/question-bank.yml`
3. Final validation with both analysis tools

---

**STATUS:** READY FOR EXECUTION
**CONFIDENCE:** VERY HIGH - Holistic root cause fix vs symptom treatment
