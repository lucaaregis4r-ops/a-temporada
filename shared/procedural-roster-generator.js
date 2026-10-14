(function () {
  const DEFAULT_ROSTER_PLAN = [
    { position: "PG", strengthTier: "good", role: "starter" },
    { position: "SG", strengthTier: "good", role: "starter" },
    { position: "SF", strengthTier: "good", role: "starter" },
    { position: "PF", strengthTier: "good", role: "starter" },
    { position: "C", strengthTier: "good", role: "starter" },
    { position: "PG", strengthTier: "normal", role: "rotation" },
    { position: "SG", strengthTier: "normal", role: "rotation" },
    { position: "SF", strengthTier: "normal", role: "rotation" },
    { position: "PF", strengthTier: "normal", role: "rotation" },
    { position: "C", strengthTier: "normal", role: "rotation" },
    { position: "G", strengthTier: "prospect", role: "prospect" },
    { position: "F", strengthTier: "prospect", role: "prospect" },
    { position: "G", strengthTier: "normal", role: "rotation" },
    { position: "F", strengthTier: "normal", role: "rotation" },
    { position: "C", strengthTier: "prospect", role: "prospect" }
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function average(rows, getter) {
    return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length);
  }

  function resolveFlexiblePosition(rng, slot) {
    if (Array.isArray(slot.positions) && slot.positions.length) return rng.pick(slot.positions);
    if (slot.position === "G") return rng.pick(["PG", "SG"]);
    if (slot.position === "F") return rng.pick(["SF", "PF"]);
    return slot.position;
  }

  function getPlayerScore(player) {
    return (Number(player.currentAbility) || 0) * 0.72
      + (Number(player.potential) || 0) * 0.18
      + (Number(player.defense) || 0) * 0.05
      + (Number(player.tactical) || 0) * 0.05;
  }

  function getPositionCounts(players) {
    return players.reduce((counts, player) => {
      counts[player.pos] = (counts[player.pos] || 0) + 1;
      return counts;
    }, {});
  }

  function getPositionKeys(config) {
    return Object.keys(config?.positions || {}).length ? Object.keys(config.positions) : ["PG", "SG", "SF", "PF", "C"];
  }

  function getStrengthByPosition(players, config) {
    const positions = getPositionKeys(config);
    return Object.fromEntries(positions.map((position) => {
      const rows = players.filter((player) => player.pos === position);
      return [position, {
        count: rows.length,
        currentAbility: round(average(rows, (player) => player.currentAbility)),
        potential: round(average(rows, (player) => player.potential)),
        salary: round(rows.reduce((sum, player) => sum + (Number(player.salary) || 0), 0))
      }];
    }));
  }

  function getRosterNeeds(players, config) {
    const counts = getPositionCounts(players);
    const needs = [];
    const excesses = [];
    getPositionKeys(config).forEach((position) => {
      const count = counts[position] || 0;
      const minimum = position === "LIB" ? 1 : 2;
      const maximum = position === "LIB" || position === "GOL" ? 2 : position === "ALA" ? 6 : 4;
      if (count < minimum) needs.push(`${position}: falta profundidade`);
      if (count > maximum) excesses.push(`${position}: excesso de atletas`);
    });
    return { needs, excesses };
  }

  function getLikelyStarters(players, config) {
    const starters = [];
    (config?.starterPositions || getPositionKeys(config)).forEach((position) => {
      const usedIds = new Set(starters.map((starter) => starter.id));
      const player = players
        .filter((item) => item.pos === position && !usedIds.has(item.id))
        .sort((a, b) => getPlayerScore(b) - getPlayerScore(a))[0];
      if (player) starters.push({ ...player, rosterRole: "starter" });
    });
    return starters;
  }

  function getTopBench(players, starters) {
    const starterIds = new Set(starters.map((player) => player.id));
    return players
      .filter((player) => !starterIds.has(player.id))
      .sort((a, b) => getPlayerScore(b) - getPlayerScore(a))
      .slice(0, 5)
      .map((player) => ({ ...player, rosterRole: "rotation" }));
  }

  function getProspects(players) {
    return players
      .slice()
      .sort((a, b) => ((b.potential - b.currentAbility) - (a.potential - a.currentAbility)) || b.potential - a.potential)
      .slice(0, 4)
      .map((player) => ({ ...player, rosterRole: "prospect" }));
  }

  function getRosterWarnings(players, summary, config) {
    const warnings = [];
    const { needs, excesses } = getRosterNeeds(players, config);
    const highRiskCount = players.filter((player) => player.injuryRisk >= 0.18 || player.volatility >= 0.7).length;
    if (needs.length) warnings.push(`Carencias: ${needs.join("; ")}.`);
    if (excesses.length) warnings.push(`Excessos: ${excesses.join("; ")}.`);
    if (summary.averageAge >= 30) warnings.push("Elenco envelhecido: idade media acima de 30.");
    if (summary.averageAge <= 22.5) warnings.push("Elenco muito jovem: pode faltar prontidao competitiva.");
    if (summary.totalSalary > summary.budget) warnings.push(`Folha acima do orcamento em $${round(summary.totalSalary - summary.budget)}M.`);
    if (summary.averageCurrentAbility < 68) warnings.push("Habilidade atual baixa para competir imediatamente.");
    if (summary.averagePotential - summary.averageCurrentAbility < 4) warnings.push("Pouca margem de desenvolvimento no elenco.");
    if (highRiskCount >= 5) warnings.push("Risco coletivo alto: muitos atletas volateis ou com risco fisico.");
    return warnings;
  }

  function getSalaryPressureRange(profile = "balanced") {
    const text = String(profile || "balanced");
    if (text.includes("low_budget")) return [0.62, 0.9];
    if (text.includes("veteran") || text.includes("expensive")) return [0.9, 1.16];
    if (text.includes("prospect")) return [0.58, 0.88];
    return [0.72, 1.02];
  }

  function scaleSalariesToBudget(players, budget, rng, profile) {
    const total = players.reduce((sum, player) => sum + (Number(player.salary) || 0), 0);
    if (!total || !budget) return;
    const [minPressure, maxPressure] = getSalaryPressureRange(profile);
    const target = Number(budget) * rng.float(minPressure, Math.min(0.95, maxPressure));
    const factor = Math.min(0.96 * Number(budget) / total, target / total);
    players.forEach((player) => {
      player.salary = round(Math.max(0.04, (Number(player.salary) || 0.1) * factor), 2);
    });
  }

  function buildRosterPlan(config, rosterSize) {
    const basePlan = config.rosterPlan || DEFAULT_ROSTER_PLAN;
    if (basePlan.length >= rosterSize) return basePlan.slice(0, rosterSize);
    const positions = getPositionKeys(config);
    const extras = Array.from({ length: rosterSize - basePlan.length }, (_, index) => ({
      position: positions[index % Math.max(1, positions.length)] || "G",
      strengthTier: index % 3 === 2 ? "prospect" : "normal",
      role: index % 3 === 2 ? "prospect" : "rotation"
    }));
    return basePlan.concat(extras);
  }

  function clampRosterSize(size, sportId) {
    if (sportId === "basquete") return Math.max(12, Math.min(15, Math.round(Number(size) || 12)));
    return Math.max(8, Math.min(18, Math.round(Number(size) || 14)));
  }

  function generateProceduralRoster({ seed = "OLYMPICO-2026", sportId = "basquete", config, rosterSize = 12, budget = 78, profile = "balanced" } = {}) {
    const rngFactory = window.TemporadaTotal?.createSeededRng;
    const playerGenerator = window.TemporadaTotal?.ProceduralPlayerGenerator;
    if (!rngFactory || !playerGenerator || !config) {
      throw new Error("[procedural] Modulos de RNG, jogador ou config ausentes para gerar elenco.");
    }

    const resolvedRosterSize = clampRosterSize(rosterSize, sportId);
    const rng = rngFactory(`${seed}:roster:${profile}:${resolvedRosterSize}`);
    const plan = buildRosterPlan(config, resolvedRosterSize);
    const players = plan.map((slot, index) => {
      const position = resolveFlexiblePosition(rng, slot);
      const player = playerGenerator.generateProceduralPlayer({
        rng,
        sportId,
        config,
        position,
        strengthTier: slot.strengthTier,
        index
      });
      return {
        ...player,
        rosterRole: slot.role,
        rosterSlot: index + 1
      };
    });

    // Auto-balance positions to ensure no generated team has depth deficiencies
    const posKeys = getPositionKeys(config);
    posKeys.forEach((pos) => {
      const minRequired = pos === "LIB" ? 1 : 2;
      let currentCount = players.filter((p) => p.pos === pos).length;
      while (currentCount < minRequired) {
        const surplusPos = posKeys.find((sp) => players.filter((p) => p.pos === sp).length > (sp === "LIB" || sp === "GOL" ? 2 : sp === "ALA" ? 5 : 3));
        const candidate = surplusPos ? players.slice().reverse().find((p) => p.pos === surplusPos && p.rosterRole !== "starter") : null;
        if (candidate) {
          candidate.pos = pos;
          currentCount += 1;
        } else {
          break;
        }
      }
    });

    scaleSalariesToBudget(players, budget, rng, profile);

    const starters = getLikelyStarters(players, config);
    const rotation = getTopBench(players, starters);
    const prospects = getProspects(players);
    const totalSalary = round(players.reduce((sum, player) => sum + (Number(player.salary) || 0), 0));
    const summary = {
      rosterSize: players.length,
      rosterSizeSource: "seed_lore",
      budget,
      totalSalary,
      budgetLeft: round(budget - totalSalary),
      averageAge: round(average(players, (player) => player.age)),
      averageHeight: round(average(players, (player) => player.heightCm)),
      averageCurrentAbility: round(average(players, (player) => player.currentAbility)),
      averagePotential: round(average(players, (player) => player.potential)),
      averageDevelopmentGap: round(average(players, (player) => player.potential - player.currentAbility)),
      positionCounts: getPositionCounts(players),
      strengthByPosition: getStrengthByPosition(players, config),
      needs: getRosterNeeds(players, config).needs,
      excesses: getRosterNeeds(players, config).excesses
    };

    const warnings = getRosterWarnings(players, summary, config);
    return {
      seed,
      sportId,
      profile,
      rosterSize: players.length,
      players,
      starters,
      rotation,
      prospects,
      summary,
      warnings
    };
  }

  function generateProceduralBasketballRoster(seed = "OLYMPICO-2026", options = {}) {
    const config = window.TemporadaTotal?.BasketballGenerationConfig;
    if (!config) {
      console.warn("[procedural] BasketballGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralRoster({
      seed,
      sportId: "basquete",
      config,
      rosterSize: options.rosterSize || config.rosterSize || 12,
      budget: options.budget || 9.5,
      profile: options.profile || "balanced"
    });
  }

  function generateProceduralVolleyballRoster(seed = "VOLEI-2026", options = {}) {
    const config = window.TemporadaTotal?.VolleyballGenerationConfig;
    if (!config) {
      console.warn("[procedural] VolleyballGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralRoster({
      seed,
      sportId: "volei",
      config,
      rosterSize: options.rosterSize || config.rosterSize || 14,
      budget: options.budget || 8.5,
      profile: options.profile || "balanced"
    });
  }

  function generateProceduralFutsalRoster(seed = "FUTSAL-2026", options = {}) {
    const config = window.TemporadaTotal?.FutsalGenerationConfig;
    if (!config) {
      console.warn("[procedural] FutsalGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralRoster({
      seed,
      sportId: "futsal",
      config,
      rosterSize: options.rosterSize || config.rosterSize || 12,
      budget: options.budget || 2.8,
      profile: options.profile || "balanced"
    });
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralRosterGenerator: {
      generateProceduralRoster,
      generateProceduralBasketballRoster,
      generateProceduralVolleyballRoster,
      generateProceduralFutsalRoster
    },
    generateProceduralBasketballRoster,
    generateProceduralVolleyballRoster,
    generateProceduralFutsalRoster
  };
})();
