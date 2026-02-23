# Modular CSS Architecture

## Overview

CSS is now organized by **functionality** rather than by page. Each page loads only the components it needs, reducing bloat and improving maintainability.

## Available Modules

### DataTables Components
**Use when**: Page has DataTable with enhanced search
- `datatables-enhanced.css` (86 lines) - Enhanced search field styling
- `datatables-dark.css` (94 lines) - Dark mode for tables and search

### Pills System
**Use when**: Page has pill-based filtering (levels, classes, archetypes)
- `pills.css` (188 lines) - All pill components
- `pills-dark.css` (108 lines) - Dark mode for pills
- `class-colors.css` (60 lines) - Class color gradients (required for class pills)

### Advanced Filters
**Use when**: Page has collapsible advanced filter panel (spells-specific)
- `filters-advanced.css` (65 lines) - Filter panel, tags, badges
- `filters-advanced-dark.css` (48 lines) - Dark mode for filters

### Page-Specific
**Use when**: Building spells-like page with favorites/modals
- `spells-page.css` (111 lines) - Favorite button, modals, print styles
- `spells-page-dark.css` (96 lines) - Dark mode for page-specific elements

## Usage Examples

### Simple DataTable Page (Equipment)
```html
<!-- Example: equipment.html - basic DataTables with dark mode -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/datatables-dark.css"/>
```
**Impact**: 2.3K CSS (vs 738 lines if using all spells modules)

### DataTable with Enhanced Search
```html
<!-- For pages needing custom search field styling -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/datatables-enhanced.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/datatables-dark.css"/>
```

### Page with Pills Only
```html
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/pills.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/class-colors.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/pills-dark.css"/>
```

### Full Spells Page
```html
<!-- DataTables -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/datatables-enhanced.css"/>
<!-- Pills -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/pills.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/class-colors.css"/>
<!-- Advanced Filters -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/filters-advanced.css"/>
<!-- Page-specific -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/spells-page.css"/>

<!-- Dark mode overrides -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/datatables-dark.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/pills-dark.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/filters-advanced-dark.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/spells-page-dark.css"/>
```

### Questionnaire Page (if it used pills)
```html
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/pills.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/class-colors.css"/>
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/pills-dark.css"/>
<!-- Plus questionnaire-specific CSS if needed -->
```

## Architecture Benefits

### 1. Separation of Concerns ✅
- Each module handles ONE responsibility
- DataTables styling separate from pill system
- Theme (dark mode) separate from component logic

### 2. Reduced Complexity ✅
- Smaller files easier to understand (48-188 lines vs 700+ lines)
- Clear dependencies between modules
- Each file well-documented with section headers

### 3. Eliminated Waste ✅
- Pages load only what they use
- No more loading 700 lines of spells CSS on non-spell pages
- Reduced CSS parsing time

### 4. Better Reusability ✅
- Pills system can be used on ANY page with filtering
- DataTables enhancements portable to other table pages
- Class colors shared across site

## File Size Comparison

**Before refactoring:**
- `spells-enhanced.css`: 694 lines (mixed light/dark, all components)
- `spells.css`: 44 lines (duplicate dark mode)
- Total: 738 lines monolithic

**After refactoring:**
- 8 modular files totaling 856 lines (+16% for better organization)
- But pages load only what they need (average 300-400 lines vs 738)
- Clear separation enables future optimization

## Migration Guide

To add pill filtering to a new page:
1. Include `pills.css` for component styles
2. Include `class-colors.css` if using class pills
3. Include `pills-dark.css` for dark mode support
4. Use existing pill classes: `.level-pill`, `.class-pill`, `.archetype-pill`, `.filter-pill`

To add DataTables to a new page:
1. Include DataTables library CSS
2. Include `datatables-enhanced.css` for improved search field
3. Include `datatables-dark.css` for dark mode support

## Maintenance

- **Light mode styles**: Edit the base CSS file (e.g., `pills.css`)
- **Dark mode styles**: Edit the `-dark.css` variant (e.g., `pills-dark.css`)
- **New component**: Create new module pair (component.css + component-dark.css)
- **Cross-cutting feature**: Add to appropriate existing module or create shared module

## Future Improvements

Consider further splitting if:
- A module exceeds 200 lines → Look for sub-responsibilities
- Multiple pages need PART of a module → Extract common subset
- Performance issues → Inline critical CSS, defer non-critical
