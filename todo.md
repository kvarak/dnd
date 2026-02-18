# Todo

## High Priority

### Interactive Features
- [ ] **Class/Archetype Recommendation Engine** - Questionnaire-based selector that asks lifestyle, preference, and background questions to recommend fitting Varlyn classes/archetypes (removes analysis paralysis for new players choosing from 18 classes)
  - **MVP Core (basic recommendation engine)**:
    - [x] **Class template design** - Create standardized frontmatter template for `profile` with Fighter and Sorcerer as prototypes, defining generic trait categories (combat-focus, magic-type, roleplay-style, origin-background, complexity-level) plus specific/unique traits array (war-deserter, former-slave, noble-outcast, etc.) and archetype override structure (testable: template validates against schema, reusable for remaining 16 classes)
    - [x] **Fighter/Sorcerer trait definition** - Define recommendation traits for Fighter (Champion/Eldritch Knight) and Sorcerer (Draconic/Wild Magic) archetypes only, covering martial vs magical extremes (testable: validates schema, covers diverse class types, establishes trait taxonomy baseline)
    - [x] **Question bank system** - Create 15-20 multiple choice questions covering key decision factors ("Are you from a desert area?", "Do you prefer direct combat or support?", "How complex character do you want?") with yes/no/maybe/don't-know options (testable: questions cover all trait categories)
    - [x] **Scoring algorithm** - Points-based system where classes gain 0-2 points per question based on trait matches (yes=2, maybe=1, no=0, don't-know=skip) (testable: unit tests for scoring logic, deterministic results)
    - [x] **Results ranking** - Sort classes by total score, show top 3-5 recommendations with brief explanations of why they fit (releasable: basic recommendation with rationale)
    - [x] **Simple questionnaire UI** - Clean question-by-question flow with progress indicator and prev/next navigation (releasable: functional questionnaire experience)
  - **Essential Features (complete user experience)**:
    - [ ] **Class preview cards** - Rich recommendation cards showing class name, archetype options, key features, and "Why this fits you" explanation based on answered questions (releasable: helps users understand recommendations)
    - [ ] **Skip/retake functionality** - Allow users to skip questions or restart questionnaire with different answers (releasable: flexible UX for exploration)
    - [ ] **Link to full class pages** - Direct navigation from recommendations to detailed class documentation (releasable: seamless integration with existing content)
    - [ ] **LocalStorage state** - Remember answers across sessions, allow resuming questionnaire (releasable: prevents lost progress)
  - **Enhanced Features (advanced matching)**:
    - [ ] **Archetype trait refinement** - Fine-tune archetype-specific trait variations and add specialized archetype questions (releasable: more nuanced recommendations for players who know they want specific archetype styles)
    - [ ] **Confidence scoring** - Show how confident the system is in each recommendation based on question coverage (releasable: helps users understand recommendation quality)
    - [ ] **Alternative suggestions** - Show "close matches" and explain what would make them better fits (releasable: educational about class design space)
    - [ ] **Folk integration** - Factor in previously selected folk for folk-specific class synergies (releasable: integrates with character creation flow)
  - **Advanced Features (sophisticated analysis)**:
    - [ ] **Multi-dimensional scoring** - Weight different trait categories based on user priorities ("I care more about roleplay than combat effectiveness") (releasable: personalized recommendations)
    - [ ] **Comparative analysis** - "This class vs that class" side-by-side comparison from questionnaire results (releasable: helps with final decision between close matches)
    - [ ] **Analytics integration** - Track which questions are most decisive for recommendations to improve question bank (testable: data collection and analysis scripts)
    - [ ] **Campaign context questions** - Factor in campaign setting and party composition for better recommendations (releasable: DM tool for suggesting classes to players)
- [ ] POSTPONED AND ADDED TO interactive-character-creator branch **Interactive character creator** - Step-by-step wizard for Varlyn character creation with auto-calculations, export to PDF/JSON (biggest onboarding barrier removal)
  - **MVP Core (testable wizard)**:
    - [ ] **Data extraction script** - Build `assets/js/build-creator-data.js` for 3 Folk + 3 Classes only (Human+Elf+Tiefling, Fighter+Wizard+Cursed), expand to full dataset later (testable: validates JSON schema, counts extracted items)
    - [ ] **Character data model** - Define JavaScript class with validation for character state matching Varlyn creation steps (testable: unit tests for schema validation)
    - [ ] **Wizard navigation** - 12-step flow (folk→background→traits→skills→fate→abilities→luck→languages→money→class→levelup→done) with prev/next/jump-to-step (releasable: completes basic wizard UX)
    - [ ] **Folk selection UI** - Card-based folk picker with images and trait previews, step 1 of wizard (releasable: standalone folk browser with filtering)
    - [ ] **Ability score roller** - Interactive 4d6-drop-lowest dice roller with animation, option to assign 8/15 for last two (releasable: fun standalone dice tool, works offline)
    - [ ] **Class selection UI** - Class picker with archetype dropdown and hit die display, step 11 of wizard (releasable: helps users discover classes with similar-to-5E labels)
    - [ ] **Auto-calculation engine** - Derive modifiers, HP, proficiency bonus, luck modifier from base stats (testable: unit tests for all calculation formulas)
    - [ ] **JSON export** - Download character as structured JSON file (releasable: first export format, can re-import later)
  - **Essential Features (complete basic experience)**:
    - [ ] **LocalStorage draft system** - Auto-save character in progress every 30s (releasable: prevents lost work, testable by refreshing page)
    - [ ] **Skill selection UI** - Point-buy system for background/class skills, 3-4 background skills based on folk (releasable: completes character creation basics)
    - [ ] **Basic PDF export** - Generate simple character sheet with jsPDF (releasable: printable sheet with core stats)
  - **Enhanced Features (Varlyn-specific depth)**:
    - [ ] **Background generator** - Roll on folk-specific event tables for backstory, step 2 of wizard (releasable: optional advanced feature, adds narrative flavor)
    - [ ] **Traits & Fate Powers** - Roll random traits (2+) and fate power as per creation rules (releasable: adds Varlyn-specific character flavor)
    - [ ] **Enhanced PDF template** - Styled character sheet matching D&D aesthetic (releasable: professional-looking sheet)
  - **Advanced Features (polish & integration)**:
    - [ ] **Expand to full dataset** - Add remaining 16 Folk + 15 Classes to extraction script (Human+Elf+Tiefling→All Folk, Fighter+Wizard+Cursed→All Classes)
    - [ ] **Folk class modifications** - Migrate remaining 16 Folk to include `classOptions` frontmatter with summaries (Elf prototype complete, captures Folk/Class interaction complexity unique to Varlyn)
    - [ ] **Sync checker script** - Create `make check-creator-sync` to detect stale data by comparing file mtimes (testable: detects when markdown newer than JSON)
    - [ ] **GitHub Actions integration** - CI check that warns when rules change but creator data stale (testable: PR comment appears on rule changes)
- [ ] **Quick reference mode** - Mobile-first combat/action lookup with contextual dice roller and "I want to..." search (at-table utility)
- [ ] **Varlyn vs 5E comparison page** - Side-by-side rule differences with design rationale (experienced player onboarding)

### Accessibility
- [ ] **Add alt text to 180 images** - Critical accessibility issue (systematic approach needed, WCAG 2.1 AA compliance)

### Asset Optimization
- [ ] **Implement responsive images** - Use srcset for different screen sizes
- [ ] **Add image lazy loading** - Improve initial page load times
- [ ] **Replace broken external image links** - Fix escapistmagazine.com and acrosstheboardgames.net with placeholders
- [ ] **Optimize font loading** - Add font-display: swap to 4 custom fonts (prevents FOIT)
- [ ] **Optimize remaining large images** - 8 campaign images still >1MB (total 8MB)

### Development Workflow
- [ ] **Add image optimization workflow** - Automatically compress new images
- [x] **Create tools directory** - Build `tools/` folder with utilities callable from Makefile
  - [x] **Markdown linter** - Create `tools/lint-markdown.js` to validate markdown formatting, headings structure, and consistent styling (callable via `make lint-md`)
  - [x] **Structure tester** - Create `tools/test-structure.js` to validate Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency (callable via `make test-structure`)
  - [x] **Unified test runner** - Create `make test` command that runs all text validation tools (lint-md, test-structure, and any future tests in sequence)

## Nice to Have

### Performance Enhancements
- [ ] **Add WebP image format support** - Better compression than PNG/JPG

### User Experience
- [ ] **New player onboarding paths** - Guided tours for different audiences (never played D&D / know 5E / want to DM)
- [ ] **Visual campaign timeline** - Interactive timeline showing 9 campaigns' chronology with character/event filtering
- [ ] **Character relationship network** - Force-directed graph visualizing connections between 334 characters
- [ ] **Add breadcrumb navigation** - Better navigation for deep content
- [ ] **Add print stylesheets** - Better printing of rule pages
- [ ] **Printable reference cards** - Generate spell/item/condition cards with "print my character's spells" feature

### Community & Engagement
- [ ] **Session journal system** - Player-contributed campaign notes with auto-linking to rules/NPCs/locations
- [ ] **Rules change notifications** - RSS/email alerts when subscribed pages update (prevent outdated character sheets)
- [ ] **Rule voting/Q&A system** - Community proposes clarifications, votes on interpretations, builds organic FAQ

### Content Tools
- [ ] **Native random generators** - NPC, encounter, treasure generators using Varlyn-specific content (replace external links)
- [ ] **"Tonight's one-shot" generator** - Complete adventure generator with characters, encounters, and maps (reduce prep time)

### Content Management
- [ ] **Create content templates** - Standardize new campaign/class creation
- [ ] **Add content validation** - Check frontmatter and required fields
- [ ] **Implement automated content indexing** - Auto-update character/scenery data
- [ ] **Add changelog generation** - Auto-update from git commits
- [ ] **Create style guide** - Consistent content formatting

### Advanced Features
- [ ] **Add comment system** - Community feedback on rules/classes
- [ ] **Implement tag system** - Better content categorization
- [ ] **Add related content suggestions** - Cross-link similar content
- [ ] **Create API endpoints** - Structured data access for other tools
- [ ] **Add full-text search** - Search within content, not just titles
