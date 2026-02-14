# dnd.rigo.nu Technical Todo List

> Site audit completed: February 13, 2026
>
> Prioritized list of technical improvements for the dnd.rigo.nu Jekyll site

## 🚨 MUST FIX (Critical Issues)

### Security & Performance
- [x] **Update Bootstrap from 4.0.0 to 5.3.x** - ✅ Updated to Bootstrap 5.3.3 with integrity checks and proper data attributes
- [x] **Update jQuery from 3.2.1 to 3.7.x** - ✅ Updated to jQuery 3.7.1 with integrity hash
- [x] **Fix duplicate title tags in head.html** - ✅ Eliminated duplication (consolidate duplication)
- [x] **Add viewport meta tag** - ✅ Mobile responsiveness enabled
- [x] **Convert 16 files with http:// links to https://** - ✅ Security fixed (consolidate duplication: standardized protocol)

### Content Management
- [x] **Create proper Gemfile** - ✅ Created with GitHub Pages compatibility and dev dependencies
- [x] **Fix .gitignore** - ✅ Added Jekyll build artifacts, Ruby gems, and dev files
- [x] **Optimize large campaign images** - ✅ Reduced from 98MB to 49MB (~50% reduction, reduce waste)
- [x] **Remove test.html file** - ✅ 441KB waste eliminated (separation of concerns)

## ⚠️ SHOULD FIX (Important Improvements)

### SEO & Accessibility
- [x] **Add meta descriptions to all pages** - ✅ Template added to head.html with per-page override support
- [ ] **Add alt text to 183 images** - Critical accessibility issue (systematic approach needed)
- [ ] **Add Open Graph meta tags** - Improve social media sharing
- [ ] **Add Twitter Card meta tags** - Better social media appearance
- [x] **Create robots.txt** - ✅ Basic SEO crawler guidance (holistic view: prepare for search indexing)
- [x] **Generate sitemap.xml** - ✅ Added jekyll-sitemap plugin for automatic sitemap generation
- [ ] **Add structured data markup** - Rich snippets for D&D content

### Asset Optimization
- [x] **Compress campaign images** - ✅ Optimized 10 largest images, saved ~49MB
- [ ] **Implement responsive images** - Use srcset for different screen sizes
- [ ] **Add image lazy loading** - Improve initial page load times
- [x] **Fix files with spaces in names** - ✅ Standardized naming (reduce waste: shell-friendly filenames)
- [ ] **Optimize font loading** - Add font-display: swap to custom fonts

### Development Workflow
- [ ] **Add GitHub Actions for CI/CD** - Automated testing and deployment
- [ ] **Add link checker workflow** - Catch broken links automatically
- [ ] **Add image optimization workflow** - Automatically compress new images
- [x] **Create local development documentation** - ✅ Docker with bundle exec for proper dependency management

## 💡 COULD FIX (Nice to Have)

### Performance Enhancements
- [ ] **Update Font Awesome to v6** - Performance improvements and new icons
- [ ] **Self-host external dependencies** - Reduce external requests (Bootstrap, jQuery, fonts)
- [ ] **Add service worker for caching** - Offline capability and faster loads
- [ ] **Implement CSS/JS minification** - GitHub Pages doesn't auto-minify
- [ ] **Add WebP image format support** - Better compression than PNG/JPG

### User Experience
- [x] **Add search functionality** - ✅ Client-side search across 76 files (reduce complexity: vanilla JS, no dependencies)
- [ ] **Add dark mode toggle** - Improve accessibility and user preference
- [ ] **Add breadcrumb navigation** - Better navigation for deep content
- [ ] **Mobile navigation improvements** - Better UX for small screens
- [ ] **Add print stylesheets** - Better printing of rule pages

### Content Management
- [ ] **Create content templates** - Standardize new campaign/class creation
- [ ] **Add content validation** - Check frontmatter and required fields
- [ ] **Implement automated content indexing** - Auto-update character/scenery data
- [ ] **Add changelog generation** - Auto-update from git commits
- [ ] **Create style guide** - Consistent content formatting

### Advanced Features
- [ ] **Add comment system** - Community feedback on rules/classes
- [ ] **Implement tag system** - Better content categorization
- [ ] **Add related content suggestions** - Cross-link similar content
- [ ] **Create API endpoints** - Structured data access for other tools
- [ ] **Add full-text search** - Search within content, not just titles

## 📊 Current Site Status

**Content Statistics:**
- 76 content files across 9 collections
- 334 character entries with images
- 162 campaign images (98MB total assets)
- 9 documented campaigns

**Technical Debt:**
- ✅ ~~Using Bootstrap 4.0.0 (2018) vs current 5.3.x~~ - **FIXED: Updated to 5.3.3**
- ✅ ~~Using jQuery 3.2.1 vs current 3.7.x~~ - **FIXED: Updated to 3.7.1**
- ✅ ~~No dependency management (missing Gemfile)~~ - **FIXED: Added Gemfile + Makefile workflow**
**Performance Issues:**
- Largest image: 5.2MB (Golarion_inner_sea.png)
- Total asset size: 98MB
- No image optimization or lazy loading
- External CDN dependencies blocking render

---

## 🛠️ Quick Wins (Can be done immediately)

1. **Fix duplicate titles** - 2 minute fix in head.html
2. **Add viewport meta tag** - 1 minute fix for mobile responsiveness
3. **Remove test.html** - Clean up production environment
4. ✅ **~~Update .gitignore~~** - **COMPLETED: Added Jekyll exclusions**
5. ✅ **~~Create development workflow~~** - **COMPLETED: Added Docker-based Makefile with `make serve`**
6. **Create basic robots.txt** - Simple SEO improvement

## 📈 Estimated Impact

**High Impact:**
- Bootstrap/jQuery updates (security + performance)
- Image optimization (major performance boost)
- Mobile responsiveness fixes
- Alt text additions (accessibility compliance)

**Medium Impact:**
- SEO meta tags (search visibility)
- Asset organization (maintainability)
- Development workflow improvements

**Low Impact but Good Developer Experience:**
- Local development setup
- Automated testing
- Advanced features

---

*This audit focused on technical infrastructure rather than content. All 76 content files and 9 collections appear well-organized and comprehensive.*