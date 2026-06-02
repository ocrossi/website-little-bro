/* ── In your DOMContentLoaded block ── */
document.addEventListener('DOMContentLoaded', async () => {

  // Init translations first
  await translationService.init();

  // Re-render carousel quotes when language changes
  translationService.onChange((lang) => {
    if (window.carouselInstance) {
      window.carouselInstance.updateSlideQuotes();
    }
  });

  // ... rest of your main.js code
});

