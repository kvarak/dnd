# Folk-Restricted Archetype Implementation Plan

## Summary

Implement folk (race) restrictions for archetypes with a two-phase approach:
1. **Profile Metadata**: Add `restriction.folk` field to archetype profiles
2. **Questionnaire Pre-filter**: Add folk selection that boosts restricted archetypes and biases question selection

---

## Phase 1: Profile Structure ✅ COMPLETED

### Changes Made
Added `restriction` field to 3 Fighter archetypes in [docs/_Classes/fighter.md](docs/_Classes/fighter.md):

```yaml
celestial-knight:
  restriction:
    folk: "aasimar"
  specific: ["celestial-heritage", "divine-warrior", "holy-power", "lawful-value"]

tinker-knight:
  restriction:
    folk: "gnome"
  specific: ["engineering-mind", "innovation-specialist", "craftsman-warrior", "intellectual-combatant"]

warsling-sniper:
  restriction:
    folk: "halfling"
  specific: ["sling-specialist", "sniper", "ranged-expert", "tactical-value"]
```

### Validation
- ✅ `make validate-profiles` passes
- ✅ Existing questionnaire unaffected (ignores unknown fields)
- ✅ Profile structure remains compatible

---

## Phase 2: Questionnaire Implementation (TODO)

### UI Flow

**Step 1: Folk Selection (New)**
```
Question: "Are you playing any of these folk?"

Options:
- Aasimar
- Gnome
- Halfling
- Dragonborn
- Dwarf
- Elf
- Half-elf
- Half-orc
- Human
- Tiefling
- None of the above / Haven't decided
```

**Step 2: Adaptive Questions (Enhanced)**
- Questions continue as normal
- But selection algorithm prioritizes questions about traits matching selected folk's restricted archetypes

### Matching Algorithm Changes

#### 1. Score Boost for Restricted Archetypes
When calculating final match percentages:

```javascript
// Pseudocode
if (archetype.restriction?.folk === selectedFolk) {
  // Add significant bonus to match score
  matchScore += FOLK_RESTRICTION_BONUS; // e.g., +20 points
}
```

**Rationale**: If you're an Aasimar Fighter, Celestial Knight should naturally rank higher if your trait answers align.

#### 2. Question Prioritization
When selecting next adaptive question using `selectNextAdaptiveQuestion()`:

```javascript
// Prioritize questions that score traits from folk-restricted archetypes
function getQuestionPriority(question, selectedFolk) {
  const folkArchetypes = getRestrictedArchetypes(selectedClass, selectedFolk);
  const folkTraits = getAllTraits(folkArchetypes);

  // Count how many folk-specific traits this question scores
  const folkTraitCount = countMatchingTraits(question, folkTraits);

  return folkTraitCount > 0 ? HIGH_PRIORITY : NORMAL_PRIORITY;
}
```

**Effect**: Aasimar players see more questions about divine power, holy warriors, celestial heritage, etc.

#### 3. Display Filtering (Optional)
Option to hide non-eligible archetypes in results:

```javascript
// In results display
archetypes
  .filter(a => !a.restriction || a.restriction.folk === selectedFolk)
  .sort(byMatchPercentage)
```

**Recommendation**: Show all but visually mark restricted ones:
- ✅ "Celestial Knight (96%) - Available to you"
- 🔒 "Tinker Knight (43%) - Requires Gnome"

---

## Implementation Files

### Files to Modify

1. **`_layouts/questionnaire.html`**
   - Add folk selection UI (step before questions)
   - Store `selectedFolk` in state
   - Modify `selectNextAdaptiveQuestion()` to prioritize folk-trait questions
   - Add folk bonus to `calculateMatches()`
   - Add visual indicators in results display

2. **Class profile files** (as needed)
   - Add `restriction.folk` to restricted archetypes in other classes
   - Examples: Divine Soul Sorcerer → Aasimar, etc.

3. **`_data/folk-list.yml`** (new file)
   ```yaml
   - id: aasimar
     name: Aasimar
     hasRestrictedArchetypes: true

   - id: gnome
     name: Gnome
     hasRestrictedArchetypes: true

   - id: halfling
     name: Halfling
     hasRestrictedArchetypes: true

   - id: human
     name: Human
     hasRestrictedArchetypes: false
   # ... etc
   ```

### Constants to Define

```javascript
const FOLK_RESTRICTION_BONUS = 20; // Points added to matching restricted archetypes
const FOLK_QUESTION_PRIORITY_MULTIPLIER = 3; // Increase likelihood of folk-trait questions
```

---

## Benefits

### For Players
- **Better Guidance**: Aasimar players naturally guided toward Celestial Knight if playstyle matches
- **Discovery**: Still see other options, understand what makes each archetype unique
- **Informed Choice**: Visual markers show which archetypes are available

### For System
- **Scalable**: Easy to add restrictions to new archetypes in any class
- **Flexible**: Can extend to other restriction types (background, level, campaign-specific)
- **Backward Compatible**: Existing profiles without restrictions work unchanged

---

## Future Enhancements

### Multi-restriction Support
```yaml
archetype-name:
  restriction:
    folk: ["aasimar", "tiefling"]  # Either/or
    background: "noble"             # AND
    minLevel: 5                     # AND
```

### Folk Profile Integration
Link to folk files for full synergy:
```yaml
# In _Folk/aasimar.md
profile:
  unlocksArchetypes:
    Fighter: ["celestial-knight"]
    Sorcerer: ["divine-soul"]
    Paladin: ["oathbreaker"]  # example
```

### Campaign Filters
```yaml
restriction:
  campaign: "varlyn-only"  # Only show in specific campaigns
```

---

## Testing Plan

1. **Profile Validation**: ✅ DONE - `make validate-profiles` passes
2. **Questionnaire Load**: Verify CLASS_PROFILES loads restriction fields
3. **Folk Selection**: Test UI for all folk options
4. **Score Boost**: Verify Aasimar + divine answers → high Celestial Knight match
5. **Question Bias**: Verify folk-relevant questions appear more frequently
6. **Edge Cases**: Test "None of the above" selection, multiple restricted archetypes

---

## Migration Notes

**Breaking Changes**: None
- Old questionnaire data format unchanged
- Profiles without restrictions work as before
- New field is additive, not required

**Deployment**: Can be rolled out incrementally
1. Add restrictions to profiles (already done for Fighter)
2. Deploy questionnaire changes
3. Add restrictions to other classes over time

---

**Status**: Phase 1 complete, ready for Phase 2 implementation
**Last Updated**: February 18, 2026
