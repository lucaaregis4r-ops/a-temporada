(function () {
  const base = window.TemporadaTotal?.VolleyballGenerationConfig;
  if (!base) {
    console.warn("[procedural] VolleyballGenerationConfig base nao foi carregado para o volei feminino.");
    return;
  }

  const config = JSON.parse(JSON.stringify(base));
  config.defaultGender = "feminino";
  config.variant = "volei-feminino";
  config.positions.LEV.heightRange = [168, 188];
  config.positions.OPP.heightRange = [178, 198];
  config.positions.PON.heightRange = [174, 194];
  config.positions.CEN.heightRange = [182, 204];
  config.positions.LIB.heightRange = [160, 178];

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    VolleyballGenerationConfig: config
  };
})();

