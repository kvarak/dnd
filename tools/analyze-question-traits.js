#!/usr/bin/env node

/**
 * Question Trait Analysis
 *
 * Analyzes the question bank to see how many traits each question can modify.
 * Identifies "multi-trait" questions vs single-trait questions.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function analyzeQuestionBank() {
  const questionBankPath = path.join(__dirname, '..', '_data', 'question-bank.yml');

  if (!fs.existsSync(questionBankPath)) {
    throw new Error(`Question bank file not found: ${questionBankPath}`);
  }

  const yamlContent = fs.readFileSync(questionBankPath, 'utf8');
  const questionBank = yaml.load(yamlContent);

  console.log('🔍 Analyzing question bank trait coverage...\n');

  let singleTraitQuestions = [];
  let multiTraitQuestions = [];

  for (const question of questionBank) {
    const allTraits = new Set();

    // Collect all traits mentioned across all answer types
    for (const [answerType, traitMappings] of Object.entries(question.answers)) {
      if (traitMappings && typeof traitMappings === 'object') {
        for (const trait of Object.keys(traitMappings)) {
          allTraits.add(trait);
        }
      }
    }

    const traitCount = allTraits.size;
    const traitList = Array.from(allTraits).join(', ');

    if (traitCount === 1) {
      singleTraitQuestions.push({
        id: question.id,
        text: question.text,
        traits: traitList,
        count: traitCount
      });
    } else {
      multiTraitQuestions.push({
        id: question.id,
        text: question.text,
        traits: traitList,
        count: traitCount
      });
    }
  }

  // Sort multi-trait questions by trait count (highest first)
  multiTraitQuestions.sort((a, b) => b.count - a.count);

  console.log(`📊 **SINGLE-TRAIT QUESTIONS** (${singleTraitQuestions.length} questions):`);
  console.log('These questions only affect one trait category.\n');

  for (const question of singleTraitQuestions) {
    console.log(`  • **${question.id}**: "${question.text}"`);
    console.log(`    → Affects: ${question.traits}`);
    console.log();
  }

  console.log(`🎯 **MULTI-TRAIT QUESTIONS** (${multiTraitQuestions.length} questions):`);
  console.log('These are the "BEST" questions that can modify multiple traits.\n');

  for (const question of multiTraitQuestions) {
    console.log(`  • **${question.id}** (${question.count} traits): "${question.text}"`);
    console.log(`    → Affects: ${question.traits}`);
    console.log();
  }

  console.log(`📈 **SUMMARY**:`);
  console.log(`  • Single-trait questions: ${singleTraitQuestions.length}`);
  console.log(`  • Multi-trait questions: ${multiTraitQuestions.length}`);
  console.log(`  • Total questions: ${questionBank.length}`);

  const multiTraitRatio = Math.round((multiTraitQuestions.length / questionBank.length) * 100);
  console.log(`  • Multi-trait ratio: ${multiTraitRatio}%`);

  // Validate multi-trait efficiency requirement
  const minRequiredRatio = 80;
  if (multiTraitRatio < minRequiredRatio) {
    console.log(`\n❌ **EFFICIENCY CHECK FAILED**:`);
    console.log(`  • Current multi-trait ratio: ${multiTraitRatio}%`);
    console.log(`  • Minimum required ratio: ${minRequiredRatio}%`);
    console.log(`  • Need ${minRequiredRatio - multiTraitRatio} percentage points improvement`);
    console.log(`  💡 Solution: Convert single-trait questions to affect multiple traits OR add more multi-trait questions`);
    process.exit(1);
  } else {
    console.log(`\n✅ **EFFICIENCY CHECK PASSED**:`);
    console.log(`  • Multi-trait ratio ${multiTraitRatio}% meets requirement (≥${minRequiredRatio}%)`);
  }

  // Show trait count distribution
  const traitCountDistribution = {};
  for (const question of [...singleTraitQuestions, ...multiTraitQuestions]) {
    traitCountDistribution[question.count] = (traitCountDistribution[question.count] || 0) + 1;
  }

  console.log(`\n📊 **TRAIT COUNT DISTRIBUTION**:`);
  for (const [count, freq] of Object.entries(traitCountDistribution).sort(([a], [b]) => parseInt(a) - parseInt(b))) {
    console.log(`  • ${count} trait${count > 1 ? 's' : ''}: ${freq} question${freq > 1 ? 's' : ''}`);
  }
}

if (require.main === module) {
  try {
    analyzeQuestionBank();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { analyzeQuestionBank };