"use strict";

// ===== APP INITIALISERING =====
// Start app når DOM er loaded (hele HTML siden er færdig med at indlæse)
document.addEventListener("DOMContentLoaded", initApp);

// Global variabel til alle film - tilgængelig for alle funktioner
let allGames = [];

// #1: Initialize the app - sæt event listeners og hent data
function initApp() {
  getGames();

 
 document.querySelector("#search-input").addEventListener("input", søgSpil); 
 document.querySelector("#genre-select").addEventListener("change", filtrerKategori);
}


// #2: Fetch games from JSON file - asynkron funktion der henter data
async function getGames() {
  // Hent data fra URL - await venter på svar før vi går videre
  const response = await fetch("https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json");

  // Pars JSON til JS array og gem i global variabel, der er tilgængelig for alle funktioner
  allGames = await response.json();

  populateGenreDropdown(); // Udfyld dropdown med genrer fra data
  lavForslag();
  displayGames(allGames); // Vis alle games ved start
  
}
function søgSpil() {
 const søgTekst = document.querySelector("#search-input").value.toLowerCase();
  const resultat = allGames.filter(game => game.title.toLowerCase().includes(søgTekst));
  displayGames(resultat);
}
function filtrerKategori() {
  const valgtKategori = document.querySelector("#genre-select").value;

  if (valgtKategori === "all") {
    displayGames(allGames);
    return;
  }
  const resultat = allGames.filter(game => game.genre === valgtKategori);

  displayGames(resultat)

 
}
function lavForslag() {
  const liste = document.querySelector("#spilforslag");
  liste.innerHTML = "";

  for (const game of allGames) {
    liste.insertAdjacentHTML("beforeend", `<option value="${game.title}"></option>`);
  }
}

// ===== VISNING AF SPIL =====
// #3: Display all games - vis en liste af spil på siden
function displayGames(games) {
  const gameList = document.querySelector("#game-list"); // Find container til spil
  gameList.innerHTML = ""; // Ryd gammel liste (fjern alt HTML indhold)

  // Hvis ingen spil matcher filtrene, vis en besked til brugeren
  if (games.length === 0) {
    gameList.innerHTML = '<p class="no-results">Ingen spil matchede dine filtre 😢</p>';
    return; // Stop funktionen her - return betyder "stop her og gå ikke videre"
  }

  // Loop gennem alle spil og vis hver enkelt
  for (const game of games) {
    displayGame(game); // Kald displayGame for hvert spil
  }
}

// #4: Render a single game card and add event listeners - lav et spil kort
function displayGame(game) {
  const gameList = document.querySelector("#game-list"); // Find container til spil

  
  const minSpillere = game.players?.min || game.players;
  const maxSpillere = game.players?.max ? `-${game.players.max}` : "";
  const spillere = `${minSpillere}${maxSpillere}`;

  // 2. Byg HTML-strukturen så den matcher dit billede
  const gameHTML = /*html*/ `
    <article class="game-card" tabindex="0">
      <img src="${game.image}" alt="Billede af ${game.title}" class="game-poster" />
      <div class="game-info">
        <h4>${game.title}</h4>
        <div class="game-meta">
          <span class="game-playtime">${game.playtime} min</span>
          <span class="game-players">
  <img src="img/vector gruppe.svg" alt="Antal spiller" class="personer-ikon" />
  ${spillere}
</span>
<button class="læsmere"> Læs om spillet </button> 
        </div> 
        </div>
        </article>
  `;

  // Tilføj game card til DOM (HTML) - insertAdjacentHTML sætter HTML ind uden at overskrive
  gameList.insertAdjacentHTML("beforeend", gameHTML);

  // Find det kort vi lige har tilføjet (det sidste element)
  const newCard = gameList.lastElementChild;

  const læsmere = newCard.querySelector(".læsmere");
  læsmere.addEventListener("click", function (event) {
    event.stopPropagation();
    showGameModal(game); });


  // Tilføj click event til kortet - når brugeren klikker på kortet
  newCard.addEventListener("click", function () {
    showGameModal(game); // Vis modal med spil detaljer
  });

  // Tilføj keyboard support (Enter og mellemrum) for tilgængelighed
  newCard.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Forhindre scroll ved mellemrum
      showGameModal(game); // Vis modal med spil detaljer
    }
  });
}

// ===== DROPDOWN OG MODAL FUNKTIONER =====
// #5: Udfyld genre-dropdown med alle unikke genrer fra data
function populateGenreDropdown() {
  const genreSelect = document.querySelector("#genre-select");
  const categories = new Set(); // Ændret fra genres til categories

  for (const game of allGames) {
    if (game.genre) {
      categories.add(game.genre);
    }
  }

  genreSelect.innerHTML = /*html*/ `<option value="all">Vælg kategori</option>`;

  const sortedCategories = [...categories].sort();
  for (const category of sortedCategories) {
    genreSelect.insertAdjacentHTML("beforeend", /*html*/ `<option value="${category}">${category}</option>`);
  }
}

// #6: Vis spil i modal dialog - popup vindue med spil detaljer
function showGameModal(game) {
  // Find modal indhold container og byg HTML struktur dynamisk
  //tilføj indhold fra JSON 
  const minSpillere = game.players?.min || game.players;
const maxSpillere = game.players?.max ? `-${game.players.max}` : "";
const spillereModal = `${minSpillere}${maxSpillere}`;

  document.querySelector("#dialog-content").innerHTML = /*html*/ `
    <img src="${game.image}" alt="Poster af ${game.title}" class="game-poster">
    <div class="dialog-details">
    <h2 id="dialog-title">${game.title}</h2>
    
      <p class="game-genre"><strong>Kategori:</strong> ${game.genre}</p>
      <p class="game-playtime"><strong>Spilletid:</strong> ${game.playtime}</p>
      <p class="game-players"><strong>Spillere:</strong> ${spillereModal}</p>
      <p class="game-language"><strong>Sprog:</strong> ${game.language}</p>
      <p class="game-age"><strong>Alder:</strong> ${game.age}</p>
      <p class="game-difficulty"><strong>Sværhedsgrad:</strong> ${game.difficulty}</p>
      <p class="rules"><strong>Regler:</strong> ${game.rules}</p>
    </div>
    `;

  // Åbn modalen - showModal() er en built-in browser funktion
  document.querySelector("#game-dialog").showModal();
}
  
