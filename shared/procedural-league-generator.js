(function () {
  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function average(rows, getter) {
    return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length);
  }

  function countBy(rows, getter) {
    return rows.reduce((counts, row) => {
      const key = getter(row) || "indefinido";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }

  function getLeagueTier(rank, total) {
    if (rank <= Math.max(2, Math.ceil(total * 0.18))) return "favorito";
    if (rank <= Math.ceil(total * 0.42)) return "playoffs";
    if (rank <= Math.ceil(total * 0.72)) return "meio";
    return "sobrevivencia";
  }

  function getCompetitiveBand(rating) {
    if (rating >= 79) return "titulo";
    if (rating >= 76.5) return "playoffs";
    if (rating >= 73.5) return "meio_tabela";
    return "parte_baixa";
  }

  function getBandAdjustment(rank, total) {
    if (rank <= Math.max(2, Math.ceil(total * 0.18))) return 1.6;
    if (rank <= Math.ceil(total * 0.42)) return 0.7;
    if (rank <= Math.ceil(total * 0.72)) return -0.3;
    return -1.7;
  }

  function getTierTargets(total) {
    return {
      low: Math.max(3, Math.round(total * 0.2)),
      good: Math.max(3, Math.round(total * 0.22))
    };
  }

  function ensureLeagueTierDiversity(teams) {
    const targets = getTierTargets(teams.length);
    const changes = [];
    const countTier = (tier) => teams.filter((team) => team.strengthTier === tier).length;
    const weakest = teams.slice().sort((a, b) => (a.rating?.overall || 0) - (b.rating?.overall || 0));
    const strongest = teams.slice().sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));

    while (countTier("low") < targets.low) {
      const candidate = weakest.find((team) => team.strengthTier !== "low" && !team.__leagueTierAdjusted);
      if (!candidate) break;
      const from = candidate.strengthTier || "indefinido";
      candidate.strengthTier = "low";
      candidate.__leagueTierAdjusted = true;
      changes.push({ teamId: candidate.id, from, to: "low", reason: "fill_low_tier" });
    }

    while (countTier("good") < targets.good) {
      const candidate = strongest.find((team) => team.strengthTier !== "good" && team.strengthTier !== "low" && !team.__leagueTierAdjusted);
      if (!candidate) break;
      const from = candidate.strengthTier || "indefinido";
      candidate.strengthTier = "good";
      candidate.__leagueTierAdjusted = true;
      changes.push({ teamId: candidate.id, from, to: "good", reason: "fill_good_tier" });
    }

    changes.forEach((change) => {
      const team = teams.find((candidate) => candidate.id === change.teamId);
      if (!team) return;
      team.leagueCompositionCalibration = {
        applied: true,
        from: change.from,
        to: change.to,
        reason: change.reason
      };
    });

    teams.forEach((team) => {
      delete team.__leagueTierAdjusted;
    });

    return { targets, changes };
  }

  function applyLeagueStrengthCalibration(sortedTeams) {
    const total = sortedTeams.length;
    sortedTeams.forEach((team, index) => {
      const rank = index + 1;
      const adjustment = getBandAdjustment(rank, total);
      const styleModifier = team.rosterStyle === "low_budget_fight"
        ? -0.4
        : team.rosterStyle === "veteran_win_now"
          ? 0.25
          : team.rosterStyle === "prospect_core"
            ? -0.15
            : 0;
      const finalAdjustment = round(adjustment + styleModifier);
      team.rating = {
        ...(team.rating || {}),
        overall: round((team.rating?.overall || 0) + finalAdjustment),
        current: round((team.rating?.current || 0) + finalAdjustment * 0.8),
        defense: round((team.rating?.defense || 0) + finalAdjustment * 0.45),
        shooting: round((team.rating?.shooting || 0) + finalAdjustment * 0.35)
      };
      team.leagueCalibration = {
        applied: true,
        rankBeforeAdjustment: rank,
        bandAdjustment: finalAdjustment
      };
      team.calibrationWarnings = window.TemporadaTotal?.validateClubSeedProfile?.(team, team.lore) || [];
    });
  }

  function cloneClubForLeague(club, slot, leagueSeed) {
    return {
      ...club,
      leagueSeed,
      leagueSlot: slot,
      leagueTier: "indefinido",
      competitiveBand: getCompetitiveBand(club.rating?.overall || 0),
      directRivalIds: []
    };
  }

  function assignRivals(teams) {
    teams.forEach((team) => {
      const sameCity = teams
        .filter((candidate) => candidate.id !== team.id && candidate.city === team.city)
        .sort((a, b) => Math.abs((a.rating?.overall || 0) - (team.rating?.overall || 0)) - Math.abs((b.rating?.overall || 0) - (team.rating?.overall || 0)));
      const closeStrength = teams
        .filter((candidate) => candidate.id !== team.id && candidate.city !== team.city)
        .sort((a, b) => Math.abs((a.rating?.overall || 0) - (team.rating?.overall || 0)) - Math.abs((b.rating?.overall || 0) - (team.rating?.overall || 0)));
      team.directRivalIds = [...sameCity, ...closeStrength].slice(0, 2).map((candidate) => candidate.id);
    });
  }

  function assignTournamentGroups(teams, groupCount = 8, groupSize = 5) {
    const groupNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, groupCount).split("");
    const sorted = teams.slice().sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));
    const groups = groupNames.map((name, index) => ({
      id: `group-${name.toLowerCase()}`,
      name: `Grupo ${name}`,
      index,
      teamIds: []
    }));
    sorted.forEach((team, index) => {
      const row = Math.floor(index / groupCount);
      const column = index % groupCount;
      const groupIndex = row % 2 === 0 ? column : groupCount - 1 - column;
      const group = groups[groupIndex];
      if (!group || group.teamIds.length >= groupSize) return;
      team.groupId = group.id;
      team.groupName = group.name;
      team.groupSeed = group.teamIds.length + 1;
      group.teamIds.push(team.id);
    });
    return groups;
  }

  function buildLeagueWarnings(teams, summary) {
    const warnings = [];
    const spread = summary.maxOverall - summary.minOverall;
    const tierTargets = getTierTargets(teams.length);
    if (spread < 5) warnings.push("league_strength_spread_too_flat");
    if ((summary.tierCounts.low || 0) < tierTargets.low) warnings.push("few_low_tier_teams");
    if ((summary.tierCounts.good || 0) < tierTargets.good) warnings.push("few_good_tier_teams");
    if (summary.averageSalaryPressure > 115) warnings.push("league_salary_pressure_too_high");
    return warnings;
  }

  function summarizeLeague(teams) {
    const initialSorted = teams.slice().sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));
    applyLeagueStrengthCalibration(initialSorted);
    const sorted = teams.slice().sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));
    const overallValues = teams.map((team) => team.rating?.overall || 0);
    const summary = {
      teamCount: teams.length,
      averageOverall: round(average(teams, (team) => team.rating?.overall)),
      minOverall: round(Math.min(...overallValues)),
      maxOverall: round(Math.max(...overallValues)),
      averageBudget: round(average(teams, (team) => team.budget)),
      averageSalaryPressure: round(average(teams, (team) => team.rating?.salaryPressure)),
      tierCounts: countBy(teams, (team) => team.strengthTier),
      styleCounts: countBy(teams, (team) => team.rosterStyle),
      leagueTierCounts: countBy(teams, (team) => team.leagueTier),
      favorites: sorted.slice(0, 4).map((team) => team.id),
      playoffBubble: sorted.slice(4, 10).map((team) => team.id),
      survivalFight: sorted.slice(-4).map((team) => team.id),
      warnings: []
    };
    summary.warnings = buildLeagueWarnings(teams, summary);
    return summary;
  }

  function generateProceduralLeague({ seed = "OLYMPICO-2026", sportId = "basquete", size = 40, userTeamIndex = 0 } = {}) {
    const clubGenerator = sportId === "volei"
      ? window.TemporadaTotal?.generateProceduralVolleyballClub
      : sportId === "futsal"
        ? window.TemporadaTotal?.generateProceduralFutsalClub
        : window.TemporadaTotal?.generateProceduralBasketballClub;
    if (!clubGenerator) {
      throw new Error("[procedural] Gerador de clubes ausente para criar liga.");
    }

    const leagueSeed = `${seed}:league:${sportId}:${size}`;
    const teams = Array.from({ length: size }, (_, index) => {
      const club = clubGenerator(`${leagueSeed}:team:${String(index + 1).padStart(2, "0")}`, {
        userControlled: false,
        calibrate: true
      });
      const leagueClub = cloneClubForLeague(club, index + 1, leagueSeed);
      leagueClub.userControlled = index === userTeamIndex;
      return leagueClub;
    });
    const compositionCalibration = ensureLeagueTierDiversity(teams);

    const sorted = teams.slice().sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));
    sorted.forEach((team, index) => {
      team.projectedRank = index + 1;
      team.leagueTier = getLeagueTier(index + 1, teams.length);
      team.competitiveBand = getCompetitiveBand(team.rating?.overall || 0);
    });
    assignRivals(teams);
    const groups = assignTournamentGroups(teams, 8, 5);

    const userTeam = teams[userTeamIndex] || teams[0];
    const league = {
      id: `league-${String(seed).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      seed,
      leagueSeed,
      sportId,
      size,
      userTeamId: userTeam?.id || null,
      teams,
      format: {
        type: "groups-knockout",
        groupCount: 8,
        groupSize: 5,
        groupLegs: 2,
        qualifiersPerGroup: 2,
        knockoutStages: ["Oitavas", "Quartas", "Semifinal", "Final"],
        knockoutLegs: 1
      },
      groups,
      standingsPreview: sorted,
      compositionCalibration,
      summary: summarizeLeague(teams)
    };
    league.diagnostics = window.TemporadaTotal?.analyzeProceduralLeague?.(league) || null;
    return league;
  }

  function generateProceduralBasketballLeague(seed = "OLYMPICO-2026", options = {}) {
    return generateProceduralLeague({
      seed,
      sportId: "basquete",
      size: options.size || 40,
      userTeamIndex: options.userTeamIndex || 0
    });
  }

  function generateProceduralVolleyballLeague(seed = "VOLEI-2026", options = {}) {
    return generateProceduralLeague({
      seed,
      sportId: "volei",
      size: options.size || 40,
      userTeamIndex: options.userTeamIndex || 0
    });
  }

  function generateProceduralFutsalLeague(seed = "FUTSAL-2026", options = {}) {
    return generateProceduralLeague({
      seed,
      sportId: "futsal",
      size: options.size || 40,
      userTeamIndex: options.userTeamIndex || 0
    });
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralLeagueGenerator: {
      generateProceduralLeague,
      generateProceduralBasketballLeague,
      generateProceduralVolleyballLeague,
      generateProceduralFutsalLeague
    },
    generateProceduralBasketballLeague,
    generateProceduralVolleyballLeague,
    generateProceduralFutsalLeague
  };
})();
