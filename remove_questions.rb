#!/usr/bin/env ruby
require 'yaml'

# Load question bank
questions = YAML.load_file('_data/question-bank.yml')

# Questions to remove
remove_ids = [
  # Duplicates (misnamed questions)
  'tactical-thinking',  # Second instance (line 501) - "protecting teammates" - keep first one
  'ranged-combat',      # First instance (line 312) - "combining abilities" - keep second one
  'weapon-mastery',     # Second instance (line 554) - "brute force" - keep first one

  # High oversaturation
  'sophisticated-approach',
  'subtle-methods',
  'stealth-approach',
  'dirty-tricks',

  # Low impact
  'physical-excellence',
  'military-background',
  'treasure-motivation',
  'pleasure-seeking',
  'deception-disguise',
  'skill-versatility'
]

puts "Current question count: #{questions.size}"
puts "Removing #{remove_ids.size} questions..."
puts

# For duplicates, we need special handling
# Remove ALL instances, then we'll add back the ones we want

# First pass: collect questions to keep
questions_to_keep = []
removed_count = 0

# Track which duplicate IDs we've seen
seen_tactical = false
seen_ranged = 0  # Count ranged-combat instances
seen_weapon = false

questions.each do |q|
  q_id = q['id']

  # Handle duplicates specially
  if q_id == 'tactical-thinking'
    if !seen_tactical
      # Keep first instance (planning vs instinct)
      questions_to_keep << q
      seen_tactical = true
      puts "Kept: tactical-thinking (first instance - planning/strategy)"  elsif !remove_ids.include?(q_id)
    # Keep non-removed questions
    questions_to_keep << q
  else
    # Only keep second ranged-combat
    seen_ranged += 1
    if seen_ranged == 2  # Second instance is the real ranged-combat
      questions_to_keep << q
      puts "Kept: ranged-combat (second instance - distance fighting)"
    else
      puts "Removed: ranged-combat (first instance - combining abilities)"
      removed_count += 1
    end
  elsif q_id == 'weapon-mastery'
    if !seen_weapon
      # Keep first instance (weapon specialization)
      questions_to_keep << q
      seen_weapon = true
      puts "Kept: weapon-mastery (first instance - weapon specialization)"
    else
      puts "Removed: weapon-mastery (second instance - brute force)"
      removed_count += 1
    end
  elsif !remove_ids.include?(q_id)
    # Keep non-removed questions
    questions_to_keep << q
  else
    puts "Removed: Removed: #{q_id}"
    removed_count += 1
  end
end

# Save updated question bank
File.open('_data/question-bank.yml', 'w') do |f|
  f.write questions_to_keep.to_yaml
end

puts
puts "New question count: #{questions_to_keep.size}"
puts "Actually removed: #{removed_count}"
puts "Expected 13, got: #{removed_count}"
