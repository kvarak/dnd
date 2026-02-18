#!/usr/bin/env node

/**
 * Unit Tests for Class Recommendation Ranking
 *
 * Tests the ranking and explanation generation for class recommendations
 */

const {
  formatRecommendations,
  generateTextSummary,
  generateClassExplanation,
  getConfidenceLevel,
  formatClassName
} = require('./class-recommendation-ranking.js');

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
  console.log('🧪 Running Class Recommendation Ranking Tests\n');

  // Test 1: Confidence level calculation
  console.log('📊 Testing confidence level calculation...');
  assertEqual(getConfidenceLevel(60), 'High', 'Score ≥50% should be High confidence');
  assertEqual(getConfidenceLevel(50), 'High', 'Score =50% should be High confidence');
  assertEqual(getConfidenceLevel(45), 'Medium', 'Score 30-49% should be Medium confidence');
  assertEqual(getConfidenceLevel(30), 'Medium', 'Score =30% should be Medium confidence');
  assertEqual(getConfidenceLevel(25), 'Low', 'Score 15-29% should be Low confidence');
  assertEqual(getConfidenceLevel(15), 'Low', 'Score =15% should be Low confidence');
  assertEqual(getConfidenceLevel(10), 'Minimal', 'Score <15% should be Minimal confidence');
  assertEqual(getConfidenceLevel(0), 'Minimal', 'Score =0% should be Minimal confidence');

  // Test 2: Class name formatting
  console.log('\n🏷️ Testing class name formatting...');
  assertEqual(formatClassName('fighter'), 'Fighter', 'Single word should be capitalized');
  assertEqual(formatClassName('eldritch-knight'), 'Eldritch Knight', 'Hyphenated should become title case');
  assertEqual(formatClassName('death_knight'), 'Death Knight', 'Underscore should become title case');
  assertEqual(formatClassName('arcane archer'), 'Arcane Archer', 'Spaces should become title case');
  assertEqual(formatClassName('FIGHTER'), 'Fighter', 'All caps should become title case');

  // Test 3: Recommendation structure validation
  console.log('\n📋 Testing recommendation structure...');

  const testAnswers = {
    'combat-preference': 'yes',
    'magic-interest': 'no',
    'weapon-mastery': 'yes'
  };

  const results = formatRecommendations(testAnswers, { maxRecommendations: 3 });

  assert(typeof results === 'object', 'Results should be an object');
  assert(Array.isArray(results.recommendations), 'Recommendations should be an array');
  assert(results.recommendations.length <= 3, 'Should limit recommendations to max');
  assert(typeof results.totalClasses === 'number', 'Total classes should be a number');
  assert(typeof results.userAnswerCount === 'number', 'User answer count should be a number');

  // Test first recommendation structure
  if (results.recommendations.length > 0) {
    const rec = results.recommendations[0];
    assert(typeof rec.rank === 'number', 'Recommendation should have rank');
    assert(typeof rec.className === 'string', 'Recommendation should have className');
    assert(typeof rec.score === 'number', 'Recommendation should have score');
    assert(typeof rec.percentage === 'number', 'Recommendation should have percentage');
    assert(typeof rec.confidence === 'string', 'Recommendation should have confidence');
    assert(Array.isArray(rec.explanations), 'Recommendation should have explanations array');
    assert(typeof rec.description === 'string', 'Recommendation should have description');
    assert(rec.rank === 1, 'First recommendation should have rank 1');
    assert(rec.percentage >= 0 && rec.percentage <= 100, 'Percentage should be 0-100');
  }

  // Test 4: Ranking order
  console.log('\n🏆 Testing ranking order...');

  const warriorAnswers = {
    'combat-preference': 'yes',
    'front-line': 'yes',
    'magic-interest': 'no',
    'weapon-mastery': 'yes'
  };

  const warriorResults = formatRecommendations(warriorAnswers);

  // Verify Fighter ranks higher than Sorcerer for warrior
  assert(warriorResults.recommendations.length >= 2, 'Should have at least 2 recommendations');
  assert(warriorResults.recommendations[0].className.toLowerCase().includes('fighter'), 'Fighter should rank first for warrior');

  // Verify scores are in descending order
  for (let i = 1; i < warriorResults.recommendations.length; i++) {
    const current = warriorResults.recommendations[i];
    const previous = warriorResults.recommendations[i-1];
    assert(current.score <= previous.score, `Recommendation ${i+1} should not score higher than ${i}`);
    assert(current.rank === i + 1, `Recommendation ${i+1} should have correct rank`);
  }

  // Test 5: Explanation generation
  console.log('\n💭 Testing explanation generation...');

  const mageAnswers = {
    'magic-interest': 'yes',
    'destructive-magic': 'yes',
    'innate-abilities': 'yes'
  };

  const mageResults = formatRecommendations(mageAnswers);

  if (mageResults.recommendations.length > 0) {
    const topRec = mageResults.recommendations[0];
    assert(topRec.explanations.length > 0, 'Top recommendation should have explanations');
    assert(topRec.explanations.length <= 3, 'Should limit explanations to max 3');

    // Check for magic-related explanations in mage profile
    const explanationText = topRec.explanations.join(' ').toLowerCase();
    const hasMagicExplanation = explanationText.includes('magic') ||
                               explanationText.includes('spell') ||
                               explanationText.includes('abilities');
    assert(hasMagicExplanation, 'Mage profile should have magic-related explanations');
  }

  // Test 6: Text summary generation
  console.log('\n📝 Testing text summary generation...');

  const summary = generateTextSummary(testAnswers, { maxRecommendations: 2 });

  assert(typeof summary === 'string', 'Summary should be a string');
  assert(summary.length > 0, 'Summary should not be empty');
  assert(summary.includes('CLASS RECOMMENDATIONS'), 'Summary should have header');
  assert(summary.includes('Based on'), 'Summary should mention answer count');
  assert(summary.includes('Why this fits:'), 'Summary should include explanations');

  // Test 7: Edge cases
  console.log('\n🚧 Testing edge cases...');

  // Empty answers
  const emptyResults = formatRecommendations({});
  assert(emptyResults.recommendations.every(r => r.score === 0), 'Empty answers should give zero scores');
  assert(emptyResults.recommendations.every(r => r.confidence === 'Minimal'), 'Empty answers should have minimal confidence');

  // Single answer
  const singleResults = formatRecommendations({ 'combat-preference': 'yes' });
  assert(singleResults.userAnswerCount === 1, 'Should count single answer correctly');
  assert(singleResults.recommendations.length > 0, 'Should still provide recommendations');

  // Test 8: Options handling
  console.log('\n⚙️ Testing options handling...');

  const limitedResults = formatRecommendations(testAnswers, { maxRecommendations: 1 });
  assert(limitedResults.recommendations.length === 1, 'Should respect maxRecommendations limit');

  const noArchetypeResults = formatRecommendations(testAnswers, { includeArchetypes: false });
  if (noArchetypeResults.recommendations.length > 0) {
    assert(!noArchetypeResults.recommendations[0].hasOwnProperty('archetypes'),
           'Should exclude archetypes when includeArchetypes is false');
  }

  // Test 9: Consistency
  console.log('\n🔄 Testing consistency...');

  // Multiple runs should produce identical results
  const consistency1 = formatRecommendations(testAnswers);
  const consistency2 = formatRecommendations(testAnswers);

  assert(consistency1.recommendations.length === consistency2.recommendations.length,
         'Multiple runs should produce same number of recommendations');

  if (consistency1.recommendations.length > 0 && consistency2.recommendations.length > 0) {
    assert(consistency1.recommendations[0].className === consistency2.recommendations[0].className,
           'Multiple runs should produce same top recommendation');
    assert(Math.abs(consistency1.recommendations[0].score - consistency2.recommendations[0].score) < 0.001,
           'Multiple runs should produce same scores');
  }

  // Results summary
  console.log(`\n📈 **TEST RESULTS**:`);
  console.log(`  • Tests run: ${testCount}`);
  console.log(`  • Tests passed: ${passCount}`);
  console.log(`  • Tests failed: ${testCount - passCount}`);
  console.log(`  • Success rate: ${((passCount / testCount) * 100).toFixed(1)}%`);

  if (passCount === testCount) {
    console.log(`\n✅ All tests passed! Recommendation ranking is working correctly.`);
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