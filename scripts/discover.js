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

// ===== Directory live filter =====
(function () {
  const input = document.getElementById('search-input');
  const directory = document.getElementById('directoryContent');

  // Add a live region for result counts
  const announcer = document.createElement('div');
  announcer.id = 'results-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'sr-only';
  directory.before(announcer);

  // Helper: normalize text
  const norm = (str) => (str || '').toLowerCase().trim();

  // Debounce for smoother typing
  let t;
  const debounce = (fn, delay = 120) => (...args) => {
    clearTimeout(t); t = setTimeout(() => fn(...args), delay);
  };

  // Core filter
  const filterCards = () => {
    const q = norm(input.value);
    let totalVisible = 0;

    // Each category group = heading + row after it
    const headings = directory.querySelectorAll('.directory-category-title');

    headings.forEach((h) => {
      const row = h.nextElementSibling;
      if (!row || !row.classList.contains('directory-category-row')) return;

      // Filter cards inside this row
      let visibleInRow = 0;
      const cards = row.querySelectorAll('.business-card');

      cards.forEach((card) => {
        const text = norm(card.innerText);
        const hit = !q || text.includes(q);
        card.style.display = hit ? '' : 'none';
        if (hit) visibleInRow++;
      });

      // Show/hide whole category if empty
      const showRow = visibleInRow > 0;
      row.style.display = showRow ? '' : 'none';
      h.style.display = showRow ? '' : 'none';

      totalVisible += visibleInRow;
    });

    // Announce & show "no results" fallback
    announcer.textContent = `${totalVisible} result${totalVisible === 1 ? '' : 's'} found.`;
    let empty = document.getElementById('no-results');
    if (!empty) {
      empty = document.createElement('p');
      empty.id = 'no-results';
      empty.className = 'no-results';
      empty.textContent = 'No results match your search.';
      directory.after(empty);
    }
    empty.style.display = totalVisible === 0 ? 'block' : 'none';
  };

  // Bind
  input.addEventListener('input', debounce(filterCards));
  // Run once to set initial state (in case of prefilled value / back nav)
  filterCards();
})();


// =============== View toggle ===============
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const rows = document.querySelectorAll('.directory-category-row');

function setView(view){
  rows.forEach(row => {
    row.classList.toggle('grid-view', view === 'grid');
    row.classList.toggle('list-view', view === 'list');
  });
  gridBtn.setAttribute('aria-pressed', view === 'grid');
  listBtn.setAttribute('aria-pressed', view === 'list');
}
gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));
setView('grid'); // default

// =============== Live search + filters ===============
const input = document.getElementById('search-input');
const tierSel = document.getElementById('filter-tier');
const catSel  = document.getElementById('filter-category');
const directory = document.getElementById('directoryContent');

// Live region for counts
let announcer = document.getElementById('results-announcer');
if (!announcer){
  announcer = document.createElement('div');
  announcer.id = 'results-announcer';
  announcer.setAttribute('aria-live','polite');
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  directory.before(announcer);
}

const norm = s => (s || '').toLowerCase().trim();
let timer;
const debounce = (fn, d=120) => (...a)=>{ clearTimeout(timer); timer = setTimeout(()=>fn(...a), d); };

function applyFilters(){
  const q = norm(input?.value);
  const tier = norm(tierSel?.value);
  const cat  = norm(catSel?.value);

  const headings = directory.querySelectorAll('.directory-category-title');
  let total = 0;

  headings.forEach(h => {
    const row = h.nextElementSibling;
    if (!row || !row.classList.contains('directory-category-row')) return;

    let visibleInRow = 0;
    row.querySelectorAll('.business-card').forEach(card => {
      const t = norm(card.dataset.tier);
      const c = norm(card.dataset.category);
      const text = norm(card.innerText);

      const hitSearch = !q || text.includes(q);
      const hitTier   = !tier || t === tier;
      const hitCat    = !cat  || c === cat;

      const show = hitSearch && hitTier && hitCat;
      card.style.display = show ? '' : 'none';
      if (show) visibleInRow++;
    });

    // Show/hide whole category if empty
    const showRow = visibleInRow > 0;
    row.style.display = showRow ? '' : 'none';
    h.style.display = showRow ? '' : 'none';

    total += visibleInRow;
  });

  announcer.textContent = `${total} result${total===1?'':'s'} found.`;

  // No results message
  let empty = document.getElementById('no-results');
  if (!empty){
    empty = document.createElement('p');
    empty.id = 'no-results';
    empty.className = 'no-results';
    empty.textContent = 'No results match your filters.';
    directory.after(empty);
  }
  empty.style.display = total === 0 ? 'block' : 'none';
}

// Bind inputs
input?.addEventListener('input', debounce(applyFilters));
tierSel?.addEventListener('change', applyFilters);
catSel?.addEventListener('change', applyFilters);

// Initial
applyFilters();


  // Filter by tier; pass "", "gold", "silver", "bronze", or "platinum"
  function setTierFilter(tier) {
    const directory = document.getElementById('directoryContent');
    const headings = directory.querySelectorAll('.directory-category-title');

    headings.forEach(h => {
      const row = h.nextElementSibling;
      if (!row || !row.classList.contains('directory-category-row')) return;

      let visible = 0;
      row.querySelectorAll('.business-card').forEach(card => {
        const t = (card.dataset.tier || '').toLowerCase();
        const show = !tier || t === tier.toLowerCase();
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      // toggle whole category block if empty after filter
      h.style.display = visible ? '' : 'none';
      row.style.display = visible ? '' : 'none';
    });
  }

  // ✅ Filter to GOLD on load
  setTierFilter('gold');

  // Example: expose to console so you can switch quickly:
  // setTierFilter('');        // show all
  // setTierFilter('silver');  // show only Silver
  // setTierFilter('bronze');  // show only Bronze
  // setTierFilter('platinum');// show only Platinum

   const hamburgerBtn = document.getElementById('hamburgerBtn');
  const primaryNav   = document.getElementById('primaryNav');
  const backdrop     = document.getElementById('navBackdrop');

  function openNav(){
    primaryNav.classList.add('active');
    document.body.classList.add('nav-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('show');
  }
  function closeNav(){
    primaryNav.classList.remove('active');
    document.body.classList.remove('nav-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('show');
  }

  hamburgerBtn.addEventListener('click', () => {
    if (primaryNav.classList.contains('active')) closeNav();
    else openNav();
  });

  backdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('active')) closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });


  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".join-form");
    const levelSelect = document.getElementById("membershipLevel");
    const timestampField = document.getElementById("timestamp");

    // ===== Fees table highlight (keeps your behavior) =====
    const feeRows = document.querySelectorAll('.fee-table__table tbody tr');
    const highlightFeeRow = (value) => {
      feeRows.forEach(r => r.classList.toggle('is-active', r.dataset.level === value));
    };
    if (levelSelect) {
      highlightFeeRow(levelSelect.value);
      levelSelect.addEventListener('change', e => highlightFeeRow(e.target.value));
    }

    // ===== Form submit handling =====
    form.addEventListener("submit", (event) => {
      // native validation first
      if (!form.checkValidity()) {
        event.preventDefault();
        const firstInvalid = form.querySelector(":invalid");
        firstInvalid?.reportValidity();
        return;
      }

      event.preventDefault(); // prevent GET querystring; we’ll redirect manually

      // build clean object for storage
      const data = {
        "First Name": form.elements["firstName"]?.value?.trim() || "",
        "Last Name": form.elements["lastName"]?.value?.trim() || "",
        "Organizational Title": form.elements["orgTitle"]?.value?.trim() || "",
        "Email": form.elements["email"]?.value?.trim() || "",
        "Mobile": form.elements["mobile"]?.value?.trim() || "",
        "Business / Organization": form.elements["businessName"]?.value?.trim() || "",
        "Membership Level": (function mapLevel(val){
          switch(val){
            case "np": return "NP (Non Profit)";
            case "bronze": return "Bronze";
            case "silver": return "Silver";
            case "gold": return "Gold";
            default: return "";
          }
        })(form.elements["membershipLevel"]?.value || ""),
        "Description": form.elements["businessDesc"]?.value?.trim() || "",
        "Timestamp": new Date().toLocaleString()
      };

      // set hidden timestamp for completeness (keeps your original field populated)
      timestampField.value = new Date().toISOString();

      // persist to localStorage with the key thankyou.html expects
      try {
        localStorage.setItem("joinFormData", JSON.stringify(data));
      } catch (e) {
        console.warn("Could not save joinFormData:", e);
      }

      // redirect to thank you page
      window.location.href = "thankyou.html";
    });
  });


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("thankyouData");
  let storedData = null;

  try {
    storedData = JSON.parse(localStorage.getItem("joinFormData"));
  } catch (e) {
    console.warn("Could not parse stored joinFormData:", e);
  }

  if (storedData && typeof storedData === "object") {
    container.innerHTML = `
      <h2>Submission Summary</h2>
      <ul class="thankyou-list">
        ${Object.entries(storedData).map(([label, value]) =>
          `<li><strong>${label}:</strong> ${value}</li>`
        ).join("")}
      </ul>
    `;
  } else {
    container.innerHTML = `<p>No recent submission found.</p>`;
  }

  // Clear stored data so refresh doesn't repeat it
  localStorage.removeItem("joinFormData");
});
