# Tools Directory

This directory contains development utilities for the Varlyn D&D site.

## Available Tools

- `lint-markdown.js` - Validates markdown formatting, headings structure, and consistent styling
- `test-structure.js` - Validates Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency

## Usage

All tools are callable from the Makefile:

```bash
# Individual tools
make lint-md          # Run markdown linter
make test-structure   # Run structure validation

# Run all tests
make test             # Runs all text validation tools in sequence
```

## Development

Tools are written in Node.js and should follow these conventions:
- Exit code 0 for success, non-zero for failure
- Clear error messages with file/line references
- Progress indicators for long-running operations
- JSON output option for CI integration