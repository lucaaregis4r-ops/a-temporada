(function () {
  const attributes = ["threePoint", "physical", "tactical", "technique", "defense"];

  const positions = {
    PG: {
      label: "Armador",
      heightRange: [178, 196],
      ageRange: [17, 34],
      attributeBias: { tactical: 1.15, technique: 1.12, threePoint: 1.05, physical: 0.92, defense: 0.95 },
      archetypes: ["primary_creator", "safe_organizer", "electric_sixth"]
    },
    SG: {
      label: "Ala-armador",
      heightRange: [188, 202],
      ageRange: [17, 34],
      attributeBias: { threePoint: 1.16, technique: 1.08, tactical: 1.02, physical: 0.98, defense: 0.98 },
      archetypes: ["catch_shooter", "primary_creator", "elite_defender", "electric_sixth"]
    },
    SF: {
      label: "Ala",
      heightRange: [196, 208],
      ageRange: [17, 35],
      attributeBias: { physical: 1.05, defense: 1.06, technique: 1.02, tactical: 1.0, threePoint: 1.0 },
      archetypes: ["versatile_wing", "elite_defender", "catch_shooter"]
    },
    PF: {
      label: "Ala-pivo",
      heightRange: [201, 214],
      ageRange: [18, 35],
      attributeBias: { physical: 1.12, defense: 1.08, tactical: 0.98, technique: 0.98, threePoint: 0.86 },
      archetypes: ["versatile_wing", "roll_big", "defensive_anchor", "spacing_big"]
    },
    C: {
      label: "Pivo",
      heightRange: [204, 222],
      ageRange: [18, 36],
      attributeBias: { physical: 1.18, defense: 1.15, technique: 0.95, tactical: 0.96, threePoint: 0.72 },
      archetypes: ["roll_big", "defensive_anchor", "spacing_big"]
    }
  };

  const archetypes = [
    {
      id: "primary_creator",
      label: "Criador primario",
      positions: ["PG", "SG"],
      description: "Organiza posses e cria vantagem com bola na mao.",
      attributeBias: { tactical: 1.1, technique: 1.1, threePoint: 1.03 },
      usageBias: 1.22,
      salaryBias: 1.18,
      scoutTags: ["criacao", "volume", "bola na mao"]
    },
    {
      id: "catch_shooter",
      label: "Arremessador de recepcao",
      positions: ["SG", "SF"],
      description: "Pontua sem prender a bola e pune defesas em rotacao.",
      attributeBias: { threePoint: 1.18, technique: 1.04, physical: 0.96 },
      usageBias: 1.02,
      salaryBias: 1.08,
      scoutTags: ["espacamento", "arremesso", "off-ball"]
    },
    {
      id: "elite_defender",
      label: "Defensor de elite",
      positions: ["SG", "SF", "PF"],
      description: "Marca o melhor jogador rival e sustenta esquemas agressivos.",
      attributeBias: { defense: 1.18, physical: 1.05, tactical: 1.04, threePoint: 0.94 },
      usageBias: 0.92,
      salaryBias: 1.04,
      scoutTags: ["defesa", "versatilidade", "contencao"]
    },
    {
      id: "versatile_wing",
      label: "Ala versatil",
      positions: ["SF", "PF"],
      description: "Conecta quintetos, troca marcacao e ataca closeouts.",
      attributeBias: { defense: 1.08, technique: 1.05, physical: 1.04, tactical: 1.04 },
      usageBias: 1.04,
      salaryBias: 1.12,
      scoutTags: ["ala", "equilibrio", "encaixe"]
    },
    {
      id: "roll_big",
      label: "Pivo de rolagem",
      positions: ["PF", "C"],
      description: "Gera pressao vertical em pick-and-roll e rebote ofensivo.",
      attributeBias: { physical: 1.16, technique: 1.02, defense: 1.02, threePoint: 0.78 },
      usageBias: 1.0,
      salaryBias: 1.0,
      scoutTags: ["garrafao", "rolagem", "rebote"]
    },
    {
      id: "defensive_anchor",
      label: "Ancora defensiva",
      positions: ["PF", "C"],
      description: "Protege o aro e corrige erros da primeira linha.",
      attributeBias: { defense: 1.2, physical: 1.1, tactical: 1.02, threePoint: 0.76 },
      usageBias: 0.88,
      salaryBias: 1.12,
      scoutTags: ["toco", "aro", "cobertura"]
    },
    {
      id: "spacing_big",
      label: "Pivo espacador",
      positions: ["PF", "C"],
      description: "Abre a quadra sem perder tamanho no garrafao.",
      attributeBias: { threePoint: 1.2, tactical: 1.02, technique: 1.02, physical: 0.96 },
      usageBias: 0.96,
      salaryBias: 1.14,
      scoutTags: ["espacamento", "pivo", "pick-and-pop"]
    },
    {
      id: "electric_sixth",
      label: "Sexto homem eletrico",
      positions: ["PG", "SG"],
      description: "Muda ritmo vindo do banco e assume posses em rajadas.",
      attributeBias: { technique: 1.12, threePoint: 1.08, tactical: 0.96, defense: 0.94 },
      usageBias: 1.18,
      salaryBias: 1.02,
      scoutTags: ["banco", "pontuacao", "ritmo"]
    },
    {
      id: "safe_organizer",
      label: "Organizador seguro",
      positions: ["PG"],
      description: "Controla ritmo, perde pouco a bola e entende contexto.",
      attributeBias: { tactical: 1.18, technique: 1.05, defense: 1.0, physical: 0.9 },
      usageBias: 0.95,
      salaryBias: 1.0,
      scoutTags: ["controle", "baixo erro", "lideranca"]
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
    BasketballGenerationConfig: {
      sportId: "basquete",
      attributes,
      positions,
      archetypes,
      strengthTiers,
      defaultGender: "masculino",
      rosterSize: 12,
      budget: {
        min: 8.5,
        max: 18.5,
        floor: 7.5,
        ceiling: 26
      },
      salary: {
        base: 0.16,
        abilityMultiplier: 0.045,
        potentialMultiplier: 0.016,
        starMultiplier: 0.08,
        starFloorBase: 2.2,
        starFloorStep: 0.22,
        prospectFloorBase: 0.9,
        prospectFloorStep: 0.08,
        min: 0.08,
        max: 3.8
      }
    }
  };
})();
