# Questionnaire Conversion Plan
## Multi-Dimensional Trait Scoring System Implementation

**Date:** February 18, 2026
**Status:** Planning Phase

---

## Executive Summary

Convert from categorical preference matching to multi-dimensional trait scoring system where each question contributes +/- scores across multiple trait dimensions.

---

## Current State Analysis

### Generic Traits (Categorical - 2 traits)
- **magicType**: healing, damage, utility, versatile, control, none
  - 9× utility, 7× versatile, 5× damage, 4× healing, 3× none
- **originBackground**: noble, military, criminal, urban, rural, scholarly, tribal
  - 7× urban, 7× rural, 5× noble, 3× criminal, 2× military, 1× scholarly

### Specific Traits (45 unique traits with high/medium/low weights)
acrobatic, athletic-excellence, chaotic-nature, classic-rogue, craftsman-warrior, crossbow-specialist, cunning-mind, death-dealer, disciplined-warrior, disguise-master, draconic-heritage, dual-nature, elemental-affinity, engineering-mind, fast-hands, fate-touched, illusion-specialist, innate-power, intellectual-combatant, intuitive-caster, lock-picker, mage-hand-master, magic-student, magical-bloodline, modern-thinker, natural-armor, opportunistic, patient-hunter, physical-prowess, professional-killer, proud-lineage, pure-warrior, ranged-expert, raw-talent, scholar-warrior, scholarly-rogue, skill-expert, social-manipulator, stealth-master, tactical-mind, treasure-hunter, unpredictable-power, weapon-master, weapon-specialist, wild-surges

### Questions (34 total)
Organized by category:
- Magic preference/style: 4 questions
- Roleplay: 3 questions (2 currently empty)
- Origin background: 5 questions
- Group dynamics: 2 questions
- Power source & combat style: 10 questions
- Rogue-specific: 3 questions
- Archetype-specific: 7 questions

---

## Target State Design

### Trait Dimension Mapping

#### Magic Dimensions (6 dimensions)
Expand magicType into separate scorable dimensions:
- `healing-magic`: Preference for healing/support spells
- `damage-magic`: Preference for offensive/destructive spells
- `utility-magic`: Preference for problem-solving/utility spells
- `control-magic`: Preference for battlefield control/debuff spells
- `versatile-magic`: Preference for broad magical knowledge
- `no-magic`: Preference for non-magical approaches

#### Background Dimensions (7 dimensions)
Expand originBackground into separate scorable dimensions:
- `noble-background`: Wealthy/aristocratic upbringing
- `military-background`: Soldier/guard training
- `criminal-background`: Underworld/illegal activities
- `urban-background`: City/town life
- `rural-background`: Wilderness/farming life
- `scholarly-background`: Academic/research focus
- `tribal-background`: Clan/nomadic heritage

#### Specific Trait Dimensions (45 existing)
Keep all 45 specific traits as scorable dimensions

**Total: 58 scorable trait dimensions**

### Scoring Value Guidelines

**Strong alignment (+4):** Directly asks for this specific preference
**Moderate alignment (+2):** Indirect support or related concept
**Slight alignment (+1):** Tangential or minor connection
**Neutral (0):** No impact
**Slight rejection (-1):** Minor counter-indication
**Moderate rejection (-2):** Indirect opposition
**Strong rejection (-4):** Directly contradicts preference

### Question Conversion Strategy

For each question, determine:
1. Primary dimensions affected (usually 1-3)
2. Secondary dimensions affected (tangential impacts)
3. Opposing dimensions (what this excludes)
4. Score values based on answer strength

**Example Conversion:**
```yaml
# BEFORE (categorical selection)
- id: healing-magic
  answers:
    "yes": { magicType: healing }
    "no": { magicType: damage }

# AFTER (multi-dimensional scoring)
- id: healing-magic
  answers:
    "yes":
      healing-magic: +4      # Direct alignment
      utility-magic: +1      # Support often includes utility
      damage-magic: -2       # Moderate opposition
    "maybe":
      healing-magic: +1      # Weak alignment
      utility-magic: +2      # Leans more utility
    "no":
      healing-magic: -2      # Rejection
      damage-magic: +2       # Moderate preference for opposite
      control-magic: +1      # Alternative support style
```

---

## Implementation Phases

### PHASE 1: Trait Dimension Mapping (1-2 hours)
**Goal:** Define complete trait dimension system

#### Tasks:
1. ✅ Document all 58 trait dimensions
2. ⬜ Create mapping table: old categorical values → new dimensions
3. ⬜ Define scoring guidelines per dimension type
4. ⬜ Create example conversions for each question category

#### Verification:
- All current trait values map to new dimensions
- No orphaned traits
- Scoring guidelines comprehensive

---

### PHASE 2: Question Bank Conversion (3-4 hours)
**Goal:** Convert all 34 questions to scoring format

#### Strategy:
Group questions by similarity, convert in batches:

**Batch 1: Magic Questions (4 questions)**
- healing-magic, magic-interest, destructive-magic, support-magic
- Focus: magic dimension scoring

**Batch 2: Background Questions (5 questions)**
- military-background, noble-upbringing, wilderness-life, scholarly-pursuits, criminal-past
- Focus: background dimension scoring

**Batch 3: Combat Style Questions (10 questions)**
- weapon-mastery, tactical-thinking, physical-excellence, defensive-protection, etc.
- Focus: specific trait scoring with magic/background cross-effects

**Batch 4: Social/Roleplay Questions (3 questions)**
- social-interaction, team-leadership, mysterious-loner
- Focus: background + specific trait combinations

**Batch 5: Rogue-Specific Questions (5 questions)**
- stealth-approach, skill-versatility, treasure-motivation, deception-disguise, patience-planning
- Focus: rogue-specific traits

**Batch 6: Miscellaneous Questions (7 questions)**
- All remaining questions

#### Per-Question Conversion Checklist:
- [ ] Identify primary trait dimensions (1-3)
- [ ] Identify secondary/opposing dimensions
- [ ] Assign scores for "yes" answer
- [ ] Assign scores for "maybe" answer
- [ ] Assign scores for "no" answer
- [ ] Verify score balance (total positive ≈ total negative potential)
- [ ] Add inline comment explaining scoring logic

#### Verification:
- ✅ All 34 questions converted
- ✅ Each question affects 2-6 dimensions
- ✅ Score ranges reasonable (-4 to +4)
- ✅ No syntax errors in YAML

**Status: COMPLETE** ✅

---

### PHASE 3: Scoring Engine Rewrite (2-3 hours)
**Goal:** Implement new scoring algorithm in questionnaire.html

**Status: COMPLETE** ✅

Implemented:
- ✅ `buildTraitRanges()` - Calculates min/max for each trait across all questions
- ✅ `scoreUserProfile()` - Accumulates user's trait scores
- ✅ `calculateTraitPercentages()` - Converts scores to percentages
- ✅ `getUserTraitProfile()` - Complete user profile with all traits
- ✅ Updated `renderResults()` - Shows user trait breakdown and class traits with percentages
- ✅ Storage version incremented to 3
- ✅ Trait display changed to comma-separated with percentages

---
**Goal:** Implement new scoring algorithm in questionnaire.html

#### Current Algorithm (to replace):
```javascript
scoreProfile(profile) {
  // Uses compatibility matching
  // Returns percentage based on compatibility scores
}
```

#### New Algorithm (to implement):
```javascript
buildTraitRanges(questions) {
  // For each trait dimension:
  //   Calculate min possible (sum of all negative scores)
  //   Calculate max possible (sum of all positive scores)
  // Returns: { 'healing-magic': {min: -10, max: +16}, ... }
}

scoreUserProfile(userAnswers, questions) {
  // For each trait dimension:
  //   Calculate current score (sum of user's answers)
  // Returns: { 'healing-magic': {min: -10, max: +16, current: +6}, ... }
}

calculateTraitPercentages(scoreData) {
  // For each trait:
  //   percentage = (current - min) / (max - min) * 100
  // Returns: { 'healing-magic': 71%, ... }
}

scoreProfile(profile, userPercentages) {
  // For each required trait in profile:
  //   Match user percentage to requirement
  //   Weight by trait importance
  // Returns: overall match percentage + trait breakdown
}
```

#### Implementation Tasks:
1. ⬜ Add `buildTraitRanges()` function
2. ⬜ Add `scoreUserProfile()` function
3. ⬜ Add `calculateTraitPercentages()` function
4. ⬜ Rewrite `scoreProfile()` for new matching
5. ⬜ Update `renderResults()` to show trait breakdown
6. ⬜ Add player profile visualization (all traits with scores)
7. ⬜ Remove old compatibility matrix logic
8. ⬜ Update storage version number

#### Verification:
- Scores accumulate correctly
- Percentages calculate accurately
- No division by zero errors
- Results display properly

---

### PHASE 4: Class Profile Updates (1-2 hours)
**Goal:** Convert class profiles to use trait requirements

#### Current Format:
```yaml
profile:
  generic:
    magicType: "healing"
    originBackground: ["noble", "urban"]
  specific: ["stealth-master", "cunning-mind"]
```

#### New Format (Option A - Threshold-based):
```yaml
profile:
  required:  # Must have these above threshold
    healing-magic: 50%
    noble-background: 40%
  preferred:  # Bonus if high
    utility-magic: 30%
  rejected:  # Penalty if high
    damage-magic: 60%
  specific: ["stealth-master", "cunning-mind"]  # Keep these
```

#### New Format (Option B - Score-based):
```yaml
profile:
  traits:
    healing-magic: { weight: 3, threshold: 50% }
    damage-magic: { weight: -2, threshold: 40% }  # Negative = penalty
    noble-background: { weight: 1, threshold: 30% }
  specific: ["stealth-master", "cunning-mind"]
```

#### Tasks:
1. ⬜ Choose profile format (A or B)
2. ⬜ Convert Fighter profile (test case)
3. ⬜ Convert Rogue profile (test case)
4. ⬜ Convert Sorcerer profile (test case)
5. ⬜ Test matching accuracy with conversions
6. ⬜ Convert remaining 15 class profiles
7. ⬜ Convert all archetype profiles

#### Verification:
- All classes have valid profiles
- Recommendations make thematic sense
- No YAML syntax errors

---

### PHASE 5: Testing & Validation (1-2 hours)

#### Test Cases:

**Test 1: All "Yes"**
- Answer "yes" to all questions
- Verify: Should favor versatile, high-magic classes
- Expected: Wizard/Sorcerer highly ranked

**Test 2: All "No"**
- Answer "no" to all questions
- Verify: Should favor non-magic, simple classes
- Expected: Fighter/Barbarian highly ranked

**Test 3: All "Maybe"**
- Answer "maybe" to all questions
- Verify: Should show moderate across all traits
- Expected: Hybrid classes like Bard/Paladin ranked

**Test 4: Healing Focus**
- "Yes" to all healing/support questions
- "No" to damage questions
- Expected: Cleric/Life Domain highly ranked

**Test 5: Stealth Focus**
- "Yes" to stealth/criminal questions
- "No" to combat/social questions
- Expected: Rogue/Assassin highly ranked

#### Validation Checklist:
- [ ] All 34 questions save answers
- [ ] Trait scores calculate correctly
- [ ] Percentages display properly
- [ ] Recommendations make thematic sense
- [ ] "Continue" from results works
- [ ] Local storage persists properly
- [ ] No console errors
- [ ] Performance acceptable (<500ms for scoring)

---

### PHASE 6: UI Enhancements (1 hour)

#### Player Profile Display:
Add new section showing all trait scores:

```
Your Character Profile:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Magic Preferences:
  Healing Magic:    ████████░░ 71% (strong preference)
  Utility Magic:    █████░░░░░ 50% (moderate preference)
  Damage Magic:     ██░░░░░░░░ 22% (low preference)
  Versatile Magic:  ████░░░░░░ 40% (moderate preference)
  Control Magic:    ███░░░░░░░ 30% (slight preference)
  No Magic:         █░░░░░░░░░ 10% (very low preference)

Background:
  Criminal:         ████████░░ 75% (strong alignment)
  Urban:            ██████░░░░ 60% (moderate alignment)
  Noble:            ██░░░░░░░░ 15% (low alignment)
  ...

Key Traits:
  Stealth Master:   █████████░ 85% (very high)
  Cunning Mind:     ███████░░░ 70% (high)
  ...
```

#### Tasks:
1. ⬜ Create trait visualization component
2. ⬜ Group traits by category
3. ⬜ Add progress bars for visual representation
4. ⬜ Show top 5 highest and lowest traits
5. ⬜ Add explanatory tooltips
6. ⬜ Make it collapsible/expandable

---

## Risk Assessment & Mitigation

### High Risk:
**Score Balance Issues**
- Risk: Some traits dominate due to unbalanced scoring
- Mitigation: Review all conversions, ensure even distribution
- Test: Run validation tests, check variance

**Breaking Changes**
- Risk: Existing saved progress becomes invalid
- Mitigation: Increment storage version, clear old data
- Test: Verify version handling works

### Medium Risk:
**Performance**
- Risk: 58 traits × 34 questions = slow calculations
- Mitigation: Optimize JavaScript, consider caching
- Test: Profile with browser dev tools

**Complexity**
- Risk: System becomes hard to understand/maintain
- Mitigation: Comprehensive documentation, clear code
- Test: Code review

### Low Risk:
**UI Changes**
- Risk: Results display becomes cluttered
- Mitigation: Progressive disclosure, grouping
- Test: User feedback

---

## Success Criteria

✅ **All 34 questions** converted to scoring format
✅ **All 18 classes** have updated profiles
✅ **Scoring engine** correctly calculates percentages
✅ **Test cases** pass with expected results
✅ **No regressions** in existing functionality
✅ **Documentation** updated and comprehensive
✅ **Performance** <500ms for full scoring
✅ **User feedback** positive (more transparent/helpful)

---

## Timeline Estimate

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| 1. Trait Mapping | 1-2 hours | P0 |
| 2. Question Conversion | 3-4 hours | P0 |
| 3. Scoring Engine | 2-3 hours | P0 |
| 4. Class Profiles | 1-2 hours | P0 |
| 5. Testing | 1-2 hours | P0 |
| 6. UI Enhancements | 1 hour | P1 |
| **TOTAL** | **9-14 hours** | |

---

## Next Steps

1. Review and approve this plan
2. Begin Phase 1: Create trait dimension mapping table
3. Create example conversions for each question type
4. Begin systematic question conversion

---

## Notes & Questions

1. **Question for review:** Should we keep "dont-know" option or make it score as 0 across all dimensions?
2. **Question for review:** Should specific traits remain binary (present/absent) or also become scorable?
3. **Decision needed:** Class profile format - Option A (threshold-based) vs Option B (score-based)?
4. **Future consideration:** Add trait importance weighting per class?
