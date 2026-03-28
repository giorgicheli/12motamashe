// Admin Panel Team Manager
class AdminTeamManager {
  constructor() {
    this.teams = this.loadTeams();
    this.filteredTeams = [...this.teams];
    // Load logs from localStorage
    this.logs = this.loadLogs();
    // Track deleted teams separately so resets won't restore them
    this.deletedTeams = this.loadDeletedTeams();
    this.initializeElements();
    this.setupEventListeners();
    this.updateDisplay();
    this.updateStats();
    // Initial render of logs
    this.renderLogs();
  }

  initializeElements() {
    this.searchInput = document.getElementById("search-input");
    this.sortSelect = document.getElementById("sort-select");
    this.teamsList = document.getElementById("teams-list");
    this.saveAllBtn = document.getElementById("save-all-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.bulkScore = document.getElementById("bulk-score");
    this.addAllBtn = document.getElementById("add-all-btn");
    this.setAllBtn = document.getElementById("set-all-btn");
    this.resetAllBtn = document.getElementById("reset-all-btn");
    this.totalTeamsSpan = document.getElementById("total-teams");
    this.lastUpdateSpan = document.getElementById("last-update");
    // Logs UI elements
    this.toggleLogsBtn = document.getElementById("toggle-logs-btn");
    this.clearLogsBtn = document.getElementById("clear-logs-btn");
    this.logsContainer = document.getElementById("logs-container");
    this.logsList = document.getElementById("logs-list");
    // Deleted teams UI elements
    this.toggleDeletedBtn = document.getElementById("toggle-deleted-btn");
    this.deletedContainer = document.getElementById("deleted-container");
    this.deletedList = document.getElementById("deleted-list");
    this.restoreAllDeletedBtn = document.getElementById("restore-all-deleted-btn");
    this.clearDeletedBtn = document.getElementById("clear-deleted-btn");
  }

  setupEventListeners() {
    // Search functionality
    this.searchInput.addEventListener("input", () => {
      this.filterAndSort();
    });

    // Sort functionality
    this.sortSelect.addEventListener("change", () => {
      this.filterAndSort();
    });

    // Save all changes
    this.saveAllBtn.addEventListener("click", () => {
      this.saveAllChanges();
    });

    // Reset to defaults
    this.resetBtn.addEventListener("click", () => {
      this.resetToDefaults();
    });

    // Bulk actions
    this.addAllBtn.addEventListener("click", () => {
      this.bulkAddScore();
    });

    this.setAllBtn.addEventListener("click", () => {
      this.bulkSetScore();
    });

    this.resetAllBtn.addEventListener("click", () => {
      this.bulkResetScore();
    });

    // Logs events
    if (this.toggleLogsBtn) {
      this.toggleLogsBtn.addEventListener("click", () => {
        if (!this.logsContainer) return;
        const isHidden =
          this.logsContainer.style.display === "none" ||
          this.logsContainer.style.display === "";
        this.logsContainer.style.display = isHidden ? "block" : "none";
        if (!isHidden) return;
        this.renderLogs();
      });
    }
    if (this.clearLogsBtn) {
      this.clearLogsBtn.addEventListener("click", () => {
        this.clearLogs();
      });
    }

    // Deleted teams events
    if (this.toggleDeletedBtn) {
      this.toggleDeletedBtn.addEventListener("click", () => {
        if (!this.deletedContainer) return;
        const isHidden =
          this.deletedContainer.style.display === "none" ||
          this.deletedContainer.style.display === "";
        this.deletedContainer.style.display = isHidden ? "block" : "none";
        if (!isHidden) return;
        this.renderDeletedTeams();
      });
    }
    if (this.restoreAllDeletedBtn) {
      this.restoreAllDeletedBtn.addEventListener("click", () => {
        this.restoreAllDeletedTeams();
      });
    }
    if (this.clearDeletedBtn) {
      this.clearDeletedBtn.addEventListener("click", () => {
        this.clearDeleted();
      });
    }
  }

  loadTeams() {
  const defaultTeams = [
      // { id: 1, name: "ჭიქა და ბურთი", logo: "assets/ჭიქა-და-ბურთი.jpg", score: 0 },
      // { id: 2, name: "ოლდ ბოიზ", logo: "assets/ოლდ-ბოიზ.jpg", score: 0 },
      // { id: 3, name: "26 მარტი", logo: "assets/26-მარტი.jpg", score: 0 },
      // { id: 4, name: "სელესაო", logo: "assets/სელესაო.png", score: 0 },
      // { id: 5, name: "ბადე სპორტი", logo: "assets/ბადე-სპორტი.jpg", score: 0 },
      // { id: 6, name: "რობერტო ბაჯო", logo: "assets/რობერტო-ბაჯო.jpeg", score: 0 },
      // { id: 7, name: "ჯალო-როსი", logo: "assets/ჯალო-როსი.jpeg", score: 0 },
      // { id: 8, name: "პირველი მერცხალი", logo: "assets/პირველი-მერცხალი.png", score: 0 },
      // { id: 9, name: "13 მაისი", logo: "assets/13-მაისი.jpg", score: 0 },
      // { id: 10, name: "მილანი 1899+", logo: "assets/მილანი1899.png", score: 0 },
      // { id: 11, name: "მილან დუე", logo: "assets/მილან-დუე.png", score: 0 },
      // { id: 12, name: "სანდერლენდი", logo: "assets/სანდერლენდი.jpeg", score: 0 },
      // { id: 13, name: "ტაო", logo: "assets/ტაო.jpeg", score: 0 },
      // { id: 14, name: "კაიზერსლაუტერნი", logo: "assets/კაიზერსლაუტერნი.png", score: 0 },
      // { id: 15, name: "გეიმ სეტ მატჩ", logo: "assets/Game-Set-Match.jpg", score: 0 },
      // { id: 16, name: "22 მოთამაშე", logo: "assets/22_მოთამაშე.jpeg", score: 0 },
      // { id: 17, name: "იგრავოი პრაქტიკა", logo: "assets/იგრავოი-პრაქტიკა.jpeg", score: 0 },
      // { id: 18, name: "დინამო თბილისი", logo: "assets/დინამო-თბილისი.jpg", score: 0 },
      // { id: 19, name: "რეკორდმაისტერი", logo: "assets/რეკორდმაისტერი.png", score: 0 },
      // { id: 20, name: "ფენომენო", logo: "assets/ფენომენო.jpg", score: 0 },
      // { id: 21, name: "ლიბერო", logo: "assets/ლიბერო.jpeg", score: 0 },
      // { id: 22, name: "რა? სად? როდის?", logo: "assets/რა-სად-როდის.jpeg", score: 0 },



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

    const stored = localStorage.getItem("ambassadori_teams");
    if (stored) return JSON.parse(stored);

    // If no stored teams yet, exclude any previously deleted teams from defaults
    let deleted = [];
    try {
      const del = localStorage.getItem("ambassadori_deleted_teams");
      deleted = del ? JSON.parse(del) : [];
    } catch {}
    const deletedIds = new Set(deleted.map((t) => t.id));
    return defaultTeams.filter((t) => !deletedIds.has(t.id));
  }

  // Logs handling
  loadLogs() {
    try {
      const stored = localStorage.getItem("ambassadori_score_logs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  persistLogs() {
    localStorage.setItem("ambassadori_score_logs", JSON.stringify(this.logs));
  }

  // Deleted teams handling
  loadDeletedTeams() {
    try {
      const stored = localStorage.getItem("ambassadori_deleted_teams");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  persistDeletedTeams() {
    localStorage.setItem(
      "ambassadori_deleted_teams",
      JSON.stringify(this.deletedTeams || [])
    );
  }

  logScoreChange(team, prevScore, newScore, action = "save") {
    const delta = (newScore || 0) - (prevScore || 0);
    if (delta === 0 && action !== "delete-team" && action !== "restore-team") return; // skip no-op except deletions/restores
    this.logs.push({
      at: Date.now(),
      teamId: team.id,
      teamName: team.name,
      prev: prevScore || 0,
      next: newScore || 0,
      delta,
      action,
    });
  }

  renderLogs() {
    if (!this.logsList) return;
    this.logsList.innerHTML = "";
    // Newest first
    const logs = [...this.logs].sort((a, b) => b.at - a.at);
    logs.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "logs-row";
      const time = new Date(entry.at).toLocaleString("ka-GE");
      const sign = entry.delta > 0 ? "+" : "";
      row.innerHTML = `
                <span class="log-time">${time}</span>
                <span class="log-team">${entry.teamName}</span>
                <span class="log-change">${entry.prev} → ${entry.next} <small>(${sign}${entry.delta})</small></span>
                <span class="log-action">${entry.action}</span>
            `;
      // Add extra CSS classes based on change direction
      const changeEl = row.querySelector(".log-change");
      const actionEl = row.querySelector(".log-action");
      if (entry.delta > 0) {
        changeEl.classList.add("positive");
        actionEl.classList.add("positive");
      } else if (entry.delta < 0) {
        changeEl.classList.add("negative");
        actionEl.classList.add("negative");
      }
      this.logsList.appendChild(row);
    });
  }

  // Render deleted teams list
  renderDeletedTeams() {
    if (!this.deletedList) return;
    this.deletedList.innerHTML = "";

    const items = [...(this.deletedTeams || [])].sort(
      (a, b) => (b.deletedAt || 0) - (a.deletedAt || 0)
    );
    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "logs-row";
      empty.innerHTML = `<span class="log-time">-</span><span class="log-team">წაშლილი გუნდი არ არის</span><span></span><span></span>`;
      this.deletedList.appendChild(empty);
      return;
    }

    items.forEach((t) => {
      const row = document.createElement("div");
      row.className = "logs-row";
      const time = t.deletedAt ? new Date(t.deletedAt).toLocaleString("ka-GE") : "-";
      row.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-team">${t.name}</span>
        <span class="log-change">ID: ${t.id} · Score: ${t.score ?? 0}</span>
        <span class="log-action">
          <button class="btn-small btn-success" onclick="adminManager.restoreDeletedTeam(${t.id})">აღდგენა</button>
        </span>
      `;
      this.deletedList.appendChild(row);
    });
  }

  clearLogs() {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ ისტორიის გასუფთავება?")) return;
    this.logs = [];
    this.persistLogs();
    this.renderLogs();
    this.showMessage("ქულების ისტორია გასუფთავებულია", "success");
  }

  saveTeams(action = "save-all") {
    // Compare with previously saved teams for logging
    let prevMap = new Map();
    try {
      const prevStored = localStorage.getItem("ambassadori_teams");
      const prevTeams = prevStored ? JSON.parse(prevStored) : [];
      prevTeams.forEach((t) => prevMap.set(t.id, t.score || 0));
    } catch {}

    // Log diffs
    this.teams.forEach((team) => {
      const prevScore = prevMap.has(team.id) ? prevMap.get(team.id) : 0;
      if ((team.score || 0) !== prevScore) {
        this.logScoreChange(team, prevScore, team.score || 0, action);
      }
    });
    // Persist logs first
    this.persistLogs();

    // Save teams
    localStorage.setItem("ambassadori_teams", JSON.stringify(this.teams));
    localStorage.setItem("ambassadori_last_update", Date.now().toString());
    this.updateStats();
    this.renderLogs();
    this.showMessage("ცვლილებები შენახულია!", "success");
  }

  filterAndSort() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const sortBy = this.sortSelect.value;

    // Filter
    this.filteredTeams = this.teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm)
    );

    // Sort
    this.filteredTeams.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "score":
          return b.score - a.score;
        case "id":
          return a.id - b.id;
        default:
          return 0;
      }
    });

    this.updateDisplay();
  }

  updateDisplay() {
    this.teamsList.innerHTML = "";

    this.filteredTeams.forEach((team) => {
      const teamItem = this.createTeamItem(team);
      this.teamsList.appendChild(teamItem);
    });
  }

  createTeamItem(team) {
    const div = document.createElement("div");
    div.className = "team-item";
    div.innerHTML = `
            <div class="team-info">
                <img src="${team.logo}" alt="${team.name} logo" class="team-logo" />
                <span class="team-name">${team.name}</span>
            </div>
            <div class="score-controls">
                <input type="number" class="score-input" value="${team.score}" min="0" data-team-id="${team.id}" />
            </div>
            <div class="team-actions">
                <button class="btn-small btn-success" onclick="adminManager.updateTeamScore(${team.id})">განახლება</button>
                <button class="btn-small btn-warning" onclick="adminManager.addToScore(${team.id}, 1)">+1</button>
                                <button class="btn-small btn-warning color-2" onclick="adminManager.addToScore(${team.id}, 2)">+2</button>
                                                <button class="btn-small btn-warning color-3" onclick="adminManager.addToScore(${team.id}, 3)">+3</button>
                                                                <button class="btn-small btn-warning color-4" onclick="adminManager.addToScore(${team.id}, 4)">+4</button>
                                                                                <button class="btn-small btn-warning color-5" onclick="adminManager.addToScore(${team.id}, 5)">+5</button>
                <button class="btn-small btn-warning" onclick="adminManager.addToScore(${team.id}, -1)">-1</button>
                <button class="btn-small btn-danger" onclick="adminManager.deleteTeam(${team.id})">წაშლა</button>
            </div>
        `;

    return div;
  }

  updateTeamScore(teamId) {
    const input = document.querySelector(`input[data-team-id="${teamId}"]`);
    const newScore = parseInt(input.value) || 0;

    const team = this.teams.find((t) => t.id === teamId);
    if (team) {
      const prev = team.score || 0;
      team.score = newScore;
      // Log immediately
      this.logScoreChange(team, prev, newScore, "update-team");
      this.persistLogs();
      this.renderLogs();
      this.showMessage(`${team.name}-ის ქულა განახლდა: ${newScore}`, "success");
    }
  }

  addToScore(teamId, amount) {
    const team = this.teams.find((t) => t.id === teamId);
    if (team) {
      const prev = team.score || 0;
      const next = Math.max(0, prev + amount);
      team.score = next;
      this.updateDisplay();
      // Log immediately
      this.logScoreChange(team, prev, next, amount >= 0 ? "მატება" : "კლება");
      this.persistLogs();
      this.renderLogs();
      this.showMessage(
        `${team.name}-ის ქულას დაემატა ${amount}: ${team.score}`,
        "success"
      );
    }
  }

  resetTeamScore(teamId) {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ გუნდის ქულის გაწმენდა?")) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        const prev = team.score || 0;
        team.score = 0;
        this.updateDisplay();
        // Log immediately
        this.logScoreChange(team, prev, 0, "reset-team");
        this.persistLogs();
        this.renderLogs();
        this.showMessage(`${team.name}-ის ქულა გაიწმინდა`, "success");
      }
    }
  }

  // Permanently delete a team (kept in a separate deleted store, not restored by reset)
  deleteTeam(teamId) {
    const idx = this.teams.findIndex((t) => t.id === teamId);
    if (idx === -1) return;
    const team = this.teams[idx];
    if (
      !confirm(
        `დარწმუნებული ხართ, რომ გსურთ გუნდის "${team.name}" წაშლა? Reset ვერ აღადგენს გუნდს.`
      )
    )
      return;

    // Save to deleted teams store
    this.deletedTeams = this.deletedTeams || this.loadDeletedTeams();
    this.deletedTeams.push({ ...team, deletedAt: Date.now() });
    this.persistDeletedTeams();

    // Remove from current teams
    this.teams.splice(idx, 1);

    // Update UI state and storage
    this.filterAndSort(); // recompute filtered list and re-render
    localStorage.setItem("ambassadori_teams", JSON.stringify(this.teams));
    localStorage.setItem("ambassadori_last_update", Date.now().toString());

    // Optional log entry for traceability
    this.logScoreChange(team, team.score || 0, 0, "delete-team");
    this.persistLogs();
    this.renderLogs();

    this.updateStats();
    this.showMessage(`${team.name} წარმატებით წაიშალა`, "success");
  }

  // Restore a single deleted team 
  restoreDeletedTeam(teamId) {
    const idx = (this.deletedTeams || []).findIndex((t) => t.id === teamId);
    if (idx === -1) return;
    const team = { ...this.deletedTeams[idx] };

    // Ensure unique ID in current teams
    const existingIds = new Set(this.teams.map((t) => t.id));
    if (existingIds.has(team.id)) {
      const maxId = Math.max(0, ...this.teams.map((t) => t.id));
      team.id = maxId + 1;
    }
    delete team.deletedAt;

    // Remove from deleted, add to teams
    this.deletedTeams.splice(idx, 1);
    this.persistDeletedTeams();

    this.teams.push(team);
    localStorage.setItem("ambassadori_teams", JSON.stringify(this.teams));
    localStorage.setItem("ambassadori_last_update", Date.now().toString());

    // Log restore (from 0 to current score)
    this.logScoreChange(team, 0, team.score || 0, "restore-team");
    this.persistLogs();

    // Update UI
    this.filterAndSort();
    this.renderDeletedTeams();
    this.renderLogs();
    this.updateStats();
    this.showMessage(`${team.name} აღდგა გუნდების სიაში`, "success");
  }

  // Restore all deleted teams
  restoreAllDeletedTeams() {
    if (!this.deletedTeams || this.deletedTeams.length === 0) return;
    if (!confirm("გსურთ ყველა წაშლილი გუნდის აღდგენა?")) return;

    const existingIds = new Set(this.teams.map((t) => t.id));
    let maxId = Math.max(0, ...this.teams.map((t) => t.id));

    const restored = [];
    (this.deletedTeams || []).forEach((t) => {
      const team = { ...t };
      if (existingIds.has(team.id)) {
        maxId += 1;
        team.id = maxId;
      }
      delete team.deletedAt;
      restored.push(team);
      // Log restore
      this.logScoreChange(team, 0, team.score || 0, "restore-team");
    });

    // Clear deleted and persist
    this.deletedTeams = [];
    this.persistDeletedTeams();

    // Add restored, persist teams
    this.teams = [...this.teams, ...restored];
    localStorage.setItem("ambassadori_teams", JSON.stringify(this.teams));
    localStorage.setItem("ambassadori_last_update", Date.now().toString());
    this.persistLogs();

    // Update UI
    this.filterAndSort();
    this.renderDeletedTeams();
    this.renderLogs();
    this.updateStats();
    this.showMessage("ყველა წაშლილი გუნდი აღდგა", "success");
  }

  // Clear deleted teams storage
  clearDeleted() {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ წაშლილების სიის გასუფთავება?")) return;
    this.deletedTeams = [];
    this.persistDeletedTeams();
    this.renderDeletedTeams();
    this.showMessage("წაშლილების სია გასუფთავებულია", "success");
  }

  saveAllChanges() {
    // Update all teams with current input values
    const inputs = document.querySelectorAll(".score-input");
    inputs.forEach((input) => {
      const teamId = parseInt(input.getAttribute("data-team-id"));
      const newScore = parseInt(input.value) || 0;
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.score = newScore;
      }
    });

    this.saveTeams("save-all");
  }

  resetToDefaults() {
    if (
      confirm(
        "დარწმუნებული ხართ, რომ გსურთ ყველა ქულის დაბრუნება საწყის მდგომარეობაში?"
      )
    ) {
      const defaultScores = [
        200, 190, 180, 170, 160, 150, 140, 130, 120, 100, 99, 94, 90, 90, 80,
        80, 70, 50, 30, 10,
      ];
      this.teams.forEach((team, index) => {
        team.score = defaultScores[index] || 0;
      });
      this.saveTeams("reset-defaults");
      this.updateDisplay();
    }
  }

  bulkAddScore() {
    const amount = parseInt(this.bulkScore.value);
    if (isNaN(amount)) {
      this.showMessage("გთხოვთ შეიყვანოთ მართებული რიცხვი", "error");
      return;
    }

    this.teams.forEach((team) => {
      const prev = team.score || 0;
      const next = Math.max(0, prev + amount);
      team.score = next;
      // Log immediately
      this.logScoreChange(team, prev, next, "bulk-add");
    });
    this.persistLogs();
    this.renderLogs();

    this.updateDisplay();
    this.showMessage(`ყველა გუნდს დაემატა ${amount} ქულა`, "success");
  }

  bulkSetScore() {
    const score = parseInt(this.bulkScore.value);
    if (isNaN(score) || score < 0) {
      this.showMessage(
        "გთხოვთ შეიყვანოთ მართებული რიცხვი (0 ან მეტი)",
        "error"
      );
      return;
    }

    this.teams.forEach((team) => {
      const prev = team.score || 0;
      team.score = score;
      // Log immediately
      this.logScoreChange(team, prev, score, "bulk-set");
    });
    this.persistLogs();
    this.renderLogs();

    this.updateDisplay();
    this.showMessage(`ყველა გუნდისთვის დაყენდა ${score} ქულა`, "success");
  }

  bulkResetScore() {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ყველა გუნდის ქულის გაწმენდა?")) {
      this.teams.forEach((team) => {
        const prev = team.score || 0;
        team.score = 0;
        // Log immediately
        this.logScoreChange(team, prev, 0, "bulk-reset");
      });
      this.persistLogs();
      this.renderLogs();

      this.updateDisplay();
      this.showMessage("ყველა გუნდის ქულა გაიწმინდა", "success");
    }
  }

  updateStats() {
    this.totalTeamsSpan.textContent = `სულ გუნდები: ${this.teams.length}`;

    const lastUpdate = localStorage.getItem("ambassadori_last_update");
    if (lastUpdate) {
      const date = new Date(parseInt(lastUpdate));
      this.lastUpdateSpan.textContent = `ბოლო განახლება: ${date.toLocaleString(
        "ka-GE"
      )}`;
    } else {
      this.lastUpdateSpan.textContent = "ბოლო განახლება: -";
    }
  }

  showMessage(text, type = "success") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".message");
    existingMessages.forEach((msg) => msg.remove());

    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    const container = document.querySelector(".admin-container");
    container.insertBefore(message, container.firstChild);

    // Auto remove after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  }
}

// Global reference for button onclick handlers
let adminManager;

document.addEventListener("DOMContentLoaded", () => {
  adminManager = new AdminTeamManager();
});
