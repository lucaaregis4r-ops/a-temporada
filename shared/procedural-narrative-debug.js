(function () {
  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function getObjectiveProfile(team, totalTeams) {
    const key = team.lore?.objectiveKey || "";
    const objective = `${team.objective || ""} ${team.lore?.objective || ""}`.toLowerCase();
    if (key.includes("ser_campeao") || team.ambition === "titulo" || objective.includes("titulo")) {
      return { label: "titulo", minRank: 1, maxRank: 4 };
    }
    if (key.includes("playoffs") || team.ambition === "playoffs" || objective.includes("playoff")) {
      return { label: "playoffs", minRank: 1, maxRank: Math.ceil(totalTeams * 0.5) };
    }
    if (key.includes("nao_cair") || objective.includes("rebaixamento") || objective.includes("nao cair")) {
      return { label: "sobrevivencia", minRank: 1, maxRank: totalTeams - 2 };
    }
    if (key.includes("desenvolver") || team.rosterStyle?.includes("prospect")) {
      return { label: "desenvolvimento", minRank: 1, maxRank: Math.ceil(totalTeams * 0.7) };
    }
    return { label: "meio_tabela", minRank: Math.max(4, Math.floor(totalTeams * 0.25)), maxRank: Math.ceil(totalTeams * 0.75) };
  }

  function countProspects(team) {
    return (team.roster?.players || []).filter((player) => (player.potential || 0) - (player.currentAbility || 0) >= 10).length;
  }

  function getDecisionLeverage(team) {
    const summary = team.lore?.decisionSummary || {};
    const decisionCount = summary.decisionCount || 0;
    const typeCount = (summary.decisionTypes || []).length;
    const tagCount = (summary.tags || []).length;
    const pressureBonus = ["alta", "muito alta"].includes(team.pressure) ? 8 : 0;
    const volatilityBonus = team.rosterStyle?.includes("unbalanced") || team.rosterStyle?.includes("prospect") ? 5 : 0;
    const score = Math.min(100, decisionCount * 2 + typeCount * 3 + tagCount * 0.8 + pressureBonus + volatilityBonus);
    return {
      score: round(score),
      label: score >= 58 ? "alta" : score >= 38 ? "media" : "baixa",
      decisionCount,
      typeCount,
      tagCount
    };
  }

  function buildTeamNarrativeWarnings({ team, row, objectiveProfile, decisionLeverage, sensitivity, totalTeams }) {
    const warnings = [];
    const projectedRank = team.projectedRank || totalTeams;
    const simulatedRank = row?.simulatedRank || totalTeams;
    const prospects = countProspects(team);
    const potentialGap = (team.rating?.potential || 0) - (team.rating?.current || 0);

    if (objectiveProfile.label === "titulo" && projectedRank > 6) warnings.push("title_objective_projection_too_low");
    if (objectiveProfile.label === "titulo" && simulatedRank > 8) warnings.push("title_objective_result_collapsed");
    if (objectiveProfile.label === "playoffs" && projectedRank > Math.ceil(totalTeams * 0.65)) warnings.push("playoff_objective_projection_too_low");
    if (objectiveProfile.label === "sobrevivencia" && projectedRank <= Math.ceil(totalTeams * 0.45)) warnings.push("survival_objective_too_easy");
    if (objectiveProfile.label === "desenvolvimento" && prospects < 3 && potentialGap < 5) warnings.push("development_lore_without_growth_base");
    if (team.strengthTier === "low" && simulatedRank <= 4) warnings.push("low_tier_overperforming_heavily");
    if (team.strengthTier === "good" && simulatedRank >= totalTeams - 3) warnings.push("good_tier_underperforming_heavily");
    if (decisionLeverage.score >= 55 && !sensitivity) warnings.push("decision_bank_not_connected_to_simulation");
    if (sensitivity && decisionLeverage.score >= 55 && sensitivity.rankSwing <= 1 && sensitivity.winsSwing <= 1) {
      warnings.push("high_decision_lore_low_simulated_impact");
    }
    return warnings;
  }

  function getStandingByTeam(simulation) {
    return Object.fromEntries((simulation?.standings || []).map((row) => [row.teamId, row]));
  }

  function measureDecisionSensitivity(league, team, simulationIndex) {
    const simulator = window.TemporadaTotal?.simulateProceduralLeagueSeason;
    if (!simulator) return null;
    const positive = simulator(league, {
      simulationIndex,
      teamEffects: {
        [team.id]: { ratingDelta: 2, volatilityDelta: -0.05 }
      }
    });
    const negative = simulator(league, {
      simulationIndex,
      teamEffects: {
        [team.id]: { ratingDelta: -2, volatilityDelta: 0.08 }
      }
    });
    const positiveRow = positive.standings.find((row) => row.teamId === team.id);
    const negativeRow = negative.standings.find((row) => row.teamId === team.id);
    return {
      positiveRank: positiveRow?.simulatedRank || 0,
      negativeRank: negativeRow?.simulatedRank || 0,
      positiveWins: positiveRow?.wins || 0,
      negativeWins: negativeRow?.wins || 0,
      rankSwing: (negativeRow?.simulatedRank || 0) - (positiveRow?.simulatedRank || 0),
      winsSwing: (positiveRow?.wins || 0) - (negativeRow?.wins || 0)
    };
  }

  function analyzeProceduralNarrative(league, simulation, options = {}) {
    const totalTeams = (league.teams || []).length;
    const standingsByTeam = getStandingByTeam(simulation);
    const simulationIndex = options.simulationIndex || 1;
    const includeDecisionSensitivity = options.includeDecisionSensitivity !== false;
    const teams = (league.teams || []).map((team) => {
      const row = standingsByTeam[team.id] || null;
      const objectiveProfile = getObjectiveProfile(team, totalTeams);
      const decisionLeverage = getDecisionLeverage(team);
      const sensitivity = includeDecisionSensitivity ? measureDecisionSensitivity(league, team, simulationIndex) : null;
      const warnings = buildTeamNarrativeWarnings({
        team,
        row,
        objectiveProfile,
        decisionLeverage,
        sensitivity,
        totalTeams
      });
      return {
        teamId: team.id,
        name: team.name,
        loreLabel: team.lore?.label || "",
        objective: team.objective || "",
        objectiveProfile: objectiveProfile.label,
        projectedRank: team.projectedRank || 0,
        simulatedRank: row?.simulatedRank || 0,
        rankDelta: (row?.simulatedRank || 0) - (team.projectedRank || 0),
        strengthTier: team.strengthTier,
        leagueTier: team.leagueTier,
        rosterStyle: team.rosterStyle,
        decisionLeverage,
        decisionSensitivity: sensitivity,
        warnings
      };
    });

    const objectiveAligned = teams.filter((team) => {
      const profile = getObjectiveProfile((league.teams || []).find((candidate) => candidate.id === team.teamId) || {}, totalTeams);
      return team.simulatedRank >= profile.minRank && team.simulatedRank <= profile.maxRank;
    }).length;
    const highDecisionTeams = teams.filter((team) => team.decisionLeverage.score >= 55).length;
    const lowImpactHighDecisionTeams = teams.filter((team) => team.warnings.includes("high_decision_lore_low_simulated_impact")).length;
    const allWarnings = teams.flatMap((team) => team.warnings);

    return {
      seed: league.seed,
      objectiveAlignmentPct: round((objectiveAligned / Math.max(1, teams.length)) * 100),
      highDecisionTeams,
      lowImpactHighDecisionTeams,
      warnings: [...new Set(allWarnings)],
      teams
    };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralNarrativeDebug: {
      analyzeProceduralNarrative,
      getDecisionLeverage,
      measureDecisionSensitivity
    },
    analyzeProceduralNarrative
  };
})();
