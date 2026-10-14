(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatNumber(value, digits = 1) {
    const number = Number(value) || 0;
    return Number.isInteger(number) ? String(number) : number.toFixed(digits);
  }

  const UI_LABELS = {
    balanced: "Equilibrado",
    budget: "Orcamento curto",
    conservative: "Conservador",
    development: "Formacao",
    development_roster: "Elenco em formacao",
    defensive_team: "Defesa como identidade",
    fast_pace: "Ritmo acelerado",
    foreign_core: "Base estrangeira",
    high_pressure: "Pressao por resultado",
    low_budget_fight: "Orcamento curto",
    prospect_heavy: "Muitas promessas",
    selling_club: "Clube vendedor",
    unbalanced: "Elenco irregular",
    veteran_core: "Nucleo veterano",
    win_now: "Resultado imediato",
    young_promises: "Promessas da base"
  };

  function labelFor(value, fallback = "-") {
    const text = String(value ?? "").trim();
    if (!text) return fallback;
    return UI_LABELS[text] || UI_LABELS[text.toLowerCase()] || text.replaceAll("_", " ");
  }

  function getUserStanding(state) {
    return (state.standings || []).find((row) => row.teamId === state.userTeam?.id) || null;
  }

  function isVolleyball(state) {
    return state?.sportId === "volei" || state?.userTeam?.sportId === "volei";
  }

  function getFinancialRisk(summary) {
    const budgetLeft = Number(summary.budgetLeft) || 0;
    if (budgetLeft < 0) return { label: "Pressionado", text: "Folha acima do orcamento planejado.", tone: "danger" };
    if (budgetLeft < 6) return { label: "Apertado", text: "Pouca margem para ajustes.", tone: "warning" };
    return { label: "Controlado", text: "Ha margem para administrar a temporada.", tone: "good" };
  }

  function getPressureRead(state, standing) {
    const losses = Number(standing?.losses) || 0;
    const wins = Number(standing?.wins) || 0;
    const objective = String(state.userTeam?.objective || "").toLowerCase();
    if (objective.includes("titulo") || objective.includes("playoff")) {
      return losses > wins ? "Alta: campanha precisa responder ao objetivo." : "Moderada: a meta exige consistencia.";
    }
    if (losses >= wins + 2) return "Alta: a sequencia ruim ja cria ruido.";
    return "Controlada: ainda ha espaco para construir a campanha.";
  }

  function getRecentForm(state) {
    const matches = (state.log || []).filter((entry) => entry.type === "match").slice(0, 5);
    if (!matches.length) return isVolleyball(state) ? "Sem partidas" : "Sem jogos";
    return matches.map((entry) => entry.title.toLowerCase().includes("vitoria") ? "V" : "D").reverse().join(" ");
  }

  function getSuggestedFocus(summary, standing) {
    const fatigue = Number(summary.fatigueAverage) || 0;
    const morale = Number(summary.moraleAverage) || 0;
    const chemistry = Number(summary.chemistry) || 0;
    const losses = Number(standing?.losses) || 0;
    const wins = Number(standing?.wins) || 0;
    if (fatigue >= 58) return "recovery";
    if (morale <= 46) return "chemistry";
    if (chemistry <= 48) return "training";
    if (losses > wins) return "results";
    return "balanced";
  }

  const FOCUS_LABELS = {
    balanced: "Plano equilibrado",
    recovery: "Recuperar elenco",
    training: "Treino forte",
    chemistry: "Fechar grupo",
    results: "Buscar resultado"
  };

  const VOLLEY_FOCUS_LABELS = {
    balanced: "Plano equilibrado",
    recovery: "Recuperar salto",
    training: "Treinar saque",
    chemistry: "Ajustar passe",
    results: "Fechar set"
  };

  function getFocusLabels(state) {
    return isVolleyball(state) ? VOLLEY_FOCUS_LABELS : FOCUS_LABELS;
  }

  function renderBar(label, value, className = "") {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
    return `
      <div class="procedural-team-bar ${className}">
        <span>${escapeHtml(label)}</span>
        <strong>${formatNumber(safeValue, 0)}</strong>
        <i style="--bar-width:${safeValue}%"></i>
      </div>
    `;
  }

  function renderTeamHub(state) {
    const team = state.userTeam || {};
    const summary = state.summary || {};
    const standing = getUserStanding(state);
    const finance = getFinancialRisk(summary);
    const suggestedFocus = getSuggestedFocus(summary, standing);
    const activeFocus = state.teamState?.weeklyFocus || "balanced";
    const focusLabels = getFocusLabels(state);
    return `
      <section class="procedural-game-section">
        <div class="procedural-team-hero">
          <div>
            <span class="eyebrow">Seu clube · semana ${state.currentWeek || 1}</span>
            <h2>${escapeHtml(team.name || "Seu clube")}</h2>
            <p>${escapeHtml(team.lore?.opening || team.lore?.description || "Sua equipe tem uma temporada pela frente.")}</p>
            ${team.lore?.dilemma && team.lore.dilemma !== (team.lore?.opening || team.lore?.description) ? `<p class="procedural-team-dilemma"><strong>O desafio:</strong> ${escapeHtml(team.lore.dilemma)}</p>` : ""}
          </div>
          <div class="procedural-team-badge">
            <span>Objetivo</span>
            <strong>${escapeHtml(team.objective || "-")}</strong>
          </div>
        </div>

        <div class="procedural-team-command-grid">
          <article class="procedural-team-command-card is-primary">
            <span>Leitura da comissao</span>
            <strong>${escapeHtml(getPressureRead(state, standing))}</strong>
            <p>Forma recente: ${escapeHtml(getRecentForm(state))} | Campanha: ${standing ? `${standing.wins}-${standing.losses}` : "0-0"}</p>
          </article>
          <article class="procedural-team-command-card ${finance.tone}">
            <span>Risco financeiro</span>
            <strong>${escapeHtml(finance.label)}</strong>
            <p>${escapeHtml(finance.text)} Sobra: $${formatNumber(summary.budgetLeft)}M</p>
          </article>
          <article class="procedural-team-command-card">
            <span>Foco sugerido</span>
            <strong>${escapeHtml(focusLabels[suggestedFocus])}</strong>
            <p>O plano desta semana ajuda a responder ao objetivo do clube.</p>
          </article>
        </div>

        <div class="procedural-team-bars">
          ${renderBar("Quimica", summary.chemistry, "chemistry")}
          ${renderBar("Moral", summary.moraleAverage, "morale")}
          ${renderBar("Fadiga", summary.fatigueAverage, "fatigue")}
          ${renderBar("Forca media", summary.overallAverage, "strength")}
        </div>

        <div class="procedural-focus-panel">
          <div>
            <span class="eyebrow">Foco semanal</span>
            <h3>${escapeHtml(focusLabels[activeFocus] || focusLabels.balanced)}</h3>
            <p>${isVolleyball(state) ? "As escolhas da comissao moldam saque, recepcao, cobertura e energia da semana." : "As escolhas da comissao moldam o ambiente da semana e ficam registradas no diario da temporada."}</p>
          </div>
          <div class="procedural-focus-actions">
            <button class="${activeFocus === "balanced" ? "is-active" : ""}" data-team-focus="balanced" type="button">Equilibrar</button>
            <button class="${activeFocus === "recovery" ? "is-active" : ""}" data-team-focus="recovery" type="button">Recuperar</button>
            <button class="${activeFocus === "training" ? "is-active" : ""}" data-team-focus="training" type="button">${isVolleyball(state) ? "Treinar saque" : "Treinar forte"}</button>
            <button class="${activeFocus === "chemistry" ? "is-active" : ""}" data-team-focus="chemistry" type="button">${isVolleyball(state) ? "Ajustar passe" : "Fechar grupo"}</button>
            <button class="${activeFocus === "results" ? "is-active" : ""}" data-team-focus="results" type="button">${isVolleyball(state) ? "Fechar set" : "Resultado"}</button>
          </div>
        </div>

        <div class="procedural-roster-notes">
          <article>
            <span>${isVolleyball(state) ? "Sistema de jogo" : "Estilo de jogo"}</span>
            <strong>${escapeHtml(labelFor(team.rosterStyle || team.marketBehavior?.focus))}</strong>
          </article>
          <article>
            <span>Pontos fortes</span>
            <strong>${team.strengths?.length ? team.strengths.map(escapeHtml).join(" | ") : "A descobrir"}</strong>
          </article>
          <article>
            <span>Fraquezas</span>
            <strong>${team.weaknesses?.length ? team.weaknesses.map(escapeHtml).join(" | ") : "A descobrir"}</strong>
          </article>
          <article>
            <span>${isVolleyball(state) ? "Radar futuro" : "Mercado"}</span>
            <strong>${escapeHtml(labelFor(team.marketBehavior?.aggressiveness, "Seletivo"))} | ${escapeHtml(labelFor(team.marketBehavior?.focus, "Equilibrado"))}</strong>
          </article>
        </div>
      </section>
    `;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    TeamHubUI: {
      renderTeamHub
    }
  };
})();
