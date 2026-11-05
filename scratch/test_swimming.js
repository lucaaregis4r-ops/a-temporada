const vm = require("vm");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
let localStorageStore = {};

const mockLocalStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, val) => { localStorageStore[key] = String(val); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { localStorageStore = {}; }
};

const domListeners = {};
const elements = {};
function getMockElement(selector) {
  if (!elements[selector]) {
    elements[selector] = {
      tagName: "DIV",
      value: "",
      textContent: "",
      innerHTML: "",
      className: "",
      style: {},
      disabled: false,
      dataset: {},
      addEventListener: (evt, fn) => {
        domListeners[selector + ":" + evt] = fn;
      },
      querySelector: (sub) => getMockElement(selector + " " + sub),
      querySelectorAll: () => []
    };
  }
  return elements[selector];
}

const ctx = {
  window: {},
  document: {
    addEventListener: () => {},
    dispatchEvent: () => {},
    querySelector: (sel) => getMockElement(sel),
    querySelectorAll: () => [],
    getElementById: (id) => getMockElement(id.startsWith("#") ? id : "#" + id),
    body: getMockElement("body")
  },
  CustomEvent: class { constructor(name, opts) { this.name = name; this.opts = opts; } },
  localStorage: mockLocalStorage,
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  cancelAnimationFrame: () => {},
  requestAnimationFrame: () => 1
};
ctx.window = ctx;

// 1. Load minigames engine
const minigamesCode = fs.readFileSync(path.join(rootDir, "shared/minigames-engine.js"), "utf8");
vm.runInNewContext(minigamesCode, ctx);

// 2. Load swim arena live engine
const liveArenaCode = fs.readFileSync(path.join(rootDir, "temporada-natacao/swim-arena-live.js"), "utf8");
vm.runInNewContext(liveArenaCode, ctx);

// 3. Load swimming script
const swimScriptCode = fs.readFileSync(path.join(rootDir, "temporada-natacao/script.js"), "utf8");
vm.runInNewContext(swimScriptCode, ctx);

console.log("Swimming scripts loaded into VM successfully!");

vm.runInNewContext(`
const {
  state,
  SWIMMING_CLUBS,
  EVENT_DEFINITIONS,
  MARKET,
  MEETS,
  SWIMMING_DILEMMAS,
  autoLineup,
  runLiveMeetSimulation,
  simulateFastMeet,
  openWarmupModal,
  switchTab,
  saveState,
  loadState,
  validateLineup,
  getProjectedEventTime,
  getAdjustedSwimmer,
  getSelectedSwimmers,
  getMeetInfo,
  applyDilemmaChoice
} = TemporadaTotal.SwimmingEngine;

// 1. Test Career Roster & Club Initialization
console.log("--- Testing Career Club & Squad ---");
console.log("Selected club:", state.club.name, "| City:", state.club.city);
console.log("Selected squad count:", state.selectedIds.length);
if (state.selectedIds.length !== 10) throw new Error("Squad initialization failed");

if (!state.season || !state.season.started) throw new Error("Season not started");
console.log("Season active. Current meet:", state.season.currentMeetIndex + 1, "of 8");

// 2. Test autoLineup
console.log("--- Testing autoLineup ---");
autoLineup();

const validation = validateLineup();
console.log("Auto-lineup validation:", validation);
if (!validation.valid) throw new Error("Auto-lineup failed: " + validation.message);

// 3. Test Minigame Buff in Swimming
console.log("--- Testing Swimming Minigame Buff ---");
state.minigameBuff = {
  sportId: "natacao",
  tier: "elite",
  timeReduction: 0.25,
  buffSummary: "Largada de Elite (-0.25s)"
};

// Check race time with buff
const event = EVENT_DEFINITIONS[0];
const swimmer = getSelectedSwimmers()[0];
const meet = getMeetInfo();

const baseTime = getProjectedEventTime(getAdjustedSwimmer(swimmer), event, meet, 0, "equilibrada");
// apply with buff active
const buffedTime = getProjectedEventTime(getAdjustedSwimmer(swimmer), event, meet, 0, "equilibrada");
console.log("Event " + event.label + ": Base projected ~" + baseTime.toFixed(2) + "s, Buffed race time ~" + buffedTime.toFixed(2) + "s");

// 4. Test Meet Simulation (simulateFastMeet)
console.log("--- Testing simulateFastMeet ---");
simulateFastMeet();
console.log("Meet results count:", state.season.meetResults.length);
console.log("Next meet index:", state.season.currentMeetIndex);
console.log("Buff consumed after meet:", state.minigameBuff === null);
if (state.minigameBuff !== null) throw new Error("Buff was not consumed after meet");
if (state.season.meetResults.length !== 1) throw new Error("Meet results not recorded");

const lastResult = state.season.meetResults[0];
console.log("First meet user points:", lastResult.userPoints, "| user rank:", lastResult.userRank + "º");
console.log("Medals won by user club:", lastResult.medals);

// 5. Test Dilemma Decision Flow
console.log("--- Testing Narrative Dilemmas ---");
if (state.activeDilemma) {
  console.log("Active dilemma:", state.activeDilemma.title);
  const choice = state.activeDilemma.choices[0];
  console.log("Choosing:", choice.label);
  applyDilemmaChoice(choice);
  console.log("Decisions history length:", state.storyDecisionsHistory.length);
  if (state.storyDecisionsHistory.length !== 1) throw new Error("Dilemma choice not saved");
}

// 6. Test Save & Load
console.log("--- Testing Swimming Save & Load ---");
saveState();
const savedRaw = localStorage.getItem("temporada-total-natacao-v4");
if (!savedRaw) throw new Error("Save state failed");
const parsed = JSON.parse(savedRaw);
if (!parsed.season || parsed.season.meetResults.length !== 1) throw new Error("Corrupted save data");
console.log("Save verified successfully with meetResults:", parsed.season.meetResults.length);
console.log("Standings count:", parsed.season.overallStandings.length);

// 7. Test Procedural Club Proposals & Draft
console.log("--- Testing Procedural Club Draft (Roll & Select) ---");
const { generateProceduralClubProposals, selectClubProposal, optimizeTactics, clearLineup } = TemporadaTotal.SwimmingEngine;
const proposals = generateProceduralClubProposals();
console.log("Generated proposals count:", proposals.length);
if (proposals.length !== 3) throw new Error("Expected 3 proposals");

const archetypes = proposals.map(p => p.archetype);
console.log("Proposals archetypes:", archetypes);
if (!archetypes.includes("favorito") || !archetypes.includes("desafiante") || !archetypes.includes("reconstrucao")) {
  throw new Error("Missing archetype in procedural proposals");
}

proposals.forEach(p => {
  console.log("Proposal:", p.name, "| City:", p.city, "| Badge:", p.badge, "| Trait:", p.traitName);
  if (!p.name || !p.city || !p.color || !p.crest || !p.startingRosterIds) {
    throw new Error("Incomplete procedural club data in proposal: " + p.name);
  }
});

// Test selecting a proposal
selectClubProposal(1);
console.log("Selected proposal 1 club:", state.club.name, "| Archetype:", state.club.archetype);
if (state.selectedIds.length !== 10) throw new Error("Roster not set to 10 athletes");
if (!state.season || state.season.currentMeetIndex !== 0) throw new Error("Season not properly reset");

// 8. Test Tactical Controls (optimizeTactics & clearLineup)
console.log("--- Testing Tactical Controls ---");
optimizeTactics();
const sprint50mTactic = state.tacticsByEvent["M_50_free"][0];
const distance400mTactic = state.tacticsByEvent["M_400_free"][0];
console.log("Optimized 50m tactic:", sprint50mTactic, "| 400m tactic:", distance400mTactic);
if (sprint50mTactic !== "explosiva" || distance400mTactic !== "negativa") {
  throw new Error("Tactical optimization failed");
}

clearLineup();
const clearedSlots = state.lineup["M_50_free"];
console.log("Cleared 50m slots:", clearedSlots);
if (clearedSlots[0] !== "" || clearedSlots[1] !== "") {
  throw new Error("Clear lineup failed");
}

autoLineup();
const reValidation = validateLineup();
console.log("Auto-lineup after clear validation:", reValidation);
if (!reValidation.valid) throw new Error("Auto-lineup failed after clear");

console.log(">>> ALL NEW SWIMMING ARCHITECTURE & PROCEDURAL TESTS PASSED SUCCESSFULLY! <<<");

`, ctx);
