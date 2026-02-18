#!/usr/bin/env node

/**
 * Unit Tests for Class Scoring Algorithm
 *
 * Tests the scoring logic for deterministic results and edge cases
 */

const {
  calculateClassRecommendations,
  scoreArchetypeCombination,
  mergeArchetypeProfile,
  getClassArchetypeCombinations,
  calculateTraitCompatibility,
  getAnswerStrength,
  loadQuestionBank,
  loadClassProfiles
} = require('./class-scoring-algorithm.js');

// Test framework functions
let testCount = 0;
let passCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`✅ ${message}`);
  } else {
    console.log(`❌ ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
}

function assertNear(actual, expected, tolerance, message) {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${message} (expected: ~${expected}, got: ${actual}, diff: ${diff.toFixed(3)})`);
}

function runTests() {
  console.log('🧪 Running Class Scoring Algorithm Tests\n');

  // Test 1: Answer strength calculation
  console.log('📊 Testing answer strength calculation...');
  assertEqual(getAnswerStrength('yes'), 2, 'Yes should give 2 points');
  assertEqual(getAnswerStrength('maybe'), 1, 'Maybe should give 1 point');
  assertEqual(getAnswerStrength('no'), 0, 'No should give 0 points');
  assertEqual(getAnswerStrength('dont-know'), 0, 'Dont-know should give 0 points');
  assertEqual(getAnswerStrength('invalid'), 0, 'Invalid answer should give 0 points');

  // Test 2: Trait compatibility calculation
  console.log('\n🎯 Testing trait compatibility calculation...');
  assertEqual(calculateTraitCompatibility('high', 'high'), 1.0, 'Exact match should be 100%');
  assertNear(calculateTraitCompatibility('high', 'very-high'), 0.8, 0.01, 'High to very-high should be 80%');
  assertNear(calculateTraitCompatibility('medium', 'high'), 0.7, 0.01, 'Medium to high should be 70%');
  assertEqual(calculateTraitCompatibility('none', 'none'), 1.0, 'None to none should be 100%');
  assertNear(calculateTraitCompatibility('low', 'none'), 0.3, 0.01, 'Low to none should be 30%');

  // Test magic type compatibility
  assertEqual(calculateTraitCompatibility('versatile', 'versatile'), 1.0, 'Versatile exact match');
  assertNear(calculateTraitCompatibility('damage', 'versatile'), 0.8, 0.01, 'Damage to versatile should be 80%');
  assertNear(calculateTraitCompatibility('utility', 'damage'), 0.5, 0.01, 'Utility to damage should be 50%');

  // Test background arrays
  assertEqual(calculateTraitCompatibility('military', ['military', 'rural', 'urban']), 1.0, 'Background array match should be 100%');
  assertNear(calculateTraitCompatibility('noble', ['military', 'rural', 'urban']), 0.2, 0.01, 'Background array non-match should be 20%');

  // Test 3: Data loading
  console.log('\n📂 Testing data loading...');
  const questionBank = loadQuestionBank();
  const classProfiles = loadClassProfiles();

  assert(Array.isArray(questionBank), 'Question bank should be an array');
  assert(questionBank.length > 0, 'Question bank should not be empty');
  assert(typeof classProfiles === 'object', 'Class profiles should be an object');
  assert(Object.keys(classProfiles).length > 0, 'Class profiles should not be empty');

  // Verify Fighter and Sorcerer are loaded
  assert('fighter' in classProfiles, 'Fighter should be loaded');
  assert('sorcerer' in classProfiles, 'Sorcerer should be loaded');

  // Verify profile structure
  const fighterProfile = classProfiles.fighter;
  assert('generic' in fighterProfile, 'Fighter should have generic traits');
  assert('specific' in fighterProfile, 'Fighter should have specific traits');
  assert('combatFocus' in fighterProfile.generic, 'Fighter should have combatFocus');
  assert(Array.isArray(fighterProfile.specific), 'Fighter specific traits should be array');

  // Test 4: Deterministic scoring
  console.log('\n🎲 Testing deterministic scoring...');

  const testAnswers = {
    'combat-preference': 'yes',
    'magic-interest': 'no',
    'weapon-mastery': 'yes'
  };

  // Run scoring multiple times - should be identical
  const result1 = calculateClassRecommendations(testAnswers);
  const result2 = calculateClassRecommendations(testAnswers);

  assert(result1.length === result2.length, 'Results should have same length');
  assert(result1[0].className === result2[0].className, 'Top recommendation should be consistent');
  assertNear(result1[0].score, result2[0].score, 0.001, 'Score should be deterministic');

  // Test 5: Score archetype combination function directly
  console.log('\n⚔️ Testing individual archetype scoring...');

  // Get all combinations and test the first one
  const combinations = getClassArchetypeCombinations();
  assert(combinations.length > 0, 'Should have archetype combinations');

  const firstCombination = combinations[0];
  const combinationScore = scoreArchetypeCombination(firstCombination, testAnswers, questionBank);

  assert(typeof combinationScore.score === 'number', 'Score should be a number');
  assert(typeof combinationScore.maxScore === 'number', 'Max score should be a number');
  assert(typeof combinationScore.percentage === 'number', 'Percentage should be a number');
  assert(Array.isArray(combinationScore.matchDetails), 'Match details should be array');
  assert(combinationScore.score >= 0, 'Score should be non-negative');
  assert(combinationScore.maxScore >= 0, 'Max score should be non-negative');
  assert(combinationScore.percentage >= 0 && combinationScore.percentage <= 100, 'Percentage should be 0-100');

  // Test mergeArchetypeProfile function
  console.log('\n🔄 Testing archetype merging...');
  const mergedProfile = mergeArchetypeProfile(fighterProfile, firstCombination.archetype || {});
  assert(typeof mergedProfile === 'object', 'Merged profile should be an object');
  assert('generic' in mergedProfile, 'Merged profile should have generic traits');
  assert('specific' in mergedProfile, 'Merged profile should have specific traits');

  // Test 6: Edge cases
  console.log('\n🚧 Testing edge cases...');

  // Empty answers
  const emptyResults = calculateClassRecommendations({});
  assert(emptyResults.length > 0, 'Should handle empty answers');
  assert(emptyResults.every(r => r.score === 0), 'Empty answers should give zero scores');

  // Only dont-know answers
  const dontKnowAnswers = {
    'combat-preference': 'dont-know',
    'magic-interest': 'dont-know'
  };
  const dontKnowResults = calculateClassRecommendations(dontKnowAnswers);
  assert(dontKnowResults.every(r => r.score === 0), 'Dont-know answers should give zero scores');

  // Invalid question IDs should be handled gracefully
  const invalidAnswers = {
    'invalid-question': 'yes',
    'combat-preference': 'yes'
  };
  const invalidResults = calculateClassRecommendations(invalidAnswers);
  assert(invalidResults.length > 0, 'Should handle invalid question IDs');

  // Test 7: Realistic scoring scenarios
  console.log('\n🎭 Testing realistic scenarios...');

  // Pure warrior should prefer Fighter archetypes
  const warriorAnswers = {
    'combat-preference': 'yes',
    'front-line': 'yes',
    'magic-interest': 'no',
    'weapon-mastery': 'yes',
    'physical-excellence': 'yes'
  };
  const warriorResults = calculateClassRecommendations(warriorAnswers);
  assert(warriorResults[0].className.includes('fighter'), 'Warrior profile should prefer Fighter archetype');
  assert(warriorResults[0].score > warriorResults[1].score, 'Top Fighter archetype should score higher than alternatives');

  // Pure mage should prefer Sorcerer archetypes
  const mageAnswers = {
    'combat-preference': 'no',
    'magic-interest': 'yes',
    'destructive-magic': 'yes',
    'innate-abilities': 'yes'
  };
  const mageResults = calculateClassRecommendations(mageAnswers);
  assert(mageResults[0].className.includes('sorcerer'), 'Mage profile should prefer Sorcerer archetype');

  // Test 8: Scoring bounds
  console.log('\n📏 Testing scoring bounds...');

  // Maximum possible score (all yes answers)
  const allYesAnswers = {};
  for (const question of questionBank.slice(0, 5)) { // Test with first 5 questions
    allYesAnswers[question.id] = 'yes';
  }
  const maxResults = calculateClassRecommendations(allYesAnswers);
  assert(maxResults.every(r => r.percentage <= 100), 'Percentage should never exceed 100%');
  assert(maxResults.every(r => r.score <= r.maxScore), 'Score should never exceed max score');

  // Results summary
  console.log(`\n📈 **TEST RESULTS**:`);
  console.log(`  • Tests run: ${testCount}`);
  console.log(`  • Tests passed: ${passCount}`);
  console.log(`  • Tests failed: ${testCount - passCount}`);
  console.log(`  • Success rate: ${((passCount / testCount) * 100).toFixed(1)}%`);

  if (passCount === testCount) {
    console.log(`\n✅ All tests passed! Scoring algorithm is working correctly.`);
    return 0;
  } else {
    console.log(`\n❌ ${testCount - passCount} tests failed. Please fix issues before using.`);
    return 1;
  }
}

if (require.main === module) {
  try {
    const exitCode = runTests();
    process.exit(exitCode);
  } catch (error) {
    console.error(`❌ Test error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { runTests };