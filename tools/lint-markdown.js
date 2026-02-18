#!/usr/bin/env node

/**
 * Markdown Linter for Varlyn D&D Site
 *
 * Validates markdown formatting, headings structure, and consistent styling
 * Exit codes: 0 = success, 1 = linting errors found
 */

const fs = require('fs');
const path = require('path');
const { ValidationBase, ValidationReporter, parseArgs } = require('./validation-utils');

class MarkdownLinter extends ValidationBase {
  constructor(options = {}) {
    super(options);
    this.ignorePatterns = this.loadIgnoreConfig();
    this.autoFix = options.autoFix || false;
    this.fixedFiles = new Set();
  }

  /**
   * Load ignore configuration from file or use defaults
   */
  loadIgnoreConfig() {
    const configPath = '.lintignore';
    const defaults = {
      // Ignore HTML detection warnings for specific files
      htmlDetected: [
        'docs/_Classes/alchemist.md:329',  // Specific line
        'docs/_Classes/*.md:*',            // All Classes files
        'docs/_Campaigns/*.md:*'           // All Campaign files
      ],
      // Ignore other warning types as needed
      brokenLinks: [],
      headingStructure: [],
      frontmatterIssues: []
    };

    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.log(`⚠️  Could not read ${configPath}, using defaults`);
    }

    return defaults;
  }

  /**
   * Check if a warning should be ignored
   */
  shouldIgnoreWarning(fileName, lineNum, warningType, message) {
    const patterns = this.ignorePatterns[warningType] || [];

    for (const pattern of patterns) {
      // Check exact file:line match
      if (pattern === `${fileName}:${lineNum}`) {
        return true;
      }

      // Check file:* wildcard match
      if (pattern.endsWith(':*') && fileName === pattern.slice(0, -2)) {
        return true;
      }

      // Check glob pattern match (e.g., docs/_Classes/*.md:*)
      if (pattern.includes('*')) {
        const [filePattern, linePattern] = pattern.split(':');
        const fileMatches = this.matchGlob(fileName, filePattern);
        const lineMatches = linePattern === '*' || linePattern === lineNum.toString();
        if (fileMatches && lineMatches) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Simple glob pattern matcher
   */
  matchGlob(str, pattern) {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(`^${regexPattern}$`).test(str);
  }

  /**
   * Auto-fix a markdown file
   */
  autoFixFile(filePath, lines) {
    let modified = false;
    const fixedLines = [...lines];

    // Fix trailing whitespace
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].endsWith(' ') || fixedLines[i].endsWith('\t')) {
        fixedLines[i] = fixedLines[i].trimEnd();
        modified = true;
      }
    }

    // Fix multiple consecutive blank lines
    for (let i = fixedLines.length - 1; i >= 2; i--) {
      if (fixedLines[i].trim() === '' &&
          fixedLines[i-1].trim() === '' &&
          fixedLines[i-2].trim() === '') {
        fixedLines.splice(i, 1);
        modified = true;
      }
    }

    // Fix mixed bold formatting (__ to **)
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes('__')) {
        const newLine = fixedLines[i].replace(/__([^_]+)__/g, '**$1**');
        if (newLine !== fixedLines[i]) {
          fixedLines[i] = newLine;
          modified = true;
        }
      }
    }

    // Fix mixed italic formatting (_ to * when not part of **)
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes('_') && !fixedLines[i].includes('**')) {
        const newLine = fixedLines[i].replace(/\b_([^_\s][^_]*[^_\s]|[^_\s])_\b/g, '*$1*');
        if (newLine !== fixedLines[i]) {
          fixedLines[i] = newLine;
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
      this.fixedFiles.add(path.relative(process.cwd(), filePath));
    }

    return fixedLines;
  }

  /**
   * Lint a single markdown file
   */
  lintFile(filePath) {
    const content = this.readFile(filePath);
    if (!content) return;

    let lines = content.split('\n');
    const fileName = this.getRelativePath(filePath);

    this.logProgress(fileName, this.autoFix ? '🔧' : '📝');

    // Apply auto-fixes if requested
    if (this.autoFix) {
      lines = this.autoFixFile(filePath, lines);
    }

    // Check heading structure
    this.checkHeadingStructure(lines, fileName);

    // Check frontmatter
    this.checkFrontmatter(lines, fileName);

    // Check markdown formatting
    this.checkMarkdownFormatting(lines, fileName);

    // Check for common issues
    this.checkCommonIssues(lines, fileName);
  }

  /**
   * Auto-fix a markdown file
   */
  autoFixFile(filePath, lines) {
    let modified = false;
    const fixedLines = [...lines];

    // Fix trailing whitespace
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].endsWith(' ') || fixedLines[i].endsWith('\t')) {
        fixedLines[i] = fixedLines[i].trimEnd();
        modified = true;
      }
    }

    // Fix multiple consecutive blank lines
    for (let i = fixedLines.length - 1; i >= 2; i--) {
      if (fixedLines[i].trim() === '' &&
          fixedLines[i-1].trim() === '' &&
          fixedLines[i-2].trim() === '') {
        fixedLines.splice(i, 1);
        modified = true;
      }
    }

    // Fix mixed bold formatting (__ to **)
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes('__')) {
        const newLine = fixedLines[i].replace(/__([^_]+)__/g, '**$1**');
        if (newLine !== fixedLines[i]) {
          fixedLines[i] = newLine;
          modified = true;
        }
      }
    }

    // Fix mixed italic formatting (_ to * when not part of **)
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes('_') && !fixedLines[i].includes('**')) {
        const newLine = fixedLines[i].replace(/\b_([^_\s][^_]*[^_\s]|[^_\s])_\b/g, '*$1*');
        if (newLine !== fixedLines[i]) {
          fixedLines[i] = newLine;
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
      this.fixedFiles.add(path.relative(process.cwd(), filePath));
    }

    return fixedLines;
  }

  /**
   * Check heading hierarchy (no skipping levels)
   */
  checkHeadingStructure(lines, fileName) {
    let lastHeadingLevel = 0;
    let inFrontmatter = false;
    let frontmatterEnded = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Track frontmatter boundaries
      if (line.trim() === '---') {
        if (!frontmatterEnded) {
          inFrontmatter = !inFrontmatter;
          if (!inFrontmatter) frontmatterEnded = true;
        }
        return;
      }

      // Skip frontmatter content
      if (inFrontmatter) return;

      // Check for headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2];

        // Check for level skipping
        if (level > lastHeadingLevel + 1) {
          const message = `Heading level skipped (h${lastHeadingLevel} → h${level}): ${title}`;
          if (!this.shouldIgnoreWarning(fileName, lineNum, 'headingStructure', message)) {
            this.errors.push(`${fileName}:${lineNum} - ${message}`);
          }
        }

        // Check for empty headings
        if (!title.trim()) {
          const message = 'Empty heading';
          if (!this.shouldIgnoreWarning(fileName, lineNum, 'headingStructure', message)) {
            this.errors.push(`${fileName}:${lineNum} - ${message}`);
          }
        }

        lastHeadingLevel = level;
      }
    });
  }

  /**
   * Check frontmatter format
   */
  checkFrontmatter(lines, fileName) {
    if (lines.length < 2 || lines[0].trim() !== '---') {
      const message = 'Missing frontmatter opening';
      if (!this.shouldIgnoreWarning(fileName, 1, 'frontmatterIssues', message)) {
        this.warnings.push(`${fileName}:1 - ${message}`);
      }
      return;
    }

    // Find frontmatter closing
    let frontmatterEnd = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        frontmatterEnd = i;
        break;
      }
    }

    if (frontmatterEnd === -1) {
      const message = 'Frontmatter not closed properly';
      if (!this.shouldIgnoreWarning(fileName, 0, 'frontmatterIssues', message)) {
        this.errors.push(`${fileName} - ${message}`);
      }
    }
  }

  /**
   * Check markdown formatting consistency
   */
  checkMarkdownFormatting(lines, fileName) {
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for trailing whitespace
      if (line.endsWith(' ') || line.endsWith('\t')) {
        const message = 'Trailing whitespace';
        if (!this.shouldIgnoreWarning(fileName, lineNum, 'formatting', message)) {
          this.warnings.push(`${fileName}:${lineNum} - ${message}`);
        }
      }

      // Check for inconsistent bold formatting
      if (line.includes('__') && line.includes('**')) {
        const message = 'Mixed bold formatting (use ** consistently)';
        if (!this.shouldIgnoreWarning(fileName, lineNum, 'formatting', message)) {
          this.warnings.push(`${fileName}:${lineNum} - ${message}`);
        }
      }

      // Check for inconsistent italic formatting
      if (line.includes('_') && line.includes('*') && !line.includes('**')) {
        const message = 'Mixed italic formatting (use * consistently)';
        if (!this.shouldIgnoreWarning(fileName, lineNum, 'formatting', message)) {
          this.warnings.push(`${fileName}:${lineNum} - ${message}`);
        }
      }

      // Check for multiple consecutive blank lines
      if (index > 0 && line.trim() === '' && lines[index - 1].trim() === '') {
        if (index > 1 && lines[index - 2].trim() === '') {
          const message = 'Multiple consecutive blank lines';
          if (!this.shouldIgnoreWarning(fileName, lineNum, 'formatting', message)) {
            this.warnings.push(`${fileName}:${lineNum} - ${message}`);
          }
        }
      }
    });
  }

  /**
   * Check for common issues
   */
  checkCommonIssues(lines, fileName) {
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for broken internal links
      const internalLinkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      if (internalLinkMatch) {
        internalLinkMatch.forEach(match => {
          const urlMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (urlMatch) {
            const url = urlMatch[2];
            // Check for common broken link patterns
            if (url.startsWith('#') && url.includes(' ')) {
              const message = `Anchor link with spaces: ${url}`;
              if (!this.shouldIgnoreWarning(fileName, lineNum, 'brokenLinks', message)) {
                this.warnings.push(`${fileName}:${lineNum} - ${message}`);
              }
            }
          }
        });
      }

      // Check for HTML in markdown (should be minimal)
      if (line.includes('<div') || line.includes('<span') || line.includes('<p>')) {
        if (!line.includes('<div class="toc"') && !line.includes('<div class="columns')) {
          const message = 'HTML detected, consider markdown alternative';
          if (!this.shouldIgnoreWarning(fileName, lineNum, 'htmlDetected', message)) {
            this.warnings.push(`${fileName}:${lineNum} - ${message}`);
          }
        }
      }
    });
  }

  /**
   * Run linter on all markdown files
   */
  async run() {
    const mode = this.autoFix ? 'Auto-Fix' : 'Linting';
    if (!this.quiet) {
      console.log(`🔍 Markdown ${mode} - ${this.autoFix ? 'Fixing and validating' : 'Validating'} markdown files...\n`);
    }

    // Find all markdown files
    const files = await this.findFiles('**/*.md');
    if (!this.quiet) {
      console.log(`Found ${files.length} markdown files\n`);
    }

    // Process each file
    files.forEach(file => this.lintFile(file));

    // Report results
    const reporter = new ValidationReporter(`📊 MARKDOWN ${mode.toUpperCase()}`, '', { quiet: this.quiet });
    const stats = {
      'Files processed': files.length
    };

    if (this.autoFix && this.fixedFiles.size > 0) {
      console.log(`\n🔧 FIXED FILES (${this.fixedFiles.size}):`);
      this.fixedFiles.forEach(file => console.log(`  ✅ ${file}`));
      stats['Files fixed'] = this.fixedFiles.size;
    }

    reporter.reportResults(this, stats);
    this.exit();
  }


}

// Run if called directly
if (require.main === module) {
  const args = parseArgs();
  const linter = new MarkdownLinter({
    autoFix: args.fix,
    quiet: args.quiet
  });
  linter.run().catch(console.error);
}

module.exports = MarkdownLinter;