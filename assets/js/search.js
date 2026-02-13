// Simple search functionality for dnd.rigo.nu
// Following core principle: Reduce complexity (vanilla JS, no dependencies)

let searchData = [];
let spellsLoaded = false;

// Load search data (collections and data files)
fetch('/dnd/search.json')
  .then(response => response.json())
  .then(data => {
    searchData = data;
    loadSpells(); // Also load spell data
  })
  .catch(error => console.error('Search data load failed:', error));

// Load and parse spell CSV data
function loadSpells() {
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

      // Parse each spell (skip header row)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const cols = parseCSVLine(lines[i]);
        if (cols.length > nameIdx && cols[nameIdx]) {
          const spellName = cols[nameIdx].trim();
          const description = cols[descIdx] ? cols[descIdx].substring(0, 500) : '';
          const level = cols[levelIdx] || '0';
          const school = cols[schoolIdx] || '';

          searchData.push({
            title: spellName,
            url: '/dnd/RulesMagic/spells.html#' + spellName.replace(/\s/g, ''),
            collection: 'spells',
            content: `${school} spell. ${description}`
          });
        }
      }
      spellsLoaded = true;
      console.log('Loaded ' + searchData.filter(item => item.collection === 'spells').length + ' spells for search');
    })
    .catch(error => {
      // Fail gracefully - search still works for other content
      // Note: CORS may block spell loading in development, but works in production
      console.info('Spell search unavailable (CORS). Other content searchable.');
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
  result.push(current);

  return result.map(field => field.replace(/^"|"$/g, '').trim());
}

// Simple search function
function performSearch(query) {
  if (!query || query.length < 2) return [];

  const searchTerm = query.toLowerCase();
  const results = [];

  searchData.forEach(item => {
    const titleMatch = item.title.toLowerCase().includes(searchTerm);
    const contentMatch = item.content.toLowerCase().includes(searchTerm);

    if (titleMatch || contentMatch) {
      // Calculate relevance score (title matches are more relevant)
      const score = titleMatch ? 10 : 1;

      // Extract context snippet
      const contentLower = item.content.toLowerCase();
      const index = contentLower.indexOf(searchTerm);
      const start = Math.max(0, index - 50);
      const end = Math.min(item.content.length, index + searchTerm.length + 50);
      const snippet = '...' + item.content.substring(start, end) + '...';

      results.push({
        ...item,
        score: score,
        snippet: snippet
      });
    }
  });

  // Sort by relevance
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

// Display search results
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
    return;
  }

  const html = results.map(result => `
    <div class="search-result-item">
      <a href="${result.url}" class="search-result-link">
        <div class="search-result-title">${result.title}</div>
        <div class="search-result-collection">${result.collection}</div>
        <div class="search-result-snippet">${result.snippet}</div>
      </a>
    </div>
  `).join('');

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
});
