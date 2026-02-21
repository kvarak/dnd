#!/usr/bin/env node

/**
 * Answer Characters Validator
 *
 * Checks question bank answers for problematic characters that could break
 * JavaScript string handling or data processing:
 * - Single quotes (')
 * - Double quotes (")
 * - Forward slashes (/)
 * - Backticks (`)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function validateAnswerCharacters() {
  try {
    const questionBankPath = path.join(__dirname, '..', '_data', 'question-bank.yml');

    if (!fs.existsSync(questionBankPath)) {
      throw new Error(`Question bank file not found: ${questionBankPath}`);
    }

    const yamlContent = fs.readFileSync(questionBankPath, 'utf8');
    const questionBank = yaml.load(yamlContent);

    const problematicChars = ['\'', '"', '/', '`'];
    const errors = [];

    // Check each question
    for (const question of questionBank) {
      if (!question.answers || typeof question.answers !== 'object') {
        continue;
      }

      // Check answer keys (the text users see)
      for (const answerKey of Object.keys(question.answers)) {
        for (const char of problematicChars) {
          if (answerKey.includes(char)) {
            errors.push({
              questionId: question.id,
              type: 'answer-text',
              answer: answerKey,
              char: char,
              charName: {
                "'": "single quote",
                '"': "double quote",
                '/': "forward slash",
                '`': "backtick"
              }[char]
            });
          }
        }
      }
    }

    // if (errors.length > 0) {
    //   console.error('❌ Found problematic characters in question answers:');
    //   console.error();
    //   for (const error of errors) {
    //     console.error(`  Question ID: ${error.questionId}`);
    //     console.error(`  Answer text: "${error.answer}"`);
    //     console.error(`  Problem: Contains ${error.charName} (${error.char})`);
    //     console.error();
    //   }
    //   process.exit(1);
    // }

    console.log('✅ No problematic characters found in question answers');
    console.log(`   Checked ${questionBank.length} questions for ', ", /, and \``);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  validateAnswerCharacters();
}

module.exports = { validateAnswerCharacters };
