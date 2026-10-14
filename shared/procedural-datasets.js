(function () {
  const ProceduralDatasets = {
    firstNamesMasculine: [
      "Andre", "Bruno", "Caio", "Danilo", "Eduardo", "Felipe", "Gustavo", "Henrique",
      "Igor", "Joao", "Lucas", "Mateus", "Nicolas", "Otavio", "Pedro", "Rafael",
      "Samuel", "Thiago", "Vitor", "Yuri"
    ],
    firstNamesFeminine: [
      "Aline", "Bianca", "Camila", "Diana", "Ester", "Fernanda", "Gabriela", "Helena",
      "Isadora", "Julia", "Larissa", "Marina", "Natalia", "Paula", "Renata", "Sofia",
      "Taina", "Valentina", "Yasmin", "Zoe"
    ],
    lastNames: [
      "Almeida", "Barbosa", "Cardoso", "Duarte", "Freitas", "Gomes", "Lima", "Martins",
      "Melo", "Nogueira", "Oliveira", "Pereira", "Ramos", "Rocha", "Santos", "Silva",
      "Souza", "Tavares", "Vieira", "Xavier"
    ],
    cities: [
      "Belo Horizonte", "Campinas", "Curitiba", "Fortaleza", "Goiania", "Manaus",
      "Porto Alegre", "Recife", "Rio de Janeiro", "Salvador", "Sao Paulo", "Vitoria"
    ],
    basketballCities: [
      "Bauru", "Belo Horizonte", "Brasilia", "Campinas", "Caxias do Sul", "Curitiba",
      "Duque de Caxias", "Fortaleza", "Franca", "Joinville", "Mogi das Cruzes", "Natal",
      "Niteroi", "Osasco", "Porto Alegre", "Recife", "Ribeirao Preto", "Rio Claro",
      "Rio de Janeiro", "Salvador", "Sao Jose dos Campos", "Sao Paulo", "Uberlandia", "Vitoria"
    ],
    volleyballCities: [
      "Americana", "Aracaju", "Balneario Camboriu", "Barueri", "Belo Horizonte", "Betim",
      "Blumenau", "Brasilia", "Cabo Frio", "Campinas", "Canoas", "Chapeco",
      "Contagem", "Criciuma", "Curitiba", "Diadema", "Florianopolis", "Fortaleza",
      "Goiania", "Guarulhos", "Itajai", "Jaragua do Sul", "Joao Pessoa", "Joinville",
      "Juiz de Fora", "Londrina", "Maceio", "Maringa", "Montes Claros", "Natal",
      "Niteroi", "Nova Friburgo", "Osasco", "Petropolis", "Piracicaba", "Ponta Grossa",
      "Porto Alegre", "Praia Grande", "Recife", "Ribeirao Preto", "Rio de Janeiro",
      "Santo Andre", "Sao Bernardo", "Sao Caetano", "Sao Jose dos Campos", "Sao Luis",
      "Sao Paulo", "Sorocaba", "Taubate", "Teresina", "Uberlandia", "Vila Velha", "Vitoria"
    ],
    futsalCities: [
      "Apucarana", "Balneario Camboriu", "Barueri", "Belo Horizonte", "Blumenau", "Brasilia",
      "Cascavel", "Chapeco", "Curitiba", "Erechim", "Fortaleza", "Foz do Iguacu",
      "Francisco Beltrao", "Goiania", "Jaragua do Sul", "Joinville", "Jundiai", "Londrina",
      "Magnus", "Marau", "Maringa", "Natal", "Pato Branco", "Recife",
      "Rio de Janeiro", "Santo Andre", "Sao Bernardo", "Sao Jose dos Campos", "Sao Paulo", "Sorocaba",
      "Taubate", "Tubarao", "Umuarama", "Venancio Aires"
    ],
    teamPrefixes: [
      "Atletico", "Capital", "Central", "Dynamo", "Estrela", "Imperial", "Litoral",
      "Metropolitano", "Olimpico", "Real", "Uniao", "Vanguarda"
    ],
    basketballTeamPrefixes: [
      "Atletico", "Capital", "Central", "Dynamo", "Estrela", "Federal", "Imperial",
      "Litoral", "Metropolitano", "Olimpico", "Real", "Uniao", "Vanguarda"
    ],
    volleyballTeamPrefixes: [
      "Arena", "Atletico", "Central", "Clube", "Costa", "Estrela", "Fundacao",
      "Litoral", "Metropolitano", "Nautico", "Olimpico", "Praia", "Serra",
      "Uniao", "Vale", "Vanguarda", "Volei"
    ],
    futsalTeamPrefixes: [
      "Arena", "Atletico", "Capital", "Central", "Clube", "Estrela", "Futsal",
      "Ginasio", "Litoral", "Metropolitano", "Olimpico", "Real", "Serra",
      "Tricolor", "Uniao", "Vanguarda"
    ],
    teamSuffixes: [
      "Basquete", "Clube", "Dragons", "Estrelas", "Furia", "Lobos", "Panteras",
      "Tropa", "Vikings", "Warriors"
    ],
    basketballTeamSuffixes: [
      "Basquete", "Clube", "Dragons", "Estrelas", "Furia", "Lobos", "Panteras",
      "Tropa", "Vikings", "Warriors"
    ],
    volleyballTeamSuffixes: [
      "Volei", "Clube", "Rede", "Saque", "Bloqueio", "Aces", "Torres",
      "Praia", "Mar", "Serra", "Vale", "Furia", "Estrelas", "Panteras",
      "Levantadores", "Centrais", "Ponteiras", "Tropa"
    ],
    futsalTeamSuffixes: [
      "Futsal", "Clube", "Quadra", "Goleadores", "Alas", "Pivos", "Muralha",
      "Pressao", "Tropa", "Furia", "Estrelas", "Leoes", "Panteras", "Raizes"
    ],
    personalityProfiles: [
      {
        id: "leader",
        label: "Lider sereno",
        description: "Estabiliza o grupo e responde bem a pressao.",
        modifiers: { tactical: 2, volatility: -0.1, development: 0.03 },
        traits: ["leader", "stable"]
      },
      {
        id: "competitor",
        label: "Competidor intenso",
        description: "Eleva o nivel em jogos grandes, mas cobra muito de si.",
        modifiers: { defense: 1, physical: 1, volatility: 0.08 },
        traits: ["clutch", "intense"]
      },
      {
        id: "student",
        label: "Aluno de jogo",
        description: "Aprende rapido e aceita ajustes tecnicos.",
        modifiers: { tactical: 1, technique: 1, development: 0.06 },
        traits: ["learner", "coach-friendly"]
      },
      {
        id: "streaky",
        label: "Talento oscilante",
        description: "Tem lampejos fortes, mas alterna noites boas e ruins.",
        modifiers: { technique: 2, volatility: 0.18 },
        traits: ["streaky", "creative"]
      },
      {
        id: "professional",
        label: "Profissional confiavel",
        description: "Entrega rotina, preparo e baixa manutencao.",
        modifiers: { volatility: -0.08, injuryRisk: -0.02 },
        traits: ["stable", "professional"]
      }
    ],
    physicalProfiles: [
      {
        id: "explosive",
        label: "Explosivo",
        description: "Tem vantagem fisica em transicao e contato.",
        modifiers: { physical: 4, injuryRisk: 0.02 }
      },
      {
        id: "durable",
        label: "Duravel",
        description: "Aguenta carga alta e se recupera bem.",
        modifiers: { physical: 1, injuryRisk: -0.05 }
      },
      {
        id: "fluid",
        label: "Movimento fluido",
        description: "Coordena bem corpo e bola em espacos curtos.",
        modifiers: { technique: 2, physical: 1 }
      },
      {
        id: "raw",
        label: "Fisico bruto",
        description: "Tem ferramentas fisicas acima da tecnica atual.",
        modifiers: { physical: 5, technique: -2, tactical: -1, development: 0.02 }
      },
      {
        id: "limited",
        label: "Fisico limitado",
        description: "Precisa compensar com leitura e fundamentos.",
        modifiers: { physical: -3, tactical: 2, injuryRisk: 0.01 }
      }
    ],
    potentialProfiles: [
      {
        id: "late_bloomer",
        label: "Evolucao tardia",
        description: "Pode crescer mais depois de ganhar minutos reais.",
        modifiers: { potentialBonus: 6, development: 0.05, volatility: 0.04 }
      },
      {
        id: "high_floor",
        label: "Piso alto",
        description: "Ja entrega cedo, com menos margem de salto.",
        modifiers: { currentBonus: 4, potentialBonus: 2, volatility: -0.05 }
      },
      {
        id: "high_ceiling",
        label: "Teto alto",
        description: "Ainda cru, mas com ferramentas para virar destaque.",
        modifiers: { currentBonus: -2, potentialBonus: 11, development: 0.08, volatility: 0.08 }
      },
      {
        id: "steady",
        label: "Progressao estavel",
        description: "Tende a evoluir em passos pequenos e consistentes.",
        modifiers: { potentialBonus: 4, development: 0.03, volatility: -0.03 }
      },
      {
        id: "near_peak",
        label: "Perto do auge",
        description: "Perfil mais pronto, com crescimento limitado.",
        modifiers: { currentBonus: 3, potentialBonus: -1, development: -0.01 }
      }
    ]
  };

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralDatasets
  };
})();
