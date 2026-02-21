#!/usr/bin/env node

/**
 * Class Profile Validator
 *
 * Validates that class files have correct `profile` frontmatter structure
 * according to the class-profile-template.md schema.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadValidValuesFromTemplate() {
  // With the new traits structure, we no longer need to parse the template
  // Validation is now just checking that traits arrays exist and are non-empty
  return {};
}

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  try {
    return yaml.load(frontmatterMatch[1]);
  } catch (error) {
    throw new Error(`Invalid YAML in frontmatter: ${error.message}`);
  }
}

function validateProfile(profile, filename, validValues) {
  const errors = [];

  if (!profile) {
    return ['No profile field found in frontmatter'];
  }

  // Validate traits array (new structure)
  if (!profile.traits) {
    errors.push('Missing traits array in profile');
  } else if (!Array.isArray(profile.traits)) {
    errors.push('traits field must be an array');
  } else if (profile.traits.length === 0) {
    errors.push('traits array cannot be empty');
  }

  // Validate archetypes (optional)
  if (profile.archetypes) {
    if (typeof profile.archetypes !== 'object') {
      errors.push('archetypes must be an object');
    } else {
      for (const [archetypeName, archetype] of Object.entries(profile.archetypes)) {
        // Validate archetype traits
        if (archetype.traits) {
          if (!Array.isArray(archetype.traits)) {
            errors.push(`traits field in archetype ${archetypeName} must be an array`);
          } else if (archetype.traits.length === 0) {
            errors.push(`traits array in archetype ${archetypeName} cannot be empty`);
          }
        } else {
          errors.push(`Archetype ${archetypeName} missing traits array`);
        }
      }
    }
  }

  return errors;
}

/**
 * Convert archetype key to expected anchor name based on naming convention:
 * - Single-word archetypes → lowercase: internal-champion
 * - Multi-word archetypes → camelCase: internal-eldritchKnight
 */
function archetypeKeyToAnchor(archetypeKey) {
  // Split by hyphen to get words
  const words = archetypeKey.split('-');

  if (words.length === 1) {
    // Single word: lowercase
    return `internal-${words[0].toLowerCase()}`;
  } else {
    // Multi-word: camelCase (first word lowercase, rest capitalized)
    const camelCase = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    return `internal-${camelCase}`;
  }
}

function validateArchetypeAnchors(profile, content, filename) {
  const errors = [];

  if (!profile || !profile.archetypes) {
    return errors;
  }

  for (const [archetypeKey, archetype] of Object.entries(profile.archetypes)) {
    const expectedAnchor = archetypeKeyToAnchor(archetypeKey);

    // Check if anchor exists in TOC
    const tocAnchorPattern = new RegExp(`href="#${expectedAnchor}"`, 'i');
    if (!tocAnchorPattern.test(content)) {
      errors.push(`Archetype "${archetypeKey}" missing TOC anchor "${expectedAnchor}" (convention: single-word=lowercase, multi-word=camelCase)`);
      continue;
    }

    // Check if anchor definition exists
    const anchorDefPattern = new RegExp(`name="${expectedAnchor}"`, 'i');
    if (!anchorDefPattern.test(content)) {
      errors.push(`Archetype "${archetypeKey}" missing anchor definition name="${expectedAnchor}"`);
    }
  }

  return errors;
}

function validateClassFile(filePath, validValues) {
  const filename = path.basename(filePath);
  console.log(`Validating ${filename}...`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) {
      console.log(`  ⚠️  No frontmatter found`);
      return false;
    }

    const errors = validateProfile(frontmatter.profile, filename, validValues);

    // Validate archetype anchor naming convention
    const anchorErrors = validateArchetypeAnchors(frontmatter.profile, content, filename);
    errors.push(...anchorErrors);

    if (errors.length === 0) {
      console.log(`  ✅ Profile valid`);
      return true;
    } else {
      console.log(`  ❌ Profile validation errors:`);
      errors.forEach(error => console.log(`     • ${error}`));
      return false;
    }

  } catch (error) {
    console.log(`  ❌ Error reading file: ${error.message}`);
    return false;
  }
}

function main() {
  try {
    const validValues = loadValidValuesFromTemplate();
    console.log(`Loaded validation schema from template with ${Object.keys(validValues).length} trait categories`);

    const classesDir = path.join(__dirname, '..', 'docs', '_Classes');

    if (!fs.existsSync(classesDir)) {
      console.error(`Classes directory not found: ${classesDir}`);
      process.exit(1);
    }

    const classFiles = fs.readdirSync(classesDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(classesDir, file));

    if (classFiles.length === 0) {
      console.log('No class files found');
      process.exit(1);
    }

    console.log(`Found ${classFiles.length} class files`);
    console.log();

    let validCount = 0;
    let totalCount = 0;

    for (const filePath of classFiles) {
      totalCount++;
      if (validateClassFile(filePath, validValues)) {
        validCount++;
      }
      console.log();
    }

    console.log(`Summary: ${validCount}/${totalCount} classes have valid profiles`);

    if (validCount < totalCount) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateProfile, extractFrontmatter, loadValidValuesFromTemplate };