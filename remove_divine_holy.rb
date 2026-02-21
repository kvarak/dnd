#!/usr/bin/env ruby
require 'yaml'

# Divine/Holy Questions Consolidation
# Remove: holy-power, fearless-in-combat (2 questions)
# Keep: divine-warrior (already covers holy power concept)
# Net change: -2 questions

QUESTIONS_TO_REMOVE = [
  'holy-power',
  'fearless-in-combat'
]

puts "=" * 80
puts "DIVINE/HOLY QUESTIONS CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
question_bank = YAML.load_file('_data/question-bank.yml')

puts "Questions before: #{question_bank.length}"
puts ""

# Remove questions
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
puts "Net change: #{question_bank.length - 91} (removed #{QUESTIONS_TO_REMOVE.length})"
puts ""

# Save updated question bank
File.write('_data/question-bank.yml', YAML.dump(question_bank))

puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "Rationale:"
puts "  - divine-warrior already covers holy power concept"
puts "  - fearless-in-combat overlaps with other courage/bravery questions"
puts ""
puts "=" * 80
