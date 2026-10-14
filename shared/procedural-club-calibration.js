(function () {
  const DEFAULT_RULES = {
    version: "calibragem_seeds_v2",
    targetRanges: {
      strengthTier: {
        low: { overall: [70, 74], current: [70, 73] },
        normal: { overall: [74, 78], current: [73, 77] },
        good: { overall: [77, 81], current: [76, 80] },
        elite: { overall: [81, 85], current: [80, 84] }
      },
      rosterStyle: {
        veteran_win_now: { age: [28.5, 32.5], startersCurrent: [80, 84], gap: [2, 6], salaryPressure: [85, 110] },
        prospect_core: { age: [21.5, 25.5], startersCurrent: [74, 79], prospectsPotential: [84, 92], gap: [8, 14] },
        low_budget_fight: { overall: [70, 74], salaryPressure: [60, 95], budgetLeft: [0, 35] },
        unbalanced: { starterRotationGapMin: 7 },
        experimental: { age: [22, 27] },
        medical_risk: { age: [27, 32] }
      }
    },
    loreOverrides: {
      "lenda no banco": { rosterStyle: "veteran_win_now", age: [28.5, 32.5] },
      "estatua viva": { rosterStyle: "veteran_win_now", age: [29, 34] },
      "base de ouro": { rosterStyle: "prospect_core", age: [21.5, 25], gap: [9, 14] },
      "o laboratorio": { rosterStyle: "experimental", age: [22, 27] },
      "elenco remendado": { rosterStyle: "medical_risk", age: [27, 32] },
      "diretoria impaciente": { salaryPressure: [90, 130], pressure: "alta" },
      "maquina de marketing": { budget: [85, 150], salaryPressure: [85, 125] },
      "gigante adormecido": { budget: [75, 140], pressure: "muito alta" },
      "reino dos veteranos": { rosterStyle: "veteran_win_now", age: [28.5, 33] },
      "dinastia da base": { rosterStyle: "prospect_core", age: [21.5, 25.5], gap: [8, 14] },
      "fabrica de promessas": { rosterStyle: "prospect_core", age: [21.5, 25.5], gap: [8, 14] },
      "meninos contra homens": { rosterStyle: "prospect_core", age: [21, 24.5], gap: [9, 15] },
      "dinheiro novo": { rosterStyle: "expensive_unbalanced", budget: [90, 150], salaryPressure: [90, 130] }
    }
  };

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

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getRng(seed) {
    return window.TemporadaTotal?.createSeededRng?.(`${seed}:club-calibration`);
  }

  function metricSnapshot(club) {
    const roster = club.roster || {};
    const starters = roster.starters || [];
    const rotation = roster.rotation || [];
    const prospects = roster.prospects || [];
    return {
      overall: round(club.rating?.overall),
      current: round(club.rating?.current),
      potential: round(club.rating?.potential),
      avgAge: round(roster.summary?.averageAge),
      avgGap: round(roster.summary?.averageDevelopmentGap),
      salaryPressure: round(club.rating?.salaryPressure),
      budgetLeft: round(roster.summary?.budgetLeft),
      startersCurrent: round(average(starters, (player) => player.currentAbility)),
      rotationCurrent: round(average(rotation, (player) => player.currentAbility)),
      prospectsPotential: round(average(prospects, (player) => player.potential))
    };
  }

  function getLoreOverride(lore) {
    return DEFAULT_RULES.loreOverrides[normalize(lore?.label)] || null;
  }

  function inferCalibrationStyle(club, lore) {
    const override = getLoreOverride(lore);
    if (override?.rosterStyle) return override.rosterStyle;
    const text = normalize([
      lore?.label,
      lore?.category,
      lore?.description,
      lore?.rawObjective,
      lore?.objective,
      club.rosterStyle,
      club.ambition
    ].join(" "));

    if (text.includes("sobreviv") || text.includes("nao cair") || text.includes("financeir") || text.includes("rebaix")) return "low_budget_fight";
    if (text.includes("base") || text.includes("promessa") || text.includes("jovem") || text.includes("desenvolv")) return "prospect_core";
    if (text.includes("revolucao tatica") || text.includes("laboratorio")) return "experimental";
    if (text.includes("banco de luxo") || text.includes("estrelas e reservas") || text.includes("panelinha")) return "unbalanced";
    if (text.includes("veterano") || text.includes("ultima danca") || text.includes("last dance") || text.includes("estatua viva") || text.includes("lenda no banco") || text.includes("reino dos veteranos")) return "veteran_win_now";
    if (text.includes("rico") || text.includes("dinheiro novo") || text.includes("mal montado")) return "expensive_unbalanced";
    if (text.includes("crise") || text.includes("desequilibr")) return "unbalanced";
    if (club.rosterStyle === "veteran_win_now") return "balanced";
    return club.rosterStyle || "balanced";
  }

  function getLikelyStarters(players) {
    const isFutsal = players.some((p) => p.pos === "GOL" || p.pos === "FIX");
    const isVolley = players.some((p) => p.pos === "LEV" || p.pos === "OPP");
    const positions = isFutsal
      ? ["GOL", "FIX", "ALA", "ALA", "PIVO"]
      : isVolley
        ? ["LEV", "OPP", "PON", "PON", "CEN", "CEN", "LIB"]
        : ["PG", "SG", "SF", "PF", "C"];
    const usedIds = new Set();
    const starters = [];
    positions.forEach((position) => {
      const player = players
        .filter((p) => p.pos === position && !usedIds.has(p.id))
        .sort((a, b) => getPlayerScore(b) - getPlayerScore(a))[0];
      if (player) {
        usedIds.add(player.id);
        starters.push({ ...player, rosterRole: "starter" });
      }
    });
    return starters;
  }

  function getPlayerScore(player) {
    return (Number(player.currentAbility) || 0) * 0.72 + (Number(player.potential) || 0) * 0.18 + (Number(player.defense) || 0) * 0.05 + (Number(player.tactical) || 0) * 0.05;
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

  function getPositionCounts(players) {
    return players.reduce((counts, player) => {
      counts[player.pos] = (counts[player.pos] || 0) + 1;
      return counts;
    }, {});
  }

  function getStrengthByPosition(players) {
    return Object.fromEntries(["PG", "SG", "SF", "PF", "C"].map((position) => {
      const rows = players.filter((player) => player.pos === position);
      return [position, {
        count: rows.length,
        currentAbility: round(average(rows, (player) => player.currentAbility)),
        potential: round(average(rows, (player) => player.potential)),
        salary: round(rows.reduce((sum, player) => sum + (Number(player.salary) || 0), 0))
      }];
    }));
  }

  function getRosterNeeds(players) {
    const counts = getPositionCounts(players);
    const needs = [];
    const excesses = [];
    ["PG", "SG", "SF", "PF", "C"].forEach((position) => {
      const count = counts[position] || 0;
      if (count < 2) needs.push(`${position}: falta profundidade`);
      if (count > 3) excesses.push(`${position}: excesso de atletas`);
    });
    return { needs, excesses };
  }

  function buildRosterWarnings(players, summary) {
    const warnings = [];
    if (summary.totalSalary > summary.budget) warnings.push(`Folha acima do orcamento em $${round(summary.totalSalary - summary.budget)}M.`);
    if (summary.averageCurrentAbility < 68) warnings.push("Habilidade atual baixa para competir imediatamente.");
    if (summary.averageAge >= 30) warnings.push("Elenco envelhecido: idade media acima de 30.");
    if (summary.averageAge <= 22.5) warnings.push("Elenco muito jovem: pode faltar prontidao competitiva.");
    return warnings;
  }

  function rebuildRoster(roster, budget) {
    const players = (roster.players || []).map((player) => ({ ...player }));
    const starters = getLikelyStarters(players);
    const rotation = getTopBench(players, starters);
    const prospects = getProspects(players);
    const totalSalary = round(players.reduce((sum, player) => sum + (Number(player.salary) || 0), 0));
    const needs = getRosterNeeds(players);
    const summary = {
      rosterSize: players.length,
      rosterSizeSource: roster.summary?.rosterSizeSource || "seed_lore",
      rosterSizeReason: roster.summary?.rosterSizeReason || "padrao",
      budget,
      totalSalary,
      budgetLeft: round(budget - totalSalary),
      averageAge: round(average(players, (player) => player.age)),
      averageHeight: round(average(players, (player) => player.heightCm)),
      averageCurrentAbility: round(average(players, (player) => player.currentAbility)),
      averagePotential: round(average(players, (player) => player.potential)),
      averageDevelopmentGap: round(average(players, (player) => player.potential - player.currentAbility)),
      positionCounts: getPositionCounts(players),
      strengthByPosition: getStrengthByPosition(players),
      needs: needs.needs,
      excesses: needs.excesses
    };
    return {
      ...roster,
      players,
      starters,
      rotation,
      prospects,
      summary,
      warnings: buildRosterWarnings(players, summary)
    };
  }

  function rateClub(roster) {
    const players = roster.players || [];
    const current = average(players, (player) => player.currentAbility);
    const potential = average(players, (player) => player.potential);
    const defense = average(players, (player) => player.defense);
    const shooting = average(players, (player) => player.threePoint);
    const age = average(players, (player) => player.age);
    const salaryPressure = roster.summary.totalSalary / Math.max(1, roster.summary.budget);
    const rating = current * 0.58 + potential * 0.16 + defense * 0.1 + shooting * 0.08 + (100 - Math.abs(26 - age) * 3) * 0.08;
    return {
      overall: round(rating),
      current: round(current),
      potential: round(potential),
      defense: round(defense),
      shooting: round(shooting),
      averageAge: round(age),
      salaryPressure: round(salaryPressure * 100)
    };
  }

  function inferStrengths(club) {
    const rating = club.rating || {};
    const summary = club.roster?.summary || {};
    const strengths = [];
    const weaknesses = [];
    if (rating.shooting >= 74) strengths.push("arremesso acima da media");
    else weaknesses.push("espacamento inconsistente");
    if (rating.defense >= 74) strengths.push("base defensiva confiavel");
    else weaknesses.push("defesa vulneravel");
    if ((rating.potential || 0) - (rating.current || 0) >= 7) strengths.push("bom teto de desenvolvimento");
    else weaknesses.push("pouca margem de crescimento");
    if (rating.averageAge >= 29) strengths.push("experiencia");
    if (rating.averageAge >= 30) weaknesses.push("risco de envelhecimento");
    if (summary.budgetLeft >= 10) strengths.push("flexibilidade financeira");
    if (summary.budgetLeft < 0) weaknesses.push("folha acima do orcamento");
    return {
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4)
    };
  }

  function adjustCurrent(player, delta) {
    const nextCurrent = Math.round(clamp((player.currentAbility || 0) + delta, 45, 94));
    const applied = nextCurrent - (Number(player.currentAbility) || 0);
    player.currentAbility = nextCurrent;
    const allKeys = [
      "threePoint", "physical", "tactical", "technique", "defense",
      "finishing", "passing", "marking", "goalkeeping",
      "serve", "attack", "block", "reception", "setting"
    ];
    allKeys.forEach((key) => {
      if (player[key] != null) player[key] = Math.round(clamp((Number(player[key]) || 0) + applied * 0.72, 35, 97));
      if (player.attributes?.[key] != null) player.attributes[key] = player[key];
    });
    player.potential = Math.max(player.currentAbility, Math.round(clamp(player.potential, player.currentAbility, 99)));
  }

  function moveAverageCurrent(players, target, filter = () => true) {
    const rows = players.filter(filter);
    if (!rows.length) return;
    const delta = clamp(target - average(rows, (player) => player.currentAbility), -8, 8);
    rows.forEach((player) => adjustCurrent(player, delta));
  }

  function setAverageAge(players, range, filter = () => true) {
    const rows = players.filter(filter);
    if (!rows.length || !range) return;
    const avg = average(players, (player) => player.age);
    const target = avg < range[0] ? range[0] + 0.3 : avg > range[1] ? range[1] - 0.3 : avg;
    const delta = Math.round(clamp(target - avg, -5, 6));
    rows.forEach((player) => {
      player.age = Math.round(clamp((Number(player.age) || 24) + delta, 17, 36));
    });
  }

  function setDevelopmentGap(players, range, filter = () => true) {
    const rows = players.filter(filter);
    if (!rows.length || !range) return;
    const target = (range[0] + range[1]) / 2;
    rows.forEach((player) => {
      const current = Number(player.currentAbility) || 0;
      const gap = clamp(target + ((player.rosterSlot || 0) % 3) - 1, range[0], range[1]);
      player.potential = Math.round(clamp(current + gap, current, 99));
    });
  }

  function scaleSalariesToPressure(players, budget, range) {
    if (!range || !players.length) return;
    const total = players.reduce((sum, player) => sum + (Number(player.salary) || 0), 0);
    const currentPressure = total / Math.max(1, budget) * 100;
    if (currentPressure >= range[0] && currentPressure <= range[1]) return;
    const targetPressure = currentPressure > range[1] ? range[1] - 3 : range[0] + 3;
    const targetTotal = budget * targetPressure / 100;
    const factor = clamp(targetTotal / Math.max(0.1, total), 0.45, 1.35);
    players.forEach((player) => {
      player.salary = round(clamp((Number(player.salary) || 0.1) * factor, 0.04, 32), 2);
    });
  }

  function makeUnbalanced(players, strengthTier = "normal") {
    const starters = getLikelyStarters(players);
    const starterIds = new Set(starters.map((player) => player.id));
    const starterTarget = strengthTier === "low" ? 78 : strengthTier === "good" ? 83 : 81;
    const rotationTarget = strengthTier === "low" ? 68 : strengthTier === "good" ? 73 : 71;
    moveAverageCurrent(players, starterTarget, (player) => starterIds.has(player.id));
    moveAverageCurrent(players, rotationTarget, (player) => !starterIds.has(player.id));
  }

  function applyStyleCalibration(club, style, rng) {
    const players = club.roster?.players || [];
    const override = getLoreOverride(club.lore) || {};
    const styleRules = DEFAULT_RULES.targetRanges.rosterStyle[style] || {};

    if (style === "veteran_win_now") {
      setAverageAge(players, override.age || styleRules.age);
      moveAverageCurrent(players, 81, (player) => player.rosterRole === "starter");
      setDevelopmentGap(players, override.gap || styleRules.gap || [2, 6]);
      scaleSalariesToPressure(players, club.budget, override.salaryPressure || styleRules.salaryPressure);
    }

    if (style === "prospect_core") {
      setAverageAge(players, override.age || styleRules.age);
      moveAverageCurrent(players, 76, (player) => player.rosterRole === "starter");
      setDevelopmentGap(players, override.gap || styleRules.gap || [8, 14]);
      players
        .slice()
        .sort((a, b) => ((b.potential - b.currentAbility) - (a.potential - a.currentAbility)))
        .slice(0, 4)
        .forEach((player) => {
          player.age = Math.round(clamp(player.age - 2, 17, 24));
          player.potential = Math.round(clamp(Math.max(player.potential, player.currentAbility + rng.int(9, 15), 84), player.currentAbility, 99));
        });
    }

    if (style === "low_budget_fight") {
      moveAverageCurrent(players, 71.5);
      setDevelopmentGap(players, [6, 11]);
      scaleSalariesToPressure(players, club.budget, styleRules.salaryPressure || [60, 95]);
    }

    if (style === "unbalanced" || style === "expensive_unbalanced") {
      makeUnbalanced(players, club.strengthTier);
      scaleSalariesToPressure(players, club.budget, style === "expensive_unbalanced" ? [90, 115] : [75, 105]);
    }

    if (style === "experimental") {
      setAverageAge(players, override.age || styleRules.age);
      players.forEach((player, index) => adjustCurrent(player, index % 2 === 0 ? 2 : -2));
    }

    if (style === "medical_risk") {
      setAverageAge(players, override.age || styleRules.age);
      players.forEach((player, index) => {
        if (index < 6) player.injuryRisk = clamp((Number(player.injuryRisk) || 0.1) + 0.08, 0.03, 0.35);
      });
    }
  }

  function applyTierCalibration(club, rng) {
    const players = club.roster?.players || [];
    const tierRules = DEFAULT_RULES.targetRanges.strengthTier[club.strengthTier] || DEFAULT_RULES.targetRanges.strengthTier.normal;
    const isCinderella = club.strengthTier === "low" && rng.chance?.(0.08);
    const targetCurrent = isCinderella ? Math.min(74, tierRules.current[1] + 1) : (tierRules.current[0] + tierRules.current[1]) / 2;
    if (!isCinderella) moveAverageCurrent(players, targetCurrent);
    club.calibrationMeta = {
      ...(club.calibrationMeta || {}),
      cinderellaSeed: Boolean(isCinderella)
    };
  }

  function applyBudgetOverrides(club) {
    const override = getLoreOverride(club.lore);
    if (override?.budget) {
      club.budget = round(clamp(club.budget, override.budget[0], override.budget[1]));
    }
    if (club.rosterStyle === "low_budget_fight") {
      club.budget = round(Math.min(club.budget, 58));
    }
  }

  function rebuildClub(club) {
    club.roster = rebuildRoster(club.roster || {}, club.budget);
    club.rating = rateClub(club.roster);
    const profile = inferStrengths(club);
    club.strengths = profile.strengths;
    club.weaknesses = profile.weaknesses;
    club.reputation = round((club.rating.overall || 0) * 0.7 + (club.budget || 0) * 0.3);
    return club;
  }

  function calibrateClubSeed(rawClub, lore = rawClub?.lore, seed = rawClub?.seed || rawClub?.id) {
    if (!rawClub) return rawClub;
    const rng = getRng(seed) || { chance: () => false, int: (min) => min };
    const club = clone(rawClub);
    const before = metricSnapshot(club);
    const style = inferCalibrationStyle(club, lore);
    club.rosterStyle = style;
    club.strengthTier = club.strengthTier || lore?.strengthTier || "normal";
    applyBudgetOverrides(club);
    applyStyleCalibration(club, style, rng);
    rebuildClub(club);
    applyTierCalibration(club, rng);
    rebuildClub(club);
    applyStyleCalibration(club, style, rng);
    rebuildClub(club);
    if (club.strengthTier === "low") {
      scaleSalariesToPressure(club.roster.players || [], club.budget, [65, 110]);
      rebuildClub(club);
    }

    const override = getLoreOverride(lore);
    if (override?.salaryPressure) {
      scaleSalariesToPressure(club.roster.players || [], club.budget, override.salaryPressure);
      rebuildClub(club);
    }

    club.calibrationMeta = {
      ...(club.calibrationMeta || {}),
      version: DEFAULT_RULES.version,
      applied: true,
      style,
      before,
      after: metricSnapshot(club)
    };
    club.calibrationWarnings = validateClubSeedProfile(club, lore);
    return club;
  }

  function validateClubSeedProfile(club, lore = club?.lore) {
    const warnings = [];
    const style = club?.rosterStyle || "";
    const metrics = metricSnapshot(club || {});
    const loreText = normalize([lore?.label, lore?.category, lore?.rawObjective, lore?.objective, club?.ambition].join(" "));
    const starterRotationGap = round(metrics.startersCurrent - metrics.rotationCurrent);

    if ((club?.strengthTier === "low" || style === "low_budget_fight" || loreText.includes("sobreviv") || loreText.includes("nao cair")) && metrics.overall > 74.5) warnings.push("survival_team_too_strong");
    if (style === "veteran_win_now" && metrics.avgAge < 28.5) warnings.push("veteran_lore_too_young");
    if ((style === "prospect_core" || loreText.includes("base") || loreText.includes("promessa") || loreText.includes("jovem")) && metrics.avgAge > 25.5) warnings.push("prospect_lore_too_old");
    if ((style === "prospect_core" || loreText.includes("base")) && metrics.avgGap < 8) warnings.push("prospect_gap_too_low");
    if ((style === "expensive_unbalanced" || loreText.includes("rico") || loreText.includes("dinheiro")) && metrics.salaryPressure < 85) warnings.push("rich_bad_build_salary_too_low");
    if ((style === "unbalanced" || style === "expensive_unbalanced") && starterRotationGap < 9) warnings.push("unbalanced_roster_gap_too_small");
    if (style === "veteran_win_now" && metrics.startersCurrent < 80) warnings.push("title_window_current_too_low");
    if (style === "low_budget_fight" && metrics.salaryPressure > 100) warnings.push("low_budget_salary_too_high");
    if (metrics.salaryPressure > 135) warnings.push("salary_pressure_too_high");
    if (style !== "low_budget_fight" && club?.strengthTier === "normal" && (metrics.overall < 72 || metrics.overall > 78)) warnings.push("normal_tier_out_of_range");
    if (style !== "prospect_core" && club?.strengthTier === "good" && (metrics.overall < 75.5 || metrics.overall > 82)) warnings.push("good_tier_out_of_range");
    if (style !== "unbalanced" && club?.strengthTier === "low" && (metrics.overall < 68 || metrics.overall > 74.5)) warnings.push("low_tier_out_of_range");
    return warnings;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralClubCalibration: {
      rules: DEFAULT_RULES,
      calibrateClubSeed,
      validateClubSeedProfile,
      metricSnapshot
    },
    calibrateClubSeed,
    validateClubSeedProfile
  };
})();
