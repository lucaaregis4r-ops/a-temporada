(function () {
  const attributes = ["serve", "attack", "block", "reception", "setting", "defense", "physical", "tactical"];

  const positions = {
    LEV: {
      label: "Levantador",
      heightRange: [178, 198],
      ageRange: [18, 36],
      attributeBias: { setting: 1.22, tactical: 1.14, defense: 1.02, serve: 1.0, reception: 0.9, attack: 0.82, block: 0.88, physical: 0.94 },
      archetypes: ["maestro", "fast_setter", "defensive_setter"]
    },
    OPP: {
      label: "Oposto",
      heightRange: [190, 212],
      ageRange: [18, 34],
      attributeBias: { attack: 1.2, physical: 1.1, serve: 1.08, block: 1.03, tactical: 1.0, defense: 0.92, reception: 0.78, setting: 0.72 },
      archetypes: ["power_opposite", "clutch_scorer", "serve_weapon"]
    },
    PON: {
      label: "Ponteiro",
      heightRange: [186, 205],
      ageRange: [17, 34],
      attributeBias: { attack: 1.08, reception: 1.12, defense: 1.06, serve: 1.03, physical: 1.0, tactical: 1.0, block: 0.98, setting: 0.78 },
      archetypes: ["two_way_wing", "passing_anchor", "high_volume_attacker"]
    },
    CEN: {
      label: "Central",
      heightRange: [195, 218],
      ageRange: [18, 35],
      attributeBias: { block: 1.22, attack: 1.08, physical: 1.12, tactical: 1.02, serve: 0.96, defense: 0.82, reception: 0.7, setting: 0.68 },
      archetypes: ["block_wall", "quick_middle", "physical_middle"]
    },
    LIB: {
      label: "Libero",
      heightRange: [168, 188],
      ageRange: [18, 37],
      attributeBias: { reception: 1.24, defense: 1.22, tactical: 1.08, physical: 0.94, serve: 0.72, attack: 0.58, block: 0.5, setting: 0.9 },
      archetypes: ["reception_general", "dig_specialist", "calm_libero"]
    }
  };

  const archetypes = [
    {
      id: "maestro",
      label: "Maestro da distribuicao",
      positions: ["LEV"],
      description: "Controla ritmo, distribui volume e acelera quando a recepcao permite.",
      attributeBias: { setting: 1.16, tactical: 1.1, defense: 1.02 },
      usageBias: 1.05,
      salaryBias: 1.14,
      scoutTags: ["levantamento", "controle", "ritmo"]
    },
    {
      id: "fast_setter",
      label: "Levantador veloz",
      positions: ["LEV"],
      description: "Busca bolas rapidas e coloca centrais no jogo.",
      attributeBias: { setting: 1.1, tactical: 1.08, physical: 1.04 },
      usageBias: 1.03,
      salaryBias: 1.08,
      scoutTags: ["velocidade", "central", "criacao"]
    },
    {
      id: "defensive_setter",
      label: "Levantador defensivo",
      positions: ["LEV"],
      description: "Da estabilidade em rallies longos e erra pouco.",
      attributeBias: { defense: 1.12, tactical: 1.08, setting: 1.06 },
      usageBias: 0.96,
      salaryBias: 1.02,
      scoutTags: ["defesa", "seguranca", "baixo erro"]
    },
    {
      id: "power_opposite",
      label: "Oposto de potencia",
      positions: ["OPP"],
      description: "Resolve bolas quebradas com forca e volume.",
      attributeBias: { attack: 1.18, physical: 1.1, serve: 1.04 },
      usageBias: 1.24,
      salaryBias: 1.2,
      scoutTags: ["ataque", "volume", "bola alta"]
    },
    {
      id: "clutch_scorer",
      label: "Pontuador decisivo",
      positions: ["OPP", "PON"],
      description: "Cresce em fim de set e assume rallies de pressao.",
      attributeBias: { attack: 1.12, tactical: 1.06, serve: 1.03 },
      usageBias: 1.18,
      salaryBias: 1.16,
      scoutTags: ["decisao", "virada", "pressao"]
    },
    {
      id: "serve_weapon",
      label: "Arma de saque",
      positions: ["OPP", "PON", "CEN"],
      description: "Quebra passes adversarios com saque agressivo.",
      attributeBias: { serve: 1.18, attack: 1.04, physical: 1.03 },
      usageBias: 1.04,
      salaryBias: 1.08,
      scoutTags: ["saque", "pressao", "sequencia"]
    },
    {
      id: "two_way_wing",
      label: "Ponteiro completo",
      positions: ["PON"],
      description: "Equilibra recepcao, ataque e defesa sem tirar volume do sistema.",
      attributeBias: { reception: 1.1, attack: 1.08, defense: 1.06 },
      usageBias: 1.08,
      salaryBias: 1.15,
      scoutTags: ["equilibrio", "passe", "ataque"]
    },
    {
      id: "passing_anchor",
      label: "Pilar de passe",
      positions: ["PON", "LIB"],
      description: "Sustenta a linha de recepcao e protege o levantador.",
      attributeBias: { reception: 1.18, defense: 1.1, tactical: 1.04 },
      usageBias: 0.94,
      salaryBias: 1.06,
      scoutTags: ["recepcao", "estabilidade", "linha de passe"]
    },
    {
      id: "high_volume_attacker",
      label: "Atacante de volume",
      positions: ["PON"],
      description: "Pontua muito, mas exige sistema preparado para cobrir erros.",
      attributeBias: { attack: 1.16, physical: 1.05, reception: 0.94 },
      usageBias: 1.2,
      salaryBias: 1.12,
      scoutTags: ["volume", "ataque", "oscilacao"]
    },
    {
      id: "block_wall",
      label: "Parede de bloqueio",
      positions: ["CEN"],
      description: "Fecha a rede e altera decisoes do ataque rival.",
      attributeBias: { block: 1.2, tactical: 1.05, physical: 1.04 },
      usageBias: 0.92,
      salaryBias: 1.1,
      scoutTags: ["bloqueio", "rede", "intimidacao"]
    },
    {
      id: "quick_middle",
      label: "Central rapido",
      positions: ["CEN"],
      description: "Ataca bolas rapidas e acelera o sistema pelo meio.",
      attributeBias: { attack: 1.12, block: 1.08, physical: 1.05 },
      usageBias: 1.0,
      salaryBias: 1.08,
      scoutTags: ["meio", "bola rapida", "tempo"]
    },
    {
      id: "physical_middle",
      label: "Central fisico",
      positions: ["CEN"],
      description: "Impoe altura e presenca, mesmo com menos refinamento tecnico.",
      attributeBias: { physical: 1.16, block: 1.12, attack: 1.04 },
      usageBias: 0.96,
      salaryBias: 1.06,
      scoutTags: ["fisico", "altura", "presenca"]
    },
    {
      id: "reception_general",
      label: "General da recepcao",
      positions: ["LIB"],
      description: "Organiza a primeira bola e reduz correria do sistema.",
      attributeBias: { reception: 1.18, defense: 1.1, tactical: 1.08 },
      usageBias: 0.86,
      salaryBias: 1.02,
      scoutTags: ["recepcao", "organizacao", "controle"]
    },
    {
      id: "dig_specialist",
      label: "Especialista em defesa",
      positions: ["LIB"],
      description: "Mantem rallies vivos e muda o emocional do set.",
      attributeBias: { defense: 1.2, reception: 1.08, physical: 1.02 },
      usageBias: 0.84,
      salaryBias: 1.0,
      scoutTags: ["defesa", "rally", "cobertura"]
    },
    {
      id: "calm_libero",
      label: "Libero sereno",
      positions: ["LIB"],
      description: "Entrega estabilidade e pouca oscilacao em jogos tensos.",
      attributeBias: { tactical: 1.12, reception: 1.1, defense: 1.08 },
      usageBias: 0.82,
      salaryBias: 0.98,
      scoutTags: ["calma", "passe", "baixo erro"]
    }
  ];

  const strengthTiers = {
    low: { mean: 66, sd: 4 },
    normal: { mean: 74, sd: 4 },
    good: { mean: 78, sd: 3.5 },
    elite: { mean: 83, sd: 3 },
    prospect: { mean: 68, sd: 4, potentialBonus: 14 }
  };

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    VolleyballGenerationConfig: {
      sportId: "volei",
      attributes,
      positions,
      archetypes,
      strengthTiers,
      defaultGender: "masculino",
      rosterSize: 14,
      rosterPlan: [
        { position: "LEV", strengthTier: "good", role: "starter" },
        { position: "OPP", strengthTier: "good", role: "starter" },
        { position: "PON", strengthTier: "good", role: "starter" },
        { position: "PON", strengthTier: "good", role: "starter" },
        { position: "CEN", strengthTier: "good", role: "starter" },
        { position: "CEN", strengthTier: "good", role: "starter" },
        { position: "LIB", strengthTier: "good", role: "starter" },
        { position: "LEV", strengthTier: "normal", role: "rotation" },
        { position: "OPP", strengthTier: "normal", role: "rotation" },
        { position: "PON", strengthTier: "normal", role: "rotation" },
        { position: "CEN", strengthTier: "normal", role: "rotation" },
        { position: "LIB", strengthTier: "normal", role: "rotation" },
        { position: "PON", strengthTier: "prospect", role: "prospect" },
        { position: "CEN", strengthTier: "prospect", role: "prospect" }
      ],
      starterPositions: ["LEV", "OPP", "PON", "PON", "CEN", "CEN", "LIB"],
      primaryStats: ["serve", "attack", "block", "reception", "setting", "defense"],
      budget: {
        min: 7.5,
        max: 16.5,
        floor: 6.5,
        ceiling: 24
      },
      salary: {
        base: 0.12,
        abilityMultiplier: 0.035,
        potentialMultiplier: 0.014,
        starMultiplier: 0.06,
        starFloorBase: 1.45,
        starFloorStep: 0.18,
        prospectFloorBase: 0.65,
        prospectFloorStep: 0.07,
        min: 0.06,
        max: 3.2
      }
    }
  };
})();
