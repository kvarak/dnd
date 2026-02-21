#!/usr/bin/env ruby
require 'yaml'

QUESTION_BANK_PATH = '_data/question-bank.yml'

# Questions to remove
QUESTIONS_TO_REMOVE = [
  'improvised-weapons',
  'unarmed-brawling',
  'exotic-weapons-interest'
]

# New multi-choice question to add
NEW_QUESTION = {
  'id' => 'unconventional-combat',
  'text' => 'What unconventional combat style appeals to you?',
  'category' => 'combat-style',
  'answers' => {
    'Improvised weapons' => {
      'improvised-specialist' => 4,
      'adaptable-fighter' => 3,
      'pragmatic-fighter' => 2
    },
    'Unarmed fighting' => {
      'unarmed-combat' => 4,
      'physical' => 3,
      'reckless-value' => 2
    },
    'Exotic weapons (whips, nets, chains)' => {
      'exotic-weapons' => 4,
      'tactical-value' => 3,
      'control-magic' => 2
    },
    'Traditional weapons' => {
      'weapon-specialist' => 3,
      'disciplined-value' => 2
    },
    'dont-know' => {}
  }
}

puts "=" * 80
puts "UNCONVENTIONAL COMBAT CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
questions = YAML.load_file(QUESTION_BANK_PATH)
puts "Questions before: #{questions.length}"
puts ""

# Remove the unconventional weapon questions
QUESTIONS_TO_REMOVE.each do |question_id|
  removed = questions.reject! { |q| q['id'] == question_id }
  if removed
    puts "✓ Removed: #{question_id}"
  else
    puts "✗ NOT FOUND: #{question_id}"
  end
end

puts ""
puts "Questions after removal: #{questions.length}"
puts ""

# Add the new multi-choice question
puts "✓ Adding new question: #{NEW_QUESTION['id']} (multi-choice with #{NEW_QUESTION['answers'].keys.length} options)"
questions << NEW_QUESTION

puts ""
puts "Questions after addition: #{questions.length}"
puts "Net change: #{questions.length - 95} (removed #{QUESTIONS_TO_REMOVE.length}, added 1)"
puts ""

# Save the updated question bank
File.write(QUESTION_BANK_PATH, questions.to_yaml)
puts "✓ Saved to #{QUESTION_BANK_PATH}"
puts ""
puts "=" * 80
