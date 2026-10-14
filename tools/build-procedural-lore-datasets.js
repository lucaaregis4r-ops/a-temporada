const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const loreDir = fs.readdirSync(rootDir).find((name) => name.toLowerCase().startsWith("lores"));

if (!loreDir) {
  throw new Error("Pasta de lores nao encontrada.");
}

const lorePath = path.join(rootDir, loreDir, "Banco_100_Lores_Liga.md");
const narrativesPath = path.join(rootDir, loreDir, "Banco_100_Lores_Narrativas.json");
const decisionsPath = path.join(rootDir, loreDir, "Banco_2000_Decisoes_Ramificadas_Unificado.json");
const outputPath = path.join(rootDir, "shared", "procedural-lore-datasets.js");

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function cleanValue(value) {
  return String(value || "")
    .replace(/\s+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function splitList(value) {
  return cleanValue(value)
    .replace(/\.$/, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseModifiers(value) {
  const match = String(value || "").match(/`([^`]+)`/);
  const source = match ? match[1] : value;
  return String(source || "")
    .replace(/\.$/, "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((modifiers, part) => {
      const [key, rawValue] = part.split(":").map((item) => item.trim());
      if (!key) return modifiers;
      const numberValue = Number(String(rawValue || "").replace("+", ""));
      modifiers[key] = Number.isFinite(numberValue) ? numberValue : rawValue;
      return modifiers;
    }, {});
}

function getField(fields, key) {
  return fields[normalizeKey(key)] || "";
}

function mapBudgetLevel(value) {
  const normalized = normalizeText(value);
  if (normalized.includes("elite")) return "elite";
  if (normalized.includes("alto")) return "alto";
  if (normalized.includes("baixo")) return "baixo";
  return "medio";
}

function mapBudgetBias(level, modifiers) {
  const base = {
    baixo: 0.72,
    medio: 1,
    alto: 1.18,
    elite: 1.38
  }[level] || 1;
  return Math.round((base + (Number(modifiers.budgetFlexibility) || 0) / 100) * 100) / 100;
}

function mapObjective(value) {
  const normalized = normalizeText(value);
  if (normalized.includes("campe")) return "brigar pelo titulo";
  if (normalized.includes("nao cair")) return "evitar rebaixamento";
  if (normalized.includes("playoffs")) return "chegar aos playoffs";
  if (normalized.includes("base")) return "desenvolver jovens";
  return "terminar no meio da tabela";
}

function mapAmbition(value) {
  const normalized = normalizeText(value);
  if (normalized.includes("campe")) return "titulo";
  if (normalized.includes("nao cair")) return "sobrevivencia";
  if (normalized.includes("playoffs")) return "playoffs";
  if (normalized.includes("base")) return "desenvolvimento";
  return "estabilidade";
}

function pressureToNumber(value) {
  const normalized = normalizeText(value);
  if (normalized.includes("muito alta")) return 90;
  if (normalized.includes("alta")) return 75;
  if (normalized.includes("media")) return 55;
  if (normalized.includes("baixa")) return 35;
  return 50;
}

function numberToPressure(value) {
  if (value >= 82) return "muito alta";
  if (value >= 65) return "alta";
  if (value <= 40) return "baixa";
  return "media";
}

function inferStrengthTier({ objective, budgetLevel }) {
  const normalizedObjective = normalizeText(objective);
  if (normalizedObjective.includes("nao cair")) return "low";
  if (normalizedObjective.includes("campe")) return "good";
  if (normalizedObjective.includes("playoffs") && (budgetLevel === "alto" || budgetLevel === "elite")) return "good";
  if (budgetLevel === "baixo") return "low";
  return "normal";
}

function inferRosterProfile({ category, objective, budgetLevel, strengths, weaknesses }) {
  const haystack = normalizeText([category, objective, strengths.join(" "), weaknesses.join(" ")].join(" "));
  if (haystack.includes("veteran") || haystack.includes("idade") || haystack.includes("ultimo")) return "veteran_win_now";
  if (haystack.includes("base") || haystack.includes("formacao") || haystack.includes("promessa") || haystack.includes("jovem")) return "prospect_core";
  if (haystack.includes("defesa") || haystack.includes("disciplina") || haystack.includes("coletivo")) return "defense_first";
  if (haystack.includes("ataque") || haystack.includes("ofensivo") || haystack.includes("artistas")) return "offense_first";
  if (haystack.includes("crise") || haystack.includes("instavel") || haystack.includes("conflito")) return "unbalanced";
  if (budgetLevel === "elite") return "expensive_unbalanced";
  if (budgetLevel === "baixo" || normalizeText(objective).includes("nao cair")) return "low_budget_fight";
  return "balanced";
}

function inferTraits({ category, strengths, weaknesses, events }) {
  return Array.from(new Set([
    normalizeKey(category),
    ...strengths.slice(0, 3).map(normalizeKey),
    ...weaknesses.slice(0, 2).map(normalizeKey),
    ...events.slice(0, 2).map(normalizeKey)
  ].filter(Boolean)));
}

function buildTeamState({ fanPressure, boardPressure, mediaExposure, modifiers }) {
  const fan = pressureToNumber(fanPressure);
  const board = pressureToNumber(boardPressure);
  const media = pressureToNumber(mediaExposure);
  const initialPressure = Number(modifiers.initialPressure) || 0;
  const initialFatigue = Number(modifiers.initialFatigue) || 0;
  const initialCohesion = Number(modifiers.initialCohesion) || 0;
  return {
    boardTrust: 50,
    fanSupport: Math.max(0, Math.min(100, 50 + Math.round((fan - 50) * 0.35))),
    lockerRoom: 50,
    staffTrust: 50,
    clubTraditionAlignment: 50,
    mediaRelationship: Math.max(0, Math.min(100, 100 - Math.round(media * 0.35))),
    groupCohesion: Math.max(0, Math.min(100, 50 + initialCohesion)),
    squadFatigue: Math.max(0, Math.min(100, initialFatigue)),
    injuryRisk: Math.max(0, Math.min(100, Math.round(initialFatigue * 0.45))),
    pressureLevel: Math.max(0, Math.min(100, Math.round((fan + board + media) / 3 + initialPressure))),
    morale: 50
  };
}

function parseLoreMarkdown(text) {
  const headingRegex = /^##\s+(\d{3})\s+[—-]\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(text))) {
    headings.push({
      index: match.index,
      number: match[1],
      title: cleanValue(match[2])
    });
  }

  return headings.map((heading, index) => {
    const next = headings[index + 1]?.index ?? text.length;
    const block = text.slice(heading.index, next);
    const fields = {};
    const fieldRegex = /\*\*([^:*]+):\*\*\s*([^\n]+)/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(block))) {
      fields[normalizeKey(fieldMatch[1])] = cleanValue(fieldMatch[2]);
    }

    const rawModifiers = getField(fields, "Modificadores iniciais sugeridos");
    const modifiers = parseModifiers(rawModifiers);
    const objective = getField(fields, "Objetivo principal");
    const budgetLevel = mapBudgetLevel(getField(fields, "Orcamento"));
    const fanPressure = getField(fields, "Pressao da torcida");
    const boardPressure = getField(fields, "Pressao da diretoria");
    const mediaExposure = getField(fields, "Exposicao na midia");
    const strengths = splitList(getField(fields, "Forcas narrativas"));
    const weaknesses = splitList(getField(fields, "Fraquezas narrativas"));
    const frequentEvents = splitList(getField(fields, "Eventos frequentes"));
    const pressure = numberToPressure((pressureToNumber(fanPressure) + pressureToNumber(boardPressure)) / 2);

    return {
      id: getField(fields, "ID").replace(/`/g, ""),
      number: Number(heading.number),
      label: heading.title,
      category: getField(fields, "Categoria"),
      description: getField(fields, "Resumo"),
      objective: mapObjective(objective),
      objectiveKey: normalizeKey(objective),
      rawObjective: objective,
      budgetLevel,
      budgetBias: mapBudgetBias(budgetLevel, modifiers),
      pressure,
      fanPressure,
      boardPressure,
      mediaExposure,
      ambition: mapAmbition(objective),
      rosterProfile: inferRosterProfile({ category: getField(fields, "Categoria"), objective, budgetLevel, strengths, weaknesses }),
      strengthTier: inferStrengthTier({ objective, budgetLevel }),
      strengths,
      weaknesses,
      frequentEvents,
      modifiers,
      initialTeamState: buildTeamState({ fanPressure, boardPressure, mediaExposure, modifiers }),
      traits: inferTraits({ category: getField(fields, "Categoria"), strengths, weaknesses, events: frequentEvents })
    };
  });
}

function loadNarratives(lores) {
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));
  if (!Array.isArray(narratives)) throw new Error("Narrativas devem ser uma lista.");

  const loreIds = new Set(lores.map((lore) => lore.id));
  if (loreIds.size !== lores.length || lores.length !== 100) {
    throw new Error(`Banco de lores deve conter 100 IDs unicos; encontrados ${lores.length} registros e ${loreIds.size} IDs.`);
  }

  const narrativeById = new Map();
  const openings = new Set();
  const dilemmas = new Set();
  for (const entry of narratives) {
    if (!entry || typeof entry.id !== "string" || !loreIds.has(entry.id)) {
      throw new Error(`ID narrativo desconhecido: ${entry?.id}`);
    }
    if (narrativeById.has(entry.id)) throw new Error(`ID narrativo duplicado: ${entry.id}`);
    for (const [field, limit, seen] of [["opening", 2, openings], ["dilemma", 1, dilemmas]]) {
      const value = entry[field];
      const sentences = typeof value === "string" ? (value.match(/[.!?](?=\s|$)/g) || []).length : 0;
      if (!value || value !== value.trim() || !/[.!?]$/.test(value) || sentences < 1 || sentences > limit) {
        throw new Error(`${entry.id}: ${field} deve ter de 1 a ${limit} frase(s) completa(s).`);
      }
      if (seen.has(value)) throw new Error(`${field} repetido em ${entry.id}.`);
      seen.add(value);
    }
    narrativeById.set(entry.id, entry);
  }
  const missing = lores.filter((lore) => !narrativeById.has(lore.id)).map((lore) => lore.id);
  if (missing.length || narratives.length !== lores.length) {
    throw new Error(`Narrativas incompletas: ${missing.join(", ") || `${narratives.length} entradas para ${lores.length} lores`}.`);
  }
  return narrativeById;
}

function buildDecisionSummary() {
  if (!fs.existsSync(decisionsPath)) return {};
  const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));
  return decisions.reduce((summary, decision) => {
    const loreId = decision.loreId;
    if (!loreId) return summary;
    const item = summary[loreId] || {
      decisionCount: 0,
      decisionTypes: [],
      sampleTitles: [],
      tags: []
    };
    item.decisionCount += 1;
    if (decision.decisionType && !item.decisionTypes.includes(decision.decisionType)) item.decisionTypes.push(decision.decisionType);
    if (decision.title && item.sampleTitles.length < 5 && !item.sampleTitles.includes(decision.title)) item.sampleTitles.push(decision.title);
    (decision.tags || []).forEach((tag) => {
      if (item.tags.length < 16 && !item.tags.includes(tag)) item.tags.push(tag);
    });
    summary[loreId] = item;
    return summary;
  }, {});
}

const text = fs.readFileSync(lorePath, "utf8");
const decisionSummaryByLore = buildDecisionSummary();
const parsedLores = parseLoreMarkdown(text);
const narrativeById = loadNarratives(parsedLores);
const lores = parsedLores.map((lore) => {
  const narrative = narrativeById.get(lore.id);
  return {
    ...lore,
    ...(Array.isArray(narrative.sports) && narrative.sports.length ? { sportIds: narrative.sports } : {}),
    opening: narrative.opening,
    dilemma: narrative.dilemma,
    decisionSummary: decisionSummaryByLore[lore.id] || {
      decisionCount: 0,
      decisionTypes: [],
      sampleTitles: [],
      tags: []
    }
  };
});

const output = `(function () {
  const ProceduralLoreDatasets = ${JSON.stringify({
    source: {
      loreFile: `${loreDir}/Banco_100_Lores_Liga.md`,
      narrativesFile: `${loreDir}/Banco_100_Lores_Narrativas.json`,
      decisionsFile: `${loreDir}/Banco_2000_Decisoes_Ramificadas_Unificado.json`
    },
    lores
  }, null, 2)};

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralLoreDatasets
  };
})();
`;

fs.writeFileSync(outputPath, output, "utf8");
console.log(`Lores geradas: ${lores.length}`);
console.log(`Arquivo: ${outputPath}`);
console.log(`Decisoes indexadas: ${Object.values(decisionSummaryByLore).reduce((sum, item) => sum + item.decisionCount, 0)}`);
