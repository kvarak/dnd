#!/usr/bin/env ruby
require 'yaml'

# Remove Overly Specific Specialist Questions
# These questions benefit only 1-3 archetypes each, violating efficiency principle
# Traits can be scored implicitly from broader questions
# Net change: -7 questions

QUESTIONS_TO_REMOVE = [
  'symbiotic-relationship',    # ooze-symbiosis only
  'shadow-possession',         # shadow-binding only
  'abnormal-entities',         # aberrant-influence only
  'fiendish-power',           # demonic-corruption only
  'chaos-conduit',            # entropy-conduit only
  'resist-enchantments',      # enchantment-resistance only
  'luck-manipulation'         # probability-manipulation only
]

puts "=" * 80
puts "REMOVE OVERLY SPECIFIC SPECIALIST QUESTIONS"
puts "=" * 80
puts ""
puts "Rationale: These questions benefit only 1-3 archetypes each."
puts "Traits can be scored implicitly from broader questions."
puts ""

# Load question bank
question_bank = YAML.load_file('_data/question-bank.yml')

puts "Questions before: #{question_bank.length}"
puts ""

# Remove questions
removed_count = 0
QUESTIONS_TO_REMOVE.each do |q_id|
  removed = question_bank.reject! { |q| q['id'] == q_id }
  if removed
    puts "✓ Removed: #{q_id}"
    removed_count += 1
  else
    puts "⚠ Not found: #{q_id}"
  end
end

puts ""
puts "Questions after removal: #{question_bank.length}"
puts "Net change: #{question_bank.length - 86} (removed #{removed_count})"
puts ""

# Save updated question bank
File.write('_data/question-bank.yml', YAML.dump(question_bank))

puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "=" * 80
