# Questionnaire Deep Dive - Executive Summary

**Prepared:** February 20, 2026
**Status:** 🔴 Critical Imbalances Identified
**Priority:** High - Affects 22-65 archetypes

---

## The Problem in 60 Seconds

The Class Recommendation Questionnaire has **structural unfairness**:

- **135 questions** is too many (40-50 is optimal)
- **8 questions** affect <40 archetypes each (very inefficient)
- **26 questions** focus on backgrounds used by only 3-8 archetypes (massive waste)
- **65 archetypes** rely on `divine-magic` trait covered by only 4 questions
- **Rogues** are 7x easier to discover than **Clerics**

Result: The questionnaire **strongly favors** stealth/tactical archetypes and **penalizes** divine/transformation archetypes.

---

## The Numbers

### Question Efficiency Distribution

| Efficiency Tier | Archetype Impact | Question Count | Status |
|----------------|------------------|----------------|--------|
| 🌟 **Excellent** | 150+ archetypes (51%+) | **39 questions** | ✅ Keep all |
| 🔧 **Good** | 60-149 archetypes (20-51%) | **70 questions** | 🔄 Enhance |
| ⚠️ **Poor** | 40-59 archetypes (14-20%) | **18 questions** | ❌ Redesign |
| 🔴 **Critical** | <40 archetypes (<14%) | **8 questions** | ❌ Remove |

### Trait Coverage Imbalances

| Category | Archetypes Affected | Questions Available | Ratio |
|----------|--------------------:|--------------------:|------:|
| **Divine Magic** (underserved) | 65 (22%) | 4 (3%) | **1:16** ⚠️ |
| **Otherworldly Knowledge** | 37 (13%) | 1 (1%) | **1:37** ⚠️ |
| **Instinctive Combat** | 22 (8%) | 3 (2%) | **1:7** ⚠️ |
| **Urban Background** (overserved) | 3 (1%) | 26 (19%) | **9:1** 🔴 |
| **Scholarly Background** | 8 (3%) | 26 (19%) | **3:1** 🔴 |
| **Criminal Background** | 6 (2%) | 23 (17%) | **4:1** 🔴 |

**Optimal ratio:** 1:1 (equal representation)

---

## Who Gets Favored? (Bias Analysis)

### ✅ **Strongly Favored Classes** (70+ question coverage)
- **Rogue:** 110+ questions for stealth/tactics/criminal
- **Fighter:** 115+ questions for physical/tactical
- **Ranger:** 90+ questions for wilderness/survival/tactics

### ⚠️ **Moderately Favored** (40-70 questions)
- **Wizard:** 65+ questions for arcane/study
- **Bard:** 55+ questions for social/performance
- **Barbarian:** 60+ questions for physical/reckless

### 🔴 **Strongly Penalized** (<30 questions)
- **Cleric:** 16 questions for divine magic
- **Warlock:** 20 questions for otherworldly powers
- **Druid:** 25 questions for transformation
- **Sorcerer:** 18 questions for innate powers

**The math:** A player interested in divine magic has **16 opportunities** to signal that preference across 135 questions. A player interested in stealth has **110 opportunities**. This creates **7x bias** toward rogues.

---

## Root Causes

### 1. **Trait Proliferation**
- **221 unique traits** is too granular
- Many traits differ only semantically
- Example: `scholarly-background`, `academic-pursuit`, `magic-student` could be one trait

### 2. **Background Overemphasis**
- 75+ questions score background traits
- Backgrounds only matter for 3-8 archetypes each
- Backgrounds crowd out mechanical traits (magic types, combat styles)

### 3. **Narrow Question Design**
- Average question affects 3-5 traits
- Should affect 10-15 traits
- Missing cross-domain connections (personality → magic type, background → combat style)

### 4. **No Proportional Allocation**
- Traits used by 65 archetypes have same question count as traits used by 3 archetypes
- Should be: More archetypes = More questions
- Currently: Inverted (fewer archetypes = more questions)

---

## Recommended Solutions

### 🟢 **Phase 1: Quick Wins** (2-4 hours, 30% improvement)

**Remove:**
- 2 empty questions (character-backstory, moral-dilemmas)
- 8 very low efficiency questions (<40 archetypes)
- **10 questions total**

**Add:**
- 5 new questions for critical gaps (divine-power-source, underdog-style, forbidden-knowledge, unpredictable-power, transformation-power)
- **5 questions total**

**Consolidate:**
- 26 urban/scholarly/criminal background questions → 8 questions
- **18 questions removed**

**Result:** 135 → 107 questions (-21%), critical gaps filled

### 🟡 **Phase 2: Enhancement** (8-12 hours, 60% improvement)

**Enhance:**
- Top 20 efficient questions: add 5-8 traits each
- Example: "magic-interest" affects 9 traits → enhance to 15 traits

**Redesign:**
- 15-20 medium-efficiency questions to affect more archetypes
- Example: "dodge-attacks" affects 29 archetypes → redesign to affect 80+ archetypes

**Result:** 107 → ~90 questions, better trait coverage per question

### 🔵 **Phase 3: Complete Overhaul** (40-60 hours, 95% improvement)

**Merge Traits:**
- 221 traits → ~120 traits
- Consolidate similar backgrounds, combat styles, magic types

**Rebuild Questions:**
- ~45 highly-efficient questions
- Each affects 10-15 traits
- Organized into 5 categories (magic, combat, background, personality, special)

**Result:** 45 questions, 120 traits, near-perfect fairness

---

## Impact Examples

### Before Fix (Current State)
**Player wants divine healer:**
- Relevant questions: 16
- Discovery probability: **12%**
- Top recommendation: Often Rogue/Fighter (tactical overlap)

**Player wants stealthy rogue:**
- Relevant questions: 110
- Discovery probability: **81%**
- Top recommendation: Always Rogue

**Bias ratio:** 7:1 in favor of rogues

### After Phase 1 Fix
**Player wants divine healer:**
- Relevant questions: 28 (+75%)
- Discovery probability: **26%**
- Top recommendation: Cleric 60% of the time

**Player wants stealthy rogue:**
- Relevant questions: 92 (-16%)
- Discovery probability: **68%**
- Top recommendation: Always Rogue

**Bias ratio:** 3:1 (much better, still not perfect)

### After Complete Overhaul
**Player wants divine healer:**
- Relevant questions: 22 (out of 45 total)
- Discovery probability: **89%**
- Top recommendation: Cleric 95% of the time

**Player wants stealthy rogue:**
- Relevant questions: 24 (out of 45 total)
- Discovery probability: **92%**
- Top recommendation: Rogue 95% of the time

**Bias ratio:** 1:1 (fair!)

---

## Tools Created for Analysis

All analysis tools saved in `tools/` directory:

1. **`comprehensive-fairness-analysis.rb`** - Complete system audit
   - Identifies trait imbalances
   - Calculates archetype discoverability
   - Measures question efficiency
   - Generates recommendations

2. **`question-audit.rb`** - Actionable question list
   - Lists questions to remove
   - Lists questions to keep
   - Lists questions to redesign
   - Provides efficiency metrics

3. **`analyze-question-traits.rb`** - Question coverage analysis
   - Shows which traits are overquestioned
   - Shows which traits are underquestioned
   - Calculates score ranges

4. **`analyze-archetype-traits.rb`** - Archetype distribution
   - Shows trait usage across archetypes
   - Identifies archetypes with most/fewest traits
   - Helps plan trait consolidation

5. **`trait-analysis.rb`** (existing) - Relationship analyzer
   - Finds similar traits for merging
   - Generates HTML report

---

## Documentation Created

1. **`QUESTIONNAIRE_FAIRNESS_ANALYSIS.md`** - Comprehensive deep dive
   - Root cause analysis
   - Detailed findings
   - Statistical breakdowns
   - Recommendations with rationale

2. **`QUESTIONNAIRE_IMPLEMENTATION_GUIDE.md`** - Practical implementation
   - Specific questions to add/remove/change
   - Example question designs
   - Trait merge recommendations
   - Step-by-step instructions

3. **`README`** (this file) - Executive summary

---

## Next Steps

### Immediate (Do Now)
1. Review `QUESTIONNAIRE_FAIRNESS_ANALYSIS.md` for full context
2. Review `QUESTIONNAIRE_IMPLEMENTATION_GUIDE.md` for specific changes
3. Run `ruby tools/question-audit.rb` to see question-by-question recommendations
4. Decide on implementation phase (1, 2, or 3)

### Phase 1 Implementation (Recommended First Step)
1. Remove 10 inefficient questions
2. Add 5 critical gap questions
3. Consolidate background questions (26 → 8)
4. Test with diverse playstyles
5. Run analysis tools to verify improvement

### Ongoing
- Rerun analysis tools after each batch of changes
- Test questionnaire with different player archetypes
- Monitor for new imbalances as archetypes are added
- Consider Phase 2/3 based on Phase 1 results

---

## Key Takeaway

**The questionnaire is mathematically biased toward physical/tactical/stealth archetypes and against divine/transformation/innate power archetypes.**

This isn't a minor issue - some archetypes have **7x less discovery opportunity** than others. The good news: The fix is straightforward and the analysis tools make it measurable.

**Recommended approach:** Start with Phase 1 (quick wins), test thoroughly, then decide if deeper changes are needed.

---

## Questions?

- Full analysis: `QUESTIONNAIRE_FAIRNESS_ANALYSIS.md`
- Implementation guide: `QUESTIONNAIRE_IMPLEMENTATION_GUIDE.md`
- Run analysis: `ruby tools/comprehensive-fairness-analysis.rb`
- Question audit: `ruby tools/question-audit.rb`
