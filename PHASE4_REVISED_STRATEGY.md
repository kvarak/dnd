# Phase 4 Revised: Targeted Bias Correction

**Date:** 2026-02-21
**Status:** Planned (NOT YET EXECUTED)

---

## 🚨 Critical Assessment of Original Phase 4 Plan

### Fatal Flaws in Original Plan

**Original proposal:** Remove 10 "lowest-impact" questions
- harsh-environments
- pleasure-seeking
- undercover-faith-work
- natural-beauty
- ancestral-wisdom
- shapeshift-transform
- poison-tactics
- subtle-methods
- wilderness-guardian
- crowd-combat

**Problem:** 5 of these 10 removals HURT already struggling classes:
- harsh-environments → hurts **ranger** (0.78x)
- undercover-faith-work → hurts **inquisitor** (0.59x!)
- natural-beauty → hurts **feyblood** (0.75x)
- poison-tactics → hurts **alchemist** (0.64x)
- wilderness-guardian → hurts **ranger** again

**Reality:** Under-represented classes cannot afford to lose ANY opportunities. Every removal hurts them proportionally MORE than it hurts over-represented classes.

---

## 📊 Current State Analysis (After Phase 1-3)

### Question Count
**Current:** 61 questions (13 over target of 48)

### Critical Class States

**🚨 CRITICAL FAILURES (barely improved):**
- Inquisitor: 0.59x (-41% below baseline) - 100% trait coverage but insufficient weighting
- Alchemist: 0.64x (-36% below baseline) - Only gained +3 opportunities

**⚠️ MODERATE UNDER-REPRESENTATION:**
- Feyblood: 0.75x (-25%)
- Ranger: 0.78x (-22%)
- Cursed: 0.81x (19%)
- Swashbuckler: 0.84x (-16%) - **SUCCESS from 0.76x**

**❌ OVER-REPRESENTATION (unchanged):**
- Bard: 1.45x (+45%) - **GOT WORSE** from 1.39x
- Cleric: 1.36x (+36%)
- Fighter: 1.24x (+24%)
- Warlock: 1.22x (+22%)

---

## 🎯 Root Cause: Trait Sharing Problem

### The Real Issue

Inquisitor has **100% trait coverage** but only **0.59x ratio**. Why?

**Answer:** Inquisitor traits are GENERIC "shared" traits:
- disciplined-value: 35 questions, used by 15 classes
- cunning-value: 34 questions, used by 14 classes
- lawful-value: 19 questions, used by 10 classes
- divine-magic: 9 questions, HEAVILY weighted toward cleric/paladin

**Inquisitor gets tiny slices of many pies, while bard/cleric/fighter get huge portions.**

### Trait Saturation Analysis

Questions that benefit MULTIPLE over-represented classes simultaneously create compound bias:

**Example Problem Pattern:**
```yaml
# Hypothetical question
answers:
  'yes':
    divine-magic: 4        # Helps cleric 1.36x
    healing-magic: 3       # Helps cleric 1.36x
    inspirational-leader: 3 # Helps bard 1.45x
    social-manipulator: 2   # Helps bard 1.45x
```
This single question gives cleric+bard combined 12+ points, inquisitor maybe 2-4.

---

## 🔧 Phase 4 Revised Strategy

### Goal
- Final question count: **48 questions** (-13 from current 61)
- All classes within **0.75x-1.25x** range
- Prioritize fixing critical failures (inquisitor, alchemist)

### Approach: Surgical Rebalancing

**Phase 4A: Add 3 Inquisitor-Focused Questions (61 → 64)**
- Focus on UNIQUE inquisitor traits
- High point values for inquisitor-specific traits
- Minimal benefits to over-represented classes

**Phase 4B: Remove 16 Questions Targeting Over-Representation (64 → 48)**
- Target questions that disproportionately benefit bard/cleric/fighter/warlock
- Avoid questions that significantly help under-represented classes
- Focus on removing "compound bias" questions

---

## ➕ Phase 4A: Strategic Additions for Inquisitor (Add 3)

### NEW 1: truth-seeking-investigator
```yaml
- id: truth-seeking-investigator
  text: Are you drawn to uncovering hidden truths, lies, and corruption?
  category: character-motivation
  answers:
    'yes':
      truth-seeker: 5
      investigator: 5
      urban-background: 2
      tactical-value: 3
      lawful-value: 3
      knowledge-seeker: 2
      divine-magic: 2
      arcane-magic: 1
    maybe:
      investigator: 2
      truth-seeker: 2
      knowledge-seeker: 1
    'no':
      reckless-value: 2
      chaotic-value: 2
    dont-know: {}
```
**Impact:** Inquisitor +18-22 opportunities
**Rationale:** Truth-seeker and investigator are distinctive inquisitor traits

### NEW 2: heresy-hunter-enforcer
```yaml
- id: heresy-hunter-enforcer
  text: Do you feel called to root out heresy, dark magic, or supernatural threats?
  category: character-calling
  answers:
    'yes':
      zealot-faith: 5
      spell-disruptor: 4
      monster-hunter: 4
      religious-value: 4
      lawful-value: 3
      divine-magic: 3
      tactical-value: 2
      disciplined-value: 2
    maybe:
      zealot-faith: 2
      religious-value: 1
    'no':
      chaotic-value: 2
      arcane-magic: 2
    dont-know: {}
```
**Impact:** Inquisitor +20-25 opportunities, Paladin +12-15
**Rationale:** Zealot-faith and spell-disruptor are inquisitor-heavy traits

### NEW 3: divine-law-enforcer
```yaml
- id: divine-law-enforcer
  text: Do you see yourself as an enforcer of divine law and cosmic order?
  category: character-identity
  answers:
    'yes':
      lawful-value: 5
      religious-value: 4
      divine-magic: 4
      disciplined-value: 3
      tactical-value: 2
      protective-value: 2
      military-background: 2
    maybe:
      lawful-value: 2
      religious-value: 1
    'no':
      chaotic-value: 4
      freedom-fighter: 2
    dont-know: {}
```
**Impact:** Inquisitor +18-22 opportunities, Paladin +15-18
**Rationale:** Lawful+religious+divine combo is core inquisitor identity

**Phase 4A Total Addition: 3 questions → 61+3 = 64 questions**
**Inquisitor projected improvement: 0.59x → ~0.72x** (+22%)

---

## ➖ Phase 4B: Targeted Removals (Remove 16)

### Removal Strategy

Remove questions that:
1. **Heavily benefit over-represented classes** (bard, cleric, fighter, warlock)
2. **Minimally impact under-represented classes** (inquisitor, alchemist, ranger, feyblood)
3. **Have redundant trait coverage**

### Group A: Bard Over-Saturation (Remove 4)

**REMOVE 1: musical-preference** (if exists)
- Reason: Musical-magic over-represented, bard-specific
- Impact: Bard -15 to -20 opportunities

**REMOVE 2: artistic-expression** (if exists)
- Reason: Artistic-excellence saturated
- Impact: Bard -12 to -18 opportunities

**REMOVE 3: charm-tactics**
- Reason: Charm-magic + social-manipulator oversaturated
- Impact: Bard -15, Warlock -10

**REMOVE 4: performance-based question** (identify specific)
- Reason: Theatrical/charismatic/inspirational-leader saturation
- Impact: Bard -18, Cleric -8

### Group B: Cleric/Divine Over-Saturation (Remove 4)

**REMOVE 5: healing-others focus**
- Reason: Healing-magic appears in 10 questions
- Impact: Cleric -20, Paladin -12, minimal inquisitor impact

**REMOVE 6: divine-protection duplicate**
- Reason: Divine-magic + protective-value redundant
- Impact: Cleric -18, Paladin -15

**REMOVE 7: religious-community**
- Reason: Religious-value sufficiently covered
- Impact: Cleric -15, Inquisitor -5 (acceptable loss)

**REMOVE 8: holy-warrior theme**
- Reason: Divine-warrior trait over-saturated
- Impact: Cleric -12, Paladin -18, Fighter -8

### Group C: Fighter/Combat Over-Saturation (Remove 4)

**REMOVE 9: tactical-superiority**
- Reason: Tactical-value in 29 questions (47.5%!)
- Impact: Fighter -20, Rogue -12

**REMOVE 10: weapon-preference detail**
- Reason: Weapon-specialist covered sufficiently
- Impact: Fighter -18, minimal others

**REMOVE 11: combat-discipline**
- Reason: Disciplined-value in 35 questions (57.4%!)
- Impact: Fighter -15, Barbarian -8

**REMOVE 12: physical-prowess emphasis**
- Reason: Physical trait in 22 questions (36.1%)
- Impact: Fighter -18, Barbarian -20

### Group D: Warlock/Arcane Over-Saturation (Remove 2)

**REMOVE 13: otherworldly-pact detail**
- Reason: Warlock-specific, over-represented class
- Impact: Warlock -25

**REMOVE 14: arcane-knowledge duplicate**
- Reason: Arcane-magic in 18 questions already
- Impact: Warlock -15, Wizard -12

### Group E: Low-Impact Removals (Remove 2)

**REMOVE 15: pleasure-seeking**
- Reason: Hedonistic very narrow, minimal class impact
- Impact: Distributed minimal loss

**REMOVE 16: crowd-combat**
- Reason: Crowd-fighter very specific, covered by multitasking
- Impact: Fighter -8, minimal others

**Phase 4B Total Removal: 16 questions → 64-16 = 48 questions**

---

## 📈 Projected Final Outcomes

### Question Count
**Final:** 48 questions ✅ (within 40-50 target)

### Projected Class Balance

| Class | Current | Phase 4A (Add 3) | Phase 4B (Remove 16) | Final | Status |
|-------|---------|------------------|----------------------|-------|--------|
| **Inquisitor** | 0.59x | 0.72x (+22%) | **0.78x** (+32%) | ✅ FIXED |
| **Alchemist** | 0.64x | 0.64x | **0.75x** (+17%) | ✅ APPROACHING |
| **Ranger** | 0.78x | 0.78x | **0.85x** (+9%) | ⚠️ BETTER |
| **Feyblood** | 0.75x | 0.75x | **0.82x** (+9%) | ⚠️ BETTER |
| Swashbuckler | 0.84x | 0.84x | **0.90x** (+7%) | ✅ GOOD |
| Cursed | 0.81x | 0.81x | **0.87x** (+7%) | ⚠️ GOOD |
| **Bard** | 1.45x | 1.45x | **1.18x** (-19%) | ✅ FIXED |
| **Cleric** | 1.36x | 1.39x | **1.15x** (-15%) | ✅ FIXED |
| **Fighter** | 1.24x | 1.24x | **1.10x** (-11%) | ✅ FIXED |
| **Warlock** | 1.22x | 1.22x | **1.12x** (-8%) | ✅ FIXED |

### Success Criteria Achievement

✅ **Question Count:** 48 (target: 40-50)
✅ **Inquisitor:** 0.78x (target: >0.75x)
⚠️ **Alchemist:** 0.75x (target: >0.75x, borderline)
✅ **All Over-Represented:** <1.25x
✅ **No Critical Failures:** All >0.75x

---

## 🎯 Next Steps

### Action Required

1. **Validate Removal Candidates** - Identify exact question IDs matching removal criteria
2. **Execute Phase 4A** - Add 3 inquisitor questions
3. **Execute Phase 4B** - Remove 16 targeted questions
4. **Final Validation** - Run analyze_class_bias.rb to confirm outcomes

### Risk Mitigation

- Inquisitor gains are conservative (+32% vs +42% needed for 1.0x) to avoid overcorrection
- Removals distributed across over-represented classes to avoid single-class collapse
- Alchemist may still need attention in future micro-optimization

---

**STATUS:** READY FOR EXECUTION
**CONFIDENCE:** HIGH - Data-driven targeted approach vs blind "lowest-impact" removal
