#!/usr/bin/env ruby
# Trait Analysis Tool
# Analyzes relationships between traits, archetypes, and questions
# to identify potential trait merges while maintaining archetype uniqueness

require 'yaml'
require 'pathname'

class TraitAnalyzer
  attr_reader :classes, :archetypes, :traits, :questions, :trait_usage

  def initialize(root_dir)
    @root_dir = Pathname.new(root_dir)
    @classes = {}
    @archetypes = {}
    @traits = {} # trait_name => { archetypes: [], questions: [], classes: [] }
    @questions = {}
    @trait_usage = {}
  end

  def analyze
    puts "🔍 Analyzing trait relationships..."
    load_class_profiles
    load_question_bank
    compute_relationships
    generate_report
  end

  private

  def load_class_profiles
    puts "  Loading class profiles..."
    class_files = Dir[@root_dir.join('docs/_Classes/*.md')]

    class_files.each do |file|
      content = File.read(file)

      # Extract YAML frontmatter
      if content =~ /\A---\r?\n(.*?)\r?\n---\r?\n/m
        yaml_content = $1
        begin
          data = YAML.safe_load(yaml_content, permitted_classes: [Symbol], aliases: true)
        rescue => e
          puts "    ⚠ Error parsing #{File.basename(file)}: #{e.message}"
          next
        end

        next unless data['profile']

        class_name = File.basename(file, '.md')
        @classes[class_name] = {
          title: data['title'] || class_name,
          archetypes: {},
          generic_traits: data.dig('profile', 'traits') || []
        }

        # Track generic traits at class level
        @classes[class_name][:generic_traits].each do |trait|
          @traits[trait] ||= { archetypes: [], questions: [], classes: [] }
          @traits[trait][:classes] << class_name unless @traits[trait][:classes].include?(class_name)
        end

        # Process archetypes
        if data.dig('profile', 'archetypes')
          data['profile']['archetypes'].each do |arch_key, arch_data|
            archetype_name = "#{class_name}:#{arch_key}"

            # Combine class-level generic traits with archetype-specific traits (inheritance)
            archetype_specific_traits = arch_data['traits'] || []
            all_traits = @classes[class_name][:generic_traits] + archetype_specific_traits

            @classes[class_name][:archetypes][arch_key] = {
              name: arch_key,
              traits: all_traits
            }

            @archetypes[archetype_name] = {
              class: class_name,
              key: arch_key,
              traits: all_traits
            }

            # Track trait usage
            all_traits.each do |trait|
              @traits[trait] ||= { archetypes: [], questions: [], classes: [] }
              @traits[trait][:archetypes] << archetype_name
              @traits[trait][:classes] << class_name unless @traits[trait][:classes].include?(class_name)
            end
          end
        end
      end
    end

    puts "    ✓ Loaded #{@classes.size} classes with #{@archetypes.size} archetypes"
  end

  def load_question_bank
    puts "  Loading question bank..."
    question_file = @root_dir.join('_data/question-bank.yml')

    return unless File.exist?(question_file)

    questions_data = YAML.safe_load(File.read(question_file), permitted_classes: [Symbol], aliases: true)
    questions_data.each do |q|
      next unless q.is_a?(Hash) && q['id']

      question_id = q['id']
      @questions[question_id] = {
        text: q['text'],
        category: q['category'],
        traits: []
      }

      # Extract traits from answers
      if q['answers']
        q['answers'].each do |answer_key, scores|
          next unless scores.is_a?(Hash)

          scores.each do |trait, score|
            next if %w[text category answers id dont-know].include?(trait)

            @questions[question_id][:traits] << trait unless @questions[question_id][:traits].include?(trait)

            @traits[trait] ||= { archetypes: [], questions: [], classes: [] }
            unless @traits[trait][:questions].include?(question_id)
              @traits[trait][:questions] << question_id
            end
          end
        end
      end
    end

    puts "    ✓ Loaded #{@questions.size} questions covering #{@traits.select { |k, v| v[:questions].any? }.size} traits"
  end

  def compute_relationships
    puts "  Computing trait relationships..."

    @trait_usage = {
      archetype_only: [],
      question_only: [],
      both: [],
      orphaned: []
    }

    @traits.each do |trait, data|
      has_archetypes = data[:archetypes].any?
      has_questions = data[:questions].any?

      if has_archetypes && has_questions
        @trait_usage[:both] << trait
      elsif has_archetypes && !has_questions
        @trait_usage[:archetype_only] << trait
      elsif !has_archetypes && has_questions
        @trait_usage[:question_only] << trait
      else
        @trait_usage[:orphaned] << trait
      end
    end
  end

  def generate_report
    puts "  Generating HTML report..."

    html = <<~HTML
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Trait Analysis Report - dnd.rigo.nu</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .container { max-width: 1400px; margin: 0 auto; }
          h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
          h2 { color: #34495e; margin-top: 30px; border-left: 4px solid #3498db; padding-left: 10px; }
          h3 { color: #7f8c8d; }

          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .stat-number { font-size: 2em; font-weight: bold; color: #3498db; }
          .stat-label { color: #7f8c8d; margin-top: 5px; }

          .section {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
          }
          th {
            background: #34495e;
            color: white;
            position: sticky;
            top: 0;
          }
          tr:hover { background: #f8f9fa; }

          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.85em;
            margin: 2px;
            white-space: nowrap;
          }
          .badge-archetype { background: #e8f4f8; color: #2980b9; }
          .badge-question { background: #fef5e7; color: #d68910; }
          .badge-class { background: #eafaf1; color: #27ae60; }
          .badge-warning { background: #fadbd8; color: #c0392b; }
          .badge-success { background: #d5f4e6; color: #27ae60; }

          .trait-name {
            font-family: 'Monaco', 'Courier New', monospace;
            font-weight: bold;
            color: #2c3e50;
          }

          .filter-bar {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .filter-bar input {
            padding: 8px;
            border: 1px solid #bdc3c7;
            border-radius: 4px;
            width: 300px;
          }

          .similarity {
            background: #fff3cd;
            padding: 10px;
            margin: 5px 0;
            border-left: 3px solid #ffc107;
          }

          .archetype-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin: 10px 0;
          }

          details { margin: 10px 0; }
          summary {
            cursor: pointer;
            padding: 10px;
            background: #ecf0f1;
            border-radius: 4px;
            font-weight: bold;
          }
          summary:hover { background: #d5dbdb; }

          .coverage-bar {
            height: 20px;
            background: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
            margin: 5px 0;
          }
          .coverage-fill {
            height: 100%;
            background: linear-gradient(90deg, #e74c3c, #f39c12, #27ae60);
            transition: width 0.3s;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎭 Trait Analysis Report</h1>
          <p>Analyzing relationships between traits, archetypes, and questions for archetype consolidation opportunities.</p>

          #{stats_section}
          #{trait_coverage_section}
          #{mergeable_traits_section}
          #{archetype_uniqueness_section}
          #{missing_coverage_section}
          #{full_trait_table}

          <script>
            function filterTable(inputId, tableId) {
              const input = document.getElementById(inputId);
              const table = document.getElementById(tableId);
              const filter = input.value.toLowerCase();
              const rows = table.getElementsByTagName('tr');

              for (let i = 1; i < rows.length; i++) {
                const text = rows[i].textContent.toLowerCase();
                rows[i].style.display = text.includes(filter) ? '' : 'none';
              }
            }
          </script>
        </div>
      </body>
      </html>
    HTML

    output_file = @root_dir.join('trait-analysis.html')
    File.write(output_file, html)

    puts "  ✓ Report generated: #{output_file}"
    puts "\n✨ Analysis complete! Open trait-analysis.html in your browser."
  end

  def stats_section
    <<~HTML
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">#{@traits.size}</div>
          <div class="stat-label">Total Traits</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">#{@archetypes.size}</div>
          <div class="stat-label">Total Archetypes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">#{@questions.size}</div>
          <div class="stat-label">Total Questions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">#{@trait_usage[:archetype_only].size}</div>
          <div class="stat-label">Traits Without Question Coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">#{@trait_usage[:both].size}</div>
          <div class="stat-label">Traits With Full Coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">#{find_similar_traits.size}</div>
          <div class="stat-label">Potential Merge Candidates</div>
        </div>
      </div>
    HTML
  end

  def trait_coverage_section
    coverage_percent = (@trait_usage[:both].size.to_f / @traits.size * 100).round(1)

    <<~HTML
      <div class="section">
        <h2>📊 Trait Coverage Overview</h2>
        <div class="coverage-bar">
          <div class="coverage-fill" style="width: #{coverage_percent}%"></div>
        </div>
        <p><strong>#{coverage_percent}%</strong> of traits have both archetype usage and question coverage</p>

        <div style="margin-top: 20px;">
          <span class="badge badge-success">#{@trait_usage[:both].size} Complete</span>
          <span class="badge badge-warning">#{@trait_usage[:archetype_only].size} Missing Questions</span>
          <span class="badge">#{@trait_usage[:question_only].size} Unused in Archetypes</span>
        </div>
      </div>
    HTML
  end

  def find_similar_traits
    similarities = []
    trait_list = @traits.keys.sort

    trait_list.each_with_index do |trait1, i|
      trait_list[(i+1)..-1].each do |trait2|
        similarity = calculate_similarity(trait1, trait2)
        if similarity[:score] > 0
          similarities << similarity
        end
      end
    end

    similarities.sort_by { |s| -s[:score] }
  end

  def calculate_similarity(trait1, trait2)
    score = 0
    reasons = []

    # Name similarity
    words1 = trait1.split('-')
    words2 = trait2.split('-')
    common_words = words1 & words2

    if common_words.any?
      score += common_words.size * 3
      reasons << "Share words: #{common_words.join(', ')}"
    end

    # Check for semantic similarity
    semantic_groups = [
      ['damage', 'striker', 'attacker', 'dealer'],
      ['magic', 'spell', 'arcane', 'caster'],
      ['stealth', 'shadow', 'sneaky', 'hidden'],
      ['weapon', 'blade', 'sword', 'knife', 'dagger'],
      ['tactical', 'strategic', 'intelligent', 'analytical'],
      ['combat', 'fighter', 'warrior', 'martial'],
      ['expert', 'master', 'specialist', 'proficient'],
      ['luck', 'fortune', 'fate', 'chance'],
      ['poison', 'venom', 'toxic'],
      ['precision', 'precise', 'accurate', 'surgical']
    ]

    semantic_groups.each do |group|
      if group.any? { |word| trait1.include?(word) } &&
         group.any? { |word| trait2.include?(word) }
        score += 2
        reasons << "Semantic similarity"
        break
      end
    end

    # Same archetypes
    arches1 = @traits[trait1][:archetypes]
    arches2 = @traits[trait2][:archetypes]
    common_arches = arches1 & arches2

    if common_arches.any?
      score += common_arches.size
      reasons << "#{common_arches.size} shared archetype(s)"
    end

    # Same questions
    q1 = @traits[trait1][:questions]
    q2 = @traits[trait2][:questions]
    common_questions = q1 & q2

    if common_questions.any?
      score += common_questions.size
      reasons << "#{common_questions.size} shared question(s)"
    end

    {
      trait1: trait1,
      trait2: trait2,
      score: score,
      reasons: reasons,
      archetype_overlap: common_arches.size,
      question_overlap: common_questions.size
    }
  end

  def mergeable_traits_section
    similarities = find_similar_traits.select { |s| s[:score] >= 3 }

    html = <<~HTML
      <div class="section">
        <h2>🔀 Potential Trait Merges</h2>
        <p>Traits with high similarity scores may be candidates for merging. Review carefully to maintain archetype uniqueness.</p>
    HTML

    if similarities.empty?
      html += "<p><em>No strong merge candidates found.</em></p>"
    else
      similarities.first(50).each do |sim|
        trait1_data = @traits[sim[:trait1]]
        trait2_data = @traits[sim[:trait2]]

        html += <<~HTML
          <div class="similarity">
            <strong>Score: #{sim[:score]}</strong> &mdash;
            <span class="trait-name">#{sim[:trait1]}</span> ↔
            <span class="trait-name">#{sim[:trait2]}</span>
            <br>
            <small>#{sim[:reasons].join(' • ')}</small>
            <br>
            <small>
              #{sim[:trait1]}: #{trait1_data[:archetypes].size} archetypes, #{trait1_data[:questions].size} questions |
              #{sim[:trait2]}: #{trait2_data[:archetypes].size} archetypes, #{trait2_data[:questions].size} questions
            </small>
          </div>
        HTML
      end
    end

    html += "</div>"
    html
  end

  def archetype_uniqueness_section
    # Calculate archetype uniqueness
    archetype_similarities = []

    @archetypes.keys.each_with_index do |arch1, i|
      @archetypes.keys[(i+1)..-1].each do |arch2|
        traits1 = @archetypes[arch1][:traits]
        traits2 = @archetypes[arch2][:traits]

        common = traits1 & traits2
        union = traits1 | traits2

        if union.any? && common.any?
          similarity = (common.size.to_f / union.size * 100).round(1)

          if similarity > 20
            archetype_similarities << {
              arch1: arch1,
              arch2: arch2,
              similarity: similarity,
              common_traits: common,
              unique1: traits1 - traits2,
              unique2: traits2 - traits1
            }
          end
        end
      end
    end

    archetype_similarities.sort_by! { |s| -s[:similarity] }

    html = <<~HTML
      <div class="section">
        <h2>🎯 Archetype Uniqueness Analysis</h2>
        <p>Archetypes with >20% trait overlap. Ensure merging traits doesn't reduce distinctiveness.</p>
    HTML

    if archetype_similarities.empty?
      html += "<p><em>All archetypes are sufficiently unique!</em></p>"
    else
      archetype_similarities.first(30).each do |sim|
        html += <<~HTML
          <details>
            <summary>
              #{sim[:similarity]}% similar: <strong>#{sim[:arch1]}</strong> ↔ <strong>#{sim[:arch2]}</strong>
              (#{sim[:common_traits].size} shared traits)
            </summary>
            <div style="padding: 15px;">
              <strong>Shared traits:</strong>
              #{sim[:common_traits].map { |t| "<span class='badge badge-warning'>#{t}</span>" }.join(' ')}
              <br><br>
              <strong>Unique to #{sim[:arch1]}:</strong>
              #{sim[:unique1].map { |t| "<span class='badge badge-archetype'>#{t}</span>" }.join(' ')}
              <br><br>
              <strong>Unique to #{sim[:arch2]}:</strong>
              #{sim[:unique2].map { |t| "<span class='badge badge-archetype'>#{t}</span>" }.join(' ')}
            </div>
          </details>
        HTML
      end
    end

    html += "</div>"
    html
  end

  def missing_coverage_section
    missing = @trait_usage[:archetype_only].sort

    html = <<~HTML
      <div class="section">
        <h2>⚠️ Traits Without Question Coverage</h2>
        <p>These #{missing.size} traits are used in archetypes but have no questions covering them.</p>
    HTML

    if missing.empty?
      html += "<p><em>All archetype traits have question coverage!</em></p>"
    else
      missing.each do |trait|
        data = @traits[trait]
        html += <<~HTML
          <div style="margin: 10px 0; padding: 10px; background: #fff3cd; border-left: 3px solid #ffc107;">
            <span class="trait-name">#{trait}</span>
            <span class="badge badge-warning">#{data[:archetypes].size} archetype(s)</span>
            <br>
            <small>Used in: #{data[:archetypes].join(', ')}</small>
          </div>
        HTML
      end
    end

    html += "</div>"
    html
  end

  def full_trait_table
    sorted_traits = @traits.keys.sort_by { |t|
      [-@traits[t][:archetypes].size, -@traits[t][:questions].size, t]
    }

    html = <<~HTML
      <div class="section">
        <h2>📋 Complete Trait Reference</h2>

        <div class="filter-bar">
          <input type="text" id="traitFilter" placeholder="Filter traits..."
                 onkeyup="filterTable('traitFilter', 'traitTable')">
        </div>

        <table id="traitTable">
          <thead>
            <tr>
              <th>Trait</th>
              <th>Archetypes</th>
              <th>Questions</th>
              <th>Classes</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
    HTML

    sorted_traits.each do |trait|
      data = @traits[trait]
      coverage_status = if data[:archetypes].any? && data[:questions].any?
        "✓"
      elsif data[:archetypes].any?
        "⚠"
      else
        "○"
      end

      html += <<~HTML
        <tr>
          <td>#{coverage_status} <span class="trait-name">#{trait}</span></td>
          <td>#{data[:archetypes].size}</td>
          <td>#{data[:questions].size}</td>
          <td>#{data[:classes].uniq.size}</td>
          <td>
            <details>
              <summary>View details</summary>
              <div style="padding: 10px;">
                <strong>Archetypes:</strong><br>
                #{data[:archetypes].map { |a| "<span class='badge badge-archetype'>#{a}</span>" }.join(' ')}
                <br><br>
                <strong>Questions:</strong><br>
                #{data[:questions].map { |q| "<span class='badge badge-question'>#{q}</span>" }.join(' ')}
                <br><br>
                <strong>Classes:</strong><br>
                #{data[:classes].map { |c| "<span class='badge badge-class'>#{c}</span>" }.join(' ')}
              </div>
            </details>
          </td>
        </tr>
      HTML
    end

    html += <<~HTML
          </tbody>
        </table>
      </div>
    HTML

    html
  end
end

# Run the analyzer
if __FILE__ == $0
  root_dir = File.expand_path('..', __dir__)
  puts "Working directory: #{root_dir}"
  analyzer = TraitAnalyzer.new(root_dir)
  analyzer.analyze
end
