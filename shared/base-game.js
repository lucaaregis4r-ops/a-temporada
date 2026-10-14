(function () {
  const sports = {};

  function clone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function roundStat(value) {
    return Math.round(clamp(value, 0, 100));
  }

  function registerSport(manifest) {
    if (!manifest || !manifest.id) {
      throw new Error("Manifesto de modalidade invalido: faltou o id.");
    }
    sports[manifest.id] = clone(manifest);
    window.SEASON_SPORT_MANIFEST = clone(manifest);
    return sports[manifest.id];
  }

  function getSport(id) {
    return clone(sports[id] || window.SEASON_SPORT_MANIFEST || null);
  }

  function registerLegacyRuntime(runtime) {
    const manifest = window.SEASON_SPORT_MANIFEST || null;
    window.SEASON_RUNTIME = {
      manifest,
      state: runtime?.state || null,
      actions: runtime?.actions || {},
      selectors: runtime?.selectors || {}
    };
    document.dispatchEvent(new CustomEvent("season:runtime-ready", {
      detail: { manifest: clone(manifest) }
    }));
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    clamp,
    roundStat,
    clone,
    registerSport,
    getSport,
    registerLegacyRuntime
  };
})();
