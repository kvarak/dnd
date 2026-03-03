// Campaign Data Module - Single source of truth for Google Sheets data
// Handles fetching, caching, and providing data to visualization layers
//
// ARCHITECTURE:
// - Data Layer: This file (campaign-data.js)
// - Overview Layer: campaign-stats.js (all campaigns)
// - Campaign Layer: campaign-specific-stats.js (single campaign)

(function(window) {
  'use strict';

  // Cache configuration
  const CACHE_KEY = 'campaign_data_v15';
  const CACHE_TIMESTAMP_KEY = 'campaign_timestamp_v15';
  const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour

  // Google Sheets URL
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1prVAoIfRSMnyqJ3dTe-0jRRja8c3Gy-Be8hiP3VYn28/gviz/tq?tqx=out:json';

  // Data storage
  let campaignData = null;
  let characterData = null;
  let isLoading = false;
  let loadPromise = null;

  // Global player color palette - optimized for both light and dark modes
  const PLAYER_COLOR_PALETTE = [
    'rgba(59, 130, 246, 0.7)',   // Blue
    'rgba(168, 85, 247, 0.7)',   // Purple
    'rgba(34, 197, 94, 0.7)',    // Green
    'rgba(236, 72, 153, 0.7)',   // Pink
    'rgba(249, 115, 22, 0.7)',   // Orange
    'rgba(20, 184, 166, 0.7)',   // Teal
    'rgba(234, 179, 8, 0.7)',    // Yellow
    'rgba(239, 68, 68, 0.7)'     // Red
  ];

  // Global player color cache - consistent across all campaigns
  let playerColorCache = null;

  // Helper functions for parsing Google Sheets
  function getColumnIndex(cols, label) {
    return cols.findIndex(col => col.label === label);
  }

  function getValueByColumn(row, cols, label) {
    const idx = getColumnIndex(cols, label);
    return idx !== -1 ? row.c[idx]?.v : null;
  }

  function getDateByColumn(row, cols, label) {
    const idx = getColumnIndex(cols, label);
    const formattedDate = idx !== -1 ? row.c[idx]?.f : null;
    return formattedDate ? new Date(formattedDate) : null;
  }

  // Fetch data from Google Sheets
  async function fetchFromSheets() {
    console.log('📡 Fetching fresh data from Google Sheets...');

    try {
      // Fetch campaign/adventure data
      const campaignResponse = await fetch(SHEET_URL + '&gid=70555682');
      const campaignText = await campaignResponse.text();
      const campaignJson = JSON.parse(campaignText.substring(47).slice(0, -2));
      const campaignCols = campaignJson.table.cols;

      campaignData = campaignJson.table.rows.map(row => ({
        nr: getValueByColumn(row, campaignCols, 'nr') || 0,
        path: getValueByColumn(row, campaignCols, 'path') || '',
        adventure: getValueByColumn(row, campaignCols, 'adventure') || '',
        advnr: getValueByColumn(row, campaignCols, 'advnr') || 0,
        start: getDateByColumn(row, campaignCols, 'start'),
        end: getDateByColumn(row, campaignCols, 'end'),
        startIngame: getDateByColumn(row, campaignCols, 'start (in-game)'),
        endIngame: getDateByColumn(row, campaignCols, 'end (in-game)'),
        startLevel: getValueByColumn(row, campaignCols, 'startlevel') || 0,
        endLevel: getValueByColumn(row, campaignCols, 'endlevel') || 0
      }));

      // Fetch character data
      const charResponse = await fetch(SHEET_URL + '&gid=459519818');
      const charText = await charResponse.text();
      const charJson = JSON.parse(charText.substring(47).slice(0, -2));
      const charCols = charJson.table.cols;

      characterData = charJson.table.rows.map(row => {
        const status = getValueByColumn(row, charCols, 'dog?') || '';
        return {
          path: Number(getValueByColumn(row, charCols, 'path')) || 0,
          shortname: getValueByColumn(row, charCols, 'shortname') || '',
          character: getValueByColumn(row, charCols, 'text') || '',
          category: getValueByColumn(row, charCols, 'category') || '',
          status: status,
          died: status === 'y',
          extraliv: Number(getValueByColumn(row, charCols, 'extraliv')) || 0,
          maxlvl: Number(getValueByColumn(row, charCols, 'Max lvl')) || 0,
          maxlvl2: Number(getValueByColumn(row, charCols, 'maxlvl2')) || 0,
          startlevel: Number(getValueByColumn(row, charCols, 'startlevel')) || 0,
          start: getDateByColumn(row, charCols, 'start'),
          end: getDateByColumn(row, charCols, 'end'),
          class: getValueByColumn(row, charCols, 'class') || '',
          class2: getValueByColumn(row, charCols, 'class2') || '',
          race: getValueByColumn(row, charCols, 'race') || '',
          specialization: getValueByColumn(row, charCols, 'specialization') || '',
          specialization2: getValueByColumn(row, charCols, 'specialization2') || '',
          killer: getValueByColumn(row, charCols, 'killer') || '',
          killercr: Number(getValueByColumn(row, charCols, 'killercr')) || 0,
          killer_old: getValueByColumn(row, charCols, 'killer_old') || ''
        };
      });

      // Cache the data
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        campaigns: campaignData,
        characters: characterData
      }));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());

      console.log(`✅ Data fetched: ${campaignData.length} adventures, ${characterData.length} characters`);

      // Initialize global player color cache
      initializePlayerColors();

      return { campaigns: campaignData, characters: characterData };

    } catch (error) {
      console.error('❌ Error fetching campaign data:', error);
      throw error;
    }
  }

  // Load data from cache
  function loadFromCache() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const now = new Date().getTime();

    if (!cachedData || !cacheTimestamp) {
      return null;
    }

    const age = now - parseInt(cacheTimestamp);
    if (age >= CACHE_DURATION) {
      console.log(`⏰ Cache expired (${Math.round(age / 1000 / 60)} minutes old)`);
      return null;
    }

    console.log(`📦 Loading from cache (${Math.round(age / 1000)} seconds old)`);

    const parsed = JSON.parse(cachedData);

    // Convert date strings back to Date objects
    campaignData = parsed.campaigns.map(c => ({
      ...c,
      start: c.start ? new Date(c.start) : null,
      end: c.end ? new Date(c.end) : null,
      startIngame: c.startIngame ? new Date(c.startIngame) : null,
      endIngame: c.endIngame ? new Date(c.endIngame) : null
    }));

    characterData = parsed.characters.map(ch => ({
      ...ch,
      start: ch.start ? new Date(ch.start) : null,
      end: ch.end ? new Date(ch.end) : null
    }));

    // Initialize global player color cache
    initializePlayerColors();

    return { campaigns: campaignData, characters: characterData };
  }

  // Main API: Get data (from cache or fetch)
  async function getData(options = {}) {
    const { forceRefresh = false } = options;

    // If already loaded and not forcing refresh, return immediately
    if (campaignData && characterData && !forceRefresh) {
      console.log('✨ Using already-loaded data');
      return { campaigns: campaignData, characters: characterData };
    }

    // If currently loading, wait for that promise
    if (isLoading && loadPromise) {
      console.log('⏳ Waiting for in-progress data load...');
      return loadPromise;
    }

    // Start loading
    isLoading = true;
    loadPromise = (async () => {
      try {
        // Try cache first (unless forcing refresh)
        if (!forceRefresh) {
          const cached = loadFromCache();
          if (cached) {
            return cached;
          }
        }

        // Fetch fresh data
        return await fetchFromSheets();

      } finally {
        isLoading = false;
        loadPromise = null;
      }
    })();

    return loadPromise;
  }

  // Clear cache
  function clearCache() {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    campaignData = null;
    characterData = null;
    console.log('🗑️  Cache cleared');
  }

  // Get cache age in milliseconds
  function getCacheAge() {
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!cacheTimestamp) return null;
    return new Date().getTime() - parseInt(cacheTimestamp);
  }

  // Check if cache exists and is valid
  function isCacheValid() {
    const age = getCacheAge();
    return age !== null && age < CACHE_DURATION;
  }

  // Initialize global player color cache from all character data
  function initializePlayerColors() {
    if (!characterData) return;

    // Extract all unique player categories across all campaigns
    const allCategories = [...new Set(
      characterData
        .map(c => c.category)
        .filter(cat => cat && cat.trim() !== '')
    )].sort();

    // Assign colors sequentially
    playerColorCache = {};
    allCategories.forEach((cat, idx) => {
      playerColorCache[cat] = PLAYER_COLOR_PALETTE[idx % PLAYER_COLOR_PALETTE.length];
    });

    console.log(`🎨 Initialized ${allCategories.length} player colors globally`);
  }

  // Get color for a specific player/category
  function getPlayerColor(category) {
    if (!category) return 'rgba(105, 105, 105, 0.7)'; // Gray for unknown
    if (!playerColorCache) initializePlayerColors();
    return playerColorCache[category] || PLAYER_COLOR_PALETTE[0];
  }

  // Export public API
  window.CampaignData = {
    getData,
    clearCache,
    getCacheAge,
    isCacheValid,
    getPlayerColor,
    CACHE_DURATION
  };

  console.log('📊 Campaign Data Module loaded');

})(window);
