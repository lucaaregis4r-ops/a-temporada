(function () {
  function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatValue(value) {
    if (typeof value === "number" && !Number.isInteger(value)) {
      return value.toFixed(1);
    }
    return value ?? 0;
  }

  function isVolleyballState(state, schema = []) {
    if (state?.sport) return state.sport === "volei";
    return Boolean(state?.setScore || state?.sets || schema.some((stat) => ["aces", "receptions", "digs", "setAssists"].includes(stat.key)));
  }

  function isFutsalState(state, schema = []) {
    if (state?.sport) return state.sport === "futsal";
    return Boolean(state?.teamFouls || schema.some((stat) => ["shotsOnTarget", "saves", "foulsCommitted"].includes(stat.key)));
  }

  function getDefaultLeaders(state, schema = []) {
    if (isVolleyballState(state, schema)) {
      return [
        { label: "Pontuador", stat: "points", suffix: "pts" },
        { label: "Sacador", stat: "aces", suffix: "aces" },
        { label: "Bloqueio", stat: "blocks", suffix: "bloq" },
        { label: "Passe", stat: "positiveReceptions", suffix: "passes" },
        { label: "Defesa", stat: "digs", suffix: "defs" },
        { label: "Eficiência", stat: "efficiency", suffix: "eff" }
      ];
    }
    return [
      { label: "Pontuador", stat: "points", suffix: "pts" },
      { label: "Reboteiro", stat: "rebounds", suffix: "reb" },
      { label: "Garçom", stat: "assists", suffix: "ast" },
      { label: "Eficiência", stat: "efficiency", suffix: "eff" }
    ];
  }

  function getVolleyballMoment(state) {
    if (state.status === "finished") return "Fim de jogo";
    const home = Number(state.setScore?.home) || 0;
    const away = Number(state.setScore?.away) || 0;
    const leader = Math.max(home, away);
    const trailing = Math.min(home, away);
    if (leader >= 24 && leader - trailing >= 1) return (state.sets?.home || 0) === 2 || (state.sets?.away || 0) === 2 ? "Match point ⚡" : "Set point 🔥";
    if (Math.abs(home - away) <= 1 && leader >= 18) return "Set disputado ⚔️";
    if (Math.abs(home - away) >= 5 && leader >= 10) return "Sequência dominante 💥";
    return state.status === "running" ? "Rally ao vivo" : state.status === "paused" ? "Tempo técnico" : "Pré-jogo";
  }

  function getFutsalMoment(state) {
    if (state.status === "finished") return "Fim de jogo";
    const home = Number(state.score?.home) || 0;
    const away = Number(state.score?.away) || 0;
    const minute = Number(state.clock?.minute) || 0;
    const fouls = Number(state.teamFouls?.home) || 0;
    if (minute >= 34 && home < away) return "Atrás no placar ⚡";
    if (minute >= 34 && home > away) return "Defender vantagem 🛡️";
    if (home === away && minute >= 30) return "Jogo no detalhe ⚔️";
    if (fouls >= 5) return "Cuidado com faltas ⚠️";
    return state.status === "running" ? "Ritmo alto 🔥" : state.status === "paused" ? "Tempo técnico" : "Pré-jogo";
  }

  function getCoachingOptions(sportKind, coaching) {
    const isVolleyball = sportKind === "volei";
    const isFutsal = sportKind === "futsal";
    if (isVolleyball) {
      return {
        tactic: [
          ["balanced", "Sistema Equilibrado"],
          ["defense_first", "Reforçar Recepção & Fundo"],
          ["run_and_gun", "Acelerar Bolas Rápidas"],
          ["protect_lead", "Proteger Vantagem"],
          ["development", "Rodar Elenco Jovem"]
        ],
        pace: [["slow", "Controlar Rally"], ["normal", "Ritmo Normal"], ["fast", "Transição Acelerada"]],
        rotationPlan: [
          ["balanced", "Rotação Padrão"],
          ["short_rotation", "Força Máxima Titulares"],
          ["development", "Minutos aos Jovens"],
          ["load_management", "Preservar Saltadores"],
          ["defense_first", "Especialistas Defensivos"]
        ],
        defensivePressure: [["low", "Saque Seguro"], ["normal", "Pressão Normal"], ["high", "Saque Agressivo / Risco"]],
        offensiveFocus: [
          ["balanced", "Distribuir Ataque"],
          ["paint", "Central / Meio de Rede"],
          ["three_point", "Pontas / Oposto"],
          ["star_player", "Atleta em Chamas 🔥"]
        ],
        riskTolerance: [["safe", "Reduzir Erros"], ["normal", "Risco Médio"], ["high", "Forçar Ataque & Saque"]]
      };
    }
    if (isFutsal) {
      return {
        tactic: [
          ["balanced", "Equilíbrio Tático"],
          ["defense_first", "Bloco Baixo Fechado"],
          ["run_and_gun", "Contra-Ataque Fulminante"],
          ["protect_lead", "Retranca Segura"],
          ["power_play", "Goleiro-Linha ⚡"],
          ["set_piece", "Foco em Bola Parada"],
          ["development", "Rodar Elenco"]
        ],
        pace: [["slow", "Cadenciar Posse"], ["normal", "Ritmo Normal"], ["fast", "Pressão e Correria"]],
        rotationPlan: [
          ["balanced", "Rotação Equilibrada"],
          ["short_rotation", "Quarteto Principal"],
          ["development", "Minutos aos Jovens"],
          ["load_management", "Poupar Fôlego"],
          ["defense_first", "Especialistas na Marcação"]
        ],
        defensivePressure: [["low", "Meia Quadra"], ["normal", "Pressão Normal"], ["high", "Pressão Total no Goleiro"]],
        offensiveFocus: [
          ["balanced", "Distribuir Jogo"],
          ["pivot", "Pivô de Referência"],
          ["wide", "Alas em Amplitude"],
          ["set_piece", "Jogadas Ensaiadas"],
          ["star_player", "Atleta Chave"]
        ],
        riskTolerance: [["safe", "Evitar Cartões & Faltas"], ["normal", "Risco Padrão"], ["high", "Bote Agressivo"]]
      };
    }
    return {
      tactic: [
        ["balanced", "Equilibrada"],
        ["defense_first", "Foco na Defesa"],
        ["run_and_gun", "Transição Rápida"],
        ["protect_lead", "Proteger Vantagem"],
        ["development", "Desenvolver Jovens"]
      ],
      pace: [["slow", "Lento"], ["normal", "Normal"], ["fast", "Acelerado"]],
      rotationPlan: [
        ["balanced", "Equilibrada"],
        ["short_rotation", "Rotação Curta"],
        ["development", "Jovens"],
        ["load_management", "Poupar"],
        ["defense_first", "Defensiva"]
      ],
      defensivePressure: [["low", "Contenção"], ["normal", "Normal"], ["high", "Pressão Todo Campo"]],
      offensiveFocus: [
        ["balanced", "Equilibrado"],
        ["paint", "Garrafão"],
        ["three_point", "Chute de 3 Pontos"],
        ["star_player", "Bola na Estrela"]
      ],
      riskTolerance: [["safe", "Conservador"], ["normal", "Normal"], ["high", "Risco Alto"]]
    };
  }

  function calculateMatchMomentum(events = []) {
    if (!events || !events.length) {
      return { homePct: 50, streakText: "Equilíbrio", leader: "none", streakCount: 0 };
    }
    const recent = events.slice(0, 7);
    let homePts = 0;
    let awayPts = 0;
    for (const ev of recent) {
      if (ev.teamId === "home") homePts++;
      else if (ev.teamId === "away") awayPts++;
    }
    const total = homePts + awayPts;
    if (total === 0) return { homePct: 50, streakText: "Equilíbrio", leader: "none", streakCount: 0 };

    const rawPct = Math.round((homePts / total) * 100);
    const homePct = Math.max(18, Math.min(82, rawPct));

    let streakCount = 0;
    const topTeam = events[0]?.teamId;
    for (const ev of events) {
      if (ev.teamId === topTeam) streakCount++;
      else break;
    }

    return {
      homePct,
      leader: homePct >= 58 ? "home" : homePct <= 42 ? "away" : "none",
      streakCount,
      topTeam
    };
  }

  function getEventBadge(event, isVolleyball, isFutsal) {
    const desc = (event?.description || "").toLowerCase();
    const type = event?.type || "";
    if (isVolleyball) {
      if (type === "ace" || desc.includes("ace")) return `<span class="arcade-event-badge is-gold">⚡ ACE</span>`;
      if (type === "block" || desc.includes("bloqueio") || desc.includes("toco")) return `<span class="arcade-event-badge is-blue">🛑 BLOQUEIO</span>`;
      if (desc.includes("cravada") || desc.includes("ataque") || desc.includes("contra-ataque")) return `<span class="arcade-event-badge is-orange">💥 CRAVADA</span>`;
      if (desc.includes("saque") && desc.includes("erra")) return `<span class="arcade-event-badge is-red">❌ ERRO SAQUE</span>`;
      if (desc.includes("erro") || desc.includes("fora")) return `<span class="arcade-event-badge is-red">❌ ERRO</span>`;
      return `<span class="arcade-event-badge is-teal">🏐 PONTO</span>`;
    }
    if (isFutsal) {
      if (desc.includes("gol") || desc.includes("golaço")) return `<span class="arcade-event-badge is-gold">⚽ GOL!</span>`;
      if (desc.includes("defesa") || desc.includes("espalma")) return `<span class="arcade-event-badge is-blue">🧤 DEFESA</span>`;
      if (desc.includes("amarelo")) return `<span class="arcade-event-badge is-yellow">🟨 CARTÃO</span>`;
      if (desc.includes("vermelho")) return `<span class="arcade-event-badge is-red">🟥 EXPULSÃO</span>`;
      if (desc.includes("falta")) return `<span class="arcade-event-badge is-red">⚠️ FALTA</span>`;
      return `<span class="arcade-event-badge is-teal">🎯 LANCE</span>`;
    }
    // Basketball
    if (desc.includes("3") || desc.includes("três")) return `<span class="arcade-event-badge is-gold">🔥 BOLA DE 3</span>`;
    if (desc.includes("enterrada") || desc.includes("dunk")) return `<span class="arcade-event-badge is-orange">💥 ENTERRADA</span>`;
    if (desc.includes("toco") || desc.includes("bloqueio")) return `<span class="arcade-event-badge is-blue">🛑 TOCO</span>`;
    if (desc.includes("roubo") || desc.includes("intercepta")) return `<span class="arcade-event-badge is-purple">⚡ ROUBO</span>`;
    if (desc.includes("falta")) return `<span class="arcade-event-badge is-red">⚠️ FALTA</span>`;
    return `<span class="arcade-event-badge is-teal">🏀 PONTO</span>`;
  }

  function createLiveMatchUI({ root, schema, leaderConfig, onStart, onPause, onSpeed, onFinish, onSaveResult, canSaveResult, onCoachingChange } = {}) {
    let latestState = null;
    let selectedSubOutId = "";
    let lastPlayedEventKey = null;

    function getLeaders(rows) {
      const leadersConfig = leaderConfig || getDefaultLeaders(latestState, schema);
      return leadersConfig.map((leader) => {
        const player = rows.slice().sort((a, b) => (Number(b[leader.stat]) || 0) - (Number(a[leader.stat]) || 0))[0];
        return {
          ...leader,
          playerName: player?.playerName || "--",
          value: player ? formatValue(player[leader.stat]) : 0
        };
      });
    }

    function render(state) {
      latestState = state || latestState;
      if (!root || !latestState) return;

      const rows = Object.values(latestState.playerStats || {});
      const eventLog = latestState.events || [];
      const clock = latestState.clock || {};
      const isVolleyball = isVolleyballState(latestState, schema);
      const isFutsal = isFutsalState(latestState, schema);
      const sportKind = isVolleyball ? "volei" : isFutsal ? "futsal" : "basquete";
      const leaders = getLeaders(rows);
      const saveAvailable = Boolean(canSaveResult?.(latestState));
      const finished = latestState.status === "finished";

      // Score definitions: in volleyball, the active big numbers are current set points!
      const homeDisplayScore = isVolleyball ? (latestState.setScore?.home ?? 0) : (latestState.score?.home ?? 0);
      const awayDisplayScore = isVolleyball ? (latestState.setScore?.away ?? 0) : (latestState.score?.away ?? 0);

      // Completed sets without redundant prefix
      const completedSetsFormatted = latestState.completedSets?.length
        ? latestState.completedSets.map((s) => `${s.home}-${s.away}`).join(", ")
        : "";

      const futsalDetail = latestState.teamFouls
        ? `Faltas: ${latestState.teamFouls.home || 0} - ${latestState.teamFouls.away || 0}`
        : "";

      const coaching = latestState.coaching || {};
      const lastEvent = eventLog[0] || null;
      const possessionTeam = lastEvent?.teamId === "away"
        ? (latestState.awayTeam?.name || "Visitante")
        : lastEvent?.teamId === "home"
          ? (latestState.homeTeam?.name || "Mandante")
          : "Disputa";

      const momentLabel = isVolleyball ? getVolleyballMoment(latestState) : isFutsal ? getFutsalMoment(latestState) : finished ? "Encerrado" : latestState.status === "running" ? "Ao Vivo 🔥" : latestState.status === "paused" ? "Pausado" : "Pré-jogo";
      const momentum = calculateMatchMomentum(eventLog);

      // Audio feedback when match is running and a new play arrives
      if (latestState.status === "running" && eventLog.length > 0) {
        const topEv = eventLog[0];
        const topKey = `${topEv.minute || 0}_${topEv.set || 0}_${topEv.rally || 0}_${topEv.description}`;
        if (topKey !== lastPlayedEventKey) {
          lastPlayedEventKey = topKey;
          const desc = (topEv.description || "").toLowerCase();
          const type = topEv.type || "";
          if (type === "ace" || desc.includes("ace") || desc.includes("cravada") || desc.includes("golaço") || desc.includes("enterrada") || desc.includes("bola de 3")) {
            window.TemporadaTotal?.MinigamesEngine?.playArcadeSound?.("perfect");
          } else if (topEv.value > 0 || desc.includes("gol") || desc.includes("ponto") || desc.includes("cesta")) {
            window.TemporadaTotal?.MinigamesEngine?.playArcadeSound?.("good");
          } else if (desc.includes("erro") || desc.includes("falta") || desc.includes("erra") || desc.includes("perde")) {
            window.TemporadaTotal?.MinigamesEngine?.playArcadeSound?.("miss");
          }
        }
      }

      const coachingOptions = getCoachingOptions(sportKind, coaching);
      const homeLineup = latestState.lineups?.home || {};
      const homeRoster = latestState.homeTeam?.roster || [];
      const activeIds = new Set(homeLineup.active || []);
      const benchIds = new Set(homeLineup.bench || []);
      const activePlayers = homeRoster.filter((player) => activeIds.has(player.id));
      const benchPlayers = homeRoster.filter((player) => benchIds.has(player.id));
      const selectedOut = activePlayers.find((player) => player.id === selectedSubOutId);

      const homeName = escapeHtml(latestState.homeTeam?.name || "Casa");
      const awayName = escapeHtml(latestState.awayTeam?.name || "Fora");

      root.className = "live-match live-match-panel";
      root.innerHTML = `
        <!-- PLACAR ARCADE COMPACTO E DINÂMICO -->
        <div class="arcade-live-scoreboard">
          <div class="arcade-team-card home ${momentum.leader === "home" ? "is-dominating" : ""}">
            <div class="team-meta">
              <span class="team-tag">MANDANTE</span>
              <h3 class="team-name">${homeName}</h3>
              ${isVolleyball ? `
                <div class="arcade-sets-counter">
                  Sets Vencidos: <strong>${latestState.sets?.home || 0}</strong>
                </div>
              ` : ""}
            </div>
            <div class="team-digits ${isVolleyball ? "is-volley" : ""}">
              <strong>${homeDisplayScore}</strong>
            </div>
          </div>

          <div class="arcade-center-clock">
            <div class="clock-badge">
              ${isVolleyball ? `SET ${clock.set || (Number(latestState.sets?.home || 0) + Number(latestState.sets?.away || 0) + 1)}` : (clock.label || `${clock.minute || 0}'`)}
            </div>
            <div class="clock-status">
              ${isVolleyball ? `Rally #${clock.rally || 0}` : futsalDetail || `${latestState.status === "running" ? "EM ANDAMENTO" : latestState.status.toUpperCase()}`}
            </div>
            ${isVolleyball && completedSetsFormatted ? `
              <div class="clock-parciais">
                <span>Parciais:</span> <strong>${completedSetsFormatted}</strong>
              </div>
            ` : ""}
            <div class="clock-possession">
              Posse: <strong>${escapeHtml(possessionTeam)}</strong>
            </div>
            <span class="arcade-moment-pill ${momentLabel.includes("🔥") || momentLabel.includes("⚡") ? "is-hot" : ""}">${momentLabel}</span>
          </div>

          <div class="arcade-team-card away ${momentum.leader === "away" ? "is-dominating" : ""}">
            <div class="team-digits ${isVolleyball ? "is-volley" : ""}">
              <strong>${awayDisplayScore}</strong>
            </div>
            <div class="team-meta">
              <span class="team-tag">VISITANTE</span>
              <h3 class="team-name">${awayName}</h3>
              ${isVolleyball ? `
                <div class="arcade-sets-counter">
                  Sets Vencidos: <strong>${latestState.sets?.away || 0}</strong>
                </div>
              ` : ""}
            </div>
          </div>
        </div>

        <!-- TERMÔMETRO DE DOMÍNIO / MOMENTUM BAR -->
        <div class="arcade-momentum-container">
          <div class="arcade-momentum-header">
            <span class="momentum-tag home ${momentum.leader === "home" ? "is-hot" : ""}">
              ${momentum.leader === "home" ? `🔥 ${homeName} (+${momentum.streakCount} em sequência)` : `⚡ ${homeName}`}
            </span>
            <span class="momentum-center-label">TERMÔMETRO DO CONFRONTO</span>
            <span class="momentum-tag away ${momentum.leader === "away" ? "is-hot" : ""}">
              ${momentum.leader === "away" ? `🔥 ${awayName} (+${momentum.streakCount} em sequência)` : `${awayName} ⚡`}
            </span>
          </div>
          <div class="arcade-momentum-track">
            <div class="arcade-momentum-bar home" style="width: ${momentum.homePct}%;"></div>
            <div class="arcade-momentum-bar away" style="width: ${100 - momentum.homePct}%;"></div>
            <div class="arcade-momentum-indicator" style="left: ${momentum.homePct}%;"></div>
          </div>
        </div>

        <!-- DECK DE COMANDOS ARCADE (LINHA COMPACTA SEM OVERFLOW) -->
        <div class="arcade-control-deck">
          <div class="arcade-control-group playback">
            ${latestState.status === "running" ? `
              <button class="arcade-deck-btn is-pause" data-live-action="pause" type="button">
                ⏸ Pausar
              </button>
            ` : `
              <button class="arcade-deck-btn is-play pulse-gold" data-live-action="start" type="button" ${finished ? "disabled" : ""}>
                ▶ Iniciar
              </button>
            `}
            <div class="arcade-speed-group">
              <button class="arcade-speed-btn ${latestState.speed === "normal" || !latestState.speed ? "is-active" : ""}" data-live-speed="normal" type="button">1x</button>
              <button class="arcade-speed-btn ${latestState.speed === "2x" ? "is-active" : ""}" data-live-speed="2x" type="button">2x 🔥</button>
              <button class="arcade-speed-btn ${latestState.speed === "5x" ? "is-active" : ""}" data-live-speed="5x" type="button">5x ⚡</button>
            </div>
            <button class="arcade-deck-btn is-sim" data-live-action="finish" type="button" ${finished ? "disabled" : ""}>
              ⏩ Simular Fim
            </button>
            <button class="arcade-deck-btn is-save ${saveAvailable ? "pulse-gold" : ""}" data-live-action="save" type="button" ${saveAvailable ? "" : "disabled"}>
              ${finished ? "💾 Salvar Resultado" : "💾 Salvar ao Terminar"}
            </button>
          </div>

          <div class="arcade-control-group tactical">
            <button class="arcade-tactical-pill" type="button" data-live-quick="timeout">⏱ Pedir Tempo</button>
            <button class="arcade-tactical-pill" type="button" data-live-quick="defense">
              ${isVolleyball ? "🛡 Reforçar Recepção" : isFutsal ? "🛡 Pressão Alta" : "🛡 Pressão Defensiva"}
            </button>
            <button class="arcade-tactical-pill" type="button" data-live-quick="line_change">
              ${isVolleyball ? "🔄 Girar Linha" : isFutsal ? "🔄 Trocar Quarteto" : "🔄 Trocar Quinteto"}
            </button>
          </div>
        </div>

        <!-- FAIXA DE ÚLTIMO LANCE -->
        <div class="live-broadcast-strip arcade-broadcast-strip">
          <div class="broadcast-callout">
            <span class="broadcast-tag">ÚLTIMO LANCE</span>
            <strong class="broadcast-text">${escapeHtml(lastEvent ? lastEvent.description : isVolleyball ? "O primeiro saque ainda vai sair." : "A bola ainda vai subir.")}</strong>
          </div>
        </div>

        <!-- GRID PRINCIPAL: EVENTOS AO VIVO & DESTAQUES -->
        <div class="live-grid arcade-match-grid">
          <div class="live-log event-feed arcade-event-feed">
            <div class="feed-header">
              <strong>📜 Lance a Lance</strong>
              <span class="feed-count">${eventLog.length} lances</span>
            </div>
            <div class="feed-scroll-box">
              ${eventLog.length ? eventLog.slice(0, 14).map((event) => `
                <div class="live-event event-item arcade-event-row">
                  <span class="event-time">${isVolleyball && event.set ? `S${event.set}.${event.rally || 0}` : `${event.minute ?? 0}'`}</span>
                  ${getEventBadge(event, isVolleyball, isFutsal)}
                  <span class="event-desc">${escapeHtml(event.description)}</span>
                </div>
              `).join("") : '<div class="player-meta empty-feed">A partida ainda não começou. Pressione Iniciar para rolar a bola!</div>'}
            </div>
          </div>

          <!-- LÍDERES EM DESTAQUE -->
          <div class="arcade-leaders-container">
            <div class="feed-header">
              <strong>⭐ Destaques da Partida</strong>
            </div>
            <div class="match-leaders-grid arcade-leaders-grid">
              ${leaders.map((leader) => `
                <article class="metric-card arcade-metric-card">
                  <span class="metric-lbl">${escapeHtml(leader.label)}</span>
                  <strong class="metric-val">${leader.value} <small>${leader.suffix}</small></strong>
                  <div class="player-meta">${escapeHtml(leader.playerName)}</div>
                </article>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- ABA RETRÁTIL: TÁTICAS & BANCO DE RESERVAS -->
        <details class="arcade-accordion-panel" open>
          <summary>⚙️ Ajustes Táticos & Linha de Substituição</summary>
          <div class="accordion-inner">
            <div class="live-controls live-coaching-controls arcade-coaching-bar">
              <label>
                <span>${isFutsal ? "Plano" : "Tática"}</span>
                <select data-live-coaching="tactic">
                  ${coachingOptions.tactic.map(([val, lbl]) => `<option value="${val}"${coaching.tactic === val ? " selected" : ""}>${lbl}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Ritmo</span>
                <select data-live-coaching="pace">
                  ${coachingOptions.pace.map(([val, lbl]) => `<option value="${val}"${coaching.pace === val ? " selected" : ""}>${lbl}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>${isFutsal ? "Quarteto" : "Rotação"}</span>
                <select data-live-coaching="rotationPlan">
                  ${coachingOptions.rotationPlan.map(([val, lbl]) => `<option value="${val}"${coaching.rotationPlan === val ? " selected" : ""}>${lbl}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Pressão</span>
                <select data-live-coaching="defensivePressure">
                  ${coachingOptions.defensivePressure.map(([val, lbl]) => `<option value="${val}"${coaching.defensivePressure === val ? " selected" : ""}>${lbl}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>${isFutsal ? "Saída" : "Ataque"}</span>
                <select data-live-coaching="offensiveFocus">
                  ${coachingOptions.offensiveFocus.map(([val, lbl]) => `<option value="${val}"${coaching.offensiveFocus === val ? " selected" : ""}>${lbl}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Risco</span>
                <select data-live-coaching="riskTolerance">
                  ${coachingOptions.riskTolerance.map(([val, lbl]) => `<option value="${val}"${coaching.riskTolerance === val ? " selected" : ""}>${lbl}</option>`).join("")}
                </select>
              </label>
            </div>

            <!-- SUBSTITUIÇÕES -->
            <div class="live-lineup-panel arcade-lineup-box">
              <div class="live-lineup-head">
                <div>
                  <span>${isVolleyball ? "Rotação em Quadra" : isFutsal ? "Quarteto em Quadra" : "Titulares em Quadra"}</span>
                  <strong>${activePlayers.map((p) => p.pos).join(" · ") || "A definir"}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <button class="arcade-line-change-btn" data-live-line-change="home" type="button">
                    🔄 ${isVolleyball ? "Girar Formação Completa" : isFutsal ? "Trocar Quarteto Completo" : "Trocar Quinteto Completo"}
                  </button>
                </div>
                <p style="width: 100%;">${selectedOut ? `👉 <b>${escapeHtml(selectedOut.name)}</b> selecionado para sair. Clique em um reserva abaixo:` : "Clique em quem sai e depois em quem entra para substituir, ou troque a linha inteira de uma vez."}</p>
              </div>
              <div class="live-lineup-grid">
                <section>
                  <h3>${isVolleyball ? "Em Quadra" : isFutsal ? "Quarteto + Goleiro" : "Titulares"}</h3>
                  <div class="live-lineup-list">
                    ${activePlayers.map((player) => {
                      const energy = Math.round(latestState?.playerEnergy?.[player.id] ?? 100);
                      const energyClass = energy >= 75 ? "is-high" : energy >= 50 ? "is-mid" : "is-low";
                      const streak = latestState?.hotHand?.[player.id] || 0;
                      const isHot = streak >= 2;
                      const statText = isVolleyball
                        ? `ATQ ${formatValue(player.attack)} · REC ${formatValue(player.reception)}`
                        : isFutsal
                          ? `FIN ${formatValue(player.finishing)} · DEF ${formatValue(player.defense)}`
                          : `AR ${formatValue(player.shooting)} · DEF ${formatValue(player.defense)}`;
                      return `
                        <button class="${player.id === selectedSubOutId ? "is-selected pulse-gold" : ""}" data-live-sub-out="${player.id}" type="button">
                          <div>
                            <strong>${escapeHtml(player.name)}${isHot ? ' <span class="hot-hand-badge">🔥 EM CHAMAS</span>' : ''}</strong>
                            <span>${player.pos || "ROT"} · ${statText}</span>
                          </div>
                          <span class="player-stamina-pill ${energyClass}" title="Fôlego atual: ${energy}%">⚡ ${energy}%</span>
                        </button>
                      `;
                    }).join("") || '<div class="player-meta">Sem atletas em quadra.</div>'}
                  </div>
                </section>
                <section>
                  <h3>Banco de Reservas</h3>
                  <div class="live-lineup-list">
                    ${benchPlayers.map((player) => {
                      const energy = Math.round(latestState?.playerEnergy?.[player.id] ?? 100);
                      const energyClass = energy >= 75 ? "is-high" : energy >= 50 ? "is-mid" : "is-low";
                      const statText = isVolleyball
                        ? `ATQ ${formatValue(player.attack)} · REC ${formatValue(player.reception)}`
                        : isFutsal
                          ? `FIN ${formatValue(player.finishing)} · DEF ${formatValue(player.defense)}`
                          : `AR ${formatValue(player.shooting)} · DEF ${formatValue(player.defense)}`;
                      return `
                        <button data-live-sub-in="${player.id}" type="button" ${selectedOut ? "" : "disabled"}>
                          <div>
                            <strong>${escapeHtml(player.name)}</strong>
                            <span>${player.pos || "ROT"} · ${statText}</span>
                          </div>
                          <span class="player-stamina-pill ${energyClass}" title="Fôlego no banco: ${energy}%">⚡ ${energy}%</span>
                        </button>
                      `;
                    }).join("") || '<div class="player-meta">Banco vazio.</div>'}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </details>

        <!-- ESTATÍSTICAS COMPLETAS RETRÁTEIS -->
        <details class="live-stats-details arcade-stats-details">
          <summary>📊 Estatísticas Completas dos Atletas</summary>
          <div class="table-wrap live-stats-wrap">
            <table class="standings-table live-stats-table player-stats-table">
              <thead>
                <tr>
                  <th>Jogador</th>
                  ${schema.map((stat) => `<th>${stat.label}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${rows.map((stats) => `
                  <tr>
                    <td><strong>${escapeHtml(stats.playerName)}</strong><div class="player-meta">${stats.teamId === "home" ? homeName : awayName}</div></td>
                    ${schema.map((stat) => `<td>${formatValue(stats[stat.key])}</td>`).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </details>
      `;
    }

    root?.addEventListener("click", (event) => {
      const lineChangeBtn = event.target.closest("[data-live-line-change]");
      if (lineChangeBtn) {
        const teamId = lineChangeBtn.dataset.liveLineChange || "home";
        onCoachingChange?.({ lineChange: { teamId } }, { label: "Troca completa de linha" });
        return;
      }

      const subOut = event.target.closest("[data-live-sub-out]");
      if (subOut) {
        selectedSubOutId = subOut.dataset.liveSubOut || "";
        render(latestState);
        return;
      }

      const subIn = event.target.closest("[data-live-sub-in]");
      if (subIn && selectedSubOutId) {
        const outPlayer = (latestState?.homeTeam?.roster || []).find((player) => player.id === selectedSubOutId);
        const inPlayer = (latestState?.homeTeam?.roster || []).find((player) => player.id === subIn.dataset.liveSubIn);
        onCoachingChange?.({
          substitution: {
            teamId: "home",
            outId: selectedSubOutId,
            inId: subIn.dataset.liveSubIn
          }
        }, {
          label: `${inPlayer?.name || "Atleta"} entrou no lugar de ${outPlayer?.name || "atleta"}`
        });
        selectedSubOutId = "";
        return;
      }

      const button = event.target.closest("[data-live-action], [data-live-speed]");
      if (!button) return;
      const action = button.dataset.liveAction;
      const speed = button.dataset.liveSpeed;
      if (action === "start") onStart?.();
      if (action === "pause") onPause?.();
      if (action === "finish") onFinish?.();
      if (action === "save") onSaveResult?.(latestState);
      if (speed) onSpeed?.(speed);
    });

    root?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-live-quick]");
      if (!button) return;
      const action = button.dataset.liveQuick;
      if (action === "timeout" || action === "pause") {
        onPause?.();
        if (action === "timeout") {
          onCoachingChange?.({ timeout: { teamId: "home" }, riskTolerance: "safe" }, { label: "Tempo pedido: esfriar jogo e recuperar fôlego" });
        }
      }
      const isFutsal = isFutsalState(latestState, schema);
      if (action === "defense") onCoachingChange?.({ defensivePressure: "high", ...(isFutsal ? { tactic: "defense_first" } : {}) }, { label: isFutsal ? "Marcação: subir linhas" : "Defesa: pressão alta" });
      if (action === "line_change" || action === "bench") {
        onCoachingChange?.({ lineChange: { teamId: "home" } }, { label: "Troca completa de linha" });
      }
      if (action === "speed") {
        onSpeed?.("2x");
        onCoachingChange?.({ pace: "fast" }, { label: "Ritmo: acelerar jogo" });
      }
    });

    root?.addEventListener("change", (event) => {
      const field = event.target.closest("[data-live-coaching]");
      if (!field) return;
      onCoachingChange?.({ [field.dataset.liveCoaching]: field.value }, {
        label: `${field.previousElementSibling?.textContent || "Ajuste"}: ${field.options?.[field.selectedIndex]?.text || field.value}`
      });
    });

    return { render };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    createLiveMatchUI
  };
})();
