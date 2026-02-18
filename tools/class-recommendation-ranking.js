#!/usr/bin/env node

/**
 * Class Recommendation Results Ranking
 *
 * Takes scoring algorithm output and formats user-friendly recommendations
 * with explanations of why each class fits based on trait matches.
 */

const { calculateClassRecommendations } = require('./class-scoring-algorithm.js');
const fs = require('fs');
const path = require('path');

/**
 * Generate human-readable explanation for why a class matches user preferences
 */
function generateClassExplanation(classResult, userAnswers) {
  const explanations = [];

  // Group match details by reason type
  const combatMatches = [];
  const magicMatches = [];
  const roleplayMatches = [];
  const complexityMatches = [];
  const specificMatches = [];

  for (const match of classResult.matchDetails) {
    for (const traitMatch of match.traitMatches) {
      if (traitMatch.trait === 'combatFocus') {
        combatMatches.push({ match, traitMatch });
      } else if (traitMatch.trait === 'magicType') {
        magicMatches.push({ match, traitMatch });
      } else if (traitMatch.trait === 'roleplaying') {
        roleplayMatches.push({ match, traitMatch });
      } else if (traitMatch.trait === 'complexityLevel') {
        complexityMatches.push({ match, traitMatch });
      } else if (traitMatch.type === 'specific') {
        specificMatches.push({ match, traitMatch });
      }
    }
  }

  // Generate combat-focused explanations
  if (combatMatches.length > 0) {
    const bestCombatMatch = combatMatches.sort((a, b) => b.traitMatch.compatibility - a.traitMatch.compatibility)[0];
    const compatibility = bestCombatMatch.traitMatch.compatibility;

    if (compatibility >= 0.8) {
      if (bestCombatMatch.traitMatch.classValue === 'very-high') {
        explanations.push("Excels in direct combat and front-line fighting");
      } else if (bestCombatMatch.traitMatch.classValue === 'high') {
        explanations.push("Strong in combat situations");
      } else if (bestCombatMatch.traitMatch.classValue === 'medium') {
        explanations.push("Balanced combat capabilities");
      }
    }
  }

  // Generate magic-focused explanations
  if (magicMatches.length > 0) {
    const bestMagicMatch = magicMatches.sort((a, b) => b.traitMatch.compatibility - a.traitMatch.compatibility)[0];
    const compatibility = bestMagicMatch.traitMatch.compatibility;

    if (compatibility >= 0.8) {
      const magicType = bestMagicMatch.traitMatch.classValue;
      if (magicType === 'versatile') {
        explanations.push("Offers flexible magical abilities for various situations");
      } else if (magicType === 'damage') {
        explanations.push("Specializes in destructive magical attacks");
      } else if (magicType === 'utility') {
        explanations.push("Uses magic for practical problem-solving");
      } else if (magicType === 'healing') {
        explanations.push("Focuses on healing and supporting allies");
      } else if (magicType === 'control') {
        explanations.push("Controls battlefield with strategic magic");
      }
    }
  }

  // Generate roleplay explanations
  if (roleplayMatches.length > 0) {
    const bestRoleplayMatch = roleplayMatches.sort((a, b) => b.traitMatch.compatibility - a.traitMatch.compatibility)[0];
    const compatibility = bestRoleplayMatch.traitMatch.compatibility;

    if (compatibility >= 0.7) {
      if (bestRoleplayMatch.traitMatch.classValue === 'very-high') {
        explanations.push("Rich opportunities for character development and social interaction");
      } else if (bestRoleplayMatch.traitMatch.classValue === 'high') {
        explanations.push("Good roleplay potential with interesting character choices");
      }
    }
  }

  // Generate complexity explanations
  if (complexityMatches.length > 0) {
    const bestComplexityMatch = complexityMatches.sort((a, b) => b.traitMatch.compatibility - a.traitMatch.compatibility)[0];
    const compatibility = bestComplexityMatch.traitMatch.compatibility;

    if (compatibility >= 0.7) {
      if (bestComplexityMatch.traitMatch.classValue === 'beginner') {
        explanations.push("Easy to learn and play, perfect for new players");
      } else if (bestComplexityMatch.traitMatch.classValue === 'intermediate') {
        explanations.push("Moderate complexity with room to grow");
      } else if (bestComplexityMatch.traitMatch.classValue === 'advanced') {
        explanations.push("Complex mechanics for experienced players");
      }
    }
  }

  // Generate specific trait explanations
  if (specificMatches.length > 0) {
    const topSpecificMatches = specificMatches
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 2); // Top 2 specific traits

    for (const { traitMatch } of topSpecificMatches) {
      const traitName = traitMatch.trait;
      if (traitName === 'weapon-master' || traitName === 'weapon-specialist') {
        explanations.push("Masters weapons and combat techniques");
      } else if (traitName === 'innate-power' || traitName === 'magical-bloodline') {
        explanations.push("Natural magical abilities from birth");
      } else if (traitName === 'draconic-heritage') {
        explanations.push("Powerful draconic bloodline grants special abilities");
      } else if (traitName === 'chaotic-nature' || traitName === 'unpredictable-power') {
        explanations.push("Embraces chaos and unpredictable outcomes");
      } else if (traitName === 'tactical-mind' || traitName === 'intellectual-combatant') {
        explanations.push("Combines intelligence with combat prowess");
      } else if (traitName === 'dual-nature') {
        explanations.push("Blends different abilities and approaches");
      }
    }
  }

  // If no good explanations found, generate generic ones
  if (explanations.length === 0) {
    if (classResult.percentage >= 25) {
      explanations.push("Shows good compatibility with your preferences");
    } else {
      explanations.push("Some aspects align with what you're looking for");
    }
  }

  // Limit to top 3 explanations
  return explanations.slice(0, 3);
}

/**
 * Generate confidence level based on score percentage
 */
function getConfidenceLevel(percentage) {
  if (percentage >= 50) return "High";
  if (percentage >= 30) return "Medium";
  if (percentage >= 15) return "Low";
  return "Minimal";
}

/**
 * Format class name for display
 */
function formatClassName(className) {
  return className
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate archetype information for specific archetype combination
 */
function getArchetypeInfo(className, archetypeName) {
  // Archetype descriptions
  const archetypeDescriptions = {
    'fighter/champion': {
      description: "Pure martial warrior focused on combat excellence",
      archetype: { name: "Champion", description: "Master of weapons and athletic prowess" }
    },
    'fighter/eldritch-knight': {
      description: "Warrior-mage combining sword and spell",
      archetype: { name: "Eldritch Knight", description: "Scholarly warrior with utility magic" }
    },
    'sorcerer/draconic-bloodline': {
      description: "Draconic heritage grants natural magical power",
      archetype: { name: "Draconic Bloodline", description: "Dragon ancestry provides elemental magic" }
    },
    'sorcerer/wild-magic-bloodline': {
      description: "Chaotic magic with unpredictable effects",
      archetype: { name: "Wild Magic", description: "Embraces magical chaos and wild surges" }
    }
  };

  const key = archetypeName ? `${className}/${archetypeName}`.toLowerCase() : className.toLowerCase();

  return archetypeDescriptions[key] || {
    description: `${formatClassName(className)} with unique abilities`,
    archetype: archetypeName ? { name: formatClassName(archetypeName), description: "Specialized class variant" } : null
  };
}

/**
 * Format recommendations for user display
 */
function formatRecommendations(userAnswers, options = {}) {
  const maxRecommendations = options.maxRecommendations || 5;
  const includeArchetypes = options.includeArchetypes !== false;
  const includeConfidence = options.includeConfidence !== false;

  // Get scored recommendations
  const recommendations = calculateClassRecommendations(userAnswers, { limit: maxRecommendations });

  const formattedRecommendations = [];

  for (let i = 0; i < recommendations.length; i++) {
    const classResult = recommendations[i];
    const rank = i + 1;

    // Generate explanation
    const explanations = generateClassExplanation(classResult, userAnswers);
    const confidence = getConfidenceLevel(classResult.percentage);
    const archetypeInfo = getArchetypeInfo(classResult.className, classResult.archetypeName);

    const recommendation = {
      rank: rank,
      className: classResult.displayName,  // Use the formatted display name
      score: classResult.score,
      maxScore: classResult.maxScore,
      percentage: Math.round(classResult.percentage),
      confidence: confidence,
      explanations: explanations,
      description: archetypeInfo.description,
      matchCount: classResult.matchDetails.length
    };

    if (includeArchetypes && archetypeInfo.archetype) {
      recommendation.archetype = archetypeInfo.archetype;
    }

    formattedRecommendations.push(recommendation);
  }

  return {
    recommendations: formattedRecommendations,
    totalClasses: recommendations.length,
    userAnswerCount: Object.keys(userAnswers).length
  };
}

/**
 * Generate text-based recommendation summary
 */
function generateTextSummary(userAnswers, options = {}) {
  const results = formatRecommendations(userAnswers, options);

  let output = [];
  output.push(`🎯 **CLASS RECOMMENDATIONS**`);
  output.push(`Based on ${results.userAnswerCount} answered questions\n`);

  for (const rec of results.recommendations) {
    output.push(`**${rec.rank}. ${rec.className}** (${rec.percentage}% match)`);
    output.push(`   ${rec.description}`);

    if (options.includeConfidence !== false) {
      output.push(`   Confidence: ${rec.confidence}`);
    }

    output.push(`   Why this fits:`);
    for (const explanation of rec.explanations) {
      output.push(`   • ${explanation}`);
    }

    if (rec.archetype) {
      output.push(`   Specialization: ${rec.archetype.name} - ${rec.archetype.description}`);
    }

    output.push('');
  }

  return output.join('\n');
}

/**
 * Command-line interface
 */
function runCLI() {
  if (process.argv.length < 3) {
    console.log('Usage: node class-recommendation-ranking.js <test-case>');
    console.log('');
    console.log('Built-in test cases:');
    console.log('  warrior   - High combat focus, no magic preference');
    console.log('  mage      - High magic focus, low combat preference');
    console.log('  balanced  - Mixed preferences');
    console.log('  social    - High roleplay, social focused');
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
    },
    social: {
      'combat-preference': 'no',
      'social-interaction': 'yes',
      'character-backstory': 'yes',
      'moral-dilemmas': 'yes',
      'noble-upbringing': 'maybe',
      'magic-interest': 'maybe'
    }
  };

  if (testCases[testCase]) {
    userAnswers = testCases[testCase];
  } else if (fs.existsSync(testCase)) {
    // Load from JSON file
    userAnswers = JSON.parse(fs.readFileSync(testCase, 'utf8'));
  } else {
    console.error(`❌ Unknown test case: ${testCase}`);
    return;
  }

  console.log(generateTextSummary(userAnswers, {
    maxRecommendations: 3, // Show top 3 for CLI
    includeArchetypes: true,
    includeConfidence: true
  }));
}

if (require.main === module) {
  try {
    runCLI();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  formatRecommendations,
  generateTextSummary,
  generateClassExplanation,
  getConfidenceLevel,
  formatClassName
};