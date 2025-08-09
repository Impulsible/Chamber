const msg = document.getElementById("visit-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
  msg.textContent = "Welcome! Let us know if you have any questions.";
} else {
  const diffDays = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    msg.textContent = "Back so soon! Awesome!";
  } else if (diffDays === 1) {
    msg.textContent = "You last visited 1 day ago.";
  } else {
    msg.textContent = `You last visited ${diffDays} days ago.`;
  }
}

localStorage.setItem("lastVisit", now);
