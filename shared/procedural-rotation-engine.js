(function () {
  const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function average(rows, getter) {
    return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length);
  }

  function getPlayerScore(player, plan = "balanced") {
    const current = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || current;
    const defense = Number(player.defense) || 0;
    const tactical = Number(player.tactical) || 0;
    const physical = Number(player.physical) || 0;
    const injuryRisk = Number(player.injuryRisk) || 0;
    const age = Number(player.age) || 25;
    const developmentGap = Math.max(0, potential - current);
    const base = current * 0.68 + tactical * 0.1 + defense * 0.1 + physical * 0.06 + potential * 0.06;
    if (plan === "development") return base + developmentGap * 0.9 - Math.max(0, age - 25) * 0.35;
    if (plan === "short_rotation") return base + current * 0.12 - injuryRisk * 12;
    if (plan === "load_management") return base - injuryRisk * 24 - Math.max(0, age - 29) * 0.65;
    if (plan === "defense_first") return base + defense * 0.18 + physical * 0.08;
    return base - injuryRisk * 8;
  }

  function getPlanFromStrategy(strategy) {
    const map = {
      aggressive: "short_rotation",
      development: "development",
      conservative: "load_management",
      crisis_control: "defense_first",
      balanced: "balanced",
      lore_fit: "balanced"
    };
    return map[strategy] || "balanced";
  }

  function inferRotationPlan(team, strategy = "balanced") {
    if (strategy !== "lore_fit") return getPlanFromStrategy(strategy);
    const style = team.rosterStyle || "";
    const objective = `${team.objective || ""} ${team.lore?.objectiveKey || ""}`.toLowerCase();
    if (style.includes("prospect") || objective.includes("desenvolver")) return "development";
    if (style.includes("veteran")) return "load_management";
    if (style.includes("defense")) return "defense_first";
    if (team.ambition === "titulo" || objective.includes("campeao")) return "short_rotation";
    return "balanced";
  }

  function selectStarters(players, plan) {
    const used = new Set();
    const starters = [];
    POSITIONS.forEach((position) => {
      const selected = players
        .filter((player) => player.pos === position && !used.has(player.id))
        .sort((a, b) => getPlayerScore(b, plan) - getPlayerScore(a, plan))[0];
      if (selected) {
        used.add(selected.id);
        starters.push(selected);
      }
    });
    if (starters.length < 5) {
      players
        .filter((player) => !used.has(player.id))
        .sort((a, b) => getPlayerScore(b, plan) - getPlayerScore(a, plan))
        .slice(0, 5 - starters.length)
        .forEach((player) => {
          used.add(player.id);
          starters.push(player);
        });
    }
    return starters;
  }

  function getMinuteBands(plan) {
    const bands = {
      short_rotation: [34, 33, 32, 31, 30, 18, 14, 12, 6, 0, 0, 0],
      development: [29, 28, 27, 26, 25, 22, 20, 18, 14, 11, 6, 4],
      load_management: [28, 28, 27, 26, 25, 22, 20, 18, 14, 12, 0, 0],
      defense_first: [31, 30, 29, 29, 28, 20, 17, 14, 10, 0, 0, 0],
      balanced: [32, 31, 30, 29, 28, 20, 17, 14, 10, 4, 0, 0]
    }[plan] || [32, 31, 30, 29, 28, 20, 17, 14, 10, 4, 0, 0];
    return bands;
  }

  function normalizeMinutes(rows) {
    const total = rows.reduce((sum, row) => sum + row.minutes, 0);
    const adjustment = 240 / Math.max(1, total);
    return rows.map((row) => ({
      ...row,
      minutes: round(row.minutes * adjustment)
    }));
  }

  function buildRotation(team, options = {}) {
    const players = (team.roster?.players || []).slice();
    const plan = options.plan || inferRotationPlan(team, options.strategy || "balanced");
    const starters = selectStarters(players, plan);
    const starterIds = new Set(starters.map((player) => player.id));
    const bench = players
      .filter((player) => !starterIds.has(player.id))
      .sort((a, b) => getPlayerScore(b, plan) - getPlayerScore(a, plan));
    const ordered = [...starters, ...bench];
    const minutes = getMinuteBands(plan);
    const rows = normalizeMinutes(ordered.map((player, index) => ({
      playerId: player.id,
      name: player.name,
      pos: player.pos,
      age: player.age,
      currentAbility: player.currentAbility,
      potential: player.potential,
      developmentGap: Math.max(0, (player.potential || 0) - (player.currentAbility || 0)),
      injuryRisk: player.injuryRisk || 0,
      role: index < 5 ? "titular" : minutes[index] > 0 ? "rotacao" : "fora",
      minutes: minutes[index] || 0,
      score: round(getPlayerScore(player, plan))
    })));
    const active = rows.filter((row) => row.minutes > 0);
    const startersRows = rows.filter((row) => row.role === "titular");
    const benchRows = rows.filter((row) => row.role === "rotacao");
    const summary = {
      plan,
      activePlayers: active.length,
      starterAverage: round(average(startersRows, (row) => row.currentAbility)),
      benchAverage: round(average(benchRows, (row) => row.currentAbility)),
      weightedCurrent: round(average(active, (row) => row.currentAbility * row.minutes) / Math.max(1, average(active, (row) => row.minutes))),
      prospectMinutes: round(active.reduce((sum, row) => sum + (row.developmentGap >= 8 ? row.minutes : 0), 0)),
      highRiskMinutes: round(active.reduce((sum, row) => sum + (row.injuryRisk >= 0.18 ? row.minutes : 0), 0)),
      topFiveMinutes: round(rows.slice(0, 5).reduce((sum, row) => sum + row.minutes, 0)),
      benchMinutes: round(benchRows.reduce((sum, row) => sum + row.minutes, 0))
    };
    const effect = {
      ratingDelta: round(clamp((summary.weightedCurrent - (team.rating?.current || summary.weightedCurrent)) / 5, -1.8, 1.8)),
      volatilityDelta: round(clamp((summary.highRiskMinutes - 35) / 350 - (summary.activePlayers - 8) / 120, -0.12, 0.14), 3),
      developmentDelta: round(clamp((summary.prospectMinutes - 35) / 30, -0.8, 1.8)),
      fatigueDelta: round(clamp((summary.topFiveMinutes - 150) / 18, -2, 4))
    };
    return {
      teamId: team.id,
      teamName: team.name,
      plan,
      rows,
      summary,
      effect
    };
  }

  function getTeamEffectFromRotation(rotation) {
    return {
      ratingDelta: rotation?.effect?.ratingDelta || 0,
      volatilityDelta: rotation?.effect?.volatilityDelta || 0
    };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralRotationEngine: {
      buildRotation,
      inferRotationPlan,
      getPlanFromStrategy,
      getTeamEffectFromRotation
    },
    buildProceduralRotation: buildRotation
  };
})();
