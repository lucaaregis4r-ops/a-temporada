window.TemporadaTotal?.registerSport?.({
  id: "natacao",
  label: "Natacao",
  storageKey: "temporada-total-natacao-v4",
  rosterUnit: "nadadores",
  defaultDivision: "misto",
  defaultTrainingFocus: "training-blocks",
  scoreModel: "times-and-points",
  standingsModel: "meet-points",
  sharedFamily: "temporada-com-elenco",
  coreLoop: [
    "montar equipe",
    "distribuir treinos e provas",
    "simular meeting",
    "atualizar fadiga e progresso",
    "acompanhar ranking"
  ],
  primaryStats: ["sprint", "endurance", "technique", "turns", "recovery"],
  sportSpecificRules: [
    "provas por tempo",
    "lineup por evento",
    "pontuacao por meeting"
  ]
});
