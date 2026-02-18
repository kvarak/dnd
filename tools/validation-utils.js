/**
 * Shared utilities for Varlyn D&D validation tools
 *
 * Consolidates common patterns across lint-markdown.js and test-structure.js
 * following the simplification principle: reduce duplication
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class ValidationBase {
  constructor(options = {}) {
    this.errors = [];
    this.warnings = [];
    this.options = options;
    this.stats = {};
    this.quiet = options.quiet || false;
  }

  /**
   * Add error to collection
   */
  addError(message) {
    this.errors.push(message);
  }

  /**
   * Add warning to collection
   */
  addWarning(message) {
    this.warnings.push(message);
  }

  /**
   * Read file safely with error handling
   */
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      this.addError(`${filePath} - Could not read file: ${error.message}`);
      return null;
    }
  }

  /**
   * Get relative file path for cleaner messages
   */
  getRelativePath(filePath) {
    return path.relative(process.cwd(), filePath);
  }

  /**
   * Find files using glob patterns
   */
  async findFiles(patterns, ignore = ['node_modules/**', 'vendor/**', '_site/**', '.jekyll-cache/**']) {
    if (Array.isArray(patterns)) {
      // Direct file list (MVP mode)
      return patterns.filter(file => fs.existsSync(file));
    } else {
      // Glob pattern (full mode)
      return await glob(patterns, { ignore });
    }
  }

  /**
   * Log progress with emoji or dot based on quiet mode
   */
  logProgress(fileName, emoji = '📝') {
    if (this.quiet) {
      process.stdout.write('.');
    } else {
      console.log(`${emoji} Testing ${fileName}...`);
    }
  }

  /**
   * Exit with appropriate code
   */
  exit() {
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

class ValidationReporter {
  constructor(toolName, mode = '', options = {}) {
    this.toolName = toolName;
    this.mode = mode;
    this.quiet = options.quiet || false;
  }

  /**
   * Standard result reporting format
   */
  reportResults(validator, stats = {}) {
    // Add newline after dots if in quiet mode
    if (validator.quiet) {
      console.log('\n');
    }

    console.log('\n' + '='.repeat(60));
    console.log(`${this.toolName.toUpperCase()} RESULTS${this.mode ? ` ${this.mode}` : ''}`);
    console.log('='.repeat(60));

    // Show statistics if provided
    if (Object.keys(stats).length > 0) {
      console.log(`\n📊 STATISTICS:`);
      Object.entries(stats).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    // Show results
    if (validator.errors.length === 0 && validator.warnings.length === 0) {
      console.log('\n✅ All tests passed!');
      return;
    }

    if (validator.errors.length > 0) {
      console.log(`\n❌ ERRORS (${validator.errors.length}):`);
      validator.errors.forEach(error => console.log(`  ${error}`));
    }

    if (validator.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${validator.warnings.length}):`);
      validator.warnings.forEach(warning => console.log(`  ${warning}`));
    }

    console.log(`\nSummary: ${validator.errors.length} errors, ${validator.warnings.length} warnings`);

    if (validator.errors.length > 0) {
      console.log('❌ Validation failed - fix errors above');
    } else {
      console.log('✅ Validation passed - warnings are optional to fix');
    }
  }
}

/**
 * Parse command line arguments consistently
 */
function parseArgs(argv = process.argv.slice(2)) {
  const args = {
    help: argv.includes('--help') || argv.includes('-h'),
    fix: argv.includes('--fix'),
    mvp: argv.includes('--mvp') || argv.includes('--MVP'),
    full: argv.includes('--full'),
    verbose: argv.includes('--verbose') || argv.includes('-v'),
    quiet: argv.includes('--quiet') || argv.includes('-q')
  };

  // Default to MVP mode during development unless --full specified
  if (!args.full && !args.mvp) {
    args.mvp = true;
  }

  return args;
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract YAML frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  return frontmatterMatch ? frontmatterMatch[1] : null;
}

module.exports = {
  ValidationBase,
  ValidationReporter,
  parseArgs,
  escapeRegex,
  extractFrontmatter
};