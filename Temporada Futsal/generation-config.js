(function () {
  const attributes = ["finishing", "passing", "marking", "goalkeeping", "physical", "tactical"];

  const positions = {
    GOL: {
      label: "Goleiro",
      heightRange: [174, 196],
      ageRange: [18, 38],
      attributeBias: { goalkeeping: 1.28, tactical: 1.08, passing: 1.0, physical: 0.96, marking: 0.72, finishing: 0.48 },
      archetypes: ["shot_stopper", "sweeper_keeper", "line_keeper"]
    },
    FIX: {
      label: "Fixo",
      heightRange: [170, 190],
      ageRange: [18, 36],
      attributeBias: { marking: 1.22, tactical: 1.14, passing: 1.04, physical: 1.02, finishing: 0.82, goalkeeping: 0.5 },
      archetypes: ["defensive_anchor", "first_pass", "press_leader"]
    },
    ALA: {
      label: "Ala",
      heightRange: [165, 184],
      ageRange: [17, 34],
      attributeBias: { finishing: 1.08, passing: 1.08, physical: 1.12, tactical: 1.02, marking: 1.0, goalkeeping: 0.48 },
      archetypes: ["one_v_one_wing", "two_way_wing", "transition_runner"]
    },
    PIVO: {
      label: "Pivo",
      heightRange: [172, 192],
      ageRange: [18, 36],
      attributeBias: { finishing: 1.24, physical: 1.12, tactical: 1.04, passing: 0.98, marking: 0.9, goalkeeping: 0.45 },
      archetypes: ["target_pivot", "wall_pivot", "clutch_finisher"]
    }
  };

  const archetypes = [
    {
      id: "shot_stopper",
      label: "Goleiro paredao",
      positions: ["GOL"],
      description: "Sustenta o time em sequencias de finalizacoes e jogos apertados.",
      attributeBias: { goalkeeping: 1.18, tactical: 1.04, physical: 1.02 },
      usageBias: 0.76,
      salaryBias: 1.1,
      scoutTags: ["defesas", "reflexo", "seguranca"]
    },
    {
      id: "sweeper_keeper",
      label: "Goleiro-linha natural",
      positions: ["GOL"],
      description: "Participa da construcao e ajuda a quebrar pressao adversaria.",
      attributeBias: { passing: 1.18, tactical: 1.12, goalkeeping: 1.05 },
      usageBias: 0.86,
      salaryBias: 1.14,
      scoutTags: ["goleiro-linha", "passe", "saida"]
    },
    {
      id: "line_keeper",
      label: "Goleiro de linha baixa",
      positions: ["GOL"],
      description: "Fecha angulos, orienta cobertura e erra pouco.",
      attributeBias: { goalkeeping: 1.14, marking: 1.04, tactical: 1.08 },
      usageBias: 0.72,
      salaryBias: 1.02,
      scoutTags: ["posicionamento", "cobertura", "regularidade"]
    },
    {
      id: "defensive_anchor",
      label: "Fixo de contencao",
      positions: ["FIX"],
      description: "Protege o corredor central e organiza a primeira linha defensiva.",
      attributeBias: { marking: 1.2, tactical: 1.08, physical: 1.04 },
      usageBias: 0.92,
      salaryBias: 1.08,
      scoutTags: ["marcacao", "cobertura", "lideranca"]
    },
    {
      id: "first_pass",
      label: "Fixo construtor",
      positions: ["FIX"],
      description: "Acelera a saida curta e acha alas nas costas da pressao.",
      attributeBias: { passing: 1.18, tactical: 1.12, marking: 1.04 },
      usageBias: 1.02,
      salaryBias: 1.1,
      scoutTags: ["passe", "saida", "leitura"]
    },
    {
      id: "press_leader",
      label: "Lider de pressao",
      positions: ["FIX", "ALA"],
      description: "Ativa a marcacao alta e transforma roubo em chance rapida.",
      attributeBias: { marking: 1.14, physical: 1.1, tactical: 1.04 },
      usageBias: 1.02,
      salaryBias: 1.06,
      scoutTags: ["pressao", "roubo", "intensidade"]
    },
    {
      id: "one_v_one_wing",
      label: "Ala de um contra um",
      positions: ["ALA"],
      description: "Cria vantagem no drible e gera finalizacao sem depender do sistema.",
      attributeBias: { finishing: 1.12, physical: 1.08, passing: 1.02 },
      usageBias: 1.18,
      salaryBias: 1.14,
      scoutTags: ["drible", "volume", "criacao"]
    },
    {
      id: "two_way_wing",
      label: "Ala equilibrado",
      positions: ["ALA"],
      description: "Entrega ida e volta, recompensando sistemas mais agressivos.",
      attributeBias: { marking: 1.08, passing: 1.06, physical: 1.06, finishing: 1.02 },
      usageBias: 1.02,
      salaryBias: 1.08,
      scoutTags: ["equilibrio", "retorno", "encaixe"]
    },
    {
      id: "transition_runner",
      label: "Ala de transicao",
      positions: ["ALA"],
      description: "Ataca espacos, acelera contra-ataques e estica a quadra.",
      attributeBias: { physical: 1.16, finishing: 1.08, marking: 1.02 },
      usageBias: 1.08,
      salaryBias: 1.04,
      scoutTags: ["velocidade", "contra-ataque", "amplitude"]
    },
    {
      id: "target_pivot",
      label: "Pivo referencia",
      positions: ["PIVO"],
      description: "Prende marcadores, gira curto e oferece saida quando a pressao aperta.",
      attributeBias: { finishing: 1.18, physical: 1.12, passing: 1.04 },
      usageBias: 1.16,
      salaryBias: 1.16,
      scoutTags: ["pivo", "parede", "area"]
    },
    {
      id: "wall_pivot",
      label: "Pivo de apoio",
      positions: ["PIVO"],
      description: "Joga de costas, solta alas e ajuda o time a respirar.",
      attributeBias: { passing: 1.14, tactical: 1.1, physical: 1.08 },
      usageBias: 1.04,
      salaryBias: 1.08,
      scoutTags: ["apoio", "assistencia", "retencao"]
    },
    {
      id: "clutch_finisher",
      label: "Finalizador decisivo",
      positions: ["PIVO", "ALA"],
      description: "Assume chutes de pressao e muda partidas em poucos toques.",
      attributeBias: { finishing: 1.2, tactical: 1.04, physical: 1.02 },
      usageBias: 1.22,
      salaryBias: 1.18,
      scoutTags: ["gol", "decisao", "pressao"]
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
    FutsalGenerationConfig: {
      sportId: "futsal",
      attributes,
      positions,
      archetypes,
      strengthTiers,
      defaultGender: "masculino",
      rosterSize: 12,
      rosterPlan: [
        { position: "GOL", strengthTier: "good", role: "starter" },
        { position: "FIX", strengthTier: "good", role: "starter" },
        { position: "ALA", strengthTier: "good", role: "starter" },
        { position: "ALA", strengthTier: "good", role: "starter" },
        { position: "PIVO", strengthTier: "good", role: "starter" },
        { position: "GOL", strengthTier: "normal", role: "rotation" },
        { position: "FIX", strengthTier: "normal", role: "rotation" },
        { position: "ALA", strengthTier: "normal", role: "rotation" },
        { position: "ALA", strengthTier: "normal", role: "rotation" },
        { position: "PIVO", strengthTier: "normal", role: "rotation" },
        { position: "ALA", strengthTier: "prospect", role: "prospect" },
        { position: "FIX", strengthTier: "prospect", role: "prospect" }
      ],
      starterPositions: ["GOL", "FIX", "ALA", "ALA", "PIVO"],
      primaryStats: ["finishing", "passing", "marking", "goalkeeping", "tactical"],
      budget: {
        min: 2.2,
        max: 5.5,
        floor: 1.8,
        ceiling: 7.5
      },
      salary: {
        base: 0.04,
        abilityMultiplier: 0.012,
        potentialMultiplier: 0.004,
        starMultiplier: 0.025,
        starFloorBase: 0.42,
        starFloorStep: 0.05,
        prospectFloorBase: 0.22,
        prospectFloorStep: 0.025,
        min: 0.03,
        max: 1.15
      }
    }
  };
})();
