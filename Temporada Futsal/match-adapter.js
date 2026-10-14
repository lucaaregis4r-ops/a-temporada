(function () {
  const MatchEvents = window.TemporadaTotal?.MatchEvents;
  const clamp = window.TemporadaTotal?.clamp || ((value, min, max) => Math.min(max, Math.max(min, Number(value) || 0)));

  const statsSchema = [
    { key: "minutes", label: "MIN" },
    { key: "goals", label: "G" },
    { key: "assists", label: "AST" },
    { key: "shots", label: "CH" },
    { key: "shotsOnTarget", label: "CG" },
    { key: "passes", label: "PAS" },
    { key: "keyPasses", label: "PCH" },
    { key: "steals", label: "RB" },
    { key: "blocks", label: "BLK" },
    { key: "saves", label: "DEF" },
    { key: "goalsConceded", label: "GC" },
    { key: "turnovers", label: "PE" },
    { key: "fouls", label: "F" },
    { key: "foulsCommitted", label: "FC" },
    { key: "foulsDrawn", label: "FS" },
    { key: "yellowCards", label: "CA" },
    { key: "redCards", label: "CV" },
    { key: "efficiency", label: "EFF" },
    { key: "rating", label: "RTG" }
  ];

  function getNumber(source, keys, fallback = 75) {
    for (const key of keys) {
      if (source?.[key] != null) return Number(source[key]) || fallback;
    }
    return fallback;
  }

  function pickWeighted(players = [], weightFn) {
    const list = players.length ? players : [];
    const total = list.reduce((sum, player) => sum + Math.max(0.01, weightFn(player)), 0) || 1;
    let roll = Math.random() * total;
    for (const player of list) {
      roll -= Math.max(0.01, weightFn(player));
      if (roll <= 0) return player;
    }
    return list[0];
  }

  function getTeamEdge(team, opponent) {
    return clamp(((team.rating || 75) - (opponent.rating || 75)) / 100, -0.12, 0.12);
  }

  function getCoaching(state) {
    return window.TemporadaTotal?.LiveCoaching?.getCoachingModifiers?.(state.coaching || {}) || {};
  }

  function getTurnoverRate(offense, defense, possessionType, coaching = {}) {
    const base = possessionType === "counter" ? 0.25 : possessionType === "transition" ? 0.2 : possessionType === "set_piece" ? 0.1 : 0.19;
    return clamp(base - getTeamEdge(offense, defense) * 0.25 + ((defense.defense || 75) - 75) * 0.001 + (coaching.turnover || 0) + (coaching.turnoverForced || 0), 0.05, 0.36);
  }

  function getShotCreationRate(offense, defense, possessionType, coaching = {}) {
    const base = possessionType === "counter" ? 0.72 : possessionType === "transition" ? 0.62 : possessionType === "set_piece" ? 0.68 : 0.52;
    const futsalShape = (coaching.pivotRate || 0) * (possessionType === "positional" ? 0.14 : 0.04)
      + (coaching.wideRate || 0) * (possessionType === "transition" ? 0.12 : 0.05)
      + (coaching.setPiece || 0) * (possessionType === "set_piece" ? 0.08 : 0);
    return clamp(base + getTeamEdge(offense, defense) * 0.35 + (coaching.shot || 0) * 1.8 - (coaching.defense || 0) + futsalShape, 0.3, 0.86);
  }

  function getShotOnTargetRate(shooter, possessionType, coaching = {}) {
    const base = possessionType === "set_piece" ? 0.48 : 0.42;
    return clamp(base + (getNumber(shooter, ["finishing", "shooting"], 75) - 75) * 0.002 + (coaching.shot || 0) + (coaching.setPiece && possessionType === "set_piece" ? 0.035 : 0), 0.24, 0.72);
  }

  function getGoalProbability(shooter, goalkeeper, possessionType, coaching = {}) {
    const base = possessionType === "counter" ? 0.28 : possessionType === "set_piece" ? 0.24 : 0.21;
    return clamp(base + (getNumber(shooter, ["finishing"], 75) - getNumber(goalkeeper, ["goalkeeping", "defense"], 75)) * 0.0025 + (coaching.shot || 0) - (coaching.defense || 0) + (coaching.powerPlay ? 0.025 : 0), 0.12, 0.47);
  }

  function getFoulRate(offense, defense, coaching = {}) {
    return clamp(0.13 + ((defense.defense || 75) - (offense.rating || 75)) * 0.001 + (coaching.foul || 0), 0.05, 0.28);
  }

  function getCardRate(state, teamId) {
    const teamFouls = state.teamFouls?.[teamId] || 0;
    return clamp(0.08 + Math.max(0, teamFouls - 5) * 0.035, 0.04, 0.24);
  }

  function ensureLineups(state, homeTeam, awayTeam) {
    if (!state.playerEnergy) {
      state.playerEnergy = {};
      const allPlayers = [...(homeTeam?.roster || []), ...(awayTeam?.roster || [])];
      for (const p of allPlayers) {
        state.playerEnergy[p.id] = 100;
      }
    }
    if (!state.hotHand) {
      state.hotHand = {};
    }
    if (state.lineups) return state.lineups;
    const build = (team) => {
      const roster = team?.roster || [];
      const keeper = roster.find((p) => p.pos === "GOL" || p.position === "GOL") || roster[0];
      const court = roster.filter((p) => p.id !== keeper?.id);
      const activeCourt = court.slice(0, 4);
      const active = keeper ? [keeper.id, ...activeCourt.map((p) => p.id)] : roster.slice(0, 5).map((p) => p.id);
      const bench = roster.filter((p) => !active.includes(p.id)).map((p) => p.id);
      return { active, bench };
    };
    state.lineups = { home: build(homeTeam), away: build(awayTeam) };
    state.substitutions = [];
    return state.lineups;
  }

  function getActiveRoster(team, state) {
    const teamId = team.id === state.homeTeam?.id ? "home" : "away";
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    const activeIds = new Set(lineup.active || []);
    const active = (team.roster || []).filter((player) => activeIds.has(player.id));
    return active.length ? active : (team.roster || []).slice(0, 5);
  }

  function getOnCourtRatings(team, state, coaching = {}) {
    const active = getActiveRoster(team, state);
    if (!active.length) {
      return { offense: team.offense || 75, defense: team.defense || 75, rating: team.rating || 75, avgEnergy: 100 };
    }
    let totalOff = 0;
    let totalDef = 0;
    let totalEnergy = 0;
    for (const p of active) {
      const energy = state.playerEnergy?.[p.id] ?? 100;
      totalEnergy += energy;
      const energyMult = energy >= 80 ? 1.0 : energy >= 60 ? 0.95 : energy >= 40 ? 0.88 : 0.78;
      const pOff = getNumber(p, ["finishing", "shooting", "passing"], team.offense || 75);
      const pDef = getNumber(p, ["marking", "defense", "physical", "goalkeeping"], team.defense || 75);
      totalOff += pOff * energyMult;
      totalDef += pDef * energyMult;
    }
    const n = active.length;
    const baseOff = totalOff / n + (coaching.shot || 0) * 100;
    const baseDef = totalDef / n + (coaching.defense || 0) * 100;
    const rating = Math.round((baseOff + baseDef) / 2);
    return {
      offense: clamp(baseOff, 50, 110),
      defense: clamp(baseDef, 50, 110),
      rating: clamp(rating, 50, 110),
      avgEnergy: totalEnergy / n
    };
  }

  function tickPlayerEnergy(state, homeCoaching = {}, awayCoaching = {}) {
    const lineups = ensureLineups(state, state.homeTeam, state.awayTeam);
    ["home", "away"].forEach((teamId) => {
      const coaching = teamId === "home" ? homeCoaching : awayCoaching;
      const activeIds = new Set(lineups[teamId].active || []);
      const benchIds = new Set(lineups[teamId].bench || []);
      let fatigueMod = coaching.fatigueDrain || 1.0;
      if (coaching.pace === "fast") fatigueMod *= 1.2;
      if (coaching.defensivePressure === "high") fatigueMod *= 1.15;

      for (const id of activeIds) {
        state.playerEnergy[id] = clamp((state.playerEnergy[id] ?? 100) - (0.36 * fatigueMod), 18, 100);
      }
      for (const id of benchIds) {
        state.playerEnergy[id] = clamp((state.playerEnergy[id] ?? 100) + 1.35, 18, 100);
      }
    });
  }

  function applySubstitution(state, teamId, outId, inId) {
    const team = teamId === "away" ? state.awayTeam : state.homeTeam;
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    if (!lineup || !lineup.active.includes(outId) || !lineup.bench.includes(inId)) return false;
    lineup.active = lineup.active.map((id) => id === outId ? inId : id);
    lineup.bench = lineup.bench.map((id) => id === inId ? outId : id);
    const outPlayer = (team.roster || []).find((player) => player.id === outId);
    const inPlayer = (team.roster || []).find((player) => player.id === inId);
    state.substitutions = [
      { teamId, outId, inId, outName: outPlayer?.name || "", inName: inPlayer?.name || "", tick: state.clock?.tick || 0 },
      ...(state.substitutions || [])
    ].slice(0, 12);
    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "futsal",
      type: "substitution",
      teamId,
      minute: state.clock?.minute || 0,
      period: state.clock?.period || 1,
      description: `${inPlayer?.name || "Atleta"} entra na quadra no lugar de ${outPlayer?.name || "atleta"}.`,
      tags: ["substitution"]
    }));
    state.events = state.events.slice(0, state.maxEvents || 80);
    return true;
  }

  function substituteEntireLine(state, teamId) {
    const team = teamId === "away" ? state.awayTeam : state.homeTeam;
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    if (!lineup || !lineup.bench || !lineup.bench.length) return false;
    const roster = team?.roster || [];
    const keeper = roster.find((p) => p.pos === "GOL" || p.position === "GOL");
    const activeCourt = lineup.active.filter((id) => id !== keeper?.id);
    const benchCourt = lineup.bench.filter((id) => {
      const p = roster.find((r) => r.id === id);
      return p && p.pos !== "GOL" && p.position !== "GOL";
    });
    if (benchCourt.length < 2) return false;
    const swapCount = Math.min(activeCourt.length, benchCourt.length);
    const toEnter = benchCourt.slice(0, swapCount);
    const toLeave = activeCourt.slice(0, swapCount);

    lineup.active = lineup.active.map((id) => {
      const idx = toLeave.indexOf(id);
      return idx !== -1 ? toEnter[idx] : id;
    });
    lineup.bench = lineup.bench.map((id) => {
      const idx = toEnter.indexOf(id);
      return idx !== -1 ? toLeave[idx] : id;
    });

    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "futsal",
      type: "line_change",
      teamId,
      minute: state.clock?.minute || 0,
      period: state.clock?.period || 1,
      description: `🔄 ${team?.name || "Equipe"} troca o quarteto em quadra! Pressão renovada.`,
      tags: ["substitution", "line_change"]
    }));
    state.events = state.events.slice(0, state.maxEvents || 80);
    return true;
  }

  function applyTimeout(state, teamId) {
    const team = teamId === "away" ? state.awayTeam : state.homeTeam;
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    if (!lineup) return false;
    for (const id of lineup.active) {
      state.playerEnergy[id] = clamp((state.playerEnergy[id] || 100) + 14, 0, 100);
    }
    const oppTeamId = teamId === "home" ? "away" : "home";
    const oppLineup = ensureLineups(state, state.homeTeam, state.awayTeam)[oppTeamId];
    if (oppLineup) {
      for (const id of oppLineup.active) {
        state.hotHand[id] = 0;
      }
    }
    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "futsal",
      type: "timeout",
      teamId,
      minute: state.clock?.minute || 0,
      period: state.clock?.period || 1,
      description: `⏱️ Tempo técnico! ${team?.name || "Equipe"} acalma a posse (+14% fôlego) e reorganiza o quarteto.`,
      tags: ["timeout"]
    }));
    state.events = state.events.slice(0, state.maxEvents || 80);
    return true;
  }

  function pickShooter(team, possessionType, state) {
    const roster = getActiveRoster(team, state);
    return pickWeighted(roster.filter((player) => player.pos !== "GOL"), (player) => {
      const pivotBonus = possessionType === "positional" && player.pos === "PIVO" ? 1.25 : 1;
      const hotBonus = (state?.hotHand?.[player.id] || 0) >= 2 ? 1.4 : 1;
      return (player.usage || 1) * pivotBonus * hotBonus * getNumber(player, ["finishing", "shooting"], team.offense || 75);
    });
  }

  function pickPasser(team, shooter, state) {
    const roster = getActiveRoster(team, state);
    return pickWeighted(roster.filter((player) => player.id !== shooter.id && player.pos !== "GOL"), (player) => (player.usage || 1) * getNumber(player, ["passing", "tactical"], 75));
  }

  function pickDefender(team, state) {
    const roster = getActiveRoster(team, state);
    return pickWeighted(roster.filter((player) => player.pos !== "GOL"), (player) => getNumber(player, ["marking", "defense"], team.defense || 75));
  }

  function pickGoalkeeper(team, state) {
    const roster = getActiveRoster(team, state);
    return roster.find((player) => player.pos === "GOL" || player.position === "GOL") || team.roster.find((player) => player.pos === "GOL") || roster[0];
  }

  function pickBallWinner(team, state) {
    const roster = getActiveRoster(team, state);
    return pickWeighted(roster.filter((player) => player.pos !== "GOL"), (player) => getNumber(player, ["marking", "defense", "physical"], team.defense || 75));
  }

  function createInitialMatchState(homeTeam, awayTeam) {
    const roster = [...homeTeam.roster, ...awayTeam.roster];
    const state = {
      sport: "futsal",
      status: "idle",
      speed: "normal",
      homeTeam,
      awayTeam,
      score: { home: 0, away: 0 },
      coaching: window.TemporadaTotal?.LiveCoaching?.createDefaultCoachingState?.() || {},
      teamFouls: { home: 0, away: 0 },
      cards: { home: { yellow: 0, red: 0 }, away: { yellow: 0, red: 0 } },
      clock: { period: 1, minute: 0, totalMinutes: 0, tick: 0, sequenceTarget: 92 + Math.round(Math.random() * 24), label: "1T 0'" },
      events: [],
      maxEvents: 120,
      playerStats: MatchEvents.createEmptyPlayerStats(roster, statsSchema)
    };
    ensureLineups(state, homeTeam, awayTeam);
    return state;
  }

  function getMatchStatsSchema() {
    return statsSchema.slice();
  }

  function updateClock(state) {
    const elapsed = clamp(state.clock.tick / state.clock.sequenceTarget, 0, 1) * 40;
    state.clock.totalMinutes = elapsed;
    state.clock.minute = Math.floor(elapsed);
    state.clock.period = elapsed < 20 ? 1 : 2;
    state.clock.label = `${state.clock.period}T ${Math.floor(elapsed)}'`;
  }

  function createEvent(state, event) {
    return MatchEvents.createMatchEvent({
      sport: "futsal",
      minute: state.clock.minute,
      period: state.clock.period,
      ...event
    });
  }

  function simulateTick(state, homeTeam, awayTeam) {
    ensureLineups(state, homeTeam, awayTeam);
    const offenseIsHome = state.clock.tick % 2 === 0;
    const offense = offenseIsHome ? homeTeam : awayTeam;
    const defense = offenseIsHome ? awayTeam : homeTeam;
    const teamId = offenseIsHome ? "home" : "away";
    const defenseId = offenseIsHome ? "away" : "home";
    const baseCoaching = getCoaching(state);
    const coaching = teamId === "home"
      ? baseCoaching
      : { defense: baseCoaching.defense || 0, turnoverForced: baseCoaching.turnoverForced || 0, foul: baseCoaching.foul || 0 };
    state.clock.tick += 1;
    updateClock(state);

    // Apply player stamina drain and bench recovery
    tickPlayerEnergy(state, baseCoaching, {});

    // Dynamic on-court ratings
    const offRatings = getOnCourtRatings(offense, state, teamId === "home" ? baseCoaching : {});
    const defRatings = getOnCourtRatings(defense, state, defenseId === "home" ? baseCoaching : {});

    const possessionRoll = Math.random();
    const setPieceBoost = teamId === "home" ? Number(baseCoaching.setPiece || 0) * 0.06 : 0;
    const wideBoost = teamId === "home" ? Number(baseCoaching.wideRate || 0) * 0.08 : 0;
    const possessionType = possessionRoll < 0.12 + wideBoost
      ? "counter"
      : possessionRoll < 0.28 + wideBoost
        ? "transition"
        : possessionRoll < 0.38 + setPieceBoost
          ? "set_piece"
          : "positional";
    const shooter = pickShooter(offense, possessionType, state);
    const passer = pickPasser(offense, shooter, state);
    const defender = pickDefender(defense, state);
    const goalkeeper = pickGoalkeeper(defense, state);

    if (Math.random() < getFoulRate(offRatings, defRatings, coaching)) {
      const cardRoll = Math.random();
      const cardRate = getCardRate(state, defenseId);
      const red = cardRoll < cardRate * 0.08;
      const yellow = !red && cardRoll < cardRate;
      return createEvent(state, {
        type: red ? "red_card" : yellow ? "yellow_card" : "foul",
        teamId,
        playerId: passer.id,
        secondaryPlayerId: defender.id,
        value: 0,
        description: `${defender.name} faz falta em ${passer.name}${red ? " e recebe vermelho" : yellow ? " e recebe amarelo" : ""}.`,
        statDeltas: {
          [passer.id]: { foulsDrawn: 1 },
          [defender.id]: { fouls: 1, foulsCommitted: 1, ...(yellow ? { yellowCards: 1 } : {}), ...(red ? { redCards: 1 } : {}) }
        },
        tags: ["foul", ...(yellow || red ? ["card"] : [])]
      });
    }

    if (Math.random() < getTurnoverRate(offRatings, defRatings, possessionType, coaching)) {
      const ballWinner = pickBallWinner(defense, state);
      state.hotHand[passer.id] = 0;
      state.hotHand[ballWinner.id] = (state.hotHand[ballWinner.id] || 0) + 1;
      return createEvent(state, {
        type: possessionType === "counter" ? "counter_turnover" : "turnover",
        teamId: defenseId,
        playerId: ballWinner.id,
        secondaryPlayerId: passer.id,
        value: 0,
        description: `${ballWinner.name} antecipa a jogada e recupera a posse.`,
        statDeltas: {
          [passer.id]: { passes: 1, turnovers: 1 },
          [ballWinner.id]: { steals: 1 }
        },
        tags: ["turnover", "transition"]
      });
    }

    if (Math.random() > getShotCreationRate(offRatings, defRatings, possessionType, coaching)) {
      return createEvent(state, {
        type: "circulation",
        teamId,
        playerId: passer.id,
        value: 0,
        description: `${offense.name} circula a bola, mas não encontra finalização limpa.`,
        statDeltas: { [passer.id]: { passes: 1 } },
        tags: ["possession"]
      });
    }

    const shooterEnergy = state.playerEnergy?.[shooter.id] ?? 100;
    const energyMod = shooterEnergy < 50 ? -0.06 : shooterEnergy < 70 ? -0.03 : 0;
    const hotMod = (state.hotHand?.[shooter.id] || 0) >= 2 ? 0.08 : 0;
    const onTarget = Math.random() < clamp(getShotOnTargetRate(shooter, possessionType, coaching) + energyMod + hotMod, 0.2, 0.85);

    if (!onTarget) {
      state.hotHand[shooter.id] = 0;
      const blocked = Math.random() < 0.22;
      return createEvent(state, {
        type: blocked ? "blocked_shot" : "shot_off_target",
        teamId,
        playerId: shooter.id,
        secondaryPlayerId: blocked ? defender.id : null,
        value: 0,
        description: blocked ? `${defender.name} bloqueia a finalização de ${shooter.name}.` : `${shooter.name} finaliza para fora.`,
        statDeltas: {
          [passer.id]: { passes: 1, keyPasses: 1 },
          [shooter.id]: { shots: 1 },
          ...(blocked ? { [defender.id]: { blocks: 1 } } : {})
        },
        tags: ["shot"]
      });
    }

    const goal = Math.random() < clamp(getGoalProbability(shooter, goalkeeper, possessionType, coaching) + energyMod + hotMod, 0.1, 0.6);
    if (goal) {
      state.hotHand[shooter.id] = (state.hotHand[shooter.id] || 0) + 1;
      state.hotHand[passer.id] = (state.hotHand[passer.id] || 0) + 1;
      const isHot = state.hotHand[shooter.id] >= 2;
      const hotSuffix = isHot ? " 🔥 (Em chamas!)" : "";
      return createEvent(state, {
        type: "goal",
        teamId,
        playerId: shooter.id,
        assistedBy: passer.id,
        value: 1,
        description: `${passer.name} acha ${shooter.name}, que bate firme no canto e marca!${hotSuffix}`,
        statDeltas: {
          [passer.id]: { passes: 1, keyPasses: 1, assists: 1 },
          [shooter.id]: { goals: 1, shots: 1, shotsOnTarget: 1 },
          [goalkeeper.id]: { goalsConceded: 1 }
        },
        tags: ["shot", possessionType === "counter" ? "transition" : "goal", ...(isHot ? ["hot_hand"] : [])]
      });
    }

    // Goalkeeper saves
    state.hotHand[shooter.id] = 0;
    state.hotHand[goalkeeper.id] = (state.hotHand[goalkeeper.id] || 0) + 1;
    return createEvent(state, {
      type: "save",
      teamId,
      playerId: goalkeeper.id,
      secondaryPlayerId: shooter.id,
      value: 0,
      description: `${shooter.name} bate no alvo e ${goalkeeper.name} faz grande defesa!`,
      statDeltas: {
        [passer.id]: { passes: 1, keyPasses: 1 },
        [shooter.id]: { shots: 1, shotsOnTarget: 1 },
        [goalkeeper.id]: { saves: 1 }
      },
      tags: ["shot", "save"]
    });
  }

  function applyEvent(state, event) {
    const applied = MatchEvents.applyEventToMatchState(state, event, FutsalMatchAdapter);
    if (["foul", "yellow_card", "red_card"].includes(applied.type)) {
      const defendingTeam = applied.teamId === "home" ? "away" : "home";
      state.teamFouls[defendingTeam] = (state.teamFouls[defendingTeam] || 0) + 1;
      if (applied.type === "yellow_card") state.cards[defendingTeam].yellow += 1;
      if (applied.type === "red_card") state.cards[defendingTeam].red += 1;
    }
    return applied;
  }

  function isMatchFinished(state) {
    return state.clock.tick >= state.clock.sequenceTarget;
  }

  function calculatePlayerEfficiency(stats) {
    return Math.round(
      (stats.goals || 0) * 5 +
      (stats.assists || 0) * 2.2 +
      (stats.shotsOnTarget || 0) * 0.8 +
      (stats.keyPasses || 0) * 0.5 +
      (stats.steals || 0) * 1.2 +
      (stats.blocks || 0) +
      (stats.saves || 0) * 1.4 -
      (stats.goalsConceded || 0) * 0.8 -
      (stats.turnovers || 0) -
      (stats.foulsCommitted || stats.fouls || 0) * 0.4 -
      (stats.yellowCards || 0) * 1.5 -
      (stats.redCards || 0) * 5
    );
  }

  function calculatePlayerRating(stats) {
    return Math.round(clamp(55 + calculatePlayerEfficiency(stats) * 2, 35, 99));
  }

  function normalizeFinalStats(state) {
    ["home", "away"].forEach((teamId) => {
      const rows = Object.values(state.playerStats).filter((row) => row.teamId === teamId);
      const active = rows.filter((row) => row.position !== "GOL");
      const keepers = rows.filter((row) => row.position === "GOL");
      active.forEach((row, index) => { row.minutes = index < 4 ? 34 : 12; });
      keepers.forEach((row, index) => { row.minutes = index === 0 ? 40 : 0; });
      rows.forEach((row) => {
        row.efficiency = calculatePlayerEfficiency(row);
        row.rating = calculatePlayerRating(row);
      });
    });
  }

  function getTeamSummary(state) {
    const rows = Object.values(state.playerStats || {});
    const byTeam = (teamId, key) => rows.filter((row) => row.teamId === teamId).reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
    return {
      goals: [state.score.home, state.score.away],
      shots: [byTeam("home", "shots"), byTeam("away", "shots")],
      shotsOnTarget: [byTeam("home", "shotsOnTarget"), byTeam("away", "shotsOnTarget")],
      fouls: [byTeam("home", "foulsCommitted"), byTeam("away", "foulsCommitted")],
      yellowCards: [byTeam("home", "yellowCards"), byTeam("away", "yellowCards")],
      saves: [byTeam("home", "saves"), byTeam("away", "saves")],
      turnovers: [byTeam("home", "turnovers"), byTeam("away", "turnovers")]
    };
  }

  function getDebugTargets() {
    return {
      goals: [1, 6],
      shots: [18, 45],
      shotsOnTarget: [6, 18],
      fouls: [4, 12],
      yellowCards: [0, 4],
      turnovers: [8, 25]
    };
  }

  const FutsalMatchAdapter = {
    getMatchStatsSchema,
    createInitialMatchState,
    simulateTick,
    applyEvent,
    isMatchFinished,
    calculatePlayerEfficiency,
    calculatePlayerRating,
    normalizeFinalStats,
    getTeamSummary,
    getDebugTargets,
    applySubstitution,
    substituteEntireLine,
    applyTimeout,
    getTurnoverRate,
    getShotCreationRate,
    getShotOnTargetRate,
    getGoalProbability,
    getFoulRate,
    getCardRate,
    pickShooter,
    pickPasser,
    pickDefender,
    pickGoalkeeper,
    pickBallWinner
  };

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    FutsalMatchAdapter
  };
})();
