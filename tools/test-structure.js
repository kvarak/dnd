#!/usr/bin/env node

/**
 * Structure Tester for Varlyn D&D Site
 *
 * Validates Varlyn-specific patterns:
 * - **TRAIT**. DESCRIPTION patterns in Folk files
 * - Frontmatter schema consistency
 * - TOC structure validation
 * - Internal linking patterns
 *
 * Exit codes: 0 = success, 1 = validation errors found
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { ValidationBase, ValidationReporter, parseArgs, escapeRegex, extractFrontmatter } = require('./validation-utils');

class StructureTester extends ValidationBase {
  constructor(options = {}) {
    super(options);
    this.mvpMode = options.mvpMode || false;
    this.stats = {
      folkFiles: 0,
      classFiles: 0,
      traitsValidated: 0,
      tocFiles: 0
    };
  }

  /**
   * Test a single Folk file for trait patterns and frontmatter
   */
  testFolkFile(filePath) {
    const content = this.readFile(filePath);
    if (!content) return;

    const fileName = this.getRelativePath(filePath);
    this.logProgress(fileName, '🧬');
    this.stats.folkFiles++;

    // Extract and parse frontmatter
    const frontmatter = this.parseFrontmatter(content, fileName);
    if (!frontmatter) return;

    // Validate frontmatter schema
    this.validateFolkFrontmatter(frontmatter, fileName);

    // Test trait patterns in markdown body
    this.validateTraitPatterns(content, frontmatter, fileName);
  }

  /**
   * Test a single Class file for archetype patterns and frontmatter
   */
  testClassFile(filePath) {
    const content = this.readFile(filePath);
    if (!content) return;

    const fileName = this.getRelativePath(filePath);
    this.logProgress(fileName, '⚔️ ');
    this.stats.classFiles++;

    // Extract and parse frontmatter
    const frontmatter = this.parseFrontmatter(content, fileName);
    if (!frontmatter) return;

    // Validate class-specific patterns
    this.validateClassStructure(content, fileName);

    // Validate archetype anchors if archetypes are defined
    if (frontmatter.profile && frontmatter.profile.archetypes) {
      this.validateArchetypeAnchors(content, frontmatter.profile.archetypes, fileName);
    }
  }

  /**
   * Extract and parse YAML frontmatter
   */
  parseFrontmatter(content, fileName) {
    const frontmatterText = extractFrontmatter(content);
    if (!frontmatterText) {
      this.addWarning(`${fileName} - No frontmatter found`);
      return null;
    }

    try {
      return yaml.load(frontmatterText);
    } catch (error) {
      this.addError(`${fileName} - Invalid YAML frontmatter: ${error.message}`);
      return null;
    }
  }

  /**
   * Validate Folk frontmatter schema
   */
  validateFolkFrontmatter(frontmatter, fileName) {
    if (!frontmatter.chardata) {
      this.addError(`${fileName} - Missing 'chardata' in frontmatter`);
      return;
    }

    const chardata = frontmatter.chardata;

    // Validate commonTraits
    if (chardata.commonTraits && !Array.isArray(chardata.commonTraits)) {
      this.addError(`${fileName} - 'commonTraits' must be an array`);
    }

    // Validate subtypes
    if (chardata.subtypes) {
      if (!Array.isArray(chardata.subtypes)) {
        this.addError(`${fileName} - 'subtypes' must be an array`);
      } else {
        chardata.subtypes.forEach((subtype, index) => {
          if (!subtype.id || typeof subtype.id !== 'string') {
            this.addError(`${fileName} - Subtype ${index}: missing or invalid 'id'`);
          }
          if (!subtype.traits || !Array.isArray(subtype.traits)) {
            this.addError(`${fileName} - Subtype ${subtype.id || index}: missing or invalid 'traits'`);
          }

          // Validate variants if present
          if (subtype.variants) {
            if (!Array.isArray(subtype.variants)) {
              this.addError(`${fileName} - Subtype ${subtype.id}: 'variants' must be an array`);
            } else {
              subtype.variants.forEach((variant, vIndex) => {
                if (!variant.id || !variant.name) {
                  this.addError(`${fileName} - Subtype ${subtype.id}, variant ${vIndex}: missing 'id' or 'name'`);
                }
              });
            }
          }
        });
      }
    }

    // Validate classOptions
    if (chardata.classOptions) {
      if (!Array.isArray(chardata.classOptions)) {
        this.addError(`${fileName} - 'classOptions' must be an array`);
      } else {
        chardata.classOptions.forEach((option, index) => {
          if (!option.class || !option.summary) {
            this.addError(`${fileName} - Class option ${index}: missing 'class' or 'summary'`);
          }
        });
      }
    }
  }

  /**
   * Validate trait description patterns in markdown
   */
  validateTraitPatterns(content, frontmatter, fileName) {
    const chardata = frontmatter.chardata;
    if (!chardata) return;

    const allTraits = new Set();

    // Collect all trait names that should have descriptions
    if (chardata.commonTraits) {
      chardata.commonTraits.forEach(trait => allTraits.add(trait));
    }

    if (chardata.subtypes) {
      chardata.subtypes.forEach(subtype => {
        if (subtype.traits) {
          subtype.traits.forEach(trait => allTraits.add(trait));
        }
      });
    }

    // Validate each trait has a proper description pattern
    allTraits.forEach(traitName => {
      const pattern = new RegExp(`-\\s*\\*\\*${escapeRegex(traitName)}\\*\\*[.:]`, 'i');
      if (!pattern.test(content)) {
        this.addError(`${fileName} - Missing trait description pattern for: **${traitName}**`);
      } else {
        this.stats.traitsValidated++;
      }
    });
  }

  /**
   * Validate class structure patterns
   */
  validateClassStructure(content, fileName) {
    // Check for hit dice pattern
    if (!content.includes('Hit Die:') && !content.includes('hit die')) {
      this.addWarning(`${fileName} - No hit die information found`);
    }

    // Check for archetype/subclass sections
    const archetypePatterns = [
      /##\s+.*Archetype/i,
      /##\s+.*Path/i,
      /##\s+.*College/i,
      /##\s+.*Domain/i,
      /##\s+.*School/i,
      /##\s+.*Circle/i,
      /##\s+.*Order/i
    ];

    const hasArchetypes = archetypePatterns.some(pattern => pattern.test(content));
    if (!hasArchetypes) {
      this.addWarning(`${fileName} - No archetype sections detected`);
    }
  }

  /**
   * Convert kebab-case to camelCase
   * Examples: "champion" -> "champion", "eldritch-knight" -> "eldritchKnight"
   */
  kebabToCamelCase(str) {
    const parts = str.split('-');
    return parts[0] + parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }

  /**
   * Validate that archetype anchors match the expected camelCase format
   * based on frontmatter archetype keys
   */
  validateArchetypeAnchors(content, archetypes, fileName) {
    Object.keys(archetypes).forEach(archetypeKey => {
      const expectedAnchor = this.kebabToCamelCase(archetypeKey);

      // Check for the anchor definition in the content
      const anchorPattern = new RegExp(`name="internal-${escapeRegex(expectedAnchor)}"`, 'i');
      if (!anchorPattern.test(content)) {
        this.addError(
          `${fileName} - Missing or incorrect anchor for archetype '${archetypeKey}'. ` +
          `Expected: name="internal-${expectedAnchor}"`
        );
      }

      // Check for TOC links to this archetype
      const tocLinkPattern = new RegExp(`href="#internal-${escapeRegex(expectedAnchor)}"`, 'i');
      if (!tocLinkPattern.test(content)) {
        this.addWarning(
          `${fileName} - No TOC link found for archetype '${archetypeKey}'. ` +
          `Expected: href="#internal-${expectedAnchor}"`
        );
      }
    });
  }

  /**
   * Test TOC consistency in _Rules files
   */
  testTocFile(filePath) {
    const content = this.readFile(filePath);
    if (!content) return;

    const fileName = this.getRelativePath(filePath);
    this.logProgress(fileName, '📚');
    this.stats.tocFiles++;

    // Check for TOC div structure
    if (!content.includes('<div class="toc">')) {
      this.addWarning(`${fileName} - Missing TOC div structure`);
      return;
    }

    // Validate internal links
    const internalLinks = content.match(/href="#[^"]+"/g) || [];
    internalLinks.forEach(link => {
      const anchor = link.match(/href="#([^"]+)"/)[1];
      // Check if corresponding anchor exists
      const anchorPattern = new RegExp(`<a[^>]*name="${escapeRegex(anchor)}"`, 'i');
      if (!anchorPattern.test(content)) {
        this.addWarning(`${fileName} - TOC link to missing anchor: #${anchor}`);
      }
    });
  }

  /**
   * Get file patterns based on mode
   */
  getFilePatterns() {
    if (this.mvpMode) {
      return {
        folk: [
          'docs/_Folk/human.md',
          'docs/_Folk/elf.md',
          'docs/_Folk/tiefling.md'
        ],
        classes: [
          'docs/_Classes/fighter.md',
          'docs/_Classes/wizard.md',
          'docs/_Classes/cursed.md'
        ],
        toc: [
          'docs/_Rules/toc.md',
          'docs/_Folk/toc.md',
          'docs/_Classes/toc.md'
        ].filter(file => fs.existsSync(file))
      };
    } else {
      return {
        folk: 'docs/_Folk/*.md',
        classes: 'docs/_Classes/*.md',
        toc: 'docs/**/*toc*.md'
      };
    }
  }
  /**
   * Run structure tests on all relevant files
   */
  async run() {
    const mode = this.mvpMode ? 'MVP (3+3+TOC)' : 'Full Dataset';
    if (!this.quiet) {
      console.log(`🔬 Structure Tester - Validating Varlyn patterns [${mode}]...\n`);
    }

    const patterns = this.getFilePatterns();

    // Test Folk files
    const folkFiles = await this.findFiles(patterns.folk);
    if (!this.quiet) {
      console.log(`Found ${folkFiles.length} Folk files ${this.mvpMode ? '(MVP scope)' : ''}\n`);
    }
    folkFiles.forEach(file => this.testFolkFile(file));

    // Test Class files
    const classFiles = await this.findFiles(patterns.classes);
    if (!this.quiet) {
      console.log(`\nFound ${classFiles.length} Class files ${this.mvpMode ? '(MVP scope)' : ''}\n`);
    }
    classFiles.forEach(file => this.testClassFile(file));

    // Test TOC files
    const tocFiles = await this.findFiles(patterns.toc);
    if (!this.quiet) {
      console.log(`\nFound ${tocFiles.length} TOC files ${this.mvpMode ? '(MVP scope)' : ''}\n`);
    }
    tocFiles.forEach(file => this.testTocFile(file));

    // Report results
    const reporter = new ValidationReporter('🔬 STRUCTURE TESTING', this.mvpMode ? '(MVP MODE)' : '', { quiet: this.quiet });
    const stats = {
      [`Mode`]: this.mvpMode ? 'MVP (3+3+TOC files)' : 'Full dataset',
      'Folk files tested': this.stats.folkFiles,
      'Class files tested': this.stats.classFiles,
      'TOC files tested': this.stats.tocFiles,
      'Trait patterns validated': this.stats.traitsValidated
    };
    reporter.reportResults(this, stats);
    this.exit();
  }


}

// Run if called directly
if (require.main === module) {
  const args = parseArgs();
  const tester = new StructureTester({
    mvpMode: args.mvp,
    quiet: args.quiet
  });
  tester.run().catch(console.error);
}

module.exports = StructureTester;