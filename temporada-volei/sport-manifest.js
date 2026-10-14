window.TemporadaTotal?.registerSport?.({
  id: "volei",
  label: "Volei",
  storageKey: "temporada-total-volei-v2",
  customConfigStorageKey: "temporada-total-volei-custom-config-v1",
  rosterUnit: "atletas",
  defaultDivision: "masculino",
  defaultTrainingFocus: "serve",
  scoreModel: "sets",
  standingsModel: "league-points",
  sharedFamily: "quadra-com-elenco",
  coreLoop: [
    "montar elenco",
    "ajustar comissao, tatica e treino",
    "simular rodada",
    "resolver eventos",
    "acompanhar tabela e playoffs"
  ],
  primaryStats: ["serve", "attack", "block", "reception", "setting", "defense"],
  matchStatsSchema: ["points", "attacks", "attackPoints", "attackErrors", "counterattacks", "aces", "serveErrors", "receptions", "receptionErrors", "positiveReceptions", "blocks", "digs", "setAssists", "errors", "efficiency", "rating"],
  sportSpecificRules: [
    "simulacao por sets",
    "pontuacao de liga por resultado",
    "volume tecnico de recepcao e levantamento"
  ]
});
