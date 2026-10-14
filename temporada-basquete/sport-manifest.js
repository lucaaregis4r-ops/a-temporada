window.TemporadaTotal?.registerSport?.({
  id: "basquete",
  label: "Basquete",
  storageKey: "temporada-total-basquete-v2",
  customConfigStorageKey: "temporada-total-basquete-custom-config-v1",
  rosterUnit: "atletas",
  defaultDivision: "masculino",
  defaultTrainingFocus: "shooting",
  scoreModel: "points",
  standingsModel: "wins-losses",
  sharedFamily: "quadra-com-elenco",
  coreLoop: [
    "montar elenco",
    "ajustar comissao, tatica e treino",
    "simular rodada",
    "resolver eventos",
    "acompanhar tabela e playoffs"
  ],
  primaryStats: ["threepoint", "physical", "tactical", "technique", "defense"],
  matchStatsSchema: ["minutes", "points", "fgm", "fga", "threeMade", "threeAttempted", "ftm", "fta", "offensiveRebounds", "defensiveRebounds", "rebounds", "assists", "steals", "blocks", "turnovers", "fouls", "efficiency", "effPer36", "rating"],
  sportSpecificRules: [
    "placar por pontos",
    "desempate de partidas apertadas",
    "uso individual de jogadores por posicao"
  ]
});
