(function () {
  const DEFAULT_SEED = "CARREIRA-PROCEDURAL-2026";
  let logCounter = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getAverage(rows, getter) {
    if (!rows.length) return 0;
    return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / rows.length;
  }

  function createLogEntry(type, title, text, day) {
    logCounter += 1;
    return {
      id: `log-${String(logCounter).padStart(5, "0")}`,
      type,
      title,
      text,
      day,
      createdAt: new Date().toISOString()
    };
  }

  function createEmptySeasonStats(sportId = "basquete") {
    if (sportId === "futsal") {
      return {
        games: 0,
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        passes: 0,
        steals: 0,
        blocks: 0,
        saves: 0,
        goalsConceded: 0,
        fouls: 0,
        cards: 0,
        efficiency: 0
      };
    }
    if (sportId === "volei") {
      return {
        games: 0,
        setsPlayed: 0,
        points: 0,
        aces: 0,
        attacks: 0,
        attackPoints: 0,
        attackErrors: 0,
        blocks: 0,
        receptions: 0,
        positiveReceptions: 0,
        receptionErrors: 0,
        digs: 0,
        setAssists: 0,
        errors: 0,
        efficiency: 0
      };
    }
    return {
      games: 0,
      points: 0,
      rebounds: 0,
      assists: 0
    };
  }

  function normalizePlayer(player, index, sportId = "basquete") {
    return {
      ...clone(player),
      sportId: player.sportId || sportId,
      morale: clamp(52 + Math.max(0, (Number(player.currentAbility) || 0) - 70) * 0.3, 35, 82),
      fatigue: clamp(12 + index * 0.4, 6, 28),
      status: "Disponivel",
      seasonStats: {
        ...createEmptySeasonStats(sportId),
        ...(player.seasonStats || {})
      }
    };
  }

  function normalizeVolleyballClubName(name) {
    return String(name || "")
      .replace(/\bBasquete\b/gi, "Volei")
      .replace(/\bBasketball\b/gi, "Volei")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function sanitizeSportIdentity(state) {
    if (!state || state.sportId !== "volei") return state;
    (state.league?.teams || []).forEach((team) => {
      team.name = normalizeVolleyballClubName(team.name);
    });
    if (state.userTeam) {
      state.userTeam.name = normalizeVolleyballClubName(state.userTeam.name);
    }
    (state.standings || []).forEach((row) => {
      row.name = normalizeVolleyballClubName(row.name);
    });
    return state;
  }

  function summarizeTeam(roster, teamState = {}) {
    const totalSalary = round(roster.reduce((sum, player) => sum + (Number(player.salary) || 0), 0));
    const budget = round(teamState.budget);
    return {
      moraleAverage: round(getAverage(roster, (player) => player.morale)),
      fatigueAverage: round(getAverage(roster, (player) => player.fatigue)),
      overallAverage: round(getAverage(roster, (player) => player.currentAbility)),
      potentialAverage: round(getAverage(roster, (player) => player.potential)),
      chemistry: round(teamState.chemistry),
      budget,
      totalSalary,
      budgetLeft: round(budget - totalSalary)
    };
  }

  function createVolleyballImpactState() {
    return {
      serve: 0,
      reception: 0,
      attack: 0,
      block: 0,
      defense: 0,
      load: 0,
      lastLabel: "",
      lastSummary: ""
    };
  }

  function createStandings(league) {
    return (league?.teams || []).map((team) => ({
      teamId: team.id,
      name: team.name,
      groupId: team.groupId || "",
      groupName: team.groupName || "",
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
      rating: team.rating?.overall || 72,
      loreLabel: team.lore?.label || ""
    }));
  }

  function updateStanding(standings, teamId, pointsFor, pointsAgainst) {
    const row = standings.find((item) => item.teamId === teamId);
    if (!row) return;
    const won = pointsFor > pointsAgainst;
    const drawn = pointsFor === pointsAgainst;
    row.wins += won ? 1 : 0;
    row.draws = (row.draws || 0) + (drawn ? 1 : 0);
    row.losses += won ? 0 : 1;
    if (drawn) row.losses -= 1;
    row.points = (row.points || 0) + (won ? 3 : drawn ? 1 : 0);
    row.pointsFor += pointsFor;
    row.pointsAgainst += pointsAgainst;
    row.pointDiff = row.pointsFor - row.pointsAgainst;
  }

  function getUserTeam(league) {
    return (league?.teams || []).find((team) => team.id === league.userTeamId) || league?.teams?.[0] || null;
  }

  function createFallbackLeague(seed) {
    const userClub = window.TemporadaTotal?.generateProceduralBasketballClub?.(seed) || null;
    const teams = userClub ? [userClub] : [];
    return {
      seed,
      userTeamId: userClub?.id || "",
      teams,
      standingsPreview: teams
    };
  }

  function createInitialGameState(options = {}) {
    const seed = options.seed || DEFAULT_SEED;
    const sportId = options.sportId || "basquete";
    const sportVariant = options.sportVariant || options.division || "";
    const division = sportVariant === "volei-feminino" ? "feminino" : options.division || (sportId === "volei" ? "masculino" : "");
    const leagueGenerator = sportId === "volei"
      ? window.TemporadaTotal?.generateProceduralVolleyballLeague
      : sportId === "futsal"
        ? window.TemporadaTotal?.generateProceduralFutsalLeague
        : window.TemporadaTotal?.generateProceduralBasketballLeague;
    const requestedUserTeamIndex = Number(options.userTeamIndex) || 0;
    const league = leagueGenerator?.(seed, {
      size: 40,
      userTeamIndex: requestedUserTeamIndex
    }) || createFallbackLeague(seed);
    const userTeam = getUserTeam(league);
    const roster = (userTeam?.roster?.players || []).map((player, index) => normalizePlayer(player, index, sportId));
    const budget = Number(userTeam?.budget || userTeam?.roster?.summary?.budget || 80);
    const teamState = {
      chemistry: 50,
      morale: 52,
      fatigue: 16,
      budget,
      reputation: Number(userTeam?.reputation || userTeam?.rating?.overall || 70),
      weeklyFocus: "balanced",
      volleyballImpact: sportId === "volei" ? createVolleyballImpactState() : null
    };
    const gameState = {
      mode: "procedural-season-v1",
      sportId,
      sportVariant,
      division,
      seed,
      status: "intro",
      activeTab: "hub",
      currentDay: 1,
      currentWeek: 1,
      maxDays: 70,
      league,
      userTeam,
      roster,
      teamState,
      standings: createStandings(league),
      calendar: null,
      processedEventIds: [],
      usedDecisionIds: [],
      decisionDeckSeed: options.decisionDeckSeed || `deck-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
      decisionDeckCursor: 0,
      decisionMemory: [],
      log: [
        createLogEntry(
          "system",
          "O primeiro dia",
          userTeam?.lore?.opening || userTeam?.lore?.description || `${userTeam?.name || "Seu clube"} inicia uma nova temporada.`,
          1
        )
      ]
    };
    gameState.summary = summarizeTeam(roster, teamState);
    if (window.TemporadaTotal?.CalendarEngine?.createSeasonCalendar) {
      gameState.calendar = window.TemporadaTotal.CalendarEngine.createSeasonCalendar(gameState);
    }
    return sanitizeSportIdentity(gameState);
  }

  function addLog(state, type, title, text) {
    state.log.unshift(createLogEntry(type, title, text, state.currentDay));
    state.log = state.log.slice(0, 80);
  }

  function applyTeamDeltas(state, deltas = {}) {
    const teamState = state.teamState;
    teamState.chemistry = clamp(teamState.chemistry + (Number(deltas.chemistry) || 0), 0, 100);
    teamState.morale = clamp(teamState.morale + (Number(deltas.morale) || 0), 0, 100);
    teamState.fatigue = clamp(teamState.fatigue + (Number(deltas.fatigue) || 0), 0, 100);
    state.roster.forEach((player) => {
      player.morale = clamp(player.morale + (Number(deltas.playerMorale) || Number(deltas.morale) * 0.45 || 0), 0, 100);
      player.fatigue = clamp(player.fatigue + (Number(deltas.playerFatigue) || Number(deltas.fatigue) || 0), 0, 100);
      player.status = player.fatigue >= 82 ? "Desgastado" : player.fatigue >= 65 ? "Limitado" : "Disponivel";
    });
    state.summary = summarizeTeam(state.roster, state.teamState);
  }

  function addVolleyballImpact(state, impacts = {}, label = "") {
    if (state.sportId !== "volei") return state;
    const current = {
      ...createVolleyballImpactState(),
      ...(state.teamState.volleyballImpact || {})
    };
    ["serve", "reception", "attack", "block", "defense", "load"].forEach((key) => {
      current[key] = clamp((Number(current[key]) || 0) + (Number(impacts[key]) || 0), -10, 10);
    });
    current.lastLabel = label || current.lastLabel || "";
    current.lastSummary = impacts.summary || current.lastSummary || "";
    state.teamState.volleyballImpact = current;
    return state;
  }

  function decayVolleyballImpact(state, amount = 0.8) {
    if (state.sportId !== "volei" || !state.teamState.volleyballImpact) return state;
    const current = {
      ...createVolleyballImpactState(),
      ...state.teamState.volleyballImpact
    };
    ["serve", "reception", "attack", "block", "defense", "load"].forEach((key) => {
      const value = Number(current[key]) || 0;
      if (Math.abs(value) <= amount) current[key] = 0;
      else current[key] = round(value - Math.sign(value) * amount, 1);
    });
    state.teamState.volleyballImpact = current;
    return state;
  }

  function getVolleyballMatchModifier(state) {
    if (state.sportId !== "volei") return 0;
    const impact = state.teamState?.volleyballImpact || {};
    const positive =
      (Number(impact.serve) || 0) * 0.11
      + (Number(impact.reception) || 0) * 0.14
      + (Number(impact.attack) || 0) * 0.12
      + (Number(impact.block) || 0) * 0.1
      + (Number(impact.defense) || 0) * 0.08;
    const loadPenalty = Math.max(0, Number(impact.load) || 0) * 0.16;
    return round(clamp(positive - loadPenalty, -2.4, 2.4), 2);
  }

  function applyMinigameBuff(state, buff = {}) {
    state.minigameBuff = {
      sportId: buff.sportId || state.sportId,
      tier: buff.tier || "good",
      ratingBoost: Number(buff.ratingBoost) || 2.5,
      buffSummary: buff.buffSummary || "Bônus de Treino Aplicado",
      matchesRemaining: Number(buff.matchesRemaining) || 1,
      createdAtDay: state.currentDay
    };
    if (buff.moraleDelta || buff.chemistryDelta) {
      applyTeamDeltas(state, {
        morale: buff.moraleDelta || 0,
        chemistry: buff.chemistryDelta || 0
      });
    }
    addLog(
      state,
      "training",
      "Bônus de Treino Conquistado",
      `${state.minigameBuff.buffSummary}. Seu time entrará com bônus direto de desempenho na próxima partida!`
    );
    return state;
  }

  function addUniversalDecisionImpact(state, decision, choice) {
    let boost = 0;
    const effects = choice?.effects || {};
    if (effects.attack || effects.defense || effects.clutch || effects.development) {
      boost += (Number(effects.attack) || 0) * 0.8;
      boost += (Number(effects.defense) || 0) * 0.8;
      boost += (Number(effects.clutch) || 0) * 1.0;
      boost += (Number(effects.development) || 0) * 0.5;
    }
    const text = `${choice?.label || ""} ${choice?.description || ""} ${choice?.effectText || ""}`.toLowerCase();
    if (text.includes("defesa") || text.includes("marcar") || text.includes("bloqueio")) boost += 1.5;
    if (text.includes("ataque") || text.includes("finaliza") || text.includes("arremesso") || text.includes("saque")) boost += 1.8;
    if (text.includes("pressionar") || text.includes("intensidade") || text.includes("exigir")) boost += 1.2;
    if (text.includes("cautela") || text.includes("poupar") || text.includes("descanso")) boost -= 0.8;

    state.decisionMatchModifier = round(clamp((state.decisionMatchModifier || 0) + boost, -3.5, 4.0), 1);
    state.lastDecisionImpactLabel = `${decision?.title || "Decisão"}: ${choice?.label || ""}`;
    return state;
  }

  function getMatchPerformanceBoost(state) {
    if (!state) return 0;
    let total = 0;
    if (state.sportId === "volei") {
      total += getVolleyballMatchModifier(state);
    }
    if (state.decisionMatchModifier) {
      total += Number(state.decisionMatchModifier) || 0;
    }
    if (state.minigameBuff && state.minigameBuff.matchesRemaining > 0) {
      total += Number(state.minigameBuff.ratingBoost) || 0;
    }
    return round(clamp(total, -5, 6), 2);
  }

  function consumeMatchPerformanceBoost(state) {
    if (!state) return state;
    if (state.minigameBuff && state.minigameBuff.matchesRemaining > 0) {
      state.minigameBuff.matchesRemaining -= 1;
      if (state.minigameBuff.matchesRemaining <= 0) {
        state.minigameBuff = null;
      }
    }
    if (state.decisionMatchModifier) {
      state.decisionMatchModifier = round(state.decisionMatchModifier * 0.35, 1);
      if (Math.abs(state.decisionMatchModifier) < 0.4) state.decisionMatchModifier = 0;
    }
    if (state.sportId === "volei") {
      decayVolleyballImpact(state, 1.2);
    }
    return state;
  }

  function updateMatchResult(state, result) {
    updateStanding(state.standings, result.homeId, result.homeScore, result.awayScore);
    updateStanding(state.standings, result.awayId, result.awayScore, result.homeScore);
    state.standings.sort((a, b) => (b.points || b.wins * 3) - (a.points || a.wins * 3) || b.wins - a.wins || b.pointDiff - a.pointDiff || b.rating - a.rating);
  }

  function calculateVolleyballEfficiency(stats = {}) {
    return round(
      (Number(stats.points) || 0)
      + (Number(stats.aces) || 0) * 1.2
      + (Number(stats.blocks) || 0) * 1.4
      + (Number(stats.digs) || 0) * 0.35
      + (Number(stats.positiveReceptions) || 0) * 0.22
      + (Number(stats.setAssists) || 0) * 0.16
      - (Number(stats.errors) || 0) * 1.1
      - (Number(stats.attackErrors) || 0) * 0.4
    );
  }

  function addVolleyballStats(player, deltas = {}) {
    player.seasonStats = {
      ...createEmptySeasonStats("volei"),
      ...(player.seasonStats || {})
    };
    Object.entries(deltas || {}).forEach(([key, value]) => {
      player.seasonStats[key] = round((Number(player.seasonStats[key]) || 0) + (Number(value) || 0));
    });
    player.seasonStats.efficiency = calculateVolleyballEfficiency(player.seasonStats);
  }

  function recordQuickVolleyballMatchStats(state, result = {}, rng) {
    if (state.sportId !== "volei") return;
    const setsPlayed = Math.max(3, Math.min(5, (Number(result.homeScore) || 0) + (Number(result.awayScore) || 0)));
    const roll = rng?.int ? (min, max) => rng.int(min, max) : (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const starters = (state.roster || [])
      .slice()
      .sort((a, b) => (Number(b.currentAbility) || 0) - (Number(a.currentAbility) || 0))
      .slice(0, 7);

    starters.forEach((player, index) => {
      const role = player.pos;
      const attackBase = role === "OPP" ? roll(10, 18) : role === "PON" ? roll(7, 15) : role === "CEN" ? roll(5, 11) : role === "LEV" ? roll(1, 4) : roll(0, 2);
      const aceBase = Number(player.serve || 0) >= 76 ? roll(1, 3) : roll(0, 1);
      const blockBase = role === "CEN" ? roll(2, 5) : role === "OPP" || role === "PON" ? roll(0, 2) : 0;
      const receptionBase = role === "LIB" ? roll(18, 32) : role === "PON" ? roll(10, 24) : roll(0, 6);
      const digBase = role === "LIB" ? roll(10, 22) : role === "PON" ? roll(5, 13) : roll(1, 8);
      const setAssists = role === "LEV" ? roll(26, 48) : roll(0, 3);
      const errors = roll(0, index < 7 ? 3 : 1);

      addVolleyballStats(player, {
        games: 1,
        setsPlayed,
        points: attackBase + aceBase + blockBase,
        aces: aceBase,
        attacks: attackBase + roll(4, 10),
        attackPoints: attackBase,
        attackErrors: role === "LIB" ? 0 : roll(0, 3),
        blocks: blockBase,
        receptions: receptionBase,
        positiveReceptions: Math.round(receptionBase * (Number(player.reception || 65) / 100)),
        receptionErrors: receptionBase ? roll(0, 2) : 0,
        digs: digBase,
        setAssists,
        errors
      });
    });
    state.summary = summarizeTeam(state.roster, state.teamState);
  }

  function recordLiveVolleyballMatchStats(state, liveState = {}) {
    if (state.sportId !== "volei") return;
    Object.values(liveState.playerStats || {})
      .filter((stats) => stats.teamId === "home")
      .forEach((stats) => {
        const sourceId = String(stats.playerId || "").replace(/^home-/, "");
        const player = (state.roster || []).find((row) => row.id === sourceId || `home-${row.id}` === stats.playerId);
        if (!player) return;
        addVolleyballStats(player, {
          games: 1,
          setsPlayed: (liveState.completedSets || []).length || (Number(liveState.sets?.home || 0) + Number(liveState.sets?.away || 0)),
          points: stats.points,
          aces: stats.aces,
          attacks: stats.attacks,
          attackPoints: stats.attackPoints,
          attackErrors: stats.attackErrors,
          blocks: stats.blocks,
          receptions: stats.receptions,
          positiveReceptions: stats.positiveReceptions,
          receptionErrors: stats.receptionErrors,
          digs: stats.digs,
          setAssists: stats.setAssists,
          errors: stats.errors
        });
      });
    state.summary = summarizeTeam(state.roster, state.teamState);
  }

  function getNextMatchEvent(state) {
    return (state.calendar?.events || []).find((event) => event.type === "match" && !event.processed && event.day >= state.currentDay) || null;
  }

  function buildLivePlayer(player, teamId, index, sportId = "basquete") {
    if (sportId === "futsal") {
      return {
        id: `${teamId}-${player.id}`,
        sourceId: player.id,
        name: player.name,
        teamId,
        pos: player.pos,
        usage: index < 5 ? 1.08 : 0.68,
        finishing: Number(player.finishing || player.currentAbility || 72),
        passing: Number(player.passing || player.tactical || player.currentAbility || 72),
        marking: Number(player.marking || player.defense || player.currentAbility || 72),
        goalkeeping: Number(player.goalkeeping || (player.pos === "GOL" ? player.currentAbility : 35) || 35),
        physical: Number(player.physical || player.currentAbility || 72),
        tactical: Number(player.tactical || player.currentAbility || 72),
        defense: Number(player.marking || player.currentAbility || 72)
      };
    }
    if (sportId === "volei") {
      return {
        id: `${teamId}-${player.id}`,
        sourceId: player.id,
        name: player.name,
        teamId,
        pos: player.pos,
        usage: index < 7 ? 1.08 : 0.72,
        serve: Number(player.serve || player.currentAbility || 72),
        attack: Number(player.attack || player.currentAbility || 72),
        block: Number(player.block || player.currentAbility || 72),
        reception: Number(player.reception || player.currentAbility || 72),
        setting: Number(player.setting || player.tactical || player.currentAbility || 72),
        defense: Number(player.defense || player.currentAbility || 72),
        physical: Number(player.physical || player.currentAbility || 72),
        tactical: Number(player.tactical || player.currentAbility || 72)
      };
    }
    return {
      id: `${teamId}-${player.id}`,
      sourceId: player.id,
      name: player.name,
      teamId,
      pos: player.pos,
      usage: index < 5 ? 1.12 : 0.72,
      shooting: Number(player.technique || player.currentAbility || 72),
      finishing: Number(player.physical || player.currentAbility || 72),
      threepoint: Number(player.threePoint || player.currentAbility || 72),
      passing: Number(player.tactical || player.currentAbility || 72),
      defense: Number(player.defense || player.currentAbility || 72),
      rebound: Number(player.physical || player.heightCm || 72)
    };
  }

  function buildLiveTeamFromClub(club, teamId) {
    const sportId = club?.sportId || "basquete";
    const rosterLimit = sportId === "volei" ? 12 : sportId === "futsal" ? 10 : 10;
    const roster = (club?.roster?.players || []).slice(0, rosterLimit).map((player, index) => buildLivePlayer(player, teamId, index, sportId));
    const rating = Number(club?.rating?.overall || 74);
    return {
      id: teamId,
      sourceId: club?.id || teamId,
      name: club?.name || (teamId === "home" ? "Casa" : "Fora"),
      rating,
      offense: Number(club?.rating?.current || rating),
      defense: Number(club?.rating?.defense || rating),
      finishing: Number(club?.rating?.shooting || club?.rating?.current || rating),
      passing: Number(club?.rating?.current || rating),
      marking: Number(club?.rating?.defense || rating),
      goalkeeping: Number(club?.rating?.defense || rating),
      attack: Number(club?.rating?.shooting || club?.rating?.current || rating),
      serve: Number(club?.rating?.shooting || rating),
      block: Number(club?.rating?.defense || rating),
      reception: Number(club?.rating?.defense || rating),
      threeRate: 0.36,
      pace: club?.rosterStyle?.includes("fast") ? "fast" : "balanced",
      roster
    };
  }

  function syncUserTeamRoster(state) {
    if (!state.userTeam) return;
    state.userTeam.roster = {
      ...(state.userTeam.roster || {}),
      players: state.roster.map(clone),
      summary: {
        ...(state.userTeam.roster?.summary || {}),
        rosterSize: state.roster.length,
        totalSalary: state.summary.totalSalary,
        budget: state.summary.budget,
        budgetLeft: state.summary.budgetLeft,
        averageCurrentAbility: state.summary.overallAverage,
        averagePotential: state.summary.potentialAverage
      }
    };
  }

  function calculateReleaseCost(player) {
    const salary = Number(player?.salary) || 0;
    const current = Number(player?.currentAbility) || 0;
    const potential = Number(player?.potential) || current;
    const role = String(player?.rosterRole || player?.role || "").toLowerCase();
    const importance = current >= 78 || role.includes("starter") ? 1.35 : current >= 72 ? 1.05 : 0.75;
    const upside = Math.max(0, potential - current) >= 8 ? 1.2 : 1;
    const ageRelief = Number(player?.age) >= 31 ? 0.85 : 1;
    return round(Math.max(0.4, salary * importance * upside * ageRelief * 0.55), 1);
  }

  function signSandboxPlayer(state, player, sandbox = {}) {
    if (!player) return null;
    const outgoing = sandbox.outgoing || null;
    const releaseCost = outgoing ? Number(sandbox.releaseCost ?? calculateReleaseCost(outgoing)) || 0 : 0;
    if (outgoing) {
      state.roster = state.roster.filter((row) => row.id !== outgoing.id && row.sourceId !== outgoing.id);
      state.teamState.budget = round((Number(state.teamState.budget) || 0) - releaseCost);
    }
    const normalized = normalizePlayer({
      ...player,
      id: player.id,
      rosterRole: "sandbox_signing",
      rosterSlot: state.roster.length + 1
    }, state.roster.length, state.sportId || "basquete");
    state.roster.push(normalized);
    state.summary = summarizeTeam(state.roster, state.teamState);
    syncUserTeamRoster(state);
    addLog(
      state,
      "market",
      "Reforco contratado",
      `${normalized.name} chegou ao elenco${outgoing ? `, enquanto ${outgoing.name} foi liberado por $${releaseCost.toFixed(1)}M` : ""}. A diretoria espera resposta rapida dentro da quadra.`
    );
    return normalized;
  }

  function applyWeeklyFocus(state, focus) {
    const effects = {
      balanced: { chemistry: 0.5, morale: 0.4, fatigue: -0.5, playerFatigue: -0.5 },
      recovery: { morale: 0.8, fatigue: -4, playerFatigue: -5 },
      training: { chemistry: 2.2, morale: 0.2, fatigue: 3.5, playerFatigue: 4 },
      chemistry: { chemistry: 1.6, morale: 1.8, fatigue: 0.7, playerMorale: 1.2 },
      results: { morale: 1.2, chemistry: 0.8, fatigue: 2.5, playerFatigue: 2.5 }
    };
    const labels = {
      balanced: "Plano equilibrado",
      recovery: "Recuperar elenco",
      training: "Treino forte",
      chemistry: "Fechar grupo",
      results: "Buscar resultado"
    };
    const selected = effects[focus] ? focus : "balanced";
    state.teamState.weeklyFocus = selected;
    applyTeamDeltas(state, effects[selected]);
    addLog(
      state,
      "team",
      "Foco semanal definido",
      `${labels[selected]} virou a mensagem da semana. A escolha ajustou moral, quimica e carga fisica.`
    );
    return state;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    registeredSports: (window.TemporadaTotal && window.TemporadaTotal.registeredSports) || {},
    registerSport(manifest) {
      if (manifest && manifest.id) {
        (this.registeredSports = this.registeredSports || {})[manifest.id] = manifest;
      }
      return manifest;
    },
    GameState: {
      createInitialGameState,
      summarizeTeam,
      addLog,
      sanitizeSportIdentity,
      applyTeamDeltas,
      addVolleyballImpact,
      decayVolleyballImpact,
      getVolleyballMatchModifier,
      updateMatchResult,
      createEmptySeasonStats,
      recordQuickVolleyballMatchStats,
      recordLiveVolleyballMatchStats,
      getNextMatchEvent,
      buildLiveTeamFromClub,
      calculateReleaseCost,
      signSandboxPlayer,
      applyWeeklyFocus,
      syncUserTeamRoster,
      applyMinigameBuff,
      addUniversalDecisionImpact,
      getMatchPerformanceBoost,
      consumeMatchPerformanceBoost
    },
    createProceduralGameState: createInitialGameState
  };
})();
