#!/usr/bin/env ruby
# analyze_class_bias.rb - Generic class bias analyzer
#
# Measures bias for any class by comparing its scoring opportunities
# against all other classes. Can be used before/after question changes
# to validate fairness.
#
# Usage:
#   ruby analyze_class_bias.rb wizard
#   ruby analyze_class_bias.rb cleric
#   ruby analyze_class_bias.rb fighter
#
# Or test all classes:
#   for class in fighter wizard cleric rogue druid bard ranger paladin barbarian sorcerer warlock; do
#     ruby analyze_class_bias.rb $class
#   done

require 'yaml'

# ============================================================================
# CONFIGURATION - Modify these values as needed
# ============================================================================

# File paths
QUESTION_BANK_PATH = '_data/question-bank.yml'
CLASS_FILES_PATTERN = 'docs/_Classes/*.md'

# Bias assessment thresholds (advantage ratio)
# Upper bounds (over-represented)
THRESHOLD_EXCELLENT = 1.1     # 1.0-1.1x = balanced
THRESHOLD_ACCEPTABLE = 1.2    # 1.1-1.2x = slight bias
THRESHOLD_PROBLEM = 1.5       # 1.2-1.5x = moderate bias
                              # >1.5x = critical bias

# Lower bounds (under-represented)
THRESHOLD_LOW_EXCELLENT = 0.9   # 0.9-1.0x = slightly low but acceptable
THRESHOLD_LOW_PROBLEM = 0.8     # 0.8-0.9x = moderate under-representation
THRESHOLD_LOW_CRITICAL = 0.7    # <0.8x = critical under-representation

# Display configuration
MAX_TRAITS_SHOWN = 10        # Show top N traits in detail
TRAIT_HIGH_FREQUENCY = 30    # Mark traits appearing this many times with ⚠️
TRAIT_MEDIUM_FREQUENCY = 20  # Mark traits appearing this many times with !

# Status symbols
SYMBOL_EXCELLENT = "✅"
SYMBOL_ACCEPTABLE = "⚠️ "
SYMBOL_PROBLEM = "❌"
SYMBOL_CRITICAL = "🚨"

# ============================================================================
# END CONFIGURATION
# ============================================================================

# Parse command line
target_class = ARGV[0]

# Load question bank
unless File.exist?(QUESTION_BANK_PATH)
  puts "Error: #{QUESTION_BANK_PATH} not found. Run from dnd/ directory."
  exit 1
end

questions = YAML.load_file(QUESTION_BANK_PATH)

# Load class profiles to get signature traits
class_traits = {}
class_archetype_counts = {}

Dir[CLASS_FILES_PATTERN].each do |file|
  content = File.read(file)
  if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
    data = YAML.safe_load($1, permitted_classes: [Symbol], aliases: true)
    if data['profile']
      class_name = File.basename(file, '.md')

      # Collect all traits for this class
      all_traits = []

      # Base class traits
      if data['profile']['specific']
        all_traits += data['profile']['specific']
      end

      # Count archetypes
      if data['profile']['archetypes']
        class_archetype_counts[class_name] = data['profile']['archetypes'].size

        # Archetype-specific traits
        data['profile']['archetypes'].each do |arch_name, arch_data|
          if arch_data['specific']
            all_traits += arch_data['specific']
          end
        end
      end

      class_traits[class_name] = all_traits.uniq
    end
  end
end

# Verify target class exists (if specified)
if target_class && !class_traits.key?(target_class)
  puts "Error: Class '#{target_class}' not found."
  puts "Available classes: #{class_traits.keys.sort.join(', ')}"
  exit 1
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

# Count scoring opportunities per class
class_opportunities = {}
class_traits.each do |class_name, traits|
  opportunities = 0
  trait_coverage = 0

  traits.each do |trait|
    if trait_question_counts[trait]
      opportunities += trait_question_counts[trait]
      trait_coverage += 1
    end
  end

  class_opportunities[class_name] = {
    total: opportunities,
    covered_traits: trait_coverage,
    total_traits: traits.size,
    archetypes: class_archetype_counts[class_name] || 0
  }
end

# Calculate statistics
total_opportunities = class_opportunities.values.map { |v| v[:total] }.sum
avg_opportunities = total_opportunities / class_opportunities.size.to_f

if target_class
  # Detailed analysis for specific class
  target_stats = class_opportunities[target_class]
  other_opportunities = class_opportunities.reject { |k, v| k == target_class }.values.map { |v| v[:total] }
  avg_other = other_opportunities.sum / other_opportunities.size.to_f
  advantage_ratio = target_stats[:total] / avg_other

  # Calculate trait coverage %
  target_coverage_pct = (target_stats[:covered_traits].to_f / target_stats[:total_traits] * 100).round(1)

  puts "=" * 80
  puts "CLASS BIAS ANALYSIS: #{target_class.upcase}"
  puts "=" * 80
  puts ""

  puts "Class Profile:"
  puts "  Archetypes: #{target_stats[:archetypes]}"
  puts "  Unique traits: #{target_stats[:total_traits]}"
  puts "  Traits in questions: #{target_stats[:covered_traits]} (#{target_coverage_pct}%)"
  puts ""

  puts "Scoring Opportunities:"
  puts "  #{target_class.capitalize}: #{target_stats[:total]} question assignments"
  puts "  Other classes (avg): #{avg_other.round(1)} question assignments"
  puts ""

  puts "Advantage Ratio: #{advantage_ratio.round(2)}x"
  puts ""

  puts "Assessment:"
  if advantage_ratio >= 1.0 && advantage_ratio < THRESHOLD_EXCELLENT
    puts "  #{SYMBOL_EXCELLENT} EXCELLENT - Balanced discovery (1.0-#{THRESHOLD_EXCELLENT}x range)"
    puts "     #{target_class.capitalize} has roughly equal scoring opportunities to other classes."
  elsif advantage_ratio >= THRESHOLD_EXCELLENT && advantage_ratio < THRESHOLD_ACCEPTABLE
    puts "  #{SYMBOL_ACCEPTABLE} ACCEPTABLE - Slight over-representation (#{THRESHOLD_EXCELLENT}-#{THRESHOLD_ACCEPTABLE}x range)"
    puts "     #{target_class.capitalize} has #{((advantage_ratio - 1) * 100).round(0)}% more opportunities than average. Consider rebalancing."
  elsif advantage_ratio >= THRESHOLD_ACCEPTABLE && advantage_ratio < THRESHOLD_PROBLEM
    puts "  #{SYMBOL_PROBLEM} PROBLEM - Moderate over-representation (#{THRESHOLD_ACCEPTABLE}-#{THRESHOLD_PROBLEM}x range)"
    puts "     #{target_class.capitalize} has #{((advantage_ratio - 1) * 100).round(0)}% more opportunities than average. Needs fixing."
  elsif advantage_ratio >= THRESHOLD_PROBLEM
    puts "  #{SYMBOL_CRITICAL} CRITICAL - Severe over-representation (>#{THRESHOLD_PROBLEM}x)"
    puts "     #{target_class.capitalize} has #{((advantage_ratio - 1) * 100).round(0)}% more opportunities than average. Urgent fix needed!"
  elsif advantage_ratio >= THRESHOLD_LOW_EXCELLENT && advantage_ratio < 1.0
    puts "  #{SYMBOL_EXCELLENT} EXCELLENT - Slightly low but acceptable (#{THRESHOLD_LOW_EXCELLENT}-1.0x range)"
    puts "     #{target_class.capitalize} has #{((1 - advantage_ratio) * 100).round(0)}% fewer opportunities but still discoverable."
  elsif advantage_ratio >= THRESHOLD_LOW_PROBLEM && advantage_ratio < THRESHOLD_LOW_EXCELLENT
    puts "  #{SYMBOL_ACCEPTABLE} ACCEPTABLE - Moderate under-representation (#{THRESHOLD_LOW_PROBLEM}-#{THRESHOLD_LOW_EXCELLENT}x range)"
    puts "     #{target_class.capitalize} has #{((1 - advantage_ratio) * 100).round(0)}% fewer opportunities. Consider adding questions."
  elsif advantage_ratio >= THRESHOLD_LOW_CRITICAL && advantage_ratio < THRESHOLD_LOW_PROBLEM
    puts "  #{SYMBOL_PROBLEM} PROBLEM - Severe under-representation (#{THRESHOLD_LOW_CRITICAL}-#{THRESHOLD_LOW_PROBLEM}x range)"
    puts "     #{target_class.capitalize} has #{((1 - advantage_ratio) * 100).round(0)}% fewer opportunities. Needs more coverage!"
  else
    puts "  #{SYMBOL_CRITICAL} CRITICAL - Extreme under-representation (<#{THRESHOLD_LOW_CRITICAL}x)"
    puts "     #{target_class.capitalize} has #{((1 - advantage_ratio) * 100).round(0)}% fewer opportunities. Urgent fix needed!"
  end
  puts ""

  # Show detailed trait breakdown for target class
  puts "#{target_class.capitalize} Trait Frequencies:"
  class_traits[target_class].sort_by { |t| -(trait_question_counts[t] || 0) }.first(MAX_TRAITS_SHOWN).each do |trait|
    count = trait_question_counts[trait] || 0
    pct = (count.to_f / questions.size * 100).round(1)
    marker = count >= TRAIT_HIGH_FREQUENCY ? "⚠️" : (count >= TRAIT_MEDIUM_FREQUENCY ? "!" : "")
    puts "  #{trait.ljust(30)} #{count} questions (#{pct}%) #{marker}"
  end

  if class_traits[target_class].size > MAX_TRAITS_SHOWN
    puts "  ... and #{class_traits[target_class].size - MAX_TRAITS_SHOWN} more traits"
  end
  puts ""
end

# Show comparison table
if target_class
  puts "All Classes Comparison:"
else
  puts "=" * 80
  puts "ALL CLASSES BIAS OVERVIEW"
  puts "=" * 80
  puts ""
  puts "ℹ️  For detailed analysis of a specific class, run:"
  puts "   ruby tools/analyze_class_bias.rb <classname>"
  puts ""
  puts "   Available classes: #{class_traits.keys.sort.join(', ')}"
  puts ""
  puts "All Classes Comparison:"
end
puts "  Class".ljust(15) + "Opportunities".ljust(18) + "Ratio".ljust(10) + "Status"
puts "  " + "-" * 60

class_opportunities.sort_by { |k, v| -v[:total] }.each do |class_name, stats|
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

  highlight = class_name == target_class ? "→ " : "  "

  puts "#{highlight}#{class_name.ljust(13)} #{stats[:total].to_s.ljust(18)} #{ratio.round(2).to_s.ljust(10)} #{status}"
end

puts ""
puts "=" * 80
