(function () {
  const DEFAULT_PROFILE = "balanced";
  const PROFILE_TIERS = {
    balanced: ["elite", "good", "good", "normal", "normal", "normal", "prospect", "prospect", "low", "low"],
    win_now: ["elite", "elite", "good", "good", "good", "normal", "normal", "low"],
    budget: ["normal", "normal", "low", "low", "low", "prospect", "prospect", "low"],
    development: ["prospect", "prospect", "prospect", "normal", "normal", "low", "low", "good"]
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function average(rows, getter) {
    if (!rows.length) return 0;
    return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / rows.length;
  }

  function countBy(rows, getter) {
    return rows.reduce((acc, row) => {
      const key = getter(row) || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function getPositions(config) {
    return Object.keys(config?.positions || { PG: {}, SG: {}, SF: {}, PF: {}, C: {} });
  }

  function getMarketCategory(player) {
    const ability = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || ability;
    const age = Number(player.age) || 24;
    const salary = Number(player.salary) || 0;
    if (ability >= 82) return { id: "star", label: "⭐ Estrela da Liga", badgeClass: "tier-star" };
    if (ability >= 76) return { id: "starter", label: "🛡️ Titular Consolidado", badgeClass: "tier-starter" };
    if (age <= 22 && (potential >= 82 || potential - ability >= 8)) return { id: "prospect", label: "🚀 Jovem Promessa", badgeClass: "tier-prospect" };
    if (salary <= 0.65 && ability >= 71) return { id: "bargain", label: "💰 Custo-Benefício", badgeClass: "tier-bargain" };
    if (ability >= 71) return { id: "rotation", label: "🔄 Rotação Confiável", badgeClass: "tier-rotation" };
    return { id: "depth", label: "📦 Profundidade / Reserva", badgeClass: "tier-depth" };
  }

  function getMarketPool(player) {
    const ability = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || ability;
    const age = Number(player.age) || 24;
    const gap = potential - ability;
    if (player.strengthTier === "prospect" || (age <= 22 && gap >= 9)) return "prospect";
    if (ability >= 82) return "impact";
    if (ability >= 73) return "rotation";
    if (ability <= 61) return "depth";
    return "role_player";
  }

  function calculateValueScore(player, profile) {
    const ability = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || ability;
    const salary = Number(player.salary) || 0;
    const age = Number(player.age) || 24;
    const gap = Math.max(0, potential - ability);
    const prospectBonus = profile === "development" ? gap * 0.35 : gap * 0.16;
    const winNowBonus = profile === "win_now" ? ability * 0.1 : 0;
    const budgetBonus = profile === "budget" ? Math.max(0, 8 - salary) * 1.7 : 0;
    const agePenalty = age >= 33 ? 2.8 : age >= 30 ? 1.1 : 0;
    return round(ability * 0.62 + potential * 0.22 + prospectBonus + winNowBonus + budgetBonus - salary * 1.45 - agePenalty);
  }

  function getFitLabel(player, profile) {
    const pool = getMarketPool(player);
    if (profile === "win_now" && (pool === "impact" || player.currentAbility >= 78)) return "pronto para vencer";
    if (profile === "budget" && Number(player.salary) <= 4.5) return "custo controlado";
    if (profile === "development" && pool === "prospect") return "aposta de desenvolvimento";
    if (pool === "impact") return "impacto imediato";
    if (pool === "rotation") return "rotacao confiavel";
    if (pool === "depth") return "profundidade barata";
    return "encaixe situacional";
  }

  function normalizeMarketPlayer(player, index, profile) {
    const cat = getMarketCategory(player);
    const normalized = {
      ...player,
      id: `proc-market-${profile}-${String(index + 1).padStart(3, "0")}-${player.id}`,
      marketPool: getMarketPool(player),
      marketCategory: cat,
      marketFit: getFitLabel(player, profile),
      marketValueScore: calculateValueScore(player, profile),
      salary: round(player.salary, 2),
      currentAbility: Math.round(Number(player.currentAbility) || 0),
      potential: Math.round(Number(player.potential) || 0)
    };
    normalized.developmentGap = Math.max(0, normalized.potential - normalized.currentAbility);
    return normalized;
  }

  function getMarketWarnings(players, summary, profile = DEFAULT_PROFILE) {
    const warnings = [];
    const positions = summary.byPosition || {};
    const pools = summary.byPool || {};
    const salaries = players.map((player) => Number(player.salary) || 0).sort((a, b) => a - b);
    const salarySpread = salaries.length ? salaries[salaries.length - 1] - salaries[0] : 0;

    if (summary.averageSalary > (profile === "win_now" ? 10.5 : 8.5)) warnings.push("market_too_expensive");
    if (positions.LEV || positions.OPP || positions.PON || positions.CEN || positions.LIB) {
      if ((positions.LEV || 0) < 2) warnings.push("market_lacks_setters");
      if ((positions.PON || 0) + (positions.OPP || 0) < 5) warnings.push("market_lacks_attackers");
      if ((positions.CEN || 0) < 2) warnings.push("market_lacks_middles");
      if ((positions.LIB || 0) < 1) warnings.push("market_lacks_liberos");
    } else if (positions.GOL || positions.FIX || positions.ALA || positions.PIVO) {
      if ((positions.GOL || 0) < 2) warnings.push("market_lacks_goalkeepers");
      if ((positions.FIX || 0) < 2) warnings.push("market_lacks_fixos");
      if ((positions.ALA || 0) < 5) warnings.push("market_lacks_wings");
      if ((positions.PIVO || 0) < 2) warnings.push("market_lacks_pivots");
    } else {
      if ((positions.PG || 0) + (positions.SG || 0) < 5) warnings.push("market_lacks_guards");
      if ((positions.PF || 0) + (positions.C || 0) < 5) warnings.push("market_lacks_bigs");
    }
    if (profile !== "win_now" && (pools.prospect || 0) < 3) warnings.push("market_no_prospects");
    if (profile === "win_now" && (pools.impact || 0) < 4) warnings.push("market_no_win_now_players");
    if (profile === "balanced" && (pools.impact || 0) < 2) warnings.push("market_no_win_now_players");
    if (profile === "development" && (pools.prospect || 0) < 6) warnings.push("market_development_pool_too_small");
    if (profile === "budget" && summary.averageSalary > 5.2) warnings.push("budget_market_salary_too_high");
    if (salarySpread < 5) warnings.push("market_salary_spread_flat");
    return warnings;
  }

  function summarizeMarket(players, profile) {
    const sortedByValue = players.slice().sort((a, b) => b.marketValueScore - a.marketValueScore);
    const summary = {
      profile,
      count: players.length,
      averageSalary: round(average(players, (player) => player.salary)),
      totalSalary: round(players.reduce((sum, player) => sum + (Number(player.salary) || 0), 0)),
      averageCurrentAbility: round(average(players, (player) => player.currentAbility)),
      averagePotential: round(average(players, (player) => player.potential)),
      averageAge: round(average(players, (player) => player.age)),
      averageDevelopmentGap: round(average(players, (player) => player.developmentGap)),
      byPosition: countBy(players, (player) => player.pos),
      byPool: countBy(players, (player) => player.marketPool),
      topValue: sortedByValue.slice(0, 5).map((player) => ({
        id: player.id,
        name: player.name,
        pos: player.pos,
        currentAbility: player.currentAbility,
        potential: player.potential,
        salary: player.salary,
        marketValueScore: player.marketValueScore
      }))
    };
    summary.warnings = getMarketWarnings(players, summary, profile);
    return summary;
  }

  function getNeededPositions(club) {
    const needs = club?.roster?.summary?.needs || [];
    const explicitNeeds = needs
      .map((need) => String(need).match(/^([A-Z]{1,2}):/)?.[1])
      .filter(Boolean);
    if (explicitNeeds.length) return explicitNeeds;

    const strengthByPosition = club?.roster?.summary?.strengthByPosition || {};
    return Object.entries(strengthByPosition)
      .filter(([, row]) => Number(row?.count || 0) < 2 || Number(row?.currentAbility || 0) < 68)
      .map(([position]) => position);
  }

  function getClubMarketIntent(club) {
    const focus = String(club?.marketBehavior?.focus || club?.ambition || "").toLowerCase();
    const style = String(club?.rosterStyle || "").toLowerCase();
    if (focus.includes("desenvolvimento") || style.includes("prospect")) return "development";
    if (focus.includes("title") || focus.includes("titulo") || style.includes("veteran")) return "win_now";
    if (Number(club?.roster?.summary?.budgetLeft || 0) <= 4 || String(club?.marketBehavior?.aggressiveness || "").includes("conservador")) return "budget";
    return "balanced";
  }

  function getFitReason(player, club, neededPositions, budgetLeft, intent) {
    if (neededPositions.includes(player.pos)) return `cobre carencia em ${player.pos}`;
    if (intent === "development" && player.marketPool === "prospect") return "encaixa no plano de desenvolvimento";
    if (intent === "win_now" && player.currentAbility >= 78) return "ajuda imediatamente";
    if (budgetLeft > 0 && player.salary <= Math.max(4, budgetLeft)) return "cabe no espaco financeiro";
    if (player.marketValueScore >= 58) return "bom valor relativo";
    return "encaixe situacional";
  }

  function calculateClubMarketFitScore(player, club) {
    const neededPositions = getNeededPositions(club);
    const budgetLeft = Number(club?.roster?.summary?.budgetLeft ?? club?.budget ?? 0) || 0;
    const intent = getClubMarketIntent(club);
    const ability = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || ability;
    const salary = Number(player.salary) || 0;
    const gap = Math.max(0, potential - ability);
    const affordability = budgetLeft <= 0
      ? salary <= 3.5 ? 9 : -10
      : salary <= budgetLeft ? 10 : -Math.min(14, (salary - budgetLeft) * 1.8);
    const needBonus = neededPositions.includes(player.pos) ? 18 : 0;
    const intentBonus = intent === "development"
      ? (player.marketPool === "prospect" ? 12 : gap * 0.35)
      : intent === "win_now"
        ? Math.max(0, ability - 72) * 0.9
        : intent === "budget"
          ? Math.max(0, 7 - salary) * 1.4
          : 4;
    const valueBase = (Number(player.marketValueScore) || 0) * 0.52;
    const riskPenalty = String(player.riskLabel || "").toLowerCase().includes("alto") ? 4 : 0;
    return round(clamp(valueBase + needBonus + intentBonus + affordability - riskPenalty, 0, 100));
  }

  function getPositionCounts(players) {
    return countBy(players || [], (player) => player.pos);
  }

  function getRosterNeedsFromPlayers(players) {
    const counts = getPositionCounts(players);
    const needs = [];
    const excesses = [];
    const positions = counts.LEV || counts.OPP || counts.PON || counts.CEN || counts.LIB
      ? ["LEV", "OPP", "PON", "CEN", "LIB"]
      : counts.GOL || counts.FIX || counts.ALA || counts.PIVO
        ? ["GOL", "FIX", "ALA", "PIVO"]
        : ["PG", "SG", "SF", "PF", "C"];
    positions.forEach((position) => {
      const count = counts[position] || 0;
      const minimum = position === "LIB" ? 1 : 2;
      const maximum = position === "LIB" || position === "GOL" ? 2 : position === "ALA" ? 6 : 4;
      if (count < minimum) needs.push(`${position}: falta profundidade`);
      if (count > maximum) excesses.push(`${position}: excesso de atletas`);
    });
    return { needs, excesses };
  }

  function summarizeRosterForSandbox(players, budget) {
    const safePlayers = players || [];
    const totalSalary = round(safePlayers.reduce((sum, player) => sum + (Number(player.salary) || 0), 0));
    const needs = getRosterNeedsFromPlayers(safePlayers);
    return {
      rosterSize: safePlayers.length,
      budget: round(budget),
      totalSalary,
      budgetLeft: round((Number(budget) || 0) - totalSalary),
      averageAge: round(average(safePlayers, (player) => player.age)),
      averageCurrentAbility: round(average(safePlayers, (player) => player.currentAbility)),
      averagePotential: round(average(safePlayers, (player) => player.potential)),
      averageDevelopmentGap: round(average(safePlayers, (player) => (Number(player.potential) || 0) - (Number(player.currentAbility) || 0))),
      positionCounts: getPositionCounts(safePlayers),
      needs: needs.needs,
      excesses: needs.excesses
    };
  }

  function pickSandboxOutgoingPlayer(club, incomingPlayer, options = {}) {
    const rosterPlayers = club?.roster?.players || [];
    if (!rosterPlayers.length) return null;
    const maxRosterSize = Number(options.maxRosterSize || club?.roster?.summary?.rosterSize || rosterPlayers.length);
    if (rosterPlayers.length < maxRosterSize && options.forceCut !== true) return null;
    const counts = getPositionCounts(rosterPlayers);
    const scored = rosterPlayers.map((player) => {
      const samePosition = player.pos === incomingPlayer.pos ? 10 : 0;
      const surplusPosition = (counts[player.pos] || 0) > 2 ? 8 : 0;
      const salaryRelief = (Number(player.salary) || 0) * 1.15;
      const lowImpact = Math.max(0, 78 - (Number(player.currentAbility) || 0)) * 0.55;
      const prospectPenalty = ((Number(player.potential) || 0) - (Number(player.currentAbility) || 0)) >= 9 ? -8 : 0;
      return {
        player,
        cutScore: round(samePosition + surplusPosition + salaryRelief + lowImpact + prospectPenalty)
      };
    }).sort((a, b) => b.cutScore - a.cutScore);
    return scored[0]?.player || null;
  }

  function simulateMarketSigning(club, player, options = {}) {
    const rosterPlayers = club?.roster?.players || [];
    const budget = Number(club?.budget || club?.roster?.summary?.budget || 0) || 0;
    const before = summarizeRosterForSandbox(rosterPlayers, budget);
    const outgoing = options.outgoingPlayer || pickSandboxOutgoingPlayer(club, player, options);
    const afterPlayers = rosterPlayers
      .filter((row) => !outgoing || row.id !== outgoing.id)
      .concat([{ ...player, rosterRole: "sandbox_signing", rosterSlot: rosterPlayers.length + 1 }]);
    const after = summarizeRosterForSandbox(afterPlayers, budget);
    const currentDelta = round(after.averageCurrentAbility - before.averageCurrentAbility);
    const potentialDelta = round(after.averagePotential - before.averagePotential);
    const salaryDelta = round(after.totalSalary - before.totalSalary);
    const needDelta = before.needs.length - after.needs.length;
    const verdict = after.budgetLeft < 0
      ? "exige ajuste financeiro"
      : currentDelta >= 1 || needDelta > 0
        ? "melhora clara"
        : potentialDelta >= 1
          ? "ganho de teto"
          : "movimento neutro";

    return {
      clubId: club?.id || "",
      clubName: club?.name || "",
      incoming: player,
      outgoing,
      before,
      after,
      delta: {
        averageCurrentAbility: currentDelta,
        averagePotential: potentialDelta,
        totalSalary: salaryDelta,
        budgetLeft: round(after.budgetLeft - before.budgetLeft),
        needsResolved: needDelta,
        rosterSize: after.rosterSize - before.rosterSize
      },
      verdict,
      warnings: [
        after.budgetLeft < 0 ? "sandbox_salary_over_budget" : null,
        !outgoing && after.rosterSize > before.rosterSize ? "sandbox_roster_size_increased" : null,
        currentDelta < 0 && potentialDelta < 1 ? "sandbox_no_sporting_gain" : null
      ].filter(Boolean)
    };
  }

  function analyzeMarketFitForClub(club, market, options = {}) {
    const players = market?.players || [];
    const neededPositions = getNeededPositions(club);
    const budgetLeft = round(Number(club?.roster?.summary?.budgetLeft ?? club?.budget ?? 0) || 0);
    const intent = getClubMarketIntent(club);
    const rows = players.map((player) => {
      const fitScore = calculateClubMarketFitScore(player, club);
      return {
        ...player,
        clubFitScore: fitScore,
        clubFitReason: getFitReason(player, club, neededPositions, budgetLeft, intent),
        affordable: budgetLeft > 0 ? Number(player.salary) <= budgetLeft : Number(player.salary) <= 3.5,
        sandbox: simulateMarketSigning(club, player)
      };
    }).sort((a, b) => b.clubFitScore - a.clubFitScore);

    return {
      clubId: club?.id || "",
      clubName: club?.name || "",
      seed: market?.seed || "",
      profile: market?.profile || DEFAULT_PROFILE,
      intent,
      budgetLeft,
      neededPositions,
      topFits: rows.slice(0, options.limit || 8),
      rows,
      warnings: [
        !neededPositions.length ? "club_without_clear_market_need" : null,
        rows[0]?.clubFitScore < 45 ? "market_lacks_clear_fit_for_club" : null,
        budgetLeft <= 0 ? "club_has_no_budget_room" : null
      ].filter(Boolean)
    };
  }

  function generateProceduralMarket(options = {}) {
    const seed = options.seed || "MERCADO-P7";
    const sportId = options.sportId || options.config?.sportId || "basquete";
    const config = options.config;
    const count = Math.max(5, Math.floor(Number(options.count) || 100));
    const profile = PROFILE_TIERS[options.profile] ? options.profile : DEFAULT_PROFILE;
    const rngFactory = window.TemporadaTotal?.createSeededRng;
    const playerGenerator = window.TemporadaTotal?.ProceduralPlayerGenerator;

    if (!rngFactory || !playerGenerator?.generateProceduralPlayer || !config) {
      throw new Error("[procedural-market] RNG, gerador de atletas e config sao obrigatorios.");
    }

    const rng = rngFactory(`${seed}:market:${sportId}:${profile}:${count}`);
    const positions = rng.shuffle(getPositions(config));
    const tiers = PROFILE_TIERS[profile];
    const players = Array.from({ length: count }, (_, index) => {
      const position = positions[index % positions.length];
      const tier = tiers[index % tiers.length];
      const player = playerGenerator.generateProceduralPlayer({
        rng,
        sportId,
        config,
        position,
        strengthTier: tier,
        index
      });
      return normalizeMarketPlayer(player, index, profile);
    }).sort((a, b) => b.marketValueScore - a.marketValueScore);

    const summary = summarizeMarket(players, profile);
    return {
      seed,
      sportId,
      profile,
      count: players.length,
      players,
      summary,
      warnings: summary.warnings
    };
  }

  function generateProceduralBasketballMarket(seed = "MERCADO-P7", options = {}) {
    const config = window.TemporadaTotal?.BasketballGenerationConfig;
    if (!config) {
      console.warn("[procedural-market] BasketballGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralMarket({
      ...options,
      seed,
      sportId: "basquete",
      config,
      count: options.count || 100,
      profile: options.profile || DEFAULT_PROFILE
    });
  }

  function generateProceduralVolleyballMarket(seed = "MERCADO-VOLEI", options = {}) {
    const config = window.TemporadaTotal?.VolleyballGenerationConfig;
    if (!config) {
      console.warn("[procedural-market] VolleyballGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralMarket({
      ...options,
      seed,
      sportId: "volei",
      config,
      count: options.count || 100,
      profile: options.profile || DEFAULT_PROFILE
    });
  }

  function generateProceduralFutsalMarket(seed = "MERCADO-FUTSAL", options = {}) {
    const config = window.TemporadaTotal?.FutsalGenerationConfig;
    if (!config) {
      console.warn("[procedural-market] FutsalGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralMarket({
      ...options,
      seed,
      sportId: "futsal",
      config,
      count: options.count || 100,
      profile: options.profile || DEFAULT_PROFILE
    });
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralMarketGenerator: {
      generateProceduralMarket,
      generateProceduralBasketballMarket,
      generateProceduralVolleyballMarket,
      generateProceduralFutsalMarket,
      summarizeMarket,
      getMarketWarnings,
      analyzeMarketFitForClub,
      calculateClubMarketFitScore,
      simulateMarketSigning,
      calculateValueScore,
      getMarketPool
    },
    generateProceduralBasketballMarket,
    generateProceduralVolleyballMarket,
    generateProceduralFutsalMarket,
    analyzeProceduralMarketFitForClub: analyzeMarketFitForClub,
    simulateProceduralMarketSigning: simulateMarketSigning
  };
})();
