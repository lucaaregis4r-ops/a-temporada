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
  "temporada-volei/generation-config.js",
  "shared/procedural-roster-generator.js",
  "shared/procedural-club-calibration.js",
  "shared/procedural-club-generator.js",
  "shared/procedural-league-generator.js",
  "shared/procedural-season-simulator.js",
  "shared/procedural-rotation-engine.js",
  "shared/procedural-market-generator.js",
  "shared/match-events.js",
  "shared/live-coaching.js",
  "shared/game-state.js",
  "shared/decision-network-engine.js",
  "shared/minigames-engine.js",
  "shared/calendar-engine.js",
  "shared/live-match-ui.js",
  "temporada-volei/match-adapter.js",
  "shared/live-simulation.js",
  "shared/game-shell-ui.js"
];

files.forEach((file) => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const code = fs.readFileSync(fullPath, "utf8");
    vm.runInNewContext(code, ctx);
  }
});

console.log("VM loaded with volleyball environment!");

// 1. Test Volleyball Match Simulation Progression
console.log("--- Testing Volleyball Live Match Simulation ---");
const state = ctx.TemporadaTotal.createProceduralGameState({ seed: "TEST-VOLEI-FLOW", sportId: "volei" });
const homeTeam = ctx.TemporadaTotal.GameState.buildLiveTeamFromClub(state.userTeam, "home");
const awayClub = state.league.teams.find(t => t.id !== state.userTeam.id);
const awayTeam = ctx.TemporadaTotal.GameState.buildLiveTeamFromClub(awayClub, "away");

const matchEngine = ctx.TemporadaTotal.createLiveSimulation({
  adapter: ctx.TemporadaTotal.VolleyballMatchAdapter,
  homeTeam,
  awayTeam,
  onUpdate: (simState) => {}
});

// Run 20 ticks
for (let i = 0; i < 20; i++) {
  matchEngine.tick();
}
const simState = matchEngine.getState();
console.log(`Ticks simulated. Current set: ${simState.clock.set}, SetScore: ${simState.setScore.home}-${simState.setScore.away}, Sets: ${simState.sets.home}-${simState.sets.away}`);
console.log(`Events count: ${simState.events.length}`);
if (simState.events.length === 0) throw new Error("No events recorded in simulation");

// Finish simulation to check completed sets
matchEngine.finish();
const finalState = matchEngine.getState();
console.log(`Match finished. Final sets: ${finalState.sets.home}-${finalState.sets.away}, Completed sets:`, finalState.completedSets);
if (finalState.sets.home < 3 && finalState.sets.away < 3) throw new Error("Match should be finished with at least 3 sets won");

// 2. Test All 10 Story Arcs in Decision Engine
console.log("--- Testing All 10 Story Arcs Triggering ---");
const arcs = [
  "arc_last_dance",
  "arc_rebel_star",
  "arc_wonderkid",
  "arc_financial_crisis",
  "arc_derby_rivalry",
  "arc_locker_room_split",
  "arc_viral_sponsorship",
  "arc_scandal_referee",
  "arc_tactical_revolution",
  "arc_injury_crisis_gamble"
];

arcs.forEach(arcId => {
  const testState = ctx.TemporadaTotal.createProceduralGameState({ seed: "TEST-ARCS", sportId: "volei" });
  const started = ctx.TemporadaTotal.DecisionNetworkEngine.startStoryArc(testState, arcId);
  if (!started) throw new Error(`Failed to start arc: ${arcId}`);
  const activeDec = ctx.TemporadaTotal.DecisionNetworkEngine.getActiveNarrativeDecision(testState);
  if (!activeDec || !activeDec.choices.length) throw new Error(`No choices for arc: ${arcId}`);
  console.log(`Arc '${arcId}' verified: "${activeDec.title}" with ${activeDec.choices.length} choices.`);
});

console.log(">>> ALL MATCH FLOW AND NARRATIVE TESTS PASSED! <<<");
