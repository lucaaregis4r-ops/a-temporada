const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { console };
context.window = context;
context.TemporadaTotal = {};
vm.createContext(context);

for (const relativePath of [
  "shared/procedural-lore-datasets.js",
  "shared/procedural-club-generator.js",
  "shared/procedural-decision-bank-data.js",
  "shared/procedural-decision-bank.js"
]) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  vm.runInContext(source, context, { filename: relativePath });
}

const bank = context.TemporadaTotal.ProceduralDecisionBank;
const decisions = bank.getData();
const getLoresForSport = context.TemporadaTotal.ProceduralClubGenerator.getLoresForSport;
const sports = ["basquete", "futsal", "volei"];
const expectedLoreIds = [
  "lore_075_o_rolo_compressor",
  "lore_076_o_time_pequeno_brilhante",
  "lore_084_a_escola_de_armadores",
  "lore_085_torre_gemea",
  "lore_086_chuva_de_tres"
];

assert(decisions.length > 0, "O banco de decisões deve estar carregado.");
const basketballLores = getLoresForSport("basquete");
assert.strictEqual(basketballLores.length, 100, "Basquete deve preservar os 100 lores.");
const portableLoreIds = new Set(getLoresForSport("futsal").map((lore) => lore.id));
const volleyballLoreIds = new Set(getLoresForSport("volei").map((lore) => lore.id));
assert(portableLoreIds.size > 70, "Futsal deve manter variedade de lores.");
assert(volleyballLoreIds.size > 70, "Vôlei deve manter variedade de lores.");
for (const loreId of expectedLoreIds) {
  assert(!portableLoreIds.has(loreId), `${loreId}: arquétipo de basquete vazou para futsal.`);
  assert(!volleyballLoreIds.has(loreId), `${loreId}: arquétipo de basquete vazou para vôlei.`);
}
assert(portableLoreIds.has("lore_001_last_dance"), "Lores genéricos devem continuar disponíveis em futsal.");
assert(volleyballLoreIds.has("lore_001_last_dance"), "Lores genéricos devem continuar disponíveis em vôlei.");

for (const sportId of sports) {
  const compatible = decisions.filter((decision) => bank.isDecisionCompatibleWithSport(decision, sportId));
  assert(compatible.length > 100, `${sportId}: o filtro precisa preservar variedade de decisões.`);
  assert(compatible.some((decision) => !expectedLoreIds.some((id) => id.endsWith(decision.loreId || ""))), `${sportId}: deve haver decisões genéricas.`);
}

for (const decision of decisions.filter((item) => expectedLoreIds.includes(item.loreId))) {
  assert(bank.isDecisionCompatibleWithSport(decision, "basquete"), `${decision.decisionId}: basquete deve preservar os próprios arquétipos.`);
  assert(!bank.isDecisionCompatibleWithSport(decision, "futsal"), `${decision.decisionId}: arquétipo de basquete vazou para futsal.`);
  assert(!bank.isDecisionCompatibleWithSport(decision, "volei"), `${decision.decisionId}: arquétipo de basquete vazou para vôlei.`);
}

const generic = { title: "Conversa com a diretoria", situation: "O grupo precisa definir uma resposta para a semana.", tags: ["diretoria"], options: [] };
for (const sportId of sports) {
  assert(bank.isDecisionCompatibleWithSport(generic, sportId), `Decisões genéricas devem continuar disponíveis em ${sportId}.`);
}

const incompatibleSamples = [
  { sportId: "futsal", decision: { title: "Plano de arremesso", situation: "O armador procura o rebote no garrafão.", options: [] } },
  { sportId: "volei", decision: { title: "Plano de arremesso", situation: "O armador procura o rebote no garrafão.", options: [] } },
  { sportId: "basquete", decision: { title: "Cobrança de penalti", situation: "O goleiro protege o gol.", options: [] } },
  { sportId: "basquete", decision: { title: "Pressão no saque", situation: "O levantador organiza a recepção.", options: [] } },
  { sportId: "futsal", decision: { title: "Pressão no saque", situation: "O levantador organiza a recepção.", options: [] } }
];
for (const sample of incompatibleSamples) {
  assert(!bank.isDecisionCompatibleWithSport(sample.decision, sample.sportId), `${sample.sportId}: vocabulário incompatível passou pelo filtro.`);
}

console.log(`Verificação aprovada: ${decisions.length} decisões; ${sports.map((sportId) => `${sportId} ${decisions.filter((item) => bank.isDecisionCompatibleWithSport(item, sportId)).length}`).join(", ")}.`);
