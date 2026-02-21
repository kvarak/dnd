#!/usr/bin/env ruby
require 'yaml'

# Nature/Druid Consolidation
# Remove: plant-communion, terrain-attunement, decay-renewal (3 questions)
# Add: nature-specialization (multi-choice with 6 options)
# Net change: -2 questions

QUESTIONS_TO_REMOVE = [
  'plant-communion',
  'terrain-attunement',
  'decay-renewal'
]

NEW_QUESTION = {
  'id' => 'nature-specialization',
  'text' => 'If drawn to nature magic, what aspect appeals most?',
  'category' => 'magic-preference',
  'answers' => {
    'Plants & growth' => {
      'plant-mastery' => 4,
      'nature-guardian' => 3,
      'healing-magic' => 2
    },
    'Land & terrain' => {
      'terrain-bond' => 4,
      'nature-guardian' => 3,
      'survival-expert' => 2
    },
    'Animals & beasts' => {
      'beast-friend' => 4,
      'nature-guardian' => 3,
      'wild-spirit' => 2
    },
    'Storms & weather' => {
      'storm-caller' => 4,
      'nature-magic' => 3,
      'damage-magic' => 2
    },
    'Decay & renewal' => {
      'decay-mastery' => 4,
      'nature-magic' => 3,
      'death-speaker' => 2,
      'necromancy-dabbler' => 2
    },
    'Not nature-focused' => {
      'arcane-magic' => 2,
      'urban-background' => 2
    },
    'dont-know' => {}
  }
}

puts "=" * 80
puts "NATURE/DRUID SPECIALIZATION CONSOLIDATION"
puts "=" * 80
puts ""

# Load question bank
question_bank = YAML.load_file('_data/question-bank.yml')

puts "Questions before: #{question_bank.length}"
puts ""

# Remove old questions
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
puts ""

# Add new multi-choice question
answer_count = NEW_QUESTION['answers'].keys.length
puts "✓ Adding new question: #{NEW_QUESTION['id']} (multi-choice with #{answer_count} options)"
question_bank << NEW_QUESTION

puts ""
puts "Questions after addition: #{question_bank.length}"
puts "Net change: #{question_bank.length - (93)} (removed #{QUESTIONS_TO_REMOVE.length}, added 1)"
puts ""

# Save updated question bank
File.write('_data/question-bank.yml', YAML.dump(question_bank))

puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "=" * 80
