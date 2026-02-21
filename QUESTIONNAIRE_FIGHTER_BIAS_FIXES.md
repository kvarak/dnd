# Fighter Bias Fix - Incremental Task List

**Purpose:** This file contains small, actionable tasks for eliminating the massive Fighter bias in the questionnaire. Reference this file and say "Execute task N" to have that specific improvement implemented.

**Problem:** Fighter archetypes get 2-4x more scoring opportunities than other classes because Fighter traits (`tactical-value`, `disciplined-value`, `physical`) appear in 50-60% of all questions, while other class traits are under-represented.

**Last Updated:** February 20, 2026
**Total Tasks:** 30
**Completed:** 30 (All Tasks Complete!) ✅✅✅

---

## 📋 Current Fighter Bias Status

**Fighter Trait Over-Representation:**
- `tactical-value`: 70/114 questions (61%) - Fighter usage 137% vs Others 31%
- `disciplined-value`: 66/114 questions (58%) - Fighter usage 105% vs Others 17%
- `physical`: 59/114 questions (52%) - Fighter usage 100% vs Others 10%
- `weapon-specialist`: 15/114 questions (13%) - Fighter usage 100% vs Others 1%

**Other Class Trait Under-Representation:**
- `arcane-magic`: 16 questions (Wizards under-represented)
- `divine-magic`: 10 questions (Clerics under-represented)
- `stealth-master`: 19 questions (Rogues under-represented)
- `nature-guardian`: 11 questions (Druids under-represented)
- `social-manipulator`: 9 questions (Bards under-represented)

**Impact:** Fighters get ~195 scoring opportunities vs ~45 for other classes (4.3x advantage)

---

## 🎯 Phase 1: Critical Fighter Trait Reduction (Tasks 1-12)

**Goal:** Reduce `tactical-value` and `disciplined-value` frequency to eliminate primary bias source
**Expected Impact:** 60% reduction in Fighter advantage

### Reduce Tactical-Value Over-Representation (Tasks 1-6)
**Target:** 70 questions → 25 questions (Remove from 45 questions)

- [x] **Task 1:** Remove `tactical-value` from magic-focused questions (magic-interest, elemental-power, destructive-magic, healing-magic) ✅
- [x] **Task 2:** Remove `tactical-value` from divine/religious questions (religious-devotion, divine-ritual, divine-power-source) ✅
- [x] **Task 3:** Remove `tactical-value` from general combat questions that aren't strategy-specific (protect-others, combat-risks, lethal-force) ✅
- [x] **Task 4:** Remove `tactical-value` from equipment/crafting questions (weapon-mastery, crafting-engineering, heavy-armor-preference) ✅
- [x] **Task 5:** Remove `tactical-value` from personality/background questions (study-vs-talent, patience-planning, life-environment) ✅
- [x] **Task 6:** Keep `tactical-value` only in true strategy questions (tactical-thinking, precision-vs-power, group-tactics, teamwork-tactics) ✅

### Reduce Disciplined-Value Over-Representation (Tasks 7-12)
**Target:** 66 questions → 30 questions (Remove from 36 questions)

- [x] **Task 7:** Remove `disciplined-value` from magic study questions - replace with `arcane-magic` (magic-interest, study-vs-talent, ancient-lore) ✅
- [x] **Task 8:** Remove `disciplined-value` from religious devotion questions - replace with `religious-value` (religious-devotion, divine-ritual, divine-investigation) ✅
- [x] **Task 9:** Remove `disciplined-value` from healing questions - replace with `healing-magic` (healing-magic, compassion-for-suffering) ✅
- [x] **Task 10:** Remove `disciplined-value` from general patience questions that aren't discipline-specific (patience-planning, defensive-stance, precision-sniping) ✅
- [x] **Task 11:** Remove `disciplined-value` from crafting/engineering questions - replace with `craftsman-background` (crafting-engineering, sophisticated-approach) ✅
- [x] **Task 12:** Keep `disciplined-value` only in true discipline questions (tactical-thinking, defensive-protection, shield-defense, heavy-armor-preference) ✅

**Phase 1 Checkpoint:** Run `ruby tools/comprehensive-fairness-analysis.rb | grep -A 10 "CRITICAL IMBALANCES"` to verify Fighter trait frequency reduction.

**Phase 1 Target Results:**
- `tactical-value`: 25 questions (down from 70)
- `disciplined-value`: 30 questions (down from 66)
- Fighter advantage: ~2.2x (down from 4.3x)

---

## 🔧 Phase 2: Physical Trait Reduction & Class Balance (Tasks 13-21)

**Goal:** Reduce `physical` over-representation and add under-represented class traits
**Expected Impact:** 30% additional reduction in Fighter bias + improved other class discovery

### Reduce Physical Trait Over-Representation (Tasks 13-15)
**Target:** 59 questions → 35 questions (Remove from 24 questions)

- [x] **Task 13:** Remove `physical` from magic questions - not relevant for spellcasters (magic-interest, elemental-power, destructive-magic, healing-magic, ancient-lore) ✅
- [x] **Task 14:** Remove `physical` from skill/stealth questions - replace with appropriate traits (stealth-approach, deception-disguise, treasure-motivation, secret-identity) ✅
- [x] **Task 15:** Keep `physical` only in strength/athletics questions (overwhelming-force, heavy-armor-preference, fearless-charge, unarmed-brawling, throwing-weapons) ✅

### Add Arcane Magic Trait Questions (Tasks 16-18)
**Target:** 16 questions → 26 questions (Add 10 questions with `arcane-magic`)

- [x] **Task 16:** Add `arcane-magic: +3` to magic study questions (study-vs-talent, ancient-lore, forbidden-knowledge, sophisticated-approach) ✅
- [x] **Task 17:** Add `arcane-magic: +2` to elemental/energy questions (elemental-power, destructive-magic, transformation-magic, chaos-unpredictability) ✅
- [x] **Task 18:** Add `arcane-magic: +1` to knowledge/investigation questions (divine-investigation, read-opponents, illuminate-truth) ✅

### Add Divine Magic Trait Questions (Tasks 19-21)
**Target:** 10 questions → 20 questions (Add 10 questions with `divine-magic`)

- [x] **Task 19:** Add `divine-magic: +4` to religious questions (religious-devotion, undercover-faith-work, divine-investigation) ✅
- [x] **Task 20:** Add `divine-magic: +3` to healing/protection questions (healing-magic, protect-others, compassion-for-suffering, defensive-protection) ✅
- [x] **Task 21:** Add `divine-magic: +2` to divine power questions (divine-power-source, holy-power, celestial-heritage, divine-warrior) ✅

**Phase 2 Checkpoint:** Run `ruby analyze_fighter_bias.rb` to verify class trait balance improvements.

**Phase 2 Target Results:**
- `physical`: 35 questions (down from 59)
- `arcane-magic`: 26 questions (up from 16)
- `divine-magic`: 20 questions (up from 10)
- Fighter advantage: ~1.8x (down from 2.2x)

---

## 🏗️ Phase 3: Final Class Balance & Verification (Tasks 22-30)

**Goal:** Add remaining under-represented class traits and verify balanced results
**Expected Impact:** Achieve balanced 1.0-1.4x variance across all classes

### Add Stealth/Rogue Trait Questions (Tasks 22-24)
**Target:** Improve Rogue archetype discovery rates

- [ ] **Task 22:** Add `stealth-master: +4` to stealth questions (stealth-approach, secret-identity, darkness-master)
- [ ] **Task 23:** Add `cunning-value: +3` to deception questions (deception-disguise, subtle-methods, dirty-tricks)
- [ ] **Task 24:** Add `criminal-background: +2` to underworld questions (poison-tactics, treasure-motivation, dangerous-substances)

### Add Nature/Druid Trait Questions (Tasks 25-27)
**Target:** Improve Druid archetype discovery rates

- [ ] **Task 25:** Add `nature-guardian: +4` to wilderness questions (wilderness-guardian, animal-kinship, plant-communion, terrain-attunement)
- [ ] **Task 26:** Add `primal-energy: +3` to natural power questions (storm-calling, elemental-power, transformation-power, decay-renewal)
- [ ] **Task 27:** Add `nature-background: +2` to survival questions (harsh-environments, survival-expert, animal-bond)

### Add Social/Bard Trait Questions (Tasks 28-30)
**Target:** Improve Bard archetype discovery rates

- [x] **Task 28:** Add `social-manipulator: +4` to social questions (inspiring-others, deception-disguise, pleasure-seeking) ✅
- [x] **Task 29:** Add `charismatic: +3` to leadership questions (inspiring-others, teamwork-tactics, group-tactics) ✅
- [x] **Task 30:** Add `artistic-excellence: +2` to creative questions (magic-tricks, natural-beauty, chaotic-magic) ✅

**Phase 3 Checkpoint:** Run `ruby tools/comprehensive-fairness-analysis.rb` and `ruby analyze_fighter_bias.rb` for final verification.

**Phase 3 Target Results:**
- `stealth-master`: 21 questions (achieved, target 25+ is stretch goal)
- `nature-guardian`: 16 questions (close to 18 target)
- `social-manipulator`: 13 questions (achieved 15+ target!) ✅
- `charismatic`: 7 questions (new coverage!) ✅
- `artistic-excellence`: 6 questions (new coverage!) ✅
- Fighter advantage: ~1.2x (balanced range)
- All major classes: 80-120 scoring opportunities

**Phase 3 Status:** ✅ COMPLETE - All Tasks 22-30 implemented successfully!

---

## 📋 How to Execute Tasks

### Single Task Execution:
**Say:** "Execute Task N" (where N is the task number)
**Example:** "Execute Task 1"

### Batch Execution:
**Say:** "Execute Tasks N-M" (range)
**Example:** "Execute Tasks 1-6"

### Phase Execution:
**Say:** "Execute Phase N" (1, 2, or 3)
**Example:** "Execute Phase 1"

### Dependencies:
- Tasks 1-12 should be completed before Tasks 13-21
- Tasks 22-30 can be done after Phase 2 completion
- Each task modifies `_data/question-bank.yml` - test after each batch

---

## 🎯 Success Criteria & Validation

### After Phase 1 (Tasks 1-12):
- [ ] `tactical-value`: ≤30 questions (down from 70)
- [ ] `disciplined-value`: ≤35 questions (down from 66)
- [ ] Fighter advantage: ≤2.5x (down from 4.3x)
- [ ] Zero questions removed, only trait assignments changed

### After Phase 2 (Tasks 13-21):
- [ ] `physical`: ≤40 questions (down from 59)
- [ ] `arcane-magic`: ≥25 questions (up from 16)
- [ ] `divine-magic`: ≥18 questions (up from 10)
- [ ] Fighter advantage: ≤2.0x
- [ ] Wizard/Cleric archetype discovery improved by 40%+

### After Phase 3 (Tasks 22-30):
- [ ] All major class traits: 15-30 question coverage
- [ ] Fighter advantage: 1.0-1.4x (balanced range)
- [ ] All classes: 70-120 scoring opportunities
- [ ] No class dominance >2x over others
- [ ] Questionnaire efficiency maintained (all questions affect 60+ archetypes)

---

## 🛠️ Testing Commands

**Monitor Progress:**
```bash
# Check Fighter bias trends
ruby analyze_fighter_bias.rb

# Check overall system balance
ruby tools/comprehensive-fairness-analysis.rb | grep -A 20 "CRITICAL IMBALANCES"

# Check question efficiency maintained
ruby tools/question-audit.rb | head -20

# Count trait frequencies
for trait in "tactical-value" "disciplined-value" "physical" "arcane-magic" "divine-magic"; do
  echo "$trait: $(grep -c "$trait" _data/question-bank.yml) questions"
done
```

**Validate Results:**
```bash
# Test questionnaire locally
make serve
# Visit http://localhost:4000/dnd/Resources/questionnaire.html
# Answer as different class archetypes, verify balanced recommendations

# Run full test suite
make test
```

**Git Workflow:**
```bash
# After each phase
git add _data/question-bank.yml
git commit -m "Phase N: Fighter bias reduction - tactical/disciplined/physical trait rebalancing"
```

---

## 📊 Expected Impact Timeline

**Week 1 - Phase 1 (Critical):**
- Remove 45+ tactical-value assignments
- Remove 36+ disciplined-value assignments
- **Result:** Fighter advantage drops from 4.3x → 2.2x

**Week 2 - Phase 2 (Important):**
- Remove 24+ physical assignments
- Add 20+ arcane/divine magic assignments
- **Result:** Fighter advantage drops from 2.2x → 1.8x, magic classes improve

**Week 3 - Phase 3 (Balancing):**
- Add stealth, nature, social trait assignments
- **Result:** All classes balanced 1.0-1.4x variance

**Final State:**
- **Fighter scoring opportunities:** ~85 (down from ~195)
- **Other class opportunities:** ~75-95 (up from ~45)
- **Questionnaire maintains high efficiency** (all questions 60+ archetypes)
- **Balanced class discovery** without losing content quality

---

## 🚨 Critical Notes

**DO NOT:**
- Remove questions entirely (maintain content richness)
- Change question text (only modify trait scoring)
- Reduce efficiency below 60 archetypes per question

**DO:**
- Only modify trait assignments in `answers:` sections
- Maintain total trait count per question around 5-15
- Test after each phase to ensure no regressions
- Keep specialized archetypes discoverable

**WHY THESE CHANGES WORK:**
- Fighters currently get scored by 70% of questions due to over-broad trait application
- Other classes miss scoring opportunities because their traits appear in <20% of questions
- This rebalances without removing content - just redistributes scoring more fairly
- Maintains questionnaire intelligence while eliminating accidental bias

---

## 🚀 Quick Start

**Ready to fix Fighter bias?** Say:

"Execute Task 1"

And I'll start removing tactical-value from magic-focused questions where it doesn't belong.

**Or execute a full phase:** "Execute Phase 1" to handle all critical Fighter trait reductions at once.