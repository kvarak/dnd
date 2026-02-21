#!/usr/bin/env ruby
# analyze_archetype_bias.rb - Archetype bias analyzer
#
# Measures bias for all archetypes by comparing their scoring opportunities
# against the average. Shows which archetypes are over/under-represented
# in the question bank.
#
# Usage:
#   ruby analyze_archetype_bias.rb

require 'yaml'

# ============================================================================
# CONFIGURATION - Modify these values as needed
# ============================================================================

# File paths
QUESTION_BANK_PATH = '_data/question-bank.yml'
CLASS_FILES_PATTERN = 'docs/_Classes/*.md'

# Bias assessment thresholds (advantage ratio)
# Upper bounds (over-represented)
THRESHOLD_EXCELLENT = 1.2     # 1.0-1.2x = balanced
THRESHOLD_ACCEPTABLE = 1.5    # 1.2-1.5x = slight bias
THRESHOLD_PROBLEM = 2.0       # 1.5-2.0x = moderate bias
                              # >2.0x = critical bias

# Lower bounds (under-represented)
THRESHOLD_LOW_EXCELLENT = 0.8   # 0.8-1.0x = slightly low but acceptable
THRESHOLD_LOW_PROBLEM = 0.6     # 0.6-0.8x = moderate under-representation
THRESHOLD_LOW_CRITICAL = 0.5    # <0.5x = critical under-representation

# Display configuration
TOP_N = 5          # Show top N archetypes
MIDDLE_N = 3       # Show middle N archetypes
BOTTOM_N = 5       # Show bottom N archetypes

# Status symbols
SYMBOL_EXCELLENT = "✅"
SYMBOL_ACCEPTABLE = "⚠️ "
SYMBOL_PROBLEM = "❌"
SYMBOL_CRITICAL = "🚨"

# ============================================================================
# END CONFIGURATION
# ============================================================================

# Load question bank
unless File.exist?(QUESTION_BANK_PATH)
  puts "Error: #{QUESTION_BANK_PATH} not found. Run from dnd/ directory."
  exit 1
end

questions = YAML.load_file(QUESTION_BANK_PATH)

# Load all archetypes from class files
archetypes = {}  # { "fighter:champion" => [traits] }

Dir[CLASS_FILES_PATTERN].each do |file|
  content = File.read(file)
  if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
    data = YAML.safe_load($1, permitted_classes: [Symbol], aliases: true)
    if data['profile'] && data['profile']['archetypes']
      class_name = File.basename(file, '.md')

      data['profile']['archetypes'].each do |arch_name, arch_data|
        archetype_key = "#{class_name}:#{arch_name}"

        # Collect all traits for this archetype
        all_traits = []

        # Class-level traits
        if data['profile']['traits']
          all_traits += data['profile']['traits']
        end

        # Archetype-specific traits
        if arch_data['traits']
          all_traits += arch_data['traits']
        end

        archetypes[archetype_key] = all_traits.uniq
      end
    end
  end
end

# Count trait frequencies in questions
trait_question_counts = {}
questions.each do |q|
  next unless q.is_a?(Hash) && q['answers']
  q['answers'].each do |answer_key, scores|
    next if answer_key == 'dont-know' || !scores.is_a?(Hash)
    scores.each_key do |trait|
      trait_question_counts[trait] = trait_question_counts.fetch(trait, 0) + 1
    end
  end
end

# Count scoring opportunities per archetype
archetype_opportunities = {}
archetypes.each do |arch_key, traits|
  opportunities = 0
  trait_coverage = 0

  traits.each do |trait|
    if trait_question_counts[trait]
      opportunities += trait_question_counts[trait]
      trait_coverage += 1
    end
  end

  archetype_opportunities[arch_key] = {
    total: opportunities,
    covered_traits: trait_coverage,
    total_traits: traits.size
  }
end

# Calculate statistics
total_opportunities = archetype_opportunities.values.map { |v| v[:total] }.sum
avg_opportunities = total_opportunities / archetype_opportunities.size.to_f

# Sort archetypes by opportunity count
sorted_archetypes = archetype_opportunities.sort_by { |k, v| -v[:total] }

# Calculate ratios and statuses
archetype_data = sorted_archetypes.map do |arch_key, stats|
  ratio = stats[:total] / avg_opportunities

  status = if ratio >= 1.0 && ratio < THRESHOLD_EXCELLENT
    SYMBOL_EXCELLENT
  elsif ratio >= THRESHOLD_EXCELLENT && ratio < THRESHOLD_ACCEPTABLE
    SYMBOL_ACCEPTABLE
  elsif ratio >= THRESHOLD_ACCEPTABLE && ratio < THRESHOLD_PROBLEM
    SYMBOL_PROBLEM
  elsif ratio >= THRESHOLD_PROBLEM
    SYMBOL_CRITICAL
  elsif ratio >= THRESHOLD_LOW_EXCELLENT && ratio < 1.0
    SYMBOL_EXCELLENT
  elsif ratio >= THRESHOLD_LOW_PROBLEM && ratio < THRESHOLD_LOW_EXCELLENT
    SYMBOL_ACCEPTABLE
  elsif ratio >= THRESHOLD_LOW_CRITICAL && ratio < THRESHOLD_LOW_PROBLEM
    SYMBOL_PROBLEM
  else
    SYMBOL_CRITICAL
  end

  {
    key: arch_key,
    opportunities: stats[:total],
    ratio: ratio,
    status: status,
    coverage: stats[:covered_traits],
    total_traits: stats[:total_traits]
  }
end

# Find middle archetypes (closest to 1.0x ratio)
middle_archetypes = archetype_data.sort_by { |a| (a[:ratio] - 1.0).abs }.first(MIDDLE_N)

# Display results
puts "=" * 80
puts "ARCHETYPE BIAS ANALYSIS"
puts "=" * 80
puts ""

puts "Statistics:"
puts "  Total archetypes: #{archetype_opportunities.size}"
puts "  Average opportunities: #{avg_opportunities.round(1)}"
puts "  Total questions: #{questions.size}"
puts ""

puts "All Archetypes Comparison:"
puts "  " + "Archetype".ljust(35) + "Opportunities".ljust(18) + "Ratio".ljust(10) + "Status"
puts "  " + "-" * 70
puts ""

# Top N
puts "  TOP #{TOP_N} (Most Over-represented):"
archetype_data.first(TOP_N).each do |arch|
  puts "  #{arch[:key].ljust(35)} #{arch[:opportunities].to_s.ljust(18)} #{arch[:ratio].round(2).to_s.ljust(10)} #{arch[:status]}"
end
puts ""

# Middle N
puts "  MIDDLE #{MIDDLE_N} (Most Balanced):"
middle_archetypes.each do |arch|
  puts "  #{arch[:key].ljust(35)} #{arch[:opportunities].to_s.ljust(18)} #{arch[:ratio].round(2).to_s.ljust(10)} #{arch[:status]}"
end
puts ""

# Bottom N
puts "  BOTTOM #{BOTTOM_N} (Most Under-represented):"
archetype_data.last(BOTTOM_N).reverse.each do |arch|
  puts "  #{arch[:key].ljust(35)} #{arch[:opportunities].to_s.ljust(18)} #{arch[:ratio].round(2).to_s.ljust(10)} #{arch[:status]}"
end
puts ""

# Summary statistics
over_represented = archetype_data.count { |a| a[:ratio] >= THRESHOLD_EXCELLENT }
balanced = archetype_data.count { |a| a[:ratio] >= THRESHOLD_LOW_EXCELLENT && a[:ratio] < THRESHOLD_EXCELLENT }
under_represented = archetype_data.count { |a| a[:ratio] < THRESHOLD_LOW_EXCELLENT }

puts "Summary:"
puts "  Over-represented (≥#{THRESHOLD_EXCELLENT}x): #{over_represented} archetypes (#{(over_represented.to_f / archetype_data.size * 100).round(1)}%)"
puts "  Balanced (#{THRESHOLD_LOW_EXCELLENT}-#{THRESHOLD_EXCELLENT}x): #{balanced} archetypes (#{(balanced.to_f / archetype_data.size * 100).round(1)}%)"
puts "  Under-represented (<#{THRESHOLD_LOW_EXCELLENT}x): #{under_represented} archetypes (#{(under_represented.to_f / archetype_data.size * 100).round(1)}%)"
puts ""

# Identify critical issues
critical_over = archetype_data.select { |a| a[:ratio] >= THRESHOLD_PROBLEM }
critical_under = archetype_data.select { |a| a[:ratio] < THRESHOLD_LOW_PROBLEM }

if critical_over.any? || critical_under.any?
  puts "⚠️  Critical Issues:"
  if critical_over.any?
    puts "  #{critical_over.size} archetypes with >#{THRESHOLD_PROBLEM}x ratio (severe over-representation)"
  end
  if critical_under.any?
    puts "  #{critical_under.size} archetypes with <#{THRESHOLD_LOW_PROBLEM}x ratio (severe under-representation)"
  end
  puts ""
end

puts "=" * 80
