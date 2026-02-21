#!/usr/bin/env ruby
require 'yaml'

# Transformation Consolidation
# Remove: transformation-power (merged into shapeshift-transform)
# Keep: transformation-magic (change things)
# Keep: shapeshift-transform (personal transformation)

QUESTIONS_TO_REMOVE = [
  'transformation-power'
]

puts "=" * 80
puts "REMOVE TRANSFORMATION QUESTION"
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
puts "  - transformation-power merged into shapeshift-transform (personal transformation)"
puts "\nKept questions:"
puts "  - transformation-magic (transforming things/objects)"
puts "  - shapeshift-transform (personal transformation/shapeshifting)"

puts "=" * 80
