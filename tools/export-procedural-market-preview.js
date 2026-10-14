const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");

const filesToLoad = [
  "shared/seeded-rng.js",
  "shared/procedural-datasets.js",
  "shared/procedural-lore-datasets.js",
  "shared/procedural-scouting.js",
  "shared/procedural-player-generator.js",
  "temporada-basquete/generation-config.js",
  "shared/procedural-roster-generator.js",
  "shared/procedural-club-calibration.js",
  "shared/procedural-club-generator.js",
  "shared/procedural-market-generator.js"
];

const context = vm.createContext({
  console,
  window: {}
});

filesToLoad.forEach((relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);
  const code = fs.readFileSync(absolutePath, "utf8");
  vm.runInContext(code, context, { filename: relativePath });
});

function csvEscape(value) {
  if (value == null) return "";
  const text = Array.isArray(value) ? value.join(" | ") : String(value);
  if (/[",\r\n;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function buildCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
}

function getSummaryRow(seed, market) {
  const summary = market.summary || {};
  return {
    seed,
    profile: market.profile,
    players: market.players.length,
    average_salary: summary.averageSalary,
    total_salary: summary.totalSalary,
    average_current: summary.averageCurrentAbility,
    average_potential: summary.averagePotential,
    average_age: summary.averageAge,
    average_gap: summary.averageDevelopmentGap,
    guards: (summary.byPosition?.PG || 0) + (summary.byPosition?.SG || 0),
    wings: summary.byPosition?.SF || 0,
    bigs: (summary.byPosition?.PF || 0) + (summary.byPosition?.C || 0),
    prospects: summary.byPool?.prospect || 0,
    impact_players: summary.byPool?.impact || 0,
    warnings: market.warnings
  };
}

function getPlayerRows(seed, market) {
  return market.players.map((player, index) => ({
    seed,
    profile: market.profile,
    rank: index + 1,
    player_id: player.id,
    name: player.name,
    pos: player.pos,
    age: player.age,
    current_ability: player.currentAbility,
    potential: player.potential,
    development_gap: player.developmentGap,
    salary: player.salary,
    market_value_score: player.marketValueScore,
    market_pool: player.marketPool,
    market_fit: player.marketFit,
    archetype: player.archetype?.label || player.tag || "",
    risk_label: player.riskLabel || "",
    scout_notes: player.scoutNotes || []
  }));
}

function getFitRows(seed, club, market, fit) {
  return (fit.topFits || []).map((player, index) => ({
    seed,
    profile: market.profile,
    club_name: club.name,
    club_lore: club.lore?.label || "",
    club_roster_style: club.rosterStyle,
    club_budget_left: fit.budgetLeft,
    club_intent: fit.intent,
    needed_positions: fit.neededPositions || [],
    fit_rank: index + 1,
    fit_score: player.clubFitScore,
    fit_reason: player.clubFitReason,
    affordable: player.affordable ? 1 : 0,
    sandbox_verdict: player.sandbox?.verdict,
    sandbox_outgoing_player: player.sandbox?.outgoing?.name || "",
    sandbox_current_delta: player.sandbox?.delta?.averageCurrentAbility,
    sandbox_potential_delta: player.sandbox?.delta?.averagePotential,
    sandbox_salary_delta: player.sandbox?.delta?.totalSalary,
    sandbox_budget_left_after: player.sandbox?.after?.budgetLeft,
    sandbox_needs_resolved: player.sandbox?.delta?.needsResolved,
    sandbox_warnings: player.sandbox?.warnings || [],
    player_id: player.id,
    player_name: player.name,
    pos: player.pos,
    age: player.age,
    current_ability: player.currentAbility,
    potential: player.potential,
    salary: player.salary,
    market_pool: player.marketPool,
    market_value_score: player.marketValueScore
  }));
}

const countArg = Number(process.argv[2]);
const seedCount = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 50;
const prefix = process.argv[3] || "MERCADO-P7-BASQUETE";
const outputDir = process.argv[4] || path.join(rootDir, "analises");
const profiles = ["balanced", "win_now", "budget", "development"];
const summaryRows = [];
const playerRows = [];
const fitRows = [];

for (let index = 0; index < seedCount; index += 1) {
  const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
  const club = context.window.TemporadaTotal.generateProceduralBasketballClub(seed);
  profiles.forEach((profile) => {
    const market = context.window.TemporadaTotal.generateProceduralBasketballMarket(seed, {
      count: 24,
      profile
    });
    const fit = context.window.TemporadaTotal.analyzeProceduralMarketFitForClub(club, market, { limit: 8 });
    summaryRows.push(getSummaryRow(seed, market));
    playerRows.push(...getPlayerRows(seed, market));
    fitRows.push(...getFitRows(seed, club, market, fit));
  });
}

fs.mkdirSync(outputDir, { recursive: true });
const summaryPath = path.join(outputDir, `mercado-procedural-${seedCount}-seeds.csv`);
const playersPath = path.join(outputDir, `mercado-procedural-jogadores-${seedCount}-seeds.csv`);
const fitPath = path.join(outputDir, `mercado-procedural-encaixes-${seedCount}-seeds.csv`);
fs.writeFileSync(summaryPath, `${buildCsv(summaryRows)}\n`, "utf8");
fs.writeFileSync(playersPath, `${buildCsv(playerRows)}\n`, "utf8");
fs.writeFileSync(fitPath, `${buildCsv(fitRows)}\n`, "utf8");

const avg = (key) => summaryRows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0) / Math.max(1, summaryRows.length);
const warningCount = summaryRows.filter((row) => String(row.warnings || "").length).length;

console.log(`CSV de mercados: ${summaryPath}`);
console.log(`CSV de jogadores do mercado: ${playersPath}`);
console.log(`CSV de encaixes do mercado: ${fitPath}`);
console.log(`Seeds analisadas: ${seedCount}`);
console.log(`Cenarios de mercado: ${summaryRows.length}`);
console.log(`Atletas gerados: ${playerRows.length}`);
console.log(`Encaixes ranqueados: ${fitRows.length}`);
console.log(`Salario medio: $${Math.round(avg("average_salary") * 10) / 10}M`);
console.log(`Forca media: ${Math.round(avg("average_current") * 10) / 10}`);
console.log(`Mercados com warnings: ${warningCount}`);
