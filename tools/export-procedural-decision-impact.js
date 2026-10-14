const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const loreDir = fs.readdirSync(rootDir).find((name) => name.toLowerCase().startsWith("lores"));
const decisionsPath = path.join(rootDir, loreDir || "", "Banco_2000_Decisoes_Ramificadas_Unificado.json");

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
  "shared/procedural-decision-engine.js"
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

function getRowsByTeam(simulation) {
  return Object.fromEntries((simulation.standings || []).map((row) => [row.teamId, row]));
}

function average(rows, getter) {
  return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length);
}

function getLeagueRow(seed, strategy, baseline, decisionSimulation, packages) {
  const baselineRows = getRowsByTeam(baseline);
  const decisionRows = getRowsByTeam(decisionSimulation);
  const teamComparisons = Object.keys(decisionRows).map((teamId) => ({
    rankSwing: (baselineRows[teamId]?.simulatedRank || 0) - (decisionRows[teamId]?.simulatedRank || 0),
    winsSwing: (decisionRows[teamId]?.wins || 0) - (baselineRows[teamId]?.wins || 0)
  }));
  return {
    seed,
    strategy,
    champion_baseline: baseline.summary.championName,
    champion_with_decisions: decisionSimulation.summary.championName,
    champion_changed: baseline.summary.championId !== decisionSimulation.summary.championId ? 1 : 0,
    baseline_top4_retention_pct: baseline.summary.top4RetentionPct,
    decision_top4_retention_pct: decisionSimulation.summary.top4RetentionPct,
    baseline_rank_correlation: baseline.summary.rankCorrelation,
    decision_rank_correlation: decisionSimulation.summary.rankCorrelation,
    baseline_upset_rate: baseline.summary.upsetRate,
    decision_upset_rate: decisionSimulation.summary.upsetRate,
    avg_rating_delta: Math.round(average(packages, (item) => item.teamEffect.ratingDelta) * 10) / 10,
    avg_volatility_delta: Math.round(average(packages, (item) => item.teamEffect.volatilityDelta) * 1000) / 1000,
    avg_rank_swing: Math.round(average(teamComparisons, (item) => item.rankSwing) * 10) / 10,
    avg_wins_swing: Math.round(average(teamComparisons, (item) => item.winsSwing) * 10) / 10
  };
}

function getTeamRows(seed, strategy, league, baseline, decisionSimulation, packages) {
  const baselineRows = getRowsByTeam(baseline);
  const decisionRows = getRowsByTeam(decisionSimulation);
  const teamsById = Object.fromEntries((league.teams || []).map((team) => [team.id, team]));
  return packages.map((item) => {
    const baselineRow = baselineRows[item.teamId] || {};
    const decisionRow = decisionRows[item.teamId] || {};
    const team = teamsById[item.teamId] || {};
    return {
      seed,
      strategy,
      package_strategy: item.strategy,
      team_id: item.teamId,
      team_name: item.teamName,
      lore_label: item.loreLabel,
      objective: team.objective,
      strength_tier: team.strengthTier,
      league_tier: team.leagueTier,
      roster_style: team.rosterStyle,
      decisions_available: item.decisionsAvailable,
      decisions_applied: item.decisionsApplied,
      rating_delta: item.teamEffect.ratingDelta,
      volatility_delta: item.teamEffect.volatilityDelta,
      pressure_after: item.teamEffect.pressure,
      morale_delta: item.stateDelta.morale,
      cohesion_delta: item.stateDelta.groupCohesion,
      fatigue_delta: item.stateDelta.squadFatigue,
      injury_risk_delta: item.stateDelta.injuryRisk,
      short_term_performance_delta: item.stateDelta.shortTermPerformance,
      baseline_rank: baselineRow.simulatedRank,
      decision_rank: decisionRow.simulatedRank,
      rank_swing: (baselineRow.simulatedRank || 0) - (decisionRow.simulatedRank || 0),
      baseline_wins: baselineRow.wins,
      decision_wins: decisionRow.wins,
      wins_swing: (decisionRow.wins || 0) - (baselineRow.wins || 0),
      chosen_decision_types: item.chosenDecisions.map((decision) => decision.decisionType),
      branch_outcomes: item.chosenDecisions.map((decision) => decision.branchOutcome)
    };
  });
}

const countArg = Number(process.argv[2]);
const count = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 25;
const prefix = process.argv[3] || "DECISOES-LIGA-BASQUETE";
const outputDir = process.argv[4] || path.join(rootDir, "analises");
const strategies = (process.argv[5] || "balanced,aggressive,development,conservative,crisis_control,lore_fit")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

if (!fs.existsSync(decisionsPath)) {
  throw new Error(`Banco de decisoes nao encontrado: ${decisionsPath}`);
}

const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));
const leagueRows = [];
const teamRows = [];

for (let index = 0; index < count; index += 1) {
  const seed = `${prefix}-${String(index + 1).padStart(3, "0")}`;
  const league = context.window.TemporadaTotal.generateProceduralBasketballLeague(seed, { size: 16 });
  const baseline = context.window.TemporadaTotal.simulateProceduralLeagueSeason(league, { simulationIndex: 1 });

  strategies.forEach((strategy) => {
    const decisionRun = context.window.TemporadaTotal.simulateProceduralLeagueDecisionPackages(league, decisions, {
      strategy,
      decisionCount: 6
    });
    const decisionSimulation = context.window.TemporadaTotal.simulateProceduralLeagueSeason(league, {
      simulationIndex: 1,
      teamEffects: decisionRun.teamEffects
    });
    leagueRows.push(getLeagueRow(seed, strategy, baseline, decisionSimulation, decisionRun.packages));
    teamRows.push(...getTeamRows(seed, strategy, league, baseline, decisionSimulation, decisionRun.packages));
  });
}

fs.mkdirSync(outputDir, { recursive: true });
const leaguePath = path.join(outputDir, `impacto-decisoes-ligas-${count}-seeds.csv`);
const teamsPath = path.join(outputDir, `impacto-decisoes-clubes-${count}-seeds.csv`);
fs.writeFileSync(leaguePath, `${buildCsv(leagueRows)}\n`, "utf8");
fs.writeFileSync(teamsPath, `${buildCsv(teamRows)}\n`, "utf8");

const championChangeRate = average(leagueRows, (row) => row.champion_changed) * 100;
const avgAbsRankSwing = average(teamRows, (row) => Math.abs(Number(row.rank_swing) || 0));
const avgAbsWinsSwing = average(teamRows, (row) => Math.abs(Number(row.wins_swing) || 0));

console.log(`CSV de impacto por liga: ${leaguePath}`);
console.log(`CSV de impacto por clube: ${teamsPath}`);
console.log(`Seeds analisadas: ${count}`);
console.log(`Estrategias: ${strategies.join(", ")}`);
console.log(`Linhas de liga: ${leagueRows.length}`);
console.log(`Linhas de clube: ${teamRows.length}`);
console.log(`Troca de campeao: ${Math.round(championChangeRate * 10) / 10}%`);
console.log(`Swing medio absoluto de rank: ${Math.round(avgAbsRankSwing * 10) / 10}`);
console.log(`Swing medio absoluto de vitorias: ${Math.round(avgAbsWinsSwing * 10) / 10}`);
