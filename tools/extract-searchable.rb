#!/usr/bin/env ruby
# Extracts searchable content for the site's search index: every markdown
# heading (generic), plus skills/familiars which aren't heading-shaped
# (accordion, stat-block table - see tools/README.md). Table row data
# (e.g. deity tables) is intentionally not indexed.
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

    # Extract skill name from summary. Some summaries span multiple lines
    # (e.g. a trait note like "&nbsp;&nbsp; *Background trait*" on its own
    # line) - collapse to a single line and drop HTML entities so the id we
    # compute matches what the browser computes from the rendered DOM
    # (entities like "&nbsp;" decode to a stripped whitespace char there,
    # not literal "nbsp" text as raw source would otherwise leave behind).
    skill_name = content[detail_start + 18...summary_end]
                   .gsub(/&\w+;/, ' ')
                   .gsub(/\s+/, ' ')
                   .strip

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

# Jekyll's CommonMark renderer auto-generates a clean anchor id for any plain
# heading (matches: strip apostrophes/punctuation, lowercase, spaces -> hyphens).
def slugify(text)
  text.gsub("'", '').gsub(/[^a-zA-Z0-9\s-]/, '').strip.downcase.gsub(/\s+/, '-')
end

# Matches plain markdown ATX headings only ("#### Name"), optionally nested
# inside a list item ("-   #### Name"). No special-casing for embedded HTML
# or links - a heading's visible text is always taken as-is and slugified.
# Captures the level (group 1, e.g. "###") and the text (group 2).
HEADING_RE = /^-?\s{0,3}(\#{1,6})(?!\#)[ \t]+(.+?)[ \t]*\#*[ \t]*$/.freeze

# Strips <div class="toc" ...>...</div> blocks, accounting for nested divs.
# These are navigation aids that just duplicate real headings elsewhere on
# the page, and must not be indexed as if they were content of their own.
def strip_toc_divs(content)
  result = content.dup

  loop do
    open_match = result.match(/<div\s+class="toc"[^>]*>/)
    break unless open_match

    scan_pos = open_match.end(0)
    depth = 1
    while depth > 0
      next_open = result.index(/<div\b/, scan_pos)
      next_close = result.index('</div>', scan_pos)
      break unless next_close # malformed markup - bail out rather than loop forever

      if next_open && next_open < next_close
        depth += 1
        scan_pos = next_open + 4
      else
        depth -= 1
        scan_pos = next_close + 6
      end
    end

    result = result[0...open_match.begin(0)] + result[scan_pos..-1]
  end

  result
end

# Core rule: index every heading as its own searchable entry. This replaces
# the previous per-content-type regex parsers (one heading shape per file)
# with a single generic walker that works for any file, at any heading level.
def extract_doc_headings(file_path, collection)
  return [] unless File.exist?(file_path)

  raw = File.read(file_path)
  front_matter = {}
  content = raw
  if (fm_match = raw.match(/\A---\s*\n(.*?)\n---\s*\n/m))
    front_matter = YAML.safe_load(fm_match[1]) || {}
    content = raw[fm_match.end(0)..-1]
  end

  page_url = front_matter['permalink'] || "/#{collection}/#{File.basename(file_path, '.md')}.html"

  # Strip HTML comments and TOC navigation blocks - neither should be
  # indexed: comments never render, and TOC entries just duplicate real
  # headings that appear later in the same document.
  content = content.gsub(/<!--.*?-->/m, '')
  content = strip_toc_divs(content)
  headings = content.to_enum(:scan, HEADING_RE).map { Regexp.last_match }

  entries = []
  # Tracks how many times each auto-slug has been seen so far in this doc -
  # the renderer disambiguates repeated heading text with "-1", "-2", ...
  # suffixes (e.g. "Channel Divinity" repeated once per Oath), and our
  # anchors must match that or duplicate headings all collide on one id.
  slug_counts = Hash.new(0)
  # Tracks ancestor headings (level, name) so entries can carry a breadcrumb
  # ("Abraxas → Patron Invocations") - repeated heading text (e.g. every
  # patron has its own "Patron Invocations") is otherwise indistinguishable
  # in search results even once anchors are individually correct.
  breadcrumb_stack = []

  # Initialize breadcrumb stack with the page title from frontmatter as root context
  # Use level 0 so it's never popped by H1+ headings in the content
  page_title = front_matter['title'] || File.basename(file_path, '.md')
  breadcrumb_stack.push([0, page_title])

  headings.each_with_index do |m, idx|
    level = m[1].length
    raw_text = m[2]

    # The one necessary exception: a heading wrapping an explicit
    # <a name="x">Name</a> must use that hand-authored anchor, since other
    # pages already link to it directly - the renderer does not also give
    # such a heading its own auto-generated id to fall back on.
    explicit = raw_text.match(/<a\s+(?:\w+="[^"]*"\s+)*name="([^"]+)"(?:\s+\w+="[^"]*")*\s*>/i)
    anchor_override = explicit && explicit[1]

    name = raw_text.gsub(/<[^>]+>/, '').strip
    next if name.empty?

    breadcrumb_stack.pop while breadcrumb_stack.any? && breadcrumb_stack.last[0] >= level

    # Build breadcrumb parts and remove consecutive duplicates
    # (e.g., "Fighter → Fighter" becomes just "Fighter")
    breadcrumb_parts = breadcrumb_stack.map { |_, n| n } + [name]
    deduplicated_breadcrumb = []
    breadcrumb_parts.each do |part|
      deduplicated_breadcrumb << part if deduplicated_breadcrumb.empty? || part != deduplicated_breadcrumb.last
    end
    display_name = deduplicated_breadcrumb.join(' → ')

    breadcrumb_stack.push([level, name])

    anchor = anchor_override
    unless anchor
      base_slug = slugify(name)
      seen = slug_counts[base_slug]
      slug_counts[base_slug] = seen + 1
      anchor = seen.zero? ? base_slug : "#{base_slug}-#{seen}"
    end

    section_start = m.end(0)
    section_end = idx + 1 < headings.length ? headings[idx + 1].begin(0) : content.length
    description = content[section_start...section_end]
                    .gsub(/<[^>]+>/, ' ')
                    .gsub(/\s+/, ' ')
                    .strip[0..299]

    entries << { 'name' => display_name, 'anchor' => anchor, 'url' => page_url, 'collection' => collection, 'description' => description }
  end

  # Fallback: a page with no headings at all (rare) still gets one whole-page
  # entry, so nothing becomes silently unsearchable.
  return entries unless entries.empty?

  whole_page_description = content.gsub(/<[^>]+>/, ' ').gsub(/\s+/, ' ').strip[0..299]
  return [] if whole_page_description.empty?

  [{
    'name' => front_matter['title'] || File.basename(file_path, '.md'),
    'anchor' => '',
    'url' => page_url,
    'collection' => collection,
    'description' => whole_page_description
  }]
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

# Index every heading in every doc, across every collection - this single
# generic pass replaces the old per-content-type heading parsers (alchemical,
# herbal, poison, splinter religions, old feats) and the whole-page collection
# loop that used to live in search.json. Skills/combat skills are excluded -
# they're already indexed above via extract_skills, and their headings live
# inside collapsed <details> accordion panels, not real page structure, so
# the generic walker would only add noisy, misleading duplicate entries.
skills_files = ['docs/_RulesCharacter/skills.md', 'docs/_RulesCharacter/skills_combat.md']
doc_files = Dir.glob('docs/_*/*.md') - skills_files
doc_headings = doc_files.flat_map do |file_path|
  collection = File.basename(File.dirname(file_path)).sub(/\A_/, '')
  extract_doc_headings(file_path, collection)
end
puts "  Found #{doc_headings.length} heading entries across #{doc_files.length} docs"

# Write to YAML files in _data/
Dir.mkdir('_data') unless Dir.exist?('_data')

File.write('_data/searchable_skills.yml', skills.to_yaml)
File.write('_data/searchable_combat_skills.yml', combat_skills.to_yaml)
File.write('_data/searchable_familiars.yml', familiars.to_yaml)
File.write('_data/searchable_headings.yml', doc_headings.to_yaml)

puts "✅ Wrote search data to _data/"
puts "   - searchable_skills.yml"
puts "   - searchable_combat_skills.yml"
puts "   - searchable_familiars.yml"
puts "   - searchable_headings.yml"
