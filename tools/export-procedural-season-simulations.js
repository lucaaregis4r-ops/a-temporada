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
  "shared/procedural-league-debug.js",
  "shared/procedural-league-generator.js",
  "shared/procedural-season-simulator.js"
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

function getLeagueRow(seed, league, simulation) {
  const diagnostics = league.diagnostics || {};
  return {
    seed,
    champion: simulation.summary.championName,
    champion_projected_rank: simulation.summary.championProjectedRank,
    top4_retention_pct: simulation.summary.top4RetentionPct,
    upset_rate: simulation.summary.upsetRate,
    rank_correlation: simulation.summary.rankCorrelation,
    simulation_warnings: simulation.summary.warnings,
    league_warnings: [...(league.summary?.warnings || []), ...(diagnostics.warnings || [])],
    avg_overall: league.summary?.averageOverall,
    top_bottom_gap: diagnostics.strengthSpread?.gap,
    overall_range: diagnostics.overallRange,
    salary_pressure_p90: diagnostics.salaryPressure?.p90,
    user_rank_projected: league.teams.find((team) => team.id === league.userTeamId)?.projectedRank || "",
    user_rank_simulated: simulation.standings.find((row) => row.teamId === league.userTeamId)?.simulatedRank || ""
  };
}

function getStandingRows(seed, simulation) {
  return simulation.standings.map((row) => ({
    seed,
    simulated_rank: row.simulatedRank,
    projected_rank: row.projectedRank,
    team_id: row.teamId,
    team_name: row.name,
    lore_label: row.loreLabel,
    strength_tier: row.strengthTier,
    roster_style: row.rosterStyle,
    rating: row.rating,
    wins: row.wins,
    losses: row.losses,
    points_for: row.pointsFor,
    points_against: row.pointsAgainst,
    point_diff: row.pointDiff
  }));
}

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 50;
const prefix = process.argv[3] || "SIM-LIGA-BASQUETE";
const outputDir = process.argv[4] || path.join(rootDir, "analises");
const leagueRows = [];
const standingRows = [];

for (let index = 0; index < count; index += 1) {
  const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
  const league = context.window.TemporadaTotal.generateProceduralBasketballLeague(seed, { size: 16 });
  const simulation = context.window.TemporadaTotal.simulateProceduralLeagueSeason(league, { simulationIndex: 1 });
  leagueRows.push(getLeagueRow(seed, league, simulation));
  standingRows.push(...getStandingRows(seed, simulation));
}

fs.mkdirSync(outputDir, { recursive: true });
const leaguePath = path.join(outputDir, `simulacao-ligas-${count}-seeds.csv`);
const standingsPath = path.join(outputDir, `simulacao-classificacoes-${count}-seeds.csv`);
fs.writeFileSync(leaguePath, `${buildCsv(leagueRows)}\n`, "utf8");
fs.writeFileSync(standingsPath, `${buildCsv(standingRows)}\n`, "utf8");

const avg = (key) => leagueRows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0) / Math.max(1, leagueRows.length);
const simulationWarningCount = leagueRows.filter((row) => String(row.simulation_warnings || "").length).length;
const leagueWarningCount = leagueRows.filter((row) => String(row.league_warnings || "").length).length;

console.log(`CSV de simulacoes: ${leaguePath}`);
console.log(`CSV de classificacoes: ${standingsPath}`);
console.log(`Ligas simuladas: ${leagueRows.length}`);
console.log(`Linhas de classificacao: ${standingRows.length}`);
console.log(`Top4 medio preservado: ${Math.round(avg("top4_retention_pct") * 10) / 10}%`);
console.log(`Taxa media de zebra: ${Math.round(avg("upset_rate") * 10) / 10}%`);
console.log(`Correlacao media rank: ${Math.round(avg("rank_correlation") * 1000) / 1000}`);
console.log(`Ligas com warnings de simulacao: ${simulationWarningCount}`);
console.log(`Ligas com warnings de geracao: ${leagueWarningCount}`);
