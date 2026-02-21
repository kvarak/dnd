#!/usr/bin/env ruby
require 'yaml'

# Insight & Foresight Consolidation
# Remove: read-opponents, divination-future, illuminate-truth (3 questions)
# Add: insight-foresight (multi-choice with 5 options)
# Net change: -2 questions

QUESTIONS_TO_REMOVE = [
  'read-opponents',
  'divination-future',
  'illuminate-truth'
]

NEW_QUESTION = {
  'id' => 'insight-foresight',
  'text' => 'How do you prefer to gain insight and foresight?',
  'category' => 'magic-preference',
  'answers' => {
    "Read opponents' intentions" => {
      'mind-reader' => 4,
      'tactical-value' => 3,
      'wisdom-seeker' => 2
    },
    'Divine the future' => {
      'divination-magic' => 4,
      'scholar' => 3,
      'ritual-caster' => 2
    },
    'Reveal hidden truths' => {
      'truth-seeker' => 4,
      'illuminating-light' => 3,
      'knowledge-seeker' => 2
    },
    'Instinct over analysis' => {
      'intuitive-value' => 3,
      'instinctive-combatant' => 2
    },
    'dont-know' => {}
  }
}

puts "=" * 80
puts "INSIGHT & FORESIGHT CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
question_bank = YAML.load_file('_data/question-bank.yml')

puts "Questions before: #{question_bank.length}"
puts ""

# Remove old questions
QUESTIONS_TO_REMOVE.each do |q_id|
  removed = question_bank.reject! { |q| q['id'] == q_id }
  if removed
    puts "✓ Removed: #{q_id}"
  else
    puts "⚠ Not found: #{q_id}"
  end
end

puts ""
puts "Questions after removal: #{question_bank.length}"
puts ""

# Add new multi-choice question
answer_count = NEW_QUESTION['answers'].keys.length
puts "✓ Adding new question: #{NEW_QUESTION['id']} (multi-choice with #{answer_count} options)"
question_bank << NEW_QUESTION

puts ""
puts "Questions after addition: #{question_bank.length}"
puts "Net change: #{question_bank.length - 88} (removed #{QUESTIONS_TO_REMOVE.length}, added 1)"
puts ""

# Save updated question bank
File.write('_data/question-bank.yml', YAML.dump(question_bank))

puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "=" * 80
