#!/usr/bin/env ruby
require 'yaml'
require 'json'
require 'set'

# COMPREHENSIVE TRAIT ANALYSIS
# Cross-references questions, archetypes, and scoring to find imbalances

puts "=" * 80
puts "COMPREHENSIVE QUESTIONNAIRE FAIRNESS ANALYSIS"
puts "=" * 80

# Load question bank
questions = YAML.load_file('_data/question-bank.yml')

# Analyze trait coverage in QUESTIONS
trait_question_count = Hash.new(0)
trait_question_scores = Hash.new { |h, k| h[k] = [] }

questions.each do |q|
  next unless q.is_a?(Hash) && q['answers']
  q['answers'].each do |answer_key, scores|
    next if answer_key == 'dont-know'
    next unless scores.is_a?(Hash)
    scores.each do |trait, score|
      next unless score.is_a?(Numeric)
      trait_question_count[trait] += 1
      trait_question_scores[trait] << score
    end
  end
end

# Load all class files for ARCHETYPE analysis
trait_archetype_count = Hash.new(0)
all_archetypes = []

Dir['docs/_Classes/*.md'].each do |file|
  content = File.read(file)
  if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
    data = YAML.safe_load($1, permitted_classes: [Symbol], aliases: true)
    next unless data['profile']

    class_name = File.basename(file, '.md')
    base_traits = data.dig('profile', 'specific') || []

    if data.dig('profile', 'archetypes')
      data['profile']['archetypes'].each do |arch_key, arch_data|
        archetype_name = "#{class_name}:#{arch_key}"
        all_traits = base_traits + (arch_data['specific'] || [])

        all_archetypes << {
          name: archetype_name,
          traits: all_traits
        }

        all_traits.each { |t| trait_archetype_count[t] += 1 }
      end
    end
  end
end

# CROSS-REFERENCE ANALYSIS
all_traits = (trait_question_count.keys + trait_archetype_count.keys).uniq.sort

puts "\n1. TRAIT COVERAGE IMBALANCE"
puts "=" * 80
puts "Traits should ideally have balanced representation in both questions AND archetypes."
puts "High archetype usage + low question coverage = Unfair bias AGAINST those archetypes"
puts "High question coverage + low archetype usage = Wasted questions"
puts ""

imbalanced_traits = []

all_traits.each do |trait|
  q_count = trait_question_count[trait] || 0
  a_count = trait_archetype_count[trait] || 0

  # Calculate imbalance ratio
  # Perfect balance would be proportional: if trait is in 50% of archetypes,
  # it should appear in ~50% of potential question slots

  total_archetypes = all_archetypes.size.to_f
  total_questions = questions.size.to_f

  archetype_percentage = (a_count / total_archetypes * 100)
  question_percentage = (q_count / total_questions * 100)

  imbalance = (archetype_percentage - question_percentage).abs

  if a_count > 20 && q_count < 5
    imbalanced_traits << {
      trait: trait,
      q_count: q_count,
      a_count: a_count,
      arch_pct: archetype_percentage,
      quest_pct: question_percentage,
      imbalance: imbalance,
      issue: "HIGH_ARCH_LOW_QUEST"
    }
  elsif q_count > 20 && a_count < 10
    imbalanced_traits << {
      trait: trait,
      q_count: q_count,
      a_count: a_count,
      arch_pct: archetype_percentage,
      quest_pct: question_percentage,
      imbalance: imbalance,
      issue: "HIGH_QUEST_LOW_ARCH"
    }
  end
end

# Sort by imbalance severity
imbalanced_traits.sort_by! { |t| -t[:imbalance] }

puts "CRITICAL IMBALANCES:"
puts ""
puts "A. Underquestioned Traits (Popular in archetypes, rare in questions)"
puts "   → These archetypes can't be properly discovered!"
puts ""
imbalanced_traits.select { |t| t[:issue] == "HIGH_ARCH_LOW_QUEST" }.each do |t|
  puts "   #{t[:trait].ljust(35)} | #{t[:a_count]} archetypes (#{t[:arch_pct].round(1)}%) | #{t[:q_count]} questions (#{t[:quest_pct].round(1)}%)"
end

puts "\nB. Overquestioned Traits (Rare in archetypes, common in questions)"
puts "   → These questions are inefficient!"
puts ""
imbalanced_traits.select { |t| t[:issue] == "HIGH_QUEST_LOW_ARCH" }.each do |t|
  puts "   #{t[:trait].ljust(35)} | #{t[:a_count]} archetypes (#{t[:arch_pct].round(1)}%) | #{t[:q_count]} questions (#{t[:quest_pct].round(1)}%)"
end

puts "\n\n2. ARCHETYPE DISCOVERABILITY SCORE"
puts "=" * 80
puts "How well can each archetype be discovered through questions?"
puts "Score = % of archetype's traits that have question coverage"
puts ""

archetype_scores = all_archetypes.map do |arch|
  traits_with_questions = arch[:traits].count { |t| trait_question_count[t] > 0 }
  coverage_pct = arch[:traits].any? ? (traits_with_questions.to_f / arch[:traits].size * 100) : 0

  {
    name: arch[:name],
    total_traits: arch[:traits].size,
    covered_traits: traits_with_questions,
    coverage_pct: coverage_pct
  }
end

archetype_scores.sort_by! { |a| a[:coverage_pct] }

puts "WORST DISCOVERABILITY (Bottom 30):"
archetype_scores.first(30).each do |arch|
  puts "  #{arch[:name].ljust(55)} | #{arch[:covered_traits]}/#{arch[:total_traits]} traits covered (#{arch[:coverage_pct].round(1)}%)"
end

puts "\n\n3. QUESTION EFFICIENCY ANALYSIS"
puts "=" * 80
puts "How many archetypes does each question potentially affect?"
puts ""

question_efficiency = questions.map do |q|
  next unless q.is_a?(Hash) && q['id']

  affected_traits = Set.new
  affected_archetypes = Set.new

  if q['answers']
    q['answers'].each do |answer_key, scores|
      next if answer_key == 'dont-know'
      next unless scores.is_a?(Hash)

      scores.each do |trait, score|
        next unless score.is_a?(Numeric)
        affected_traits << trait

        # Find archetypes using this trait
        all_archetypes.each do |arch|
          if arch[:traits].include?(trait)
            affected_archetypes << arch[:name]
          end
        end
      end
    end
  end

  {
    id: q['id'],
    traits: affected_traits.size,
    archetypes: affected_archetypes.size,
    efficiency: affected_archetypes.size.to_f / affected_traits.size
  }
end.compact

question_efficiency.sort_by! { |q| q[:archetypes] }

puts "LEAST EFFICIENT QUESTIONS (affect fewest archetypes):"
question_efficiency.first(20).each do |q|
  puts "  #{q[:id].ljust(40)} | #{q[:traits]} traits → #{q[:archetypes]} archetypes (#{q[:efficiency].round(2)} arch/trait)"
end

puts "\nMOST EFFICIENT QUESTIONS (affect most archetypes):"
question_efficiency.last(20).reverse.each do |q|
  puts "  #{q[:id].ljust(40)} | #{q[:traits]} traits → #{q[:archetypes]} archetypes (#{q[:efficiency].round(2)} arch/trait)"
end

puts "\n\n4. RECOMMENDATIONS FOR FAIRNESS"
puts "=" * 80

total_q = questions.size
avg_coverage = archetype_scores.map { |a| a[:coverage_pct] }.sum / archetype_scores.size

puts "\nCurrent State:"
puts "  - Total Questions: #{total_q}"
puts "  - Total Archetypes: #{all_archetypes.size}"
puts "  - Average Archetype Coverage: #{avg_coverage.round(1)}%"
puts "  - Archetypes with <50% coverage: #{archetype_scores.count { |a| a[:coverage_pct] < 50 }}"
puts "  - Critical imbalances found: #{imbalanced_traits.size}"

puts "\n✨ KEY RECOMMENDATIONS:"
puts ""
puts "1. REDUCE TOTAL QUESTIONS (135 → 40-60)"
puts "   - Remove low-efficiency questions"
puts "   - Focus on questions that affect many archetypes"
puts ""
puts "2. MERGE SIMILAR TRAITS"
puts "   - Reduces complexity without losing differentiation"
puts "   - E.g., 'tactical-value' appears in 60 questions but only helps certain archetypes"
puts ""
puts "3. MULTI-DIMENSIONAL QUESTIONS"
puts "   - Each question should affect 5-10 traits simultaneously"
puts "   - Ensures every question helps discover multiple archetypes"
puts ""
puts "4. FIX CRITICAL IMBALANCES"
puts "   - Add questions for underquestioned traits"
puts "   - Remove redundant questions for overquestioned traits"
puts ""
puts "5. BALANCED SCORING WEIGHTS"
puts "   - Traits in many archetypes should have moderate question coverage"
puts "   - Traits in few archetypes should have sparse but targeted coverage"

puts "\n" + "=" * 80
