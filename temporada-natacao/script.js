const TEAM_SIZE = 10;
const MIN_PER_GENDER = 4;
const SALARY_CAP = 94;
const STORAGE_KEY = "temporada-total-natacao-v4";
const LEGACY_STORAGE_KEYS = [
  "temporada-total-natacao-v3",
  "temporada-total-natacao-v2",
  "temporada-total-natacao-v1"
];
const USER_TEAM_ID = "player-team";
const PROGRESS_CAP_RATIO = 0.12;
const ENTRIES_PER_EVENT = 2;
const MAX_EVENTS_PER_SWIMMER = 4;

const TRAINING_BLOCKS = {
  sprinter: {
    label: "Velocista",
    effect: "Explosão de bloco e velocidade para 50m e 100m.",
    progress: { sprint: 0.92, turns: 0.34, freestyle: 0.2, mentality: 0.08 },
    freshness: -4
  },
  speedEndurance: {
    label: "Resistência de velocidade",
    effect: "Passagem forte e manutenção para 100m e 200m.",
    progress: { sprint: 0.3, endurance: 0.62, freestyle: 0.24, technique: 0.14 },
    freshness: -4
  },
  middleDistance: {
    label: "Meio-fundo",
    effect: "Controle de nado e economia para 200m e 400m livre.",
    progress: { endurance: 0.82, freestyle: 0.26, technique: 0.2, recovery: 0.1 },
    freshness: -3
  },
  distance: {
    label: "Fundista",
    effect: "Base aeróbica e consistência para 800m e 1500m.",
    progress: { endurance: 1.04, recovery: 0.24, technique: 0.16, mentality: 0.14 },
    freshness: -4
  },
  medley: {
    label: "Medley",
    effect: "Trabalho de transições e equilíbrio entre os quatro nados.",
    progress: { freestyle: 0.16, backstroke: 0.2, breaststroke: 0.22, butterfly: 0.2, technique: 0.22, turns: 0.14 },
    freshness: -3
  },
  recovery: {
    label: "Recuperação ativa",
    effect: "Semana leve para recuperar sem deixar de evoluir.",
    progress: { recovery: 0.54, technique: 0.12, mentality: 0.1 },
    freshness: 9
  }
};

const TRAINING_COMPLEMENTS = {
  starts: {
    label: "Saidas e viradas",
    effect: "Detalhes finos que decidem provas curtas.",
    progress: { turns: 0.48, sprint: 0.18, technique: 0.16 },
    freshness: -1
  },
  threshold: {
    label: "Limiar aeróbico",
    effect: "Bloco de sustentação forte para provas médias e longas.",
    progress: { endurance: 0.42, recovery: 0.12, mentality: 0.08 },
    freshness: -2
  },
  racePace: {
    label: "Ritmo de prova",
    effect: "Afina passagem e sensação de água na prova alvo.",
    progress: { freestyle: 0.18, technique: 0.22, sprint: 0.12, mentality: 0.1 },
    freshness: -2
  },
  strength: {
    label: "Força seca",
    effect: "Academia transferida para potência útil na água.",
    progress: { sprint: 0.34, butterfly: 0.08, breaststroke: 0.08 },
    freshness: -2
  },
  mobility: {
    label: "Mobilidade",
    effect: "Amplitude, alinhamento e eficiência mecânica.",
    progress: { technique: 0.34, backstroke: 0.12, recovery: 0.1 },
    freshness: 1
  },
  loosen: {
    label: "Soltura",
    effect: "Baixa carga para absorver melhor o bloco principal.",
    progress: { recovery: 0.28, mentality: 0.1 },
    freshness: 4
  }
};

const MANAGEMENT_OPTIONS = {
  cycle: {
    volume: { label: "Volume", effect: "Mais metros e base aeróbica.", progressMultiplier: 1.06, freshness: -2, progressBonus: { endurance: 0.16, recovery: 0.06 } },
    specific: { label: "Específico", effect: "Bloco equilibrado de temporada.", progressMultiplier: 1, freshness: 0, progressBonus: { technique: 0.08, mentality: 0.04 } },
    taper: { label: "Polimento", effect: "Menos carga e mais qualidade de prova.", progressMultiplier: 0.82, freshness: 5, progressBonus: { sprint: 0.1, turns: 0.08, mentality: 0.08 } }
  },
  intensity: {
    controlled: { label: "Controlada", effect: "Carga segura para preservar o grupo.", progressMultiplier: 0.94, freshness: 2 },
    balanced: { label: "Equilibrada", effect: "Padrão de temporada.", progressMultiplier: 1, freshness: 0 },
    aggressive: { label: "Alta", effect: "Carga pesada e ganho maior.", progressMultiplier: 1.11, freshness: -3 }
  },
  recovery: {
    normal: { label: "Normal", effect: "Rotina padrão de recuperação.", progressMultiplier: 1, freshness: 0, progressBonus: { recovery: 0.06 } },
    advanced: { label: "Reforçada", effect: "Mais regeneração e menos fadiga.", progressMultiplier: 0.96, freshness: 3, progressBonus: { recovery: 0.14, mentality: 0.05 } },
    race: { label: "Ativação", effect: "Semana curta para competir mais leve.", progressMultiplier: 0.91, freshness: 4, progressBonus: { sprint: 0.1, turns: 0.08 } }
  },
  gym: {
    light: { label: "Leve", effect: "Preserva frescor.", progressMultiplier: 0.97, freshness: 2, progressBonus: { technique: 0.04 } },
    balanced: { label: "Equilibrada", effect: "Mantém força sem pesar demais.", progressMultiplier: 1, freshness: 0, progressBonus: { sprint: 0.05 } },
    heavy: { label: "Pesada", effect: "Mais potência, mais pernas pesadas.", progressMultiplier: 1.07, freshness: -2, progressBonus: { sprint: 0.12, butterfly: 0.08, breaststroke: 0.08 } }
  }
};

const EVENT_TEMPLATES = [
  {
    key: "50_free",
    label: "50m Livre",
    points: [20, 17, 15, 13, 11, 9, 7, 5, 4, 3, 2, 1],
    weights: { freestyle: 0.36, sprint: 0.34, turns: 0.14, technique: 0.08, mentality: 0.08 },
    meetTags: ["sprint"],
    gapPerPoint: 0.0039,
    variance: 0.16
  },
  {
    key: "100_free",
    label: "100m Livre",
    points: [20, 17, 15, 13, 11, 9, 7, 5, 4, 3, 2, 1],
    weights: { freestyle: 0.34, sprint: 0.24, endurance: 0.14, turns: 0.12, technique: 0.08, mentality: 0.08 },
    meetTags: ["sprint"],
    gapPerPoint: 0.0042,
    variance: 0.28
  },
  {
    key: "200_free",
    label: "200m Livre",
    points: [22, 19, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1],
    weights: { freestyle: 0.3, endurance: 0.22, sprint: 0.12, technique: 0.16, turns: 0.1, mentality: 0.1 },
    meetTags: ["middle"],
    gapPerPoint: 0.0044,
    variance: 0.42
  },
  {
    key: "400_free",
    label: "400m Livre",
    points: [24, 21, 18, 15, 12, 10, 8, 6, 4, 3, 2, 1],
    weights: { freestyle: 0.28, endurance: 0.34, technique: 0.16, recovery: 0.08, mentality: 0.14 },
    meetTags: ["distance"],
    gapPerPoint: 0.0039,
    variance: 0.8
  },
  {
    key: "800_free",
    label: "800m Livre",
    points: [26, 23, 20, 17, 14, 11, 8, 6, 4, 3, 2, 1],
    weights: { freestyle: 0.22, endurance: 0.4, technique: 0.14, recovery: 0.12, mentality: 0.12 },
    meetTags: ["distance"],
    gapPerPoint: 0.0035,
    variance: 1.5
  },
  {
    key: "1500_free",
    label: "1500m Livre",
    points: [30, 26, 22, 18, 14, 11, 8, 6, 4, 3, 2, 1],
    weights: { freestyle: 0.2, endurance: 0.42, technique: 0.14, recovery: 0.12, mentality: 0.12 },
    meetTags: ["distance"],
    gapPerPoint: 0.0034,
    variance: 2.6
  },
  {
    key: "100_im",
    label: "100m Medley",
    points: [22, 19, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1],
    weights: { freestyle: 0.14, backstroke: 0.18, breaststroke: 0.2, butterfly: 0.18, sprint: 0.12, technique: 0.1, turns: 0.08 },
    meetTags: ["medley"],
    gapPerPoint: 0.0043,
    variance: 0.4
  },
  {
    key: "200_im",
    label: "200m Medley",
    points: [24, 21, 18, 15, 12, 10, 8, 6, 4, 3, 2, 1],
    weights: { freestyle: 0.12, backstroke: 0.16, breaststroke: 0.2, butterfly: 0.18, endurance: 0.12, technique: 0.1, turns: 0.06, mentality: 0.06 },
    meetTags: ["medley"],
    gapPerPoint: 0.0042,
    variance: 0.7
  }
];

const EVENT_REFERENCES = {
  M: {
    "50_free": { wr: 20.88, br: 20.91, wrLabel: "WR 20.88", brLabel: "BR 20.91" },
    "100_free": { wr: 46.4, br: 46.91, wrLabel: "WR 46.40", brLabel: "BR 46.91" },
    "200_free": { wr: 102, br: 104.66, wrLabel: "WR 1:42.00", brLabel: "BR 1:44.66" },
    "400_free": { wr: 220.07, br: 222.76, wrLabel: "WR 3:40.07", brLabel: "BR 3:42.76" },
    "800_free": { wr: 452.12, br: 465.48, wrLabel: "WR 7:32.12", brLabel: "BR 7:45.48" },
    "1500_free": { wr: 870.67, br: 888.53, wrLabel: "WR 14:30.67", brLabel: "BR 14:48.53" },
    "100_im": { wr: 49.28, br: 51.74, wrLabel: "WR 49.28 SC", brLabel: "BR 51.74 SC" },
    "200_im": { wr: 112.69, br: 117.55, wrLabel: "WR 1:52.69", brLabel: "BR 1:57.55" }
  },
  F: {
    "50_free": { wr: 23.61, br: 24.25, wrLabel: "WR 23.61", brLabel: "BR 24.25" },
    "100_free": { wr: 51.71, br: 52.85, wrLabel: "WR 51.71", brLabel: "BR 52.85" },
    "200_free": { wr: 112.23, br: 117.57, wrLabel: "WR 1:52.23", brLabel: "BR 1:57.57" },
    "400_free": { wr: 234.18, br: 244.40, wrLabel: "WR 3:54.18", brLabel: "BR 4:04.40" },
    "800_free": { wr: 484.79, br: 515.35, wrLabel: "WR 8:04.79", brLabel: "BR 8:35.35" },
    "1500_free": { wr: 920.48, br: 991.03, wrLabel: "WR 15:20.48", brLabel: "BR 16:31.03" },
    "100_im": { wr: 55.11, br: 59.83, wrLabel: "WR 55.11 SC", brLabel: "BR 59.83 SC" },
    "200_im": { wr: 125.7, br: 132.96, wrLabel: "WR 2:05.70", brLabel: "BR 2:12.96" }
  }
};

const EVENT_DEFINITIONS = ["M", "F"].flatMap((gender) =>
  EVENT_TEMPLATES.map((template) => {
    const refs = EVENT_REFERENCES[gender][template.key];
    return {
      ...template,
      id: `${gender}_${template.key}`,
      gender,
      categoryLabel: gender === "M" ? "Masculino" : "Feminino",
      worldRecord: refs.wr,
      brazilRecord: refs.br,
      wrLabel: refs.wrLabel,
      brLabel: refs.brLabel
    };
  })
);

const MEETS = [
  { id: 1, week: 1, name: "Troféu Abertura", city: "Santos", bonus: { sprint: 1.03, middle: 1, distance: 0.98, medley: 0.99 }, note: "Semana 1: ambiente leve e piscina rápida para abrir o circuito." },
  { id: 2, week: 2, name: "Copa de Outono", city: "Curitiba", bonus: { sprint: 0.99, middle: 1.02, distance: 1.04, medley: 1 }, note: "Semana 2: carga mais alta e distância mais valorizada." },
  { id: 3, week: 3, name: "Festival de Estilos", city: "Belo Horizonte", bonus: { sprint: 0.98, middle: 1, distance: 1, medley: 1.05 }, note: "Semana 3: medley e técnica de transição pesam mais." },
  { id: 4, week: 4, name: "Meeting Nacional", city: "Brasília", bonus: { sprint: 1.01, middle: 1.02, distance: 1.01, medley: 1.01 }, note: "Semana 4: etapa equilibrada para equipes completas." },
  { id: 5, week: 5, name: "Circuito Inverno", city: "Porto Alegre", bonus: { sprint: 0.98, middle: 1.01, distance: 1.05, medley: 1.02 }, note: "Semana 5: recuperação e fundo separam os elencos." },
  { id: 6, week: 6, name: "Troféu Velocidade", city: "Recife", bonus: { sprint: 1.06, middle: 1.01, distance: 0.96, medley: 0.98 }, note: "Semana 6: tiro curto em destaque." },
  { id: 7, week: 7, name: "Campeonato das Capitais", city: "Rio de Janeiro", bonus: { sprint: 1, middle: 1.02, distance: 1.02, medley: 1.03 }, note: "Semana 7: etapa decisiva para a classificação geral." },
  { id: 8, week: 8, name: "Final do Circuito", city: "Fortaleza", bonus: { sprint: 1.02, middle: 1.02, distance: 1.03, medley: 1.04 }, note: "Semana 8: final do circuito, com alto peso competitivo." }
];

const OPPONENT_TEAMS = [
  { id: "azul", name: "Azul Oceano", sprint: 82, endurance: 79, medley: 77, distance: 78, technique: 80, depth: 79, mentality: 76, recovery: 76 },
  { id: "tubarao", name: "Tubarão Central", sprint: 77, endurance: 85, medley: 81, distance: 84, technique: 79, depth: 81, mentality: 77, recovery: 79 },
  { id: "orbita", name: "Órbita Aquática", sprint: 80, endurance: 78, medley: 85, distance: 77, technique: 84, depth: 78, mentality: 80, recovery: 77 },
  { id: "maralto", name: "Maralto Swim", sprint: 79, endurance: 80, medley: 78, distance: 81, technique: 78, depth: 82, mentality: 75, recovery: 78 },
  { id: "vento", name: "Vento Norte", sprint: 76, endurance: 83, medley: 80, distance: 82, technique: 81, depth: 80, mentality: 79, recovery: 80 }
];

const MARKET = [
  { id: 1, gender: "M", name: "Lucas Valerio", age: 21, salary: 11, freestyle: 89, backstroke: 61, breaststroke: 48, butterfly: 67, sprint: 90, endurance: 73, technique: 80, turns: 84, mentality: 76, recovery: 72, development: 1.03, tag: "Sprinter puro" },
  { id: 2, gender: "M", name: "Mateus Prado", age: 24, salary: 10, freestyle: 84, backstroke: 70, breaststroke: 55, butterfly: 60, sprint: 78, endurance: 86, technique: 82, turns: 79, mentality: 80, recovery: 74, development: 1.02, tag: "200/400 livre forte" },
  { id: 3, gender: "M", name: "Enzo Salles", age: 20, salary: 9, freestyle: 77, backstroke: 88, breaststroke: 50, butterfly: 58, sprint: 80, endurance: 74, technique: 84, turns: 86, mentality: 77, recovery: 71, development: 1.07, tag: "Costas tecnico" },
  { id: 4, gender: "M", name: "Bruno Neri", age: 23, salary: 9, freestyle: 70, backstroke: 57, breaststroke: 89, butterfly: 52, sprint: 74, endurance: 76, technique: 83, turns: 72, mentality: 82, recovery: 73, development: 1.04, tag: "Peito competitivo" },
  { id: 5, gender: "M", name: "Caio Mota", age: 22, salary: 10, freestyle: 75, backstroke: 62, breaststroke: 57, butterfly: 87, sprint: 82, endurance: 78, technique: 81, turns: 76, mentality: 79, recovery: 70, development: 1.03, tag: "Borboleta agressivo" },
  { id: 6, gender: "M", name: "Guilherme Porto", age: 26, salary: 8, freestyle: 81, backstroke: 76, breaststroke: 70, butterfly: 72, sprint: 76, endurance: 83, technique: 85, turns: 80, mentality: 84, recovery: 77, development: 1.01, tag: "Medley experiente" },
  { id: 7, gender: "M", name: "Rafael Luz", age: 19, salary: 6, freestyle: 79, backstroke: 64, breaststroke: 44, butterfly: 73, sprint: 84, endurance: 69, technique: 75, turns: 78, mentality: 71, recovery: 68, development: 1.11, tag: "Projeto de velocidade" },
  { id: 8, gender: "M", name: "Thiago Serra", age: 25, salary: 7, freestyle: 73, backstroke: 83, breaststroke: 48, butterfly: 61, sprint: 74, endurance: 79, technique: 82, turns: 84, mentality: 78, recovery: 75, development: 1.02, tag: "Backstroke estavel" },
  { id: 9, gender: "M", name: "Henrique Maia", age: 18, salary: 5, freestyle: 68, backstroke: 58, breaststroke: 80, butterfly: 47, sprint: 69, endurance: 72, technique: 76, turns: 67, mentality: 73, recovery: 69, development: 1.12, tag: "Peito promissor" },
  { id: 10, gender: "M", name: "Otavio Barros", age: 23, salary: 7, freestyle: 82, backstroke: 60, breaststroke: 49, butterfly: 74, sprint: 81, endurance: 75, technique: 76, turns: 77, mentality: 78, recovery: 72, development: 1.03, tag: "Explosao no bloco" },
  { id: 11, gender: "F", name: "Beatriz Nogueira", age: 22, salary: 11, freestyle: 88, backstroke: 66, breaststroke: 53, butterfly: 69, sprint: 89, endurance: 74, technique: 82, turns: 84, mentality: 79, recovery: 75, development: 1.03, tag: "Velocidade de elite" },
  { id: 12, gender: "F", name: "Marina Lopes", age: 24, salary: 10, freestyle: 85, backstroke: 71, breaststroke: 57, butterfly: 62, sprint: 79, endurance: 87, technique: 84, turns: 80, mentality: 82, recovery: 76, development: 1.02, tag: "400/800 livre forte" },
  { id: 13, gender: "F", name: "Isadora Sato", age: 20, salary: 9, freestyle: 76, backstroke: 89, breaststroke: 54, butterfly: 60, sprint: 79, endurance: 75, technique: 86, turns: 87, mentality: 78, recovery: 73, development: 1.07, tag: "Costas tecnico" },
  { id: 14, gender: "F", name: "Helena Prado", age: 23, salary: 9, freestyle: 69, backstroke: 59, breaststroke: 88, butterfly: 53, sprint: 73, endurance: 77, technique: 84, turns: 73, mentality: 83, recovery: 74, development: 1.04, tag: "Peito de prova" },
  { id: 15, gender: "F", name: "Livia Campos", age: 22, salary: 10, freestyle: 76, backstroke: 63, breaststroke: 58, butterfly: 88, sprint: 81, endurance: 79, technique: 82, turns: 77, mentality: 80, recovery: 72, development: 1.03, tag: "Borboleta forte" },
  { id: 16, gender: "F", name: "Sofia Mendes", age: 25, salary: 8, freestyle: 80, backstroke: 77, breaststroke: 72, butterfly: 74, sprint: 75, endurance: 84, technique: 86, turns: 81, mentality: 84, recovery: 79, development: 1.01, tag: "Medley completo" },
  { id: 17, gender: "F", name: "Ana Clara Reis", age: 19, salary: 6, freestyle: 78, backstroke: 65, breaststroke: 46, butterfly: 74, sprint: 83, endurance: 70, technique: 76, turns: 79, mentality: 72, recovery: 70, development: 1.11, tag: "Projeto de velocidade" },
  { id: 18, gender: "F", name: "Jade Teixeira", age: 21, salary: 6, freestyle: 68, backstroke: 80, breaststroke: 64, butterfly: 61, sprint: 72, endurance: 79, technique: 81, turns: 83, mentality: 78, recovery: 75, development: 1.06, tag: "Costas em crescimento" },
  { id: 19, gender: "F", name: "Valentina Moura", age: 19, salary: 5, freestyle: 65, backstroke: 57, breaststroke: 72, butterfly: 59, sprint: 69, endurance: 78, technique: 75, turns: 68, mentality: 75, recovery: 74, development: 1.12, tag: "Peito e fundo" },
  { id: 20, gender: "F", name: "Carolina Freitas", age: 18, salary: 4, freestyle: 70, backstroke: 69, breaststroke: 66, butterfly: 67, sprint: 71, endurance: 78, technique: 79, turns: 73, mentality: 72, recovery: 77, development: 1.13, tag: "Multinado jovem" }
];

const state = {
  teamName: "",
  selectedIds: [],
  season: null,
  trainingBlockById: {},
  trainingComplementById: {},
  weeklyManagement: createWeeklyManagement(),
  lineup: createEmptyLineup(),
  activeTab: "front-office"
};

const teamNameInput = document.querySelector("#team-name");
const budgetUsedEl = document.querySelector("#budget-used");
const budgetLeftEl = document.querySelector("#budget-left");
const teamSprintEl = document.querySelector("#team-sprint");
const teamEnduranceEl = document.querySelector("#team-endurance");
const teamTechniqueEl = document.querySelector("#team-technique");
const teamTurnsEl = document.querySelector("#team-turns");
const teamRecoveryEl = document.querySelector("#team-recovery");
const teamDepthEl = document.querySelector("#team-depth");
const rosterCountEl = document.querySelector("#roster-count");
const selectedRosterEl = document.querySelector("#selected-roster");
const marketEl = document.querySelector("#player-market");
const trainingManagementEl = document.querySelector("#training-management");
const trainingBoardEl = document.querySelector("#training-board");
const competitionHubEl = document.querySelector("#competition-hub");
const standingsTableEl = document.querySelector("#standings-table");
const seasonLogEl = document.querySelector("#season-log");
const seasonRankEl = document.querySelector("#season-rank");
const seasonPointsEl = document.querySelector("#season-points");
const seasonStageEl = document.querySelector("#season-stage");
const seasonLastResultEl = document.querySelector("#season-last-result");
const startSeasonButton = document.querySelector("#start-season");
const simulateMeetButton = document.querySelector("#simulate-meet");
const resetButton = document.querySelector("#reset-team");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundStat(value) {
  return Math.round(value);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function formatTime(seconds) {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remaining = (seconds - minutes * 60).toFixed(2).padStart(5, "0");
    return `${minutes}:${remaining}`;
  }
  return seconds.toFixed(2);
}

function createWeeklyManagement() {
  return { cycle: "specific", intensity: "balanced", recovery: "normal", gym: "balanced" };
}

function createEmptyLineup() {
  return Object.fromEntries(EVENT_DEFINITIONS.map((event) => [event.id, Array.from({ length: ENTRIES_PER_EVENT }, () => "")]));
}

function getTeamName() {
  return state.teamName.trim() || "Equipe do Lucas";
}

function getSelectedSwimmers() {
  return MARKET.filter((swimmer) => state.selectedIds.includes(swimmer.id));
}

function getSelectedByGender(gender) {
  return getSelectedSwimmers().filter((swimmer) => swimmer.gender === gender);
}

function getGenderCounts() {
  return {
    M: getSelectedByGender("M").length,
    F: getSelectedByGender("F").length
  };
}

function getBudgetUsed() {
  return getSelectedSwimmers().reduce((sum, swimmer) => sum + swimmer.salary, 0);
}

function getProgressCap(swimmer, key) {
  return Math.max(1, roundStat(swimmer[key] * PROGRESS_CAP_RATIO));
}

function sanitizeProgress(swimmer, progress = {}) {
  const sanitized = {};
  Object.keys(state.season?.progress?.[swimmer.id] || progress).forEach((key) => {
    sanitized[key] = clamp(progress[key] || 0, -getProgressCap(swimmer, key), getProgressCap(swimmer, key));
  });
  return sanitized;
}

function createSeason() {
  const progress = {};
  const freshness = {};
  getSelectedSwimmers().forEach((swimmer) => {
    progress[swimmer.id] = {
      freestyle: 0, backstroke: 0, breaststroke: 0, butterfly: 0,
      sprint: 0, endurance: 0, technique: 0, turns: 0, mentality: 0, recovery: 0
    };
    freshness[swimmer.id] = 86;
  });
  return {
    started: true,
    currentMeetIndex: 0,
    standings: [{ id: USER_TEAM_ID, name: getTeamName(), points: 0, placements: [] }, ...OPPONENT_TEAMS.map((team) => ({ id: team.id, name: team.name, points: 0, placements: [] }))],
    progress,
    freshness,
    meetResults: []
  };
}

function getAdjustedSwimmer(swimmer) {
  const progress = state.season?.progress?.[swimmer.id] || {};
  const freshness = state.season?.freshness?.[swimmer.id] ?? 86;
  return {
    ...swimmer,
    freestyle: roundStat(swimmer.freestyle + (progress.freestyle || 0)),
    backstroke: roundStat(swimmer.backstroke + (progress.backstroke || 0)),
    breaststroke: roundStat(swimmer.breaststroke + (progress.breaststroke || 0)),
    butterfly: roundStat(swimmer.butterfly + (progress.butterfly || 0)),
    sprint: roundStat(swimmer.sprint + (progress.sprint || 0)),
    endurance: roundStat(swimmer.endurance + (progress.endurance || 0)),
    technique: roundStat(swimmer.technique + (progress.technique || 0)),
    turns: roundStat(swimmer.turns + (progress.turns || 0)),
    mentality: roundStat(swimmer.mentality + (progress.mentality || 0)),
    recovery: roundStat(swimmer.recovery + (progress.recovery || 0)),
    freshness
  };
}

function getMeetInfo() {
  return state.season ? MEETS[state.season.currentMeetIndex] || null : null;
}

function getMainStrokeKey(swimmer) {
  return [["freestyle", swimmer.freestyle], ["backstroke", swimmer.backstroke], ["breaststroke", swimmer.breaststroke], ["butterfly", swimmer.butterfly]]
    .sort((a, b) => b[1] - a[1])[0][0];
}

function getStrokeLabel(key) {
  return { freestyle: "Livre", backstroke: "Costas", breaststroke: "Peito", butterfly: "Borboleta" }[key] || key;
}

function getWeeklyManagementEffects() {
  const cycle = MANAGEMENT_OPTIONS.cycle[state.weeklyManagement.cycle] || MANAGEMENT_OPTIONS.cycle.specific;
  const intensity = MANAGEMENT_OPTIONS.intensity[state.weeklyManagement.intensity] || MANAGEMENT_OPTIONS.intensity.balanced;
  const recovery = MANAGEMENT_OPTIONS.recovery[state.weeklyManagement.recovery] || MANAGEMENT_OPTIONS.recovery.normal;
  const gym = MANAGEMENT_OPTIONS.gym[state.weeklyManagement.gym] || MANAGEMENT_OPTIONS.gym.balanced;
  const blocks = [cycle, intensity, recovery, gym];
  const progressBonus = {};
  blocks.forEach((block) => Object.entries(block.progressBonus || {}).forEach(([key, value]) => {
    progressBonus[key] = (progressBonus[key] || 0) + value;
  }));
  return {
    cycle,
    intensity,
    recovery,
    gym,
    progressMultiplier: blocks.reduce((total, block) => total * block.progressMultiplier, 1),
    freshness: blocks.reduce((total, block) => total + block.freshness, 0),
    progressBonus
  };
}

function getMeetBoost(event, meet) {
  return event.meetTags.reduce((boost, tag) => boost * (meet.bonus[tag] || 1), 1);
}

function getEventPerformanceIndex(swimmer, event) {
  return Object.entries(event.weights).reduce((sum, [key, weight]) => sum + swimmer[key] * weight, 0);
}

function getProjectedEventTime(swimmer, event, meet, noise = 0) {
  const performance = getEventPerformanceIndex(swimmer, event);
  const freshnessFactor = 1 - (swimmer.freshness - 86) * 0.0014;
  const meetBoost = getMeetBoost(event, meet);
  const recordGap = (event.brazilRecord / event.worldRecord) - 1;
  const baselineGap = recordGap * 0.55;
  const rawTime = event.worldRecord * (1 + baselineGap + (100 - performance) * event.gapPerPoint) * freshnessFactor / meetBoost;
  return Math.max(event.worldRecord * 1.01, rawTime + noise);
}

function getRaceTime(swimmer, event, meet) {
  return getProjectedEventTime(swimmer, event, meet, randomBetween(-event.variance, event.variance));
}

function getOpponentProfile(opponent, event) {
  return {
    freestyle: (opponent.sprint + opponent.depth) / 2,
    backstroke: (opponent.medley + opponent.technique) / 2,
    breaststroke: (opponent.medley + opponent.mentality) / 2,
    butterfly: (opponent.sprint + opponent.medley) / 2,
    sprint: opponent.sprint,
    endurance: (opponent.endurance + opponent.distance) / 2,
    technique: opponent.technique,
    turns: (opponent.sprint + opponent.technique) / 2,
    mentality: opponent.mentality,
    recovery: opponent.recovery,
    freshness: clamp(84 + (event.meetTags.includes("distance") ? opponent.recovery - 78 : opponent.sprint - 78) * 0.35, 78, 96)
  };
}

function getOpponentEntries(opponent, event, meet) {
  const baseSwimmer = getOpponentProfile(opponent, event);
  return Array.from({ length: ENTRIES_PER_EVENT }, (_, index) => ({
    teamId: opponent.id,
    label: `${opponent.name} ${index + 1}`,
    time: getProjectedEventTime(
      {
        ...baseSwimmer,
        sprint: baseSwimmer.sprint - index * 1.3,
        endurance: baseSwimmer.endurance - index * 1.1,
        technique: baseSwimmer.technique - index * 1.1,
        mentality: baseSwimmer.mentality - index * 0.8
      },
      event,
      meet,
      randomBetween(-event.variance * 1.1, event.variance * 1.1)
    )
  }));
}

function getTeamProfile() {
  const swimmers = getSelectedSwimmers().map(getAdjustedSwimmer);
  if (!swimmers.length) {
    return { sprint: 0, endurance: 0, technique: 0, turns: 0, recovery: 0, depth: 0 };
  }
  const avg = (key) => roundStat(swimmers.reduce((sum, swimmer) => sum + swimmer[key], 0) / swimmers.length);
  const meet = getMeetInfo() || MEETS[0];
  const eventValues = EVENT_DEFINITIONS.map((event) => {
    const candidates = swimmers.filter((swimmer) => swimmer.gender === event.gender);
    const best = candidates.map((swimmer) => getProjectedEventTime(swimmer, event, meet)).sort((a, b) => a - b)[0];
    return best ? (event.worldRecord / best) * 100 : 0;
  });
  return {
    sprint: avg("sprint"),
    endurance: avg("endurance"),
    technique: avg("technique"),
    turns: avg("turns"),
    recovery: avg("recovery"),
    depth: roundStat(eventValues.reduce((sum, value) => sum + value, 0) / eventValues.length)
  };
}

function getDefaultTrainingBlock(swimmer) {
  if (swimmer.endurance - swimmer.sprint >= 10) {
    return "distance";
  }
  if (swimmer.sprint - swimmer.endurance >= 9) {
    return "sprinter";
  }
  if (Math.min(swimmer.backstroke, swimmer.breaststroke, swimmer.butterfly) >= 68) {
    return "medley";
  }
  if (swimmer.endurance >= 80) {
    return "middleDistance";
  }
  return "speedEndurance";
}

function getDefaultTrainingComplement(swimmer, blockKey = getDefaultTrainingBlock(swimmer)) {
  if (blockKey === "sprinter") return "starts";
  if (blockKey === "distance" || blockKey === "middleDistance") return "threshold";
  if (blockKey === "medley") return "mobility";
  return "racePace";
}

function getTrainingBlock(swimmerId) {
  const swimmer = MARKET.find((entry) => entry.id === swimmerId);
  return state.trainingBlockById[swimmerId] || (swimmer ? getDefaultTrainingBlock(swimmer) : "speedEndurance");
}

function getTrainingComplement(swimmerId) {
  const swimmer = MARKET.find((entry) => entry.id === swimmerId);
  const block = getTrainingBlock(swimmerId);
  return state.trainingComplementById[swimmerId] || (swimmer ? getDefaultTrainingComplement(swimmer, block) : "racePace");
}

function getBestEvent(swimmer) {
  const meet = getMeetInfo() || MEETS[0];
  return EVENT_DEFINITIONS
    .filter((event) => event.gender === swimmer.gender)
    .map((event) => {
      const time = getProjectedEventTime(swimmer, event, meet);
      const relativeStrength = event.brazilRecord / time;
      return { event, time, relativeStrength };
    })
    .sort((a, b) => b.relativeStrength - a.relativeStrength)[0] || null;
}

function getBestEventLabel(swimmer) {
  return getBestEvent(swimmer)?.event.label || "--";
}

function getSwimmerArchetype(swimmer) {
  const best = getBestEvent(swimmer);
  if (!best) return "Versatil";
  if (best.event.key === "50_free" || best.event.key === "100_free") return "Velocista";
  if (best.event.key === "200_free" || best.event.key === "400_free") return "Meio-fundista";
  if (best.event.key === "800_free" || best.event.key === "1500_free") return "Fundista";
  if (best.event.key === "100_im" || best.event.key === "200_im") return "Medley";
  return `${getStrokeLabel(getMainStrokeKey(swimmer))} especialista`;
}

function getFreshnessStatus(freshness) {
  if (freshness >= 90) return { label: "solto", className: "" };
  if (freshness >= 80) return { label: "estavel", className: "" };
  if (freshness >= 72) return { label: "atencao", className: "warn" };
  return { label: "pesado", className: "bad" };
}

function getTrainingProjection(swimmer) {
  const block = TRAINING_BLOCKS[getTrainingBlock(swimmer.id)];
  const complement = TRAINING_COMPLEMENTS[getTrainingComplement(swimmer.id)];
  const management = getWeeklyManagementEffects();
  const growth = swimmer.development || 1;
  const mergedProgress = { ...management.progressBonus };
  [block.progress, complement.progress].forEach((pack) => Object.entries(pack).forEach(([key, value]) => {
    mergedProgress[key] = (mergedProgress[key] || 0) + value;
  }));
  return {
    freshness: roundStat(block.freshness + complement.freshness + management.freshness),
    gains: Object.entries(mergedProgress)
      .map(([key, value]) => ({ key, value: value * management.progressMultiplier * growth * 0.45 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  };
}

function applyTrainingWeek() {
  if (!state.season) return;
  const management = getWeeklyManagementEffects();
  getSelectedSwimmers().forEach((baseSwimmer) => {
    const block = TRAINING_BLOCKS[getTrainingBlock(baseSwimmer.id)];
    const complement = TRAINING_COMPLEMENTS[getTrainingComplement(baseSwimmer.id)];
    const growth = baseSwimmer.development || 1;
    const progress = sanitizeProgress(baseSwimmer, state.season.progress[baseSwimmer.id]);
    const mergedProgress = { ...management.progressBonus };
    [block.progress, complement.progress].forEach((pack) => Object.entries(pack).forEach(([key, value]) => {
      mergedProgress[key] = (mergedProgress[key] || 0) + value;
    }));
    Object.entries(mergedProgress).forEach(([key, value]) => {
      progress[key] = clamp((progress[key] || 0) + value * growth * 0.45 * management.progressMultiplier, -getProgressCap(baseSwimmer, key), getProgressCap(baseSwimmer, key));
    });
    state.season.progress[baseSwimmer.id] = progress;
    state.season.freshness[baseSwimmer.id] = clamp((state.season.freshness[baseSwimmer.id] || 86) + block.freshness + complement.freshness + management.freshness, 58, 100);
  });
}

function getAssignmentCounts() {
  const counts = {};
  getSelectedSwimmers().forEach((swimmer) => { counts[swimmer.id] = 0; });
  EVENT_DEFINITIONS.forEach((event) => {
    state.lineup[event.id].forEach((swimmerId) => {
      if (counts[swimmerId] !== undefined) counts[swimmerId] += 1;
    });
  });
  return counts;
}

function validateRoster() {
  const counts = getGenderCounts();
  if (state.selectedIds.length !== TEAM_SIZE) {
    return { valid: false, message: `Escolha exatamente ${TEAM_SIZE} nadadores.` };
  }
  if (counts.M < MIN_PER_GENDER || counts.F < MIN_PER_GENDER) {
    return { valid: false, message: `Leve pelo menos ${MIN_PER_GENDER} homens e ${MIN_PER_GENDER} mulheres para cobrir todas as provas.` };
  }
  return { valid: true, message: "Elenco pronto para iniciar o circuito." };
}

function validateLineup() {
  if (!state.season) return { valid: false, message: "Inicie a temporada primeiro." };
  for (const event of EVENT_DEFINITIONS) {
    const entries = state.lineup[event.id];
    if (entries.some((value) => !value)) {
      return { valid: false, message: `Escalação incompleta: faltam nomes em ${event.label} ${event.categoryLabel}.` };
    }
    if (new Set(entries).size !== entries.length) {
      return { valid: false, message: `${event.label} ${event.categoryLabel} precisa de dois atletas diferentes.` };
    }
    const wrongGender = entries.find((swimmerId) => MARKET.find((swimmer) => swimmer.id === swimmerId)?.gender !== event.gender);
    if (wrongGender) {
      return { valid: false, message: `Há um atleta do gênero errado inscrito em ${event.label} ${event.categoryLabel}.` };
    }
  }
  const counts = getAssignmentCounts();
  const overloaded = Object.entries(counts).find(([, total]) => total > MAX_EVENTS_PER_SWIMMER);
  if (overloaded) {
    const swimmer = MARKET.find((entry) => String(entry.id) === overloaded[0]);
    return { valid: false, message: `${swimmer?.name || "Um nadador"} ultrapassou o limite de ${MAX_EVENTS_PER_SWIMMER} provas na semana.` };
  }
  return { valid: true, message: "Escalação semanal pronta." };
}

function applyPostMeetLoad() {
  const counts = getAssignmentCounts();
  const management = getWeeklyManagementEffects();
  getSelectedSwimmers().forEach((swimmer) => {
    const assignments = counts[swimmer.id] || 0;
    const adjusted = getAdjustedSwimmer(swimmer);
    const recoveryBoost = 6 + adjusted.recovery * 0.035 + Math.max(0, management.recovery.freshness) * 0.4;
    state.season.freshness[swimmer.id] = clamp((state.season.freshness[swimmer.id] || 86) - assignments * 6.5 + recoveryBoost, 56, 100);
  });
}

function updateStandings(teamPoints) {
  const currentMeet = getMeetInfo();
  state.season.standings.forEach((entry) => {
    const scored = teamPoints[entry.id] || 0;
    entry.points += scored;
    entry.placements.push({ meet: currentMeet.name, points: scored });
  });
  state.season.standings.sort((a, b) => b.points - a.points);
}

function getRecommendedSwimmers(event, limit = 3) {
  const meet = getMeetInfo() || MEETS[0];
  return getSelectedByGender(event.gender)
    .map(getAdjustedSwimmer)
    .map((swimmer) => ({ swimmer, time: getProjectedEventTime(swimmer, event, meet) }))
    .sort((a, b) => a.time - b.time)
    .slice(0, limit);
}

function simulateMeet() {
  const validation = validateLineup();
  if (!validation.valid) {
    renderCompetitionHub(validation.message, true);
    return;
  }

  applyTrainingWeek();
  const meet = getMeetInfo();
  const selectedMap = Object.fromEntries(getSelectedSwimmers().map((swimmer) => [swimmer.id, getAdjustedSwimmer(swimmer)]));
  const teamPoints = {};
  const eventResults = [];

  EVENT_DEFINITIONS.forEach((event) => {
    const entries = state.lineup[event.id].map((swimmerId, index) => ({
      teamId: USER_TEAM_ID,
      label: `${selectedMap[swimmerId].name} ${index + 1}`,
      swimmerName: selectedMap[swimmerId].name,
      time: getRaceTime(selectedMap[swimmerId], event, meet)
    }));
    OPPONENT_TEAMS.forEach((opponent) => entries.push(...getOpponentEntries(opponent, event, meet)));
    entries.sort((a, b) => a.time - b.time);
    const placements = entries.map((entry, index) => ({ ...entry, place: index + 1, points: event.points[index] || 0 }));
    placements.forEach((placement) => {
      teamPoints[placement.teamId] = (teamPoints[placement.teamId] || 0) + placement.points;
    });
    eventResults.push({ eventId: event.id, label: `${event.label} ${event.categoryLabel}`, placements });
  });

  applyPostMeetLoad();
  updateStandings(teamPoints);
  const teamRankings = state.season.standings
    .map((entry) => ({ id: entry.id, name: entry.name, points: teamPoints[entry.id] || 0 }))
    .sort((a, b) => b.points - a.points);

  state.season.meetResults.push({
    meet: meet.name,
    city: meet.city,
    week: meet.week,
    points: teamPoints[USER_TEAM_ID] || 0,
    position: teamRankings.findIndex((entry) => entry.id === USER_TEAM_ID) + 1,
    note: meet.note,
    teamRankings,
    events: eventResults
  });

  state.season.currentMeetIndex += 1;
  if (state.season.currentMeetIndex < MEETS.length) {
    state.lineup = createEmptyLineup();
  }

  saveState();
  render();
}

function toggleSwimmer(swimmerId) {
  if (state.season) return;
  const exists = state.selectedIds.includes(swimmerId);
  if (exists) {
    state.selectedIds = state.selectedIds.filter((id) => id !== swimmerId);
    delete state.trainingBlockById[swimmerId];
    delete state.trainingComplementById[swimmerId];
  } else if (state.selectedIds.length < TEAM_SIZE && getBudgetUsed() + (MARKET.find((swimmer) => swimmer.id === swimmerId)?.salary || 0) <= SALARY_CAP) {
    state.selectedIds = [...state.selectedIds, swimmerId];
    const swimmer = MARKET.find((entry) => entry.id === swimmerId);
    if (swimmer) {
      state.trainingBlockById[swimmerId] = getDefaultTrainingBlock(swimmer);
      state.trainingComplementById[swimmerId] = getDefaultTrainingComplement(swimmer);
    }
  }
  saveState();
  render();
}

function startSeason() {
  const rosterValidation = validateRoster();
  if (!rosterValidation.valid) {
    switchTab("front-office");
    renderCompetitionHub(rosterValidation.message, true);
    return;
  }
  state.season = createSeason();
  state.lineup = createEmptyLineup();
  switchTab("treinos");
  saveState();
  render();
}

function resetTeam() {
  state.teamName = "";
  state.selectedIds = [];
  state.trainingBlockById = {};
  state.trainingComplementById = {};
  state.weeklyManagement = createWeeklyManagement();
  state.lineup = createEmptyLineup();
  state.season = null;
  saveState();
  render();
}

function renderRoster() {
  const adjusted = getSelectedSwimmers().map(getAdjustedSwimmer);
  const genderCounts = getGenderCounts();
  rosterCountEl.textContent = `${adjusted.length} / ${TEAM_SIZE} | M ${genderCounts.M} | F ${genderCounts.F}`;
  const items = adjusted.map((swimmer) => {
    const freshness = getFreshnessStatus(swimmer.freshness);
    const best = getBestEvent(swimmer);
    return `
      <article class="selected-player">
        <span class="pill">${swimmer.gender}</span>
        <div>
          <strong>${swimmer.name}</strong>
          <div class="player-meta">${swimmer.tag} | perfil: ${getSwimmerArchetype(swimmer)} | melhor prova: ${best?.event.label || "--"} (${best ? formatTime(best.time) : "--"})</div>
          <div class="stat-line">
            <span>LIV ${swimmer.freestyle}</span>
            <span>COS ${swimmer.backstroke}</span>
            <span>PEI ${swimmer.breaststroke}</span>
          </div>
          <div class="stat-line">
            <span>BOR ${swimmer.butterfly}</span>
            <span>SPR ${swimmer.sprint}</span>
            <span>END ${swimmer.endurance}</span>
          </div>
          <div class="player-meta">frescor ${swimmer.freshness} | técnica ${swimmer.technique} | viradas ${swimmer.turns} | recuperação ${swimmer.recovery}</div>
        </div>
        <div class="stack-actions">
          <span class="status-pill ${freshness.className}">${freshness.label}</span>
          <button class="remove-button" data-swimmer-id="${swimmer.id}" type="button" ${state.season ? "disabled" : ""}>Remover</button>
        </div>
      </article>
    `;
  });
  const emptySlots = Array.from({ length: TEAM_SIZE - adjusted.length }, (_, index) => `<div class="empty-slot">Vaga ${adjusted.length + index + 1} aguardando contratação</div>`);
  selectedRosterEl.innerHTML = [...items, ...emptySlots].join("");
  selectedRosterEl.querySelectorAll(".remove-button").forEach((button) => button.addEventListener("click", () => toggleSwimmer(Number(button.dataset.swimmerId))));
}

function renderMarket() {
  const used = getBudgetUsed();
  const left = SALARY_CAP - used;
  budgetUsedEl.textContent = `$${used}M`;
  budgetLeftEl.textContent = `$${left}M`;
  marketEl.innerHTML = MARKET.map((swimmer) => {
    const selected = state.selectedIds.includes(swimmer.id);
    const canAdd = !state.season && !selected && state.selectedIds.length < TEAM_SIZE && used + swimmer.salary <= SALARY_CAP;
    const adjusted = getAdjustedSwimmer(swimmer);
    const best = getBestEvent(adjusted);
    return `
      <article class="player-card">
        <div class="player-card-top">
          <div>
            <strong>${swimmer.name}</strong>
            <div class="player-meta">${swimmer.gender} | ${swimmer.tag} | ${swimmer.age} anos | perfil: ${getSwimmerArchetype(adjusted)}</div>
          </div>
          <span class="tag-pill">$${swimmer.salary}M</span>
          <div class="swimmer-meta">
            <div class="stat-line">
              <span>LIV ${adjusted.freestyle}</span>
              <span>COS ${adjusted.backstroke}</span>
              <span>PEI ${adjusted.breaststroke}</span>
            </div>
            <div class="stat-line">
              <span>BOR ${adjusted.butterfly}</span>
              <span>SPR ${adjusted.sprint}</span>
              <span>END ${adjusted.endurance}</span>
            </div>
            <div class="player-meta">TEC ${adjusted.technique} | VIR ${adjusted.turns} | REC ${adjusted.recovery} | melhor prova: ${best?.event.label || "--"} (${best ? formatTime(best.time) : "--"})</div>
          </div>
        </div>
        <button class="${selected ? "ghost-button" : "primary-button"}" data-market-swimmer="${swimmer.id}" type="button" ${selected || canAdd ? "" : "disabled"}>
          ${selected ? "Selecionado" : canAdd ? "Contratar" : "Sem espaço / orçamento"}
        </button>
      </article>
    `;
  }).join("");
  marketEl.querySelectorAll("[data-market-swimmer]").forEach((button) => {
    if (!button.disabled) button.addEventListener("click", () => toggleSwimmer(Number(button.dataset.marketSwimmer)));
  });
}

function renderTeamStats() {
  const profile = getTeamProfile();
  teamSprintEl.textContent = profile.sprint;
  teamEnduranceEl.textContent = profile.endurance;
  teamTechniqueEl.textContent = profile.technique;
  teamTurnsEl.textContent = profile.turns;
  teamRecoveryEl.textContent = profile.recovery;
  teamDepthEl.textContent = profile.depth;
}

function renderTrainingManagement() {
  const management = getWeeklyManagementEffects();
  const meet = getMeetInfo();
  trainingManagementEl.innerHTML = `
    <div class="management-grid">
      <article class="summary-box">
        <span class="season-key">Microciclo</span>
        <strong>${management.cycle.label}</strong>
        <div class="player-meta">${management.cycle.effect}</div>
      </article>
      <label class="control-card">
        <span>Bloco da semana</span>
        <select data-management-key="cycle">${Object.entries(MANAGEMENT_OPTIONS.cycle).map(([key, option]) => `<option value="${key}"${state.weeklyManagement.cycle === key ? " selected" : ""}>${option.label}</option>`).join("")}</select>
      </label>
      <label class="control-card">
        <span>Intensidade</span>
        <select data-management-key="intensity">${Object.entries(MANAGEMENT_OPTIONS.intensity).map(([key, option]) => `<option value="${key}"${state.weeklyManagement.intensity === key ? " selected" : ""}>${option.label}</option>`).join("")}</select>
      </label>
      <label class="control-card">
        <span>Recuperação</span>
        <select data-management-key="recovery">${Object.entries(MANAGEMENT_OPTIONS.recovery).map(([key, option]) => `<option value="${key}"${state.weeklyManagement.recovery === key ? " selected" : ""}>${option.label}</option>`).join("")}</select>
      </label>
      <label class="control-card">
        <span>Academia</span>
        <select data-management-key="gym">${Object.entries(MANAGEMENT_OPTIONS.gym).map(([key, option]) => `<option value="${key}"${state.weeklyManagement.gym === key ? " selected" : ""}>${option.label}</option>`).join("")}</select>
      </label>
      <article class="summary-box compact-summary">
        <span class="season-key">Semana</span>
        <strong>${meet ? meet.week : 0} / ${MEETS.length}</strong>
        <div class="player-meta">${meet ? meet.note : "Monte o elenco e defina o plano da sua primeira semana."}</div>
      </article>
      <article class="summary-box compact-summary">
        <span class="season-key">Impacto</span>
        <strong>${management.progressMultiplier.toFixed(2)}x</strong>
        <div class="player-meta">ganho global | frescor ${management.freshness >= 0 ? "+" : ""}${management.freshness}</div>
      </article>
    </div>
  `;
  trainingManagementEl.querySelectorAll("[data-management-key]").forEach((select) => {
    select.addEventListener("change", () => {
      state.weeklyManagement[select.dataset.managementKey] = select.value;
      saveState();
      renderTrainingManagement();
      renderTrainingBoard();
      renderCompetitionHub();
    });
  });
}

function renderTrainingBoard() {
  const swimmers = getSelectedSwimmers().map(getAdjustedSwimmer);
  if (!swimmers.length) {
    trainingBoardEl.innerHTML = `<div class="matchday-hub empty">Escolha 10 nadadores na aba Montagem para liberar o quadro de treinos.</div>`;
    return;
  }
  trainingBoardEl.innerHTML = swimmers.map((swimmer) => {
    const blockKey = getTrainingBlock(swimmer.id);
    const complementKey = getTrainingComplement(swimmer.id);
    const block = TRAINING_BLOCKS[blockKey];
    const complement = TRAINING_COMPLEMENTS[complementKey];
    const projection = getTrainingProjection(swimmer);
    const freshness = getFreshnessStatus(swimmer.freshness);
    return `
      <article class="training-card swimmer-focus-card">
        <div class="card-topline">
          <div>
            <strong>${swimmer.name}</strong>
            <div class="player-meta">${swimmer.gender} | ${swimmer.tag} | perfil: ${getSwimmerArchetype(swimmer)} | melhor prova: ${getBestEventLabel(swimmer)}</div>
          </div>
          <span class="status-pill ${freshness.className}">${freshness.label}</span>
        </div>
        <div class="metric-strip">
          <span>SPR ${swimmer.sprint}</span>
          <span>END ${swimmer.endurance}</span>
          <span>TEC ${swimmer.technique}</span>
          <span>VIR ${swimmer.turns}</span>
          <span>REC ${swimmer.recovery}</span>
        </div>
        <label class="control-card">
          <span>Bloco principal</span>
          <select data-training-block="${swimmer.id}">${Object.entries(TRAINING_BLOCKS).map(([key, entry]) => `<option value="${key}"${blockKey === key ? " selected" : ""}>${entry.label}</option>`).join("")}</select>
        </label>
        <label class="control-card">
          <span>Complemento</span>
          <select data-training-complement="${swimmer.id}">${Object.entries(TRAINING_COMPLEMENTS).map(([key, entry]) => `<option value="${key}"${complementKey === key ? " selected" : ""}>${entry.label}</option>`).join("")}</select>
        </label>
        <div class="effect-block">
          <div class="effect-line">${block.effect}</div>
          <div class="effect-line">${complement.effect}</div>
          <div class="player-meta">projeção da semana: ${projection.gains.map(({ key, value }) => `${key.slice(0, 3).toUpperCase()} +${value.toFixed(1)}`).join(" | ")} | frescor ${projection.freshness >= 0 ? "+" : ""}${projection.freshness}</div>
        </div>
      </article>
    `;
  }).join("");
  trainingBoardEl.querySelectorAll("[data-training-block]").forEach((select) => {
    select.addEventListener("change", () => {
      const swimmerId = Number(select.dataset.trainingBlock);
      state.trainingBlockById[swimmerId] = select.value;
      saveState();
      renderTrainingBoard();
      renderCompetitionHub();
    });
  });
  trainingBoardEl.querySelectorAll("[data-training-complement]").forEach((select) => {
    select.addEventListener("change", () => {
      state.trainingComplementById[Number(select.dataset.trainingComplement)] = select.value;
      saveState();
      renderTrainingBoard();
      renderCompetitionHub();
    });
  });
}

function renderCompetitionHub(message = "", isWarning = false) {
  if (!state.season) {
    competitionHubEl.className = "matchday-hub empty";
    competitionHubEl.innerHTML = "Monte o elenco e inicie a temporada para liberar a escalação.";
    simulateMeetButton.disabled = true;
    return;
  }
  if (state.season.currentMeetIndex >= MEETS.length) {
    const finalRank = state.season.standings.findIndex((entry) => entry.id === USER_TEAM_ID) + 1;
    competitionHubEl.className = "matchday-hub";
    competitionHubEl.innerHTML = `<strong>Circuito encerrado.</strong><div class="player-meta">${getTeamName()} terminou em ${finalRank}º lugar com ${state.season.standings.find((entry) => entry.id === USER_TEAM_ID)?.points || 0} pontos.</div>`;
    simulateMeetButton.disabled = true;
    return;
  }

  const meet = getMeetInfo();
  const validation = validateLineup();
  const counts = getAssignmentCounts();
  const lastMeet = state.season.meetResults[state.season.meetResults.length - 1];
  const management = getWeeklyManagementEffects();

  competitionHubEl.className = "matchday-hub";
  competitionHubEl.innerHTML = `
    <div class="competition-layout">
      <div class="competition-main">
        <article class="summary-box meet-overview">
          <span class="season-key">Etapa da semana ${meet.week}</span>
          <strong>${meet.name} - ${meet.city}</strong>
          <div class="player-meta">${meet.note}</div>
          <div class="player-meta">Cada prova aceita ${ENTRIES_PER_EVENT} atletas por equipe. Limite individual: ${MAX_EVENTS_PER_SWIMMER} provas.</div>
          ${message ? `<div class="${isWarning ? "warning-text" : ""}">${message}</div>` : ""}
          <div class="${validation.valid ? "player-meta" : "danger-text"}">${validation.message}</div>
        </article>
        <div class="lineup-grid event-board">
          ${EVENT_DEFINITIONS.map((event) => {
            const swimmers = getSelectedByGender(event.gender).map(getAdjustedSwimmer);
            const recommendations = getRecommendedSwimmers(event, 3);
            return `
              <article class="lineup-event">
                <div class="lineup-header">
                  <div>
                    <strong>${event.label} ${event.categoryLabel}</strong>
                    <div class="player-meta">WR ${event.wrLabel.replace("WR ", "")} | BR ${event.brLabel.replace("BR ", "")}</div>
                  </div>
                  <span class="tag-pill">${event.points.slice(0, 4).join(" / ")}</span>
                </div>
                <div class="player-meta">melhores tempos projetados: ${recommendations.map((entry) => `${entry.swimmer.name} ${formatTime(entry.time)}`).join(" | ")}</div>
                <div class="relay-slots">
                  ${Array.from({ length: ENTRIES_PER_EVENT }, (_, slot) => `
                    <label class="control-card compact-control">
                      <span>${slot + 1}ª inscrição</span>
                      <select data-lineup-event="${event.id}" data-lineup-slot="${slot}">
                        <option value="">Selecionar</option>
                        ${swimmers.map((swimmer) => `<option value="${swimmer.id}"${state.lineup[event.id][slot] === swimmer.id || state.lineup[event.id][slot] === String(swimmer.id) ? " selected" : ""}>${swimmer.name} (${formatTime(getProjectedEventTime(swimmer, event, meet))})</option>`).join("")}
                      </select>
                    </label>
                  `).join("")}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
      <aside class="competition-side">
        <article class="summary-box compact-summary">
          <span class="season-key">Semana ativa</span>
          <strong>${management.cycle.label}</strong>
          <div class="player-meta">${management.intensity.label} | ${management.recovery.label} | academia ${management.gym.label}</div>
        </article>
        <div class="load-board">
          ${getSelectedSwimmers().map(getAdjustedSwimmer).map((swimmer) => {
            const load = counts[swimmer.id] || 0;
            const statusClass = load > MAX_EVENTS_PER_SWIMMER ? "bad" : load === MAX_EVENTS_PER_SWIMMER ? "warn" : "";
            return `
              <article class="load-card">
                <div class="card-topline">
                  <strong>${swimmer.name}</strong>
                  <span class="status-pill ${statusClass}">${load === 0 ? "livre" : "escalado"}</span>
                </div>
                <div class="player-meta">${swimmer.gender} | ${getSwimmerArchetype(swimmer)} | melhor prova: ${getBestEventLabel(swimmer)}</div>
                <div class="assignment-grid compact-grid">
                  <span>provas ${load}</span>
                  <span>frescor ${swimmer.freshness}</span>
                  <span>limite ${MAX_EVENTS_PER_SWIMMER}</span>
                </div>
              </article>
            `;
          }).join("")}
        </div>
        <div class="table-shell">
          <table class="standings-table">
            <thead>
              <tr><th colspan="3">Classificação da última etapa</th></tr>
              <tr><th>#</th><th>Equipe</th><th>Pontos</th></tr>
            </thead>
            <tbody>
              ${lastMeet ? lastMeet.teamRankings.map((entry, index) => `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.points}</td></tr>`).join("") : `<tr><td colspan="3">A classificação da etapa aparece depois da primeira simulação semanal.</td></tr>`}
            </tbody>
          </table>
        </div>
      </aside>
    </div>
  `;

  competitionHubEl.querySelectorAll("[data-lineup-event]").forEach((select) => {
    select.addEventListener("change", () => {
      const eventId = select.dataset.lineupEvent;
      const slot = Number(select.dataset.lineupSlot);
      state.lineup[eventId][slot] = select.value ? Number(select.value) : "";
      saveState();
      renderCompetitionHub();
    });
  });

  simulateMeetButton.disabled = !validation.valid;
}

function renderSeason() {
  if (!state.season) {
    standingsTableEl.innerHTML = `<div class="matchday-hub empty">A classificação geral aparece depois do início da temporada.</div>`;
    seasonLogEl.innerHTML = `<div class="matchday-hub empty">Os relatórios semanais entram aqui ao longo do circuito.</div>`;
    seasonRankEl.textContent = "--";
    seasonPointsEl.textContent = "0";
    seasonStageEl.textContent = `0 / ${MEETS.length}`;
    seasonLastResultEl.textContent = "--";
    return;
  }
  const rank = state.season.standings.findIndex((entry) => entry.id === USER_TEAM_ID) + 1;
  const points = state.season.standings.find((entry) => entry.id === USER_TEAM_ID)?.points || 0;
  const lastMeet = state.season.meetResults[state.season.meetResults.length - 1];
  seasonRankEl.textContent = `${rank}º`;
  seasonPointsEl.textContent = points;
  seasonStageEl.textContent = `${Math.min(state.season.currentMeetIndex, MEETS.length)} / ${MEETS.length}`;
  seasonLastResultEl.textContent = lastMeet ? `${lastMeet.points} pts` : "--";
  standingsTableEl.innerHTML = `
    <table class="standings-table">
      <thead>
        <tr><th>#</th><th>Equipe</th><th>Pontos</th><th>Últimas semanas</th></tr>
      </thead>
      <tbody>
        ${state.season.standings.map((entry, index) => `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.points}</td><td>${entry.placements.slice(-3).map((placement) => placement.points).join(" / ") || "--"}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
  seasonLogEl.innerHTML = MEETS.map((meet, index) => {
    const result = state.season.meetResults[index];
    if (!result) {
      return `<article class="season-log-entry"><strong>Semana ${meet.week} - ${meet.name}</strong><p>Etapa ainda não disputada.</p></article>`;
    }
    const topTeams = result.teamRankings.slice(0, 3).map((entry, position) => `${position + 1}º ${entry.name} (${entry.points})`).join(" | ");
    return `
      <article class="season-log-entry">
        <strong>Semana ${result.week} - ${result.meet} - ${result.city}</strong>
        <p>${result.note}</p>
        <p>${getTeamName()}: ${result.points} pontos | colocação na etapa: ${result.position}º</p>
        <p>Pódio da etapa: ${topTeams}</p>
      </article>
    `;
  }).join("");
}

function renderControls() {
  const rosterValidation = validateRoster();
  teamNameInput.value = state.teamName;
  startSeasonButton.disabled = Boolean(state.season) || !rosterValidation.valid;
  startSeasonButton.title = rosterValidation.valid ? "" : rosterValidation.message;
}

function switchTab(tabName) {
  state.activeTab = tabName;
  document.body.dataset.activeTab = tabName;
  tabButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.tabTarget === tabName));
  tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName));
}

function sanitizeSeasonData() {
  if (!state.season) return;
  getSelectedSwimmers().forEach((swimmer) => {
    state.season.progress[swimmer.id] = sanitizeProgress(swimmer, state.season.progress[swimmer.id] || {});
    state.season.freshness[swimmer.id] = clamp(state.season.freshness[swimmer.id] ?? 86, 58, 100);
  });
}

function migrateLoadedState(saved) {
  state.teamName = saved.teamName || "";
  state.selectedIds = Array.isArray(saved.selectedIds) ? saved.selectedIds : [];
  state.season = saved.season || null;
  state.trainingBlockById = saved.trainingBlockById || {};
  state.trainingComplementById = saved.trainingComplementById || {};
  state.weeklyManagement = { ...createWeeklyManagement(), ...(saved.weeklyManagement || {}) };
  state.activeTab = saved.activeTab || "front-office";
  getSelectedSwimmers().forEach((swimmer) => {
    if (!state.trainingBlockById[swimmer.id]) state.trainingBlockById[swimmer.id] = getDefaultTrainingBlock(swimmer);
    if (!state.trainingComplementById[swimmer.id]) state.trainingComplementById[swimmer.id] = getDefaultTrainingComplement(swimmer);
  });
  if (saved.lineup) {
    const freshLineup = createEmptyLineup();
    Object.entries(freshLineup).forEach(([eventId]) => {
      const previous = saved.lineup[eventId];
      if (Array.isArray(previous)) {
        freshLineup[eventId] = previous.slice(0, ENTRIES_PER_EVENT);
        while (freshLineup[eventId].length < ENTRIES_PER_EVENT) freshLineup[eventId].push("");
      }
    });
    state.lineup = freshLineup;
  } else {
    state.lineup = createEmptyLineup();
  }
  sanitizeSeasonData();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    teamName: state.teamName,
    selectedIds: state.selectedIds,
    season: state.season,
    trainingBlockById: state.trainingBlockById,
    trainingComplementById: state.trainingComplementById,
    weeklyManagement: state.weeklyManagement,
    lineup: state.lineup,
    activeTab: state.activeTab
  }));
}

function loadState() {
  try {
    const raw = [localStorage.getItem(STORAGE_KEY), ...LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key))].find(Boolean);
    if (raw) migrateLoadedState(JSON.parse(raw));
  } catch (error) {
    // ignore invalid saves
  }
}

function bindInputs() {
  teamNameInput.addEventListener("change", () => {
    state.teamName = teamNameInput.value.trim().slice(0, 32);
    if (state.season?.standings?.length) {
      const team = state.season.standings.find((entry) => entry.id === USER_TEAM_ID);
      if (team) team.name = getTeamName();
    }
    saveState();
    render();
  });
  resetButton.addEventListener("click", resetTeam);
  startSeasonButton.addEventListener("click", startSeason);
  simulateMeetButton.addEventListener("click", simulateMeet);
  tabButtons.forEach((button) => button.addEventListener("click", () => {
    switchTab(button.dataset.tabTarget);
    saveState();
  }));
}

function render() {
  renderControls();
  renderRoster();
  renderMarket();
  renderTeamStats();
  renderTrainingManagement();
  renderTrainingBoard();
  renderCompetitionHub();
  renderSeason();
  switchTab(state.activeTab);
}

loadState();
bindInputs();
render();
window.TemporadaTotal?.registerLegacyRuntime?.({
  state,
  actions: {
    render,
    startSeason,
    simulateMeet,
    resetTeam,
    saveState,
    loadState,
    switchTab
  },
  selectors: {
    getSelectedSwimmers,
    getTeamProfile,
    getMeetInfo,
    getGenderCounts,
    getBudgetUsed
  }
});
