(function () {
  const UINT32_MAX_PLUS_ONE = 4294967296;

  // FNV-1a turns any seed string into a stable 32-bit state for the generator.
  function hashSeed(seed) {
    const text = String(seed ?? "A-TEMPORADA");
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  // Mulberry32 is small, deterministic and good enough for procedural content.
  function nextState(state) {
    let value = state + 0x6D2B79F5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return {
      state: value >>> 0,
      result: ((value ^ (value >>> 14)) >>> 0) / UINT32_MAX_PLUS_ONE
    };
  }

  function createSeededRng(seed) {
    let state = hashSeed(seed);

    function next() {
      const step = nextState(state);
      state = step.state;
      return step.result;
    }

    function float(min = 0, max = 1) {
      const from = Number(min);
      const to = Number(max);
      return from + next() * (to - from);
    }

    function int(min, max) {
      const from = Math.ceil(Number(min));
      const to = Math.floor(Number(max));
      return Math.floor(float(from, to + 1));
    }

    function pick(array) {
      if (!Array.isArray(array) || !array.length) return null;
      return array[int(0, array.length - 1)];
    }

    function getWeight(item, weightKeyOrFunction) {
      if (typeof weightKeyOrFunction === "function") {
        return Number(weightKeyOrFunction(item)) || 0;
      }
      if (typeof weightKeyOrFunction === "string") {
        return Number(item?.[weightKeyOrFunction]) || 0;
      }
      return Number(item?.weight) || 1;
    }

    function weightedPick(items, weightKeyOrFunction) {
      if (!Array.isArray(items) || !items.length) return null;
      const weights = items.map((item) => Math.max(0, getWeight(item, weightKeyOrFunction)));
      const total = weights.reduce((sum, weight) => sum + weight, 0);
      if (total <= 0) return pick(items);

      let roll = float(0, total);
      for (let index = 0; index < items.length; index += 1) {
        roll -= weights[index];
        if (roll <= 0) return items[index];
      }
      return items[items.length - 1];
    }

    function shuffle(array) {
      if (!Array.isArray(array)) return [];
      const copy = array.slice();
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = int(0, index);
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
      }
      return copy;
    }

    function chance(probability) {
      return next() < Math.min(1, Math.max(0, Number(probability) || 0));
    }

    function getState() {
      return state >>> 0;
    }

    return {
      seed: String(seed ?? "A-TEMPORADA"),
      next,
      float,
      int,
      pick,
      weightedPick,
      shuffle,
      chance,
      getState
    };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    createSeededRng
  };
})();
