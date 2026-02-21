#!/usr/bin/env ruby
require 'yaml'

# Power Source & Mobility Consolidation
# Remove: divine-power-source (absorbed by religious-devotion)
# Remove: small-stature-advantage (too specific for halfling/gnome only)

QUESTIONS_TO_REMOVE = [
  'divine-power-source',
  'small-stature-advantage'
]

puts "=" * 80
puts "REMOVE POWER SOURCE & MOBILITY QUESTIONS"
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
puts "  - divine-power-source absorbed by religious-devotion (fundamental faith question)"
puts "  - small-stature-advantage too specific (only halfling/gnome archetypes)"
puts "\nKept questions:"
puts "  - religious-devotion (covers divine power source concept)"
puts "  - innate-abilities (fundamental magic source)"

puts "=" * 80
