#!/usr/bin/env ruby
require 'yaml'

# Load all class files
trait_archetype_count = Hash.new(0)
archetype_trait_count = Hash.new(0)

Dir['docs/_Classes/*.md'].each do |file|
  content = File.read(file)
  if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
    data = YAML.safe_load($1, permitted_classes: [Symbol], aliases: true)
    next unless data['profile']

    class_name = File.basename(file, '.md')
    base_traits = data.dig('profile', 'specific') || []

    # Class-level traits
    base_traits.each { |t| trait_archetype_count[t] += 1 }

    # Archetype-specific traits
    if data.dig('profile', 'archetypes')
      data['profile']['archetypes'].each do |arch_key, arch_data|
        archetype_name = "#{class_name}:#{arch_key}"
        all_traits = base_traits + (arch_data['specific'] || [])
        archetype_trait_count[archetype_name] = all_traits.size
        all_traits.each { |t| trait_archetype_count[t] += 1 }
      end
    end
  end
end

puts "=== TRAITS BY ARCHETYPE USAGE ==="
puts "Total unique traits in archetypes: #{trait_archetype_count.size}"
puts ""

sorted = trait_archetype_count.sort_by { |k, v| -v }
sorted.first(30).each do |trait, count|
  puts "#{trait.ljust(30)} | Used in #{count.to_s.rjust(3)} archetypes"
end

puts "\n=== ARCHETYPES BY TRAIT COUNT ==="
sorted_arch = archetype_trait_count.sort_by { |k, v| -v }
puts "Top 20 archetypes with most traits:"
sorted_arch.first(20).each do |arch, count|
  puts "  #{arch.ljust(50)} | #{count} traits"
end

puts "\nBottom 20 archetypes with fewest traits:"
sorted_arch.last(20).each do |arch, count|
  puts "  #{arch.ljust(50)} | #{count} traits"
end
