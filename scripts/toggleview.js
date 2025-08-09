// toggleview.js
document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const primaryNav = document.getElementById('primaryNav');

  hamburgerBtn.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    
    // Toggle aria-expanded for accessibility
    const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true' || false;
    hamburgerBtn.setAttribute('aria-expanded', !expanded);
  });
});
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');

hamburgerBtn.addEventListener('click', () => {
  const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', !expanded);
  primaryNav.setAttribute('aria-expanded', !expanded);
});
