const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert');

const context = {
  window: {},
  document: {
    body: {
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      }
    }
  },
  console: console,
  Math: Math,
  Set: Set,
  Array: Array,
  Object: Object,
  Number: Number,
  String: String,
  Boolean: Boolean,
  Date: Date,
  setInterval: setInterval,
  clearInterval: clearInterval
};
context.window = context;
vm.createContext(context);

function loadFile(relPath) {
  const full = path.join(__dirname, '..', relPath);
  const code = fs.readFileSync(full, 'utf8');
  vm.runInContext(code, context);
}

// Load core shared modules
loadFile('shared/match-events.js');
loadFile('shared/live-coaching.js');
loadFile('shared/live-simulation.js');
loadFile('temporada-basquete/match-adapter.js');
loadFile('Temporada Futsal/match-adapter.js');
loadFile('temporada-volei/match-adapter.js');

console.log('--- Testing Basketball Live Rotation & Fatigue ---');
const bAdapter = context.window.TemporadaTotal.BasketballMatchAdapter;
assert(bAdapter, 'BasketballMatchAdapter must be defined');

function makeFakeRoster(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `p_${i + 1}`,
    name: `Atleta ${i + 1}`,
    pos: i === 0 ? 'PG' : i === 1 ? 'SG' : i === 2 ? 'SF' : i === 3 ? 'PF' : i === 4 ? 'C' : 'RES',
    usage: 1.0,
    shooting: 75 + (i < 5 ? 5 : -5),
    defense: 75,
    finishing: 75,
    threepoint: 75,
    rebound: 75
  }));
}

const homeTeam = { id: 'team_h', name: 'Time Mandante', roster: makeFakeRoster(10), offense: 80, defense: 78, rating: 79 };
const awayTeam = { id: 'team_a', name: 'Time Visitante', roster: makeFakeRoster(10), offense: 76, defense: 75, rating: 75 };

const bState = bAdapter.createInitialMatchState(homeTeam, awayTeam);
assert(bState.lineups.home.active.length === 5, 'Must have 5 active starters');
assert(bState.lineups.home.bench.length === 5, 'Must have 5 bench players');
assert(bState.playerEnergy, 'Must initialize playerEnergy map');
assert(bState.hotHand, 'Must initialize hotHand map');
assert.strictEqual(bState.playerEnergy['p_1'], 100, 'Player starts at 100% energy');

// Simulate 10 ticks
for (let i = 0; i < 10; i++) {
  const ev = bAdapter.simulateTick(bState, homeTeam, awayTeam);
  if (ev) bAdapter.applyEvent(bState, ev);
}

const active1Energy = bState.playerEnergy['p_1'];
const bench1Energy = bState.playerEnergy['p_6'];
console.log(`Starter energy after 10 ticks: ${active1Energy.toFixed(1)}% | Bench energy: ${bench1Energy.toFixed(1)}%`);
assert(active1Energy < 100, 'On-court starter must drain energy during play');

// Test single substitution
const subSuccess = bAdapter.applySubstitution(bState, 'home', 'p_1', 'p_6');
assert(subSuccess, 'Substitution must succeed');
assert(bState.lineups.home.active.includes('p_6'), 'p_6 must now be active');
assert(bState.lineups.home.bench.includes('p_1'), 'p_1 must now be on bench');

// Test full line change (5 for 5)
const lineChangeSuccess = bAdapter.substituteEntireLine(bState, 'home');
assert(lineChangeSuccess, 'Line change must succeed');
console.log('Active after line change:', bState.lineups.home.active);
assert(bState.events.some(e => e.type === 'line_change'), 'Line change event must be logged');

// Test timeout effect
const preTimeoutEnergy = bState.playerEnergy[bState.lineups.home.active[0]];
bState.hotHand['opp_star'] = 3; // opponent on a hot streak
const timeoutSuccess = bAdapter.applyTimeout(bState, 'home');
assert(timeoutSuccess, 'Timeout must succeed');
const postTimeoutEnergy = bState.playerEnergy[bState.lineups.home.active[0]];
console.log(`Energy before timeout: ${preTimeoutEnergy.toFixed(1)}% | after: ${postTimeoutEnergy.toFixed(1)}%`);
assert(postTimeoutEnergy > preTimeoutEnergy, 'Timeout must restore stamina');
assert(bState.events.some(e => e.type === 'timeout'), 'Timeout event must be logged');

console.log('--- Testing Futsal Match Adapter Lineup & Quarteto ---');
const fAdapter = context.window.TemporadaTotal.FutsalMatchAdapter;
assert(fAdapter, 'FutsalMatchAdapter must be defined');

function makeFutsalRoster(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `fp_${i + 1}`,
    name: `Futsaleiro ${i + 1}`,
    pos: i === 0 || i === 8 ? 'GOL' : i % 2 === 0 ? 'FIX' : 'ALA',
    usage: 1.0,
    finishing: 75,
    shooting: 75,
    defense: 75,
    passing: 75
  }));
}

const fHome = { id: 'f_h', name: 'Futsal Mandante', roster: makeFutsalRoster(10), offense: 78, defense: 77, rating: 77 };
const fAway = { id: 'f_a', name: 'Futsal Visitante', roster: makeFutsalRoster(10), offense: 75, defense: 75, rating: 75 };

const fState = fAdapter.createInitialMatchState(fHome, fAway);
assert(fState.lineups.home.active.length === 5, 'Futsal active must be 5 (1 keeper + 4 court)');
assert.strictEqual(fState.playerEnergy['fp_1'], 100);

for (let i = 0; i < 6; i++) {
  const ev = fAdapter.simulateTick(fState, fHome, fAway);
  if (ev) fAdapter.applyEvent(fState, ev);
}

// Test futsal quarteto swap
const fLineChange = fAdapter.substituteEntireLine(fState, 'home');
assert(fLineChange, 'Futsal quarteto change must succeed');
assert(fState.events.some(e => e.type === 'line_change'), 'Futsal line change event logged');

// Test futsal timeout
const fTimeout = fAdapter.applyTimeout(fState, 'home');
assert(fTimeout, 'Futsal timeout must succeed');
assert(fState.events.some(e => e.type === 'timeout'), 'Futsal timeout event logged');

console.log('--- Testing Volleyball Line Change & Timeout ---');
const vAdapter = context.window.TemporadaTotal.VolleyballMatchAdapter;
assert(vAdapter, 'VolleyballMatchAdapter must be defined');

function makeVolleyRoster(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `vp_${i + 1}`,
    name: `Voleibolista ${i + 1}`,
    pos: i === 0 ? 'LEV' : i === 6 ? 'LIB' : 'PON',
    usage: 1.0,
    attack: 75,
    block: 75,
    reception: 75,
    serve: 75
  }));
}

const vHome = { id: 'v_h', name: 'Vôlei Mandante', roster: makeVolleyRoster(10), rating: 78 };
const vAway = { id: 'v_a', name: 'Vôlei Visitante', roster: makeVolleyRoster(10), rating: 75 };

const vState = vAdapter.createInitialMatchState(vHome, vAway);
assert(vState.lineups.home.active.length >= 6);

for (let i = 0; i < 6; i++) {
  const ev = vAdapter.simulateTick(vState, vHome, vAway);
  if (ev) vAdapter.applyEvent(vState, ev);
}

const vLineChange = vAdapter.substituteEntireLine(vState, 'home');
assert(vLineChange, 'Volleyball line change must succeed');

const vTimeout = vAdapter.applyTimeout(vState, 'home');
assert(vTimeout, 'Volleyball timeout must succeed');

console.log('--- Testing LiveSimulation Controller with Line Change & Timeout ---');
const liveSim = context.window.TemporadaTotal.createLiveSimulation({
  adapter: bAdapter,
  homeTeam,
  awayTeam
});

liveSim.tick();
liveSim.setCoaching({ lineChange: { teamId: 'home' } }, { label: 'Troca de linha pelo controlador' });
assert(liveSim.getState().events.some(e => e.type === 'line_change'), 'Controller lineChange must execute via adapter');

liveSim.setCoaching({ timeout: { teamId: 'home' } }, { label: 'Tempo técnico pelo controlador' });
assert(liveSim.getState().events.some(e => e.type === 'timeout'), 'Controller timeout must execute via adapter');

console.log('>>> ALL TACTICAL ROTATION & FATIGUE TESTS PASSED! <<<');
