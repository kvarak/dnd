#!/usr/bin/env ruby
# Extract archetypes from class files to _data/archetypes.yml
# Follows core principle: Reduce complexity (simple YAML parsing)

require 'yaml'

def extract_archetypes_from_classes
  classes_dir = File.join(File.dirname(__FILE__), '..', 'docs', '_Classes')

  unless Dir.exist?(classes_dir)
    puts "❌ Classes directory not found: #{classes_dir}"
    exit 1
  end

  all_archetypes = {}
  total_count = 0

  # Find all markdown files in _Classes
  class_files = Dir.glob(File.join(classes_dir, '*.md'))

  puts "📚 Found #{class_files.length} class files"

  class_files.each do |file|
    class_name = File.basename(file, '.md')

    # Read file content
    content = File.read(file)

    # Extract YAML frontmatter
    if content =~ /\A---\s*\n(.*?)\n---\s*\n/m
      frontmatter = YAML.load($1)

      # Check if profile.archetypes exists
      if frontmatter.dig('profile', 'archetypes')
        archetypes = frontmatter['profile']['archetypes']

        # Store archetypes for this class
        all_archetypes[class_name] = {
          'count' => archetypes.keys.length,
          'archetypes' => archetypes.keys.sort
        }

        total_count += archetypes.keys.length

        puts "  ✓ #{class_name}: #{archetypes.keys.length} archetypes"
      else
        puts "  ⚠ #{class_name}: No archetypes found"
        all_archetypes[class_name] = {
          'count' => 0,
          'archetypes' => []
        }
      end
    else
      puts "  ❌ #{class_name}: Could not parse frontmatter"
    end
  end

  # Build final data structure
  output = {
    'total' => total_count,
    'classes' => all_archetypes
  }

  # Write to _data/archetypes.yml
  output_file = File.join(File.dirname(__FILE__), '..', '_data', 'archetypes.yml')
  File.write(output_file, output.to_yaml)

  puts ""
  puts "✅ Extracted #{total_count} archetypes from #{class_files.length} classes"
  puts "📝 Written to: _data/archetypes.yml"

  output
end

# Run if executed directly
if __FILE__ == $0
  extract_archetypes_from_classes
end
