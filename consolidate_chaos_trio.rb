#!/usr/bin/env ruby
# consolidate_chaos_trio.rb - Merge 3 chaos questions into 1 multi-choice question

require 'yaml'

# Questions to remove
QUESTIONS_TO_REMOVE = [
  'chaos-unpredictability',
  'chaotic-magic',
  'unpredictable-power'
]

# New multi-choice question
NEW_QUESTION = {
  'id' => 'chaos-acceptance',
  'text' => 'How do you feel about chaos, unpredictability, and wild magic?',
  'category' => 'magic-preference',
  'answers' => {
    'Embrace it fully' => {
      'chaos-magic' => 4,
      'wild-surges' => 4,
      'chaotic-value' => 4,
      'unpredictable-power' => 4,
      'entropy-conduit' => 3,
      'innate-magic' => 3,
      'reckless-value' => 2
    },
    'Controlled chaos' => {
      'chaos-magic' => 2,
      'versatile-magic' => 2,
      'innate-magic' => 2,
      'adaptive' => 1
    },
    'Tolerate when necessary' => {
      'adaptive' => 2,
      'adaptable-fighter' => 2,
      'versatile-magic' => 1
    },
    'Avoid chaos' => {
      'disciplined-value' => 4,
      'tactical-value' => 3,
      'scholar' => 2,
      'chaos-magic' => -2,
      'chaotic-value' => -2
    },
    'dont-know' => {}
  }
}

# Load the question bank
questions = YAML.load_file('_data/question-bank.yml')

puts "=" * 80
puts "CHAOS TRIO CONSOLIDATION"
puts "=" * 80
puts ""

# Count before
puts "Questions before: #{questions.size}"
puts ""

# Remove the 3 chaos questions
removed_count = 0
QUESTIONS_TO_REMOVE.each do |question_id|
  if questions.any? { |q| q['id'] == question_id }
    questions.reject! { |q| q['id'] == question_id }
    removed_count += 1
    puts "✓ Removed: #{question_id}"
  else
    puts "⚠ Not found: #{question_id}"
  end
end

puts ""
puts "Questions after removal: #{questions.size}"
puts ""

# Add the new multi-choice question at the beginning (after header comments)
puts "✓ Adding new question: chaos-acceptance (multi-choice)"
questions.unshift(NEW_QUESTION)

puts ""
puts "Questions after addition: #{questions.size}"
puts "Net change: #{questions.size - 104} (removed 3, added 1)"
puts ""

# Save the updated question bank
File.write('_data/question-bank.yml', questions.to_yaml)
puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "=" * 80
