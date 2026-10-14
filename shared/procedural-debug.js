(function () {
  const ATTRIBUTES = ["threePoint", "physical", "tactical", "technique", "defense"];
  const POSITION_ORDER = ["PG", "SG", "SF", "PF", "C"];

  function getAverage(values) {
    const list = values.filter(Number.isFinite);
    return list.reduce((sum, value) => sum + value, 0) / Math.max(1, list.length);
  }

  function getMedian(values) {
    const list = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!list.length) return 0;
    const middle = Math.floor(list.length / 2);
    return list.length % 2 ? list[middle] : (list[middle - 1] + list[middle]) / 2;
  }

  function getPercentile(values, percentile) {
    const list = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!list.length) return 0;
    const index = (list.length - 1) * Math.min(1, Math.max(0, percentile));
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return list[lower];
    return list[lower] + (list[upper] - list[lower]) * (index - lower);
  }

  function getStandardDeviation(values) {
    const list = values.filter(Number.isFinite);
    const avg = getAverage(list);
    return Math.sqrt(getAverage(list.map((value) => (value - avg) ** 2)));
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function valueFor(player, keyOrFunction) {
    return typeof keyOrFunction === "function" ? keyOrFunction(player) : player?.[keyOrFunction];
  }

  function groupCount(players, keyOrFunction) {
    return players.reduce((groups, player) => {
      const key = String(valueFor(player, keyOrFunction) ?? "unknown");
      groups[key] = (groups[key] || 0) + 1;
      return groups;
    }, {});
  }

  function summarizeNumericField(players, field) {
    const values = players.map((player) => Number(valueFor(player, field))).filter(Number.isFinite);
    return {
      avg: round(getAverage(values)),
      median: round(getMedian(values)),
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      sd: round(getStandardDeviation(values)),
      p10: round(getPercentile(values, 0.1)),
      p25: round(getPercentile(values, 0.25)),
      p75: round(getPercentile(values, 0.75)),
      p90: round(getPercentile(values, 0.9))
    };
  }

  function summarizeAttribute(players, attributeKey) {
    const values = players.map((player) => Number(player.attributes?.[attributeKey] ?? player[attributeKey])).filter(Number.isFinite);
    return {
      avg: round(getAverage(values)),
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      sd: round(getStandardDeviation(values))
    };
  }

  function ageBand(player) {
    const age = Number(player.age) || 0;
    if (age <= 20) return "ate 20";
    if (age <= 24) return "21-24";
    if (age <= 28) return "25-28";
    if (age <= 32) return "29-32";
    return "33+";
  }

  function getTop(players, fieldOrFunction, limit = 10) {
    return players
      .slice()
      .sort((a, b) => Number(valueFor(b, fieldOrFunction)) - Number(valueFor(a, fieldOrFunction)))
      .slice(0, limit)
      .map((player) => ({
        name: player.name,
        pos: player.pos,
        age: player.age,
        heightCm: player.heightCm,
        currentAbility: player.currentAbility,
        potential: player.potential,
        developmentGap: player.potential - player.currentAbility,
        salary: player.salary,
        archetype: player.archetype?.label || player.tag || ""
      }));
  }

  function makeDistributionTable(groups, total) {
    return Object.entries(groups)
      .sort(([a], [b]) => POSITION_ORDER.indexOf(a) - POSITION_ORDER.indexOf(b) || a.localeCompare(b))
      .map(([key, count]) => ({
        key,
        count,
        percent: round((count / Math.max(1, total)) * 100, 1)
      }));
  }

  function buildSummary(players) {
    const byPosition = groupCount(players, "pos");
    const byArchetype = groupCount(players, (player) => player.archetype?.label || "Sem arquetipo");
    const byPersonality = groupCount(players, (player) => player.personality?.label || "Sem personalidade");
    const byAgeBand = groupCount(players, ageBand);
    const gapValues = players.map((player) => (Number(player.potential) || 0) - (Number(player.currentAbility) || 0));
    const heightByPosition = {};
    POSITION_ORDER.forEach((position) => {
      const positionPlayers = players.filter((player) => player.pos === position);
      heightByPosition[position] = summarizeNumericField(positionPlayers, "heightCm");
    });

    const attributes = Object.fromEntries(ATTRIBUTES.map((attribute) => [attribute, summarizeAttribute(players, attribute)]));
    const topPlayers = {
      currentAbility: getTop(players, "currentAbility"),
      potential: getTop(players, "potential"),
      salary: getTop(players, "salary")
    };
    const topProspects = getTop(players, (player) => player.potential - player.currentAbility);

    return {
      total: players.length,
      byPosition,
      byArchetype,
      byPersonality,
      byAgeBand,
      height: {
        ...summarizeNumericField(players, "heightCm"),
        byPosition: heightByPosition
      },
      currentAbility: summarizeNumericField(players, "currentAbility"),
      potential: summarizeNumericField(players, "potential"),
      developmentGap: {
        avg: round(getAverage(gapValues)),
        max: gapValues.length ? Math.max(...gapValues) : 0,
        gapGte12: gapValues.filter((value) => value >= 12).length,
        gapGte18: gapValues.filter((value) => value >= 18).length,
        gapGte24: gapValues.filter((value) => value >= 24).length
      },
      salary: {
        ...summarizeNumericField(players, "salary"),
        total: round(players.reduce((sum, player) => sum + (Number(player.salary) || 0), 0)),
        top10: getTop(players, "salary")
      },
      attributes,
      topPlayers,
      topProspects
    };
  }

  function detectProceduralWarnings(players, summary, options = {}) {
    const warnings = [];
    const total = Math.max(1, players.length);
    const avgCurrent = summary.currentAbility.avg;
    const avgPotential = summary.potential.avg;
    const current82Share = players.filter((player) => player.currentAbility >= 82).length / total;
    const potential90Share = players.filter((player) => player.potential >= 90).length / total;
    const potential86Share = players.filter((player) => player.potential >= 86).length / total;
    const potential95Share = players.filter((player) => player.potential >= 95).length / total;
    const current88Share = players.filter((player) => player.currentAbility >= 88).length / total;
    const current92Share = players.filter((player) => player.currentAbility >= 92).length / total;
    const gap12Share = summary.developmentGap.gapGte12 / total;
    const gap18Share = summary.developmentGap.gapGte18 / total;
    const gap24Share = summary.developmentGap.gapGte24 / total;
    const highInjuryShare = players.filter((player) => (Number(player.injuryRisk) || 0) >= 0.18).length / total;
    const highVolatilityShare = players.filter((player) => (Number(player.volatility) || 0) >= 0.7).length / total;
    const lowPaidElite = players.filter((player) => player.currentAbility >= 85 && player.salary < 8);
    const extremeAttributeCount = players.reduce((sum, player) => {
      return sum + ATTRIBUTES.filter((key) => Number(player.attributes?.[key] ?? player[key]) > 92).length;
    }, 0);
    const totalAttributes = total * ATTRIBUTES.length;

    if ((options.strengthTier || "normal") === "normal" && (avgCurrent < 64 || avgCurrent > 72)) warnings.push(`Media de currentAbility (${avgCurrent}) fora da faixa alvo 64-72 para tier normal.`);
    if ((options.strengthTier || "normal") === "normal" && (summary.currentAbility.sd < 6 || summary.currentAbility.sd > 10)) warnings.push(`Desvio de currentAbility (${summary.currentAbility.sd}) fora da faixa alvo 6-10.`);
    if (avgPotential < 72 || avgPotential > 82) warnings.push(`Media de potential (${avgPotential}) fora da faixa alvo 72-82.`);
    if (current82Share < 0.08 || current82Share > 0.2) warnings.push(`${round(current82Share * 100, 1)}% dos jogadores tem currentAbility >= 82; alvo 8%-20%.`);
    if (current88Share > 0.04) warnings.push(`Estrelas prontas demais: ${round(current88Share * 100, 1)}% tem currentAbility >= 88.`);
    if (current92Share > 0.01) warnings.push(`${round(current92Share * 100, 1)}% dos jogadores tem currentAbility >= 92; deveria ser rarissimo.`);
    if (potential86Share < 0.1 || potential86Share > 0.28) warnings.push(`${round(potential86Share * 100, 1)}% dos jogadores tem potential >= 86; alvo 10%-28%.`);
    if (potential90Share > 0.12) warnings.push(`Potencial alto demais: ${round(potential90Share * 100, 1)}% da classe tem potential >= 90.`);
    if (potential90Share < 0.03) warnings.push(`Poucos tetos altos: ${round(potential90Share * 100, 1)}% da classe tem potential >= 90; alvo minimo 3%.`);
    if (potential95Share > 0.02) warnings.push(`${round(potential95Share * 100, 1)}% dos jogadores tem potential >= 95; alvo maximo 2%.`);
    if (summary.developmentGap.avg < 6 || summary.developmentGap.avg > 12) warnings.push(`Gap medio de desenvolvimento (${summary.developmentGap.avg}) fora da faixa 6-12.`);
    if (gap12Share < 0.15 || gap12Share > 0.35) warnings.push(`${round(gap12Share * 100, 1)}% dos jogadores tem gap >= 12; alvo 15%-35%.`);
    if (gap18Share < 0.03 || gap18Share > 0.12) warnings.push(`${round(gap18Share * 100, 1)}% dos jogadores tem gap >= 18; alvo 3%-12%.`);
    if (gap24Share > 0.02) warnings.push(`Gap de desenvolvimento exagerado: ${round(gap24Share * 100, 1)}% tem gap >= 24.`);
    if (players.length >= 200 && !players.some((player) => player.currentAbility >= 82)) warnings.push("Nenhum jogador com currentAbility >= 82 em classe de 200+.");
    if (summary.salary.avg < 2 || summary.salary.avg > 18) warnings.push(`Salario medio (${summary.salary.avg}) fora da faixa 2-18.`);
    if (lowPaidElite.length) warnings.push(`Salario desalinhado: ${lowPaidElite.length} jogador(es) com currentAbility >= 85 e salario abaixo de 8.`);

    POSITION_ORDER.forEach((position) => {
      const share = (summary.byPosition[position] || 0) / total;
      if (share < 0.12 || share > 0.28) warnings.push(`Distribuicao da posicao ${position} em ${round(share * 100, 1)}%, fora da faixa 12%-28%.`);
    });

    if ((summary.height.byPosition.PG?.avg || 0) > (summary.height.byPosition.C?.avg || 0)) warnings.push("Altura media de PG ficou maior que a altura media de C.");
    if (players.some((player) => player.pos === "C" && player.heightCm < 198)) warnings.push("Existe C abaixo de 198 cm.");
    if (players.some((player) => player.pos === "PG" && player.heightCm > 205)) warnings.push("Existe PG acima de 205 cm.");
    if (highInjuryShare > 0.35) warnings.push(`${round(highInjuryShare * 100, 1)}% dos jogadores tem injuryRisk alto.`);
    if (highVolatilityShare > 0.35) warnings.push(`${round(highVolatilityShare * 100, 1)}% dos jogadores tem volatility alta.`);
    if (extremeAttributeCount / Math.max(1, totalAttributes) > 0.08) warnings.push("Muitos atributos extremos acima de 92.");
    if (Object.values(summary.byAgeBand).some((count) => count / total > 0.36)) warnings.push("Distribuicao etaria pode estar distorcida.");

    return warnings;
  }

  function compactMetricTable(summary) {
    return ["currentAbility", "potential", "salary", "height", "developmentGap"].map((key) => {
      const item = key === "developmentGap" ? summary.developmentGap : summary[key];
      return {
        metric: key === "height" ? "heightCm" : key,
        avg: item.avg,
        median: item.median ?? "",
        min: item.min ?? "",
        max: item.max,
        sd: item.sd ?? "",
        p10: item.p10 ?? "",
        p25: item.p25 ?? "",
        p75: item.p75 ?? "",
        p90: item.p90 ?? ""
      };
    });
  }

  function printProceduralPreview(summary, players, warnings, seed) {
    console.group(`Preview procedural - Basquete - ${seed}`);
    console.table(makeDistributionTable(summary.byPosition, summary.total));
    console.table(compactMetricTable(summary));
    console.table(Object.entries(summary.attributes).map(([attribute, values]) => ({ attribute, ...values })));
    console.table(summary.topPlayers.currentAbility);
    console.table(summary.topPlayers.potential);
    console.table(summary.topProspects);
    if (warnings.length) {
      console.warn("Alertas de calibracao procedural:", warnings);
    } else {
      console.info("Nenhum alerta de calibracao procedural.");
    }
    console.groupEnd();
  }

  function previewProceduralBasketballClass(seed = "TESTE-2026", count = 200, options = {}) {
    const generator = window.TemporadaTotal?.ProceduralPlayerGenerator;
    const config = window.TemporadaTotal?.BasketballGenerationConfig;
    if (!generator || !config) {
      const message = "[procedural] Gerador procedural ou BasketballGenerationConfig nao foi carregado.";
      console.error(message);
      return { seed, count, players: [], summary: {}, warnings: [message] };
    }

    const strengthTier = options.strengthTier || "normal";
    const players = generator.generateProceduralPlayers({
      seed,
      sportId: "basquete",
      config,
      count,
      strengthTier
    });
    const summary = buildSummary(players);
    const warnings = detectProceduralWarnings(players, summary, { strengthTier });

    if (!options.silent) {
      printProceduralPreview(summary, players, warnings, seed);
    }

    return { seed, count, players, summary, warnings };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    previewProceduralBasketballClass
  };
})();
