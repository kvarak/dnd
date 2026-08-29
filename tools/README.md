# Tools Directory

This directory contains development utilities for the Varlyn D&D site.

## Available Tools

### Validation & Testing
- `lint-markdown.js` - Validates markdown formatting, headings structure, and consistent styling
- `test-structure.js` - Validates Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency
- `validate-class-profiles.js` - Validates class profile YAML schemas and trait definitions

### Content Management
- `extract-searchable.rb` - Extracts searchable content for site search functionality
- `extract-archetypes.rb` - Extracts archetypes from class files to `_data/archetypes.yml`
- `extract-folk.rb` - Extracts folk and subtypes to `_data/folk.yml`

### Supporting Files
- `validation-utils.js` - Shared validation utilities used by multiple tools

## Usage

All tools are callable from the Makefile:

```bash
make lint-md             # Run markdown linter
make test-structure      # Run structure validation
make validate-profiles   # Validate class profile schemas
make test                # Run all validation tools
make test-verbose        # Run validation with detailed output
make extract             # Extract searchable content, archetypes, and folk
```

### Direct Tool Usage

```bash
# Validation (Node.js)
node tools/validate-class-profiles.js   # Validate class profile schemas
node tools/lint-markdown.js             # Lint markdown files
node tools/test-structure.js            # Test Varlyn structure patterns

# Content Management (Ruby)
ruby tools/extract-searchable.rb        # Extract searchable content for site search
ruby tools/extract-archetypes.rb        # Extract archetypes from class files
ruby tools/extract-folk.rb             # Extract folk and subtypes
```

## Development

Tools are written in Node.js and Ruby and should follow these conventions:
- Exit code 0 for success, non-zero for failure
- Clear error messages with file/line references
- Progress indicators for long-running operations
- Consistent output formatting

### Tool Categories
- **Ruby tools**: Content extraction (extract-searchable, extract-archetypes, extract-folk)
- **Node.js tools**: Validation and structure testing (lint, validate, test-structure)

All tools are designed to work within the Docker-based development environment defined in the Makefile.