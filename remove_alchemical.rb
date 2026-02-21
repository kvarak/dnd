#!/usr/bin/env ruby
require 'yaml'

# Alchemical Chain Consolidation
# Remove: dangerous-substances (merged into explosives-preference)
# Keep: poison-tactics (stealth poison use)
# Keep: explosives-preference (absorbs dangerous-substances concept)

QUESTIONS_TO_REMOVE = [
  'dangerous-substances'
]

puts "=" * 80
puts "REMOVE ALCHEMICAL QUESTION"
puts "=" * 80

questions = YAML.load_file('_data/question-bank.yml')
puts "\nQuestions before: #{questions.size}"

QUESTIONS_TO_REMOVE.each do |id|
  questions.reject! { |q| q['id'] == id }
  puts "✓ Removed: #{id}"
end

puts "\nQuestions after removal: #{questions.size}"
puts "Net change: -#{QUESTIONS_TO_REMOVE.size} (removed #{QUESTIONS_TO_REMOVE.size})"

File.write('_data/question-bank.yml', questions.to_yaml)
puts "\n✓ Saved to _data/question-bank.yml"

puts "\nRationale:"
puts "  - dangerous-substances merged into explosives-preference (alchemical combat)"
puts "\nKept questions:"
puts "  - poison-tactics (stealth poison use)"
puts "  - explosives-preference (covers dangerous alchemical substances)"

puts "=" * 80
