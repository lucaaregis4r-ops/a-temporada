(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderWeeklyHub(root, data = {}) {
    if (!root) return;
    const seasonStarted = Boolean(data.seasonStarted);
    const weekLabel = seasonStarted ? `Semana ${data.round || 1}` : "Rodada nao iniciada";
    const nextGame = data.nextGame || "Proxima partida definida apos iniciar temporada";
    const standing = data.standing || "Tabela disponivel apos iniciar temporada";
    const morale = data.morale || "Moral ainda nao calculada";
    const budget = data.budget || "Orcamento em definicao";
    const alert = data.alert || "Sem alerta no momento";
    const decision = data.decision || "Sem decisao pendente";
    const primaryLabel = seasonStarted ? "Preparar semana" : "Montar elenco";
    const primaryTarget = seasonStarted ? "temporada" : "mercado";

    root.innerHTML = `
      <div class="weekly-hub__hero">
        <div>
          <span class="eyebrow">Central</span>
          <h3>${escapeHtml(weekLabel)}</h3>
          <p>${escapeHtml(nextGame)}</p>
        </div>
        <button class="primary-button" data-weekly-nav="${escapeHtml(primaryTarget)}" type="button">${escapeHtml(primaryLabel)}</button>
      </div>

      <div class="weekly-hub__grid">
        <article>
          <span>Situacao</span>
          <strong>${escapeHtml(standing)}</strong>
        </article>
        <article>
          <span>Moral</span>
          <strong>${escapeHtml(morale)}</strong>
        </article>
        <article>
          <span>Orcamento</span>
          <strong>${escapeHtml(budget)}</strong>
        </article>
        <article>
          <span>Alerta</span>
          <strong>${escapeHtml(alert)}</strong>
        </article>
      </div>

      <div class="weekly-hub__decision">
        <div>
          <span>Decisao</span>
          <strong>${escapeHtml(decision)}</strong>
        </div>
        <div class="weekly-hub__actions">
          <button class="secondary-button" data-weekly-nav="comissao" type="button">Ver elenco</button>
          <button class="secondary-button" data-weekly-nav="mercado" type="button">Ver mercado</button>
          <button class="secondary-button" data-weekly-nav="partida" type="button">Simular partida</button>
        </div>
      </div>
    `;
  }

  function bindWeeklyHubNavigation() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-weekly-nav]");
      if (!button) return;
      const target = button.dataset.weeklyNav;
      const tab = document.querySelector(`.tab-button[data-tab-target="${target}"]`);
      tab?.click();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindWeeklyHubNavigation);
  } else {
    bindWeeklyHubNavigation();
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    renderWeeklyHub
  };
})();
