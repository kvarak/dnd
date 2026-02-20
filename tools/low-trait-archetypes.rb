#!/usr/bin/env ruby
# Low Trait Archetypes Tool
# Shows all archetypes that have 3 or fewer traits
# Usage: ruby tools/low-trait-archetypes.rb [threshold]

require 'yaml'
require 'pathname'

class LowTraitArchetypes
  def initialize(root_dir, threshold = 3)
    @root_dir = Pathname.new(root_dir)
    @threshold = threshold.to_i
    @archetypes = []
  end

  def analyze
    puts "🔍 Finding archetypes with #{@threshold} or fewer traits..."
    load_class_profiles
    display_results
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
          puts "⚠ Error parsing #{File.basename(file)}: #{e.message}"
          next
        end

        next unless data['profile']

        class_name = File.basename(file, '.md')

        # Process class-level specific traits
        class_traits = data.dig('profile', 'specific') || []
        if class_traits.length <= @threshold && class_traits.length > 0
          @archetypes << {
            class: class_name,
            archetype: 'class-level',
            traits: class_traits,
            count: class_traits.length
          }
        end

        # Process archetypes
        if data.dig('profile', 'archetypes')
          data['profile']['archetypes'].each do |arch_key, arch_data|
            specific_traits = arch_data['specific'] || []

            if specific_traits.length <= @threshold && specific_traits.length > 0
              @archetypes << {
                class: class_name,
                archetype: arch_key,
                traits: specific_traits,
                count: specific_traits.length
              }
            end
          end
        end
      end
    end
  end

  def display_results
    if @archetypes.empty?
      puts "✅ No archetypes found with #{@threshold} or fewer traits"
      return
    end

    # Sort by trait count, then by class, then by archetype name
    @archetypes.sort_by! { |a| [a[:count], a[:class], a[:archetype]] }

    puts "\n📊 Found #{@archetypes.length} archetypes with #{@threshold} or fewer traits:\n\n"

    current_count = nil
    @archetypes.each do |arch|
      if arch[:count] != current_count
        current_count = arch[:count]
        puts "#{current_count} trait#{'s' if current_count != 1}:"
        puts "=" * 40
      end

      puts "  #{arch[:class]}/#{arch[:archetype]}: #{arch[:traits].join(', ')}"
    end

    # Summary by trait count
    puts "\n📈 Summary:"
    counts = @archetypes.group_by { |a| a[:count] }
    counts.keys.sort.each do |count|
      archs = counts[count]
      puts "  #{count} trait#{'s' if count != 1}: #{archs.length} archetype#{'s' if archs.length != 1}"
    end

    puts "\n🎯 Total: #{@archetypes.length} archetype#{'s' if @archetypes.length != 1} with #{@threshold} or fewer traits"
  end
end

# Main execution
if __FILE__ == $0
  root_dir = ARGV[1] || File.dirname(__dir__)
  threshold = ARGV[0] ? ARGV[0].to_i : 3

  analyzer = LowTraitArchetypes.new(root_dir, threshold)
  analyzer.analyze
end