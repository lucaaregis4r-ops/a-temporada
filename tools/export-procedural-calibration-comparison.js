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

function readSeedsFromCsv(csvPath) {
  if (!fs.existsSync(csvPath)) return [];
  const text = fs.readFileSync(csvPath, "utf8").trim();
  if (!text) return [];
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(",");
  const seedIndex = headers.indexOf("seed");
  if (seedIndex < 0) return [];
  return lines
    .map((line) => line.split(",")[seedIndex])
    .filter(Boolean);
}

function getMetrics(club) {
  return context.window.TemporadaTotal.ProceduralClubCalibration.metricSnapshot(club);
}

function buildRow(seed) {
  const raw = context.window.TemporadaTotal.generateProceduralBasketballClub(seed, { calibrate: false });
  const calibrated = context.window.TemporadaTotal.generateProceduralBasketballClub(seed, { calibrate: true });
  const rawMetrics = getMetrics(raw);
  const calibratedMetrics = getMetrics(calibrated);

  return {
    seed,
    club_name: calibrated.name,
    lore_label: calibrated.lore?.label,
    raw_strength_tier: raw.strengthTier,
    calibrated_strength_tier: calibrated.strengthTier,
    raw_roster_style: raw.rosterStyle,
    calibrated_roster_style: calibrated.rosterStyle,
    raw_overall: rawMetrics.overall,
    calibrated_overall: calibratedMetrics.overall,
    delta_overall: round(calibratedMetrics.overall - rawMetrics.overall),
    raw_current: rawMetrics.current,
    calibrated_current: calibratedMetrics.current,
    raw_avg_age: rawMetrics.avgAge,
    calibrated_avg_age: calibratedMetrics.avgAge,
    delta_avg_age: round(calibratedMetrics.avgAge - rawMetrics.avgAge),
    raw_avg_gap: rawMetrics.avgGap,
    calibrated_avg_gap: calibratedMetrics.avgGap,
    raw_salary_pressure_pct: rawMetrics.salaryPressure,
    calibrated_salary_pressure_pct: calibratedMetrics.salaryPressure,
    delta_salary_pressure_pct: round(calibratedMetrics.salaryPressure - rawMetrics.salaryPressure),
    raw_budget_left: rawMetrics.budgetLeft,
    calibrated_budget_left: calibratedMetrics.budgetLeft,
    raw_starters_current: rawMetrics.startersCurrent,
    calibrated_starters_current: calibratedMetrics.startersCurrent,
    raw_rotation_current: rawMetrics.rotationCurrent,
    calibrated_rotation_current: calibratedMetrics.rotationCurrent,
    raw_starter_rotation_gap: round(rawMetrics.startersCurrent - rawMetrics.rotationCurrent),
    calibrated_starter_rotation_gap: round(calibratedMetrics.startersCurrent - calibratedMetrics.rotationCurrent),
    raw_warnings: raw.calibrationWarnings || [],
    calibrated_warnings: calibrated.calibrationWarnings || [],
    calibrated_warning_count: calibrated.calibrationWarnings?.length || 0
  };
}

const inputCsv = process.argv[2] || path.join(rootDir, "calibragem-completa-clubes-100-seeds.csv");
const outputPath = process.argv[3] || path.join(rootDir, "analises", "comparativo-calibragem-clubes-100-seeds.csv");
const fallbackCount = Number(process.argv[4]) || 100;
const seeds = readSeedsFromCsv(inputCsv);
const finalSeeds = seeds.length ? seeds : Array.from({ length: fallbackCount }, (_, index) => `CALIBRAGEM-BASQUETE-LORES-REAIS-${String(index + 1).padStart(3, "0")}`);
const rows = finalSeeds.map(buildRow);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${buildCsv(rows)}\n`, "utf8");

const warningRows = rows.filter((row) => row.calibrated_warning_count > 0);
console.log(`CSV comparativo: ${outputPath}`);
console.log(`Seeds testadas: ${rows.length}`);
console.log(`Seeds com warnings apos calibragem: ${warningRows.length}`);
console.log(`Media overall raw: ${round(rows.reduce((sum, row) => sum + Number(row.raw_overall), 0) / rows.length)}`);
console.log(`Media overall calibrado: ${round(rows.reduce((sum, row) => sum + Number(row.calibrated_overall), 0) / rows.length)}`);
console.log(`Media pressao salarial raw: ${round(rows.reduce((sum, row) => sum + Number(row.raw_salary_pressure_pct), 0) / rows.length)}%`);
console.log(`Media pressao salarial calibrada: ${round(rows.reduce((sum, row) => sum + Number(row.calibrated_salary_pressure_pct), 0) / rows.length)}%`);
