(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getPlayerSport(player, options = {}) {
    if (options.sportId) return options.sportId;
    if (player.sportId) return player.sportId;
    if (player.attributes?.goalkeeping || player.goalkeeping || player.finishing || player.marking) return "futsal";
    if (player.attributes?.serve || player.serve || player.reception || player.setting) return "volei";
    return "basquete";
  }

  function getNarrativeTags(player, options, overall, potential, morale, fatigue) {
    const sportId = getPlayerSport(player, options);
    const tags = [];
    if (options.isStarter) tags.push("Titular provavel");
    else if (overall >= 72) tags.push("Sexto homem");
    else tags.push("Rotacao");
    if (potential - overall >= 8) tags.push("Projeto de desenvolvimento");
    if (potential - overall >= 10 || Number(player.age) <= 22) tags.push("Promessa");
    if (Number(player.age) >= 32) tags.push("Veterano");
    if (Number(player.age) >= 30 && morale >= 58) tags.push("Lider");
    if (morale <= 42) tags.push("Em baixa");
    if (!options.isStarter && overall >= 74 && morale <= 50) tags.push("Irritado com minutos");
    if (fatigue >= 65) tags.push("Risco fisico");
    if (sportId === "volei") {
      if (Number(player.reception || player.defense || 0) >= overall + 4) tags.push("Passe confiavel");
      if (Number(player.attack || player.serve || 0) >= overall + 4) tags.push("Pressao ofensiva");
      if (Number(player.block || 0) >= overall + 4) tags.push("Bloqueio forte");
    } else if (sportId === "futsal") {
      if (Number(player.finishing || 0) >= overall + 4) tags.push("Finalizador");
      if (Number(player.passing || player.tactical || 0) >= overall + 4) tags.push("Cria jogo");
      if (Number(player.marking || player.goalkeeping || 0) >= overall + 4) tags.push("Seguranca defensiva");
    } else {
      if (Number(player.defense || player.physical || 0) >= overall + 4) tags.push("Especialista defensivo");
      if (Number(player.threePoint || player.technique || 0) >= overall + 4) tags.push("Arremessador confiavel");
    }
    return Array.from(new Set(tags)).slice(0, 5);
  }

  function getRosterRole(options, overall) {
    if (options.isStarter) return "Titular provavel";
    if (overall >= 74) return "Sexto homem";
    if (overall >= 68) return "Rotacao";
    return "Desenvolvimento";
  }

  function getPhysicalStatus(fatigue, player) {
    const status = String(player.status || "").toLowerCase();
    if (status && status !== "disponivel") return player.status;
    if (fatigue >= 72) return "No limite";
    if (fatigue >= 60) return "Desgastado";
    if (fatigue <= 28) return "Inteiro";
    return "Disponivel";
  }

  function getRecentForm(player, morale, fatigue, overall) {
    const development = Number(player.developmentMomentum ?? player.development) || 1;
    if (fatigue >= 70 && morale <= 48) return "Queda fisica";
    if (morale >= 62 && fatigue <= 54) return "Em alta";
    if (development >= 1.12 && Number(player.age) <= 24) return "Evoluindo";
    if (overall >= 76 && morale >= 52) return "Confiavel";
    if (morale <= 42) return "Instavel";
    return "Regular";
  }

  function renderQuickActions() {
    const disabledHint = "Disponivel em etapa futura.";
    return `
      <div class="procedural-player-actions" aria-label="Acoes rapidas">
        <button type="button" disabled title="${disabledHint}">Detalhes</button>
        <button type="button" disabled title="${disabledHint}">Poupar</button>
        <button type="button" disabled title="${disabledHint}">Funcao</button>
        <button type="button" disabled title="${disabledHint}">Conversar</button>
      </div>
    `;
  }

  function getAttributeValue(player, key) {
    return Math.round(Number(player[key] ?? player.attributes?.[key]) || 0);
  }

  function getAttributeRows(player, options = {}) {
    const sportId = getPlayerSport(player, options);
    if (sportId === "volei") {
      return [
        ["Saque", "serve"],
        ["Ataque", "attack"],
        ["Bloqueio", "block"],
        ["Passe", "reception"],
        ["Levant.", "setting"],
        ["Defesa", "defense"]
      ];
    }
    if (sportId === "futsal") {
      return [
        ["Fin.", "finishing"],
        ["Passe", "passing"],
        ["Marc.", "marking"],
        ["Gol.", "goalkeeping"],
        ["Fisico", "physical"],
        ["Tatica", "tactical"]
      ];
    }
    return [
      ["3PT", "threePoint"],
      ["Fisico", "physical"],
      ["Tatica", "tactical"],
      ["Tecnica", "technique"],
      ["Defesa", "defense"]
    ];
  }

  function renderAttributePeek(player, options = {}) {
    const attributes = getAttributeRows(player, options);
    return `
      <div class="procedural-player-card__peek" aria-label="Atributos detalhados">
        <span>Raio-x do atleta</span>
        <div>
          ${attributes.map(([label, key]) => `
            <b>
              <em>${escapeHtml(label)}</em>
              <strong>${getAttributeValue(player, key)}</strong>
            </b>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderPlayerCard(player, options = {}) {
    const note = player.scoutNotes?.[0] || player.personality?.label || player.potentialLabel || "Perfil ainda em observacao.";
    const overall = Math.round(Number(player.currentAbility) || 0);
    const potential = Math.round(Number(player.potential) || 0);
    const morale = Math.round(Number(player.morale) || 0);
    const fatigue = Math.round(Number(player.fatigue) || 0);
    const tags = getNarrativeTags(player, options, overall, potential, morale, fatigue);
    const role = getRosterRole(options, overall);
    const physicalStatus = getPhysicalStatus(fatigue, player);
    const recentForm = getRecentForm(player, morale, fatigue, overall);
    const classes = [
      "procedural-player-card",
      fatigue >= 70 ? "is-tired" : "",
      options.isStarter ? "is-starter" : "",
      options.isProspect ? "is-prospect" : ""
    ].filter(Boolean).join(" ");
    return `
      <article class="${classes}" tabindex="0">
        <div class="procedural-player-card__head">
          <div>
            <strong>${escapeHtml(player.name)}</strong>
            <span>${escapeHtml(player.pos)} | ${player.age} anos</span>
            <em>${escapeHtml(role)}</em>
          </div>
          <span class="status-pill">${escapeHtml(player.status || "Disponivel")}</span>
        </div>
        <div class="procedural-player-life">
          <div><span>Status fisico</span><strong>${escapeHtml(physicalStatus)}</strong></div>
          <div><span>Forma recente</span><strong>${escapeHtml(recentForm)}</strong></div>
        </div>
        <div class="procedural-player-card__ratings">
          <div><span>OVR</span><strong>${overall}</strong></div>
          <div><span>POT</span><strong>${potential}</strong></div>
          <div><span>Moral</span><strong>${morale}</strong></div>
          <div><span>Fadiga</span><strong>${fatigue}</strong></div>
        </div>
        <div class="procedural-player-card__bars">
          <div class="procedural-card-bar"><span>Forca</span><i style="--bar-width:${overall}%"></i></div>
          <div class="procedural-card-bar morale"><span>Moral</span><i style="--bar-width:${morale}%"></i></div>
          <div class="procedural-card-bar fatigue"><span>Fadiga</span><i style="--bar-width:${fatigue}%"></i></div>
        </div>
        <div class="procedural-player-tags">
          ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <p>${escapeHtml(note)}</p>
        ${renderQuickActions()}
        ${renderAttributePeek(player, options)}
      </article>
    `;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    PlayerCardUI: {
      renderPlayerCard
    }
  };
})();
