#!/usr/bin/env node

/**
 * Class Scoring Algorithm
 *
 * Points-based system where classes gain 0-2 points per question based on trait matches.
 * Scoring: yes=2, maybe=1, no=0, don't-know=skip
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Load question bank from YAML
 */
function loadQuestionBank() {
  const questionBankPath = path.join(__dirname, '..', '_data', 'question-bank.yml');
  if (!fs.existsSync(questionBankPath)) {
    throw new Error(`Question bank file not found: ${questionBankPath}`);
  }
  const yamlContent = fs.readFileSync(questionBankPath, 'utf8');
  return yaml.load(yamlContent);
}

/**
 * Load all class profiles from markdown files
 */
function loadClassProfiles() {
  const classesDir = path.join(__dirname, '..', 'docs', '_Classes');
  const classProfiles = {};

  try {
    const classFiles = fs.readdirSync(classesDir).filter(file => file.endsWith('.md'));

    for (const classFile of classFiles) {
      try {
        const filePath = path.join(classesDir, classFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Extract YAML frontmatter
        const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]);

          if (frontmatter?.profile) {
            const className = frontmatter.title || path.basename(classFile, '.md');
            classProfiles[className.toLowerCase()] = frontmatter.profile;
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not parse ${classFile}: ${error.message}`);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read classes directory: ${error.message}`);
  }

  return classProfiles;
}

/**
 * Define trait value compatibility scores
 * How well different trait values match each other
 */
const TRAIT_COMPATIBILITY = {
  // Exact matches
  'none': { 'none': 1.0 },
  'low': { 'low': 1.0, 'medium': 0.7, 'none': 0.3 },
  'medium': { 'medium': 1.0, 'low': 0.7, 'high': 0.7, 'none': 0.2 },
  'high': { 'high': 1.0, 'very-high': 0.8, 'medium': 0.6, 'low': 0.3 },
  'very-high': { 'very-high': 1.0, 'high': 0.8, 'medium': 0.4 },

  // Magic type compatibility
  'versatile': { 'versatile': 1.0, 'damage': 0.8, 'utility': 0.8, 'healing': 0.7, 'control': 0.7 },
  'damage': { 'damage': 1.0, 'versatile': 0.8, 'utility': 0.5, 'control': 0.4 },
  'utility': { 'utility': 1.0, 'versatile': 0.8, 'healing': 0.7, 'damage': 0.5 },
  'healing': { 'healing': 1.0, 'utility': 0.8, 'versatile': 0.7, 'control': 0.6 },
  'control': { 'control': 1.0, 'versatile': 0.7, 'healing': 0.6, 'utility': 0.5 },

  // Complexity levels
  'beginner': { 'beginner': 1.0, 'intermediate': 0.6 },
  'intermediate': { 'intermediate': 1.0, 'beginner': 0.7, 'advanced': 0.7 },
  'advanced': { 'advanced': 1.0, 'intermediate': 0.6 }
};

/**
 * Calculate compatibility score between user preference and class trait value
 */
function calculateTraitCompatibility(userValue, classValue) {
  // Handle exact string matches first
  if (userValue === classValue) {
    return 1.0;
  }

  // Use compatibility matrix
  const userCompat = TRAIT_COMPATIBILITY[userValue];
  if (userCompat && userCompat[classValue] !== undefined) {
    return userCompat[classValue];
  }

  // Handle origin background arrays (special case)
  if (Array.isArray(classValue)) {
    if (classValue.includes(userValue)) {
      return 1.0; // Perfect match if user preference is in class's background options
    }
    return 0.2; // Low compatibility for non-matching backgrounds
  }

  // Default compatibility for unknown combinations
  return 0.1;
}

/**
 * Calculate answer strength multiplier based on user's certainty
 */
function getAnswerStrength(answer) {
  const strengthMap = {
    'yes': 2,
    'maybe': 1,
    'no': 0,
    'dont-know': 0 // Skip these questions
  };

  return strengthMap[answer] || 0;
}

/**
 * Merge base class profile with archetype overrides
 */
function mergeArchetypeProfile(baseProfile, archetypeData) {
  const mergedProfile = JSON.parse(JSON.stringify(baseProfile)); // Deep copy

  // Merge generic traits (archetype overrides base)
  if (archetypeData.generic) {
    Object.assign(mergedProfile.generic, archetypeData.generic);
  }

  // Merge specific traits (archetype adds to base)
  if (archetypeData.specific) {
    mergedProfile.specific = [...(mergedProfile.specific || []), ...archetypeData.specific];
  }

  return mergedProfile;
}

/**
 * Get all Class/Archetype combinations from loaded profiles
 */
function getClassArchetypeCombinations() {
  const classProfiles = loadClassProfiles();
  const combinations = [];

  for (const [className, classProfile] of Object.entries(classProfiles)) {
    if (classProfile.archetypes) {
      // Add each archetype as a separate combination
      for (const [archetypeName, archetypeData] of Object.entries(classProfile.archetypes)) {
        const mergedProfile = mergeArchetypeProfile(classProfile, archetypeData);
        combinations.push({
          className: className,
          archetypeName: archetypeName,
          displayName: `${className}/${archetypeName}`,
          profile: mergedProfile
        });
      }
    } else {
      // Class has no archetypes, use base profile
      combinations.push({
        className: className,
        archetypeName: null,
        displayName: className,
        profile: classProfile
      });
    }
  }

  return combinations;
}

/**
 * Score a single class/archetype combination against user answers
 */
function scoreArchetypeCombination(combination, userAnswers, questionBank) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let matchDetails = [];

  // Create question lookup by ID
  const questionLookup = {};
  for (const question of questionBank) {
    questionLookup[question.id] = question;
  }

  // Process each user answer
  for (const [questionId, userAnswer] of Object.entries(userAnswers)) {
    if (userAnswer === 'dont-know') {
      continue; // Skip don't-know answers
    }

    const question = questionLookup[questionId];
    if (!question) {
      console.warn(`Question not found: ${questionId}`);
      continue;
    }

    const answerTraits = question.answers[userAnswer] || {};
    const answerStrength = getAnswerStrength(userAnswer);
    maxPossibleScore += answerStrength * 2; // Maximum 2 points per answer

    let questionScore = 0;
    let traitMatches = [];

    // Check each trait affected by this answer
    for (const [traitName, userTraitValue] of Object.entries(answerTraits)) {
      let traitScore = 0;

      // Check generic traits
      if (combination.profile.generic && combination.profile.generic[traitName]) {
        const classTraitValue = combination.profile.generic[traitName];
        const compatibility = calculateTraitCompatibility(userTraitValue, classTraitValue);
        traitScore = Math.max(traitScore, compatibility);

        if (compatibility > 0) {
          traitMatches.push({
            trait: traitName,
            userValue: userTraitValue,
            classValue: classTraitValue,
            compatibility: compatibility,
            type: 'generic'
          });
        }
      }

      // Check specific traits (binary match - either class has it or not)
      if (combination.profile.specific && combination.profile.specific.includes(traitName)) {
        traitScore = Math.max(traitScore, 1.0); // Perfect match for specific traits
        traitMatches.push({
          trait: traitName,
          userValue: userTraitValue,
          classValue: 'present',
          compatibility: 1.0,
          type: 'specific'
        });
      }

      questionScore += traitScore;
    }

    // Normalize question score and apply answer strength
    if (Object.keys(answerTraits).length > 0) {
      questionScore = (questionScore / Object.keys(answerTraits).length) * answerStrength;
    }

    totalScore += questionScore;

    if (questionScore > 0) {
      matchDetails.push({
        questionId,
        questionText: question.text,
        userAnswer,
        score: questionScore,
        traitMatches
      });
    }
  }

  return {
    score: totalScore,
    maxScore: maxPossibleScore,
    percentage: maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0,
    matchDetails
  };
}

/**
 * Score all class/archetype combinations and return ranked recommendations
 */
function calculateClassRecommendations(userAnswers, options = {}) {
  const questionBank = loadQuestionBank();
  const combinations = getClassArchetypeCombinations();

  const results = [];

  // Score each class/archetype combination
  for (const combination of combinations) {
    const combinationScore = scoreArchetypeCombination(combination, userAnswers, questionBank);

    results.push({
      className: combination.className,
      archetypeName: combination.archetypeName,
      displayName: combination.displayName,
      ...combinationScore
    });
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  // Optionally limit results
  if (options.limit) {
    return results.slice(0, options.limit);
  }

  return results;
}

/**
 * Command-line interface for testing
 */
function runCLITest() {
  if (process.argv.length < 3) {
    console.log('Usage: node class-scoring-algorithm.js <test-case>');
    console.log('');
    console.log('Built-in test cases:');
    console.log('  warrior   - High combat focus, no magic preference');
    console.log('  mage      - High magic focus, low combat preference');
    console.log('  balanced  - Mixed preferences');
    console.log('');
    console.log('Or provide JSON file path with user answers');
    return;
  }

  const testCase = process.argv[2];
  let userAnswers = {};

  // Define built-in test cases
  const testCases = {
    warrior: {
      'combat-preference': 'yes',
      'front-line': 'yes',
      'magic-interest': 'no',
      'weapon-mastery': 'yes',
      'physical-excellence': 'yes',
      'tactical-thinking': 'maybe'
    },
    mage: {
      'combat-preference': 'no',
      'magic-interest': 'yes',
      'destructive-magic': 'yes',
      'innate-abilities': 'yes',
      'bloodline-heritage': 'maybe',
      'chaos-unpredictability': 'no'
    },
    balanced: {
      'combat-preference': 'maybe',
      'magic-interest': 'maybe',
      'social-interaction': 'yes',
      'dual-nature-balance': 'yes',
      'tactical-thinking': 'maybe',
      'moral-dilemmas': 'yes'
    }
  };

  if (testCases[testCase]) {
    userAnswers = testCases[testCase];
    console.log(`🎯 Testing "${testCase}" profile:`);
    console.log(`   User answers: ${JSON.stringify(userAnswers, null, 2)}`);
  } else if (fs.existsSync(testCase)) {
    // Load from JSON file
    userAnswers = JSON.parse(fs.readFileSync(testCase, 'utf8'));
    console.log(`📂 Loading answers from: ${testCase}`);
  } else {
    console.error(`❌ Unknown test case: ${testCase}`);
    return;
  }

  console.log('\n🔍 Calculating recommendations...\n');

  const recommendations = calculateClassRecommendations(userAnswers, { limit: 5 });

  console.log('📊 **TOP RECOMMENDATIONS**:\n');

  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i];
    const rank = i + 1;

    console.log(`${rank}. **${rec.displayName.toUpperCase()}**`);
    console.log(`   Score: ${rec.score.toFixed(1)} / ${rec.maxScore} (${rec.percentage.toFixed(1)}%)`);
    console.log(`   Matches: ${rec.matchDetails.length} questions`);

    // Show top trait matches
    const topMatches = rec.matchDetails
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    for (const match of topMatches) {
      console.log(`   • "${match.questionText}" → ${match.score.toFixed(1)} pts`);
      for (const trait of match.traitMatches.slice(0, 2)) {
        console.log(`     └ ${trait.trait}: ${trait.userValue} matches ${trait.classValue} (${(trait.compatibility * 100).toFixed(0)}%)`);
      }
    }

    console.log();
  }
}

if (require.main === module) {
  try {
    runCLITest();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  calculateClassRecommendations,
  scoreArchetypeCombination,
  mergeArchetypeProfile,
  getClassArchetypeCombinations,
  calculateTraitCompatibility,
  getAnswerStrength,
  loadQuestionBank,
  loadClassProfiles
};

// Browser compatibility: expose functions to global scope
if (typeof window !== 'undefined') {
  window.calculateClassRecommendations = calculateClassRecommendations;
  window.scoreArchetypeCombination = scoreArchetypeCombination;
  window.mergeArchetypeProfile = mergeArchetypeProfile;
  window.getClassArchetypeCombinations = getClassArchetypeCombinations;
  window.calculateTraitCompatibility = calculateTraitCompatibility;
  window.getAnswerStrength = getAnswerStrength;
  window.loadQuestionBank = loadQuestionBank;
  window.loadClassProfiles = loadClassProfiles;
}