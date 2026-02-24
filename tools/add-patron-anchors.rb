#!/usr/bin/env ruby
# Add anchors to warlock patron descriptions and make table entries link to them

file_path = 'docs/_Resources/warlockpatrons.md'
content = File.read(file_path)

# Step 1: Add anchors to patron descriptions
# Pattern: - **Name, Title**. Description
# Replace with: - <a name="patron-name">**Name, Title**</a>. Description

content.gsub!(/^-\s+\*\*([^*]+)\*\*\./) do |match|
  full_name = $1.strip
  # Get just the name before the comma for the anchor
  patron_name = full_name.split(',')[0].strip
  # Create anchor ID (lowercase, no special chars, hyphens for spaces)
  anchor_id = patron_name.gsub(/[^a-zA-Z0-9\s-]/, '')
                         .strip
                         .downcase
                         .gsub(/\s+/, '-')

  "- <a name=\"#{anchor_id}\">**#{full_name}**</a>."
end

# Step 2: Make table entries link to the anchors
# Pattern: | number | Name, Title | Pact |
# Replace with: | number | <a href="#anchor-id">Name, Title</a> | Pact |

# We need to process lines that are table rows (not headers or separators)
lines = content.split("\n")
output_lines = []

lines.each do |line|
  # Check if this is a table row with a patron name (starts with |, has a number, has text)
  # Note: rows may be indented with spaces
  if line =~ /^\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+)\s*\|$/
    roll_num = $1
    patron_full = $2.strip
    pact_type = $3.strip

    # Skip header rows and separators
    if patron_full !~ /^Name$/i && patron_full !~ /^[:\-\s]+$/
      # Get patron name for anchor
      patron_name = patron_full.split(',')[0].strip
      anchor_id = patron_name.gsub(/[^a-zA-Z0-9\s-]/, '')
                             .strip
                             .downcase
                             .gsub(/\s+/, '-')

      # Create linked table entry (preserve indentation)
      indent = line.match(/^(\s*)/)[1]
      output_lines << "#{indent}| #{roll_num} | <a href=\"##{anchor_id}\">#{patron_full}</a> | #{pact_type} |"
    else
      # Keep headers and separators as-is
      output_lines << line
    end
  else
    # Keep non-table lines as-is
    output_lines << line
  end
end

# Write the modified content back
File.write(file_path, output_lines.join("\n"))

puts "✅ Added anchors to #{content.scan(/<a name="[^"]+">/).length} patron descriptions"
puts "✅ Updated table entries with links"
