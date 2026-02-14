/**
 * Dark Mode Toggle for D&D Varlyn Site
 *
 * Following simplification principle:
 * - Reduce complexity: Single source of truth (localStorage + class toggle)
 * - Separation of concerns: Dark mode logic independent of other scripts
 * - Reduce waste: No external dependencies, vanilla JavaScript
 */

(function() {
  'use strict';

  // Constants
  const DARK_MODE_CLASS = 'dark-mode';
  const STORAGE_KEY = 'dnd-dark-mode';
  const ICON_MOON = '🌙';
  const ICON_SUN = '☀️';

  /**
   * Get user's dark mode preference
   * Priority: localStorage > prefers-color-scheme
   */
  function getDarkModePreference() {
    const stored = localStorage.getItem(STORAGE_KEY);

    // If user has explicitly set preference, use it
    if (stored !== null) {
      return stored === 'true';
    }

    // Otherwise, check system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Default to light mode
    return false;
  }

  /**
   * Apply dark mode to the page
   */
  function applyDarkMode(isDark) {
    // Use documentElement (html tag) instead of body - available immediately
    const root = document.documentElement;
    const icon = document.getElementById('dark-mode-icon');

    console.log('[DARK-MODE.JS applyDarkMode] Called with isDark:', isDark, '| Current classes:', root.className);

    if (isDark) {
      root.classList.add(DARK_MODE_CLASS);
      if (icon) icon.textContent = ICON_SUN;
      console.log('[DARK-MODE.JS applyDarkMode] Added dark-mode class');
    } else {
      root.classList.remove(DARK_MODE_CLASS);
      if (icon) icon.textContent = ICON_MOON;
      console.log('[DARK-MODE.JS applyDarkMode] Removed dark-mode class');
    }

    // Store preference
    localStorage.setItem(STORAGE_KEY, isDark.toString());
    console.log('[DARK-MODE.JS applyDarkMode] Stored to localStorage:', isDark.toString());
  }

  /**
   * Toggle dark mode
   */
  function toggleDarkMode() {
    const isDark = !document.documentElement.classList.contains(DARK_MODE_CLASS);
    console.log('[DARK-MODE.JS toggleDarkMode] Toggle clicked! Current:', !isDark, '→ New:', isDark);
    applyDarkMode(isDark);

    // Log for debugging (D&D theme)
    console.log(`🎲 ${isDark ? 'Entered the shadows' : 'Stepped into the light'}...`);
  }

  /**
   * Initialize dark mode on page load
   */
  function init() {
    console.log('[DARK-MODE.JS init] Starting initialization');
    console.log('[DARK-MODE.JS init] <html> classes:', document.documentElement.className);
    console.log('[DARK-MODE.JS init] localStorage dnd-dark-mode:', localStorage.getItem(STORAGE_KEY));

    // Don't re-apply if already set by inline script - just sync icon when ready
    document.addEventListener('DOMContentLoaded', function() {
      console.log('[DARK-MODE.JS DOMContentLoaded] Event fired');

      // Sync icon with current state
      const isDark = document.documentElement.classList.contains(DARK_MODE_CLASS);
      console.log('[DARK-MODE.JS DOMContentLoaded] Current state - isDark:', isDark);

      const icon = document.getElementById('dark-mode-icon');
      if (icon) {
        icon.textContent = isDark ? ICON_SUN : ICON_MOON;
        console.log('[DARK-MODE.JS DOMContentLoaded] Updated icon to:', icon.textContent);
      }

      // Set up toggle button
      const toggle = document.getElementById('dark-mode-toggle');
      if (toggle) {
        toggle.addEventListener('click', toggleDarkMode);
        console.log('[DARK-MODE.JS DOMContentLoaded] Toggle button listener attached');

        // Add keyboard accessibility
        toggle.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDarkMode();
          }
        });
      }

      // Listen for system theme changes
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Modern browsers
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set preference
            if (localStorage.getItem(STORAGE_KEY) === null) {
              applyDarkMode(e.matches);
            }
          });
        }
        // Older browsers
        else if (mediaQuery.addListener) {
          mediaQuery.addListener(function(e) {
            if (localStorage.getItem(STORAGE_KEY) === null) {
              applyDarkMode(e.matches);
            }
          });
        }
      }
    });
  }

  // Initialize - inline script in head.html handles initial class application
  init();
})();