const SAVE_STORAGE_KEY = "temporada-total-volei-v2";
const CUSTOM_CONFIG_STORAGE_KEY = "temporada-total-volei-custom-config-v1";
const USER_TEAM_ID = "franchise";

const ROTATION_WEIGHTS = {
  short: [1, 0.99, 0.96, 0.94, 0.91, 0.88, 0.42, 0.32],
  normal: [1, 0.98, 0.95, 0.92, 0.9, 0.87, 0.66, 0.55],
  deep: [0.97, 0.95, 0.93, 0.91, 0.89, 0.86, 0.75, 0.67]
};

const defaultTactics = {
  pace: "balanced",
  shot: "balanced",
  rebound: "balanced",
  defense: "balanced",
  rotation: "normal"
};

const SIMULATION_EASE_VALUES = {
  "muito-dificil": -0.02,
  dificil: -0.01,
  normal: 0,
  facil: 0.01,
  "muito-facil": 0.02,
  favoravel: 0.01,
  "muito-favoravel": 0.02
};

const PLAYER_USAGE_LEVELS = [
  { value: 0.7, label: "Muito baixo" },
  { value: 0.85, label: "Baixo" },
  { value: 1, label: "Equilibrado" },
  { value: 1.15, label: "Alto" },
  { value: 1.3, label: "Muito alto" }
];

const DEFAULT_PLAYER_USAGE = {
  LEV: 0.85,
  OPO: 1.3,
  PON: 1.1,
  CEN: 0.95,
  LIB: 0.7
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

const psychologyProfiles = [
  { name: "Lider sereno", summary: "estabiliza recepcao e decisao nos pontos longos", confidence: 3, chemistry: 3, focus: 2, intensity: 0, clutch: 2.3, volatility: -1.3, recovery: 1.1, traits: ["leader", "stable"] },
  { name: "Competidor obsessivo", summary: "sobe o teto do saque e da agressividade, mas cobra energia mental", confidence: 2, chemistry: -1, focus: 3, intensity: 3, clutch: 1.5, volatility: 1, recovery: -0.7, traits: ["intense"] },
  { name: "Talento instavel", summary: "oscila com a moral e exige gestao constante", confidence: -1, chemistry: -2, focus: -1, intensity: 1, clutch: 0.6, volatility: 2.6, recovery: -0.3, traits: ["volatile"] },
  { name: "Operario disciplinado", summary: "segura cobertura, volume de defesa e constancia", confidence: 1, chemistry: 2, focus: 3, intensity: 1, clutch: 1.1, volatility: -0.8, recovery: 0.9, traits: ["stable"] },
  { name: "Frio decisivo", summary: "aparece no fim do set, mas se fecha apos tropecos", confidence: 2, chemistry: -1, focus: 2, intensity: 0, clutch: 2.8, volatility: 1, recovery: 0.1, traits: ["clutch"] },
  { name: "Motor emocional", summary: "empurra a energia do grupo para cima ou para baixo", confidence: 1, chemistry: 1, focus: 0, intensity: 2, clutch: 1, volatility: 1.8, recovery: 0.2, traits: ["emotional"] },
  { name: "Comandante de quadra", summary: "organiza comunicacao e acalma a linha de passe", confidence: 2, chemistry: 3, focus: 3, intensity: 0, clutch: 1.5, volatility: -0.7, recovery: 0.5, traits: ["leader", "organizer"] },
  { name: "Provocador de rede", summary: "cresce no duelo, mas pode aumentar tensao interna", confidence: 1, chemistry: -2, focus: 0, intensity: 4, clutch: 1.2, volatility: 1.5, recovery: -0.2, traits: ["intense", "volatile"] },
  { name: "Mentor da linha de passe", summary: "corrige posicionamento e protege atletas jovens", confidence: 1, chemistry: 4, focus: 2, intensity: -1, clutch: 0.9, volatility: -1.1, recovery: 0.8, traits: ["leader", "mentor"] },
  { name: "Decisivo silencioso", summary: "decide sem chamar atencao e erra pouco em bolas importantes", confidence: 2, chemistry: 0, focus: 3, intensity: 0, clutch: 2.4, volatility: -0.2, recovery: 0.2, traits: ["clutch", "stable"] },
  { name: "Jovem eletrico", summary: "traz energia, mas sente viradas contra", confidence: -1, chemistry: 0, focus: -1, intensity: 2, clutch: 0.3, volatility: 1.9, recovery: 0.1, traits: ["young", "volatile"] },
  { name: "Conector de grupo", summary: "melhora comunicacao entre titulares e banco", confidence: 1, chemistry: 4, focus: 2, intensity: 1, clutch: 0.8, volatility: -0.9, recovery: 0.7, traits: ["connector", "stable"] },
  { name: "Referencia exigente", summary: "puxa padrao tecnico e cobra volume de jogo", confidence: 3, chemistry: -2, focus: 1, intensity: 2, clutch: 2.1, volatility: 1.1, recovery: -0.2, traits: ["star", "intense"] },
  { name: "Especialista de missao", summary: "aceita papel curto e entrega fundamento especifico", confidence: 1, chemistry: 1, focus: 3, intensity: -1, clutch: 1.8, volatility: -0.4, recovery: 0.5, traits: ["specialist", "stable"] },
  { name: "Sobrevivente de rally", summary: "aguenta sets longos e recupera bem depois de derrota", confidence: 0, chemistry: 1, focus: 2, intensity: 1, clutch: 1.2, volatility: -1, recovery: 1.6, traits: ["resilient"] }
];

const technicalProfiles = [
  { name: "Saque potente", summary: "pressiona recepcao rival e gera pontos curtos", serve: 5, attack: 0, block: -1, reception: -1, setting: 0, defense: -1, physical: 2, tactical: 0, pressure: 3, traits: ["server", "risk"] },
  { name: "Passador premium", summary: "estabiliza sideout e protege o levantador", serve: 0, attack: -1, block: -2, reception: 5, setting: 1, defense: 3, physical: -1, tactical: 2, sideout: 3, traits: ["passer", "defender"] },
  { name: "Oposto definidor", summary: "resolve bola alta e carrega volume ofensivo", serve: 1, attack: 5, block: 1, reception: -3, setting: 0, defense: -1, physical: 3, tactical: 0, traits: ["terminal", "ball-dominant"] },
  { name: "Central de parede", summary: "fecha rede e muda trajetorias de ataque", serve: -1, attack: 1, block: 5, reception: -3, setting: 0, defense: 0, physical: 3, tactical: 2, pressure: 2, traits: ["blocker", "middle"] },
  { name: "Levantador cerebral", summary: "distribui bem e acelera bola de meio", serve: 0, attack: -2, block: -1, reception: 0, setting: 5, defense: 1, physical: -1, tactical: 4, sideout: 2, traits: ["setter", "organizer"] },
  { name: "Libero de cobertura", summary: "aumenta cobertura e salva ralis longos", serve: -2, attack: -4, block: -4, reception: 4, setting: 1, defense: 5, physical: 0, tactical: 2, traits: ["libero", "defender"] },
  { name: "Ponteiro completo", summary: "equilibra passe, ataque e defesa sem buracos claros", serve: 1, attack: 2, block: 1, reception: 2, setting: 0, defense: 2, physical: 1, tactical: 1, traits: ["balanced", "connector"] },
  { name: "Atacante de pipe", summary: "abre ataque de fundo e pune bloqueio pesado", serve: 1, attack: 4, block: 0, reception: 1, setting: 0, defense: 1, physical: 2, tactical: 1, transition: 2, traits: ["terminal", "backrow"] },
  { name: "Especialista de saque", summary: "entra para quebrar passe, mas oferece pouco em rally", serve: 5, attack: -1, block: -1, reception: -2, setting: 0, defense: -1, physical: 0, tactical: 1, traits: ["server", "specialist"] },
  { name: "Bloqueador movel", summary: "le bem deslocamentos e cobre pontas rapidas", serve: 0, attack: 1, block: 4, reception: -2, setting: 0, defense: 2, physical: 2, tactical: 3, traits: ["blocker", "mobile"] },
  { name: "Defensor de volume", summary: "sustenta ralis e melhora contra-ataque", serve: 0, attack: 0, block: -1, reception: 2, setting: 1, defense: 4, physical: 1, tactical: 2, transition: 2, traits: ["defender", "connector"] },
  { name: "Levantador agressivo", summary: "arrisca distribuicao e aumenta teto ofensivo", serve: 1, attack: -1, block: 0, reception: 0, setting: 4, defense: 0, physical: 0, tactical: 2, pressure: 1, traits: ["setter", "risk"] },
  { name: "Ponta de seguranca", summary: "reduz erros e estabiliza rotacao dificil", serve: 0, attack: 1, block: 0, reception: 3, setting: 0, defense: 3, physical: 0, tactical: 2, traits: ["passer", "stable-role"] },
  { name: "Central veloz", summary: "acelera primeiro tempo e puxa bloqueio rival", serve: -1, attack: 3, block: 3, reception: -3, setting: 0, defense: 0, physical: 3, tactical: 1, sideout: 2, traits: ["middle", "fast"] },
  { name: "Universal tatico", summary: "cobre funcoes diferentes e facilita ajustes", serve: 1, attack: 1, block: 1, reception: 1, setting: 1, defense: 1, physical: 1, tactical: 3, traits: ["versatile", "connector"] }
];
const managementActionTemplates = [
  {
    key: "talk-star",
    label: "Conversar com uma referencia",
    description: "Ajusta seguranca emocional e leitura ofensiva de quem puxa o time.",
    weightLabel: "Peso alto em confianca e sideout",
    changes: { confidence: 6, chemistry: 1, focus: 1, intensity: -1 },
    modifiers: [
      { key: "attack", amount: 2, duration: 2 },
      { key: "setting", amount: 1, duration: 2 }
    ],
    morale: 2
  },
  {
    key: "call-out",
    label: "Dar um esporro no grupo",
    description: "Sobe a tensao competitiva, mas o clima pode pesar se o elenco nao responder.",
    weightLabel: "Peso alto em pressao, risco para o grupo",
    changes: { confidence: -2, chemistry: -4, focus: 4, intensity: 6 },
    modifiers: [
      { key: "serve", amount: 2, duration: 1 },
      { key: "block", amount: 2, duration: 1 },
      { key: "defense", amount: 1, duration: 1 }
    ],
    morale: -1
  },
  {
    key: "team-bonding",
    label: "Melhorar o grupo",
    description: "Trabalha conexao, comunicacao e estabilidade para as proximas rodadas.",
    weightLabel: "Peso alto em entrosamento e constancia",
    changes: { confidence: 1, chemistry: 6, focus: 2, intensity: -2 },
    modifiers: [
      { key: "reception", amount: 2, duration: 2 },
      { key: "defense", amount: 2, duration: 2 },
      { key: "tactical", amount: 1, duration: 2 }
    ],
    morale: 3
  },
  {
    key: "targeted-training",
    label: "Treino especifico",
    description: "Um bloco extra focado no plano da semana, com ganho tecnico e algum desgaste.",
    weightLabel: "Peso medio-alto no fundamento treinado",
    changes: { confidence: 0, chemistry: 0, focus: 4, intensity: 3 },
    dynamicTraining: true,
    morale: 1
  }
];

const trainingPlans = {
  serve: {
    label: "Saque e pressao",
    description: "Mais agressividade na primeira bola, com leve desgaste fisico.",
    progress: { serve: 1, attack: 0, block: 0, reception: 0, setting: 0, defense: 0, physical: -0.2, tactical: 0 },
    modifier: { key: "serve", amount: 2, duration: 2 }
  },
  block: {
    label: "Bloqueio",
    description: "Ajusta tempo de salto e leitura dos centrais.",
    progress: { serve: 0, attack: 0, block: 1, reception: 0, setting: 0, defense: 0, physical: 0.4, tactical: 0.4 },
    modifier: { key: "block", amount: 2, duration: 2 }
  },
  reception: {
    label: "Recepcao",
    description: "Organiza a linha de passe e reduz oscilações na virada de bola.",
    progress: { serve: 0, attack: 0, block: 0, reception: 1, setting: 0, defense: 1, physical: 0, tactical: 0.4 },
    modifier: { key: "reception", amount: 2, duration: 2 }
  },
  setting: {
    label: "Levantamento",
    description: "Melhora a leitura da distribuicao e do ataque de meio.",
    progress: { serve: 0, attack: 0.5, block: 0, reception: 0, setting: 1, defense: 0, physical: 0, tactical: 0.5 },
    modifier: { key: "setting", amount: 2, duration: 2 }
  },
  strength: {
    label: "Fisico",
    description: "Mais potencia para atacar alto e sustentar a temporada.",
    progress: { serve: 0, attack: 0.5, block: 0.5, reception: 0, setting: 0, defense: 0, physical: 1, tactical: 0 },
    modifier: { key: "physical", amount: 2, duration: 2 }
  }
};

const decisionTemplates = [
  {
    title: "Saque mais agressivo no proximo jogo",
    text: "A comissao quer pressionar o passe adversario desde o inicio.",
    choices: [
      { label: "Liberar o risco", effect: "Saque +4 por 2 jogos, recepcao -1 por 1 jogo", modifiers: [{ key: "serve", amount: 4, duration: 2 }, { key: "reception", amount: -1, duration: 1 }] },
      { label: "Manter equilibrio", effect: "Sem efeitos extras", modifiers: [] }
    ]
  },
  {
    title: "Treino extra para o sistema defensivo",
    text: "Ha espaco para crescer na cobertura, mas isso pode tirar perna do ataque.",
    choices: [
      { label: "Priorizar defesa", effect: "Defesa +4 por 2 jogos, ataque -2 por 1 jogo", modifiers: [{ key: "defense", amount: 4, duration: 2 }, { key: "attack", amount: -2, duration: 1 }] },
      { label: "Treino curto", effect: "Defesa +1 por 1 jogo", modifiers: [{ key: "defense", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Falar menos ou cobrar mais?",
    text: "O vestiario sente a pressao da classificacao. A sua fala antes do jogo pode mudar o clima.",
    choices: [
      { label: "Blindar o grupo", effect: "Moral +4 por 3 jogos", modifiers: [{ key: "morale", amount: 4, duration: 3 }] },
      { label: "Cobrar forte", effect: "Bloqueio +2 por 2 jogos, moral -2 por 2 jogos", modifiers: [{ key: "block", amount: 2, duration: 2 }, { key: "morale", amount: -2, duration: 2 }] }
    ]
  },
  {
    title: "Rodar mais a equipe",
    text: "O calendario apertou e o banco pede minutos. Isso pode dar frescor ou perder encaixe.",
    choices: [
      { label: "Abrir a rotacao", effect: "Fisico +3 por 2 jogos, levantamento -1 por 1 jogo", modifiers: [{ key: "physical", amount: 3, duration: 2 }, { key: "setting", amount: -1, duration: 1 }] },
      { label: "Manter titulares", effect: "Ataque +2 por 1 jogo", modifiers: [{ key: "attack", amount: 2, duration: 1 }] }
    ]
  }
];

decisionTemplates.push(
  {
    title: "Passe pressionado pelo rival",
    text: "O adversario estudou sua linha de recepcao e vai mirar saque em zonas curtas.",
    choices: [
      { label: "Reforcar passe", effect: "Recepcao +4 por 1 jogo, ataque -1", modifiers: [{ key: "reception", amount: 4, duration: 1 }, { key: "attack", amount: -1, duration: 1 }] },
      { label: "Responder no saque", effect: "Saque +3 por 1 jogo, recepcao -1", modifiers: [{ key: "serve", amount: 3, duration: 1 }, { key: "reception", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Central sentiu a carga",
    text: "O salto esta pesando. Da para preservar ou insistir no bloqueio.",
    choices: [
      { label: "Preservar perna", effect: "Fisico +3 por 2 jogos, bloqueio -1", modifiers: [{ key: "physical", amount: 3, duration: 2 }, { key: "block", amount: -1, duration: 1 }] },
      { label: "Forcar rede", effect: "Bloqueio +4 por 1 jogo, fisico -2", modifiers: [{ key: "block", amount: 4, duration: 1 }, { key: "physical", amount: -2, duration: 1 }] }
    ]
  },
  {
    title: "Levantamento ficou previsivel",
    text: "Os rivais estao fechando seu ataque de seguranca.",
    choices: [
      { label: "Variar distribuicao", effect: "Levantamento +4 e tatica +2", modifiers: [{ key: "setting", amount: 4, duration: 1 }, { key: "tactical", amount: 2, duration: 1 }] },
      { label: "Atacar alto nas pontas", effect: "Ataque +3, erros/recepcao -1", modifiers: [{ key: "attack", amount: 3, duration: 1 }, { key: "reception", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Banco pede quadra",
    text: "Reservas estao fortes nos treinos e querem minutos reais.",
    choices: [
      { label: "Rodar elenco", effect: "Fisico +2 e defesa +1", modifiers: [{ key: "physical", amount: 2, duration: 2 }, { key: "defense", amount: 1, duration: 1 }] },
      { label: "Manter sexteto", effect: "Ataque +2, moral -2", modifiers: [{ key: "attack", amount: 2, duration: 1 }, { key: "morale", amount: -2, duration: 2 }] }
    ]
  },
  {
    title: "Sequencia fora de casa",
    text: "Viagem longa, treino curto e pouca recuperacao.",
    choices: [
      { label: "Treino leve", effect: "Fisico +3, saque -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "serve", amount: -1, duration: 1 }] },
      { label: "Treino tatico", effect: "Tatica +3, fisico -2", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "physical", amount: -2, duration: 1 }] }
    ]
  },
  {
    title: "Ataque travou na virada de bola",
    text: "O time esta chegando previsivel no sideout.",
    choices: [
      { label: "Acelerar bolas", effect: "Ataque +3 e levantamento +2", modifiers: [{ key: "attack", amount: 3, duration: 1 }, { key: "setting", amount: 2, duration: 1 }] },
      { label: "Ganhar no volume", effect: "Defesa +3 e recepcao +2", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "reception", amount: 2, duration: 1 }] }
    ]
  },
  {
    title: "Pressao da torcida",
    text: "A arquibancada quer atitude depois de sets apagados.",
    choices: [
      { label: "Comprar a pressao", effect: "Moral +3 e saque +1", modifiers: [{ key: "morale", amount: 3, duration: 2 }, { key: "serve", amount: 1, duration: 1 }] },
      { label: "Blindar o grupo", effect: "Recepcao +2 e moral +1", modifiers: [{ key: "reception", amount: 2, duration: 1 }, { key: "morale", amount: 1, duration: 2 }] }
    ]
  },
  {
    title: "Rival vai explorar seu bloqueio",
    text: "O scout adversario quer usar toque no bloqueio e largadas.",
    choices: [
      { label: "Fechar leitura", effect: "Bloqueio +2 e defesa +3", modifiers: [{ key: "block", amount: 2, duration: 1 }, { key: "defense", amount: 3, duration: 1 }] },
      { label: "Responder com saque", effect: "Saque +4, defesa -1", modifiers: [{ key: "serve", amount: 4, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] }
    ]
  }
);

decisionTemplates.push(
  {
    title: "Ponteira sentindo a recepcao",
    text: "A carga de passe esta alta e a comissao discute como aliviar sem quebrar o sideout.",
    choices: [
      { label: "Proteger na linha", effect: "Recepcao +3, ataque -1", modifiers: [{ key: "reception", amount: 3, duration: 1 }, { key: "attack", amount: -1, duration: 1 }] },
      { label: "Empurrar pelo saque", effect: "Saque +2, defesa +1", modifiers: [{ key: "serve", amount: 2, duration: 1 }, { key: "defense", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Levantador quer acelerar o jogo",
    text: "Ha espaco para subir o ritmo das bolas de meio, mas isso pode aumentar erro de encaixe.",
    choices: [
      { label: "Acelerar distribuicao", effect: "Levantamento +3, ataque +1", modifiers: [{ key: "setting", amount: 3, duration: 1 }, { key: "attack", amount: 1, duration: 1 }] },
      { label: "Manter controle", effect: "Tatica +2, recepcao +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "reception", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Adversario deve sacar curto",
    text: "O scout indica muito saque curto na frente da linha para quebrar a primeira bola.",
    choices: [
      { label: "Treinar deslocamento", effect: "Recepcao +2, defesa +2", modifiers: [{ key: "reception", amount: 2, duration: 1 }, { key: "defense", amount: 2, duration: 1 }] },
      { label: "Responder agressivo", effect: "Saque +3, fisico -1", modifiers: [{ key: "serve", amount: 3, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Central pede mais bolas",
    text: "O treino abriu espaco para usar mais primeiro tempo e desafiar o bloqueio rival.",
    choices: [
      { label: "Abrir o meio", effect: "Ataque +2, bloqueio +1", modifiers: [{ key: "attack", amount: 2, duration: 1 }, { key: "block", amount: 1, duration: 1 }] },
      { label: "Usar como isca", effect: "Tatica +2, levantamento +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "setting", amount: 1, duration: 1 }] }
    ]
  }
);

decisionTemplates.push(
  {
    title: "Arbitragem marca toque fino",
    text: "A rodada tende a punir conducoes e contatos na rede.",
    choices: [
      { label: "Jogar limpo", effect: "Levantamento +3, bloqueio -1", modifiers: [{ key: "setting", amount: 3, duration: 1 }, { key: "block", amount: -1, duration: 1 }] },
      { label: "Manter agressividade", effect: "Bloqueio +3, moral -1", modifiers: [{ key: "block", amount: 3, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Linha de passe instavel",
    text: "O treino mostrou dificuldade com saque flutuante.",
    choices: [
      { label: "Reforcar recepcao", effect: "Recepcao +4, ataque -1", modifiers: [{ key: "reception", amount: 4, duration: 1 }, { key: "attack", amount: -1, duration: 1 }] },
      { label: "Virar em bola alta", effect: "Ataque +3, erros/defesa -1", modifiers: [{ key: "attack", amount: 3, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Oposto muito acionado",
    text: "O volume em uma referencia pode decidir ou tornar o jogo previsivel.",
    choices: [
      { label: "Seguir no oposto", effect: "Ataque +4, tatica -1", modifiers: [{ key: "attack", amount: 4, duration: 1 }, { key: "tactical", amount: -1, duration: 1 }] },
      { label: "Distribuir mais", effect: "Levantamento +3, ataque +1", modifiers: [{ key: "setting", amount: 3, duration: 1 }, { key: "attack", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Central domina treino",
    text: "Ha oportunidade de jogar mais pelo meio.",
    choices: [
      { label: "Acelerar meio", effect: "Ataque +2, levantamento +2", modifiers: [{ key: "attack", amount: 2, duration: 1 }, { key: "setting", amount: 2, duration: 1 }] },
      { label: "Usar como ameaca", effect: "Tatica +3, recepcao +1", modifiers: [{ key: "tactical", amount: 3, duration: 1 }, { key: "reception", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Defesa cansou nos ralis longos",
    text: "Os pontos longos estao drenando energia e comunicacao.",
    choices: [
      { label: "Encurtar pontos", effect: "Saque +3, defesa -1", modifiers: [{ key: "serve", amount: 3, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] },
      { label: "Ganhar no volume", effect: "Defesa +4, fisico -1", modifiers: [{ key: "defense", amount: 4, duration: 1 }, { key: "physical", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Libero pediu ajuste",
    text: "A cobertura esta confusa e o libero quer reorganizar a quadra.",
    choices: [
      { label: "Dar autonomia", effect: "Defesa +3, recepcao +2", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "reception", amount: 2, duration: 1 }] },
      { label: "Manter sistema", effect: "Tatica +2, moral -1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Sequencia de tie-breaks",
    text: "O time esta vivendo sets decisivos demais.",
    choices: [
      { label: "Treinar pressao", effect: "Moral +2, tatica +1", modifiers: [{ key: "morale", amount: 2, duration: 2 }, { key: "tactical", amount: 1, duration: 1 }] },
      { label: "Recuperar perna", effect: "Fisico +3, saque -1", modifiers: [{ key: "physical", amount: 3, duration: 1 }, { key: "serve", amount: -1, duration: 1 }] }
    ]
  },
  {
    title: "Scout rival fecha diagonal",
    text: "Os adversarios estao esperando sua bola mais forte.",
    choices: [
      { label: "Explorar paralela", effect: "Ataque +2, tatica +2", modifiers: [{ key: "attack", amount: 2, duration: 1 }, { key: "tactical", amount: 2, duration: 1 }] },
      { label: "Largar mais", effect: "Levantamento +2, defesa +1", modifiers: [{ key: "setting", amount: 2, duration: 1 }, { key: "defense", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Treino aberto para torcida",
    text: "A energia pode subir, mas o foco pode dispersar.",
    choices: [
      { label: "Abrir treino", effect: "Moral +3, tatica -1", modifiers: [{ key: "morale", amount: 3, duration: 1 }, { key: "tactical", amount: -1, duration: 1 }] },
      { label: "Fechar treino", effect: "Tatica +2, recepcao +1", modifiers: [{ key: "tactical", amount: 2, duration: 1 }, { key: "reception", amount: 1, duration: 1 }] }
    ]
  },
  {
    title: "Partida em ginasio hostil",
    text: "Barulho e pressao devem afetar saque e comunicacao.",
    choices: [
      { label: "Saque seguro", effect: "Recepcao +2, saque -1", modifiers: [{ key: "reception", amount: 2, duration: 1 }, { key: "serve", amount: -1, duration: 1 }] },
      { label: "Aumentar risco", effect: "Saque +4, recepcao -2", modifiers: [{ key: "serve", amount: 4, duration: 1 }, { key: "reception", amount: -2, duration: 1 }] }
    ]
  },
  {
    title: "Rival em crise",
    text: "O adversario vem pressionado e pode quebrar cedo.",
    choices: [
      { label: "Atacar no saque", effect: "Saque +3, moral +1", modifiers: [{ key: "serve", amount: 3, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] },
      { label: "Controlar erros", effect: "Recepcao +2, tatica +2", modifiers: [{ key: "reception", amount: 2, duration: 1 }, { key: "tactical", amount: 2, duration: 1 }] }
    ]
  },
  {
    title: "Bloqueio chegando atrasado",
    text: "A leitura contra ataques rapidos precisa de escolha clara.",
    choices: [
      { label: "Comprometer meio", effect: "Bloqueio +4, defesa -1", modifiers: [{ key: "block", amount: 4, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] },
      { label: "Defender mais fundo", effect: "Defesa +3, bloqueio +1", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "block", amount: 1, duration: 1 }] }
    ]
  }
);

const BASE_DECISION_TEMPLATE_COUNT = decisionTemplates.length;

const DIVISIONS = {
  masculino: {
    label: "Volei masculino",
    rosterSize: 8,
    salaryCap: 108,
    heightRange: { min: 178, max: 212 },
    market: [
      { id: 1, name: "Bruno Siqueira", pos: "LEV", salary: 16, heightCm: 193, serve: 79, attack: 74, block: 71, reception: 84, setting: 92, defense: 82, physical: 80, tactical: 88, tag: "Levantador cerebral", pool: "pro", development: 1.02 },
      { id: 2, name: "Ruan Tavares", pos: "OPO", salary: 17, heightCm: 204, serve: 77, attack: 92, block: 81, reception: 58, setting: 61, defense: 68, physical: 88, tactical: 78, tag: "Oposto de definicao", pool: "pro", development: 1.01 },
      { id: 3, name: "Danilo Freire", pos: "PON", salary: 15, heightCm: 198, serve: 80, attack: 86, block: 77, reception: 81, setting: 66, defense: 79, physical: 84, tactical: 81, tag: "Ponteiro completo", pool: "pro", development: 1.03 },
      { id: 4, name: "Guilherme Vidal", pos: "PON", salary: 13, heightCm: 196, serve: 83, attack: 82, block: 74, reception: 78, setting: 64, defense: 77, physical: 82, tactical: 79, tag: "Ponteiro agressivo", pool: "pro", development: 1.04 },
      { id: 5, name: "Matheus Borba", pos: "CEN", salary: 14, heightCm: 208, serve: 63, attack: 81, block: 92, reception: 48, setting: 57, defense: 67, physical: 89, tactical: 80, tag: "Central de parede", pool: "pro", development: 1.02 },
      { id: 6, name: "Joao Gama", pos: "CEN", salary: 11, heightCm: 206, serve: 65, attack: 78, block: 88, reception: 49, setting: 55, defense: 65, physical: 85, tactical: 78, tag: "Central veloz", pool: "pro", development: 1.05 },
      { id: 7, name: "Victor Leme", pos: "LIB", salary: 10, heightCm: 184, serve: 52, attack: 42, block: 38, reception: 93, setting: 69, defense: 91, physical: 76, tactical: 87, tag: "Libero de elite", pool: "pro", development: 1.02 },
      { id: 8, name: "Leo Paes", pos: "PON", salary: 10, heightCm: 194, serve: 76, attack: 78, block: 73, reception: 83, setting: 63, defense: 80, physical: 79, tactical: 84, tag: "Ponteiro equilibrado", pool: "pro", development: 1.05 },
      { id: 9, name: "Caio Martins", pos: "LEV", salary: 9, heightCm: 190, serve: 74, attack: 66, block: 68, reception: 79, setting: 86, defense: 78, physical: 74, tactical: 85, tag: "Levantador de ritmo", pool: "pro", development: 1.06 },
      { id: 10, name: "Pedro Sato", pos: "OPO", salary: 9, heightCm: 201, serve: 72, attack: 84, block: 76, reception: 55, setting: 59, defense: 66, physical: 81, tactical: 74, tag: "Finalizador do banco", pool: "pro", development: 1.06 },
      { id: 11, name: "Henrique Porto", pos: "LIB", salary: 6, heightCm: 182, serve: 50, attack: 38, block: 36, reception: 89, setting: 63, defense: 87, physical: 74, tactical: 82, tag: "Libero seguro", pool: "pro", development: 1.08 },
      { id: 12, name: "Samuel Neri", pos: "PON", salary: 7, heightCm: 192, serve: 72, attack: 76, block: 71, reception: 76, setting: 61, defense: 75, physical: 77, tactical: 77, tag: "Rotacao confiavel", pool: "pro", development: 1.08 },
      { id: 13, name: "Yago Diniz", pos: "CEN", salary: 5, heightCm: 205, serve: 61, attack: 73, block: 83, reception: 46, setting: 52, defense: 62, physical: 80, tactical: 72, tag: "Projeto de central", pool: "base", development: 1.22 },
      { id: 14, name: "Nicolas Mello", pos: "PON", salary: 5, heightCm: 195, serve: 75, attack: 72, block: 66, reception: 74, setting: 60, defense: 73, physical: 75, tactical: 74, tag: "Ala de teto alto", pool: "base", development: 1.21 },
      { id: 15, name: "Arthur Reis", pos: "LEV", salary: 4, heightCm: 188, serve: 68, attack: 60, block: 60, reception: 74, setting: 81, defense: 72, physical: 71, tactical: 80, tag: "Levantador em crescimento", pool: "base", development: 1.24 },
      { id: 16, name: "Miguel Braga", pos: "OPO", salary: 4, heightCm: 202, serve: 69, attack: 79, block: 71, reception: 51, setting: 57, defense: 60, physical: 79, tactical: 69, tag: "Potencia bruta", pool: "base", development: 1.23 },
      { id: 17, name: "Icaro Luz", pos: "LIB", salary: 4, heightCm: 181, serve: 49, attack: 35, block: 33, reception: 86, setting: 61, defense: 84, physical: 73, tactical: 79, tag: "Especialista de passe", pool: "base", development: 1.25 },
      { id: 18, name: "Thiago Queiroz", pos: "PON", salary: 3, heightCm: 191, serve: 71, attack: 70, block: 64, reception: 72, setting: 58, defense: 70, physical: 74, tactical: 71, tag: "Reserva de energia", pool: "base", development: 1.2 }
    ],
    opponents: [
      { id: "campinas", name: "Torres de Campinas", serve: 80, attack: 84, block: 81, reception: 77, setting: 80, defense: 76, physical: 82, tactical: 79, heightCm: 198, style: "jogo rapido com central forte" },
      { id: "osasco", name: "Muralhas de Osasco", serve: 74, attack: 79, block: 86, reception: 72, setting: 77, defense: 75, physical: 84, tactical: 81, heightCm: 201, style: "muito bloqueio e bola alta" },
      { id: "taubate", name: "Raios de Taubate", serve: 82, attack: 85, block: 78, reception: 76, setting: 79, defense: 74, physical: 80, tactical: 78, heightCm: 197, style: "saque pesado e transicao curta" },
      { id: "blumenau", name: "Bravos de Blumenau", serve: 75, attack: 77, block: 80, reception: 82, setting: 81, defense: 80, physical: 77, tactical: 84, heightCm: 195, style: "sideout consistente" },
      { id: "goiania", name: "Aero de Goiania", serve: 78, attack: 81, block: 76, reception: 79, setting: 82, defense: 78, physical: 79, tactical: 83, heightCm: 196, style: "distribuicao veloz pelas pontas" },
      { id: "fortaleza", name: "Maralto de Fortaleza", serve: 77, attack: 80, block: 77, reception: 74, setting: 76, defense: 79, physical: 81, tactical: 77, heightCm: 194, style: "muita defesa e contra-ataque" },
      { id: "recife", name: "Porto de Recife", serve: 73, attack: 76, block: 79, reception: 83, setting: 78, defense: 82, physical: 76, tactical: 85, heightCm: 193, style: "controle de rally e leitura" },
      { id: "curitiba", name: "Horizonte de Curitiba", serve: 81, attack: 83, block: 80, reception: 75, setting: 78, defense: 73, physical: 83, tactical: 76, heightCm: 199, style: "pressao no saque e no bloqueio" },
      { id: "manaus", name: "Aurora de Manaus", serve: 72, attack: 75, block: 74, reception: 81, setting: 80, defense: 80, physical: 75, tactical: 82, heightCm: 192, style: "volume de defesa" },
      { id: "salvador", name: "Mares de Salvador", serve: 76, attack: 82, block: 75, reception: 78, setting: 83, defense: 77, physical: 78, tactical: 84, heightCm: 195, style: "muito jogo de meio" },
      { id: "vitoria", name: "Granito de Vitoria", serve: 79, attack: 79, block: 82, reception: 71, setting: 74, defense: 74, physical: 84, tactical: 76, heightCm: 200, style: "forca no sistema de bloqueio" },
      { id: "natal", name: "Costa de Natal", serve: 74, attack: 78, block: 73, reception: 80, setting: 79, defense: 78, physical: 77, tactical: 81, heightCm: 194, style: "virada de bola limpa" },
      { id: "belem", name: "Marajo de Belem", serve: 78, attack: 80, block: 79, reception: 73, setting: 76, defense: 75, physical: 82, tactical: 77, heightCm: 198, style: "agressivo da linha de saque" },
      { id: "santos", name: "Oceano de Santos", serve: 75, attack: 77, block: 72, reception: 84, setting: 82, defense: 81, physical: 75, tactical: 84, heightCm: 191, style: "sistema tecnico e paciente" },
      { id: "brasilia", name: "Trovao de Brasilia", serve: 80, attack: 83, block: 78, reception: 74, setting: 77, defense: 76, physical: 81, tactical: 79, heightCm: 197, style: "forca nas bolas de seguranca" }
    ]
  },
  feminino: {
    label: "Volei feminino",
    rosterSize: 8,
    salaryCap: 94,
    heightRange: { min: 168, max: 198 },
    market: [
      { id: 101, name: "Julia Moreno", pos: "LEV", salary: 14, heightCm: 181, serve: 80, attack: 67, block: 63, reception: 85, setting: 92, defense: 84, physical: 77, tactical: 90, tag: "Levantadora de cadencia", pool: "pro", development: 1.03 },
      { id: 102, name: "Fernanda Lopes", pos: "OPO", salary: 16, heightCm: 189, serve: 78, attack: 91, block: 78, reception: 56, setting: 60, defense: 68, physical: 86, tactical: 79, tag: "Oposta decisiva", pool: "pro", development: 1.02 },
      { id: 103, name: "Camila Ayres", pos: "PON", salary: 14, heightCm: 186, serve: 82, attack: 84, block: 71, reception: 82, setting: 63, defense: 80, physical: 81, tactical: 82, tag: "Ponteira completa", pool: "pro", development: 1.03 },
      { id: 104, name: "Larissa Prado", pos: "PON", salary: 12, heightCm: 184, serve: 79, attack: 80, block: 68, reception: 84, setting: 62, defense: 82, physical: 79, tactical: 83, tag: "Recepcao de seguranca", pool: "pro", development: 1.04 },
      { id: 105, name: "Paula Sampaio", pos: "CEN", salary: 13, heightCm: 192, serve: 64, attack: 79, block: 90, reception: 46, setting: 55, defense: 66, physical: 85, tactical: 81, tag: "Central dominante", pool: "pro", development: 1.02 },
      { id: 106, name: "Bianca Rocha", pos: "CEN", salary: 10, heightCm: 190, serve: 66, attack: 77, block: 86, reception: 47, setting: 56, defense: 64, physical: 82, tactical: 78, tag: "Central de leitura", pool: "pro", development: 1.05 },
      { id: 107, name: "Aline Duarte", pos: "LIB", salary: 9, heightCm: 170, serve: 49, attack: 34, block: 31, reception: 94, setting: 68, defense: 92, physical: 74, tactical: 89, tag: "Libero de referencia", pool: "pro", development: 1.03 },
      { id: 108, name: "Marina Rios", pos: "PON", salary: 9, heightCm: 183, serve: 77, attack: 76, block: 66, reception: 79, setting: 60, defense: 77, physical: 77, tactical: 79, tag: "Ponteira de ritmo", pool: "pro", development: 1.06 },
      { id: 109, name: "Renata Mota", pos: "LEV", salary: 8, heightCm: 179, serve: 74, attack: 62, block: 58, reception: 77, setting: 86, defense: 79, physical: 72, tactical: 84, tag: "Levantadora de controle", pool: "pro", development: 1.07 },
      { id: 110, name: "Taina Farias", pos: "OPO", salary: 8, heightCm: 187, serve: 75, attack: 83, block: 72, reception: 54, setting: 58, defense: 65, physical: 80, tactical: 74, tag: "Potencia de banco", pool: "pro", development: 1.07 },
      { id: 111, name: "Helena Cruz", pos: "LIB", salary: 6, heightCm: 169, serve: 48, attack: 32, block: 29, reception: 89, setting: 63, defense: 88, physical: 72, tactical: 83, tag: "Passe limpo", pool: "pro", development: 1.09 },
      { id: 112, name: "Ester Luz", pos: "PON", salary: 7, heightCm: 182, serve: 73, attack: 74, block: 64, reception: 76, setting: 59, defense: 74, physical: 76, tactical: 75, tag: "Rotacao confiavel", pool: "pro", development: 1.08 },
      { id: 113, name: "Nina Guerra", pos: "CEN", salary: 5, heightCm: 191, serve: 62, attack: 72, block: 82, reception: 43, setting: 51, defense: 61, physical: 79, tactical: 73, tag: "Central promissora", pool: "base", development: 1.24 },
      { id: 114, name: "Valentina Costa", pos: "PON", salary: 5, heightCm: 181, serve: 74, attack: 71, block: 61, reception: 75, setting: 58, defense: 72, physical: 74, tactical: 73, tag: "Ponteira de futuro", pool: "base", development: 1.25 },
      { id: 115, name: "Livia Braga", pos: "LEV", salary: 4, heightCm: 177, serve: 68, attack: 57, block: 53, reception: 74, setting: 82, defense: 73, physical: 70, tactical: 81, tag: "Levantadora em formacao", pool: "base", development: 1.26 },
      { id: 116, name: "Isadora Reis", pos: "OPO", salary: 4, heightCm: 188, serve: 70, attack: 78, block: 68, reception: 50, setting: 55, defense: 61, physical: 78, tactical: 70, tag: "Ataque explosivo", pool: "base", development: 1.23 },
      { id: 117, name: "Clara Nascimento", pos: "LIB", salary: 4, heightCm: 168, serve: 46, attack: 31, block: 28, reception: 87, setting: 61, defense: 85, physical: 71, tactical: 80, tag: "Especialista de passe", pool: "base", development: 1.27 },
      { id: 118, name: "Sofia Mello", pos: "PON", salary: 3, heightCm: 180, serve: 71, attack: 69, block: 59, reception: 71, setting: 57, defense: 70, physical: 73, tactical: 71, tag: "Energia para entrar no set", pool: "base", development: 1.22 }
    ],
    opponents: [
      { id: "osascof", name: "Aurora de Osasco", serve: 80, attack: 83, block: 79, reception: 82, setting: 83, defense: 81, physical: 80, tactical: 84, heightCm: 184, style: "sistema tecnico e rapido" },
      { id: "rioclarof", name: "Ponte Alta de Rio Claro", serve: 74, attack: 77, block: 82, reception: 77, setting: 78, defense: 79, physical: 81, tactical: 80, heightCm: 186, style: "forte na rede" },
      { id: "campinasf", name: "Torres de Campinas", serve: 79, attack: 84, block: 76, reception: 80, setting: 81, defense: 78, physical: 79, tactical: 82, heightCm: 183, style: "pontas muito participativas" },
      { id: "florianopolisf", name: "Ilha de Florianopolis", serve: 75, attack: 76, block: 78, reception: 85, setting: 82, defense: 84, physical: 76, tactical: 85, heightCm: 180, style: "volume de defesa e paciencia" },
      { id: "bauruf", name: "Impacto de Bauru", serve: 81, attack: 82, block: 74, reception: 76, setting: 79, defense: 75, physical: 82, tactical: 78, heightCm: 182, style: "saque muito presente" },
      { id: "recifef", name: "Porto de Recife", serve: 73, attack: 75, block: 77, reception: 84, setting: 80, defense: 83, physical: 75, tactical: 84, heightCm: 179, style: "muita consistencia" },
      { id: "goianiaf", name: "Aero de Goiania", serve: 77, attack: 79, block: 75, reception: 81, setting: 83, defense: 80, physical: 77, tactical: 83, heightCm: 181, style: "levantamento variado" },
      { id: "fortalezaf", name: "Brisa de Fortaleza", serve: 76, attack: 78, block: 73, reception: 79, setting: 78, defense: 81, physical: 78, tactical: 80, heightCm: 180, style: "defesa funda e contra-ataque" },
      { id: "vitoriaf", name: "Granito de Vitoria", serve: 72, attack: 74, block: 79, reception: 78, setting: 76, defense: 77, physical: 80, tactical: 78, heightCm: 185, style: "pressao na rede" },
      { id: "curitibaf", name: "Horizonte de Curitiba", serve: 80, attack: 81, block: 77, reception: 75, setting: 79, defense: 76, physical: 81, tactical: 79, heightCm: 183, style: "ritmo forte de saque" },
      { id: "salvadorf", name: "Mares de Salvador", serve: 75, attack: 80, block: 72, reception: 82, setting: 84, defense: 79, physical: 76, tactical: 85, heightCm: 180, style: "muito jogo de distribuicao" },
      { id: "natalf", name: "Costa de Natal", serve: 74, attack: 77, block: 74, reception: 83, setting: 81, defense: 82, physical: 75, tactical: 84, heightCm: 179, style: "virada de bola limpa" },
      { id: "belemf", name: "Marajo de Belem", serve: 78, attack: 79, block: 76, reception: 74, setting: 77, defense: 75, physical: 80, tactical: 77, heightCm: 184, style: "agressivo no primeiro toque" },
      { id: "santosf", name: "Oceano de Santos", serve: 73, attack: 76, block: 71, reception: 86, setting: 83, defense: 84, physical: 74, tactical: 86, heightCm: 178, style: "muito controle tecnico" },
      { id: "brasiliaf", name: "Trovao de Brasilia", serve: 79, attack: 82, block: 75, reception: 76, setting: 78, defense: 77, physical: 80, tactical: 79, heightCm: 182, style: "forca nas pontas" }
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

function getCompatibleTechnicalProfiles(player) {
  const positionRules = {
    LIB: ["libero", "passer", "defender", "stable-role"],
    LEV: ["setter", "organizer", "connector", "stable-role", "risk"],
    CEN: ["middle", "blocker", "mobile", "fast"],
    OPO: ["terminal", "ball-dominant", "risk", "server"],
    PON: ["balanced", "passer", "defender", "terminal", "server", "connector", "backrow"]
  };
  const allowedTraits = positionRules[player.pos] || [];
  const compatible = technicalProfiles.filter((profile) =>
    profile.traits.some((trait) => allowedTraits.includes(trait))
  );
  return compatible.length ? compatible : technicalProfiles;
}

function attachPsychology(player) {
  const profile = psychologyProfiles[Math.abs(player.id + player.salary + player.heightCm) % psychologyProfiles.length];
  const compatibleProfiles = getCompatibleTechnicalProfiles(player);
  const technicalProfile = compatibleProfiles[Math.abs(player.id * 3 + player.salary + player.heightCm) % compatibleProfiles.length];
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
  clutch: "pontos decisivos", emotional: "energia emocional", organizer: "organizacao", mentor: "mentoria",
  connector: "conexao", star: "protagonismo", specialist: "especialista", resilient: "resiliencia",
  young: "desenvolvimento", server: "saque", risk: "risco controlado", passer: "passe", defender: "defesa",
  terminal: "bola de definicao", "ball-dominant": "volume ofensivo", blocker: "bloqueio", middle: "meio de rede",
  setter: "levantamento", libero: "cobertura", balanced: "equilibrio", backrow: "fundo de quadra",
  mobile: "deslocamento", "stable-role": "funcao segura", fast: "velocidade"
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
      title: "Lideres ajustam o vestiario",
      text: "As referencias do elenco querem assumir uma conversa sobre comunicacao em quadra.",
      choices: [
        { label: "Abrir a conversa", effect: "Moral +2, recepcao +2", modifiers: [{ key: "morale", amount: 2, duration: 1 }, { key: "reception", amount: 2, duration: 2 }] },
        { label: "Focar so no treino", effect: "Bloqueio +2, moral -1", modifiers: [{ key: "block", amount: 2, duration: 1 }, { key: "morale", amount: -1, duration: 1 }] }
      ]
    });
  }
  if (countRosterTraits("psychology", ["volatile", "emotional"]) >= 2) {
    templates.push({
      title: "Energia emocional alta",
      text: "O grupo esta pilhado. Pode virar pressao de saque ou erro de fundamento.",
      choices: [
        { label: "Acalmar primeira bola", effect: "Recepcao +3, saque -1", modifiers: [{ key: "reception", amount: 3, duration: 1 }, { key: "serve", amount: -1, duration: 1 }] },
        { label: "Canalizar no saque", effect: "Saque +3, recepcao -1", modifiers: [{ key: "serve", amount: 3, duration: 1 }, { key: "reception", amount: -1, duration: 1 }] }
      ]
    });
  }
  if (countRosterTraits("technicalProfile", ["passer", "libero", "defender"]) >= 3) {
    templates.push({
      title: "Linha de passe pede protagonismo",
      text: "Os especialistas de fundo querem sustentar ralis longos e cansar o rival.",
      choices: [
        { label: "Jogar no volume", effect: "Defesa +3, recepcao +2", modifiers: [{ key: "defense", amount: 3, duration: 1 }, { key: "reception", amount: 2, duration: 1 }] },
        { label: "Buscar virada rapida", effect: "Ataque +2, recepcao -1", modifiers: [{ key: "attack", amount: 2, duration: 1 }, { key: "reception", amount: -1, duration: 1 }] }
      ]
    });
  }
  if (countRosterTraits("technicalProfile", ["blocker", "middle"]) >= 2) {
    templates.push({
      title: "Centrais querem fechar a rede",
      text: "O treino indicou bom tempo de bloqueio, mas isso exige mais compromisso de cobertura.",
      choices: [
        { label: "Comprometer o bloqueio", effect: "Bloqueio +4, defesa -1", modifiers: [{ key: "block", amount: 4, duration: 1 }, { key: "defense", amount: -1, duration: 1 }] },
        { label: "Bloquear e cobrir", effect: "Bloqueio +2, defesa +2", modifiers: [{ key: "block", amount: 2, duration: 1 }, { key: "defense", amount: 2, duration: 1 }] }
      ]
    });
  }
  return templates;
}

function buildExpandedVolleyballMarket(divisionKey, config) {
  const intlNames = divisionKey === "masculino"
    ? ["Nikola Kovac", "Mateo Rios", "Tomas Ybarra", "Ethan Brooks", "Luca Marin", "Bruno Escobar"]
    : ["Milena Kovac", "Agustina Rios", "Talia Ybarra", "Hailey Brooks", "Lucia Marin", "Bruna Escobar"];
  const scoutNames = divisionKey === "masculino"
    ? ["Cael Nogueira", "Breno Furtado", "Davi Seixas", "Ravi Paes", "Theo Nascimento", "Luan Veloso"]
    : ["Maitê Nogueira", "Brena Furtado", "Dafne Seixas", "Rafa Paes", "Teodora Nascimento", "Lua Veloso"];
  const intlOrigins = ["Servia", "Argentina", "Chile", "Estados Unidos", "Italia", "Uruguai"];
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
    salary: clamp(roundStat(base.salary + salaryShift), 4, 24),
    development: Number((base.development + devShift).toFixed(2)),
    serve: clamp(roundStat(base.serve + (statShift.serve || 0)), 40, 97),
    attack: clamp(roundStat(base.attack + (statShift.attack || 0)), 40, 97),
    block: clamp(roundStat(base.block + (statShift.block || 0)), 35, 97),
    reception: clamp(roundStat(base.reception + (statShift.reception || 0)), 35, 97),
    setting: clamp(roundStat(base.setting + (statShift.setting || 0)), 40, 97),
    defense: clamp(roundStat(base.defense + (statShift.defense || 0)), 40, 97),
    physical: clamp(roundStat(base.physical + (statShift.physical || 0)), 45, 97),
    tactical: clamp(roundStat(base.tactical + (statShift.tactical || 0)), 45, 97),
    heightCm: clamp(roundStat(base.heightCm + (statShift.heightCm || 0)), config.heightRange.min, config.heightRange.max),
    tag: `${pool === "intl" ? "Gringo" : "Scout"} | ${base.tag}`
  });

  const internationals = intlNames.map((name, index) => {
    const base = proBases[index % proBases.length];
    return makeClone(base, base.id + 500 + index, name, "intl", intlOrigins[index % intlOrigins.length], 2 + (index % 2), 0.01, {
      serve: index % 2 === 0 ? 2 : 0,
      attack: 2,
      block: index % 3 === 0 ? 2 : 0,
      reception: index % 2 === 1 ? 2 : 0,
      setting: 1,
      defense: 1,
      physical: 2,
      tactical: 1,
      heightCm: (index % 3) - 1
    });
  });

  const scoutFinds = scoutNames.map((name, index) => {
    const base = baseBases[index % baseBases.length];
    return makeClone(base, base.id + 800 + index, name, "scout", index % 2 === 0 ? "Brasil" : "Argentina", 2 + Math.floor(index / 2), 0.07, {
      serve: 1,
      attack: 2 + (index % 2),
      block: index % 3 === 0 ? 2 : 0,
      reception: index % 2 === 0 ? 2 : 0,
      setting: 1,
      defense: 2,
      physical: 1,
      tactical: 2,
      heightCm: index % 2 === 0 ? 2 : -1
    }, index % 2 === 0 ? "regional" : "internacional");
  });

  const firstNames = divisionKey === "masculino"
    ? ["Andre", "Breno", "Caue", "Dante", "Enzo", "Fabio", "Gael", "Hugo", "Igor", "Jorge", "Kaique", "Luan", "Murilo", "Natan", "Otavio", "Pietro", "Ravi", "Saulo", "Tales", "Vini", "Wagner", "Yuri"]
    : ["Aline", "Bruna", "Clara", "Diana", "Ester", "Fabia", "Gabi", "Helena", "Iara", "Jade", "Karen", "Laura", "Malu", "Nina", "Olga", "Pietra", "Rafa", "Sofia", "Taina", "Vivi", "Yasmin", "Zara"];
  const lastNames = ["Almada", "Barros", "Campos", "Duarte", "Esteves", "Farias", "Gouveia", "Lacerda", "Macedo", "Novaes", "Pereira", "Queiroz", "Ribeiro", "Silveira", "Teixeira", "Valente"];
  const origins = ["Brasil", "Brasil", "Brasil", "Argentina", "Chile", "Colombia", "Estados Unidos", "Italia", "Servia", "Polonia"];
  const archetypes = [
    { serve: 4, attack: 1, block: -1, reception: -1, setting: 0, defense: 0, physical: 1, tactical: 1, heightCm: 0, tag: "Saque pesado" },
    { serve: -1, attack: 4, block: 1, reception: -2, setting: 0, defense: -1, physical: 3, tactical: 0, heightCm: 2, tag: "Ataque terminal" },
    { serve: 0, attack: -1, block: 4, reception: -2, setting: 0, defense: 1, physical: 2, tactical: 2, heightCm: 4, tag: "Parede de bloqueio" },
    { serve: 0, attack: 0, block: -2, reception: 4, setting: 1, defense: 4, physical: -1, tactical: 2, heightCm: -4, tag: "Passe e defesa" },
    { serve: 1, attack: -1, block: -1, reception: 1, setting: 5, defense: 1, physical: -1, tactical: 4, heightCm: -2, tag: "Distribuicao criativa" },
    { serve: 2, attack: 2, block: 1, reception: 1, setting: 0, defense: 2, physical: 1, tactical: 1, heightCm: 1, tag: "Ponteiro completo" }
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
      pool === "base" ? -3 + (index % 2) : pool === "intl" ? 2 + (index % 3) : pool === "scout" ? -2 + (index % 3) : -1 + (index % 4),
      pool === "base" ? 0.1 : pool === "scout" ? 0.08 : index % 4 === 0 ? 0.03 : 0,
      {
        serve: archetype.serve + tierShift + ((index % 5) - 2),
        attack: archetype.attack + tierShift + ((index % 4) - 1),
        block: archetype.block + tierShift + ((index % 5) - 2),
        reception: archetype.reception + tierShift + ((index % 4) - 1),
        setting: archetype.setting + tierShift + ((index % 3) - 1),
        defense: archetype.defense + tierShift + ((index % 4) - 1),
        physical: archetype.physical + tierShift + ((index % 3) - 1),
        tactical: archetype.tactical + tierShift + ((index % 5) - 2),
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
  config.market = buildExpandedVolleyballMarket(divisionKey, config);
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
  trainingFocus: "serve",
  scouting: createScoutingState(),
  settings: normalizeSettings(),
  season: null,
  customConfig: applyCustomConfig(loadCustomConfig()),
  activeTab: document.body.dataset.activeTab || "front-office"
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
const playerStatsPanelEl = document.querySelector("#player-stats-panel");
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
  return getSelectedPlayers().reduce((total, player) => total + player.salary, 0) + state.scouting.spent;
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
    serve: clampTrainingProgressValue(player, "serve", progress.serve || 0),
    attack: clampTrainingProgressValue(player, "attack", progress.attack || 0),
    block: clampTrainingProgressValue(player, "block", progress.block || 0),
    reception: clampTrainingProgressValue(player, "reception", progress.reception || 0),
    setting: clampTrainingProgressValue(player, "setting", progress.setting || 0),
    defense: clampTrainingProgressValue(player, "defense", progress.defense || 0),
    physical: clampTrainingProgressValue(player, "physical", progress.physical || 0),
    tactical: clampTrainingProgressValue(player, "tactical", progress.tactical || 0)
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
  const favoriteTax = Math.max(0, ratingGap - 1.2);
  if (!games.length) {
    return {
      teamDrag: clamp(favoriteTax * 0.0019, 0, 0.012),
      opponentBoost: clamp(favoriteTax * 0.0015, 0, 0.01),
      chaos: 0.008
    };
  }

  const wins = games.filter((game) => game.result === "V").length;
  const winRate = wins / games.length;
  const streak = getRecentWinStreak(games);
  const dominance = Math.max(0, winRate - 0.58);
  const hotStreak = Math.max(0, streak - 2);
  const lateSeason = Math.min(1, games.length / 18);

  return {
    teamDrag: clamp(dominance * 0.04 + hotStreak * 0.006 + lateSeason * hotStreak * 0.0025 + favoriteTax * 0.002, 0, 0.045),
    opponentBoost: clamp(dominance * 0.032 + hotStreak * 0.0048 + favoriteTax * 0.0016, 0, 0.036),
    chaos: clamp(0.008 + hotStreak * 0.002 + dominance * 0.008 + favoriteTax * 0.0004, 0.008, 0.024)
  };
}

function getUsagePlan(players, tactics) {
  const weighted = players.map((player) => {
    const usage = getPlayerUsageMultiplier(player);
    const terminalBoost = player.pos === "OPO" ? 1.12 : player.pos === "PON" ? 1.05 : player.pos === "CEN" ? 0.96 : player.pos === "LIB" ? 0.25 : 0.9;
    const tacticBoost = (
      (tactics.pace === "aggressive" ? usage * 0.06 : 0) +
      (tactics.shot === "risk" ? usage * 0.08 : 0) +
      (tactics.rotation === "short" ? usage * 0.06 : 0) -
      (tactics.pace === "control" ? Math.max(0, usage - 1) * 0.06 : 0) -
      (tactics.shot === "safe" ? Math.max(0, usage - 1) * 0.05 : 0)
    );
    const weight = Math.max(
      0.03,
      (usage + tacticBoost) *
      terminalBoost *
      (0.45 + player.attack / 100) *
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
  const concentration = clamp((topShare - 0.18) * 40, -3, 5);
  const spacing = clamp((0.11 - spread) * 30, -3, 4);
  const attackBonus =
    (tactics.pace === "aggressive" ? concentration * 0.9 : 0) +
    (tactics.shot === "risk" ? concentration * 0.8 : 0) +
    (tactics.rotation === "short" ? concentration * 0.7 : 0) +
    (tactics.pace === "control" ? spacing * 0.8 : 0) +
    (tactics.shot === "safe" ? spacing * 0.6 : 0);
  const settingBonus = attackBonus * 0.5 + (tactics.rebound === "read" ? spacing * 0.5 : 0);
  const tacticalBonus = attackBonus * 0.45 + spacing * 0.55;
  const execution = attackBonus + tacticalBonus * 0.8;
  return {
    players: playersWithShare,
    attackBonus,
    settingBonus,
    tacticalBonus,
    execution
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

function buildVolleyballScorers(teamProfile, matchBox) {
  const scoringPool = teamProfile.rotation
    .slice(0, 6)
    .filter((player) => player.pos !== "LIB");
  const usagePlan = getUsagePlan(scoringPool, state.tactics);
  const weightedEntries = usagePlan.players.map((entry) => ({
    name: entry.player.name,
    pos: entry.player.pos,
    share: entry.share * (0.72 + entry.player.attack / 150 + entry.player.block / 260 + entry.player.serve / 300)
  }));
  const shareTotal = weightedEntries.reduce((sum, entry) => sum + entry.share, 0) || 1;
  const normalizedEntries = weightedEntries.map((entry) => ({ ...entry, share: entry.share / shareTotal }));
  return distributeIntegerByWeight(Math.max(matchBox.teamPoints - 2, 0), normalizedEntries)
    .sort((a, b) => b.total - a.total);
}

function getScorersSummary(scorers, noun) {
  return scorers.slice(0, 3).map((entry) => `${entry.name} ${entry.total} ${noun}`).join(" | ");
}

function getVolleyballStatsSchema() {
  return window.TemporadaTotal?.VolleyballMatchAdapter?.getMatchStatsSchema?.() || [
    { key: "points", label: "PTS" },
    { key: "aces", label: "ACE" },
    { key: "serveErrors", label: "ES" },
    { key: "attacks", label: "ATQ" },
    { key: "attackPoints", label: "PA" },
    { key: "attackErrors", label: "EA" },
    { key: "counterattacks", label: "C-ATQ" },
    { key: "aces", label: "ACE" },
    { key: "serveErrors", label: "ES" },
    { key: "receptions", label: "REC" },
    { key: "receptionErrors", label: "ER" },
    { key: "positiveReceptions", label: "R+" },
    { key: "blocks", label: "BLK" },
    { key: "digs", label: "DEF" },
    { key: "setAssists", label: "LEV" },
    { key: "errors", label: "ERR" },
    { key: "efficiency", label: "EFF" },
    { key: "rating", label: "RTG" }
  ];
}

function getPlayerPositionLabel(playerId, fallback = "") {
  const player = getPlayerById(Number(playerId));
  return player?.pos || fallback || "";
}

function normalizePlayerStatRow(rawStats = {}) {
  const schema = getVolleyballStatsSchema();
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

function distributeStatByShare(total, entries) {
  return distributeIntegerByWeight(total, entries.map((entry) => ({
    ...entry,
    share: Math.max(0.01, entry.share)
  })));
}

// Creates a box score for the user's roster from the existing instant match result.
function createVolleyballMatchPlayerStats(teamProfile, matchBox, scorers) {
  const schema = getVolleyballStatsSchema();
  const rows = teamProfile.rotation.map((player) => ({
    playerId: String(player.id),
    playerName: player.name,
    position: player.pos,
    games: 1,
    ...Object.fromEntries(schema.map((stat) => [stat.key, 0]))
  }));
  const byId = Object.fromEntries(rows.map((row) => [row.playerId, row]));
  const byName = Object.fromEntries(teamProfile.rotation.map((player) => [player.name, String(player.id)]));

  scorers.forEach((scorer) => {
    const row = byId[byName[scorer.name]];
    if (row) row.points = scorer.total;
  });

  const active = teamProfile.rotation.slice(0, 7);
  distributeStatByShare(matchBox.aces || 0, active.map((player) => ({ player, share: player.serve / 100 }))).forEach((entry) => {
    byId[String(entry.player.id)].aces += entry.total;
  });
  distributeStatByShare(matchBox.blocks || 0, active.filter((player) => player.pos !== "LIB").map((player) => ({ player, share: player.block / 100 }))).forEach((entry) => {
    byId[String(entry.player.id)].blocks += entry.total;
  });

  const errorTotal = matchBox.errors || 0;
  distributeStatByShare(Math.round(errorTotal * 0.28), active.map((player) => ({ player, share: Math.max(0.2, 1.2 - player.serve / 100) }))).forEach((entry) => {
    byId[String(entry.player.id)].serveErrors += entry.total;
  });
  distributeStatByShare(Math.round(errorTotal * 0.42), active.filter((player) => player.pos !== "LIB").map((player) => ({ player, share: Math.max(0.2, 1.35 - player.attack / 100) }))).forEach((entry) => {
    byId[String(entry.player.id)].attackErrors += entry.total;
  });
  distributeStatByShare(Math.round(errorTotal * 0.3), active.map((player) => ({ player, share: player.pos === "LIB" || player.pos === "PON" ? 1.2 : 0.35 }))).forEach((entry) => {
    byId[String(entry.player.id)].receptionErrors += entry.total;
  });

  rows.forEach((row) => {
    row.attackPoints = Math.max(0, row.points - row.aces - row.blocks);
    row.attacks = row.attackPoints + row.attackErrors + Math.round(row.attackPoints * 1.35);
  });

  distributeStatByShare(Math.round(matchBox.teamPoints * 1.15), active.map((player) => ({ player, share: player.pos === "LIB" || player.pos === "PON" ? player.reception / 80 : 0.35 }))).forEach((entry) => {
    byId[String(entry.player.id)].receptions += entry.total;
  });
  distributeStatByShare(Math.round(matchBox.teamPoints * 0.82), active.map((player) => ({ player, share: player.defense / 100 + (player.pos === "LIB" ? 0.65 : 0) }))).forEach((entry) => {
    byId[String(entry.player.id)].digs += entry.total;
  });
  distributeStatByShare(Math.round(matchBox.teamPoints * 0.18), active.filter((player) => player.pos !== "LIB").map((player) => ({ player, share: player.attack / 100 + player.defense / 220 }))).forEach((entry) => {
    byId[String(entry.player.id)].counterattacks += entry.total;
  });

  rows.forEach((row) => {
    row.efficiency = window.TemporadaTotal?.VolleyballMatchAdapter?.calculatePlayerEfficiency?.(row) ?? Math.round(row.points + row.blocks + row.counterattacks - row.attackErrors - row.receptionErrors);
  });
  return rows;
}

function ensureSeasonPlayerStats() {
  if (!state.season) return {};
  state.season.playerStats = state.season.playerStats || {};
  return state.season.playerStats;
}

// Accumulates one match box score into the season totals while preserving old saves.
function accumulateSeasonPlayerStats(matchStatsRows) {
  if (!state.season) return;
  const schema = getVolleyballStatsSchema();
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
    ...Object.fromEntries(getVolleyballStatsSchema().map((stat) => [stat.key, row[stat.key] / games]))
  };
}

function getPlayerStatsRankings(rows) {
  const sortedBy = (key) => rows.slice().sort((a, b) => (Number(b[key]) || 0) - (Number(a[key]) || 0));
  return {
    scorers: sortedBy("points"),
    passers: sortedBy("receptions"),
    defenders: sortedBy("digs"),
    counterattacks: sortedBy("counterattacks"),
    blockers: sortedBy("blocks"),
    attackers: sortedBy("attackPoints"),
    efficiency: sortedBy("efficiency")
  };
}

function getTeamStatLeaders(rows) {
  const rankings = getPlayerStatsRankings(rows);
  return [
    { key: "receptions", label: "Passe", player: rankings.passers[0], suffix: "rec" },
    { key: "digs", label: "Defesa", player: rankings.defenders[0], suffix: "def" },
    { key: "counterattacks", label: "Contra-ataque", player: rankings.counterattacks[0], suffix: "c-atq" },
    { key: "blocks", label: "Bloqueio", player: rankings.blockers[0], suffix: "blks" },
    { key: "attackPoints", label: "Ataque", player: rankings.attackers[0], suffix: "pts" }
  ];
}

function formatStatValue(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
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
  const closeMatch = Math.abs(game.teamSets - game.opponentSets) <= 1;
  const heavyLoss = game.result === "D" && game.teamSets <= 1;
  const cleanWin = game.result === "V" && game.opponentSets <= 1;
  const fatigueHit = teamProfile.fatigueLoad >= 2.2 ? 1 : 0;
  const randomShock = Math.random() < 0.22 ? (Math.random() < 0.5 ? -1 : 1) : 0;

  adjustManagement({
    chemistry: pull(management.chemistry) + (heavyLoss ? -1 : 0) + (closeMatch && game.result === "V" ? 1 : 0),
    confidence: pull(management.confidence) + (game.result === "V" ? (cleanWin ? 1 : 0) : -1) + randomShock,
    focus: pull(management.focus) + (game.result === "D" ? 1 : 0) + (cleanWin ? -1 : 0),
    intensity: pull(management.intensity, 68) + (game.result === "D" ? 1 : 0) - fatigueHit
  }, "Flutuacao pos-jogo");
}

function getManagementImpact(management = getManagementState()) {
  const chemistryEdge = management.chemistry - MANAGEMENT_BASELINE;
  const confidenceEdge = management.confidence - MANAGEMENT_BASELINE;
  const focusEdge = management.focus - MANAGEMENT_BASELINE;
  const intensityEdge = management.intensity - MANAGEMENT_BASELINE;

  return {
    serve: roundStat(intensityEdge * 0.12),
    attack: roundStat(confidenceEdge * 0.13 + intensityEdge * 0.05),
    block: roundStat(focusEdge * 0.08 + intensityEdge * 0.09),
    reception: roundStat(chemistryEdge * 0.1 + focusEdge * 0.07),
    setting: roundStat(chemistryEdge * 0.12 + confidenceEdge * 0.05),
    defense: roundStat(focusEdge * 0.11 + chemistryEdge * 0.05),
    physical: roundStat(intensityEdge * 0.09),
    tactical: roundStat(chemistryEdge * 0.09 + focusEdge * 0.1),
    morale: roundStat(confidenceEdge * 0.2 + chemistryEdge * 0.08),
    fatigue: Math.max(0, intensityEdge * 0.08 - chemistryEdge * 0.02)
  };
}

function getTrainingSpecificActionPackage() {
  const plan = trainingPlans[state.trainingFocus];
  const packageByFocus = {
    serve: [{ key: "serve", amount: 3, duration: 2 }, { key: "attack", amount: 1, duration: 1 }],
    block: [{ key: "block", amount: 3, duration: 2 }, { key: "physical", amount: 1, duration: 1 }],
    reception: [{ key: "reception", amount: 3, duration: 2 }, { key: "defense", amount: 2, duration: 1 }],
    setting: [{ key: "setting", amount: 3, duration: 2 }, { key: "tactical", amount: 1, duration: 2 }],
    strength: [{ key: "physical", amount: 3, duration: 2 }, { key: "attack", amount: 1, duration: 1 }]
  };
  return {
    effect: `${plan.label}: impulso tecnico por 2 jogos, com leve carga fisica`,
    modifiers: packageByFocus[state.trainingFocus] || [],
    description: `Foco extra em ${plan.label.toLowerCase()} para empurrar o fundamento da semana.`
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
  const keys = ["serve", "attack", "block", "reception", "setting", "defense", "physical", "tactical", "sideout", "transition", "pressure"];
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
    return { chemistry: 0, focus: 0, sideout: 0, transition: 0, pressure: 0, defense: 0, volatility: 0, fatigue: 0, label: "Neutra" };
  }

  let score = 0;
  const psych = (trait) => countTraits(players, "psychology", trait);
  const tech = (trait) => countTraits(players, "technicalProfile", trait);
  const leader = psych("leader");
  const stable = psych("stable");
  const volatile = psych("volatile");
  const intense = psych("intense");
  const connector = psych("connector") + tech("connector");
  const setter = tech("setter");
  const passer = tech("passer");
  const terminal = tech("terminal");
  const ballDominant = tech("ball-dominant");
  const defender = tech("defender");
  const blocker = tech("blocker");
  const server = tech("server");
  const risk = tech("risk");
  const middle = tech("middle");
  const libero = tech("libero");
  const star = psych("star");
  const clutch = psych("clutch");

  score += Math.min(2, leader) * 0.8;
  score += Math.min(3, stable) * 0.35;
  score += Math.min(3, connector) * 0.45;
  score += Math.min(setter, passer + terminal + middle) * 0.65;
  score += Math.min(passer, libero + defender + 1) * 0.45;
  score += Math.min(blocker, middle + setter + 1) * 0.3;
  score += Math.min(server, passer + stable + 1) * 0.22;
  score += Math.min(clutch, leader + stable + 1) * 0.25;
  score -= Math.max(0, volatile - leader - stable) * 0.75;
  score -= Math.max(0, ballDominant - setter - connector) * 0.65;
  score -= Math.max(0, risk - stable - leader - 1) * 0.35;
  score -= Math.max(0, star - connector - leader) * 0.5;
  score -= Math.max(0, intense - stable - leader - 1) * 0.35;

  const normalized = clamp(score, -4, 4);
  return {
    chemistry: normalized * 0.45,
    focus: normalized * 0.3,
    sideout: clamp((setter + passer + terminal - ballDominant * 0.4) * 0.25, -1.5, 1.5),
    transition: clamp((defender + libero + connector) * 0.22, -1.2, 1.5),
    pressure: clamp((server + blocker - risk * 0.25) * 0.22, -1.2, 1.5),
    defense: clamp((defender + blocker + libero - volatile * 0.35) * 0.24, -1.5, 1.5),
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

function getPlayerStatus(playerId) {
  const issue = state.season?.injuries[playerId];
  if (!issue) {
    return { status: "healthy", note: "Disponivel", weight: 1 };
  }
  if (state.season.roundNumber < issue.returnRound) {
    return { status: "out", note: `${issue.label} ate a rodada ${issue.returnRound}`, weight: 0.1 };
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
      serve: roundStat(player.serve + (progress.serve || 0)),
      attack: roundStat(player.attack + (progress.attack || 0)),
      block: roundStat(player.block + (progress.block || 0)),
      reception: roundStat(player.reception + (progress.reception || 0)),
      setting: roundStat(player.setting + (progress.setting || 0)),
      defense: roundStat(player.defense + (progress.defense || 0)),
      physical: roundStat(player.physical + (progress.physical || 0)),
      tactical: roundStat(player.tactical + (progress.tactical || 0)),
      healthStatus: health.status,
      healthNote: health.note,
      availabilityWeight: health.weight
    };
  });
}

function getRotation(players, rotationStyle) {
  const sorted = players
    .slice()
    .sort((a, b) => {
      const scoreA = a.attack + a.block + a.reception + a.setting + a.defense + a.tactical + getHeightScore(a.heightCm) * 0.35;
      const scoreB = b.attack + b.block + b.reception + b.setting + b.defense + b.tactical + getHeightScore(b.heightCm) * 0.35;
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
    serve: 0,
    attack: 0,
    block: 0,
    reception: 0,
    setting: 0,
    defense: 0,
    physical: 0,
    tactical: 0,
    fatigue: 0
  };

  if (tactics.pace === "aggressive") {
    modifier.attack += 3;
    modifier.setting += 1;
    modifier.physical -= 1;
    modifier.fatigue += 1.3;
  } else if (tactics.pace === "control") {
    modifier.reception += 2;
    modifier.defense += 2;
    modifier.attack -= 1;
  }

  if (tactics.shot === "risk") {
    modifier.serve += 4;
    modifier.reception -= 1;
    modifier.fatigue += 0.5;
  } else if (tactics.shot === "safe") {
    modifier.serve -= 1;
    modifier.reception += 2;
  }

  if (tactics.rebound === "commit") {
    modifier.block += 4;
    modifier.defense -= 1;
  } else if (tactics.rebound === "read") {
    modifier.block += 1;
    modifier.tactical += 2;
  }

  if (tactics.defense === "deep") {
    modifier.defense += 3;
    modifier.reception += 1;
  } else if (tactics.defense === "line") {
    modifier.block += 1;
    modifier.defense += 1;
  }

  if (tactics.rotation === "short") {
    modifier.attack += 2;
    modifier.block += 1;
    modifier.fatigue += 1.2;
  } else if (tactics.rotation === "deep") {
    modifier.physical += 2;
    modifier.setting -= 1;
  }

  return modifier;
}

function calculateTeamProfile(rotationStyle, activeModifiers, tactics) {
  const adjustedPlayers = getAdjustedPlayers();
  const rotation = getRotation(adjustedPlayers, rotationStyle);
  const onCourt = rotation.slice(0, 6);
  const bench = rotation.slice(6);
  const weights = onCourt.map((player) => player.rotationWeight);
  const benchDepth = bench.length ? bench.reduce((sum, player) => sum + (player.attack + player.block + player.defense + player.reception) / 4, 0) / bench.length : 72;
  const seasonBonus = sumSeasonModifiers(activeModifiers);
  const tacticBonus = getTacticModifiers(tactics);
  const managementBonus = getManagementImpact();
  const staffBonus = getStaffEffects();
  const psychologyBonus = getPsychologyEdge(onCourt);
  const technicalBonus = getTechnicalEdge(onCourt);
  const synergy = getRosterSynergy(rotation);
  const usagePlan = getUsagePlan(onCourt, tactics);
  const morale = clamp((state.season?.morale || 74) + (seasonBonus.morale || 0) + managementBonus.morale + psychologyBonus.confidence * 0.8 + psychologyBonus.chemistry * 0.5 + synergy.chemistry + staffBonus.morale, 45, 96);
  const heightCm = weightedAverage(onCourt, "heightCm", weights);
  const heightScore = getHeightScore(heightCm);

  const serve = roundStat(weightedAverage(onCourt, "serve", weights) + (seasonBonus.serve || 0) + tacticBonus.serve + managementBonus.serve + psychologyBonus.confidence * 0.3 + technicalBonus.serve);
  const attack = roundStat(weightedAverage(onCourt, "attack", weights) + (seasonBonus.attack || 0) + tacticBonus.attack + managementBonus.attack + psychologyBonus.confidence * 0.35 + technicalBonus.attack + usagePlan.attackBonus);
  const block = roundStat(weightedAverage(onCourt, "block", weights) + (seasonBonus.block || 0) + tacticBonus.block + managementBonus.block + psychologyBonus.focus * 0.3 + technicalBonus.block);
  const reception = roundStat(weightedAverage(onCourt, "reception", weights) + (seasonBonus.reception || 0) + tacticBonus.reception + managementBonus.reception + psychologyBonus.chemistry * 0.4 + technicalBonus.reception);
  const setting = roundStat(weightedAverage(onCourt, "setting", weights) + (seasonBonus.setting || 0) + tacticBonus.setting + managementBonus.setting + psychologyBonus.chemistry * 0.35 + technicalBonus.setting + usagePlan.settingBonus);
  const defense = roundStat(weightedAverage(onCourt, "defense", weights) + (seasonBonus.defense || 0) + tacticBonus.defense + managementBonus.defense + psychologyBonus.focus * 0.35 + technicalBonus.defense + synergy.defense + staffBonus.defense);
  const physical = roundStat(weightedAverage(onCourt, "physical", weights) + (seasonBonus.physical || 0) + tacticBonus.physical + managementBonus.physical + psychologyBonus.recovery * 0.6 + technicalBonus.physical + staffBonus.physical);
  const tactical = roundStat(weightedAverage(onCourt, "tactical", weights) + (seasonBonus.tactical || 0) + tacticBonus.tactical + managementBonus.tactical + psychologyBonus.focus * 0.45 + technicalBonus.tactical + synergy.focus + staffBonus.tactical + usagePlan.tacticalBonus);

  return {
    rotation,
    heightCm: roundStat(heightCm),
    heightScore: roundStat(heightScore),
    serve,
    attack,
    block,
    reception,
    setting,
    defense,
    physical,
    tactical,
    morale,
    sideout: roundStat(attack * 0.34 + reception * 0.23 + setting * 0.22 + tactical * 0.12 + physical * 0.09 + technicalBonus.sideout + synergy.sideout),
    transition: roundStat(defense * 0.28 + setting * 0.16 + attack * 0.22 + tactical * 0.18 + benchDepth * 0.16 + technicalBonus.transition + synergy.transition),
    pressure: roundStat(serve * 0.38 + block * 0.22 + physical * 0.12 + tactical * 0.12 + morale * 0.16 + technicalBonus.pressure + synergy.pressure),
    clutch: roundStat(morale * 0.34 + tactical * 0.26 + setting * 0.14 + defense * 0.12 + attack * 0.14),
    fatigueLoad: Math.max(0, tacticBonus.fatigue + managementBonus.fatigue + synergy.fatigue + Math.max(0, 79 - physical) * 0.08 + Math.max(0, 78 - benchDepth) * 0.05 + Math.max(0, psychologyBonus.volatility + synergy.volatility) * 0.12 - Math.max(0, psychologyBonus.recovery) * 0.08 - staffBonus.fatigueRelief),
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
    sideout: roundStat(team.attack * 0.34 + team.reception * 0.23 + team.setting * 0.22 + team.tactical * 0.12 + team.physical * 0.09),
    transition: roundStat(team.defense * 0.28 + team.setting * 0.16 + team.attack * 0.22 + team.tactical * 0.18 + 11.5),
    pressure: roundStat(team.serve * 0.38 + team.block * 0.22 + team.physical * 0.12 + team.tactical * 0.12 + 11.5),
    clutch: roundStat(75 * 0.34 + team.tactical * 0.26 + team.setting * 0.14 + team.defense * 0.12 + team.attack * 0.14),
    fatigueLoad: 0
  };
}

function getTeamRating(teamProfile) {
  return teamProfile.sideout * 0.34 + teamProfile.transition * 0.18 + teamProfile.pressure * 0.2 + teamProfile.clutch * 0.12 + teamProfile.heightScore * 0.16;
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

  const secondHalf = rounds.map((round, index) => ({
    roundNumber: rounds.length + index + 1,
    matches: round.matches.map((match) => ({ homeId: match.awayId, awayId: match.homeId }))
  }));

  return [...rounds, ...secondHalf];
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
      leaguePoints: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      rallyPointsWon: 0,
      rallyPointsLost: 0,
      streak: "-",
      form: []
    }))
  };
}

function createSeason() {
  const playerProgress = {};
  getSelectedPlayers().forEach((player) => {
    playerProgress[player.id] = {
      serve: 0,
      attack: 0,
      block: 0,
      reception: 0,
      setting: 0,
      defense: 0,
      physical: 0,
      tactical: 0
    };
  });

  const schedule = createRoundRobin([USER_TEAM_ID, ...getOpponents().map((team) => team.id)]);

  return {
    schemaVersion: 3,
    started: true,
    phase: "regular",
    roundNumber: 0,
    schedule,
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

function getLeaguePointsForMatch(teamSets, opponentSets) {
  if (teamSets > opponentSets) {
    return teamSets === 3 && opponentSets === 2 ? 2 : 3;
  }
  return teamSets === 2 && opponentSets === 3 ? 1 : 0;
}

function recordLeagueMatch(teamRow, opponentRow, match) {
  const teamWon = match.teamSets > match.opponentSets;
  const teamPoints = getLeaguePointsForMatch(match.teamSets, match.opponentSets);
  const opponentPoints = getLeaguePointsForMatch(match.opponentSets, match.teamSets);

  if (teamWon) {
    teamRow.wins += 1;
    opponentRow.losses += 1;
  } else {
    teamRow.losses += 1;
    opponentRow.wins += 1;
  }

  teamRow.leaguePoints += teamPoints;
  opponentRow.leaguePoints += opponentPoints;
  teamRow.setsWon += match.teamSets;
  teamRow.setsLost += match.opponentSets;
  opponentRow.setsWon += match.opponentSets;
  opponentRow.setsLost += match.teamSets;
  teamRow.rallyPointsWon += match.teamPoints;
  teamRow.rallyPointsLost += match.opponentPoints;
  opponentRow.rallyPointsWon += match.opponentPoints;
  opponentRow.rallyPointsLost += match.teamPoints;
  pushTeamForm(teamRow, teamWon);
  pushTeamForm(opponentRow, !teamWon);
}

function getSortedLeagueTeams() {
  if (!state.season?.leagueTable) {
    return [];
  }

  return state.season.leagueTable.teams.slice().sort((a, b) => (
    b.leaguePoints - a.leaguePoints ||
    b.wins - a.wins ||
    (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) ||
    (b.rallyPointsWon - b.rallyPointsLost) - (a.rallyPointsWon - a.rallyPointsLost)
  ));
}

function simulateSet(team, opponent, context, setIndex) {
  const target = setIndex === 4 ? 15 : 25;
  let teamPoints = 0;
  let opponentPoints = 0;

  const ratingEdge = (getTeamRating(team) - getTeamRating(opponent)) * 0.0032;
  const sideoutEdge = (team.sideout - opponent.sideout) * 0.002;
  const pressureEdge = (team.pressure - opponent.pressure) * 0.0015;
  const transitionEdge = (team.transition - opponent.transition) * 0.0011;
  const heightEdge = (team.heightScore - opponent.heightScore) * 0.0007;
  const moraleEdge = (team.morale - opponent.morale) * 0.001;
  const planEdge = ((team.planExecution || 0) - (opponent.planExecution || 0)) * 0.0011;

  const baseProb = clamp(
    0.5 +
    ratingEdge +
    sideoutEdge +
    pressureEdge +
    transitionEdge +
    heightEdge +
    moraleEdge +
    planEdge +
    context.homeEdge +
    context.momentum +
    (context.easeEdge || 0) +
    randomBetween(-0.012, 0.012),
    0.41,
    0.59
  );

  while (true) {
    const clutchEdge = (team.clutch - opponent.clutch) * (teamPoints >= target - 5 || opponentPoints >= target - 5 ? 0.0013 : 0.00045);
    const scoreboardEdge = clamp((teamPoints - opponentPoints) * 0.0012, -0.012, 0.012);
    const fatigueEdge = clamp((opponent.fatigueLoad - team.fatigueLoad) * 0.01, -0.015, 0.015);
    const rallyProb = clamp(baseProb + clutchEdge + scoreboardEdge + fatigueEdge + randomBetween(-0.016, 0.016), 0.36, 0.64);
    if (Math.random() < rallyProb) {
      teamPoints += 1;
    } else {
      opponentPoints += 1;
    }

    if ((teamPoints >= target || opponentPoints >= target) && Math.abs(teamPoints - opponentPoints) >= 2) {
      break;
    }
  }

  return { teamPoints, opponentPoints };
}

function simulateVolleyballMatch(teamProfile, opponentProfile, context) {
  const sets = [];
  let teamSets = 0;
  let opponentSets = 0;

  while (teamSets < 3 && opponentSets < 3) {
    const setIndex = sets.length;
    const setResult = simulateSet(teamProfile, opponentProfile, context, setIndex);
    sets.push(setResult);
    if (setResult.teamPoints > setResult.opponentPoints) {
      teamSets += 1;
    } else {
      opponentSets += 1;
    }
  }

  const teamPoints = sets.reduce((sum, set) => sum + set.teamPoints, 0);
  const opponentPoints = sets.reduce((sum, set) => sum + set.opponentPoints, 0);

  return {
    teamSets,
    opponentSets,
    teamPoints,
    opponentPoints,
    sets,
    setSummary: sets.map((set) => `${set.teamPoints}-${set.opponentPoints}`).join(" | "),
    aces: roundStat(clamp((teamProfile.serve - 62) * 0.19 + randomBetween(2, 9), 2, 14)),
    blocks: roundStat(clamp((teamProfile.block - 58) * 0.18 + randomBetween(3, 12), 3, 16)),
    errors: roundStat(clamp(20 - (teamProfile.reception - 70) * 0.12 + teamProfile.fatigueLoad * 1.7 + randomBetween(-2, 3), 10, 28))
  };
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
  if (game.teamSets === 3 && game.opponentSets <= 1) {
    delta += game.result === "V" ? 0 : -1;
  }
  if (game.teamSets === 3 && game.opponentSets === 2) {
    delta += 0;
  }
  if (game.teamSets === 2 && game.opponentSets === 3) {
    delta += 1;
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
  const currentRound = state.season.roundNumber + 1;
  const recentGames = state.season.games.slice(-3);
  const recentLosses = recentGames.filter((game) => game.result === "D").length;
  const recentWins = recentGames.filter((game) => game.result === "V").length;
  const eventChance = clamp(0.26 + recentLosses * 0.08 + recentWins * 0.04, 0.26, 0.58);
  if (!triggerRounds.includes(currentRound) && Math.random() > eventChance) {
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
  const selected = getSelectedPlayers();
  selected.forEach((player) => {
    const growth = player.development || 1;
    const progress = state.season.playerProgress[player.id];
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
  const risk = clamp(0.038 + teamProfile.fatigueLoad * 0.012 + intensityRisk - (teamProfile.physical - 76) * 0.001 - staffBonus.injuryPrevention, 0.01, 0.12);
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
    label: duration === 3 ? "desconforto muscular" : "entorse leve",
    returnRound: state.season.roundNumber + duration
  };
}

function maybeCreatePsychologyEvent(teamProfile, game) {
  if (!state.season) {
    return;
  }
  const psychology = getPsychologyEdge(getAdjustedPlayers());
  const instabilityRisk = Math.max(0, psychology.volatility) * 0.06;
  const leadershipChance = Math.max(0, psychology.chemistry + psychology.confidence) * 0.018;

  if (game.result === "D" && state.season.morale <= 70 && Math.random() < 0.16 + instabilityRisk) {
    adjustMorale(-2, "Ruido interno apos derrota");
    state.season.activeModifiers.push({ key: "reception", amount: -1, remainingGames: 1 });
    addPsychologyLog("Grupo sentiu a derrota", "A oscilacao emocional pesou no sideout da rodada seguinte.", -2);
    return;
  }

  if (game.result === "V" && state.season.morale >= 78 && Math.random() < 0.12 + leadershipChance) {
    adjustMorale(1, "Liderancas sustentaram o embalo");
    state.season.activeModifiers.push({ key: "defense", amount: 1, remainingGames: 1 });
    addPsychologyLog("Confianca em alta", "As liderancas seguraram o volume defensivo para o proximo jogo.", 1);
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
    { label: "Saque adversario encaixou", description: "A liga mirou melhor sua linha de passe e tirou conforto do sideout.", amount: -1, management: { confidence: -1, focus: 1 }, modifiers: [{ key: "reception", amount: -2, duration: 1 }, { key: "setting", amount: -1, duration: 1 }] },
    { label: "Treino de virada funcionou", description: "O time melhorou a primeira bola apos recepcao.", amount: 1, management: { confidence: 1, focus: 1 }, modifiers: [{ key: "attack", amount: 2, duration: 1 }, { key: "setting", amount: 1, duration: 1 }] },
    { label: "Pernas pesadas na rede", description: "A carga diminuiu tempo de bloqueio e alcance no fim dos sets.", amount: -1, management: { intensity: -1, focus: -1 }, modifiers: [{ key: "physical", amount: -2, duration: 1 }, { key: "block", amount: -1, duration: 1 }] },
    { label: "Banco segurou cobertura", description: "A rotacao trouxe volume defensivo e energia.", amount: 1, management: { chemistry: 1, intensity: 1 }, modifiers: [{ key: "defense", amount: 2, duration: 1 }, { key: "physical", amount: 1, duration: 1 }] },
    { label: "Ruido de distribuicao", description: "Atacantes reclamaram de poucas bolas e o ritmo caiu.", amount: -2, management: { chemistry: -2, confidence: -1 }, modifiers: [{ key: "morale", amount: -2, duration: 1 }, { key: "setting", amount: -1, duration: 1 }] },
    { label: "Leitura de bloqueio subiu", description: "Centrais entenderam melhor as rotas do adversario.", amount: 1, management: { focus: 2, chemistry: 1 }, modifiers: [{ key: "block", amount: 2, duration: 1 }, { key: "tactical", amount: 1, duration: 1 }] },
    { label: "Oponente explora largadas", description: "A proxima partida deve cobrar cobertura e comunicacao.", amount: -1, management: { focus: -1, confidence: -1 }, modifiers: [{ key: "defense", amount: -2, duration: 1 }, { key: "reception", amount: -1, duration: 1 }] },
    { label: "Saque entrou quente", description: "A agressividade no servico apareceu bem no treino final.", amount: 1, management: { confidence: 1, intensity: 1 }, modifiers: [{ key: "serve", amount: 2, duration: 1 }, { key: "morale", amount: 1, duration: 1 }] }
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
      const teamSets = userWasHome ? userGame.teamSets : userGame.opponentSets;
      const opponentSets = userWasHome ? userGame.opponentSets : userGame.teamSets;
      const teamPoints = userWasHome ? userGame.teamPoints : userGame.opponentPoints;
      const opponentPoints = userWasHome ? userGame.opponentPoints : userGame.teamPoints;
      recordLeagueMatch(homeRow, awayRow, { teamSets, opponentSets, teamPoints, opponentPoints });
      return;
    }

    const homeProfile = buildOpponentProfile(getOpponents().find((team) => team.id === match.homeId));
    const awayProfile = buildOpponentProfile(getOpponents().find((team) => team.id === match.awayId));
    const simulated = simulateVolleyballMatch(homeProfile, awayProfile, { homeEdge: 0.01, momentum: randomBetween(-0.006, 0.006) });
    recordLeagueMatch(homeRow, awayRow, simulated);
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
  const relegatedTeams = standings.slice(-2).map((team) => team.name);
  state.season.relegatedTeams = relegatedTeams;

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
  const positions = ["LEV", "OPO", "PON", "PON", "CEN", "CEN", "LIB", "PON"];
  return positions.map((pos, index) => ({
    id: `opp-${opponent.id}-${index + 1}`,
    name: `${opponent.name} ${index + 1}`,
    teamId: "away",
    pos,
    usage: pos === "LIB" ? 0.35 : index < 6 ? 1.05 : 0.58
  }));
}

function createLiveTeamPayload(upcoming, teamProfile, opponentProfile) {
  const userRoster = teamProfile.rotation.map((player, index) => ({
    id: String(player.id),
    name: player.name,
    teamId: upcoming.home ? "home" : "away",
    pos: player.pos,
    usage: (player.pos === "LIB" ? 0.35 : getPlayerUsageMultiplier(player)) * (index < 6 ? 1 : 0.55)
  }));
  const opponentRoster = createLiveOpponentRoster(upcoming.opponent).map((player) => ({
    ...player,
    teamId: upcoming.home ? "away" : "home"
  }));

  const userTeam = {
    id: USER_TEAM_ID,
    name: getUserTeamName(),
    roster: userRoster,
    rating: getTeamRating(teamProfile)
  };
  const opponentTeam = {
    id: upcoming.opponent.id,
    name: upcoming.opponent.name,
    roster: opponentRoster,
    rating: getTeamRating(opponentProfile)
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

function createLiveMatchPlayerStatsSnapshot(liveState) {
  return getLiveUserStats(liveState).map((matchStats) => normalizePlayerStatRow({
    ...matchStats,
    playerId: String(matchStats.playerId),
    position: getPlayerPositionLabel(matchStats.playerId, matchStats.position),
    games: 1
  }));
}

function getLiveSetSummary(liveState, userIsHome) {
  const sets = liveState.completedSets || [];
  return sets.map((set) => userIsHome ? `${set.home}-${set.away}` : `${set.away}-${set.home}`).join(" | ");
}

function finishLiveVolleyballMatch(liveState) {
  const upcoming = getUpcomingGameInfo();
  if (!state.season || !upcoming || state.season.liveMatchRecordedKey === liveMatchKey) {
    return;
  }

  const teamProfile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const userIsHome = liveState.homeTeam.id === USER_TEAM_ID;
  const teamSets = userIsHome ? liveState.sets.home : liveState.sets.away;
  const opponentSets = userIsHome ? liveState.sets.away : liveState.sets.home;
  const teamPoints = userIsHome ? liveState.score.home : liveState.score.away;
  const opponentPoints = userIsHome ? liveState.score.away : liveState.score.home;
  const didWin = teamSets > opponentSets;

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

  const matchPlayerStats = createLiveMatchPlayerStatsSnapshot(liveState);
  const rankings = getPlayerStatsRankings(matchPlayerStats);
  const scorers = rankings.scorers.slice(0, 4).map((stats) => ({ name: stats.playerName, total: Math.round(stats.points || 0) }));
  const game = {
    phase: upcoming.phase,
    label: upcoming.phase === "regular" ? `Rodada ${upcoming.roundInfo.roundNumber}` : upcoming.round.name,
    venue: upcoming.home ? "Casa" : "Fora",
    opponent: upcoming.opponent.name,
    style: upcoming.opponent.style,
    result: didWin ? "V" : "D",
    teamSets,
    opponentSets,
    teamPoints,
    opponentPoints,
    setSummary: getLiveSetSummary(liveState, userIsHome),
    aces: matchPlayerStats.reduce((sum, stats) => sum + Math.round(stats.aces || 0), 0),
    blocks: matchPlayerStats.reduce((sum, stats) => sum + Math.round(stats.blocks || 0), 0),
    errors: matchPlayerStats.reduce((sum, stats) => sum + Math.round((stats.serveErrors || 0) + (stats.attackErrors || 0) + (stats.receptionErrors || 0)), 0),
    scorers,
    scorersSummary: getScorersSummary(scorers, "pts"),
    playerStats: matchPlayerStats,
    bestPlayerId: rankings.efficiency[0]?.playerId || null,
    record: getRecordLabel(state.season.wins, state.season.losses),
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

function prepareLiveVolleyballMatch(root) {
  const upcoming = getUpcomingGameInfo();
  const adapter = window.TemporadaTotal?.VolleyballMatchAdapter;
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
      leaderConfig: [
        { label: "Passe", stat: "receptions", suffix: "rec" },
        { label: "Defesa", stat: "digs", suffix: "def" },
        { label: "Contra-ataque", stat: "counterattacks", suffix: "c-atq" },
        { label: "Bloqueio", stat: "blocks", suffix: "blks" },
        { label: "Ataque", stat: "attackPoints", suffix: "pts" }
      ],
      onStart: () => liveMatchController.start(),
      onPause: () => liveMatchController.pause(),
      onSpeed: (speed) => liveMatchController.setSpeed(speed),
      onFinish: () => liveMatchController.finish(),
      canSaveResult: (liveState) => liveState.status === "finished" && state.season?.liveMatchRecordedKey !== liveMatchKey,
      onSaveResult: (liveState) => {
        finishLiveVolleyballMatch(liveState);
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
  prepareLiveVolleyballMatch(liveMatchPageRootEl);
  switchTab("partida");
}

function simulateCurrentGame() {
  const upcoming = getUpcomingGameInfo();
  if (!upcoming) {
    return;
  }

  const recentGames = state.season.games.slice(-4);
  const momentum = recentGames.reduce((sum, game) => sum + (game.result === "V" ? 0.004 : -0.004), 0);
  const teamProfile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const opponentProfile = buildOpponentProfile(upcoming.opponent);
  const balance = getSeasonBalanceContext(teamProfile, opponentProfile);
  const upsetPulse = Math.random() < 0.24 ? randomBetween(0.006, 0.018) : 0;
  const userMatch = simulateVolleyballMatch(teamProfile, opponentProfile, {
    homeEdge: upcoming.home ? 0.012 : -0.008,
    momentum: momentum - balance.teamDrag - upsetPulse * 0.45 + randomBetween(-balance.chaos, balance.chaos),
    easeEdge: getSimulationEaseModifier() - balance.teamDrag * 0.35 - balance.opponentBoost - upsetPulse * 0.35
  });
  const scorers = buildVolleyballScorers(teamProfile, userMatch);
  const matchPlayerStats = createVolleyballMatchPlayerStats(teamProfile, userMatch, scorers);

  const didWin = userMatch.teamSets > userMatch.opponentSets;

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
    teamSets: userMatch.teamSets,
    opponentSets: userMatch.opponentSets,
    teamPoints: userMatch.teamPoints,
    opponentPoints: userMatch.opponentPoints,
    setSummary: userMatch.setSummary,
    aces: userMatch.aces,
    blocks: userMatch.blocks,
    errors: userMatch.errors,
    scorers,
    scorersSummary: getScorersSummary(scorers, "pts"),
    playerStats: matchPlayerStats,
    bestPlayerId: getPlayerStatsRankings(matchPlayerStats).efficiency[0]?.playerId || null,
    record: getRecordLabel(state.season.wins, state.season.losses),
    playoffSeries: upcoming.phase === "playoffs" ? `${getCurrentRound().teamWins}-${getCurrentRound().opponentWins}` : null
  };

  recordGame(game);
  accumulateSeasonPlayerStats(matchPlayerStats);
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
  state.trainingFocus = save.payload.trainingFocus || "serve";
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
    control: "ritmo controlado",
    balanced: "equilibrio",
    aggressive: "acelerar a distribuicao",
    safe: "saque seguro",
    risk: "saque agressivo",
    read: "bloqueio de leitura",
    commit: "bloqueio fechado no central",
    line: "fundo protegendo diagonal",
    deep: "defesa funda",
    short: "rotacao curta",
    normal: "rotacao normal"
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
        <div class="team-formula">ALT ${formatHeightCm(player.heightCm)} | SAQ ${player.serve} | ATA ${player.attack} | BLQ ${player.block} | REC ${player.reception} | DEF ${player.defense}</div>
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
    { key: "pro", title: "Mercado principal", description: "Jogadoras e jogadores prontos para impactar ja.", items: filteredPlayers.filter((player) => player.pool === "pro") },
    { key: "intl", title: "Mercado internacional", description: "Atletas gringos com custo maior e repertorio diferente.", items: filteredPlayers.filter((player) => player.pool === "intl") },
    { key: "base", title: "Projeto de base", description: "Custam menos e crescem mais ao longo da temporada.", items: filteredPlayers.filter((player) => player.pool === "base") },
    { key: "scout", title: "Relatorios revelados", description: "Achados do departamento de scouts para fugir do mercado obvio.", items: filteredPlayers.filter((player) => player.pool === "scout") }
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
          <p>Abra relatorios regionais e internacionais para achar nomes fora do mercado principal. O custo entra no orcamento.</p>
        </div>
        <span class="hint">$${state.scouting.spent}M investidos | ${state.scouting.discoveredIds.length} nomes revelados</span>
      </div>
      <div class="management-actions">
        <button class="choice-button scout-action" data-scout-type="regional" type="button">Scout regional<div class="effect-line">Custa $2M | revela 2 atletas escondidos do mercado local</div></button>
        <button class="choice-button scout-action" data-scout-type="internacional" type="button">Scout internacional<div class="effect-line">Custa $4M | traz 2 nomes com bagagem fora</div></button>
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
                <span class="stat-badge">SAQ ${player.serve}</span>
                <span class="stat-badge">ATA ${player.attack}</span>
                <span class="stat-badge">BLQ ${player.block}</span>
                <span class="stat-badge">REC ${player.reception}</span>
                <span class="stat-badge">LEV ${player.setting}</span>
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
  teamThreePointEl.textContent = profile.serve;
  teamPhysicalEl.textContent = profile.attack;
  teamTacticalEl.textContent = profile.block;
  teamTechniqueEl.textContent = profile.reception;
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
        <strong>${lastGame ? `${lastGame.teamSets}-${lastGame.opponentSets}` : "--"}</strong>
        <div class="player-meta">${lastGame ? `${lastGame.opponent} | ${lastGame.setSummary}` : "Nenhuma partida jogada ainda"}</div>
      </article>
      <article class="summary-box">
        <span class="season-key">Elenco</span>
        <strong>Stats</strong>
        <button class="ghost-button stats-shortcut" data-open-stats type="button">Ver estatísticas</button>
      </article>
      <article class="summary-box">
        <span class="season-key">Transmissao</span>
        <strong>Ao vivo</strong>
        <button class="ghost-button stats-shortcut" data-live-open type="button" ${upcoming && !state.season.pendingDecision ? "" : "disabled"}>Jogar ao vivo</button>
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
  quickHubEl.querySelector("[data-open-stats]")?.addEventListener("click", () => switchTab("estatisticas"));
  quickHubEl.querySelector("[data-live-open]")?.addEventListener("click", openLiveMatchTab);
}

function renderLiveMatchPage() {
  if (!liveMatchPageRootEl) {
    return;
  }

  const hasLiveModules = window.TemporadaTotal?.createLiveSimulation && window.TemporadaTotal?.createLiveMatchUI && window.TemporadaTotal?.VolleyballMatchAdapter;
  if (!hasLiveModules) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Modulo ao vivo indisponivel.</strong>
      <p>Confira se os arquivos shared e match-adapter.js foram carregados antes do script principal.</p>
    `;
    return;
  }

  if (!state.season) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Nenhuma temporada ativa.</strong>
      <p>Monte o elenco, inicie a temporada e volte aqui para abrir a transmissao rally a rally.</p>
    `;
    return;
  }

  const upcoming = getUpcomingGameInfo();
  if (state.season.pendingDecision) {
    liveMatchPageRootEl.className = "live-match-empty";
    liveMatchPageRootEl.innerHTML = `
      <strong>Decisao pendente antes do jogo.</strong>
      <p>Resolva a decisao no hub para liberar a transmissao ao vivo.</p>
      <button class="secondary-button" data-live-back-hub type="button">Ir para base</button>
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
    liveMatchPageRootEl.querySelector("[data-live-prepare]")?.addEventListener("click", () => prepareLiveVolleyballMatch(liveMatchPageRootEl));
    return;
  }

  prepareLiveVolleyballMatch(liveMatchPageRootEl);
}

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

function renderPlayerStatsTable(rows, { mode = "totals", highlightPlayerId = null } = {}) {
  const schema = getVolleyballStatsSchema();
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
            <th>Atleta</th>
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
              <h3>${state.season?.lastGame ? `${state.season.lastGame.teamSets}-${state.season.lastGame.opponentSets} vs ${state.season.lastGame.opponent}` : "Sem partida salva"}</h3>
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

function renderPlayerStatsPanel() {
  if (!playerStatsPanelEl) {
    return;
  }

  if (!state.season) {
    playerStatsPanelEl.className = "season-results empty player-stats-panel-empty";
    playerStatsPanelEl.innerHTML = `
      <strong>Nenhuma temporada ativa.</strong>
      <p>Monte o elenco, inicie a temporada e simule partidas para gerar estatísticas por atleta.</p>
    `;
    return;
  }

  playerStatsPanelEl.className = "season-results player-stats-panel";
  playerStatsPanelEl.innerHTML = renderPlayerStatsDashboard();
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
    setsFor: (state.season.games.reduce((sum, game) => sum + game.teamSets, 0) / gamesPlayed).toFixed(2),
    setsAgainst: (state.season.games.reduce((sum, game) => sum + game.opponentSets, 0) / gamesPlayed).toFixed(2),
    pointsFor: (state.season.games.reduce((sum, game) => sum + game.teamPoints, 0) / gamesPlayed).toFixed(1),
    aces: (state.season.games.reduce((sum, game) => sum + game.aces, 0) / gamesPlayed).toFixed(1)
  };
  const activeEffects = state.season.activeModifiers;
  const injuries = getAdjustedPlayers().filter((player) => player.healthStatus !== "healthy");
  const profile = calculateTeamProfile(state.tactics.rotation, state.season.activeModifiers, state.tactics);
  const playoff = state.season.playoffs;
  const currentRound = getCurrentRound();
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
          <span>Sets por jogo</span>
          <strong>${averages.setsFor}</strong>
          <div class="player-meta">sofre ${averages.setsAgainst}</div>
        </div>
        <div>
          <span>Pontos por jogo</span>
          <strong>${averages.pointsFor}</strong>
          <div class="player-meta">media de aces ${averages.aces}</div>
        </div>
        <div>
          <span>Moral</span>
          <strong>${state.season.morale}</strong>
          <div class="player-meta">${upcoming ? `proximo: ${upcoming.opponent.name}` : "temporada concluida"}</div>
        </div>
        <div>
          <span>Sinergia</span>
          <strong>${profile.synergy.label}</strong>
          <div class="player-meta">combos do elenco afetam sideout, pressao e cobertura</div>
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
          <strong>Altura real e desempenho por fundamento</strong>
        </summary>
        <div class="summary-grid">
          <div>
            <span>Altura media</span>
            <strong>${formatHeightCm(profile.heightCm)}</strong>
            <div class="player-meta">normalizada internamente por categoria</div>
          </div>
          <div>
            <span>Levantamento</span>
            <strong>${profile.setting}</strong>
            <div class="player-meta">sideout ${profile.sideout}</div>
          </div>
          <div>
            <span>Transicao</span>
            <strong>${profile.transition}</strong>
            <div class="player-meta">pressao ${profile.pressure}</div>
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
            <div><span>Entrosamento</span><strong>${management.chemistry}</strong><div class="player-meta">afeta recepcao, distribuicao e leitura coletiva</div></div>
            <div><span>Confianca</span><strong>${management.confidence}</strong><div class="player-meta">pesa no ataque e nos pontos decisivos</div></div>
            <div><span>Foco</span><strong>${management.focus}</strong><div class="player-meta">segura defesa, bloqueio e disciplina tatica</div></div>
            <div><span>Intensidade</span><strong>${management.intensity}</strong><div class="player-meta">sobe pressao e desgaste ao mesmo tempo</div></div>
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
            `).join("") || ""}
            ${(state.season.psychologyLog || []).map((log) => `
              <article class="recent-card">
                <strong>${log.label}</strong>
                <div class="player-meta">Rodada ${log.round} | moral ${log.amount > 0 ? "+" : ""}${log.amount}</div>
                <div class="player-meta">${log.description}</div>
              </article>
            `).join("") || ""}
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
                  <div class="game-meta">${game.setSummary}</div>
                </div>
                <span class="result-pill ${game.result === "V" ? "win" : "loss"}">${game.result}</span>
              </div>
              <div class="game-score">
                <strong>${game.teamSets} x ${game.opponentSets}</strong>
                <div class="game-meta">pts ${game.teamPoints}-${game.opponentPoints} | aces ${game.aces} | blocks ${game.blocks}</div>
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
  return "Chaves: morale, serve, attack, block, reception, setting, defense, physical, tactical. Ex: [{\"key\":\"block\",\"amount\":3,\"duration\":1}]";
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
            <th>Pts</th>
            <th>V</th>
            <th>D</th>
            <th>Sets</th>
            <th>Saldo sets</th>
            <th>Saldo pontos</th>
            <th>Forma</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((team, index) => {
            const setDiff = team.setsWon - team.setsLost;
            const pointDiff = team.rallyPointsWon - team.rallyPointsLost;
            const zoneClass = index < 8 ? "playoff-zone" : index >= rows.length - 2 ? "relegation-zone" : "";
            return `
              <tr class="${team.id === USER_TEAM_ID ? "user-team" : ""} ${zoneClass}">
                <td>${index + 1}</td>
                <td><div class="team-cell">${renderTeamBadge(team)}<div><strong>${team.name}</strong>${team.id === USER_TEAM_ID ? '<div class="player-meta">sua franquia</div>' : ""}</div></div></td>
                <td>${team.leaguePoints}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.setsWon}-${team.setsLost}</td>
                <td>${setDiff >= 0 ? "+" : ""}${setDiff}</td>
                <td>${pointDiff >= 0 ? "+" : ""}${pointDiff}</td>
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
  state.trainingFocus = "serve";
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
    state.trainingFocus = "serve";
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
  renderQuickHub();
  renderLiveMatchPage();
  renderPlayerStatsPanel();
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
    openLiveMatchTab,
    prepareLiveVolleyballMatch,
    clearLiveMatch
  },
  selectors: {
    getDivisionConfig,
    getSelectedPlayers,
    getOpponents,
    getBudgetCap,
    getRosterSize,
    getSortedLeagueTeams
  }
});
