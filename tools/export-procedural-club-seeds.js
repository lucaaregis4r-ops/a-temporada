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
  "shared/procedural-club-generator.js"
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

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round((Number(value) || 0) * factor) / factor;
}

function average(rows, getter) {
  return round(rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length));
}

function csvEscape(value) {
  if (value == null) return "";
  const text = String(value);
  if (/[",\r\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function joinList(value) {
  if (!Array.isArray(value)) return "";
  return value.join(" | ");
}

function getBestPlayer(players) {
  return players.slice().sort((a, b) => (b.currentAbility - a.currentAbility) || (b.potential - a.potential))[0] || {};
}

function getWorstPlayer(players) {
  return players.slice().sort((a, b) => (a.currentAbility - b.currentAbility) || (a.potential - b.potential))[0] || {};
}

function buildRow(seed) {
  const club = context.window.TemporadaTotal.generateProceduralBasketballClub(seed);
  const roster = club.roster || {};
  const players = roster.players || [];
  const summary = roster.summary || {};
  const rating = club.rating || {};
  const positionCounts = summary.positionCounts || {};
  const best = getBestPlayer(players);
  const worst = getWorstPlayer(players);
  const starters = roster.starters || [];
  const rotation = roster.rotation || [];
  const prospects = roster.prospects || [];

  return {
    seed,
    club_id: club.id,
    club_name: club.name,
    city: club.city,
    lore_id: club.lore?.id,
    lore_label: club.lore?.label,
    lore_description: club.lore?.description,
    strength_tier: club.strengthTier,
    roster_style: club.rosterStyle,
    pressure: club.pressure,
    ambition: club.ambition,
    objective: club.objective,
    market_aggressiveness: club.marketBehavior?.aggressiveness,
    market_focus: club.marketBehavior?.focus,
    budget: club.budget,
    reputation: club.reputation,
    overall_rating: rating.overall,
    current_rating: rating.current,
    potential_rating: rating.potential,
    defense_rating: rating.defense,
    shooting_rating: rating.shooting,
    avg_age_rating: rating.averageAge,
    salary_pressure_pct: rating.salaryPressure,
    roster_size: summary.rosterSize,
    total_salary: summary.totalSalary,
    budget_left: summary.budgetLeft,
    avg_age: summary.averageAge,
    avg_height_cm: summary.averageHeight,
    avg_current: summary.averageCurrentAbility,
    avg_potential: summary.averagePotential,
    avg_development_gap: summary.averageDevelopmentGap,
    starters_avg_current: average(starters, (player) => player.currentAbility),
    starters_avg_potential: average(starters, (player) => player.potential),
    rotation_avg_current: average(rotation, (player) => player.currentAbility),
    rotation_avg_potential: average(rotation, (player) => player.potential),
    prospects_avg_current: average(prospects, (player) => player.currentAbility),
    prospects_avg_potential: average(prospects, (player) => player.potential),
    pg_count: positionCounts.PG || 0,
    sg_count: positionCounts.SG || 0,
    sf_count: positionCounts.SF || 0,
    pf_count: positionCounts.PF || 0,
    c_count: positionCounts.C || 0,
    best_player_name: best.name,
    best_player_pos: best.pos,
    best_player_age: best.age,
    best_player_current: best.currentAbility,
    best_player_potential: best.potential,
    best_player_salary: best.salary,
    worst_player_name: worst.name,
    worst_player_pos: worst.pos,
    worst_player_current: worst.currentAbility,
    worst_player_potential: worst.potential,
    warnings_count: roster.warnings?.length || 0,
    warnings: joinList(roster.warnings),
    strengths: joinList(club.strengths),
    weaknesses: joinList(club.weaknesses),
    scout_notes: joinList(club.scoutNotes),
    calibration_version: club.calibrationMeta?.version,
    calibration_style: club.calibrationMeta?.style,
    calibration_warning_count: club.calibrationWarnings?.length || 0,
    calibration_warnings: joinList(club.calibrationWarnings)
  };
}

function buildCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
}

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 100;
const prefix = process.argv[3] || "CALIBRAGEM-BASQUETE";
const outputPath = process.argv[4] || path.join(rootDir, "analises", `calibragem-clubes-${count}-seeds.csv`);
const rows = Array.from({ length: count }, (_, index) => buildRow(`${prefix}-${String(index + 1).padStart(3, "0")}`));

fs.writeFileSync(outputPath, `${buildCsv(rows)}\n`, "utf8");

const overallValues = rows.map((row) => Number(row.overall_rating) || 0);
const budgetValues = rows.map((row) => Number(row.budget) || 0);
const salaryPressureValues = rows.map((row) => Number(row.salary_pressure_pct) || 0);

console.log(`CSV gerado: ${outputPath}`);
console.log(`Seeds: ${count}`);
console.log(`Overall medio: ${average(rows, (row) => row.overall_rating)} | min ${Math.min(...overallValues)} | max ${Math.max(...overallValues)}`);
console.log(`Orcamento medio: ${average(rows, (row) => row.budget)} | min ${Math.min(...budgetValues)} | max ${Math.max(...budgetValues)}`);
console.log(`Pressao salarial media: ${average(rows, (row) => row.salary_pressure_pct)}% | min ${Math.min(...salaryPressureValues)}% | max ${Math.max(...salaryPressureValues)}%`);
