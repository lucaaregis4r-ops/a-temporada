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
  "shared/procedural-season-simulator.js",
  "shared/procedural-decision-engine.js",
  "shared/procedural-rotation-engine.js",
  "shared/procedural-career-lab.js"
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

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 50;
const prefix = process.argv[3] || "CARREIRA-P6-BASQUETE";
const outputPath = process.argv[4] || path.join(rootDir, "analises", `carreira-experimental-${count}-seeds.csv`);
const strategies = ["balanced", "aggressive", "development", "conservative", "crisis_control", "lore_fit"];
const rows = [];

for (let index = 0; index < count; index += 1) {
  const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
  const league = context.window.TemporadaTotal.generateProceduralBasketballLeague(seed, { size: 16 });
  strategies.forEach((strategy) => {
    const lab = context.window.TemporadaTotal.simulateProceduralCareerLab(league, {
      userStrategy: strategy,
      simulationIndex: 1
    });
    rows.push({
      seed,
      user_team: lab.userTeamName,
      strategy,
      baseline_rank: lab.baselineRow?.simulatedRank,
      decision_rank: lab.decisionRow?.simulatedRank,
      rank_swing: lab.resultDelta?.rankSwing,
      baseline_wins: lab.baselineRow?.wins,
      decision_wins: lab.decisionRow?.wins,
      wins_swing: lab.resultDelta?.winsSwing,
      point_diff_swing: lab.resultDelta?.pointDiffSwing,
      champion_changed: lab.resultDelta?.championChanged ? 1 : 0,
      rating_delta: lab.userPackage?.teamEffect?.ratingDelta,
      volatility_delta: lab.userPackage?.teamEffect?.volatilityDelta,
      pressure_after: lab.userPackage?.teamEffect?.pressure,
      rotation_plan: lab.rotation?.plan,
      active_players: lab.rotation?.summary?.activePlayers,
      starter_average: lab.rotation?.summary?.starterAverage,
      bench_average: lab.rotation?.summary?.benchAverage,
      prospect_minutes: lab.rotation?.summary?.prospectMinutes,
      high_risk_minutes: lab.rotation?.summary?.highRiskMinutes,
      top_five_minutes: lab.rotation?.summary?.topFiveMinutes,
      rotation_rating_delta: lab.rotation?.effect?.ratingDelta,
      rotation_fatigue_delta: lab.rotation?.effect?.fatigueDelta,
      morale_delta: lab.userPackage?.stateDelta?.morale,
      cohesion_delta: lab.userPackage?.stateDelta?.groupCohesion,
      fatigue_delta: lab.userPackage?.stateDelta?.squadFatigue,
      injury_risk_delta: lab.userPackage?.stateDelta?.injuryRisk
    });
  });
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${buildCsv(rows)}\n`, "utf8");

const avg = (getter) => rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length);
console.log(`CSV de carreira experimental: ${outputPath}`);
console.log(`Seeds analisadas: ${count}`);
console.log(`Cenarios: ${rows.length}`);
console.log(`Swing medio absoluto de rank: ${Math.round(avg((row) => Math.abs(row.rank_swing)) * 10) / 10}`);
console.log(`Swing medio absoluto de vitorias: ${Math.round(avg((row) => Math.abs(row.wins_swing)) * 10) / 10}`);
console.log(`Troca de campeao: ${Math.round(avg((row) => row.champion_changed) * 1000) / 10}%`);
