#!/usr/bin/env node

/**
 * Interactive Demo of Class Recommendation System
 *
 * Simple interactive demo that shows the complete flow from
 * user answers to formatted recommendations
 */

const { generateTextSummary } = require('./class-recommendation-ranking.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Demo questions (subset of full question bank)
const demoQuestions = [
  {
    id: 'combat-preference',
    text: 'Do you prefer direct combat over other approaches?',
    options: ['yes', 'maybe', 'no', 'dont-know']
  },
  {
    id: 'magic-interest',
    text: 'Are you interested in using magic?',
    options: ['yes', 'maybe', 'no', 'dont-know']
  },
  {
    id: 'social-interaction',
    text: 'Do you enjoy social interactions and negotiations?',
    options: ['yes', 'maybe', 'no', 'dont-know']
  },
  {
    id: 'tactical-thinking',
    text: 'Do you prefer planning and strategy over instinctive action?',
    options: ['yes', 'maybe', 'no', 'dont-know']
  },
  {
    id: 'weapon-mastery',
    text: 'Do you want to specialize in mastering specific weapons?',
    options: ['yes', 'maybe', 'no', 'dont-know']
  }
];

let currentQuestion = 0;
let userAnswers = {};

function askQuestion() {
  if (currentQuestion >= demoQuestions.length) {
    showRecommendations();
    return;
  }

  const question = demoQuestions[currentQuestion];
  console.log(`\n[${currentQuestion + 1}/${demoQuestions.length}] ${question.text}`);
  console.log('Options: ' + question.options.join(', '));

  rl.question('Your answer: ', (answer) => {
    const normalizedAnswer = answer.toLowerCase().trim();

    if (!question.options.includes(normalizedAnswer)) {
      console.log(`❌ Invalid answer. Please choose: ${question.options.join(', ')}`);
      askQuestion();
      return;
    }

    userAnswers[question.id] = normalizedAnswer;
    currentQuestion++;
    askQuestion();
  });
}

function showRecommendations() {
  console.log('\n' + '='.repeat(60));
  console.log(generateTextSummary(userAnswers, {
    maxRecommendations: 3,
    includeArchetypes: true,
    includeConfidence: true
  }));
  console.log('='.repeat(60));
  rl.close();
}

function startDemo() {
  console.log('🎲 **D&D CLASS RECOMMENDATION DEMO**');
  console.log('Answer a few questions to get personalized class recommendations!\n');
  console.log('This demo uses a subset of questions from the full system.');
  console.log('Answer options: yes, maybe, no, dont-know\n');

  askQuestion();
}

if (require.main === module) {
  startDemo();
}

module.exports = { startDemo };