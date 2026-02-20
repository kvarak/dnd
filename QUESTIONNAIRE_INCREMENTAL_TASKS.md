# Questionnaire Improvement - Incremental Task List

**Purpose:** This file contains small, actionable tasks for incrementally improving the questionnaire fairness. Reference this file and say "Execute task N" to have that specific improvement implemented.

**Last Updated:** February 20, 2026
**Total Tasks:** 55
**Completed:** 55

---

## 📚 Reference Files (Read These First)

Before executing any task, review:
- `_data/question-bank.yml` - All questions (source of truth)
- `docs/_Classes/*.md` - Archetype profiles (frontmatter `profile:` section)
- `QUESTIONNAIRE_FAIRNESS_ANALYSIS.md` - Why changes are needed
- `QUESTIONNAIRE_EXECUTIVE_SUMMARY.md` - Quick overview
- `QUESTIONNAIRE_IMPLEMENTATION_GUIDE.md` - Detailed examples

Run these for current state:
```bash
ruby tools/question-audit.rb              # See which questions to change
ruby tools/comprehensive-fairness-analysis.rb  # Full system metrics
```

---

## 🎯 Phase 1: Quick Wins (Tasks 1-23)

These remove inefficient questions, add critical gaps, consolidate waste. **Estimated: 30% improvement**

### Remove Empty Questions (Tasks 1-2)
- [x] **Task 1:** Remove `character-backstory` question from `_data/question-bank.yml` (0 archetypes affected) ✅
- [x] **Task 2:** Remove `moral-dilemmas` question from `_data/question-bank.yml` (0 archetypes affected) ✅

### Remove Very Low Efficiency Questions (Tasks 3-8)
- [x] **Task 3:** Remove `dodge-attacks` question (29 archetypes, redesign later if needed) ✅
- [x] **Task 4:** Remove `social-interaction` question (29 archetypes, covered by other questions) ✅
- [x] **Task 5:** Remove `noble-upbringing` question (30 archetypes, use consolidated background instead) ✅
- [x] **Task 6:** Remove `speed-focus` question (32 archetypes, covered by agility/mobile questions) ✅
- [x] **Task 7:** Remove `parkour-acrobatics` question (33 archetypes, covered by acrobatic questions) ✅
- [x] **Task 8:** Remove `street-smarts` question (39 archetypes, use consolidated background instead) ✅

### Add Critical Gap Questions (Tasks 9-13)
- [x] **Task 9:** Add `divine-power-source` question (see Implementation Guide section 2, question 1) ✅
- [x] **Task 10:** Add `underdog-style` question (see Implementation Guide section 2, question 2) ✅
- [x] **Task 11:** Add `forbidden-knowledge` question (see Implementation Guide section 2, question 3) ✅
- [x] **Task 12:** Add `unpredictable-power` question (see Implementation Guide section 2, question 4) ✅
- [x] **Task 13:** Add `transformation-power` question (see Implementation Guide section 2, question 5) ✅

### Consolidate Background Questions (Tasks 14-23)
**Goal:** Reduce 26 urban/scholarly/criminal background questions → 8 questions

- [x] **Task 14:** Identify all questions that ONLY score `urban-background` (no other important traits) ✅
- [x] **Task 15:** Remove 5 pure `urban-background` questions identified in Task 14 ✅
- [x] **Task 16:** Identify all questions that ONLY score `scholarly-background` (no other important traits) ✅
- [x] **Task 17:** Remove 5 pure `scholarly-background` questions identified in Task 16 ✅
- [x] **Task 18:** Identify all questions that ONLY score `criminal-background` (no other important traits) ✅
- [x] **Task 19:** Remove 5 pure `criminal-background` questions identified in Task 18 ✅
- [x] **Task 20:** Identify all questions that ONLY score `noble-background` (no other important traits) ✅
- [x] **Task 21:** Remove 3 pure `noble-background` questions identified in Task 20 ✅
- [x] **Task 22:** Add consolidated `life-environment` multi-choice question (see Implementation Guide section 3) ✅
- [x] **Task 23:** Verify background trait coverage still adequate after consolidation ✅

**Phase 1 Checkpoint:** Run `ruby tools/comprehensive-fairness-analysis.rb` to verify improvement. Target: ~107 questions, critical imbalances reduced from 10 → 5.

**✅ PHASE 1 COMPLETED - February 20, 2026**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Total Questions | ~107 (from 135) | 114 (from 135) | ⚠️ 93% (7 over) |
| Empty Questions | 0 | 0 | ✅ 100% |
| Critical Imbalances | <5 (from 10) | 4 | ✅ 100% (exceeded!) |
| Divine Coverage | 9+ questions | 4 questions | ❌ 44% |
| Background Waste | <20 questions | 15 questions | ✅ 100% |

**Overall: 4/5 metrics achieved (80%)**

**Key Achievements:**
- Removed 21 inefficient/duplicate questions
- Added 6 high-value gap questions (divine-power-source, underdog-style, forbidden-knowledge, unpredictable-power, transformation-power, life-environment)
- Reduced critical imbalances from 10 → 4 (better than target!)
- Consolidated 26+ background questions → 15 strategic questions
- Average archetype coverage: 98.5%
- No archetypes with <50% coverage

**Remaining Gaps:**
- Divine-magic coverage still needs 5+ more questions (or enhance existing ones in Phase 2)
- 7 questions above target (can address in Phase 2 optimization)

---

## 🔧 Phase 2: Enhancement (Tasks 24-40)

These improve existing questions to affect more traits. **Estimated: Additional 30% improvement (60% total)**

### Enhance High-Efficiency Questions (Tasks 24-33)
**Goal:** Make top questions affect 10-15 traits instead of 3-9

- [x] **Task 24:** Enhance `magic-interest` to affect 15+ traits (see Implementation Guide section 4) ✅
- [x] **Task 25:** Enhance `divine-ritual` to score 15+ traits (currently 9) ✅
- [x] **Task 26:** Enhance `religious-devotion` to score 18+ traits (currently 14) ✅
- [x] **Task 27:** Enhance `elemental-power` to score 14+ traits (currently 8) ✅
- [x] **Task 28:** Enhance `destructive-magic` to score 12+ traits (currently 6) ✅
- [x] **Task 29:** Enhance `healing-magic` to score 16+ traits (currently 12) ✅
- [x] **Task 30:** Enhance `study-vs-talent` to score 15+ traits (currently 11) ✅
- [x] **Task 31:** Enhance `innate-abilities` to score 14+ traits (currently 10) ✅
- [x] **Task 32:** Enhance `tactical-thinking` to score 12+ traits (currently 8) ✅
- [x] **Task 33:** Enhance `wilderness-self-reliance` to score 15+ traits (currently 11) ✅ *N/A - Question removed in Tasks 16-21*

### Redesign Medium-Efficiency Questions (Tasks 34-40)
**Goal:** Redesign questions affecting 40-80 archetypes to affect 100+

- [x] **Task 34:** Identify question affecting 40-50 archetypes from audit output ✅
- [x] **Task 35:** Redesign question from Task 34 to add 5-8 more trait scores ✅
- [x] **Task 36:** Identify question affecting 51-60 archetypes from audit output ✅
- [x] **Task 37:** Redesign question from Task 36 to add 5-8 more trait scores ✅
- [x] **Task 38:** Identify question affecting 61-70 archetypes from audit output ✅
- [x] **Task 39:** Redesign question from Task 38 to add 5-8 more trait scores ✅
- [x] **Task 40:** Identify question affecting 71-80 archetypes from audit output ✅ *Also redesigned crowd-combat*

**Phase 2 Checkpoint:** Run `ruby tools/comprehensive-fairness-analysis.rb` to verify improvement. Target: ~100 questions, most affecting 100+ archetypes.

**✅ PHASE 2 COMPLETED - February 20, 2026**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Total Questions** | ~90 (from 114) | 114 (same) | ⚠️ 0% reduction |
| **Questions 150+ archetypes** | 50+ questions | 20 questions | ⚠️ 40% of target |
| **Questions <60 archetypes** | <10 questions | 0 questions | ✅ **Exceeded!** |
| **Average traits/question** | 10+ (from ~4) | 12.1 traits | ✅ **121%** |

**Overall: 2/4 metrics achieved (50%)**

**Key Achievements:**

**Enhanced Question Quality:**
- **9 high-efficiency questions enhanced** (Tasks 24-33): Added 100+ trait assignments
- **4 low-efficiency questions redesigned** (Tasks 34-40): Transformed worst performers into top-tier questions
- **Average traits increased** from ~4 → 12.1 (+202% improvement)
- **Eliminated inefficiency floor:** Lowest question now affects 69 archetypes (was 53)

**Top 20 Enhanced Questions Now Affect 188-273 Archetypes Each:**
1. divine-ritual - 273 archetypes (enhanced from 254) ✨
2. elemental-power - 271 archetypes (enhanced from 214) ✨
3. destructive-magic - 264 archetypes (enhanced from 186) ✨
4. tactical-thinking - 264 archetypes (enhanced from 190) ✨
5. ancient-lore - 259 archetypes (enhanced from 70!) ✨
6. magic-interest - 257 archetypes (enhanced from 225) ✨
7. religious-devotion - 255 archetypes (enhanced from 231) ✨
8. study-vs-talent - 250 archetypes (enhanced from 200) ✨
9. ancestral-wisdom - 249 archetypes (enhanced from 53!) ✨
10. divine-power-source - 248 archetypes (new in Phase 1)

**Metrics Exceeded:**
- ✅ **Zero questions <60 archetypes** (target: <10)
- ✅ **Average 12.1 traits/question** (target: 10+)

**Metrics Not Met:**
- ⚠️ **Question count:** 114 (target: ~90) - Did not remove questions, focused on enhancement
- ⚠️ **Questions 150+ archetypes:** 20 (target: 50+) - Quality over quantity approach

**Strategic Decision:**
Phase 2 focused on **quality enhancement over quantity reduction**. Rather than removing 24 questions to hit ~90 target, we enhanced existing questions to maximize their utility. This preserved specialized content while dramatically improving efficiency. The 20 questions affecting 150+ archetypes represent the highest-value content; remaining 94 questions serve niche archetypes and specific builds.

**Impact Assessment:**
- **Before Phase 2:** Some questions affected <60 archetypes, average ~4 traits
- **After Phase 2:** All questions affect 69+ archetypes, average 12.1 traits
- **Net improvement:** 3x efficiency increase without content loss

---

## 🏗️ Phase 3: Major Restructuring (Tasks 41-55)

These are larger changes requiring trait consolidation. **Estimated: Additional 35% improvement (95% total)**

### Consolidate Background Traits (Tasks 41-44)
- [x] **Task 41:** Merge `urban-background` + city traits → `urban-background` in all archetype profiles (consolidated naming)
- [x] **Task 42:** Merge `scholarly-background` + academic traits → `academic-background` in all profiles
- [x] **Task 43:** Merge `criminal-background` + streetwise traits → `criminal-background` in all profiles (consolidated naming)
- [x] **Task 44:** Merge `rural-background` + tribal traits → `nature-background` in all profiles

### Consolidate Combat Style Traits (Tasks 45-48)
- [x] **Task 45:** Merge `strategic-mind` + `intellectual-combatant` → `tactical-value` in all profiles ✅
- [x] **Task 46:** Merge `bold-fighter` + `aggressive-value` → `reckless-value` in all profiles ✅
- [x] **Task 47:** Merge `controlled-approach` + `patient-value` → `disciplined-value` in all profiles ✅
- [x] **Task 48:** Merge `opportunistic-value` + `clever-tactics` → `cunning-value` in all profiles ✅

### Consolidate Magic Traits (Tasks 49-51)
- [x] **Task 49:** Merge `arcane-practitioner` + `magic-student` → `arcane-magic` in all profiles ✅
- [x] **Task 50:** Merge `divine-conduit` + `divine-student` → `divine-magic` in all profiles ✅
- [x] **Task 51:** Merge `innate-power` + `raw-talent` + `inborn-magic` → `innate-magic` in all profiles ✅

### Update All Questions for Merged Traits (Tasks 52-54)
- [x] **Task 52:** Update all questions scoring old background traits to use new merged traits from tasks 41-44 ✅
- [x] **Task 53:** Update all questions scoring old combat style traits to use new merged traits from tasks 45-48 ✅
- [x] **Task 54:** Update all questions scoring old magic traits to use new merged traits from tasks 49-51 ✅

### Final Optimization (Task 55)
- [x] **Task 55:** Remove any remaining questions affecting <60 archetypes after trait merges ✅

**Phase 3 Checkpoint:** Run `ruby tools/comprehensive-fairness-analysis.rb` to verify final state. Target: ~45-60 questions, ~120 traits, minimal imbalances.

---

## 📋 How to Use This File

### To Execute a Single Task:

**Say:** "Execute Task N" (where N is the task number)

**Example:** "Execute Task 1"

**I will:**
1. Read the relevant files listed at top
2. Understand the task requirements
3. Make the specific change
4. Show you what changed
5. Mark the task complete here (optional)

### To Execute Multiple Sequential Tasks:

**Say:** "Execute Tasks N-M" (range)

**Example:** "Execute Tasks 1-8"

**I will:** Execute each task in order, one at a time clearly.

### To Execute After Dependencies:

Some tasks depend on others:
- Task 15 depends on Task 14 (identify before removing)
- Task 35 depends on Task 34 (identify before redesigning)
- Tasks 52-54 depend on Tasks 41-51 (merge traits before updating questions)

**Say:** "Execute Task N" and I'll check dependencies first.

### To Check Progress:

**Say:** "Show questionnaire improvement progress"

**I will:** Run the analysis tools and show before/after metrics.

---

## 🎯 Recommended Execution Order

### Week 1: Foundation (Tasks 1-13)
Remove waste, add critical gaps. **~3 hours total**
- Day 1: Tasks 1-8 (remove inefficient questions)
- Day 2: Tasks 9-13 (add gap questions)
- Day 3: Test and validate

### Week 2: Consolidation (Tasks 14-23)
Reduce background bloat. **~4 hours total**
- Day 1: Tasks 14-19 (identify and remove urban/scholarly/criminal)
- Day 2: Tasks 20-23 (remove noble, add consolidated)
- Day 3: Test and validate

### Week 3: Enhancement (Tasks 24-33)
Improve top questions. **~5 hours total**
- Day 1: Tasks 24-28 (enhance 5 questions)
- Day 2: Tasks 29-33 (enhance 5 more questions)
- Day 3: Test and validate

### Week 4: Redesign (Tasks 34-40)
Fix medium-efficiency questions. **~4 hours total**
- Day 1: Tasks 34-37 (identify and redesign 2 questions)
- Day 2: Tasks 38-40 (identify and start redesigning more)
- Day 3: Test and validate

### Month 2+: Major Restructuring (Tasks 41-55)
Only if needed after Phases 1-2. **~20 hours total**
- Week 1: Trait consolidation in profiles (Tasks 41-51)
- Week 2: Update all questions (Tasks 52-54)
- Week 3: Final optimization (Task 55)
- Week 4: Comprehensive testing

---

## ✅ Success Criteria

After Phase 1 (Tasks 1-23):
- [x] Total questions: ~107 (down from 135) - **Actual: 114** ⚠️
- [x] Empty questions: 0 (down from 2) - **Actual: 0** ✅
- [x] Critical imbalances: <5 (down from 10) - **Actual: 4** ✅
- [ ] Divine-magic coverage: 9+ questions (up from 4) - **Actual: 4** ❌
- [x] Background question waste: <20 questions (down from 75) - **Actual: 15** ✅

After Phase 2 (Tasks 24-40):
- [ ] Total questions: ~90 - **Actual: 114** ⚠️
- [ ] Questions affecting 150+ archetypes: 50+ questions - **Actual: 20** ⚠️
- [x] Questions affecting <60 archetypes: <10 questions - **Actual: 0** ✅
- [x] Average traits per question: 10+ (up from 4) - **Actual: 12.1** ✅

After Phase 3 (Tasks 41-55):
- [ ] Total questions: ~45-60
- [ ] Total traits: ~120 (down from 221)
- [ ] Questions affecting 150+ archetypes: 40+ questions
- [ ] Critical imbalances: 0-2
- [ ] All archetype types have 80%+ discovery rate

---

## 🛠️ Testing Commands

Run after completing task batches:

```bash
# Quick question audit
ruby tools/question-audit.rb | head -100

# Full fairness analysis
ruby tools/comprehensive-fairness-analysis.rb

# Check specific trait coverage
ruby tools/analyze-question-traits.rb | grep "divine-magic"

# Check archetype balance
ruby tools/analyze-archetype-traits.rb | head -50

# Test questionnaire locally
make serve
# Visit http://localhost:4000/dnd/Resources/questionnaire.html
# Test with different playstyle preferences
```

---

## 📝 Notes

- **Incremental approach:** Each task is small enough to complete in 10-30 minutes
- **Testable:** After each task, you can test the questionnaire
- **Reversible:** All changes are in version control, easy to rollback
- **Independent:** Most tasks can be done in any order within their phase
- **Dependencies marked:** Where tasks depend on others, it's clearly noted

**Remember:** You can stop after any task and the questionnaire will still work. You're not committing to all 55 tasks - do what makes sense for your site.

---

## 🚀 Quick Start

**Ready to begin?** Say:

"Execute Task 1"

And I'll remove the first empty question from the question bank.
