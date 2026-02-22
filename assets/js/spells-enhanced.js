/**
 * Spells Page Enhancements
 * Adds favorite functionality, spell cards, random generators, and more
 */

class SpellsEnhanced {
  constructor() {
    this.favorites = new Set(JSON.parse(localStorage.getItem('spell-favorites') || '[]'));
    this.init();
  }

  init() {
    // Wait for DataTable to be ready - use a more robust approach
    $(document).ready(() => {
      // Wait for the fillTable function to be defined and called
      this.waitForDataTableAndEnhance();
    });
  }

  waitForDataTableAndEnhance() {
    // Check if DataTable exists and has data
    if (typeof contentTable !== 'undefined' && contentTable && $('#contentTable tbody tr').length > 0) {
      this.addFavoriteButtons();
      this.addFavoritesView();
      this.addSpellCardGenerator();
      this.addRandomSpellListGenerator();
    } else {
      // Wait and try again
      setTimeout(() => this.waitForDataTableAndEnhance(), 500);
    }
  }

  addFavoriteButtons() {
    // Override the original fillTable function to add our enhancements
    const originalFillTable = window.fillTable;

    if (originalFillTable) {
      window.fillTable = (results) => {
        // Call original function first
        originalFillTable(results);

        // Then enhance with favorite buttons after a short delay
        setTimeout(() => {
          this.enhanceSpellRows();
        }, 200);
      };

      // If table already exists, enhance it immediately
      if ($('#contentTable tbody tr').length > 0) {
        this.enhanceSpellRows();
      }
    } else {
      setTimeout(() => this.addFavoriteButtons(), 500);
    }
  }

  enhanceSpellRows() {
    // Find all spell headers and add favorite buttons
    const $rows = $('#contentTable tbody tr');
    $rows.each((index, row) => {
      const $row = $(row);
      const $spellCell = $row.find('td:first');
      const $spellHeader = $spellCell.find('h4');

      if ($spellHeader.length > 0) {
        const $anchor = $spellHeader.find('a.internal-link');
        if ($anchor.length > 0) {
          const spellName = $anchor.attr('name');

          // Check if button already exists
          if ($spellHeader.find('.spell-favorite-btn').length > 0) {
            return; // Skip if already enhanced
          }

          const isFavorite = this.favorites.has(spellName);

          // Add favorite button
          const $favBtn = $(`
            <button class="btn btn-sm spell-favorite-btn ${isFavorite ? 'favorited' : ''}"
                    data-spell="${spellName}"
                    title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
              <span>${isFavorite ? '⭐' : '☆'}</span>
            </button>
          `);

          $spellHeader.append($favBtn);
        }
      }
    });
    // Add click handlers for favorite buttons
    $('.spell-favorite-btn').off('click').on('click', (e) => {
      e.stopPropagation();
      const $btn = $(e.currentTarget);
      const spellName = $btn.data('spell');
      this.toggleFavorite(spellName, $btn);
    });
  }

  toggleFavorite(spellName, $btn) {
    if (this.favorites.has(spellName)) {
      this.favorites.delete(spellName);
      $btn.removeClass('favorited');
      $btn.find('span').text('☆');
      $btn.attr('title', 'Add to favorites');
    } else {
      this.favorites.add(spellName);
      $btn.addClass('favorited');
      $btn.find('span').text('⭐');
      $btn.attr('title', 'Remove from favorites');
    }

    // Save to localStorage
    localStorage.setItem('spell-favorites', JSON.stringify([...this.favorites]));

    // Update favorites count
    this.updateFavoritesCount();
  }

  addFavoritesView() {
    this.addEnhancedToolbar();
  }

  addEnhancedToolbar() {
    // Add buttons to existing form rows instead of creating new toolbar

    // Add favorites buttons to the spell levels row
    const $levelRow = $('.form-group:has(#resetLevel)');
    const $favoritesSection = $(`
      <div class="col-sm-3">
        <button class="btn btn-sm btn-outline-primary mr-1" id="show-favorites">
          ⭐ Favorites (<span id="favorites-count">0</span>)
        </button>
        <button class="btn btn-sm btn-outline-secondary d-none" id="show-all-spells">
          Show All
        </button>
      </div>
    `);
    $levelRow.append($favoritesSection);

    // Add generator buttons to the class row
    const $classRow = $('.form-group:has(.spell-class-pills)');
    const $generatorSection = $(`
      <div class="col-sm-2">
        <button class="btn btn-sm btn-outline-success mr-1 mb-1" id="generate-spell-cards" title="Generate printable spell cards">
          🃏 Cards
        </button>
        <button class="btn btn-sm btn-outline-info mb-1" id="random-spell-list" title="Generate random spell list">
          🎲 Random List
        </button>
      </div>
    `);
    $classRow.append($generatorSection);
    // Add click handlers
    $('#show-favorites').on('click', () => this.showFavorites());
    $('#show-all-spells').on('click', () => this.showAllSpells());
    $('#generate-spell-cards').on('click', () => this.generateSpellCards());
    $('#random-spell-list').on('click', () => this.showSpellListGenerator());

    // Update count
    this.updateFavoritesCount();
  }

  showFavorites() {
    if (this.favorites.size === 0) {
      alert('No favorite spells yet! Click the ☆ button next to spells to add them to your favorites.');
      return;
    }

    // Hide rows that aren't favorites
    $('#contentTable tbody tr').each((index, row) => {
      const $row = $(row);
      const $anchor = $row.find('a.internal-link');
      if ($anchor.length > 0) {
        const spellName = $anchor.attr('name');
        if (!this.favorites.has(spellName)) {
          $row.hide();
        } else {
          $row.show();
        }
      }
    });

    $('#show-favorites').addClass('d-none');
    $('#show-all-spells').removeClass('d-none');
    $('#alert').text(`Showing ${this.favorites.size} favorite spells`);
  }

  showAllSpells() {
    $('#contentTable tbody tr').show();
    $('#show-favorites').removeClass('d-none');
    $('#show-all-spells').addClass('d-none');

    // Force DataTable to redraw and update count
    if (typeof contentTable !== 'undefined' && contentTable) {
      contentTable.draw();
    }

    // Trigger existing count function if it exists
    if (typeof countSpells === 'function') {
      setTimeout(() => {
        countSpells();
      }, 100);
    } else {
      // Fallback: manually count visible rows and update alert
      const visibleCount = $('#contentTable tbody tr:visible').length;
      $('#alert').text(visibleCount + ' spells in selection');
    }
  }

  updateFavoritesCount() {
    $('#favorites-count').text(this.favorites.size);
  }

  addSpellCardGenerator() {
    // Functionality integrated into main toolbar - no additional UI needed
  }

  generateSpellCards() {
    const visibleSpells = this.getVisibleSpells();

    if (visibleSpells.length === 0) {
      alert('No spells to generate cards for! Make sure some spells are visible.');
      return;
    }

    if (visibleSpells.length > 50) {
      if (!confirm(`Generate ${visibleSpells.length} spell cards? This might be a lot of paper!`)) {
        return;
      }
    }

    this.createSpellCardsHTML(visibleSpells);
  }

  getVisibleSpells() {
    const spells = [];
    $('#contentTable tbody tr:visible').each((index, row) => {
      const $row = $(row);
      const $spellCell = $row.find('td:first');
      const $description = $row.find('td:nth-child(2)');

      if ($spellCell.length > 0 && $description.length > 0) {
        // Extract spell name from the HTML to match with raw data
        const $temp = $('<div>').html($spellCell.html());
        const spellName = $temp.find('h4 a').text();

        // Skip rows without valid spell names
        if (!spellName || spellName.trim() === '') {
          return;
        }

        // Find corresponding raw data
        const rawData = window.rawSpellData ? window.rawSpellData.find(spell => spell.Name === spellName) : null;
        console.log('Spell:', spellName, 'Raw data found:', !!rawData);

        // Convert HTML description to readable plain text
        const cleanDescription = this.htmlToPlainText($description.html());

        spells.push({
          html: $spellCell.html(),
          description: cleanDescription,
          name: spellName,
          rawData: rawData
        });
      }
    });
    return spells;
  }

  htmlToPlainText(html) {
    // Create a temporary div to parse HTML
    const $temp = $('<div>').html(html);

    // Convert tables to readable format
    $temp.find('table').each(function() {
      const $table = $(this);
      let tableText = '\n\n';

      // Process table rows
      $table.find('tr').each(function() {
        const $row = $(this);
        const cells = [];
        $row.find('th, td').each(function() {
          cells.push($(this).text().trim());
        });
        if (cells.length > 0) {
          tableText += cells.join(' | ') + '\n';
        }
      });

      tableText += '\n';
      $table.replaceWith(tableText);
    });

    // Convert other HTML elements to text with proper spacing
    $temp.find('br').replaceWith('\n');
    $temp.find('p').each(function() {
      $(this).after('\n\n');
    });

    // Get final text and clean up extra whitespace
    return $temp.text().replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  }

  createSpellCardsHTML(spells) {
    const cardsHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>D&D Spell Cards</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .spell-card {
            width: 2.5in; height: 3.5in; border: 2px solid #000; border-radius: 8px;
            margin: 10px; padding: 8px; display: inline-block; vertical-align: top;
            box-sizing: border-box; page-break-inside: avoid;
            position: relative;
          }
          .spell-card.abjuration { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); }
          .spell-card.conjuration { background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%); }
          .spell-card.divination { background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); }
          .spell-card.enchantment { background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); }
          .spell-card.evocation { background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); }
          .spell-card.illusion { background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); }
          .spell-card.necromancy { background: linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%); }
          .spell-card.transmutation { background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); }
          .spell-name { font-weight: bold; font-size: 14px; margin-bottom: 4px;
                       border-bottom: 1px solid #333; padding-bottom: 2px; padding-right: 30px; }
          .spell-level-badge {
            position: absolute; top: 4px; right: 8px;
            width: 24px; height: 24px; border-radius: 50%;
            background: #333; color: #fff;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold; font-size: 12px;
          }
          .spell-info { font-size: 10px; margin-bottom: 8px; }
          .spell-description { font-size: 9px; line-height: 1.2; padding-bottom: 35px; }
          .level-school { font-style: italic; color: #666; font-size: 10px; }
          .spell-icons {
            position: absolute; bottom: 6px; left: 6px;
            font-size: 12px;
            letter-spacing: 2px;
            max-width: 160px;
          }
          .spell-qr {
            position: absolute; bottom: 4px; right: 4px;
            width: 30px; height: 30px;
          }
          @media print {
            body { margin: 0; }
            .spell-card { margin: 5px; }
          }
        </style>
      </head>
      <body>
        ${spells.map(spell => this.createSingleCard(spell)).join('')}
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(cardsHTML);
    printWindow.document.close();
    printWindow.focus();
  }

  createSingleCard(spell) {
    console.log('Creating card for:', spell.name, 'Has rawData:', !!spell.rawData);
    // Use raw data if available, otherwise fall back to HTML parsing
    if (spell.rawData) {
      const data = spell.rawData;
      console.log('Using raw data:', data);

      // Build level badge and school info
      const levelBadge = data.Level == "0" ? "C" : data.Level;
      const ritualInfo = data.Ritual === "Yes" ? " (ritual)" : "";
      const schoolInfo = data.School || "";
      const schoolClass = schoolInfo.toLowerCase();

      // Build duration with concentration
      const duration = data.Conc === "Yes" ? `Concentration, up to ${data.Duration}` : data.Duration;

      // Build QR code URL
      const spellAnchor = (data.Name || spell.name).replace(/\s/g, '');
      const spellURL = `https://dnd.rigo.nu/RulesMagic/spells.html#${spellAnchor}`;
      const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(spellURL)}`;

      // Build icon indicators
      const icons = [];

      // School icons
      const schoolIcons = {
        'Abjuration': '🛡️',
        'Conjuration': '✨',
        'Divination': '🔮',
        'Enchantment': '💫',
        'Evocation': '⚡',
        'Illusion': '🎭',
        'Necromancy': '💀',
        'Transmutation': '🔄'
      };

      if (data.School && schoolIcons[data.School]) {
        icons.push(schoolIcons[data.School]);
      }

      if (data.Conc === "Yes") icons.push('🎯');
      if (data.Ritual === "Yes") icons.push('🕯️');
      if (data.Scales_with_level === "Yes") {
        console.log(`${data.Name} scales with level:`, data.Scales_with_level);
        icons.push('⬆️');
      }
      if (data.Spell_Type && data.Spell_Type.includes('Attack')) icons.push('⚔️');
      const iconString = icons.join(' ');

      console.log('Card data:', {
        name: data.Name,
        casting: data.Casting_Time,
        range: data.Range,
        components: data.Components,
        duration: duration
      });

      return `
        <div class="spell-card ${schoolClass}">
          <div class="spell-level-badge">${levelBadge}</div>
          <div class="spell-name">${data.Name || spell.name}</div>
          <div class="level-school">${schoolInfo}${ritualInfo}</div>
          <div class="spell-info">
            <strong>Cast:</strong> ${data.Casting_Time || ''}<br>
            <strong>Range:</strong> ${data.Range || ''}<br>
            <strong>Components:</strong> ${data.Components || ''}<br>
            <strong>Duration:</strong> ${duration || ''}
          </div>
          <div class="spell-description">
            ${this.formatDescription(this.truncateAtWord(spell.description, 700))}
          </div>
          <div class="spell-icons">${iconString}</div>
          <img src="${qrCodeURL}" class="spell-qr" alt="QR code">
        </div>
      `;
    }

    // Don't create fallback cards for invalid data
    console.log('No rawData available for:', spell.name, 'Skipping card creation.');
    return ``;
  }

  extractInfo(html, label) {
    const match = html.match(new RegExp(`<b>${label}\\s*</b>([^<]*)`));
    return match ? match[1].trim() : '';
  }

  truncateAtWord(text, maxLength) {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    // If we find a space within the last 20 characters, cut there
    if (lastSpace > maxLength - 20) {
      return truncated.substring(0, lastSpace) + '...';
    }

    // Otherwise just truncate at the max length
    return truncated + '...';
  }

  formatDescription(text) {
    // Bold "At Higher Levels." text and put it on a new line
    return text.replace(/At Higher Levels\./g, '<br><br><strong>At Higher Levels.</strong>');
  }

  addRandomSpellListGenerator() {
    // Functionality integrated into main toolbar - no additional UI needed
  }

  showSpellListGenerator() {
    // Use DataTable API to get data like the level pills do
    const table = $('#contentTable').DataTable();
    const availableByLevel = {};
    for (let i = 0; i <= 9; i++) {
      availableByLevel[i] = 0;
    }

    // Get data from DataTable like the pills do
    table.rows({ search: 'applied' }).every(function() {
      const rowData = this.data();
      const level = parseInt(rowData[2]); // Column 2 is level, same as levelPosition

      if (!isNaN(level) && level >= 0 && level <= 9) {
        availableByLevel[level]++;
      }
    });

    const totalVisible = Object.values(availableByLevel).reduce((sum, count) => sum + count, 0);

    const $modal = $(`
      <div class="modal fade" id="spell-list-modal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="alert alert-info">
                <strong>${totalVisible} spells currently visible</strong> based on your filters.
                ${totalVisible < 20 ? 'Consider clearing some filters for more variety.' : ''}
              </div>

              <p class="text-muted mb-3">Generate a random list from currently visible spells. Set how many spells you want from each level:</p>
              <form id="spell-list-form" class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="cantrips-count">Cantrips: <small class="text-muted">(${availableByLevel[0]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="cantrips-count" value="2" min="0" max="${availableByLevel[0]}">
                  </div>
                  <div class="form-group">
                    <label for="level1-count">1st Level: <small class="text-muted">(${availableByLevel[1]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level1-count" value="3" min="0" max="${availableByLevel[1]}">
                  </div>
                  <div class="form-group">
                    <label for="level2-count">2nd Level: <small class="text-muted">(${availableByLevel[2]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level2-count" value="2" min="0" max="${availableByLevel[2]}">
                  </div>
                  <div class="form-group">
                    <label for="level3-count">3rd Level: <small class="text-muted">(${availableByLevel[3]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level3-count" value="2" min="0" max="${availableByLevel[3]}">
                  </div>
                  <div class="form-group">
                    <label for="level4-count">4th Level: <small class="text-muted">(${availableByLevel[4]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level4-count" value="1" min="0" max="${availableByLevel[4]}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="level5-count">5th Level: <small class="text-muted">(${availableByLevel[5]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level5-count" value="1" min="0" max="${availableByLevel[5]}">
                  </div>
                  <div class="form-group">
                    <label for="level6-count">6th Level: <small class="text-muted">(${availableByLevel[6]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level6-count" value="0" min="0" max="${availableByLevel[6]}">
                  </div>
                  <div class="form-group">
                    <label for="level7-count">7th Level: <small class="text-muted">(${availableByLevel[7]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level7-count" value="0" min="0" max="${availableByLevel[7]}">
                  </div>
                  <div class="form-group">
                    <label for="level8-count">8th Level: <small class="text-muted">(${availableByLevel[8]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level8-count" value="0" min="0" max="${availableByLevel[8]}">
                  </div>
                  <div class="form-group">
                    <label for="level9-count">9th Level: <small class="text-muted">(${availableByLevel[9]} available)</small></label>
                    <input type="number" class="form-control form-control-sm" id="level9-count" value="0" min="0" max="${availableByLevel[9]}">
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" onclick="spellsEnhanced.generateRandomSpellList()">
                Generate List
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append($modal);
    $('#spell-list-modal').modal('show');

    // Clean up modal when closed
    $('#spell-list-modal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  generateRandomSpellList() {
    // Get spell counts for each level
    const counts = {
      0: parseInt($('#cantrips-count').val()) || 0,
      1: parseInt($('#level1-count').val()) || 0,
      2: parseInt($('#level2-count').val()) || 0,
      3: parseInt($('#level3-count').val()) || 0,
      4: parseInt($('#level4-count').val()) || 0,
      5: parseInt($('#level5-count').val()) || 0,
      6: parseInt($('#level6-count').val()) || 0,
      7: parseInt($('#level7-count').val()) || 0,
      8: parseInt($('#level8-count').val()) || 0,
      9: parseInt($('#level9-count').val()) || 0
    };

    // Close modal
    $('#spell-list-modal').modal('hide');

    // Use DataTable API to get currently visible spells grouped by level
    const table = $('#contentTable').DataTable();
    const spellsByLevel = {};
    for (let i = 0; i <= 9; i++) {
      spellsByLevel[i] = [];
    }

    // Get data from DataTable like the pills do
    table.rows({ search: 'applied' }).every(function() {
      const rowData = this.data();
      const level = parseInt(rowData[2]); // Column 2 is level

      if (!isNaN(level) && level >= 0 && level <= 9) {
        // Extract spell name from first column's HTML
        const spellHtml = rowData[0];
        const spellNameMatch = spellHtml.match(/<h4>.*?name="([^"]*)".*?>(.*?)<\/a><\/h4>/);

        if (spellNameMatch) {
          const spellName = spellNameMatch[2]; // The actual spell name text
          const spellId = spellNameMatch[1];   // The name attribute (no spaces)

          spellsByLevel[level].push({
            name: spellName,
            id: spellId,
            rowIndex: this.index()
          });
        }
      }
    });

    // Select random spells for each level
    const selectedSpells = [];
    let totalRequested = 0;
    let totalGenerated = 0;

    for (let level = 0; level <= 9; level++) {
      const requestedCount = counts[level];
      totalRequested += requestedCount;

      if (requestedCount > 0 && spellsByLevel[level].length > 0) {
        const available = spellsByLevel[level];
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(requestedCount, available.length));
        selectedSpells.push(...selected);
        totalGenerated += selected.length;
      }
    }

    if (selectedSpells.length === 0) {
      alert('No spells available for the selected criteria! Check your filters and try again.');
      return;
    }

    // Use DataTable API to show only selected spells
    const selectedNames = new Set(selectedSpells.map(s => s.name));

    // Hide all rows first, then show selected ones
    table.rows().every(function() {
      const rowData = this.data();
      const spellHtml = rowData[0];
      const spellNameMatch = spellHtml.match(/<h4>.*?>(.*?)<\/a><\/h4>/);

      if (spellNameMatch) {
        const spellName = spellNameMatch[1];
        const node = this.node();
        if (selectedNames.has(spellName)) {
          $(node).show();
        } else {
          $(node).hide();
        }
      } else {
        $(this.node()).hide();
      }
    });

    $('#alert').text(`Generated random spell list: ${totalGenerated} spells (${totalRequested} requested)`);
  }
}

// Initialize when document is ready
$(document).ready(() => {
  window.spellsEnhanced = new SpellsEnhanced();
});