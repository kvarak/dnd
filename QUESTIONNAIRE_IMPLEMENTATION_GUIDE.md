# Questionnaire Improvement - Implementation Guide

This document provides **specific, actionable changes** to implement the fairness improvements.

---

## Quick Wins (Do These First)

### 1. Remove Empty/Inefficient Questions (10 questions)

These questions should be removed or completely redesigned:

```yaml
# REMOVE - No trait scoring
- character-backstory
- moral-dilemmas

# REMOVE or REDESIGN - Very low efficiency (<40 archetypes)
- dodge-attacks           # 29 archetypes
- social-interaction      # 29 archetypes
- noble-upbringing        # 30 archetypes
- speed-focus             # 32 archetypes
- parkour-acrobatics      # 33 archetypes
- street-smarts           # 39 archetypes
```

**Action:** Delete these questions from `_data/question-bank.yml`

**Impact:** 135 → 127 questions, removes 0-impact questions

---

### 2. Add Critical Missing Questions (5 questions)

Add these to fill critical trait gaps:

#### New Question 1: Divine Power Source
```yaml
- id: divine-power-source
  text: "Do you want power from gods, faith, or divine forces?"
  category: magic-source
  answers:
    "yes":
      divine-magic: +4
      divine-student: +4
      divine-healer: +3
      holy-power: +3
      divine-warrior: +3
      religious-value: +2
      otherworldly-knowledge: +2
      lawful-value: +1
      protective-value: +2
      healing-magic: +2
      # Oppositions
      arcane-magic: -3
      innate-power: -2
      chaos-magic: -2
    "maybe":
      divine-magic: +1
      otherworldly-knowledge: +1
      versatile-magic: +2
      religious-value: +1
    "no":
      divine-magic: -3
      arcane-magic: +3
      innate-power: +2
      raw-talent: +2
      chaotic-value: +1
      scholarly-background: +2
```

#### New Question 2: Scrappy Fighter
```yaml
- id: underdog-style
  text: "Do you like fighting smart when outmatched, turning weaknesses into strengths?"
  category: combat-style
  answers:
    "yes":
      underdog-fighter: +4
      instinctive-combatant: +4
      unpredictable-power: +3
      opportunistic-value: +3
      adaptive: +3
      cunning-value: +2
      improvised-specialist: +2
      dirty-tactics: +2
      risk-taker: +2
      # Oppositions
      disciplined-value: -2
      lawful-value: -1
      honorable: -2
    "maybe":
      adaptable-fighter: +2
      tactical-value: +1
      cunning-value: +1
      versatile-magic: +1
    "no":
      underdog-fighter: -2
      disciplined-value: +3
      tactical-value: +3
      lawful-value: +2
      honorable: +2
      military-background: +2
```

#### New Question 3: Otherworldly Knowledge
```yaml
- id: forbidden-knowledge
  text: "Are you drawn to mysterious, otherworldly, or forbidden knowledge?"
  category: knowledge-type
  answers:
    "yes":
      otherworldly-knowledge: +4
      knowledge-seeker: +3
      scholar: +2
      ancient-knowledge: +3
      ancient-lore: +2
      aberrant-influence: +2
      demonic-corruption: +1
      shadow-magic: +2
      arcane-magic: +2
      intellectual-combatant: +2
      # Oppositions
      intuitive-value: -2
      instinctive-combatant: -2
      raw-talent: -1
    "maybe":
      knowledge-seeker: +2
      scholar: +1
      arcane-magic: +1
      versatile-magic: +1
    "no":
      otherworldly-knowledge: -2
      intuitive-value: +3
      instinctive-combatant: +2
      raw-talent: +2
      physical: +2
      simple-approach: +2
```

#### New Question 4: Wild Magic/Unpredictable Power
```yaml
- id: unpredictable-power
  text: "Do wild, unpredictable, or uncontrolled magical power appeal to you?"
  category: magic-preference
  answers:
    "yes":
      unpredictable-power: +4
      wild-surges: +4
      chaos-magic: +3
      entropy-conduit: +3
      raw-talent: +3
      chaotic-value: +3
      reckless-value: +2
      innate-power: +2
      # Oppositions
      disciplined-value: -3
      patient-value: -3
      scholar: -2
      tactical-value: -2
    "maybe":
      versatile-magic: +2
      innate-power: +1
      adaptive: +1
    "no":
      unpredictable-power: -2
      disciplined-value: +3
      patient-value: +3
      scholar: +3
      tactical-value: +2
      arcane-magic: +2
```

#### New Question 5: Shape/Form Mastery
```yaml
- id: transformation-power
  text: "Do you want to change your physical form or shape?"
  category: special-ability
  answers:
    "yes":
      shapeshifter: +4
      shape-mastery: +4
      dual-nature: +3
      instinctive-combatant: +2
      beast-friend: +2
      adaptable-fighter: +3
      versatile-magic: +2
      physical-alteration: +3
      nature-magic: +2
      # Oppositions
      weapon-specialist: -2
      heavy-armor: -2
    "maybe":
      adaptable-fighter: +2
      versatile-magic: +2
      dual-nature: +1
    "no":
      shapeshifter: -3
      weapon-specialist: +2
      heavy-armor: +2
      disciplined-value: +2
      tactical-value: +1
```

**Action:** Add these 5 questions to `_data/question-bank.yml`

**Impact:** 127 → 132 questions, adds coverage for 6 critical traits

---

### 3. Reduce Background Over-Representation (Consolidate 26 → 8 questions)

**Current Problem:**
- `urban-background`: 26 questions → only 3 archetypes use it
- `scholarly-background`: 26 questions → only 8 archetypes use it
- `criminal-background`: 23 questions → only 6 archetypes use it

**Solution:** Consolidate into broader background questions

#### Keep These 8 Background Questions:
1. `social-interaction` - Covers urban/noble
2. `military-background` - Covers military
3. `harsh-survival` - Covers rural/wilderness
4. `ancient-lore` - Covers scholarly
5. `street-smarts` - Covers criminal/urban
6. `crafting-engineering` - Covers artisan
7. `animal-bond` - Covers rural/nature
8. One new consolidated question (below)

#### New Consolidated Background Question:
```yaml
- id: life-environment
  text: "What environment did you grow up in?"
  category: background
  answers:
    "city":
      urban-background: +3
      streetwise: +2
      social-manipulator: +1
      diplomatic-soul: +1
    "academy":
      scholarly-background: +3
      scholar: +2
      knowledge-seeker: +2
      disciplined-value: +1
    "wilderness":
      rural-background: +3
      survival-expert: +2
      nature-guardian: +1
      wild-spirit: +1
    "underworld":
      criminal-background: +3
      streetwise: +2
      cunning-value: +2
      opportunistic-value: +1
    dont-know: {}
```

#### Remove These Background Questions:
- All questions that only score urban/scholarly/criminal/noble backgrounds
- Keep questions where backgrounds are secondary scores to other traits

**Action:**
1. Search `_data/question-bank.yml` for questions scoring urban-background, scholarly-background, criminal-background
2. Keep only those that also score 4+ other important traits
3. Remove pure background questions
4. Add the consolidated question above

**Impact:** ~18 questions removed, replaced with 1 multi-choice question

---

## Medium-Complexity Changes

### 4. Enhance Existing High-Efficiency Questions

These questions already affect many archetypes - make them affect MORE traits:

#### Example: Enhance "magic-interest"
**Current (affects 9 traits, 225 archetypes):**
```yaml
- id: magic-interest
  text: "Are you interested in using magic?"
  answers:
    "yes":
      versatile-magic: +4
      arcane-magic: +3
      utility-magic: +1
      damage-magic: +1
      healing-magic: +1
      control-magic: +1
      physical: -4
    "maybe":
      utility-magic: +2
      versatile-magic: +1
      physical: -1
    "no":
      physical: +4
      magic-hunter: +3
      spell-disruptor: +3
      versatile-magic: -3
      damage-magic: -2
      healing-magic: -2
      utility-magic: -2
```

**Enhanced (affects 15+ traits, 250+ archetypes):**
```yaml
- id: magic-interest
  text: "Are you interested in using magic?"
  answers:
    "yes":
      versatile-magic: +4
      arcane-magic: +3
      utility-magic: +1
      damage-magic: +1
      healing-magic: +1
      control-magic: +1
      physical: -4
      # ADD THESE:
      knowledge-seeker: +2         # Magic requires study
      scholar: +2                  # Academic pursuit
      intellectual-combatant: +2   # Thinking fighter
      otherworldly-knowledge: +1   # Arcane mysteries
      patient-value: +1            # Magic requires patience
      disciplined-value: +1        # Magic requires discipline
      # Oppositions:
      raw-talent: -2               # Magic vs natural ability
      instinctive-combatant: -2    # Magic vs instinct
      athletic-prowess: -1         # Magic vs athletics
    "maybe":
      utility-magic: +2
      versatile-magic: +1
      physical: -1
      adaptable-fighter: +1        # ADD: Flexible approach
      cunning-value: +1            # ADD: Strategic magic use
    "no":
      physical: +4
      magic-hunter: +3
      spell-disruptor: +3
      versatile-magic: -3
      damage-magic: -2
      healing-magic: -2
      utility-magic: -2
      # ADD THESE:
      raw-talent: +3               # Natural talent instead
      athletic-prowess: +3         # Physical prowess
      instinctive-combatant: +2    # Instinctive fighting
      weapon-specialist: +2        # Weapon focus
      martial: +2                  # Martial arts
```

**Repeat this pattern for:**
- `divine-ritual` (currently 9 traits → target 15 traits)
- `religious-devotion` (currently 14 traits → target 18 traits)
- `elemental-power` (currently 8 traits → target 14 traits)
- `destructive-magic` (currently 6 traits → target 12 traits)
- `healing-magic` (currently 12 traits → target 16 traits)

**Impact:** Top 10 efficient questions now affect 15-20 traits each

---

### 5. Redesign Low-Efficiency Questions

These questions affect too few archetypes - redesign or remove:

#### Example: Redesign "dodge-attacks" (currently 29 archetypes)

**Current:**
```yaml
- id: dodge-attacks
  text: "Do you prefer dodging attacks rather than blocking them?"
  answers:
    "yes":
      evasive: +4
      mobile-combatant: +3
      agile-fighter: +2
      acrobatic: +2
      speed-specialist: +1
      heavy-armor: -2
      shield-specialist: -2
      defensive-expert: -2
    # ... etc
```

**Redesigned (now affects 80+ archetypes):**
```yaml
- id: defense-style
  text: "How do you prefer to avoid harm in combat?"
  category: combat-style
  answers:
    "dodge":
      evasive: +4
      mobile-combatant: +3
      agile-fighter: +3
      acrobatic: +3
      speed-specialist: +2
      dexterity-focus: +2
      light-armor: +2
      # Oppositions:
      heavy-armor: -3
      shield-specialist: -3
      defensive-expert: -2
      strength-specialist: -2
      # Personality correlations:
      chaotic-value: +1
      risk-taker: +1
      reckless-value: +1
      # Background implications:
      agile-warrior: +2
      mobile: +2
    "block":
      shield-specialist: +4
      defensive-expert: +3
      heavy-armor: +3
      strength-specialist: +2
      protective-value: +2
      # Oppositions:
      evasive: -3
      mobile-combatant: -2
      acrobatic: -2
      # Personality correlations:
      lawful-value: +2
      disciplined-value: +2
      patient-value: +1
      # Combat style:
      tactical-value: +1
    "avoid":
      stealth-master: +4
      cunning-value: +3
      tactical-value: +3
      patient-value: +2
      opportunistic-value: +2
      # Combat avoidance:
      ranged-expert: +2
      sniper: +2
      control-magic: +2
      # Oppositions:
      aggressive-value: -3
      reckless-value: -2
      honorable: -1
    dont-know:
      versatile-magic: +1
      adaptable-fighter: +1
```

**Impact:** Question now differentiates 3 distinct defensive philosophies affecting 80+ archetypes

---

## Advanced Changes (Future Implementation)

### 6. Trait Consolidation Plan

Merge similar traits to reduce from 221 → ~120:

#### Background Merges:
```
MERGE: urban-background + city-dweller → urban-life
MERGE: scholarly-background + academic-pursuit + magic-student → academic-background
MERGE: criminal-background + streetwise + outlaw → underworld-ties
MERGE: rural-background + tribal-background + wilderness-roots → nature-background
MERGE: military-background + soldier + guard → martial-training
MERGE: artisan-background + craftsman-warrior → crafts-expertise
MERGE: noble-background + noble-heritage + high-society → aristocratic-background
```

#### Combat Style Merges:
```
MERGE: tactical-value + intellectual-combatant + analytical-fighter → strategic-mind
MERGE: reckless-value + aggressive-value + risk-taker → bold-fighter
MERGE: disciplined-value + patient-value + methodical → controlled-approach
MERGE: opportunistic-value + cunning-value → clever-tactics
MERGE: adaptable-fighter + versatile-fighter → flexible-combat
```

#### Magic Merges:
```
MERGE: arcane-magic + arcane-study + magic-student → arcane-practitioner
MERGE: divine-magic + divine-student + divine-channel → divine-conduit
MERGE: innate-power + raw-talent + natural-magic → inborn-magic
MERGE: scholarly-magic + ritual-caster + studied-caster → learned-magic
```

#### Specialist Merges:
```
MERGE: archery-specialist + bow-master + longbow-expert → bow-expertise
MERGE: crossbow-specialist + crossbow-master → crossbow-expertise
MERGE: unarmed-combat + martial-artist + monk-training → unarmed-master
MERGE: poison-expert + poison-master + toxin-specialist → toxin-expertise
```

**Implementation:**
1. Update all archetype profiles to use merged trait names
2. Update all questions to score merged traits
3. Update questionnaire.html scoring logic
4. Test thoroughly

---

### 7. Complete Rebuild (40-50 Questions)

If doing a complete rebuild, organize questions into these categories:

#### Category 1: Magic Affinity (10 questions)
1. Magic interest (yes/no)
2. Magic source (divine/arcane/innate/none)
3. Magic type (damage/healing/utility/control/versatile)
4. Spellcasting style (studied/natural/ritual)
5. Elemental affinity
6. Transformation magic
7. Illusion/charm magic
8. Necromancy/death magic
9. Wild/unpredictable magic
10. Anti-magic preference

#### Category 2: Combat Style (10 questions)
1. Physical vs magical combat
2. Range preference (melee/ranged/mixed)
3. Defense style (dodge/block/avoid)
4. Weapon preference (finesse/heavy/ranged/unarmed)
5. Combat approach (tactical/reckless/patient)
6. Fighting dirty vs honorable
7. Solo vs team fighter
8. Ambush vs head-on
9. Armor preference
10. Underdog vs overpowering

#### Category 3: Background & Origin (6 questions)
1. Environment (city/wilderness/academy/underworld)
2. Social class (noble/common/outlaw)
3. Military training (yes/no/experienced)
4. Education level (academic/practical/none)
5. Cultural background (traditional/modern/mixed)
6. Travel experience (local/wanderer/explorer)

#### Category 4: Personality & Values (10 questions)
1. Law vs chaos
2. Protection vs self-interest
3. Cunning vs straightforward
4. Patient vs impulsive
5. Proud vs humble
6. Religious devotion
7. Knowledge seeking
8. Leadership vs following
9. Social manipulation vs honest
10. Risk tolerance

#### Category 5: Special Abilities (4-6 questions)
1. Shapeshifting/transformation
2. Animal companion/familiar
3. Otherworldly knowledge
4. Innate abilities
5. Stealth mastery
6. Healing specialty

**Each question should:**
- Affect 10-15 traits
- Have clear yes/maybe/no options
- Include positive AND negative scores
- Connect personality to mechanics
- Avoid pure background questions

---

## Testing & Validation

After implementing changes:

1. **Run analysis tools:**
   ```bash
   ruby tools/comprehensive-fairness-analysis.rb
   ```

2. **Check for:**
   - Traits with <2 questions (add coverage)
   - Traits with >15 questions (reduce coverage)
   - Questions affecting <60 archetypes (redesign or remove)
   - Critical imbalances (should be <5)

3. **Manual testing:**
   - Test with different playstyles
   - Verify divine casters get recommended
   - Verify rogues don't dominate
   - Check that rare archetypes can be discovered

---

## Summary of Changes

### Phase 1: Quick Wins
- Remove: 10 questions
- Add: 5 questions
- Consolidate: 20 questions → 5 questions
- **Result:** 135 → ~110 questions
- **Time:** 2-4 hours
- **Impact:** 30% improvement in fairness

### Phase 2: Medium Changes
- Enhance: 10 top questions (add 5-8 traits each)
- Redesign: 15 low-efficiency questions
- **Result:** ~110 → ~100 questions
- **Time:** 8-12 hours
- **Impact:** 60% improvement in fairness

### Phase 3: Complete Overhaul
- Merge: 100 traits
- Rebuild: Entire question bank
- **Result:** ~45 questions, ~120 traits
- **Time:** 40-60 hours
- **Impact:** 95% improvement in fairness

**Recommended Approach:** Start with Phase 1, test, then decide if Phase 2/3 are needed.
