#!/usr/bin/env ruby
# Extract skills, combat skills, and familiars for search index
# Follows core principle: Reduce complexity (simple regex parsing)

require 'yaml'

def extract_skills(file_path, collection_name)
  return [] unless File.exist?(file_path)

  content = File.read(file_path)
  skills = []

  # Remove content before the actual skill list starts (headers, TOC, etc)
  # Skills start after the tab-content div
  content = content.split('<div class="tab-content">', 2)[1] if content.include?('<div class="tab-content">')

  # Extract all details/summary pairs recursively
  # This regex captures nested details as well
  extract_skills_recursive(content, collection_name, skills, nil)

  skills
end

def extract_skills_recursive(content, collection_name, skills, parent_name)
  # Find all details/summary blocks at current level
  # We need to handle nested structures carefully

  pos = 0
  while pos < content.length
    # Find next <details><summary>
    detail_start = content.index('<details><summary>', pos)
    break unless detail_start

    # Find the matching </details> for this opening
    summary_end = content.index('</summary>', detail_start)
    break unless summary_end

    # Extract skill name from summary
    skill_name = content[detail_start + 18...summary_end].strip

    # Clean skill name (remove trait markers, etc)
    clean_name = skill_name.gsub(/\s*\([^)]*\)\s*/, '').strip
    skill_id = clean_name.gsub(/[^a-zA-Z0-9]/, '').downcase

    # Find matching closing </details> (need to count nesting)
    detail_end = find_matching_close_tag(content, detail_start, 'details')
    break unless detail_end

    # Extract the content between summary and closing details
    inner_content = content[summary_end + 10...detail_end]

    # Get description (first 300 chars, excluding nested details)
    description = inner_content.gsub(/<details>.*?<\/details>/m, ' ')
                                .gsub(/<[^>]+>/, ' ')
                                .gsub(/\s+/, ' ')
                                .strip[0..299]

    # Add parent context if this is a nested skill
    full_name = parent_name ? "#{parent_name} → #{skill_name}" : skill_name

    skills << {
      'name' => full_name,
      'id' => skill_id,
      'description' => description,
      'collection' => collection_name
    }

    # Recursively extract nested skills
    if inner_content.include?('<details>')
      extract_skills_recursive(inner_content, collection_name, skills, clean_name)
    end

    # Move past this details block
    pos = detail_end + 10
  end
end

def find_matching_close_tag(content, start_pos, tag)
  # Find the matching closing tag, accounting for nesting
  open_tag = "<#{tag}>"
  close_tag = "</#{tag}>"

  pos = start_pos + open_tag.length
  depth = 1

  while depth > 0 && pos < content.length
    next_open = content.index(open_tag, pos)
    next_close = content.index(close_tag, pos)

    return nil unless next_close

    if next_open && next_open < next_close
      depth += 1
      pos = next_open + open_tag.length
    else
      depth -= 1
      if depth == 0
        return next_close
      end
      pos = next_close + close_tag.length
    end
  end

  nil
end

def extract_familiars(file_path)
  return [] unless File.exist?(file_path)

  content = File.read(file_path)
  familiars = []

  # Match anchor links: <a class="internal-link" name="internal-name">Name</a>
  content.scan(/<a\s+class="internal-link"\s+name="(internal-[^"]+)">([^<]+)<\/a>/i) do |match|
    anchor_name = match[0]
    familiar_name = match[1].strip

    # Skip non-familiar anchors
    skip_list = ['internal-Spells', 'internal-personality', 'internal-list',
                 'internal-AnimateFamiliar', 'internal-CallFamiliar',
                 'internal-FindFamiliar', 'internal-ImbueObject', 'internal-ShapeElement']
    next if skip_list.include?(anchor_name)

    # Try to extract description from surrounding context
    # Look for the text after the anchor up to the next anchor or 300 chars
    desc_match = content.match(/#{Regexp.escape(match[0])}.*?<\/a>(.*?)(?=<a\s+class="internal-link"|$)/m)
    description = desc_match ? desc_match[1].gsub(/<[^>]+>/, ' ').gsub(/\s+/, ' ').strip[0..299] : 'Familiar creature'

    familiars << {
      'name' => familiar_name,
      'anchor' => anchor_name,
      'description' => description
    }
  end

  familiars
end

def extract_alchemical_items(file_path)
  return [] unless File.exist?(file_path)

  content = File.read(file_path)
  items = []

  # Match markdown headers: -   #### Item Name
  # Extract item name and following description
  content.scan(/^-   #### (.+?)$(.+?)(?=^-   ####|\z)/m) do |match|
    item_name = match[0].strip
    description_text = match[1]

    # Clean item name and generate anchor ID matching Jekyll's auto-generation
    # Jekyll removes apostrophes, lowercases, and replaces spaces with hyphens
    item_anchor = item_name.gsub("'", '')
                           .gsub(/[^a-zA-Z0-9\s-]/, '')
                           .strip
                           .downcase
                           .gsub(/\s+/, '-')

    # Extract description (first paragraph or up to 300 chars)
    description = description_text.gsub(/<[^>]+>/, ' ')
                                  .gsub(/\s+/, ' ')
                                  .strip[0..299]

    items << {
      'name' => item_name,
      'anchor' => item_anchor,
      'description' => description
    }
  end

  items
end

# Extract from markdown files (before Jekyll processing)
puts "🔍 Extracting searchable content..."

# Extract skills
skills = extract_skills('docs/_RulesCharacter/skills.md', 'skills')
puts "  Found #{skills.length} skills"

# Extract combat skills
combat_skills = extract_skills('docs/_RulesCharacter/skills_combat.md', 'combat skills')
puts "  Found #{combat_skills.length} combat skills"

# Extract familiars
familiars = extract_familiars('docs/_RulesMagic/familiars.md')
puts "  Found #{familiars.length} familiars"

# Extract alchemical items
alchemical_items = extract_alchemical_items('docs/_RulesEquipment/alchemical.md')
puts "  Found #{alchemical_items.length} alchemical items"

# Extract herbal items
herbal_items = extract_alchemical_items('docs/_RulesEquipment/herbal.md')
puts "  Found #{herbal_items.length} herbal items"

# Extract poisons
poisons = extract_alchemical_items('docs/_RulesEquipment/poison.md')
puts "  Found #{poisons.length} poisons"

# Write to YAML files in _data/
Dir.mkdir('_data') unless Dir.exist?('_data')

File.write('_data/searchable_skills.yml', skills.to_yaml)
File.write('_data/searchable_combat_skills.yml', combat_skills.to_yaml)
File.write('_data/searchable_familiars.yml', familiars.to_yaml)
File.write('_data/searchable_alchemical.yml', alchemical_items.to_yaml)
File.write('_data/searchable_herbal.yml', herbal_items.to_yaml)
File.write('_data/searchable_poisons.yml', poisons.to_yaml)

puts "✅ Wrote search data to _data/"
puts "   - searchable_skills.yml"
puts "   - searchable_combat_skills.yml"
puts "   - searchable_familiars.yml"
puts "   - searchable_alchemical.yml"
puts "   - searchable_herbal.yml"
puts "   - searchable_poisons.yml"
