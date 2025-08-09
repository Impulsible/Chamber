document.addEventListener('DOMContentLoaded', () => {
  /* =======================
     HELPERS
  ========================== */
  const norm = str => (str || '').toLowerCase().trim();
  const debounce = (fn, delay = 120) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  /* =======================
     DISCOVER SECTION
  ========================== */
  const discoverContainer = document.getElementById('discoverGrid');
  if (discoverContainer) {
    fetch('discover.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        discoverContainer.innerHTML = '';
        const areaClasses = ['card--a', 'card--b', 'card--c'];

        data.forEach((item, i) => {
          const card = document.createElement('article');
          card.className = `discover-card ${areaClasses[i % 3]}`;
          card.innerHTML = `
            <img class="discover-card__img" src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="discover-card__body">
              <h3 class="discover-card__title">${item.title}</h3>
              <p class="discover-card__address">${item.address}</p>
              <p class="discover-card__desc">${item.description}</p>
              <button type="button" class="btn-primary">Learn More</button>
            </div>
          `;
          discoverContainer.appendChild(card);
        });
      })
      .catch(err => {
        console.error('Discover fetch error:', err);
        discoverContainer.innerHTML = `<p>Unable to load attractions.</p>`;
      });
  }

  /* =======================
     LAST VISIT MESSAGE
  ========================== */
  const visitMsgEl = document.getElementById('visit-message');
  if (visitMsgEl) {
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    visitMsgEl.className = '';

    if (!lastVisit) {
      visitMsgEl.textContent = "👋 Welcome! Let us know if you have any questions.";
      visitMsgEl.classList.add('welcome');
    } else {
      const daysPassed = Math.floor((now - Number(lastVisit)) / (24 * 60 * 60 * 1000));
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

  /* =======================
     HAMBURGER MENU
  ========================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const primaryNav = document.getElementById('primaryNav');
  const navBackdrop = document.getElementById('navBackdrop');

  if (hamburgerBtn && primaryNav) {
    const openNav = () => {
      primaryNav.classList.add('active');
      document.body.classList.add('nav-open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      navBackdrop?.classList.add('show');
    };
    const closeNav = () => {
      primaryNav.classList.remove('active');
      document.body.classList.remove('nav-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navBackdrop?.classList.remove('show');
    };

    hamburgerBtn.addEventListener('click', () =>
      primaryNav.classList.contains('active') ? closeNav() : openNav()
    );
    navBackdrop?.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => e.key === 'Escape' && closeNav());
    window.addEventListener('resize', () => window.innerWidth > 768 && closeNav());
  }

  /* =======================
     DIRECTORY FILTERS
  ========================== */
  const directory = document.getElementById('directoryContent');
  const searchInput = document.getElementById('search-input');
  const tierSelect = document.getElementById('filter-tier');
  const catSelect = document.getElementById('filter-category');
  const announcer = document.createElement('div');
  announcer.id = 'results-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'sr-only';
  directory?.before(announcer);

  const applyFilters = () => {
    if (!directory) return;
    const q = norm(searchInput?.value);
    const tier = norm(tierSelect?.value);
    const cat = norm(catSelect?.value);
    let total = 0;

    directory.querySelectorAll('.directory-category-title').forEach(h => {
      const row = h.nextElementSibling;
      if (!row || !row.classList.contains('directory-category-row')) return;
      let visible = 0;

      row.querySelectorAll('.business-card').forEach(card => {
        const match =
          (!q || norm(card.innerText).includes(q)) &&
          (!tier || norm(card.dataset.tier) === tier) &&
          (!cat || norm(card.dataset.category) === cat);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      h.style.display = row.style.display = visible ? '' : 'none';
      total += visible;
    });

    announcer.textContent = `${total} result${total !== 1 ? 's' : ''} found.`;
    document.getElementById('no-results')?.remove();
    if (total === 0) {
      const empty = document.createElement('p');
      empty.id = 'no-results';
      empty.textContent = 'No results match your filters.';
      directory.after(empty);
    }
  };

  searchInput?.addEventListener('input', debounce(applyFilters));
  tierSelect?.addEventListener('change', applyFilters);
  catSelect?.addEventListener('change', applyFilters);
  applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("discoverGrid");

  fetch("discover.json")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      grid.innerHTML = ""; // Clear fallback content

      data.forEach(attraction => {
        const card = document.createElement("article");
        card.classList.add("discover-card");

        card.innerHTML = `
          <img src="${attraction.image}" alt="${attraction.title}" loading="lazy">
          <h3>${attraction.title}</h3>
          <p><strong>Address:</strong> ${attraction.address}</p>
          <p>${attraction.description}</p>
        `;

        grid.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading attractions:", err);
      grid.innerHTML = "<p>Unable to load attractions at this time.</p>";
    });
});

function makeCard(item) {
  const article = document.createElement("article");
  article.className = "spotlight"; // horizontal card

  article.innerHTML = `
    <img class="spotlight__media" src="${item.image}" alt="${item.title}" loading="lazy">
    <div class="spotlight__body">
      <div>
        <div class="spotlight__tier">${item.address}</div>
        <h3 class="spotlight__name">${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <a href="#" class="btn-primary spotlight__cta" aria-label="Learn more about ${item.title}">Learn More</a>
    </div>
  `;
  return article;
}
