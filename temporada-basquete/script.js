const SAVE_STORAGE_KEY = "temporada-total-basquete-v2";
const CUSTOM_CONFIG_STORAGE_KEY = "temporada-total-basquete-custom-config-v1";
const USER_TEAM_ID = "franchise";

const ROTATION_WEIGHTS = {
  short: [1, 1, 0.96, 0.93, 0.9, 0.45, 0.32, 0.22],
  normal: [1, 0.98, 0.95, 0.91, 0.88, 0.66, 0.58, 0.48],
  deep: [0.96, 0.94, 0.91, 0.89, 0.86, 0.74, 0.68, 0.6]
};

const defaultTactics = {
  pace: "balanced",
  shot: "balanced",
  rebound: "balanced",
  defense: "balanced",
  rotation: "normal"
};

const SIMULATION_EASE_VALUES = {
  "muito-dificil": -4.5,
  dificil: -2.2,
  normal: 0,
  facil: 2.2,
  "muito-facil": 4.5,
  favoravel: 2.2,
  "muito-favoravel": 4.5
};

const PLAYER_USAGE_LEVELS = [
  { value: 0.7, label: "Muito baixo" },
  { value: 0.85, label: "Baixo" },
  { value: 1, label: "Equilibrado" },
  { value: 1.15, label: "Alto" },
  { value: 1.3, label: "Muito alto" }
];

const DEFAULT_PLAYER_USAGE = {
  PG: 1.05,
  SG: 1.15,
  SF: 1,
  PF: 0.9,
  C: 0.88
};

const MANAGEMENT_BASELINE = 70;
const TRAINING_PROGRESS_CAP_RATIO = 0.1;
const STAFF_BUDGET_CAP = 18;
const STAFF_OPTIONS = {
  physio: {
    shortLabel: "Fisio",
    levels: {
      0: { cost: 0, label: "Sem contrato" },
      1: { cost: 3, label: "Base" },
      2: { cost: 6, label: "Elite" }
    }
  },
  conditioning: {
    shortLabel: "Prep.",
    levels: {
      0: { cost: 0, label: "Sem contrato" },
      1: { cost: 3, label: "Base" },
      2: { cost: 6, label: "Elite" }
    }
  },
  assistant: {
    shortLabel: "Aux.",
    levels: {
      0: { cost: 0, label: "Sem contrato" },
      1: { cost: 2, label: "Base" },
      2: { cost: 5, label: "Elite" }
    }
  },
  analyst: {
    shortLabel: "Analista",
    levels: {
      0: { cost: 0, label: "Sem contrato" },
      1: { cost: 2, label: "Base" },
      2: { cost: 4, label: "Elite" }
    }
  },
  psychologist: {
    shortLabel: "Psico",
    levels: {
      0: { cost: 0, label: "Sem contrato" },
      1: { cost: 2, label: "Base" },
      2: { cost: 4, label: "Elite" }
    }
  },
  doctor: {
    shortLabel: "Médico",
    levels: {
      0: { cost: 0, label: "Sem contrato" },
      1: { cost: 4, label: "Base" },
      2: { cost: 7, label: "Elite" }
    }
  }
};

const managementActionTemplates = [
  {
    key: "talk-star",
    label: "Conversar com a referencia",
    description: "Reforca leitura e controle emocional do eixo principal do time.",
    weightLabel: "Peso alto em confianca, clutch e disciplina",
    changes: { confidence: 6, chemistry: 1, focus: 2, intensity: -1 },
    modifiers: [
      { key: "technique", amount: 2, duration: 2 },
      { key: "tactical", amount: 1, duration: 2 }
    ],
    morale: 2
  },
  {
    key: "defensive-demand",
    label: "Cobrar defesa e foco",
    description: "Aumenta a atencao competitiva, mas deixa o ambiente mais pesado.",
    weightLabel: "Peso alto em defesa, risco de desgaste emocional",
    changes: { confidence: -1, chemistry: -3, focus: 5, intensity: 5 },
    modifiers: [
      { key: "defense", amount: 3, duration: 2 },
      { key: "physical", amount: 1, duration: 1 }
    ],
    morale: -1
  },
  {
    key: "team-bonding",
    label: "Fortalecer o grupo",
    description: "Trabalha comunicacao, sacrificio defensivo e estabilidade de temporada.",
    weightLabel: "Peso alto em entrosamento e constancia",
    changes: { confidence: 1, chemistry: 6, focus: 2, intensity: -2 },
    modifiers: [
      { key: "tactical", amount: 2, duration: 2 },
      { key: "defense", amount: 2, duration: 2 }
    ],
    morale: 3
  },
  {
    key: "targeted-training",
    label: "Treino especifico",
    description: "Bloco extra em cima do foco semanal, com ganho tecnico e carga controlada.",
    weightLabel: "Peso medio-alto no fundamento treinado",
    changes: { confidence: 0, chemistry: 0, focus: 4, intensity: 3 },
    dynamicTraining: true,
    morale: 1
  }
];

const psychologyProfiles = [
  { name: "Lider sereno", summary: "estabiliza o grupo e cresce sob pressao", confidence: 3, chemistry: 3, focus: 2, intensity: 0, clutch: 2.4, volatility: -1.4, recovery: 1.1, traits: ["leader", "stable"] },
  { name: "Competidor obsessivo", summary: "sobe o teto competitivo, mas cobra energia mental", confidence: 2, chemistry: -1, focus: 3, intensity: 3, clutch: 1.7, volatility: 0.8, recovery: -0.7, traits: ["intense"] },
  { name: "Talento instavel", summary: "oscila junto com a moral e pede gestao constante", confidence: -1, chemistry: -2, focus: -1, intensity: 1, clutch: 0.5, volatility: 2.7, recovery: -0.4, traits: ["volatile"] },
  { name: "Operario disciplinado", summary: "segura a rotacao e reduz panes coletivas", confidence: 1, chemistry: 2, focus: 3, intensity: 1, clutch: 1.1, volatility: -0.8, recovery: 0.8, traits: ["stable"] },
  { name: "Frio decisivo", summary: "cresce em final apertado, mas se isola quando perde", confidence: 2, chemistry: -1, focus: 2, intensity: 0, clutch: 3, volatility: 1, recovery: 0.1, traits: ["clutch"] },
  { name: "Motor emocional", summary: "contagia o time para cima ou para baixo", confidence: 1, chemistry: 1, focus: 0, intensity: 2, clutch: 1, volatility: 1.8, recovery: 0.2, traits: ["emotional"] },
  { name: "General de quadra", summary: "organiza companheiros e melhora tomada de decisao", confidence: 2, chemistry: 3, focus: 3, intensity: 0, clutch: 1.6, volatility: -0.6, recovery: 0.4, traits: ["leader", "organizer"] },
  { name: "Provocador", summary: "eleva rivalidade e energia, mas pode rachar ambiente", confidence: 1, chemistry: -2, focus: 0, intensity: 4, clutch: 1.2, volatility: 1.5, recovery: -0.3, traits: ["intense", "volatile"] },
  { name: "Mentor de vestiario", summary: "acalma jovens e melhora conexao da rotacao", confidence: 1, chemistry: 4, focus: 2, intensity: -1, clutch: 1, volatility: -1.2, recovery: 0.8, traits: ["leader", "mentor"] },
  { name: "Pontuador silencioso", summary: "produz sem alarde e decide sem precisar da bola toda hora", confidence: 2, chemistry: 0, focus: 3, intensity: 0, clutch: 2.5, volatility: -0.2, recovery: 0.2, traits: ["clutch", "stable"] },
  { name: "Jovem ansioso", summary: "tem energia, mas sente sequencias ruins", confidence: -1, chemistry: 0, focus: -1, intensity: 2, clutch: 0.2, volatility: 2, recovery: 0.1, traits: ["young", "volatile"] },
  { name: "Conector de grupo", summary: "faz pequenas coisas e conecta unidades diferentes", confidence: 1, chemistry: 4, focus: 2, intensity: 1, clutch: 0.9, volatility: -0.9, recovery: 0.7, traits: ["connector", "stable"] },
  { name: "Estrela exigente", summary: "puxa nivel tecnico, mas cobra protagonismo", confidence: 3, chemistry: -2, focus: 1, intensity: 2, clutch: 2.2, volatility: 1.1, recovery: -0.2, traits: ["star", "intense"] },
  { name: "Especialista frio", summary: "aceita papel curto e entrega em momentos especificos", confidence: 1, chemistry: 1, focus: 3, intensity: -1, clutch: 2, volatility: -0.4, recovery: 0.5, traits: ["specialist", "stable"] },
  { name: "Sobrevivente", summary: "responde bem a derrotas e desgaste de calendario", confidence: 0, chemistry: 1, focus: 2, intensity: 1, clutch: 1.3, volatility: -1, recovery: 1.6, traits: ["resilient"] }
];

const technicalProfiles = [
  { name: "Criador primario", summary: "precisa da bola e melhora geracao de vantagem", threePoint: 1, physical: 0, tactical: 2, technique: 3, defense: -1, pace: 1, spacing: 0, finishing: 1, traits: ["creator", "ball-dominant"] },
  { name: "Arremessador de recepcao", summary: "abre a quadra quando joga com bons passadores", threePoint: 4, physical: -1, tactical: 1, technique: 1, defense: -1, spacing: 3, finishing: -1, traits: ["shooter", "offball"] },
  { name: "Arremessador defensor", summary: "encaixa facil ao redor de estrelas e protege o perimetro", threePoint: 2, physical: 1, tactical: 1, technique: 0, defense: 3, spacing: 2, perimeterDefense: 2, traits: ["shooter", "defender", "offball"] },
  { name: "Pivo de rolagem", summary: "vive de transicao, rebote e ponte aerea", threePoint: -3, physical: 4, tactical: 0, technique: 0, defense: 1, pace: 2, rebounding: 2, finishing: 3, traits: ["roller", "athletic"] },
  { name: "Ancora defensiva", summary: "muda arremessos e sustenta sistemas conservadores", threePoint: -2, physical: 3, tactical: 1, technique: -1, defense: 4, interiorDefense: 4, rebounding: 2, traits: ["defender", "anchor"] },
  { name: "Maestro de pick-and-roll", summary: "potencializa finalizadores e arremessadores", threePoint: 1, physical: -1, tactical: 4, technique: 3, defense: -1, pace: 1, traits: ["creator", "organizer"] },
  { name: "Pontuador de isolamento", summary: "resolve posses travadas, mas pode congelar o ataque", threePoint: 2, physical: 1, tactical: -1, technique: 4, defense: -1, finishing: 2, traits: ["scorer", "ball-dominant"] },
  { name: "Reboteiro fisico", summary: "gera segunda chance e aguenta contato", threePoint: -2, physical: 4, tactical: 0, technique: -1, defense: 2, rebounding: 4, traits: ["rebounder", "physical"] },
  { name: "Passador secundario", summary: "mantem a bola viva sem exigir protagonismo", threePoint: 1, physical: 0, tactical: 3, technique: 2, defense: 0, spacing: 1, traits: ["connector", "offball"] },
  { name: "Defensor de elite", summary: "apaga vantagem rival e aceita missao dura", threePoint: -1, physical: 2, tactical: 2, technique: -1, defense: 5, perimeterDefense: 3, traits: ["defender", "stopper"] },
  { name: "Pivo espacador", summary: "puxa marcador alto para fora e abre infiltracao", threePoint: 3, physical: 1, tactical: 1, technique: 1, defense: 0, spacing: 3, rebounding: 0, traits: ["shooter", "big"] },
  { name: "Sexto homem eletrico", summary: "muda ritmo vindo do banco e aceita volume alto", threePoint: 2, physical: 1, tactical: -1, technique: 3, defense: -1, pace: 2, traits: ["scorer", "bench"] },
  { name: "Organizador seguro", summary: "reduz erros e melhora execucao de meia quadra", threePoint: 0, physical: -1, tactical: 4, technique: 2, defense: 1, traits: ["organizer", "stable-role"] },
  { name: "Cortador sem bola", summary: "vive de movimento e pune defesas distraidas", threePoint: 0, physical: 2, tactical: 2, technique: 1, defense: 1, finishing: 2, traits: ["offball", "cutter"] },
  { name: "Ala versatil", summary: "encaixa em varias funcoes sem pico extremo", threePoint: 1, physical: 1, tactical: 2, technique: 1, defense: 2, spacing: 1, finishing: 1, traits: ["versatile", "connector"] }
];

const trainingPlans = {
  shooting: {
    label: "Arremesso",
    description: "Refina leitura de espaco e aproveitamento do perimetro.",
    progress: { threePoint: 1, technique: 0.7, tactical: 0.2, physical: 0, defense: 0 },
    modifier: { key: "shooting", amount: 2, duration: 2 }
  },
  strength: {
    label: "Forca e contato",
    description: "Aumenta presenca fisica e disputa de rebote no corpo.",
    progress: { threePoint: 0, technique: 0, tactical: 0.2, physical: 1, defense: 0.6 },
    modifier: { key: "physical", amount: 2, duration: 2 }
  },
  tactics: {
    label: "Leitura tatica",
    description: "Organiza cobertura, troca e execucao em meia quadra.",
    progress: { threePoint: 0, technique: 0.2, tactical: 1, physical: 0, defense: 0.4 },
    modifier: { key: "tactical", amount: 2, duration: 2 }
  },
  skill: {
    label: "Refino tecnico",
    description: "Melhora fundamentos, controle e finalizacao.",
    progress: { threePoint: 0.4, technique: 1, tactical: 0.2, physical: 0, defense: 0 },
    modifier: { key: "technique", amount: 2, duration: 2 }
  },
  recovery: {
    label: "Recuperacao",
    description: "Reduz desgaste e ajuda a equipe a sustentar o calendario.",
    progress: { threePoint: 0, technique: 0, tactical: 0, physical: 0.6, defense: 0.2 },
    modifier: { key: "recovery", amount: 3, duration: 2 }
  }
};

const decisionTemplates = [
  {
    title: "Treino extra de bola de 3",
    text: "A comissao quer acelerar o espaçamento antes da proxima sequencia.",
    choices: [
      { label: "Liberar volume", effect: "3PT +4 por 2 jogos, fisico -1 por 1 jogo", modifiers: [{ key: "shooting", amount: 4, duration: 2 }, { key: "physical", amount: -1, duration: 1 }] },
      { label: "Manter carga normal", effect: "Sem mudancas", modifiers: [] }
    ]
  },
  {
    title: "Video pesado de scout",
    text: "O grupo pode estudar o rival a fundo, mas isso cobra energia mental.",
    choices: [
      { label: "Estudar forte", effect: "Tatica +4 por 2 jogos, tecnica -1 por 1 jogo", modifiers: [{ key: "tactical", amount: 4, duration: 2 }, { key: "technique", amount: -1, duration: 1 }] },
      { label: "Sessao curta", effect: "Tatica +1 por 1 jogo", modifiers: [{ key: "tactical", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Discurso antes da sequencia fora",
    text: "Voce pode blindar o vestiario ou aumentar a pressao competitiva.",
    choices: [
      { label: "Blindar o grupo", effect: "Moral +4 por 3 jogos", modifiers: [{ key: "morale", amount: 4, duration: 3 }] },
      { label: "Cobrar forte", effect: "Defesa +3 por 2 jogos, moral -2 por 2 jogos", modifiers: [{ key: "defense", amount: 3, duration: 2 }, { key: "morale", amount: -2, duration: 2 }] }
    ]
  },
  {
    title: "Rotacao mais aberta",
    text: "Dar mais minutos ao banco pode aliviar o desgaste ou tirar ritmo dos titulares.",
    choices: [
      { label: "Abrir a rotacao", effect: "Fisico +3 por 2 jogos, tecnica -1 por 1 jogo", modifiers: [{ key: "physical", amount: 3, duration: 2 }, { key: "technique", amount: -1, duration: 1 }] },
      { label: "Seguir curto", effect: "Ataque +2 por 1 jogo", modifiers: [{ key: "technique", amount: 2, duration: 1 }] }
    ]
  }
];

decisionTemplates.push(
  {
    title: "Sequencia com rival direto",
    text: "O proximo adversario esta colado na tabela. A comissao quer preparar um plano especifico.",
    choices: [
      { label: "Plano anti-estrela", effect: "Defesa +4 por 1 jogo, ataque/tecnica -1 por 1 jogo", modifiers: [{ key: "defense", amount: 4, duration: 1 }, { key: "technique", amount: -1, duration: 1 }] },
      { label: "Confiar no nosso jogo", effect: "Moral +2 por 2 jogos", modifiers: [{ key: "morale", amount: 2, duration: 2 }] }
    ]
  },
  {
    title: "Titular pediu menos minutos",
    text: "O corpo esta cobrando a carga. Forcar agora pode render, mas aumenta o risco de queda fisica.",
    choices: [
      { label: "Preservar", effect: "Fisico +3 por 2 jogos, tecnica -2 por 1 jogo", modifiers: [{ key: "physical", amount: 3, duration: 2 }, { key: "technique", amount: -2, duration: 1 }] },
      { label: "Manter alta carga", effect: "Tecnica +3 por 1 jogo, fisico -2 por 2 jogos", modifiers: [{ key: "technique", amount: 3, duration: 1 }, { key: "physical", amount: -2, duration: 2 }] }
    ]
  },
  {
    title: "Adversarios leram sua defesa",
    text: "Os scouts da liga ja perceberam seus padroes de cobertura.",
    choices: [
      { label: "Mudar coberturas", effect: "Tatica +4 por 2 jogos, defesa -1 por 1 jogo", modifiers: [{ key: "tactical", amount: 4, duration: 2 }, { key: "defense", amount: -1, duration: 1 }] },
      { label: "Aumentar agressividade", effect: "Defesa +3 por 1 jogo, fisico -2 por 1 jogo", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "physical", amount: -2, duration: 1 }] }
    ]
  },
  {
    title: "Banco quer papel maior",
    text: "Reservas estao treinando bem e pedem mais espaco.",
    choices: [
      { label: "Abrir espaco", effect: "Fisico +2 e moral +2", modifiers: [{ key: "physical", amount: 2, duration: 2 }, { key: "morale", amount: 2, duration: 2 }] },
      { label: "Fechar rotacao", effect: "Tecnica +2, moral -2", modifiers: [{ key: "technique", amount: 2, duration: 1 }, { key: "morale", amount: -2, duration: 2 }] }
    ]
  },
  {
    title: "Semana de arremesso irregular",
    text: "O aproveitamento caiu nos treinos e o elenco sente a pressao.",
    choices: [
      { label: "Treino de repeticao", effect: "3PT +3 por 2 jogos, fisico -1", modifiers: [{ key: "shooting", amount: 3, duration: 2 }, { key: "physical", amount: -1, duration: 1 }] },
      { label: "Simplificar ataque", effect: "Tatica +2 e tecnica +1 por 1 jogo", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "technique", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Pressao da torcida",
    text: "A arena cobra resposta depois de uma atuacao sem energia.",
    choices: [
      { label: "Comprar a pressao", effect: "Moral +3, clutch + via foco", modifiers: [{ key: "morale", amount: 3, duration: 2 }, { key: "tactical", amount: 1, duration: 1 }] },
      { label: "Blindar elenco", effect: "Defesa +2, moral +1", modifiers: [{ key: "defense", amount: 2, duration: 1 }, { key: "morale", amount: 1, duration: 2 }] }
    ]
  },
  {
    title: "Viagem desgastante",
    text: "A logistica ficou ruim e a recuperacao perdeu qualidade.",
    choices: [
      { label: "Cortar treino", effect: "Fisico +3, tatica -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "tactical", amount: -1, duration: 1 }] },
      { label: "Treinar mesmo assim", effect: "Tatica +2, fisico -2", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "physical", amount: -2, duration: 1 }] }
    ]
  },
  {
    title: "Oponente vai dobrar no seu melhor jogador",
    text: "O scout adversario promete tirar sua principal referencia do jogo.",
    choices: [
      { label: "Usar como isca", effect: "Tatica +3 e tecnica +2 por 1 jogo", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "technique", amount: 2, duration: 1 }] },
      { label: "Forcar estrela", effect: "Tecnica +4, defesa -2", modifiers: [{ key: "technique", amount: 4, duration: 1 }, { key: "defense", amount: -2, duration: 1 }] }
    ]
  }
);

decisionTemplates.push(
  {
    title: "Cobertura do pick-and-roll exposta",
    text: "Os ultimos jogos mostraram dificuldade para conter o handler no primeiro drible.",
    choices: [
      { label: "Trocar mais cedo", effect: "Defesa +3, rebote/ fisico -1", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] },
      { label: "Subir no bloqueio", effect: "Tatica +2, tecnica +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "technique", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Banco pedindo quinteto misto",
    text: "A comissao cogita misturar criacao com energia para segurar o ritmo quando a segunda unidade entra.",
    choices: [
      { label: "Testar mistura", effect: "Tatica +2, moral +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] },
      { label: "Seguir papeis fixos", effect: "Tecnica +2, fisico -1", modifiers: [{ key: "technique", amount: 2, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Arbitragem marcando pouco contato no aro",
    text: "A rodada promete mais liberdade no garrafao e menos apito em choque no drive.",
    choices: [
      { label: "Atacar a cesta", effect: "Fisico +2, tecnica +2", modifiers: [{ key: "physical", amount: 2, duration: 1 }, { key: "technique", amount: 2, duration: 1 }] },
      { label: "Punir de fora", effect: "3PT +2, tatica +1", modifiers: [{ key: "shooting", amount: 2, duration: 1 }, { key: "tactical", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Estrela pedindo descanso parcial",
    text: "Sua principal referencia quer uma carga menor de bola por uma rodada para chegar melhor no fim.",
    choices: [
      { label: "Redistribuir volume", effect: "Moral +2, tatica +2", modifiers: [{ key: "morale", amount: 2, duration: 1 }, { key: "tactical", amount: 2, duration: 1 }] },
      { label: "Manter hierarquia", effect: "Tecnica +3, moral -1", modifiers: [{ key: "technique", amount: 3, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] }
    ]
  }
);

decisionTemplates.push(
  {
    title: "Arbitragem deixando contato",
    text: "A tendencia da rodada e deixar o jogo fisico. O plano pode explorar isso ou evitar faltas.",
    choices: [
      { label: "Bater primeiro", effect: "Fisico +3, defesa +1, tecnica -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "defense", amount: 1, duration: 1 }, { key: "technique", amount: -1, duration: 1 }] },
      { label: "Jogar limpo e rapido", effect: "Tecnica +2, tatica +2", modifiers: [{ key: "technique", amount: 2, duration: 1 }, { key: "tactical", amount: 2, duration: 1 }] }
    ]
  },
  {
    title: "O treino perdeu intensidade",
    text: "A semana ficou morna e a comissao quer uma resposta imediata.",
    choices: [
      { label: "Cobrar forte", effect: "Defesa +3, moral -1", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] },
      { label: "Recuperar confianca", effect: "Moral +2, tecnica +1", modifiers: [{ key: "morale", amount: 2, duration: 2 }, { key: "technique", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Rival pequeno e veloz",
    text: "O adversario vem com quinteto baixo, muita troca e transicao.",
    choices: [
      { label: "Punir no garrafao", effect: "Fisico +3, 3PT -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "shooting", amount: -1, duration: 1 }] },
      { label: "Igualar velocidade", effect: "Tatica +2, tecnica +2", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "technique", amount: 2, duration: 1 }] }
    ]
  },
  {
    title: "Rival alto no garrafao",
    text: "O proximo jogo deve cobrar arremesso e espacamento.",
    choices: [
      { label: "Abrir quadra", effect: "3PT +4, fisico -1", modifiers: [{ key: "shooting", amount: 4, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] },
      { label: "Brigar no rebote", effect: "Fisico +2, defesa +2", modifiers: [{ key: "physical", amount: 2, duration: 1 }, { key: "defense", amount: 2, duration: 1 }] }
    ]
  },
  {
    title: "Estrela em ma fase",
    text: "A referencia tecnica errou muito no ultimo jogo e pediu respaldo.",
    choices: [
      { label: "Dar liberdade", effect: "Tecnica +3, moral +1", modifiers: [{ key: "technique", amount: 3, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] },
      { label: "Dividir criacao", effect: "Tatica +3, tecnica -1", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "technique", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Reserva quente nos treinos",
    text: "Um jogador de rotacao esta pedindo passagem com desempenho real.",
    choices: [
      { label: "Dar minutos", effect: "Moral +2, fisico +1", modifiers: [{ key: "morale", amount: 2, duration: 1 }, { key: "physical", amount: 1, duration: 1 }] },
      { label: "Manter hierarquia", effect: "Tatica +2, moral -1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Sequencia de jogos apertados",
    text: "O elenco esta vivendo finais tensos e a cabeca pesa.",
    choices: [
      { label: "Treinar clutch", effect: "Moral +2, tatica +1", modifiers: [{ key: "morale", amount: 2, duration: 2 }, { key: "tactical", amount: 1, duration: 1 }] },
      { label: "Descomprimir", effect: "Fisico +2, tecnica -1", modifiers: [{ key: "physical", amount: 2, duration: 1 }, { key: "technique", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Scout apontou falha no pick-and-roll",
    text: "A defesa esta cedendo vantagem no primeiro bloqueio.",
    choices: [
      { label: "Trocar tudo", effect: "Defesa +3, fisico -1", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] },
      { label: "Cobertura conservadora", effect: "Tatica +3, defesa +1", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "defense", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Treino aberto para torcida",
    text: "O ambiente pode energizar o grupo ou virar distracao.",
    choices: [
      { label: "Abrir as portas", effect: "Moral +3, foco/tatica -1", modifiers: [{ key: "morale", amount: 3, duration: 1 }, { key: "tactical", amount: -1, duration: 1 }] },
      { label: "Fechar treino", effect: "Tatica +2, moral +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Noite de back-to-back",
    text: "Sem tempo de recuperar, a decisao e entre perna e plano.",
    choices: [
      { label: "Poupar energia", effect: "Fisico +3, defesa -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] },
      { label: "Plano ultra especifico", effect: "Tatica +4, fisico -2", modifiers: [{ key: "tactical", amount: 4, duration: 1 }, { key: "physical", amount: -2, duration: 1 }] }
    ]
  },
  {
    title: "Rival vive crise interna",
    text: "Ha chance de atacar cedo, mas excesso de confiança pode custar caro.",
    choices: [
      { label: "Pressionar desde o inicio", effect: "Defesa +3, moral +1", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] },
      { label: "Evitar salto alto", effect: "Tatica +2, tecnica +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "technique", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Ataque travou contra zona",
    text: "A ultima defesa por zona deixou o time sem ritmo.",
    choices: [
      { label: "Mais bola de 3", effect: "3PT +3, tecnica +1", modifiers: [{ key: "shooting", amount: 3, duration: 1 }, { key: "technique", amount: 1, duration: 1 }] },
      { label: "Atacar o meio", effect: "Tatica +3, fisico +1", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "physical", amount: 1, duration: 1 }] }
    ]
  }
);

const BASE_DECISION_TEMPLATE_COUNT = decisionTemplates.length;

const DIVISIONS = {
  masculino: {
    label: "Basquete masculino",
    rosterSize: 8,
    salaryCap: 120,
    heightRange: { min: 178, max: 221 },
    market: [
      { id: 1, name: "Rafael Monteiro", pos: "PG", salary: 29, heightCm: 188, threePoint: 91, physical: 83, tactical: 88, technique: 90, defense: 72, tag: "Armador criativo", pool: "pro", development: 1.02 },
      { id: 2, name: "Caio Velasquez", pos: "SG", salary: 25, heightCm: 196, threePoint: 89, physical: 84, tactical: 80, technique: 87, defense: 77, tag: "Pontuador puro", pool: "pro", development: 1.01 },
      { id: 3, name: "Davi Torres", pos: "SF", salary: 22, heightCm: 203, threePoint: 78, physical: 82, tactical: 84, technique: 82, defense: 84, tag: "Ala completo", pool: "pro", development: 1.02 },
      { id: 4, name: "Bruno Salles", pos: "PF", salary: 24, heightCm: 208, threePoint: 70, physical: 90, tactical: 81, technique: 78, defense: 90, tag: "Ancora defensiva", pool: "pro", development: 1.01 },
      { id: 5, name: "Thiago Prado", pos: "C", salary: 27, heightCm: 216, threePoint: 62, physical: 92, tactical: 78, technique: 80, defense: 92, tag: "Protetor de aro", pool: "pro", development: 1.01 },
      { id: 6, name: "Leandro Cruz", pos: "PG", salary: 18, heightCm: 185, threePoint: 82, physical: 78, tactical: 86, technique: 83, defense: 70, tag: "Motor do banco", pool: "pro", development: 1.05 },
      { id: 7, name: "Murilo Nunes", pos: "SG", salary: 16, heightCm: 193, threePoint: 86, physical: 79, tactical: 78, technique: 79, defense: 76, tag: "Especialista de 3", pool: "pro", development: 1.05 },
      { id: 8, name: "Pedro Azevedo", pos: "SF", salary: 14, heightCm: 201, threePoint: 76, physical: 81, tactical: 84, technique: 74, defense: 82, tag: "Ala versatil", pool: "pro", development: 1.05 },
      { id: 9, name: "Igor Batista", pos: "PF", salary: 13, heightCm: 206, threePoint: 68, physical: 86, tactical: 77, technique: 71, defense: 79, tag: "Energia e rebote", pool: "pro", development: 1.05 },
      { id: 10, name: "Samuel Reis", pos: "C", salary: 11, heightCm: 213, threePoint: 58, physical: 88, tactical: 75, technique: 68, defense: 83, tag: "Pivo de rotacao", pool: "pro", development: 1.05 },
      { id: 11, name: "Vinicius Lago", pos: "PG", salary: 9, heightCm: 183, threePoint: 73, physical: 72, tactical: 90, technique: 74, defense: 67, tag: "Organizador", pool: "pro", development: 1.08 },
      { id: 12, name: "Matheus Vidal", pos: "SG", salary: 8, heightCm: 191, threePoint: 81, physical: 74, tactical: 72, technique: 77, defense: 64, tag: "Micro-ondas", pool: "pro", development: 1.08 },
      { id: 13, name: "Nicolas Barreto", pos: "PG", salary: 4, heightCm: 184, threePoint: 70, physical: 67, tactical: 74, technique: 73, defense: 62, tag: "Base veloz", pool: "base", development: 1.24 },
      { id: 14, name: "Heitor Moura", pos: "SG", salary: 4, heightCm: 193, threePoint: 74, physical: 69, tactical: 68, technique: 75, defense: 61, tag: "Pontuador da base", pool: "base", development: 1.22 },
      { id: 15, name: "Yuri Santana", pos: "SF", salary: 5, heightCm: 201, threePoint: 69, physical: 72, tactical: 71, technique: 70, defense: 72, tag: "Ala de projeto", pool: "base", development: 1.2 },
      { id: 16, name: "Miguel Guerra", pos: "PF", salary: 4, heightCm: 206, threePoint: 61, physical: 76, tactical: 67, technique: 66, defense: 73, tag: "Big de energia", pool: "base", development: 1.21 },
      { id: 17, name: "Arthur Paiva", pos: "C", salary: 5, heightCm: 214, threePoint: 50, physical: 79, tactical: 69, technique: 63, defense: 76, tag: "Pivo de longo prazo", pool: "base", development: 1.23 },
      { id: 18, name: "Theo Camara", pos: "SG", salary: 3, heightCm: 190, threePoint: 78, physical: 65, tactical: 65, technique: 71, defense: 58, tag: "Arremessador puro", pool: "base", development: 1.26 }
    ],
    opponents: [
      { id: "oncas", name: "Oncas de Sao Paulo", style: "transicao agressiva", heightCm: 200, threePoint: 80, physical: 83, tactical: 79, technique: 78, defense: 77 },
      { id: "corsarios", name: "Corsarios do Rio", style: "pressao na bola", heightCm: 198, threePoint: 76, physical: 87, tactical: 76, technique: 75, defense: 84 },
      { id: "trovao", name: "Trovao de Brasilia", style: "jogo rapido", heightCm: 197, threePoint: 83, physical: 79, tactical: 77, technique: 80, defense: 73 },
      { id: "lobos", name: "Lobos de Curitiba", style: "meia quadra disciplinada", heightCm: 201, threePoint: 74, physical: 78, tactical: 88, technique: 77, defense: 81 },
      { id: "guaras", name: "Guaras de Fortaleza", style: "muita infiltracao", heightCm: 198, threePoint: 71, physical: 85, tactical: 75, technique: 81, defense: 76 },
      { id: "meteoros", name: "Meteoros de Recife", style: "espacamento moderno", heightCm: 199, threePoint: 86, physical: 74, tactical: 82, technique: 81, defense: 72 },
      { id: "ferro", name: "Ferro de Belo Horizonte", style: "garrafao pesado", heightCm: 208, threePoint: 68, physical: 90, tactical: 76, technique: 73, defense: 86 },
      { id: "aurora", name: "Aurora de Manaus", style: "rotacao longa", heightCm: 198, threePoint: 75, physical: 80, tactical: 84, technique: 76, defense: 79 },
      { id: "falcao", name: "Falcao de Porto Alegre", style: "bola de 3 e paciencia", heightCm: 197, threePoint: 84, physical: 76, tactical: 86, technique: 79, defense: 74 },
      { id: "serras", name: "Serras de Goiania", style: "defesa com troca", heightCm: 201, threePoint: 73, physical: 82, tactical: 80, technique: 74, defense: 83 },
      { id: "mares", name: "Mares de Salvador", style: "ataque cadenciado", heightCm: 199, threePoint: 77, physical: 75, tactical: 89, technique: 82, defense: 75 },
      { id: "caetes", name: "Caetes de Belem", style: "rebote e contato", heightCm: 206, threePoint: 67, physical: 88, tactical: 74, technique: 71, defense: 82 },
      { id: "granito", name: "Granito de Vitoria", style: "jogo fisico", heightCm: 204, threePoint: 72, physical: 86, tactical: 75, technique: 73, defense: 80 },
      { id: "oceano", name: "Oceano de Santos", style: "meia quadra tecnica", heightCm: 197, threePoint: 79, physical: 74, tactical: 87, technique: 82, defense: 76 },
      { id: "altitude", name: "Altitude de Goias", style: "muito ritmo", heightCm: 200, threePoint: 81, physical: 78, tactical: 77, technique: 78, defense: 75 }
    ]
  },
  feminino: {
    label: "Basquete feminino",
    rosterSize: 8,
    salaryCap: 100,
    heightRange: { min: 168, max: 205 },
    market: [
      { id: 101, name: "Julia Ramos", pos: "PG", salary: 24, heightCm: 177, threePoint: 88, physical: 76, tactical: 90, technique: 89, defense: 75, tag: "Armadora de leitura", pool: "pro", development: 1.03 },
      { id: 102, name: "Camila Dantas", pos: "SG", salary: 22, heightCm: 183, threePoint: 87, physical: 79, tactical: 82, technique: 86, defense: 76, tag: "Pontuadora de volume", pool: "pro", development: 1.02 },
      { id: 103, name: "Larissa Moura", pos: "SF", salary: 20, heightCm: 188, threePoint: 79, physical: 80, tactical: 84, technique: 82, defense: 84, tag: "Ala two-way", pool: "pro", development: 1.03 },
      { id: 104, name: "Paula Nery", pos: "PF", salary: 20, heightCm: 192, threePoint: 68, physical: 88, tactical: 80, technique: 77, defense: 89, tag: "Forca no garrafao", pool: "pro", development: 1.02 },
      { id: 105, name: "Bianca Castro", pos: "C", salary: 23, heightCm: 198, threePoint: 58, physical: 90, tactical: 78, technique: 79, defense: 91, tag: "Pivô protetora", pool: "pro", development: 1.01 },
      { id: 106, name: "Marina Salles", pos: "PG", salary: 15, heightCm: 175, threePoint: 81, physical: 73, tactical: 87, technique: 84, defense: 71, tag: "Organizadora de ritmo", pool: "pro", development: 1.05 },
      { id: 107, name: "Renata Luz", pos: "SG", salary: 14, heightCm: 181, threePoint: 84, physical: 76, tactical: 76, technique: 80, defense: 73, tag: "Micro-ondas do banco", pool: "pro", development: 1.05 },
      { id: 108, name: "Helena Porto", pos: "SF", salary: 13, heightCm: 186, threePoint: 75, physical: 79, tactical: 83, technique: 74, defense: 81, tag: "Ala versatil", pool: "pro", development: 1.05 },
      { id: 109, name: "Aline Torres", pos: "PF", salary: 12, heightCm: 191, threePoint: 66, physical: 84, tactical: 78, technique: 70, defense: 78, tag: "Energia e rebote", pool: "pro", development: 1.06 },
      { id: 110, name: "Sofia Prado", pos: "C", salary: 10, heightCm: 197, threePoint: 53, physical: 86, tactical: 74, technique: 67, defense: 82, tag: "Pivo de rotacao", pool: "pro", development: 1.06 },
      { id: 111, name: "Taina Ribeiro", pos: "PG", salary: 8, heightCm: 174, threePoint: 72, physical: 70, tactical: 89, technique: 74, defense: 67, tag: "Controle e calma", pool: "pro", development: 1.08 },
      { id: 112, name: "Clara Vidal", pos: "SG", salary: 7, heightCm: 180, threePoint: 80, physical: 72, tactical: 72, technique: 76, defense: 63, tag: "Especialista de perimetro", pool: "pro", development: 1.08 },
      { id: 113, name: "Livia Barreto", pos: "PG", salary: 4, heightCm: 173, threePoint: 69, physical: 66, tactical: 75, technique: 73, defense: 61, tag: "Base de projeto", pool: "base", development: 1.24 },
      { id: 114, name: "Valentina Paes", pos: "SG", salary: 4, heightCm: 179, threePoint: 73, physical: 68, tactical: 69, technique: 75, defense: 60, tag: "Criadora jovem", pool: "base", development: 1.23 },
      { id: 115, name: "Nina Araujo", pos: "SF", salary: 5, heightCm: 185, threePoint: 68, physical: 71, tactical: 73, technique: 71, defense: 72, tag: "Ala de potencial", pool: "base", development: 1.21 },
      { id: 116, name: "Isadora Melo", pos: "PF", salary: 4, heightCm: 190, threePoint: 60, physical: 75, tactical: 68, technique: 66, defense: 73, tag: "Big de energia", pool: "base", development: 1.22 },
      { id: 117, name: "Ester Farias", pos: "C", salary: 5, heightCm: 196, threePoint: 49, physical: 78, tactical: 70, technique: 63, defense: 76, tag: "Projeto de longo prazo", pool: "base", development: 1.24 },
      { id: 118, name: "Maya Costa", pos: "SG", salary: 3, heightCm: 178, threePoint: 77, physical: 64, tactical: 66, technique: 72, defense: 58, tag: "Arremessadora jovem", pool: "base", development: 1.27 }
    ],
    opponents: [
      { id: "aurora", name: "Aurora de Sao Paulo", style: "espacamento e leitura", heightCm: 184, threePoint: 81, physical: 79, tactical: 84, technique: 83, defense: 80 },
      { id: "centelha", name: "Centelha do Rio", style: "transicao agressiva", heightCm: 182, threePoint: 83, physical: 78, tactical: 79, technique: 81, defense: 75 },
      { id: "torres", name: "Torres de Campinas", style: "garrafao forte", heightCm: 189, threePoint: 72, physical: 86, tactical: 78, technique: 75, defense: 84 },
      { id: "mares", name: "Mares de Salvador", style: "meia quadra paciente", heightCm: 183, threePoint: 77, physical: 74, tactical: 88, technique: 82, defense: 76 },
      { id: "horizonte", name: "Horizonte de Curitiba", style: "defesa de troca", heightCm: 185, threePoint: 74, physical: 80, tactical: 81, technique: 77, defense: 83 },
      { id: "trovao", name: "Trovao de Brasilia", style: "ritmo alto", heightCm: 184, threePoint: 82, physical: 77, tactical: 76, technique: 79, defense: 73 },
      { id: "granito", name: "Granito de Vitoria", style: "contato constante", heightCm: 188, threePoint: 69, physical: 87, tactical: 74, technique: 72, defense: 82 },
      { id: "portof", name: "Porto de Recife", style: "muita ajuda defensiva", heightCm: 183, threePoint: 75, physical: 76, tactical: 84, technique: 80, defense: 81 },
      { id: "brisa", name: "Brisa de Fortaleza", style: "pontuar cedo no relogio", heightCm: 182, threePoint: 80, physical: 75, tactical: 77, technique: 81, defense: 74 },
      { id: "oceano", name: "Oceano de Santos", style: "circulacao de bola", heightCm: 181, threePoint: 78, physical: 73, tactical: 87, technique: 83, defense: 77 },
      { id: "norte", name: "Norte de Manaus", style: "rotacao longa", heightCm: 183, threePoint: 74, physical: 78, tactical: 83, technique: 76, defense: 79 },
      { id: "serras", name: "Serras de Goiania", style: "muita contestacao", heightCm: 186, threePoint: 73, physical: 81, tactical: 79, technique: 74, defense: 84 },
      { id: "impulso", name: "Impulso de Bauru", style: "pressao no perimetro", heightCm: 184, threePoint: 79, physical: 76, tactical: 78, technique: 78, defense: 78 },
      { id: "ilha", name: "Ilha de Floripa", style: "jogo tecnico", heightCm: 180, threePoint: 76, physical: 72, tactical: 89, technique: 84, defense: 78 },
      { id: "impacto", name: "Impacto de Natal", style: "ataque em ondas", heightCm: 183, threePoint: 81, physical: 74, tactical: 77, technique: 80, defense: 75 }
    ]
  }
};

function createScoutingState() {
  return {
    spent: 0,
    discoveredIds: [],
    reports: []
  };
}

function normalizeScoutingState(scouting) {
  return {
    ...createScoutingState(),
    ...(scouting || {}),
    discoveredIds: Array.isArray(scouting?.discoveredIds) ? scouting.discoveredIds : [],
    reports: Array.isArray(scouting?.reports) ? scouting.reports : []
  };
}

function getProfileIndex(seed) {
  return Math.abs(seed) % psychologyProfiles.length;
}

function getTechnicalProfileIndex(seed) {
  return Math.abs(seed) % technicalProfiles.length;
}

function getCompatibleTechnicalProfiles(player) {
  const positionRules = {
    PG: ["creator", "organizer", "ball-dominant", "stable-role", "connector"],
    SG: ["shooter", "scorer", "offball", "creator", "bench"],
    SF: ["versatile", "defender", "offball", "connector", "cutter", "shooter"],
    PF: ["big", "rebounder", "physical", "defender", "versatile", "roller"],
    C: ["anchor", "roller", "big", "rebounder", "physical", "defender"]
  };
  const allowedTraits = positionRules[player.pos] || [];
  const compatible = technicalProfiles.filter((profile) =>
    profile.traits.some((trait) => allowedTraits.includes(trait))
  );
  return compatible.length ? compatible : technicalProfiles;
}

function attachPsychology(player) {
  const profile = psychologyProfiles[getProfileIndex(player.id + player.salary + player.heightCm)];
  const compatibleProfiles = getCompatibleTechnicalProfiles(player);
  const technicalProfile = compatibleProfiles[getTechnicalProfileIndex(player.id * 3 + player.salary + player.heightCm) % compatibleProfiles.length];
  return {
    ...player,
    psychology: profile,
    psychologyLabel: profile.name,
    psychologySummary: profile.summary,
    technicalProfile,
    technicalLabel: technicalProfile.name,
    technicalSummary: technicalProfile.summary,
    origin: player.origin || "Brasil",
    scoutType: player.scoutType || null
  };
}

const traitLabels = {
  leader: "lideranca", stable: "constancia", intense: "intensidade", volatile: "oscilacao",
  clutch: "decisao", emotional: "energia emocional", organizer: "organizacao", mentor: "mentoria",
  connector: "conexao", star: "protagonismo", specialist: "especialista", resilient: "resiliencia",
  young: "desenvolvimento", creator: "criacao", "ball-dominant": "volume com bola", shooter: "chute",
  offball: "movimento sem bola", defender: "defesa", athletic: "atletismo", anchor: "protecao de aro",
  rebounder: "rebote", physical: "contato", big: "jogo interno", bench: "impacto vindo do banco",
  "stable-role": "funcao segura", scorer: "pontuacao", cutter: "cortes"
};

function getTraitLabels(traits = []) {
  return traits.map((trait) => traitLabels[trait] || trait).slice(0, 4);
}

function renderPlayerProfileLine(player) {
  return `${player.tag} | ${player.origin} | Mental: ${player.psychologyLabel} (${getTraitLabels(player.psychology?.traits).join(", ")}) | Perfil: ${player.technicalLabel} (${getTraitLabels(player.technicalProfile?.traits).join(", ")})`;
}

function renderPlayerProfileDetails(player) {
  return `
    <div class="player-meta">Mental ${player.psychologyLabel}: ${player.psychologySummary}. Caracteristicas: ${getTraitLabels(player.psychology?.traits).join(", ")}.</div>
    <div class="player-meta">Perfil ${player.technicalLabel}: ${player.technicalSummary}. Tendencias: ${getTraitLabels(player.technicalProfile?.traits).join(", ")}.</div>
  `;
}

function countRosterTraits(sourceKey, traits) {
  const selected = getSelectedPlayers();
  return selected.filter((player) => traits.some((trait) => (player[sourceKey]?.traits || []).includes(trait))).length;
}

function getProfileDecisionTemplates() {
  const templates = [];
  if (countRosterTraits("psychology", ["leader", "mentor"]) >= 2) {
    templates.push({
      title: "Lideres pedem voz no plano",
      text: "As principais referencias do elenco querem conduzir uma conversa antes da proxima sequencia.",
      choices: [
        { label: "Dar voz aos lideres", effect: "Moral +2, tatica +2", modifiers: [{ key: "morale", amount: 2, duration: 1 }, { key: "tactical", amount: 2, duration: 2 }] },
        { label: "Centralizar na comissao", effect: "Foco +2, confianca -1", modifiers: [{ key: "defense", amount: 2, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] }
      ]
    });
  }
  if (countRosterTraits("psychology", ["volatile", "emotional"]) >= 2) {
    templates.push({
      title: "Vestiario oscilando",
      text: "A energia emocional do grupo esta alta. Isso pode virar combustivel ou ansiedade.",
      choices: [
        { label: "Baixar a temperatura", effect: "Moral +2, intensidade - controlada", modifiers: [{ key: "morale", amount: 2, duration: 2 }, { key: "tactical", amount: 1, duration: 1 }] },
        { label: "Usar como pressao competitiva", effect: "Defesa +3, fisico -1", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] }
      ]
    });
  }
  if (countRosterTraits("technicalProfile", ["shooter", "offball"]) >= 3) {
    templates.push({
      title: "Elenco pede mais volume de chute",
      text: "Os especialistas sem bola estao encontrando espaco e querem uma noite de mais arremessos.",
      choices: [
        { label: "Abrir o perimetro", effect: "3PT +3, defesa -1", modifiers: [{ key: "shooting", amount: 3, duration: 2 }, { key: "defense", amount: -1, duration: 1 }] },
        { label: "Manter selecao de arremesso", effect: "Tecnica +2, tatica +1", modifiers: [{ key: "technique", amount: 2, duration: 1 }, { key: "tactical", amount: 1, duration: 1 }] }
      ]
    });
  }
  if (countRosterTraits("technicalProfile", ["anchor", "rebounder", "big"]) >= 2) {
    templates.push({
      title: "Plano pesado no garrafao",
      text: "Os jogadores de interior querem castigar contato e rebote ofensivo.",
      choices: [
        { label: "Jogar grande", effect: "Fisico +3, 3PT -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "shooting", amount: -1, duration: 1 }] },
        { label: "Usar como isca", effect: "Tatica +3, tecnica +1", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "technique", amount: 1, duration: 1 }] }
      ]
    });
  }
  return templates;
}

function buildExpandedBasketballMarket(divisionKey, config) {
  const intlNames = divisionKey === "masculino"
    ? ["Milan Petrovic", "Tyrese Coleman", "Diego Urrutia", "Tomasz Zielinski", "Facundo Rojas", "Liam O'Connor"]
    : ["Sofia Markovic", "Jade Coleman", "Valeria Suarez", "Klara Nowak", "Martina Ruiz", "Nia O'Connor"];
  const scoutNames = divisionKey === "masculino"
    ? ["Kaique Nobre", "Enzo Falcao", "Bryan Xavier", "Darlan Pinto", "Gael Rezende", "Noah Batista"]
    : ["Yasmin Nobre", "Emilly Falcao", "Bruna Xavier", "Duda Pinto", "Gaia Rezende", "Noa Batista"];
  const intlOrigins = ["Servia", "Estados Unidos", "Uruguai", "Polonia", "Argentina", "Irlanda"];
  const visiblePlayers = config.market.map(attachPsychology);
  const proBases = visiblePlayers.filter((player) => player.pool === "pro");
  const baseBases = visiblePlayers.filter((player) => player.pool === "base");

  const makeClone = (base, id, name, pool, origin, salaryShift, devShift, statShift, scoutType = null) => attachPsychology({
    ...base,
    id,
    name,
    pool,
    origin,
    scoutType,
    salary: clamp(roundStat(base.salary + salaryShift), 4, 36),
    development: Number((base.development + devShift).toFixed(2)),
    threePoint: clamp(roundStat(base.threePoint + (statShift.threePoint || 0)), 45, 97),
    physical: clamp(roundStat(base.physical + (statShift.physical || 0)), 50, 96),
    tactical: clamp(roundStat(base.tactical + (statShift.tactical || 0)), 52, 97),
    technique: clamp(roundStat(base.technique + (statShift.technique || 0)), 50, 97),
    defense: clamp(roundStat(base.defense + (statShift.defense || 0)), 50, 97),
    heightCm: clamp(roundStat(base.heightCm + (statShift.heightCm || 0)), config.heightRange.min, config.heightRange.max),
    tag: `${pool === "intl" ? "Gringo" : "Scout"} | ${base.tag}`
  });

  const internationals = intlNames.map((name, index) => {
    const base = proBases[index % proBases.length];
    return makeClone(
      base,
      base.id + 500 + index,
      name,
      "intl",
      intlOrigins[index % intlOrigins.length],
      2 + (index % 3),
      0.01,
      {
        threePoint: index % 2 === 0 ? 2 : -1,
        physical: index % 3 === 0 ? 2 : 0,
        tactical: 1,
        technique: 1,
        defense: index % 2 === 1 ? 2 : 0,
        heightCm: (index % 3) - 1
      }
    );
  });

  const scoutFinds = scoutNames.map((name, index) => {
    const base = baseBases[index % baseBases.length];
    return makeClone(
      base,
      base.id + 800 + index,
      name,
      "scout",
      index % 2 === 0 ? "Brasil" : "Argentina",
      2 + Math.floor(index / 2),
      0.07,
      {
        threePoint: 2 + (index % 2),
        physical: 1,
        tactical: index % 3 === 0 ? 2 : 0,
        technique: 2,
        defense: index % 2 === 0 ? 1 : 2,
        heightCm: index % 2 === 0 ? 2 : -1
      },
      index % 2 === 0 ? "regional" : "internacional"
    );
  });

  const firstNames = divisionKey === "masculino"
    ? ["Andre", "Breno", "Cesar", "Dante", "Elias", "Felipe", "Gustavo", "Hugo", "Iago", "Jonas", "Kevin", "Luan", "Mauro", "Nathan", "Otavio", "Pablo", "Raul", "Sandro", "Tales", "Uriel", "Vitor", "Wesley"]
    : ["Ana", "Bia", "Celia", "Dora", "Eva", "Flavia", "Giovana", "Helena", "Iris", "Joana", "Katia", "Luna", "Marta", "Nadia", "Olivia", "Paula", "Raissa", "Sara", "Talia", "Vera", "Yara", "Zoe"];
  const lastNames = ["Almada", "Barros", "Campos", "Duarte", "Esteves", "Farias", "Gouveia", "Lacerda", "Macedo", "Novaes", "Pereira", "Queiroz", "Ribeiro", "Silveira", "Teixeira", "Valente"];
  const origins = ["Brasil", "Brasil", "Brasil", "Argentina", "Uruguai", "Colombia", "Mexico", "Estados Unidos", "Espanha", "Franca"];
  const archetypes = [
    { threePoint: 4, technique: 2, physical: -1, defense: -1, tactical: 1, heightCm: -2, tag: "Arremessador de volume" },
    { threePoint: -2, technique: 1, physical: 4, defense: 3, tactical: 0, heightCm: 3, tag: "Contato e defesa" },
    { threePoint: 1, technique: 2, physical: 0, defense: 1, tactical: 4, heightCm: 0, tag: "Leitura e controle" },
    { threePoint: 2, technique: 4, physical: 1, defense: -1, tactical: 1, heightCm: -1, tag: "Criador tecnico" },
    { threePoint: -1, technique: 0, physical: 2, defense: 4, tactical: 2, heightCm: 2, tag: "Especialista defensivo" },
    { threePoint: 3, technique: 1, physical: 2, defense: 0, tactical: -1, heightCm: 1, tag: "Sexto homem explosivo" }
  ];

  const generated = Array.from({ length: 72 }, (_, index) => {
    const pool = index < 28 ? "pro" : index < 44 ? "base" : index < 58 ? "intl" : "scout";
    const basePool = pool === "base" || pool === "scout" ? baseBases : proBases;
    const base = basePool[index % basePool.length];
    const archetype = archetypes[index % archetypes.length];
    const tierShift = pool === "base" ? -4 : pool === "intl" ? 2 : pool === "scout" ? -2 : 0;
    const name = `${firstNames[index % firstNames.length]} ${lastNames[(index * 3 + (divisionKey === "masculino" ? 1 : 2)) % lastNames.length]}`;
    const origin = pool === "intl" ? origins[(index + 3) % origins.length] : origins[index % 3];
    return makeClone(
      base,
      2000 + (divisionKey === "masculino" ? 0 : 500) + index,
      name,
      pool,
      origin,
      pool === "base" ? -4 + (index % 3) : pool === "intl" ? 3 + (index % 4) : pool === "scout" ? -2 + (index % 4) : -1 + (index % 5),
      pool === "base" ? 0.1 : pool === "scout" ? 0.08 : index % 4 === 0 ? 0.03 : 0,
      {
        threePoint: archetype.threePoint + tierShift + ((index % 5) - 2),
        physical: archetype.physical + tierShift + ((index % 4) - 1),
        tactical: archetype.tactical + tierShift + ((index % 3) - 1),
        technique: archetype.technique + tierShift + ((index % 5) - 2),
        defense: archetype.defense + tierShift + ((index % 4) - 1),
        heightCm: archetype.heightCm + ((index % 7) - 3)
      },
      pool === "scout" ? (index % 2 === 0 ? "regional" : "internacional") : null
    );
  }).map((player, index) => ({
    ...player,
    tag: `${player.pool === "base" ? "Projeto" : player.pool === "intl" ? "Internacional" : player.pool === "scout" ? "Achado" : "Rotacao"} | ${archetypes[index % archetypes.length].tag}`
  }));

  return [...visiblePlayers, ...internationals, ...scoutFinds, ...generated];
}

Object.entries(DIVISIONS).forEach(([divisionKey, config]) => {
  config.rosterSize = 10;
  config.salaryCap -= 6;
  config.market = buildExpandedBasketballMarket(divisionKey, config);
});

const BASE_OPPONENTS = Object.fromEntries(
  Object.entries(DIVISIONS).map(([divisionKey, config]) => [
    divisionKey,
    config.opponents.map((team) => ({ ...team }))
  ])
);

function cloneConfig(value) {
  return JSON.parse(JSON.stringify(value));
}

function createDefaultCustomConfig() {
  return { teams: { masculino: {}, feminino: {} }, decisions: [] };
}

function normalizeCustomDecision(decision) {
  return {
    title: decision?.title || "Nova decisao",
    text: decision?.text || "Descreva o contexto da decisao.",
    choices: (decision?.choices || []).slice(0, 3).map((choice) => ({
      label: choice?.label || "Escolha",
      effect: choice?.effect || "Sem efeito descrito",
      modifiers: Array.isArray(choice?.modifiers) ? choice.modifiers.map((modifier) => ({
        key: modifier.key || "morale",
        amount: Number(modifier.amount) || 0,
        duration: Math.max(1, Number(modifier.duration) || 1)
      })) : []
    })).filter((choice) => choice.label)
  };
}

function normalizeCustomConfig(config) {
  const base = createDefaultCustomConfig();
  const incoming = config || {};
  return {
    teams: {
      masculino: { ...base.teams.masculino, ...(incoming.teams?.masculino || {}) },
      feminino: { ...base.teams.feminino, ...(incoming.teams?.feminino || {}) }
    },
    decisions: Array.isArray(incoming.decisions)
      ? incoming.decisions.map(normalizeCustomDecision).filter((decision) => decision.choices.length)
      : []
  };
}

function loadCustomConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_CONFIG_STORAGE_KEY) || "null");
    return normalizeCustomConfig(saved || window.SEASON_CUSTOM_CONFIG);
  } catch (error) {
    return normalizeCustomConfig(window.SEASON_CUSTOM_CONFIG);
  }
}

function saveCustomConfig(config) {
  localStorage.setItem(CUSTOM_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

function applyCustomConfig(config) {
  const normalized = normalizeCustomConfig(config);
  Object.entries(BASE_OPPONENTS).forEach(([divisionKey, teams]) => {
    DIVISIONS[divisionKey].opponents = teams.map((team) => ({
      ...team,
      ...(normalized.teams[divisionKey]?.[team.id] || {})
    }));
  });
  decisionTemplates.splice(
    BASE_DECISION_TEMPLATE_COUNT,
    decisionTemplates.length - BASE_DECISION_TEMPLATE_COUNT,
    ...normalized.decisions
  );
  return normalized;
}

function createStaffState() {
  return {
    physio: 0,
    conditioning: 0,
    assistant: 0,
    analyst: 0,
    psychologist: 0,
    doctor: 0
  };
}

function normalizeStaffLevel(value) {
  if (value === true) return 1;
  const numeric = Number(value);
  return [0, 1, 2].includes(numeric) ? numeric : 0;
}

function normalizeSettings(settings) {
  const normalizedStaff = {
    ...createStaffState(),
    ...(settings?.staff || {})
  };
  const rawEase = settings?.ease || "normal";
  const easeAliases = {
    favoravel: "facil",
    "muito-favoravel": "muito-facil"
  };
  return {
    budgetBoost: Number(settings?.budgetBoost || 0),
    ease: easeAliases[rawEase] || rawEase,
    teamName: typeof settings?.teamName === "string" ? settings.teamName.trim().slice(0, 32) : "",
    staff: {
      physio: normalizeStaffLevel(normalizedStaff.physio),
      conditioning: normalizeStaffLevel(normalizedStaff.conditioning),
      assistant: normalizeStaffLevel(normalizedStaff.assistant),
      analyst: normalizeStaffLevel(normalizedStaff.analyst),
      psychologist: normalizeStaffLevel(normalizedStaff.psychologist),
      doctor: normalizeStaffLevel(normalizedStaff.doctor)
    }
  };
}

function normalizePlayerUsageValue(value, fallback = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return PLAYER_USAGE_LEVELS.reduce((closest, option) => (
    Math.abs(option.value - numeric) < Math.abs(closest - numeric) ? option.value : closest
  ), fallback);
}

function getDefaultPlayerUsage(player) {
  return DEFAULT_PLAYER_USAGE[player?.pos] || 1;
}

function normalizePlayerUsageMap(playerUsage = {}) {
  const normalized = {};
  Object.entries(playerUsage || {}).forEach(([key, value]) => {
    normalized[key] = normalizePlayerUsageValue(value, 1);
  });
  return normalized;
}

function getPlayerUsageMultiplier(player) {
  return normalizePlayerUsageValue(state.playerUsage[player.id], getDefaultPlayerUsage(player));
}

function describePlayerUsage(value) {
  const normalized = normalizePlayerUsageValue(value, 1);
  return PLAYER_USAGE_LEVELS.find((option) => option.value === normalized)?.label || "Equilibrado";
}

function describeSimulationDifficulty() {
  const labels = {
    "muito-dificil": "simulacao muito dificil",
    dificil: "simulacao dificil",
    normal: "simulacao normal",
    facil: "simulacao facil",
    "muito-facil": "simulacao muito facil"
  };
  return labels[state.settings.ease] || labels.normal;
}

const state = {
  division: "masculino",
  selectedIds: [],
  playerUsage: {},
  marketPosition: "all",
  tactics: { ...defaultTactics },
  trainingFocus: "shooting",
  scouting: createScoutingState(),
  settings: normalizeSettings(),
  season: null,
  customConfig: applyCustomConfig(loadCustomConfig()),
  activeTab: "front-office"
};

let liveMatchController = null;
let liveMatchUi = null;
let liveMatchKey = "";
let liveMatchRoot = null;

function clearLiveMatch() {
  liveMatchController?.pause?.();
  liveMatchController = null;
  liveMatchUi = null;
  liveMatchKey = "";
  liveMatchRoot = null;
}

const budgetUsedEl = document.querySelector("#budget-used");
const budgetLeftEl = document.querySelector("#budget-left");
const marketBudgetUsedEl = document.querySelector("#market-budget-used");
const marketBudgetLeftEl = document.querySelector("#market-budget-left");
const teamHeightEl = document.querySelector("#team-height");
const teamThreePointEl = document.querySelector("#team-threepoint");
const teamPhysicalEl = document.querySelector("#team-physical");
const teamTacticalEl = document.querySelector("#team-tactical");
const teamTechniqueEl = document.querySelector("#team-technique");
const teamDefenseEl = document.querySelector("#team-defense");
const rosterCountEl = document.querySelector("#roster-count");
const selectedRosterEl = document.querySelector("#selected-roster");
const marketEl = document.querySelector("#player-market");
const resultsEl = document.querySelector("#season-results");
const injuryCenterEl = document.querySelector("#injury-center");
const configEditorEl = document.querySelector("#config-editor");
const quickHubEl = document.querySelector("#matchday-hub");
const liveMatchPageRootEl = document.querySelector("#live-match-page-root");
const toggleSettingsButton = document.querySelector("#toggle-settings");
const settingsPanelEl = document.querySelector("#settings-panel");
const resetButton = document.querySelector("#reset-team");
const startSeasonButton = document.querySelector("#start-season");
const playNextButton = document.querySelector("#play-next-game");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const saveCategoryInput = document.querySelector("#save-category");
const saveListInput = document.querySelector("#save-list");
const saveGameButton = document.querySelector("#save-game");
const loadGameButton = document.querySelector("#load-game");
const deleteSaveButton = document.querySelector("#delete-save");
const saveStatusEl = document.querySelector("#save-status");
const leagueTableEl = document.querySelector("#league-table");
const divisionInput = document.querySelector("#division-select");
const settingsBudgetInput = document.querySelector("#settings-budget");
const settingsEaseInput = document.querySelector("#settings-ease");
const franchiseNameInput = document.querySelector("#franchise-name");
const staffPhysioInput = document.querySelector("#staff-physio");
const staffConditioningInput = document.querySelector("#staff-conditioning");
const staffAssistantInput = document.querySelector("#staff-assistant");
const staffAnalystInput = document.querySelector("#staff-analyst");
const staffPsychologistInput = document.querySelector("#staff-psychologist");
const staffDoctorInput = document.querySelector("#staff-doctor");
const staffBudgetUsedEl = document.querySelector("#staff-budget-used");
const staffBudgetLeftEl = document.querySelector("#staff-budget-left");
const staffBonusLabelEl = document.querySelector("#staff-bonus-label");
const staffBonusSummaryEl = document.querySelector("#staff-bonus-summary");

const tacticInputs = {
  pace: document.querySelector("#tactic-pace"),
  shot: document.querySelector("#tactic-shot"),
  rebound: document.querySelector("#tactic-rebound"),
  defense: document.querySelector("#tactic-defense"),
  rotation: document.querySelector("#tactic-rotation")
};

const trainingInput = document.querySelector("#training-focus");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundStat(value) {
  return Math.round(value);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getDivisionConfig() {
  return DIVISIONS[state.division];
}

function getDefaultUserTeamName() {
  return state.division === "masculino" ? "Sua Franquia Masculina" : "Sua Franquia Feminina";
}

function getUserTeamName() {
  return state.settings.teamName || getDefaultUserTeamName();
}

function getMarketPlayers() {
  return getDivisionConfig().market;
}

function estimateLegacyMarketAbility(player) {
  const attributes = [player.threePoint, player.physical, player.tactical, player.technique, player.defense].map((value) => Number(value) || 0);
  const average = attributes.reduce((sum, value) => sum + value, 0) / Math.max(1, attributes.length);
  const sorted = attributes.slice().sort((a, b) => b - a);
  return Math.round(clamp(average * 0.72 + ((sorted[0] + sorted[1]) / 2) * 0.28, 35, 99));
}

function summarizeLegacyMarketPlayers(players) {
  const safePlayers = players || [];
  const sum = (getter) => safePlayers.reduce((total, player) => total + (Number(getter(player)) || 0), 0);
  const average = (getter) => safePlayers.length ? sum(getter) / safePlayers.length : 0;
  const countBy = (getter) => safePlayers.reduce((acc, player) => {
    const key = getter(player) || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return {
    count: safePlayers.length,
    averageSalary: Math.round(average((player) => player.salary) * 10) / 10,
    totalSalary: Math.round(sum((player) => player.salary) * 10) / 10,
    averageCurrentAbility: Math.round(average((player) => player.currentAbility) * 10) / 10,
    averagePotential: Math.round(average((player) => player.potential) * 10) / 10,
    byPosition: countBy((player) => player.pos),
    byPool: countBy((player) => player.pool)
  };
}

function getLegacyBasketballMarketSnapshot(division = state.division) {
  const config = DIVISIONS[division] || getDivisionConfig();
  const players = (config.market || []).map((player) => {
    const currentAbility = estimateLegacyMarketAbility(player);
    const potential = Math.round(clamp(currentAbility + Math.max(0, (Number(player.development) || 1) - 1) * 38, currentAbility, 99));
    return {
      ...player,
      source: "legacy",
      currentAbility,
      potential,
      developmentGap: Math.max(0, potential - currentAbility),
      marketPool: player.pool,
      marketFit: player.pool === "base" ? "projeto de base" : player.pool === "intl" ? "internacional" : player.pool === "scout" ? "relatorio scout" : "mercado fixo",
      marketValueScore: Math.round((currentAbility * 0.68 + potential * 0.18 - (Number(player.salary) || 0) * 1.15) * 10) / 10
    };
  });
  return {
    source: "legacy",
    division,
    label: config.label,
    salaryCap: config.salaryCap,
    players,
    summary: summarizeLegacyMarketPlayers(players)
  };
}

function getVisibleMarketPlayers() {
  return getMarketPlayers().filter((player) => player.pool !== "scout" || state.scouting.discoveredIds.includes(player.id));
}

function getOpponents() {
  return getDivisionConfig().opponents;
}

function getBudgetCap() {
  return getDivisionConfig().salaryCap + state.settings.budgetBoost;
}

function getRosterSize() {
  return getDivisionConfig().rosterSize;
}

function getSelectedPlayers() {
  return getMarketPlayers().filter((player) => state.selectedIds.includes(player.id));
}

function getMarketPositions(players = getVisibleMarketPlayers()) {
  return [...new Set(players.map((player) => player.pos))].sort((a, b) => a.localeCompare(b));
}

function getBudgetUsed() {
  return getSelectedPlayers().reduce((sum, player) => sum + player.salary, 0) + state.scouting.spent;
}

function formatHeightCm(heightCm) {
  return `${(heightCm / 100).toFixed(2).replace(".", ",")} m`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderTeamBadge(team) {
  if (!team?.logo) {
    return `<span class="team-logo-placeholder">${escapeHtml((team?.name || "?").slice(0, 2).toUpperCase())}</span>`;
  }
  return `<img class="team-logo" src="${escapeHtml(team.logo)}" alt="Escudo ${escapeHtml(team.name)}">`;
}

function getHeightScore(heightCm) {
  const range = getDivisionConfig().heightRange;
  return clamp(((heightCm - range.min) / (range.max - range.min)) * 100, 35, 100);
}

function getPlayerById(playerId) {
  return getMarketPlayers().find((player) => player.id === playerId);
}

function getStaffBudgetUsed() {
  const staff = state.settings.staff || createStaffState();
  return Object.entries(STAFF_OPTIONS).reduce((sum, [key, config]) => {
    const level = normalizeStaffLevel(staff[key]);
    return sum + (config.levels[level]?.cost || 0);
  }, 0);
}

function getStaffEffects() {
  const staff = state.settings.staff || createStaffState();
  const physio = normalizeStaffLevel(staff.physio);
  const conditioning = normalizeStaffLevel(staff.conditioning);
  const assistant = normalizeStaffLevel(staff.assistant);
  const analyst = normalizeStaffLevel(staff.analyst);
  const psychologist = normalizeStaffLevel(staff.psychologist);
  const doctor = normalizeStaffLevel(staff.doctor);
  return {
    physical: conditioning === 2 ? 3 : conditioning === 1 ? 1 : 0,
    tactical: assistant === 2 ? 3 : assistant === 1 ? 1 : 0,
    defense: analyst === 2 ? 2 : analyst === 1 ? 1 : 0,
    morale: psychologist === 2 ? 3 : psychologist === 1 ? 1 : 0,
    fatigueRelief: (physio === 2 ? 0.24 : physio === 1 ? 0.1 : 0) + (conditioning === 2 ? 0.16 : conditioning === 1 ? 0.06 : 0),
    injuryPrevention: (physio === 2 ? 0.014 : physio === 1 ? 0.006 : 0) + (doctor === 2 ? 0.018 : doctor === 1 ? 0.008 : 0)
  };
}

function getStaffActiveLabel() {
  const active = Object.entries(STAFF_OPTIONS).flatMap(([key, config]) => {
    const level = normalizeStaffLevel(state.settings.staff?.[key]);
    return level ? [`${config.shortLabel} ${config.levels[level].label}`] : [];
  });
  return active.length ? active.join(" + ") : "Nenhum";
}

function getStaffSummaryText() {
  const details = [];
  const staff = state.settings.staff || createStaffState();
  if (normalizeStaffLevel(staff.physio) === 1) details.push("fisio base");
  if (normalizeStaffLevel(staff.physio) === 2) details.push("fisio elite");
  if (normalizeStaffLevel(staff.conditioning) === 1) details.push("preparo +1");
  if (normalizeStaffLevel(staff.conditioning) === 2) details.push("preparo +3");
  if (normalizeStaffLevel(staff.assistant) === 1) details.push("tática +1");
  if (normalizeStaffLevel(staff.assistant) === 2) details.push("tática +3");
  if (normalizeStaffLevel(staff.analyst) === 1) details.push("defesa +1");
  if (normalizeStaffLevel(staff.analyst) === 2) details.push("defesa +2");
  if (normalizeStaffLevel(staff.psychologist) === 1) details.push("moral +1");
  if (normalizeStaffLevel(staff.psychologist) === 2) details.push("moral +3");
  if (normalizeStaffLevel(staff.doctor) === 1) details.push("prevenção base");
  if (normalizeStaffLevel(staff.doctor) === 2) details.push("prevenção elite");
  return details.length ? details.join(" | ") : "Sem comissão ativa.";
}

function updateStaffLevel(key, value) {
  const previous = normalizeStaffLevel(state.settings.staff?.[key]);
  state.settings.staff[key] = normalizeStaffLevel(value);
  if (getStaffBudgetUsed() > STAFF_BUDGET_CAP) {
    state.settings.staff[key] = previous;
    setSaveStatus("Orçamento da comissão estourado.");
  }
  render();
}

function syncUserTeamIdentity() {
  const teamName = getUserTeamName();
  if (!state.season?.leagueTable?.teams) {
    return;
  }
  const userTeam = state.season.leagueTable.teams.find((team) => team.id === USER_TEAM_ID);
  if (userTeam) {
    userTeam.name = teamName;
    userTeam.style = "projeto montado por voce";
  }
}

function getTrainingProgressLimit(player, key) {
  return Math.max(1, roundStat((player[key] || 0) * TRAINING_PROGRESS_CAP_RATIO));
}

function clampTrainingProgressValue(player, key, value) {
  const limit = getTrainingProgressLimit(player, key);
  return clamp(value, -limit, limit);
}

function sanitizePlayerProgress(player, progress = {}) {
  return {
    threePoint: clampTrainingProgressValue(player, "threePoint", progress.threePoint || 0),
    physical: clampTrainingProgressValue(player, "physical", progress.physical || 0),
    tactical: clampTrainingProgressValue(player, "tactical", progress.tactical || 0),
    technique: clampTrainingProgressValue(player, "technique", progress.technique || 0),
    defense: clampTrainingProgressValue(player, "defense", progress.defense || 0)
  };
}

function getSavePayload() {
  return {
    division: state.division,
    selectedIds: state.selectedIds,
    playerUsage: state.playerUsage,
    tactics: state.tactics,
    trainingFocus: state.trainingFocus,
    scouting: state.scouting,
    settings: state.settings,
    season: state.season
  };
}

function getSavedGames() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function setSavedGames(saves) {
  localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saves));
}

function getSaveCategory() {
  return saveCategoryInput.value.trim() || saveListInput.value || "carreira-principal";
}

function setSaveStatus(message) {
  saveStatusEl.textContent = message;
}

function switchTab(tabName) {
  state.activeTab = tabName;
  document.body.dataset.activeTab = tabName;
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tabTarget === tabName);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName);
  });
  if (tabName === "partida") {
    renderLiveMatchPage();
  }
}

function normalizeSeason(season) {
  if (!season || !season.schemaVersion) {
    return null;
  }
  return {
    ...season,
    schemaVersion: 3,
    moraleLog: season.moraleLog || [{ round: 0, label: "Inicio da temporada", amount: 0, value: 74 }],
    activeModifiers: season.activeModifiers || [],
    pendingDecision: season.pendingDecision || null,
    lastDecisionResult: season.lastDecisionResult || null,
    lastGame: season.lastGame || null,
    playerProgress: season.playerProgress || {},
    injuries: season.injuries || {},
    trainingLog: season.trainingLog || [],
    management: normalizeManagementState(season.management),
    managementLog: season.managementLog || [],
    psychologyLog: season.psychologyLog || [],
    playerStats: season.playerStats || {}
  };
}

function createManagementState() {
  return {
    chemistry: 72,
    confidence: 71,
    focus: 70,
    intensity: 68,
    lastActionRound: -1
  };
}

function normalizeManagementState(management) {
  return {
    ...createManagementState(),
    ...(management || {})
  };
}

function getManagementState() {
  return normalizeManagementState(state.season?.management);
}

function getRoundMarker() {
  const upcoming = getUpcomingGameInfo();
  if (!upcoming) {
    return state.season?.games.length ?? -1;
  }
  return upcoming.phase === "regular"
    ? upcoming.roundInfo.roundNumber
    : 100 + state.season.playoffs.currentRoundIndex * 10 + upcoming.gameInSeries;
}

function isManagementActionAvailable() {
  if (!state.season || state.season.phase === "finished") {
    return false;
  }
  return getManagementState().lastActionRound !== getRoundMarker();
}

function clampManagementValue(value) {
  return roundStat(clamp(value, 45, 95));
}

function formatManagementDelta(value = 0) {
  const amount = value || 0;
  return `${amount >= 0 ? "+" : ""}${amount}`;
}

function adjustManagement(changes, label) {
  if (!state.season || !changes) {
    return;
  }
  const management = getManagementState();
  state.season.management = {
    chemistry: clampManagementValue(management.chemistry + (changes.chemistry || 0)),
    confidence: clampManagementValue(management.confidence + (changes.confidence || 0)),
    focus: clampManagementValue(management.focus + (changes.focus || 0)),
    intensity: clampManagementValue(management.intensity + (changes.intensity || 0)),
    lastActionRound: management.lastActionRound
  };
  if (label && Object.values(changes).some((value) => value !== 0)) {
    state.season.managementLog.unshift({
      round: state.season.roundNumber,
      label,
      weightLabel: "Oscilacao do ambiente",
      description: `Ent ${formatManagementDelta(changes.chemistry)} | Conf ${formatManagementDelta(changes.confidence)} | Foco ${formatManagementDelta(changes.focus)} | Int ${formatManagementDelta(changes.intensity)}`
    });
    state.season.managementLog = state.season.managementLog.slice(0, 8);
  }
}

function driftManagementAfterGame(game, teamProfile) {
  if (!state.season) {
    return;
  }
  const management = getManagementState();
  const pull = (value, target = MANAGEMENT_BASELINE) => value > target + 4 ? -1 : value < target - 4 ? 1 : 0;
  const closeGame = Math.abs(game.teamScore - game.opponentScore) <= 5;
  const blowoutLoss = game.result === "D" && game.opponentScore - game.teamScore >= 14;
  const easyWin = game.result === "V" && game.teamScore - game.opponentScore >= 14;
  const fatigueHit = teamProfile.fatigueLoad >= 2.2 ? 1 : 0;
  const randomShock = Math.random() < 0.22 ? (Math.random() < 0.5 ? -1 : 1) : 0;

  adjustManagement({
    chemistry: pull(management.chemistry) + (blowoutLoss ? -1 : 0) + (closeGame && game.result === "V" ? 1 : 0),
    confidence: pull(management.confidence) + (game.result === "V" ? (easyWin ? 1 : 0) : -1) + randomShock,
    focus: pull(management.focus) + (game.result === "D" ? 1 : 0) + (easyWin ? -1 : 0),
    intensity: pull(management.intensity, 68) + (game.result === "D" ? 1 : 0) - fatigueHit
  }, "Flutuacao pos-jogo");
}

function getManagementImpact(management = getManagementState()) {
  const chemistryEdge = management.chemistry - MANAGEMENT_BASELINE;
  const confidenceEdge = management.confidence - MANAGEMENT_BASELINE;
  const focusEdge = management.focus - MANAGEMENT_BASELINE;
  const intensityEdge = management.intensity - MANAGEMENT_BASELINE;

  return {
    threePoint: roundStat(confidenceEdge * 0.11 + focusEdge * 0.05),
    physical: roundStat(intensityEdge * 0.11),
    tactical: roundStat(chemistryEdge * 0.09 + focusEdge * 0.1),
    technique: roundStat(confidenceEdge * 0.08 + chemistryEdge * 0.07),
    defense: roundStat(focusEdge * 0.12 + intensityEdge * 0.07),
    morale: roundStat(confidenceEdge * 0.2 + chemistryEdge * 0.08),
    clutch: confidenceEdge * 0.18 + focusEdge * 0.11,
    fatigue: Math.max(0, intensityEdge * 0.09 - chemistryEdge * 0.02)
  };
}

function getTrainingSpecificActionPackage() {
  const plan = trainingPlans[state.trainingFocus];
  const packageByFocus = {
    shooting: [{ key: "shooting", amount: 3, duration: 2 }, { key: "technique", amount: 1, duration: 1 }],
    strength: [{ key: "physical", amount: 3, duration: 2 }, { key: "defense", amount: 1, duration: 1 }],
    tactics: [{ key: "tactical", amount: 3, duration: 2 }, { key: "defense", amount: 1, duration: 1 }],
    skill: [{ key: "technique", amount: 3, duration: 2 }, { key: "shooting", amount: 1, duration: 1 }],
    recovery: [{ key: "recovery", amount: 3, duration: 2 }, { key: "physical", amount: 1, duration: 1 }]
  };
  return {
    effect: `${plan.label}: impulso tecnico por 2 jogos, com carga controlada`,
    modifiers: packageByFocus[state.trainingFocus] || [],
    description: `Foco extra em ${plan.label.toLowerCase()} para empurrar o plano da semana.`
  };
}

function getManagementActions() {
  return managementActionTemplates.map((action) => {
    if (!action.dynamicTraining) {
      return {
        ...action,
        effect: action.modifiers.map((modifier) => `${modifier.key.toUpperCase()} ${modifier.amount >= 0 ? "+" : ""}${modifier.amount} por ${modifier.duration} jogo(s)`).join(" | ")
      };
    }
    const trainingAction = getTrainingSpecificActionPackage();
    return {
      ...action,
      description: trainingAction.description,
      effect: trainingAction.effect,
      modifiers: trainingAction.modifiers
    };
  });
}

function getRecordLabel(wins, losses) {
  return `${wins}-${losses}`;
}

function weightedAverage(players, key, weights) {
  if (!players.length) {
    return key === "heightCm" ? getDivisionConfig().heightRange.min : 0;
  }
  let weightedSum = 0;
  let totalWeight = 0;
  players.forEach((player, index) => {
    const weight = weights[index] || 0.45;
    weightedSum += player[key] * weight;
    totalWeight += weight;
  });
  return weightedSum / totalWeight;
}

function sumSeasonModifiers(modifiers) {
  const totals = modifiers.reduce((acc, modifier) => {
    acc[modifier.key] = (acc[modifier.key] || 0) + modifier.amount;
    return acc;
  }, {});
  Object.keys(totals).forEach((key) => {
    totals[key] = clamp(totals[key], key === "morale" ? -4 : -5, key === "morale" ? 4 : 5);
  });
  return totals;
}

function getPsychologyEdge(players) {
  if (!players.length) {
    return { confidence: 0, chemistry: 0, focus: 0, intensity: 0, clutch: 0, volatility: 0, recovery: 0 };
  }
  const totals = players.reduce((acc, player) => {
    const profile = player.psychology || psychologyProfiles[0];
    acc.confidence += profile.confidence;
    acc.chemistry += profile.chemistry;
    acc.focus += profile.focus;
    acc.intensity += profile.intensity;
    acc.clutch += profile.clutch;
    acc.volatility += profile.volatility;
    acc.recovery += profile.recovery;
    return acc;
  }, { confidence: 0, chemistry: 0, focus: 0, intensity: 0, clutch: 0, volatility: 0, recovery: 0 });

  const size = players.length;
  return Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, value / size]));
}

function getTechnicalEdge(players) {
  const keys = ["threePoint", "physical", "tactical", "technique", "defense", "pace", "spacing", "finishing", "rebounding", "perimeterDefense", "interiorDefense"];
  const totals = Object.fromEntries(keys.map((key) => [key, 0]));
  players.forEach((player) => {
    const profile = player.technicalProfile || technicalProfiles[0];
    keys.forEach((key) => {
      totals[key] += profile[key] || 0;
    });
  });
  const size = Math.max(1, players.length);
  return Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, clamp(value / size, -2.5, 2.5)]));
}

function countTraits(players, sourceKey, trait) {
  return players.filter((player) => (player[sourceKey]?.traits || []).includes(trait)).length;
}

function getRosterSynergy(players) {
  if (!players.length) {
    return { chemistry: 0, focus: 0, spacing: 0, defense: 0, pace: 0, technique: 0, volatility: 0, fatigue: 0, label: "Neutra" };
  }

  let score = 0;
  const psych = (trait) => countTraits(players, "psychology", trait);
  const tech = (trait) => countTraits(players, "technicalProfile", trait);
  const leader = psych("leader");
  const stable = psych("stable");
  const volatile = psych("volatile");
  const intense = psych("intense");
  const connector = psych("connector") + tech("connector");
  const creator = tech("creator");
  const ballDominant = tech("ball-dominant");
  const shooter = tech("shooter");
  const defender = tech("defender");
  const offball = tech("offball");
  const anchor = tech("anchor");
  const organizer = psych("organizer") + tech("organizer");
  const star = psych("star");
  const clutch = psych("clutch");

  score += Math.min(2, leader) * 0.8;
  score += Math.min(3, stable) * 0.35;
  score += Math.min(3, connector) * 0.45;
  score += Math.min(2, organizer) * 0.55;
  score += Math.min(shooter, creator + organizer) * 0.5;
  score += Math.min(defender, anchor + connector + 1) * 0.35;
  score += Math.min(offball, ballDominant + creator) * 0.35;
  score += Math.min(clutch, leader + stable + 1) * 0.25;
  score -= Math.max(0, volatile - leader - stable) * 0.75;
  score -= Math.max(0, ballDominant - creator - organizer - 1) * 0.7;
  score -= Math.max(0, star - connector - leader) * 0.55;
  score -= Math.max(0, intense - stable - leader - 1) * 0.4;

  const normalized = clamp(score, -4, 4);
  return {
    chemistry: normalized * 0.45,
    focus: normalized * 0.3,
    spacing: clamp((shooter - ballDominant * 0.35) * 0.35, -1.5, 1.5),
    defense: clamp((defender + anchor - volatile * 0.35) * 0.28, -1.5, 1.5),
    pace: clamp((creator + offball - ballDominant * 0.4) * 0.25, -1.2, 1.2),
    technique: normalized * 0.25,
    volatility: normalized < 0 ? Math.abs(normalized) * 0.35 : -normalized * 0.15,
    fatigue: normalized < -1 ? Math.abs(normalized) * 0.08 : 0,
    label: normalized >= 2 ? "Otima" : normalized >= 0.7 ? "Boa" : normalized <= -2 ? "Ruim" : normalized <= -0.7 ? "Instavel" : "Neutra"
  };
}

function addPsychologyLog(label, description, amount = 0) {
  if (!state.season) {
    return;
  }
  state.season.psychologyLog.unshift({
    round: state.season.roundNumber,
    label,
    description,
    amount
  });
  state.season.psychologyLog = state.season.psychologyLog.slice(0, 8);
}

function getSimulationEaseModifier() {
  return SIMULATION_EASE_VALUES[state.settings.ease] || 0;
}

function getRecentWinStreak(games = state.season?.games || []) {
  let streak = 0;
  for (let index = games.length - 1; index >= 0; index -= 1) {
    if (games[index].result !== "V") {
      break;
    }
    streak += 1;
  }
  return streak;
}

function getSeasonBalanceContext(teamProfile = null, opponentProfile = null) {
  const games = state.season?.games || [];
  const ratingGap = teamProfile && opponentProfile ? getTeamRating(teamProfile) - getTeamRating(opponentProfile) : 0;
  const favoriteTax = Math.max(0, ratingGap - 1.5);
  if (!games.length) {
    return {
      teamDrag: clamp(favoriteTax * 0.28, 0, 2.2),
      opponentBoost: clamp(favoriteTax * 0.22, 0, 1.8),
      chaos: 0.8
    };
  }

  const wins = games.filter((game) => game.result === "V").length;
  const winRate = wins / games.length;
  const streak = getRecentWinStreak(games);
  const dominance = Math.max(0, winRate - 0.58);
  const hotStreak = Math.max(0, streak - 2);
  const lateSeason = Math.min(1, games.length / 18);

  return {
    teamDrag: clamp(dominance * 6.2 + hotStreak * 1.05 + lateSeason * hotStreak * 0.45 + favoriteTax * 0.32, 0, 7),
    opponentBoost: clamp(dominance * 4.8 + hotStreak * 0.85 + favoriteTax * 0.26, 0, 5.5),
    chaos: clamp(0.8 + hotStreak * 0.35 + dominance * 1.8 + favoriteTax * 0.08, 0.8, 3)
  };
}

function getUsagePlan(players, tactics) {
  const weighted = players.map((player) => {
    const usage = getPlayerUsageMultiplier(player);
    const roleBoost = player.pos === "SG" ? 1.12 : player.pos === "PG" ? 1.08 : player.pos === "SF" ? 1 : player.pos === "PF" ? 0.94 : 0.9;
    const tacticBoost = (
      (tactics.shot === "perimeter" ? usage * 0.08 : 0) +
      (tactics.pace === "fast" ? usage * 0.06 : 0) +
      (tactics.rotation === "short" ? usage * 0.05 : 0) -
      (tactics.pace === "slow" ? Math.max(0, usage - 1) * 0.05 : 0)
    );
    const weight = Math.max(
      0.04,
      (usage + tacticBoost) *
      roleBoost *
      (0.44 + player.technique / 100 + player.threePoint / 180) *
      (player.rotationWeight || 1)
    );
    return { player, weight };
  });
  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0) || 1;
  const playersWithShare = weighted.map((entry) => ({
    player: entry.player,
    share: entry.weight / totalWeight
  })).sort((a, b) => b.share - a.share);
  const topShare = playersWithShare[0]?.share || 0;
  const meanShare = 1 / Math.max(1, playersWithShare.length);
  const spread = Math.sqrt(playersWithShare.reduce((sum, entry) => sum + ((entry.share - meanShare) ** 2), 0) / Math.max(1, playersWithShare.length));
  const concentration = clamp((topShare - 0.23) * 36, -3, 5);
  const spacingFit = clamp((0.095 - spread) * 28, -3, 4);
  const threePointBonus = (tactics.shot === "perimeter" ? concentration * 0.8 : 0) + (tactics.pace === "slow" ? spacingFit * 0.55 : 0);
  const techniqueBonus = (tactics.pace === "fast" ? concentration * 0.45 : 0) + (tactics.rotation === "short" ? concentration * 0.35 : 0);
  const tacticalBonus = threePointBonus * 0.45 + spacingFit * 0.65;
  return {
    players: playersWithShare,
    threePointBonus,
    techniqueBonus,
    tacticalBonus,
    execution: threePointBonus + techniqueBonus + tacticalBonus * 0.8
  };
}

function distributeIntegerByWeight(total, weightedEntries) {
  const safeTotal = Math.max(0, Math.round(total));
  if (!safeTotal || !weightedEntries.length) {
    return weightedEntries.map((entry) => ({ ...entry, total: 0 }));
  }
  const raw = weightedEntries.map((entry) => safeTotal * entry.share);
  const base = raw.map((value) => Math.floor(value));
  let remaining = safeTotal - base.reduce((sum, value) => sum + value, 0);
  const order = raw.map((value, index) => ({ index, fraction: value - base[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  for (let index = 0; index < order.length && remaining > 0; index += 1) {
    base[order[index].index] += 1;
    remaining -= 1;
  }
  return weightedEntries.map((entry, index) => ({ ...entry, total: base[index] }));
}

function buildBasketballScorers(teamProfile, teamBox) {
  const weightedEntries = teamProfile.usagePlan.players.map((entry) => ({
    name: entry.player.name,
    pos: entry.player.pos,
    share: entry.share * (0.6 + entry.player.technique / 130 + entry.player.threePoint / 170 + entry.player.physical / 260)
  }));
  const shareTotal = weightedEntries.reduce((sum, entry) => sum + entry.share, 0) || 1;
  return distributeIntegerByWeight(teamBox.points, weightedEntries.map((entry) => ({ ...entry, share: entry.share / shareTotal })))
    .sort((a, b) => b.total - a.total);
}

function getScorersSummary(scorers, noun) {
  return scorers.slice(0, 3).map((entry) => `${entry.name} ${entry.total} ${noun}`).join(" | ");
}

function getPlayerStatus(playerId) {
  const issue = state.season?.injuries[playerId];
  if (!issue) {
    return { status: "healthy", note: "Disponivel", weight: 1 };
  }
  if (state.season.roundNumber < issue.returnRound) {
    return { status: "out", note: `${issue.label} ate a rodada ${issue.returnRound}`, weight: 0.12 };
  }
  return { status: "limited", note: `Retorno monitorado apos ${issue.label}`, weight: 0.82 };
}

function getAdjustedPlayers() {
  return getSelectedPlayers().map((player) => {
    const rawProgress = state.season?.playerProgress?.[player.id] || {};
    const progress = sanitizePlayerProgress(player, rawProgress);
    if (state.season?.playerProgress?.[player.id]) {
      state.season.playerProgress[player.id] = progress;
    }
    const health = getPlayerStatus(player.id);
    return {
      ...player,
      threePoint: roundStat(player.threePoint + (progress.threePoint || 0)),
      physical: roundStat(player.physical + (progress.physical || 0)),
      tactical: roundStat(player.tactical + (progress.tactical || 0)),
      technique: roundStat(player.technique + (progress.technique || 0)),
      defense: roundStat(player.defense + (progress.defense || 0)),
      healthStatus: health.status,
      healthNote: health.note,
      availabilityWeight: health.weight
    };
  });
}

function getRotation(players, rotationStyle) {
  const sorted = players.slice().sort((a, b) => {
    const scoreA = a.threePoint + a.physical + a.tactical + a.technique + a.defense + getHeightScore(a.heightCm) * 0.35;
    const scoreB = b.threePoint + b.physical + b.tactical + b.technique + b.defense + getHeightScore(b.heightCm) * 0.35;
    return scoreB - scoreA;
  });
  const weights = ROTATION_WEIGHTS[rotationStyle];
  return sorted.map((player, index) => ({
    ...player,
    rotationWeight: (weights[index] || 0.45) * player.availabilityWeight
  }));
}

function getTacticModifiers(tactics) {
  const modifier = {
    threePoint: 0,
    physical: 0,
    tactical: 0,
    technique: 0,
    defense: 0,
    pace: 0,
    rebounding: 0,
    perimeterDefense: 0,
    interiorDefense: 0,
    fatigue: 0
  };

  if (tactics.pace === "fast") {
    modifier.pace += 5;
    modifier.technique += 1;
    modifier.fatigue += 1.3;
  } else if (tactics.pace === "slow") {
    modifier.tactical += 2;
    modifier.defense += 1;
    modifier.pace -= 3;
  }

  if (tactics.shot === "perimeter") {
    modifier.threePoint += 4;
    modifier.technique += 1;
  } else if (tactics.shot === "paint") {
    modifier.physical += 2;
    modifier.interiorDefense += 1;
  }

  if (tactics.rebound === "crash") {
    modifier.rebounding += 4;
    modifier.fatigue += 0.6;
  } else if (tactics.rebound === "transition") {
    modifier.pace += 2;
    modifier.rebounding -= 1;
  }

  if (tactics.defense === "pressure") {
    modifier.perimeterDefense += 4;
    modifier.defense += 2;
    modifier.fatigue += 0.7;
  } else if (tactics.defense === "paint") {
    modifier.interiorDefense += 4;
    modifier.defense += 2;
  } else if (tactics.defense === "perimeter") {
    modifier.perimeterDefense += 4;
  }

  if (tactics.rotation === "short") {
    modifier.technique += 2;
    modifier.fatigue += 1.1;
  } else if (tactics.rotation === "deep") {
    modifier.physical += 2;
    modifier.tactical -= 1;
  }

  return modifier;
}

function calculateTeamProfile(rotationStyle, activeModifiers, tactics) {
  const adjustedPlayers = getAdjustedPlayers();
  const rotation = getRotation(adjustedPlayers, rotationStyle);
  const starters = rotation.slice(0, 5);
  const bench = rotation.slice(5);
  const weights = starters.map((player) => player.rotationWeight);
  const benchDepth = bench.length ? bench.reduce((sum, player) => sum + (player.threePoint + player.tactical + player.technique + player.defense) / 4, 0) / bench.length : 72;
  const seasonBonus = sumSeasonModifiers(activeModifiers);
  const tacticBonus = getTacticModifiers(tactics);
  const managementBonus = getManagementImpact();
  const staffBonus = getStaffEffects();
  const psychologyBonus = getPsychologyEdge(starters);
  const technicalBonus = getTechnicalEdge(starters);
  const synergy = getRosterSynergy(rotation);
  const usagePlan = getUsagePlan(starters, tactics);
  const morale = clamp((state.season?.morale || 74) + (seasonBonus.morale || 0) + managementBonus.morale + psychologyBonus.confidence * 0.8 + psychologyBonus.chemistry * 0.5 + synergy.chemistry + staffBonus.morale, 45, 96);
  const heightCm = weightedAverage(starters, "heightCm", weights);
  const heightScore = getHeightScore(heightCm);

  const threePoint = roundStat(weightedAverage(starters, "threePoint", weights) + (seasonBonus.shooting || 0) + tacticBonus.threePoint + managementBonus.threePoint + psychologyBonus.confidence * 0.35 + technicalBonus.threePoint + usagePlan.threePointBonus);
  const physical = roundStat(weightedAverage(starters, "physical", weights) + (seasonBonus.physical || 0) + tacticBonus.physical + (seasonBonus.recovery || 0) + managementBonus.physical + psychologyBonus.recovery * 0.6 + technicalBonus.physical + staffBonus.physical);
  const tactical = roundStat(weightedAverage(starters, "tactical", weights) + (seasonBonus.tactical || 0) + tacticBonus.tactical + managementBonus.tactical + psychologyBonus.focus * 0.45 + technicalBonus.tactical + synergy.focus + staffBonus.tactical + usagePlan.tacticalBonus);
  const technique = roundStat(weightedAverage(starters, "technique", weights) + (seasonBonus.technique || 0) + tacticBonus.technique + managementBonus.technique + psychologyBonus.chemistry * 0.4 + technicalBonus.technique + synergy.technique + usagePlan.techniqueBonus);
  const defense = roundStat(weightedAverage(starters, "defense", weights) + (seasonBonus.defense || 0) + tacticBonus.defense + managementBonus.defense + psychologyBonus.focus * 0.35 + technicalBonus.defense + synergy.defense + staffBonus.defense);

  return {
    rotation,
    usagePlan,
    heightCm: roundStat(heightCm),
    heightScore: roundStat(heightScore),
    threePoint,
    physical,
    tactical,
    technique,
    defense,
    morale,
    pace: roundStat(physical * 0.28 + tactical * 0.18 + technique * 0.12 + benchDepth * 0.26 + 12 + tacticBonus.pace + technicalBonus.pace + synergy.pace),
    rebounding: roundStat(heightScore * 0.3 + physical * 0.28 + defense * 0.16 + tactical * 0.1 + tacticBonus.rebounding + technicalBonus.rebounding),
    spacing: roundStat(threePoint * 0.62 + technique * 0.2 + tactical * 0.18 + technicalBonus.spacing + synergy.spacing),
    finishing: roundStat(technique * 0.42 + physical * 0.24 + heightScore * 0.18 + tactical * 0.16 + technicalBonus.finishing),
    discipline: roundStat(tactical * 0.5 + technique * 0.3 + defense * 0.2),
    perimeterDefense: roundStat(defense + tacticBonus.perimeterDefense + technicalBonus.perimeterDefense),
    interiorDefense: roundStat(defense + tacticBonus.interiorDefense + technicalBonus.interiorDefense),
    pressure: roundStat(tactical * 0.3 + physical * 0.2 + defense * 0.22 + 16),
    fatigueLoad: Math.max(0, tacticBonus.fatigue + managementBonus.fatigue + synergy.fatigue + Math.max(0, 79 - physical) * 0.08 + Math.max(0, 78 - benchDepth) * 0.06 + Math.max(0, psychologyBonus.volatility + synergy.volatility) * 0.12 - Math.max(0, psychologyBonus.recovery) * 0.08 - staffBonus.fatigueRelief),
    clutch: roundStat(morale * 0.34 + tactical * 0.24 + technique * 0.18 + threePoint * 0.12 + defense * 0.12 + managementBonus.clutch + psychologyBonus.clutch),
    planExecution: usagePlan.execution,
    psychologyEdge: psychologyBonus,
    technicalEdge: technicalBonus,
    synergy
  };
}

function buildOpponentProfile(team) {
  const heightScore = getHeightScore(team.heightCm);
  return {
    ...team,
    heightScore: roundStat(heightScore),
    morale: 75,
    pace: roundStat(team.physical * 0.28 + team.tactical * 0.18 + team.technique * 0.12 + 30),
    rebounding: roundStat(heightScore * 0.3 + team.physical * 0.28 + team.defense * 0.16 + team.tactical * 0.1),
    spacing: roundStat(team.threePoint * 0.62 + team.technique * 0.2 + team.tactical * 0.18),
    finishing: roundStat(team.technique * 0.42 + team.physical * 0.24 + heightScore * 0.18 + team.tactical * 0.16),
    discipline: roundStat(team.tactical * 0.5 + team.technique * 0.3 + team.defense * 0.2),
    perimeterDefense: team.defense + 1,
    interiorDefense: team.defense + 1,
    pressure: roundStat(team.tactical * 0.3 + team.physical * 0.2 + team.defense * 0.22 + 16),
    fatigueLoad: 0,
    clutch: roundStat(75 * 0.34 + team.tactical * 0.24 + team.technique * 0.18 + team.threePoint * 0.12 + team.defense * 0.12)
  };
}

function getTeamRating(profile) {
  return profile.heightScore * 0.15 + profile.threePoint * 0.18 + profile.physical * 0.16 + profile.tactical * 0.18 + profile.technique * 0.17 + profile.defense * 0.16;
}

function createRoundRobin(teamIds) {
  const list = teamIds.slice();
  const rounds = [];
  const half = list.length / 2;
  let rotating = list.slice();

  for (let roundIndex = 0; roundIndex < list.length - 1; roundIndex += 1) {
    const pairs = [];
    for (let pairIndex = 0; pairIndex < half; pairIndex += 1) {
      const home = rotating[pairIndex];
      const away = rotating[rotating.length - 1 - pairIndex];
      pairs.push(roundIndex % 2 === 0 ? { homeId: home, awayId: away } : { homeId: away, awayId: home });
    }
    rounds.push({ roundNumber: roundIndex + 1, matches: pairs });
    rotating = [rotating[0], rotating[rotating.length - 1], ...rotating.slice(1, rotating.length - 1)];
  }

  const returnRounds = rounds.map((round, index) => ({
    roundNumber: rounds.length + index + 1,
    matches: round.matches.map((match) => ({ homeId: match.awayId, awayId: match.homeId }))
  }));

  return [...rounds, ...returnRounds];
}

function createLeagueTable() {
  const userTeamName = getUserTeamName();
  const allTeams = [
    { id: USER_TEAM_ID, name: userTeamName, style: "projeto montado por voce", logo: "" },
    ...getOpponents().map((team) => ({ id: team.id, name: team.name, style: team.style, logo: team.logo || "" }))
  ];

  return {
    round: 0,
    teams: allTeams.map((team) => ({
      id: team.id,
      name: team.name,
      style: team.style,
      logo: team.logo || "",
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      streak: "-",
      form: []
    }))
  };
}

function createSeason() {
  const playerProgress = {};
  getSelectedPlayers().forEach((player) => {
    playerProgress[player.id] = {
      threePoint: 0,
      physical: 0,
      tactical: 0,
      technique: 0,
      defense: 0
    };
  });

  return {
    schemaVersion: 3,
    started: true,
    phase: "regular",
    roundNumber: 0,
    schedule: createRoundRobin([USER_TEAM_ID, ...getOpponents().map((team) => team.id)]),
    currentRoundIndex: 0,
    wins: 0,
    losses: 0,
    morale: 74,
    moraleLog: [{ round: 0, label: "Inicio da temporada", amount: 0, value: 74 }],
    games: [],
    activeModifiers: [],
    pendingDecision: null,
    lastDecisionResult: null,
    lastGame: null,
    playerProgress,
    injuries: {},
    trainingLog: [],
    management: createManagementState(),
    managementLog: [],
    psychologyLog: [],
    leagueTable: createLeagueTable(),
    relegatedTeams: [],
    playoffs: {
      qualified: false,
      seed: null,
      currentRoundIndex: -1,
      rounds: [],
      eliminated: false,
      champion: false
    }
  };
}

function pushTeamForm(team, didWin) {
  team.form.unshift(didWin ? "V" : "D");
  team.form = team.form.slice(0, 5);
  const current = didWin ? "V" : "D";
  const stopIndex = team.form.findIndex((result) => result !== current);
  const count = stopIndex === -1 ? team.form.length : stopIndex;
  team.streak = `${current}${count}`;
}

function recordLeagueGame(teamRow, opponentRow, match) {
  const teamWon = match.teamScore > match.opponentScore;
  if (teamWon) {
    teamRow.wins += 1;
    opponentRow.losses += 1;
  } else {
    teamRow.losses += 1;
    opponentRow.wins += 1;
  }
  teamRow.pointsFor += match.teamScore;
  teamRow.pointsAgainst += match.opponentScore;
  opponentRow.pointsFor += match.opponentScore;
  opponentRow.pointsAgainst += match.teamScore;
  pushTeamForm(teamRow, teamWon);
  pushTeamForm(opponentRow, !teamWon);
}

function getSortedLeagueTeams() {
  if (!state.season?.leagueTable) {
    return [];
  }
  return state.season.leagueTable.teams.slice().sort((a, b) => (
    b.wins - a.wins ||
    (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst) ||
    b.pointsFor - a.pointsFor
  ));
}

function simulateBasketballGame(team, opponent, context) {
  const possessions = roundStat(clamp(
    91 +
    (team.pace - 75) * 0.34 +
    (team.physical - 75) * 0.12 +
    (team.morale - 74) * 0.18 -
    (opponent.defense - 75) * 0.08 +
    context.homeEdge +
    context.momentum +
    context.easeBonus -
    context.fatiguePenalty +
    randomBetween(-3.2, 3.2),
    84,
    108
  ));

  const turnoverRate = clamp(
    0.147 -
    (team.discipline - 75) * 0.0012 +
    (team.planExecution || 0) * -0.0008 +
    (opponent.planExecution || 0) * 0.00045 +
    (opponent.pressure - 75) * 0.0008 +
    context.fatiguePenalty * 0.002 +
    randomBetween(-0.01, 0.01),
    0.09,
    0.2
  );

  const threeShare = clamp(
    0.29 +
    (team.threePoint - 75) * 0.0024 +
    (team.spacing - 75) * 0.0017 -
    (team.planExecution || 0) * -0.003 +
    (opponent.perimeterDefense - 75) * 0.0012 +
    (context.easeBonus * 0.002) +
    randomBetween(-0.02, 0.02),
    0.2,
    0.54
  );

  const twoPct = clamp(
    0.48 +
    (team.finishing - 75) * 0.0028 +
    (team.planExecution || 0) * 0.0024 +
    (team.physical - 75) * 0.0012 +
    (team.heightScore - opponent.heightScore) * 0.0008 -
    (opponent.interiorDefense - 75) * 0.0022 +
    randomBetween(-0.018, 0.018),
    0.41,
    0.66
  );

  const threePct = clamp(
    0.325 +
    (team.threePoint - 75) * 0.0022 +
    (team.spacing - 75) * 0.0016 +
    (team.planExecution || 0) * 0.0016 +
    (team.technique - 75) * 0.0006 -
    (opponent.perimeterDefense - 75) * 0.002 +
    (context.easeBonus * 0.0015) +
    randomBetween(-0.02, 0.02),
    0.24,
    0.49
  );

  const offRebRate = clamp(
    0.22 +
    (team.rebounding - opponent.rebounding) * 0.002 +
    (team.physical - opponent.physical) * 0.0005 +
    randomBetween(-0.018, 0.018),
    0.14,
    0.34
  );

  const turnovers = roundStat(possessions * turnoverRate);
  const liveShots = Math.max(65, possessions - turnovers);
  const threeAttempts = roundStat(liveShots * threeShare);
  const twoAttempts = liveShots - threeAttempts;
  const threeMade = roundStat(threeAttempts * threePct);
  const twoMade = roundStat(twoAttempts * twoPct);
  const missed = (threeAttempts - threeMade) + (twoAttempts - twoMade);
  const offensiveRebounds = roundStat(missed * offRebRate);
  const secondChanceShots = roundStat(offensiveRebounds * 0.7);
  const extraThreeAttempts = roundStat(secondChanceShots * threeShare);
  const extraTwoAttempts = secondChanceShots - extraThreeAttempts;
  const extraThreeMade = roundStat(extraThreeAttempts * clamp(threePct - 0.01, 0.22, 0.47));
  const extraTwoMade = roundStat(extraTwoAttempts * clamp(twoPct - 0.012, 0.39, 0.63));
  const freeThrowsMade = roundStat(clamp(
    (twoAttempts + extraTwoAttempts) * 0.16 +
    (team.physical - 75) * 0.15 +
    (team.technique - 75) * 0.08 -
    (opponent.defense - 75) * 0.04 +
    context.easeBonus * 0.4 +
    randomBetween(-2, 2),
    8,
    25
  ));

  return {
    possessions,
    turnovers,
    rebounds: offensiveRebounds + roundStat(opponent.rebounding * 0.22),
    threeMade: threeMade + extraThreeMade,
    threeAttempts: threeAttempts + extraThreeAttempts,
    twoMade: twoMade + extraTwoMade,
    twoAttempts: twoAttempts + extraTwoAttempts,
    threePct,
    twoPct,
    points: (threeMade + extraThreeMade) * 3 + (twoMade + extraTwoMade) * 2 + freeThrowsMade
  };
}

function applyTiebreaker(teamBox, opponentBox, teamProfile) {
  if (teamBox.points !== opponentBox.points) {
    return;
  }
  teamBox.points += 2 + roundStat(teamProfile.clutch * 0.02) + roundStat(randomBetween(0, 2));
  opponentBox.points += roundStat(randomBetween(0, 2));
  if (teamBox.points === opponentBox.points) {
    teamBox.points += 1;
  }
}

function adjustMorale(amount, label) {
  if (!state.season || amount === 0) {
    return;
  }
  state.season.morale = roundStat(clamp(state.season.morale + amount, 45, 99));
  state.season.moraleLog.unshift({
    round: state.season.roundNumber,
    label,
    amount,
    value: state.season.morale
  });
  state.season.moraleLog = state.season.moraleLog.slice(0, 8);
}

function applyResultMorale(game) {
  let delta = game.result === "V" ? 2 : -3;
  const margin = Math.abs(game.teamScore - game.opponentScore);
  if (margin >= 14) {
    delta += game.result === "V" ? 0 : -1;
  }
  if (margin <= 4) {
    delta += game.result === "V" ? 0 : 1;
  }
  const psychology = getPsychologyEdge(getAdjustedPlayers());
  delta += game.result === "V"
    ? roundStat(psychology.confidence * 0.12 + psychology.clutch * 0.06)
    : roundStat(-Math.max(0, psychology.volatility) * 0.25 + psychology.focus * 0.12);
  adjustMorale(delta, `${game.result === "V" ? "Vitoria" : "Derrota"} contra ${game.opponent}`);
}

function maybeCreateDecision() {
  if (!state.season || state.season.pendingDecision) {
    return;
  }
  const triggerRounds = [1, 3, 5, 7, 9, 12, 15, 18, 21, 24, 27, 29];
  const nextRound = state.season.roundNumber + 1;
  const recentGames = state.season.games.slice(-3);
  const recentLosses = recentGames.filter((game) => game.result === "D").length;
  const recentWins = recentGames.filter((game) => game.result === "V").length;
  const eventChance = clamp(0.26 + recentLosses * 0.08 + recentWins * 0.04, 0.26, 0.58);
  if (!triggerRounds.includes(nextRound) && Math.random() > eventChance) {
    return;
  }
  const profileTemplates = getProfileDecisionTemplates();
  const availableTemplates = profileTemplates.length && Math.random() < 0.45
    ? profileTemplates
    : decisionTemplates;
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  state.season.pendingDecision = {
    title: template.title,
    text: template.text,
    choices: template.choices
  };
}

function getDecisionOutcome(choice) {
  const management = getManagementState();
  const psychology = getPsychologyEdge(getAdjustedPlayers());
  const stability = clamp(
    (management.focus - MANAGEMENT_BASELINE) * 0.004 +
    (management.chemistry - MANAGEMENT_BASELINE) * 0.003 +
    psychology.focus * 0.025 +
    psychology.chemistry * 0.018 -
    Math.max(0, psychology.volatility) * 0.025,
    -0.12,
    0.14
  );
  const risk = choice.modifiers.some((modifier) => Math.abs(modifier.amount) >= 4) ? 0.07 : 0;
  const roll = Math.random();
  const miracleChance = clamp(0.045 + stability * 0.45 - risk * 0.2, 0.02, 0.095);
  const greatChance = clamp(0.18 + stability - risk * 0.3, 0.08, 0.34);
  const badChance = clamp(0.22 - stability + risk, 0.1, 0.38);
  const disasterChance = clamp(0.055 - stability * 0.35 + risk * 0.5, 0.025, 0.12);

  if (roll < miracleChance) {
    return { key: "miracle", label: "Virada perfeita de bastidor", multiplier: 1.65, durationBonus: 2, morale: 3 };
  }
  if (roll < miracleChance + greatChance) {
    return { key: "great", label: "Plano encaixou acima do esperado", multiplier: 1.25, durationBonus: 1, morale: 1 };
  }
  if (roll > 1 - disasterChance) {
    return { key: "disaster", label: "Crise pesada apos a decisao", multiplier: 0.25, durationBonus: 0, morale: -3 };
  }
  if (roll > 1 - disasterChance - badChance) {
    return { key: "bad", label: "Plano teve efeito colateral", multiplier: 0.55, durationBonus: 0, morale: -1 };
  }
  return { key: "normal", label: "Plano executado sem grandes surpresas", multiplier: 1, durationBonus: 0, morale: 0 };
}

function getDecisionProbabilityLabel(choice) {
  const management = getManagementState();
  const psychology = getPsychologyEdge(getAdjustedPlayers());
  const stability = clamp(
    (management.focus - MANAGEMENT_BASELINE) * 0.004 +
    (management.chemistry - MANAGEMENT_BASELINE) * 0.003 +
    psychology.focus * 0.025 +
    psychology.chemistry * 0.018 -
    Math.max(0, psychology.volatility) * 0.025,
    -0.12,
    0.14
  );
  const risk = choice.modifiers.some((modifier) => Math.abs(modifier.amount) >= 4) ? 0.07 : 0;
  const miracleChance = clamp(0.045 + stability * 0.45 - risk * 0.2, 0.02, 0.095);
  const greatChance = clamp(0.18 + stability - risk * 0.3, 0.08, 0.34);
  const badChance = clamp(0.22 - stability + risk, 0.1, 0.38);
  const disasterChance = clamp(0.055 - stability * 0.35 + risk * 0.5, 0.025, 0.12);
  const normalChance = 1 - miracleChance - greatChance - badChance - disasterChance;
  return `Probabilidades: muito bom ${Math.round(miracleChance * 100)}% | bom ${Math.round(greatChance * 100)}% | normal ${Math.round(normalChance * 100)}% | ruim ${Math.round(badChance * 100)}% | muito ruim ${Math.round(disasterChance * 100)}%`;
}

function applyDecisionModifier(modifier, outcome, choiceLabel) {
  const scaledAmount = roundStat(modifier.amount * outcome.multiplier);
  const amount = scaledAmount === 0 && modifier.amount !== 0 ? (modifier.amount > 0 ? 1 : -1) : scaledAmount;
  const duration = Math.max(1, modifier.duration + (amount > 0 ? outcome.durationBonus : 0));

  if (modifier.key === "morale") {
    adjustMorale(amount, `Decisao: ${choiceLabel} (${outcome.label})`);
    return `Moral ${amount >= 0 ? "+" : ""}${amount}`;
  }
  state.season.activeModifiers.push({
    key: modifier.key,
    amount: clamp(amount, -4, 4),
    remainingGames: duration
  });
  return `${modifier.key.toUpperCase()} ${amount >= 0 ? "+" : ""}${amount} por ${duration} jogo(s)`;
}

function createDecisionInjury(label) {
  const candidates = getAdjustedPlayers().filter((player) => player.healthStatus === "healthy");
  if (!candidates.length) {
    return null;
  }
  const target = candidates
    .map((player) => ({ player, riskScore: 100 - player.physical + randomBetween(0, 16) }))
    .sort((a, b) => b.riskScore - a.riskScore)[0].player;
  const duration = Math.random() > 0.6 ? 4 : 3;
  state.season.injuries[target.id] = {
    label,
    returnRound: state.season.roundNumber + duration
  };
  return target;
}

function applyExtremeDecisionOutcome(outcome) {
  if (outcome.key === "miracle") {
    state.season.activeModifiers.push({ key: "tactical", amount: 2, remainingGames: 2 });
    adjustManagement({ chemistry: 2, confidence: 2, focus: 1, intensity: 0 }, "Onda positiva da decisao");
    return "O elenco comprou a ideia, o vestiario ganhou energia e a leitura tatica sobe por dois jogos.";
  }
  if (outcome.key === "disaster") {
    state.season.activeModifiers.push({ key: "tactical", amount: -2, remainingGames: 2 });
    adjustManagement({ chemistry: -2, confidence: -2, focus: -2, intensity: 2 }, "Crise gerada pela decisao");
    const injured = Math.random() < 0.5 ? createDecisionInjury("sobrecarga apos decisao") : null;
    return injured
      ? `A crise tambem virou problema fisico: ${injured.name} entrou no departamento medico.`
      : "A crise bateu no treino, derrubou a organizacao e deixou o ambiente mais nervoso.";
  }
  return "";
}

function getDecisionResponse(choice, outcome, impacts, extraText) {
  const tone = outcome.key === "miracle" ? "response-great"
    : outcome.key === "great" ? "response-good"
    : outcome.key === "bad" ? "response-bad"
    : outcome.key === "disaster" ? "response-disaster"
    : "response-normal";
  const impactText = impacts.length ? impacts.join(" | ") : "Sem modificador direto";
  return {
    tone,
    title: outcome.label,
    choice: choice.label,
    text: `${choice.label}: ${outcome.label}. ${extraText || "A decisao gerou impacto controlado no curto prazo."}`,
    impacts: impactText,
    round: state.season.roundNumber
  };
}

function renderDecisionResultCard(compact = false) {
  const result = state.season?.lastDecisionResult;
  if (!result) {
    return "";
  }
  return `
    <article class="decision-response ${result.tone} ${compact ? "compact-response" : ""}">
      <span class="season-key">Resposta da decisao</span>
      <strong>${result.title}</strong>
      <p>${result.text}</p>
      <div class="effect-line">${result.impacts}</div>
    </article>
  `;
}

function resolveDecision(choiceIndex) {
  if (!state.season?.pendingDecision) {
    return;
  }
  const choice = state.season.pendingDecision.choices[choiceIndex];
  const outcome = getDecisionOutcome(choice);
  const impacts = choice.modifiers.map((modifier) => applyDecisionModifier(modifier, outcome, choice.label)).filter(Boolean);
  if (outcome.morale) {
    adjustMorale(outcome.morale, outcome.label);
    impacts.push(`Moral ${outcome.morale >= 0 ? "+" : ""}${outcome.morale}`);
  }
  const extraText = applyExtremeDecisionOutcome(outcome);
  adjustManagement({
    chemistry: outcome.key === "miracle" ? 2 : outcome.key === "great" ? 1 : outcome.key === "bad" ? -1 : outcome.key === "disaster" ? -2 : 0,
    confidence: outcome.key === "miracle" ? 2 : outcome.key === "great" ? 1 : outcome.key === "bad" ? -2 : outcome.key === "disaster" ? -3 : 0,
    focus: outcome.key === "miracle" ? 1 : outcome.key === "great" ? 1 : outcome.key === "bad" ? -1 : outcome.key === "disaster" ? -2 : 0,
    intensity: outcome.key === "bad" ? 1 : outcome.key === "disaster" ? 2 : 0
  }, `Gestao afetada: ${choice.label}`);
  state.season.lastDecisionResult = getDecisionResponse(choice, outcome, impacts, extraText);
  addPsychologyLog("Desdobramento da decisao", `${choice.label}: ${outcome.label}.`, outcome.morale);
  state.season.pendingDecision = null;
  render();
}

function applyManagementAction(actionKey) {
  if (!state.season || !isManagementActionAvailable()) {
    return;
  }

  const action = getManagementActions().find((item) => item.key === actionKey);
  if (!action) {
    return;
  }

  const management = getManagementState();
  adjustManagement(action.changes, null);
  state.season.management.lastActionRound = getRoundMarker();

  if (action.morale) {
    adjustMorale(action.morale, `Gestao: ${action.label}`);
  }

  action.modifiers.forEach((modifier) => {
    state.season.activeModifiers.push({
      key: modifier.key,
      amount: modifier.amount,
      remainingGames: modifier.duration
    });
  });

  state.season.managementLog.unshift({
    round: state.season.roundNumber + 1,
    label: action.label,
    weightLabel: action.weightLabel,
    description: action.description
  });
  state.season.managementLog = state.season.managementLog.slice(0, 8);
  render();
}

function decayActiveModifiers() {
  if (!state.season) {
    return;
  }
  state.season.activeModifiers = state.season.activeModifiers
    .map((modifier) => ({ ...modifier, remainingGames: modifier.remainingGames - 1 }))
    .filter((modifier) => modifier.remainingGames > 0);
}

function applyWeeklyTraining() {
  if (!state.season || state.season.phase !== "regular") {
    return;
  }
  const plan = trainingPlans[state.trainingFocus];
  getSelectedPlayers().forEach((player) => {
    const progress = state.season.playerProgress[player.id];
    const growth = player.development || 1;
    Object.entries(plan.progress).forEach(([key, value]) => {
      progress[key] = clampTrainingProgressValue(player, key, (progress[key] || 0) + value * growth * 0.45);
    });
  });
  if (plan.modifier) {
    state.season.activeModifiers.push({
      key: plan.modifier.key,
      amount: Math.max(1, roundStat(plan.modifier.amount * 0.55)),
      remainingGames: 1
    });
  }
  state.season.trainingLog.unshift({
    round: state.season.roundNumber,
    label: plan.label,
    description: plan.description
  });
  state.season.trainingLog = state.season.trainingLog.slice(0, 8);
}

function maybeCreateInjury(teamProfile) {
  if (!state.season) {
    return;
  }
  const staffBonus = getStaffEffects();
  const intensityRisk = Math.max(0, getManagementState().intensity - MANAGEMENT_BASELINE) * 0.0015;
  const risk = clamp(0.04 + teamProfile.fatigueLoad * 0.011 + intensityRisk - (teamProfile.physical - 76) * 0.001 - staffBonus.injuryPrevention, 0.012, 0.12);
  if (Math.random() > risk) {
    return;
  }
  const candidates = getAdjustedPlayers().filter((player) => player.healthStatus === "healthy");
  if (!candidates.length) {
    return;
  }
  const target = candidates
    .map((player) => ({ player, riskScore: 100 - player.physical + randomBetween(0, 10) }))
    .sort((a, b) => b.riskScore - a.riskScore)[0].player;
  const duration = Math.random() > 0.75 ? 3 : 2;
  state.season.injuries[target.id] = {
    label: duration === 3 ? "lesao muscular" : "torcao leve",
    returnRound: state.season.roundNumber + duration
  };
}

function maybeCreatePsychologyEvent(teamProfile, game) {
  if (!state.season) {
    return;
  }
  const selected = getAdjustedPlayers();
  const psychology = getPsychologyEdge(selected);
  const instabilityRisk = Math.max(0, psychology.volatility) * 0.06;
  const leadershipChance = Math.max(0, psychology.chemistry + psychology.confidence) * 0.018;

  if (game.result === "D" && state.season.morale <= 70 && Math.random() < 0.16 + instabilityRisk) {
    adjustMorale(-2, "Ruido interno apos derrota");
    state.season.activeModifiers.push({ key: "technique", amount: -1, remainingGames: 1 });
    addPsychologyLog("Vestiario pesado", "Um perfil mais instavel contaminou a execucao ofensiva por um jogo.", -2);
    return;
  }

  if (game.result === "V" && state.season.morale >= 78 && Math.random() < 0.12 + leadershipChance) {
    adjustMorale(1, "Liderancas sustentaram o embalo");
    state.season.activeModifiers.push({ key: "defense", amount: 1, remainingGames: 1 });
    addPsychologyLog("Grupo conectado", "As liderancas estabilizaram o time e seguraram a intensidade.", 1);
  }
}

function applyEventModifiers(event) {
  if (event.management) {
    adjustManagement(event.management, event.label);
  }
  event.modifiers.forEach((modifier) => {
    if (modifier.key === "morale") {
      adjustMorale(modifier.amount, event.label);
      return;
    }
    state.season.activeModifiers.push({
      key: modifier.key,
      amount: modifier.amount,
      remainingGames: modifier.duration
    });
  });
}

function maybeCreateRandomSeasonEvent(teamProfile, game) {
  if (!state.season) {
    return;
  }

  const streak = getRecentWinStreak();
  const lossStreak = state.season.games.slice(-3).filter((item) => item.result === "D").length;
  const eventChance = clamp(0.2 + teamProfile.fatigueLoad * 0.018 + streak * 0.025 + lossStreak * 0.04, 0.18, 0.48);
  if (Math.random() > eventChance) {
    return;
  }

  const events = [
    { label: "Scout adversario encaixou", description: "A liga ajustou marcacoes contra seus gatilhos ofensivos.", amount: -1, management: { confidence: -1, focus: 1 }, modifiers: [{ key: "technique", amount: -2, duration: 1 }, { key: "tactical", amount: -1, duration: 1 }] },
    { label: "Treino rendeu acima do esperado", description: "O grupo saiu da semana com leitura melhor de espacamento.", amount: 1, management: { confidence: 1, focus: 1 }, modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "shooting", amount: 1, duration: 1 }] },
    { label: "Pernas pesadas", description: "A acumulacao de jogos tirou explosao no fim da partida.", amount: -1, management: { intensity: -1, focus: -1 }, modifiers: [{ key: "physical", amount: -2, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] },
    { label: "Banco deu resposta", description: "A segunda unidade trouxe energia e subiu a disputa interna.", amount: 1, management: { chemistry: 1, intensity: 1 }, modifiers: [{ key: "physical", amount: 1, duration: 2 }, { key: "defense", amount: 1, duration: 1 }] },
    { label: "Ruido de rotacao", description: "Minutos mal distribuidos afetaram confianca de parte do elenco.", amount: -2, management: { chemistry: -2, confidence: -1 }, modifiers: [{ key: "morale", amount: -2, duration: 1 }, { key: "technique", amount: -1, duration: 1 }] },
    { label: "Noite de foco coletivo", description: "O time comprou o plano e protegeu melhor a bola.", amount: 1, management: { focus: 2, chemistry: 1 }, modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "defense", amount: 1, duration: 1 }] },
    { label: "Oponente forca mismatch", description: "O proximo rival vai atacar uma fragilidade fisica do elenco.", amount: -1, management: { focus: -1, confidence: -1 }, modifiers: [{ key: "physical", amount: -1, duration: 1 }, { key: "defense", amount: -2, duration: 1 }] },
    { label: "Arremesso voltou a cair", description: "A confianca do perimetro cresceu no treino aberto.", amount: 1, management: { confidence: 2 }, modifiers: [{ key: "shooting", amount: 2, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] }
  ];
  const event = events[Math.floor(Math.random() * events.length)];
  applyEventModifiers(event);
  addPsychologyLog(event.label, event.description, event.amount);
}

function simulateLeagueRound(roundInfo, userGame) {
  const table = state.season.leagueTable;
  table.round = roundInfo.roundNumber;
  const rows = Object.fromEntries(table.teams.map((team) => [team.id, team]));

  roundInfo.matches.forEach((match) => {
    const homeRow = rows[match.homeId];
    const awayRow = rows[match.awayId];
    if (match.homeId === USER_TEAM_ID || match.awayId === USER_TEAM_ID) {
      const userWasHome = match.homeId === USER_TEAM_ID;
      const teamScore = userWasHome ? userGame.teamScore : userGame.opponentScore;
      const opponentScore = userWasHome ? userGame.opponentScore : userGame.teamScore;
      recordLeagueGame(homeRow, awayRow, { teamScore, opponentScore });
      return;
    }

    const homeProfile = buildOpponentProfile(getOpponents().find((team) => team.id === match.homeId));
    const awayProfile = buildOpponentProfile(getOpponents().find((team) => team.id === match.awayId));
    const homeGame = simulateBasketballGame(homeProfile, awayProfile, {
      homeEdge: 1.6,
      momentum: randomBetween(-0.8, 0.8),
      easeBonus: 0,
      fatiguePenalty: 0
    });
    const awayGame = simulateBasketballGame(awayProfile, homeProfile, {
      homeEdge: -1.2,
      momentum: randomBetween(-0.8, 0.8),
      easeBonus: 0,
      fatiguePenalty: 0
    });
    applyTiebreaker(homeGame, awayGame, homeProfile);
    recordLeagueGame(homeRow, awayRow, { teamScore: homeGame.points, opponentScore: awayGame.points });
  });
}

function getRegularSeasonStatus(rank) {
  if (rank <= 4) {
    return "Mando no playoff";
  }
  if (rank <= 8) {
    return "Zona de playoff";
  }
  if (rank <= 14) {
    return "Meio de tabela";
  }
  return "Zona de rebaixamento";
}

function createPlayoffBracket() {
  const standings = getSortedLeagueTeams();
  const topEight = standings.slice(0, 8);
  const userSeed = topEight.findIndex((team) => team.id === USER_TEAM_ID) + 1;
  state.season.relegatedTeams = standings.slice(-2).map((team) => team.name);

  if (!userSeed) {
    return {
      qualified: false,
      seed: null,
      currentRoundIndex: -1,
      rounds: [],
      eliminated: false,
      champion: false
    };
  }

  const seedMap = Object.fromEntries(topEight.map((team, index) => [index + 1, team]));
  const pathMap = {
    1: [8, 4, 2],
    2: [7, 3, 1],
    3: [6, 2, 1],
    4: [5, 1, 2],
    5: [4, 1, 2],
    6: [3, 2, 1],
    7: [2, 3, 1],
    8: [1, 4, 2]
  };
  const roundNames = ["Quartas de final", "Semifinal", "Final"];
  const rounds = pathMap[userSeed].map((opponentSeed, index) => ({
    name: roundNames[index],
    opponentSeed,
    opponent: seedMap[opponentSeed],
    teamWins: 0,
    opponentWins: 0,
    bestOf: 3
  }));

  return {
    qualified: true,
    seed: userSeed,
    currentRoundIndex: 0,
    rounds,
    eliminated: false,
    champion: false
  };
}

function moveToPlayoffs() {
  state.season.playoffs = createPlayoffBracket();
  if (state.season.playoffs.qualified) {
    state.season.phase = "playoffs";
    maybeCreateDecision();
  } else {
    state.season.phase = "finished";
  }
}

function getCurrentRound() {
  if (!state.season || state.season.phase !== "playoffs") {
    return null;
  }
  return state.season.playoffs.rounds[state.season.playoffs.currentRoundIndex] || null;
}

function getUpcomingGameInfo() {
  if (!state.season) {
    return null;
  }

  if (state.season.phase === "regular") {
    const roundInfo = state.season.schedule[state.season.currentRoundIndex];
    if (!roundInfo) {
      return null;
    }
    const match = roundInfo.matches.find((item) => item.homeId === USER_TEAM_ID || item.awayId === USER_TEAM_ID);
    const isHome = match.homeId === USER_TEAM_ID;
    const opponentId = isHome ? match.awayId : match.homeId;
    return {
      phase: "regular",
      roundInfo,
      home: isHome,
      opponent: getOpponents().find((team) => team.id === opponentId)
    };
  }

  if (state.season.phase === "playoffs") {
    const round = getCurrentRound();
    if (!round) {
      return null;
    }
    const higherSeed = state.season.playoffs.seed < round.opponentSeed;
    const gamesPlayed = round.teamWins + round.opponentWins;
    const homePattern = higherSeed ? [true, false, true] : [false, true, false];
    return {
      phase: "playoffs",
      round,
      gameInSeries: gamesPlayed + 1,
      home: homePattern[gamesPlayed],
      opponent: getOpponents().find((team) => team.name === round.opponent.name)
    };
  }

  return null;
}

function recordGame(game) {
  state.season.games.push(game);
  state.season.lastGame = game;
}

function getLiveMatchKey(upcoming) {
  if (!upcoming) return "";
  if (upcoming.phase === "regular") return `regular-${upcoming.roundInfo.roundNumber}-${upcoming.opponent.id}`;
  return `playoffs-${upcoming.round.name}-${upcoming.gameInSeries}-${upcoming.opponent.id}`;
}

function createLiveOpponentRoster(opponent) {
  const positions = ["PG", "SG", "SF", "PF", "C", "G", "F", "C"];
  return positions.map((pos, index) => ({
    id: `opp-${opponent.id}-${index + 1}`,
    name: `${opponent.name} ${index + 1}`,
    teamId: "away",
    pos,
    usage: index < 5 ? 1.1 : 0.55
  }));
}

function createLiveTeamPayload(upcoming, teamProfile, opponentProfile) {
  const userRoster = teamProfile.rotation.map((player, index) => ({
    id: String(player.id),
    name: player.name,
    teamId: upcoming.home ? "home" : "away",
    pos: player.pos,
    usage: index < 5 ? getPlayerUsageMultiplier(player) : getPlayerUsageMultiplier(player) * 0.55
  }));
  const opponentRoster = createLiveOpponentRoster(upcoming.opponent).map((player) => ({
    ...player,
    teamId: upcoming.home ? "away" : "home"
  }));

  const userTeam = {
    id: USER_TEAM_ID,
    name: getUserTeamName(),
    roster: userRoster,
    rating: getTeamRating(teamProfile),
    offense: roundStat((teamProfile.threePoint + teamProfile.finishing + teamProfile.spacing + teamProfile.tactical) / 4),
    defense: roundStat((teamProfile.defense + teamProfile.perimeterDefense + teamProfile.interiorDefense) / 3),
    threeRate: clamp(0.32 + (teamProfile.threePoint - 75) * 0.004, 0.24, 0.52)
  };

  const opponentTeam = {
    id: upcoming.opponent.id,
    name: upcoming.opponent.name,
    roster: opponentRoster,
    rating: getTeamRating(opponentProfile),
    offense: roundStat((opponentProfile.threePoint + opponentProfile.finishing + opponentProfile.spacing + opponentProfile.tactical) / 4),
    defense: roundStat((opponentProfile.defense + opponentProfile.perimeterDefense + opponentProfile.interiorDefense) / 3),
    threeRate: clamp(0.31 + (opponentProfile.threePoint - 75) * 0.003, 0.22, 0.48)
  };

  return upcoming.home
    ? { homeTeam: userTeam, awayTeam: opponentTeam }
    : { homeTeam: opponentTeam, awayTeam: userTeam };
}

function getLiveUserStats(liveState) {
  return Object.values(liveState.playerStats || {}).filter((stats) => {
    const playerId = Number(stats.playerId);
    return state.selectedIds.includes(playerId);
  });
}

function buildLiveScorers(liveState) {
  return getLiveUserStats(liveState)
    .sort((a, b) => b.points - a.points || b.efficiency - a.efficiency)
    .slice(0, 4)
    .map((stats) => ({ name: stats.playerName, points: Math.round(stats.points || 0) }));
}

function getBasketballStatsSchema() {
  return window.TemporadaTotal?.BasketballMatchAdapter?.getMatchStatsSchema?.() || [
    { key: "minutes", label: "MIN" },
    { key: "points", label: "PTS" },
    { key: "rebounds", label: "REB" },
    { key: "assists", label: "AST" },
    { key: "steals", label: "STL" },
    { key: "blocks", label: "BLK" },
    { key: "turnovers", label: "TO" },
    { key: "fouls", label: "PF" },
    { key: "efficiency", label: "EFF" }
  ];
}

// Resolves the current roster position for saved stat rows that came from older saves.
function getPlayerPositionLabel(playerId, fallback = "") {
  const player = getPlayerById(Number(playerId));
  return player?.pos || fallback || "";
}

// Normalizes a stat row so renderers can read old saves and new match snapshots the same way.
function normalizePlayerStatRow(rawStats = {}) {
  const schema = getBasketballStatsSchema();
  const playerId = String(rawStats.playerId ?? "");
  const player = getPlayerById(Number(playerId));
  return {
    playerId,
    playerName: rawStats.playerName || player?.name || "Atleta",
    position: rawStats.position || player?.pos || "",
    games: Number(rawStats.games) || 0,
    ...Object.fromEntries(schema.map((stat) => [stat.key, Number(rawStats[stat.key]) || 0]))
  };
}

// Captures only the user's roster stats from the finished live match.
function createMatchPlayerStatsSnapshot(liveState) {
  return getLiveUserStats(liveState).map((matchStats) => normalizePlayerStatRow({
    ...matchStats,
    playerId: String(matchStats.playerId),
    position: getPlayerPositionLabel(matchStats.playerId, matchStats.position),
    games: 1
  }));
}

// Creates the season stat bucket lazily to keep old saves compatible.
function ensureSeasonPlayerStats() {
  if (!state.season) return {};
  state.season.playerStats = state.season.playerStats || {};
  return state.season.playerStats;
}

// Accumulates one finished live match into season totals without changing older saves.
function accumulateSeasonPlayerStats(matchStatsRows) {
  if (!state.season) return;
  const schema = getBasketballStatsSchema();
  const seasonStats = ensureSeasonPlayerStats();
  matchStatsRows.forEach((matchStats) => {
    const playerId = String(matchStats.playerId);
    const current = normalizePlayerStatRow(seasonStats[playerId] || {
      playerId,
      playerName: matchStats.playerName,
      position: matchStats.position,
      games: 0,
      ...Object.fromEntries(schema.map((stat) => [stat.key, 0]))
    });
    current.games += 1;
    schema.forEach((stat) => {
      current[stat.key] = (Number(current[stat.key]) || 0) + (Number(matchStats[stat.key]) || 0);
    });
    seasonStats[playerId] = current;
  });
}

function calculatePlayerAverages(totalStats) {
  const row = normalizePlayerStatRow(totalStats);
  const games = Math.max(1, row.games || 0);
  return {
    ...row,
    games: row.games,
    ...Object.fromEntries(getBasketballStatsSchema().map((stat) => [stat.key, row[stat.key] / games]))
  };
}

// Builds reusable rankings for leaders and tables.
function getPlayerStatsRankings(rows) {
  const sortedBy = (key) => rows.slice().sort((a, b) => (Number(b[key]) || 0) - (Number(a[key]) || 0));
  return {
    scorers: sortedBy("points"),
    assistants: sortedBy("assists"),
    rebounders: sortedBy("rebounds"),
    efficiency: sortedBy("efficiency")
  };
}

// Picks the four headline leaders used by match and season cards.
function getTeamStatLeaders(rows) {
  const rankings = getPlayerStatsRankings(rows);
  return [
    { key: "points", label: "Cestinha", player: rankings.scorers[0], suffix: "pts" },
    { key: "assists", label: "Melhor passador", player: rankings.assistants[0], suffix: "ast" },
    { key: "rebounds", label: "Melhor reboteiro", player: rankings.rebounders[0], suffix: "reb" },
    { key: "efficiency", label: "Mais eficiente", player: rankings.efficiency[0], suffix: "eff" }
  ];
}

function formatStatValue(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function finishLiveBasketballGame(liveState) {
  const upcoming = getUpcomingGameInfo();
  if (!state.season || !upcoming || state.season.liveMatchRecordedKey === liveMatchKey) {
    return;
  }

  const teamProfile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const userIsHome = liveState.homeTeam.id === USER_TEAM_ID;
  const teamScore = userIsHome ? liveState.score.home : liveState.score.away;
  const opponentScore = userIsHome ? liveState.score.away : liveState.score.home;
  const didWin = teamScore > opponentScore;

  if (upcoming.phase === "regular") {
    state.season.roundNumber = upcoming.roundInfo.roundNumber;
    state.season.currentRoundIndex += 1;
    if (didWin) state.season.wins += 1;
    else state.season.losses += 1;
  } else {
    const round = getCurrentRound();
    if (didWin) round.teamWins += 1;
    else round.opponentWins += 1;
  }

  const userStats = getLiveUserStats(liveState);
  const matchPlayerStats = createMatchPlayerStatsSnapshot(liveState);
  const game = {
    phase: upcoming.phase,
    label: upcoming.phase === "regular" ? `Rodada ${upcoming.roundInfo.roundNumber}` : upcoming.round.name,
    venue: upcoming.home ? "Casa" : "Fora",
    opponent: upcoming.opponent.name,
    style: upcoming.opponent.style,
    result: didWin ? "V" : "D",
    teamScore,
    opponentScore,
    record: getRecordLabel(state.season.wins, state.season.losses),
    rebounds: userStats.reduce((sum, stats) => sum + Math.round(stats.rebounds || 0), 0),
    possessions: liveState.clock.tick,
    threePct: "ao vivo",
    twoPct: "ao vivo",
    scorers: buildLiveScorers(liveState),
    scorersSummary: getScorersSummary(buildLiveScorers(liveState), "pts"),
    tactics: { ...state.tactics },
    playerStats: matchPlayerStats,
    bestPlayerId: getPlayerStatsRankings(matchPlayerStats).efficiency[0]?.playerId || null,
    liveEvents: liveState.events.slice(0, 16),
    playoffSeries: upcoming.phase === "playoffs" ? `${getCurrentRound().teamWins}-${getCurrentRound().opponentWins}` : null
  };

  recordGame(game);
  accumulateSeasonPlayerStats(matchPlayerStats);
  state.season.liveMatchRecordedKey = liveMatchKey;
  applyResultMorale(game);
  simulateLeagueRound(upcoming.roundInfo || { roundNumber: state.season.roundNumber, matches: [] }, game);
  maybeCreateInjury(teamProfile);
  maybeCreatePsychologyEvent(teamProfile, game);
  maybeCreateRandomSeasonEvent(teamProfile, game);
  driftManagementAfterGame(game, teamProfile);
  applyWeeklyTraining();
  decayActiveModifiers();

  if (upcoming.phase === "regular") {
    if (state.season.currentRoundIndex >= state.season.schedule.length) {
      moveToPlayoffs();
    } else {
      maybeCreateDecision();
    }
  } else {
    const round = getCurrentRound();
    if (round.teamWins >= 2) {
      state.season.playoffs.currentRoundIndex += 1;
      if (state.season.playoffs.currentRoundIndex >= state.season.playoffs.rounds.length) {
        state.season.playoffs.champion = true;
        state.season.phase = "finished";
      } else {
        maybeCreateDecision();
      }
    } else if (round.opponentWins >= 2) {
      state.season.playoffs.eliminated = true;
      state.season.phase = "finished";
    } else {
      maybeCreateDecision();
    }
  }
}

function prepareLiveBasketballMatch(root) {
  const upcoming = getUpcomingGameInfo();
  const adapter = window.TemporadaTotal.BasketballMatchAdapter;
  const hasLiveModules = window.TemporadaTotal?.createLiveSimulation && window.TemporadaTotal?.createLiveMatchUI;
  if (!root || !state.season || !upcoming || state.season.pendingDecision || !adapter || !hasLiveModules) {
    return;
  }

  const nextKey = getLiveMatchKey(upcoming);
  if (!liveMatchController || liveMatchKey !== nextKey) {
    const teamProfile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
    const opponentProfile = buildOpponentProfile(upcoming.opponent);
    const { homeTeam, awayTeam } = createLiveTeamPayload(upcoming, teamProfile, opponentProfile);
    liveMatchKey = nextKey;
    liveMatchController = window.TemporadaTotal.createLiveSimulation({
      adapter,
      homeTeam,
      awayTeam,
      onUpdate: (liveState) => {
        liveMatchUi?.render(liveState);
        if (liveState.status === "finished") {
          renderControls();
        }
      }
    });
  }

  if (!liveMatchUi || liveMatchRoot !== root) {
    liveMatchRoot = root;
    liveMatchUi = window.TemporadaTotal.createLiveMatchUI({
      root,
      schema: adapter.getMatchStatsSchema(),
      onStart: () => liveMatchController.start(),
      onPause: () => liveMatchController.pause(),
      onSpeed: (speed) => liveMatchController.setSpeed(speed),
      onCoachingChange: (patch, meta) => liveMatchController.setCoaching?.(patch, meta),
      onFinish: () => liveMatchController.finish(),
      canSaveResult: (liveState) => liveState.status === "finished" && state.season?.liveMatchRecordedKey !== liveMatchKey,
      onSaveResult: (liveState) => {
        finishLiveBasketballGame(liveState);
        clearLiveMatch();
        render();
        switchTab("partida");
      }
    });
  }

  liveMatchUi.render(liveMatchController.getState());
}

function openLiveMatchTab() {
  if (!state.season || state.season.pendingDecision || !getUpcomingGameInfo()) {
    switchTab("partida");
    renderLiveMatchPage();
    return;
  }
  prepareLiveBasketballMatch(liveMatchPageRootEl);
  switchTab("partida");
}

function simulateCurrentGame() {
  const upcoming = getUpcomingGameInfo();
  if (!upcoming) {
    return;
  }

  const recentGames = state.season.games.slice(-4);
  const momentum = recentGames.reduce((sum, game) => sum + (game.result === "V" ? 0.5 : -0.4), 0);
  const teamProfile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const opponentProfile = buildOpponentProfile(upcoming.opponent);
  const easeBonus = getSimulationEaseModifier();
  const balance = getSeasonBalanceContext(teamProfile, opponentProfile);
  const upsetPulse = Math.random() < 0.22 ? randomBetween(1.4, 4.2) : 0;

  const teamBox = simulateBasketballGame(teamProfile, opponentProfile, {
    homeEdge: upcoming.home ? 2.3 : -1.6,
    momentum: momentum - balance.teamDrag - upsetPulse * 0.35 + randomBetween(-balance.chaos, balance.chaos),
    easeBonus: easeBonus - balance.teamDrag * 0.25,
    fatiguePenalty: teamProfile.fatigueLoad + balance.teamDrag * 0.28 + upsetPulse * 0.12
  });

  const opponentBox = simulateBasketballGame(opponentProfile, teamProfile, {
    homeEdge: upcoming.home ? -1.2 : 2,
    momentum: randomBetween(-1.4, 1.4) + balance.opponentBoost + upsetPulse,
    easeBonus: balance.opponentBoost * 0.45 + upsetPulse * 0.25,
    fatiguePenalty: 0.6
  });

  applyTiebreaker(teamBox, opponentBox, teamProfile);
  const scorers = buildBasketballScorers(teamProfile, teamBox);

  const didWin = teamBox.points > opponentBox.points;
  if (upcoming.phase === "regular") {
    state.season.roundNumber = upcoming.roundInfo.roundNumber;
    state.season.currentRoundIndex += 1;
    if (didWin) {
      state.season.wins += 1;
    } else {
      state.season.losses += 1;
    }
  } else {
    const round = getCurrentRound();
    if (didWin) {
      round.teamWins += 1;
    } else {
      round.opponentWins += 1;
    }
  }

  const game = {
    phase: upcoming.phase,
    label: upcoming.phase === "regular" ? `Rodada ${upcoming.roundInfo.roundNumber}` : upcoming.round.name,
    venue: upcoming.home ? "Casa" : "Fora",
    opponent: upcoming.opponent.name,
    style: upcoming.opponent.style,
    result: didWin ? "V" : "D",
    teamScore: teamBox.points,
    opponentScore: opponentBox.points,
    record: getRecordLabel(state.season.wins, state.season.losses),
    rebounds: teamBox.rebounds,
    possessions: teamBox.possessions,
    threePct: `${Math.round(teamBox.threePct * 100)}%`,
    twoPct: `${Math.round(teamBox.twoPct * 100)}%`,
    scorers,
    scorersSummary: getScorersSummary(scorers, "pts"),
    tactics: { ...state.tactics },
    playoffSeries: upcoming.phase === "playoffs" ? `${getCurrentRound().teamWins}-${getCurrentRound().opponentWins}` : null
  };

  recordGame(game);
  applyResultMorale(game);
  simulateLeagueRound(upcoming.roundInfo || { roundNumber: state.season.roundNumber, matches: [] }, game);
  maybeCreateInjury(teamProfile);
  maybeCreatePsychologyEvent(teamProfile, game);
  maybeCreateRandomSeasonEvent(teamProfile, game);
  driftManagementAfterGame(game, teamProfile);
  applyWeeklyTraining();
  decayActiveModifiers();

  if (upcoming.phase === "regular") {
    if (state.season.currentRoundIndex >= state.season.schedule.length) {
      moveToPlayoffs();
    } else {
      maybeCreateDecision();
    }
  } else {
    const round = getCurrentRound();
    if (round.teamWins >= 2) {
      state.season.playoffs.currentRoundIndex += 1;
      if (state.season.playoffs.currentRoundIndex >= state.season.playoffs.rounds.length) {
        state.season.playoffs.champion = true;
        state.season.phase = "finished";
      } else {
        maybeCreateDecision();
      }
    } else if (round.opponentWins >= 2) {
      state.season.playoffs.eliminated = true;
      state.season.phase = "finished";
    } else {
      maybeCreateDecision();
    }
  }
}

function playNextGame() {
  if (!state.season || state.season.pendingDecision || state.season.phase === "finished") {
    return;
  }
  clearLiveMatch();
  simulateCurrentGame();
  render();
}

function startSeason() {
  if (state.selectedIds.length !== getRosterSize()) {
    return;
  }
  clearLiveMatch();
  state.season = createSeason();
  maybeCreateDecision();
  switchTab("front-office");
  render();
}

function renderSaveList() {
  const saves = getSavedGames();
  const categories = Object.keys(saves).sort((a, b) => a.localeCompare(b));
  saveListInput.innerHTML = categories.length
    ? categories.map((category) => `<option value="${category}">${category}</option>`).join("")
    : '<option value="">Nenhum save encontrado</option>';
  loadGameButton.disabled = categories.length === 0;
  deleteSaveButton.disabled = categories.length === 0;
}

function saveGame() {
  const category = getSaveCategory();
  const saves = getSavedGames();
  saves[category] = {
    savedAt: new Date().toISOString(),
    payload: getSavePayload()
  };
  setSavedGames(saves);
  saveCategoryInput.value = category;
  renderSaveList();
  saveListInput.value = category;
  setSaveStatus(`Categoria "${category}" salva com sucesso.`);
}

function loadGame() {
  const category = saveListInput.value;
  const save = getSavedGames()[category];
  if (!save) {
    setSaveStatus("Escolha uma categoria salva para carregar.");
    return;
  }
  clearLiveMatch();
  state.division = save.payload.division || "masculino";
  state.selectedIds = save.payload.selectedIds || [];
  state.playerUsage = normalizePlayerUsageMap(save.payload.playerUsage);
  state.tactics = { ...defaultTactics, ...(save.payload.tactics || {}) };
  state.trainingFocus = save.payload.trainingFocus || "shooting";
  state.scouting = normalizeScoutingState(save.payload.scouting);
  state.settings = normalizeSettings(save.payload.settings);
  state.season = normalizeSeason(save.payload.season || null);
  saveCategoryInput.value = category;
  setSaveStatus(`Categoria "${category}" carregada.`);
  render();
}

function deleteSave() {
  const category = saveListInput.value;
  if (!category) {
    return;
  }
  const saves = getSavedGames();
  delete saves[category];
  setSavedGames(saves);
  renderSaveList();
  setSaveStatus(`Categoria "${category}" excluida.`);
}

function describeTactics(tactics) {
  const labels = {
    slow: "ritmo cadenciado",
    balanced: "equilibrio",
    fast: "ritmo acelerado",
    paint: "foco no garrafao",
    perimeter: "foco no perimetro",
    crash: "ataque ao rebote",
    transition: "transicao primeiro",
    pressure: "pressao total",
    short: "rotacao curta",
    normal: "rotacao normal",
    deep: "rotacao profunda"
  };
  return [labels[tactics.pace], labels[tactics.shot], labels[tactics.rebound], labels[tactics.defense], labels[tactics.rotation]].join(", ");
}

function getTrainingFocusLabel() {
  return trainingPlans[state.trainingFocus].label;
}

function renderRoster() {
  const adjusted = getAdjustedPlayers();
  rosterCountEl.textContent = `${adjusted.length} / ${getRosterSize()}`;

  const items = adjusted.map((player) => `
    <article class="selected-player">
      <span class="pill">${player.pos}</span>
      <div>
        <strong>${player.name}</strong>
        <div class="player-meta">${renderPlayerProfileLine(player)}</div>
        <div class="team-formula">ALT ${formatHeightCm(player.heightCm)} | 3PT ${player.threePoint} | FIS ${player.physical} | TAT ${player.tactical} | TEC ${player.technique} | DEF ${player.defense}</div>
        ${renderPlayerProfileDetails(player)}
        <label class="usage-control">
          <span>Foco ofensivo</span>
          <select class="player-usage-select" data-player-id="${player.id}">
            ${PLAYER_USAGE_LEVELS.map((option) => `<option value="${option.value}"${getPlayerUsageMultiplier(player) === option.value ? " selected" : ""}>${option.label}</option>`).join("")}
          </select>
          <span class="hint">Peso atual: ${describePlayerUsage(getPlayerUsageMultiplier(player))}</span>
        </label>
        <div class="status-row"><span class="status-pill ${player.healthStatus}">${player.healthStatus === "healthy" ? "Disponivel" : player.healthStatus === "limited" ? "Limitado" : "Fora"}</span><span class="injury-line">${player.healthNote}</span></div>
      </div>
      <button class="remove-button" data-player-id="${player.id}" type="button">Remover</button>
    </article>
  `);

  const emptySlots = Array.from({ length: getRosterSize() - adjusted.length }, (_, index) => `
    <div class="empty-slot">Vaga ${adjusted.length + index + 1} aguardando contratacao</div>
  `);

  selectedRosterEl.innerHTML = [...items, ...emptySlots].join("");
  selectedRosterEl.querySelectorAll(".player-usage-select").forEach((select) => {
    select.addEventListener("change", () => {
      const player = getPlayerById(Number(select.dataset.playerId));
      if (!player) {
        return;
      }
      state.playerUsage[player.id] = normalizePlayerUsageValue(select.value, getDefaultPlayerUsage(player));
      state.season = null;
      render();
    });
  });
  selectedRosterEl.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => togglePlayer(Number(button.dataset.playerId)));
  });
}

function renderMarket() {
  const usedBudget = getBudgetUsed();
  const budgetLeft = getBudgetCap() - usedBudget;
  const visiblePlayers = getVisibleMarketPlayers();
  const positions = getMarketPositions(visiblePlayers);
  const filteredPlayers = state.marketPosition === "all"
    ? visiblePlayers
    : visiblePlayers.filter((player) => player.pos === state.marketPosition);
  const groups = [
    { key: "pro", title: "Mercado principal", description: "Impacto imediato para brigar em cima ja.", items: filteredPlayers.filter((player) => player.pool === "pro") },
    { key: "intl", title: "Mercado internacional", description: "Atletas gringos com custo maior e teto competitivo alto.", items: filteredPlayers.filter((player) => player.pool === "intl") },
    { key: "base", title: "Projeto de base", description: "Custam menos e crescem mais durante a temporada.", items: filteredPlayers.filter((player) => player.pool === "base") },
    { key: "scout", title: "Relatorios revelados", description: "Atletas encontrados pelos scouts e ainda fora do radar geral.", items: filteredPlayers.filter((player) => player.pool === "scout") }
  ];

  marketEl.innerHTML = `
    <section class="market-group market-filter-panel">
      <div class="market-group-header">
        <div>
          <h3>Filtro de mercado</h3>
          <p>Refine a lista por posicao para encontrar encaixes mais rapido.</p>
        </div>
        <span class="hint">${filteredPlayers.length} de ${visiblePlayers.length} atletas visiveis</span>
      </div>
      <label class="control-card market-position-filter">
        <span>Posicao</span>
        <select id="market-position-filter">
          <option value="all"${state.marketPosition === "all" ? " selected" : ""}>Todas as posicoes</option>
          ${positions.map((position) => `<option value="${position}"${state.marketPosition === position ? " selected" : ""}>${position}</option>`).join("")}
        </select>
      </label>
    </section>
    <section class="market-group">
      <div class="market-group-header">
        <div>
          <h3>Central de scouts</h3>
          <p>Use relatorios para abrir novas opcoes de elenco. O custo entra no orcamento da montagem.</p>
        </div>
        <span class="hint">$${state.scouting.spent}M investidos | ${state.scouting.discoveredIds.length} nomes revelados</span>
      </div>
      <div class="management-actions">
        <button class="choice-button scout-action" data-scout-type="regional" type="button">Scout regional<div class="effect-line">Custa $2M | revela 2 atletas escondidos do mercado local</div></button>
        <button class="choice-button scout-action" data-scout-type="internacional" type="button">Scout internacional<div class="effect-line">Custa $4M | busca 2 nomes com experiencia fora</div></button>
      </div>
      <div class="player-meta">${state.scouting.reports[0] || "Nenhum relatorio emitido ainda."}</div>
    </section>
    ${groups.map((group) => `
    <section class="market-group">
      <div class="market-group-header">
        <div>
          <h3>${group.title}</h3>
          <p>${group.description}</p>
        </div>
        <span class="hint">${group.items.length} atletas disponiveis</span>
      </div>
      <div class="market-grid">
        ${group.items.map((player) => {
          const selected = state.selectedIds.includes(player.id);
          const disabled = !selected && !canAddPlayer(player);
          const progress = state.season?.playerProgress?.[player.id];
          const progressParts = progress
            ? Object.entries(progress)
              .filter(([, value]) => Math.round(value * 10) !== 0)
              .map(([key, value]) => `${key.toUpperCase().slice(0, 3)} ${value > 0 ? "+" : ""}${roundStat(value * 10) / 10}`)
            : [];
          return `
            <article class="player-card ${player.pool === "base" ? "player-prospect" : ""} ${selected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}">
              <div class="player-header">
                <div>
                  <strong>${player.name}</strong>
                  <div class="player-meta">${player.tag}</div>
                </div>
                <span class="pill">${player.pos}</span>
              </div>
              <div class="market-meta">
                <span class="meta-pill">${player.pool === "base" ? "Base" : player.pool === "intl" ? "Internacional" : player.pool === "scout" ? "Scout" : "Profissional"}</span>
                <span class="meta-pill">ALT ${formatHeightCm(player.heightCm)}</span>
                <span class="meta-pill">Desenv. x${player.development.toFixed(2)}</span>
                <span class="meta-pill">${player.origin}</span>
              </div>
              <div class="player-badges">
                <span class="stat-badge">3PT ${player.threePoint}</span>
                <span class="stat-badge">FIS ${player.physical}</span>
                <span class="stat-badge">TAT ${player.tactical}</span>
                <span class="stat-badge">TEC ${player.technique}</span>
                <span class="stat-badge">DEF ${player.defense}</span>
              </div>
              ${renderPlayerProfileDetails(player)}
              <div class="player-meta progress-line">${progressParts.length ? `Evolucao: ${progressParts.join(" | ")}` : "Sem progresso acumulado ainda."}</div>
              <div class="player-footer">
                <span class="salary">$${player.salary}M</span>
                <button class="${selected ? "remove-button" : "add-button"}" data-player-id="${player.id}" type="button" ${disabled ? "disabled" : ""}>${selected ? "Dispensar" : "Contratar"}</button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("")}
  `;

  marketEl.querySelectorAll("button[data-player-id]").forEach((button) => {
    button.addEventListener("click", () => togglePlayer(Number(button.dataset.playerId)));
  });
  marketEl.querySelectorAll(".scout-action").forEach((button) => {
    button.addEventListener("click", () => hireScout(button.dataset.scoutType));
  });
  marketEl.querySelector("#market-position-filter")?.addEventListener("change", (event) => {
    state.marketPosition = event.target.value;
    renderMarket();
  });

  budgetUsedEl.textContent = `$${usedBudget}M`;
  budgetLeftEl.textContent = `$${budgetLeft}M`;
  if (marketBudgetUsedEl && marketBudgetLeftEl) {
    marketBudgetUsedEl.textContent = `$${usedBudget}M`;
    marketBudgetLeftEl.textContent = `$${budgetLeft}M`;
  }
}

function renderTeamStats() {
  const profile = calculateTeamProfile(state.tactics.rotation, state.season ? state.season.activeModifiers : [], state.tactics);
  teamHeightEl.textContent = formatHeightCm(profile.heightCm);
  teamThreePointEl.textContent = profile.threePoint;
  teamPhysicalEl.textContent = profile.physical;
  teamTacticalEl.textContent = profile.tactical;
  teamTechniqueEl.textContent = profile.technique;
  teamDefenseEl.textContent = profile.defense;
}

function renderControls() {
  const canStart = state.selectedIds.length === getRosterSize();
  const seasonStarted = Boolean(state.season);
  const seasonFinished = seasonStarted && state.season.phase === "finished";

  startSeasonButton.disabled = !canStart || seasonStarted;
  playNextButton.disabled = !seasonStarted || seasonFinished || Boolean(state.season?.pendingDecision);

  Object.entries(tacticInputs).forEach(([key, input]) => {
    input.value = state.tactics[key];
  });
  trainingInput.value = state.trainingFocus;
  divisionInput.value = state.division;
  settingsBudgetInput.value = String(state.settings.budgetBoost);
  settingsEaseInput.value = state.settings.ease;
  if (franchiseNameInput) {
    franchiseNameInput.value = state.settings.teamName;
  }
  if (staffPhysioInput) {
    staffPhysioInput.value = String(normalizeStaffLevel(state.settings.staff.physio));
  }
  if (staffConditioningInput) {
    staffConditioningInput.value = String(normalizeStaffLevel(state.settings.staff.conditioning));
  }
  if (staffAssistantInput) {
    staffAssistantInput.value = String(normalizeStaffLevel(state.settings.staff.assistant));
  }
  if (staffAnalystInput) {
    staffAnalystInput.value = String(normalizeStaffLevel(state.settings.staff.analyst));
  }
  if (staffPsychologistInput) {
    staffPsychologistInput.value = String(normalizeStaffLevel(state.settings.staff.psychologist));
  }
  if (staffDoctorInput) {
    staffDoctorInput.value = String(normalizeStaffLevel(state.settings.staff.doctor));
  }
  if (staffBudgetUsedEl) {
    staffBudgetUsedEl.textContent = `$${getStaffBudgetUsed()}M / $${STAFF_BUDGET_CAP}M`;
  }
  if (staffBudgetLeftEl) {
    staffBudgetLeftEl.textContent = `$${STAFF_BUDGET_CAP - getStaffBudgetUsed()}M`;
  }
  if (staffBonusLabelEl) {
    staffBonusLabelEl.textContent = getStaffActiveLabel();
  }
  if (staffBonusSummaryEl) {
    staffBonusSummaryEl.textContent = getStaffSummaryText();
  }
  renderSaveList();
}

function renderQuickHub() {
  if (!state.season) {
    quickHubEl.className = "matchday-hub empty";
    quickHubEl.textContent = "Feche o elenco e inicie a temporada para liberar a central rapida de jogo.";
    return;
  }

  const upcoming = getUpcomingGameInfo();
  const standings = getSortedLeagueTeams();
  const rank = standings.findIndex((team) => team.id === USER_TEAM_ID) + 1;
  const lastGame = state.season.lastGame;
  const management = getManagementState();
  const managementActions = getManagementActions();
  const actionAvailable = isManagementActionAvailable();

  quickHubEl.className = "matchday-hub";
  quickHubEl.innerHTML = `
    <div class="quick-hub-grid">
      <article class="next-game-card">
        <span class="season-key">Proximo compromisso</span>
        <strong>${upcoming ? `${upcoming.phase === "regular" ? `Rodada ${upcoming.roundInfo.roundNumber}` : `${upcoming.round.name} jogo ${upcoming.gameInSeries}`}` : "Temporada encerrada"}</strong>
        <p>${upcoming ? `${upcoming.home ? "Casa" : "Fora"} contra ${upcoming.opponent.name}` : "Nao ha mais partidas no calendario."}</p>
        <div class="player-meta">${upcoming ? `${upcoming.opponent.style} | ${describeTactics(state.tactics)}` : `Status final: ${state.season.playoffs.champion ? "campeao" : state.season.playoffs.eliminated ? "eliminado no playoff" : "temporada concluida"}`}</div>
      </article>
      <article class="summary-box">
        <span class="season-key">Campanha</span>
        <strong>${state.season.wins}-${state.season.losses}</strong>
        <div class="player-meta">${rank ? `${rank}o lugar` : "sem classificacao"} | moral ${state.season.morale}</div>
      </article>
      <article class="summary-box">
        <span class="season-key">Configuracao</span>
        <strong>+$${state.settings.budgetBoost}M</strong>
        <div class="player-meta">${describeSimulationDifficulty()}</div>
      </article>
      <article class="summary-box">
        <span class="season-key">Ultimo resultado</span>
        <strong>${lastGame ? `${lastGame.teamScore}-${lastGame.opponentScore}` : "--"}</strong>
        <div class="player-meta">${lastGame ? `${lastGame.opponent} | ${lastGame.record}` : "Nenhuma partida jogada ainda"}</div>
      </article>
    </div>
    <article class="management-card">
      <div class="management-header">
        <div>
          <span class="season-key">Central de gestao</span>
          <strong>Decisao de bastidor antes do jogo</strong>
        </div>
        <div class="player-meta">${actionAvailable ? "1 acao disponivel nesta rodada" : "Acao desta rodada ja utilizada"}</div>
      </div>
      <div class="management-metrics">
        <div><span>Entrosamento</span><strong>${management.chemistry}</strong></div>
        <div><span>Confianca</span><strong>${management.confidence}</strong></div>
        <div><span>Foco</span><strong>${management.focus}</strong></div>
        <div><span>Intensidade</span><strong>${management.intensity}</strong></div>
      </div>
      <div class="management-actions">
        ${managementActions.map((action) => `
          <button class="choice-button management-action" data-management-action="${action.key}" type="button" ${actionAvailable ? "" : "disabled"}>
            ${action.label}
            <div class="effect-line">${action.weightLabel}</div>
            <div class="effect-line">${action.effect}</div>
          </button>
        `).join("")}
      </div>
    </article>
    ${renderDecisionResultCard(true)}
    ${state.season.pendingDecision ? `
      <article class="decision-card quick-decision">
        <span class="season-key">Decisao antes da simulacao</span>
        <strong>${state.season.pendingDecision.title}</strong>
        <p>${state.season.pendingDecision.text}</p>
        ${state.season.pendingDecision.choices.map((choice, index) => `
          <button class="choice-button" data-choice-index="${index}" type="button">
            ${choice.label}
            <div class="effect-line">${choice.effect}</div>
            <div class="effect-line">${getDecisionProbabilityLabel(choice)}</div>
          </button>
        `).join("")}
      </article>
    ` : ""}
    ${upcoming && !state.season.pendingDecision ? `
      <article class="live-match-card">
        <div class="management-header">
          <div>
            <span class="season-key">Partida ao vivo</span>
            <strong>Simulacao em tempo real</strong>
          </div>
          <button class="primary-button" data-live-open type="button">Jogar ao vivo</button>
        </div>
        <div class="player-meta">Abra a central de jogo para controlar velocidade, acompanhar a narracao e salvar o resultado ao final.</div>
      </article>
    ` : ""}
  `;

  quickHubEl.querySelectorAll(".choice-button").forEach((button) => {
    if (button.dataset.choiceIndex) {
      button.addEventListener("click", () => resolveDecision(Number(button.dataset.choiceIndex)));
      return;
    }
    if (button.dataset.managementAction) {
      button.addEventListener("click", () => applyManagementAction(button.dataset.managementAction));
    }
  });
  quickHubEl.querySelector("[data-live-open]")?.addEventListener("click", openLiveMatchTab);
}

function renderLiveMatchPage() {
  if (!liveMatchPageRootEl) {
    return;
  }

  const hasLiveModules = window.TemporadaTotal?.createLiveSimulation && window.TemporadaTotal?.createLiveMatchUI && window.TemporadaTotal?.BasketballMatchAdapter;
  if (!hasLiveModules) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Modulo ao vivo indisponivel.</strong>
      <p>Fallback seguro: confira se shared/live-simulation.js, shared/live-match-ui.js e match-adapter.js foram carregados antes do script principal.</p>
    `;
    return;
  }

  if (!state.season) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Nenhuma temporada ativa.</strong>
      <p>Monte o elenco, inicie a temporada e volte aqui para abrir a transmissao ao vivo.</p>
    `;
    return;
  }

  const upcoming = getUpcomingGameInfo();
  if (state.season.pendingDecision) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Decisao pendente antes da bola subir.</strong>
      <p>Resolva a decisao no hub da temporada para liberar a partida ao vivo.</p>
      <button class="secondary-button" data-live-back-hub type="button">Ir para temporada</button>
    `;
    liveMatchPageRootEl.querySelector("[data-live-back-hub]")?.addEventListener("click", () => switchTab("front-office"));
    return;
  }

  if (!upcoming && !liveMatchController) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Sem proximo jogo no calendario.</strong>
      <p>A temporada nao tem uma partida pendente para transmitir agora.</p>
    `;
    return;
  }

  if (!liveMatchController) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Transmissao pronta para ser preparada.</strong>
      <p>${upcoming ? `${upcoming.home ? "Casa" : "Fora"} contra ${upcoming.opponent.name}` : "Partida pendente encontrada."}</p>
      <button class="primary-button" data-live-prepare type="button">Preparar partida</button>
    `;
    liveMatchPageRootEl.querySelector("[data-live-prepare]")?.addEventListener("click", () => prepareLiveBasketballMatch(liveMatchPageRootEl));
    return;
  }

  prepareLiveBasketballMatch(liveMatchPageRootEl);
}

// Renders compact cards for the team leaders in a given stat view.
function renderStatLeaderCards(rows, emptyText = "Sem dados") {
  const leaders = getTeamStatLeaders(rows);
  return `
    <div class="stats-leaders-grid">
      ${leaders.map((leader) => {
        const player = leader.player;
        return `
          <article class="stat-leader-card">
            <span>${leader.label}</span>
            <strong>${player ? formatStatValue(player[leader.key]) : "--"} ${leader.suffix}</strong>
            <div class="player-meta">${player ? player.playerName : emptyText}</div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

// Renders the complete player stats table; mobile uses horizontal overflow.
function renderPlayerStatsTable(rows, { mode = "totals", highlightPlayerId = null } = {}) {
  const schema = getBasketballStatsSchema();
  if (!rows.length) {
    return `<div class="player-stats-empty">Ainda nao ha estatisticas para esta visao.</div>`;
  }

  const sortedRows = rows
    .slice()
    .sort((a, b) => (Number(b.efficiency) || 0) - (Number(a.efficiency) || 0) || (Number(b.points) || 0) - (Number(a.points) || 0));

  return `
    <div class="table-wrap player-stats-scroll">
      <table class="standings-table player-stats-table season-player-stats-table">
        <thead>
          <tr>
            <th>Jogador</th>
            ${mode === "averages" ? "<th>J</th>" : ""}
            ${schema.map((stat) => `<th>${stat.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${sortedRows.map((stats) => {
            const isHighlight = highlightPlayerId && String(stats.playerId) === String(highlightPlayerId);
            return `
              <tr class="${isHighlight ? "best-player-row" : ""}">
                <td>
                  <div class="player-stat-name">
                    <strong>${stats.playerName}</strong>
                    <span class="meta-pill">${stats.position || getPlayerPositionLabel(stats.playerId) || "ROT"}</span>
                    ${isHighlight ? '<span class="status-pill stat-mvp">Destaque</span>' : ""}
                  </div>
                </td>
                ${mode === "averages" ? `<td>${stats.games || 0}</td>` : ""}
                ${schema.map((stat) => `<td>${formatStatValue(stats[stat.key])}</td>`).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// Combines last-match box score and season averages in one statistics area.
function renderPlayerStatsDashboard() {
  const lastGameStats = (state.season?.lastGame?.playerStats || []).map(normalizePlayerStatRow);
  const seasonTotals = Object.values(state.season?.playerStats || {}).map(normalizePlayerStatRow);
  const seasonAverages = seasonTotals.map(calculatePlayerAverages);
  const bestLastPlayerId = state.season?.lastGame?.bestPlayerId || getPlayerStatsRankings(lastGameStats).efficiency[0]?.playerId || null;

  return `
    <details class="fold-panel player-stats-section" open>
      <summary>
        <span>Estatisticas</span>
        <strong>Ultima partida e temporada</strong>
      </summary>
      <div class="player-stats-dashboard">
        <section class="player-stats-view">
          <div class="stats-view-header">
            <div>
              <span class="season-key">Ultima partida</span>
              <h3>${state.season?.lastGame ? `${state.season.lastGame.teamScore}-${state.season.lastGame.opponentScore} vs ${state.season.lastGame.opponent}` : "Sem partida ao vivo salva"}</h3>
            </div>
            <span class="status-pill">${lastGameStats.length ? "Box score" : "Aguardando jogo"}</span>
          </div>
          ${renderStatLeaderCards(lastGameStats)}
          ${renderPlayerStatsTable(lastGameStats, { highlightPlayerId: bestLastPlayerId })}
        </section>

        <section class="player-stats-view">
          <div class="stats-view-header">
            <div>
              <span class="season-key">Temporada</span>
              <h3>Medias por jogo</h3>
            </div>
            <span class="status-pill">${seasonAverages.length ? `${seasonAverages.length} atletas` : "Sem acumulado"}</span>
          </div>
          ${renderStatLeaderCards(seasonAverages)}
          ${renderPlayerStatsTable(seasonAverages, { mode: "averages" })}
        </section>
      </div>
    </details>
  `;
}

function renderResults() {
  if (!state.season) {
    resultsEl.className = "season-results empty";
    resultsEl.textContent = "Feche o elenco e inicie a temporada para liberar a simulacao rodada a rodada.";
    return;
  }

  const standings = getSortedLeagueTeams();
  const rank = standings.findIndex((team) => team.id === USER_TEAM_ID) + 1;
  const seasonStatus = getRegularSeasonStatus(rank || 16);
  const gamesPlayed = state.season.games.length || 1;
  const averages = {
    pointsFor: (state.season.games.reduce((sum, game) => sum + game.teamScore, 0) / gamesPlayed).toFixed(1),
    pointsAgainst: (state.season.games.reduce((sum, game) => sum + game.opponentScore, 0) / gamesPlayed).toFixed(1),
    rebounds: (state.season.games.reduce((sum, game) => sum + game.rebounds, 0) / gamesPlayed).toFixed(1),
    possessions: (state.season.games.reduce((sum, game) => sum + game.possessions, 0) / gamesPlayed).toFixed(1)
  };
  const activeEffects = state.season.activeModifiers;
  const injuries = getAdjustedPlayers().filter((player) => player.healthStatus !== "healthy");
  const profile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const playoff = state.season.playoffs;
  const upcoming = getUpcomingGameInfo();
  const management = getManagementState();
  const managementActions = getManagementActions();
  const actionAvailable = isManagementActionAvailable();

  resultsEl.className = "season-results";
  resultsEl.innerHTML = `
    <div class="season-hub">
      <div class="summary-grid">
        <div>
          <span>Campanha</span>
          <strong>${state.season.wins}-${state.season.losses}</strong>
          <div class="player-meta">${rank}o lugar | ${seasonStatus}</div>
        </div>
        <div>
          <span>Pontos por jogo</span>
          <strong>${averages.pointsFor}</strong>
          <div class="player-meta">cede ${averages.pointsAgainst}</div>
        </div>
        <div>
          <span>Rebotes</span>
          <strong>${averages.rebounds}</strong>
          <div class="player-meta">possessões ${averages.possessions}</div>
        </div>
        <div>
          <span>Moral</span>
          <strong>${state.season.morale}</strong>
          <div class="player-meta">${upcoming ? `proximo: ${upcoming.opponent.name}` : "temporada concluida"}</div>
        </div>
        <div>
          <span>Sinergia</span>
          <strong>${profile.synergy.label}</strong>
          <div class="player-meta">combos do elenco afetam quimica, foco e execucao</div>
        </div>
      </div>
      ${renderPlayerStatsDashboard()}

      <details class="fold-panel" open>
        <summary>
          <span>Resumo da rodada</span>
          <strong>${upcoming ? `${upcoming.home ? "Casa" : "Fora"} contra ${upcoming.opponent.name}` : "Sem partidas pendentes"}</strong>
        </summary>
        <div class="details-stack">
          <article class="next-game-card">
            <span class="season-key">Leitura rapida</span>
            <strong>${playoff.champion ? "Titulo conquistado" : playoff.eliminated ? "Playoff encerrado" : seasonStatus}</strong>
            <p>${upcoming ? `${upcoming.opponent.style} | taticas: ${describeTactics(state.tactics)} | treino: ${getTrainingFocusLabel()}` : "Agora o foco e revisar o caminho da temporada."}</p>
          </article>
          ${renderDecisionResultCard()}
          ${state.season.pendingDecision ? `
            <article class="decision-card">
              <span class="season-key">Decisao pendente</span>
              <strong>${state.season.pendingDecision.title}</strong>
              <p>${state.season.pendingDecision.text}</p>
              ${state.season.pendingDecision.choices.map((choice, index) => `
                <button class="choice-button" data-choice-index="${index}" type="button">
                  ${choice.label}
                  <div class="effect-line">${choice.effect}</div>
                  <div class="effect-line">${getDecisionProbabilityLabel(choice)}</div>
                </button>
              `).join("")}
            </article>
          ` : ""}
        </div>
      </details>

      <details class="fold-panel" open>
        <summary>
          <span>Indicadores do time</span>
          <strong>Altura real e impacto nos fundamentos</strong>
        </summary>
        <div class="summary-grid">
          <div>
            <span>Altura media</span>
            <strong>${formatHeightCm(profile.heightCm)}</strong>
            <div class="player-meta">normalizada internamente por categoria</div>
          </div>
          <div>
            <span>Spacing</span>
            <strong>${profile.spacing}</strong>
            <div class="player-meta">3PT ${profile.threePoint}</div>
          </div>
          <div>
            <span>Finishing</span>
            <strong>${profile.finishing}</strong>
            <div class="player-meta">rebote ${profile.rebounding}</div>
          </div>
          <div>
            <span>Desgaste</span>
            <strong>${profile.fatigueLoad.toFixed(1)}</strong>
            <div class="player-meta">clutch ${profile.clutch}</div>
          </div>
        </div>
      </details>

      <details class="fold-panel" open>
        <summary>
          <span>Central de gestao</span>
          <strong>${actionAvailable ? "1 acao disponivel" : "Acao desta rodada usada"}</strong>
        </summary>
        <div class="management-panel">
          <div class="management-metrics">
            <div><span>Entrosamento</span><strong>${management.chemistry}</strong><div class="player-meta">ajuda a leitura coletiva e a execucao</div></div>
            <div><span>Confianca</span><strong>${management.confidence}</strong><div class="player-meta">pesa no arremesso e no clutch</div></div>
            <div><span>Foco</span><strong>${management.focus}</strong><div class="player-meta">segura disciplina tatica e defesa</div></div>
            <div><span>Intensidade</span><strong>${management.intensity}</strong><div class="player-meta">sobe pressao e tambem o desgaste</div></div>
          </div>
          <div class="management-actions">
            ${managementActions.map((action) => `
              <button class="choice-button management-action" data-management-action="${action.key}" type="button" ${actionAvailable ? "" : "disabled"}>
                ${action.label}
                <div class="effect-line">${action.description}</div>
                <div class="effect-line">${action.weightLabel} | ${action.effect}</div>
              </button>
            `).join("")}
          </div>
        </div>
      </details>

      <details class="fold-panel">
        <summary>
          <span>Efeitos e disponibilidade</span>
          <strong>${activeEffects.length} efeitos | ${injuries.length} atletas limitados</strong>
        </summary>
        <div class="effects-grid">
          <section>
            <div class="effects-list">
              ${activeEffects.length ? activeEffects.map((effect) => `
                <article class="effect-card">
                  <div class="effect-header">
                    <span>${effect.key.toUpperCase()}</span>
                    <strong class="effect-value ${effect.amount >= 0 ? "positive" : "negative"}">${effect.amount >= 0 ? "+" : ""}${effect.amount}</strong>
                  </div>
                  <div class="effect-line">mais ${effect.remainingGames} jogo(s)</div>
                </article>
              `).join("") : '<article class="effect-card"><span>Sem efeitos ativos</span><div class="effect-line">As decisoes e os treinos vao alimentar esta area.</div></article>'}
            </div>
          </section>
          <section>
            <div class="injury-list">
              ${injuries.length ? injuries.map((player) => `
                <article class="injury-card">
                  <strong>${player.name}</strong>
                  <div class="status-row"><span class="status-pill ${player.healthStatus}">${player.healthStatus === "limited" ? "Limitado" : "Fora"}</span></div>
                  <div class="injury-line">${player.healthNote}</div>
                </article>
              `).join("") : '<article class="injury-card"><strong>Elenco liberado</strong><div class="injury-line">Nenhuma atleta ou jogador fora no momento.</div></article>'}
            </div>
          </section>
        </div>
      </details>

      <details class="fold-panel">
        <summary>
          <span>Historico de bastidores</span>
          <strong>Moral e treinos recentes</strong>
        </summary>
        <div class="bottom-grid">
          <section class="recent-games">
            ${(state.season.moraleLog || []).map((log) => `
              <article class="recent-card">
                <strong>${log.amount > 0 ? "+" : ""}${log.amount} moral</strong>
                <div class="player-meta">${log.label}</div>
              </article>
            `).join("") || '<article class="recent-card"><strong>Sem variacoes ainda</strong><div class="player-meta">Os bastidores vao aparecer aqui.</div></article>'}
          </section>
          <section class="recent-games">
            ${(state.season.managementLog || []).map((log) => `
              <article class="recent-card">
                <strong>${log.label}</strong>
                <div class="player-meta">Rodada ${log.round} | ${log.weightLabel}</div>
                <div class="player-meta">${log.description}</div>
              </article>
            `).join("")}
            ${(state.season.psychologyLog || []).map((log) => `
              <article class="recent-card">
                <strong>${log.label}</strong>
                <div class="player-meta">Rodada ${log.round} | moral ${log.amount > 0 ? "+" : ""}${log.amount}</div>
                <div class="player-meta">${log.description}</div>
              </article>
            `).join("")}
            <article class="training-card">
              <strong>Plano atual: ${getTrainingFocusLabel()}</strong>
              <p>${trainingPlans[state.trainingFocus].description}</p>
            </article>
            ${state.season.trainingLog.map((log) => `
              <article class="training-card">
                <strong>Rodada ${log.round}</strong>
                <div class="player-meta">${log.label}</div>
                <p>${log.description}</p>
              </article>
            `).join("") || '<article class="training-card"><strong>Sem treino acumulado</strong><p>Os treinos vao entrar apos as partidas.</p></article>'}
          </section>
        </div>
      </details>

      <details class="fold-panel" open>
        <summary>
          <span>Ultimos resultados</span>
          <strong>${state.season.games.length} partidas registradas</strong>
        </summary>
        <div class="calendar-list">
          ${state.season.games.slice(-6).reverse().map((game) => `
            <article class="game-card ${game.phase === "playoffs" ? "playoff" : ""} ${game.result === "V" ? "win" : "loss"}">
              <div class="game-topline">
                <div>
                  <div class="game-type">${game.label} | ${game.venue}</div>
                  <strong>${game.opponent}</strong>
                  <div class="game-meta">2PT ${game.twoPct} | 3PT ${game.threePct}</div>
                </div>
                <span class="result-pill ${game.result === "V" ? "win" : "loss"}">${game.result}</span>
              </div>
              <div class="game-score">
                <strong>${game.teamScore} x ${game.opponentScore}</strong>
                <div class="game-meta">rebotes ${game.rebounds} | posses ${game.possessions}</div>
                ${game.scorersSummary ? `<div class="game-meta">${game.scorersSummary}</div>` : ""}
              </div>
            </article>
          `).join("") || '<article class="recent-card"><strong>Aguardando estreia</strong><div class="player-meta">As partidas jogadas vao aparecer aqui.</div></article>'}
        </div>
      </details>

      ${playoff.qualified ? `
        <details class="fold-panel" ${state.season.phase === "playoffs" ? "open" : ""}>
          <summary>
            <span>Playoff</span>
            <strong>Seed ${playoff.seed} | ${playoff.champion ? "campeao" : playoff.eliminated ? "eliminado" : "ainda vivo"}</strong>
          </summary>
          <div class="playoff-list">
            ${playoff.rounds.map((round, index) => `
              <article class="playoff-card">
                <strong>${round.name}</strong>
                <div class="player-meta">Seed ${playoff.seed} contra seed ${round.opponentSeed} - ${round.opponent.name}</div>
                <p>Serie ${round.teamWins}-${round.opponentWins}${index === playoff.currentRoundIndex && state.season.phase === "playoffs" ? " | em andamento" : ""}</p>
              </article>
            `).join("")}
          </div>
        </details>
      ` : ""}
    </div>
  `;

  resultsEl.querySelectorAll(".choice-button").forEach((button) => {
    if (button.dataset.choiceIndex) {
      button.addEventListener("click", () => resolveDecision(Number(button.dataset.choiceIndex)));
      return;
    }
    if (button.dataset.managementAction) {
      button.addEventListener("click", () => applyManagementAction(button.dataset.managementAction));
    }
  });
}

function renderInjuryCenter() {
  if (!injuryCenterEl) {
    return;
  }
  if (!state.season) {
    injuryCenterEl.className = "injury-center empty";
    injuryCenterEl.textContent = "Inicie a temporada para liberar o departamento medico.";
    return;
  }

  const players = getAdjustedPlayers();
  const unavailable = players.filter((player) => player.healthStatus !== "healthy");
  const profile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const management = getManagementState();
  const riskLabel = profile.fatigueLoad >= 2.4 || management.intensity >= 78 ? "Alto"
    : profile.fatigueLoad >= 1.7 || management.intensity >= 72 ? "Moderado"
    : "Controlado";

  injuryCenterEl.className = "injury-center";
  injuryCenterEl.innerHTML = `
    <div class="summary-grid">
      <div>
        <span>Atletas fora/limitados</span>
        <strong>${unavailable.length}</strong>
        <div class="player-meta">${players.length - unavailable.length} disponiveis</div>
      </div>
      <div>
        <span>Risco fisico</span>
        <strong>${riskLabel}</strong>
        <div class="player-meta">desgaste ${profile.fatigueLoad.toFixed(1)} | intensidade ${management.intensity}</div>
      </div>
      <div>
        <span>Rodada atual</span>
        <strong>${state.season.roundNumber}</strong>
        <div class="player-meta">retornos usam a rodada prevista</div>
      </div>
    </div>
    <div class="injury-list injury-list-expanded">
      ${unavailable.length ? unavailable.map((player) => {
        const issue = state.season.injuries[player.id];
        return `
          <article class="injury-card">
            <div class="injury-card-header">
              <div>
                <strong>${player.name}</strong>
                <div class="player-meta">${player.pos} | fisico ${player.physical}</div>
              </div>
              <span class="status-pill ${player.healthStatus}">${player.healthStatus === "limited" ? "Limitado" : "Fora"}</span>
            </div>
            <div class="injury-line">${player.healthNote}</div>
            <div class="effect-line">Previsao: rodada ${issue?.returnRound || state.season.roundNumber}</div>
          </article>
        `;
      }).join("") : '<article class="injury-card"><strong>Elenco liberado</strong><div class="injury-line">Nenhum atleta no departamento medico agora.</div></article>'}
    </div>
  `;
}

function getModifierHelpText() {
  return "Chaves: morale, shooting, physical, tactical, technique, defense. Ex: [{\"key\":\"defense\",\"amount\":3,\"duration\":1}]";
}

function createBlankCustomDecision() {
  return {
    title: "Nova decisao customizada",
    text: "Escreva aqui o contexto que aparece para o jogador.",
    choices: [
      { label: "Escolha arriscada", effect: "Defina o efeito", modifiers: [{ key: "morale", amount: 2, duration: 1 }] },
      { label: "Escolha segura", effect: "Defina o efeito", modifiers: [] }
    ]
  };
}

function renderConfigEditor() {
  if (!configEditorEl) {
    return;
  }
  const teams = getOpponents();
  const decisions = state.customConfig.decisions || [];
  const configAsText = `window.SEASON_CUSTOM_CONFIG = ${JSON.stringify(state.customConfig, null, 2)};`;

  configEditorEl.className = "config-editor";
  configEditorEl.innerHTML = `
    <div class="config-toolbar">
      <button class="primary-button" type="button" data-config-action="save">Salvar e aplicar</button>
      <button class="secondary-button" type="button" data-config-action="add-decision">Adicionar decisao</button>
      <button class="ghost-button" type="button" data-config-action="reset">Limpar customizacao</button>
    </div>
    <p class="settings-note">Salvar reinicia a temporada atual para evitar tabela/calendario com nomes antigos. Seus atletas escolhidos continuam.</p>
    <details class="fold-panel" open>
      <summary><span>Times da categoria atual</span><strong>${getDivisionConfig().label}</strong></summary>
      <div class="config-team-grid">
        ${teams.map((team) => `
          <article class="config-card" data-config-team="${team.id}">
            <div class="config-team-preview">${renderTeamBadge(team)}<strong>${escapeHtml(team.name)}</strong></div>
            <label>Nome do time<input data-config-field="name" value="${escapeHtml(team.name)}"></label>
            <label>Estilo/frase<input data-config-field="style" value="${escapeHtml(team.style || "")}"></label>
            <label>Escudo URL/caminho<input data-config-field="logo" value="${escapeHtml(team.logo || "")}" placeholder="assets/escudos/${team.id}.png"></label>
          </article>
        `).join("")}
      </div>
    </details>
    <details class="fold-panel" open>
      <summary><span>Decisoes personalizadas</span><strong>${decisions.length} criada(s)</strong></summary>
      <p class="settings-note">${getModifierHelpText()}</p>
      <div class="config-decision-list">
        ${decisions.map((decision, decisionIndex) => `
          <article class="config-card config-decision-card" data-config-decision="${decisionIndex}">
            <div class="config-card-header">
              <strong>Decisao ${decisionIndex + 1}</strong>
              <button class="ghost-button danger-ghost" type="button" data-remove-decision="${decisionIndex}">Remover</button>
            </div>
            <label>Titulo<input data-decision-field="title" value="${escapeHtml(decision.title)}"></label>
            <label>Texto<textarea data-decision-field="text">${escapeHtml(decision.text)}</textarea></label>
            ${(decision.choices || []).map((choice, choiceIndex) => `
              <div class="choice-editor" data-config-choice="${choiceIndex}">
                <strong>Opcao ${choiceIndex + 1}</strong>
                <label>Label<input data-choice-field="label" value="${escapeHtml(choice.label)}"></label>
                <label>Descricao do efeito<input data-choice-field="effect" value="${escapeHtml(choice.effect)}"></label>
                <label>Consequencias JSON<textarea data-choice-field="modifiers">${escapeHtml(JSON.stringify(choice.modifiers || []))}</textarea></label>
              </div>
            `).join("")}
          </article>
        `).join("") || '<article class="config-card"><strong>Nenhuma decisao customizada ainda</strong><p>Use "Adicionar decisao" para criar a primeira.</p></article>'}
      </div>
    </details>
    <details class="fold-panel">
      <summary><span>Arquivo custom-config.js</span><strong>copiar se quiser editar manualmente</strong></summary>
      <textarea class="config-export" readonly>${escapeHtml(configAsText)}</textarea>
    </details>
  `;

  configEditorEl.querySelector("[data-config-action='save']")?.addEventListener("click", saveConfigFromEditor);
  configEditorEl.querySelector("[data-config-action='add-decision']")?.addEventListener("click", () => {
    state.customConfig = collectConfigFromEditor();
    state.customConfig.decisions.push(createBlankCustomDecision());
    renderConfigEditor();
  });
  configEditorEl.querySelector("[data-config-action='reset']")?.addEventListener("click", () => {
    localStorage.removeItem(CUSTOM_CONFIG_STORAGE_KEY);
    state.customConfig = applyCustomConfig(window.SEASON_CUSTOM_CONFIG || createDefaultCustomConfig());
    state.season = null;
    render();
  });
  configEditorEl.querySelectorAll("[data-remove-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      state.customConfig = collectConfigFromEditor();
      state.customConfig.decisions.splice(Number(button.dataset.removeDecision), 1);
      renderConfigEditor();
    });
  });
}

function collectConfigFromEditor() {
  const nextConfig = cloneConfig(state.customConfig);
  nextConfig.teams[state.division] = {};
  configEditorEl.querySelectorAll("[data-config-team]").forEach((card) => {
    const teamId = card.dataset.configTeam;
    nextConfig.teams[state.division][teamId] = {
      name: card.querySelector("[data-config-field='name']").value.trim(),
      style: card.querySelector("[data-config-field='style']").value.trim(),
      logo: card.querySelector("[data-config-field='logo']").value.trim()
    };
  });
  nextConfig.decisions = [...configEditorEl.querySelectorAll("[data-config-decision]")].map((card) => ({
    title: card.querySelector("[data-decision-field='title']").value.trim(),
    text: card.querySelector("[data-decision-field='text']").value.trim(),
    choices: [...card.querySelectorAll("[data-config-choice]")].map((choiceCard) => {
      let modifiers = [];
      try {
        modifiers = JSON.parse(choiceCard.querySelector("[data-choice-field='modifiers']").value || "[]");
      } catch (error) {
        modifiers = [];
      }
      return {
        label: choiceCard.querySelector("[data-choice-field='label']").value.trim(),
        effect: choiceCard.querySelector("[data-choice-field='effect']").value.trim(),
        modifiers
      };
    })
  }));
  return nextConfig;
}

function saveConfigFromEditor() {
  const nextConfig = collectConfigFromEditor();
  state.customConfig = applyCustomConfig(nextConfig);
  saveCustomConfig(state.customConfig);
  state.season = null;
  setSaveStatus("Configuracao aplicada. Temporada reiniciada para usar times e decisoes atualizados.");
  render();
}

function renderLeagueTable() {
  if (!state.season?.leagueTable) {
    leagueTableEl.className = "league-table empty";
    leagueTableEl.textContent = "Inicie a temporada para gerar a classificacao da liga.";
    return;
  }

  const rows = getSortedLeagueTeams();
  leagueTableEl.className = "league-table";
  leagueTableEl.innerHTML = `
    <div class="season-note">Rodada simulada: ${state.season.leagueTable.round} de ${state.season.schedule.length} | Top 8 no playoff | Z2 rebaixado</div>
    <div class="table-wrap">
      <table class="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>V</th>
            <th>D</th>
            <th>%</th>
            <th>Saldo</th>
            <th>Pontos pro</th>
            <th>Forma</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((team, index) => {
            const games = team.wins + team.losses;
            const pct = games ? (team.wins / games).toFixed(3).replace("0.", ".") : ".000";
            const differential = team.pointsFor - team.pointsAgainst;
            const zoneClass = index < 8 ? "playoff-zone" : index >= rows.length - 2 ? "relegation-zone" : "";
            return `
              <tr class="${team.id === USER_TEAM_ID ? "user-team" : ""} ${zoneClass}">
                <td>${index + 1}</td>
                <td><div class="team-cell">${renderTeamBadge(team)}<div><strong>${team.name}</strong>${team.id === USER_TEAM_ID ? '<div class="player-meta">sua franquia</div>' : ""}</div></div></td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${pct}</td>
                <td>${differential >= 0 ? "+" : ""}${differential}</td>
                <td>${team.pointsFor}</td>
                <td><span class="standings-form">${team.form.map((result) => `<span class="form-dot ${result === "V" ? "win" : "loss"}">${result}</span>`).join("") || "-"}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    <div class="table-legend">
      <span class="legend-pill playoff">G8 playoff</span>
      <span class="legend-pill relegation">Z2 rebaixamento</span>
      ${state.season.relegatedTeams.length ? `<span class="player-meta">Rebaixados no momento: ${state.season.relegatedTeams.join(" e ")}</span>` : ""}
    </div>
  `;
}

function renderWeeklyHub() {
  const root = document.querySelector("#weekly-hub");
  if (!root || !window.TemporadaTotal?.renderWeeklyHub) return;
  const usedBudget = getBudgetUsed();
  const budgetLeft = getBudgetCap() - usedBudget;
  const upcoming = getUpcomingGameInfo();
  const rank = getUserRank();
  const seasonStarted = Boolean(state.season);
  const pendingDecision = state.season?.pendingDecision;
  const alert = pendingDecision
    ? "Existe uma decisao pendente antes da proxima partida."
    : seasonStarted && state.season?.morale <= 66
      ? "A moral do elenco esta pedindo atencao."
      : "Sem alerta no momento";

  window.TemporadaTotal.renderWeeklyHub(root, {
    seasonStarted,
    round: state.season?.roundNumber || upcoming?.roundInfo?.roundNumber || 1,
    nextGame: upcoming
      ? `${upcoming.phase === "regular" ? `Rodada ${upcoming.roundInfo.roundNumber}` : `${upcoming.round.name} jogo ${upcoming.gameInSeries}`} | ${upcoming.opponent.name}`
      : "Proxima partida definida apos iniciar temporada",
    standing: seasonStarted
      ? `${rank ? `${rank}o lugar` : "sem classificacao"} | ${state.season.wins}V | ${state.season.losses}D`
      : "Tabela disponivel apos iniciar temporada",
    morale: seasonStarted ? String(state.season.morale) : "Moral ainda nao calculada",
    budget: `$${budgetLeft}M disponiveis`,
    alert,
    decision: pendingDecision ? pendingDecision.title : "Sem decisao pendente"
  });
}

function hireScout(type) {
  const packages = {
    regional: { cost: 2, scoutType: "regional", amount: 2, label: "Scout regional" },
    internacional: { cost: 4, scoutType: "internacional", amount: 2, label: "Scout internacional" }
  };
  const pack = packages[type];
  if (!pack || state.season) {
    return;
  }
  if (getBudgetUsed() + pack.cost > getBudgetCap()) {
    setSaveStatus("Nao ha orcamento livre para abrir este relatorio de scout.");
    return;
  }

  const freshNames = getMarketPlayers().filter((player) =>
    player.pool === "scout" &&
    player.scoutType === pack.scoutType &&
    !state.scouting.discoveredIds.includes(player.id)
  ).slice(0, pack.amount);

  if (!freshNames.length) {
    setSaveStatus("Esse departamento de scout ja esgotou os nomes disponiveis.");
    return;
  }

  state.scouting.spent += pack.cost;
  state.scouting.discoveredIds = [...state.scouting.discoveredIds, ...freshNames.map((player) => player.id)];
  state.scouting.reports.unshift(`${pack.label}: ${freshNames.map((player) => `${player.name} (${player.pos}, ${player.origin})`).join(", ")}`);
  state.scouting.reports = state.scouting.reports.slice(0, 5);
  render();
}

function canAddPlayer(player) {
  const discovered = player.pool !== "scout" || state.scouting.discoveredIds.includes(player.id);
  return discovered && !state.selectedIds.includes(player.id) && state.selectedIds.length < getRosterSize() && getBudgetUsed() + player.salary <= getBudgetCap();
}

function togglePlayer(playerId) {
  if (state.selectedIds.includes(playerId)) {
    state.selectedIds = state.selectedIds.filter((id) => id !== playerId);
    delete state.playerUsage[playerId];
  } else {
    const player = getPlayerById(playerId);
    if (!player || !canAddPlayer(player)) {
      return;
    }
    state.selectedIds = [...state.selectedIds, playerId];
    state.playerUsage[playerId] = getPlayerUsageMultiplier(player);
  }
  state.season = null;
  render();
}

function resetTeam() {
  clearLiveMatch();
  state.selectedIds = [];
  state.playerUsage = {};
  state.marketPosition = "all";
  state.season = null;
  state.scouting = createScoutingState();
  state.tactics = { ...defaultTactics };
  state.trainingFocus = "shooting";
  render();
}

function bindInputs() {
  Object.entries(tacticInputs).forEach(([key, input]) => {
    input.addEventListener("change", () => {
      state.tactics[key] = input.value;
      renderTeamStats();
      renderQuickHub();
      renderResults();
    });
  });

  trainingInput.addEventListener("change", () => {
    state.trainingFocus = trainingInput.value;
    renderQuickHub();
    renderResults();
  });

  settingsBudgetInput.addEventListener("change", () => {
    state.settings.budgetBoost = Number(settingsBudgetInput.value);
    render();
  });

  settingsEaseInput.addEventListener("change", () => {
    state.settings.ease = settingsEaseInput.value;
    renderQuickHub();
    renderResults();
  });

  franchiseNameInput?.addEventListener("change", () => {
    state.settings.teamName = franchiseNameInput.value.trim().slice(0, 32);
    syncUserTeamIdentity();
    render();
  });

  staffPhysioInput?.addEventListener("change", () => updateStaffLevel("physio", staffPhysioInput.value));

  staffConditioningInput?.addEventListener("change", () => updateStaffLevel("conditioning", staffConditioningInput.value));

  staffAssistantInput?.addEventListener("change", () => updateStaffLevel("assistant", staffAssistantInput.value));

  staffAnalystInput?.addEventListener("change", () => updateStaffLevel("analyst", staffAnalystInput.value));

  staffPsychologistInput?.addEventListener("change", () => updateStaffLevel("psychologist", staffPsychologistInput.value));

  staffDoctorInput?.addEventListener("change", () => updateStaffLevel("doctor", staffDoctorInput.value));

  divisionInput.addEventListener("change", () => {
    clearLiveMatch();
    state.division = divisionInput.value;
    state.selectedIds = [];
    state.playerUsage = {};
    state.marketPosition = "all";
    state.season = null;
    state.scouting = createScoutingState();
    state.tactics = { ...defaultTactics };
    state.trainingFocus = "shooting";
    setSaveStatus(`Categoria alterada para ${getDivisionConfig().label}. Elenco reiniciado para evitar misturar divisões.`);
    render();
  });

  toggleSettingsButton.addEventListener("click", () => {
    settingsPanelEl.classList.toggle("is-hidden");
  });
}

function render() {
  syncUserTeamIdentity();
  renderRoster();
  renderMarket();
  renderTeamStats();
  renderControls();
  renderWeeklyHub();
  renderQuickHub();
  renderLiveMatchPage();
  renderResults();
  renderInjuryCenter();
  renderConfigEditor();
  renderLeagueTable();
  switchTab(state.activeTab);
}

bindInputs();
startSeasonButton.addEventListener("click", startSeason);
playNextButton.addEventListener("click", playNextGame);
resetButton.addEventListener("click", resetTeam);
saveGameButton.addEventListener("click", saveGame);
loadGameButton.addEventListener("click", loadGame);
deleteSaveButton.addEventListener("click", deleteSave);
tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
});

render();
window.TemporadaTotal = {
  ...(window.TemporadaTotal || {}),
  getLegacyBasketballMarketSnapshot
};
window.TemporadaTotal?.registerLegacyRuntime?.({
  state,
  actions: {
    render,
    startSeason,
    playNextGame,
    resetTeam,
    saveGame,
    loadGame,
    deleteSave,
    switchTab,
    prepareLiveBasketballMatch,
    openLiveMatchTab,
    clearLiveMatch
  },
  selectors: {
    getDivisionConfig,
    getSelectedPlayers,
    getOpponents,
    getBudgetCap,
    getRosterSize,
    getLegacyBasketballMarketSnapshot,
    getSortedLeagueTeams
  }
});
