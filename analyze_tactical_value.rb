#!/usr/bin/env ruby

require 'yaml'

# Load the question bank
question_bank = YAML.load_file('_data/question-bank.yml')

# Define the questions mentioned in Tasks 1-6
task_1_questions = ['magic-interest', 'elemental-power', 'destructive-magic', 'healing-magic']
task_2_questions = ['religious-devotion', 'divine-ritual', 'divine-power-source']
task_3_questions = ['protect-others', 'combat-risks', 'lethal-force']
task_4_questions = ['weapon-mastery', 'crafting-engineering', 'heavy-armor-preference']
task_5_questions = ['study-vs-talent', 'patience-planning', 'life-environment']
task_6_keep_questions = ['tactical-thinking', 'precision-vs-power', 'group-tactics', 'teamwork-tactics']

all_remove_questions = task_1_questions + task_2_questions + task_3_questions + task_4_questions + task_5_questions

puts "=== TACTICAL-VALUE REMOVAL ANALYSIS ==="
puts

# Find questions with tactical-value that should be removed
questions_to_modify = []

question_bank.each do |question|
  next unless question.is_a?(Hash) && question['id']

  if all_remove_questions.include?(question['id'])
    has_tactical_value = false

    question['answers']&.each do |answer_key, answer_data|
      if answer_data.is_a?(Hash) && answer_data.has_key?('tactical-value')
        has_tactical_value = true
        puts "#{question['id']} (#{answer_key}): tactical-value: #{answer_data['tactical-value']}"
      end
    end

    if has_tactical_value
      task_num = if task_1_questions.include?(question['id'])
                   "Task 1"
                 elsif task_2_questions.include?(question['id'])
                   "Task 2"
                 elsif task_3_questions.include?(question['id'])
                   "Task 3"
                 elsif task_4_questions.include?(question['id'])
                   "Task 4"
                 elsif task_5_questions.include?(question['id'])
                   "Task 5"
                 end

      questions_to_modify << {
        id: question['id'],
        task: task_num,
        question: question
      }
    end
  end
end

puts
puts "=== QUESTIONS TO KEEP TACTICAL-VALUE ==="
question_bank.each do |question|
  next unless question.is_a?(Hash) && question['id']

  if task_6_keep_questions.include?(question['id'])
    has_tactical_value = false

    question['answers']&.each do |answer_key, answer_data|
      if answer_data.is_a?(Hash) && answer_data.has_key?('tactical-value')
        has_tactical_value = true
        puts "#{question['id']} (#{answer_key}): tactical-value: #{answer_data['tactical-value']} - KEEP"
      end
    end
  end
end

puts
puts "=== SUMMARY ==="
puts "Questions to remove tactical-value from: #{questions_to_modify.length}"
questions_to_modify.each do |q|
  puts "  #{q[:task]}: #{q[:id]}"
end