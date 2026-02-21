#!/usr/bin/env ruby
require 'yaml'

# Hunter Specialization Consolidation
# Remove: hunt-dangerous-creatures, hunt-undead-spirits (2 questions)
# Add: hunter-specialization (multi-choice with 5 options)
# Keep: undercover-faith-work (unique infiltrator concept)
# Net change: -1 question

QUESTIONS_TO_REMOVE = [
  'hunt-dangerous-creatures',
  'hunt-undead-spirits'
]

NEW_QUESTION = {
  'id' => 'hunter-specialization',
  'text' => 'If you hunt dangerous creatures, what type interests you most?',
  'category' => 'character-motivation',
  'answers' => {
    'Demons & devils' => {
      'demon-hunter' => 4,
      'holy-power' => 3,
      'divine-warrior' => 3
    },
    'Undead & spirits' => {
      'undead-hunter' => 4,
      'ghost-tracker' => 4,
      'spirit-medium' => 3,
      'death-magic' => 2
    },
    'Fey creatures' => {
      'fey-hunter' => 4,
      'enchantment-resistance' => 3
    },
    'All monsters' => {
      'monster-hunter' => 4,
      'relentless-hunter' => 3,
      'survival-expert' => 2
    },
    'Not a hunter' => {
      'academic-background' => 2,
      'social-manipulator' => 2
    },
    'dont-know' => {}
  }
}

puts "=" * 80
puts "HUNTER SPECIALIZATION CONSOLIDATION"
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
puts "Net change: #{question_bank.length - 89} (removed #{QUESTIONS_TO_REMOVE.length}, added 1)"
puts ""

# Save updated question bank
File.write('_data/question-bank.yml', YAML.dump(question_bank))

puts "✓ Saved to _data/question-bank.yml"
puts ""
puts "Note: undercover-faith-work kept (unique infiltrator concept)"
puts ""
puts "=" * 80
