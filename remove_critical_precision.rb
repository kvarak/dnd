#!/usr/bin/env ruby
require 'yaml'

QUESTION_BANK_PATH = '_data/question-bank.yml'

puts "=" * 80
puts "PRECISION QUESTIONS CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
questions = YAML.load_file(QUESTION_BANK_PATH)
puts "Questions before: #{questions.length}"
puts ""

# Remove critical-precision
removed = questions.reject! { |q| q['id'] == 'critical-precision' }
if removed
  puts "✓ Removed: critical-precision (too narrow, merged into precision-vs-power)"
else
  puts "✗ NOT FOUND: critical-precision"
end

puts ""
puts "Questions after: #{questions.length}"
puts "Net change: #{questions.length - 100} (removed 1)"
puts ""

# Save the updated question bank
File.write(QUESTION_BANK_PATH, questions.to_yaml)
puts "✓ Saved to #{QUESTION_BANK_PATH}"
puts ""
puts "=" * 80
