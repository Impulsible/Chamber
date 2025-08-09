document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.discover-container');
  const visitMsgEl = document.getElementById('visit-message');

  if (!container || !visitMsgEl) {
    console.error('Required elements not found in the DOM.');
    return;
  }

  // ✅ Use relative path so it works on any device or environment
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

  // Visit message code
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
});
  document.querySelector('.hamburger')?.addEventListener('click',()=>document.getElementById('primaryNav')?.classList.toggle('open'));
document.addEventListener('DOMContentLoaded', () => {
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
