(function () {
  const MatchEvents = window.TemporadaTotal?.MatchEvents;
  const clamp = window.TemporadaTotal?.clamp || ((value, min, max) => Math.min(max, Math.max(min, Number(value) || 0)));

  const statsSchema = [
    { key: "points", label: "PTS" },
    { key: "attacks", label: "ATQ" },
    { key: "attackPoints", label: "PA" },
    { key: "attackErrors", label: "EA" },
    { key: "counterattacks", label: "C-ATQ" },
    { key: "aces", label: "ACE" },
    { key: "serveErrors", label: "ES" },
    { key: "receptions", label: "REC" },
    { key: "receptionErrors", label: "ER" },
    { key: "positiveReceptions", label: "R+" },
    { key: "blocks", label: "BLK" },
    { key: "digs", label: "DEF" },
    { key: "setAssists", label: "LEV" },
    { key: "errors", label: "ERR" },
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
      const nonLib = roster.filter((player) => player.pos !== "LIB");
      const libero = roster.find((player) => player.pos === "LIB");
      const active = nonLib.slice(0, 6).map((player) => player.id);
      if (libero) active.push(libero.id);
      return {
        active,
        bench: roster.filter((player) => !active.includes(player.id)).map((player) => player.id)
      };
    };
    state.lineups = { home: build(homeTeam), away: build(awayTeam) };
    state.substitutions = [];
    return state.lineups;
  }

  function tickPlayerEnergy(state, homeCoaching = {}, awayCoaching = {}) {
    const lineups = ensureLineups(state, state.homeTeam, state.awayTeam);
    ["home", "away"].forEach((teamId) => {
      const coaching = teamId === "home" ? homeCoaching : awayCoaching;
      const activeIds = new Set(lineups[teamId].active || []);
      const benchIds = new Set(lineups[teamId].bench || []);
      let fatigueMod = coaching.fatigueDrain || 1.0;
      if (coaching.defensivePressure === "high") fatigueMod *= 1.15;

      for (const id of activeIds) {
        state.playerEnergy[id] = clamp((state.playerEnergy[id] ?? 100) - (0.28 * fatigueMod), 18, 100);
      }
      for (const id of benchIds) {
        state.playerEnergy[id] = clamp((state.playerEnergy[id] ?? 100) + 1.25, 18, 100);
      }
    });
  }

  function getTeamId(team, state) {
    return team.id === state.awayTeam?.id ? "away" : "home";
  }

  function getActiveRoster(team, state) {
    const teamId = getTeamId(team, state);
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    const activeIds = new Set(lineup.active || []);
    const active = (team.roster || []).filter((player) => activeIds.has(player.id));
    return active.length ? active : (team.roster || []).slice(0, 7);
  }

  function applySubstitution(state, teamId, outId, inId) {
    const team = teamId === "away" ? state.awayTeam : state.homeTeam;
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    if (!lineup || !lineup.active.includes(outId) || !lineup.bench.includes(inId)) return false;
    const outPlayer = (team.roster || []).find((player) => player.id === outId);
    const inPlayer = (team.roster || []).find((player) => player.id === inId);
    if (outPlayer?.pos === "LIB" && inPlayer?.pos !== "LIB") return false;
    if (outPlayer?.pos !== "LIB" && inPlayer?.pos === "LIB") return false;
    lineup.active = lineup.active.map((id) => id === outId ? inId : id);
    lineup.bench = lineup.bench.map((id) => id === inId ? outId : id);
    state.substitutions = [
      { teamId, outId, inId, outName: outPlayer?.name || "", inName: inPlayer?.name || "", tick: state.clock?.rally || 0 },
      ...(state.substitutions || [])
    ].slice(0, 12);
    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "volei",
      type: "substitution",
      teamId,
      minute: state.clock?.minute || 0,
      set: state.clock?.set || 1,
      rally: state.clock?.rally || 0,
      description: `${inPlayer?.name || "Atleta"} entra na rotacao no lugar de ${outPlayer?.name || "atleta"}.`,
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
    const nonLibActive = lineup.active.filter((id) => {
      const p = roster.find((r) => r.id === id);
      return p && p.pos !== "LIB";
    });
    const nonLibBench = lineup.bench.filter((id) => {
      const p = roster.find((r) => r.id === id);
      return p && p.pos !== "LIB";
    });
    if (nonLibBench.length < 2) return false;
    const count = Math.min(nonLibActive.length, nonLibBench.length);
    const toEnter = nonLibBench.slice(0, count);
    const toLeave = nonLibActive.slice(0, count);

    lineup.active = lineup.active.map((id) => {
      const idx = toLeave.indexOf(id);
      return idx !== -1 ? toEnter[idx] : id;
    });
    lineup.bench = lineup.bench.map((id) => {
      const idx = toEnter.indexOf(id);
      return idx !== -1 ? toLeave[idx] : id;
    });

    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "volei",
      type: "line_change",
      teamId,
      minute: state.clock?.minute || 0,
      set: state.clock?.set || 1,
      rally: state.clock?.rally || 0,
      description: `🔄 ${team?.name || "Equipe"} gira a formação com novos titulares em quadra!`,
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
      sport: "volei",
      type: "timeout",
      teamId,
      minute: state.clock?.minute || 0,
      set: state.clock?.set || 1,
      rally: state.clock?.rally || 0,
      description: `⏱️ Tempo técnico! ${team?.name || "Equipe"} quebra a sequência de saque rival e renova as energias (+14%).`,
      tags: ["timeout"]
    }));
    state.events = state.events.slice(0, state.maxEvents || 80);
    return true;
  }

  function getTeamEdge(team, opponent) {
    return clamp(((team.rating || 75) - (opponent.rating || 75)) / 100, -0.1, 0.1);
  }

  function getCoaching(state) {
    return window.TemporadaTotal?.LiveCoaching?.getCoachingModifiers?.(state.coaching || {}) || {};
  }

  function getServeAceRate(server, servingTeam, receivingTeam, coaching = {}) {
    return clamp(0.055 + (getNumber(server, ["serve"], 75) - 75) * 0.001 + getTeamEdge(servingTeam, receivingTeam) * 0.08 + (coaching.turnoverForced || 0) * 0.8 + (coaching.shot || 0) * 0.5, 0.02, 0.14);
  }

  function getServeErrorRate(server, coaching = {}) {
    return clamp(0.12 + (getNumber(server, ["serve"], 75) - 75) * -0.0007 + (coaching.foul || 0) * 0.6 + (coaching.turnover || 0) * 0.5, 0.06, 0.24);
  }

  function getReceptionQuality(receiver, receivingTeam, servingTeam) {
    const skill = getNumber(receiver, ["reception", "defense"], 75);
    const edge = getTeamEdge(receivingTeam, servingTeam);
    const errorRate = clamp(0.075 - (skill - 75) * 0.001 + -edge * 0.04, 0.03, 0.12);
    const positiveRate = clamp(0.52 + (skill - 75) * 0.004 + edge * 0.35, 0.34, 0.68);
    const roll = Math.random();
    if (roll < errorRate) return "error";
    if (roll < errorRate + positiveRate) return "positive";
    return "poor";
  }

  function getAttackKillRate(attacker, attackingTeam, defendingTeam, quality, coaching = {}) {
    const skill = getNumber(attacker, ["attack", "finishing"], attackingTeam.rating || 75);
    const base = quality === "positive" ? 0.46 : 0.29;
    return clamp(base + (skill - 75) * 0.003 + getTeamEdge(attackingTeam, defendingTeam) * 0.35 + (coaching.shot || 0) - (coaching.defense || 0), quality === "positive" ? 0.3 : 0.16, quality === "positive" ? 0.64 : 0.44);
  }

  function getAttackErrorRate(attacker, quality, coaching = {}) {
    const skill = getNumber(attacker, ["attack"], 75);
    return clamp((quality === "positive" ? 0.11 : 0.15) - (skill - 75) * 0.001 + (coaching.turnover || 0) * 0.7 - Math.min(0, coaching.foul || 0) * 0.4, 0.04, 0.28);
  }

  function getBlockRate(blocker, defendingTeam, attackingTeam, coaching = {}) {
    return clamp(0.09 + (getNumber(blocker, ["block", "defense"], defendingTeam.rating || 75) - 75) * 0.001 + getTeamEdge(defendingTeam, attackingTeam) * 0.08 + (coaching.defense || 0) * 0.8 + (coaching.turnoverForced || 0) * 0.4, 0.04, 0.18);
  }

  function pickServer(team, state) {
    const roster = getActiveRoster(team, state).filter((player) => player.pos !== "LIB");
    const cursorKey = team.id === state.homeTeam.id ? "home" : "away";
    const index = state.rotation[cursorKey] % Math.max(1, roster.length);
    return roster[index] || roster[0];
  }

  function pickReceiver(team, state) {
    return pickWeighted(getActiveRoster(team, state).filter((player) => ["LIB", "PON"].includes(player.pos)), (player) => getNumber(player, ["reception", "defense"], 75));
  }

  function pickSetter(team, state) {
    return pickWeighted(getActiveRoster(team, state).filter((player) => player.pos === "LEV"), (player) => getNumber(player, ["setting", "passing"], 75));
  }

  function pickAttacker(team, quality, state) {
    return pickWeighted(getActiveRoster(team, state).filter((player) => player.pos !== "LIB"), (player) => {
      const wingBonus = quality === "poor" && ["PON", "OPO"].includes(player.pos) ? 1.25 : 1;
      return (player.usage || 1) * wingBonus * getNumber(player, ["attack"], 75);
    });
  }

  function pickBlocker(team, state) {
    return pickWeighted(getActiveRoster(team, state).filter((player) => player.pos !== "LIB"), (player) => getNumber(player, ["block", "defense"], 75));
  }

  function pickDefender(team, state) {
    return pickWeighted(getActiveRoster(team, state), (player) => getNumber(player, ["defense", "reception"], 75));
  }

  function createInitialMatchState(homeTeam, awayTeam) {
    const roster = [...homeTeam.roster, ...awayTeam.roster];
    const state = {
      sport: "volei",
      status: "idle",
      speed: "normal",
      homeTeam,
      awayTeam,
      score: { home: 0, away: 0 },
      setScore: { home: 0, away: 0 },
      sets: { home: 0, away: 0 },
      coaching: window.TemporadaTotal?.LiveCoaching?.createDefaultCoachingState?.() || {},
      servingTeam: Math.random() < 0.5 ? "home" : "away",
      rotation: { home: 0, away: 0 },
      clock: { set: 1, rally: 0, totalMinutes: 0, minute: 0, label: "Set 1" },
      events: [],
      maxEvents: 140,
      completedSets: [],
      playerStats: MatchEvents.createEmptyPlayerStats(roster, statsSchema)
    };
    ensureLineups(state, homeTeam, awayTeam);
    return state;
  }

  function getMatchStatsSchema() {
    return statsSchema.slice();
  }

  function getSetTarget(state) {
    return state.sets.home === 2 && state.sets.away === 2 ? 15 : 25;
  }

  function isSetOver(state) {
    const target = getSetTarget(state);
    return (state.setScore.home >= target || state.setScore.away >= target) &&
      Math.abs(state.setScore.home - state.setScore.away) >= 2;
  }

  function pointEvent(state, type, winnerId, player, description, deltas, tags = []) {
    return MatchEvents.createMatchEvent({
      sport: "volei",
      type,
      teamId: winnerId,
      playerId: player?.id || "",
      minute: state.clock.minute,
      set: state.clock.set,
      rally: state.clock.rally,
      value: 1,
      description,
      statDeltas: deltas,
      tags
    });
  }

  function simulateTick(state, homeTeam, awayTeam) {
    ensureLineups(state, homeTeam, awayTeam);
    state.clock.rally += 1;
    state.clock.totalMinutes = Math.round(state.clock.rally * 0.42);
    state.clock.minute = state.clock.totalMinutes;
    state.clock.set = state.sets.home + state.sets.away + 1;
    state.clock.label = `Set ${state.clock.set}`;

    const servingId = state.servingTeam || "home";
    const receivingId = servingId === "home" ? "away" : "home";
    const servingTeam = servingId === "home" ? homeTeam : awayTeam;
    const receivingTeam = receivingId === "home" ? homeTeam : awayTeam;
    const baseCoaching = getCoaching(state);
    const servingCoaching = servingId === "home" ? baseCoaching : { defense: baseCoaching.defense || 0, turnoverForced: baseCoaching.turnoverForced || 0, foul: baseCoaching.foul || 0 };
    const receivingCoaching = receivingId === "home" ? baseCoaching : { defense: baseCoaching.defense || 0, turnoverForced: baseCoaching.turnoverForced || 0, foul: baseCoaching.foul || 0 };

    // Apply stamina fatigue drain
    tickPlayerEnergy(state, servingId === "home" ? servingCoaching : receivingCoaching, receivingId === "home" ? receivingCoaching : servingCoaching);

    const server = pickServer(servingTeam, state);
    const receiver = pickReceiver(receivingTeam, state) || receivingTeam.roster[0];

    const serverEnergy = state.playerEnergy?.[server.id] ?? 100;
    const serverEnergyMod = serverEnergy < 50 ? 0.04 : serverEnergy < 70 ? 0.015 : 0;
    const serverHotMod = (state.hotHand?.[server.id] || 0) >= 2 ? 0.03 : 0;

    if (Math.random() < clamp(getServeErrorRate(server, servingCoaching) + serverEnergyMod - serverHotMod, 0.05, 0.35)) {
      state.hotHand[server.id] = 0;
      return pointEvent(state, "serve_error", receivingId, server, `${server.name} forca o saque e erra.`, {
        [server.id]: { serveErrors: 1, errors: 1 }
      }, ["serve_error"]);
    }

    if (Math.random() < clamp(getServeAceRate(server, servingTeam, receivingTeam, servingCoaching) + serverHotMod, 0.02, 0.22)) {
      state.hotHand[server.id] = (state.hotHand[server.id] || 0) + 1;
      const isHot = state.hotHand[server.id] >= 2;
      const hotSuffix = isHot ? " 🔥 (Em chamas!)" : "";
      return pointEvent(state, "ace", servingId, server, `${server.name} encontra o espaco e faz ace fulminante!${hotSuffix}`, {
        [server.id]: { points: 1, aces: 1 },
        [receiver.id]: { receptions: 1, receptionErrors: 1, errors: 1 }
      }, ["serve", "ace", ...(isHot ? ["hot_hand"] : [])]);
    }

    const receptionQuality = getReceptionQuality(receiver, receivingTeam, servingTeam);
    if (receptionQuality === "error") {
      state.hotHand[server.id] = (state.hotHand[server.id] || 0) + 1;
      return pointEvent(state, "reception_error", servingId, server, `${server.name} quebra a recepcao de ${receiver.name}.`, {
        [server.id]: { points: 1, aces: 1 },
        [receiver.id]: { receptions: 1, receptionErrors: 1, errors: 1 }
      }, ["serve", "reception_error"]);
    }

    const setter = pickSetter(receivingTeam, state) || receivingTeam.roster[0];
    const attacker = pickAttacker(receivingTeam, receptionQuality, state) || receivingTeam.roster[0];
    const blocker = pickBlocker(servingTeam, state) || servingTeam.roster[0];
    const defender = pickDefender(servingTeam, state) || servingTeam.roster[0];
    const receptionDelta = receptionQuality === "positive" ? { receptions: 1, positiveReceptions: 1 } : { receptions: 1 };

    const attackerEnergy = state.playerEnergy?.[attacker.id] ?? 100;
    const attackerEnergyMod = attackerEnergy < 50 ? -0.06 : attackerEnergy < 70 ? -0.025 : 0;
    const attackerHotMod = (state.hotHand?.[attacker.id] || 0) >= 2 ? 0.075 : 0;

    const killRate = clamp(getAttackKillRate(attacker, receivingTeam, servingTeam, receptionQuality, receivingCoaching) + attackerEnergyMod + attackerHotMod, 0.15, 0.72);
    const blockRate = getBlockRate(blocker, servingTeam, receivingTeam, servingCoaching);
    const errorRate = getAttackErrorRate(attacker, receptionQuality, receivingCoaching);
    const roll = Math.random();

    if (roll < killRate) {
      state.hotHand[attacker.id] = (state.hotHand[attacker.id] || 0) + 1;
      const isHot = state.hotHand[attacker.id] >= 2;
      const hotSuffix = isHot ? " 🔥 (Em chamas!)" : "";
      return pointEvent(state, "attack_point", receivingId, attacker, `${setter.name} aciona ${attacker.name}, que vira a bola com autoridade!${hotSuffix}`, {
        [receiver.id]: receptionDelta,
        [setter.id]: { setAssists: 1 },
        [attacker.id]: { points: 1, attacks: 1, attackPoints: 1 }
      }, ["attack", ...(isHot ? ["hot_hand"] : [])]);
    }

    if (roll < killRate + blockRate) {
      state.hotHand[attacker.id] = 0;
      state.hotHand[blocker.id] = (state.hotHand[blocker.id] || 0) + 1;
      return pointEvent(state, "block", servingId, blocker, `${blocker.name} fecha a porta no bloqueio! Ponto para a defesa.`, {
        [receiver.id]: receptionDelta,
        [attacker.id]: { attacks: 1 },
        [blocker.id]: { points: 1, blocks: 1 }
      }, ["block"]);
    }

    if (roll < killRate + blockRate + errorRate) {
      state.hotHand[attacker.id] = 0;
      return pointEvent(state, "attack_error", servingId, attacker, `${attacker.name} tenta acelerar e manda para fora.`, {
        [receiver.id]: receptionDelta,
        [attacker.id]: { attacks: 1, attackErrors: 1, errors: 1 }
      }, ["attack_error"]);
    }

    const counterAttacker = pickAttacker(servingTeam, "poor", state) || servingTeam.roster[0];
    const counterSetter = pickSetter(servingTeam, state) || servingTeam.roster[0];
    const counterKill = Math.random() < clamp(0.31 + getTeamEdge(servingTeam, receivingTeam) * 0.25, 0.2, 0.42);
    if (counterKill) {
      state.hotHand[counterAttacker.id] = (state.hotHand[counterAttacker.id] || 0) + 1;
      return pointEvent(state, "counterattack", servingId, counterAttacker, `${defender.name} defende e ${counterAttacker.name} decide no contra-ataque.`, {
        [receiver.id]: receptionDelta,
        [attacker.id]: { attacks: 1 },
        [defender.id]: { digs: 1 },
        [counterSetter.id]: { setAssists: 1 },
        [counterAttacker.id]: { points: 1, attacks: 1, attackPoints: 1, counterattacks: 1 }
      }, ["transition"]);
    }

    return pointEvent(state, "dig_transition_error", receivingId, attacker, `${defender.name} defende, mas a transicao nao encaixa e ${receivingTeam.name} confirma o ponto.`, {
      [receiver.id]: receptionDelta,
      [setter.id]: { setAssists: 1 },
      [attacker.id]: { points: 1, attacks: 1, attackPoints: 1 },
      [defender.id]: { digs: 1 }
    }, ["rally"]);
  }

  function applyEvent(state, event) {
    const applied = MatchEvents.applyEventToMatchState(state, event, VolleyballMatchAdapter);
    if (applied.teamId === "home") state.setScore.home += 1;
    if (applied.teamId === "away") state.setScore.away += 1;
    state.servingTeam = applied.teamId;
    if (applied.teamId === "home") state.rotation.home += 1;
    if (applied.teamId === "away") state.rotation.away += 1;

    if (isSetOver(state)) {
      state.completedSets.push({ home: state.setScore.home, away: state.setScore.away });
      if (state.setScore.home > state.setScore.away) state.sets.home += 1;
      else state.sets.away += 1;
      state.setScore = { home: 0, away: 0 };
      state.servingTeam = state.completedSets.length % 2 ? "away" : "home";
      state.clock.label = isMatchFinished(state) ? "Fim de jogo" : `Set ${state.sets.home + state.sets.away + 1}`;
    }
    return applied;
  }

  function isMatchFinished(state) {
    return state.sets.home >= 3 || state.sets.away >= 3;
  }

  function calculatePlayerEfficiency(stats) {
    return Math.round(
      (stats.points || 0) +
      (stats.aces || 0) * 1.2 +
      (stats.blocks || 0) * 1.4 +
      (stats.counterattacks || 0) +
      (stats.digs || 0) * 0.45 +
      (stats.positiveReceptions || 0) * 0.35 +
      (stats.setAssists || 0) * 0.25 -
      (stats.errors || 0) * 1.2 -
      (stats.attackErrors || 0) * 0.4
    );
  }

  function calculatePlayerRating(stats) {
    return Math.round(clamp(55 + calculatePlayerEfficiency(stats) * 1.2, 40, 99));
  }

  function normalizeFinalStats(state) {
    Object.values(state.playerStats || {}).forEach((row) => {
      row.efficiency = calculatePlayerEfficiency(row);
      row.rating = calculatePlayerRating(row);
    });
  }

  function getTeamSummary(state) {
    const rows = Object.values(state.playerStats || {});
    const byTeam = (teamId, key) => rows.filter((row) => row.teamId === teamId).reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
    return {
      sets: [state.completedSets?.length || 0],
      pointsPerSet: (state.completedSets || []).map((set) => set.home + set.away),
      aces: [byTeam("home", "aces"), byTeam("away", "aces")],
      serveErrors: [byTeam("home", "serveErrors"), byTeam("away", "serveErrors")],
      receptionErrors: [byTeam("home", "receptionErrors"), byTeam("away", "receptionErrors")],
      attackPoints: [byTeam("home", "attackPoints"), byTeam("away", "attackPoints")],
      blocks: [byTeam("home", "blocks"), byTeam("away", "blocks")],
      errors: [byTeam("home", "errors"), byTeam("away", "errors")]
    };
  }

  function getDebugTargets() {
    return {
      sets: [3, 5],
      aces: [2, 12],
      serveErrors: [5, 22],
      receptionErrors: [2, 14],
      blocks: [3, 16]
    };
  }

  const VolleyballMatchAdapter = {
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
    getServeAceRate,
    getServeErrorRate,
    getReceptionQuality,
    getAttackKillRate,
    getAttackErrorRate,
    getBlockRate,
    pickServer,
    pickReceiver,
    pickSetter,
    pickAttacker,
    pickBlocker,
    pickDefender
  };

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    VolleyballMatchAdapter
  };
})();
