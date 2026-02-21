#!/usr/bin/env ruby

require 'yaml'

# Load question-bank data
def load_questions(file_path)
  YAML.load_file(file_path)
end

puts "=== PHYSICAL TRAIT ANALYSIS FOR TASKS 13-15 ==="
puts

# Define the questions mentioned in tasks
task_13_magic_questions = ['magic-interest', 'elemental-power', 'destructive-magic', 'healing-magic', 'ancient-lore']
task_14_skill_questions = ['stealth-approach', 'deception-disguise', 'treasure-motivation', 'secret-identity']
task_15_strength_questions = ['overwhelming-force', 'heavy-armor-preference', 'fearless-charge', 'unarmed-brawling', 'throwing-weapons']

# Load questions
questions = load_questions('_data/question-bank.yml')

def find_physical_usage(questions, question_ids, task_name)
  puts "=== #{task_name} ==="
  found_any = false

  question_ids.each do |question_id|
    question = questions.find { |q| q['id'] == question_id }
    if question
      has_physical = false
      physical_details = []

      if question['answers']
        question['answers'].each do |answer_key, answer_data|
          if answer_data && answer_data['physical']
            has_physical = true
            physical_details << "  #{answer_key}: physical #{answer_data['physical']} # #{answer_data['physical'] > 0 ? 'POSITIVE' : 'NEGATIVE'}"
          end
        end
      end

      if has_physical
        puts "#{question_id}: #{question['text']}"
        physical_details.each { |detail| puts detail }
        puts
        found_any = true
      end
    else
      puts "#{question_id}: NOT FOUND"
    end
  end

  puts "No physical traits found in this task group." unless found_any
  puts
end

# Analyze each task group
find_physical_usage(questions, task_13_magic_questions, "TASK 13: Magic Questions (Remove physical)")
find_physical_usage(questions, task_14_skill_questions, "TASK 14: Skill/Stealth Questions (Replace physical)")
find_physical_usage(questions, task_15_strength_questions, "TASK 15: Strength/Athletics Questions (Keep physical)")

puts "=== ANALYSIS COMPLETE ==="