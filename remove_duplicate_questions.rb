#!/usr/bin/env ruby
# remove_duplicate_questions.rb - Phase 1: Remove 10 duplicate questions

require 'yaml'

# Questions to remove (duplicates from consolidation plan)
QUESTIONS_TO_REMOVE = [
  'group-tactics',
  'animal-kinship',
  'mobile-fighting',
  'shield-defense',
  'fearless-charge',
  'archery-preference',
  'divine-ritual',
  'ancient-lore',
  'fighting-outnumbered',
  'flashy-combat'
]

# Load the question bank
questions = YAML.load_file('_data/question-bank.yml')

puts "=" * 80
puts "PHASE 1: REMOVING DUPLICATE QUESTIONS"
puts "=" * 80
puts ""

# Count before
puts "Questions before removal: #{questions.size}"
puts ""

# Remove the duplicate questions
removed_count = 0
QUESTIONS_TO_REMOVE.each do |question_id|
  if questions.any? { |q| q['id'] == question_id }
    questions.reject! { |q| q['id'] == question_id }
    removed_count += 1
    puts "✓ Removed: #{question_id}"
  else
    puts "⚠ Not found: #{question_id}"
  end
end

puts ""
puts "Questions after removal: #{questions.size}"
puts "Successfully removed: #{removed_count}/#{QUESTIONS_TO_REMOVE.size} questions"
puts ""

# Save the updated question bank
File.write('_data/question-bank.yml', questions.to_yaml)
puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "=" * 80
