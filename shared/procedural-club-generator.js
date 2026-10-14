(function () {
  const PROTOTYPE_LORES = [
    {
      id: "veteran_title_window",
      label: "Ultima janela de titulo",
      description: "Clube caro, experiente e pressionado para vencer agora.",
      budgetBias: 1.22,
      pressure: "alta",
      ambition: "titulo",
      objective: "brigar pelo titulo",
      rosterProfile: "veteran_win_now",
      strengthTier: "good",
      traits: ["veterano", "caro", "pressao"]
    },
    {
      id: "youth_development",
      label: "Projeto de desenvolvimento",
      description: "Equipe jovem, paciente e focada em transformar potencial em resultado.",
      budgetBias: 0.86,
      pressure: "media",
      ambition: "crescimento",
      objective: "desenvolver jovens e beliscar playoffs",
      rosterProfile: "prospect_core",
      strengthTier: "normal",
      traits: ["jovem", "potencial", "paciencia"]
    },
    {
      id: "traditional_crisis",
      label: "Tradicional em crise",
      description: "Marca pesada, torcida impaciente e elenco desequilibrado.",
      budgetBias: 1.02,
      pressure: "muito alta",
      ambition: "recuperacao",
      objective: "voltar aos playoffs e reduzir turbulencia",
      rosterProfile: "unbalanced",
      strengthTier: "normal",
      traits: ["tradicao", "crise", "instabilidade"]
    },
    {
      id: "rich_bad_build",
      label: "Rico, mas mal montado",
      description: "Ha dinheiro, mas a folha tem redundancias e poucos encaixes naturais.",
      budgetBias: 1.35,
      pressure: "alta",
      ambition: "playoffs",
      objective: "corrigir o elenco e competir no topo",
      rosterProfile: "expensive_unbalanced",
      strengthTier: "good",
      traits: ["rico", "desequilibrado", "urgente"]
    },
    {
      id: "survival_promoted",
      label: "Recem-promovido",
      description: "Clube de pouca verba tentando provar que pertence a elite.",
      budgetBias: 0.72,
      pressure: "media",
      ambition: "sobrevivencia",
      objective: "evitar rebaixamento",
      rosterProfile: "low_budget_fight",
      strengthTier: "low",
      traits: ["baixo orcamento", "luta", "sobrevivencia"]
    },
    {
      id: "defensive_identity",
      label: "Identidade defensiva",
      description: "Time fisico, duro e competitivo, mas limitado em criacao.",
      budgetBias: 0.94,
      pressure: "media",
      ambition: "playoffs",
      objective: "chegar aos playoffs com defesa forte",
      rosterProfile: "defense_first",
      strengthTier: "normal",
      traits: ["defesa", "fisico", "limitado"]
    }
  ];

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

  function getDatasets() {
    return window.TemporadaTotal?.ProceduralDatasets;
  }

  function normalizeLoreText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function isLoreCompatibleWithSport(lore, sportId) {
    if (sportId === "basquete") return true;
    const declaredSports = lore?.sportIds || lore?.sports;
    if (Array.isArray(declaredSports) && declaredSports.length) {
      return declaredSports.includes(sportId);
    }

    // Older datasets do not declare a sport. Keep those lores portable unless
    // their actual narrative/archetype names basketball-specific roles or play.
    const text = normalizeLoreText(JSON.stringify(lore));
    const basketballTerms = [
      /\barmadores?\b/,
      /\bgarrafao\b/,
      /\b(pivos?|alas?|ala-pivos?)\b/,
      /\b(cestinha|enterrada|bandeja)\b/,
      /\brebotes?\b/,
      /\barremessos?\b/,
      /\bbola de 3\b/,
      /\b3 pontos\b/,
      /\bquinteto\b/,
      /\bbasquete\b/
    ];
    return !basketballTerms.some((pattern) => pattern.test(text));
  }

  function getLoreDatasets(sportId = "basquete") {
    const lores = window.TemporadaTotal?.ProceduralLoreDatasets?.lores;
    const source = Array.isArray(lores) && lores.length ? lores : PROTOTYPE_LORES;
    if (sportId === "basquete") return source;
    const compatible = source.filter((lore) => isLoreCompatibleWithSport(lore, sportId));
    return compatible.length ? compatible : PROTOTYPE_LORES;
  }

  function getIdentityDataset(datasets, sportId, key, fallbackKey) {
    const sportPrefix = sportId === "volei" ? "volleyball" : sportId === "basquete" ? "basketball" : sportId;
    const sportKey = `${sportPrefix}${key}`;
    const sportRows = datasets[sportKey];
    return Array.isArray(sportRows) && sportRows.length ? sportRows : datasets[fallbackKey];
  }

  function buildClubName(rng, datasets, sportId = "basquete") {
    const city = rng.pick(getIdentityDataset(datasets, sportId, "Cities", "cities"));
    const prefix = rng.pick(getIdentityDataset(datasets, sportId, "TeamPrefixes", "teamPrefixes"));
    const suffix = rng.pick(getIdentityDataset(datasets, sportId, "TeamSuffixes", "teamSuffixes"));
    return {
      city,
      name: `${prefix} ${city} ${suffix}`
    };
  }

  function getRosterSizeForLore(lore, rng, sportId) {
    if (sportId !== "basquete") return null;
    const profile = String(lore?.rosterProfile || "").toLowerCase();
    const text = `${lore?.label || ""} ${lore?.description || ""} ${lore?.objective || ""} ${(lore?.traits || []).join(" ")}`.toLowerCase();
    let min = 12;
    let max = 15;
    let reason = "seed";
    if (lore?.strengthTier === "low" || profile.includes("low_budget") || text.includes("divida") || text.includes("financeir") || text.includes("sobreviv")) {
      max = 13;
      reason = "orcamento curto";
    } else if (profile.includes("prospect") || text.includes("base") || text.includes("jovem") || text.includes("formador")) {
      min = 14;
      reason = "elenco de desenvolvimento";
    } else if (profile.includes("veteran") || text.includes("veteran") || text.includes("ultima chance")) {
      max = 13;
      reason = "nucleo veterano";
    } else if (lore?.strengthTier === "good" || text.includes("titulo") || text.includes("playoff")) {
      min = 13;
      reason = "pressao competitiva";
    }
    return {
      size: rng.int(min, max),
      reason
    };
  }

  function getRosterOptionsForLore(lore, budget, rng, sportId) {
    const rosterSize = getRosterSizeForLore(lore, rng, sportId);
    const options = { budget, profile: lore.rosterProfile || "balanced" };
    const sportConfig = sportId === "volei"
      ? window.TemporadaTotal?.VolleyballGenerationConfig
      : sportId === "futsal"
        ? window.TemporadaTotal?.FutsalGenerationConfig
        : window.TemporadaTotal?.BasketballGenerationConfig;
    const budgetConfig = sportConfig?.budget || {};
    const tierBudgetFloor = (multiplier, fallback) => {
      if (budgetConfig.min) return Math.max(Number(budgetConfig.floor || budgetConfig.min) || 1, Number(budgetConfig.min) * multiplier);
      return fallback;
    };
    if (rosterSize) {
      options.rosterSize = rosterSize.size;
      options.rosterSizeReason = rosterSize.reason;
    }
    if (lore.strengthTier === "low") options.budget = Math.max(tierBudgetFloor(0.85, 42), budget);
    if (lore.strengthTier === "good") options.budget = Math.max(tierBudgetFloor(1.18, 82), budget);
    return options;
  }

  function getConfigForSport(sportId, config) {
    if (config) return config;
    if (sportId === "futsal") return window.TemporadaTotal?.FutsalGenerationConfig;
    if (sportId === "volei") return window.TemporadaTotal?.VolleyballGenerationConfig;
    return window.TemporadaTotal?.BasketballGenerationConfig;
  }

  function generateRosterForSport({ seed, sportId, config, options }) {
    const rosterGenerator = window.TemporadaTotal?.ProceduralRosterGenerator?.generateProceduralRoster;
    if (rosterGenerator && config) {
      return rosterGenerator({
        seed,
        sportId,
        config,
        rosterSize: options.rosterSize || config.rosterSize || 12,
        budget: options.budget,
        profile: options.profile || "balanced"
      });
    }
    if (sportId === "futsal") return window.TemporadaTotal?.generateProceduralFutsalRoster?.(seed, options);
    if (sportId === "volei") return window.TemporadaTotal?.generateProceduralVolleyballRoster?.(seed, options);
    return window.TemporadaTotal?.generateProceduralBasketballRoster?.(seed, options);
  }

  function resolveBudgetForSport(rng, lore, config) {
    const budgetConfig = config?.budget || {};
    const min = Number(budgetConfig.min) || 58;
    const max = Number(budgetConfig.max) || 92;
    const floor = Number(budgetConfig.floor) || min * 0.72;
    const ceiling = Number(budgetConfig.ceiling) || max * 1.42;
    const base = rng.float(min, max);
    return round(clamp(base * (Number(lore?.budgetBias) || 1), floor, ceiling));
  }

  function getBudgetReputation(budget, config) {
    const budgetConfig = config?.budget || {};
    const min = Number(budgetConfig.floor || budgetConfig.min) || 1;
    const max = Number(budgetConfig.ceiling || budgetConfig.max) || 100;
    const ratio = clamp((Number(budget) - min) / Math.max(0.1, max - min), 0, 1);
    return 54 + ratio * 34;
  }

  function rateClub(roster, lore, config) {
    const players = roster.players || [];
    const current = average(players, (player) => player.currentAbility);
    const potential = average(players, (player) => player.potential);
    const sportId = config?.sportId || roster.sportId || "";
    const defense = average(players, (player) => {
      if (sportId === "futsal") return (Number(player.marking) || 0) * 0.62 + (Number(player.goalkeeping) || 0) * 0.22 + (Number(player.tactical) || 0) * 0.16;
      return player.defense || player.block || player.reception;
    });
    const shooting = average(players, (player) => {
      if (sportId === "futsal") return (Number(player.finishing) || 0) * 0.72 + (Number(player.passing) || 0) * 0.18 + (Number(player.tactical) || 0) * 0.1;
      return player.threePoint || player.attack || player.serve;
    });
    const primary = average(players, (player) => average(config?.primaryStats || config?.attributes || [], (key) => player[key]));
    const age = average(players, (player) => player.age);
    const salaryPressure = roster.summary.totalSalary / Math.max(1, roster.summary.budget);
    const rating = current * 0.56 + potential * 0.16 + defense * 0.1 + shooting * 0.07 + primary * 0.03 + (100 - Math.abs(26 - age) * 3) * 0.08;
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

  function inferStrengths(rating, roster, lore, sportId = "basquete") {
    const strengths = [];
    const weaknesses = [];
    if (sportId === "volei") {
      if (rating.shooting >= 74) strengths.push("ataque e saque acima da media");
      else weaknesses.push("pressao ofensiva irregular");
      if (rating.defense >= 74) strengths.push("recepcao e bloqueio confiaveis");
      else weaknesses.push("linha de passe vulneravel");
    } else if (sportId === "futsal") {
      if (rating.shooting >= 74) strengths.push("finalizacao acima da media");
      else weaknesses.push("chance criada sem conversao");
      if (rating.defense >= 74) strengths.push("marcacao e goleiro confiaveis");
      else weaknesses.push("defesa vulneravel em transicao");
    } else {
      if (rating.shooting >= 74) strengths.push("arremesso acima da media");
      else weaknesses.push("espacamento inconsistente");
      if (rating.defense >= 74) strengths.push("base defensiva confiavel");
      else weaknesses.push("defesa vulneravel");
    }
    if (rating.potential - rating.current >= 7) strengths.push("bom teto de desenvolvimento");
    else weaknesses.push("pouca margem de crescimento");
    if (rating.averageAge >= 29) strengths.push("experiencia");
    if (rating.averageAge >= 30) weaknesses.push("risco de envelhecimento");
    if (roster.summary.budgetLeft >= 10) strengths.push("flexibilidade financeira");
    if (roster.summary.budgetLeft < 0) weaknesses.push("folha acima do orcamento");
    if (lore.traits?.includes("pressao")) weaknesses.push("ambiente de alta cobranca");
    return {
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4)
    };
  }

  function generateClubScoutNotes(club) {
    const notes = [];
    if (club.rating.overall >= 78) notes.push("Elenco pronto para competir na parte alta da liga.");
    if (club.rating.potential - club.rating.current >= 7) {
      notes.push(club.sportId === "volei"
        ? "Ha espaco real para evolucao interna se jovens receberem rallies, treino tecnico e minutos de rotacao."
        : "Ha espaco real para evolucao interna se os jovens receberem minutos.");
    }
    if (club.rating.salaryPressure >= 95) notes.push("Folha pressiona o planejamento: qualquer reforco exige saida ou corte.");
    if (club.rating.averageAge >= 30) notes.push("Janela competitiva curta; queda fisica pode chegar rapido.");
    if (club.lore.pressure.includes("alta")) notes.push("O contexto cobra resultado cedo e reduz paciencia com testes longos.");
    if (!notes.length) notes.push("Clube equilibrado, com margem para o usuario definir a direcao.");
    return notes;
  }

  function generateProceduralClub({ seed = "OLYMPICO-2026", sportId = "basquete", config, userControlled = true } = {}) {
    const rngFactory = window.TemporadaTotal?.createSeededRng;
    const resolvedConfig = getConfigForSport(sportId, config);
    const datasets = getDatasets();
    if (!rngFactory || !datasets || !resolvedConfig) {
      throw new Error("[procedural] Modulos de clube procedural ausentes.");
    }

    const rng = rngFactory(`${seed}:club:${userControlled ? "user" : "ai"}`);
    const lore = rng.pick(getLoreDatasets(sportId));
    const identity = buildClubName(rng, datasets, sportId);
    const budget = resolveBudgetForSport(rng, lore, resolvedConfig);
    const rosterOptions = getRosterOptionsForLore(lore, budget, rng, sportId);
    const roster = generateRosterForSport({
      seed: `${seed}:${lore.id}:${identity.name}`,
      sportId,
      config: resolvedConfig,
      options: rosterOptions
    });
    if (roster?.summary) {
      roster.summary.rosterSizeReason = rosterOptions.rosterSizeReason || "padrao";
    }
    const rating = rateClub(roster, lore, resolvedConfig);
    const profile = inferStrengths(rating, roster, lore, sportId);
    const club = {
      id: `club-${seed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${lore.id}`,
      sportId,
      userControlled,
      name: identity.name,
      city: identity.city,
      lore,
      budget: Number(rosterOptions.budget || budget),
      reputation: round(rating.overall * 0.72 + getBudgetReputation(Number(rosterOptions.budget || budget), resolvedConfig) * 0.28),
      pressure: lore.pressure,
      ambition: lore.ambition,
      objective: lore.objective,
      strengthTier: lore.strengthTier,
      rosterStyle: lore.rosterProfile,
      roster,
      rating,
      strengths: profile.strengths,
      weaknesses: profile.weaknesses,
      marketBehavior: {
        aggressiveness: lore.budgetBias >= 1.15 ? "agressivo" : lore.budgetBias <= 0.85 ? "conservador" : "seletivo",
        focus: lore.rosterProfile?.includes("prospect") ? "desenvolvimento" : lore.ambition
      },
      scoutNotes: []
    };
    club.scoutNotes = generateClubScoutNotes(club);
    if (sportId === "basquete" && window.TemporadaTotal?.calibrateClubSeed && arguments[0]?.calibrate !== false) {
      const calibratedClub = window.TemporadaTotal.calibrateClubSeed(club, lore, seed);
      calibratedClub.scoutNotes = generateClubScoutNotes(calibratedClub);
      return calibratedClub;
    }
    club.calibrationWarnings = window.TemporadaTotal?.validateClubSeedProfile?.(club, lore) || [];
    return club;
  }

  function generateProceduralBasketballClub(seed = "OLYMPICO-2026", options = {}) {
    const config = window.TemporadaTotal?.BasketballGenerationConfig;
    if (!config) {
      console.warn("[procedural] BasketballGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralClub({
      seed,
      sportId: "basquete",
      config,
      userControlled: options.userControlled !== false,
      calibrate: options.calibrate !== false
    });
  }

  function generateProceduralVolleyballClub(seed = "VOLEI-2026", options = {}) {
    const config = window.TemporadaTotal?.VolleyballGenerationConfig;
    if (!config) {
      console.warn("[procedural] VolleyballGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralClub({
      seed,
      sportId: "volei",
      config,
      userControlled: options.userControlled !== false,
      calibrate: options.calibrate !== false
    });
  }

  function generateProceduralFutsalClub(seed = "FUTSAL-2026", options = {}) {
    const config = window.TemporadaTotal?.FutsalGenerationConfig;
    if (!config) {
      console.warn("[procedural] FutsalGenerationConfig nao foi carregado.");
      return null;
    }
    return generateProceduralClub({
      seed,
      sportId: "futsal",
      config,
      userControlled: options.userControlled !== false,
      calibrate: options.calibrate !== false
    });
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralClubGenerator: {
      generateProceduralClub,
      generateProceduralBasketballClub,
      generateProceduralVolleyballClub,
      generateProceduralFutsalClub,
      getLoresForSport: getLoreDatasets,
      prototypeLores: PROTOTYPE_LORES.slice()
    },
    generateProceduralBasketballClub,
    generateProceduralVolleyballClub,
    generateProceduralFutsalClub
  };
})();
