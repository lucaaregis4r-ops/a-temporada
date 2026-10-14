(function () {
  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function average(values) {
    return values.reduce((sum, value) => sum + (Number(value) || 0), 0) / Math.max(1, values.length);
  }

  function createInitialDecisionState(team) {
    const initial = team.lore?.initialTeamState || {};
    return {
      boardTrust: clamp(initial.boardTrust ?? 50, 0, 100),
      fanSupport: clamp(initial.fanSupport ?? 50, 0, 100),
      lockerRoom: clamp(initial.lockerRoom ?? 50, 0, 100),
      staffTrust: clamp(initial.staffTrust ?? 50, 0, 100),
      clubTraditionAlignment: clamp(initial.clubTraditionAlignment ?? 50, 0, 100),
      mediaRelationship: clamp(initial.mediaRelationship ?? 50, 0, 100),
      groupCohesion: clamp(initial.groupCohesion ?? 50, 0, 100),
      squadFatigue: clamp(initial.squadFatigue ?? 10, 0, 100),
      injuryRisk: clamp(initial.injuryRisk ?? 8, 0, 100),
      pressureLevel: clamp(initial.pressureLevel ?? 55, 0, 100),
      morale: clamp(initial.morale ?? 50, 0, 100),
      shortTermPerformance: 0,
      developmentMomentum: 0,
      financialStress: 0
    };
  }

  function getEffectTargets(key) {
    const normalized = String(key || "").toLowerCase();
    const map = {
      rel_diretoria: ["boardTrust"],
      diretoria: ["boardTrust"],
      confianca_diretoria: ["boardTrust"],
      rel_torcida: ["fanSupport"],
      torcida: ["fanSupport"],
      rel_elenco: ["lockerRoom", "groupCohesion"],
      elenco: ["lockerRoom"],
      rel_elenco_veteranos: ["lockerRoom"],
      vestiario: ["lockerRoom"],
      clima: ["lockerRoom"],
      coesao: ["groupCohesion"],
      rel_comissao: ["staffTrust"],
      comissao: ["staffTrust"],
      comissao_tecnica: ["staffTrust"],
      rel_midia: ["mediaRelationship"],
      rel_imprensa: ["mediaRelationship"],
      midia: ["mediaRelationship"],
      imprensa: ["mediaRelationship"],
      media_exposure: ["mediaRelationship", "pressureLevel"],
      fadiga: ["squadFatigue"],
      fadiga_mental: ["squadFatigue"],
      cansaco: ["squadFatigue"],
      risco_lesao: ["injuryRisk"],
      risco_crise: ["pressureLevel"],
      risco_erro: ["shortTermPerformance"],
      risco_cartoes: ["shortTermPerformance"],
      lesao: ["injuryRisk"],
      pressao: ["pressureLevel"],
      pressao_geral: ["pressureLevel"],
      pressao_tecnico: ["pressureLevel"],
      pressao_externa: ["pressureLevel"],
      moral: ["morale"],
      moral_jovens: ["morale", "developmentMomentum"],
      morale: ["morale"],
      desempenho_curto_prazo: ["shortTermPerformance"],
      desempenho_tatico: ["shortTermPerformance"],
      desempenho_futuro: ["developmentMomentum"],
      desempenho: ["shortTermPerformance"],
      desenvolvimento: ["developmentMomentum"],
      desenvolvimento_base: ["developmentMomentum"],
      base: ["developmentMomentum"],
      financeiro: ["financialStress"],
      financas: ["financialStress"],
      orcamento: ["financialStress"],
      budget_request: ["financialStress"],
      disciplina: ["lockerRoom", "pressureLevel"],
      tradicao: ["clubTraditionAlignment"],
      confianca: ["morale"],
      qualidade_elenco: ["shortTermPerformance"]
    };
    return map[normalized] || [];
  }

  function applyEffects(state, effects = {}, multiplier = 1) {
    Object.entries(effects || {}).forEach(([key, value]) => {
      const normalized = String(key || "").toLowerCase();
      const targets = getEffectTargets(key);
      targets.forEach((target) => {
        const scale = target === "groupCohesion" && normalized === "rel_elenco" ? 0.45 : 1;
        state[target] = clamp((Number(state[target]) || 0) + (Number(value) || 0) * multiplier * scale, target.includes("Performance") || target.includes("Momentum") || target.includes("Stress") ? -100 : 0, 100);
      });
    });
    return state;
  }

  function getOptionRisk(option) {
    const profile = option.branching?.optionMemory?.riskProfile || "";
    if (profile.includes("alto")) return 1.2;
    if (profile.includes("boa")) return 0.85;
    return 1;
  }

  function scoreEffectsForStrategy(effects = {}, strategy = "balanced") {
    const entries = Object.entries(effects);
    const weights = {
      balanced: { elenco: 0.75, coesao: 0.75, rel_elenco: 0.9, rel_comissao: 0.8, comissao_tecnica: 0.8, desempenho: 0.6, desempenho_curto_prazo: 0.65, fadiga: -0.55, risco_lesao: -0.55, rel_torcida: 0.35, rel_diretoria: 0.35 },
      aggressive: { desempenho: 1.15, desempenho_curto_prazo: 1.25, qualidade_elenco: 0.85, rel_torcida: 0.55, torcida: 0.5, rel_diretoria: 0.45, fadiga: -0.25, risco_lesao: -0.25 },
      development: { base: 1.2, desenvolvimento: 1.2, desenvolvimento_base: 1.2, desempenho_futuro: 1.05, moral_jovens: 0.9, rel_elenco: 0.75, elenco: 0.65, rel_comissao: 0.65, desempenho_curto_prazo: 0.25, fadiga: -0.35 },
      conservative: { fadiga: -1.15, fadiga_mental: -1, risco_lesao: -1.15, risco_crise: -0.8, rel_comissao: 0.8, comissao_tecnica: 0.8, rel_elenco: 0.55, desempenho_curto_prazo: 0.15 },
      crisis_control: { rel_diretoria: 0.95, diretoria: 0.85, rel_torcida: 0.85, torcida: 0.75, rel_elenco: 0.7, elenco: 0.65, pressao: -0.7, pressao_tecnico: -0.7, risco_crise: -0.9, desempenho_curto_prazo: 0.45 }
    }[strategy] || {};

    return entries.reduce((score, [key, value]) => {
      const amount = Number(value) || 0;
      const weight = weights[key] ?? 0.25;
      return score + amount * weight;
    }, 0);
  }

  function chooseOption(decision, strategy, rng) {
    const options = decision.options || [];
    if (!options.length) return null;
    return options
      .map((option) => ({
        option,
        score: scoreEffectsForStrategy(option.effects || {}, strategy) / getOptionRisk(option) + rng.float(-1.5, 1.5)
      }))
      .sort((a, b) => b.score - a.score)[0].option;
  }

  function pickBranchOutcome(option, rng) {
    const outcomes = option?.branching?.branchOutcomes || [];
    const total = outcomes.reduce((sum, outcome) => sum + (Number(outcome.probabilityWeight) || 0), 0);
    if (!total) return null;
    let roll = rng.float(0, total);
    for (const outcome of outcomes) {
      roll -= Number(outcome.probabilityWeight) || 0;
      if (roll <= 0) return outcome;
    }
    return outcomes[outcomes.length - 1] || null;
  }

  function shuffle(items, rng) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = rng.int(0, index);
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function getDecisionPoolForTeam(team, decisions = []) {
    const loreId = team.lore?.id;
    const exact = decisions.filter((decision) => decision.loreId === loreId);
    if (exact.length) return exact;
    const tags = new Set([...(team.lore?.decisionSummary?.tags || []), ...(team.lore?.traits || [])]);
    return decisions.filter((decision) => (decision.tags || []).some((tag) => tags.has(tag))).slice(0, 12);
  }

  function getSyntheticStrategyEffects(team, strategy) {
    const style = team.rosterStyle || "";
    const isProspect = style.includes("prospect");
    const isVeteran = style.includes("veteran");
    const isLow = team.strengthTier === "low";
    const effects = {
      balanced: {
        coesao: 5,
        moral: 3,
        desempenho: 1,
        fadiga: -2
      },
      aggressive: {
        desempenho_curto_prazo: 7,
        rel_torcida: 4,
        rel_diretoria: 3,
        fadiga: isVeteran ? 6 : 3,
        risco_lesao: isVeteran ? 4 : 2,
        pressao: 3
      },
      development: {
        desenvolvimento_base: isProspect ? 10 : 6,
        moral_jovens: 7,
        coesao: 3,
        desempenho_curto_prazo: -3,
        rel_torcida: team.ambition === "titulo" ? -4 : -1
      },
      conservative: {
        fadiga: isVeteran ? -10 : -6,
        risco_lesao: isVeteran ? -8 : -5,
        rel_comissao: 5,
        desempenho_curto_prazo: -2,
        rel_torcida: -2
      },
      crisis_control: {
        pressao: isLow ? -8 : -5,
        rel_diretoria: 5,
        rel_torcida: 4,
        coesao: 4,
        desempenho_curto_prazo: 2,
        orcamento: -2
      }
    }[strategy] || {};
    return effects;
  }

  function summarizeStateDelta(initialState, finalState) {
    return Object.fromEntries(Object.keys(initialState).map((key) => [key, round((Number(finalState[key]) || 0) - (Number(initialState[key]) || 0))]));
  }

  function convertDecisionStateToTeamEffect(initialState, finalState) {
    const delta = summarizeStateDelta(initialState, finalState);
    const positiveContext = average([
      delta.morale,
      delta.groupCohesion,
      delta.lockerRoom,
      delta.staffTrust,
      delta.shortTermPerformance * 1.2,
      delta.developmentMomentum * 0.35
    ]);
    const negativeContext = average([
      Math.max(0, delta.squadFatigue),
      Math.max(0, delta.injuryRisk),
      Math.max(0, delta.pressureLevel),
      Math.max(0, delta.financialStress * 0.5)
    ]);
    const ratingDelta = clamp(positiveContext / 7 - negativeContext / 18, -3.5, 3.5);
    const volatilityDelta = clamp(delta.pressureLevel / 180 + delta.squadFatigue / 220 - delta.groupCohesion / 260, -0.16, 0.18);
    return {
      ratingDelta: round(ratingDelta),
      volatilityDelta: round(volatilityDelta, 3),
      pressure: finalState.pressureLevel >= 82 ? "muito alta" : finalState.pressureLevel >= 64 ? "alta" : finalState.pressureLevel <= 35 ? "baixa" : "media"
    };
  }

  function simulateDecisionPackage(team, decisions = [], options = {}) {
    const rngFactory = window.TemporadaTotal?.createSeededRng;
    if (!rngFactory) throw new Error("[procedural] createSeededRng ausente para simular decisoes.");
    const strategy = options.strategy || "balanced";
    const decisionCount = options.decisionCount || 6;
    const rng = rngFactory(`${options.seed || team.id}:decision-engine:${strategy}`);
    const initialState = createInitialDecisionState(team);
    const finalState = { ...initialState };
    const pool = getDecisionPoolForTeam(team, decisions);
    const shuffled = shuffle(pool, rng);
    const chosen = shuffled.slice(0, decisionCount).map((decision) => {
      const option = chooseOption(decision, strategy, rng);
      const branchOutcome = pickBranchOutcome(option, rng);
      applyEffects(finalState, option?.effects || {}, 1);
      applyEffects(finalState, branchOutcome?.effects || {}, 0.75);
      return {
        decisionId: decision.decisionId,
        decisionType: decision.decisionType,
        title: decision.title,
        optionId: option?.optionId || "",
        optionLabel: option?.label || "",
        branchOutcome: branchOutcome?.outcome || "",
        immediateEffects: option?.effects || {},
        branchEffects: branchOutcome?.effects || {}
      };
    });
    if (!chosen.length) {
      const syntheticEffects = getSyntheticStrategyEffects(team, strategy);
      applyEffects(finalState, syntheticEffects, 1);
      chosen.push({
        decisionId: `synthetic_${strategy}`,
        decisionType: "synthetic_strategy",
        title: "Diretriz experimental da temporada",
        optionId: `synthetic_${strategy}_option`,
        optionLabel: strategy,
        branchOutcome: "preview",
        immediateEffects: syntheticEffects,
        branchEffects: {}
      });
    }
    const teamEffect = convertDecisionStateToTeamEffect(initialState, finalState);
    return {
      teamId: team.id,
      teamName: team.name,
      loreId: team.lore?.id || "",
      loreLabel: team.lore?.label || "",
      strategy,
      decisionsAvailable: pool.length,
      decisionsApplied: chosen.length,
      initialState,
      finalState,
      stateDelta: summarizeStateDelta(initialState, finalState),
      teamEffect,
      chosenDecisions: chosen
    };
  }

  function inferDecisionStrategy(team) {
    const objective = `${team.objective || ""} ${team.lore?.objective || ""} ${team.lore?.objectiveKey || ""}`.toLowerCase();
    const style = team.rosterStyle || "";
    const traits = (team.lore?.traits || []).join(" ");
    if (style.includes("prospect") || objective.includes("desenvolver") || traits.includes("base")) return "development";
    if (style.includes("veteran") || traits.includes("fadiga") || traits.includes("idade")) return "conservative";
    if (team.strengthTier === "low" || objective.includes("nao_cair") || objective.includes("rebaixamento")) return "crisis_control";
    if (team.ambition === "titulo" || objective.includes("titulo") || objective.includes("campeao")) return "aggressive";
    return "balanced";
  }

  function simulateLeagueDecisionPackages(league, decisions = [], options = {}) {
    const strategy = options.strategy || "balanced";
    const packages = (league.teams || []).map((team) => simulateDecisionPackage(team, decisions, {
      seed: `${league.seed}:${team.id}`,
      strategy: strategy === "lore_fit" ? inferDecisionStrategy(team) : strategy,
      decisionCount: options.decisionCount || 6
    }));
    return {
      seed: league.seed,
      strategy,
      packages,
      teamEffects: Object.fromEntries(packages.map((item) => [item.teamId, item.teamEffect]))
    };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralDecisionEngine: {
      createInitialDecisionState,
      applyEffects,
      convertDecisionStateToTeamEffect,
      inferDecisionStrategy,
      getSyntheticStrategyEffects,
      simulateDecisionPackage,
      simulateLeagueDecisionPackages
    },
    simulateProceduralDecisionPackage: simulateDecisionPackage,
    simulateProceduralLeagueDecisionPackages: simulateLeagueDecisionPackages
  };
})();
