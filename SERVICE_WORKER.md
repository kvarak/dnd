# Service Worker Implementation for dnd.rigo.nu

This implementation provides offline capability and performance caching optimized for D&D tabletop gaming scenarios.

## Features Implemented

### 🚀 **Service Worker Caching** (`sw.js`)
- **Cache-First Strategy** for static assets (CSS, JS, images, fonts)
- **Network-First Strategy** for HTML pages (get updates, fallback to cache)
- **Essential D&D pages** pre-cached for offline access
- **756KB vendor assets** cached locally (Bootstrap, jQuery, Font Awesome, Google Fonts)
- **Smart cache management** with automatic old cache cleanup

### 📱 **Progressive Web App** (`manifest.json`)
- **Installable** on mobile devices and desktops
- **App shortcuts** for quick access to Character Creation, Combat Rules, and Spellcasting
- **Themed UI** with D&D brown color scheme
- **Standalone display** removes browser UI when installed

### 🎯 **Offline Experience** (`offline.html`)
- **Custom offline page** with D&D-themed design
- **Cached resource links** for available content
- **Offline gaming tools**: dice roller, HP tracker, initiative timer
- **Network status** indicator with reconnection prompts

### ⚡ **Performance Enhancements**
- **Zero external requests** after first load (all dependencies self-hosted)
- **Instant loading** for repeat visits via cache-first strategy
- **Background updates** with user-friendly update notifications
- **Offline capability** for essential D&D reference materials

## Caching Strategy Details

### Core Resources (Pre-cached)
```
/dnd/ (home page)
/dnd/offline.html
/dnd/assets/css/style.min.css (minified)
/dnd/assets/vendor/bootstrap/bootstrap.min.css
/dnd/assets/vendor/jquery/jquery-3.7.1.min.js
/dnd/assets/vendor/fontawesome/fontawesome-all.min.css
/dnd/assets/js/search.min.js (minified)
Character Creation Guide
Ability Scores Reference
Combat Mechanics
Spellcasting Rules
Conditions Reference
```

### Runtime Caching
- **Static Assets**: Images, fonts, CSS, JS files cached indefinitely
- **D&D Content**: Collection pages (_Classes, _Folk, _Rules*) cached on first visit
- **HTML Pages**: Network-first with cache fallback for offline access

## Browser Support

✅ **Modern browsers** with Service Worker support:
- Chrome 45+
- Firefox 44+
- Safari 10+
- Edge 17+

📱 **PWA Installation** support:
- Android Chrome (Add to Home Screen)
- iOS Safari 15.4+ (Add to Home Screen)
- Desktop Chrome/Edge (Install App)
- Desktop Safari 15.4+ (Dock)

## Performance Benefits

**Before Service Worker:**
- 5+ external CDN requests per page
- Network dependency for all assets
- No offline capability

**After Service Worker:**
- 0 external requests after initial cache
- Instant loading from cache (cache-first)
- Full offline D&D reference capability
- Background updates without interruption

## Gaming-Optimized Features

### 🎲 **Tabletop-Ready**
- **Offline-first design** for unreliable gaming venue WiFi
- **Essential rules cached** for quick mid-game reference
- **Mobile-friendly** for tablet/phone use at gaming tables

### 🔄 **Smart Updates**
- **Background sync** updates cache when online
- **User-controlled updates** with notification prompts
- **Version management** prevents breaking changes mid-session

### ⚡ **Performance**
- **Sub-second loading** for cached pages
- **Reduced data usage** perfect for mobile hotspots
- **Battery efficient** fewer network requests

## Future Enhancements

### Planned Features
- [ ] Convert SVG icons to optimized PWA icons (192px, 512px)
- [ ] Add push notifications for campaign updates
- [ ] Background sync for form data (character sheets)
- [ ] Advanced offline tools (spell slot tracker, condition tracker)
- [ ] Cross-device data sync via localStorage/IndexedDB

### Icon Assets Needed
- `pwa-icon-192.png` - App icon (192x192)
- `pwa-icon-512.png` - App icon (512x512)
- `shortcut-*.png` - Shortcut icons (96x96) for app shortcuts
- `screenshot-*.png` - App store screenshots

## Usage Statistics

Current cache sizes:
- **Core assets**: ~756KB (vendor dependencies)
- **Essential pages**: ~50KB (pre-cached D&D content)
- **Runtime cache**: Variable based on user browsing

**Total offline capability**: Full site functionality with 800KB+ cached content

---

*This service worker implementation follows the "reduce waste" principle by eliminating redundant network requests and the "reduce complexity" principle by providing seamless offline functionality without user intervention.*