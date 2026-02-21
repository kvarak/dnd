#!/usr/bin/env ruby

require 'yaml'

# Load the question bank
question_bank = YAML.load_file('_data/question-bank.yml')

# Define the questions mentioned in Tasks 7-12
task_7_questions = ['magic-interest', 'study-vs-talent', 'ancient-lore']
task_8_questions = ['religious-devotion', 'divine-ritual', 'divine-investigation']
task_9_questions = ['healing-magic', 'compassion-for-suffering']
task_10_questions = ['patience-planning', 'defensive-stance', 'precision-sniping']
task_11_questions = ['crafting-engineering', 'sophisticated-approach']
task_12_keep_questions = ['tactical-thinking', 'defensive-protection', 'shield-defense', 'heavy-armor-preference']

all_remove_questions = task_7_questions + task_8_questions + task_9_questions + task_10_questions + task_11_questions

puts "=== DISCIPLINED-VALUE REMOVAL ANALYSIS ==="
puts

# Find questions with disciplined-value that should be removed
questions_to_modify = []

question_bank.each do |question|
  next unless question.is_a?(Hash) && question['id']

  if all_remove_questions.include?(question['id'])
    has_disciplined_value = false

    question['answers']&.each do |answer_key, answer_data|
      if answer_data.is_a?(Hash) && answer_data.has_key?('disciplined-value')
        has_disciplined_value = true
        puts "#{question['id']} (#{answer_key}): disciplined-value: #{answer_data['disciplined-value']}"
      end
    end

    if has_disciplined_value
      task_num = if task_7_questions.include?(question['id'])
                   "Task 7"
                 elsif task_8_questions.include?(question['id'])
                   "Task 8"
                 elsif task_9_questions.include?(question['id'])
                   "Task 9"
                 elsif task_10_questions.include?(question['id'])
                   "Task 10"
                 elsif task_11_questions.include?(question['id'])
                   "Task 11"
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
puts "=== QUESTIONS TO KEEP DISCIPLINED-VALUE ==="
question_bank.each do |question|
  next unless question.is_a?(Hash) && question['id']

  if task_12_keep_questions.include?(question['id'])
    has_disciplined_value = false

    question['answers']&.each do |answer_key, answer_data|
      if answer_data.is_a?(Hash) && answer_data.has_key?('disciplined-value')
        has_disciplined_value = true
        puts "#{question['id']} (#{answer_key}): disciplined-value: #{answer_data['disciplined-value']} - KEEP"
      end
    end
  end
end

puts
puts "=== SUMMARY ==="
puts "Questions to remove disciplined-value from: #{questions_to_modify.length}"
questions_to_modify.each do |q|
  puts "  #{q[:task]}: #{q[:id]}"
end