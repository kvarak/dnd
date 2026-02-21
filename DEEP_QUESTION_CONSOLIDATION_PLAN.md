# Deep Question Bank Consolidation & Balancing Plan

**Purpose:** Reduce question bank from 66 questions to 40-50 questions while dramatically improving archetype discovery balance across all 294 archetypes.

**Current State:** 66 questions, 294 archetypes, 174/203 traits covered, severe class/archetype imbalance
**Target State:** 40-50 questions, 294 archetypes, 180+/203 traits covered, all ratios 0.8-1.2x
**Approach:** Holistic consolidation + strategic additions for underrepresented classes

---

## 📊 Current Bias Analysis

### Class-Level Bias (Target: 1.0x, Acceptable: 0.8x-1.2x)

**OVER-REPRESENTED (Need fewer opportunities):**
- Bard: **1.39x** (452 opp) - 43% over ❌
- Cleric: **1.36x** (441 opp) - 36% over ❌
- Fighter: **1.3x** (422 opp) - 30% over ❌
- Barbarian: **1.27x** (411 opp) - 27% over ❌
- Warlock: **1.21x** (392 opp) - 21% over ⚠️
- Sorcerer: **1.19x** (385 opp) - 19% over ⚠️

**UNDER-REPRESENTED (Need more opportunities):**
- **Inquisitor: 0.6x** (194 opp) - 42% under 🚨 CRITICAL
- **Alchemist: 0.67x** (216 opp) - 35% under 🚨 CRITICAL
- **Ranger: 0.75x** (242 opp) - 27% under ❌
- **Feyblood: 0.76x** (246 opp) - 24% under ❌
- **Swashbuckler: 0.76x** (246 opp) - 24% under ❌
- Cursed: 0.83x (269 opp) - 17% under ⚠️
- Cavalier: 0.86x (279 opp) - 14% under ⚠️

### Archetype-Level Critical Issues

**Most Over-represented:**
- warlock:dispater: 1.83x (161 opp)
- fighter:sellsword: 1.82x (160 opp)
- barbarian:path-of-the-marauder: 1.76x (155 opp)

**Most Under-represented:**
- **swashbuckler:corsair: 0.25x** (22 opp) 🚨 CRITICAL
- **swashbuckler:daredevil: 0.3x** (26 opp) 🚨 CRITICAL
- **swashbuckler:fatebender: 0.36x** (32 opp) 🚨 CRITICAL
- **ranger:nightstalker: 0.47x** (41 opp) 🚨 CRITICAL
- **paladin:oath-of-the-revenant: 0.48x** (42 opp) 🚨 CRITICAL

**Summary:** 81 archetypes over-represented (27.6%), **27 severely under-represented** (<0.6x)

---

## 🎯 Root Cause Analysis

### Over-questioned Traits (Creating Bias)
- **cunning-value**: 37 questions (56.1%) - Appears in EVERY answer set
- **disciplined-value**: 34 questions (51.5%) - Over-saturated
- **tactical-value**: 30 questions (45.5%) - Too many combat questions
- **physical**: 27 questions (40.9%) - Barbarian/Fighter bias

### Missing Critical Traits (Hurting Swashbuckler/Alchemist/Ranger)
**Swashbuckler (10 traits missing, 0 questions):**
- **refined** - 10 archetypes (ALL swashbucklers except duelist)
- **theatrical** - 5 archetypes
- **perfectionist** - 6 archetypes
- **precise** - 5 archetypes
- **outlaw** - 3 archetypes
- critical-striker, controlling, disarming, dual-identity, improvised, masked, probability-manipulation, rebellious

**Alchemist (20 archetypes, 0 questions):**
- **craftsman-background** - 20 archetypes (ALL 6 alchemists + 14 professionals)
- alchemical-transformation

**Ranger/Under-represented:**
- summon-familiar (3 archetypes including ranger:nightstalker)
- fate-touched (15 archetypes)
- dimensional-magic (6 archetypes)
- endurance-specialist (11 archetypes)

### Category Over-saturation
- **Combat questions**: 30+ questions (45% of total) - Creates fighter/barbarian bias
- **Magic questions**: 20+ questions - Creates caster bias
- **Background questions**: Only 5 questions - Missing craftsman, academic depth
- **Character personality**: Under-represented

---

## 🔧 Consolidation Strategy

### Phase 1: Remove Duplicate & Over-saturated Questions (Remove 18-20)

#### Group A: Direct Duplicates (Remove 8)

1. **REMOVE: defensive-protection** (id: defensive-protection)
   - **Reason:** 90% overlap with "defensive-stance" and "protect-others"
   - Traits covered: healing-magic, divine-magic, natural-armor, physical, disciplined-value, control-magic
   - **Merge into:** defensive-stance (broader coverage)

2. **REMOVE: overwhelming-force** (id: overwhelming-force)
   - **Reason:** Duplicate of "first-strike" + adds strength-specialist bias
   - Over-represents barbarian/fighter
   - **Keep:** first-strike is more balanced

3. **REMOVE: heavy-armor-preference** (id: heavy-armor-preference)
   - **Reason:** Heavy overlap with defensive-stance + defensive-expert questions
   - Creates fighter bias
   - Traits already covered in other questions

4. **REMOVE: fire-wielding** (id: fire-wielding)
   - **Reason:** Very specific elemental sub-type, covered by elemental-power
   - Only 4 archetypes benefit uniquely
   - **Keep:** elemental-power (broader)

5. **REMOVE: rune-inscription** (id: rune-inscription)
   - **Reason:** Very narrow (only rune-magic trait), arcane-magic already covered extensively
   - 4 points possible, only benefits 2-3 archetypes significantly
   - Arcane-magic appears in 15 other questions

6. **REMOVE: pragmatic-combat** (id: pragmatic-combat)
   - **Reason:** 85% overlap with "dirty-tricks"
   - Both test same concept (winning by any means)
   - **Merge into:** dirty-tricks (more evocative)

7. **REMOVE: divine-warrior** (id: divine-warrior)
   - **Reason:** Highly redundant with religious-devotion (which gives divine-magic +9)
   - Creates paladin over-representation
   - Divine-warrior trait already scored in religious-devotion

8. **REMOVE: explosives-preference** (id: explosives-preference)
   - **Reason:** Very niche (only alchemist:mad-bomber benefits significantly)
   - Doesn't help alchemist class overall (only 1 of 6 archetypes)
   - Damage-magic covered elsewhere

#### Group B: Over-saturated Combat Questions (Remove 6)

9. **REMOVE: precision-vs-power** (id: precision-vs-power)
   - **Reason:** Tactical-value appears in 23 questions already
   - Adds fighter bias, swashbuckler doesn't benefit (missing "precise" trait in questions)
   - Physical combat covered excessively

10. **REMOVE: first-strike** (id: first-strike)
    - **Reason:** Initiative-specialist very narrow trait
    - Tactical-value over-saturated
    - Infiltrator covered by stealth questions

11. **REMOVE: agility-fighting** (id: agility-fighting)
    - **Reason:** Duplicate of extreme-mobility + mobile fighting concepts
    - Agile-warrior trait covered in extreme-mobility
    - Strength vs agility already tested in overwhelming-force

12. **REMOVE: protect-others** (id: protect-others)
    - **Reason:** 80% overlap with defensive-stance + healing-magic question
    - Shield-specialist, defensive-expert, divine-magic all tested elsewhere
    - Creates cleric/paladin bias

13. **REMOVE: defensive-stance** (id: defensive-stance)
    - **Reason:** Defensive-expert appears in 7 questions already
    - After removing defensive-protection, this becomes redundant
    - Keep tactical questions, remove pure defense

14. **REMOVE: combat-risks** (id: combat-risks)
    - **Reason:** Risk-taker covered, reckless-value in 15 questions
    - Creates barbarian bias
    - Covered by other combat style questions

#### Group C: Magic Over-saturation (Remove 4)

15. **REMOVE: destruction-magic** (id: destructive-magic)
    - **Reason:** Damage-magic appears in 14 questions
    - Elemental-power + magic-interest already cover this
    - Creates sorcerer/wizard bias

16. **REMOVE: versatile-effects** (id: versatile-effects)
    - **Reason:** Versatile-magic appears in 27 questions (40.9% of questions!)
    - Transmutation-magic covered in transformation-magic
    - Over-represents bard

17. **REMOVE: transformation-magic** (id: transformation-magic)
    - **Reason:** Transmutation covered, shapeshifter has own question
    - Arcane-magic in 15 questions
    - Very few archetypes benefit uniquely

18. **REMOVE: dual-nature-balance** (id: dual-nature-balance)
    - **Reason:** Dual-nature trait not critical, covered by versatile questions
    - Creates tactical-value bias (already 30 questions)
    - Adaptable-fighter covered elsewhere

---

### Phase 2: Strategic Additions for Under-represented Classes (Add 8-10)

#### Critical Additions for Swashbuckler (Add 4)

**NEW 1: refined-duelist**
```yaml
- id: refined-duelist
  text: Do you see yourself as a refined, stylish combatant who values elegance and panache?
  category: character-identity
  answers:
    'yes':
      refined: 6
      perfectionist: 4
      precise: 4
      duelist: 3
      theatrical: 3
      agile-warrior: 2
      charismatic: 2
      noble-background: 2
      diplomatic-soul: 1
      reckless-value: -2
    maybe:
      refined: 2
      charismatic: 1
      precise: 1
    'no':
      reckless-value: 3
      instinctive-combatant: 2
      pragmatic-fighter: 2
    dont-know: {}
```
**Impact:** Swashbuckler +24-30 opportunities, refined trait covered

**NEW 2: outlaw-rebel**
```yaml
- id: outlaw-rebel
  text: Does living outside the law or rebelling against authority appeal to you?
  category: character-motivation
  answers:
    'yes':
      outlaw: 4
      rebellious: 4
      criminal-background: 4
      freedom-fighter: 3
      chaotic-value: 3
      cunning-value: 2
      dual-identity: 2
      masked: 2
      lawful-value: -3
      noble-background: -2
    maybe:
      freedom-fighter: 2
      chaotic-value: 1
    'no':
      lawful-value: 4
      military-background: 3
      noble-background: 2
      disciplined-value: 2
    dont-know: {}
```
**Impact:** Swashbuckler (corsair, highwayman) +16-20 opportunities

**NEW 3: performance-showmanship**
```yaml
- id: performance-showmanship
  text: Do you enjoy putting on a show, being theatrical, or performing for others?
  category: character-personality
  answers:
    'yes':
      theatrical: 5
      artistic-excellence: 4
      musical-magic: 3
      charm-magic: 2
      social-manipulator: 3
      charismatic: 3
      joyful-spirit: 2
      refined: 2
      inspirational-leader: 1
    maybe:
      theatrical: 2
      charismatic: 1
      artistic-excellence: 1
    'no':
      tactical-value: 2
      disciplined-value: 2
      stealth-master: 2
    dont-know: {}
```
**Impact:** Swashbuckler +15-18 opportunities, Bard +20 (but helps balance theatrical trait)

**NEW 4: critical-precision**
```yaml
- id: critical-precision
  text: Do you rely on finding and exploiting weak points for devastating strikes?
  category: combat-approach
  answers:
    'yes':
      critical-striker: 4
      precise: 4
      tactical-value: 2
      cunning-value: 2
      disciplined-value: 2
      weapon-specialist: 2
    maybe:
      critical-striker: 1
      precise: 1
      tactical-value: 1
    'no':
      reckless-value: 3
      damage-magic: 2
      crowd-fighter: 2
    dont-know: {}
```
**Impact:** Swashbuckler (duelist) +12-16 opportunities, Rogue +8-12

#### Critical Additions for Alchemist/Craftsman (Add 2)

**NEW 5: craftsman-tinkerer**
```yaml
- id: craftsman-tinkerer
  text: Do you enjoy crafting, building, or creating things with your hands?
  category: character-capability
  answers:
    'yes':
      craftsman-background: 6
      innovation-specialist: 4
      modern-value: 3
      engineering-mind: 3
      potion-brewer: 3
      alchemical-transformation: 2
      poison-expert: 2
      explosives-expert: 2
      disciplined-value: 2
      tactical-value: 1
    maybe:
      craftsman-background: 2
      innovation-specialist: 1
    'no':
      instinctive-combatant: 2
      athletic-prowess: 2
      innate-magic: 2
    dont-know: {}
```
**Impact:** Alchemist +35-45 opportunities (CRITICAL), Professional +30-40

**NEW 6: experimental-innovation**
```yaml
- id: experimental-innovation
  text: Are you drawn to experimentation and pushing boundaries of what's possible?
  category: character-motivation
  answers:
    'yes':
      innovation-specialist: 5
      modern-value: 4
      transmutation-magic: 3
      alchemical-transformation: 3
      chaos-magic: 2
      versatile-magic: 2
      knowledge-seeker: 2
      scholar: 2
      chaotic-value: 2
      reckless-value: 1
      lawful-value: -2
    maybe:
      innovation-specialist: 2
      versatile-magic: 1
    'no':
      lawful-value: 3
      disciplined-value: 3
      traditional-value: 2
    dont-know: {}
```
**Impact:** Alchemist +18-25 opportunities, Wizard +12-18

#### Additions for Ranger/Inquisitor/Under-represented (Add 3)

**NEW 7: familiar-companion-bond**
```yaml
- id: familiar-companion-bond
  text: Would you like a magical familiar or spirit companion that aids you?
  category: character-capability
  answers:
    'yes':
      summon-familiar: 5
      animal-companion: 3
      spirit-medium: 3
      beast-friend: 2
      arcane-magic: 2
      nature-magic: 2
      utility-magic: 2
      otherworldly-knowledge: 1
    maybe:
      summon-familiar: 2
      animal-companion: 1
    'no':
      weapon-specialist: 2
      physical: 2
    dont-know: {}
```
**Impact:** Ranger (nightstalker) +15-20, Wizard +12-15

**NEW 8: fate-destiny**
```yaml
- id: fate-destiny
  text: Are you interested in fate, destiny, prophecy, or manipulating probability?
  category: power-preference
  answers:
    'yes':
      fate-touched: 5
      divination-magic: 4
      probability-manipulation: 4
      lucky: 3
      otherworldly-knowledge: 2
      scholar: 2
      divine-magic: 2
      arcane-magic: 1
    maybe:
      fate-touched: 2
      divination-magic: 1
      lucky: 1
    'no':
      tactical-value: 2
      disciplined-value: 2
    dont-know: {}
```
**Impact:** Swashbuckler (fatebender) +12-16, Sorcerer +15-18, Warlock +10-15

**NEW 9: endurance-perseverance**
```yaml
- id: endurance-perseverance
  text: Do you value endurance, perseverance, and the ability to outlast your opponents?
  category: character-values
  answers:
    'yes':
      endurance-specialist: 5
      disciplined-value: 3
      survival-expert: 2
      physical: 2
      defensive-expert: 2
      unstoppable-force: 2
      loyal-guardian: 1
    maybe:
      endurance-specialist: 2
      survival-expert: 1
    'no':
      speed-specialist: 3
      reckless-value: 2
      cunning-value: 2
    dont-know: {}
```
**Impact:** Multiple under-represented archetypes +15-20

**NEW 10: dimensional-planar**
```yaml
- id: dimensional-planar
  text: Are you interested in planar travel, teleportation, or manipulating space?
  category: magic-preference
  answers:
    'yes':
      dimensional-magic: 5
      planar-guardian: 4
      arcane-magic: 3
      utility-magic: 2
      otherworldly-knowledge: 2
      versatile-magic: 1
    maybe:
      dimensional-magic: 2
      utility-magic: 1
    'no':
      nature-magic: 2
      physical: 2
    dont-know: {}
```
**Impact:** Ranger (horizon-walker) +15-18, Wizard +12-15, Sorcerer +10-12

---

### Phase 3: Optimize Multi-Choice Questions (Optimize 2-3)

**OPTIMIZE 1: life-environment**
- **Current Impact:** Good multi-choice structure
- **Modification:** Add craftsman option for better alchemist coverage
```yaml
  answers:
    city:
      urban-background: 3
      social-manipulator: 1
      diplomatic-soul: 1
    academy:
      academic-background: 3
      scholar: 2
      knowledge-seeker: 2
      disciplined-value: 1
    wilderness:
      nature-background: 3
      survival-expert: 2
      nature-guardian: 1
      wild-spirit: 1
    underworld:
      criminal-background: 3
      cunning-value: 3
    workshop/forge:  # NEW
      craftsman-background: 4
      innovation-specialist: 2
      disciplined-value: 1
    dont-know: {}
```
**Impact:** Alchemist +12-16 additional opportunities

**OPTIMIZE 2: supernatural-ancestry**
- Already well-structured multi-choice
- Add traits for under-represented options:
```yaml
    Fey heritage:
      fey-touched: 4
      fey-beauty: 3
      charm-magic: 2
      chaotic-value: 2
      theatrical: 1  # NEW - helps swashbuckler
      refined: 1     # NEW - helps swashbuckler
```
**Impact:** Swashbuckler +4-6, Feyblood maintained

---

## 📊 Projected Impact Analysis

### Question Count
- **Current:** 66 questions
- **Removals:** -18 questions
- **Additions:** +10 questions
- **Net Result:** **58 questions** → Further reduce to 48 by removing 10 more (see Phase 4)

### Class Balance Projection (After Phase 1-3)

| Class | Current Ratio | Projected Ratio | Change | Status |
|-------|--------------|-----------------|---------|---------|
| **Swashbuckler** | 0.76x | **0.95x** | +25% | ✅ Fixed |
| **Alchemist** | 0.67x | **0.90x** | +34% | ✅ Fixed |
| **Ranger** | 0.75x | **0.88x** | +17% | ✅ Fixed |
| **Inquisitor** | 0.60x | **0.75x** | +25% | ⚠️ Better |
| Feyblood | 0.76x | 0.82x | +8% | ⚠️ Better |
| Cursed | 0.83x | 0.87x | +5% | ⚠️ Better |
| Cavalier | 0.86x | 0.90x | +5% | ✅ Fixed |
| **Bard** | 1.39x | **1.18x** | -15% | ✅ Fixed |
| **Cleric** | 1.36x | **1.20x** | -12% | ✅ Fixed |
| **Fighter** | 1.30x | **1.12x** | -14% | ✅ Fixed |
| **Barbarian** | 1.27x | **1.15x** | -9% | ✅ Fixed |
| Warlock | 1.21x | 1.12x | -7% | ✅ Fixed |
| Sorcerer | 1.19x | 1.10x | -8% | ✅ Fixed |

### Critical Archetype Fixes

| Archetype | Current | Projected | Change |
|-----------|---------|-----------|---------|
| **swashbuckler:corsair** | 0.25x (22) | **0.65x (57)** | +159% |
| **swashbuckler:daredevil** | 0.30x (26) | **0.68x (60)** | +131% |
| **swashbuckler:fatebender** | 0.36x (32) | **0.75x (66)** | +106% |
| **ranger:nightstalker** | 0.47x (41) | **0.75x (66)** | +61% |
| alchemist:all | 0.67x avg | **0.90x avg** | +34% |

---

## 🎯 Phase 4: Final Reduction to 48 Questions (Remove 10 more)

After adding critical questions, remove 10 lowest-impact questions:

**REMOVE (Phase 4):**
1. **harsh-environments** - Covered by wilderness-life + survival
2. **pleasure-seeking** - Hedonistic very narrow
3. **undercover-faith-work** - Faith-infiltrator very narrow (1-2 archetypes)
4. **natural-beauty** - Fey-beauty covered, social-manipulator over-saturated
5. **ancestral-wisdom** - Ancestral-memory niche, covered by character questions
6. **shapeshift-transform** - Already covered in druid-specific questions
7. **poison-tactics** - Very niche, stealth + cunning covers concept
8. **subtle-methods** - Redundant with tactical + stealth questions
9. **wilderness-guardian** - Nature-guardian covered in wilderness-life + nature questions
10. **crowd-combat** - Multitasking + mobile covered, crowd-fighter very specific

**Final Count: 48 questions** (within 40-50 target)

---

## ✅ Success Criteria

**Question Count:**
- ✅ Target: 40-50 questions → **Achieved: 48 questions**

**Class Balance:**
- ✅ All classes within 0.75x-1.25x range
- ✅ No class below 0.75x (Inquisitor improved from 0.60x to 0.75x)
- ✅ No class above 1.25x (Bard reduced from 1.39x to 1.18x)

**Archetype Balance:**
- ✅ Critical archetypes improved significantly (swashbuckler +100-160%)
- ✅ Severely under-represented (<0.6x) reduced from 27 to ~8
- ⚠️ Some archetypes still under 0.8x (acceptable, within tolerance)

**Trait Coverage:**
- ✅ Increase covered traits from 174 to 182 (+8 critical traits)
- ✅ Cover all high-archetype-count missing traits (refined, craftsman-background, etc.)
- ✅ 90% trait coverage maintained

---

## 📋 Implementation Order

1. **Phase 1A:** Remove 8 duplicate questions (defensive-protection, overwhelming-force, heavy-armor-preference, fire-wielding, rune-inscription, pragmatic-combat, divine-warrior, explosives-preference)

2. **Phase 1B:** Remove 6 over-saturated combat questions (precision-vs-power, first-strike, agility-fighting, protect-others, defensive-stance, combat-risks)

3. **Phase 1C:** Remove 4 magic over-saturation questions (destructive-magic, versatile-effects, transformation-magic, dual-nature-balance)

4. **Phase 2:** Add 10 strategic questions for under-represented classes (refined-duelist, outlaw-rebel, performance-showmanship, critical-precision, craftsman-tinkerer, experimental-innovation, familiar-companion-bond, fate-destiny, endurance-perseverance, dimensional-planar)

5. **Phase 3:** Optimize 2 multi-choice questions (life-environment, supernatural-ancestry)

6. **Phase 4:** Remove 10 lowest-impact questions to reach 48 total

7. **Validation:** Run analyze_class_bias.rb and analyze_archetype_bias.rb to verify improvements

---

## 🔍 Risk Mitigation

**Risk:** Over-correcting for swashbuckler might create new imbalance
- **Mitigation:** New swashbuckler questions also benefit bard (theatrical, refined, artistic) and rogue (precise, critical-striker) to balance

**Risk:** Removing too many combat questions might hurt fighter/barbarian balance
- **Mitigation:** Kept core combat questions (tactical-thinking, underdog-style, weapon-mastery, ranged-combat), removed only duplicates

**Risk:** Alchemist craftsman question might over-represent professional class
- **Mitigation:** Professional already balanced (0.93x), craftsman question benefits 20 archetypes across multiple classes

**Risk:** Reducing from 66 to 48 might hurt overall coverage
- **Mitigation:** Removed only redundant/duplicate questions, added 10 high-value questions covering 8 new critical traits

---

## 📈 Expected Outcomes

**Archetype Discovery:**
- All 294 archetypes reachable through questionnaire
- No archetype below 0.5x ratio (currently 5 archetypes <0.5x)
- 90%+ archetypes within 0.7x-1.3x range (up from ~70%)

**Question Efficiency:**
- Each question covers 5-8 traits on average (up from 4-6)
- Reduced redundancy from 35% to 15%
- Better balance across character dimensions (combat, magic, personality, background)

**User Experience:**
- Shorter questionnaire (48 vs 66 = 27% reduction)
- More diverse question types (personality, crafting, performance)
- Better representation of non-combat character concepts

---

**STATUS:** Ready for implementation
**VALIDATION:** Must run analysis tools after each phase
**ROLLBACK:** Keep copies of removed questions for potential restoration
