#!/usr/bin/env ruby
# Low Trait Coverage Analyzer
# Shows traits with low archetype usage or question coverage

require 'yaml'
require 'pathname'
require 'set'

class TraitCoverageAnalyzer
  def initialize(root_dir, archetype_threshold, question_threshold)
    @root_dir = Pathname.new(root_dir)
    @archetype_threshold = archetype_threshold
    @question_threshold = question_threshold
    @trait_data = {} # trait_name => { archetypes: Set, questions: Set }
  end

  def analyze
    load_class_profiles
    load_question_bank
    generate_output
  end

  private

  def load_class_profiles
    class_files = Dir[@root_dir.join('docs/_Classes/*.md')]

    class_files.each do |file|
      content = File.read(file)

      # Extract YAML frontmatter
      if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
        yaml_content = $1
        begin
          data = YAML.safe_load(yaml_content, permitted_classes: [Symbol], aliases: true)
        rescue => e
          next
        end

        next unless data['profile']

        class_name = File.basename(file, '.md')
        generic_traits = data.dig('profile', 'specific') || []

        # Track generic class-level traits
        generic_traits.each do |trait|
          @trait_data[trait] ||= { archetypes: Set.new, questions: Set.new }
          @trait_data[trait][:archetypes] << "#{class_name}:class-level"
        end

        # Process archetypes with inheritance
        if data.dig('profile', 'archetypes')
          data['profile']['archetypes'].each do |arch_key, arch_data|
            archetype_specific_traits = arch_data['specific'] || []
            # Combine class-level generic traits with archetype-specific traits
            all_traits = generic_traits + archetype_specific_traits

            all_traits.uniq.each do |trait|
              @trait_data[trait] ||= { archetypes: Set.new, questions: Set.new }
              @trait_data[trait][:archetypes] << "#{class_name}:#{arch_key}"
            end
          end
        end
      end
    end
  end

  def load_question_bank
    question_file = @root_dir.join('_data/question-bank.yml')
    return unless File.exist?(question_file)

    questions_data = YAML.safe_load(File.read(question_file), permitted_classes: [Symbol], aliases: true)
    questions_data.each do |q|
      next unless q.is_a?(Hash) && q['id']

      question_id = q['id']

      # Extract traits from answers
      if q['answers']
        q['answers'].each do |answer_key, scores|
          next unless scores.is_a?(Hash)

          scores.each do |trait, score|
            next if %w[text category answers id dont-know].include?(trait)

            @trait_data[trait] ||= { archetypes: Set.new, questions: Set.new }
            @trait_data[trait][:questions] << question_id
          end
        end
      end
    end
  end

  def generate_output
    # Filter traits based on specified thresholds
    filtered_traits = @trait_data.select do |trait, data|
      archetype_match = @archetype_threshold.finite? && data[:archetypes].size <= @archetype_threshold
      question_match = @question_threshold.finite? && data[:questions].size <= @question_threshold
      archetype_match || question_match
    end

    # Sort by lowest coverage first (archetypes, then questions)
    sorted_traits = filtered_traits.sort_by do |trait, data|
      [data[:archetypes].size, data[:questions].size, trait]
    end

    # Output as CSV
    puts "trait,archetypes,questions"
    sorted_traits.each do |trait, data|
      puts "#{trait},#{data[:archetypes].size},#{data[:questions].size}"
    end

    # Build summary message
    threshold_parts = []
    threshold_parts << "archetypes ≤#{@archetype_threshold}" if @archetype_threshold.finite?
    threshold_parts << "questions ≤#{@question_threshold}" if @question_threshold.finite?
    threshold_msg = threshold_parts.join(" OR ")

    # Summary
    $stderr.puts "\n📊 Summary:"
    $stderr.puts "  Total traits analyzed: #{@trait_data.size}"
    $stderr.puts "  Traits with low coverage (#{threshold_msg}): #{filtered_traits.size}"
    $stderr.puts ""
    $stderr.puts "  Breakdown:"

    orphaned = filtered_traits.count { |_, data| data[:archetypes].size > 0 && data[:questions].size == 0 }
    unused = filtered_traits.count { |_, data| data[:archetypes].size == 0 && data[:questions].size > 0 }

    # Only count "both low" if both thresholds are specified
    if @archetype_threshold.finite? && @question_threshold.finite?
      both_low = filtered_traits.count { |_, data|
        data[:archetypes].size > 0 && data[:archetypes].size <= @archetype_threshold &&
        data[:questions].size > 0 && data[:questions].size <= @question_threshold
      }
      $stderr.puts "    Both ≤ thresholds: #{both_low}"
    end

    $stderr.puts "    Orphaned (no questions): #{orphaned}"
    $stderr.puts "    Unused (no archetypes): #{unused}"
  end
end

# Main execution
archetype_threshold = nil
question_threshold = nil

# Parse command-line arguments
i = 0
while i < ARGV.length
  case ARGV[i]
  when '-a'
    archetype_threshold = ARGV[i + 1].to_i
    i += 2
  when '-q'
    question_threshold = ARGV[i + 1].to_i
    i += 2
  else
    $stderr.puts "Unknown argument: #{ARGV[i]}"
    exit 1
  end
end

# Validate arguments
if archetype_threshold.nil? && question_threshold.nil?
  $stderr.puts "Usage: #{File.basename($0)} [-a archetype_threshold] [-q question_threshold]"
  $stderr.puts ""
  $stderr.puts "Shows traits where archetype count ≤ -a OR question count ≤ -q"
  $stderr.puts "At least one threshold must be specified."
  $stderr.puts ""
  $stderr.puts "Options:"
  $stderr.puts "  -a X   Show traits with ≤ X archetypes"
  $stderr.puts "  -q Y   Show traits with ≤ Y questions"
  $stderr.puts ""
  $stderr.puts "Output is CSV format: trait,archetypes,questions"
  $stderr.puts ""
  $stderr.puts "Examples:"
  $stderr.puts "  #{File.basename($0)} -a 1        # Traits used in ≤1 archetype"
  $stderr.puts "  #{File.basename($0)} -q 0        # Traits with no questions"
  $stderr.puts "  #{File.basename($0)} -a 2 -q 3   # Traits with ≤2 archetypes OR ≤3 questions"
  exit 1
end

# Set defaults for unspecified thresholds (use high value to exclude from filtering)
archetype_threshold ||= Float::INFINITY
question_threshold ||= Float::INFINITY

root_dir = File.expand_path('..', __dir__)

analyzer = TraitCoverageAnalyzer.new(root_dir, archetype_threshold, question_threshold)
analyzer.analyze
