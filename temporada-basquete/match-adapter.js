(function () {
  const MatchEvents = window.TemporadaTotal.MatchEvents;
  const clamp = window.TemporadaTotal?.clamp || ((value, min, max) => Math.min(max, Math.max(min, Number(value) || 0)));

  const statsSchema = [
    { key: "minutes", label: "MIN" },
    { key: "points", label: "PTS" },
    { key: "fgm", label: "FGM" },
    { key: "fga", label: "FGA" },
    { key: "threeMade", label: "3PM" },
    { key: "threeAttempted", label: "3PA" },
    { key: "ftm", label: "FTM" },
    { key: "fta", label: "FTA" },
    { key: "offensiveRebounds", label: "OREB" },
    { key: "defensiveRebounds", label: "DREB" },
    { key: "rebounds", label: "REB" },
    { key: "assists", label: "AST" },
    { key: "steals", label: "STL" },
    { key: "blocks", label: "BLK" },
    { key: "turnovers", label: "TO" },
    { key: "fouls", label: "PF" },
    { key: "efficiency", label: "EFF" },
    { key: "effPer36", label: "E36" },
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
    const total = list.reduce((sum, player, index) => sum + Math.max(0.01, weightFn(player, index)), 0) || 1;
    let roll = Math.random() * total;
    for (const [index, player] of list.entries()) {
      roll -= Math.max(0.01, weightFn(player, index));
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
    const build = (team) => ({
      active: (team.roster || []).slice(0, 5).map((player) => player.id),
      bench: (team.roster || []).slice(5).map((player) => player.id)
    });
    state.lineups = { home: build(homeTeam), away: build(awayTeam) };
    state.substitutions = [];
    return state.lineups;
  }

  function getTeamRoster(team, state) {
    const teamId = team.id === state.homeTeam?.id ? "home" : "away";
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    const activeIds = new Set(lineup.active || []);
    const active = (team.roster || []).filter((player) => activeIds.has(player.id));
    return active.length ? active : (team.roster || []).slice(0, 5);
  }

  function getOnCourtRatings(team, state, coaching = {}) {
    const active = getTeamRoster(team, state);
    if (!active.length) {
      return {
        offense: team.offense || 75,
        defense: team.defense || 75,
        rebound: team.rebound || 75,
        rating: team.rating || 75,
        avgEnergy: 100
      };
    }
    let totalOff = 0;
    let totalDef = 0;
    let totalReb = 0;
    let totalEnergy = 0;

    for (const p of active) {
      const energy = state.playerEnergy?.[p.id] ?? 100;
      totalEnergy += energy;
      const energyMult = energy >= 80 ? 1.0 : energy >= 60 ? 0.95 : energy >= 40 ? 0.88 : 0.78;
      const pOff = getNumber(p, ["shooting", "finishing", "threepoint", "offense"], team.offense || 75);
      const pDef = getNumber(p, ["defense", "marking", "steal", "block"], team.defense || 75);
      const pReb = getNumber(p, ["rebound", "physical", "height"], 75);
      totalOff += pOff * energyMult;
      totalDef += pDef * energyMult;
      totalReb += pReb * energyMult;
    }

    const n = active.length;
    const avgEnergy = totalEnergy / n;
    const baseOff = totalOff / n + (coaching.shot || 0) * 100 + (coaching.onCourtBonus || 0) * 100;
    const baseDef = totalDef / n + (coaching.defense || 0) * 100;
    const baseReb = totalReb / n;
    const rating = Math.round((baseOff + baseDef) / 2);

    return {
      offense: clamp(baseOff, 50, 110),
      defense: clamp(baseDef, 50, 110),
      rebound: clamp(baseReb, 50, 110),
      rating: clamp(rating, 50, 110),
      avgEnergy
    };
  }

  function tickPlayerEnergy(state, homeCoaching = {}, awayCoaching = {}) {
    const lineups = ensureLineups(state, state.homeTeam, state.awayTeam);
    ["home", "away"].forEach((teamId) => {
      const coaching = teamId === "home" ? homeCoaching : awayCoaching;
      const activeIds = new Set(lineups[teamId].active || []);
      const benchIds = new Set(lineups[teamId].bench || []);
      let fatigueMod = coaching.fatigueDrain || 1.0;
      if (coaching.possessionTarget > 1.05) fatigueMod *= 1.15;
      if (coaching.defensivePressure === "high") fatigueMod *= 1.12;

      for (const id of activeIds) {
        state.playerEnergy[id] = clamp((state.playerEnergy[id] ?? 100) - (0.32 * fatigueMod), 18, 100);
      }
      for (const id of benchIds) {
        state.playerEnergy[id] = clamp((state.playerEnergy[id] ?? 100) + 1.25, 18, 100);
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
      sport: "basquete",
      type: "substitution",
      teamId,
      minute: state.clock?.minute || 0,
      period: state.clock?.period || 1,
      description: `${inPlayer?.name || "Atleta"} entra no lugar de ${outPlayer?.name || "atleta"}.`,
      tags: ["substitution"]
    }));
    state.events = state.events.slice(0, state.maxEvents || 80);
    return true;
  }

  function substituteEntireLine(state, teamId) {
    const team = teamId === "away" ? state.awayTeam : state.homeTeam;
    const lineup = ensureLineups(state, state.homeTeam, state.awayTeam)[teamId];
    if (!lineup || !lineup.bench || !lineup.bench.length) return false;
    const currentActive = [...lineup.active];
    const currentBench = [...lineup.bench];
    const countToSwap = Math.min(currentActive.length, currentBench.length);
    if (countToSwap === 0) return false;
    const newActive = currentBench.slice(0, countToSwap);
    const newBench = [...currentBench.slice(countToSwap), ...currentActive.slice(0, countToSwap)];
    lineup.active = newActive;
    lineup.bench = newBench;
    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "basquete",
      type: "line_change",
      teamId,
      minute: state.clock?.minute || 0,
      period: state.clock?.period || 1,
      description: `🔄 ${team?.name || "Equipe"} troca o quinteto completo! Gás renovado em quadra.`,
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
      state.playerEnergy[id] = clamp((state.playerEnergy[id] || 100) + 12, 0, 100);
    }
    const oppTeamId = teamId === "home" ? "away" : "home";
    const oppLineup = ensureLineups(state, state.homeTeam, state.awayTeam)[oppTeamId];
    if (oppLineup) {
      for (const id of oppLineup.active) {
        state.hotHand[id] = 0;
      }
    }
    state.events.unshift(MatchEvents.createMatchEvent({
      sport: "basquete",
      type: "timeout",
      teamId,
      minute: state.clock?.minute || 0,
      period: state.clock?.period || 1,
      description: `⏱️ Tempo técnico! ${team?.name || "Equipe"} recupera o fôlego (+12%) e corta o ritmo do rival.`,
      tags: ["timeout"]
    }));
    state.events = state.events.slice(0, state.maxEvents || 80);
    return true;
  }

  function getTeamEdge(offense, defense) {
    const offR = offense.rating || offense.offense || 75;
    const defR = defense.rating || defense.defense || 75;
    return clamp((offR - defR) / 100, -0.15, 0.15);
  }

  function getTargetPossessions(homeTeam, awayTeam) {
    const pace = homeTeam.pace || awayTeam.pace || "balanced";
    const base = pace === "fast" ? 103 : pace === "slow" ? 87 : 94;
    const noise = Math.round((Math.random() - 0.5) * 8);
    return clamp((base + noise) * 2, 168, 216);
  }

  function getCoaching(state, teamId) {
    if (teamId !== "home") return {};
    return window.TemporadaTotal?.LiveCoaching?.getCoachingModifiers?.(state.coaching || {}) || {};
  }

  function getOffensiveCoaching(state, teamId) {
    if (teamId !== "home") return {};
    return window.TemporadaTotal?.LiveCoaching?.getOffensiveCoachingModifiers?.(state.coaching || {}) || getCoaching(state, teamId);
  }

  function getDefensiveCoaching(state, teamId) {
    if (teamId !== "home") return {};
    return window.TemporadaTotal?.LiveCoaching?.getDefensiveCoachingModifiers?.(state.coaching || {}) || getCoaching(state, teamId);
  }

  function getTurnoverRate(offense, defense, coaching = {}) {
    const edge = getTeamEdge(offense, defense);
    const defVal = defense.defense || defense.rating || 75;
    return clamp(0.145 - edge * 0.22 + (defVal - 75) * 0.0014 + (coaching.turnover || 0) + (coaching.turnoverForced || 0), 0.06, 0.26);
  }

  function getFoulRate(offense, defense, coaching = {}) {
    const edge = getTeamEdge(offense, defense);
    const defVal = defense.defense || defense.rating || 75;
    return clamp(0.18 + edge * 0.15 - (defVal - 75) * 0.001 + (coaching.foul || 0), 0.08, 0.32);
  }

  function getThreeAttemptRate(offense, coaching = {}) {
    return clamp((offense.threeRate ?? 0.36) + (coaching.threeRate || 0), 0.16, 0.62);
  }

  function getShotMakeProbability(offense, defense, shooter, isThree, coaching = {}, state) {
    const offVal = offense.offense || offense.rating || 75;
    const defVal = defense.defense || defense.rating || 75;
    const shotSkill = isThree
      ? getNumber(shooter, ["threepoint", "three", "shooting"], offVal)
      : getNumber(shooter, ["finishing", "shooting", "technique"], offVal);
    const base = isThree ? 0.35 : 0.51;
    const shooterEnergy = state?.playerEnergy?.[shooter.id] ?? 100;
    const energyMod = shooterEnergy < 45 ? -0.05 : shooterEnergy < 65 ? -0.025 : 0;
    const hotStreak = state?.hotHand?.[shooter.id] || 0;
    const hotHandMod = hotStreak >= 2 ? 0.075 : 0;
    const probability = base
      + (shotSkill - 75) * (isThree ? 0.0032 : 0.0038)
      + (offVal - defVal) * 0.0028
      + (coaching.shot || 0)
      - (coaching.defense || 0)
      + energyMod
      + hotHandMod;
    return clamp(probability, isThree ? 0.22 : 0.38, isThree ? 0.52 : 0.72);
  }

  function getOffensiveReboundRate(offense, defense) {
    const offR = offense.rebound || offense.rating || 75;
    const defR = defense.rebound || defense.rating || 75;
    return clamp(0.27 + (offR - defR) * 0.0025, 0.16, 0.38);
  }

  function getUsageWeight(player, index, coaching = {}) {
    const topUsage = index < 5 ? (coaching.usageTop || 0) : 0;
    const benchUsage = index >= 5 ? (coaching.benchUsage || 0) : 0;
    return Math.max(0.2, (player.usage || 1) * (1 + topUsage + benchUsage));
  }

  function pickShooter(team, coaching = {}, state) {
    const roster = getTeamRoster(team, state);
    return pickWeighted(roster, (player, index) => {
      let weight = getUsageWeight(player, index, coaching) * (getNumber(player, ["shooting", "finishing", "threepoint"], team.offense || 75) / 75);
      if (coaching.usageTop && (state?.hotHand?.[player.id] >= 2 || index === 0)) {
        weight *= 1.6;
      }
      return weight;
    });
  }

  function pickPasser(team, shooter, coaching = {}, state) {
    return pickWeighted(getTeamRoster(team, state).filter((player) => player.id !== shooter.id), (player, index) => getUsageWeight(player, index, coaching) * (getNumber(player, ["passing", "tactical"], 74) / 75));
  }

  function pickRebounder(team, state) {
    return pickWeighted(getTeamRoster(team, state), (player) => (player.usage || 1) * (getNumber(player, ["rebound", "physical", "height"], 74) / 75));
  }

  function createInitialMatchState(homeTeam, awayTeam) {
    const roster = [...homeTeam.roster, ...awayTeam.roster];
    const possessionsTarget = getTargetPossessions(homeTeam, awayTeam);
    const state = {
      sport: "basquete",
      status: "idle",
      speed: "normal",
      homeTeam,
      awayTeam,
      score: { home: 0, away: 0 },
      clock: { period: 1, minute: 0, totalMinutes: 0, tick: 0, possessionsTarget, basePossessionsTarget: possessionsTarget, label: "1Q 12:00" },
      coaching: window.TemporadaTotal?.LiveCoaching?.createDefaultCoachingState?.() || {},
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
    const progress = clamp(state.clock.tick / state.clock.possessionsTarget, 0, 1);
    const elapsed = progress * 48;
    const period = Math.min(4, Math.floor(elapsed / 12) + 1);
    const secondsLeft = Math.max(0, Math.round((12 - (elapsed % 12)) * 60));
    state.clock.period = period;
    state.clock.totalMinutes = elapsed;
    state.clock.minute = Math.floor(elapsed);
    state.clock.label = `${period}Q ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;
  }

  function createBaseEvent(state, type, offense, teamId, player, description, deltas, value = 0, tags = []) {
    return MatchEvents.createMatchEvent({
      sport: "basquete",
      type,
      teamId,
      playerId: player?.id || "",
      minute: state.clock.minute,
      period: state.clock.period,
      value,
      description,
      statDeltas: deltas,
      tags
    });
  }

  function simulateTick(state, homeTeam, awayTeam) {
    ensureLineups(state, homeTeam, awayTeam);
    const offenseIsHome = state.clock.tick % 2 === 0;
    const offense = offenseIsHome ? homeTeam : awayTeam;
    const defense = offenseIsHome ? awayTeam : homeTeam;
    const teamId = offenseIsHome ? "home" : "away";
    const defenseId = offenseIsHome ? "away" : "home";
    const offensiveCoaching = getOffensiveCoaching(state, teamId);
    const defensiveCoaching = getDefensiveCoaching(state, defenseId);
    const coaching = {
      ...offensiveCoaching,
      defense: defensiveCoaching.defense || 0,
      turnoverForced: defensiveCoaching.turnoverForced || 0,
      foul: (offensiveCoaching.foul || 0) + (defensiveCoaching.foul || 0)
    };
    if (!state.clock.basePossessionsTarget) {
      state.clock.basePossessionsTarget = state.clock.possessionsTarget;
    }
    state.clock.tick += 1;
    if (teamId === "home" && state.coaching?.pace) {
      const modifier = window.TemporadaTotal?.LiveCoaching?.getCoachingModifiers?.(state.coaching)?.possessionTarget || 1;
      state.clock.possessionsTarget = clamp(state.clock.basePossessionsTarget * modifier, 150, 232);
    }
    updateClock(state);

    // Apply player stamina drain and bench recovery
    tickPlayerEnergy(state, offensiveCoaching, defensiveCoaching);

    // Dynamic on-court ratings from active 5 players with fatigue & tactics factored in
    const offRatings = getOnCourtRatings(offense, state, offensiveCoaching);
    const defRatings = getOnCourtRatings(defense, state, defensiveCoaching);

    const ballHandler = pickShooter(offense, coaching, state);
    if (Math.random() < getTurnoverRate(offRatings, defRatings, coaching)) {
      const defender = pickWeighted(getTeamRoster(defense, state), (player) => (player.usage || 1) * (getNumber(player, ["defense", "steal"], defRatings.defense) / 75));
      state.hotHand[ballHandler.id] = 0;
      state.hotHand[defender.id] = (state.hotHand[defender.id] || 0) + 1;
      return createBaseEvent(state, "turnover", offense, teamId, ballHandler, `${defender.name} rouba a bola de ${ballHandler.name}.`, {
        [ballHandler.id]: { turnovers: 1 },
        [defender.id]: { steals: 1 }
      }, 0, ["turnover"]);
    }

    if (Math.random() < getFoulRate(offRatings, defRatings, coaching)) {
      const shooter = pickShooter(offense, coaching, state);
      const defender = pickWeighted(getTeamRoster(defense, state), (player) => player.usage || 1);
      const attempts = Math.random() < 0.18 ? 3 : 2;
      const ftSkill = clamp((getNumber(shooter, ["shooting", "finishing"], 75) - 55) / 45, 0.58, 0.9);
      const made = Array.from({ length: attempts }).reduce((sum) => sum + (Math.random() < ftSkill ? 1 : 0), 0);
      if (made > 0) {
        state.hotHand[shooter.id] = (state.hotHand[shooter.id] || 0) + 1;
      }
      return createBaseEvent(state, "free_throws", offense, teamId, shooter, `${shooter.name} vai para a linha e converte ${made}/${attempts}.`, {
        [shooter.id]: { points: made, ftm: made, fta: attempts },
        [defender.id]: { fouls: 1 }
      }, made, ["free_throw"]);
    }

    const shooter = pickShooter(offense, coaching, state);
    const passer = pickPasser(offense, shooter, coaching, state);
    const isThree = Math.random() < getThreeAttemptRate(offRatings, coaching);
    const make = Math.random() < getShotMakeProbability(offRatings, defRatings, shooter, isThree, coaching, state);
    const value = isThree ? 3 : 2;
    const assisted = make && passer && Math.random() < (isThree ? 0.72 : 0.58);

    if (make) {
      state.hotHand[shooter.id] = (state.hotHand[shooter.id] || 0) + 1;
      const isHot = state.hotHand[shooter.id] >= 2;
      const hotSuffix = isHot ? " 🔥 (Em chamas!)" : "";
      return MatchEvents.createMatchEvent({
        sport: "basquete",
        type: isThree ? "made_three" : "made_two",
        teamId,
        playerId: shooter.id,
        assistedBy: assisted ? passer.id : null,
        minute: state.clock.minute,
        period: state.clock.period,
        value,
        description: `${shooter.name} converte ${isThree ? "bola de 3" : "arremesso de 2"}${assisted ? ` com passe de ${passer.name}` : ""}.${hotSuffix}`,
        statDeltas: {
          [shooter.id]: { points: value, fgm: 1, fga: 1, ...(isThree ? { threeMade: 1, threeAttempted: 1 } : {}) },
          ...(assisted ? { [passer.id]: { assists: 1 } } : {})
        },
        tags: ["shot", ...(isHot ? ["hot_hand"] : [])]
      });
    }

    // Shot missed: reset hot hand streak
    state.hotHand[shooter.id] = 0;

    const reboundIsOffensive = Math.random() < getOffensiveReboundRate(offRatings, defRatings);
    const reboundTeam = reboundIsOffensive ? offense : defense;
    const reboundTeamId = reboundIsOffensive ? teamId : defenseId;
    const rebounder = pickRebounder(reboundTeam, state);
    const blocker = !isThree && Math.random() < clamp(((defRatings.defense - 65) * 0.003), 0.02, 0.12)
      ? pickWeighted(getTeamRoster(defense, state), (player) => getNumber(player, ["defense", "block"], defRatings.defense))
      : null;

    if (blocker) {
      state.hotHand[blocker.id] = (state.hotHand[blocker.id] || 0) + 1;
    }

    return MatchEvents.createMatchEvent({
      sport: "basquete",
      type: reboundIsOffensive ? "offensive_rebound" : "defensive_rebound",
      teamId: reboundTeamId,
      playerId: rebounder.id,
      secondaryPlayerId: shooter.id,
      minute: state.clock.minute,
      period: state.clock.period,
      value: 0,
      description: `${shooter.name} erra e ${rebounder.name} pega o rebote${reboundIsOffensive ? " ofensivo" : ""}.${blocker ? ` (${blocker.name} deu o toco!)` : ""}`,
      statDeltas: {
        [shooter.id]: { fga: 1, ...(isThree ? { threeAttempted: 1 } : {}) },
        [rebounder.id]: { rebounds: 1, ...(reboundIsOffensive ? { offensiveRebounds: 1 } : { defensiveRebounds: 1 }) },
        ...(blocker ? { [blocker.id]: { blocks: 1 } } : {})
      },
      tags: ["shot", "rebound", ...(blocker ? ["block"] : [])]
    });
  }

  function applyEvent(state, event) {
    return MatchEvents.applyEventToMatchState(state, event, BasketballMatchAdapter);
  }

  function isMatchFinished(state) {
    return state.clock.tick >= state.clock.possessionsTarget;
  }

  function calculatePlayerEfficiency(stats) {
    return Math.round(
      (stats.points || 0) +
      (stats.rebounds || 0) * 1.2 +
      (stats.assists || 0) * 1.5 +
      (stats.steals || 0) * 2 +
      (stats.blocks || 0) * 2 -
      ((stats.fga || 0) - (stats.fgm || 0)) -
      ((stats.fta || 0) - (stats.ftm || 0)) * 0.5 -
      (stats.turnovers || 0) * 1.4 -
      (stats.fouls || 0) * 0.5
    );
  }

  function calculatePlayerRating(stats) {
    const minutes = Math.max(1, Number(stats.minutes) || 0);
    const per36 = calculatePlayerEfficiency(stats) * 36 / minutes;
    return Math.round(clamp(55 + per36 * 1.6, 40, 99));
  }

  function normalizeFinalStats(state) {
    ["home", "away"].forEach((teamId) => {
      const rows = Object.values(state.playerStats).filter((row) => row.teamId === teamId);
      const starters = rows.slice(0, 5);
      const bench = rows.slice(5);
      const starterTotal = 162;
      const benchTotal = 78;
      starters.forEach((row) => { row.minutes = Number((starterTotal / Math.max(1, starters.length)).toFixed(1)); });
      bench.forEach((row) => { row.minutes = Number((benchTotal / Math.max(1, bench.length)).toFixed(1)); });
      rows.forEach((row) => {
        row.efficiency = calculatePlayerEfficiency(row);
        row.effPer36 = Number((row.efficiency * 36 / Math.max(1, row.minutes)).toFixed(1));
        row.rating = calculatePlayerRating(row);
      });
    });
  }

  function getTeamSummary(state) {
    const rows = Object.values(state.playerStats || {});
    const byTeam = (teamId, key) => rows.filter((row) => row.teamId === teamId).reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
    return {
      points: [state.score.home, state.score.away],
      possessions: [Math.ceil(state.clock.tick / 2), Math.floor(state.clock.tick / 2)],
      turnovers: [byTeam("home", "turnovers"), byTeam("away", "turnovers")],
      rebounds: [byTeam("home", "rebounds"), byTeam("away", "rebounds")],
      assists: [byTeam("home", "assists"), byTeam("away", "assists")],
      threeAttempted: [byTeam("home", "threeAttempted"), byTeam("away", "threeAttempted")],
      fta: [byTeam("home", "fta"), byTeam("away", "fta")]
    };
  }

  function getDebugTargets() {
    return {
      points: [75, 110],
      possessions: [84, 108],
      turnovers: [8, 20],
      threeAttempted: [18, 46],
      fta: [10, 32]
    };
  }

  const BasketballMatchAdapter = {
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
    getFoulRate,
    getThreeAttemptRate,
    getShotMakeProbability,
    pickShooter,
    pickPasser,
    pickRebounder
  };

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    BasketballMatchAdapter
  };
})();
