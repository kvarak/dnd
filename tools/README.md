# Tools Directory

This directory contains development utilities for the Varlyn D&D site.

## Available Tools

### Validation & Testing
- `lint-markdown.js` - Validates markdown formatting, headings structure, and consistent styling
- `test-structure.js` - Validates Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency

### Content Management
- `extract-searchable.rb` - Extracts searchable content for site search functionality

### Supporting Files
- `validation-utils.js` - Shared validation utilities used by multiple tools

## Usage

All tools are callable from the Makefile:

```bash
make lint-md             # Run markdown linter
make test-structure      # Run structure validation
make test                # Run all validation tools
make test-verbose        # Run validation with detailed output
make extract             # Extract searchable content
```

### Direct Tool Usage

```bash
# Validation (Node.js)
node tools/lint-markdown.js             # Lint markdown files
node tools/test-structure.js            # Test Varlyn structure patterns

# Content Management (Ruby)
ruby tools/extract-searchable.rb        # Extract searchable content for site search
```

## Development

Tools are written in Node.js and Ruby and should follow these conventions:
- Exit code 0 for success, non-zero for failure
- Clear error messages with file/line references
- Progress indicators for long-running operations
- Consistent output formatting

### Tool Categories
- **Ruby tools**: Content extraction (extract-searchable)
- **Node.js tools**: Validation and structure testing (lint, test-structure)

All tools are designed to work within the Docker-based development environment defined in the Makefile.