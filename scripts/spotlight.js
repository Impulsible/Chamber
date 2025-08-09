const spotlightContainer = document.querySelector('.spotlight-container');

const members = [
  {
    companyName: "Alpha Tech Solutions",
    logo: "images/tech.jpg",  // updated path
    phone: "555-1234",
    address: "123 Tech St, Crescent City",
    website: "https://alphatech.ws",
    membershipLevel: "Gold"
  },
  {
    companyName: "Beta Builders",
    logo: "images/betta_builder.jpg",  // updated path
    phone: "555-5678",
    address: "456 Build Rd, Crescent City",
    website: "https://bettabuilder.ng",
    membershipLevel: "Silver"
  },
  {
    companyName: "Gamma Marketing",
    logo: "images/gamma.webp",  // updated path
    phone: "555-9012",
    address: "789 Market Ave, Crescent City",
    website: "https://gammamarketing.com",
    membershipLevel: "Gold"
  },
];

// Filter only Gold and Silver members
const goldSilverMembers = members.filter(m => m.membershipLevel === "Gold" || m.membershipLevel === "Silver");

// Randomly shuffle and pick 6 members max
function getRandomSpotlights(arr, num = 6) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(num, arr.length));
}

function displaySpotlights() {
  const spotlights = getRandomSpotlights(goldSilverMembers, 6);

  spotlightContainer.innerHTML = '';

  spotlights.forEach(member => {
    const card = document.createElement('article');
    card.className = 'spotlight-card';

    card.innerHTML = `
      <img src="${member.logo}" alt="${member.companyName} logo">
      <h3>${member.companyName}</h3>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
      <p><strong>Membership Level:</strong> ${member.membershipLevel}</p>
    `;

    spotlightContainer.appendChild(card);
  });
}

displaySpotlights();
