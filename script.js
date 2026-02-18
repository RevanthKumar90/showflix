const url = "https://api.tvmaze.com/shows";

const moviesDiv = document.getElementById("movies");
const loading = document.getElementById("loading");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalTitle = document.getElementById("modalTitle");
const modalSummary = document.getElementById("modalSummary");
const closeModal = document.getElementById("closeModal");
const watchTrailer = document.getElementById("watchTrailer");

const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");

const topRated = document.getElementById("topRated");
const resetShows = document.getElementById("resetShows");

let allShows = [];

/* SEARCH TOGGLE */
searchBtn.addEventListener("click", () => {
  searchBar.classList.toggle("hidden");
});

/* MODAL FUNCTIONS */
function openModal(show) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");

  modalTitle.textContent = show.name;
  modalSummary.innerHTML = show.summary || "No summary available";

  watchTrailer.onclick = () => {
    const searchURL =
      `https://www.youtube.com/results?search_query=${show.name} trailer`;
    window.open(searchURL, "_blank");
  };

  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeModalFunc() {
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-95", "opacity-0");

  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }, 200);
}

closeModal.addEventListener("click", closeModalFunc);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFunc();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalFunc();
});

/* RENDER */
function renderShows(shows) {
  moviesDiv.innerHTML = "";

  shows.forEach(show => {
    const div = document.createElement("div");

    div.className =
      "bg-gray-800 p-4 rounded-xl transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer";

    div.innerHTML = `
      <img src="${show.image?.medium}" 
           class="rounded-xl w-full">
      <h2 class="mt-3 font-semibold text-lg">${show.name}</h2>
      <p class="text-sm text-gray-400">
        ⭐ ${show.rating?.average || "N/A"}
      </p>
      <p class="text-xs text-gray-500">
        ${show.language}
      </p>
    `;

    div.addEventListener("click", () => openModal(show));

    moviesDiv.appendChild(div);
  });
}

/* FETCH */
fetch(url)
  .then(res => res.json())
  .then(data => {
    loading?.remove();
    allShows = data.slice(0, 50);
    renderShows(allShows);
  });

/* SEARCH */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allShows.filter(show =>
    show.name.toLowerCase().includes(value)
  );
  renderShows(filtered);
});

/* TOP RATED */
topRated.addEventListener("click", (e) => {
  e.preventDefault();
  const filtered = allShows.filter(show =>
    show.rating?.average >= 8
  );
  renderShows(filtered);
});

/* RESET */
resetShows.addEventListener("click", (e) => {
  e.preventDefault();
  renderShows(allShows);
});
