require 'yaml'

questions = YAML.load_file('_data/question-bank.yml')
to_remove = ['sophisticated-approach', 'subtle-methods', 'stealth-approach', 'dirty-tricks', 'physical-excellence', 'military-background', 'treasure-motivation', 'pleasure-seeking', 'deception-disguise', 'skill-versatility']

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
      puts "Removed dup: tactical-thinking"
    end
  elsif id == 'ranged-combat'
    seen_ranged += 1
    if seen_ranged == 2
      kept << q
    else
      removed += 1
      puts "Removed dup: ranged-combat"
    end
  elsif id == 'weapon-mastery'
    seen_weapon += 1
    if seen_weapon == 1
      kept << q
    else
      removed += 1
      puts "Removed dup: weapon-mastery"
    end
  elsif to_remove.include?(id)  elsif to_remove.include?(id)  elsif to_remove.include?(id)  elsif to_en  elsif to_re('_  elsif to_remove.include?(id)  elsif to_remove.incl{questions.size} -> kept.size} (removed #{removed})"
