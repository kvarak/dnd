#!/usr/bin/env ruby
require 'yaml'

# Remove Social/Manipulation and Crafting/Technical Overlaps
# Remove: secret-identity (subset of deception-disguise)
# Remove: crafting-engineering (subset of sophisticated-approach)
# Net change: -2 questions

QUESTIONS_TO_REMOVE = [
  'secret-identity',      # subset of deception-disguise
  'crafting-engineering'  # subset of sophisticated-approach
]

puts "=" * 80
puts "REMOVE SOCIAL & CRAFTING OVERLAPS"
puts "=" * 80
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
puts "Net change: #{question_bank.length - 79} (removed #{removed_count})"
puts ""

# Save updated question bank
File.write('_data/question-bank.yml', YAML.dump(question_bank))

puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "Rationale:"
puts "  - secret-identity is subset of deception-disguise (broader)"
puts "  - crafting-engineering is subset of sophisticated-approach (broader)"
puts ""
puts "=" * 80
