# Tools Directory

This directory contains development utilities for the Varlyn D&D site.

## Available Tools

### Core Analysis Tools
- `analyze_class_bias.rb` - Analyzes class bias in questionnaire to identify over/under-represented classes
- `analyze_archetype_bias.rb` - Analyzes archetype-level bias across the questionnaire system
- `trait-analysis.rb` - Comprehensive trait relationship analysis, generates HTML reports

### Validation & Testing
- `lint-markdown.js` - Validates markdown formatting, headings structure, and consistent styling
- `test-structure.js` - Validates Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency
- `validate-class-profiles.js` - Validates class profile YAML schemas and trait definitions
- `validate-question-bank.js` - Validates question bank structure and trait coverage
- `test-class-scoring.js` - Tests class recommendation scoring algorithm
- `test-ranking-system.js` - Tests class recommendation ranking and explanations

### Class Recommendation System
- `class-scoring-algorithm.js` - Core scoring logic for class recommendations
- `class-recommendation-ranking.js` - Implements class recommendation algorithm based on question responses
- `analyze-question-traits.js` - Analyzes relationships between questions and traits

### Content Management
- `extract-searchable.rb` - Extracts searchable content for site search functionality

### Supporting Files
- `validation-utils.js` - Shared validation utilities used by multiple tools
- `class-profile-template.md` - Template and schema for class profile validation

## Usage

All tools are callable from the Makefile:

```bash
# Validation & Testing
make lint-md                # Run markdown linter
make test-structure          # Run structure validation
make validate-profiles       # Validate class profile schemas
make validate-questions      # Validate question bank structure
make test                   # Run all validation tools
make test-verbose           # Run validation with detailed output

# Analysis & Scoring
make analyze-question-traits # Analyze question trait relationships
make test-class-scoring     # Test class scoring algorithm
make test-ranking-system    # Test recommendation ranking

# Content Management
make extract               # Extract searchable content
```

### Direct Tool Usage

```bash
# Core Analysis (Ruby)
ruby tools/analyze_class_bias.rb                    # Analyze class bias across questionnaire
ruby tools/analyze_archetype_bias.rb                # Analyze archetype-level bias
ruby tools/trait-analysis.rb                        # Generate comprehensive trait analysis report

# Validation (Node.js)
node tools/validate-class-profiles.js               # Validate class profile schemas
node tools/validate-question-bank.js                # Validate question bank structure
node tools/lint-markdown.js                         # Lint markdown files
node tools/test-structure.js                        # Test Varlyn structure patterns

# Testing & Analysis (Node.js)
node tools/test-class-scoring.js                    # Test scoring algorithm
node tools/test-ranking-system.js                   # Test ranking system
node tools/analyze-question-traits.js               # Analyze question-trait relationships

# Content Management (Ruby)
ruby tools/extract-searchable.rb                    # Extract searchable content for site search
```

## Development

Tools are written in Node.js and Ruby and should follow these conventions:
- Exit code 0 for success, non-zero for failure
- Clear error messages with file/line references
- Progress indicators for long-running operations
- Consistent output formatting

### Tool Categories
- **Ruby tools**: Core analysis and content extraction (trait-analysis, class bias, extract-searchable)
- **Node.js tools**: Validation, testing, and scoring (lint, validate, test-*)
- **Supporting files**: Templates and utilities for shared functionality

All tools are designed to work within the Docker-based development environment defined in the Makefile.