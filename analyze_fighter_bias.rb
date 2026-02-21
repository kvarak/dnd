#!/usr/bin/env ruby

require 'yaml'

# Load class data
def load_class_profiles(classes_dir)
  profiles = {}
  Dir.glob(File.join(classes_dir, "*.md")).each do |file|
    content = File.read(file)

    # Extract YAML frontmatter
    if content.start_with?("---")
      parts = content.split("---", 3)
      if parts.length >= 3
        yaml_content = parts[1]
        data = YAML.load(yaml_content)

        class_name = File.basename(file, ".md")
        profiles[class_name] = data['profile'] if data && data['profile']
      end
    end
  end
  profiles
end

# Analyze Fighter bias
def analyze_fighter_bias(profiles)
  puts "=== FIGHTER BIAS ANALYSIS ==="
  puts

  # Count archetypes per class
  class_archetype_counts = {}
  all_archetypes = {}

  profiles.each do |class_name, profile|
    if profile['archetypes']
      count = profile['archetypes'].length
      class_archetype_counts[class_name] = count

      # Store archetype data
      profile['archetypes'].each do |arch_name, arch_data|
        full_name = "#{class_name}:#{arch_name}"
        all_archetypes[full_name] = arch_data
      end
    end
  end

  puts "Archetype counts per class:"
  class_archetype_counts.sort_by { |k, v| v }.reverse.each do |class_name, count|
    puts "  #{class_name}: #{count} archetypes"
  end
  puts

  # Analyze Fighter traits vs other classes
  fighter_traits = []
  other_traits = []

  profiles.each do |class_name, profile|
    next unless profile['archetypes']

    profile['archetypes'].each do |arch_name, arch_data|
      traits = []

      # Add generic traits
      if arch_data['generic'] && arch_data['generic']['specific']
        traits += arch_data['generic']['specific']
      end

      # Add specific traits
      if arch_data['specific']
        traits += arch_data['specific']
      end

      # Add class generic traits
      if profile['generic'] && profile['generic']['specific']
        traits += profile['generic']['specific']
      end

      # Add class specific traits
      if profile['specific']
        traits += profile['specific']
      end

      if class_name == 'fighter'
        fighter_traits += traits
      else
        other_traits += traits
      end
    end
  end

  puts "=== TRAIT FREQUENCY ANALYSIS ==="
  puts

  # Count Fighter trait frequency
  fighter_trait_counts = {}
  fighter_traits.each do |trait|
    fighter_trait_counts[trait] = fighter_trait_counts.fetch(trait, 0) + 1
  end

  # Count other classes trait frequency
  other_trait_counts = {}
  other_traits.each do |trait|
    other_trait_counts[trait] = other_trait_counts.fetch(trait, 0) + 1
  end

  puts "Top Fighter traits (appearing in #{class_archetype_counts['fighter']} archetypes):"
  fighter_trait_counts.sort_by { |k, v| v }.reverse.first(10).each do |trait, count|
    puts "  #{trait}: #{count} times"
  end
  puts

  # Find traits that are overrepresented in Fighter
  puts "Traits heavily favoring Fighters (Fighter usage vs Others):"
  fighter_trait_counts.each do |trait, fighter_count|
    other_count = other_trait_counts.fetch(trait, 0)
    total_fighter = class_archetype_counts['fighter']
    total_other = class_archetype_counts.values.sum - total_fighter

    fighter_rate = fighter_count.to_f / total_fighter
    other_rate = other_count.to_f / total_other if total_other > 0

    if fighter_rate > 0.1 && (other_rate.nil? || fighter_rate > other_rate * 2)
      puts "  #{trait}: Fighters #{(fighter_rate*100).round}% vs Others #{other_rate ? (other_rate*100).round : 0}%"
    end
  end
end

# Main execution
classes_dir = "docs/_Classes"
profiles = load_class_profiles(classes_dir)
analyze_fighter_bias(profiles)