(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const TYPE_LABELS = {
    training: "Treino",
    rest: "Descanso",
    match: "Jogo",
    narrative: "Bastidor",
    market: "Mercado"
  };

  const TYPE_ICONS = {
    training: "TR",
    rest: "DS",
    match: "JG",
    narrative: "BT",
    market: "MK"
  };

  const TYPE_EFFECTS = {
    training: "Entrosamento sobe, mas a carga pesa.",
    rest: "Fadiga cai e o elenco respira.",
    match: "Tabela, moral e desgaste entram em jogo.",
    narrative: "O bastidor pode mudar o ambiente.",
    market: "O radar encontra nomes para a janela."
  };

  const VOLLEY_TYPE_EFFECTS = {
    training: "Saque, passe e cobertura ganham ritmo.",
    rest: "Fadiga cai e o salto volta mais inteiro.",
    match: "Tabela, moral e confianca entram em jogo.",
    narrative: "O bastidor pode mudar o ambiente.",
    market: "O radar busca atletas por fundamento."
  };

  const TYPE_SHORT_COPY = {
    training: "Preparacao.",
    rest: "Recuperacao.",
    match: "Partida oficial.",
    narrative: "Decisao disponivel.",
    market: "Janela aberta."
  };

  const VOLLEY_TYPE_SHORT_COPY = {
    training: "Treino de fundamentos.",
    rest: "Recuperacao.",
    match: "Partida oficial.",
    narrative: "Decisao disponivel.",
    market: "Radar de atletas."
  };

  function isVolleyball(state) {
    return state?.sportId === "volei" || state?.userTeam?.sportId === "volei";
  }

  function getTypeEffect(state, type) {
    return (isVolleyball(state) ? VOLLEY_TYPE_EFFECTS : TYPE_EFFECTS)[type] || "Evento da temporada.";
  }

  function getOpponentFromTitle(event) {
    const title = String(event?.title || "");
    const match = title.match(/contra\s+(.+)$/i);
    return match ? match[1].trim() : "";
  }

  function getShortEventDescription(state, event) {
    if (event?.type === "match") {
      const opponent = getOpponentFromTitle(event);
      return opponent ? `Contra ${opponent}.` : (isVolleyball(state) ? "Partida oficial." : "Jogo oficial.");
    }
    const copy = isVolleyball(state) ? VOLLEY_TYPE_SHORT_COPY : TYPE_SHORT_COPY;
    return copy[event?.type] || "Evento da temporada.";
  }

  function getEventDetailText(state, event) {
    const description = String(event?.description || "").trim();
    const effect = getTypeEffect(state, event?.type);
    return [description, effect].filter(Boolean).join(" ");
  }

  function formatNumber(value, digits = 0) {
    const number = Number(value) || 0;
    return Number.isInteger(number) ? String(number) : number.toFixed(digits);
  }

  function getDecisionLead(decision) {
    const text = String(decision?.text || decision?.situation || "").trim();
    const contextIndex = text.search(/\b(Contexto da lore|Objetivo atual|Vi[eé]s narrativo):/i);
    const lead = contextIndex >= 0 ? text.slice(0, contextIndex) : text;
    return lead
      .replace(/^\[[^\]]+\]\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getEventsForExactDay(state, day) {
    return window.TemporadaTotal.CalendarEngine.getEventsForDay(state, day);
  }

  function getUniqueEvents(events = []) {
    const seen = new Set();
    return events.filter((event) => {
      const key = event?.id || `${event?.day}-${event?.type}-${event?.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getWeekDays(state) {
    const weekStart = (Number(state.currentWeek || 1) - 1) * 7 + 1;
    return Array.from({ length: 7 }, (_, index) => weekStart + index).filter((day) => day <= state.maxDays);
  }

  function getUserStanding(state) {
    return (state.standings || []).find((row) => row.teamId === state.userTeam?.id) || null;
  }

  function getNextMatchLabel(state) {
    const next = window.TemporadaTotal.GameState.getNextMatchEvent(state);
    if (!next) return isVolleyball(state) ? "Sem partidas pendentes" : "Sem jogos pendentes";
    return `Dia ${next.day} - ${next.title}`;
  }

  function renderWeekDay(state, day) {
    const events = getUniqueEvents(getEventsForExactDay(state, day));
    const mainEvent = events[0];
    const processed = events.length && events.every((event) => event.processed);
    const isToday = day === state.currentDay;
    const isPast = day < state.currentDay;
    return `
      <article class="procedural-week-day ${isToday ? "is-today" : ""} ${processed || isPast ? "is-processed" : ""}">
        <span>Dia ${day}</span>
        <div class="procedural-week-day-icon ${mainEvent ? `is-${escapeHtml(mainEvent.type)}` : ""}">${events.length ? events.map((event) => TYPE_ICONS[event.type] || "EV").join(" + ") : "--"}</div>
        <strong>${mainEvent ? escapeHtml(TYPE_LABELS[mainEvent.type] || mainEvent.type) : "Livre"}</strong>
        <small>${mainEvent ? escapeHtml(getShortEventDescription(state, mainEvent)) : "Sem compromisso."}</small>
      </article>
    `;
  }

  function renderEvent(state, event) {
    const typeLabel = TYPE_LABELS[event.type] || event.type;
    const detailText = getEventDetailText(state, event);
    const liveButton = event.type === "match" && !event.processed
      ? `<button class="secondary-button" data-game-action="play-live" data-event-id="${escapeHtml(event.id)}" type="button">Jogar ao vivo</button>`
      : "";
    return `
      <article class="procedural-event-card procedural-event-${escapeHtml(event.type)} ${event.processed ? "is-processed" : ""}">
        <div class="procedural-event-icon">${TYPE_ICONS[event.type] || "EV"}</div>
        <div class="procedural-event-main">
          <span class="status-pill">${escapeHtml(typeLabel)}</span>
          <strong>Dia ${event.day} - ${escapeHtml(typeLabel)}</strong>
          <span class="procedural-event-short">${escapeHtml(getShortEventDescription(state, event))}</span>
          <details class="procedural-event-details">
            <summary>Detalhes</summary>
            <p>${escapeHtml(detailText)}</p>
          </details>
          ${liveButton}
        </div>
      </article>
    `;
  }

  function renderCalendar(state) {
    const todayEvents = getUniqueEvents(window.TemporadaTotal.CalendarEngine.getEventsForDay(state));
    const upcoming = getUniqueEvents(window.TemporadaTotal.CalendarEngine.getUpcomingEvents(state, 10))
      .filter((event) => event.day !== state.currentDay)
      .slice(0, 8);
    const decision = state.pendingDecision;
    const userStanding = getUserStanding(state);
    const weekDays = getWeekDays(state);
    const seasonProgress = Math.min(100, Math.max(0, (Number(state.currentDay || 1) / Number(state.maxDays || 84)) * 100));
    return `
      <section class="procedural-game-section">
        <div class="procedural-calendar-head procedural-calendar-command">
          <div>
            <span class="eyebrow">Calendario</span>
            <h2>Central da Semana ${state.currentWeek}</h2>
            <p class="hint">Leia a semana. Avance quando estiver pronto.</p>
          </div>
          <div class="procedural-calendar-actions">
            <button class="primary-button" ${decision ? 'data-game-tab="hub"' : 'data-game-action="advance-day"'} type="button">${decision ? "Resolver decisao" : "Avancar dia"}</button>
            <button class="secondary-button" data-game-action="advance-week" type="button">Avancar semana</button>
          </div>
        </div>

        <div class="procedural-command-grid">
          <article class="procedural-command-card is-main">
            <span>Hoje</span>
            <strong>Dia ${state.currentDay}</strong>
            <p>${todayEvents[0] ? escapeHtml(todayEvents[0].title) : "Sem compromisso oficial"}</p>
            <div class="procedural-season-progress"><i style="--progress:${seasonProgress}%"></i></div>
          </article>
          <article class="procedural-command-card">
            <span>Campanha</span>
            <strong>${userStanding ? `${userStanding.wins}-${userStanding.losses}` : "0-0"}</strong>
            <p>Saldo ${userStanding?.pointDiff > 0 ? "+" : ""}${userStanding?.pointDiff || 0}</p>
          </article>
          <article class="procedural-command-card">
            <span>${isVolleyball(state) ? "Proxima partida" : "Proximo jogo"}</span>
            <strong>${escapeHtml(getNextMatchLabel(state))}</strong>
            <p>${isVolleyball(state) ? "Escolha partida rapida ou ao vivo quando chegar o dia." : "Escolha jogo rapido ou ao vivo quando chegar o dia."}</p>
          </article>
          <article class="procedural-command-card">
            <span>Vestiario</span>
            <strong>Grupo em leitura</strong>
            <p>Moral, quimica e fadiga ficam no resumo da temporada.</p>
          </article>
        </div>

        <div class="procedural-week-strip">
          ${weekDays.map((day) => renderWeekDay(state, day)).join("")}
        </div>

        ${decision ? `
          <div class="procedural-decision-panel">
            <span class="eyebrow">Decisao pendente</span>
            <h3>${escapeHtml(decision.title)}</h3>
            <p>${escapeHtml(getDecisionLead(decision) || "A comissao espera uma resposta antes de seguir.")}</p>
            <div class="procedural-decision-actions">
              ${(decision.choices || []).map((choice) => `
                <button class="choice-button" data-decision-choice="${escapeHtml(choice.id)}" type="button">
                  ${escapeHtml(choice.label)}
                  <div class="effect-line">${escapeHtml(choice.effectText || "")}</div>
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <div class="procedural-calendar-grid">
          <div>
            <h3>Hoje</h3>
            <div class="procedural-event-list">
              ${todayEvents.length ? todayEvents.map((event) => renderEvent(state, event)).join("") : '<div class="procedural-empty">Nenhum evento hoje.</div>'}
            </div>
          </div>
          <div>
            <h3>Proximos eventos</h3>
            <div class="procedural-event-list">
              ${upcoming.map((event) => renderEvent(state, event)).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    CalendarUI: {
      renderCalendar
    }
  };
})();
