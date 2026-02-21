ruby # Question Bank Consolidation Plan

**Purpose:** Reduce question bank from 114 questions to 50-60 questions while maintaining fair archetype discovery rates across all 294 archetypes.

**Current State:** 114 questions, 294 archetypes, 202/203 traits covered
**Target State:** 50-60 questions, 294 archetypes, maintain 95%+ trait coverage
**Approach:** Merge duplicates, consolidate overlaps, use multi-choice format where appropriate

---

## 📊 Current Category Distribution

**Overly Represented Categories:**
- combat-style: **18 questions** (too many!)
- combat-approach: **12 questions** (too many!)
- magic-preference: **9 questions** (moderate)
- character-motivation: **8 questions**
- power-source: **7 questions**

**Analysis:** 30 combat questions (26% of total) creates redundancy. Many test the same concepts (ranged vs melee, aggressive vs defensive, tactical vs instinctive).

---

## 🎯 Consolidation Strategy

### Phase 1: Eliminate Direct Duplicates (Remove 20 questions)

**DUPLICATE PAIRS - Remove Second Question:**

1. **group-tactics + teamwork-tactics** → KEEP: teamwork-tactics (better wording)
   - Both ask about coordinated fighting with allies
   - Trait overlap: 90% identical (swarm-tactics, tactical-value, inspirational-leader)
   - **REMOVE: group-tactics**

2. **animal-kinship + animal-bond** → KEEP: animal-bond (more specific)
   - Both test deep animal connection
   - Trait overlap: beast-friend, nature-guardian, protective-value
   - **REMOVE: animal-kinship**

3. **agility-fighting + mobile-fighting** → KEEP: agility-fighting (broader)
   - Both test mobility/agility preference
   - Trait overlap: agile-warrior, mobile-combatant, acrobatic
   - **REMOVE: mobile-fighting**

4. **shield-defense + defensive-stance** → KEEP: defensive-stance (broader defensive concept)
   - Both test defensive approach
   - Trait overlap: defensive-expert, shield-specialist, tactical-value
   - **REMOVE: shield-defense**

5. **overwhelming-force + fearless-charge** → KEEP: overwhelming-force (clearer)
   - Both test aggressive melee preference
   - Trait overlap: strength-specialist, reckless-value, unstoppable-force
   - **REMOVE: fearless-charge**

6. **ranged-combat + archery-preference** → KEEP: ranged-combat (covers all ranged, not just bows)
   - archery-preference is too specific (bows only)
   - **REMOVE: archery-preference**

7. **religious-devotion + divine-ritual** → KEEP: religious-devotion (core faith question)
   - Both test religious faith and divine magic
   - divine-ritual is more mechanical, religious-devotion is philosophical
   - **REMOVE: divine-ritual**

8. **ancient-lore + forbidden-knowledge** → KEEP: forbidden-knowledge (more evocative)
   - Both test mystical/arcane knowledge seeking
   - Trait overlap: ancient-knowledge, scholar, otherworldly-knowledge
   - **REMOVE: ancient-lore**

9. **fighting-outnumbered + crowd-combat** → KEEP: crowd-combat (more specific tactics)
   - Both test comfort with multiple opponents
   - crowd-combat has better trait distribution
   - **REMOVE: fighting-outnumbered**

10. **extreme-mobility + flashy-combat** → KEEP: extreme-mobility (more functional)
    - flashy-combat is about style, extreme-mobility is about capability
    - Both reward acrobatic/mobile traits
    - **REMOVE: flashy-combat**

**CHAOS TRIO - Merge into One:**

11-13. **chaos-unpredictability + chaotic-magic + unpredictable-power** → MERGE into one "Chaos & Unpredictability" question
    - All three test chaos/wild magic preference
    - Combined traits: chaotic-value, wild-surges, chaos-magic, unpredictable-power, entropy-conduit
    - **REMOVE: chaos-unpredictability, chaotic-magic, unpredictable-power**
    - **CREATE NEW:** chaos-acceptance (multi-choice covering all aspects)

### 1. **chaos-acceptance**
**Text:** "How do you feel about chaos, unpredictability, and wild magic?"
**Answers:**
- "Embrace it fully" → chaos-magic +4, wild-surges +4, chaotic-value +4, unpredictable-power +4
- "Controlled chaos" → chaos-magic +2, versatile-magic +2
- "Tolerate when necessary" → adaptive +2, adaptable-fighter +2
- "Avoid chaos" → disciplined-value +4, tactical-value +3, scholar +2


**HERITAGE TRIO - Merge into One:**

14-16. **bloodline-heritage + celestial-heritage + aquatic-heritage** → MERGE into "Supernatural Ancestry"
    - All test magical bloodlines
    - **REMOVE: bloodline-heritage, celestial-heritage, aquatic-heritage**
    - **CREATE NEW:** supernatural-ancestry (multi-choice: draconic, celestial, aquatic, fiendish, fey, none)

### 2. **supernatural-ancestry**
**Text:** "What type of supernatural ancestry interests you?"
**Answers:**
- "Draconic bloodline" → draconic-heritage +4, innate-magic +3, elemental-affinity +2, proud-value +2
- "Celestial/Angelic" → celestial-heritage +4, divine-warrior +3, holy-power +3, lawful-value +2
- "Aquatic/Sea-born" → aquatic-heritage +4, seafaring +3, elemental-affinity +3, storm-caller +2
- "Fiendish/Demonic" → demonic-corruption +4, cunning-value +3, chaotic-value +2
- "Fey heritage" → fey-touched +4, fey-beauty +3, charm-magic +2, chaotic-value +2
- "No supernatural ancestry" → nature-background +2, military-background +2, urban-background +2


**PRECISION QUESTIONS - Merge:**

17-18. **precision-vs-power + critical-precision** → MERGE into precision-vs-power (broader)
    - Both test precision preference
    - critical-precision is too narrow
    - **REMOVE: critical-precision**

**SUBTLE TACTICS - Merge:**

19-20. **subtle-methods + patience-planning** → MERGE into subtle-methods (covers both)
    - patience-planning is subset of subtle-methods
    - **REMOVE: patience-planning**

**Total Removed in Phase 1: 20 questions** (114 → 94)

---

### Phase 2: Consolidate Overlapping Questions (Remove 25 questions)

**RANGED WEAPON SPECIALIZATIONS - Consolidate:**

21-23. **sling-expertise + throwing-weapons + precision-sniping** → MERGE into ranged-combat
    - Too specific, only benefit small archetype sets
    - Ranged-combat can absorb these traits
    - **REMOVE: sling-expertise, throwing-weapons, precision-sniping**

**IMPROVISED WEAPONS:**

24-25. **improvised-weapons + unarmed-brawling** → MERGE into "Unconventional Combat"
    - Both test non-standard weapons
    - **CREATE NEW:** unconventional-combat (improvised weapons, unarmed, exotic weapons)
    - **REMOVE: improvised-weapons, unarmed-brawling, exotic-weapons-interest**

### 6. **unconventional-combat**
**Text:** "What unconventional combat style appeals to you?"
**Answers:**
- "Improvised weapons" → improvised-specialist +4, adaptable-fighter +3, pragmatic-fighter +2
- "Unarmed fighting" → unarmed-combat +4, physical +3, reckless-value +2
- "Exotic weapons (whips, nets, chains)" → exotic-weapons +4, tactical-value +3, control-magic +2
- "Traditional weapons" → weapon-specialist +3, disciplined-value +2


**NATURE/DRUID QUESTIONS - Consolidate:**

26-29. **wilderness-guardian + plant-communion + terrain-attunement + decay-renewal** → MERGE into 2 questions
    - wilderness-guardian is broad nature protection
    - Others are very specific druid archetypes
    - **KEEP:** wilderness-guardian (nature protection)
    - **CREATE NEW:** nature-specialization (multi-choice: plants, terrain, animals, storms, decay)
    - **REMOVE: plant-communion, terrain-attunement, decay-renewal**

### 5. **nature-specialization**
**Text:** "If drawn to nature magic, what aspect appeals most?"
**Answers:**
- "Plants & growth" → plant-mastery +4, nature-guardian +3, healing-magic +2
- "Land & terrain" → terrain-bond +4, nature-guardian +3, survival-expert +2
- "Animals & beasts" → beast-friend +4, nature-guardian +3, wild-spirit +2
- "Storms & weather" → storm-caller +4, nature-magic +3, damage-magic +2
- "Decay & renewal" → decay-mastery +4, nature-magic +3, death-speaker +2, necromancy-dabbler +2
- "Not nature-focused" → arcane-magic +2, urban-background +2


**DIVINE/HOLY QUESTIONS - Consolidate:**

30-32. **divine-warrior + holy-power + fearless-in-combat** → MERGE into divine-warrior
    - divine-warrior covers holy power concept
    - fearless-in-combat overlaps with other courage questions
    - **REMOVE: holy-power, fearless-in-combat**

**INVESTIGATION/HUNTING - Consolidate:**

33-35. **hunt-dangerous-creatures + hunt-undead-spirits + undercover-faith-work** → MERGE into "Specialized Hunter"
    - All test hunting specific creature types
    - **CREATE NEW:** hunter-specialization (multi-choice: demons, undead, fey, general monsters, none)
    - **REMOVE: hunt-dangerous-creatures, hunt-undead-spirits**
    - **KEEP modified:** undercover-faith-work (unique infiltrator concept)

### 3. **hunter-specialization**
**Text:** "If you hunt dangerous creatures, what type interests you most?"
**Answers:**
- "Demons & devils" → demon-hunter +4, holy-power +3, divine-warrior +3
- "Undead & spirits" → undead-hunter +4, ghost-tracker +4, spirit-medium +3, death-magic +2
- "Fey creatures" → fey-hunter +4, enchantment-resistance +3
- "All monsters" → monster-hunter +4, relentless-hunter +3, survival-expert +2
- "Not a hunter" → academic-background +2, social-manipulator +2


**KNOWLEDGE/WISDOM QUESTIONS - Consolidate:**

36-38. **read-opponents + divination-future + illuminate-truth** → MERGE into "Insight & Foresight"
    - All test knowledge/wisdom seeking
    - **CREATE NEW:** insight-foresight (multi-choice: predict actions, see future, reveal truth, none)
    - **REMOVE: read-opponents, divination-future, illuminate-truth**

### 4. **insight-foresight**
**Text:** "How do you prefer to gain insight and foresight?"
**Answers:**
- "Read opponents' intentions" → mind-reader +4, tactical-value +3, wisdom-seeker +2
- "Divine the future" → divination-magic +4, scholar +3, ritual-caster +2
- "Reveal hidden truths" → truth-seeker +4, illuminating-light +3, knowledge-seeker +2
- "Instinct over analysis" → intuitive-value +3, instinctive-combatant +2


**SPECIALIST QUESTIONS - Too Narrow:**

39-45. **Remove overly specific questions that benefit <10 archetypes:**
    - symbiotic-relationship (ooze-symbiosis only)
    - shadow-possession (shadow-binding only)
    - abnormal-entities (aberrant-influence only)
    - fiendish-power (demonic-corruption only)
    - chaos-conduit (entropy-conduit only)
    - resist-enchantments (enchantment-resistance only)
    - luck-manipulation (probability-manipulation only)

**Rationale:** These benefit 1-3 archetypes each, violating efficiency principle. Traits can be scored implicitly from broader questions.

**SOCIAL/MANIPULATION:**

46-47. **deception-disguise + secret-identity** → MERGE into deception-disguise (broader)
    - secret-identity is subset of deception
    - **REMOVE: secret-identity**

**CRAFTING/TECHNICAL:**

48-49. **crafting-engineering + sophisticated-approach** → MERGE into sophisticated-approach (broader)
    - crafting-engineering is too narrow
    - **REMOVE: crafting-engineering**

**Total Removed in Phase 2: 25 questions** (94 → 69)

---

### Phase 3: Strategic Consolidation to Reach Target (Remove 9-19 questions)

**COMBAT SPECIALIZATIONS - Further Reduce:**

50-52. **weapon-disarm + area-effect-preference + crowd-combat** → KEEP only crowd-combat
    - weapon-disarm is too specific
    - area-effect-preference overlaps with explosives/magic questions
    - **REMOVE: weapon-disarm, area-effect-preference**

**POWER SOURCE QUESTIONS:**

53-54. **innate-abilities + divine-power-source** → KEEP both (fundamental magic sources)
    - But merge divine-power-source with religious-devotion
    - **REMOVE: divine-power-source** (absorbed by religious-devotion)

**MOBILITY/AGILITY:**

55. **small-stature-advantage** → Too specific for halfling/gnome only
    - **REMOVE: small-stature-advantage**

**ALCHEMICAL CHAIN:**

56-58. **explosives-preference + dangerous-substances + poison-tactics** → Consolidate to 2
    - **KEEP:** poison-tactics (stealth poison use)
    - **MERGE:** explosives-preference + dangerous-substances → "Alchemical Combat"
    - **REMOVE: dangerous-substances**

**TRANSFORMATION:**

59-60. **transformation-magic + transformation-power + shapeshift-transform** → MERGE to 2
    - transformation-magic (change things)
    - **MERGE:** transformation-power + shapeshift-transform → "Personal Transformation"
    - **REMOVE: transformation-power**

**PLAYSTYLE QUESTIONS:**

61. **tactical-flexibility** → Overlaps with dual-nature-balance
    - **REMOVE: tactical-flexibility**

**SPECIALTY MOBILITY:**

62. **planar-travel** → Very specific, benefits few archetypes
    - **REMOVE: planar-travel**

**COMPANION QUESTIONS:**

63. **magical-companion** → Overlaps with animal-bond, summon-familiar narrow
    - **REMOVE: magical-companion**

**SPECIFIC DRUID:**

64. **storm-calling** → Very specific, covered by elemental-power + nature
    - **REMOVE: storm-calling**

**MISC NARROW:**

65. **fey-combatant** → Only for feyblood archetypes
    - **REMOVE: fey-combatant**

**Total Removed in Phase 3: 15 questions** (69 → 54)

---

## 📈 Expected Impact Analysis

### Trait Coverage Preservation
**Current:** 202/203 traits covered (99.5%)
**Expected:** 195/203 traits covered (96.1%)

**Uncovered Traits After Consolidation:**
- alchemical-transformation (already uncovered)
- ooze-symbiosis (removed symbiotic-relationship question)
- shadow-binding (removed shadow-possession question)
- aberrant-influence (removed abnormal-entities question)
- entropy-conduit (removed chaos-conduit question, but chaos-acceptance covers chaotic-value)
- probability-manipulation (removed luck-manipulation question)
- enchantment-resistance (removed resist-enchantments question)

**Mitigation:** These 7 traits benefit only 1-3 archetypes each. They can be scored implicitly through related questions (e.g., aberrant-influence gets points from forbidden-knowledge, shadow-binding from darkness-master + stealth).

### Archetype Balance
**Current Efficiency:** 66-272 archetypes per question
**Expected:** 100-280 archetypes per question (improved!)

**Reasoning:** Removing hyper-specific questions (5-20 archetypes) while keeping broad questions improves average efficiency. Multi-choice questions cover more trait dimensions simultaneously.

### Questions Per Category (Before → After)

| Category | Before | After | Change |
|----------|--------|-------|--------|
| Magic | 9 | 10 | +1 (added chaos-acceptance) |
| Combat Style | 18 | 12 | -6 (consolidated) |
| Combat Approach | 12 | 6 | -6 (merged tactical questions) |
| Origins | 5 | 7 | +2 (added multi-choice) |
| Specialization | 6 | 8 | +2 (better organized) |
| Social/Personality | 8 | 8 | 0 (kept essential) |
| Faith/Divine | 8 | 6 | -2 (merged overlaps) |
| Misc | 48 | 1 | -47 (absorbed into categories) |
| **TOTAL** | **114** | **58** | **-56 (-49%)** |

---

## 🚀 Implementation Strategy

### **Phase 1: Safe Removals (Remove exact duplicates)**
- Remove 10 direct duplicate questions
- **Risk:** Low - these are true duplicates
- **Test:** Verify archetype discovery rates remain stable

### **Phase 2: Consolidate Overlaps**
- Remove 25 overlapping questions
- Replace with 6 new multi-choice questions
- **Risk:** Medium - need to verify trait distribution
- **Test:** Run comprehensive-fairness-analysis.rb after each batch

### **Phase 3: Final Optimization**
- Remove 15-20 hyper-specific questions
- Fine-tune trait assignments in remaining questions
- **Risk:** Medium-high - affects specialized archetypes
- **Test:** Detailed archetype discovery analysis

### **Validation Steps:**
1. Run `ruby analyze_fighter_bias.rb` - ensure no class dominance
2. Run `ruby tools/comprehensive-fairness-analysis.rb` - check efficiency
3. Run `make test` - validate structure
4. Manual testing with 20+ different archetype personas
5. Compare discovery rates: 114-question vs 58-question versions

---

## ⚠️ Risks & Mitigations

### **Risk 1: Specialized Archetypes Become Undiscoverable**
**Archetypes at risk:** Cursed archetypes, feyblood variants, professional archetypes
**Mitigation:**
- Keep at least 1-2 questions that strongly benefit each class
- Use multi-choice options to provide specialization paths
- Implicit scoring from broad questions (e.g., fey-touched gets points from chaos, magic-tricks, natural-beauty)

### **Risk 2: Question Count Too Low for Algorithm**
**Current algorithm:** Expects 10-15 questions to achieve 85% accuracy
**With 58 questions:** Still 4-6x the required set, plenty of selection space
**Mitigation:** Algorithm will converge faster with more focused questions

### **Risk 3: Trait Coverage Drops Below 90%**
**Expected coverage:** 96.1% (195/203)
**Acceptable:** 90%+ (183/203)
**Mitigation:** Add traits to remaining questions or accept implicit scoring

### **Risk 4: User Experience - Fewer Questions Feels Less Personalized**
**Counter-argument:** Quality over quantity - each question now more meaningful
**Benefit:** Faster completion time improves user engagement
**Mitigation:** Add optional "deep dive" questions for users who want more detail

---

## 📊 Success Criteria

### **Must Have:**
- ✅ 50-60 questions (target: 58)
- ✅ 90%+ trait coverage (target: 96%)
- ✅ All classes have 80-120 scoring opportunities (balanced)
- ✅ No archetype has <50% trait coverage
- ✅ All questions affect 80+ archetypes (high efficiency)
- ✅ make test passes

### **Should Have:**
- ✅ 95%+ trait coverage (target: 96%)
- ✅ Average question affects 150+ archetypes
- ✅ Fighter bias remains ≤1.4x
- ✅ Top 10 recommended archetypes include correct choice 85%+ of time

### **Nice to Have:**
- ✅ 98%+ trait coverage
- ✅ User testing shows improved satisfaction
- ✅ Question completion time <5 minutes (down from ~10 minutes)

---

## � Measuring Class Bias - Before & After Framework

### **Understanding Class Bias**

Class bias occurs when the questionnaire gives unfair scoring advantages to certain classes, making them appear more often in recommendations regardless of player preferences. We measure bias across **5 key metrics**:

### **Metric 1: Trait Frequency Ratio**
**What it measures:** How often each class's signature traits appear in questions
**Formula:** `(Questions with Class Trait) / (Total Questions)`

**Example - Fighter Bias (Before Tasks 1-30):**
```ruby
tactical-value: 70/114 questions = 61%
disciplined-value: 66/114 questions = 58%
physical: 59/114 questions = 52%
# Fighter gets scored in 60%+ of questions!

arcane-magic: 16/114 questions = 14%
divine-magic: 10/114 questions = 9%
# Wizards/Clerics only get scored in 10-15% of questions
```

**How to measure:**
```bash
# Count occurrences of class traits
for trait in "tactical-value" "arcane-magic" "divine-magic"; do
  echo "$trait: $(grep -c "$trait:" _data/question-bank.yml) questions"
done
```

**Ideal target:** No class trait should appear in >30% of questions (34 questions max)

---

### **Metric 2: Scoring Opportunity Count**
**What it measures:** Total potential points each class can accumulate
**Formula:** Sum of all positive trait scores across all questions for that class

**Example:**
```
Fighter opportunities:
  tactical-value: +3 in Q1, +4 in Q5, +2 in Q8... = +350 total possible
  disciplined-value: +2 in Q3, +4 in Q7... = +280 total possible
  physical: +3 in Q10, +2 in Q15... = +200 total possible
  TOTAL: ~830 possible points

Wizard opportunities:
  arcane-magic: +3 in Q2, +5 in Q20... = +120 total possible
  scholar: +2 in Q4, +3 in Q15... = +80 total possible
  knowledge-seeker: +2 in Q8... = +60 total possible
  TOTAL: ~260 possible points

Fighter advantage: 830 / 260 = 3.2x bias!
```

**How to measure:**
```ruby
# Run existing bias analysis
ruby analyze_fighter_bias.rb

# Output shows:
# "Fighters 137% vs Others 31%" means Fighters get 4.4x more opportunities
```

**Ideal target:** All classes should have 200-400 total possible points (1.0-2.0x range)

---

### **Metric 3: Trait Coverage Balance**
**What it measures:** What % of each class's signature traits are represented in questions
**Formula:** `(Class traits in questions) / (Total class traits) × 100`

**Example:**
```
Fighter traits: 10 total traits
  - In questions: tactical-value, disciplined-value, physical, weapon-specialist = 4 traits
  - Coverage: 4/10 = 40%

Druid traits: 8 total traits
  - In questions: nature-guardian, nature-magic = 2 traits (before Tasks 25-27)
  - Coverage: 2/8 = 25%

  After Tasks 25-27:
  - In questions: nature-guardian, nature-magic, nature-background = 3 traits
  - Coverage: 3/8 = 37.5% (improved!)
```

**How to measure:**
```bash
# Run comprehensive fairness analysis
ruby tools/comprehensive-fairness-analysis.rb | grep -A 20 "TRAIT COVERAGE"
```

**Ideal target:** All classes should have 30-50% trait coverage

---

### **Metric 4: Archetype Discoverability Score**
**What it measures:** Can each class's archetypes be properly distinguished?
**Formula:** For each archetype in a class, what % of its unique traits are in questions

**Example:**
```
Fighter: Champion archetype
  Traits: [weapon-specialist, tactical-value, disciplined-value, physical]
  In questions: 4/4 = 100% discoverable ✅

Druid: Circle of the Moon
  Traits: [shape-mastery, wild-spirit, nature-guardian, instinctive-combatant]
  In questions (before): 2/4 = 50% discoverable ⚠️
  In questions (after Tasks 25-27): 3/4 = 75% discoverable ✅
```

**How to measure:**
```bash
# Run comprehensive fairness analysis
ruby tools/comprehensive-fairness-analysis.rb | grep -A 50 "ARCHETYPE DISCOVERABILITY"

# Shows coverage % for each archetype
```

**Ideal target:** All archetypes should have >60% trait coverage (average ~85%)

---

### **Metric 5: Class Advantage Ratio** ⭐ **PRIMARY METRIC**
**What it measures:** Final bias ratio comparing one class to all others
**Formula:** `(Class average scoring opportunities) / (All other classes average)`

**Example - Fighter Bias Timeline:**
```
Original (Before any fixes):
  Fighter scoring opportunities: ~195
  Other classes average: ~45
  Fighter advantage: 195/45 = 4.3x ❌ SEVERE BIAS

After Phase 1 (Tasks 1-12):
  Fighter: ~150 (reduced tactical/disciplined)
  Others: ~60 (improved arcane/divine)
  Fighter advantage: 150/60 = 2.5x ⚠️ MODERATE BIAS

After Phase 2 (Tasks 13-21):
  Fighter: ~110 (reduced physical)
  Others: ~75 (improved magic classes)
  Fighter advantage: 110/75 = 1.47x ⚠️ ACCEPTABLE

After Phase 3 (Tasks 22-30):
  Fighter: ~105 (minor adjustments)
  Others: ~85 (improved Rogue/Druid/Bard)
  Fighter advantage: 105/85 = 1.24x ✅ BALANCED
```

**How to measure:**
```bash
# Run Fighter-specific analysis
ruby analyze_fighter_bias.rb

# Look for output like:
# "tactical-value: Fighters 137% vs Others 31%"
# Calculate ratio: 137/31 = 4.4x
```

**Ideal target:**
- ✅ Excellent: 1.0-1.4x (balanced discovery)
- ⚠️ Acceptable: 1.4-2.0x (slight bias, acceptable)
- ❌ Problem: 2.0-3.0x (moderate bias, needs fixing)
- 🚨 Critical: >3.0x (severe bias, urgent fix needed)

---

## 🧪 Before & After Testing Protocol

### **Baseline Measurement (Before Consolidation)**

```bash
# 1. Save current question bank
cp _data/question-bank.yml _data/question-bank.yml.BACKUP

# 2. Run comprehensive class bias analysis (all classes)
echo "=== BASELINE CLASS BIAS (114 Questions) ===" > bias-baseline.txt
ruby tools/analyze_class_bias.rb >> bias-baseline.txt
echo "" >> bias-baseline.txt

# 3. Run detailed analysis for key classes
for class in fighter wizard cleric druid rogue bard ranger; do
  echo "=== DETAILED: $class ===" >> bias-baseline.txt
  ruby tools/analyze_class_bias.rb $class >> bias-baseline.txt
  echo "" >> bias-baseline.txt
done

# 4. Run archetype bias analysis
echo "=== BASELINE ARCHETYPE BIAS ===" >> bias-baseline.txt
ruby tools/analyze_archetype_bias.rb >> bias-baseline.txt
echo "" >> bias-baseline.txt

# 5. Trait Frequencies (for quick reference)
echo "=== KEY TRAIT FREQUENCIES ===" >> bias-baseline.txt
for trait in "tactical-value" "disciplined-value" "physical" "arcane-magic" "divine-magic" "stealth-master" "nature-guardian" "social-manipulator"; do
  count=$(grep -c "$trait:" _data/question-bank.yml)
  echo "  $trait: $count questions" >> bias-baseline.txt
done
echo "" >> bias-baseline.txt

# 6. Comprehensive fairness analysis
echo "=== COMPREHENSIVE FAIRNESS ===" >> bias-baseline.txt
ruby tools/comprehensive-fairness-analysis.rb >> bias-baseline.txt

# 7. Summary stats
echo "" >> bias-baseline.txt
echo "SUMMARY:" >> bias-baseline.txt
echo "  Total questions: 114" >> bias-baseline.txt
echo "  Total archetypes: 294" >> bias-baseline.txt
echo "  Timestamp: $(date)" >> bias-baseline.txt

cat bias-baseline.txt
```

### **After Consolidation Measurement**

```bash
# After implementing consolidation to 58 questions

# 1. Run comprehensive class bias analysis (all classes)
echo "=== POST-CONSOLIDATION CLASS BIAS (58 Questions) ===" > bias-after.txt
ruby tools/analyze_class_bias.rb >> bias-after.txt
echo "" >> bias-after.txt

# 2. Run detailed analysis for key classes
for class in fighter wizard cleric druid rogue bard ranger; do
  echo "=== DETAILED: $class ===" >> bias-after.txt
  ruby tools/analyze_class_bias.rb $class >> bias-after.txt
  echo "" >> bias-after.txt
done

# 3. Run archetype bias analysis
echo "=== POST-CONSOLIDATION ARCHETYPE BIAS ===" >> bias-after.txt
ruby tools/analyze_archetype_bias.rb >> bias-after.txt
echo "" >> bias-after.txt

# 4. Trait Frequencies
echo "=== KEY TRAIT FREQUENCIES ===" >> bias-after.txt
for trait in "tactical-value" "disciplined-value" "physical" "arcane-magic" "divine-magic" "stealth-master" "nature-guardian" "social-manipulator"; do
  count=$(grep -c "$trait:" _data/question-bank.yml)
  echo "  $trait: $count questions" >> bias-after.txt
done
echo "" >> bias-after.txt

# 5. Comprehensive fairness analysis
echo "=== COMPREHENSIVE FAIRNESS ===" >> bias-after.txt
ruby tools/comprehensive-fairness-analysis.rb >> bias-after.txt

# 6. Summary stats
echo "" >> bias-after.txt
echo "SUMMARY:" >> bias-after.txt
echo "  Total questions: 58" >> bias-after.txt
echo "  Total archetypes: 294" >> bias-after.txt
echo "  Timestamp: $(date)" >> bias-after.txt

cat bias-after.txt
```

### **Comparison Analysis**

```bash
# Create comprehensive before/after comparison
echo "=== BEFORE vs AFTER COMPARISON ===" > bias-comparison.txt
echo "Generated: $(date)" >> bias-comparison.txt
echo "" >> bias-comparison.txt

# Question count reduction
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "OVERALL METRICS" >> bias-comparison.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "Question Count:" >> bias-comparison.txt
echo "  Before: 114 questions" >> bias-comparison.txt
echo "  After: 58 questions" >> bias-comparison.txt
echo "  Reduction: 56 questions (-49%)" >> bias-comparison.txt
echo "" >> bias-comparison.txt

# Extract class bias ratios
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "CLASS BIAS RATIOS (comparing to average)" >> bias-comparison.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "" >> bias-comparison.txt
echo "BEFORE (114 questions):" >> bias-comparison.txt
grep "Class.*Opportunities.*Ratio.*Status" bias-baseline.txt -A 20 | head -25 >> bias-comparison.txt
echo "" >> bias-comparison.txt
echo "AFTER (58 questions):" >> bias-comparison.txt
grep "Class.*Opportunities.*Ratio.*Status" bias-after.txt -A 20 | head -25 >> bias-comparison.txt
echo "" >> bias-comparison.txt

# Extract archetype bias extremes
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "ARCHETYPE BIAS (TOP 5 / BOTTOM 5)" >> bias-comparison.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "" >> bias-comparison.txt
echo "BEFORE (114 questions):" >> bias-comparison.txt
grep -A 7 "TOP 5" bias-baseline.txt | tail -6 >> bias-comparison.txt
grep -A 7 "BOTTOM 5" bias-baseline.txt | tail -6 >> bias-comparison.txt
echo "" >> bias-comparison.txt
echo "AFTER (58 questions):" >> bias-comparison.txt
grep -A 7 "TOP 5" bias-after.txt | tail -6 >> bias-comparison.txt
grep -A 7 "BOTTOM 5" bias-after.txt | tail -6 >> bias-comparison.txt
echo "" >> bias-comparison.txt

# Trait frequency comparison
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "KEY TRAIT FREQUENCIES" >> bias-comparison.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
paste <(grep "tactical-value\|disciplined-value\|physical\|arcane-magic\|divine-magic\|stealth-master\|nature-guardian\|social-manipulator" bias-baseline.txt) <(grep "tactical-value\|disciplined-value\|physical\|arcane-magic\|divine-magic\|stealth-master\|nature-guardian\|social-manipulator" bias-after.txt) >> bias-comparison.txt
echo "" >> bias-comparison.txt

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "ACCEPTANCE CRITERIA CHECK" >> bias-comparison.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> bias-comparison.txt
echo "Run manually:" >> bias-comparison.txt
echo "  1. Verify all classes have 0.8-1.5x ratio" >> bias-comparison.txt
echo "  2. Check no archetype has >2.0x or <0.5x ratio" >> bias-comparison.txt
echo "  3. Confirm trait coverage ≥95%" >> bias-comparison.txt
echo "  4. Ensure no trait appears in >50% of questions" >> bias-comparison.txt
echo "" >> bias-comparison.txt

cat bias-comparison.txt
```

### **Acceptance Criteria**

Before approving the consolidation, verify:

✅ **MUST PASS (Class Level):**
1. All classes have 0.8-1.5x advantage ratio (balanced range)
   - Run: `ruby tools/analyze_class_bias.rb` (no argument shows all classes)
   - Look for: All classes in ✅ or ⚠️ status, no ❌ or 🚨
2. No class has <200 or >600 scoring opportunities (prevents extreme under/over-representation)
3. Trait coverage ≥90% (182/203 traits minimum)
   - Run: `ruby tools/comprehensive-fairness-analysis.rb | grep "Trait Coverage"`

✅ **MUST PASS (Archetype Level):**
4. No archetype has >2.0x or <0.5x ratio (prevents extreme bias)
   - Run: `ruby tools/analyze_archetype_bias.rb`
   - Check: TOP 5 should be <2.0x, BOTTOM 5 should be >0.5x
5. <10% of archetypes critically under-represented (<0.6x)
   - Look for summary line: "Under-represented (<0.8x): X archetypes"
   - X should be <30 archetypes (10% of 294)

⚠️ **SHOULD PASS (Optimization Targets):**
6. All classes have 0.9-1.2x ratio (tight balance)
7. All classes have 300-500 scoring opportunities
8. Trait coverage ≥95% (193/203 traits)
9. <5% of archetypes critically under-represented
10. Question efficiency: all questions affect 80+ archetypes

📊 **NICE TO HAVE:**
11. Trait coverage ≥98% (199/203 traits)
12. All archetypes 0.7-1.5x ratio (very balanced)
13. Average question affects 150+ archetypes
14. User testing shows improved satisfaction

---

## 🛠️ Available Bias Analysis Tools

### **Class Bias Analyzer** (`tools/analyze_class_bias.rb`)

Measures bias for individual classes or shows overview of all classes.

**Features:**
- Shows scoring opportunities vs other classes
- Calculates advantage ratio (over/under-representation)
- Color-coded status (✅ excellent, ⚠️ acceptable, ❌ problem, 🚨 critical)
- Displays top traits and their frequencies
- Works for both over-represented AND under-represented classes

**Usage:**
```bash
# Overview of all classes
ruby tools/analyze_class_bias.rb

# Detailed analysis for specific class
ruby tools/analyze_class_bias.rb fighter
ruby tools/analyze_class_bias.rb wizard
ruby tools/analyze_class_bias.rb inquisitor

# Batch analysis for multiple classes
for class in fighter wizard cleric druid rogue bard ranger paladin; do
  echo ""
  ruby tools/analyze_class_bias.rb $class
done
```

**Configuration:**
Edit thresholds at top of file:
```ruby
# Upper bounds (over-represented)
THRESHOLD_EXCELLENT = 1.2     # 1.0-1.2x = balanced
THRESHOLD_ACCEPTABLE = 1.5    # 1.2-1.5x = slight bias
THRESHOLD_PROBLEM = 2.0       # 1.5-2.0x = moderate bias

# Lower bounds (under-represented)
THRESHOLD_LOW_EXCELLENT = 0.8   # 0.8-1.0x = slightly low but acceptable
THRESHOLD_LOW_PROBLEM = 0.6     # 0.6-0.8x = moderate under-representation
THRESHOLD_LOW_CRITICAL = 0.5    # <0.5x = critical under-representation
```

**Example Output:**
```
================================================================================
CLASS BIAS ANALYSIS: WIZARD
================================================================================

Class Profile:
  Archetypes: 17
  Unique traits: 45
  Traits in questions: 45 (100.0%)

Scoring Opportunities:
  Wizard: 498 question assignments
  Other classes (avg): 512.2 question assignments

Advantage Ratio: 0.97x

Assessment:
  ✅ EXCELLENT - Slightly low but acceptable (0.8-1.0x range)
     Wizard has 3% fewer opportunities but still discoverable.

[... trait frequencies and comparison table ...]
```

---

### **Archetype Bias Analyzer** (`tools/analyze_archetype_bias.rb`)

Measures bias across all 294 archetypes to identify over/under-represented archetypes.

**Features:**
- Shows TOP 5 most over-represented archetypes
- Shows MIDDLE 3 most balanced archetypes
- Shows BOTTOM 5 most under-represented archetypes
- Summary statistics (% balanced, % over/under-represented)
- Identifies critical issues requiring fixes

**Usage:**
```bash
# Run analysis (no arguments needed)
ruby tools/analyze_archetype_bias.rb
```

**Configuration:**
Edit display settings at top of file:
```ruby
TOP_N = 5          # Show top N archetypes
MIDDLE_N = 3       # Show middle N archetypes
BOTTOM_N = 5       # Show bottom N archetypes
```

**Example Output:**
```
================================================================================
ARCHETYPE BIAS ANALYSIS
================================================================================

Statistics:
  Total archetypes: 294
  Average opportunities: 139.2
  Total questions: 114

All Archetypes Comparison:

  TOP 5 (Most Over-represented):
  fighter:daredevil                   255                1.83       ❌
  fighter:sellsword                   255                1.83       ❌
  warlock:dispater                    254                1.82       ❌

  MIDDLE 3 (Most Balanced):
  wizard:school-of-reawakening        139                1.0        ✅
  barbarian:path-of-the-painted-warrior 139              1.0        ✅

  BOTTOM 5 (Most Under-represented):
  swashbuckler:corsair                33                 0.24       🚨
  swashbuckler:daredevil              37                 0.27       🚨
  ranger:gloom-stalker                62                 0.45       🚨

Summary:
  Over-represented (≥1.2x): 76 archetypes (25.9%)
  Balanced (0.8-1.2x): 125 archetypes (42.5%)
  Under-represented (<0.8x): 93 archetypes (31.6%)

⚠️  Critical Issues:
  26 archetypes with <0.6x ratio (severe under-representation)
```

---

### **Comprehensive Fairness Analyzer** (`tools/comprehensive-fairness-analysis.rb`)

System-wide analysis of trait coverage and question efficiency (from original bias reduction work).

**Usage:**
```bash
ruby tools/comprehensive-fairness-analysis.rb
```

**Provides:**
- Trait coverage statistics
- Question efficiency metrics
- Archetype discoverability scores
- Critical imbalances requiring attention

---

## 📝 Next Steps

**DO NOT EXECUTE - This is a planning document only.**

1. **Baseline Testing:** Run complete bias measurement on current 114-question system
2. **Review:** Stakeholder approval of consolidation plan
3. **Create:** New multi-choice questions (6 questions)
4. **Test:** New questions in isolation
5. **Execute:** Phase 1 - Remove 10 duplicate questions
6. **Validate:** Run bias metrics, compare to baseline
7. **Execute:** Phase 2 - Consolidate 25 overlaps
8. **Validate:** Comprehensive testing with all 5 bias metrics
9. **Execute:** Phase 3 - Remove 15-20 specific questions
10. **Validate:** Final acceptance testing against criteria
11. **Compare:** Generate before/after comparison report
12. **Document:** Update ALGORITHM_UPDATE.md with efficiency improvements

---

## 🎯 Conclusion

This consolidation reduces question count by **49%** (114 → 58) while maintaining **96% trait coverage** and improving average question efficiency from 150 to 180+ archetypes per question.

**Key Benefits:**
- ✅ Faster user experience (5 min vs 10 min)
- ✅ Less redundancy = better data quality
- ✅ Higher engagement (quality over quantity)
- ✅ Easier maintenance (fewer questions to update)
- ✅ Algorithm efficiency improves (less noise)

**Trade-offs:**
- ❌ 7 very specific traits lose explicit questions (but keep implicit scoring)
- ❌ Some archetype specialization requires more inference
- ❌ Less granular distinction between similar archetypes

**Recommendation:** Proceed with phased implementation, validating after each phase. The benefits significantly outweigh the trade-offs, and the system will remain robust and fair while becoming more user-friendly.
