# Fighter Dominance Analysis - Root Cause and Solutions

## The Problem: Fighter Bias in Questionnaire

Your questionnaire has a **massive bias toward Fighter archetypes** that explains why they dominate the top 10. Here's the detailed analysis:

### Root Cause: Trait Over-Representation

**The 4 most Fighter-heavy traits appear in 50-61% of ALL questions:**

1. **tactical-value**: 70/114 questions (61%) - Fighters use 137% vs Others 31%
2. **disciplined-value**: 66/114 questions (58%) - Fighters use 105% vs Others 17%
3. **physical**: 59/114 questions (52%) - Fighters use 100% vs Others 10%
4. **weapon-specialist**: 15/114 questions (13%) - Fighters use 100% vs Others 1%

### Why This Creates Dominance

Fighter archetypes (only 19 out of 294 total) get points from **most questions** because:

- **61% of questions** boost tactical-value (strategic thinking)
- **58% of questions** boost disciplined-value (patience/planning)
- **52% of questions** boost physical (strength/athletics)

Meanwhile other classes rely on traits that appear in fewer questions:
- Magic-focused traits: spread across many specific types
- Divine traits: concentrated in fewer questions
- Stealth traits: limited question coverage

### Mathematical Impact

A typical Fighter archetype gets scored by:
- ~70 questions for tactical-value (+1 to +7 each)
- ~66 questions for disciplined-value (+1 to +4 each)
- ~59 questions for physical traits (+1 to +3 each)

**Total: ~195 scoring opportunities** from just these 3 traits.

Compare to a typical Wizard who might get:
- ~20 questions for arcane-magic
- ~15 questions for scholar traits
- ~10 questions for knowledge-seeker

**Total: ~45 scoring opportunities** - less than 25% of Fighter opportunities.

## Solutions to Fix Fighter Bias

### Immediate Fixes (High Impact)

**1. Reduce Tactical-Value Frequency (Critical)**
- Remove tactical-value from 40+ questions
- Keep it only in questions specifically about strategy/planning (not general combat)
- Target: 20-25 questions maximum (down from 70)

**2. Reduce Disciplined-Value Frequency (Critical)**
- Remove disciplined-value from 35+ questions
- Keep it only in questions about patience/methodical approaches
- Target: 25-30 questions maximum (down from 66)

**3. Reduce Physical Frequency (Important)**
- Remove physical from 25+ questions
- Keep it only in questions about strength/athletics specifically
- Target: 30-35 questions maximum (down from 59)

### Strategic Fixes (Medium Impact)

**4. Add Class-Specific Trait Questions**
- Add 10+ questions specifically for arcane-magic traits
- Add 10+ questions specifically for divine-magic traits
- Add 8+ questions specifically for stealth/rogue traits
- Add 8+ questions specifically for nature/druid traits

**5. Consolidate Fighter Traits**
- Merge weapon-specialist + physical → "martial-prowess"
- Merge tactical-value + disciplined-value → "strategic-mind"
- This reduces Fighter scoring opportunities while maintaining distinctiveness

### Implementation Priority

**Week 1 (Critical - 60% improvement expected)**
```bash
# Identify and remove excessive tactical-value questions
grep -n "tactical-value" _data/question-bank.yml
# Keep only strategy-specific questions, remove from:
# - General combat questions
# - Magic questions that got tactical-value for "planning"
# - Equipment questions with tactical-value for "positioning"
```

**Week 2 (Critical - 30% improvement expected)**
```bash
# Do the same for disciplined-value
# Remove it from questions about:
# - Magic study (use arcane-magic instead)
# - Religious devotion (use religious-value instead)
# - General patience (too broad)
```

**Week 3 (Important - 20% improvement expected)**
```bash
# Add missing class trait questions
# Focus on arcane-magic, divine-magic, stealth-master, nature-guardian
```

### Expected Results After Fixes

**Current State:**
- Fighters: ~195 scoring opportunities
- Other classes: ~45-80 scoring opportunities
- Fighter dominance ratio: 2.4-4.3x advantage

**After Fixes:**
- Fighters: ~80-100 scoring opportunities
- Other classes: ~70-100 scoring opportunities
- Fighter dominance ratio: 1.0-1.4x (balanced range)

### Validation Commands

```bash
# Track progress
ruby tools/comprehensive-fairness-analysis.rb | grep -A 20 "CRITICAL IMBALANCES"

# Test Fighter bias specifically
ruby analyze_fighter_bias.rb

# Verify question efficiency
ruby tools/question-audit.rb | head -50
```

## Summary

The Fighter dominance isn't due to Fighter archetypes being inherently better designed - it's because **the questionnaire accidentally gives them 2-4x more scoring opportunities than other classes**.

The traits `tactical-value` and `disciplined-value` were added to too many questions during optimization, creating an unintentional bias toward any archetype using these traits (which happen to be heavily Fighter-focused).

Fixing this requires **reducing the frequency of over-represented traits** and **adding questions for under-represented class traits**.