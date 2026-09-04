# Tools Directory

This directory contains development utilities for the Varlyn D&D site.

## Available Tools

### Validation & Testing
- `lint-markdown.js` - Validates markdown formatting, headings structure, and consistent styling
- `test-structure.js` - Validates Varlyn-specific patterns like `**TRAIT**. DESCRIPTION`, frontmatter schema, TOC consistency

### Content Management
- `extract-searchable.rb` - Extracts searchable content for site search functionality
  - Core mechanism: `extract_doc_headings` walks every plain markdown heading
    (any level, any file under `docs/_*/`) and indexes it as its own search
    entry - no per-content-type markup or file-specific parsing required.
    Only plain `#` ATX headings are matched (not raw `<h1>-<h6>` HTML tags);
    content still using raw HTML headings must be reformatted to markdown to
    be indexed (see e.g. the Paladin Oaths conversion).
  - Content-specific parsers remain only for genuinely non-heading shapes that
    also serve a real UX/layout purpose: skills (`<details>` accordion - a
    real collapsible UI feature) and familiars (name sits inside a
    `<table><th>` used for monster-stat-block card styling, not a heading).
  - Table row data (e.g. the deity pantheon tables) is intentionally NOT
    indexed - a table row isn't an unconverted heading, it's a different data
    shape, and indexing it isn't worth a bespoke parser for that content.
  - Known limitation: a heading with no explicit `<a name="x">` anchor and
    containing *other* incidental HTML (e.g. a bare `<a href="#...">` TOC
    link) gets a clean slugified anchor guess, which can differ from the
    site's auto-generated id for that edge case. Affects only the entry's
    in-page scroll target, not which page it links to.

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