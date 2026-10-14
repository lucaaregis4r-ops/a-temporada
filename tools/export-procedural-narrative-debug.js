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
  "shared/procedural-narrative-debug.js"
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

function getLeagueRow(seed, league, simulation, narrative) {
  return {
    seed,
    teams: league.teams.length,
    objective_alignment_pct: narrative.objectiveAlignmentPct,
    high_decision_teams: narrative.highDecisionTeams,
    low_impact_high_decision_teams: narrative.lowImpactHighDecisionTeams,
    narrative_warnings: narrative.warnings,
    champion: simulation.summary.championName,
    champion_projected_rank: simulation.summary.championProjectedRank,
    top4_retention_pct: simulation.summary.top4RetentionPct,
    upset_rate: simulation.summary.upsetRate,
    rank_correlation: simulation.summary.rankCorrelation,
    generation_warnings: [...(league.summary?.warnings || []), ...(league.diagnostics?.warnings || [])],
    simulation_warnings: simulation.summary.warnings
  };
}

function getTeamRows(seed, narrative) {
  return narrative.teams.map((team) => ({
    seed,
    team_id: team.teamId,
    team_name: team.name,
    lore_label: team.loreLabel,
    objective: team.objective,
    objective_profile: team.objectiveProfile,
    projected_rank: team.projectedRank,
    simulated_rank: team.simulatedRank,
    rank_delta: team.rankDelta,
    strength_tier: team.strengthTier,
    league_tier: team.leagueTier,
    roster_style: team.rosterStyle,
    decision_leverage_label: team.decisionLeverage?.label,
    decision_leverage_score: team.decisionLeverage?.score,
    decision_count: team.decisionLeverage?.decisionCount,
    decision_type_count: team.decisionLeverage?.typeCount,
    positive_decision_rank: team.decisionSensitivity?.positiveRank,
    negative_decision_rank: team.decisionSensitivity?.negativeRank,
    rank_swing: team.decisionSensitivity?.rankSwing,
    positive_decision_wins: team.decisionSensitivity?.positiveWins,
    negative_decision_wins: team.decisionSensitivity?.negativeWins,
    wins_swing: team.decisionSensitivity?.winsSwing,
    warnings: team.warnings
  }));
}

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 50;
const prefix = process.argv[3] || "NARRATIVA-LIGA-BASQUETE";
const outputDir = process.argv[4] || path.join(rootDir, "analises");
const leagueRows = [];
const teamRows = [];

for (let index = 0; index < count; index += 1) {
  const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
  const league = context.window.TemporadaTotal.generateProceduralBasketballLeague(seed, { size: 16 });
  const simulation = context.window.TemporadaTotal.simulateProceduralLeagueSeason(league, { simulationIndex: 1 });
  const narrative = context.window.TemporadaTotal.analyzeProceduralNarrative(league, simulation, {
    simulationIndex: 1
  });
  leagueRows.push(getLeagueRow(seed, league, simulation, narrative));
  teamRows.push(...getTeamRows(seed, narrative));
}

fs.mkdirSync(outputDir, { recursive: true });
const leaguePath = path.join(outputDir, `narrativa-ligas-${count}-seeds.csv`);
const teamsPath = path.join(outputDir, `narrativa-clubes-${count}-seeds.csv`);
fs.writeFileSync(leaguePath, `${buildCsv(leagueRows)}\n`, "utf8");
fs.writeFileSync(teamsPath, `${buildCsv(teamRows)}\n`, "utf8");

const avg = (rows, key) => rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0) / Math.max(1, rows.length);
const warningLeagueCount = leagueRows.filter((row) => String(row.narrative_warnings || "").length).length;
const lowImpactCount = teamRows.filter((row) => String(row.warnings || "").includes("high_decision_lore_low_simulated_impact")).length;

console.log(`CSV narrativo de ligas: ${leaguePath}`);
console.log(`CSV narrativo de clubes: ${teamsPath}`);
console.log(`Ligas analisadas: ${leagueRows.length}`);
console.log(`Clubes analisados: ${teamRows.length}`);
console.log(`Objetivos coerentes em media: ${Math.round(avg(leagueRows, "objective_alignment_pct") * 10) / 10}%`);
console.log(`Ligas com warnings narrativos: ${warningLeagueCount}`);
console.log(`Clubes com decisao forte e baixo impacto: ${lowImpactCount}`);
