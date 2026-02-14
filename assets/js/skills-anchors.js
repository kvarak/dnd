// Add anchor IDs to skill details elements for search linking
// Following core principle: Reduce complexity (simple DOM manipulation)

document.addEventListener('DOMContentLoaded', function() {
  // Add IDs to all skill details elements
  const summaries = document.querySelectorAll('details > summary');

  summaries.forEach(summary => {
    const skillName = summary.textContent.trim().replace(/\s*\(.*?\)\s*/g, '');
    const skillId = 'skill-' + skillName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Add ID to the details element so the anchor works
    summary.parentElement.id = skillId;
  });

  // If URL has an anchor, scroll to it (for direct links from search)
  if (window.location.hash) {
    setTimeout(function() {
      const target = document.getElementById(window.location.hash.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Open the details if closed
        if (target.tagName === 'DETAILS' && !target.open) {
          target.open = true;
        }
      }
    }, 100);
  }
});
