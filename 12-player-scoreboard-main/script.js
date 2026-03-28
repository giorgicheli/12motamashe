// Team Data Management
class TeamDataManager {
  constructor() {
    this.defaultTeams = [


      { id: 1, name: "ჯითისი", logo: "assets/ჯითისი_.png", score: 0 },
      { id: 2, name: "13 მაისი", logo: "assets/13-მაისი.jpg", score: 0 },
      { id: 3, name: "მილანი1899+", logo: "assets/მილანი1899.png", score: 0 },
      { id: 4, name: "26 მარტი", logo: "assets/26-მარტი.jpg", score: 0 },
      { id: 5, name: "ტაო", logo: "assets/ტაო.jpeg", score: 0 },
      { id: 6, name: "ფენომენო", logo: "assets/ფენომენო.jpg", score: 0 },

      { id: 7, name: "ფერგი თაიმი", logo: "assets/ფერგი_თაიმი.jpg", score: 0 },
      { id: 8, name: "ჯალოროსი", logo: "assets/ჯალო-როსი.jpeg", score: 0 },
      { id: 9, name: "დინამო თბილისი", logo: "assets/დინამო-თბილისი.jpg", score: 0 },


      { id: 10, name: "იუვენტინო", logo: "assets/იუვენტინო.jpg", score: 0 },
      { id: 11, name: "პირველი მერცხალი", logo: "assets/პირველი-მერცხალი.png", score: 0 },
      { id: 12, name: "მილან დუე", logo: "assets/მილანი1899.png", score: 0 },

      { id: 13, name: "ჭიქა და ბურთი", logo: "assets/ჭიქა-და-ბურთი.jpg", score: 0 },
      { id: 14, name: "არისტოკრატები", logo: "assets/არისტოკრატები.jpg", score: 0 },
      { id: 15, name: "ლა კასა ბლანკა", logo: "assets/მერენგესი.jpg", score: 0 },
      { id: 16, name: "როკენროლა", logo: "assets/როკენროლა.jpg", score: 0 },
      { id: 17, name: "სანდერლენდი", logo: "assets/სანდერლენდი.jpeg", score: 0 }, 

      { id: 18, name: "იგრავოი პრაქტიკა", logo: "assets/იგრავოი-პრაქტიკა.jpg", score: 0 },
      { id: 19, name: "რეკორდმაისტერ-კაიზერსლაუტერნი", logo: "assets/კაიზერ.PNG", score: 0 },


      { id: 20, name: "ბადე სპორტი", logo: "assets/ბადე-სპორტი.jpg", score: 0 }, 
      { id: 21, name: "ბადე სპირტი", logo: "assets/ბადე-სპირტი.jpg", score: 0 },
      { id: 22, name: "22 მოთამაშე", logo: "assets/22_მოთამაშე.jpeg", score: 0 },
      { id: 23, name: "მელიები", logo: "assets/მელიები.jpg", score: 0 },
      { id: 24, name: "Game Set Match", logo: "assets/Game-Set-Match.jpg", score: 0 },
  
    ];
    this.initializeData();
  }

  initializeData() {
    const stored = localStorage.getItem("ambassadori_teams");
    if (!stored) {
      this.saveTeams(this.defaultTeams);
    }
  }

  getTeams() {
    const stored = localStorage.getItem("ambassadori_teams");
    return stored ? JSON.parse(stored) : this.defaultTeams;
  }

  saveTeams(teams) {
    localStorage.setItem("ambassadori_teams", JSON.stringify(teams));
    localStorage.setItem("ambassadori_last_update", Date.now().toString());
  }

  getLastUpdate() {
    return localStorage.getItem("ambassadori_last_update");
  }

  getSortedTeams() {
    const teams = this.getTeams();
    return teams.sort((a, b) => b.score - a.score);
  }
}

// Leaderboard Display Manager
class LeaderboardDisplay {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.list1 = document.querySelector("#column-1 .leaderboard-list");
    this.list2 = document.querySelector("#column-2 .leaderboard-list");
    this.updateBtn = document.getElementById("update-btn");
    this.lastUpdateTime = null;
    // Map team.id -> DOM element to reuse nodes for FLIP animation
    this.rowMap = new Map();

    this.setupUpdateButton();
    this.checkForUpdates();
    this.render();

    // Check for updates every 2 seconds
    setInterval(() => this.checkForUpdates(), 2000);
  }

  setupUpdateButton() {
    if (this.updateBtn) {
      this.updateBtn.addEventListener("click", () => {
        this.updateLeaderboard();
      });
    }
  }

  checkForUpdates() {
    const lastUpdate = this.dataManager.getLastUpdate();
    if (lastUpdate && lastUpdate !== this.lastUpdateTime) {
      this.showUpdateButton();
    }
  }

  showUpdateButton() {
    if (this.updateBtn) {
      this.updateBtn.style.display = "block";
      this.updateBtn.classList.add("pulse");
    }
  }

  hideUpdateButton() {
    if (this.updateBtn) {
      this.updateBtn.style.display = "none";
      this.updateBtn.classList.remove("pulse");
    }
  }

  updateLeaderboard() {
    this.lastUpdateTime = this.dataManager.getLastUpdate();
    this.hideUpdateButton();
    this.animatedRender();
  }

  createRow(team, index) {
    const row = document.createElement("div");
    row.classList.add("leaderboard-row");
    row.setAttribute("data-team-id", team.id);
    row.innerHTML = `
            <span class="position">${index + 1}</span>
            <span class="team-info">
                <img src="${team.logo}" alt="${
      team.name
    } logo" class="team-logo" />
                <span class="team-name">${team.name}</span>
            </span>
            <span class="team-score">${team.score || 0}</span>
        `;
    // store reference for reuse
    this.rowMap.set(team.id, row);
    return row;
  }

  // Update dynamic bits of a row without recreating it
  updateRowContent(row, team, index) {
    const posEl = row.querySelector(".position");
    const scoreEl = row.querySelector(".team-score");
    if (posEl) posEl.textContent = String(index + 1);
    if (scoreEl) scoreEl.textContent = String(team.score || 0);
  }

  render() {
    const teams = this.dataManager.getSortedTeams();

    this.list1.innerHTML = "";
    this.list2.innerHTML = "";

    const mid = Math.ceil(teams.length / 2);
    const firstHalf = teams.slice(0, mid);
    const secondHalf = teams.slice(mid);

    firstHalf.forEach((team, index) => {
      const row = this.rowMap.get(team.id) || this.createRow(team, index);
      this.updateRowContent(row, team, index);
      this.list1.appendChild(row);
    });

    secondHalf.forEach((team, index) => {
      const globalIndex = index + firstHalf.length;
      const row = this.rowMap.get(team.id) || this.createRow(team, globalIndex);
      this.updateRowContent(row, team, globalIndex);
      this.list2.appendChild(row);
    });

    this.lastUpdateTime = this.dataManager.getLastUpdate();
  }

  animatedRender() {
    const teams = this.dataManager.getSortedTeams();
    const allTeamsIds = teams.map((t) => t.id);

    // Ensure all rows exist
    teams.forEach((team, index) => {
      if (!this.rowMap.has(team.id)) {
        this.createRow(team, index);
      }
    });

    // 1) FIRST - take initial positions
    const firstRects = new Map();
    this.rowMap.forEach((el, id) => {
      firstRects.set(id, el.getBoundingClientRect());
    });

    // 2) Reorder DOM into new positions (without recreating nodes)
    const mid = Math.ceil(teams.length / 2);
    const firstHalf = teams.slice(0, mid);
    const secondHalf = teams.slice(mid);

    // Build desired order arrays of elements per column
    const col1 = [];
    const col2 = [];

    firstHalf.forEach((team, index) => {
      const row = this.rowMap.get(team.id);
      this.updateRowContent(row, team, index);
      col1.push(row);
    });
    secondHalf.forEach((team, index) => {
      const globalIndex = index + firstHalf.length;
      const row = this.rowMap.get(team.id);
      this.updateRowContent(row, team, globalIndex);
      col2.push(row);
    });

    // Apply the new order to the DOM
    // Avoid innerHTML resets to preserve nodes and measurements
    // Column 1
    col1.forEach((row, idx) => {
      if (this.list1.children[idx] !== row) {
        this.list1.insertBefore(row, this.list1.children[idx] || null);
      }
    });
    // Remove any extra nodes that shouldn't be here (in case counts changed)
    while (this.list1.children.length > col1.length) {
      this.list1.removeChild(this.list1.lastElementChild);
    }
    // Column 2
    col2.forEach((row, idx) => {
      if (this.list2.children[idx] !== row) {
        this.list2.insertBefore(row, this.list2.children[idx] || null);
      }
    });
    while (this.list2.children.length > col2.length) {
      this.list2.removeChild(this.list2.lastElementChild);
    }

    // 3) LAST - take final positions
    const lastRects = new Map();
    allTeamsIds.forEach((id) => {
      const el = this.rowMap.get(id);
      if (el) lastRects.set(id, el.getBoundingClientRect());
    });

    // 4) INVERT - compute deltas and set inverted transform
    const movedElements = [];
    allTeamsIds.forEach((id) => {
      const el = this.rowMap.get(id);
      const first = firstRects.get(id);
      const last = lastRects.get(id);
      if (!el || !first || !last) return;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        el.style.transition = "transform 0s";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.willChange = "transform";
        // Force reflow so the transform is applied before we animate back to 0
        void el.offsetHeight;
        movedElements.push(el);
      }
    });

    // 5) PLAY - animate to the new position
    requestAnimationFrame(() => {
      movedElements.forEach((el) => {
        el.style.transition = "transform 600ms ease-in-out";
        el.style.transform = "translate(0, 0)";
        const cleanup = () => {
          el.style.transition = "";
          el.style.transform = "";
          el.style.willChange = "";
          el.removeEventListener("transitionend", cleanup);
        };
        el.addEventListener("transitionend", cleanup);
      });
    });

    this.lastUpdateTime = this.dataManager.getLastUpdate();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dataManager = new TeamDataManager();
  const leaderboard = new LeaderboardDisplay(dataManager);
});
