// Get buttons for toggling views
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

// Get the container holding the member cards
const membersContainer = document.querySelector('#members');
 // container for categories

// Load and display members from JSON
function loadMembers() {
  fetch('chamber/members.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      displayMembersByCategory(data);
      setGridView(); // default to grid view on load
    })
    .catch(err => console.error('Failed to load members:', err));
}

// Display members grouped by category
function displayMembersByCategory(groupedData) {
  container.innerHTML = '';  // Clear existing content

  for (const category in groupedData) {
    // Create category section
    const categorySection = document.createElement('div');
    categorySection.classList.add('category-section');

    // Category title
    const title = document.createElement('h2');
    title.textContent = category;
    categorySection.appendChild(title);

    // Cards container (will switch between grid/list styles)
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('directory-category-row');
    categorySection.appendChild(cardContainer);

    // Add cards
    groupedData[category].forEach(member => {
      const card = document.createElement('section');
      card.classList.add('member-card');

      const {
        name = 'No Name Provided',
        image = 'default.jpg',
        address = 'No address available',
        phone = 'No phone number',
        membership_level = 'Not specified',
        description = '',
        website = '#'
      } = member;

      card.innerHTML = `
        <img src="images/${image}" alt="Logo of ${name}" loading="lazy"
          onerror="this.onerror=null; this.src='images/download.png';">
        <h3>${name}</h3>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Membership:</strong> ${membership_level}</p>
        <p>${description}</p>
        <a href="${website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
      `;

      cardContainer.appendChild(card);
    });

    container.appendChild(categorySection);
  }
}

// Set Grid View: 3 cards per row horizontally
function setGridView() {
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');

  // For each category, set grid class and remove list grouping
  document.querySelectorAll('.directory-category-row').forEach(row => {
    row.classList.add('grid-view');
    row.classList.remove('list-view');

    // Remove any existing grouping divs inside row if exist
    // (This depends on your actual structure. Here we assume no groups inside grid.)
    // So no special grouping logic needed in grid view.
  });
}

// Set List View: groups of 3 cards stacked vertically per category
function setListView() {
  gridBtn.classList.remove('active');
  listBtn.classList.add('active');

  // For each category, rearrange cards in groups of 3 vertically
  document.querySelectorAll('.directory-category-row').forEach(row => {
    row.classList.remove('grid-view');
    row.classList.add('list-view');

    // Group cards in sets of 3 vertically

    // First, get all cards
    const cards = Array.from(row.querySelectorAll('.member-card'));
    row.innerHTML = ''; // Clear current cards

    // Create groups of 3 cards stacked vertically
    for (let i = 0; i < cards.length; i += 3) {
      const groupDiv = document.createElement('div');
      groupDiv.classList.add('card-group');  // style this to stack vertically

      cards.slice(i, i + 3).forEach(card => {
        groupDiv.appendChild(card);
      });

      row.appendChild(groupDiv);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');
  // now safe to use
});






// Dynamic year and last modified date
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;


