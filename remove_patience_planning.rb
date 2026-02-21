#!/usr/bin/env ruby
require 'yaml'

QUESTION_BANK_PATH = '_data/question-bank.yml'

puts "=" * 80
puts "SUBTLE TACTICS CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
questions = YAML.load_file(QUESTION_BANK_PATH)
puts "Questions before: #{questions.length}"
puts ""

# Remove patience-planning
removed = questions.reject! { |q| q['id'] == 'patience-planning' }
if removed
  puts "✓ Removed: patience-planning (subset of subtle-methods)"
else
  puts "✗ NOT FOUND: patience-planning"
end

puts ""
puts "Questions after: #{questions.length}"
puts "Net change: #{questions.length - 99} (removed 1)"
puts ""

# Save the updated question bank
File.write(QUESTION_BANK_PATH, questions.to_yaml)
puts "✓ Saved to #{QUESTION_BANK_PATH}"
puts ""
puts "=" * 80
