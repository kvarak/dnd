#!/usr/bin/env ruby
require 'yaml'

questions = YAML.load_file('_data/question-bank.yml')

puts "Analyzing #{questions.size} questions for removal candidates..."
puts

question_analysis = []

questions.each do |q|
  traits_used = Hash.new(0)
  total_points = 0

  q['answers'].each do |answer_key, traits|
    next if traits.nil? || !traits.is_a?(Hash)
    traits.each do |trait, points|
      traits_used[trait] += points
      total_points += points
    end
  end

  # Count oversaturated traits
  oversaturated = traits_used.select { |t, p|
    ['disciplined-value', 'cunning-value', 'tactical-value', 'versatile-magic', 'physical'].include?(t)
  }
  oversaturated_score = oversaturated.values.sum

  question_analysis << {
    id: q['id'],
    total_points: total_points,
    oversaturated_score: oversaturated_score,
    trait_count: traits_used.size
  }
end

puts "Top 30 questions with most oversaturated trait usage:"
puts "-" * 60
question_analysis.sort_by { |q| -q[:oversaturated_score] }.first(30).each_with_index do |q, idx|
  puts sprintf("%2d. %-35s  oversat=%2d  total=%2d",
    idx+1, q[:id], q[:oversaturated_score], q[:total_points])
end

puts
puts "Bottom 20 questions with lowest total impact:"
puts "-" * 60
question_analysis.sort_by { |q| q[:total_points] }.first(20).each_with_index do |q, idx|
  puts sprintf("%2d. %-35s  total=%2d  traits=%d",
    idx+1, q[:id], q[:total_points], q[:trait_count])
end
