(function () {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function round(value) {
    return Math.round(Number(value) || 0);
  }

  // Sum of uniforms gives a bell-shaped curve without Math.random().
  function randomNormalApprox(rng, mean, sd, min, max) {
    const samples = 6;
    let total = 0;
    for (let index = 0; index < samples; index += 1) {
      total += rng.next();
    }
    const centered = (total / samples - 0.5) * 2;
    return clamp(mean + centered * sd * 2.1, min, max);
  }

  function getDatasets() {
    const datasets = window.TemporadaTotal?.ProceduralDatasets;
    if (!datasets) {
      console.warn("[procedural] ProceduralDatasets nao foi carregado.");
    }
    return datasets;
  }

  function getScouting() {
    const scouting = window.TemporadaTotal?.ProceduralScouting;
    if (!scouting) {
      console.warn("[procedural] ProceduralScouting nao foi carregado.");
    }
    return scouting;
  }

  function pickArchetype(rng, config, position) {
    const all = config.archetypes || [];
    const positionConfig = config.positions?.[position] || {};
    const allowedIds = positionConfig.archetypes || [];
    const candidates = all.filter((item) => item.positions.includes(position) || allowedIds.includes(item.id));
    return rng.pick(candidates.length ? candidates : all);
  }

  function applyModifier(target, key, value) {
    if (value == null) return;
    target[key] = (Number(target[key]) || 0) + Number(value);
  }

  function calculateCurrentAbility(player, config) {
    const attributes = config.attributes || Object.keys(player.attributes || {});
    const values = attributes.map((key) => Number(player.attributes?.[key]) || 0);
    const sorted = values.slice().sort((a, b) => b - a);
    const average = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
    const bestSkills = (sorted[0] + sorted[1]) / 2;
    const roleValue = average * 0.72 + bestSkills * 0.28;
    return round(clamp(roleValue, 35, 99));
  }

  function calculatePotential(player, rng, config) {
    const potentialProfile = player.potentialProfile;
    const profileBonus = (Number(potentialProfile?.modifiers?.potentialBonus) || 0) * 0.55;
    const tierBonus = (Number(config.strengthTiers?.[player.strengthTier]?.potentialBonus) || 0) * 0.75;
    const age = Number(player.age) || 24;
    const youthBonus = age <= 19
      ? randomNormalApprox(rng, 11, 4, 4, 20)
      : age <= 22
        ? randomNormalApprox(rng, 8, 3.2, 2, 16)
        : age <= 25
          ? randomNormalApprox(rng, 5.5, 2.8, 1, 12)
          : age <= 28
            ? randomNormalApprox(rng, 3, 2, 0, 8)
            : randomNormalApprox(rng, 1.2, 1.4, 0, 5);
    const noise = randomNormalApprox(rng, 0, 2.2, -4, 5);
    const rareSpike = rng.chance(age <= 23 ? 0.025 : 0.008) ? rng.int(3, 7) : 0;
    const profileId = potentialProfile?.id || "";
    const ceilingBurst = age <= 22 && profileId === "high_ceiling" && rng.chance(0.5) ? rng.int(4, 8) : 0;
    const lateBurst = age <= 23 && profileId === "late_bloomer" && rng.chance(0.3) ? rng.int(3, 6) : 0;
    let potential = player.currentAbility + youthBonus + profileBonus + tierBonus + noise + rareSpike + ceilingBurst + lateBurst;

    // Rarity gates keep 95+ and 97+ prospects special instead of routine.
    if (potential >= 97 && !rng.chance(0.1)) potential = rng.int(92, 95);
    if (potential >= 95 && !rng.chance(0.18)) potential = rng.int(90, 94);
    if (potential >= 90 && !rng.chance(age <= 23 ? 0.7 : 0.4)) potential = rng.int(Math.max(player.currentAbility, 85), 89);
    if (potential >= 90 && age >= 26 && !rng.chance(0.22)) potential = rng.int(Math.max(player.currentAbility, 84), 89);
    return round(clamp(potential, player.currentAbility, 99));
  }

  function calculateSalary(player, config) {
    const salaryConfig = config.salary || {};
    const ability = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || ability;
    const archetypeBias = Number(player.archetype?.salaryBias) || 1;
    const positionBias = player.pos === "PG" || player.pos === "C" ? 1.04 : player.pos === "SF" ? 1.02 : 1;
    const age = Number(player.age) || 24;
    const base = Number(salaryConfig.base) || 0.12;

    // Current ability is the dominant driver of market value
    const abilityMultiplier = Number(salaryConfig.abilityMultiplier) || 0.042;
    const abilityPart = Math.max(0, ability - 58) * abilityMultiplier;

    // Star bonus kicks in for impact players (80+)
    const starMultiplier = Number(salaryConfig.starMultiplier) || 0.08;
    const starPart = Math.max(0, ability - 80) * starMultiplier;

    // Potential adds a modest premium without inflating rookie wages
    const potentialMultiplier = Number(salaryConfig.potentialMultiplier) || 0.012;
    const potentialBonus = Math.max(0, potential - 78) * potentialMultiplier;
    const prospectDiscount = age <= 22 && ability < 76 ? 0.65 : 1.0;

    // Veteran discount for aging players
    const ageModifier = age >= 33 && ability < 82 ? -0.12 : age >= 30 && ability < 76 ? -0.06 : 0;

    const minSalary = Number(salaryConfig.min) || 0.08;
    const maxSalary = Number(salaryConfig.max) || 3.8;

    let salary = (base + abilityPart + starPart + (potentialBonus * prospectDiscount) + ageModifier) * archetypeBias * positionBias;

    // Star floor for bona fide top-tier performers
    if (ability >= 84) {
      const starFloorBase = salaryConfig.starFloorBase == null ? 2.0 : Number(salaryConfig.starFloorBase);
      const starFloorStep = salaryConfig.starFloorStep == null ? 0.22 : Number(salaryConfig.starFloorStep);
      salary = Math.max(salary, starFloorBase + (ability - 84) * starFloorStep);
    }

    return Number(clamp(salary, minSalary, maxSalary).toFixed(2));
  }

  function buildName(rng, datasets, gender) {
    const firstNames = gender === "feminino" ? datasets.firstNamesFeminine : datasets.firstNamesMasculine;
    return `${rng.pick(firstNames)} ${rng.pick(datasets.lastNames)}`;
  }

  function resolveTierConfig(rng, config, tier) {
    if (tier !== "normal") return { ...(config.strengthTiers?.[tier] || config.strengthTiers?.normal || { mean: 68, sd: 8 }), band: tier };
    const normal = config.strengthTiers?.normal || { mean: 68, sd: 8 };
    const mean = Number(normal.mean) || 68;
    const sd = Number(normal.sd) || 8;
    const roll = rng.next();
    if (roll < 0.08) return { mean: mean - 13, sd: Math.max(4, sd - 2), band: "fringe" };
    if (roll < 0.76) return { mean, sd: sd + 0.5, band: "rotation" };
    if (roll < 0.91) return { mean: mean + 7, sd: Math.max(4, sd - 2), band: "quality" };
    if (roll < 0.993) return { mean: mean + 13.5, sd: Math.max(3, sd - 4), band: "standout" };
    return { mean: mean + 20, sd: 2, band: "rare_star" };
  }

  function getAgeAttributeAdjustment(age, key) {
    if (age <= 19) return key === "tactical" ? -5 : key === "physical" ? -2 : -4;
    if (age <= 22) return key === "tactical" ? -2 : -1;
    if (age <= 24) return 0;
    if (age <= 28) return key === "tactical" || key === "technique" ? 2 : 1;
    if (age <= 32) return key === "physical" ? -2 : key === "tactical" ? 2 : 0;
    return key === "physical" ? -6 : key === "defense" ? -2 : key === "tactical" ? 1 : -1;
  }

  function buildAttributes({ rng, config, positionConfig, archetype, personality, physicalProfile, potentialProfile, tier, age }) {
    const attributes = {};
    const tierConfig = resolveTierConfig(rng, config, tier);

    (config.attributes || []).forEach((key) => {
      const positionBias = Number(positionConfig.attributeBias?.[key]) || 1;
      const archetypeBias = Number(archetype?.attributeBias?.[key]) || 1;
      const raw = randomNormalApprox(rng, tierConfig.mean, tierConfig.sd, 38, 96);
      const specialized = raw * (1 + (positionBias - 1) * 0.62 + (archetypeBias - 1) * 0.72);
      attributes[key] = round(clamp(specialized + getAgeAttributeAdjustment(age, key), 35, 97));
    });

    [personality, physicalProfile, potentialProfile].forEach((profile) => {
      Object.entries(profile?.modifiers || {}).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
          applyModifier(attributes, key, value);
          attributes[key] = round(clamp(attributes[key], 35, 97));
        }
      });
    });

    return { attributes, talentBand: tierConfig.band };
  }

  function generateProceduralPlayer({ rng, sportId, config, position, strengthTier = "normal", index = 0 }) {
    const datasets = getDatasets();
    const scouting = getScouting();
    if (!rng || !config || !datasets || !scouting) {
      throw new Error("[procedural] RNG, config, datasets e scouting sao obrigatorios.");
    }

    const positions = Object.keys(config.positions || {});
    const pos = position || rng.pick(positions);
    const positionConfig = config.positions[pos];
    const gender = config.defaultGender || "masculino";
    const archetype = pickArchetype(rng, config, pos);
    const personality = rng.pick(datasets.personalityProfiles);
    const physicalProfile = rng.pick(datasets.physicalProfiles);
    const potentialProfile = rng.pick(datasets.potentialProfiles);
    const tier = config.strengthTiers?.[strengthTier] ? strengthTier : "normal";
    const age = rng.int(positionConfig.ageRange[0], positionConfig.ageRange[1]);
    const attributeResult = buildAttributes({ rng, config, positionConfig, archetype, personality, physicalProfile, potentialProfile, tier, age });
    const attributes = attributeResult.attributes;
    const player = {
      id: `${sportId || config.sportId || "sport"}-${String(index + 1).padStart(3, "0")}-${rng.int(1000, 9999)}`,
      name: buildName(rng, datasets, gender),
      age,
      gender,
      pos,
      position: pos,
      heightCm: rng.int(positionConfig.heightRange[0], positionConfig.heightRange[1]),
      salary: 0,
      currentAbility: 0,
      potential: 0,
      attributes,
      archetype,
      personality,
      physicalProfile,
      potentialProfile,
      development: clamp(1 + (Number(personality?.modifiers?.development) || 0) + (Number(physicalProfile?.modifiers?.development) || 0) + (Number(potentialProfile?.modifiers?.development) || 0), 0.85, 1.28),
      volatility: clamp(0.38 + rng.float(-0.12, 0.18) + (Number(personality?.modifiers?.volatility) || 0) + (Number(potentialProfile?.modifiers?.volatility) || 0), 0.05, 0.95),
      injuryRisk: clamp(0.1 + rng.float(-0.04, 0.06) + (Number(personality?.modifiers?.injuryRisk) || 0) + (Number(physicalProfile?.modifiers?.injuryRisk) || 0), 0.03, 0.28),
      usage: clamp((Number(archetype?.usageBias) || 1) * rng.float(0.82, 1.18), 0.55, 1.45),
      strengthTier: tier,
      talentBand: attributeResult.talentBand,
      scoutNotes: []
    };

    player.currentAbility = calculateCurrentAbility(player, config);
    if (tier === "normal" && player.currentAbility >= 92 && !rng.chance(0.2)) {
      player.currentAbility = rng.int(89, 91);
    }
    player.potential = calculatePotential(player, rng, config);
    player.salary = calculateSalary(player, config);
    player.tag = archetype?.label || "Prospecto";

    // Root-level fields keep compatibility with the current basketball cards.
    Object.entries(attributes).forEach(([key, value]) => {
      player[key] = value;
    });

    player.scoutNotes = scouting.generatePlayerScoutNotes(player, config);
    player.potentialLabel = scouting.generatePotentialLabel(player);
    player.riskLabel = scouting.generateRiskLabel(player);
    return player;
  }

  function generateProceduralPlayers({ seed, sportId, config, count = 20, strengthTier = "normal" }) {
    if (!window.TemporadaTotal?.createSeededRng) {
      throw new Error("[procedural] createSeededRng nao foi carregado.");
    }
    if (!config) {
      throw new Error("[procedural] Configuracao de modalidade ausente.");
    }

    const rng = window.TemporadaTotal.createSeededRng(seed);
    const positions = Object.keys(config.positions || {});
    return Array.from({ length: count }, (_, index) => generateProceduralPlayer({
      rng,
      sportId: sportId || config.sportId,
      config,
      position: positions[index % positions.length],
      strengthTier,
      index
    }));
  }

  function summarizePlayers(players) {
    return players.map((player) => ({
      name: player.name,
      pos: player.pos,
      age: player.age,
      heightCm: player.heightCm,
      currentAbility: player.currentAbility,
      potential: player.potential,
      salary: player.salary,
      archetype: player.archetype?.label || ""
    }));
  }

  function generateProceduralBasketballPlayers(seed, count = 20) {
    const config = window.TemporadaTotal?.BasketballGenerationConfig;
    if (!config) {
      console.warn("[procedural] BasketballGenerationConfig nao foi carregado.");
      return [];
    }
    const players = generateProceduralPlayers({ seed, sportId: "basquete", config, count, strengthTier: "normal" });
    console.table(summarizePlayers(players));
    return players;
  }

  function debugProceduralPlayers(seed = "TESTE-2026", count = 30) {
    const players = generateProceduralBasketballPlayers(seed, count);
    console.group(`debugProceduralPlayers: ${seed}`);
    players.slice(0, 5).forEach((player) => {
      console.log(`${player.name} (${player.pos})`, player.scoutNotes);
    });
    console.groupEnd();
    return players;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralPlayerGenerator: {
      randomNormalApprox,
      clamp,
      round,
      calculateCurrentAbility,
      calculatePotential,
      calculateSalary,
      generateProceduralPlayer,
      generateProceduralPlayers
    },
    generateProceduralBasketballPlayers,
    debugProceduralPlayers
  };
})();
