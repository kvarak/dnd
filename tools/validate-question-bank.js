#!/usr/bin/env node

/**
 * Question Bank Validator
 *
 * Validates that the question bank properly covers all trait categories
 * and follows the expected structure for the recommendation engine.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadQuestionBank() {
  const questionBankPath = path.join(__dirname, '..', '_data', 'question-bank.yml');

  if (!fs.existsSync(questionBankPath)) {
    throw new Error(`Question bank file not found: ${questionBankPath}`);
  }

  const yamlContent = fs.readFileSync(questionBankPath, 'utf8');
  return yaml.load(yamlContent);
}

function loadTraitCategoriesFromTemplate() {
  const templatePath = path.join(__dirname, 'class-profile-template.md');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const traitCategories = new Set();

  // Extract trait category names from template headings
  const categoryMatches = templateContent.match(/^### (.+)$/gm);
  if (categoryMatches) {
    for (const match of categoryMatches) {
      const category = match.replace('### ', '').trim();
      // Convert to camelCase format used in profiles
      const camelCase = category.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      traitCategories.add(camelCase);
    }
  }

  return Array.from(traitCategories);
}

function loadSpecificTraitsFromClassProfiles() {
  const classesDir = path.join(__dirname, '..', 'docs', '_Classes');
  const specificTraits = new Set();

  try {
    // Find all class markdown files
    const classFiles = fs.readdirSync(classesDir).filter(file => file.endsWith('.md'));

    for (const classFile of classFiles) {
      try {
        const filePath = path.join(classesDir, classFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Extract YAML frontmatter
        const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]);

          // Extract specific traits from profile
          if (frontmatter?.profile?.specific) {
            for (const trait of frontmatter.profile.specific) {
              specificTraits.add(trait);
            }
          }

          // Extract archetype-specific traits
          if (frontmatter?.profile?.archetypes) {
            for (const archetype of Object.values(frontmatter.profile.archetypes)) {
              if (archetype.specific) {
                for (const trait of archetype.specific) {
                  specificTraits.add(trait);
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not parse ${classFile}: ${error.message}`);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read classes directory: ${error.message}`);
  }

  return Array.from(specificTraits).sort();
}

function validateAnswerStructure(question) {
  const errors = [];
  const requiredAnswers = ['yes', 'maybe', 'no', 'dont-know'];

  if (!question.answers || typeof question.answers !== 'object') {
    errors.push('Missing or invalid answers object');
    return errors;
  }

  // Check all required answer options exist
  for (const answerType of requiredAnswers) {
    if (!(answerType in question.answers)) {
      errors.push(`Missing required answer option: ${answerType}`);
    }
  }

  // Check answer structure
  for (const [answerType, traitMappings] of Object.entries(question.answers)) {
    if (!requiredAnswers.includes(answerType)) {
      errors.push(`Invalid answer option: ${answerType}`);
    }

    if (typeof traitMappings !== 'object') {
      errors.push(`Answer ${answerType} must be an object mapping traits to values`);
    }
  }

  return errors;
}

function validateTraitCoverage(questionBank, requiredTraits) {
  const traitCoverage = {};
  const questionsByTrait = {};

  // Initialize coverage tracking
  for (const trait of requiredTraits) {
    traitCoverage[trait] = 0;
    questionsByTrait[trait] = [];
  }

  // Count coverage for each trait
  for (const question of questionBank) {
    const questionTraits = new Set();

    for (const [answerType, traitMappings] of Object.entries(question.answers)) {
      for (const trait of Object.keys(traitMappings)) {
        if (requiredTraits.includes(trait)) {
          questionTraits.add(trait);
        }
      }
    }

    // Each question that touches a trait counts as coverage
    for (const trait of questionTraits) {
      traitCoverage[trait]++;
      questionsByTrait[trait].push(question.id);
    }
  }

  return { traitCoverage, questionsByTrait };
}

function validateQuestionBank() {
  try {
    console.log('🔍 Loading question bank and template...');

    const questionBank = loadQuestionBank();
    const allTraitCategories = loadTraitCategoriesFromTemplate();

    // Filter out generic category labels that shouldn't appear in questions
    // These are category headers, not individual traits
    const genericCategoryLabels = ['magicType', 'originBackground'];
    const requiredTraits = allTraitCategories.filter(trait => !genericCategoryLabels.includes(trait));

    const specificTraits = loadSpecificTraitsFromClassProfiles();

    console.log(`📊 Found ${questionBank.length} questions`);
    if (requiredTraits.length > 0) {
      console.log(`🎯 Required trait categories: ${requiredTraits.join(', ')}`);
    }
    console.log(`🎨 Found specific traits: ${specificTraits.length} traits (${specificTraits.slice(0, 5).join(', ')}${specificTraits.length > 5 ? '...' : ''})`);
    console.log();

    let totalErrors = 0;

    // 1. Validate individual questions
    console.log('📝 Validating question structure...');
    for (const question of questionBank) {
      const errors = [];

      // Check required fields
      if (!question.id) errors.push('Missing question id');
      if (!question.text) errors.push('Missing question text');
      if (!question.category) errors.push('Missing question category');

      // Validate answer structure
      const answerErrors = validateAnswerStructure(question);
      errors.push(...answerErrors);

      if (errors.length > 0) {
        console.log(`  ❌ Question "${question.id}": ${errors.join(', ')}`);
        totalErrors += errors.length;
      }
    }

    if (totalErrors === 0) {
      console.log('  ✅ All questions have valid structure');
    }
    console.log();

    // 2. Validate trait coverage
    console.log('🎯 Validating trait coverage...');
    const { traitCoverage, questionsByTrait } = validateTraitCoverage(questionBank, requiredTraits);

    let uncoveredTraits = [];
    let lightlyCoveredTraits = [];

    for (const [trait, count] of Object.entries(traitCoverage)) {
      if (count === 0) {
        uncoveredTraits.push(trait);
        console.log(`  ❌ Trait "${trait}": No coverage`);
      } else if (count < 2) {
        lightlyCoveredTraits.push(trait);
        console.log(`  ⚠️  Trait "${trait}": Light coverage (${count} question)`);
      } else {
        console.log(`  ✅ Trait "${trait}": Good coverage (${count} questions)`);
      }
    }

    console.log();

    // 3. Validate specific trait representation
    console.log('🎨 Validating specific trait representation...');

    if (specificTraits.length === 0) {
      console.log('  ⚠️  No specific traits found in class profiles - this may indicate missing profile data');
    } else {
      // Check which specific traits are actually mentioned in questions
      const questionSpecificTraits = new Set();
      for (const question of questionBank) {
        for (const answer of Object.values(question.answers || {})) {
          for (const trait of Object.keys(answer || {})) {
            if (specificTraits.includes(trait)) {
              questionSpecificTraits.add(trait);
            }
          }
        }
      }

      const uncoveredSpecificTraits = specificTraits.filter(trait => !questionSpecificTraits.has(trait));

      console.log(`  📊 Specific traits in questions: ${questionSpecificTraits.size} out of ${specificTraits.length}`);

      if (questionSpecificTraits.size > 0) {
        console.log(`  ✅ Covered specific traits: ${Array.from(questionSpecificTraits).join(', ')}`);
      }

      if (uncoveredSpecificTraits.length > 0) {
        console.log(`  ❌ Uncovered specific traits: ${uncoveredSpecificTraits.slice(0, 10).join(', ')}${uncoveredSpecificTraits.length > 10 ? ` (and ${uncoveredSpecificTraits.length - 10} more)` : ''}`);
      }

      if (uncoveredSpecificTraits.length === specificTraits.length) {
        console.log(`  ❌ CRITICAL: No specific traits are mentioned in any questions`);
        console.log(`  💡 Questions only use generic traits - scoring algorithm needs to map generic→specific traits`);
      }
    }

    console.log();

    // 4. Check for "or" questions (potentially tricky)
    console.log('⚠️  Checking for potentially tricky "or" questions...');
    const orQuestions = [];

    for (const question of questionBank) {
      if (question.text) {
        // Check if the question text contains " or " (with spaces to avoid false positives like "for" or "order")
        // Also check for variations like "X or Y?"
        const hasOrPattern = /\s+or\s+/i.test(question.text);

        if (hasOrPattern) {
          orQuestions.push({
            id: question.id,
            text: question.text
          });
        }
      }
    }

    if (orQuestions.length > 0) {
      console.log(`  ⚠️  Found ${orQuestions.length} question(s) with "or" pattern - these may be tricky to answer:`);
      for (const q of orQuestions) {
        console.log(`     • [${q.id}] ${q.text}`);
      }
      console.log(`  💡 Consider rephrasing as separate questions or using compound statements`);
    } else {
      console.log('  ✅ No "or" questions found');
    }

    console.log();

    // 5. Built-in validation
    console.log('🔧 Running built-in validation...');

    const coveredTraits = new Set();
    const questionCategories = new Set();

    for (const question of questionBank) {
      questionCategories.add(question.category);

      for (const answer of Object.values(question.answers)) {
        for (const trait of Object.keys(answer)) {
          coveredTraits.add(trait);
        }
      }
    }

    const missingTraits = requiredTraits.filter(trait => !coveredTraits.has(trait));
    // Require at least 15 questions; no upper limit (more comprehensive is better)
    const isValid = missingTraits.length === 0 && questionBank.length >= 15;

    console.log(`  📊 Questions: ${questionBank.length}`);
    console.log(`  🎯 Covered traits: ${Array.from(coveredTraits).join(', ')}`);
    console.log(`  📂 Question categories: ${Array.from(questionCategories).join(', ')}`);

    if (missingTraits.length > 0) {
      console.log(`  ❌ Missing traits: ${missingTraits.join(', ')}`);
    }

    if (isValid) {
      console.log('  ✅ Built-in validation passed');
    } else {
      console.log('  ❌ Built-in validation failed');
    }

    console.log();

    // 6. Summary
    const hasStructuralErrors = totalErrors > 0;
    const hasUncoveredTraits = uncoveredTraits.length > 0;
    const passesBuiltInValidation = isValid;

    // Check specific trait coverage - this should fail if traits are uncovered
    let hasUncoveredSpecificTraits = false;
    let specificTraitInfo = { covered: 0, total: specificTraits.length, uncovered: [] };

    if (specificTraits.length > 0) {
      const questionSpecificTraits = new Set();
      for (const question of questionBank) {
        for (const answer of Object.values(question.answers || {})) {
          for (const trait of Object.keys(answer || {})) {
            if (specificTraits.includes(trait)) {
              questionSpecificTraits.add(trait);
            }
          }
        }
      }
      specificTraitInfo.covered = questionSpecificTraits.size;
      specificTraitInfo.uncovered = specificTraits.filter(trait => !questionSpecificTraits.has(trait));
      hasUncoveredSpecificTraits = specificTraitInfo.uncovered.length > 0;
    }

    if (hasStructuralErrors || hasUncoveredTraits || !passesBuiltInValidation || hasUncoveredSpecificTraits) {
      console.log('❌ Question bank validation failed');
      console.log();

      if (hasStructuralErrors) {
        console.log(`  • ${totalErrors} structural errors found`);
      }

      if (hasUncoveredTraits) {
        console.log(`  • ${uncoveredTraits.length} generic traits have no coverage: ${uncoveredTraits.join(', ')}`);
      }

      if (lightlyCoveredTraits.length > 0) {
        console.log(`  • ${lightlyCoveredTraits.length} generic traits have light coverage: ${lightlyCoveredTraits.join(', ')}`);
      }

      if (!passesBuiltInValidation) {
        console.log(`  • Built-in validation failed`);
      }

      if (hasUncoveredSpecificTraits) {
        console.log(`  • ${specificTraitInfo.uncovered.length} specific traits have no question coverage: ${specificTraitInfo.uncovered.slice(0, 5).join(', ')}${specificTraitInfo.uncovered.length > 5 ? '...' : ''}`);
        console.log(`  • Solution: Either add questions for specific traits OR design scoring to map generic→specific traits`);
      }

      process.exit(1);
    } else {
      console.log('✅ Question bank validation passed');
      const coveredGenericTraits = requiredTraits.filter(trait => coveredTraits.has(trait));
      console.log(`   ${questionBank.length} questions covering ${coveredGenericTraits.length} generic traits + ${specificTraitInfo.covered} specific traits = ${coveredGenericTraits.length + specificTraitInfo.covered} total traits`);
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  validateQuestionBank();
}

module.exports = { validateQuestionBank };