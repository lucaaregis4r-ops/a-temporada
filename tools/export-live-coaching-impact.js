const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");

const filesToLoad = [
  "shared/match-events.js",
  "shared/live-coaching.js",
  "shared/live-simulation.js",
  "temporada-basquete/match-adapter.js"
];

const context = vm.createContext({
  console,
  window: { TemporadaTotal: {} }
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

function buildRoster(teamId) {
  return ["PG", "SG", "SF", "PF", "C", "G", "F", "C"].map((pos, index) => ({
    id: `${teamId}-${index + 1}`,
    name: `${teamId} ${index + 1}`,
    teamId,
    pos,
    usage: index < 5 ? 1.12 : 0.62,
    shooting: 72 + (index % 4) * 4,
    finishing: 72 + (index % 5) * 3,
    threepoint: 69 + (index % 3) * 5,
    passing: 72 + (index % 4) * 4,
    defense: 72 + (index % 5) * 3,
    rebound: 70 + (index % 4) * 5
  }));
}

function buildTeam(teamId, rating = 76) {
  return {
    id: teamId,
    name: teamId === "home" ? "Time Casa" : "Time Fora",
    rating,
    offense: rating,
    defense: rating,
    threeRate: 0.37,
    pace: "balanced",
    roster: buildRoster(teamId)
  };
}

function getTeamSum(state, teamId, stat) {
  return Object.values(state.playerStats || {})
    .filter((row) => row.teamId === teamId)
    .reduce((sum, row) => sum + (Number(row[stat]) || 0), 0);
}

function summarizeState(state, scenario, run) {
  return {
    scenario,
    run,
    home_score: state.score.home,
    away_score: state.score.away,
    margin: state.score.home - state.score.away,
    possessions: state.clock.tick,
    home_turnovers: getTeamSum(state, "home", "turnovers"),
    away_turnovers: getTeamSum(state, "away", "turnovers"),
    home_fouls: getTeamSum(state, "home", "fouls"),
    away_fouls: getTeamSum(state, "away", "fouls"),
    home_3pa: getTeamSum(state, "home", "threeAttempted"),
    away_3pa: getTeamSum(state, "away", "threeAttempted"),
    home_fta: getTeamSum(state, "home", "fta"),
    away_fta: getTeamSum(state, "away", "fta"),
    instructions: (state.coaching?.activeInstructions || []).map((item) => item.label)
  };
}

function simulateScenario(scenario, run) {
  const tt = context.window.TemporadaTotal;
  const adapter = tt.BasketballMatchAdapter;
  const sim = tt.createLiveSimulation({
    adapter,
    homeTeam: buildTeam("home", 76),
    awayTeam: buildTeam("away", 76)
  });

  const applyAt = scenario.applyAtTick || 40;
  while (sim.getState().status !== "finished") {
    if (sim.getState().clock.tick === applyAt && scenario.patch) {
      sim.setCoaching(scenario.patch, { label: scenario.label });
    }
    sim.tick();
  }
  return summarizeState(sim.getState(), scenario.id, run);
}

const countArg = Number(process.argv[2]);
const runs = Number.isFinite(countArg) && countArg > 0 ? Math.floor(countArg) : 120;
const outputPath = process.argv[3] || path.join(rootDir, "analises", `impacto-comandos-ao-vivo-${runs}-jogos.csv`);
const scenarios = [
  { id: "baseline", label: "Sem intervencao", patch: null },
  { id: "run_and_gun_3pt", label: "Correr e chutar de 3", patch: { tactic: "run_and_gun", pace: "fast", offensiveFocus: "three_point", riskTolerance: "high" } },
  { id: "defense_high_pressure", label: "Defesa com pressao alta", patch: { tactic: "defense_first", defensivePressure: "high", pace: "slow" } },
  { id: "protect_lead_safe", label: "Proteger vantagem", patch: { tactic: "protect_lead", pace: "slow", riskTolerance: "safe", rotationPlan: "load_management" } },
  { id: "short_rotation_star", label: "Banco curto e estrela", patch: { rotationPlan: "short_rotation", offensiveFocus: "star_player", riskTolerance: "normal" } },
  { id: "development_minutes", label: "Dar minutos aos jovens", patch: { tactic: "development", rotationPlan: "development", pace: "normal" } }
];

const rows = [];
for (let run = 1; run <= runs; run += 1) {
  scenarios.forEach((scenario) => {
    rows.push(simulateScenario(scenario, run));
  });
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${buildCsv(rows)}\n`, "utf8");

const average = (items, getter) => items.reduce((sum, item) => sum + (Number(getter(item)) || 0), 0) / Math.max(1, items.length);
console.log(`CSV de impacto dos comandos ao vivo: ${outputPath}`);
console.log(`Jogos por cenario: ${runs}`);
console.log(`Linhas: ${rows.length}`);
scenarios.forEach((scenario) => {
  const items = rows.filter((row) => row.scenario === scenario.id);
  console.log(`${scenario.id}: placar casa ${Math.round(average(items, (row) => row.home_score) * 10) / 10}, margem ${Math.round(average(items, (row) => row.margin) * 10) / 10}, 3PA ${Math.round(average(items, (row) => row.home_3pa) * 10) / 10}, TO ${Math.round(average(items, (row) => row.home_turnovers) * 10) / 10}`);
});
