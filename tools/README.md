# Tools Directory

This directory contains development utilities for the Varlyn D&D site.

## Available Tools

### Linting & Validation
- `lint-markdown.js` - Validates markdown formatting, headings structure, and consistent styling
- `test-structure.js` - Validates Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency
- `validate-class-profiles.js` - Validates class profile YAML schemas and trait definitions

### Analysis & Reporting
- `trait-analysis.rb` - Analyzes trait relationships, archetypes, and questions to identify consolidation opportunities
- `all-traits.sh` - Lists all unique traits with usage counts across all classes
- `low-trait-archetypes.rb` - Shows archetypes with few traits (useful for consolidation planning)

### Class System Tools
- `class-recommendation-ranking.js` - Implements class recommendation algorithm based on question responses
- `analyze-question-traits.js` - Analyzes relationships between questions and traits

## Usage

All tools are callable from the Makefile:

```bash
# Individual tools
make lint-md          # Run markdown linter
make test-structure   # Run structure validation
make validate-profiles # Validate all class profiles

# Run all tests
make test             # Runs all text validation tools in sequence
```

### Direct Tool Usage

```bash
# Analysis tools
./tools/all-traits.sh                    # List all traits with usage counts
ruby tools/trait-analysis.rb             # Generate comprehensive trait analysis report
ruby tools/low-trait-archetypes.rb       # Show archetypes with ≤3 traits (default)
ruby tools/low-trait-archetypes.rb 2     # Show archetypes with ≤2 traits
ruby tools/low-trait-archetypes.rb 1     # Show archetypes with ≤1 trait

# Validation tools
node tools/validate-class-profiles.js    # Validate class profile schemas
node tools/lint-markdown.js              # Lint markdown files
```

## Development

Tools are written in Node.js and should follow these conventions:
- Exit code 0 for success, non-zero for failure
- Clear error messages with file/line references
- Progress indicators for long-running operations
- JSON output option for CI integration