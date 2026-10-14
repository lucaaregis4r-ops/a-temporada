(function () {
  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function logistic(value) {
    return 1 / (1 + Math.exp(-value));
  }

  function createRoundRobinSchedule(teams) {
    const list = teams.slice();
    if (list.length % 2) list.push(null);
    const rounds = [];
    const size = list.length;
    const fixed = list[0];
    let rotating = list.slice(1);

    for (let round = 0; round < size - 1; round += 1) {
      const current = [fixed, ...rotating];
      const matches = [];
      for (let index = 0; index < size / 2; index += 1) {
        const a = current[index];
        const b = current[size - 1 - index];
        if (a && b) {
          const swap = round % 2 === 1;
          matches.push({
            homeId: swap ? b.id : a.id,
            awayId: swap ? a.id : b.id
          });
        }
      }
      rounds.push({ round: round + 1, matches });
      rotating = [rotating[rotating.length - 1], ...rotating.slice(0, -1)];
    }

    return rounds;
  }

  function getTeamMap(teams) {
    return Object.fromEntries(teams.map((team) => [team.id, team]));
  }

  function getTeamSimulationSalt(team) {
    return [
      team?.id,
      team?.name,
      team?.lore?.id,
      team?.objective,
      team?.rosterStyle,
      team?.strengthTier
    ].filter(Boolean).map((item) => String(item)).join(":");
  }

  function getStyleVolatility(team) {
    const style = team.rosterStyle || "";
    const effectDelta = Number(team.simulationVolatilityDelta) || 0;
    if (style.includes("unbalanced")) return clamp(1.25 + effectDelta, 0.7, 1.45);
    if (style.includes("prospect")) return clamp(1.2 + effectDelta, 0.7, 1.45);
    if (style.includes("veteran")) return clamp(0.92 + effectDelta, 0.7, 1.45);
    if (style.includes("defense")) return clamp(0.88 + effectDelta, 0.7, 1.45);
    return clamp(1 + effectDelta, 0.7, 1.45);
  }

  function applySimulationTeamEffect(team, effect = {}) {
    const ratingDelta = Number(effect.ratingDelta) || 0;
    const volatilityDelta = Number(effect.volatilityDelta) || 0;
    const pressure = effect.pressure || team.pressure;
    if (!ratingDelta && !volatilityDelta && pressure === team.pressure) return team;
    return {
      ...team,
      pressure,
      rating: {
        ...(team.rating || {}),
        overall: round((team.rating?.overall || 0) + ratingDelta),
        current: round((team.rating?.current || 0) + ratingDelta * 0.8),
        defense: round((team.rating?.defense || 0) + ratingDelta * 0.45),
        shooting: round((team.rating?.shooting || 0) + ratingDelta * 0.35)
      },
      simulationVolatilityDelta: volatilityDelta,
      simulationEffect: {
        ratingDelta,
        volatilityDelta,
        pressure
      }
    };
  }

  function getWinProbability(home, away) {
    const ratingGap = (Number(home.rating?.overall) || 75) - (Number(away.rating?.overall) || 75);
    const homeBonus = 1.2;
    const pressurePenalty = home.pressure === "muito alta" ? -0.25 : 0;
    return clamp(logistic((ratingGap + homeBonus + pressurePenalty) / 5.2), 0.18, 0.82);
  }

  function simulateMatch(home, away, rng) {
    const probability = getWinProbability(home, away);
    const homeVolatility = getStyleVolatility(home);
    const awayVolatility = getStyleVolatility(away);
    const upsetNoise = (rng.next() - 0.5) * 0.16 * ((homeVolatility + awayVolatility) / 2);
    const homeWins = rng.next() < clamp(probability + upsetNoise, 0.12, 0.88);
    const baseTotal = 172 + rng.int(0, 34);
    const strengthGap = (Number(home.rating?.overall) || 75) - (Number(away.rating?.overall) || 75);
    const winnerBoost = rng.int(3, 14);
    const marginBase = Math.abs(strengthGap) * 1.15 + winnerBoost + rng.int(0, 8);
    const margin = Math.max(1, Math.round(marginBase));
    const winnerScore = Math.round(baseTotal / 2 + margin / 2);
    const loserScore = Math.round(baseTotal / 2 - margin / 2);
    const homeScore = homeWins ? winnerScore : loserScore;
    const awayScore = homeWins ? loserScore : winnerScore;
    const favorite = probability >= 0.5 ? home : away;
    const underdogWon = (favorite.id === home.id && !homeWins) || (favorite.id === away.id && homeWins);

    return {
      homeId: home.id,
      awayId: away.id,
      homeScore,
      awayScore,
      winnerId: homeWins ? home.id : away.id,
      loserId: homeWins ? away.id : home.id,
      winProbabilityHome: round(probability, 3),
      ratingGap: round(strengthGap),
      margin,
      upset: Boolean(underdogWon && Math.abs(strengthGap) >= 2.5)
    };
  }

  function createStandingRow(team) {
    return {
      teamId: team.id,
      name: team.name,
      loreLabel: team.lore?.label || "",
      strengthTier: team.strengthTier,
      rosterStyle: team.rosterStyle,
      projectedRank: team.projectedRank,
      rating: team.rating?.overall || 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
      simulatedRank: 0
    };
  }

  function sortStandings(rows) {
    return rows.slice().sort((a, b) => (
      b.wins - a.wins ||
      b.pointDiff - a.pointDiff ||
      b.pointsFor - a.pointsFor ||
      b.rating - a.rating
    ));
  }

  function getSpearmanLike(standings) {
    const n = standings.length;
    const diffSquares = standings.reduce((sum, row) => sum + ((row.projectedRank || n) - (row.simulatedRank || n)) ** 2, 0);
    return round(1 - (6 * diffSquares) / Math.max(1, n * (n * n - 1)), 3);
  }

  function summarizeSimulation(league, standings, games) {
    const projectedTop4 = new Set((league.standingsPreview || []).slice(0, 4).map((team) => team.id));
    const simulatedTop4 = new Set(standings.slice(0, 4).map((row) => row.teamId));
    const top4Retention = [...projectedTop4].filter((id) => simulatedTop4.has(id)).length;
    const champion = standings[0];
    const championProjectedRank = champion?.projectedRank || 0;
    const upsets = games.filter((game) => game.upset).length;
    return {
      championId: champion?.teamId || "",
      championName: champion?.name || "",
      championProjectedRank,
      top4Retention,
      top4RetentionPct: round((top4Retention / 4) * 100),
      upsetRate: round((upsets / Math.max(1, games.length)) * 100),
      rankCorrelation: getSpearmanLike(standings),
      games: games.length,
      warnings: buildSimulationWarnings({ championProjectedRank, top4Retention, upsets, games, standings })
    };
  }

  function buildSimulationWarnings(summary) {
    const warnings = [];
    if (summary.championProjectedRank > 8) warnings.push("long_shot_champion");
    if (summary.top4Retention < 2) warnings.push("projected_favorites_underperforming");
    if ((summary.upsets / Math.max(1, summary.games.length)) > 0.34) warnings.push("upset_rate_too_high");
    if ((summary.upsets / Math.max(1, summary.games.length)) < 0.08) warnings.push("upset_rate_too_low");
    if (summary.standings?.[0]?.wins === summary.standings?.at(-1)?.wins) warnings.push("standings_too_flat");
    return warnings;
  }

  function simulateProceduralLeagueSeason(league, options = {}) {
    const rngFactory = window.TemporadaTotal?.createSeededRng;
    if (!rngFactory) throw new Error("[procedural] createSeededRng ausente para simular liga.");
    const simulationIndex = options.simulationIndex || 1;
    const baseTeams = league.teams || [];
    const teamEffects = options.teamEffects || {};
    const simulatedTeams = baseTeams.map((team) => applySimulationTeamEffect(team, teamEffects[team.id]));
    const teamMap = getTeamMap(simulatedTeams);
    const schedule = createRoundRobinSchedule(league.standingsPreview || league.teams || []);
    const rowsByTeam = Object.fromEntries(simulatedTeams.map((team) => [team.id, createStandingRow(team)]));
    const games = [];

    schedule.forEach((round) => {
      round.matches.forEach((match) => {
        const home = teamMap[match.homeId];
        const away = teamMap[match.awayId];
        if (!home || !away) return;
        const rng = rngFactory(`${league.seed}:season-sim:${simulationIndex}:round-${round.round}:${getTeamSimulationSalt(home)}:${getTeamSimulationSalt(away)}`);
        const result = simulateMatch(home, away, rng);
        games.push({ round: round.round, ...result });
        const homeRow = rowsByTeam[home.id];
        const awayRow = rowsByTeam[away.id];
        homeRow.pointsFor += result.homeScore;
        homeRow.pointsAgainst += result.awayScore;
        awayRow.pointsFor += result.awayScore;
        awayRow.pointsAgainst += result.homeScore;
        if (result.winnerId === home.id) {
          homeRow.wins += 1;
          awayRow.losses += 1;
        } else {
          awayRow.wins += 1;
          homeRow.losses += 1;
        }
      });
    });

    Object.values(rowsByTeam).forEach((row) => {
      row.pointDiff = row.pointsFor - row.pointsAgainst;
    });
    const standings = sortStandings(Object.values(rowsByTeam)).map((row, index) => ({
      ...row,
      simulatedRank: index + 1
    }));
    const summary = summarizeSimulation(league, standings, games);

    return {
      leagueId: league.id,
      seed: league.seed,
      schedule,
      games,
      standings,
      summary
    };
  }

  function simulateProceduralLeagueMany(seed, options = {}) {
    const leagueGenerator = window.TemporadaTotal?.generateProceduralBasketballLeague;
    if (!leagueGenerator) throw new Error("[procedural] Gerador de liga ausente.");
    const runs = options.runs || 50;
    const league = leagueGenerator(seed, { size: options.size || 16 });
    const simulations = Array.from({ length: runs }, (_, index) => simulateProceduralLeagueSeason(league, {
      simulationIndex: index + 1
    }));
    const championCounts = simulations.reduce((counts, sim) => {
      counts[sim.summary.championName] = (counts[sim.summary.championName] || 0) + 1;
      return counts;
    }, {});
    const avg = (getter) => round(simulations.reduce((sum, sim) => sum + (Number(getter(sim)) || 0), 0) / Math.max(1, simulations.length));
    return {
      seed,
      runs,
      league,
      simulations,
      aggregate: {
        averageTop4RetentionPct: avg((sim) => sim.summary.top4RetentionPct),
        averageUpsetRate: avg((sim) => sim.summary.upsetRate),
        averageRankCorrelation: avg((sim) => sim.summary.rankCorrelation),
        championCounts
      }
    };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralSeasonSimulator: {
      createRoundRobinSchedule,
      simulateProceduralLeagueSeason,
      simulateProceduralLeagueMany
    },
    simulateProceduralLeagueSeason,
    simulateProceduralLeagueMany
  };
})();
