Here is the full updated `script.js` code to paste. Main fix: admin protection now only runs on `admin.html`, so your public pages will not redirect everyone back to home.

```js
/* =========================
   UDL-LEAGUE MAIN SCRIPT
========================= */

console.log("UDL-League Loaded Successfully");

const API_URL = "http://localhost:5000/api";

let knockoutData = [];

let bracket = {
    qf1: null,
    qf2: null,
    sf1: null,
    sf2: null,
    final: null
};

/* =========================
   PAGE HELPERS
========================= */

function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1) || "index.html";
}

function isPage(pageName) {
    return getCurrentPage() === pageName;
}

function checkAdmin() {
    if (!isPage("admin.html")) {
        return;
    }

    const role = localStorage.getItem("role");

    if (role !== "admin") {
        window.location.href = "index.html";
    }
}

function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    checkAdmin();

    updateFooterYear();
    setActiveNavLink();
    connectNavigation();
    connectHeroButtons();
    connectCardClicks();
    connectButtonEffects();
    connectAdminForms();

    initializeApp();
});

/* =========================
   INITIALIZE APP
========================= */

function initializeApp() {
    console.log("Initializing UDL-League App...");

    fadeInPage();

    if (isPage("teams.html")) {
        loadTeams();
    }

    if (isPage("players.html")) {
        loadPlayers();
    }

    if (isPage("fixtures.html")) {
        loadFixtures();
    }

    if (isPage("table.html")) {
        loadLiveTable();
        setInterval(loadLiveTable, 5000);
    }

    if (isPage("stats.html")) {
        loadTopScorers();
        loadTopAssisters();
    }

    if (isPage("admin.html")) {
        loadAdminTeams();
        loadAdminPlayers();
        loadAdminFixtures();
    }

    if (isPage("knockout.html")) {
        loadKnockout("U13");
    }
}

/* =========================
   NAVIGATION
========================= */

function connectNavigation() {
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            const page = this.textContent.trim();
            console.log(`Opening ${page} page...`);
        });
    });
}

/* =========================
   HERO BUTTONS
========================= */

function connectHeroButtons() {
    const heroButtons = document.querySelectorAll(".hero-btn");

    heroButtons.forEach((button) => {
        button.addEventListener("click", () => {
            console.log("Hero action selected...");
        });
    });
}

/* =========================
   FEATURE CARDS
========================= */

function connectCardClicks() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const title = card.querySelector("h3")?.textContent.trim();

            if (title) {
                console.log(`${title} module selected`);
            }
        });
    });
}

/* =========================
   DYNAMIC FOOTER YEAR
========================= */

function updateFooterYear() {
    const footer = document.querySelector("footer p");

    if (!footer) {
        return;
    }

    const currentYear = new Date().getFullYear();
    footer.innerHTML = `&copy; ${currentYear} UDL-League | All Rights Reserved`;
}

/* =========================
   BUTTON EFFECTS
========================= */

function connectButtonEffects() {
    const buttons = document.querySelectorAll("button, .hero-btn");

    buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });
}

/* =========================
   LOADING EFFECT
========================= */

function fadeInPage() {
    document.body.style.opacity = "0";

    setTimeout(() => {
        document.body.style.transition = "opacity 1s";
        document.body.style.opacity = "1";
    }, 100);
}

/* =========================
   TEAMS
========================= */

async function loadTeams() {
    const container = document.querySelector(".cards");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/teams`);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const teams = await res.json();

        if (!Array.isArray(teams) || teams.length === 0) {
            container.innerHTML = "<p>No teams found.</p>";
            return;
        }

        container.innerHTML = "";

        teams.forEach((team) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${team.team_name || "Unnamed Team"}</h3>
                <p>Coach: ${team.coach_name || "N/A"}</p>
                <p>Contact: ${team.contact || "N/A"}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load teams:", error);
        container.innerHTML = "<p>Unable to load teams. Make sure the backend is running.</p>";
    }
}

/* =========================
   PLAYERS
========================= */

async function loadPlayers() {
    const container = document.querySelector(".cards");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/players`);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const players = await res.json();

        if (!Array.isArray(players) || players.length === 0) {
            container.innerHTML = "<p>No players found.</p>";
            return;
        }

        container.innerHTML = "";

        players.forEach((player) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${player.first_name || ""} ${player.last_name || ""}</h3>
                <p>Position: ${player.position || "N/A"}</p>
                <p>Jersey: ${player.jersey_number || "N/A"}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load players:", error);
        container.innerHTML = "<p>Unable to load players. Make sure the backend is running.</p>";
    }
}

/* =========================
   FIXTURES
========================= */

async function loadFixtures() {
    const container = document.querySelector(".cards");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/fixtures`);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const fixtures = await res.json();

        if (!Array.isArray(fixtures) || fixtures.length === 0) {
            container.innerHTML = "<p>No fixtures found.</p>";
            return;
        }

        container.innerHTML = "";

        fixtures.forEach((fixture) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${fixture.home_team} vs ${fixture.away_team}</h3>
                <p>Date: ${formatDate(fixture.match_date)}</p>
                <p>Venue: ${fixture.venue || "N/A"}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load fixtures:", error);
        container.innerHTML = "<p>Unable to load fixtures. Make sure the backend is running.</p>";
    }
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString();
}

/* =========================
   LIVE LEAGUE TABLE
========================= */

async function loadLiveTable() {
    const container = document.getElementById("tableBody");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/table`);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const table = await res.json();

        container.innerHTML = "";

        table.forEach((team) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${team.team_name}</td>
                <td>${team.played}</td>
                <td>${team.wins}</td>
                <td>${team.draws}</td>
                <td>${team.losses}</td>
                <td>${team.goals_for}</td>
                <td>${team.goals_against}</td>
                <td>${team.goal_difference}</td>
                <td>${team.points}</td>
            `;

            row.addEventListener("click", () => {
                alert(`${team.team_name} statistics opened`);
            });

            container.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to load live table:", error);
        container.innerHTML = `
            <tr>
                <td colspan="9">Unable to load league table.</td>
            </tr>
        `;
    }
}

/* =========================
   STATS
========================= */

async function loadTopScorers() {
    const container = document.getElementById("topScorers");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/topscorers`);
        const scorers = await res.json();

        container.innerHTML = "";

        scorers.forEach((player) => {
            container.innerHTML += `
                <li>${player.first_name} ${player.last_name} - ${player.goals} goals</li>
            `;
        });
    } catch (error) {
        console.error("Failed to load top scorers:", error);
        container.innerHTML = "<li>Unable to load top scorers.</li>";
    }
}

async function loadTopAssisters() {
    const container = document.getElementById("topAssisters");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/topassisters`);
        const assisters = await res.json();

        container.innerHTML = "";

        assisters.forEach((player) => {
            container.innerHTML += `
                <li>${player.first_name} ${player.last_name} - ${player.assists} assists</li>
            `;
        });
    } catch (error) {
        console.error("Failed to load top assisters:", error);
        container.innerHTML = "<li>Unable to load top assisters.</li>";
    }
}

/* =========================
   ADMIN PAGE
========================= */

function connectAdminForms() {
    const teamForm = document.getElementById("teamForm");
    const playerForm = document.getElementById("playerForm");
    const fixtureForm = document.getElementById("fixtureForm");

    if (teamForm) {
        teamForm.addEventListener("submit", addTeam);
    }

    if (playerForm) {
        playerForm.addEventListener("submit", addPlayer);
    }

    if (fixtureForm) {
        fixtureForm.addEventListener("submit", addFixture);
    }
}

async function loadAdminTeams() {
    const container = document.getElementById("teamList");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/teams`);
        const teams = await res.json();

        container.innerHTML = "";

        if (!Array.isArray(teams) || teams.length === 0) {
            container.innerHTML = "<p>No teams added yet.</p>";
            return;
        }

        teams.forEach((team) => {
            const teamBox = document.createElement("div");
            teamBox.className = "team-box";

            teamBox.innerHTML = `
                <span>${team.team_name || "Unnamed Team"}</span>
                <button type="button" onclick="deleteTeam(${team.id})">Delete</button>
            `;

            container.appendChild(teamBox);
        });
    } catch (error) {
        console.error("Failed to load admin teams:", error);
        container.innerHTML = "<p>Unable to load teams.</p>";
    }
}

async function addTeam(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
        const res = await fetch(`${API_URL}/teams`, {
            method: "POST",
            body: form
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        event.target.reset();
        loadAdminTeams();
    } catch (error) {
        console.error("Failed to add team:", error);
        alert("Could not add team. Make sure the backend is running.");
    }
}

async function deleteTeam(id) {
    try {
        const res = await fetch(`${API_URL}/teams/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        loadAdminTeams();
    } catch (error) {
        console.error("Failed to delete team:", error);
        alert("Could not delete team.");
    }
}

async function loadAdminPlayers() {
    const container = document.getElementById("playerList");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/players`);
        const players = await res.json();

        container.innerHTML = "";

        if (!Array.isArray(players) || players.length === 0) {
            container.innerHTML = "<p>No players added yet.</p>";
            return;
        }

        players.forEach((player) => {
            const playerBox = document.createElement("div");
            playerBox.className = "team-box";

            playerBox.innerHTML = `
                <span>${player.first_name || ""} ${player.last_name || ""}</span>
                <button type="button" onclick="deletePlayer(${player.id})">Delete</button>
            `;

            container.appendChild(playerBox);
        });
    } catch (error) {
        console.error("Failed to load admin players:", error);
        container.innerHTML = "<p>Unable to load players.</p>";
    }
}

async function addPlayer(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
        const res = await fetch(`${API_URL}/players`, {
            method: "POST",
            body: form
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        event.target.reset();
        loadAdminPlayers();
    } catch (error) {
        console.error("Failed to add player:", error);
        alert("Could not add player. Make sure the backend is running.");
    }
}

async function deletePlayer(id) {
    try {
        const res = await fetch(`${API_URL}/players/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        loadAdminPlayers();
    } catch (error) {
        console.error("Failed to delete player:", error);
        alert("Could not delete player.");
    }
}

async function loadAdminFixtures() {
    const container = document.getElementById("fixtureList");

    if (!container) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/fixtures`);
        const fixtures = await res.json();

        container.innerHTML = "";

        if (!Array.isArray(fixtures) || fixtures.length === 0) {
            container.innerHTML = "<p>No fixtures added yet.</p>";
            return;
        }

        fixtures.forEach((fixture) => {
            const fixtureBox = document.createElement("div");
            fixtureBox.className = "team-box";

            fixtureBox.innerHTML = `
                <span>${fixture.home_team} vs ${fixture.away_team}</span>
            `;

            container.appendChild(fixtureBox);
        });
    } catch (error) {
        console.error("Failed to load admin fixtures:", error);
        container.innerHTML = "<p>Unable to load fixtures.</p>";
    }
}

async function addFixture(event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target).entries());

    try {
        const res = await fetch(`${API_URL}/fixtures`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        event.target.reset();
        loadAdminFixtures();
    } catch (error) {
        console.error("Failed to add fixture:", error);
        alert("Could not add fixture. Make sure the backend is running.");
    }
}

/* =========================
   KNOCKOUT PAGE
========================= */

async function loadKnockout(ageGroup) {
    const qf1 = document.getElementById("qf1");
    const qf2 = document.getElementById("qf2");
    const sf1 = document.getElementById("sf1");
    const sf2 = document.getElementById("sf2");
    const final = document.getElementById("final");

    if (!qf1 || !qf2 || !sf1 || !sf2 || !final) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/knockout/${ageGroup}`);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const teams = await res.json();

        if (!Array.isArray(teams) || teams.length < 6) {
            qf1.innerText = "Waiting for teams";
            qf2.innerText = "Waiting for teams";
            sf1.innerText = "Waiting for teams";
            sf2.innerText = "Waiting for teams";
            final.innerText = "Waiting for finalists";
            return;
        }

        knockoutData = teams;

        qf1.innerText = `${teams[2].team_name} vs ${teams[5].team_name}`;
        qf2.innerText = `${teams[3].team_name} vs ${teams[4].team_name}`;
        sf1.innerText = `${teams[1].team_name} vs Winner QF2`;
        sf2.innerText = `${teams[0].team_name} vs Winner QF1`;
        final.innerText = "Waiting for finalists";
    } catch (error) {
        console.error("Failed to load knockout:", error);

        qf1.innerText = "Team 3 vs Team 6";
        qf2.innerText = "Team 4 vs Team 5";
        sf1.innerText = "Team 2 vs Winner QF2";
        sf2.innerText = "Team 1 vs Winner QF1";
        final.innerText = "Waiting for finalists";
    }
}

function setWinner(match, teamName) {
    let winner = teamName;

    if (!winner) {
        winner = prompt("Enter the winning team:");
    }

    if (!winner || winner.trim() === "") {
        return;
    }

    bracket[match] = winner.trim();

    const matchElement = document.getElementById(match);

    if (matchElement) {
        matchElement.innerText = winner.trim();
    }

    updateBracket();
}

function updateBracket() {
    const sf1 = document.getElementById("sf1");
    const sf2 = document.getElementById("sf2");
    const final = document.getElementById("final");

    if (!sf1 || !sf2 || !final) {
        return;
    }

    const team1 = knockoutData[0]?.team_name || "Team 1";
    const team2 = knockoutData[1]?.team_name || "Team 2";

    sf1.innerText = bracket.qf2
        ? `${team2} vs ${bracket.qf2}`
        : `${team2} vs Winner QF2`;

    sf2.innerText = bracket.qf1
        ? `${team1} vs ${bracket.qf1}`
        : `${team1} vs Winner QF1`;

    if (bracket.sf1 && bracket.sf2) {
        final.innerText = `${bracket.sf1} vs ${bracket.sf2}`;
    }

    if (bracket.final) {
        final.innerText = `Champion: ${bracket.final}`;
    }
}
```