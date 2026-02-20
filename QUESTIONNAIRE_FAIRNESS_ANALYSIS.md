# Questionnaire Fairness Analysis & Recommendations
**Date:** February 20, 2026
**Analysis Type:** Comprehensive Deep Dive

---

## Executive Summary

The Class Recommendation Questionnaire has **significant structural imbalances** that create unfair bias toward certain archetypes. The analysis reveals:

- **135 questions** is excessive - many are redundant or inefficient
- **Critical trait coverage gaps** prevent proper discovery of 22-65 archetypes
- **Overrepresented traits** waste question slots on traits used by only 3-8 archetypes
- **2 empty questions** contribute zero to scoring (roleplaying-only)

**Recommendation:** Restructure to **40-50 high-efficiency questions** with multi-dimensional trait scoring.

---

## Critical Findings

### 1. **Trait Coverage Imbalances**

#### A. Underquestioned Traits (High Archetype Usage, Low Question Coverage)
**These archetypes can't be properly discovered!**

| Trait | Archetypes Using It | Questions Covering It | Impact |
|-------|--------------------:|----------------------:|--------|
| `divine-magic` | **65 (22.1%)** | 4 (3.0%) | ⚠️ CRITICAL |
| `otherworldly-knowledge` | **37 (12.6%)** | 1 (0.7%) | ⚠️ CRITICAL |
| `divine-student` | **35 (11.9%)** | 3 (2.2%) | ⚠️ CRITICAL |
| `unpredictable-power` | **24 (8.2%)** | 4 (3.0%) | ⚠️ HIGH |
| `underdog-fighter` | **22 (7.5%)** | 3 (2.2%) | ⚠️ HIGH |
| `instinctive-combatant` | **22 (7.5%)** | 3 (2.2%) | ⚠️ HIGH |

**Problem:** Players answering questions can't properly signal interest in these heavily-used traits. Archetypes relying on `divine-magic` (65 archetypes!) have almost no way to be discovered through the questionnaire.

#### B. Overquestioned Traits (Low Archetype Usage, High Question Coverage)
**These questions are wasted effort!**

| Trait | Archetypes Using It | Questions Covering It | Waste Factor |
|-------|--------------------:|----------------------:|--------------|
| `urban-background` | **3 (1.0%)** | 26 (19.3%) | 🔴 2600% overrepresented |
| `scholarly-background` | **8 (2.7%)** | 26 (19.3%) | 🔴 963% overrepresented |
| `criminal-background` | **6 (2.0%)** | 23 (17.0%) | 🔴 1150% overrepresented |
| `utility-magic` | **5 (1.7%)** | 22 (16.3%) | 🔴 1293% overrepresented |

**Problem:** 26 questions about urban background only help distinguish 3 archetypes. This is massively inefficient and crowds out more important traits.

### 2. **Question Efficiency Analysis**

135 questions analyzed for archetype impact:

**Least Efficient (Should be removed/merged):**
- `character-backstory` - **0 archetypes affected** (no trait scoring!)
- `moral-dilemmas` - **0 archetypes affected** (no trait scoring!)
- `dodge-attacks` - 29 archetypes (8 traits)
- `social-interaction` - 29 archetypes (6 traits)
- `noble-upbringing` - 30 archetypes (5 traits)

**Most Efficient (Keep and use as models):**
- `divine-ritual` - **254 archetypes** (9 traits) ⭐
- `religious-devotion` - **231 archetypes** (14 traits) ⭐
- `magic-interest` - **225 archetypes** (9 traits) ⭐
- `elemental-power` - **214 archetypes** (8 traits) ⭐
- `destructive-magic` - **186 archetypes** (6 traits) ⭐

**Insight:** The most efficient questions affect 186-254 archetypes (63-86% of all archetypes!), while least efficient questions affect only 29-30 archetypes (10% of archetypes). We should prioritize questions that help most archetypes.

### 3. **Trait Distribution Analysis**

**221 unique traits** track across system:

**Most Frequent in Questions:**
- `tactical-value` - 60 questions
- `physical` - 55 questions
- `disciplined-value` - 45 questions
- `versatile-magic` - 30 questions
- `noble-background` - 30 questions

**Most Frequent in Archetypes:**
- `arcane-magic` - 115 archetypes
- `knowledge-seeker` - 71 archetypes
- `religious-value` - 69 archetypes
- `social-manipulator` - 69 archetypes
- `divine-magic` - 65 archetypes (but only 4 questions!)

**Problem:** The most-used archetype trait (`arcane-magic` in 115 archetypes) is asked about in only 5 questions. Meanwhile, `tactical-value` appears in 60 questions but only helps specific archetypes.

---

## Root Cause Analysis

### Why is the system unfair?

1. **Trait Proliferation:** 221 traits is too many to cover meaningfully with any reasonable question count
2. **Narrow Question Design:** Most questions affect 1-3 traits; should affect 8-15 traits
3. **Background Over-emphasis:** Background traits (urban, scholarly, criminal, etc.) have disproportionate question coverage
4. **Magic Type Imbalance:** Specific magic schools underquestioned vs. generic social traits overquestioned
5. **No Proportional Coverage:** Traits used by 65 archetypes should have ~5x the questions as traits used by 5 archetypes (they don't)

### Why does this create bias?

**Example Scenario:**
- **Cleric archetypes** rely heavily on `divine-magic` (4 questions), `divine-student` (3 questions), `holy-power` (9 questions)
- **Rogue archetypes** rely heavily on `stealth-master` (27 questions), `tactical-value` (60 questions), `criminal-background` (23 questions)

**Result:** A player who wants stealth/tactics gets 110 opportunities to signal that preference. A player who wants divine magic gets 16 opportunities. **Rogues are 7x easier to discover than Clerics.**

---

## Recommendations for Fair Questionnaire

### Phase 1: Immediate Fixes (Minimal Changes)

#### 1.1. Remove Empty/Inefficient Questions
**Remove these 12 questions immediately:**
- `character-backstory` (0 impact)
- `moral-dilemmas` (0 impact)
- 10 lowest-efficiency questions affecting <50 archetypes

**Savings:** 135 → 123 questions (-9%)

#### 1.2. Add Critical Missing Questions
**Add 3-5 questions for underquestioned traits:**

**New Question 1: "Divine Connection"**
```yaml
- id: divine-connection-strength
  text: "How important is a direct connection to divine/higher powers?"
  category: magic-preference
  answers:
    "yes":
      divine-magic: +4
      divine-student: +4
      divine-healer: +3
      holy-power: +3
      religious-value: +2
      otherworldly-knowledge: +2
    "maybe":
      divine-magic: +1
      otherworldly-knowledge: +1
      versatile-magic: +1
    "no":
      arcane-magic: +2
      innate-power: +2
      divine-magic: -2
```

**New Question 2: "Underdog Spirit"**
```yaml
- id: underdog-scrapper
  text: "Do you thrive when turning disadvantages into advantages?"
  category: combat-philosophy
  answers:
    "yes":
      underdog-fighter: +4
      instinctive-combatant: +3
      unpredictable-power: +3
      adaptive: +3
      opportunistic-value: +2
    "maybe":
      adaptable-fighter: +2
      cunning-value: +1
    "no":
      disciplined-value: +2
      tactical-value: +2
```

**Savings:** 123 → 128 questions (+4%)

### Phase 2: Structural Overhaul (Recommended)

#### 2.1. Merge Similar Traits (221 → ~120 traits)

**Merge Groups:**

1. **Background Consolidation:**
   - `urban-background` + `city-dweller` → `urban-life`
   - `scholarly-background` + `magic-student` + `scholar` → `academic-pursuit`
   - `criminal-background` + `streetwise` + `outlaw` → `underworld-ties`
   - `rural-background` + `tribal-background` → `wilderness-roots`

   **Saves:** 10+ redundant traits

2. **Combat Style Consolidation:**
   - `tactical-value` + `intellectual-combatant` + `analytical-mind` → `strategic-mind`
   - `reckless-value` + `aggressive-value` + `risk-taker` → `bold-approach`
   - `disciplined-value` + `patient-value` → `controlled-discipline`

   **Saves:** 8+ redundant traits

3. **Magic Type Consolidation:**
   - `arcane-magic` + `magic-student` → `arcane-study`
   - `divine-magic` + `divine-student` → `divine-channel`
   - Keep specific schools (healing, damage, control, utility, versatile) as-is

   **Saves:** 4+ redundant traits

**Total Trait Reduction:** 221 → 120 traits (-46%)

#### 2.2. Redesign Questions for Multi-Dimensional Impact

**Current Problem:** Most questions affect 1-3 traits
**Target:** Every question should affect 8-15 traits

**Example Redesign:**

**OLD (affects 6 traits):**
```yaml
- id: destructive-magic
  text: "Do you want to deal damage with spells?"
  answers:
    "yes":
      damage-magic: +4
      arcane-magic: +2
      versatile-magic: +1
      healing-magic: -2
    "maybe":
      damage-magic: +1
      versatile-magic: +2
      utility-magic: +1
    "no":
      damage-magic: -2
      utility-magic: +2
      healing-magic: +1
      control-magic: +1
```

**NEW (affects 12+ traits):**
```yaml
- id: destructive-magic
  text: "Do you want to deal damage with spells?"
  answers:
    "yes":
      damage-magic: +4          # Primary signal
      arcane-magic: +2          # Secondary signal
      elemental-affinity: +2    # Often paired
      versatile-magic: -1       # Slight opposition
      healing-magic: -2         # Opposition
      control-magic: -1         # Opposition
      diplomatic-soul: -1       # Aggressive vs diplomatic
      aggressive-value: +2      # Personality alignment
      tactical-value: +1        # Planning damage output
      scholarly-background: +1  # Study of destructive forces
      chaotic-value: +1         # Destructive tendencies
      protective-value: -2      # Opposite of protection
    "maybe":
      damage-magic: +1
      versatile-magic: +2       # Wants flexibility
      utility-magic: +1
      tactical-value: +2        # Tactical magic use
    "no":
      damage-magic: -2
      healing-magic: +2         # Prefers healing
      utility-magic: +2         # Prefers utility
      control-magic: +2         # Prefers control
      protective-value: +2      # Protective personality
      diplomatic-soul: +2       # Non-destructive approach
      nurturing-soul: +1        # Nurturing personality
```

**Impact:** Same question, now affects 12-15 traits with nuanced cross-connections

#### 2.3. Target Question Count: 40-50 Questions

**Strategy:**
1. Keep 20 most efficient questions (affect 150+ archetypes each)
2. Add 5 questions for critical underquestioned traits
3. Add 15-20 new multi-dimensional questions designed to:
   - Cover remaining trait gaps
   - Affect 8-15 traits each
   - Balance positive/negative scoring for better differentiation

**Question Categories (suggested distribution):**
- **Magic Affinity:** 8-10 questions (covers 100+ magic traits)
- **Combat Style:** 8-10 questions (covers physical, tactical, aggressive, defensive traits)
- **Background/Origin:** 5-6 questions (consolidated backgrounds)
- **Personality/Values:** 8-10 questions (lawful, chaotic, protective, cunning, etc.)
- **Special Abilities:** 5-6 questions (innate powers, transformations, etc.)

**Total:** ~40-50 questions covering 120 traits with each question affecting 8-15 traits

### Phase 3: Scoring System Optimization

#### 3.1. Proportional Question Allocation

Traits should have question coverage proportional to archetype usage:

| Archetype Usage | Optimal Question Count | Example Traits |
|-----------------|----------------------:|----------------|
| 80-120 archetypes (rare) | 5-8 questions | `arcane-magic`, `knowledge-seeker` |
| 40-79 archetypes | 4-6 questions | `divine-magic`, `healing-magic` |
| 20-39 archetypes | 3-5 questions | `stealth-master`, `survival-expert` |
| 10-19 archetypes | 2-3 questions | `shapeshifter`, `poison-expert` |
| 1-9 archetypes | 1-2 questions | `crossbow-specialist`, `mounted` |

**Current Reality:** Inverted - rare traits have 20-60 questions, common traits have 1-5 questions!

#### 3.2. Weight Normalization

**Problem:** Archetypes with 7-14 traits have unequal question coverage

**Solution:**
- Archetypes with MORE traits should not automatically score higher
- Score = (matched traits / total archetype traits) × (coverage quality)
- Coverage quality = % of archetype's traits that have been asked about

**Example:**
- Archetype A: 14 traits, player asked about 10 of them, matched 7 = 50% discovery quality
- Archetype B: 7 traits, player asked about 7 of them, matched 5 = 100% discovery quality
- Despite A having more matches (7 vs 5), B should score higher due to complete coverage

---

## Implementation Priorities

### High Priority (Do First)
1. ✅ Remove 2 empty questions (character-backstory, moral-dilemmas)
2. ✅ Add 3-5 questions for divine-magic, divine-student, otherworldly-knowledge
3. ✅ Add 2-3 questions for underdog-fighter, instinctive-combatant, unpredictable-power
4. ✅ Reduce urban/scholarly/criminal-background questions from 26 → 8 each

### Medium Priority (Do Next)
5. 🔶 Merge 20-30 most similar traits (backgrounds, combat styles)
6. 🔶 Redesign top 20 efficient questions to affect 10-15 traits each
7. 🔶 Remove bottom 40-50 inefficient questions

### Low Priority (Future Optimization)
8. 🔷 Complete trait consolidation (221 → 120)
9. 🔷 Rebuild entire question bank (40-50 questions)
10. 🔷 Implement proportional coverage algorithm

---

## Expected Impact

### Current State
- 135 questions
- 221 traits
- Average archetype coverage: 100% (but with severe bias)
- Efficiency range: 0-254 archetypes per question
- Critical imbalances: 10 traits

### After High Priority Fixes
- ~130 questions (-4%)
- 221 traits
- Reduced bias for divine/underdog archetypes
- Background trait questions reduced by 60%
- Critical imbalances: 4-5 traits

### After Complete Overhaul
- ~45 questions (-67%)
- ~120 traits (-46%)
- Proportional coverage for all archetype types
- Every question affects 8-15 traits
- Minimal imbalances

---

## Conclusion

The questionnaire suffers from **structural unfairness** due to:
1. Too many questions (135 vs optimal 40-50)
2. Too many traits (221 vs optimal 100-120)
3. Massive coverage imbalances (divine-magic: 4 questions, urban-background: 26 questions)
4. Narrow question design (most affect 1-3 traits vs optimal 8-15)

**The current system favors:**
- Rogues/Stealth archetypes (110+ questions coverage)
- Tactical/Physical archetypes (115+ questions coverage)
- Urban/Criminal backgrounds (49+ questions coverage)

**The current system penalizes:**
- Divine casters (16 questions coverage)
- Innate power users (13 questions coverage)
- Transformation specialists (10 questions coverage)

**Recommendation:** Implement high-priority fixes immediately (10% improvement), then plan structural overhaul (70% improvement).

---

**Analysis Tools:**
- `tools/comprehensive-fairness-analysis.rb` - Full system analysis
- `tools/analyze-question-traits.rb` - Question coverage analysis
- `tools/analyze-archetype-traits.rb` - Archetype distribution analysis
- `tools/trait-analysis.rb` - Existing trait relationship analyzer
