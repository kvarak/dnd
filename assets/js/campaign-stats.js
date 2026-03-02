// Campaign Statistics - Overview Page
// Uses CampaignData module for data fetching and caching

let campaignData = [];
let characterData = [];
let campaignList = []; // Processed campaign list for re-rendering
let chartInstances = {};

// Helper function to calculate days between two dates
function daysBetween(date1, date2) {
  if (!date1 || !date2 || !(date1 instanceof Date) || !(date2 instanceof Date)) {
    return 0;
  }
  return Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
}

// Main initialization function
async function fetchSheetData() {
  try {
    // Show loading indicator
    const alertEl = document.getElementById('cache-alert');
    if (alertEl) {
      alertEl.innerHTML = '⏳ Loading...';
      alertEl.style.display = 'block';
    }

    // Get data from shared CampaignData module
    const data = await window.CampaignData.getData();
    campaignData = data.campaigns;
    characterData = data.characters;

    // Show cache status
    if (alertEl) {
      const cacheAge = window.CampaignData.getCacheAge();
      if (cacheAge !== null) {
        const minutes = Math.floor(cacheAge / 60000);
        alertEl.innerHTML = `📦 Cached (${minutes}m ago) <button id="refresh-btn" class="btn btn-sm btn-outline-secondary">↻</button>`;
        alertEl.style.display = 'block';

        // Auto-hide after 5 seconds
        const hideTimeout = setTimeout(() => {
          alertEl.style.display = 'none';
        }, 5000);

        // Add refresh button handler
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
          refreshBtn.addEventListener('click', function() {
            clearTimeout(hideTimeout);
            window.CampaignData.clearCache();
            alertEl.innerHTML = '⏳ Loading...';
            fetchSheetData(); // Reload data
          });
        }
      } else {
        alertEl.style.display = 'none';
      }
    }

    console.log('Overview page data loaded:', campaignData.length, 'campaigns,', characterData.length, 'characters');

    renderStats();
    renderCharts();
  } catch (error) {
    console.error('Error loading campaign data:', error);
    const alertEl = document.getElementById('cache-alert');
    if (alertEl) {
      alertEl.innerHTML = '❌ Error loading data';
      alertEl.classList.add('alert-danger');
      alertEl.style.display = 'block';
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

  campaignList = Object.values(campaigns).filter(c => c.name);

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
  renderLevelDurationMatrix(campaignList);

  // Render player statistics
  renderPlayerCharacterCount();
  renderPlayerSurvivalRate();
  renderPlayerTenure();
  renderPlayerAvgLifespan();
  renderPlayerDeathRate();
  renderPlayerCampaignDiversity();
  renderPlayerClassHeatmap();

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

// Render level duration matrix
function renderLevelDurationMatrix(campaignList) {
  const container = document.getElementById('level-duration-matrix');
  if (!container) return;

  console.log('=== Level Duration Matrix Debug ===');
  console.log('campaignList:', campaignList.length, 'campaigns');
  console.log('characterData:', characterData.length, 'characters');
  console.log('Sample character paths:', characterData.slice(0, 10).map(c => ({ path: c.path, name: c.shortname })));
  console.log('Campaign numbers:', campaignList.map(c => ({ nr: c.nr, name: c.name })));

  // Calculate level duration for each campaign
  const campaignLevelData = {};
  const maxLevel = 20;

  campaignList.forEach(campaign => {
    const campaignChars = characterData.filter(c => c.path == campaign.nr);
    console.log(`Campaign ${campaign.nr} (${campaign.name}): ${campaignChars.length} characters`);

    const levelDurations = {};
    const levelCounts = {};

    campaignChars.forEach(char => {
      console.log(`  Char: ${char.shortname}, start: ${char.start}, end: ${char.end}, startlvl: ${char.startlevel}, maxlvl: ${char.maxlvl}`);

      if (char.start && char.end && char.startlevel > 0 && char.maxlvl > 0) {
        const totalDays = daysBetween(char.start, char.end);
        const startLvl = char.startlevel;
        const endLvl = char.maxlvl - char.maxlvl2;
        const levelsGained = endLvl - startLvl;

        console.log(`    totalDays: ${totalDays}, startLvl: ${startLvl}, endLvl: ${endLvl}, levelsGained: ${levelsGained}`);

        if (levelsGained >= 0 && totalDays > 0) {
          // Include both start and end level since character played at both
          const levelsExperienced = levelsGained + 1;
          const daysPerLevel = totalDays / levelsExperienced;

          for (let lvl = startLvl; lvl <= endLvl; lvl++) {
            if (!levelDurations[lvl]) {
              levelDurations[lvl] = 0;
              levelCounts[lvl] = 0;
            }
            levelDurations[lvl] += daysPerLevel;
            levelCounts[lvl] += 1;
          }
        }
      }
    });

    console.log(`  Level durations for campaign ${campaign.nr}:`, levelDurations);

    // Calculate averages for this campaign
    const avgByLevel = {};
    Object.keys(levelDurations).forEach(lvl => {
      avgByLevel[parseInt(lvl)] = Math.round(levelDurations[lvl] / levelCounts[lvl]);
    });

    // Interpolate missing levels (gaps between levels with data)
    const allLevels = Object.keys(avgByLevel).map(l => parseInt(l)).sort((a, b) => a - b);
    if (allLevels.length > 0) {
      const minLvl = allLevels[0];
      const maxLvl = allLevels[allLevels.length - 1];

      for (let lvl = minLvl; lvl <= maxLvl; lvl++) {
        if (!avgByLevel[lvl]) {
          // Find nearest levels with data on both sides
          let leftLvl = lvl - 1;
          let rightLvl = lvl + 1;

          while (leftLvl >= minLvl && !avgByLevel[leftLvl]) leftLvl--;
          while (rightLvl <= maxLvl && !avgByLevel[rightLvl]) rightLvl++;

          if (avgByLevel[leftLvl] && avgByLevel[rightLvl]) {
            // Interpolate between left and right
            avgByLevel[lvl] = Math.round((avgByLevel[leftLvl] + avgByLevel[rightLvl]) / 2);
          } else if (avgByLevel[leftLvl]) {
            // Only left side available, use it
            avgByLevel[lvl] = avgByLevel[leftLvl];
          } else if (avgByLevel[rightLvl]) {
            // Only right side available, use it
            avgByLevel[lvl] = avgByLevel[rightLvl];
          }
        }
      }
    }

    campaignLevelData[campaign.nr] = {
      name: campaign.name,
      levels: avgByLevel
    };
  });

  // Build HTML table
  let html = '<table class="level-duration-table"><thead><tr><th>Campaign</th>';
  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    html += `<th>L${lvl}</th>`;
  }
  html += '</tr></thead><tbody>';

  // Sort campaigns by number
  const sortedCampaigns = Object.keys(campaignLevelData)
    .map(nr => ({ nr: parseInt(nr), ...campaignLevelData[nr] }))
    .sort((a, b) => a.nr - b.nr);

  // Detect dark mode
  const isDarkMode = document.documentElement.classList.contains('dark-mode');

  sortedCampaigns.forEach(campaign => {
    // Find min/max for this campaign row only
    const campaignDays = Object.values(campaign.levels).filter(d => d > 0);
    const minDays = campaignDays.length > 0 ? Math.min(...campaignDays) : 0;
    const maxDays = campaignDays.length > 0 ? Math.max(...campaignDays) : 0;

    // Helper to get color intensity for this row
    const getColorIntensity = (days) => {
      if (!days) return isDarkMode ? '#334155' : '#f8f9fa'; // No data color (matches campaign-name column)
      const normalized = (days - minDays) / (maxDays - minDays || 1);

      if (isDarkMode) {
        // Dark mode: cyan to orange gradient
        const hue = 200 - (normalized * 85); // 200 (cyan) to 115 (yellow-green) to 30 (orange)
        const saturation = 65 + (normalized * 15); // 65% to 80%
        const lightness = 35 + (normalized * 15); // 35% to 50%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      } else {
        // Light mode: blue gradient
        const hue = 210; // Blue
        const lightness = 85 - (normalized * 30); // 85% to 55%
        return `hsl(${hue}, 80%, ${lightness}%)`;
      }
    };

    html += `<tr><td class="campaign-name">${campaign.name}</td>`;
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      const days = campaign.levels[lvl];
      const color = getColorIntensity(days);
      const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)';
      const title = days ? `Level ${lvl}: ${days} days average` : `Level ${lvl}: No data`;
      html += `<td style="background-color: ${color}; color: ${textColor};" title="${title}">${days || '-'}</td>`;
    }
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Render player character count (Character Carousel)
function renderPlayerCharacterCount() {
  const ctx = document.getElementById('player-character-count');
  if (!ctx) return;

  // Group characters by player across ALL campaigns
  const playerData = {};
  characterData.forEach(char => {
    const player = char.category || 'Unknown';
    if (!playerData[player]) {
      playerData[player] = 0;
    }
    playerData[player]++;
  });

  // Sort by count descending
  const sortedPlayers = Object.entries(playerData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); // Top 15 players

  const labels = sortedPlayers.map(([player]) => player);
  const counts = sortedPlayers.map(([, count]) => count);
  const colors = labels.map(player => window.CampaignData.getPlayerColor(player));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Characters Played',
        data: counts,
        backgroundColor: colors.map(c => c.replace('0.7', '0.8')),
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y} character${context.parsed.y > 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });

  chartInstances['player-character-count'] = chart;
}

// Render player survival rate (The Survivor's Club)
function renderPlayerSurvivalRate() {
  const ctx = document.getElementById('player-survival-rate');
  if (!ctx) return;

  // Calculate survival rate per player across ALL campaigns
  const playerStats = {};
  characterData.forEach(char => {
    const player = char.category || 'Unknown';
    if (!playerStats[player]) {
      playerStats[player] = { total: 0, survived: 0 };
    }
    playerStats[player].total++;
    if (char.status === 'n') { // 'n' = survived
      playerStats[player].survived++;
    }
  });

  // Calculate percentages and sort
  const playerRates = Object.entries(playerStats)
    .map(([player, stats]) => ({
      player,
      rate: (stats.survived / stats.total) * 100,
      survived: stats.survived,
      total: stats.total
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 15); // Top 15 players

  const labels = playerRates.map(p => p.player);
  const rates = playerRates.map(p => p.rate);
  const colors = labels.map(player => window.CampaignData.getPlayerColor(player));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Survival Rate',
        data: rates,
        backgroundColor: colors.map(c => c.replace('0.7', '0.8')),
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const player = playerRates[context.dataIndex];
              return `${player.rate.toFixed(1)}% (${player.survived}/${player.total} survived)`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => value + '%'
          }
        }
      }
    }
  });

  chartInstances['player-survival-rate'] = chart;
}

// Render player tenure (Campaign Veterans)
function renderPlayerTenure() {
  const ctx = document.getElementById('player-tenure');
  if (!ctx) return;

  // Calculate total days per player across ALL campaigns
  const playerDays = {};
  characterData.forEach(char => {
    if (!char.start || !char.end) return;
    const player = char.category || 'Unknown';
    const days = daysBetween(char.start, char.end);
    if (!playerDays[player]) {
      playerDays[player] = 0;
    }
    playerDays[player] += days;
  });

  // Sort by days descending
  const sortedPlayers = Object.entries(playerDays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); // Top 15 players

  const labels = sortedPlayers.map(([player]) => player);
  const days = sortedPlayers.map(([, d]) => Math.round(d));
  const colors = labels.map(player => window.CampaignData.getPlayerColor(player));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Days Played',
        data: days,
        backgroundColor: colors.map(c => c.replace('0.7', '0.8')),
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y} days`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  chartInstances['player-tenure'] = chart;
}

// Render player average lifespan (The Iron Curtain)
function renderPlayerAvgLifespan() {
  const ctx = document.getElementById('player-avg-lifespan');
  if (!ctx) return;

  // Calculate average character lifespan per player across ALL campaigns
  const playerLifespans = {};
  characterData.forEach(char => {
    if (!char.start || !char.end) return;
    const player = char.category || 'Unknown';
    const days = daysBetween(char.start, char.end);
    if (!playerLifespans[player]) {
      playerLifespans[player] = { total: 0, count: 0 };
    }
    playerLifespans[player].total += days;
    playerLifespans[player].count++;
  });

  // Calculate averages and sort
  const playerAvgs = Object.entries(playerLifespans)
    .map(([player, stats]) => ({
      player,
      avgDays: stats.total / stats.count,
      charCount: stats.count
    }))
    .sort((a, b) => b.avgDays - a.avgDays)
    .slice(0, 15); // Top 15 players

  const labels = playerAvgs.map(p => p.player);
  const avgDays = playerAvgs.map(p => Math.round(p.avgDays));
  const colors = labels.map(player => window.CampaignData.getPlayerColor(player));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Avg Character Lifespan',
        data: avgDays,
        backgroundColor: colors.map(c => c.replace('0.7', '0.8')),
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const player = playerAvgs[context.dataIndex];
              return `${context.parsed.x} days avg (${player.charCount} character${player.charCount > 1 ? 's' : ''})`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });

  chartInstances['player-avg-lifespan'] = chart;
}

// Render player death rate (Death Magnet Meter)
function renderPlayerDeathRate() {
  const ctx = document.getElementById('player-death-rate');
  if (!ctx) return;

  // Calculate deaths per 100 days played per player
  const playerStats = {};
  characterData.forEach(char => {
    if (!char.start || !char.end) return;
    const player = char.category || 'Unknown';
    const days = daysBetween(char.start, char.end);
    if (!playerStats[player]) {
      playerStats[player] = { deaths: 0, days: 0 };
    }
    playerStats[player].days += days;
    // Count permanent deaths (died = true) and temporary deaths (extraliv)
    if (char.died) playerStats[player].deaths++;
    playerStats[player].deaths += (char.extraliv || 0);
  });

  // Calculate death rate (deaths per 100 days) and sort
  const playerRates = Object.entries(playerStats)
    .filter(([, stats]) => stats.days > 0)
    .map(([player, stats]) => ({
      player,
      rate: (stats.deaths / stats.days) * 100,
      deaths: stats.deaths,
      days: Math.round(stats.days)
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 15);

  const labels = playerRates.map(p => p.player);
  const rates = playerRates.map(p => p.rate);
  const colors = labels.map(player => window.CampaignData.getPlayerColor(player));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Death Rate',
        data: rates,
        backgroundColor: colors.map(c => c.replace('0.7', '0.8')),
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const player = playerRates[context.dataIndex];
              return `${player.rate.toFixed(2)} deaths/100 days (${player.deaths} deaths in ${player.days} days)`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Deaths per 100 Days'
          }
        }
      }
    }
  });

  chartInstances['player-death-rate'] = chart;
}

// Render player campaign diversity (Campaign Passport)
function renderPlayerCampaignDiversity() {
  const ctx = document.getElementById('player-campaign-diversity');
  if (!ctx) return;

  // Count unique campaigns per player
  const playerCampaigns = {};
  characterData.forEach(char => {
    const player = char.category || 'Unknown';
    if (!playerCampaigns[player]) {
      playerCampaigns[player] = new Set();
    }
    playerCampaigns[player].add(char.path);
  });

  // Convert to array and sort
  const sortedPlayers = Object.entries(playerCampaigns)
    .map(([player, campaigns]) => ({
      player,
      count: campaigns.size
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const labels = sortedPlayers.map(p => p.player);
  const counts = sortedPlayers.map(p => p.count);
  const colors = labels.map(player => window.CampaignData.getPlayerColor(player));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Campaigns Joined',
        data: counts,
        backgroundColor: colors.map(c => c.replace('0.7', '0.8')),
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y} campaign${context.parsed.y > 1 ? 's' : ''} joined`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });

  chartInstances['player-campaign-diversity'] = chart;
}

// Render player class heatmap (Player's Class Repertoire)
function renderPlayerClassHeatmap() {
  const container = document.getElementById('player-class-heatmap');
  if (!container) return;

  // Get all unique classes
  const allClasses = [...new Set(characterData.map(c => c.class).filter(c => c))].sort();

  // Count characters per player per class
  const playerClassData = {};
  characterData.forEach(char => {
    const player = char.category || 'Unknown';
    const cls = char.class;
    if (!cls) return;

    if (!playerClassData[player]) {
      playerClassData[player] = {};
    }
    if (!playerClassData[player][cls]) {
      playerClassData[player][cls] = 0;
    }
    playerClassData[player][cls]++;
  });

  // Get top 15 players by total characters
  const topPlayers = Object.entries(playerClassData)
    .map(([player, classes]) => ({
      player,
      total: Object.values(classes).reduce((sum, count) => sum + count, 0),
      classes
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  // Detect dark mode
  const isDarkMode = document.documentElement.classList.contains('dark-mode');

  // Find max count for color scaling
  const maxCount = Math.max(...topPlayers.flatMap(p => Object.values(p.classes)));

  // Helper to get color intensity (matching Level Duration Analysis style)
  const getColorIntensity = (count) => {
    if (!count) return isDarkMode ? '#334155' : '#f8f9fa'; // Empty cells match first column
    const normalized = count / maxCount;

    if (isDarkMode) {
      // Dark mode: cyan to orange heat map
      const hue = 200 - (normalized * 85); // 200 (cyan) to 30 (orange)
      const saturation = 65 + (normalized * 15); // 65% to 80%
      const lightness = 35 + (normalized * 15); // 35% to 50%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    } else {
      // Light mode: blue gradient
      const hue = 210; // Blue
      const lightness = 85 - (normalized * 30); // 85% to 55%
      return `hsl(${hue}, 80%, ${lightness}%)`;
    }
  };

  // Build HTML table
  let html = '<table class="player-class-heatmap-table"><thead><tr><th>Player</th>';
  allClasses.forEach(cls => {
    html += `<th><span>${cls}</span></th>`;
  });
  html += '</tr></thead><tbody>';

  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)';

  topPlayers.forEach(({ player, classes }) => {
    html += `<tr><td class="player-name" style="border-left: 4px solid ${window.CampaignData.getPlayerColor(player).replace('0.7', '1')}">${player}</td>`;
    allClasses.forEach(cls => {
      const count = classes[cls] || 0;
      const color = getColorIntensity(count);
      const title = count ? `${player}: ${count} ${cls} character${count > 1 ? 's' : ''}` : '';
      html += `<td style="background-color: ${color}; color: ${textColor};" title="${title}">${count || ''}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Load data on page load
document.addEventListener('DOMContentLoaded', fetchSheetData);

// Re-render tables when dark mode changes
window.addEventListener('darkModeChanged', function(event) {
  console.log('[CAMPAIGN-STATS] darkModeChanged event received, isDark:', event.detail.isDark);

  // Re-render Level Duration Analysis
  if (typeof campaignList !== 'undefined' && campaignList.length > 0) {
    console.log('[CAMPAIGN-STATS] Re-rendering Level Duration Matrix');
    renderLevelDurationMatrix(campaignList);
  }

  // Re-render Player Class Heatmap
  if (typeof characterData !== 'undefined' && characterData.length > 0) {
    console.log('[CAMPAIGN-STATS] Re-rendering Player Class Heatmap');
    renderPlayerClassHeatmap();
  }
});
