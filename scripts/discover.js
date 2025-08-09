document.addEventListener('DOMContentLoaded', () => {
  // Discover section
  const container = document.querySelector('.discover-container');
  const visitMsgEl = document.getElementById('visit-message');

  if (!container || !visitMsgEl) {
    console.error('Required elements not found in the DOM.');
    return;
  }

  // Fetch data from discover.json
  fetch('https://impulsible.github.io/wdd231/chamber/discover.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      container.innerHTML = ''; // clear container

      data.forEach((item, index) => {
        const card = document.createElement('article');
        card.classList.add('card', `card${index + 1}`);

        card.innerHTML = `
          <h2>${item.title}</h2>
          <figure>
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </figure>
          <address>${item.address}</address>
          <p>${item.description}</p>
          <button type="button">Learn More</button>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      container.textContent = "Failed to load discover items. Check console.";
      console.error('Fetch error:', error);
    });

  // Visit message logic
  function displayLastVisitMessage() {
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');

    visitMsgEl.className = '';

    if (!lastVisit) {
      visitMsgEl.textContent = "👋 Welcome! Let us know if you have any questions.";
      visitMsgEl.classList.add('welcome');
    } else {
      const msPerDay = 24 * 60 * 60 * 1000;
      const daysPassed = Math.floor((now - Number(lastVisit)) / msPerDay);

      if (daysPassed === 0) {
        visitMsgEl.textContent = "✨ Back so soon? Awesome!";
        visitMsgEl.classList.add('soon');
      } else if (daysPassed === 1) {
        visitMsgEl.textContent = "📅 You last visited 1 day ago.";
        visitMsgEl.classList.add('returning');
      } else {
        visitMsgEl.textContent = `📆 You last visited ${daysPassed} days ago.`;
        visitMsgEl.classList.add('returning');
      }
    }

    localStorage.setItem('lastVisit', now);
  }

  displayLastVisitMessage();

  // Hamburger menu toggle
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('primaryNav');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', isOpen);
  });

  // Close menu when a link is clicked (nicer UX)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });
});

fetch('https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=London')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Make sure this logs correctly
    // Insert data into the DOM here
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });

  // Dynamic header height -> CSS var
(function(){
  const header = document.querySelector('.site-header');
  const setHeaderVar = () => {
    if (!header) return;
    const h = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };
  setHeaderVar();
  window.addEventListener('resize', setHeaderVar);
  // re-run after fonts load (header height can change)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setHeaderVar);
  }
})();

const hamburgerBtn = document.getElementById('hamburgerBtn');
const siteNav = document.querySelector('.site-nav');

hamburgerBtn.addEventListener('click', () => {
  siteNav.classList.toggle('active');
  document.body.classList.toggle('nav-open');

  // Update aria-expanded for accessibility
  const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', !expanded);
});

// ===== Universal Hamburger & Hero Adjustment =====
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("hamburgerBtn");
  const siteNav = document.querySelector(".site-nav");

  // Set CSS variable for header height
  const setHeaderHeight = () => {
    if (header) {
      document.documentElement.style.setProperty(
        "--header-h",
        `${header.offsetHeight}px`
      );
    }
  };
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  // Toggle mobile nav
  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav?.classList.toggle("active");
    document.body.classList.toggle("nav-open");
  });

  // Close nav when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (
      siteNav?.classList.contains("active") &&
      !header.contains(e.target)
    ) {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("active");
      document.body.classList.remove("nav-open");
    }
  });
});
