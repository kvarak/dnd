require 'yaml'

puts "Loading question bank..."
questions = YAML.load_file('_data/question-bank.yml')

to_remove = [
  'sophisticated-approach',
  'subtle-methods',
  'stealth-approach',
  'dirty-tricks',
  'physical-excellence',
  'military-background',
  'treasure-motivation',
  'pleasure-seeking',
  'deception-disguise',
  'skill-versatility'
]

kept = []
removed = 0
seen_tactical = 0
seen_ranged = 0
seen_weapon = 0

questions.each do |q|
  id = q['id']

  if id == 'tactical-thinking'
    seen_tactical += 1
    if seen_tactical == 1
      kept << q
    else
      removed += 1
      puts "REMOVED: tactical-thinking (duplicate)"
    end

  elsif id == 'ranged-combat'
    seen_ranged += 1
    if seen_ranged == 2
      kept << q
    else
      removed += 1
      puts "REMOVED: ranged-combat (duplicate)"
    end

  elsif id == 'weapon-mastery'
    seen_weapon += 1
    if seen_weapon == 1
      kept << q
    else
      removed += 1
      puts "REMOVED: weapon-mastery (duplicate)"
    end

  elsif to_remove.include?(id)
    removed += 1
    puts "REMOVED: #{id}"

  else
    kept << q
  end
end

puts "\nWriting updated question bank..."
File.write('_data/question-bank.yml', kept.to_yaml)

puts "\nSUMMARY:"
puts "Original: #{questions.size} questions"
puts "Final: #{kept.size} questions"
puts "Removed: #{removed} questions"
puts ""
puts removed == 13 ? "SUCCESS: Removed exactly 13 questions!" : "WARNING: Expected 13, removed #{removed}"
