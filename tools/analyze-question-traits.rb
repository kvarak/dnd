#!/usr/bin/env ruby
require 'yaml'
require 'json'

# Load question bank
questions = YAML.load_file('_data/question-bank.yml')

# Analyze trait coverage in questions
trait_question_count = Hash.new(0)
trait_scores = Hash.new { |h, k| h[k] = [] }

questions.each do |q|
  next unless q.is_a?(Hash) && q['answers']
  q['answers'].each do |answer_key, scores|
    next if answer_key == 'dont-know'
    next unless scores.is_a?(Hash)
    scores.each do |trait, score|
      next unless score.is_a?(Numeric)
      trait_question_count[trait] += 1
      trait_scores[trait] << score
    end
  end
end

puts "=== TRAITS BY QUESTION COVERAGE ==="
puts "Total unique traits in questions: #{trait_question_count.size}"
puts ""

sorted = trait_question_count.sort_by { |k, v| -v }
sorted.each do |trait, count|
  scores = trait_scores[trait]
  avg = scores.sum / scores.size.to_f
  range_min = scores.min
  range_max = scores.max
  puts "#{trait.ljust(30)} | Questions: #{count.to_s.rjust(3)} | Score range: #{range_min.to_s.rjust(3)} to #{range_max.to_s.rjust(3)} | Avg: #{avg.round(2).to_s.rjust(5)}"
end

# Find traits that appear in very few questions
puts "\n=== UNDERREPRESENTED TRAITS (<=3 questions) ==="
sorted.select { |k, v| v <= 3 }.each do |trait, count|
  puts "  #{trait}: #{count} questions"
end

puts "\n=== OVERREPRESENTED TRAITS (>=15 questions) ==="
sorted.select { |k, v| v >= 15 }.each do |trait, count|
  puts "  #{trait}: #{count} questions"
end
