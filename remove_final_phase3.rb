#!/usr/bin/env ruby
require 'yaml'

# Final Phase 3 Removals
# Remove overly specific and overlapping questions

QUESTIONS_TO_REMOVE = [
  'tactical-flexibility',   # Overlaps with dual-nature-balance
  'planar-travel',          # Very specific, benefits few archetypes
  'magical-companion',      # Overlaps with animal-bond
  'storm-calling',          # Very specific, covered by elemental-power + nature
  'fey-combatant'           # Only for feyblood archetypes
]

puts "=" * 80
puts "REMOVE FINAL PHASE 3 QUESTIONS"
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
puts "  - tactical-flexibility: overlaps with dual-nature-balance"
puts "  - planar-travel: very specific, benefits few archetypes"
puts "  - magical-companion: overlaps with animal-bond"
puts "  - storm-calling: very specific druid, covered by elemental-power + nature"
puts "  - fey-combatant: only for feyblood archetypes"

puts "=" * 80
