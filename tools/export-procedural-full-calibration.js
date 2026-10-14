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

function buildCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
}

function getBestPlayer(players) {
  return players.slice().sort((a, b) => (b.currentAbility - a.currentAbility) || (b.potential - a.potential))[0] || {};
}

function getWorstPlayer(players) {
  return players.slice().sort((a, b) => (a.currentAbility - b.currentAbility) || (a.potential - b.potential))[0] || {};
}

function getClubRow(seed, club) {
  const roster = club.roster || {};
  const players = roster.players || [];
  const summary = roster.summary || {};
  const rating = club.rating || {};
  const positionCounts = summary.positionCounts || {};
  const starters = roster.starters || [];
  const rotation = roster.rotation || [];
  const prospects = roster.prospects || [];
  const best = getBestPlayer(players);
  const worst = getWorstPlayer(players);

  return {
    seed,
    club_id: club.id,
    club_name: club.name,
    city: club.city,
    lore_id: club.lore?.id,
    lore_label: club.lore?.label,
    lore_description: club.lore?.description,
    lore_traits: joinList(club.lore?.traits),
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
    calibration_warnings: joinList(club.calibrationWarnings),
    raw_overall_before_calibration: club.calibrationMeta?.before?.overall,
    raw_salary_pressure_before_calibration: club.calibrationMeta?.before?.salaryPressure,
    raw_avg_age_before_calibration: club.calibrationMeta?.before?.avgAge
  };
}

function getPlayerRow(seed, club, player) {
  return {
    seed,
    club_id: club.id,
    club_name: club.name,
    city: club.city,
    lore_id: club.lore?.id,
    lore_label: club.lore?.label,
    club_strength_tier: club.strengthTier,
    roster_style: club.rosterStyle,
    pressure: club.pressure,
    ambition: club.ambition,
    budget: club.budget,
    club_total_salary: club.roster?.summary?.totalSalary,
    club_budget_left: club.roster?.summary?.budgetLeft,
    club_salary_pressure_pct: club.rating?.salaryPressure,
    club_overall_rating: club.rating?.overall,
    player_id: player.id,
    roster_slot: player.rosterSlot,
    roster_role: player.rosterRole,
    name: player.name,
    gender: player.gender,
    pos: player.pos,
    position: player.position,
    age: player.age,
    height_cm: player.heightCm,
    salary: player.salary,
    current_ability: player.currentAbility,
    potential: player.potential,
    development_gap: (Number(player.potential) || 0) - (Number(player.currentAbility) || 0),
    strength_tier: player.strengthTier,
    talent_band: player.talentBand,
    tag: player.tag,
    archetype_id: player.archetype?.id,
    archetype_label: player.archetype?.label,
    archetype_description: player.archetype?.description,
    archetype_usage_bias: player.archetype?.usageBias,
    archetype_salary_bias: player.archetype?.salaryBias,
    archetype_scout_tags: joinList(player.archetype?.scoutTags),
    personality_id: player.personality?.id,
    personality_label: player.personality?.label,
    personality_description: player.personality?.description,
    personality_traits: joinList(player.personality?.traits),
    physical_profile_id: player.physicalProfile?.id,
    physical_profile_label: player.physicalProfile?.label,
    physical_profile_description: player.physicalProfile?.description,
    potential_profile_id: player.potentialProfile?.id,
    potential_profile_label: player.potentialProfile?.label,
    potential_profile_description: player.potentialProfile?.description,
    three_point: player.threePoint,
    physical: player.physical,
    tactical: player.tactical,
    technique: player.technique,
    defense: player.defense,
    development: player.development,
    volatility: player.volatility,
    injury_risk: player.injuryRisk,
    usage: player.usage,
    potential_label: player.potentialLabel,
    risk_label: player.riskLabel,
    scout_notes: joinList(player.scoutNotes)
  };
}

function buildCalibrationRows(count, prefix) {
  const clubs = [];
  const players = [];

  for (let index = 0; index < count; index += 1) {
    const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
    const club = context.window.TemporadaTotal.generateProceduralBasketballClub(seed);
    clubs.push(getClubRow(seed, club));
    (club.roster?.players || []).forEach((player) => {
      players.push(getPlayerRow(seed, club, player));
    });
  }

  return { clubs, players };
}

function writeCsv(outputPath, rows) {
  fs.writeFileSync(outputPath, `${buildCsv(rows)}\n`, "utf8");
}

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 100;
const prefix = process.argv[3] || "CALIBRAGEM-BASQUETE";
const outputDir = process.argv[4] || path.join(rootDir, "analises");
fs.mkdirSync(outputDir, { recursive: true });

const { clubs, players } = buildCalibrationRows(count, prefix);
const clubsPath = path.join(outputDir, `calibragem-completa-clubes-${count}-seeds.csv`);
const playersPath = path.join(outputDir, `calibragem-completa-atletas-${count}-seeds.csv`);

writeCsv(clubsPath, clubs);
writeCsv(playersPath, players);

const overallValues = clubs.map((row) => Number(row.overall_rating) || 0);
const salaryPressureValues = clubs.map((row) => Number(row.salary_pressure_pct) || 0);
const currentValues = players.map((row) => Number(row.current_ability) || 0);
const potentialValues = players.map((row) => Number(row.potential) || 0);
const salaryValues = players.map((row) => Number(row.salary) || 0);

console.log(`CSV de clubes: ${clubsPath}`);
console.log(`CSV de atletas: ${playersPath}`);
console.log(`Seeds: ${count}`);
console.log(`Clubes: ${clubs.length}`);
console.log(`Atletas: ${players.length}`);
console.log(`Overall clubes medio: ${average(clubs, (row) => row.overall_rating)} | min ${Math.min(...overallValues)} | max ${Math.max(...overallValues)}`);
console.log(`Pressao salarial media: ${average(clubs, (row) => row.salary_pressure_pct)}% | min ${Math.min(...salaryPressureValues)}% | max ${Math.max(...salaryPressureValues)}%`);
console.log(`CA atletas media: ${average(players, (row) => row.current_ability)} | min ${Math.min(...currentValues)} | max ${Math.max(...currentValues)}`);
console.log(`POT atletas media: ${average(players, (row) => row.potential)} | min ${Math.min(...potentialValues)} | max ${Math.max(...potentialValues)}`);
console.log(`Salario atletas medio: ${average(players, (row) => row.salary)} | min ${Math.min(...salaryValues)} | max ${Math.max(...salaryValues)}`);
