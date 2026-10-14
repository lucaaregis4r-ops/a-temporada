(function () {
  const DEFAULT_SEED = "CARREIRA-PROCEDURAL-2026";
  const DEBUG_MODE = new URLSearchParams(window.location.search).get("debug") === "1";
  const UI_LABELS = {
    balanced: "Equilibrado",
    budget: "Orcamento curto",
    conservative: "Conservador",
    development: "Formacao",
    development_roster: "Elenco em formacao",
    defensive_team: "Defesa como identidade",
    "arremesso acima da media": "Arremesso confiavel",
    "ataque e saque acima da media": "Pressao ofensiva forte",
    "base defensiva confiavel": "Defesa bem montada",
    "bom teto de desenvolvimento": "Jovens com margem de evolucao",
    "chance criada sem conversao": "Finalizacao oscila",
    "defesa vulneravel": "Defesa exposta",
    "defesa vulneravel em transicao": "Sofre em transicao",
    fast_pace: "Ritmo acelerado",
    "flexibilidade financeira": "Margem para se mexer no mercado",
    "folha acima do orcamento": "Folha pressionada",
    "finalizacao acima da media": "Finalizacao forte",
    foreign_core: "Base estrangeira",
    high_pressure: "Pressao por resultado",
    low_budget_fight: "Orcamento curto",
    "pouca margem de crescimento": "Elenco perto do teto",
    prospect_heavy: "Muitas promessas",
    "recepcao e bloqueio confiaveis": "Recepcao e bloqueio seguros",
    "risco de envelhecimento": "Perde intensidade com o calendario",
    selling_club: "Clube vendedor",
    "espacamento inconsistente": "Ataque oscila sem espaco",
    "experiencia": "Veteranos decidem jogos apertados",
    "linha de passe vulneravel": "Passe sofre sob pressao",
    "marcacao e goleiro confiaveis": "Marcacao e goleiro seguros",
    "pressao ofensiva irregular": "Ataque alterna bons e maus momentos",
    unbalanced: "Elenco irregular",
    veteran_core: "Nucleo veterano",
    win_now: "Resultado imediato",
    young_promises: "Promessas da base"
  };
  const TABS = [
    ["hub", "Central", "🏢"],
    ["roster", "Elenco & Tática", "📋"],
    ["league", "Tabela & Rodadas", "🏆"],
    ["story", "Crônicas & Decisões", "📜"],
    ["saves", "Saves", "💾"]
  ];
  const TAB_GROUPS = [
    ["Menu", ["hub", "roster", "league", "story", "saves"]]
  ];
  let latestMarketFit = null;

  function formatChoiceBadges(choice) {
    const eff = choice?.effects || {};
    const badges = [];
    if (eff.morale) badges.push(`<span class="effect-badge is-${eff.morale > 0 ? "good" : "bad"}">${eff.morale > 0 ? "+" : ""}${eff.morale} Moral</span>`);
    if (eff.chemistry) badges.push(`<span class="effect-badge is-${eff.chemistry > 0 ? "good" : "bad"}">${eff.chemistry > 0 ? "+" : ""}${eff.chemistry} Química</span>`);
    if (eff.fatigue) badges.push(`<span class="effect-badge is-${eff.fatigue > 0 ? "bad" : "good"}">${eff.fatigue > 0 ? "+" : ""}${eff.fatigue} Cansaço</span>`);
    if (eff.attack) badges.push(`<span class="effect-badge is-buff">+${eff.attack} Ataque</span>`);
    if (eff.defense) badges.push(`<span class="effect-badge is-buff">+${eff.defense} Defesa</span>`);
    if (eff.clutch) badges.push(`<span class="effect-badge is-buff">+${eff.clutch} Momento</span>`);
    if (eff.development) badges.push(`<span class="effect-badge is-buff">+${eff.development} Evolução</span>`);
    if (eff.fanTrust) badges.push(`<span class="effect-badge is-${eff.fanTrust > 0 ? "good" : "bad"}">${eff.fanTrust > 0 ? "+" : ""}${eff.fanTrust} Torcida</span>`);
    if (eff.boardPressure) badges.push(`<span class="effect-badge is-${eff.boardPressure < 0 ? "good" : "bad"}">${eff.boardPressure > 0 ? "+" : ""}${eff.boardPressure} Diretoria</span>`);
    if (!badges.length) {
      badges.push(`<span class="effect-badge is-buff">⚖️ Impacto Tático</span>`);
    }
    return badges.join("");
  }

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

  function labelFor(value, fallback = "-") {
    const text = String(value ?? "").trim();
    if (!text) return fallback;
    return UI_LABELS[text] || UI_LABELS[text.toLowerCase()] || text.replaceAll("_", " ");
  }

  function isMarketAvailable(state) {
    return Number(state.currentWeek || 1) <= 1;
  }

  function isVolleyball(state) {
    return state?.sportId === "volei" || state?.userTeam?.sportId === "volei";
  }

  function isFutsal(state) {
    return state?.sportId === "futsal" || state?.userTeam?.sportId === "futsal";
  }

  function getVisibleTabs() {
    return TABS.slice();
  }

  function getClubOpening(team) {
    return team?.lore?.opening || team?.lore?.description || "Uma nova temporada espera por suas escolhas.";
  }

  function getClubDilemma(team) {
    return team?.lore?.dilemma || team?.lore?.description || "Cada decisao pode mudar o rumo da campanha.";
  }

  function getUserStanding(state) {
    return (state.standings || []).find((row) => row.teamId === state.userTeam?.id) || null;
  }

  function getNextMatchLabel(state) {
    const next = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    return next ? `Dia ${next.day} - ${next.title}` : isVolleyball(state) ? "Sem partidas pendentes" : "Sem jogos pendentes";
  }

  function getNextMatchShortLabel(state) {
    const next = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    if (!next) return isVolleyball(state) ? "Sem partida marcada" : "Sem jogo marcado";
    return `Dia ${next.day} contra ${next.opponentName || String(next.title || "").replace(/^.*contra\s+/i, "")}`;
  }

  function getTodayEvents(state) {
    return window.TemporadaTotal.CalendarEngine?.getEventsForDay?.(state) || [];
  }

  function getMainTodayEvent(state) {
    return getTodayEvents(state)[0] || null;
  }

  function getEventLabel(type) {
    const labels = {
      training: "Treino",
      rest: "Descanso",
      match: "Jogo",
      narrative: "Bastidor",
      decision: "Decisao",
      market: "Mercado",
      team: "Comissao",
      system: "Temporada"
    };
    return labels[type] || "Livre";
  }

  function getEventIcon(type) {
    const icons = {
      training: "TR",
      rest: "DS",
      match: "JG",
      narrative: "BT",
      decision: "DC",
      market: "MK",
      team: "CM",
      system: "TP"
    };
    return icons[type] || "--";
  }

  function getMoraleRead(value) {
    const number = Number(value) || 0;
    if (number >= 68) return "alta";
    if (number >= 52) return "estavel";
    if (number >= 40) return "sensivel";
    return "pressionada";
  }

  function getChemistryRead(value) {
    const number = Number(value) || 0;
    if (number >= 68) return "forte";
    if (number >= 52) return "boa";
    if (number >= 40) return "em ajuste";
    return "fragil";
  }

  function getFatigueRead(value) {
    const number = Number(value) || 0;
    if (number >= 70) return "alta";
    if (number >= 48) return "pedindo cuidado";
    if (number >= 28) return "controlada";
    return "baixa";
  }

  function getRecordRead(record) {
    const [wins, losses] = String(record || "0-0").split("-").map((value) => Number(value) || 0);
    if (!wins && !losses) return "temporada abrindo";
    if (wins > losses + 1) return "bom inicio";
    if (losses > wins + 1) return "inicio dificil";
    return "campanha equilibrada";
  }

  function getDecisionTextParts(decision) {
    const text = String(decision?.text || decision?.situation || "").trim();
    const contextIndex = text.search(/\b(Contexto da lore|Objetivo atual|Vi[eé]s narrativo):/i);
    const firstContextIndex = [contextIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
    const cleanLead = (value) => String(value || "")
      .replace(/^\[[^\]]+\]\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (firstContextIndex >= 0) {
      return {
        lead: cleanLead(text.slice(0, firstContextIndex)),
        context: ""
      };
    }
    return { lead: cleanLead(text), context: "" };
  }

  function getFinancialRead(summary) {
    const budgetLeft = Number(summary?.budgetLeft) || 0;
    if (budgetLeft < 0) return "Folha acima do planejado";
    if (budgetLeft < 6) return "Margem curta";
    return "Financas sob controle";
  }

  function getMarketMoneyRead(state) {
    const summary = state.summary || {};
    const team = state.userTeam || {};
    const budget = Number(summary.budget ?? team.budget ?? team.roster?.summary?.budget ?? 0);
    const totalSalary = Number(summary.totalSalary ?? team.roster?.summary?.totalSalary ?? 0);
    const budgetLeft = Number(summary.budgetLeft ?? (budget - totalSalary));
    const loreLabel = team.lore?.label || team.loreLabel || "Contexto da carreira";
    return {
      budget,
      totalSalary,
      budgetLeft,
      loreLabel,
      status: getFinancialRead({ budgetLeft })
    };
  }

  function getBoardPressure(state) {
    const standing = getUserStanding(state);
    const wins = Number(standing?.wins) || 0;
    const losses = Number(standing?.losses) || 0;
    const objective = String(state.userTeam?.objective || "").toLowerCase();
    if ((objective.includes("titulo") || objective.includes("playoff")) && losses > wins) return "Alta";
    if (losses >= wins + 2) return "Crescente";
    return "Controlada";
  }

  function getFanTrust(state) {
    const summary = state.summary || {};
    const standing = getUserStanding(state);
    const wins = Number(standing?.wins) || 0;
    const losses = Number(standing?.losses) || 0;
    const base = 52 + (wins - losses) * 6 + (Number(summary.moraleAverage) - 50) * 0.35;
    return Math.max(10, Math.min(95, Math.round(base)));
  }

  function getTeamRating(team) {
    return Number(team?.rating?.overall) || 0;
  }

  function getTeamStanding(state, teamId) {
    return (state.standings || []).find((row) => row.teamId === teamId) || null;
  }

  function getRatingRead(team, averageRating) {
    const rating = getTeamRating(team);
    const gap = rating - (Number(averageRating) || rating);
    if (gap >= 4) return "Acima da media da liga";
    if (gap <= -4) return "Abaixo da media da liga";
    return "No pelotao central";
  }

  function getTeamThreatRead(team) {
    const rawStrength = team?.strengths?.[0];
    if (rawStrength) return labelFor(rawStrength, "Elenco equilibrado");
    const rating = getTeamRating(team);
    if (rating >= 80) return "Qualidade para decidir jogos";
    if ((Number(team?.rating?.potential) || 0) - (Number(team?.rating?.current) || 0) >= 7) return "Jovens com margem de evolucao";
    return "Elenco competitivo";
  }

  function getTeamWeaknessRead(team) {
    const rawWeakness = team?.weaknesses?.[0];
    if (rawWeakness) return labelFor(rawWeakness, "A descobrir");
    const rating = getTeamRating(team);
    if (rating < 72) return "Pouca profundidade no elenco";
    if (Number(team?.rating?.averageAge) >= 30) return "Perde intensidade com o calendario";
    return "A descobrir";
  }

  function getOpponentRead(state, team, averageRating) {
    const style = labelFor(team?.rosterStyle || team?.marketBehavior?.focus, "Equilibrado");
    const ratingRead = getRatingRead(team, averageRating).toLowerCase();
    const nextEvent = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    const isNext = nextEvent?.opponentId === team?.id;
    const dateText = isNext ? `Proximo encontro no dia ${nextEvent.day}. ` : "";
    return `${dateText}${style}, ${ratingRead}. ${getTeamThreatRead(team)}; ${getTeamWeaknessRead(team).toLowerCase()}.`;
  }

  function getMainWeeklyAlert(state) {
    const summary = state.summary || {};
    if (state.pendingDecision) return "Ha uma decisao de bastidor esperando resposta.";
    if (Number(summary.fatigueAverage) >= 62) {
      return isVolleyball(state) ? "A linha de passe e o salto dos atacantes pedem controle de carga." : "O elenco pede controle de carga.";
    }
    if (Number(summary.moraleAverage) <= 45) return "O vestiario precisa de uma resposta emocional.";
    if (Number(summary.chemistry) <= 45) {
      return isVolleyball(state) ? "A equipe ainda busca sincronia entre recepcao, levantamento e ataque." : "A equipe ainda busca identidade coletiva.";
    }
    return isVolleyball(state) ? "Ambiente estavel para preparar a proxima partida e ajustar o saque." : "Ambiente estavel para preparar a proxima rodada.";
  }

  function getCommissionRead(state) {
    const team = state.userTeam || {};
    const summary = state.summary || {};
    const rosterGap = Number(summary.potentialAverage || 0) - Number(summary.overallAverage || 0);
    if (isVolleyball(state)) {
      if (Number(summary.fatigueAverage) >= 62) {
        return "A comissao ve um time competitivo, mas a carga de salto e deslocamento ja pesa. Controlar treino pode proteger ataque, bloqueio e recepcao.";
      }
      if (rosterGap >= 7) {
        return "O elenco tem margem de evolucao. A temporada pede rallies para os jovens sem quebrar a estabilidade da linha de passe.";
      }
      if (String(team.objective || "").toLowerCase().includes("titulo")) {
        return "A janela pede urgencia. Saque agressivo, recepcao estavel e bloqueio consistente precisam virar sets antes que a pressao cresca.";
      }
      return "A equipe ainda esta construindo sistema. As proximas semanas vao mostrar se recepcao, levantamento e ataque conseguem funcionar sob pressao.";
    }
    if (Number(summary.fatigueAverage) >= 62) {
      return "A comissao ve um grupo competitivo, mas a carga fisica ja cobra preco. Recuperar pernas pode valer mais que empilhar treinos.";
    }
    if (rosterGap >= 7) {
      return "O elenco tem teto interessante de desenvolvimento. A temporada pede equilibrio entre resultado imediato e minutos para quem ainda esta crescendo.";
    }
    if (String(team.objective || "").toLowerCase().includes("titulo")) {
      return "A janela exige urgencia. O elenco precisa transformar reputacao em vitorias antes que a pressao vire ruido.";
    }
    return "A equipe ainda esta construindo identidade. As proximas semanas vao revelar se o plano aguenta jogo, mercado e vestiario.";
  }

  const FOCUS_COPY = {
    balanced: ["Equilibrar", "Mantem o grupo estavel e evita extremos de carga."],
    recovery: ["Recuperar", "Reduz fadiga e protege jogadores mais desgastados."],
    training: ["Treinar forte", "Aumenta entrosamento, mas cobra fisicamente."],
    chemistry: ["Fechar grupo", "Prioriza moral e vestiario para atravessar pressao."],
    results: ["Resultado", "Aperta a cobranca por vitorias, com mais desgaste."]
  };

  const VOLLEY_FOCUS_COPY = {
    balanced: ["Equilibrar", "Mantem carga, recepcao e ataque sem extremos."],
    recovery: ["Recuperar", "Protege salto, ombro e pernas dos atletas mais exigidos."],
    training: ["Treinar saque", "Aumenta pressao de saque e sincronismo, mas cobra fisicamente."],
    chemistry: ["Ajustar passe", "Prioriza comunicacao entre recepcao, levantador e cobertura."],
    results: ["Fechar set", "Aperta a cobranca por viradas e pontos decisivos, com mais desgaste."]
  };

  function getFocusCopy(state) {
    return isVolleyball(state) ? VOLLEY_FOCUS_COPY : FOCUS_COPY;
  }

  function renderFocusDecisionPanel(state, compact = false) {
    const activeFocus = state.teamState?.weeklyFocus || "balanced";
    const focusCopy = getFocusCopy(state);
    return `
      <div class="${compact ? "club-focus-panel compact" : "club-focus-panel"}">
        <div>
          <span class="eyebrow">Decisao da semana</span>
          <h3>${escapeHtml(focusCopy[activeFocus]?.[0] || "Equilibrar")}</h3>
          <p>${isVolleyball(state) ? "As escolhas da comissao moldam saque, recepcao, cobertura e desgaste da semana." : "As escolhas da comissao moldam o ambiente da semana e ficam registradas nos bastidores da temporada."}</p>
        </div>
        <div class="club-focus-actions">
          ${Object.entries(focusCopy).map(([key, [label, description]]) => `
            <button class="${activeFocus === key ? "is-active" : ""}" data-team-focus="${key}" type="button">
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(description)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderVolleyballImpactPanel(state) {
    if (!isVolleyball(state)) return "";
    const impact = state.teamState?.volleyballImpact || {};
    const rows = [
      ["Saque", impact.serve],
      ["Passe", impact.reception],
      ["Ataque", impact.attack],
      ["Bloqueio", impact.block],
      ["Defesa", impact.defense],
      ["Carga", impact.load, true]
    ];
    const hasImpact = rows.some(([, value]) => Math.abs(Number(value) || 0) >= 0.2);
    return `
      <article class="volley-impact-panel">
        <div>
          <span class="eyebrow">Impacto de quadra</span>
          <h3>${hasImpact ? "Decisoes mexendo no jogo" : "Sem tendencia forte ainda"}</h3>
          <p>${hasImpact ? escapeHtml(impact.lastLabel || "As escolhas recentes criaram tendencias para a semana.") : "Tome decisoes no calendario para criar vantagens ou riscos nos fundamentos."}</p>
          ${hasImpact && impact.lastSummary ? `<p class="volley-impact-summary">${escapeHtml(impact.lastSummary)}</p>` : ""}
        </div>
        <div class="volley-impact-grid">
          ${rows.map(([label, value, inverted]) => {
            const number = Number(value) || 0;
            const good = inverted ? number < 0 : number > 0;
            const bad = inverted ? number > 0 : number < 0;
            return `
              <div class="${good ? "is-good" : bad ? "is-bad" : ""}">
                <span>${escapeHtml(label)}</span>
                <strong>${number > 0 ? "+" : ""}${formatNumber(number, 1)}</strong>
              </div>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }

  function getCareerSaves(folderSaves = []) {
    const sportId = document.body.dataset.sportId || window.SEASON_RUNTIME?.sport?.id || "basquete";
    const sportVariant = document.body.dataset.sportVariant || document.querySelector("[data-procedural-game-root]")?.dataset?.sportVariant || "";
    const localSaves = (window.TemporadaTotal?.ProceduralCareerSave?.listCareers?.({ sportId, sportVariant }) || [])
      .map((save) => ({ ...save, source: save.source || "local" }));
    const merged = new Map();
    [...folderSaves, ...localSaves].forEach((save) => {
      const key = `${save.source || "local"}:${save.id}`;
      if (!merged.has(key)) merged.set(key, save);
    });
    return Array.from(merged.values());
  }

  function getDefaultCareerName(state) {
    return state.careerMeta?.name || `${state.userTeam?.name || "Carreira"} - Temporada`;
  }

  function createSeedValue() {
    return `temporada-${Math.random().toString(36).slice(2, 8)}`;
  }

  function getTeamInitials(name = "") {
    return String(name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "TT";
  }

  function hashText(value) {
    return String(value ?? "A-TEMPORADA").split("").reduce((hash, char) => {
      hash ^= char.charCodeAt(0);
      return Math.imul(hash, 16777619) >>> 0;
    }, 2166136261);
  }

  function seededPick(rows, hash, offset = 0) {
    return rows[(hash + offset) % rows.length];
  }

  const CREST_PALETTES = [
    { id: "gold-black", label: "Ouro / preto", colors: ["#ffb000", "#071014"] },
    { id: "lime-green", label: "Lima / verde", colors: ["#c6ff00", "#10231c"] },
    { id: "orange-cream", label: "Laranja / claro", colors: ["#ff5a1f", "#fff4dc"] },
    { id: "blue-night", label: "Azul / noite", colors: ["#5da9ff", "#081523"] },
    { id: "mint-dark", label: "Verde / escuro", colors: ["#18b88f", "#061813"] },
    { id: "ivory-steel", label: "Marfim / aço", colors: ["#f7f1df", "#1c2430"] },
    { id: "red-white", label: "Vermelho / branco", colors: ["#e73946", "#fff7ed"] },
    { id: "purple-yellow", label: "Roxo / amarelo", colors: ["#6b46ff", "#ffe66d"] }
  ];
  const CREST_SHAPES = [
    ["shield", "Escudo"],
    ["circle", "Circulo"],
    ["diamond", "Losango"],
    ["round", "Bloco"],
    ["banner", "Estandarte"],
    ["hex", "Hexagono"]
  ];
  const CREST_PATTERNS = [
    ["stripe", "Faixa"],
    ["split", "Dividido"],
    ["band", "Barra"],
    ["chevron", "Chevron"],
    ["rings", "Aros"],
    ["plain", "Limpo"]
  ];
  const CREST_SYMBOLS = [
    ["ball", "Bola"],
    ["star", "Estrela"],
    ["bolt", "Raio"],
    ["crown", "Coroa"],
    ["mountain", "Montanha"],
    ["wing", "Asa"],
    ["flame", "Chama"],
    ["wave", "Onda"]
  ];

  function getCrestPalette(id, hash) {
    const fallback = seededPick(CREST_PALETTES, hash);
    return CREST_PALETTES.find((palette) => palette.id === id) || fallback;
  }

  function getGeneratedCrestConfig(team = {}) {
    const seed = `${team.leagueSeed || ""}:${team.id || ""}:${team.name || ""}:${team.city || ""}`;
    const hash = hashText(seed);
    return {
      palette: seededPick(CREST_PALETTES, hash).id,
      shape: seededPick(CREST_SHAPES.map(([id]) => id), hash, 3),
      pattern: seededPick(CREST_PATTERNS.map(([id]) => id), hash, 11),
      symbol: seededPick(CREST_SYMBOLS.map(([id]) => id), hash, 19),
      initials: getTeamInitials(team.name)
    };
  }

  function getCrestConfig(team = {}, overrides = null) {
    const base = {
      ...getGeneratedCrestConfig(team),
      ...(team.customCrest || {})
    };
    const next = {
      ...base,
      ...(overrides || {})
    };
    next.initials = String(next.initials || getTeamInitials(team.name)).slice(0, 3).toUpperCase();
    return next;
  }

  function renderCrestSymbol(symbol, color) {
    if (symbol === "star") return `<path d="M50 24l7 16 17 1-13 11 4 17-15-9-15 9 4-17-13-11 17-1 7-16z" fill="${color}"/>`;
    if (symbol === "bolt") return `<path d="M55 20L33 53h14l-5 27 25-38H52l3-22z" fill="${color}"/>`;
    if (symbol === "crown") return `<path d="M27 62h46l4-29-16 13-11-20-11 20-16-13 4 29zm2 8h42v8H29z" fill="${color}"/>`;
    if (symbol === "mountain") return `<path d="M22 70l20-36 10 16 8-11 18 31H22zm20-21l-8 15h18l-10-15z" fill="${color}"/>`;
    if (symbol === "wing") return `<path d="M23 57c20-25 39-27 55-23-13 6-20 14-23 24 9-5 17-7 25-6-12 8-25 14-42 17l-15-12z" fill="${color}"/>`;
    if (symbol === "flame") return `<path d="M51 22c11 12 5 20 15 29 6 5 8 13 4 20-4 8-12 12-21 12-13 0-23-9-23-21 0-10 6-16 14-24 3 8 8 11 13 11-5-10-5-18-2-27z" fill="${color}"/>`;
    if (symbol === "wave") return `<path d="M21 58c10-12 22-12 34-3 9 7 17 7 25-2v13c-10 10-21 10-33 1-9-7-17-7-26 2V58z" fill="${color}"/>`;
    return `<circle cx="50" cy="50" r="18" fill="none" stroke="${color}" stroke-width="8"/><path d="M32 50h36M50 32c8 8 8 28 0 36M50 32c-8 8-8 28 0 36" fill="none" stroke="${color}" stroke-width="4"/>`;
  }

  function renderClubCrest(team = {}, className = "") {
    const seed = `${team.leagueSeed || ""}:${team.id || ""}:${team.name || ""}:${team.city || ""}`;
    const hash = hashText(seed);
    const custom = getCrestConfig(team);
    const palette = getCrestPalette(custom.palette, hash);
    const [primary, secondary] = palette.colors;
    const shape = custom.shape;
    const pattern = custom.pattern;
    const symbol = custom.symbol;
    const initials = escapeHtml(custom.initials);
    const shapeMarkup = shape === "circle"
      ? `<circle cx="50" cy="50" r="43" fill="${primary}"/>`
      : shape === "diamond"
        ? `<path d="M50 6l42 44-42 44L8 50 50 6z" fill="${primary}"/>`
        : shape === "round"
          ? `<rect x="9" y="9" width="82" height="82" rx="24" fill="${primary}"/>`
          : shape === "banner"
            ? `<path d="M18 10h64v76L50 72 18 86V10z" fill="${primary}"/>`
            : shape === "hex"
              ? `<path d="M50 6l37 22v44L50 94 13 72V28L50 6z" fill="${primary}"/>`
          : `<path d="M50 6l38 12v30c0 23-15 39-38 47C27 87 12 71 12 48V18L50 6z" fill="${primary}"/>`;
    const patternMarkup = pattern === "stripe"
      ? `<path d="M17 77L77 17h15L32 77H17z" fill="${secondary}" opacity=".32"/>`
      : pattern === "split"
        ? `<path d="M50 6h42v88H50z" fill="${secondary}" opacity=".24"/>`
        : pattern === "band"
          ? `<path d="M10 42h80v18H10z" fill="${secondary}" opacity=".28"/>`
          : pattern === "chevron"
            ? `<path d="M17 33l33 22 33-22v18L50 73 17 51V33z" fill="${secondary}" opacity=".3"/>`
            : pattern === "rings"
              ? `<circle cx="50" cy="50" r="35" fill="none" stroke="${secondary}" stroke-width="8" opacity=".22"/><circle cx="50" cy="50" r="21" fill="none" stroke="${secondary}" stroke-width="5" opacity=".18"/>`
          : "";
    return `
      <span class="club-crest ${className}" aria-label="Escudo ${escapeHtml(team.name || "do clube")}">
        <svg viewBox="0 0 100 100" role="img" focusable="false">
          ${shapeMarkup}
          ${patternMarkup}
          ${renderCrestSymbol(symbol, secondary)}
          <text x="50" y="84" text-anchor="middle" fill="${secondary}" font-size="18" font-weight="900" font-family="Arial, sans-serif">${initials}</text>
        </svg>
      </span>
    `;
  }

  function getTeamIndexById(gameState, teamId) {
    const index = (gameState?.league?.teams || []).findIndex((team) => team.id === teamId);
    return index >= 0 ? index : 0;
  }

  function getCustomizationFromRoot(root, fallback = {}) {
    const fallbackCrest = fallback.customCrest || {};
    return {
      teamName: root.querySelector("[data-seed-team-name]")?.value.trim() || fallback.teamName || "",
      customCrest: {
        palette: root.querySelector("[data-crest-palette]")?.value || fallbackCrest.palette || "",
        shape: root.querySelector("[data-crest-shape]")?.value || fallbackCrest.shape || "",
        pattern: root.querySelector("[data-crest-pattern]")?.value || fallbackCrest.pattern || "",
        symbol: root.querySelector("[data-crest-symbol]")?.value || fallbackCrest.symbol || "",
        initials: root.querySelector("[data-crest-initials]")?.value.trim().toUpperCase().slice(0, 3) || fallbackCrest.initials || ""
      }
    };
  }

  function applySeedCustomization(gameState, customization = {}) {
    if (!gameState?.userTeam) return gameState;
    const name = String(customization.teamName || "").trim();
    const crest = getCrestConfig(gameState.userTeam, customization.customCrest || {});
    const targetTeamId = gameState.userTeam.id;
    const updateTeam = (team) => {
      if (!team || team.id !== targetTeamId) return team;
      if (name) team.name = name;
      team.customCrest = {
        ...(team.customCrest || {}),
        ...crest,
        initials: String(crest.initials || getTeamInitials(name || team.name)).slice(0, 3).toUpperCase()
      };
      return team;
    };
    updateTeam(gameState.userTeam);
    (gameState.league?.teams || []).forEach(updateTeam);
    (gameState.standings || []).forEach((row) => {
      if (row.teamId === targetTeamId && name) row.name = name;
    });
    if (gameState.log?.[0]?.type === "system" && name) {
      gameState.log[0].text = `${name} abriu a campanha com uma promessa clara: transformar contexto em resultado.`;
    }
    return gameState;
  }

  function renderOptionList(rows, selected) {
    return rows.map(([id, label]) => `<option value="${escapeHtml(id)}" ${id === selected ? "selected" : ""}>${escapeHtml(label)}</option>`).join("");
  }

  function getContractProposals(leagueTeams) {
    if (!Array.isArray(leagueTeams) || !leagueTeams.length) return [];
    const indexed = leagueTeams.map((team, index) => ({ team, index }));
    indexed.sort((a, b) => (Number(b.team?.rating?.overall) || 0) - (Number(a.team?.rating?.overall) || 0));

    const favorite = indexed[0];
    const contenderIndex = Math.min(indexed.length - 2, Math.max(1, Math.floor(indexed.length * 0.45)));
    const contender = indexed[contenderIndex] || indexed[1] || indexed[0];
    const rebuild = indexed[indexed.length - 1];

    return [
      {
        ...favorite,
        archetype: "favorite",
        badge: "🏆 FAVORITO AO TÍTULO",
        tagline: "Pressão por Troféu & Alta Cobrança",
        accentClass: "is-favorite"
      },
      {
        ...contender,
        archetype: "contender",
        badge: "⚔️ O DESAFIANTE",
        tagline: "Disputa Forte por Vaga nos Playoffs",
        accentClass: "is-contender"
      },
      {
        ...rebuild,
        archetype: "rebuild",
        badge: "🚀 A RECONSTRUÇÃO",
        tagline: "Elenco Jovem & Orçamento Curto",
        accentClass: "is-rebuild"
      }
    ];
  }

  function renderSeedSetup(previewState, seedDraft, customization = {}, folderSaves = [], folderStatus = {}) {
    const leagueTeams = previewState?.league?.teams || [];
    const saves = getCareerSaves(folderSaves);
    const latestSave = saves[0] || null;
    const proposals = getContractProposals(leagueTeams);
    const selectedTeam = previewState?.userTeam || {};

    return `
      <section class="procedural-game-section arcade-draft-screen">
        <!-- 1. HERO DO DRAFT (ESTILO 7A0) -->
        <div class="arcade-draft-hero">
          <div class="arcade-draft-pill-tag">⚡ DRAFT DE CONTRATOS • A TEMPORADA</div>
          <h2 class="arcade-draft-title">ESCOLHA SEU DESAFIO</h2>
          <p class="arcade-draft-subtitle">
            3 propostas de contrato estão sobre a mesa. Cada projeto define seus objetivos, orçamento e a pressão do vestiário.
          </p>

          <div class="arcade-draft-quick-bar">
            <button class="arcade-btn-roll" data-game-action="random-seed" type="button" title="Gera novas propostas procedurais">
              <span class="btn-icon">🎲</span>
              <span class="btn-text">Sortear Novas Propostas (Roll)</span>
            </button>

            ${latestSave ? `
              <button class="arcade-btn-resume" data-game-action="load-career" data-career-id="${escapeHtml(latestSave.id)}" data-career-source="${escapeHtml(latestSave.source || "local")}" type="button">
                <span class="btn-icon">💾</span>
                <span class="btn-text">Continuar: <b>${escapeHtml(latestSave.name)}</b> (Semana ${latestSave.currentWeek || 1})</span>
              </button>
            ` : ""}
          </div>

          ${DEBUG_MODE ? `
            <div class="procedural-seed-form debug-seed-box">
              <label>
                <span>Código da temporada (Seed)</span>
                <input data-seed-draft type="text" value="${escapeHtml(seedDraft)}" autocomplete="off">
              </label>
              <div>
                <button class="secondary-button" data-game-action="random-seed" type="button">Gerar</button>
                <button class="secondary-button" data-game-action="update-seed-preview" type="button">Aplicar</button>
              </div>
            </div>
          ` : ""}
        </div>

        <!-- 2. CARDS DAS 3 PROPOSTAS -->
        <div class="arcade-proposals-grid">
          ${proposals.map((prop) => `
            <article class="arcade-proposal-card ${prop.accentClass} ${prop.team.id === selectedTeam.id ? "is-selected-preview" : ""}">
              <div class="proposal-card-header">
                <span class="proposal-archetype-badge">${prop.badge}</span>
                <span class="proposal-tagline">${prop.tagline}</span>
              </div>

              <div class="proposal-crest-wrapper">
                ${renderClubCrest(prop.team, "is-large")}
              </div>

              <div class="proposal-club-info">
                <h3 class="proposal-club-name">${escapeHtml(prop.team.name)}</h3>
                <span class="proposal-club-style">Identidade: <b>${escapeHtml(labelFor(prop.team.rosterStyle || prop.team.marketBehavior?.focus, "Equilibrado"))}</b></span>
              </div>

              <div class="proposal-ovr-box">
                <div class="ovr-big-number">${formatNumber(prop.team.rating?.overall, 0)}</div>
                <div class="ovr-label-group">
                  <span class="ovr-stars">FORÇA GERAL</span>
                  <span class="ovr-text">${getRatingRead(prop.team, previewState?.summary?.overallAverage || 75)}</span>
                </div>
              </div>

              <div class="proposal-specs-row">
                <div class="spec-item">
                  <span class="spec-label">Orçamento</span>
                  <strong class="spec-val">$${formatNumber(prop.team.budget)}M</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Elenco</span>
                  <strong class="spec-val">${prop.team.roster?.summary?.rosterSize || prop.team.roster?.players?.length || 0} atletas</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Objetivo</span>
                  <strong class="spec-val">${escapeHtml(prop.team.objective || "Construir campanha")}</strong>
                </div>
              </div>

              <p class="proposal-lore-quote">"${escapeHtml(prop.team.lore?.dilemma || getClubOpening(prop.team))}"</p>

              <div class="proposal-actions">
                <button class="arcade-sign-btn" data-game-action="sign-contract" data-draft-team-index="${prop.index}" type="button">
                  ⚡ ASSINAR CONTRATO
                </button>
              </div>
            </article>
          `).join("")}
        </div>

        <!-- 3. DRAWER COM TODOS OS CLUBES DA LIGA -->
        <details class="arcade-all-teams-drawer">
          <summary class="arcade-drawer-summary">
            <span class="drawer-icon">📋</span>
            <span>Ver todos os ${leagueTeams.length} clubes da liga (escolha manual)</span>
          </summary>
          <div class="arcade-all-teams-grid">
            ${leagueTeams.map((club, idx) => `
              <div class="arcade-team-tile ${club.id === selectedTeam.id ? "is-active" : ""}" data-seed-team-index="${idx}">
                ${renderClubCrest(club, "is-mini")}
                <div class="tile-info">
                  <strong>${escapeHtml(club.name)}</strong>
                  <small>Força: <b>${formatNumber(club.rating?.overall, 0)}</b> | $${formatNumber(club.budget)}M</small>
                </div>
                <button class="secondary-button mini-btn" data-game-action="sign-contract" data-draft-team-index="${idx}" type="button">
                  Assumir
                </button>
              </div>
            `).join("")}
          </div>
        </details>

        <!-- 4. DRAWER DE SAVES -->
        ${saves.length > 1 ? `
          <details class="arcade-saves-drawer">
            <summary class="arcade-drawer-summary">
              <span class="drawer-icon">💾</span>
              <span>Outras carreiras salvas (${saves.length})</span>
            </summary>
            <div class="procedural-career-list">
              ${saves.map((save) => renderSeedSaveCard(save)).join("")}
            </div>
          </details>
        ` : ""}
      </section>
    `;
  }

  function renderCareerHeader(state, record) {
    const summary = state.summary || {};
    const team = state.userTeam || {};
    const hasDecision = Boolean(state.pendingDecision);
    const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    const matchReady = nextMatch && Number(nextMatch.day) <= Number(state.currentDay) && !nextMatch.processed;
    const performanceBoost = window.TemporadaTotal.GameState.getMatchPerformanceBoost?.(state) || 0;
    const minigameBuff = state.minigameBuff;

    return `
      <div class="procedural-career-header game-hud-header">
        <div class="procedural-career-id game-hud-id">
          <div class="game-hud-club-row">
            ${renderClubCrest(team, "is-mini")}
            <div>
              <span class="game-hud-tag">${escapeHtml(state.sportId ? state.sportId.toUpperCase() : "ESPORTE")}</span>
              <strong>${escapeHtml(team.name || "Seu clube")}</strong>
              <small class="game-hud-date">Semana ${state.currentWeek} • Dia ${state.currentDay}</small>
            </div>
          </div>
        </div>

        <div class="game-hud-vitals">
          <div class="vital-badge is-record" title="Campanha atual">
            <span class="vital-lbl">Campanha</span>
            <strong class="vital-val">${record}</strong>
            <small class="vital-sub">${escapeHtml(getRecordRead(record))}</small>
          </div>
          <div class="vital-badge is-morale" title="Moral do elenco">
            <span class="vital-lbl">Moral</span>
            <strong class="vital-val">${formatNumber(summary.moraleAverage, 0)}%</strong>
            <div class="vital-mini-bar"><div class="mini-bar-fill" style="width: ${Math.min(100, summary.moraleAverage || 0)}%;"></div></div>
          </div>
          <div class="vital-badge is-chemistry" title="Entrosamento e química">
            <span class="vital-lbl">Química</span>
            <strong class="vital-val">${formatNumber(summary.chemistry, 0)}%</strong>
            <div class="vital-mini-bar"><div class="mini-bar-fill" style="width: ${Math.min(100, summary.chemistry || 0)}%;"></div></div>
          </div>
          <div class="vital-badge is-fatigue" title="Fadiga média (menor é melhor)">
            <span class="vital-lbl">Fadiga</span>
            <strong class="vital-val ${Number(summary.fatigueAverage) >= 60 ? "is-warning" : ""}">${formatNumber(summary.fatigueAverage, 0)}%</strong>
            <div class="vital-mini-bar"><div class="mini-bar-fill is-fatigue-fill" style="width: ${Math.min(100, summary.fatigueAverage || 0)}%;"></div></div>
          </div>
          <div class="vital-badge is-finance" title="Saldo disponível">
            <span class="vital-lbl">Caixa</span>
            <strong class="vital-val">${Number(summary.budgetLeft || 0) >= 0 ? "+" : ""}$${formatNumber(summary.budgetLeft, 1)}M</strong>
            <small class="vital-sub">${Number(summary.budgetLeft) < 5 ? "Apertado" : "Controlado"}</small>
          </div>
          ${performanceBoost ? `
            <div class="vital-badge is-boost pulse-gold" title="${minigameBuff ? minigameBuff.buffSummary : "Bônus de quadra ativo"}">
              <span class="vital-lbl">Bônus no Jogo</span>
              <strong class="vital-val text-gold">⚡ +${performanceBoost}</strong>
              <small class="vital-sub">${minigameBuff ? "Treino Ativo" : "Tática Ativa"}</small>
            </div>
          ` : ""}
        </div>

        <div class="procedural-career-actions game-hud-actions">
          ${hasDecision ? `
            <button class="primary-button is-pulsing is-decision-alert" data-game-tab="hub" type="button">
              🚨 Resolver Decisão
            </button>
          ` : matchReady ? `
            <button class="primary-button is-pulsing is-match-ready" data-game-action="play-live" data-event-id="${escapeHtml(nextMatch ? nextMatch.id : "")}" type="button">
              ⚡ Jogar Partida
            </button>
          ` : `
            <button class="primary-button" data-game-action="advance-day" type="button">
              ⏩ Avançar Dia
            </button>
          `}
          <button class="secondary-button" data-game-action="quick-save-career" type="button" title="Salvar Carreira">
            💾 Salvar
          </button>
        </div>
      </div>
      ${state.saveMessage ? `<div class="procedural-save-message ${state.saveMessage.type || ""} compact">${escapeHtml(state.saveMessage.text)}</div>` : ""}
    `;
  }

  function renderActionBanners(state) {
    const decision = state.pendingDecision;
    const decisionParts = getDecisionTextParts(decision);
    const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    if (state.activeTab === "hub" || state.activeTab === "live" || state.activeTab === "warmup" || (!decision && !matchReady)) return "";
    return `
      <div class="procedural-action-banners">
        ${decision ? `
          <section class="procedural-action-banner is-decision">
            <div>
              <span class="club-mini-icon is-decision">DC</span>
              <div>
                <span class="eyebrow">Decisao pendente</span>
                <strong>${escapeHtml(decision.title)}</strong>
                <p>${escapeHtml(decisionParts.lead || "A comissao espera uma resposta.")}</p>
              </div>
            </div>
            <div class="procedural-action-banner__choices">
              ${(decision.choices || []).slice(0, 3).map((choice) => `
                <button class="choice-button" data-decision-choice="${escapeHtml(choice.id)}" type="button">
                  <strong>${escapeHtml(choice.label)}</strong>
                  ${choice.description ? `<span>${escapeHtml(choice.description)}</span>` : ""}
                </button>
              `).join("")}
            </div>
          </section>
        ` : ""}
        ${matchReady ? `
          <section class="procedural-action-banner is-match">
            <div>
              <span class="club-mini-icon is-match">JG</span>
              <div>
                <span class="eyebrow">${matchReady ? "Jogo disponivel" : isVolleyball(state) ? "Proxima partida" : "Proximo jogo"}</span>
                <strong>${escapeHtml(getNextMatchShortLabel(state))}</strong>
                <p>${matchReady ? "A partida ja pode ser aberta sem trocar de aba." : "O atalho fica pronto quando chegar o dia."}</p>
              </div>
            </div>
            <div class="procedural-action-banner__buttons">
              ${matchReady ? `<button class="primary-button" data-game-action="play-live" data-event-id="${escapeHtml(nextMatch.id)}" type="button">Ir para o jogo</button>` : `<button class="secondary-button" data-game-tab="calendar" type="button">Ver calendario</button>`}
            </div>
          </section>
        ` : ""}
      </div>
    `;
  }

  function renderSavePanel(state, folderSaves = [], folderStatus = {}) {
    const saves = getCareerSaves(folderSaves);
    const currentId = state.careerMeta?.id || "";
    const saveMessage = state.saveMessage || "";
    const pendingDeleteId = state.pendingDeleteCareerId || "";
    const pendingDeleteSource = state.pendingDeleteCareerSource || "";
    const folderSupported = window.TemporadaTotal?.ProceduralCareerSave?.isFolderSaveSupported?.();
    return `
      <div class="procedural-save-panel">
        <label>
          <span>Nome da carreira</span>
          <input data-career-name type="text" value="${escapeHtml(getDefaultCareerName(state))}">
        </label>
        <button class="primary-button" data-game-action="save-career" type="button">Salvar progresso</button>
        <button class="secondary-button" data-game-action="save-career-new" type="button">Criar outra carreira salva</button>
        <label>
          <span>Escolher carreira salva</span>
          <select data-career-load-id>
            <option value="">${saves.length ? "Escolha uma carreira" : "Nenhuma carreira salva"}</option>
            ${saves.map((save) => `
              <option value="${escapeHtml(`${save.source || "local"}:${save.id}`)}" ${save.id === currentId ? "selected" : ""}>
                ${save.source === "folder" ? "Arquivo: " : ""}${escapeHtml(save.name)} - semana ${save.currentWeek || 1}, dia ${save.currentDay || 1}
              </option>
            `).join("")}
          </select>
        </label>
        <button class="secondary-button" data-game-action="load-career" type="button" ${saves.length ? "" : "disabled"}>Continuar carreira</button>
        <div class="procedural-career-list">
          ${saves.length ? saves.map((save) => renderCareerSaveCard(save, currentId, pendingDeleteId, pendingDeleteSource)).join("") : `
            <article class="procedural-career-empty">
              <strong>Nenhuma carreira salva ainda.</strong>
              <p>Salve seu progresso para voltar a esta temporada depois.</p>
            </article>
          `}
        </div>
        <details class="procedural-save-advanced" ${state.careerJsonDraft ? "open" : ""}>
          <summary>Arquivos e copias de seguranca</summary>
          <div class="procedural-save-folder">
            <div>
              <strong>${folderStatus.connected ? "Pasta conectada" : folderSupported ? "Pasta nao conectada" : "Pasta indisponivel neste navegador"}</strong>
              <p class="hint">Guarde uma copia fora deste navegador, se preferir.</p>
            </div>
            <button class="secondary-button" data-game-action="connect-save-folder" type="button" ${folderSupported ? "" : "disabled"}>${folderStatus.connected ? "Trocar pasta" : "Escolher pasta"}</button>
            <button class="secondary-button" data-game-action="refresh-folder-saves" type="button" ${folderSupported ? "" : "disabled"}>Atualizar lista</button>
          </div>
          <div class="procedural-save-advanced-actions">
            <button class="secondary-button" data-game-action="save-career-folder" type="button" ${folderSupported ? "" : "disabled"}>Salvar na pasta</button>
            <button class="secondary-button" data-game-action="save-career-folder-new" type="button" ${folderSupported ? "" : "disabled"}>Criar copia na pasta</button>
            <button class="secondary-button" data-game-action="export-career" type="button" ${saves.length || currentId ? "" : "disabled"}>Exportar JSON</button>
            <button class="secondary-button" data-game-action="import-career" type="button">Importar JSON</button>
            <button class="ghost-button danger-ghost" data-game-action="delete-career" type="button" ${saves.length ? "" : "disabled"}>Excluir selecionada</button>
          </div>
          <label class="procedural-save-json">
            <span>Dados para importar ou exportar</span>
            <textarea data-career-json placeholder="Cole aqui os dados da carreira para importar.">${escapeHtml(state.careerJsonDraft || "")}</textarea>
          </label>
        </details>
        ${saveMessage ? `<div class="procedural-save-message ${saveMessage.type || ""}">${escapeHtml(saveMessage.text)}</div>` : ""}
      </div>
    `;
  }

  function renderAdvancedTools(state, folderSaves = [], folderStatus = {}) {
    if (!DEBUG_MODE) return "";
    return `
      <details class="procedural-advanced-tools">
        <summary>
          <span>Modo Desenvolvedor</span>
          <strong>Ferramentas internas</strong>
        </summary>
        <div class="procedural-advanced-grid">
          <div class="procedural-game-toolbar">
            <label class="control-card">
              <span>Codigo da temporada</span>
              <input data-game-seed type="text" value="${escapeHtml(state.seed)}">
            </label>
            <button class="primary-button" data-game-action="new-season" type="button">Gerar nova carreira</button>
            <div class="procedural-filter-count">
              <span>Clube atual</span>
              <strong>${escapeHtml(state.userTeam?.name || "-")}</strong>
            </div>
          </div>
          ${renderSavePanel(state, folderSaves, folderStatus)}
        </div>
      </details>
    `;
  }

  function getBackstageLabel(type) {
    const labels = {
      system: "Abertura",
      training: "Treino",
      rest: "Recuperacao",
      match: "Jogo",
      narrative: "Bastidor",
      decision: "Decisao",
      market: "Mercado",
      team: "Comissao"
    };
    return labels[type] || type || "Temporada";
  }

  function getBackstageTone(type) {
    if (type === "match") return "is-match";
    if (type === "decision" || type === "narrative" || type === "team") return "is-decision";
    if (type === "market") return "is-market";
    if (type === "training" || type === "rest") return "is-training";
    return "";
  }

  function getBackstageText(entry, state) {
    const text = entry.text || "";
    if (isVolleyball(state)) {
      const roster = state.roster || [];
      const getNameByPos = (pos) => roster.find((player) => player.pos === pos)?.name || "";
      const libero = getNameByPos("LIB");
      const opposite = getNameByPos("OPP");
      const middle = getNameByPos("CEN");
      const wing = getNameByPos("PON");
      const hasLowReception = roster.some((player) => (player.pos === "PON" || player.pos === "LIB") && Number(player.reception || 0) < 62);
      if (entry.type === "training") {
        if (hasLowReception) return `A recepcao ficou no centro do treino. ${libero || "O libero"} cobrou comunicacao e a comissao quer menos correria para o levantador.`;
        return `O treino ajustou saque, recepcao e cobertura. ${middle || "Um central"} puxou intensidade na rede, mas a carga cobrou pernas e ombro.`;
      }
      if (entry.type === "rest") return "O elenco respirou e recuperou energia. Recepcao e ataque tendem a responder melhor quando a carga cai.";
      if (entry.type === "match") {
        const won = String(entry.title || "").toLowerCase().includes("vitoria");
        return `${text} ${won ? `A vitoria compra tranquilidade para o sistema. ${opposite || "O oposto"} ganha moral para bolas decisivas.` : `A derrota aumenta a cobranca por passe estavel. ${wing || "Os ponteiros"} precisam responder no proximo set pesado.`}`;
      }
      if (entry.type === "decision") return `${text} A escolha mexe no vestiario e pode mudar a resposta de saque, passe e cobertura nos proximos rallies.`;
      if (entry.type === "narrative") return `${text} O bastidor entrou na pauta antes do saque inicial; a comissao observa liderancas de quadra.`;
      if (entry.type === "market") return `${text} A diretoria avalia se vale buscar encaixe para passe, ataque ou bloqueio.`;
      if (entry.type === "team") return `${text} O grupo recebeu uma mensagem clara sobre o sistema da semana; ${libero || "a linha de passe"} sera termometro.`;
      return text;
    }
    if (entry.type === "training") return "O treino aumentou a conexao do grupo, mas cobrou pernas. A comissao vai monitorar quem chegar mais pesado ao proximo compromisso.";
    if (entry.type === "rest") return "O elenco respirou e recuperou energia. A semana fica menos tensa quando as pernas voltam a responder.";
    if (entry.type === "match") {
      const won = String(entry.title || "").toLowerCase().includes("vitoria");
      return `${text} ${won ? "O resultado compra tempo para o projeto e melhora o humor do vestiario." : "A derrota aumenta a cobranca e transforma a proxima rodada em resposta obrigatoria."}`;
    }
    if (entry.type === "decision") return `${text} A escolha muda o clima interno e passa a acompanhar a semana.`;
    if (entry.type === "narrative") return `${text} O bastidor entrou na pauta antes da bola subir.`;
    if (entry.type === "market") return `${text} A diretoria avalia se vale mexer no elenco agora ou proteger a estabilidade.`;
    if (entry.type === "team") return `${text} O grupo recebeu uma mensagem clara sobre o rumo da semana.`;
    return text;
  }

  function getBackstageRows(state, limit = 5) {
    const seen = new Set();
    return (state.log || [])
      .filter((entry) => entry.type !== "save")
      .filter((entry) => {
        const key = entry.id || `${entry.day}-${entry.type}-${entry.title}-${entry.text}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, limit);
  }

  function renderBackstageFeed(state, limit = 5) {
    const rows = getBackstageRows(state, limit);
    if (!rows.length) {
      return '<div class="procedural-empty">Os bastidores da temporada ainda estao em silencio.</div>';
    }
    return `
      <div class="season-backstage-feed">
        ${rows.map((entry) => `
          <article class="season-backstage-entry ${escapeHtml(getBackstageTone(entry.type))}">
            <span>${escapeHtml(getBackstageLabel(entry.type))}</span>
            <div>
              <strong>Dia ${entry.day} - ${escapeHtml(entry.title)}</strong>
              <p>${escapeHtml(getBackstageText(entry, state))}</p>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderClubHub(state) {
    const team = state.userTeam || {};
    const summary = state.summary || {};
    const todayEvent = getMainTodayEvent(state);
    const decision = state.pendingDecision;
    const decisionParts = getDecisionTextParts(decision);
    const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    const nextOpponent = nextMatch ? (state.league?.teams || []).find((t) => t.id === nextMatch.opponentId) : null;
    const matchReady = nextMatch && Number(nextMatch.day) <= Number(state.currentDay) && !nextMatch.processed;
    const performanceBoost = window.TemporadaTotal.GameState.getMatchPerformanceBoost?.(state) || 0;
    const minigameBuff = state.minigameBuff;
    const fanTrust = getFanTrust(state);
    const boardPressure = getBoardPressure(state);

    return `
      <section class="procedural-game-section club-central-streamlined">
        <!-- 1. BLOCO HERO: AÇÃO PRIORITÁRIA DO DIA -->
        ${decision ? `
          <article class="central-hero-card is-dilemma-card">
            <div class="card-kicker-row">
              <span class="dilemma-badge">🚨 DILEMA DO VESTIÁRIO • REDE DE DECISÕES</span>
              <span class="dilemma-urgency">Resposta Necessária para Avançar</span>
            </div>
            <h2 class="hero-card-title">${escapeHtml(decision.title)}</h2>
            <p class="hero-card-lead">${escapeHtml(decision.text || decisionParts.lead || "A comissão técnica e o elenco aguardam sua resposta.")}</p>

            <div class="central-choices-grid">
              ${(decision.choices || []).map((choice) => `
                <button class="game-choice-pill-card" data-decision-choice="${escapeHtml(choice.id)}" type="button">
                  <div class="choice-pill-head">
                    <span class="choice-arrow">▶</span>
                    <strong>${escapeHtml(choice.label)}</strong>
                  </div>
                  <p class="choice-pill-desc">${escapeHtml(choice.effectText || choice.description || "")}</p>
                  <div class="choice-badges-row">${formatChoiceBadges(choice)}</div>
                </button>
              `).join("")}
            </div>
          </article>
        ` : matchReady ? `
          <article class="central-hero-card is-matchday-card">
            <div class="card-kicker-row">
              <span class="matchday-badge">⚡ DIA DE JOGO • CONFRONTO DECISIVO</span>
              <span class="matchday-date">Dia ${state.currentDay} • Semana ${state.currentWeek}</span>
            </div>

            <div class="central-matchday-clash">
              <div class="clash-team is-user">
                ${renderClubCrest(team, "is-small")}
                <div>
                  <span class="clash-tag">Seu Clube</span>
                  <strong>${escapeHtml(team.name || "Seu Time")}</strong>
                  <small>Força: <b>${formatNumber(team.rating?.overall, 0)}</b></small>
                </div>
              </div>

              <div class="clash-vs-badge">VS</div>

              <div class="clash-team is-opp">
                ${nextOpponent ? renderClubCrest(nextOpponent, "is-small") : '<span class="club-crest is-small">?</span>'}
                <div>
                  <span class="clash-tag">Adversário</span>
                  <strong>${nextOpponent ? escapeHtml(nextOpponent.name) : (nextMatch?.opponentName || "Adversário")}</strong>
                  <small>Força: <b>${nextOpponent ? formatNumber(nextOpponent.rating?.overall, 0) : "75"}</b></small>
                </div>
              </div>
            </div>

            <div class="central-matchday-buff-bar ${minigameBuff ? "is-buffed" : "is-pending"}">
              ${minigameBuff ? `
                <div class="buff-active-banner pulse-gold">
                  <span class="buff-icon">⚡</span>
                  <div>
                    <strong>BÔNUS PRÉ-JOGO ATIVO (+${performanceBoost})!</strong>
                    <small>${escapeHtml(minigameBuff.buffSummary)}</small>
                  </div>
                  <button type="button" class="secondary-button mini-btn" data-game-tab="warmup">↻ Treinar Novamente</button>
                </div>
              ` : `
                <div class="buff-prompt-banner">
                  <span class="buff-icon">🔥</span>
                  <div>
                    <strong>Aquecimento Pré-Jogo Pendente!</strong>
                    <small>Realize um dos 3 desafios rápidos de quadra para turbinar o time com até +4.5 de rating!</small>
                  </div>
                  <button type="button" class="primary-button mini-btn is-pulsing" data-game-tab="warmup">🎯 Fazer Aquecimento →</button>
                </div>
              `}
            </div>

            <div class="central-matchday-actions">
              ${!minigameBuff ? `
                <button class="primary-button warmup-btn-prominent is-pulsing" data-game-tab="warmup" type="button">
                  🔥 Aquecer Elenco no Arcade (+Bônus)
                </button>
              ` : ""}
              <button class="primary-button ${minigameBuff ? "is-pulsing" : ""} play-match-btn" data-game-action="play-live" data-event-id="${escapeHtml(nextMatch ? nextMatch.id : "")}" type="button">
                🎮 Ir para Transmissão ao Vivo ${minigameBuff ? "(com Bônus)" : ""}
              </button>
              <button class="secondary-button simulate-match-btn" data-game-action="simulate-match-now" type="button">
                ⚡ Simular Partida Agora ${minigameBuff ? "(com Bônus)" : ""}
              </button>
            </div>
          </article>
        ` : `
          <article class="central-hero-card is-routine-card">
            <div class="card-kicker-row">
              <span class="routine-badge">📅 DIA LIVRE • PROGRAMAÇÃO DA SEMANA</span>
              <span class="routine-date">Semana ${state.currentWeek} • Dia ${state.currentDay}</span>
            </div>

            <div class="routine-body-row">
              <div class="routine-info-col">
                <div class="routine-event-head">
                  <span class="routine-icon">${escapeHtml(getEventIcon(todayEvent?.type))}</span>
                  <div>
                    <span class="eyebrow">${escapeHtml(todayEvent ? getEventLabel(todayEvent.type) : "Rotina do Centro de Treinamento")}</span>
                    <h3>${escapeHtml(todayEvent?.title || "Sessão regular de preparação e recuperação.")}</h3>
                  </div>
                </div>
                <p class="routine-status-read">${escapeHtml(getCommissionRead(state))}</p>
                <div class="routine-focus-selector">
                  <span class="focus-title">Foco Tático da Semana:</span>
                  <div class="focus-pills-row">
                    ${Object.entries(getFocusCopy(state)).map(([key, [label]]) => `
                      <button class="focus-pill-btn ${state.teamState?.weeklyFocus === key ? "is-active" : ""}" data-team-focus="${key}" type="button">
                        ${escapeHtml(label)}
                      </button>
                    `).join("")}
                  </div>
                </div>
              </div>

              <div class="routine-action-col">
                <button class="primary-button is-large advance-day-primary" data-game-action="advance-day" type="button">
                  ⏩ Avançar Dia
                </button>
                <button class="secondary-button mini-btn" data-game-action="advance-week" type="button">
                  Avançar Semana ⏭
                </button>
              </div>
            </div>
          </article>
        `}

        ${renderVolleyballImpactPanel(state)}

        <!-- 2. GRID AUXILIAR: TERMÔMETRO DO CLUBE & RADAR DE BASTIDORES -->
        <div class="central-support-grid">
          <!-- Coluna 1: Termômetro do Clube -->
          <article class="support-card club-meters-card">
            <div class="card-header-clean">
              <span class="header-icon">🏢</span>
              <h3>Termômetro do Clube</h3>
            </div>
            <div class="meters-stack">
              <div class="meter-item">
                <div class="meter-text-row">
                  <span>Apoio da Torcida</span>
                  <strong class="color-fans">${fanTrust}%</strong>
                </div>
                <div class="meter-bar-track"><div class="meter-bar-fill is-fans" style="width: ${fanTrust}%;"></div></div>
              </div>

              <div class="meter-item">
                <div class="meter-text-row">
                  <span>Pressão da Diretoria</span>
                  <strong class="color-board">${boardPressure}</strong>
                </div>
                <div class="meter-bar-track"><div class="meter-bar-fill is-board" style="width: ${boardPressure === 'Alta' ? '85%' : boardPressure === 'Crescente' ? '55%' : '25%'};"></div></div>
              </div>

              <div class="meter-item">
                <div class="meter-text-row">
                  <span>Orçamento Disponível</span>
                  <strong class="color-money">$${formatNumber(summary.budgetLeft, 1)}M</strong>
                </div>
                <div class="meter-bar-track"><div class="meter-bar-fill is-money" style="width: ${Math.min(100, Math.max(12, (summary.budgetLeft || 5) * 5))}%;"></div></div>
              </div>

              <div class="meter-item">
                <div class="meter-text-row">
                  <span>Vestiário & Entrosamento</span>
                  <strong class="color-locker">${escapeHtml(getChemistryRead(summary.chemistry))}</strong>
                </div>
                <div class="meter-bar-track"><div class="meter-bar-fill is-chemistry" style="width: ${Math.min(100, summary.chemistry || 0)}%;"></div></div>
              </div>
            </div>
          </article>

          <!-- Coluna 2: Radar de Jogos & Bastidores -->
          <article class="support-card club-feed-card">
            <div class="card-header-clean">
              <span class="header-icon">📡</span>
              <h3>Radar & Bastidores</h3>
            </div>

            ${nextMatch && !matchReady ? `
              <div class="radar-fixture-pill">
                ${nextOpponent ? renderClubCrest(nextOpponent, "is-mini") : '<span class="club-crest is-mini">?</span>'}
                <div class="fixture-info">
                  <strong>Próximo: vs ${nextOpponent ? escapeHtml(nextOpponent.name) : (nextMatch.opponentName || "Adversário")}</strong>
                  <small>Dia ${nextMatch.day} • Força: ${nextOpponent ? formatNumber(nextOpponent.rating?.overall, 0) : "75"}</small>
                </div>
                <button type="button" class="secondary-button mini-btn" data-game-tab="warmup">Aquecer</button>
              </div>
            ` : ""}

            <div class="radar-news-list">
              <span class="news-list-label">Últimos Acontecimentos:</span>
              ${renderBackstageFeed(state, 3)}
            </div>
          </article>
        </div>
      </section>
    `;
  }

  function renderWarmupScreen(state) {
    const sportId = state.sportId || "basquete";
    const buff = state.minigameBuff;
    const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    const opponent = nextMatch ? (state.league?.teams || []).find((t) => t.id === nextMatch.opponentId) : null;
    const oppName = opponent ? opponent.name : (nextMatch?.opponentName || "Próximo Adversário");
    const boost = window.TemporadaTotal.GameState.getMatchPerformanceBoost?.(state) || 0;

    return `
      <section class="procedural-game-section procedural-warmup-screen">
        <div class="procedural-warmup-header">
          <div class="warmup-header-title-box">
            <div class="warmup-kicker-row">
              <span class="warmup-badge">🔥 AQUECIMENTO PRÉ-JOGO • SESSÃO OFICIAL</span>
              <span class="warmup-fixture-tag">Duelo vs ${escapeHtml(oppName)} • Dia ${nextMatch?.day || state.currentDay}</span>
            </div>
            <h2>Aquecimento de Quadra & Calibragem</h2>
            <p>Escolha um dos 3 desafios arcade abaixo para calibrar a equipe e conquistar bônus para a partida!</p>
          </div>
          <button type="button" class="secondary-button mini-btn" data-game-tab="hub">
            ◀ Voltar para Central
          </button>
        </div>

        ${buff ? `
          <div class="warmup-active-alert pulse-gold">
            <span class="alert-icon">⚡</span>
            <div>
              <strong>BÔNUS PRÉ-JOGO ATIVO (+${boost})!</strong>
              <small>${escapeHtml(buff.buffSummary)}</small>
            </div>
            <div class="warmup-alert-actions">
              <button type="button" class="primary-button mini-btn" data-game-action="play-live" data-event-id="${escapeHtml(nextMatch ? nextMatch.id : "")}">
                🎮 Entrar na Transmissão →
              </button>
            </div>
          </div>
        ` : ""}

        <div class="procedural-minigame-container" id="minigame-arcade-host"></div>

        <div class="procedural-training-instructions">
          <article class="training-tip-card">
            <span class="tip-icon">🎯</span>
            <div>
              <strong>Timing & Sweet Spot</strong>
              <p>Pressione o botão ou a barra de espaço quando o cursor estiver na zona dourada SWEET SPOT.</p>
            </div>
          </article>
          <article class="training-tip-card">
            <span class="tip-icon">⭐</span>
            <div>
              <strong>Impacto Direto na Partida</strong>
              <p>Acertos concedem até +4.5 de rating, aumentam a moral e desequilibram lances decisivos na partida a seguir!</p>
            </div>
          </article>
          <article class="training-tip-card">
            <span class="tip-icon">⏱️</span>
            <div>
              <strong>Uso Imediato</strong>
              <p>O bônus é ativado para a partida da rodada atual e consumido ao apito final.</p>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  const renderTrainingTab = renderWarmupScreen;

  function formatSavedAt(value) {
    if (!value) return "sem data";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "data invalida";
    return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function renderCareerSaveCard(save, currentId, pendingDeleteId, pendingDeleteSource = "") {
    const isCurrent = save.id === currentId;
    const source = save.source || "local";
    const isPendingDelete = save.id === pendingDeleteId && (!pendingDeleteSource || pendingDeleteSource === source);
    const hasWarnings = save.warnings?.length;
    return `
      <article class="procedural-career-card ${isCurrent ? "is-current" : ""} ${hasWarnings ? "has-warning" : ""}">
        <div class="procedural-career-card__head">
          <div>
            <span>${isCurrent ? "Carreira atual" : source === "folder" ? "Pasta do PC" : "Navegador"}</span>
            <h3>${escapeHtml(save.name || "Carreira")}</h3>
            <p>${escapeHtml(save.clubName || "Clube da carreira")} | salvo em ${escapeHtml(formatSavedAt(save.savedAt))}</p>
          </div>
          <strong>${escapeHtml(save.record || "0-0")}</strong>
        </div>
        <div class="procedural-career-card__meta">
          <div><span>Semana</span><strong>${save.currentWeek || 1}</strong></div>
          <div><span>Dia</span><strong>${save.currentDay || 1}</strong></div>
          <div><span>Saldo</span><strong>${Number(save.pointDiff || 0) > 0 ? "+" : ""}${save.pointDiff || 0}</strong></div>
        </div>
        ${hasWarnings ? `<p class="procedural-career-warning">Esta carreira pode exigir uma verificacao ao carregar.</p>` : ""}
        <div class="procedural-career-actions">
          <button class="primary-button" data-game-action="load-career" data-career-id="${escapeHtml(save.id)}" data-career-source="${escapeHtml(source)}" type="button">Continuar</button>
          <button class="ghost-button danger-ghost" data-game-action="${isPendingDelete ? "confirm-delete-career" : "delete-career"}" data-career-id="${escapeHtml(save.id)}" data-career-source="${escapeHtml(source)}" type="button">${isPendingDelete ? "Confirmar exclusao" : "Excluir"}</button>
          ${isPendingDelete ? `<button class="secondary-button" data-game-action="cancel-delete-career" type="button">Cancelar</button>` : ""}
        </div>
      </article>
    `;
  }

  function renderSeedSaveCard(save) {
    const hasWarnings = save.warnings?.length;
    const source = save.source || "local";
    return `
      <article class="procedural-career-card ${hasWarnings ? "has-warning" : ""}">
        <div class="procedural-career-card__head">
          <div>
            <span>${source === "folder" ? "Pasta do PC" : "Navegador"}</span>
            <h3>${escapeHtml(save.name || "Carreira")}</h3>
            <p>${escapeHtml(save.clubName || "Clube da carreira")} | salvo em ${escapeHtml(formatSavedAt(save.savedAt))}</p>
          </div>
          <strong>${escapeHtml(save.record || "0-0")}</strong>
        </div>
        <div class="procedural-career-card__meta">
          <div><span>Semana</span><strong>${save.currentWeek || 1}</strong></div>
          <div><span>Dia</span><strong>${save.currentDay || 1}</strong></div>
          <div><span>Saldo</span><strong>${Number(save.pointDiff || 0) > 0 ? "+" : ""}${save.pointDiff || 0}</strong></div>
        </div>
        ${hasWarnings ? `<p class="procedural-career-warning">Esta carreira pode exigir uma verificacao ao carregar.</p>` : ""}
        <div class="procedural-career-actions">
          <button class="primary-button" data-game-action="load-career" data-career-id="${escapeHtml(save.id)}" data-career-source="${escapeHtml(source)}" type="button">Continuar</button>
        </div>
      </article>
    `;
  }

  function setSaveMessage(state, type, text) {
    if (!state) return;
    state.saveMessage = { type, text };
  }

  function formatSaveErrors(errors) {
    const labels = {
      local_storage_cheio: "espaco de saves do navegador cheio",
      falha_ao_gravar_save: "navegador bloqueou a gravacao",
      payload_not_object: "dados invalidos",
      invalid_mode: "modo invalido",
      missing_seed: "seed ausente",
      missing_current_day: "dia atual ausente",
      missing_current_week: "semana atual ausente",
      missing_league: "liga ausente",
      missing_user_team: "clube do usuario ausente",
      missing_roster: "elenco ausente",
      missing_standings: "classificacao ausente",
      missing_calendar: "calendario ausente",
      missing_team_state: "estado do time ausente",
      missing_budget: "orcamento ausente",
      missing_morale: "moral ausente",
      missing_chemistry: "quimica ausente",
      missing_fatigue: "fadiga ausente",
      missing_summary: "resumo ausente",
      missing_log: "diario ausente",
      missing_processed_events: "eventos processados ausentes",
      missing_used_decisions: "historico de decisoes ausente",
      missing_decision_memory: "memoria de decisoes ausente",
      save_not_found: "save nao encontrado",
      selecione_um_save: "selecione um save",
      folder_save_unsupported: "seu navegador nao permite salvar em pasta",
      folder_permission_denied: "permissao da pasta negada",
      folder_selection_cancelled: "selecao de pasta cancelada",
      folder_save_failed: "falha ao acessar a pasta",
      folder_not_selected: "pasta de saves nao selecionada",
      folder_write_failed: "nao foi possivel gravar na pasta",
      folder_read_failed: "nao foi possivel ler a pasta"
    };
    return (errors || []).map((error) => labels[error] || error).join(", ") || "erro desconhecido";
  }

  function parseSelectedCareer(value = "") {
    const text = String(value || "");
    const separator = text.indexOf(":");
    if (separator < 0) return { source: "local", id: text };
    return {
      source: text.slice(0, separator) || "local",
      id: text.slice(separator + 1)
    };
  }

  function getSelectedCareerRef(root, actionButton) {
    if (actionButton?.dataset?.careerId) {
      return {
        id: actionButton.dataset.careerId,
        source: actionButton.dataset.careerSource || "local"
      };
    }
    return parseSelectedCareer(root.querySelector("[data-career-load-id]")?.value || "");
  }

  function getSelectedCareerId(root, actionButton) {
    return getSelectedCareerRef(root, actionButton).id;
  }

  function hasKnockoutStarted(state) {
    const rounds = state.knockout?.rounds || {};
    const hasMatches = ["round_of_16", "quarterfinal", "semifinal", "final"].some((stage) => (rounds[stage]?.matches || []).length);
    const currentDay = Number(state.currentDay) || 1;
    const firstKnockoutDay = (state.calendar?.events || [])
      .filter((event) => event.knockout)
      .reduce((min, event) => Math.min(min, Number(event.day) || Infinity), Infinity);
    return hasMatches || (Number.isFinite(firstKnockoutDay) && currentDay >= firstKnockoutDay);
  }

  function isUserEliminatedFromTournament(state) {
    if (state.league?.format?.type !== "groups-knockout") return false;
    const userTeamId = state.userTeam?.id;
    if (!userTeamId || state.knockout?.championId === userTeamId) return false;
    return (state.knockout?.eliminatedTeamIds || []).includes(userTeamId);
  }

  function renderEliminationScreen(state) {
    const userTeamId = state.userTeam?.id;
    const standing = getUserStanding(state) || {};
    const team = state.userTeam || {};
    const stage = state.knockout?.userEliminatedStage || "Mata-mata";
    const group = (state.league?.groups || []).find((item) => item.id === standing.groupId);
    const groupRows = (state.standings || [])
      .filter((row) => row.groupId === standing.groupId)
      .sort((a, b) => (b.points || b.wins * 3) - (a.points || a.wins * 3) || b.pointDiff - a.pointDiff || b.pointsFor - a.pointsFor);
    const groupPosition = groupRows.findIndex((row) => row.teamId === userTeamId) + 1;
    const findFallbackEliminationMatch = () => {
      const rounds = state.knockout?.rounds || {};
      const stageOrder = ["final", "semifinal", "quarterfinal", "round_of_16"];
      for (const stageKey of stageOrder) {
        const found = (rounds[stageKey]?.matches || []).find((item) => (
          (item.homeId === userTeamId || item.awayId === userTeamId)
          && item.winnerId
          && item.winnerId !== userTeamId
        ));
        if (found) return { ...found, stage: stageKey };
      }
      return null;
    };
    const match = state.knockout?.userEliminationMatch || findFallbackEliminationMatch();
    const teams = state.league?.teams || [];
    const home = teams.find((item) => item.id === match?.homeId);
    const away = teams.find((item) => item.id === match?.awayId);
    const winner = teams.find((item) => item.id === match?.winnerId);
    const games = Number(standing.wins || 0) + Number(standing.draws || 0) + Number(standing.losses || 0);
    return `
      <section class="procedural-elimination-screen">
        <div class="elimination-hero">
          <div>
            <span class="eyebrow">Fim da campanha</span>
            <h1>${escapeHtml(team.name || "Seu clube")} esta fora</h1>
            <p>A temporada terminou em ${escapeHtml(stage)}. A campanha fica registrada para orientar a proxima tentativa.</p>
          </div>
          ${renderClubCrest(team, "is-panel")}
        </div>
        <div class="elimination-scoreboard">
          <article><span>Fase</span><strong>${escapeHtml(stage)}</strong><p>${escapeHtml(group?.name || "Chaveamento")}</p></article>
          <article><span>Campanha</span><strong>${standing.wins || 0}-${standing.draws || 0}-${standing.losses || 0}</strong><p>${games} jogos disputados</p></article>
          <article><span>Pontos</span><strong>${standing.points || 0}</strong><p>${groupPosition ? `${groupPosition}o no grupo` : "Mata-mata"}</p></article>
          <article><span>Saldo</span><strong>${Number(standing.pointDiff || 0) > 0 ? "+" : ""}${standing.pointDiff || 0}</strong><p>${standing.pointsFor || 0} pro / ${standing.pointsAgainst || 0} contra</p></article>
        </div>
        ${match ? `
          <div class="elimination-final-card">
            <span>Jogo da eliminacao</span>
            <strong>${escapeHtml(home?.name || "?")} ${match.homeScore ?? "-"} x ${match.awayScore ?? "-"} ${escapeHtml(away?.name || "?")}${match.penalties ? ` | penaltis ${match.penalties.home}-${match.penalties.away}` : ""}</strong>
            <p>Classificado: ${escapeHtml(winner?.name || "A definir")}</p>
          </div>
        ` : stage === "Fase de grupos" ? `
          <div class="elimination-final-card">
            <span>Leitura final</span>
            <strong>O grupo nao abriu passagem</strong>
            <p>Os dois primeiros avancaram e o clube encerrou a campanha antes das oitavas.</p>
          </div>
        ` : `
          <div class="elimination-final-card">
            <span>Leitura final</span>
            <strong>Campanha encerrada no mata-mata</strong>
            <p>O clube caiu em ${escapeHtml(stage)}, mas o save nao registrou o placar da eliminacao.</p>
          </div>
        `}
      </section>
    `;
  }

  function renderLeague(state) {
    const teams = state.league?.teams || [];
    const sortedByRating = teams.slice().sort((a, b) => (Number(b.rating?.overall) || 0) - (Number(a.rating?.overall) || 0));
    const favorite = sortedByRating[0];
    const threat = sortedByRating.find((team) => team.id !== state.userTeam?.id) || sortedByRating[1];
    const rebuild = sortedByRating.slice().reverse().find((team) => String(team.objective || team.lore?.label || "").toLowerCase().includes("recon")) || sortedByRating.at(-1);
    const nextEvent = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    const nextOpponent = teams.find((team) => team.id === nextEvent?.opponentId);
    const selectedTeam = teams.find((team) => team.id === state.selectedLeagueTeamId) || nextOpponent || threat || favorite;
    const averageRating = teams.length ? teams.reduce((sum, team) => sum + (Number(team.rating?.overall) || 0), 0) / teams.length : 0;
    const selectedStanding = getTeamStanding(state, selectedTeam?.id);
    const selectedRecord = selectedStanding ? `${selectedStanding.wins}-${selectedStanding.draws || 0}-${selectedStanding.losses}` : "0-0-0";
    const selectedIsNext = selectedTeam?.id && selectedTeam.id === nextOpponent?.id;
    const isTournament = state.league?.format?.type === "groups-knockout";
    const playoffsStarted = isTournament && hasKnockoutStarted(state);
    const renderRecord = (row) => isTournament ? `${row.wins}-${row.draws || 0}-${row.losses}` : `${row.wins}-${row.losses}`;
    const renderGroupTables = () => (state.league?.groups || []).map((group) => {
      const rows = (state.standings || [])
        .filter((row) => row.groupId === group.id)
        .sort((a, b) => (b.points || b.wins * 3) - (a.points || a.wins * 3) || b.wins - a.wins || b.pointDiff - a.pointDiff || b.pointsFor - a.pointsFor || b.rating - a.rating);
      return `
        <article class="procedural-group-table">
          <h3>${escapeHtml(group.name)}</h3>
          <table class="standings-table procedural-league-table">
            <thead><tr><th>#</th><th>Clube</th><th>Pts</th><th>V-E-D</th><th>Saldo</th></tr></thead>
            <tbody>
              ${rows.map((row, index) => `
                <tr class="${row.teamId === state.userTeam?.id ? "is-user-team" : ""} ${index < 2 ? "playoff-zone" : ""}" data-league-team-id="${escapeHtml(row.teamId)}">
                  <td>${index + 1}</td>
                  <td><span class="club-table-cell">${renderClubCrest(teams.find((team) => team.id === row.teamId) || row, "is-table")}<strong>${escapeHtml(row.name)}</strong></span></td>
                  <td>${row.points || 0}</td>
                  <td>${renderRecord(row)}</td>
                  <td>${row.pointDiff > 0 ? "+" : ""}${row.pointDiff}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </article>
      `;
    }).join("");
    const renderKnockout = () => {
      const rounds = state.knockout?.rounds || {};
      const stages = [["round_of_16", "Oitavas"], ["quarterfinal", "Quartas"], ["semifinal", "Semifinal"], ["final", "Final"]];
      const activeStage = stages.find(([stage]) => {
        const matches = rounds[stage]?.matches || [];
        return matches.length && matches.some((match) => !match.winnerId);
      })?.[0] || stages.find(([stage]) => (rounds[stage]?.matches || []).length)?.[0] || "round_of_16";
      state.activeKnockoutStage = activeStage;
      const stageReads = {
        round_of_16: ["Oitavas", "Sobreviver ao primeiro corte", "16 clubes, oito quedas e pouco tempo para corrigir erro."],
        quarterfinal: ["Quartas", "A chave fica estreita", "Cada posse pesa mais: quem hesita deixa a temporada escapar."],
        semifinal: ["Semifinal", "Um jogo da final", "O elenco ja sente o titulo perto, mas a queda ainda doi mais."],
        final: ["Final", "Noite de titulo", "Nao existe tabela, saldo ou desculpa. So campeao e vice."]
      };
      const activeRead = stageReads[activeStage] || stageReads.round_of_16;
      const getTeam = (teamId) => teams.find((team) => team.id === teamId);
      const renderTeamRow = (match, side) => {
        const team = getTeam(match?.[`${side}Id`]);
        const score = match?.[`${side}Score`];
        const penaltyScore = match?.penalties ? match.penalties[side === "home" ? "home" : "away"] : null;
        const isWinner = team?.id && match?.winnerId === team.id;
        return `
          <div class="knockout-team-row ${isWinner ? "is-winner" : ""}">
            <span>${team ? renderClubCrest(team, "is-table") : ""}<strong>${escapeHtml(team?.name || "A definir")}</strong></span>
            <b>${score ?? "-"}${penaltyScore != null ? ` (${penaltyScore})` : ""}</b>
          </div>
        `;
      };
      return `
        <div class="procedural-knockout-panel knockout-stage-screen is-${escapeHtml(activeStage)}">
          <div class="knockout-stage-hero">
            <span class="eyebrow">${escapeHtml(activeRead[0])}</span>
            <h2>${escapeHtml(activeRead[1])}</h2>
            <p>${escapeHtml(activeRead[2])}</p>
          </div>
          <div class="section-header compact-section-header">
            <div>
              <h3>Mata-mata</h3>
              <span class="hint">Agora a tela e so chaveamento: jogo unico, sem margem para tabela de grupos.</span>
            </div>
          </div>
          <div class="procedural-knockout-bracket">
            ${stages.map(([stage, label]) => {
              const matches = rounds[stage]?.matches || [];
              return `
                <div class="knockout-stage-column">
                  <div class="knockout-stage-title"><span>${escapeHtml(label)}</span><strong>${matches.length ? `${matches.filter((match) => match.winnerId).length}/${matches.length}` : "A definir"}</strong></div>
                  <div class="knockout-stage-matches">
                    ${(matches.length ? matches : [{ homeId: "", awayId: "" }]).map((match) => `
                      <article class="knockout-match-card ${match.winnerId ? "is-resolved" : ""}">
                        ${renderTeamRow(match, "home")}
                        ${renderTeamRow(match, "away")}
                      </article>
                    `).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
          <div class="knockout-champion-strip">
            <span>Campeao</span>
            <strong>${escapeHtml(teams.find((team) => team.id === state.knockout?.championId)?.name || "A definir")}</strong>
          </div>
        </div>
      `;
    };
    return `
      <section class="procedural-game-section">
        <div class="section-header">
          <div>
            <h2>Liga</h2>
            <span class="hint">${isTournament ? "40 clubes | 8 grupos de 5 | top 2 avancam" : `${state.league?.teams?.length || 0} clubes disputam esta temporada.`}</span>
          </div>
        </div>
        <div class="league-panorama-grid">
          <article class="league-user-card">${renderClubCrest(state.userTeam, "is-tiny")}<span>Seu clube</span><strong>${escapeHtml(state.userTeam?.name || "-")}</strong><p>${escapeHtml(getRatingRead(state.userTeam, averageRating))}</p></article>
          <article>${renderClubCrest(favorite, "is-tiny")}<span>Favorito ao titulo</span><strong>${escapeHtml(favorite?.name || "-")}</strong><p>Forca ${formatNumber(favorite?.rating?.overall)}</p></article>
          <article>${renderClubCrest(threat, "is-tiny")}<span>Principal ameaca</span><strong>${escapeHtml(threat?.name || "-")}</strong><p>${escapeHtml(threat?.lore?.label || threat?.objective || "-")}</p></article>
          <article>${nextOpponent ? renderClubCrest(nextOpponent, "is-tiny") : ""}<span>Proximo adversario</span><strong>${escapeHtml(nextOpponent?.name || "A definir")}</strong><p>${nextEvent ? `Dia ${nextEvent.day}` : "Sem jogo pendente"}</p></article>
          <article>${renderClubCrest(rebuild, "is-tiny")}<span>Reconstrucao</span><strong>${escapeHtml(rebuild?.name || "-")}</strong><p>Forca ${formatNumber(rebuild?.rating?.overall)}</p></article>
          <article><span>Forca media</span><strong>${formatNumber(averageRating)}</strong><p>Regua da liga atual</p></article>
        </div>
        ${selectedTeam ? `
          <div class="league-opponent-panel">
            <div>
              ${renderClubCrest(selectedTeam, "is-panel")}
              <span class="eyebrow">${selectedIsNext ? "Proximo adversario" : "Raio-x do adversario"}</span>
              <h3>${escapeHtml(selectedTeam.name)}</h3>
              <p>${escapeHtml(selectedTeam.lore?.description || selectedTeam.objective || "Clube da liga com contexto competitivo proprio.")}</p>
              <div class="league-opponent-read">${escapeHtml(getOpponentRead(state, selectedTeam, averageRating))}</div>
            </div>
            <div class="league-opponent-grid">
              <div><span>Forca</span><strong>${formatNumber(selectedTeam.rating?.overall)}</strong></div>
              <div><span>Campanha</span><strong>${escapeHtml(selectedRecord)}</strong></div>
              <div><span>Patamar</span><strong>${escapeHtml(getRatingRead(selectedTeam, averageRating))}</strong></div>
              <div><span>Objetivo</span><strong>${escapeHtml(selectedTeam.objective || "-")}</strong></div>
              <div><span>Estilo</span><strong>${escapeHtml(labelFor(selectedTeam.rosterStyle || selectedTeam.marketBehavior?.focus))}</strong></div>
              <div><span>Ameaca</span><strong>${escapeHtml(getTeamThreatRead(selectedTeam))}</strong></div>
              <div><span>Ponto fraco</span><strong>${escapeHtml(getTeamWeaknessRead(selectedTeam))}</strong></div>
            </div>
          </div>
        ` : ""}
        ${isTournament ? (playoffsStarted ? `
          ${renderKnockout()}
        ` : `
          <div class="procedural-groups-grid">
            ${renderGroupTables()}
          </div>
        `) : `<div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Clube</th>
                <th>V-D</th>
                <th>Saldo</th>
                <th>Forca</th>
                <th>Contexto</th>
              </tr>
            </thead>
            <tbody>
              ${(state.standings || []).map((row, index) => `
                <tr class="${row.teamId === state.userTeam?.id ? "is-user-team" : ""} ${row.teamId === selectedTeam?.id ? "is-selected-team" : ""}" data-league-team-id="${escapeHtml(row.teamId)}">
                  <td>${index + 1}</td>
                  <td><span class="club-table-cell">${renderClubCrest(teams.find((team) => team.id === row.teamId) || row, "is-table")}<strong>${escapeHtml(row.name)}</strong></span></td>
                  <td>${renderRecord(row)}</td>
                  <td>${row.pointDiff > 0 ? "+" : ""}${row.pointDiff}</td>
                  <td>${formatNumber(row.rating)}</td>
                  <td>${escapeHtml(labelFor(row.loreLabel))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>`}
      </section>
    `;
  }

  function getMarketDecisionLabel(player) {
    return `Forca ${formatNumber(player.currentAbility, 0)} | Potencial ${formatNumber(player.potential, 0)} | Salario $${formatNumber(player.salary)}M`;
  }

  function getRosterLimit(state) {
    return Number(state.userTeam?.roster?.summary?.rosterSize || state.roster?.length || 0);
  }

  function marketNeedsRelease(state, player) {
    return Boolean(player?.sandbox?.outgoing) || (state.roster || []).length >= getRosterLimit(state);
  }

  function getReleaseCost(player) {
    return window.TemporadaTotal.GameState.calculateReleaseCost?.(player) || Math.max(0.4, (Number(player?.salary) || 0) * 0.55);
  }

  function getSelectedReleaseId(state, marketPlayer) {
    return state.marketReleaseSelections?.[marketPlayer?.id] || "";
  }

  function getReleaseCandidates(state, marketPlayer) {
    const counts = (state.roster || []).reduce((map, player) => {
      map[player.pos] = (map[player.pos] || 0) + 1;
      return map;
    }, {});
    return (state.roster || []).map((player) => {
      const salary = Number(player.salary) || 0;
      const samePosition = player.pos === marketPlayer?.pos ? 8 : 0;
      const surplus = (counts[player.pos] || 0) > 2 ? 6 : 0;
      const lowUse = Math.max(0, 76 - (Number(player.currentAbility) || 0)) * 0.45;
      const upsidePenalty = ((Number(player.potential) || 0) - (Number(player.currentAbility) || 0)) >= 8 ? -7 : 0;
      return {
        ...player,
        releaseCost: getReleaseCost(player),
        releaseReadScore: samePosition + surplus + lowUse + salary + upsidePenalty
      };
    }).sort((a, b) => b.releaseReadScore - a.releaseReadScore).slice(0, 6);
  }

  function getMarketSandbox(state, player) {
    if (!player) return {};
    const releaseId = getSelectedReleaseId(state, player);
    const outgoing = releaseId ? (state.roster || []).find((row) => row.id === releaseId || row.sourceId === releaseId) : null;
    const sandbox = outgoing && window.TemporadaTotal?.simulateProceduralMarketSigning
      ? window.TemporadaTotal.simulateProceduralMarketSigning(state.userTeam, player, { outgoingPlayer: outgoing, forceCut: true })
      : player.sandbox || {};
    return {
      ...sandbox,
      outgoing: outgoing || sandbox.outgoing || null,
      releaseCost: outgoing ? getReleaseCost(outgoing) : 0,
      manuallySelectedRelease: Boolean(outgoing)
    };
  }

  function getComparableRosterPlayer(state, marketPlayer) {
    const samePosition = (state.roster || []).filter((player) => player.pos === marketPlayer.pos);
    const rows = samePosition.length ? samePosition : (state.roster || []);
    return rows.slice().sort((a, b) => Math.abs((Number(a.currentAbility) || 0) - (Number(marketPlayer.currentAbility) || 0)) - Math.abs((Number(b.currentAbility) || 0) - (Number(marketPlayer.currentAbility) || 0)))[0] || null;
  }

  function getMarketRisk(player, comparable) {
    if (!player.affordable) return "Risco alto: a folha nao comporta o contrato.";
    const salaryDelta = (Number(player.salary) || 0) - (Number(comparable?.salary) || 0);
    if (salaryDelta > 6) return "Risco financeiro: melhora exige salario pesado.";
    if (isVolleyball({ sportId: player.sportId }) && player.pos !== "LIB" && Number(player.reception || 0) < 58) return "Risco tecnico: pode pressionar a linha de passe.";
    if ((Number(player.morale) || 55) < 42) return "Risco de ambiente: perfil pode exigir gestao de vestiario.";
    return "Risco controlado: movimento compativel com o momento do clube.";
  }

  function getMarketPlayerProfile(player) {
    const tags = [];
    const potentialGap = (Number(player.potential) || 0) - (Number(player.currentAbility) || 0);
    if (isVolleyball({ sportId: player.sportId })) {
      if (Number(player.serve) >= 76) tags.push("Saque");
      if (Number(player.attack) >= 76) tags.push("Ataque");
      if (Number(player.block) >= 76) tags.push("Bloqueio");
      if (Number(player.reception) >= 76) tags.push("Passe");
      if (Number(player.setting) >= 76) tags.push("Levantamento");
      if (Number(player.defense) >= 76) tags.push("Defesa");
    } else {
      if (Number(player.threePoint) >= 76) tags.push("Arremesso");
      if (Number(player.defense) >= 76) tags.push("Defesa");
      if (Number(player.physical) >= 76) tags.push("Fisico");
      if (Number(player.tactical) >= 76) tags.push("Tatico");
    }
    if (potentialGap >= 8) tags.push("Desenvolvimento");
    if (!tags.length) tags.push(player.tag || player.archetype?.label || "Rotacao");
    return tags.slice(0, 2).join(" + ");
  }

  function getMarketMainStrength(player) {
    const attributes = isVolleyball({ sportId: player.sportId })
      ? [
        ["Saque", player.serve],
        ["Ataque", player.attack],
        ["Bloqueio", player.block],
        ["Passe", player.reception],
        ["Levant.", player.setting],
        ["Defesa", player.defense]
      ]
      : [
        ["3PT", player.threePoint],
        ["Fisico", player.physical],
        ["Tatica", player.tactical],
        ["Tecnica", player.technique],
        ["Defesa", player.defense]
      ];
    const [label, value] = attributes.sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))[0] || ["Forca", player.currentAbility];
    return `${label} ${formatNumber(value, 0)}`;
  }

  function getMarketCardRisk(player, comparable) {
    if (!player.affordable) return "Folha estourada";
    const salaryDelta = (Number(player.salary) || 0) - (Number(comparable?.salary) || 0);
    const abilityDelta = (Number(player.currentAbility) || 0) - (Number(comparable?.currentAbility) || 0);
    if (salaryDelta > 6 && abilityDelta < 2) return "Caro";
    if (isVolleyball({ sportId: player.sportId }) && player.pos !== "LIB" && Number(player.reception || 0) < 58) return "Recepcao";
    if ((Number(player.injuryRisk) || 0) >= 0.2) return "Fisico";
    if ((Number(player.morale) || 55) < 42) return "Vestiario";
    return "Baixo";
  }

  function renderReleasePicker(state, player, sandbox) {
    if (!marketNeedsRelease(state, player)) return "";
    const selectedReleaseId = getSelectedReleaseId(state, player);
    const candidates = getReleaseCandidates(state, player);
    return `
      <div class="market-release-panel">
        <div>
          <span class="eyebrow">Liberar atleta</span>
          <strong>${selectedReleaseId ? "Saida escolhida" : "Escolha quem sai"}</strong>
          <p>Contratar exige abrir vaga e absorver custo de saida.</p>
        </div>
        <div class="market-release-list">
          ${candidates.map((candidate) => `
            <button class="${candidate.id === selectedReleaseId ? "is-selected" : ""}" data-market-release="${escapeHtml(player.id)}" data-release-player-id="${escapeHtml(candidate.id)}" type="button">
              <span>${escapeHtml(candidate.pos)} | ${formatNumber(candidate.currentAbility, 0)}/${formatNumber(candidate.potential, 0)}</span>
              <strong>${escapeHtml(candidate.name)}</strong>
              <em>Salario $${formatNumber(candidate.salary)}M | custo $${formatNumber(candidate.releaseCost)}M</em>
            </button>
          `).join("")}
        </div>
        ${sandbox?.outgoing ? `<p class="market-release-note">Selecionado: ${escapeHtml(sandbox.outgoing.name)}. Custo de saida: $${formatNumber(sandbox.releaseCost)}M.</p>` : ""}
      </div>
    `;
  }

  function renderMarketComparison(state, player) {
    if (!player) return "";
    const comparable = getComparableRosterPlayer(state, player);
    const sandbox = getMarketSandbox(state, player);
    const abilityDelta = (Number(player.currentAbility) || 0) - (Number(comparable?.currentAbility) || 0);
    const potentialDelta = (Number(player.potential) || 0) - (Number(comparable?.potential) || 0);
    const salaryDelta = (Number(player.salary) || 0) - (Number(comparable?.salary) || 0);
    const payrollDelta = Number(sandbox.delta?.totalSalary) || salaryDelta;
    const totalCostDelta = payrollDelta + (Number(sandbox.releaseCost) || 0);
    const volley = isVolleyball(state) || isVolleyball({ sportId: player.sportId });
    const chemistryImpact = abilityDelta >= 3
      ? volley ? "positivo se melhorar a sincronia entre passe e ataque" : "positivo se a rotacao aceitar a mudanca"
      : salaryDelta > 5 ? "neutro com risco de cobranca interna" : "baixo impacto";
    const moraleImpact = sandbox.outgoing ? `pode afetar quem perder espaco, especialmente ${sandbox.outgoing.name}` : "tende a ser absorvido pelo grupo";
    return `
      <aside class="market-comparison-panel">
        <div>
          <span class="eyebrow">${volley ? "Mesa de mercado do volei" : "Mesa de mercado"}</span>
          <h3>${escapeHtml(player.name)}</h3>
          <p>${escapeHtml(labelFor(player.clubFitReason || player.marketFit, "A diretoria avalia o encaixe do atleta."))}</p>
        </div>
        <div class="market-comparison-grid">
          <article>
            <span>Jogador do mercado</span>
            <strong>${escapeHtml(player.pos)} | ${player.age || "-"} anos</strong>
            <p>OVR ${formatNumber(player.currentAbility, 0)} | POT ${formatNumber(player.potential, 0)} | $${formatNumber(player.salary)}M</p>
            <p>Encaixe ${formatNumber(player.clubFitScore)} | risco ${escapeHtml(getMarketCardRisk(player, comparable))}</p>
          </article>
          <article>
            <span>Comparavel no elenco</span>
            <strong>${escapeHtml(comparable?.name || "Sem comparavel claro")}</strong>
            <p>${escapeHtml(comparable?.pos || "-")} | OVR ${formatNumber(comparable?.currentAbility, 0)} | POT ${formatNumber(comparable?.potential, 0)}</p>
            <p>Salario atual: $${formatNumber(comparable?.salary)}M</p>
          </article>
        </div>
        <div class="market-impact-grid">
          <div><span>Forca</span><strong>${abilityDelta > 0 ? "+" : ""}${formatNumber(abilityDelta)}</strong></div>
          <div><span>Potencial</span><strong>${potentialDelta > 0 ? "+" : ""}${formatNumber(potentialDelta)}</strong></div>
          <div><span>Salario</span><strong>${salaryDelta > 0 ? "+" : ""}$${formatNumber(salaryDelta)}M</strong></div>
          <div><span>Custo total</span><strong>${totalCostDelta > 0 ? "+" : ""}$${formatNumber(totalCostDelta)}M</strong></div>
        </div>
        ${renderReleasePicker(state, player, sandbox)}
        <div class="market-narrative-read">
          <strong>${escapeHtml(getMarketRisk(player, comparable))}</strong>
          <p>${volley ? "Sistema" : "Quimica"}: ${escapeHtml(chemistryImpact)}. Moral: ${escapeHtml(moraleImpact)}.</p>
          <p>${player.name} muda a comparacao imediata em ${abilityDelta > 0 ? "+" : ""}${formatNumber(abilityDelta)} de forca. ${sandbox.outgoing ? `Saida escolhida: ${sandbox.outgoing.name}.` : "Escolha a saida antes de confirmar se o elenco estiver cheio."}</p>
        </div>
      </aside>
    `;
  }

  function initRosterDraftMarket(state) {
    if (state.rosterDraftMarket && Array.isArray(state.rosterDraftMarket.players) && state.rosterDraftMarket.players.length) {
      return state.rosterDraftMarket;
    }
    const marketGen = isVolleyball(state)
      ? window.TemporadaTotal?.generateProceduralVolleyballMarket
      : isFutsal(state)
        ? window.TemporadaTotal?.generateProceduralFutsalMarket
        : window.TemporadaTotal?.generateProceduralBasketballMarket;
    const market = marketGen?.(state.seed, { count: 100, profile: "balanced" }) || null;
    state.rosterDraftMarket = market;
    return market;
  }

  function getSportPositionRequirements(state) {
    if (isFutsal(state)) {
      return [
        { pos: "GOL", label: "Goleiro", min: 2, starterMin: 1 },
        { pos: "FIX", label: "Fixo", min: 2, starterMin: 1 },
        { pos: "ALA", label: "Ala", min: 4, starterMin: 2 },
        { pos: "PIVO", label: "Pivô", min: 2, starterMin: 1 }
      ];
    }
    if (isVolleyball(state)) {
      return [
        { pos: "LEV", label: "Levantador", min: 2, starterMin: 1 },
        { pos: "OPP", label: "Oposto", min: 2, starterMin: 1 },
        { pos: "PON", label: "Ponteiro", min: 3, starterMin: 2 },
        { pos: "CEN", label: "Central", min: 2, starterMin: 2 },
        { pos: "LIB", label: "Líbero", min: 1, starterMin: 1 }
      ];
    }
    return [
      { pos: "PG", label: "Armador (PG)", min: 2, starterMin: 1 },
      { pos: "SG", label: "Ala-Armador (SG)", min: 2, starterMin: 1 },
      { pos: "SF", label: "Ala (SF)", min: 2, starterMin: 1 },
      { pos: "PF", label: "Ala-Pivô (PF)", min: 2, starterMin: 1 },
      { pos: "C", label: "Pivô (C)", min: 2, starterMin: 1 }
    ];
  }

  function validateRosterReadiness(state) {
    const requirements = getSportPositionRequirements(state);
    const errors = [];
    const minRoster = isFutsal(state) ? 8 : 10;
    const players = state.roster || [];
    if (players.length < minRoster) {
      errors.push(`Mínimo de ${minRoster} atletas exigido pela liga (atual: ${players.length}).`);
    }
    if (players.length > 15) {
      errors.push(`Limite máximo de 15 atletas ultrapassado (atual: ${players.length}).`);
    }
    if ((Number(state.summary?.budgetLeft) || 0) < -0.05) {
      errors.push(`Folha salarial acima do orçamento em $${Math.abs(Number(state.summary?.budgetLeft) || 0).toFixed(1)}M.`);
    }
    requirements.forEach((req) => {
      const count = players.filter((p) => p.pos === req.pos).length;
      if (count < req.starterMin) {
        errors.push(`Falta titular para a posição ${req.label} (${req.pos}).`);
      }
    });
    return {
      ready: errors.length === 0,
      errors
    };
  }

  function normalizePlayerForRoster(player, state) {
    const sportId = state?.sportId || player?.sportId || "basquete";
    const emptyStats = window.TemporadaTotal.GameState?.createEmptySeasonStats?.(sportId) || {};
    return {
      ...player,
      sportId: player.sportId || sportId,
      morale: 65,
      fatigue: 12,
      status: "Disponivel",
      seasonStats: {
        ...emptyStats,
        ...(player.seasonStats || {})
      }
    };
  }

  function autocompleteRoster(state) {
    initRosterDraftMarket(state);
    state.summary = window.TemporadaTotal.GameState?.summarizeTeam?.(state.roster, state.teamState) || state.summary;
    const requirements = getSportPositionRequirements(state);
    const targetSize = Math.max(12, isFutsal(state) ? 10 : 12);
    let addedCount = 0;

    function pickBestDraftCandidate(posFilter) {
      state.summary = window.TemporadaTotal.GameState?.summarizeTeam?.(state.roster, state.teamState) || state.summary;
      const available = Math.max(0, (Number(state.summary?.budgetLeft) || 0) + 0.05);
      const slotsNeeded = Math.max(1, targetSize - state.roster.length);
      const avgBudget = available / slotsNeeded;
      const maxSpend = slotsNeeded === 1 ? available : Math.max(0.18, avgBudget * 1.35);

      let pool = state.rosterDraftMarket?.players || [];
      if (posFilter) pool = pool.filter((p) => p.pos === posFilter);
      if (!pool.length) return null;

      let candidates = pool.filter((p) => Number(p.salary) <= maxSpend)
        .sort((a, b) => (Number(b.currentAbility) / Math.max(0.15, Number(b.salary))) - (Number(a.currentAbility) / Math.max(0.15, Number(a.salary))));

      if (!candidates.length) {
        candidates = pool.filter((p) => Number(p.salary) <= available)
          .sort((a, b) => Number(a.salary) - Number(b.salary));
      }
      if (!candidates.length) {
        candidates = pool.slice().sort((a, b) => Number(a.salary) - Number(b.salary));
      }
      const picked = candidates[0];
      const idx = state.rosterDraftMarket.players.findIndex((p) => p.id === picked.id);
      if (idx !== -1) {
        state.rosterDraftMarket.players.splice(idx, 1);
        state.roster.push(normalizePlayerForRoster(picked, state));
        state.summary = window.TemporadaTotal.GameState?.summarizeTeam?.(state.roster, state.teamState) || state.summary;
        addedCount++;
        return picked;
      }
      return null;
    }

    // 1. Fill missing required positions
    requirements.forEach((req) => {
      let currentCount = (state.roster || []).filter((p) => p.pos === req.pos).length;
      while (currentCount < req.min && state.roster.length < targetSize) {
        const picked = pickBestDraftCandidate(req.pos);
        if (!picked) break;
        currentCount++;
      }
    });

    // 2. Fill remaining slots up to targetSize with best affordable players
    while (state.roster.length < targetSize) {
      const picked = pickBestDraftCandidate(null);
      if (!picked) break;
    }

    // 3. Budget reconciliation pass: if over budget, downgrade most expensive bench players to cheapest available
    while ((Number(state.summary?.budgetLeft) || 0) < 0) {
      const nonEssential = state.roster
        .map((p, idx) => ({ player: p, index: idx }))
        .filter((entry) => {
          const samePosCount = state.roster.filter((p) => p.pos === entry.player.pos).length;
          const req = requirements.find((r) => r.pos === entry.player.pos);
          return samePosCount > (req?.starterMin || 1);
        })
        .sort((a, b) => Number(b.player.salary) - Number(a.player.salary));

      if (!nonEssential.length) break;

      let downgraded = false;
      for (const candidate of nonEssential) {
        const cheaper = (state.rosterDraftMarket?.players || [])
          .filter((p) => p.pos === candidate.player.pos && Number(p.salary) < Number(candidate.player.salary))
          .sort((a, b) => Number(a.salary) - Number(b.salary))[0];

        if (cheaper) {
          const mIdx = state.rosterDraftMarket.players.findIndex((p) => p.id === cheaper.id);
          state.rosterDraftMarket.players.splice(mIdx, 1);
          state.rosterDraftMarket.players.push(candidate.player);
          state.roster[candidate.index] = normalizePlayerForRoster(cheaper, state);
          state.summary = window.TemporadaTotal.GameState?.summarizeTeam?.(state.roster, state.teamState) || state.summary;
          downgraded = true;
          break;
        }
      }
      if (!downgraded) break;
    }

    state.summary = window.TemporadaTotal.GameState?.summarizeTeam?.(state.roster, state.teamState) || state.summary;
    return addedCount;
  }

  function renderRosterModeSelectScreen(state) {
    const team = state.userTeam || {};
    const budget = Number(team.budget || state.teamState?.budget || 12);
    const baseCount = (state.originalBaseRoster || state.roster || []).length;
    return `
      <section class="roster-mode-select-screen">
        <div class="roster-mode-hero">
          <div class="roster-mode-crest-wrapper">
            ${renderClubCrest(team, "is-large")}
          </div>
          <div class="roster-mode-club-details">
            <span class="roster-mode-tag">🎉 CONTRATO OFICIAL ASSINADO</span>
            <h1 class="roster-mode-club-title">${escapeHtml(team.name || "Seu Clube")}</h1>
            <p class="roster-mode-dilemma">"${escapeHtml(team.lore?.dilemma || team.lore?.description || getClubOpening(team))}"</p>
            <div class="roster-mode-vitals-strip">
              <span class="mode-vital-pill">💰 Teto Orçamentário: <b>$${formatNumber(budget)}M</b></span>
              <span class="mode-vital-pill">🎯 Meta: <b>${escapeHtml(team.objective || "Playoffs")}</b></span>
              <span class="mode-vital-pill">📍 Cidade: <b>${escapeHtml(team.city || "Sede")}</b></span>
            </div>
          </div>
        </div>

        <div class="roster-mode-prompt-bar">
          <h2>Como deseja assumir o comando técnico?</h2>
          <p>Escolha sua abordagem para a temporada. Você pode montar o time do zero no mercado aberto ou ajustar o elenco base preparado pelo clube.</p>
        </div>

        <div class="roster-mode-cards-grid">
          <article class="roster-mode-card is-zero-mode">
            <div class="mode-card-header">
              <span class="mode-card-badge">🛠️ MESA ABERTA</span>
              <h3>Montar Elenco do Zero</h3>
            </div>
            <p class="mode-card-desc">
              Comece com a folha 100% limpa e todo o orçamento de <b>$${formatNumber(budget)}M</b> disponível em caixa.
              Acesse um mercado dinâmico de <b>100 atletas procedurais</b> e selecione cada jogador para desenhar a sua estratégia.
            </p>
            <ul class="mode-card-perks">
              <li><span>✓</span> <b>Folha limpa:</b> Nenhum contrato herdado, você decide cada centavo.</li>
              <li><span>✓</span> <b>100+ Atletas:</b> Estrelas, titulares, promessas e barganhas no mercado.</li>
              <li><span>✓</span> <b>Liberdade Tática:</b> Escolha arquétipos e características para seu estilo de jogo.</li>
            </ul>
            <div class="mode-card-action">
              <button class="arcade-sign-btn is-gold" data-game-action="choose-roster-mode" data-roster-mode="zero" type="button">
                🛠️ Montar Elenco do Zero
              </button>
            </div>
          </article>

          <article class="roster-mode-card is-situational-mode">
            <div class="mode-card-header">
              <span class="mode-card-badge">📋 DESAFIO DE GESTÃO</span>
              <h3>Gestão Situacional</h3>
            </div>
            <p class="mode-card-desc">
              Receba o elenco base já montado pelo clube (<b>${baseCount} atletas</b>) e enfrente o desafio da diretoria.
              Avalie carências, faça trocas situacionais e contratações pontuais dentro da sua margem orçamentária antes da estreia.
            </p>
            <ul class="mode-card-perks">
              <li><span>✓</span> <b>Estrutura pronta:</b> Quinteto/formação titular e reservas consolidados.</li>
              <li><span>✓</span> <b>Trocas pontuais:</b> Substitua veteranos caros ou busque reforços cirúrgicos.</li>
              <li><span>✓</span> <b>Desafio realista:</b> Adapte o sistema ao elenco existente e corte excessos.</li>
            </ul>
            <div class="mode-card-action">
              <button class="arcade-sign-btn is-blue" data-game-action="choose-roster-mode" data-roster-mode="situational" type="button">
                📋 Assumir com Elenco Base
              </button>
            </div>
          </article>
        </div>

        <div class="roster-mode-footer-actions">
          <button class="secondary-button" data-game-action="back-to-proposals" type="button">
            ⬅️ Voltar e Escolher Outro Clube
          </button>
          <button class="secondary-button" data-game-action="finalize-roster-and-play" type="button">
            ⚡ Pular Ajustes e Estrear Imediatamente
          </button>
        </div>
      </section>
    `;
  }

  function renderRosterBuildingScreen(state) {
    const team = state.userTeam || {};
    const mode = state.rosterBuildMode || "zero";
    const budget = Number(team.budget || state.teamState?.budget || 12);
    const budgetLeft = Number(state.summary?.budgetLeft || 0);
    const totalSalary = Number(state.summary?.totalSalary || 0);
    const budgetPercent = Math.min(100, Math.max(0, Math.round((totalSalary / Math.max(0.1, budget)) * 100)));
    const requirements = getSportPositionRequirements(state);
    const readiness = validateRosterReadiness(state);
    const market = initRosterDraftMarket(state);
    const marketPlayers = market?.players || [];
    const selectedTradeId = state.rosterSelectedForTradeId || null;
    const selectedTradePlayer = selectedTradeId ? state.roster.find((p) => p.id === selectedTradeId) : null;

    // Filters and sorting
    const activePos = state.rosterFilterPos || "all";
    const activeCat = state.rosterFilterCat || "all";
    const sortKey = state.rosterSort || "ovr_desc";
    const searchQuery = String(state.rosterSearchQuery || "").toLowerCase().trim();

    let filteredMarket = marketPlayers.filter((player) => {
      if (activePos !== "all" && player.pos !== activePos) return false;
      if (activeCat !== "all" && player.marketCategory?.id !== activeCat) return false;
      if (searchQuery && !player.name.toLowerCase().includes(searchQuery)) return false;
      return true;
    });

    if (sortKey === "ovr_desc") {
      filteredMarket.sort((a, b) => (Number(b.currentAbility) || 0) - (Number(a.currentAbility) || 0));
    } else if (sortKey === "pot_desc") {
      filteredMarket.sort((a, b) => (Number(b.potential) || 0) - (Number(a.potential) || 0));
    } else if (sortKey === "salary_asc") {
      filteredMarket.sort((a, b) => (Number(a.salary) || 0) - (Number(b.salary) || 0));
    } else if (sortKey === "salary_desc") {
      filteredMarket.sort((a, b) => (Number(b.salary) || 0) - (Number(a.salary) || 0));
    } else if (sortKey === "age_asc") {
      filteredMarket.sort((a, b) => (Number(a.age) || 24) - (Number(b.age) || 24));
    }

    const positionOptions = ["all", ...new Set(requirements.map((r) => r.pos))];
    const categoryOptions = [
      { id: "all", label: "Todos os Perfis" },
      { id: "star", label: "⭐ Estrelas" },
      { id: "starter", label: "🛡️ Titulares" },
      { id: "rotation", label: "🔄 Rotação" },
      { id: "prospect", label: "🚀 Promessas" },
      { id: "bargain", label: "💰 Custo-Benefício" }
    ];

    return `
      <section class="roster-building-screen">
        <!-- TOP CONTROL BAR -->
        <header class="roster-build-header">
          <div class="roster-build-header__club">
            ${renderClubCrest(team, "is-mini")}
            <div>
              <div class="roster-build-badge-row">
                <span class="mode-indicator-badge ${mode === "zero" ? "is-zero" : "is-situational"}">
                  ${mode === "zero" ? "🛠️ Montagem do Zero" : "📋 Gestão Situacional"}
                </span>
                <button class="mini-text-btn" data-game-action="choose-roster-mode" data-roster-mode="${mode === "zero" ? "situational" : "zero"}" type="button">
                  ⇄ Alternar para ${mode === "zero" ? "Elenco Base" : "Montar do Zero"}
                </button>
              </div>
              <h2 class="roster-build-club-title">${escapeHtml(team.name || "Seu Clube")}</h2>
            </div>
          </div>

          <div class="roster-build-header__metrics">
            <div class="build-metric-card">
              <span class="metric-label">Orçamento</span>
              <strong class="metric-val">$${formatNumber(budget)}M</strong>
            </div>
            <div class="build-metric-card">
              <span class="metric-label">Folha Atual</span>
              <strong class="metric-val">$${formatNumber(totalSalary)}M</strong>
            </div>
            <div class="build-metric-card ${budgetLeft < 0 ? "is-negative" : "is-positive"}">
              <span class="metric-label">Saldo Disponível</span>
              <strong class="metric-val">${budgetLeft < 0 ? "-" : ""}$${formatNumber(Math.abs(budgetLeft))}M</strong>
            </div>
            <div class="build-metric-card">
              <span class="metric-label">Atletas</span>
              <strong class="metric-val">${state.roster.length} / 12</strong>
              <small>${state.roster.length < 10 ? `Faltam ${10 - state.roster.length}` : "Mínimo OK"}</small>
            </div>
            <div class="build-metric-card">
              <span class="metric-label">Força Geral (OVR)</span>
              <strong class="metric-val is-ovr">${state.summary?.overallAverage || "--"}</strong>
            </div>
          </div>
        </header>

        <!-- BUDGET PROGRESS BAR & POSITION REQUIREMENTS TRACKER -->
        <div class="roster-budget-meter-wrap">
          <div class="budget-meter-track">
            <div class="budget-meter-fill ${budgetLeft < 0 ? "is-over" : budgetLeft <= 1.0 ? "is-tight" : "is-healthy"}" style="width: ${budgetPercent}%"></div>
          </div>
          <div class="roster-pos-requirements-bar">
            <span class="pos-req-label">Posições Obrigatórias:</span>
            <div class="pos-chips-scroll">
              ${requirements.map((req) => {
                const count = (state.roster || []).filter((p) => p.pos === req.pos).length;
                const isMet = count >= req.starterMin;
                return `
                  <span class="roster-pos-chip ${isMet ? "is-met" : "is-needed"}" title="${req.label}: mínimo ${req.starterMin} titular(es)">
                    <strong>${req.pos}</strong> ${count}/${req.min} ${isMet ? "✓" : "⚠️"}
                  </span>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- MAIN 2-COLUMN LAYOUT -->
        <div class="roster-build-layout">
          <!-- COLUMN 1: CURRENT SQUAD -->
          <div class="roster-build-team-column">
            <div class="column-header">
              <div>
                <h3>Elenco do Clube <span class="counter-badge">(${state.roster.length})</span></h3>
                <small class="column-hint">
                  ${mode === "zero"
                    ? "Contrate no mercado ao lado até preencher todas as posições."
                    : selectedTradePlayer
                      ? `Trocando: ${escapeHtml(selectedTradePlayer.name)} ($${formatNumber(selectedTradePlayer.salary)}M). Escolha o substituto no mercado.`
                      : "Clique em um jogador para servir de moeda de troca situacional."
                  }
                </small>
              </div>
              <div class="column-actions">
                <button class="secondary-button mini-btn" data-game-action="roster-draft-autocomplete" title="Preencher vagas faltantes com o melhor custo-benefício" type="button">
                  🎲 Autocompletar
                </button>
                ${mode === "zero" ? `
                  <button class="secondary-button mini-btn is-danger-text" data-game-action="roster-draft-clear" title="Dispensar todos e recomeçar" type="button">
                    🧹 Limpar
                  </button>
                ` : `
                  <button class="secondary-button mini-btn" data-game-action="roster-draft-reset-base" title="Restaurar elenco original de fábrica" type="button">
                    🔄 Restaurar
                  </button>
                `}
              </div>
            </div>

            <div class="roster-squad-list">
              ${state.roster.length === 0 ? `
                <div class="roster-squad-empty">
                  <div class="empty-icon">📋</div>
                  <h4>Elenco Vazio</h4>
                  <p>Sua folha salarial está 100% livre. Selecione os jogadores na mesa do mercado ao lado para compor a equipe!</p>
                  <button class="arcade-sign-btn is-mini is-gold" data-game-action="roster-draft-autocomplete" type="button">
                    🎲 Sugestão Automática de Quinteto
                  </button>
                </div>
              ` : state.roster.map((player, idx) => {
                const isSelectedForTrade = selectedTradeId === player.id;
                return `
                  <article class="roster-player-item ${isSelectedForTrade ? "is-trade-selected" : ""}">
                    <span class="player-slot-num">#${idx + 1}</span>
                    <span class="player-pos-badge is-${player.pos.toLowerCase()}">${player.pos}</span>
                    <div class="player-main-info">
                      <strong class="player-name">${escapeHtml(player.name)}</strong>
                      <span class="player-meta">${player.age || "-"} anos • ${escapeHtml(player.archetype?.label || "Atleta")}</span>
                    </div>
                    <div class="player-stats-mini">
                      <span class="stat-badge ovr">OVR <b>${formatNumber(player.currentAbility, 0)}</b></span>
                      <span class="stat-badge pot">POT <b>${formatNumber(player.potential, 0)}</b></span>
                    </div>
                    <div class="player-salary-box">
                      <strong>$${formatNumber(player.salary)}M</strong>
                    </div>
                    <div class="player-action-box">
                      ${mode === "zero" ? `
                        <button class="player-cut-btn" data-game-action="roster-draft-cut" data-player-id="${escapeHtml(player.id)}" title="Dispensar atleta e recuperar salário" type="button">
                          ✕
                        </button>
                      ` : `
                        <button class="player-trade-btn ${isSelectedForTrade ? "is-active" : ""}" data-game-action="roster-select-trade" data-player-id="${escapeHtml(player.id)}" type="button">
                          ${isSelectedForTrade ? "✓ Selecionado" : "🔄 Trocar"}
                        </button>
                      `}
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
          </div>

          <!-- COLUMN 2: 100+ ATHLETES MARKET -->
          <div class="roster-build-market-column">
            <div class="market-toolbar">
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input
                  class="market-search-input"
                  data-roster-search
                  placeholder="Buscar por nome do atleta..."
                  type="text"
                  value="${escapeHtml(state.rosterSearchQuery || "")}"
                  autocomplete="off"
                />
              </div>

              <div class="market-sort-wrapper">
                <span class="sort-lbl">Ordenar:</span>
                <select class="market-sort-select" data-game-action="set-roster-sort">
                  <option value="ovr_desc" ${sortKey === "ovr_desc" ? "selected" : ""}>Maior Força (OVR)</option>
                  <option value="pot_desc" ${sortKey === "pot_desc" ? "selected" : ""}>Maior Potencial (POT)</option>
                  <option value="salary_asc" ${sortKey === "salary_asc" ? "selected" : ""}>Menor Salário ($)</option>
                  <option value="salary_desc" ${sortKey === "salary_desc" ? "selected" : ""}>Maior Salário ($)</option>
                  <option value="age_asc" ${sortKey === "age_asc" ? "selected" : ""}>Mais Jovens</option>
                </select>
              </div>
            </div>

            <!-- FILTERS IN PILLS -->
            <div class="market-filters-row">
              <div class="filter-pills-group">
                <span class="group-label">Posição:</span>
                ${positionOptions.map((pos) => `
                  <button class="filter-pill ${activePos === pos ? "is-active" : ""}" data-game-action="set-roster-pos-filter" data-filter-pos="${pos}" type="button">
                    ${pos === "all" ? "Todas" : pos}
                  </button>
                `).join("")}
              </div>

              <div class="filter-pills-group">
                <span class="group-label">Perfil:</span>
                ${categoryOptions.map((cat) => `
                  <button class="filter-pill ${activeCat === cat.id ? "is-active" : ""}" data-game-action="set-roster-cat-filter" data-filter-cat="${cat.id}" type="button">
                    ${cat.label}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- ATHLETES GRID -->
            <div class="market-players-grid">
              ${filteredMarket.length === 0 ? `
                <div class="market-empty-notice">
                  <p>Nenhum atleta encontrado com os filtros selecionados.</p>
                </div>
              ` : filteredMarket.map((player) => {
                const canAfford = Number(player.salary) <= (budgetLeft + 0.05);
                const isRosterFull = state.roster.length >= 15;
                const cat = player.marketCategory || { label: "Atleta", badgeClass: "tier-depth" };

                let actionHtml = "";
                if (mode === "zero") {
                  if (isRosterFull) {
                    actionHtml = `<button class="secondary-button mini-btn" disabled type="button">Elenco Cheio</button>`;
                  } else if (canAfford) {
                    actionHtml = `
                      <button class="arcade-sign-btn is-mini is-gold" data-game-action="roster-draft-sign" data-player-id="${escapeHtml(player.id)}" type="button">
                        ➕ Contratar
                      </button>
                    `;
                  } else {
                    actionHtml = `<button class="secondary-button mini-btn is-disabled-btn" disabled title="Salário excede o teto restante" type="button">Sem Teto</button>`;
                  }
                } else {
                  // Situational mode
                  if (selectedTradePlayer) {
                    const salaryDelta = Number(player.salary) - Number(selectedTradePlayer.salary);
                    const canAffordTrade = salaryDelta <= (budgetLeft + 0.05);
                    const ovrDelta = Number(player.currentAbility) - Number(selectedTradePlayer.currentAbility);
                    if (canAffordTrade) {
                      actionHtml = `
                        <button class="arcade-sign-btn is-mini is-blue" data-game-action="roster-execute-trade" data-player-id="${escapeHtml(player.id)}" type="button">
                          🔄 Trocar (${ovrDelta > 0 ? "+" : ""}${ovrDelta} OVR)
                        </button>
                      `;
                    } else {
                      actionHtml = `<button class="secondary-button mini-btn is-disabled-btn" disabled title="Troca excede o orçamento" type="button">Troca Cara</button>`;
                    }
                  } else if (!isRosterFull && canAfford) {
                    actionHtml = `
                      <button class="arcade-sign-btn is-mini is-gold" data-game-action="roster-draft-sign" data-player-id="${escapeHtml(player.id)}" type="button">
                        ➕ Reforço
                      </button>
                    `;
                  } else {
                    actionHtml = `
                      <button class="secondary-button mini-btn" disabled title="Selecione um jogador do seu time para efetuar a troca" type="button">
                        Selecione Saída
                      </button>
                    `;
                  }
                }

                return `
                  <article class="market-athlete-card ${cat.badgeClass || ""}">
                    <div class="athlete-card__head">
                      <div class="athlete-pos-tag is-${player.pos.toLowerCase()}">${player.pos}</div>
                      <span class="athlete-cat-badge">${cat.label}</span>
                      <span class="athlete-age-text">${player.age}a • ${player.heightCm ? `${player.heightCm}cm` : ""}</span>
                    </div>

                    <div class="athlete-card__body">
                      <h4 class="athlete-name">${escapeHtml(player.name)}</h4>
                      <p class="athlete-archetype">${escapeHtml(player.archetype?.label || "Jogador Versátil")}</p>
                      
                      <div class="athlete-ovr-row">
                        <div class="ovr-chip">
                          <span class="ovr-chip-label">FORÇA</span>
                          <strong class="ovr-chip-val">${formatNumber(player.currentAbility, 0)}</strong>
                        </div>
                        <div class="pot-chip">
                          <span class="pot-chip-label">TETO</span>
                          <strong class="pot-chip-val">${formatNumber(player.potential, 0)}</strong>
                        </div>
                      </div>

                      <div class="athlete-tags-strip">
                        ${(player.archetype?.scoutTags || []).slice(0, 3).map((tag) => `
                          <span class="mini-scout-tag">${escapeHtml(tag)}</span>
                        `).join("")}
                      </div>
                    </div>

                    <div class="athlete-card__foot">
                      <div class="athlete-price">
                        <span class="price-lbl">Salário:</span>
                        <strong class="price-val">$${formatNumber(player.salary)}M/ano</strong>
                      </div>
                      <div class="athlete-action">
                        ${actionHtml}
                      </div>
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- STICKY FOOTER -->
        <footer class="roster-build-footer">
          <div class="footer-readiness-read">
            ${readiness.ready ? `
              <div class="readiness-status is-success">
                <span class="status-icon">✅</span>
                <div>
                  <strong>Elenco Regularizado!</strong>
                  <p>Todas as posições estão cobertas, mínimo cumprido e folha dentro do teto.</p>
                </div>
              </div>
            ` : `
              <div class="readiness-status is-warning">
                <span class="status-icon">⚠️</span>
                <div>
                  <strong>Ajustes Pendentes:</strong>
                  <p>${readiness.errors.join(" • ")}</p>
                </div>
              </div>
            `}
          </div>

          <div class="footer-actions-group">
            <button class="secondary-button" data-game-action="back-to-mode-select" type="button">
              ⬅️ Trocar Modo
            </button>
            <button
              class="arcade-sign-btn is-large ${readiness.ready ? "is-ready-pulsing is-gold" : "is-locked"}"
              data-game-action="finalize-roster-and-play"
              ${readiness.ready ? "" : "disabled"}
              type="button"
            >
              🚀 INICIAR TEMPORADA COM ESTE ELENCO
            </button>
          </div>
        </footer>
      </section>
    `;
  }

  function renderMarket(state) {
    const marketOpen = Number(state.currentWeek || 1) <= 1;
    const money = getMarketMoneyRead(state);
    const market = isVolleyball(state)
      ? window.TemporadaTotal?.generateProceduralVolleyballMarket?.(state.seed, { count: 100, profile: "balanced" })
      : isFutsal(state)
        ? window.TemporadaTotal?.generateProceduralFutsalMarket?.(state.seed, { count: 100, profile: "balanced" })
        : window.TemporadaTotal?.generateProceduralBasketballMarket?.(state.seed, { count: 100, profile: "balanced" });

    const fit = market && window.TemporadaTotal?.analyzeProceduralMarketFitForClub
      ? window.TemporadaTotal.analyzeProceduralMarketFitForClub(state.userTeam, market, { limit: 8 })
      : null;
    latestMarketFit = fit;
    const rows = fit?.topFits || [];
    const selectedId = state.marketSelectionId && rows.some((player) => player.id === state.marketSelectionId)
      ? state.marketSelectionId
      : rows[0]?.id;
    const selectedPlayer = rows.find((player) => player.id === selectedId) || null;
    return `
      <section class="procedural-game-section">
        <div class="section-header">
          <div>
            <h2>Mercado</h2>
            <span class="hint">${marketOpen ? (isVolleyball(state) ? "Janela aberta: busque encaixes de saque, passe e bloqueio nesta primeira semana." : "Janela aberta: contrate nesta primeira semana.") : "Janela fechada: novas contratacoes ficam bloqueadas apos a semana 1."}</span>
          </div>
        </div>
        ${fit ? `
          <div class="procedural-market-window ${marketOpen ? "is-open" : "is-closed"}">
            <div>
              <span>Janela de mercado</span>
              <strong>${marketOpen ? "Aberta" : "Fechada"}</strong>
            </div>
            <p>${marketOpen ? (isVolleyball(state) ? "A diretoria permite ajustes imediatos na rotacao durante a primeira semana." : "A diretoria permite ajustes imediatos no elenco durante a primeira semana.") : "A diretoria fechou a janela. Use o restante da temporada para avaliar necessidades."}</p>
          </div>
          <div class="procedural-market-money ${money.budgetLeft < 0 ? "is-negative" : ""}">
            <article>
              <span>Dinheiro disponivel</span>
              <strong>$${formatNumber(money.budgetLeft)}M</strong>
              <p>${isVolleyball(state) ? "Valor restante para reforcar a rotacao." : "Valor restante para contratar."}</p>
            </article>
            <article>
              <span>Orcamento</span>
              <strong>$${formatNumber(money.budget)}M</strong>
              <p>${escapeHtml(labelFor(money.loreLabel))} define o folego inicial.</p>
            </article>
            <article>
              <span>Folha atual</span>
              <strong>$${formatNumber(money.totalSalary)}M</strong>
              <p>${escapeHtml(money.status)}</p>
            </article>
          </div>
          <div class="procedural-market-layout">
            <div class="procedural-market-grid">
              ${rows.map((player) => {
                const sandbox = getMarketSandbox(state, player);
                const salaryDelta = Number(sandbox.delta?.totalSalary) || 0;
                const currentDelta = Number(sandbox.delta?.averageCurrentAbility) || 0;
                const comparable = getComparableRosterPlayer(state, player);
                const needsRelease = marketNeedsRelease(state, player);
                const releaseReady = !needsRelease || Boolean(sandbox.manuallySelectedRelease);
                const signDisabled = !marketOpen || !releaseReady;
                return `
                  <article class="procedural-market-card ${player.id === selectedId ? "is-selected" : ""}" data-market-select="${escapeHtml(player.id)}">
                    <div class="procedural-market-card__head">
                      <div>
                        <span class="status-pill">${escapeHtml(player.pos)}</span>
                        <h3>${escapeHtml(player.name)}</h3>
                        <p>${escapeHtml(getMarketDecisionLabel(player))}</p>
                      </div>
                      <div class="procedural-fit-score">
                        <span>Encaixe</span>
                        <strong>${formatNumber(player.clubFitScore)}</strong>
                      </div>
                    </div>
                    <div class="procedural-market-metrics">
                      <div><span>CA</span><strong>${formatNumber(player.currentAbility, 0)}</strong></div>
                      <div><span>POT</span><strong>${formatNumber(player.potential, 0)}</strong></div>
                      <div><span>Salario</span><strong>$${formatNumber(player.salary)}M</strong></div>
                      <div><span>Folha</span><strong>${salaryDelta > 0 ? "+" : ""}$${formatNumber(salaryDelta)}M</strong></div>
                    </div>
                    <div class="procedural-market-read">
                      <div><span>Perfil</span><strong>${escapeHtml(getMarketPlayerProfile(player))}</strong></div>
                      <div><span>Forca</span><strong>${escapeHtml(getMarketMainStrength(player))}</strong></div>
                      <div><span>Risco</span><strong>${escapeHtml(getMarketCardRisk(player, comparable))}</strong></div>
                    </div>
                    <div class="procedural-market-impact">
                      <strong>${needsRelease ? (releaseReady ? "Saida escolhida" : "Escolha quem sai") : "Sem corte obrigatorio"}</strong>
                      <span>CA ${currentDelta > 0 ? "+" : ""}${formatNumber(currentDelta)} | folha ${salaryDelta > 0 ? "+" : ""}$${formatNumber(salaryDelta)}M</span>
                      <span>Saida: ${escapeHtml(sandbox.outgoing?.name || "sem corte")} ${sandbox.releaseCost ? `| custo $${formatNumber(sandbox.releaseCost)}M` : ""}</span>
                    </div>
                    <div class="procedural-market-actions">
                      <button class="secondary-button" data-market-compare="${escapeHtml(player.id)}" type="button">${player.id === selectedId ? "Comparando" : "Comparar"}</button>
                      <button class="secondary-button" data-market-sign="${escapeHtml(player.id)}" type="button" ${signDisabled ? "disabled" : ""}>${!marketOpen ? "Janela fechada" : releaseReady ? "Contratar" : "Escolha saida"}</button>
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
            ${renderMarketComparison(state, selectedPlayer)}
          </div>
        ` : '<div class="procedural-empty">Mercado indisponivel no momento.</div>'}
      </section>
    `;
  }

  function renderLog(state) {
    return `
      <section class="procedural-game-section">
        <div class="section-header">
          <div>
            <h2>Bastidores da Temporada</h2>
          <span class="hint">A carreira como uma linha narrativa de escolhas, resultados e consequencias.</span>
          </div>
        </div>
        ${renderBackstageFeed(state, 30)}
      </section>
    `;
  }

  function renderIntro(state) {
    const team = state.userTeam || {};
    const leagueRows = state.league?.standingsPreview || state.league?.teams || [];
    return `
      <section class="procedural-game-section">
        <div class="procedural-intro-hero">
          ${renderClubCrest(team, "is-hero")}
          <div>
            <span class="eyebrow">Sua temporada</span>
            <h2>${escapeHtml(team.name || "Seu clube")}</h2>
            <p>${escapeHtml(getClubOpening(team))}</p>
            ${getClubDilemma(team) !== getClubOpening(team) ? `<p class="procedural-intro-dilemma">${escapeHtml(getClubDilemma(team))}</p>` : ""}
          </div>
          <div class="procedural-team-badge">
            <span>Objetivo</span>
            <strong>${escapeHtml(team.objective || "-")}</strong>
          </div>
        </div>
        <details class="procedural-intro-details">
          <summary>Conhecer o elenco e os adversarios</summary>
        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric"><span>Forca</span><strong>${formatNumber(team.rating?.overall)}</strong></article>
          <article class="metric-card procedural-metric"><span>Orcamento</span><strong>$${formatNumber(team.budget)}M</strong></article>
          <article class="metric-card procedural-metric"><span>Elenco</span><strong>${team.roster?.summary?.rosterSize || state.roster?.length || 0} atletas</strong></article>
          <article class="metric-card procedural-metric"><span>Contexto</span><strong>${escapeHtml(team.lore?.label || "-")}</strong></article>
          <article class="metric-card procedural-metric"><span>Formato</span><strong>${state.league?.format?.type === "groups-knockout" ? "8 grupos" : `${state.league?.teams?.length || 0} clubes`}</strong></article>
        </div>
        <div class="procedural-roster-notes">
          <article><span>Pontos fortes</span><strong>${team.strengths?.length ? team.strengths.map(escapeHtml).join(" | ") : "A descobrir"}</strong></article>
          <article><span>Fraquezas</span><strong>${team.weaknesses?.length ? team.weaknesses.map(escapeHtml).join(" | ") : "A descobrir"}</strong></article>
        </div>
        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead><tr><th>Rank</th><th>Clube</th><th>Forca</th><th>Contexto</th><th>Objetivo</th></tr></thead>
            <tbody>
              ${leagueRows.slice(0, 8).map((row, index) => `
                <tr class="${row.id === team.id ? "is-user-team" : ""}">
                  <td>${row.projectedRank || index + 1}</td>
                  <td><span class="club-table-cell">${renderClubCrest(row, "is-table")}<strong>${escapeHtml(row.name)}</strong></span></td>
                  <td>${formatNumber(row.rating?.overall || row.rating)}</td>
                  <td>${escapeHtml(row.lore?.label || row.loreLabel || "")}</td>
                  <td>${escapeHtml(row.objective || "")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        </details>
        <div class="procedural-calendar-actions">
          <button class="primary-button" data-game-action="start-season-flow" type="button">Comecar temporada</button>
          <button class="secondary-button" data-game-action="new-season" type="button">Escolher outra historia</button>
        </div>
      </section>
    `;
  }

  function renderLiveMatch(state) {
    const live = state.liveMatch;
    const next = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    if (!live) {
      return `
        <section class="procedural-game-section">
          <div class="procedural-empty live-prep-box" style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.7); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">🏟️</span>
            <h3 style="margin: 0 0 8px; font-size: 1.4rem; color: #fff;">Preparação de Partida</h3>
            <p style="color: #94a3b8; margin: 0 auto 20px; max-width: 520px;">
              ${next ? `O próximo confronto está agendado para o Dia ${next.day} contra <b>${escapeHtml(next.opponentName || "o adversário")}</b>.` : "Não há partidas marcadas no calendário neste momento."}
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              ${next ? `
                <button class="primary-button is-pulsing" data-game-action="play-live" data-event-id="${escapeHtml(next.id)}" type="button">
                  🎮 Entrar na Transmissão
                </button>
                <button class="secondary-button" data-game-action="simulate-match-now" type="button">
                  ⚡ Simular Agora
                </button>
              ` : ""}
              <button class="secondary-button" data-game-tab="hub" type="button">
                Voltar para a Central
              </button>
            </div>
          </div>
        </section>
      `;
    }
    return `
      <section class="procedural-game-section procedural-live-section">
        <div class="live-match-topbar">
          <div class="live-match-topbar-left">
            <button class="secondary-button mini-btn" data-game-tab="hub" type="button">
              ◀ Sair da Partida / Central
            </button>
            <span class="live-match-badge pulse-red">🔴 TRANSMISSÃO AO VIVO</span>
            <span class="live-match-context">Semana ${state.currentWeek} • Dia ${state.currentDay}</span>
          </div>
          ${live.saved ? `
            <button class="primary-button mini-btn" data-game-tab="hub" type="button">Ir para a Central →</button>
          ` : ""}
        </div>

        ${live.saved ? `
          <div class="live-saved-alert" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 12px 18px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <span style="color: #6ee7b7; font-weight: 700;">✅ Resultado registrado na temporada!</span>
            <button class="primary-button mini-btn" data-game-tab="hub" type="button">Ir para a Central →</button>
          </div>
        ` : ""}

        ${!state.minigameBuff && !live.saved ? `
          <div class="live-warmup-reminder" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 16px; margin-bottom: 14px; border-radius: 12px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35);">
            <span style="font-size: 0.88rem; color: #fef08a;">🔥 <strong>Vestiário:</strong> Deseja fazer o Aquecimento de Quadra para ganhar até +4.5 de rating antes do início?</span>
            <button class="primary-button mini-btn is-pulsing" data-game-tab="warmup" type="button">Fazer Aquecimento →</button>
          </div>
        ` : ""}
        <div data-procedural-live-match-root class="procedural-live-match-root"></div>
      </section>
    `;
  }

  function renderActiveTab(state, folderSaves = [], folderStatus = {}) {
    if (state.activeTab === "hub") return renderClubHub(state);
    if (state.activeTab === "warmup" || state.activeTab === "training") return renderWarmupScreen(state);
    if (state.activeTab === "story" || state.activeTab === "decisions") {
      return window.TemporadaTotal.DecisionNetworkEngine?.renderDecisionNetworkView
        ? window.TemporadaTotal.DecisionNetworkEngine.renderDecisionNetworkView(state)
        : renderLog(state);
    }
    if (state.activeTab === "calendar") return window.TemporadaTotal.CalendarUI.renderCalendar(state);
    if (state.activeTab === "roster" || state.activeTab === "team") {
      return `
        <div class="roster-and-tactics-hub">
          ${window.TemporadaTotal.TeamHubUI ? window.TemporadaTotal.TeamHubUI.renderTeamHub(state) : ""}
          <div class="roster-section-divider">
            <span class="eyebrow">Jogadores</span>
            <h3>Atletas do Elenco</h3>
          </div>
          ${window.TemporadaTotal.RosterUI.renderRoster(state)}
        </div>
      `;
    }
    if (state.activeTab === "league") return renderLeague(state);
    if (state.activeTab === "live") return renderLiveMatch(state);
    if (state.activeTab === "market") return renderMarket(state);
    if (state.activeTab === "log") return renderLog(state);
    if (state.activeTab === "saves") {
      return `
        <section class="procedural-game-section">
          <div class="procedural-calendar-head">
            <div>
              <span class="eyebrow">Saves</span>
              <h2>Salvar e carregar carreira</h2>
              <p class="hint">Guarde seu progresso e retome quando quiser.</p>
            </div>
          </div>
          ${renderSavePanel(state, folderSaves, folderStatus)}
        </section>
      `;
    }
    return renderClubHub(state);
  }

  function createProceduralGameShell(root, options = {}) {
    if (!root) return null;
    const sportId = options.sportId || root.dataset?.sportId || document.body?.dataset?.sportId || "basquete";
    const sportVariant = options.sportVariant || root.dataset?.sportVariant || document.body?.dataset?.sportVariant || "";
    const division = options.division || root.dataset?.division || document.body?.dataset?.division || (sportVariant === "volei-feminino" ? "feminino" : "");
    const getMatchAdapter = () => {
      const currentSport = state?.sportId || state?.userTeam?.sportId || sportId;
      if (currentSport === "volei") return window.TemporadaTotal?.VolleyballMatchAdapter;
      if (currentSport === "futsal") return window.TemporadaTotal?.FutsalMatchAdapter;
      return window.TemporadaTotal?.BasketballMatchAdapter
        || window.TemporadaTotal?.MatchAdapter
        || window.TemporadaTotal?.FutsalMatchAdapter
        || window.TemporadaTotal?.VolleyballMatchAdapter;
    };
    let seedDraft = options.seed || DEFAULT_SEED;
    let selectedUserTeamIndex = Number(options.userTeamIndex) || 0;
    let seedCustomization = {};
    let previewState = applySeedCustomization(
      window.TemporadaTotal.createProceduralGameState({ seed: seedDraft, sportId, sportVariant, division, userTeamIndex: selectedUserTeamIndex }),
      seedCustomization
    );
    let state = null;
    let liveController = null;
    let liveUi = null;
    let folderSaves = [];
    let folderStatus = {
      connected: false,
      loading: false,
      supported: Boolean(window.TemporadaTotal?.ProceduralCareerSave?.isFolderSaveSupported?.())
    };

    function getSaveScope() {
      return { sportId, sportVariant };
    }

    async function refreshFolderSaves({ rerender = false } = {}) {
      const saveApi = window.TemporadaTotal.ProceduralCareerSave;
      if (!saveApi?.isFolderSaveSupported?.()) {
        folderSaves = [];
        folderStatus = { ...folderStatus, connected: false, supported: false, loading: false };
        if (rerender) render();
        return;
      }
      folderStatus = { ...folderStatus, supported: true, loading: true };
      const result = await saveApi.listFolderCareers(getSaveScope());
      folderSaves = result?.ok ? result.saves || [] : [];
      folderStatus = {
        ...folderStatus,
        connected: Boolean(result?.ok),
        loading: false,
        lastError: result?.ok ? "" : formatSaveErrors(result?.errors)
      };
      if (rerender) render();
    }

    async function connectFolderAndRefresh() {
      const saveApi = window.TemporadaTotal.ProceduralCareerSave;
      const result = await saveApi.connectSaveFolder?.();
      if (!result?.ok) {
        if (state) setSaveMessage(state, "error", `Nao foi possivel conectar a pasta: ${formatSaveErrors(result?.errors)}.`);
        folderStatus = { ...folderStatus, connected: false, lastError: formatSaveErrors(result?.errors) };
        render();
        return result;
      }
      folderStatus = { ...folderStatus, connected: true, lastError: "" };
      await refreshFolderSaves({ rerender: false });
      if (state) setSaveMessage(state, "success", "Pasta de saves conectada.");
      render();
      return result;
    }

    function getEventById(eventId) {
      return (state.calendar?.events || []).find((event) => event.id === eventId) || null;
    }

    function prepareLiveMatch(eventId) {
      if (!state) return false;
      const event = (eventId ? getEventById(eventId) : null)
        || window.TemporadaTotal.GameState.getNextMatchEvent(state);
      if (!event) {
        window.TemporadaTotal.GameState.addLog(state, "system", "Partida indisponivel", "Nao ha partida pendente no calendario.");
        return false;
      }
      if (event?.knockout && !event.opponentId) {
        window.TemporadaTotal.CalendarEngine?.resolveKnockoutEvent?.(state, event);
      }
      let opponent = (state.league?.teams || []).find((team) => team.id === event?.opponentId);
      if (!opponent && event?.opponentName) {
        opponent = (state.league?.teams || []).find((team) => team.name === event.opponentName);
      }
      if (!opponent) {
        opponent = (state.league?.teams || []).find((team) => team.id !== state.userTeam?.id) || null;
      }
      const adapter = getMatchAdapter();
      if (!opponent || !adapter || !window.TemporadaTotal?.createLiveSimulation || !window.TemporadaTotal?.createLiveMatchUI) {
        window.TemporadaTotal.GameState.addLog(state, "system", "Partida ao vivo indisponivel", "Modulos de simulacao ao vivo nao foram carregados.");
        return false;
      }
      const homeTeam = window.TemporadaTotal.GameState.buildLiveTeamFromClub(state.userTeam, "home");
      const awayTeam = window.TemporadaTotal.GameState.buildLiveTeamFromClub(opponent, "away");
      state.liveMatch = { eventId: event.id, opponentId: opponent.id, saved: false, homeTeam, awayTeam };
      liveController = null;
      liveUi = null;
      state.activeTab = "live";
      return true;
    }

    function mountLiveMatchIfNeeded() {
      if (state.activeTab !== "live" || !state.liveMatch) return;
      const liveRoot = root.querySelector("[data-procedural-live-match-root]");
      if (!liveRoot) return;
      const adapter = getMatchAdapter();
      if (!adapter) return;
      if (!liveController) {
        liveController = window.TemporadaTotal.createLiveSimulation({
          adapter,
          homeTeam: state.liveMatch.homeTeam,
          awayTeam: state.liveMatch.awayTeam,
          onUpdate: (matchState) => liveUi?.render(matchState)
        });
      }
      if (!liveUi) {
        liveUi = window.TemporadaTotal.createLiveMatchUI({
          root: liveRoot,
          schema: adapter.getMatchStatsSchema(),
          canSaveResult: (matchState) => matchState?.status === "finished" && !state.liveMatch.saved,
          onStart: () => liveController.start(),
          onPause: () => liveController.pause(),
          onSpeed: (speed) => liveController.setSpeed(speed),
          onFinish: () => liveController.finish(),
          onCoachingChange: (patch, meta) => liveController.setCoaching?.(patch, meta),
          onSaveResult: (matchState) => {
            const event = getEventById(state.liveMatch.eventId);
            window.TemporadaTotal.CalendarEngine.applyExternalMatchResult(state, event, matchState);
            state.liveMatch.saved = true;
            state.activeTab = "hub";
            render();
          }
        });
      }
      liveUi.render(liveController.getState());
      window.TemporadaTotal.PhaserEnhancements?.mountLiveScene?.(root, state, { sportId, sportVariant });
    }

    function rebuildPreviewState() {
      previewState = applySeedCustomization(
        window.TemporadaTotal.createProceduralGameState({ seed: seedDraft, sportId, sportVariant, division, userTeamIndex: selectedUserTeamIndex }),
        seedCustomization
      );
      return previewState;
    }

    function render() {
      if (!state) {
        root.innerHTML = `
          <div class="procedural-game-shell">
            ${renderSeedSetup(previewState, seedDraft, seedCustomization, folderSaves, folderStatus)}
          </div>
        `;
        window.TemporadaTotal.PhaserEnhancements?.mountCareerScene?.(root, previewState, { sportId, sportVariant });
        return;
      }
      if (state.status === "roster_mode_select") {
        root.innerHTML = `
          <div class="procedural-game-shell">
            ${renderRosterModeSelectScreen(state)}
          </div>
        `;
        return;
      }
      if (state.status === "roster_building") {
        root.innerHTML = `
          <div class="procedural-game-shell">
            ${renderRosterBuildingScreen(state)}
          </div>
        `;
        return;
      }
      if (state.status !== "intro" && isUserEliminatedFromTournament(state)) {
        root.innerHTML = `
          <div class="procedural-game-shell">
            ${renderEliminationScreen(state)}
          </div>
        `;
        return;
      }
      const visibleTabs = getVisibleTabs(state);
      if (state.activeTab !== "live" && state.activeTab !== "warmup" && !visibleTabs.some(([key]) => key === state.activeTab)) {
        state.activeTab = "hub";
      }
      if (state.activeTab === "live" && !state.liveMatch) {
        const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
        if (nextMatch) {
          prepareLiveMatch(nextMatch.id);
        }
      }
      const userStanding = getUserStanding(state);
      const record = userStanding ? `${userStanding.wins}-${userStanding.losses}` : "0-0";
      const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
      const matchReady = nextMatch && Number(nextMatch.day) <= Number(state.currentDay) && !nextMatch.processed;
      root.innerHTML = `
        <div class="procedural-game-shell">
          ${renderAdvancedTools(state, folderSaves, folderStatus)}

          ${state.status === "intro" || state.activeTab === "live" || state.activeTab === "warmup" ? "" : `
            ${renderCareerHeader(state, record)}
            <nav class="game-main-nav-bar" aria-label="Menu Principal da Carreira">
              <div class="game-nav-track">
                ${visibleTabs.map(([key, label, icon]) => {
                  let badge = "";
                  if (key === "hub" && state.pendingDecision) badge = `<span class="nav-pill-badge is-alert">!</span>`;
                  else if (key === "hub" && matchReady) badge = `<span class="nav-pill-badge is-ready">⚡</span>`;
                  if (key === "story" && state.pendingDecision) badge = `<span class="nav-pill-badge is-alert">!</span>`;
                  const isActive = state.activeTab === key;
                  return `
                    <button class="game-nav-pill ${isActive ? "is-active" : ""}" ${isActive ? 'aria-current="page"' : ""} data-game-tab="${key}" type="button">
                      <span class="nav-pill-icon">${icon || "•"}</span>
                      <span class="nav-pill-text">${label}</span>
                      ${badge}
                    </button>
                  `;
                }).join("")}
              </div>
            </nav>
            ${renderActionBanners(state)}
          `}

          ${state.status === "intro" ? renderIntro(state) : renderActiveTab(state, folderSaves, folderStatus)}
        </div>
      `;
      window.TemporadaTotal.PhaserEnhancements?.mountCareerScene?.(root, state, { sportId, sportVariant });
      window.TemporadaTotal.PhaserEnhancements?.mountKnockoutScene?.(root, state, { sportId, sportVariant });
      mountLiveMatchIfNeeded();
      if (state.activeTab === "warmup" || state.activeTab === "training") {
        const host = root.querySelector("#minigame-arcade-host");
        if (host && window.TemporadaTotal?.MinigamesEngine) {
          window.TemporadaTotal.MinigamesEngine.launchMinigame(host, {
            sportId,
            gameState: state,
            onFinish: () => {
              state.activeTab = "hub";
              render();
            },
            onPlayLive: () => {
              const next = window.TemporadaTotal.GameState.getNextMatchEvent(state);
              if (next) prepareLiveMatch(next.id);
              render();
            },
            onSimulate: () => {
              const next = window.TemporadaTotal.GameState.getNextMatchEvent(state);
              if (next) {
                window.TemporadaTotal.CalendarEngine.processEvent(state, next);
                state.activeTab = "hub";
                render();
              }
            },
            onCancel: () => {
              state.activeTab = "hub";
              render();
            }
          });
        }
      }
    }

    root.addEventListener("click", async (event) => {
      const focusButton = event.target.closest("[data-team-focus]");
      if (focusButton) {
        window.TemporadaTotal.GameState.applyWeeklyFocus(state, focusButton.dataset.teamFocus);
        render();
        return;
      }

      const decisionButton = event.target.closest("[data-decision-choice]");
      if (decisionButton) {
        window.TemporadaTotal.MinigamesEngine?.playArcadeSound?.("good");
        window.TemporadaTotal.CalendarEngine.applyNarrativeDecision(state, decisionButton.dataset.decisionChoice);
        render();
        return;
      }

      const marketCompare = event.target.closest("[data-market-compare]");
      if (marketCompare) {
        state.marketSelectionId = marketCompare.dataset.marketCompare;
        render();
        return;
      }

      const marketRelease = event.target.closest("[data-market-release]");
      if (marketRelease) {
        state.marketSelectionId = marketRelease.dataset.marketRelease;
        state.marketReleaseSelections = {
          ...(state.marketReleaseSelections || {}),
          [marketRelease.dataset.marketRelease]: marketRelease.dataset.releasePlayerId
        };
        render();
        return;
      }

      const marketButton = event.target.closest("[data-market-sign]");
      if (marketButton) {
        if (Number(state.currentWeek || 1) > 1) {
          window.TemporadaTotal.GameState.addLog(state, "market", "Janela fechada", "Contratacoes so ficam disponiveis na primeira semana.");
          render();
          return;
        }
        const player = (latestMarketFit?.rows || latestMarketFit?.topFits || []).find((row) => row.id === marketButton.dataset.marketSign);
        if (player) {
          const sandbox = getMarketSandbox(state, player);
          if (marketNeedsRelease(state, player) && !sandbox.manuallySelectedRelease) {
            state.marketSelectionId = player.id;
            window.TemporadaTotal.GameState.addLog(state, "market", "Escolha pendente", "Selecione quem sera liberado antes de confirmar a contratacao.");
            render();
            return;
          }
          window.TemporadaTotal.GameState.signSandboxPlayer(state, player, sandbox);
          state.marketReleaseSelections = {
            ...(state.marketReleaseSelections || {}),
            [player.id]: ""
          };
          render();
        }
        return;
      }

      const marketSelect = event.target.closest("[data-market-select]");
      if (marketSelect) {
        state.marketSelectionId = marketSelect.dataset.marketSelect;
        render();
        return;
      }

      const tabButton = event.target.closest("[data-game-tab]");
      if (tabButton) {
        const targetTab = tabButton.dataset.gameTab || "hub";
        if (targetTab === "live" && !state.liveMatch) {
          const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
          if (nextMatch) {
            prepareLiveMatch(nextMatch.id);
          }
        }
        state.activeTab = targetTab;
        render();
        return;
      }

      const leagueTeam = event.target.closest("[data-league-team-id]");
      if (leagueTeam) {
        state.selectedLeagueTeamId = leagueTeam.dataset.leagueTeamId;
        render();
        return;
      }

      const actionButton = event.target.closest("[data-game-action]");
      if (actionButton) {
        const action = actionButton.dataset.gameAction;
        if (action === "connect-save-folder") {
          await connectFolderAndRefresh();
          return;
        }
        if (action === "refresh-folder-saves") {
          await refreshFolderSaves({ rerender: true });
          if (state) setSaveMessage(state, folderStatus.connected ? "success" : "error", folderStatus.connected ? "Lista da pasta atualizada." : `Nao foi possivel ler a pasta: ${folderStatus.lastError || "pasta nao conectada"}.`);
          render();
          return;
        }
        if (action === "random-seed") {
          seedDraft = createSeedValue();
          selectedUserTeamIndex = 0;
          seedCustomization = {};
          rebuildPreviewState();
          render();
          return;
        }
        if (action === "update-seed-preview") {
          seedDraft = root.querySelector("[data-seed-draft]")?.value.trim() || DEFAULT_SEED;
          selectedUserTeamIndex = 0;
          seedCustomization = {};
          rebuildPreviewState();
          render();
          return;
        }
        if (action === "apply-seed-customization") {
          seedCustomization = getCustomizationFromRoot(root, seedCustomization);
          applySeedCustomization(previewState, seedCustomization);
          render();
          return;
        }
        if (action === "sign-contract" || action === "confirm-seed") {
          const draftIndex = actionButton.dataset.draftTeamIndex !== undefined
            ? Number(actionButton.dataset.draftTeamIndex)
            : selectedUserTeamIndex;
          if (Number.isInteger(draftIndex) && draftIndex >= 0) {
            selectedUserTeamIndex = draftIndex;
          }
          seedDraft = root.querySelector("[data-seed-draft]")?.value.trim() || seedDraft || DEFAULT_SEED;
          seedCustomization = getCustomizationFromRoot(root, seedCustomization);
          previewState = rebuildPreviewState();
          state = applySeedCustomization(previewState, seedCustomization);
          state.status = "roster_mode_select";
          state.rosterDraftMarket = null;
          state.originalBaseRoster = state.roster.slice();
          document.body.classList.add("career-has-started");
          previewState = null;
          liveController = null;
          liveUi = null;
          render();
          return;
        }
        if (action === "choose-roster-mode") {
          const mode = actionButton.dataset.rosterMode || "zero";
          state.rosterBuildMode = mode;
          if (mode === "zero") {
            state.roster = [];
            state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
          } else {
            state.roster = (state.originalBaseRoster || []).slice();
            state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
          }
          state.status = "roster_building";
          initRosterDraftMarket(state);
          render();
          return;
        }
        if (action === "back-to-mode-select") {
          state.status = "roster_mode_select";
          render();
          return;
        }
        if (action === "back-to-proposals") {
          state = null;
          document.body.classList.remove("career-has-started");
          previewState = rebuildPreviewState();
          render();
          return;
        }
        if (action === "finalize-roster-and-play") {
          const readiness = validateRosterReadiness(state);
          if (!readiness.ready) {
            alert("Para estrear, ajuste seu elenco: \n- " + readiness.errors.join("\n- "));
            return;
          }
          state.status = "playing";
          state.activeTab = "hub";
          window.TemporadaTotal.GameState.syncUserTeamRoster(state);
          window.TemporadaTotal.GameState.addLog(
            state,
            "team",
            "Elenco Definido para a Estreia",
            state.rosterBuildMode === "zero"
              ? `O técnico concluiu a montagem do elenco no mercado com folha livre (${state.roster.length} atletas). Folha total: $${formatNumber(state.summary.totalSalary)}M.`
              : `O técnico confirmou o elenco após ajustes situacionais (${state.roster.length} atletas). Folha total: $${formatNumber(state.summary.totalSalary)}M.`
          );
          try {
            const name = getDefaultCareerName(state);
            window.TemporadaTotal.ProceduralCareerSave?.saveCareer?.(state, name);
          } catch (e) {
            console.warn("Auto-save:", e);
          }
          render();
          return;
        }
        if (action === "roster-draft-sign") {
          const playerId = actionButton.dataset.playerId;
          initRosterDraftMarket(state);
          const pIndex = state.rosterDraftMarket.players.findIndex((p) => p.id === playerId);
          if (pIndex !== -1) {
            const player = state.rosterDraftMarket.players[pIndex];
            if (state.roster.length >= 15) {
              alert("O elenco já atingiu o limite regulamentar máximo de 15 atletas.");
              return;
            }
            if (Number(player.salary) > ((Number(state.summary?.budgetLeft) || 0) + 0.05)) {
              alert(`Salário de $${formatNumber(player.salary)}M excede o saldo restante de $${formatNumber(state.summary.budgetLeft)}M.`);
              return;
            }
            state.rosterDraftMarket.players.splice(pIndex, 1);
            state.roster.push(normalizePlayerForRoster(player, state));
            state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
            render();
          }
          return;
        }
        if (action === "roster-draft-cut") {
          const playerId = actionButton.dataset.playerId;
          const pIndex = state.roster.findIndex((p) => p.id === playerId);
          if (pIndex !== -1) {
            const [cutPlayer] = state.roster.splice(pIndex, 1);
            initRosterDraftMarket(state);
            if (!state.rosterDraftMarket.players.some((p) => p.id === cutPlayer.id)) {
              state.rosterDraftMarket.players.unshift(cutPlayer);
            }
            state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
            render();
          }
          return;
        }
        if (action === "roster-select-trade") {
          const playerId = actionButton.dataset.playerId;
          state.rosterSelectedForTradeId = state.rosterSelectedForTradeId === playerId ? null : playerId;
          render();
          return;
        }
        if (action === "roster-execute-trade") {
          const outgoingId = state.rosterSelectedForTradeId;
          const incomingId = actionButton.dataset.playerId;
          if (!outgoingId) {
            alert("Selecione primeiro um atleta do seu elenco para servir de moeda de troca.");
            return;
          }
          initRosterDraftMarket(state);
          const outIndex = state.roster.findIndex((p) => p.id === outgoingId);
          const inIndex = state.rosterDraftMarket.players.findIndex((p) => p.id === incomingId);
          if (outIndex !== -1 && inIndex !== -1) {
            const outgoing = state.roster[outIndex];
            const incoming = state.rosterDraftMarket.players[inIndex];
            const salaryDelta = Number(incoming.salary) - Number(outgoing.salary);
            if (salaryDelta > ((Number(state.summary?.budgetLeft) || 0) + 0.05)) {
              alert(`Esta troca aumentaria a folha em $${salaryDelta.toFixed(1)}M, excedendo seu saldo restante.`);
              return;
            }
            state.roster[outIndex] = normalizePlayerForRoster(incoming, state);
            state.rosterDraftMarket.players[inIndex] = outgoing;
            state.rosterSelectedForTradeId = null;
            state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
            render();
          }
          return;
        }
        if (action === "roster-draft-autocomplete") {
          autocompleteRoster(state);
          render();
          return;
        }
        if (action === "roster-draft-clear") {
          initRosterDraftMarket(state);
          state.roster.forEach((p) => {
            if (!state.rosterDraftMarket.players.some((m) => m.id === p.id)) {
              state.rosterDraftMarket.players.unshift(p);
            }
          });
          state.roster = [];
          state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
          render();
          return;
        }
        if (action === "roster-draft-reset-base") {
          state.roster = (state.originalBaseRoster || []).slice();
          state.rosterSelectedForTradeId = null;
          state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
          render();
          return;
        }
        if (action === "set-roster-pos-filter") {
          state.rosterFilterPos = actionButton.dataset.filterPos || "all";
          render();
          return;
        }
        if (action === "set-roster-cat-filter") {
          state.rosterFilterCat = actionButton.dataset.filterCat || "all";
          render();
          return;
        }
        if (action === "set-roster-sort") {
          state.rosterSort = actionButton.dataset.sortKey || actionButton.value || "ovr_desc";
          render();
          return;
        }
        if (action === "back-to-landing") {
          document.body.classList.remove("career-has-started");
          return;
        }
      if (action === "new-season") {
        const seed = root.querySelector("[data-game-seed]")?.value.trim() || DEFAULT_SEED;
        if (root.querySelector("[data-game-seed]")) {
          state = window.TemporadaTotal.createProceduralGameState({ seed, sportId, sportVariant, division });
        } else {
          seedDraft = createSeedValue();
          selectedUserTeamIndex = 0;
          seedCustomization = {};
          rebuildPreviewState();
          state = null;
          document.body.classList.remove("career-has-started");
        }
        liveController = null;
        liveUi = null;
        render();
      }
      if (action === "quick-save-career") {
        const name = getDefaultCareerName(state);
        const saveApi = window.TemporadaTotal.ProceduralCareerSave;
        const result = folderStatus.connected
          ? await saveApi?.saveCareerToFolder?.(state, name)
          : saveApi?.saveCareer?.(state, name);
        if (!result?.ok) {
          setSaveMessage(state, "error", `Nao foi possivel salvar: ${formatSaveErrors(result?.errors)}.`);
          render();
          return;
        }
        const saved = result.save;
        state.careerMeta = { id: saved.id, name: saved.name, savedAt: saved.savedAt, schemaVersion: saved.schemaVersion };
        if (folderStatus.connected) await refreshFolderSaves({ rerender: false });
        setSaveMessage(state, "success", folderStatus.connected ? "Carreira salva na pasta." : "Carreira salva.");
        render();
        return;
      }
      if (action === "save-career-folder" || action === "save-career-folder-new") {
        const name = root.querySelector("[data-career-name]")?.value.trim() || getDefaultCareerName(state);
        const saveApi = window.TemporadaTotal.ProceduralCareerSave;
        if (!folderStatus.connected) {
          const connected = await connectFolderAndRefresh();
          if (!connected?.ok) return;
        }
        const result = await saveApi.saveCareerToFolder(state, name, { forceNew: action === "save-career-folder-new" });
        if (!result?.ok) {
          setSaveMessage(state, "error", `Nao foi possivel salvar na pasta: ${formatSaveErrors(result?.errors)}.`);
          render();
          return;
        }
        const saved = result.save;
        state.careerMeta = { id: saved.id, name: saved.name, savedAt: saved.savedAt, schemaVersion: saved.schemaVersion };
        state.pendingDeleteCareerId = "";
        await refreshFolderSaves({ rerender: false });
        window.TemporadaTotal.GameState.addLog(state, "save", "Carreira salva na pasta", `Carreira "${name}" salva como arquivo JSON.`);
        setSaveMessage(state, "success", `Carreira "${saved.name}" salva na pasta.`);
        render();
        return;
      }
      if (action === "save-career") {
        const name = root.querySelector("[data-career-name]")?.value.trim() || getDefaultCareerName(state);
        const saveApi = window.TemporadaTotal.ProceduralCareerSave;
        const result = saveApi.saveCareer(state, name);
        if (!result?.ok) {
          setSaveMessage(state, "error", `Nao foi possivel salvar: ${formatSaveErrors(result?.errors)}.`);
          render();
          return;
        }
        const saved = result.save;
        state.careerMeta = { id: saved.id, name: saved.name, savedAt: saved.savedAt, schemaVersion: saved.schemaVersion };
        state.pendingDeleteCareerId = "";
        window.TemporadaTotal.GameState.addLog(state, "save", "Carreira salva", `Carreira "${name}" salva.`);
        setSaveMessage(state, "success", `Carreira "${saved.name}" salva.`);
        render();
      }
      if (action === "save-career-new") {
        const name = root.querySelector("[data-career-name]")?.value.trim() || getDefaultCareerName(state);
        const saveApi = window.TemporadaTotal.ProceduralCareerSave;
        const result = saveApi.saveCareerAsNew(state, name);
        if (!result?.ok) {
          setSaveMessage(state, "error", `Nao foi possivel salvar: ${formatSaveErrors(result?.errors || ["erro_desconhecido"])}.`);
          render();
          return;
        }
        const saved = result.save;
        state.careerMeta = { id: saved.id, name: saved.name, savedAt: saved.savedAt, schemaVersion: saved.schemaVersion };
        window.TemporadaTotal.GameState.addLog(state, "save", "Novo save criado", `Novo slot "${name}" criado.`);
        setSaveMessage(state, "success", `Novo save "${saved.name}" criado.`);
        render();
      }
      if (action === "load-career") {
        const ref = getSelectedCareerRef(root, actionButton);
        const result = ref.id
          ? (ref.source === "folder"
            ? await window.TemporadaTotal.ProceduralCareerSave.loadFolderCareer(ref.id, getSaveScope())
            : window.TemporadaTotal.ProceduralCareerSave.loadCareer(ref.id))
          : null;
        if (result?.ok) {
          state = result.payload;
          window.TemporadaTotal.GameState.sanitizeSportIdentity?.(state);
          state.pendingDeleteCareerId = "";
          document.body.classList.add("career-has-started");
          liveController = null;
          liveUi = null;
          window.TemporadaTotal.GameState.addLog(state, "save", "Carreira carregada", `Carreira "${getDefaultCareerName(state)}" carregada.`);
          setSaveMessage(state, "success", `Carreira "${getDefaultCareerName(state)}" carregada.`);
          render();
        } else {
          setSaveMessage(state, "error", `Nao foi possivel carregar: ${formatSaveErrors(result?.errors || ["selecione_um_save"])}.`);
          render();
        }
      }
      if (action === "delete-career") {
        const ref = getSelectedCareerRef(root, actionButton);
        if (!ref.id) {
          setSaveMessage(state, "error", "Escolha uma carreira salva para excluir.");
          render();
          return;
        }
        state.pendingDeleteCareerId = ref.id;
        state.pendingDeleteCareerSource = ref.source || "local";
        setSaveMessage(state, "error", "Clique em Confirmar exclusao no card para remover essa carreira.");
        render();
      }
      if (action === "confirm-delete-career") {
        const ref = getSelectedCareerRef(root, actionButton);
        const deleted = ref.id && (ref.source === "folder"
          ? await window.TemporadaTotal.ProceduralCareerSave.deleteFolderCareer(ref.id, getSaveScope())
          : { ok: window.TemporadaTotal.ProceduralCareerSave.deleteCareer(ref.id) });
        if (deleted?.ok) {
          if (state.careerMeta?.id === ref.id) state.careerMeta = null;
          state.pendingDeleteCareerId = "";
          state.pendingDeleteCareerSource = "";
          if (ref.source === "folder") await refreshFolderSaves({ rerender: false });
          window.TemporadaTotal.GameState.addLog(state, "save", "Carreira excluida", "A carreira selecionada foi removida.");
          setSaveMessage(state, "success", "Carreira excluida.");
          render();
        } else {
          setSaveMessage(state, "error", `Nao foi possivel excluir: ${formatSaveErrors(deleted?.errors || ["save_not_found"])}.`);
          render();
        }
      }
      if (action === "cancel-delete-career") {
        state.pendingDeleteCareerId = "";
        state.pendingDeleteCareerSource = "";
        setSaveMessage(state, "success", "Exclusao cancelada.");
        render();
      }
      if (action === "export-career") {
        const saveApi = window.TemporadaTotal.ProceduralCareerSave;
        let ref = getSelectedCareerRef(root, actionButton);
        let id = ref.id || state.careerMeta?.id;
        if (!id && ref.source !== "folder") {
          const name = root.querySelector("[data-career-name]")?.value.trim() || getDefaultCareerName(state);
          const saved = saveApi.saveCareer(state, name);
          id = saved?.save?.id;
          if (saved?.save) state.careerMeta = { id: saved.save.id, name: saved.save.name, savedAt: saved.save.savedAt, schemaVersion: saved.save.schemaVersion };
        }
        const result = id && ref.source === "folder"
          ? await saveApi.loadFolderCareer(id, getSaveScope())
          : (id ? saveApi.exportCareer(id) : null);
        if (result?.ok) {
          if (result.json) {
            state.careerJsonDraft = result.json;
          } else {
            const meta = folderSaves.find((save) => save.id === id) || {};
            state.careerJsonDraft = JSON.stringify({
              exportedAt: new Date().toISOString(),
              source: "A Temporada - Pasta de Saves",
              schemaVersion: meta.schemaVersion || 1,
              save: {
                id,
                name: meta.name || result.payload?.careerMeta?.name || result.payload?.userTeam?.name || "Carreira procedural",
                savedAt: meta.savedAt || result.payload?.careerMeta?.savedAt || new Date().toISOString(),
                schemaVersion: meta.schemaVersion || 1,
                clubName: meta.clubName || result.payload?.userTeam?.name || "",
                currentDay: result.payload?.currentDay || 1,
                currentWeek: result.payload?.currentWeek || 1,
                payload: result.payload
              }
            }, null, 2);
          }
          setSaveMessage(state, "success", "Copia pronta no campo de dados em Arquivos e copias de seguranca.");
        } else {
          setSaveMessage(state, "error", `Nao foi possivel exportar: ${formatSaveErrors(result?.errors || ["save_not_found"])}.`);
        }
        render();
      }
      if (action === "import-career") {
        const json = root.querySelector("[data-career-json]")?.value || "";
        const result = window.TemporadaTotal.ProceduralCareerSave.importCareer(json);
        if (result?.ok) {
          const loaded = window.TemporadaTotal.ProceduralCareerSave.loadCareer(result.save.id);
          if (loaded?.ok) {
            state = loaded.payload;
            window.TemporadaTotal.GameState.sanitizeSportIdentity?.(state);
            document.body.classList.add("career-has-started");
            liveController = null;
            liveUi = null;
            window.TemporadaTotal.GameState.addLog(state, "save", "Carreira importada", `Carreira "${getDefaultCareerName(state)}" importada.`);
            setSaveMessage(state, "success", "Carreira importada e carregada.");
          }
        } else {
          setSaveMessage(state, "error", `Nao foi possivel importar: ${formatSaveErrors(result?.errors)}.`);
        }
        render();
      }
      if (action === "start-season-flow") {
        state.status = "playing";
        state.activeTab = "hub";
        document.body.classList.add("career-has-started");
        render();
      }
      if (action === "play-live") {
        const eventId = actionButton.dataset.eventId || window.TemporadaTotal.GameState.getNextMatchEvent(state)?.id;
        prepareLiveMatch(eventId);
        render();
        return;
      }
      if (action === "simulate-match-now") {
        const nextMatch = window.TemporadaTotal.GameState.getNextMatchEvent(state);
        if (nextMatch) {
          window.TemporadaTotal.CalendarEngine.processEvent(state, nextMatch);
          render();
        }
        return;
      }
      if (action === "advance-day") {
        window.TemporadaTotal.CalendarEngine.advanceDay(state);
        render();
        return;
      }
      if (action === "advance-week") {
        window.TemporadaTotal.CalendarEngine.advanceWeek(state);
        render();
        return;
      }
    }

    const seedTeam = event.target.closest("[data-seed-team-index]");
    if (seedTeam && !state) {
      seedCustomization = {};
      selectedUserTeamIndex = Number(seedTeam.dataset.seedTeamIndex) || 0;
      rebuildPreviewState();
      render();
      return;
    }
  });

    root.addEventListener("change", (event) => {
      const crestControl = event.target.closest("[data-crest-palette], [data-crest-shape], [data-crest-pattern], [data-crest-symbol]");
      if (crestControl && !state) {
        seedCustomization = getCustomizationFromRoot(root, seedCustomization);
        return;
      }

      const sortSelect = event.target.closest("[data-game-action='set-roster-sort'], .market-sort-select");
      if (sortSelect && state) {
        state.rosterSort = sortSelect.value;
        render();
        return;
      }

      const rosterFilter = event.target.closest("[data-roster-filter]");
      if (!rosterFilter) return;
      state.rosterView = {
        ...(state.rosterView || {}),
        [rosterFilter.dataset.rosterFilter]: rosterFilter.value
      };
      render();
    });

    root.addEventListener("input", (event) => {
      const jsonInput = event.target.closest("[data-career-json]");
      if (jsonInput && state) {
        state.careerJsonDraft = jsonInput.value;
      }

      const searchInput = event.target.closest("[data-roster-search]");
      if (searchInput && state) {
        state.rosterSearchQuery = searchInput.value;
        const query = searchInput.value.toLowerCase().trim();
        const cards = root.querySelectorAll(".market-athlete-card");
        cards.forEach((card) => {
          const nameEl = card.querySelector(".athlete-name");
          const name = nameEl ? nameEl.textContent.toLowerCase() : "";
          card.style.display = query === "" || name.includes(query) ? "" : "none";
        });
      }
    });

    render();
    return {
      getState: () => state,
      render
    };
  }

  function autoInitProceduralGameShell() {
    const root = document.querySelector("[data-procedural-game-root]");
    if (root) createProceduralGameShell(root);
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    createProceduralGameShell,
    initRosterDraftMarket,
    getSportPositionRequirements,
    validateRosterReadiness,
    autocompleteRoster,
    normalizePlayerForRoster
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInitProceduralGameShell);
  } else {
    autoInitProceduralGameShell();
  }
})();
