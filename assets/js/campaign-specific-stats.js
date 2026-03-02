// Campaign-Specific Statistics
// Displays statistics and visualizations for individual campaign pages
//
// ARCHITECTURE:
// - Data Layer: campaign-data.js (shared data fetching/caching)
// - This Layer: Single-campaign filtering and visualization

// Store chart instances to allow cleanup
const campaignChartInstances = {};

// Main initialization function called from statistics.html
async function initCampaignStats(pathNumber) {
  console.log(`📊 Initializing campaign stats for path ${pathNumber}`);

  try {
    // Get data from shared data module
    const { campaigns, characters } = await window.CampaignData.getData();

    // Filter data for this specific campaign
    const thisCampaignData = campaigns.filter(c => c.nr == pathNumber);
    const thisCharacterData = characters.filter(c => c.path == pathNumber);

    console.log(`Campaign ${pathNumber}: ${thisCampaignData.length} adventures, ${thisCharacterData.length} characters`);

    // Render all visualizations
    renderCampaignSummary(pathNumber, thisCampaignData, thisCharacterData);
    renderCampaignInsights(pathNumber, thisCampaignData, thisCharacterData);
    renderClassDistribution(pathNumber, thisCharacterData);
    renderCharacterLongevity(pathNumber, thisCharacterData);
    renderPartyTimeline(pathNumber, thisCampaignData, thisCharacterData);
    renderLevelDuration(pathNumber, thisCharacterData);
    renderKillerBreakdown(pathNumber, thisCharacterData);
  } catch (error) {
    console.error('❌ Error initializing campaign stats:', error);
  }
}

// Get class color from CSS variables
function getClassColorHex(className) {
  const cssVar = `--class-${className.toLowerCase()}-color`;
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#696969';
}

// Generate consistent color for player/category
function getPlayerColor(category) {
  if (!category) return 'rgba(105, 105, 105, 0.7)';

  // Predefined color palette for players (as rgba)
  const colorPalette = [
    'rgba(102, 126, 234, 0.7)',  // Purple-blue
    'rgba(118, 75, 162, 0.7)',   // Deep purple
    'rgba(240, 147, 251, 0.7)',  // Pink-purple
    'rgba(79, 172, 254, 0.7)',   // Sky blue
    'rgba(67, 233, 123, 0.7)',   // Mint green
    'rgba(250, 112, 154, 0.7)',  // Rose
    'rgba(254, 225, 64, 0.7)',   // Yellow
    'rgba(48, 207, 208, 0.7)',   // Cyan
    'rgba(168, 237, 234, 0.7)',  // Light teal
    'rgba(254, 214, 227, 0.7)',  // Light pink
    'rgba(196, 113, 245, 0.7)',  // Violet
    'rgba(18, 194, 233, 0.7)',   // Ocean blue
    'rgba(247, 112, 98, 0.7)',   // Coral
    'rgba(254, 81, 150, 0.7)',   // Hot pink
    'rgba(142, 197, 252, 0.7)',  // Light blue
    'rgba(224, 195, 252, 0.7)'   // Lavender
  ];

  // Generate consistent hash from category string
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = ((hash << 5) - hash) + category.charCodeAt(i);
    hash = hash & hash;
  }

  // Use hash to pick color from palette
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

// Calculate days between dates
function daysBetween(date1, date2) {
  if (!date1 || !date2 || !(date1 instanceof Date) || !(date2 instanceof Date)) {
    return 0;
  }
  return Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
}

// Render campaign summary cards
function renderCampaignSummary(pathNumber, thisCampaignData, thisCharacterData) {
  // Characters played
  const charCount = thisCharacterData.length;
  document.getElementById(`stat-chars-${pathNumber}`).textContent = charCount;

  // Party deaths (permanent + temporary)
  const permanentDeaths = thisCharacterData.filter(c => c.died).length;
  const temporaryDeaths = thisCharacterData.reduce((sum, c) => sum + c.extraliv, 0);
  const totalDeaths = permanentDeaths + temporaryDeaths;
  document.getElementById(`stat-deaths-${pathNumber}`).textContent = totalDeaths;

  // Campaign duration (real-time)
  const starts = thisCampaignData.map(c => c.start).filter(d => d instanceof Date);
  const ends = thisCampaignData.map(c => c.end).filter(d => d instanceof Date);
  const daysReal = (starts.length && ends.length)
    ? Math.round(daysBetween(new Date(Math.min(...starts.map(d => d.getTime()))), new Date(Math.max(...ends.map(d => d.getTime())))))
    : 0;
  document.getElementById(`stat-duration-${pathNumber}`).textContent =
    daysReal > 0 ? `${daysReal} days` : '-';

  // In-game time
  const startsIG = thisCampaignData.map(c => c.startIngame).filter(d => d instanceof Date);
  const endsIG = thisCampaignData.map(c => c.endIngame).filter(d => d instanceof Date);
  const daysIngame = (startsIG.length && endsIG.length)
    ? Math.round(daysBetween(new Date(Math.min(...startsIG.map(d => d.getTime()))), new Date(Math.max(...endsIG.map(d => d.getTime())))))
    : 0;
  document.getElementById(`stat-ingame-${pathNumber}`).textContent =
    daysIngame > 0 ? `${daysIngame} days` : '-';

  // Level range
  const startLevels = thisCampaignData.map(c => c.startLevel).filter(l => l > 0);
  const endLevels = thisCampaignData.map(c => c.endLevel).filter(l => l > 0);
  const startLevel = startLevels.length > 0 ? Math.min(...startLevels) : null;
  const endLevel = endLevels.length > 0 ? Math.max(...endLevels) : null;

  let levelRangeText = '-';
  if (startLevel && endLevel) {
    levelRangeText = `${startLevel} → ${endLevel}`;
  } else if (startLevel) {
    levelRangeText = `${startLevel}+`;
  }
  document.getElementById(`stat-levels-${pathNumber}`).textContent = levelRangeText;

  // Survival rate
  const survived = thisCharacterData.filter(c => c.status === 'n').length;
  const survivalRate = charCount > 0 ? Math.round((survived / charCount) * 100) : 0;
  document.getElementById(`stat-survival-${pathNumber}`).textContent = `${survivalRate}%`;
}

// Render campaign insights
function renderCampaignInsights(pathNumber, thisCampaignData, thisCharacterData) {
  const insights = [];

  // Most deadly adventure
  const deathsByAdventure = {};
  thisCharacterData.forEach(c => {
    // This is simplified - would need adventure mapping from dates
    if (c.died || c.extraliv > 0) {
      // For now, just count total
    }
  });

  // Deadliest enemy
  const killers = thisCharacterData.filter(c => c.killer && c.died);
  if (killers.length > 0) {
    const killerCounts = {};
    killers.forEach(c => {
      const key = `${c.killer} (CR ${c.killercr})`;
      killerCounts[key] = (killerCounts[key] || 0) + 1;
    });
    const deadliestKiller = Object.entries(killerCounts).reduce((a, b) => b[1] > a[1] ? b : a);
    insights.push(`The <span class="insight-highlight">${deadliestKiller[0]}</span> proved to be the deadliest threat, claiming ${deadliestKiller[1]} ${deadliestKiller[1] > 1 ? 'lives' : 'life'}.`);
  }

  // Longest surviving character
  const withDuration = thisCharacterData.filter(c => c.start && c.end);
  if (withDuration.length > 0) {
    const longest = withDuration.reduce((max, c) => {
      const duration = daysBetween(c.start, c.end);
      const maxDuration = daysBetween(max.start, max.end);
      return duration > maxDuration ? c : max;
    });
    const longestDays = Math.round(daysBetween(longest.start, longest.end));
    insights.push(`<span class="insight-highlight">${longest.shortname || longest.character}</span> survived the longest, active for ${longestDays} days.`);
  }

  // Fastest leveler
  const withLevels = thisCharacterData.filter(c => c.start && c.end && c.maxlvl > c.startlevel);
  if (withLevels.length > 0) {
    const fastest = withLevels.reduce((max, c) => {
      const levelsGained = (c.maxlvl - c.maxlvl2) - c.startlevel;
      const days = daysBetween(c.start, c.end);
      const rate = days > 0 ? levelsGained / days : 0;
      const maxRate = max.maxlvl > max.startlevel && daysBetween(max.start, max.end) > 0
        ? ((max.maxlvl - max.maxlvl2) - max.startlevel) / daysBetween(max.start, max.end)
        : 0;
      return rate > maxRate ? c : max;
    });
    const levelsGained = (fastest.maxlvl - fastest.maxlvl2) - fastest.startlevel;
    insights.push(`<span class="insight-highlight">${fastest.shortname || fastest.character}</span> leveled fastest, gaining ${levelsGained} levels.`);
  }

  const insightsEl = document.getElementById(`campaign-insights-${pathNumber}`);
  if (insightsEl && insights.length > 0) {
    insightsEl.innerHTML = insights.join(' ');
  }
}

// Render class distribution (donut chart)
function renderClassDistribution(pathNumber, thisCharacterData) {
  const ctx = document.getElementById(`class-distribution-${pathNumber}`);
  if (!ctx) return;

  // Count class usage (both primary and secondary)
  const classCounts = {};

  thisCharacterData.forEach(char => {
    // Primary class
    if (char.class) {
      const className = char.class.charAt(0).toUpperCase() + char.class.slice(1).toLowerCase();
      classCounts[className] = (classCounts[className] || 0) + 1;
    }
    // Secondary class (for multiclass)
    if (char.class2) {
      const className = char.class2.charAt(0).toUpperCase() + char.class2.slice(1).toLowerCase();
      classCounts[className] = (classCounts[className] || 0) + 1;
    }
  });

  // Sort by count descending
  const sortedClasses = Object.entries(classCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12); // Limit to top 12 classes for readability

  const labels = sortedClasses.map(c => c[0]);
  const data = sortedClasses.map(c => c[1]);
  const colors = labels.map(className => {
    const color = getClassColorHex(className.toLowerCase());
    return color + 'cc'; // 80% opacity
  });
  const borderColors = labels.map(className => getClassColorHex(className.toLowerCase()));

  // Create chart
  const chartKey = `class-distribution-${pathNumber}`;
  if (campaignChartInstances[chartKey]) {
    campaignChartInstances[chartKey].destroy();
  }

  campaignChartInstances[chartKey] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Class Distribution' },
        legend: {
          display: true,
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Render character longevity (bubble scatter)
function renderCharacterLongevity(pathNumber, thisCharacterData) {
  const ctx = document.getElementById(`character-longevity-${pathNumber}`);
  if (!ctx) return;

  // Build scatter data
  const scatterData = thisCharacterData
    .filter(char => char.start && char.end && char.maxlvl > 0)
    .map(char => {
      const days = Math.round(daysBetween(char.start, char.end));
      const levelsGained = (char.maxlvl - char.maxlvl2) - char.startlevel + 1;
      const finalLevel = char.maxlvl - char.maxlvl2;
      const status = char.status || '?';

      return {
        x: days,
        y: levelsGained,
        r: 4 + (finalLevel * 0.5), // Bubble size based on final level
        name: char.shortname || char.character,
        finalLevel: finalLevel,
        status: status,
        class: char.class
      };
    });

  // Separate by status
  const survivedData = scatterData.filter(d => d.status === 'n');
  const diedData = scatterData.filter(d => d.status === 'y');
  const lostData = scatterData.filter(d => d.status === 'lost');
  const leftData = scatterData.filter(d => d.status === '?');

  // Create chart
  const chartKey = `character-longevity-${pathNumber}`;
  if (campaignChartInstances[chartKey]) {
    campaignChartInstances[chartKey].destroy();
  }

  const datasets = [];

  if (survivedData.length > 0) {
    datasets.push({
      label: 'Survived',
      data: survivedData,
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1
    });
  }

  if (diedData.length > 0) {
    datasets.push({
      label: 'Died',
      data: diedData,
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 1
    });
  }

  if (lostData.length > 0) {
    datasets.push({
      label: 'Lost',
      data: lostData,
      backgroundColor: 'rgba(251, 146, 60, 0.6)',
      borderColor: 'rgba(251, 146, 60, 1)',
      borderWidth: 1
    });
  }

  if (leftData.length > 0) {
    datasets.push({
      label: 'Left/Unknown',
      data: leftData,
      backgroundColor: 'rgba(156, 163, 175, 0.6)',
      borderColor: 'rgba(156, 163, 175, 1)',
      borderWidth: 1
    });
  }

  campaignChartInstances[chartKey] = new Chart(ctx, {
    type: 'bubble',
    data: { datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Character Longevity' },
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function(context) {
              const dataPoint = context.raw;
              const statusLabels = {
                'n': 'Survived',
                'y': 'Died',
                'lost': 'Lost',
                '?': 'Left/Unknown'
              };
              return [
                `${dataPoint.name}`,
                `Days active: ${dataPoint.x}`,
                `Levels gained: ${dataPoint.y}`,
                `Final level: ${dataPoint.finalLevel}`,
                `Class: ${dataPoint.class}`,
                `Status: ${statusLabels[dataPoint.status] || dataPoint.status}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Days Active (Real-time)' },
          beginAtZero: true
        },
        y: {
          title: { display: true, text: 'Levels Gained' },
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// Render party timeline (Gantt-style showing character activity)
function renderPartyTimeline(pathNumber, thisCampaignData, thisCharacterData) {
  const ctx = document.getElementById(`party-timeline-${pathNumber}`);
  if (!ctx) return;

  // Get campaign date range
  const allDates = thisCampaignData.map(c => c.start).filter(d => d);
  if (allDates.length === 0) {
    console.log('No campaign dates available for timeline');
    return;
  }

  const campaignStart = new Date(Math.min(...allDates));
  const campaignEnd = new Date(Math.max(...thisCampaignData.map(c => c.end).filter(d => d)));
  const totalCampaignDays = daysBetween(campaignStart, campaignEnd);

  // Filter and prepare character data
  const validChars = thisCharacterData
    .filter(char => char.start && char.end)
    .sort((a, b) => {
      // Sort by player category first, then by start date
      if (a.category !== b.category) {
        return (a.category || 'ZZZ').localeCompare(b.category || 'ZZZ');
      }
      return a.start - b.start;
    });

  if (validChars.length === 0) {
    console.log('No valid character dates for timeline');
    return;
  }

  console.log(`Party Timeline: ${validChars.length} valid characters`);

  // Debug: Check unique categories
  const uniqueCategories = [...new Set(validChars.map(c => c.category))];
  console.log('Unique player categories:', uniqueCategories);

  // Build single dataset with all characters as stacked bars
  const barData = [];
  const backgroundColors = [];
  const borderColors = [];
  const borderWidths = [];

  validChars.forEach((char, idx) => {
    const startDays = daysBetween(campaignStart, char.start);
    const endDays = daysBetween(campaignStart, char.end);
    const playerCategory = char.category || 'Unknown';
    const baseColor = getPlayerColor(playerCategory);

    // Debug first 3 characters
    if (idx < 3) {
      console.log(`Character ${idx}: ${char.shortname || char.character}`);
      console.log(`  Category: "${playerCategory}"`);
      console.log(`  Color: ${baseColor}`);
      console.log(`  Died: ${char.died}`);
    }

    // Add bar data
    barData.push({
      y: char.shortname || char.character,
      x: [startDays, endDays],
      charData: char
    });

    // Add colors - always use player color
    backgroundColors.push(baseColor.replace('0.7', '0.85'));
    borderColors.push(baseColor.replace('0.7', '1'));
    borderWidths.push(3);
  });

  console.log('Background colors sample:', backgroundColors.slice(0, 3));
  console.log('Border colors sample:', borderColors.slice(0, 3));

  // Create legend items from unique categories
  const categoryMap = new Map();
  validChars.forEach(char => {
    const cat = char.category || 'Unknown';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, getPlayerColor(cat));
    }
  });

  const legendItems = Array.from(categoryMap.entries()).map(([category, color]) => ({
    text: category,
    fillStyle: color.replace('0.7', '0.85'),
    strokeStyle: color.replace('0.7', '1'),
    lineWidth: 3
  }));

  // Create chart
  const chartKey = `party-timeline-${pathNumber}`;
  if (campaignChartInstances[chartKey]) {
    campaignChartInstances[chartKey].destroy();
  }

  campaignChartInstances[chartKey] = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Character Activity',
        data: barData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: borderWidths,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { left: 5, right: 15, top: 10, bottom: 10 }
      },
      plugins: {
        title: {
          display: true,
          text: 'Party Timeline - Character Activity Periods',
          font: { size: 16, weight: 'bold' },
          padding: { top: 5, bottom: 15 }
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            generateLabels: function() {
              return legendItems;
            },
            font: { size: 11 },
            padding: 10,
            boxWidth: 15,
            boxHeight: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 12 },
          bodySpacing: 4,
          callbacks: {
            title: function(context) {
              return context[0].raw.charData.shortname || context[0].raw.charData.character;
            },
            label: function(context) {
              const char = context.raw.charData;
              const duration = daysBetween(char.start, char.end);
              const className = char.class ?
                char.class.charAt(0).toUpperCase() + char.class.slice(1).toLowerCase() :
                'Unknown';

              const lines = [
                `⚔️ ${className} ${char.startlevel} → ${char.maxlvl - char.maxlvl2}`,
                `🎭 ${char.category || 'Unknown'}`,
                `📅 ${Math.round(duration)} days active`
              ];

              if (char.died) {
                lines.push(`💀 ${char.killer || 'Killed in action'}`);
              } else {
                lines.push('✅ Survived');
              }

              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: '📅 Campaign Timeline (Days)',
            font: { size: 12, weight: 'bold' }
          },
          min: 0,
          max: Math.max(totalCampaignDays, 100),
          grid: {
            color: 'rgba(156, 163, 175, 0.1)',
            lineWidth: 1
          },
          ticks: {
            font: { size: 10 }
          }
        },
        y: {
          type: 'category',
          title: {
            display: true,
            text: '⚔️ Characters',
            font: { size: 12, weight: 'bold' }
          },
          grid: {
            display: false
          },
          ticks: {
            font: { size: 10 },
            autoSkip: false,
            callback: function(value) {
              // Find character to get death status
              const char = validChars.find(c =>
                (c.shortname || c.character) === value
              );

              if (char) {
                const icon = char.died ? '💀' : '✓';
                return `${icon} ${value}`;
              }
              return value;
            }
          }
        }
      }
    }
  });
}

// Render killer breakdown (compact card display)
function renderKillerBreakdown(pathNumber, thisCharacterData) {
  const container = document.getElementById(`killer-breakdown-${pathNumber}`);
  if (!container) return;

  // Count deaths by killer
  const killerCounts = {};
  thisCharacterData.forEach(char => {
    if (char.died && char.killer) {
      const killer = char.killer.trim();
      if (killer) {
        killerCounts[killer] = (killerCounts[killer] || 0) + 1;
      }
    }
  });

  // Sort by count descending and take top 5
  const killerEntries = Object.entries(killerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (killerEntries.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size: 0.9rem; margin: 0.5rem 0;">No deaths recorded for this campaign.</p>';
    return;
  }

  // Create compact card display
  const html = killerEntries.map((entry, index) => {
    const [killer, count] = entry;
    const pluralDeaths = count > 1 ? 'deaths' : 'death';
    const medal = index === 0 ? '🏆' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : '💀'));

    return `
      <div class="threat-card">
        <div class="threat-rank">${medal}</div>
        <div class="threat-details">
          <div class="threat-name">${killer}</div>
          <div class="threat-count">${count} ${pluralDeaths}</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

// Render level duration analysis heatmap
function renderLevelDuration(pathNumber, thisCharacterData) {
  const container = document.getElementById(`level-duration-${pathNumber}`);
  if (!container) return;

  // Calculate time spent at each level across all characters
  const levelDurations = {};
  const levelCounts = {};

  thisCharacterData.forEach(char => {
    if (char.start && char.end && char.startlevel > 0 && char.maxlvl > 0) {
      const totalDays = daysBetween(char.start, char.end);
      const startLvl = char.startlevel;
      const endLvl = char.maxlvl - char.maxlvl2;
      const levelsGained = endLvl - startLvl;

      if (levelsGained > 0 && totalDays > 0) {
        // Distribute days evenly across levels (simplified model)
        const daysPerLevel = totalDays / levelsGained;

        for (let lvl = startLvl; lvl < endLvl; lvl++) {
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

  // Calculate averages
  const levelData = Object.keys(levelDurations).map(lvl => ({
    level: parseInt(lvl),
    avgDays: Math.round(levelDurations[lvl] / levelCounts[lvl]),
    count: levelCounts[lvl]
  })).sort((a, b) => a.level - b.level);

  if (levelData.length === 0) {
    container.innerHTML = '<p class="text-muted">No level progression data available</p>';
    return;
  }

  // Find min/max for color scaling
  const maxDays = Math.max(...levelData.map(d => d.avgDays));
  const minDays = Math.min(...levelData.map(d => d.avgDays));

  // Helper to get color intensity
  const getColorIntensity = (days) => {
    const normalized = (days - minDays) / (maxDays - minDays || 1);
    const hue = 210; // Blue
    const lightness = 85 - (normalized * 30); // 85% to 55%
    return `hsl(${hue}, 80%, ${lightness}%)`;
  };

  // Render level cells
  container.innerHTML = levelData.map(d => `
    <div class="level-cell" style="background-color: ${getColorIntensity(d.avgDays)};" title="Level ${d.level}: ${d.avgDays} avg days (${d.count} character${d.count > 1 ? 's' : ''})">
      <div class="level-number">L${d.level}</div>
      <div class="level-days">${d.avgDays}d</div>
    </div>
  `).join('');
}

// Auto-initialize campaign stats on page load
document.addEventListener('DOMContentLoaded', function() {
  // Find all campaign stats sections on the page
  const statsSections = document.querySelectorAll('.campaign-stats-section[data-campaign-path]');

  statsSections.forEach(section => {
    const pathNumber = parseInt(section.dataset.campaignPath);
    if (!isNaN(pathNumber)) {
      console.log(`Auto-initializing campaign stats for path ${pathNumber}`);
      initCampaignStats(pathNumber);
    }
  });
});

