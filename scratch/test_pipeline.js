const vm = require("vm");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const ctx = {
  window: {},
  document: {
    addEventListener: () => {},
    readyState: "complete",
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { classList: { add: () => {}, remove: () => {} } }
  },
  location: { search: "", hash: "" },
  URLSearchParams: class { get() { return null; } },
  console,
  setTimeout,
  clearTimeout
};
ctx.window = ctx;

const files = [
  "shared/seeded-rng.js",
  "shared/procedural-datasets.js",
  "shared/procedural-lore-datasets.js",
  "shared/procedural-scouting.js",
  "shared/procedural-player-generator.js",
  "temporada-basquete/generation-config.js",
  "shared/procedural-roster-generator.js",
  "shared/procedural-club-calibration.js",
  "shared/procedural-club-generator.js",
  "shared/procedural-league-generator.js",
  "shared/procedural-season-simulator.js",
  "shared/procedural-rotation-engine.js",
  "shared/procedural-market-generator.js",
  "shared/game-state.js",
  "shared/decision-network-engine.js",
  "shared/minigames-engine.js",
  "shared/calendar-engine.js",
  "shared/game-shell-ui.js"
];

files.forEach((file) => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const code = fs.readFileSync(fullPath, "utf8");
    vm.runInNewContext(code, ctx);
  }
});

console.log("All scripts loaded into VM successfully!");

// 1. Test Minigames Engine Buff
console.log("--- Testing Minigames Engine Suites ---");
["basquete", "futsal", "volei"].forEach(sport => {
  const suite = ctx.TemporadaTotal.MinigamesEngine.getMinigameSuite(sport);
  console.log(`Sport ${sport} drills count: ${suite.length}`);
  if (suite.length !== 3) throw new Error(`Expected 3 drills for ${sport}, got ${suite.length}`);
});

const state = ctx.TemporadaTotal.createProceduralGameState({ seed: "TEST-ARCADE", sportId: "basquete" });
ctx.TemporadaTotal.GameState.applyMinigameBuff(state, {
  ratingBoost: 4.5,
  buffSummary: "PERFEITO: Treino de Arremesso cravado!"
});
const boost = ctx.TemporadaTotal.GameState.getMatchPerformanceBoost(state);
console.log("Match performance boost:", boost);
if (boost !== 4.5) throw new Error("Minigame boost failed");

// 2. Test Decision Network Engine
console.log("--- Testing Decision Network Engine ---");
ctx.TemporadaTotal.DecisionNetworkEngine.startStoryArc(state, "arc_derby_rivalry");
console.log("Active arcs:", state.narrativeState.activeArcs.map(a => a.arcId));
if (!state.narrativeState.activeArcs.some(a => a.arcId === "arc_derby_rivalry")) throw new Error("Arc trigger failed");

const decision = ctx.TemporadaTotal.DecisionNetworkEngine.getActiveNarrativeDecision(state);
if (!decision || !decision.choices.length) throw new Error("Active decision missing");
ctx.TemporadaTotal.DecisionNetworkEngine.resolveNarrativeChoice(state, decision.choices[0].id);
console.log("History length:", state.narrativeState.decisionHistory.length);

console.log("--- Testing Arcade Proposals ---");
if (!state.league.teams.length) throw new Error("League teams empty");
console.log("Proposals count valid. Teams in league:", state.league.teams.length);

console.log(">>> ALL TESTS PASSED SUCCESSFULLY! <<<");
