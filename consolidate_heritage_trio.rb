#!/usr/bin/env ruby
require 'yaml'

QUESTION_BANK_PATH = '_data/question-bank.yml'

# Questions to remove
QUESTIONS_TO_REMOVE = [
  'bloodline-heritage',
  'celestial-heritage',
  'aquatic-heritage'
]

# New multi-choice question to add
NEW_QUESTION = {
  'id' => 'supernatural-ancestry',
  'text' => 'What type of supernatural ancestry interests you?',
  'category' => 'character-origin',
  'answers' => {
    'Draconic bloodline' => {
      'draconic-heritage' => 4,
      'innate-magic' => 3,
      'elemental-affinity' => 2,
      'proud-value' => 2
    },
    'Celestial/Angelic' => {
      'celestial-heritage' => 4,
      'divine-warrior' => 3,
      'holy-power' => 3,
      'lawful-value' => 2
    },
    'Aquatic/Sea-born' => {
      'aquatic-heritage' => 4,
      'seafaring' => 3,
      'elemental-affinity' => 3,
      'storm-caller' => 2
    },
    'Fiendish/Demonic' => {
      'demonic-corruption' => 4,
      'cunning-value' => 3,
      'chaotic-value' => 2
    },
    'Fey heritage' => {
      'fey-touched' => 4,
      'fey-beauty' => 3,
      'charm-magic' => 2,
      'chaotic-value' => 2
    },
    'No supernatural ancestry' => {
      'nature-background' => 2,
      'military-background' => 2,
      'urban-background' => 2
    },
    'dont-know' => {}
  }
}

puts "=" * 80
puts "HERITAGE TRIO CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
questions = YAML.load_file(QUESTION_BANK_PATH)
puts "Questions before: #{questions.length}"
puts ""

# Remove the heritage trio questions
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
puts "Net change: #{questions.length - 102} (removed #{QUESTIONS_TO_REMOVE.length}, added 1)"
puts ""

# Save the updated question bank
File.write(QUESTION_BANK_PATH, questions.to_yaml)
puts "✓ Saved to #{QUESTION_BANK_PATH}"
puts ""
puts "=" * 80
