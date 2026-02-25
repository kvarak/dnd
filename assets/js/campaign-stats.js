// Campaign Statistics - Google Sheets Integration
// Data source: Same spreadsheet used in path-stats

// Google Sheets URL (from path-stats/stats.r)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1prVAoIfRSMnyqJ3dTe-0jRRja8c3Gy-Be8hiP3VYn28/gviz/tq?tqx=out:json';

// Cache settings (1 hour = 1 * 60 * 60 * 1000 milliseconds)
const CACHE_DURATION = 1 * 60 * 60 * 1000;
const CACHE_KEY = 'campaign_data_v13';
const CACHE_TIMESTAMP_KEY = 'campaign_timestamp_v13';

let campaignData = [];
let characterData = [];
let chartInstances = {};
let archetypeData = null;

// Load archetype data from Jekyll data file
async function loadArchetypeData() {
  try {
    const response = await fetch('/dnd/archetypes.json');
    archetypeData = await response.json();
    console.log('Archetype data loaded:', archetypeData.total, 'archetypes');
  } catch (error) {
    console.error('Error loading archetype data:', error);
    // Fallback if file doesn't exist yet
    archetypeData = { total: 0 };
  }
}

// Fetch data from Google Sheets (with caching)
async function fetchSheetData() {
  // Load archetype data first
  await loadArchetypeData();

  // Check if we have cached data and it's still valid
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  const now = new Date().getTime();

  if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
    // Use cached data
    const alertEl = document.getElementById('cache-alert');
    if (alertEl) {
      alertEl.innerHTML = '📦 Cached <button id="refresh-btn" class="btn btn-sm btn-outline-secondary">↻</button>';
      alertEl.style.display = 'block';

      // Auto-hide after 5 seconds
      const hideTimeout = setTimeout(() => {
        alertEl.style.display = 'none';
      }, 5000);

      // Cancel auto-hide if user interacts with refresh button
      const refreshBtn = document.getElementById('refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
          clearTimeout(hideTimeout);
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_TIMESTAMP_KEY);
          alertEl.innerHTML = '⏳ Loading...';
          downloadSheetData();
        });
      }
    }

    const parsed = JSON.parse(cachedData);

    // Convert date strings back to Date objects
    campaignData = parsed.campaigns.map(c => ({
      ...c,
      start: c.start ? new Date(c.start) : null,
      end: c.end ? new Date(c.end) : null,
      startIngame: c.startIngame ? new Date(c.startIngame) : null,
      endIngame: c.endIngame ? new Date(c.endIngame) : null
    }));
    characterData = parsed.characters;

    renderStats();
    renderCharts();

    return;
  }

  // Download fresh data
  const alertEl = document.getElementById('cache-alert');
  if (alertEl) {
    alertEl.innerHTML = '⏳ Loading...';
    alertEl.style.display = 'block';
  }
  downloadSheetData();
}

// Helper function to get column index by label
function getColumnIndex(cols, label) {
  return cols.findIndex(col => col.label === label);
}

// Helper function to extract value by column name
function getValueByColumn(row, cols, label) {
  const idx = getColumnIndex(cols, label);
  return idx !== -1 ? row.c[idx]?.v : null;
}

// Helper function to extract formatted date by column name
function getDateByColumn(row, cols, label) {
  const idx = getColumnIndex(cols, label);
  const formattedDate = idx !== -1 ? row.c[idx]?.f : null;
  return formattedDate ? new Date(formattedDate) : null;
}

// Download data from Google Sheets
async function downloadSheetData() {
  try {
    // Fetch campaign/adventure data (gid=70555682)
    const response = await fetch(SHEET_URL + '&gid=70555682');
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const campaignCols = json.table.cols;

    campaignData = json.table.rows.map(row => ({
      nr: getValueByColumn(row, campaignCols, 'nr') || 0,
      path: getValueByColumn(row, campaignCols, 'path') || '',
      adventure: getValueByColumn(row, campaignCols, 'adventure') || '',
      start: getDateByColumn(row, campaignCols, 'start'),
      end: getDateByColumn(row, campaignCols, 'end'),
      startIngame: getDateByColumn(row, campaignCols, 'start (in-game)'),
      endIngame: getDateByColumn(row, campaignCols, 'end (in-game)'),
      startLevel: getValueByColumn(row, campaignCols, 'startlevel') || 0,
      endLevel: getValueByColumn(row, campaignCols, 'endlevel') || 0
    }));

    // Debug logging for campaigns
    console.log('Campaign column labels:', campaignCols.map(c => c.label));
    console.log('Sample campaign data:', campaignData.slice(0, 3));
    console.log('Sample raw start date:', json.table.rows[0]?.c);
    console.log('Total campaigns:', [...new Set(campaignData.map(c => c.nr))].length);

    // Fetch character data (gid=459519818)
    const charResponse = await fetch(SHEET_URL + '&gid=459519818');
    const charText = await charResponse.text();
    const charJson = JSON.parse(charText.substring(47).slice(0, -2));
    const charCols = charJson.table.cols;

    characterData = charJson.table.rows.map(row => {
      const status = getValueByColumn(row, charCols, 'dog?') || '';
      return {
        path: Number(getValueByColumn(row, charCols, 'path')) || 0,
        status: status,  // 'y' = dead, 'n' = survived, 'lost' = lost, '?' = left
        died: status === 'y',
        extraliv: Number(getValueByColumn(row, charCols, 'extraliv')) || 0,
        maxlvl: Number(getValueByColumn(row, charCols, 'Max lvl')) || 0,
        maxlvl2: Number(getValueByColumn(row, charCols, 'maxlvl2')) || 0,
        startlevel: Number(getValueByColumn(row, charCols, 'startlevel')) || 0,
        class: getValueByColumn(row, charCols, 'class') || '',
        class2: getValueByColumn(row, charCols, 'class2') || '',
        specialization: getValueByColumn(row, charCols, 'specialization') || '',
        specialization2: getValueByColumn(row, charCols, 'specialization2') || '',
        killer: getValueByColumn(row, charCols, 'killer') || '',
        killercr: Number(getValueByColumn(row, charCols, 'killercr')) || 0,
        killer_old: getValueByColumn(row, charCols, 'killer_old') || ''
      };
    });

    // Debug logging
    console.log('Column labels:', charCols.map(c => c.label));
    console.log('Sample character data:', characterData.slice(0, 3));
    console.log('Total characters:', characterData.length);
    console.log('Characters with maxlvl > 0:', characterData.filter(c => c.maxlvl > 0).length);
    console.log('Sample levels:', characterData.slice(0, 10).map(c => ({
      path: c.path,
      class: c.class,
      maxlvl: c.maxlvl,
      maxlvl2: c.maxlvl2,
      startlevel: c.startlevel,
      levelsLived: c.maxlvl - c.maxlvl2 - c.startlevel + 1
    })));
    const permanentDeaths = characterData.filter(c => c.died).length;
    const extraLives = characterData.reduce((sum, c) => sum + (Number(c.extraliv) || 0), 0);
    const survived = characterData.filter(c => c.status === 'n').length;
    console.log('Permanent deaths (dog?=y):', permanentDeaths);
    console.log('Extra lives (temporary deaths):', extraLives);
    console.log('Total deaths:', permanentDeaths + extraLives);
    console.log('Survived (dog?=n):', survived);

    // Cache the downloaded data
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      campaigns: campaignData,
      characters: characterData
    }));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());

    // Hide loading message
    const alertEl = document.getElementById('cache-alert');
    if (alertEl) {
      alertEl.style.display = 'none';
    }

    renderStats();
    renderCharts();
  } catch (error) {
    console.error('Error fetching campaign data:', error);

    // Try to use cached data as fallback
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);

      // Convert date strings back to Date objects
      campaignData = parsed.campaigns.map(c => ({
        ...c,
        start: c.start ? new Date(c.start) : null,
        end: c.end ? new Date(c.end) : null,
        startIngame: c.startIngame ? new Date(c.startIngame) : null,
        endIngame: c.endIngame ? new Date(c.endIngame) : null
      }));
      characterData = parsed.characters;

      renderStats();
      renderCharts();
    }
  }
}

function renderStats() {
  // Calculate statistics
  const campaigns = [...new Set(campaignData.map(c => c.nr))];
  const totalCampaigns = campaigns.length;
  const totalCharacters = characterData.length;

  // Total deaths = permanent deaths (dog? = y) + extra lives (resurrections/temporary deaths)
  const permanentDeaths = characterData.filter(c => c.died).length;
  const extraLives = characterData.reduce((sum, c) => sum + (Number(c.extraliv) || 0), 0);
  const totalDeaths = permanentDeaths + extraLives;

  // Calculate total levels played
  let totalLevelsPlayed = 0;
  characterData.forEach(c => {
    if (c.maxlvl > 0) {
      // Primary class levels: (maxlvl - maxlvl2) - startlevel + 1
      const primaryLevels = (c.maxlvl - c.maxlvl2) - c.startlevel + 1;
      totalLevelsPlayed += primaryLevels;

      // Secondary class levels
      if (c.maxlvl2 > 0) {
        totalLevelsPlayed += c.maxlvl2;
      }
    }
  });

  // Update UI
  const totalCampaignsEl = document.getElementById('total-campaigns');
  const totalCharactersEl = document.getElementById('total-characters');
  const totalDeathsEl = document.getElementById('total-deaths');
  const totalLevelsPlayedEl = document.getElementById('total-levels-played');

  if (totalCampaignsEl) totalCampaignsEl.textContent = totalCampaigns;
  if (totalCharactersEl) totalCharactersEl.textContent = totalCharacters;
  if (totalDeathsEl) totalDeathsEl.textContent = totalDeaths;
  if (totalLevelsPlayedEl) totalLevelsPlayedEl.textContent = totalLevelsPlayed;

  // Render insights (pass both total deaths and permanent deaths)
  renderInsights(campaigns, totalCharacters, totalDeaths, permanentDeaths);
}

function renderInsights(campaigns, totalCharacters, totalDeaths, permanentDeaths) {
  const insights = [];

  // Calculate deaths per campaign
  const campaignStats = campaigns.map(nr => {
    const campaign = campaignData.filter(c => c.nr === nr);
    const campaignName = campaign[0]?.path || `Campaign ${nr}`;
    const campaignChars = characterData.filter(c => c.path == nr);
    const permanentDeaths = campaignChars.filter(c => c.died).length;
    const tempDeaths = campaignChars.reduce((sum, c) => sum + (Number(c.extraliv) || 0), 0);
    const deaths = permanentDeaths + tempDeaths;
    const chars = campaignChars.length;
    const maxLevel = Math.max(...campaign.map(c => c.endLevel || c.startLevel).filter(l => l > 0), 0);

    // Calculate durations
    const starts = campaign.map(c => c.start).filter(d => d instanceof Date && !isNaN(d));
    const ends = campaign.map(c => c.end).filter(d => d instanceof Date && !isNaN(d));
    const startsIG = campaign.map(c => c.startIngame).filter(d => d instanceof Date && !isNaN(d));
    const endsIG = campaign.map(c => c.endIngame).filter(d => d instanceof Date && !isNaN(d));

    const daysReal = (starts.length && ends.length)
      ? (Math.max(...ends.map(d => d.getTime())) - Math.min(...starts.map(d => d.getTime()))) / (1000 * 60 * 60 * 24)
      : 0;
    const daysIngame = (startsIG.length && endsIG.length)
      ? (Math.max(...endsIG.map(d => d.getTime())) - Math.min(...startsIG.map(d => d.getTime()))) / (1000 * 60 * 60 * 24)
      : 0;

    return { nr, name: campaignName, deaths, chars, maxLevel, daysReal, daysIngame };
  });

  // Most Deadly Campaign
  const deadliest = campaignStats.reduce((max, c) => c.deaths > max.deaths ? c : max, campaignStats[0] || {});
  if (deadliest && deadliest.deaths > 0) {
    insights.push({
      class: 'deadly',
      label: 'Most Deadly Campaign',
      value: deadliest.name,
      description: `${deadliest.deaths} total deaths occurred`
    });
  }

  // Highest Level Achieved
  const mostEpic = campaignStats.reduce((max, c) => c.maxLevel > max.maxLevel ? c : max, campaignStats[0] || {});
  if (mostEpic && mostEpic.maxLevel > 0) {
    insights.push({
      class: 'epic',
      label: 'Most Epic Campaign',
      value: mostEpic.name,
      description: `Characters reached level ${mostEpic.maxLevel}`
    });
  }

  // Survival Rate (count only characters with status 'n' = survived)
  const survivedCount = characterData.filter(c => c.status === 'n').length;
  const survivalRate = totalCharacters > 0 ? Math.round((survivedCount / totalCharacters) * 100) : 0;
  insights.push({
    class: 'survival',
    label: 'Overall Survival Rate',
    value: `${survivalRate}%`,
    description: `${survivedCount} of ${totalCharacters} characters survived their campaigns`
  });

  // Most Intense Campaign (deaths per day)
  const withIntensity = campaignStats
    .filter(c => c.daysReal > 0 && c.deaths > 0)
    .map(c => ({ ...c, intensity: c.deaths / c.daysReal }));

  if (withIntensity.length > 0) {
    const mostIntense = withIntensity.reduce((max, c) => c.intensity > max.intensity ? c : max);
    const deathsPer100Days = Math.round(mostIntense.intensity * 100 * 10) / 10;
    insights.push({
      class: 'intense',
      label: 'Most Intense Campaign',
      value: mostIntense.name,
      description: `${deathsPer100Days} deaths per 100 real-time days`
    });
  }

  // Time Compression (reality vs in-game)
  const withCompression = campaignStats.filter(c => c.daysReal > 0 && c.daysIngame > 0);
  if (withCompression.length > 0) {
    const avgCompression = withCompression.reduce((sum, c) => sum + (c.daysIngame / c.daysReal), 0) / withCompression.length;
    insights.push({
      class: 'epic',
      label: 'Time Compression',
      value: `${Math.round(avgCompression * 10) / 10}x`,
      description: `In-game days elapsed per real-time day`
    });
  }

  // Fastest Leveling
  const withLeveling = campaignStats.filter(c => c.daysReal > 0 && c.maxLevel > 1);
  if (withLeveling.length > 0) {
    const fastest = withLeveling.reduce((max, c) => {
      const rate = c.maxLevel / c.daysReal;
      const maxRate = max.maxLevel / max.daysReal;
      return rate > maxRate ? c : max;
    });
    const daysPerLevel = Math.round(fastest.daysReal / fastest.maxLevel);
    insights.push({
      class: 'epic',
      label: 'Fastest Leveling',
      value: fastest.name,
      description: `Average ${daysPerLevel} real-time days per level`
    });
  }

  // Render insights to DOM as flowing text
  const insightsEl = document.getElementById('campaign-insights');
  if (insightsEl && insights.length > 0) {
    const sentences = [];

    insights.forEach((insight, idx) => {
      if (idx === 0) {
        sentences.push(`The <span class="insight-highlight">${insight.value}</span> stands out as the ${insight.label.toLowerCase()}, where ${insight.description.toLowerCase()}.`);
      } else if (idx === insights.length - 1) {
        sentences.push(`Finally, <span class="insight-highlight">${insight.value}</span> marks the ${insight.label.toLowerCase()} with ${insight.description.toLowerCase()}.`);
      } else {
        sentences.push(`The ${insight.label.toLowerCase()} goes to <span class="insight-highlight">${insight.value}</span>, ${insight.description.toLowerCase()}.`);
      }
    });

    insightsEl.innerHTML = sentences.join(' ');
  }
}

function renderCharts() {
  // Destroy existing charts if they exist
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
    }
  });

  // Group by campaign
  const campaigns = {};
  campaignData.forEach(adv => {
    if (!campaigns[adv.nr]) {
      campaigns[adv.nr] = {
        nr: adv.nr,
        name: adv.path,
        start: adv.start,
        end: adv.end,
        startIngame: adv.startIngame,
        endIngame: adv.endIngame,
        adventures: []
      };
    }
    campaigns[adv.nr].adventures.push(adv);
    if (!campaigns[adv.nr].start || (adv.start && adv.start < campaigns[adv.nr].start)) {
      campaigns[adv.nr].start = adv.start;
    }
    if (!campaigns[adv.nr].end || (adv.end && adv.end > campaigns[adv.nr].end)) {
      campaigns[adv.nr].end = adv.end;
    }
    if (!campaigns[adv.nr].startIngame || (adv.startIngame && adv.startIngame < campaigns[adv.nr].startIngame)) {
      campaigns[adv.nr].startIngame = adv.startIngame;
    }
    if (!campaigns[adv.nr].endIngame || (adv.endIngame && adv.endIngame > campaigns[adv.nr].endIngame)) {
      campaigns[adv.nr].endIngame = adv.endIngame;
    }
  });

  const campaignList = Object.values(campaigns).filter(c => c.name);

  // Campaign Timeline Chart
  renderTimelineChart(campaignList);

  // Render all options
  renderOption1(campaignList);  // Combined Deaths & Lethality
  renderOption2();              // Class Levels by Campaign
  renderOption11();             // Deadliest Killers

  // Render class/archetype analytics
  renderArchetypeSurvival();
  renderMulticlass();
  renderClassEvolution(campaignList);
  renderLevelAchievement();

  // Add event listener for killer detail toggle
  const killerToggle = document.getElementById('killer-detail-toggle');
  if (killerToggle) {
    killerToggle.addEventListener('change', () => {
      renderOption11();
    });
  }
}

function renderTimelineChart(campaignList) {
  const ctx = document.getElementById('campaignTimeline');
  if (!ctx) return;

  chartInstances.timeline = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: campaignList.map(c => c.name),
      datasets: [
        {
          label: 'Real-time (days)',
          data: campaignList.map(c => {
            if (c.end instanceof Date && c.start instanceof Date && !isNaN(c.end) && !isNaN(c.start)) {
              return (c.end - c.start) / (1000 * 60 * 60 * 24);
            }
            return 0;
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'In-game (days)',
          data: campaignList.map(c => {
            if (c.endIngame instanceof Date && c.startIngame instanceof Date && !isNaN(c.endIngame) && !isNaN(c.startIngame)) {
              return (c.endIngame - c.startIngame) / (1000 * 60 * 60 * 24);
            }
            return 0;
          }),
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Campaign Duration' },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const campaign = campaignList[context.dataIndex];
              const lines = [];

              if (context.datasetIndex === 0) {
                // Real-time dates
                if (campaign.start instanceof Date && !isNaN(campaign.start)) {
                  lines.push(`Start: ${campaign.start.toISOString().split('T')[0]}`);
                }
                if (campaign.end instanceof Date && !isNaN(campaign.end)) {
                  lines.push(`End: ${campaign.end.toISOString().split('T')[0]}`);
                }
              } else if (context.datasetIndex === 1) {
                // In-game dates
                if (campaign.startIngame instanceof Date && !isNaN(campaign.startIngame)) {
                  lines.push(`Start: ${campaign.startIngame.toISOString().split('T')[0]}`);
                }
                if (campaign.endIngame instanceof Date && !isNaN(campaign.endIngame)) {
                  lines.push(`End: ${campaign.endIngame.toISOString().split('T')[0]}`);
                }
              }

              return lines;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Days' }
        }
      }
    }
  });
}

// Option 1: Death Timeline
function renderOption1(campaignList) {
  const ctx = document.getElementById('chartOption1');
  if (!ctx) return;

  const combinedData = campaignList.map(c => {
    const chars = characterData.filter(ch => ch.path == c.nr);
    const permanentDeaths = chars.filter(ch => ch.died).length;
    const tempDeaths = chars.reduce((sum, ch) => sum + (Number(ch.extraliv) || 0), 0);
    const totalDeaths = permanentDeaths + tempDeaths;

    const daysReal = (c.end instanceof Date && c.start instanceof Date && !isNaN(c.end) && !isNaN(c.start))
      ? (c.end - c.start) / (1000 * 60 * 60 * 24)
      : 0;

    const deathsPer100Days = daysReal > 0 ? (totalDeaths / daysReal) * 100 : 0;

    return {
      campaign: c.name,
      permanent: permanentDeaths,
      temporary: tempDeaths,
      lethality: Math.round(deathsPer100Days * 10) / 10
    };
  });

  chartInstances.option1 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: combinedData.map(d => d.campaign),
      datasets: [
        {
          label: 'Permanent Deaths',
          data: combinedData.map(d => d.permanent),
          backgroundColor: 'rgba(220, 38, 38, 0.7)',
          borderColor: 'rgba(220, 38, 38, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Temporary Deaths',
          data: combinedData.map(d => d.temporary),
          backgroundColor: 'rgba(251, 146, 60, 0.7)',
          borderColor: 'rgba(251, 146, 60, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Lethality Index',
          data: combinedData.map(d => d.lethality),
          type: 'line',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          yAxisID: 'y1',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Campaign Deaths & Lethality Index' },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.dataset.yAxisID === 'y1') {
                label += context.parsed.y.toFixed(1) + ' deaths/100 days';
              } else {
                label += context.parsed.y + ' death' + (context.parsed.y !== 1 ? 's' : '');
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          position: 'left',
          title: { display: true, text: 'Total Deaths' }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          title: { display: true, text: 'Deaths per 100 Days' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// Option 2: Class Levels by Campaign
function renderOption2() {
  const ctx = document.getElementById('chartOption2');
  if (!ctx) return;

  // Get class color from CSS variables (defined in class-colors.css)
  const getClassColorHex = (className) => {
    const cssVar = `--class-${className.toLowerCase()}-color`;
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#696969';
  };

  // Get all campaigns
  const campaigns = {};
  campaignData.forEach(adv => {
    if (!campaigns[adv.nr]) {
      campaigns[adv.nr] = { nr: adv.nr, name: adv.path };
    }
  });
  const campaignList = Object.values(campaigns).filter(c => c.name).sort((a, b) => a.nr - b.nr);

  console.log('=== OPTION 2 DEBUG ===');
  console.log('Campaign list:', campaignList.map((c, i) => `${i}: ${c.name}`));

  // Build scatter data: for each class in each campaign, calculate total levels lived
  const scatterData = [];
  let maxLevels = 0;

  campaignList.forEach((campaign, xIndex) => {
    // Group characters by class for this campaign
    const classTotals = {};

    characterData.forEach(c => {
      if (c.path == campaign.nr && c.maxlvl > 0) {
        // Primary class levels
        if (c.class) {
          const className = c.class.toLowerCase().trim();
          if (!classTotals[className]) {
            classTotals[className] = { levels: 0, count: 0 };
          }
          // For primary class: levels = (maxlvl - maxlvl2) - startlevel + 1
          const primaryLevels = (c.maxlvl - c.maxlvl2) - c.startlevel + 1;
          classTotals[className].levels += primaryLevels;
          classTotals[className].count += 1;
        }
        // Secondary class levels (for multiclass characters)
        if (c.class2 && c.maxlvl2 > 0) {
          const className = c.class2.toLowerCase().trim();
          if (!classTotals[className]) {
            classTotals[className] = { levels: 0, count: 0 };
          }
          // For secondary class: levels = maxlvl2
          classTotals[className].levels += c.maxlvl2;
          classTotals[className].count += 1;
        }
      }
    });

    // Debug class totals for first campaign
    if (xIndex === 0) {
      console.log('Campaign 0 class totals:', classTotals);
    }

    // Create bubbles for each class in this campaign
    Object.entries(classTotals).forEach(([className, data]) => {
      const jitter = (Math.random() - 0.5) * 0.3; // Random offset ±0.15
      const totalLevels = data.levels;
      maxLevels = Math.max(maxLevels, totalLevels);

      scatterData.push({
        x: xIndex + jitter,
        y: totalLevels,
        r: 6 + (data.count * 3),  // Bubble size based on character count
        className: className,
        charCount: data.count,
        campaign: campaign.name
      });
    });
  });

  console.log('Total bubbles:', scatterData.length);
  console.log('Max levels:', maxLevels);
  console.log('Sample bubble data:', scatterData.slice(0, 3));

  // Create background colors array
  const backgroundColors = scatterData.map(d => {
    const baseColor = getClassColorHex(d.className);
    const withOpacity = baseColor + 'b3'; // 70% opacity in hex
    return withOpacity;
  });

  const borderColors = scatterData.map(d => getClassColorHex(d.className));

  chartInstances.option2 = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Class Levels',
        data: scatterData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Total Levels Lived by Class per Campaign' },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const dataPoint = context.raw;
              const className = dataPoint.className.charAt(0).toUpperCase() + dataPoint.className.slice(1);
              const campaign = dataPoint.campaign;
              const levels = dataPoint.y;
              const charCount = dataPoint.charCount;
              return [
                `${className}`,
                `${campaign}`,
                `Total levels: ${levels}`,
                `Characters: ${charCount}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: -0.5,
          max: campaignList.length - 0.5,
          title: {
            display: true,
            text: 'Campaigns (Chronological)'
          },
          ticks: {
            stepSize: 1,
            callback: function(value, index) {
              return campaignList[Math.round(value)]?.name || '';
            },
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          },
          grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' }
        },
        y: {
          type: 'linear',
          min: 0,
          title: {
            display: true,
            text: 'Total Levels Lived'
          },
          ticks: {
            stepSize: Math.ceil(maxLevels / 10)
          },
          grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' }
        }
      }
    }
  });

  console.log('Chart created with', scatterData.length, 'data points');
}

// Option 11: Deadliest Killers - The Danger Zone
function renderOption11() {
  const ctx = document.getElementById('chartOption11');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chartInstances.option11) {
    chartInstances.option11.destroy();
  }

  // Check if we should use grouped killer names (toggle is now inverted - default is specific)
  const useGroupedKillers = document.getElementById('killer-detail-toggle')?.checked || false;
  const killerColumn = useGroupedKillers ? 'killer' : 'killer_old';

  // Count deaths by killer with CR and level data (only permanent deaths)
  const killerCounts = {};

  characterData.forEach(c => {
    // Count permanent death
    if (c.died && c[killerColumn] && c[killerColumn].trim() !== '') {
      const killer = c[killerColumn].trim();
      if (!killerCounts[killer]) {
        killerCounts[killer] = {
          count: 0,
          totalCR: 0,
          totalLevel: 0,
          encounters: 0
        };
      }
      killerCounts[killer].count += 1;
      if (c.killercr > 0 && c.maxlvl > 0) {
        killerCounts[killer].totalCR += c.killercr;
        killerCounts[killer].totalLevel += c.maxlvl;
        killerCounts[killer].encounters += 1;
      }
    }
  });

  // Filter to only killers with CR data, sorted by kill count
  const dangerousKillers = Object.entries(killerCounts)
    .filter(([_, data]) => data.encounters > 0)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, data]) => {
      const avgCR = data.totalCR / data.encounters;
      const avgLevel = data.totalLevel / data.encounters;
      const crDiff = avgCR - avgLevel; // How much harder the killer was

      return {
        name: name,
        x: avgCR,
        y: avgLevel,
        r: 8 + (data.count * 4), // Bubble size based on kill count
        killCount: data.count,
        crDiff: crDiff,
        unfairness: Math.abs(crDiff) // Distance from "fair fight" line
      };
    });

  // Color killers based on how "unfair" they were
  const colors = dangerousKillers.map(k => {
    if (k.crDiff > 5) {
      // TPK territory - way too strong
      return 'rgba(139, 0, 0, 0.7)'; // Dark red
    } else if (k.crDiff > 2) {
      // Boss encounter - significantly harder
      return 'rgba(220, 38, 38, 0.7)'; // Red
    } else if (k.crDiff > -2) {
      // Fair fight zone
      return 'rgba(251, 146, 60, 0.7)'; // Orange
    } else if (k.crDiff > -5) {
      // Punching above weight - weak killer, strong victim
      return 'rgba(34, 197, 94, 0.7)'; // Green
    } else {
      // David vs Goliath - should have been easy
      return 'rgba(59, 130, 246, 0.7)'; // Blue
    }
  });

  const borderColors = colors.map(c => c.replace('0.7', '1'));

  // Draw diagonal "fair fight" reference line
  const maxVal = Math.max(
    ...dangerousKillers.map(k => Math.max(k.x, k.y)),
    20
  );

  chartInstances.option11 = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Killers',
          data: dangerousKillers,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 2
        },
        {
          label: 'Fair Fight Line',
          type: 'line',
          data: [
            { x: 0, y: 0 },
            { x: maxVal, y: maxVal }
          ],
          borderColor: 'rgba(156, 163, 175, 0.5)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: useGroupedKillers ? 'The Danger Zone: Killer Groups' : 'The Danger Zone: Specific Killers',
          font: { size: 16 }
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 1) return null; // Skip line dataset

              const killer = context.raw;
              const lines = [
                `${killer.name}`,
                `💀 ${killer.killCount} kill${killer.killCount > 1 ? 's' : ''}`,
                `⚔️ Avg CR: ${killer.x.toFixed(1)}`,
                `🎯 Avg Victim Lvl: ${killer.y.toFixed(1)}`
              ];

              if (killer.crDiff > 5) {
                lines.push('🔥 TPK TERRITORY');
              } else if (killer.crDiff > 2) {
                lines.push('👹 DEADLY THREAT');
              } else if (killer.crDiff > -2) {
                lines.push('⚖️ FAIR FIGHT');
              } else if (killer.crDiff > -5) {
                lines.push('🎲 LUCKY SHOT');
              } else {
                lines.push('😱 UPSET VICTORY');
              }

              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Killer Challenge Rating (CR)',
            font: { size: 14 }
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        y: {
          type: 'linear',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Victim Character Level',
            font: { size: 14 }
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        }
      }
    }
  });
}

// Class Survival Rate
function renderArchetypeSurvival() {
  const ctx = document.getElementById('chartArchetypeSurvival');
  if (!ctx) {
    return;
  }

  const classStats = {};

  characterData.forEach(c => {
    const classes = [];
    if (c.class && c.class.trim() !== '') classes.push(c.class);
    if (c.class2 && c.class2.trim() !== '') classes.push(c.class2);

    classes.forEach(cls => {
      if (!classStats[cls]) {
        classStats[cls] = { total: 0, survived: 0, died: 0 };
      }
      classStats[cls].total += 1;
      if (c.status === 'n') {
        classStats[cls].survived += 1;
      } else if (c.status === 'y' || c.died) {
        classStats[cls].died += 1;
      }
    });
  });

  // Calculate survival/death metrics for all classes
  const allClassData = Object.entries(classStats).map(([name, data]) => ({
    name: name,
    survivalRate: (data.survived / data.total) * 100,
    deathRate: (data.died / data.total) * 100,
    total: data.total,
    survived: data.survived,
    died: data.died,
    other: data.total - data.survived - data.died
  }));

  // Sort by survival rate
  const survivalData = allClassData
    .sort((a, b) => b.survivalRate - a.survivalRate);

  if (survivalData.length === 0) {
    ctx.parentElement.innerHTML = '<p style="text-align: center; padding: 2rem;">No class data available.</p>';
    return;
  }

  chartInstances.archetypeSurvival = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: survivalData.map(d => d.name),
      datasets: [
        {
          label: 'Death → Survival',
          data: survivalData.map(d => [-d.deathRate, d.survivalRate]),
          backgroundColor: survivalData.map(d =>
            d.survivalRate >= 50 ? 'rgba(22, 163, 74, 0.7)' :   // Dark green
            d.survivalRate >= 25 ? 'rgba(34, 197, 94, 0.7)' :   // Green
            d.survivalRate > 0 ? 'rgba(251, 146, 60, 0.7)' :    // Orange
            'rgba(127, 29, 29, 0.8)'                             // Dark red (0%)
          ),
          borderColor: survivalData.map(d =>
            d.survivalRate >= 50 ? 'rgba(22, 163, 74, 1)' :
            d.survivalRate >= 25 ? 'rgba(34, 197, 94, 1)' :
            d.survivalRate > 0 ? 'rgba(251, 146, 60, 1)' :
            'rgba(127, 29, 29, 1)'
          ),
          borderWidth: 1,
          borderSkipped: false
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Class Survival vs Death Severity' },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const data = survivalData[context.dataIndex];
              return [
                `Survival: ${data.survivalRate.toFixed(1)}%`,
                `Death: ${data.deathRate.toFixed(1)}%`
              ];
            },
            afterLabel: function(context) {
              const data = survivalData[context.dataIndex];
              const lines = [
                `Total characters: ${data.total}`,
                `Survived: ${data.survived}`,
                `Died: ${data.died}`
              ];
              if (data.other > 0) {
                lines.push(`Other (left/unknown): ${data.other}`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          min: -100,
          max: 100,
          ticks: {
            callback: function(value) {
              return Math.abs(value) + '%';
            }
          },
          title: { display: true, text: 'Death Severity ← | → Survival Rate' }
        }
      }
    }
  });
}

// Multiclass Combinations - Scatter showing which classes are multiclass hubs
function renderMulticlass() {
  const ctx = document.getElementById('chartMulticlass');
  if (!ctx) return;

  // Track for each class: primary count, secondary count, and unique partners
  const classStats = {};

  characterData.forEach(c => {
    if (c.class && c.class2) {
      // Track class1 stats
      if (!classStats[c.class]) {
        classStats[c.class] = { primary: 0, secondary: 0, partners: new Set(), partnerCounts: {} };
      }
      classStats[c.class].primary += 1;
      classStats[c.class].partners.add(c.class2);
      classStats[c.class].partnerCounts[c.class2] = (classStats[c.class].partnerCounts[c.class2] || 0) + 1;

      // Track class2 stats
      if (!classStats[c.class2]) {
        classStats[c.class2] = { primary: 0, secondary: 0, partners: new Set(), partnerCounts: {} };
      }
      classStats[c.class2].secondary += 1;
      classStats[c.class2].partners.add(c.class);
      classStats[c.class2].partnerCounts[c.class] = (classStats[c.class2].partnerCounts[c.class] || 0) + 1;
    }
  });

  // Convert to scatter data with deterministic jitter to prevent overlapping
  const scatterData = Object.entries(classStats).map(([className, stats]) => {
    // Deterministic jitter based on class name hash (±0.15)
    const hashCode = className.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    const jitterX = ((hashCode % 100) / 100 - 0.5) * 0.3;
    const jitterY = (((hashCode * 7) % 100) / 100 - 0.5) * 0.3;

    // Get top partners sorted by count
    const topPartners = Object.entries(stats.partnerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `${name} (${count})`)
      .join(', ');

    return {
      x: stats.primary + jitterX,
      y: stats.secondary + jitterY,
      r: stats.partners.size * 5 + 5, // Bubble size based on versatility
      label: className,
      primary: stats.primary,  // Store original values for tooltip
      secondary: stats.secondary,
      versatility: stats.partners.size,
      total: stats.primary + stats.secondary,
      topPartners: topPartners,
      allPartners: Array.from(stats.partners).sort().join(', ')
    };
  });

  // Get class color from CSS variables (defined in class-colors.css)
  const getClassColor = (className) => {
    const cssVar = `--class-${className.toLowerCase()}-color`;
    const hex = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#696969';

    // Convert hex to rgba with 0.6 opacity
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  // Custom plugin to draw class labels on bubbles
  const labelPlugin = {
    id: 'multiclassLabels',
    afterDatasetsDraw: function(chart) {
      const ctx = chart.ctx;
      chart.data.datasets[0].data.forEach((point, index) => {
        const meta = chart.getDatasetMeta(0);
        const element = meta.data[index];

        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.label, element.x, element.y);
      });
    }
  };

  chartInstances.multiclass = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: '', // Remove dataset label to avoid it showing in tooltip
        data: scatterData,
        backgroundColor: scatterData.map(d => getClassColor(d.label)),
        borderColor: scatterData.map(d => getClassColor(d.label).replace('0.6', '1')),
        borderWidth: 2
      }]
    },
    plugins: [labelPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Multiclass Hub Analysis: Which Classes Multiclass Most?',
          font: { size: 14 }
        },
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: function(context) {
              const data = context[0].raw;
              return data.label.toUpperCase();
            },
            beforeLabel: function() {
              return null; // Suppress default label
            },
            label: function(context) {
              const data = context.raw;
              const lines = [
                `Total multiclass characters: ${data.total}`,
                `  • As primary: ${data.primary} times`,
                `  • As secondary: ${data.secondary} times`,
                '',
                `Versatility: ${data.versatility} unique partner classes`
              ];

              if (data.topPartners) {
                lines.push('');
                lines.push('Top partners:');
                lines.push(`  ${data.topPartners}`);
              }

              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Times Used as Primary Class →'
          },
          ticks: { stepSize: 1 }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '← Times Used as Secondary Class'
          },
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// Class Popularity Evolution - Normalized Stacked Area Chart
function renderClassEvolution(campaignList) {
  const ctx = document.getElementById('chartClassEvolution');
  if (!ctx) return;

  // Get all unique classes (both primary and secondary)
  const classData = {};
  characterData.forEach(c => {
    if (c.class) {
      if (!classData[c.class]) classData[c.class] = 0;
      classData[c.class]++;
    }
    if (c.class2) {
      if (!classData[c.class2]) classData[c.class2] = 0;
      classData[c.class2]++;
    }
  });

  // Sort classes by total usage
  const sortedClasses = Object.entries(classData)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  // Get class color from CSS variables
  const getClassColor = (name) => {
    const cssVar = `--class-${name.toLowerCase()}-color`;
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#696969';
  };

  // Build datasets: one per class, with raw count data
  const datasets = sortedClasses.map(className => {
    const rawData = campaignList.map(campaign => {
      // Count both primary and secondary class
      return characterData.filter(c =>
        c.path === Number(campaign.nr) && (c.class === className || c.class2 === className)
      ).length;
    });

    const totalCount = rawData.reduce((sum, val) => sum + val, 0);
    const color = getClassColor(className);

    return {
      label: className.charAt(0).toUpperCase() + className.slice(1),
      data: rawData,
      totalCount: totalCount,
      backgroundColor: color + 'cc', // Semi-transparent (80%)
      borderColor: color,
      borderWidth: 1,
      fill: true,
      tension: 0, // Sharp angles, no smoothing
      pointRadius: 0, // Hide points for cleaner area chart
      pointHoverRadius: 4
    };
  }).filter(dataset => dataset.totalCount > 0);

  chartInstances.classEvolution = new Chart(ctx, {
    type: 'line',
    data: {
      labels: campaignList.map(c => c.name),
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: 'Class Distribution Across Campaigns',
          font: { size: 14 }
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 5,
            font: { size: 10 },
            generateLabels: function(chart) {
              const datasets = chart.data.datasets;
              return datasets.map((dataset, i) => ({
                text: `${dataset.label} (${dataset.totalCount})`,
                fillStyle: dataset.backgroundColor,
                hidden: !chart.isDatasetVisible(i),
                strokeStyle: dataset.borderColor,
                lineWidth: dataset.borderWidth,
                datasetIndex: i
              }));
            }
          }
        },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function(context) {
              const count = context.parsed.y;
              return `${context.dataset.label}: ${count} character${count !== 1 ? 's' : ''}`;
            },
            footer: function(tooltipItems) {
              const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
              return `Total: ${total} class entries`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          title: { display: true, text: 'Campaign' },
          ticks: {
            font: { size: 10 }
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: 'Number of Class Entries' },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Level Achievement by Class
function renderLevelAchievement() {
  const ctx = document.getElementById('chartLevelAchievement');
  if (!ctx) return;

  const classBrackets = {};

  characterData.forEach(c => {
    if (c.class && c.maxlvl > 0) {
      if (!classBrackets[c.class]) {
        classBrackets[c.class] = { one: 0, low: 0, mid: 0, high: 0, epic: 0 };
      }

      // Calculate levels lived in primary class: (maxlvl - maxlvl2) - startlevel + 1
      const levelsLived = (c.maxlvl - (c.maxlvl2 || 0)) - (c.startlevel || 0) + 1;

      if (levelsLived === 1) {
        classBrackets[c.class].one += 1;
      } else if (levelsLived <= 5) {
        classBrackets[c.class].low += 1;
      } else if (levelsLived <= 10) {
        classBrackets[c.class].mid += 1;
      } else if (levelsLived <= 15) {
        classBrackets[c.class].high += 1;
      } else {
        classBrackets[c.class].epic += 1;
      }
    }
  });

  const classes = Object.keys(classBrackets).sort();

  chartInstances.levelAchievement = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [
        {
          label: '1 level',
          data: classes.map(c => classBrackets[c].one),
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        },
        {
          label: '2-5 levels',
          data: classes.map(c => classBrackets[c].low),
          backgroundColor: 'rgba(156, 163, 175, 0.7)',
          borderColor: 'rgba(156, 163, 175, 1)',
          borderWidth: 1
        },
        {
          label: '6-10 levels',
          data: classes.map(c => classBrackets[c].mid),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: '11-15 levels',
          data: classes.map(c => classBrackets[c].high),
          backgroundColor: 'rgba(168, 85, 247, 0.7)',
          borderColor: 'rgba(168, 85, 247, 1)',
          borderWidth: 1
        },
        {
          label: '16+ levels',
          data: classes.map(c => classBrackets[c].epic),
          backgroundColor: 'rgba(251, 191, 36, 0.7)',
          borderColor: 'rgba(251, 191, 36, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Levels Lived Distribution by Class' },
        legend: { display: true }
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: 'Number of Characters' },
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// Primary vs Secondary Classes
function renderPrimarySecondary() {
  const ctx = document.getElementById('chartPrimarySecondary');
  if (!ctx) return;

  const classStats = {};

  characterData.forEach(c => {
    if (c.class) {
      if (!classStats[c.class]) {
        classStats[c.class] = { primary: 0, secondary: 0 };
      }
      classStats[c.class].primary += 1;
    }

    if (c.class2) {
      if (!classStats[c.class2]) {
        classStats[c.class2] = { primary: 0, secondary: 0 };
      }
      classStats[c.class2].secondary += 1;
    }
  });

  const classes = Object.keys(classStats).sort();

  chartInstances.primarySecondary = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [
        {
          label: 'Primary Class',
          data: classes.map(c => classStats[c].primary),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: 'Secondary Class (Multiclass)',
          data: classes.map(c => classStats[c].secondary),
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Primary vs Secondary Class Distribution' },
        legend: { display: true },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const className = classes[context.dataIndex];
              const total = classStats[className].primary + classStats[className].secondary;
              return `Total: ${total} characters`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Characters' },
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// Load data on page load
document.addEventListener('DOMContentLoaded', fetchSheetData);
