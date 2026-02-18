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
  const templatePath = path.join(__dirname, 'class-profile-template.md');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const validValues = {};

  // Parse each trait category section
  const sections = templateContent.split(/^###\s+(.+)$/m);

  for (let i = 1; i < sections.length; i += 2) {
    const categoryName = sections[i].trim();
    const categoryContent = sections[i + 1];

    if (categoryContent) {
      // Extract valid values from bullet points: - **value**: description
      const values = [];
      const bulletPoints = categoryContent.match(/^-\s+\*\*(.+?)\*\*/gm);

      if (bulletPoints) {
        for (const bullet of bulletPoints) {
          const match = bullet.match(/^-\s+\*\*(.+?)\*\*/);
          if (match) {
            values.push(match[1]);
          }
        }
      }

      // Handle special case for originBackground (array values)
      if (categoryName === 'originBackground') {
        // Extract array values from description
        const arrayMatch = categoryContent.match(/Array of likely character backgrounds.*?:\s*\n((?:\s*-\s+\*\*.+?\*\*.*\n)*)/s);
        if (arrayMatch) {
          const arrayValues = [];
          const arrayBullets = arrayMatch[1].match(/\*\*(.+?)\*\*/g);
          if (arrayBullets) {
            for (const bullet of arrayBullets) {
              const value = bullet.replace(/\*\*/g, '');
              arrayValues.push(value);
            }
          }
          validValues[categoryName] = arrayValues;
        }
      } else if (values.length > 0) {
        validValues[categoryName] = values;
      }
    }
  }

  return validValues;
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

  // Validate generic traits
  if (!profile.generic) {
    errors.push('Missing generic traits object');
  } else {
    const generic = profile.generic;

    // Check required generic fields
    for (const [field, validFieldValues] of Object.entries(validValues)) {
      if (field === 'originBackground') {
        // originBackground is an array
        if (!generic[field]) {
          errors.push(`Missing required generic field: ${field}`);
        } else if (!Array.isArray(generic[field])) {
          errors.push(`Field ${field} must be an array`);
        } else {
          // Check each value in the array
          for (const value of generic[field]) {
            if (!validFieldValues.includes(value)) {
              errors.push(`Invalid value "${value}" for ${field}. Valid values: ${validFieldValues.join(', ')}`);
            }
          }
        }
      } else {
        // Other fields are single values
        if (!generic[field]) {
          errors.push(`Missing required generic field: ${field}`);
        } else if (!validFieldValues.includes(generic[field])) {
          errors.push(`Invalid value "${generic[field]}" for ${field}. Valid values: ${validFieldValues.join(', ')}`);
        }
      }
    }
  }

  // Validate specific traits
  if (!profile.specific) {
    errors.push('Missing specific traits array');
  } else if (!Array.isArray(profile.specific)) {
    errors.push('specific field must be an array');
  } else if (profile.specific.length === 0) {
    errors.push('specific array cannot be empty');
  }

  // Validate archetypes (optional)
  if (profile.archetypes) {
    if (typeof profile.archetypes !== 'object') {
      errors.push('archetypes must be an object');
    } else {
      for (const [archetypeName, archetype] of Object.entries(profile.archetypes)) {
        if (archetype.generic) {
          // Validate archetype generic overrides
          for (const [field, value] of Object.entries(archetype.generic)) {
            if (!validValues[field]) {
              errors.push(`Unknown generic field "${field}" in archetype ${archetypeName}`);
            } else if (field === 'originBackground') {
              if (!Array.isArray(value)) {
                errors.push(`Field ${field} in archetype ${archetypeName} must be an array`);
              } else {
                for (const v of value) {
                  if (!validValues[field].includes(v)) {
                    errors.push(`Invalid value "${v}" for ${field} in archetype ${archetypeName}`);
                  }
                }
              }
            } else if (!validValues[field].includes(value)) {
              errors.push(`Invalid value "${value}" for ${field} in archetype ${archetypeName}`);
            }
          }
        }

        if (archetype.specific && !Array.isArray(archetype.specific)) {
          errors.push(`specific field in archetype ${archetypeName} must be an array`);
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