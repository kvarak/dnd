// Simple search functionality for dnd.rigo.nu
// Following core principle: Reduce complexity (vanilla JS, no dependencies)

(function() {
  'use strict';

let searchData = [];
let spellsLoaded = false;
let equipmentLoaded = false;

// Cache configuration (1 hour expiration)
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Determine base path (works for both /dnd/ dev and root custom domain)
const basePath = window.location.pathname.includes('/dnd/') ? '/dnd' : '';

// Get cached data if fresh
function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION) {
      return data;
    }

    // Expired - remove it
    localStorage.removeItem(key);
    return null;
  } catch (e) {
    return null;
  }
}

// Cache data with timestamp
function setCachedData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.info('Cache storage unavailable');
  }
}

// Update search input placeholder with loading status
function updateSearchStatus() {
  const searchInput = document.getElementById('site-search-input');
  if (!searchInput) return;

  if (!spellsLoaded || !equipmentLoaded) {
    const loadingItems = [];
    if (!spellsLoaded) loadingItems.push('spells');
    if (!equipmentLoaded) loadingItems.push('equipment');
    searchInput.placeholder = `🎲 Loading ${loadingItems.join(' & ')}...`;
  } else {
    searchInput.placeholder = '🔍 Search spells, equipment, skills...';
    searchInput.classList.add('search-ready');
  }
}

// Load search data (collections and data files)
updateSearchStatus(); // Initial status
fetch(`${basePath}/search.json`)
  .then(response => response.json())
  .then(data => {
    searchData = data;
    loadSpells(); // Also load spell data dynamically
    loadEquipment(); // Also load equipment data dynamically
  })
  .catch(error => console.error('Search data load failed:', error));

// Load and parse spell CSV data
function loadSpells() {
  // Check cache first
  const cachedSpells = getCachedData('dnd_spells');
  if (cachedSpells) {
    searchData.push(...cachedSpells);
    spellsLoaded = true;
    console.log('Loaded ' + cachedSpells.length + ' spells from cache');
    updateSearchStatus();
    return;
  }

  // Fetch from Google Sheets
  const spellSheetUrl = 'https://docs.google.com/spreadsheets/d/1Lsmu72Ssq48d7Df2zqYDFUoHsdsOb7K1L_u1FshKJWc/pub?output=csv';

  fetch(spellSheetUrl)
    .then(response => response.text())
    .then(csv => {
      const lines = csv.split('\n');
      const headers = lines[0].split(',');

      // Find column indices
      const nameIdx = headers.findIndex(h => h.trim().startsWith('Name'));
      const descIdx = headers.findIndex(h => h.includes('Description'));
      const levelIdx = headers.findIndex(h => h.trim().startsWith('Level'));
      const schoolIdx = headers.findIndex(h => h.trim().startsWith('School'));

      const spellData = [];
      // Parse each spell (skip header row)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const cols = parseCSVLine(lines[i]);
        if (cols.length > nameIdx && cols[nameIdx]) {
          const spellName = cols[nameIdx].trim();
          const description = cols[descIdx] ? cols[descIdx].substring(0, 500) : '';
          const level = cols[levelIdx] || '0';
          const school = cols[schoolIdx] || '';

          spellData.push({
            title: spellName,
            url: basePath + '/RulesMagic/spells.html#' + spellName.replace(/\s/g, ''),
            collection: 'spells',
            content: `${school} spell. ${description}`
          });
        }
      }

      searchData.push(...spellData);
      setCachedData('dnd_spells', spellData); // Cache for future
      spellsLoaded = true;
      console.log('Loaded ' + spellData.length + ' spells for search (cached)');
      updateSearchStatus();
    })
    .catch(error => {
      // Fail gracefully - search still works for other content
      // Note: CORS may block spell loading in development, but works in production
      console.info('Spell search unavailable (CORS). Other content searchable.');
      spellsLoaded = true; // Mark as complete even if failed
      updateSearchStatus();
    });
}

// Load and parse equipment data
function loadEquipment() {
  // Check cache first
  const cachedEquipment = getCachedData('dnd_equipment');
  if (cachedEquipment) {
    searchData.push(...cachedEquipment);
    equipmentLoaded = true;
    console.log('Loaded ' + cachedEquipment.length + ' equipment items from cache');
    updateSearchStatus();
    return;
  }

  // Fetch from Google Sheets
  const equipmentSheetUrl = 'https://opensheet.elk.sh/1xUNZ5xcqvfepphKklfj4HQ3CbSyk342a3eIMTnSAKUY/1';

  fetch(equipmentSheetUrl)
    .then(response => response.json())
    .then(data => {
      const equipmentData = [];

      data.forEach(row => {
        if (!row.Item) return;

        const itemName = row.Item.trim();
        const description = row.Description || '';
        const category = row.Category || '';
        const price = row.Price || '';
        const weight = row.Weight || '';

        // Generate anchor ID matching equipment.html
        const itemAnchor = itemName.replace(/[^a-zA-Z0-9\s-]/g, '')
                                   .trim()
                                   .toLowerCase()
                                   .replace(/\s+/g, '-');

        // Combine metadata for better searchability
        const searchContent = `${description} Category: ${category}, Price: ${price}${weight && weight !== '-' ? ', Weight: ' + weight : ''}`;

        equipmentData.push({
          title: itemName,
          url: basePath + '/RulesEquipment/equipment.html#' + itemAnchor,
          collection: 'equipment',
          content: searchContent.substring(0, 500)
        });
      });

      searchData.push(...equipmentData);
      setCachedData('dnd_equipment', equipmentData); // Cache for future
      console.log('Loaded ' + equipmentData.length + ' equipment items for search (cached)');
      equipmentLoaded = true;
      updateSearchStatus();
    })
    .catch(error => {
      console.info('Equipment search unavailable. Other content searchable.');
      equipmentLoaded = true; // Mark as complete even if failed
      updateSearchStatus();
    });
}

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }


// Load and parse skills from skills page
function loadSkills() {
  fetch(basePath + '/RulesCharacter/skills.html')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const summaries = doc.querySelectorAll('details > summary');

      summaries.forEach(summary => {
        const skillName = summary.textContent.trim().replace(/\s*\(.*?\)\s*/g, ''); // Remove traits/untrained markers
        const skillId = skillName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const fullText = summary.textContent.trim();

        // Get description from the details content
        const details = summary.parentElement;
        const description = details.textContent.substring(0, 300).trim();

        searchData.push({
          title: fullText,
          url: basePath + '/RulesCharacter/skills.html#skill-' + skillId,
          collection: 'skills',
          content: description
        });
      });

      console.log('Loaded ' + searchData.filter(item => item.collection === 'skills').length + ' skills for search');
    })
    .catch(error => console.info('Skills not loaded for search'));
}

// Load and parse combat skills
function loadCombatSkills() {
  fetch(basePath + '/RulesCharacter/skills_combat.html')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const summaries = doc.querySelectorAll('details > summary');

      summaries.forEach(summary => {
        const skillName = summary.textContent.trim();
        const skillId = skillName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        // Get description from the details content
        const details = summary.parentElement;
        const description = details.textContent.substring(0, 300).trim();

        searchData.push({
          title: skillName,
          url: basePath + '/RulesCharacter/skills_combat.html#skill-' + skillId,
          collection: 'combat skills',
          content: description
        });
      });

      console.log('Loaded ' + searchData.filter(item => item.collection === 'combat skills').length + ' combat skills for search');
    })
    .catch(error => console.info('Combat skills not loaded for search'));
}

// Load and parse familiars
function loadFamiliars() {
  fetch(basePath + '/RulesMagic/familiars.html')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const familiarAnchors = doc.querySelectorAll('a.internal-link[name^="internal-"]');

      familiarAnchors.forEach(anchor => {
        const familiarName = anchor.textContent.trim();
        const anchorName = anchor.getAttribute('name');

        // Skip non-familiar anchors (like "Spells", "personality", "list")
        if (['internal-Spells', 'internal-personality', 'internal-list', 'internal-AnimateFamiliar', 'internal-CallFamiliar', 'internal-FindFamiliar', 'internal-ImbueObject', 'internal-ShapeElement'].includes(anchorName)) {
          return;
        }

        // Get description from parent table if available
        const table = anchor.closest('table.monster');
        const description = table ? table.textContent.substring(0, 300).trim() : 'Familiar creature';

        searchData.push({
          title: familiarName,
          url: basePath + '/RulesMagic/familiars.html#' + anchorName,
          collection: 'familiars',
          content: description
        });
      });

      console.log('Loaded ' + searchData.filter(item => item.collection === 'familiars').length + ' familiars for search');
    })
    .catch(error => console.info('Familiars not loaded for search'));
} result.push(current);

  return result.map(field => field.replace(/^"|"$/g, '').trim());
}

// Simple search function with multi-word support
function performSearch(query) {
  if (!query || query.length < 2) return [];

  // Split query into individual words (2+ chars each)
  const searchTerms = query.toLowerCase()
    .split(/\s+/)
    .filter(term => term.length >= 2);

  if (searchTerms.length === 0) return [];

  const results = [];
  const seenUrls = new Set();

  searchData.forEach(item => {
    const titleLower = item.title.toLowerCase();
    const contentLower = item.content.toLowerCase();

    let score = 0;
    const matchedWords = [];

    // Check each search term
    searchTerms.forEach(term => {
      const titleMatch = titleLower.includes(term);
      const contentMatch = contentLower.includes(term);

      if (titleMatch || contentMatch) {
        // Title matches are worth more
        score += titleMatch ? 10 : 1;

        // Extract the actual matched word
        const matchedWord = extractMatchedWord(
          titleMatch ? item.title : item.content,
          term
        );
        if (matchedWord && !matchedWords.includes(matchedWord)) {
          matchedWords.push(matchedWord);
        }
      }
    });

    // Only include items that matched at least one term
    if (score > 0 && !seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      results.push({
        ...item,
        score: score,
        matchedWords: matchedWords,
        matchCount: matchedWords.length
      });
    }
  });

  // Sort by score (desc), then by match count (desc)
  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.matchCount - a.matchCount;
    })
    .slice(0, 25);
}

// Extract the word containing the search term
function extractMatchedWord(text, searchTerm) {
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);

  if (index === -1) return '';

  // Find word boundaries around the match
  let start = index;
  let end = index + lowerTerm.length;

  // Expand to word boundaries (letters, numbers, apostrophes)
  while (start > 0 && /[\w']/.test(lowerText[start - 1])) start--;
  while (end < lowerText.length && /[\w']/.test(lowerText[end])) end++;

  return text.substring(start, end);
}

// Display search results (compact format)
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
    return;
  }

  const html = results.map(result => {
    // Show matched words if they differ from the title
    let matchInfo = '';
    if (result.matchedWords && result.matchedWords.length > 0) {
      const titleLower = result.title.toLowerCase().trim();
      const relevantMatches = result.matchedWords.filter(word =>
        word.toLowerCase() !== titleLower
      );

      if (relevantMatches.length > 0) {
        matchInfo = ` <span class="search-result-match">(${relevantMatches.join(', ')})</span>`;
      }
    }

    return `
    <a href="${result.url}" class="search-result-item">
      <span class="search-result-collection">[${result.collection}]</span>
      <span class="search-result-title">${result.title}${matchInfo}</span>
    </a>
  `;
  }).join('');

  resultsContainer.innerHTML = html;
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results');
  const searchContainer = document.getElementById('search-container');

  if (!searchInput) return;

  // Search on input with debounce
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    searchTimeout = setTimeout(() => {
      const results = performSearch(query);
      displayResults(results);
      searchResults.style.display = 'block';
    }, 300);
  });

  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });

  // Show results again when focusing on input
  searchInput.addEventListener('focus', function() {
    if (searchInput.value.length >= 2) {
      searchResults.style.display = 'block';
    }
  });

  // Mobile search toggle
  const mobileSearchToggle = document.getElementById('mobile-search-toggle');
  if (mobileSearchToggle) {
    mobileSearchToggle.addEventListener('click', function() {
      searchContainer.classList.toggle('show');
      if (searchContainer.classList.contains('show')) {
        searchInput.focus();
      }
    });

    // Close search when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 991 &&
          !searchContainer.contains(e.target) &&
          !mobileSearchToggle.contains(e.target)) {
        searchContainer.classList.remove('show');
      }
    });
  }
});

})(); // End IIFE
