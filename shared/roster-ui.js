(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getRosterView(state) {
    state.rosterView = {
      position: state.rosterView?.position || "all",
      sort: state.rosterView?.sort || "overall"
    };
    return state.rosterView;
  }

  function getPositions(roster) {
    return Array.from(new Set((roster || []).map((player) => player.pos).filter(Boolean)));
  }

  function isVolleyball(state) {
    return state?.sportId === "volei" || state?.userTeam?.sportId === "volei";
  }

  function getStarterIds(roster, state) {
    const starterCount = isVolleyball(state) ? 7 : 5;
    return new Set(
      (roster || [])
        .slice()
        .sort((a, b) => (Number(b.currentAbility) || 0) - (Number(a.currentAbility) || 0))
        .slice(0, starterCount)
        .map((player) => player.id)
    );
  }

  function getStat(player, key) {
    return Number(player.seasonStats?.[key]) || 0;
  }

  function getLeader(roster, key, fallbackKey) {
    return roster.slice().sort((a, b) => {
      const primary = getStat(b, key) - getStat(a, key);
      if (primary) return primary;
      return (Number(b[fallbackKey]) || Number(b.currentAbility) || 0) - (Number(a[fallbackKey]) || Number(a.currentAbility) || 0);
    })[0] || null;
  }

  function renderVolleyballStatsPanel(state, roster) {
    if (!isVolleyball(state)) return "";
    const leaders = [
      ["Pontuador", "points", "attack", "pts"],
      ["Sacador", "aces", "serve", "aces"],
      ["Bloqueador", "blocks", "block", "bloq"],
      ["Passe", "positiveReceptions", "reception", "passes"],
      ["Defesa", "digs", "defense", "defs"],
      ["Eficiencia", "efficiency", "currentAbility", "eff"]
    ].map(([label, key, fallback, suffix]) => {
      const player = getLeader(roster, key, fallback);
      const value = player ? getStat(player, key) || Number(player[fallback]) || 0 : 0;
      return { label, key, player, value, suffix };
    });

    const rows = roster.slice().sort((a, b) => getStat(b, "efficiency") - getStat(a, "efficiency") || (Number(b.currentAbility) || 0) - (Number(a.currentAbility) || 0));
    return `
      <div class="procedural-volley-stats">
        <div class="section-header compact-section-header">
          <div>
            <h2>Estatisticas do Volei</h2>
            <span class="hint">Lideres e acumulado da temporada por fundamento.</span>
          </div>
        </div>
        <div class="match-leaders-grid">
          ${leaders.map((leader) => `
            <article class="metric-card">
              <span>${escapeHtml(leader.label)}</span>
              <strong>${leader.value} ${escapeHtml(leader.suffix)}</strong>
              <div class="player-meta">${escapeHtml(leader.player?.name || "--")}</div>
            </article>
          `).join("")}
        </div>
        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table player-stats-table">
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Pos</th>
                <th>J</th>
                <th>PTS</th>
                <th>ACE</th>
                <th>ATQ</th>
                <th>BLQ</th>
                <th>Passe</th>
                <th>DEF</th>
                <th>LEV</th>
                <th>ERR</th>
                <th>EFF</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((player) => `
                <tr>
                  <td><strong>${escapeHtml(player.name)}</strong></td>
                  <td>${escapeHtml(player.pos || "-")}</td>
                  <td>${getStat(player, "games")}</td>
                  <td>${getStat(player, "points")}</td>
                  <td>${getStat(player, "aces")}</td>
                  <td>${getStat(player, "attackPoints")}</td>
                  <td>${getStat(player, "blocks")}</td>
                  <td>${getStat(player, "positiveReceptions")}</td>
                  <td>${getStat(player, "digs")}</td>
                  <td>${getStat(player, "setAssists")}</td>
                  <td>${getStat(player, "errors")}</td>
                  <td>${getStat(player, "efficiency")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function sortRoster(roster, sort) {
    const rows = roster.slice();
    const sorters = {
      overall: (a, b) => (Number(b.currentAbility) || 0) - (Number(a.currentAbility) || 0),
      potential: (a, b) => (Number(b.potential) || 0) - (Number(a.potential) || 0),
      fatigue: (a, b) => (Number(b.fatigue) || 0) - (Number(a.fatigue) || 0),
      morale: (a, b) => (Number(b.morale) || 0) - (Number(a.morale) || 0),
      age: (a, b) => (Number(a.age) || 0) - (Number(b.age) || 0)
    };
    return rows.sort(sorters[sort] || sorters.overall);
  }

  function getRosterAlerts(roster) {
    const tiredRows = roster.filter((player) => Number(player.fatigue) >= 65);
    const lowMoraleRows = roster.filter((player) => Number(player.morale) <= 42);
    const prospectRows = roster.filter((player) => (Number(player.potential) || 0) - (Number(player.currentAbility) || 0) >= 8);
    return {
      tired: tiredRows.length,
      lowMorale: lowMoraleRows.length,
      prospects: prospectRows.length,
      tiredNames: tiredRows.slice(0, 2).map((player) => player.name).join(", "),
      lowMoraleNames: lowMoraleRows.slice(0, 2).map((player) => player.name).join(", ")
    };
  }

  function renderRoster(state) {
    const roster = state.roster || [];
    const view = getRosterView(state);
    const positions = getPositions(roster);
    const filtered = view.position === "all" ? roster : roster.filter((player) => player.pos === view.position);
    const sorted = sortRoster(filtered, view.sort);
    const starterIds = getStarterIds(roster, state);
    const alerts = getRosterAlerts(roster);
    const cards = sorted.map((player) => window.TemporadaTotal.PlayerCardUI.renderPlayerCard(player, {
      sportId: state.sportId || state.userTeam?.sportId,
      isStarter: starterIds.has(player.id),
      isProspect: (Number(player.potential) || 0) - (Number(player.currentAbility) || 0) >= 8
    })).join("");
    return `
      <section class="procedural-game-section">
        <div class="section-header">
          <div>
            <h2>Elenco</h2>
            <span class="hint">${roster.length} atletas no clube controlado. ${sorted.length} visiveis.</span>
          </div>
        </div>
        <div class="procedural-roster-dashboard">
          <article><span>Titulares provaveis</span><strong>${isVolleyball(state) ? 7 : 5}</strong><p>${isVolleyball(state) ? "Baseado em overall atual e estrutura de quadra." : "Baseado em overall atual."}</p></article>
          <article class="${alerts.tired ? "has-alert" : ""}"><span>Desgaste</span><strong>${alerts.tired}</strong><p>${alerts.tiredNames ? `${escapeHtml(alerts.tiredNames)} pedem gestao de carga.` : "Nenhum atleta em alerta fisico."}</p></article>
          <article class="${alerts.lowMorale ? "has-alert" : ""}"><span>Moral baixa</span><strong>${alerts.lowMorale}</strong><p>${alerts.lowMoraleNames ? `${escapeHtml(alerts.lowMoraleNames)} precisam de resposta.` : "Vestiario sem alerta grave."}</p></article>
          <article><span>Prospects</span><strong>${alerts.prospects}</strong><p>Potencial bem acima do atual.</p></article>
        </div>
        <div class="procedural-roster-controls">
          <label>
            <span>Posicao</span>
            <select data-roster-filter="position">
              <option value="all" ${view.position === "all" ? "selected" : ""}>Todas</option>
              ${positions.map((position) => `<option value="${escapeHtml(position)}" ${view.position === position ? "selected" : ""}>${escapeHtml(position)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Ordenar por</span>
            <select data-roster-filter="sort">
              <option value="overall" ${view.sort === "overall" ? "selected" : ""}>Overall</option>
              <option value="potential" ${view.sort === "potential" ? "selected" : ""}>Potencial</option>
              <option value="fatigue" ${view.sort === "fatigue" ? "selected" : ""}>Fadiga</option>
              <option value="morale" ${view.sort === "morale" ? "selected" : ""}>Moral</option>
              <option value="age" ${view.sort === "age" ? "selected" : ""}>Idade</option>
            </select>
          </label>
        </div>
        ${renderVolleyballStatsPanel(state, roster)}
        <div class="procedural-roster-cards">
          ${cards || '<div class="procedural-empty">Nenhum atleta encontrado nesse filtro.</div>'}
        </div>
      </section>
    `;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    RosterUI: {
      renderRoster
    }
  };
})();
