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

def extract_warlock_patrons(file_path)
  return [] unless File.exist?(file_path)

  content = File.read(file_path)
  patrons = []

  # Match patron anchors: <a name="patron-id">**Patron Name**</a>. Description
  content.scan(/<a\s+name="([^"]+)"\s*>\*\*([^*]+)\*\*<\/a>\.\s*([^\n]+(?:\n(?!-\s*<a)[^\n]+)*)/m) do |match|
    anchor_id = match[0].strip
    patron_name = match[1].strip
    description_text = match[2].strip

    # Clean and truncate description
    description = description_text.gsub(/<[^>]+>/, ' ')
                                  .gsub(/\s+/, ' ')
                                  .strip[0..299]

    patrons << {
      'name' => patron_name,
      'anchor' => anchor_id,
      'description' => description
    }
  end

  patrons
end

def extract_splinter_religions(file_path)
  return [] unless File.exist?(file_path)

  content = File.read(file_path)
  religions = []

  # Match headings: ### <a name="internal-Name">Display Name</a>
  content.scan(/###\s*<a\s+name="([^"]+)">([^<]+)<\/a>/i) do |match|
    anchor_name = match[0]
    religion_name = match[1].strip

    # Find description (first paragraph after heading)
    section_start = content.index(match[0])
    next_section = content.index(/###\s*<a\s+name=/, section_start + 1)
    section_content = if next_section
                       content[section_start...next_section]
                     else
                       content[section_start..-1]
                     end

    # Extract first meaningful paragraph (skip the heading line)
    paragraphs = section_content.split("\n\n")
    description = ''
    paragraphs.each do |para|
      # Skip headings, bold section markers, etc
      next if para.start_with?('###') || para.start_with?('**As a member') || para.start_with?('**As a former')

      cleaned = para.gsub(/<[^>]+>/, ' ')
                   .gsub(/\s+/, ' ')
                   .strip

      if cleaned.length > 20
        description = cleaned[0..299]
        break
      end
    end

    description = "Splinter religion: #{religion_name}" if description.empty?

    religions << {
      'name' => religion_name,
      'anchor' => anchor_name,
      'description' => description
    }
  end

  religions
end

def extract_pantheons(file_path)
  return [] unless File.exist?(file_path)

  content = File.read(file_path)
  deities = []

  # Match table rows after the Pantheons section: | Deity | Alignment | Portfolio | Domains |
  # First, find the pantheons section
  pantheon_section_match = content.match(/<h2><a class="internal-link" name="internal-pantheons">Pantheons<\/a><\/h2>(.*)/m)
  return [] unless pantheon_section_match

  pantheon_content = pantheon_section_match[1]

  # Extract all table rows with deity information
  # Pattern: | Deity Name | Alignment | Portfolio | Domains |
  pantheon_content.scan(/^\|\s*([^|]+?)\s*\|\s*([A-Z]{1,2})\s*\|([^|]+)\|([^|]+)\|/m) do |match|
    deity_name = match[0].strip
    alignment = match[1].strip
    portfolio_text = match[2].strip
    domains = match[3].strip

    # Skip header rows and separators
    next if deity_name =~ /^Deity$/i || deity_name =~ /^[:\-\s]+$/ || deity_name.empty?

    # Generate anchor (deity name, lowercase, no special chars)
    deity_anchor = deity_name.downcase
                             .gsub(/[^a-z0-9\s-]/, '')
                             .gsub(/\s+/, '-')
                             .strip

    # Create description from alignment and portfolio
    description = "#{alignment} deity. #{portfolio_text}. Domains: #{domains[0..100]}"
                    .gsub(/\s+/, ' ')
                    .strip[0..299]

    deities << {
      'name' => deity_name,
      'anchor' => deity_anchor,
      'description' => description
    }
  end

  deities
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

# Extract warlock patrons
warlock_patrons = extract_warlock_patrons('docs/_Resources/warlockpatrons.md')
puts "  Found #{warlock_patrons.length} warlock patrons"

# Extract splinter religions
splinter_religions = extract_splinter_religions('docs/_Resources/splinter-religions.md')
puts "  Found #{splinter_religions.length} splinter religions"

# Extract pantheons (deities)
pantheons = extract_pantheons('docs/_Classes/cleric.md')
puts "  Found #{pantheons.length} pantheon deities"

# Write to YAML files in _data/
Dir.mkdir('_data') unless Dir.exist?('_data')

# Extract old feats from legacy content
def extract_old_feats
  feats_file = 'docs/__OldRules/feats.md'
  return [] unless File.exist?(feats_file)

  content = File.read(feats_file)
  feats = []

  # Pattern matches: -   ### Feat Name
  # Followed by content until next feat or section
  content.scan(/-   ### ([^\n]+)\n((?:[^\n]*\n)*?)(?=(?:-   ###|<div class="columnsthree">|##\s|$))/) do |match|
    feat_name = match[0].strip
    feat_content = match[1]

    # Skip malformed entries
    next if feat_name.empty? || feat_name.length < 2

    # Generate anchor from name
    feat_anchor = feat_name.downcase
                            .gsub(/[^a-z0-9\s-]/, '')
                            .gsub(/\s+/, '-')
                            .strip

    # Extract description (first meaningful non-prerequisite text)
    description_lines = []
    feat_content.split("\n").each do |line|
      line = line.strip

      # Stop at first empty line after we have content
      if line.empty?
        break unless description_lines.empty?
        next
      end

      # Skip structural elements
      next if line.include?('<br/>&dash;') || line.include?('*Prerequisite:') || line.include?('<div')

      # Keep descriptive text
      description_lines << line
    end

    # Clean and truncate description
    description = description_lines.join(' ')
                                   .gsub(/<[^>]+>/, '')  # Remove HTML tags
                                   .gsub(/\s+/, ' ')     # Normalize whitespace
                                   .strip[0..299]        # Truncate to 300 chars

    # Only add if we have meaningful content
    if description && description.length > 10
      feats << {
        'name' => feat_name,
        'anchor' => feat_anchor,
        'description' => description
      }
    end
  end

  feats
end

old_feats = extract_old_feats
puts "  Found #{old_feats.size} old feats"

File.write('_data/searchable_skills.yml', skills.to_yaml)
File.write('_data/searchable_combat_skills.yml', combat_skills.to_yaml)
File.write('_data/searchable_familiars.yml', familiars.to_yaml)
File.write('_data/searchable_alchemical.yml', alchemical_items.to_yaml)
File.write('_data/searchable_herbal.yml', herbal_items.to_yaml)
File.write('_data/searchable_poisons.yml', poisons.to_yaml)
File.write('_data/searchable_old_feats.yml', old_feats.to_yaml)
File.write('_data/searchable_warlock_patrons.yml', warlock_patrons.to_yaml)
File.write('_data/searchable_splinter_religions.yml', splinter_religions.to_yaml)
File.write('_data/searchable_pantheons.yml', pantheons.to_yaml)

puts "✅ Wrote search data to _data/"
puts "   - searchable_skills.yml"
puts "   - searchable_combat_skills.yml"
puts "   - searchable_familiars.yml"
puts "   - searchable_alchemical.yml"
puts "   - searchable_herbal.yml"
puts "   - searchable_poisons.yml"
puts "   - searchable_old_feats.yml"
puts "   - searchable_warlock_patrons.yml"
puts "   - searchable_splinter_religions.yml"
puts "   - searchable_pantheons.yml"
