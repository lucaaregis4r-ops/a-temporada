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
  "shared/procedural-league-generator.js"
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
  if (/[",\r\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
}

function getRow(seed, league) {
  const diagnostics = league.diagnostics || {};
  const strengthSpread = diagnostics.strengthSpread || {};
  const salaryPressure = diagnostics.salaryPressure || {};
  return {
    seed,
    teams: league.teams.length,
    warnings_count: (league.summary?.warnings?.length || 0) + (diagnostics.warnings?.length || 0),
    warnings: [...(league.summary?.warnings || []), ...(diagnostics.warnings || [])],
    avg_overall: league.summary?.averageOverall,
    min_overall: league.summary?.minOverall,
    max_overall: league.summary?.maxOverall,
    overall_range: diagnostics.overallRange,
    overall_median: diagnostics.overallMedian,
    top_average: strengthSpread.topAverage,
    bottom_average: strengthSpread.bottomAverage,
    top_bottom_gap: strengthSpread.gap,
    avg_budget: league.summary?.averageBudget,
    avg_salary_pressure: league.summary?.averageSalaryPressure,
    salary_pressure_median: salaryPressure.median,
    salary_pressure_p90: salaryPressure.p90,
    salary_pressure_max: salaryPressure.max,
    favorites_avg: diagnostics.byLeagueTier?.favorito?.averageOverall,
    survival_avg: diagnostics.byLeagueTier?.sobrevivencia?.averageOverall,
    low_count: league.summary?.tierCounts?.low || 0,
    normal_count: league.summary?.tierCounts?.normal || 0,
    good_count: league.summary?.tierCounts?.good || 0,
    user_rank: league.teams.find((team) => team.id === league.userTeamId)?.projectedRank || ""
  };
}

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 50;
const prefix = process.argv[3] || "DEBUG-LIGA-BASQUETE";
const outputPath = process.argv[4] || path.join(rootDir, "analises", `debug-ligas-${count}-seeds.csv`);
const rows = Array.from({ length: count }, (_, index) => {
  const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
  const league = context.window.TemporadaTotal.generateProceduralBasketballLeague(seed, { size: 16 });
  return getRow(seed, league);
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${buildCsv(rows)}\n`, "utf8");

const warningCount = rows.filter((row) => Number(row.warnings_count) > 0).length;
const avgGap = rows.reduce((sum, row) => sum + (Number(row.top_bottom_gap) || 0), 0) / Math.max(1, rows.length);

console.log(`CSV de debug de ligas: ${outputPath}`);
console.log(`Ligas testadas: ${rows.length}`);
console.log(`Ligas com warnings: ${warningCount}`);
console.log(`Gap medio topo/fundo: ${Math.round(avgGap * 10) / 10}`);
