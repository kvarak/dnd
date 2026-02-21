#!/usr/bin/env ruby
require 'yaml'

# Combat Specializations Consolidation
# Remove: weapon-disarm (too specific), area-effect-preference (overlaps with explosives/magic)
# Keep: crowd-combat (broader concept)

QUESTIONS_TO_REMOVE = [
  'weapon-disarm',
  'area-effect-preference'
]

puts "=" * 80
puts "REMOVE COMBAT SPECIALIZATIONS"
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
puts "  - weapon-disarm is too specific (narrow combat technique)"
puts "  - area-effect-preference overlaps with explosives/magic questions"
puts "  - crowd-combat kept (broader concept covering multiple opponents)"

puts "=" * 80
