#!/usr/bin/env ruby
require 'yaml'

QUESTION_BANK_PATH = '_data/question-bank.yml'

# Questions to remove
QUESTIONS_TO_REMOVE = [
  'sling-expertise',
  'throwing-weapons',
  'precision-sniping'
]

puts "=" * 80
puts "RANGED WEAPON SPECIALIZATIONS CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
questions = YAML.load_file(QUESTION_BANK_PATH)
puts "Questions before: #{questions.length}"
puts ""

# Remove the ranged specialization questions
QUESTIONS_TO_REMOVE.each do |question_id|
  removed = questions.reject! { |q| q['id'] == question_id }
  if removed
    puts "✓ Removed: #{question_id}"
  else
    puts "✗ NOT FOUND: #{question_id}"
  end
end

puts ""
puts "Questions after: #{questions.length}"
puts "Net change: #{questions.length - 98} (removed #{QUESTIONS_TO_REMOVE.length})"
puts ""

# Save the updated question bank
File.write(QUESTION_BANK_PATH, questions.to_yaml)
puts "✓ Saved to #{QUESTION_BANK_PATH}"
puts ""
puts "Note: Traits merged into broader 'ranged-combat' question:"
puts "  - sling-specialist, throwing-expert, sniper → covered by ranged-expert"
puts ""
puts "=" * 80
