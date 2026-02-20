#!/usr/bin/env ruby
require 'yaml'
require 'set'

# QUICK QUESTION AUDIT
# Identifies specific questions to remove, keep, or redesign

puts "=" * 80
puts "QUESTIONNAIRE AUDIT - Specific Action Items"
puts "=" * 80

questions = YAML.load_file('_data/question-bank.yml')

# Load archetype data
all_archetypes = []
Dir['docs/_Classes/*.md'].each do |file|
  content = File.read(file)
  if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
    data = YAML.safe_load($1, permitted_classes: [Symbol], aliases: true)
    next unless data['profile']

    class_name = File.basename(file, '.md')
    base_traits = data.dig('profile', 'specific') || []

    if data.dig('profile', 'archetypes')
      data['profile']['archetypes'].each do |arch_key, arch_data|
        archetype_name = "#{class_name}:#{arch_key}"
        all_traits = base_traits + (arch_data['specific'] || [])
        all_archetypes << { name: archetype_name, traits: all_traits }
      end
    end
  end
end

# Analyze each question
question_scores = questions.map do |q|
  next unless q.is_a?(Hash) && q['id']

  affected_traits = Set.new
  affected_archetypes = Set.new

  if q['answers']
    q['answers'].each do |answer_key, scores|
      next if answer_key == 'dont-know'
      next unless scores.is_a?(Hash)

      scores.each do |trait, score|
        next unless score.is_a?(Numeric)
        affected_traits << trait

        all_archetypes.each do |arch|
          if arch[:traits].include?(trait)
            affected_archetypes << arch[:name]
          end
        end
      end
    end
  end

  {
    id: q['id'],
    text: q['text'],
    traits: affected_traits.size,
    archetypes: affected_archetypes.size,
    efficiency: affected_traits.any? ? (affected_archetypes.size.to_f / affected_traits.size) : 0
  }
end.compact

puts "\n🗑️  QUESTIONS TO REMOVE (#{question_scores.count { |q| q[:archetypes] < 40 }} questions)"
puts "=" * 80
puts "These affect <40 archetypes (14% of all archetypes) - very inefficient"
puts ""

question_scores
  .select { |q| q[:archetypes] < 40 }
  .sort_by { |q| q[:archetypes] }
  .each do |q|
    puts "❌ #{q[:id].ljust(40)} | #{q[:archetypes].to_s.rjust(3)} archetypes | #{q[:traits]} traits"
    puts "   \"#{q[:text][0..70]}#{q[:text].length > 70 ? '...' : ''}\""
    puts ""
  end

puts "\n⭐ QUESTIONS TO KEEP (#{question_scores.count { |q| q[:archetypes] >= 150 }} questions)"
puts "=" * 80
puts "These affect 150+ archetypes (51%+) - highly efficient"
puts ""

question_scores
  .select { |q| q[:archetypes] >= 150 }
  .sort_by { |q| -q[:archetypes] }
  .each do |q|
    puts "✅ #{q[:id].ljust(40)} | #{q[:archetypes].to_s.rjust(3)} archetypes | #{q[:traits]} traits"
    puts "   \"#{q[:text][0..70]}#{q[:text].length > 70 ? '...' : ''}\""
    puts ""
  end

puts "\n🔧 QUESTIONS TO REDESIGN (#{question_scores.count { |q| q[:archetypes] >= 40 && q[:archetypes] < 150 }} questions)"
puts "=" * 80
puts "These affect 40-149 archetypes - could be improved to affect more"
puts ""

question_scores
  .select { |q| q[:archetypes] >= 40 && q[:archetypes] < 150 }
  .sort_by { |q| -q[:archetypes] }
  .first(20)
  .each do |q|
    puts "🔄 #{q[:id].ljust(40)} | #{q[:archetypes].to_s.rjust(3)} archetypes | #{q[:traits]} traits"
    puts "   \"#{q[:text][0..70]}#{q[:text].length > 70 ? '...' : ''}\""
    puts ""
  end

puts "\n📊 SUMMARY"
puts "=" * 80
puts "Total questions: #{question_scores.size}"
puts ""
puts "Distribution:"
puts "  High value (150+ archetypes):    #{question_scores.count { |q| q[:archetypes] >= 150 }} questions ⭐"
puts "  Medium value (60-149 archetypes): #{question_scores.count { |q| q[:archetypes] >= 60 && q[:archetypes] < 150 }} questions 🔧"
puts "  Low value (40-59 archetypes):     #{question_scores.count { |q| q[:archetypes] >= 40 && q[:archetypes] < 60 }} questions ⚠️"
puts "  Very low value (<40 archetypes):  #{question_scores.count { |q| q[:archetypes] < 40 }} questions ❌"
puts ""
puts "Recommended actions:"
puts "  ✅ Keep:    #{question_scores.count { |q| q[:archetypes] >= 150 }} questions"
puts "  🔧 Enhance: #{question_scores.count { |q| q[:archetypes] >= 60 && q[:archetypes] < 150 }} questions (add more trait scoring)"
puts "  ❌ Remove:  #{question_scores.count { |q| q[:archetypes] < 60 }} questions"
puts ""
puts "  Target question count after cleanup: ~#{question_scores.count { |q| q[:archetypes] >= 60 }} questions"
puts ""
puts "=" * 80
