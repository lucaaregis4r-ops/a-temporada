(function () {
  function getRow(simulation, teamId) {
    return (simulation?.standings || []).find((row) => row.teamId === teamId) || null;
  }

  function getTeam(league, teamId) {
    return (league?.teams || []).find((team) => team.id === teamId) || null;
  }

  function getDecisionPackageForTeam(league, teamId, strategy) {
    const team = getTeam(league, teamId);
    if (!team || !window.TemporadaTotal?.simulateProceduralDecisionPackage) return null;
    const resolvedStrategy = strategy === "lore_fit" && window.TemporadaTotal?.ProceduralDecisionEngine?.inferDecisionStrategy
      ? window.TemporadaTotal.ProceduralDecisionEngine.inferDecisionStrategy(team)
      : strategy;
    return window.TemporadaTotal.simulateProceduralDecisionPackage(team, [], {
      seed: `${league.seed}:${team.id}:career-lab`,
      strategy: resolvedStrategy,
      decisionCount: 6
    });
  }

  function getAiTeamEffects(league, userTeamId) {
    if (!window.TemporadaTotal?.simulateProceduralDecisionPackage) return {};
    return Object.fromEntries((league.teams || [])
      .filter((team) => team.id !== userTeamId)
      .map((team) => {
        const strategy = window.TemporadaTotal?.ProceduralDecisionEngine?.inferDecisionStrategy?.(team) || "balanced";
        const decisionPackage = window.TemporadaTotal.simulateProceduralDecisionPackage(team, [], {
          seed: `${league.seed}:${team.id}:career-lab-ai`,
          strategy,
          decisionCount: 4
        });
        return [team.id, decisionPackage.teamEffect];
      }));
  }

  function scaleTeamEffect(effect, multiplier) {
    if (!effect) return null;
    return {
      ...effect,
      ratingDelta: Math.round((Number(effect.ratingDelta) || 0) * multiplier * 10) / 10,
      volatilityDelta: Math.round((Number(effect.volatilityDelta) || 0) * multiplier * 1000) / 1000
    };
  }

  function combineTeamEffects(...effects) {
    return effects.filter(Boolean).reduce((combined, effect) => ({
      ...combined,
      ratingDelta: Math.round(((Number(combined.ratingDelta) || 0) + (Number(effect.ratingDelta) || 0)) * 10) / 10,
      volatilityDelta: Math.round(((Number(combined.volatilityDelta) || 0) + (Number(effect.volatilityDelta) || 0)) * 1000) / 1000,
      pressure: effect.pressure || combined.pressure
    }), { ratingDelta: 0, volatilityDelta: 0 });
  }

  function simulateProceduralCareerLab(league, options = {}) {
    const simulator = window.TemporadaTotal?.simulateProceduralLeagueSeason;
    if (!league || !simulator) return null;
    const userTeamId = options.userTeamId || league.userTeamId;
    const userStrategy = options.userStrategy || "balanced";
    const simulationIndex = options.simulationIndex || 1;
    const userPackage = getDecisionPackageForTeam(league, userTeamId, userStrategy);
    const userTeam = getTeam(league, userTeamId);
    const rotation = userTeam && window.TemporadaTotal?.buildProceduralRotation
      ? window.TemporadaTotal.buildProceduralRotation(userTeam, { strategy: userStrategy })
      : null;
    const aiTeamEffects = options.includeAiDecisions === true ? getAiTeamEffects(league, userTeamId) : {};
    if (userPackage?.teamEffect) {
      userPackage.teamEffect = scaleTeamEffect(userPackage.teamEffect, options.userImpactMultiplier || 1.8);
      userPackage.teamEffect = combineTeamEffects(userPackage.teamEffect, rotation?.effect);
    }
    const userTeamEffects = {
      ...aiTeamEffects,
      ...(userPackage ? { [userTeamId]: userPackage.teamEffect } : {})
    };
    const baselineSimulation = simulator(league, { simulationIndex });
    const decisionSimulation = simulator(league, {
      simulationIndex,
      teamEffects: userTeamEffects
    });
    const baselineRow = getRow(baselineSimulation, userTeamId);
    const decisionRow = getRow(decisionSimulation, userTeamId);
    return {
      seed: league.seed,
      userTeamId,
      userTeamName: getTeam(league, userTeamId)?.name || "",
      userStrategy,
      userPackage,
      rotation,
      baselineSimulation,
      decisionSimulation,
      baselineRow,
      decisionRow,
      resultDelta: {
        rankSwing: (baselineRow?.simulatedRank || 0) - (decisionRow?.simulatedRank || 0),
        winsSwing: (decisionRow?.wins || 0) - (baselineRow?.wins || 0),
        pointDiffSwing: (decisionRow?.pointDiff || 0) - (baselineRow?.pointDiff || 0),
        championChanged: baselineSimulation.summary?.championId !== decisionSimulation.summary?.championId
      }
    };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralCareerLab: {
      simulateProceduralCareerLab
    },
    simulateProceduralCareerLab
  };
})();
