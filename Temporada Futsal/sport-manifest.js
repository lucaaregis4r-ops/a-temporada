window.TemporadaTotal?.registerSport?.({
  id: "futsal",
  label: "Futsal",
  storageKey: "temporada-total-futsal-v2",
  customConfigStorageKey: "temporada-total-futsal-custom-config-v1",
  rosterUnit: "atletas",
  defaultDivision: "masculino",
  defaultTrainingFocus: "finishingTrain",
  scoreModel: "goals",
  standingsModel: "wins-draws-losses",
  sharedFamily: "quadra-com-elenco",
  coreLoop: [
    "montar elenco",
    "ajustar comissao, tatica e treino",
    "simular rodada",
    "resolver eventos",
    "acompanhar tabela e playoffs"
  ],
  primaryStats: ["finishing", "passing", "marking", "goalkeeping", "physical", "tactical"],
  matchStatsSchema: ["minutes", "goals", "assists", "shots", "shotsOnTarget", "passes", "keyPasses", "steals", "blocks", "saves", "goalsConceded", "turnovers", "fouls", "foulsCommitted", "foulsDrawn", "yellowCards", "redCards", "efficiency", "rating"],
  sportSpecificRules: [
    "placar por gols",
    "empates na temporada regular",
    "peso especial para goleiros"
  ]
});
