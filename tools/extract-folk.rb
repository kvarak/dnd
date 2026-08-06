#!/usr/bin/env ruby
# Extract folk and subtypes from Folk files to _data/folk.yml
# Follows core principle: Reduce complexity (simple YAML parsing)

require 'yaml'

def extract_folk_from_files
  folk_dir = File.join(File.dirname(__FILE__), '..', 'docs', '_Folk')

  unless Dir.exist?(folk_dir)
    puts "❌ Folk directory not found: #{folk_dir}"
    exit 1
  end

  all_folk = {}
  total_count = 0

  # Find all markdown files in _Folk
  folk_files = Dir.glob(File.join(folk_dir, '*.md'))

  puts "📚 Found #{folk_files.length} folk files"

  folk_files.each do |file|
    folk_name = File.basename(file, '.md')

    # Read file content
    content = File.read(file)

    # Extract YAML frontmatter
    if content =~ /\A---\s*\n(.*?)\n---\s*\n/m
      frontmatter = YAML.load($1)

      # Check if profile exists
      profile = frontmatter['profile']

      if profile
        # Check if this is dwarf with background and material_traits
        if profile['background'] && profile['material_traits']
          background = profile['background'].keys.sort
          material_traits = profile['material_traits'].keys.sort
          count = background.length + material_traits.length

          # Extract or default required
          required = profile['required'] || { 'background' => 1, 'material_traits' => 0 }

          all_folk[folk_name] = {
            'count' => count,
            'required' => required,
            'background' => background,
            'material_traits' => material_traits
          }

          total_count += count
          puts "  ✓ #{folk_name}: #{background.length} backgrounds + #{material_traits.length} material traits"

        # Check if profile.subtypes exists
        elsif profile['subtypes']
          subtypes = profile['subtypes']
          count = subtypes.keys.length

          # Extract or default required
          required = profile['required'] || { 'subtypes' => 1 }

          # Store subtypes for this folk
          all_folk[folk_name] = {
            'count' => count,
            'required' => required,
            'subtypes' => subtypes.keys.sort
          }

          total_count += count
          puts "  ✓ #{folk_name}: #{subtypes.keys.length} subtypes"
        else
          puts "  ⚠ #{folk_name}: No subtypes, background, or material_traits found"
          all_folk[folk_name] = {
            'count' => 0,
            'subtypes' => []
          }
        end
      else
        puts "  ⚠ #{folk_name}: No profile found"
        all_folk[folk_name] = {
          'count' => 0,
          'subtypes' => []
        }
      end
    else
      puts "  ❌ #{folk_name}: Could not parse frontmatter"
    end
  end

  # Build final data structure
  output = {
    'total' => total_count,
    'folk' => all_folk
  }

  # Write to _data/folk.yml
  output_file = File.join(File.dirname(__FILE__), '..', '_data', 'folk.yml')
  File.write(output_file, output.to_yaml)

  puts ""
  puts "✅ Extracted #{total_count} subtypes from #{folk_files.length} folk"
  puts "📝 Written to: _data/folk.yml"

  output
end

# Run if executed directly
if __FILE__ == $0
  extract_folk_from_files
end
