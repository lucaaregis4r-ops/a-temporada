(function () {
  const ProceduralLoreDatasets = {
  "source": {
    "loreFile": "Lores e decisões/Banco_100_Lores_Liga.md",
    "narrativesFile": "Lores e decisões/Banco_100_Lores_Narrativas.json",
    "decisionsFile": "Lores e decisões/Banco_2000_Decisoes_Ramificadas_Unificado.json"
  },
  "lores": [
    {
      "id": "lore_001_last_dance",
      "number": 1,
      "label": "The Last Dance",
      "category": "veteranos",
      "description": "Uma geração histórica faz sua última temporada junta. A torcida quer mais um título, mas o tempo cobra preço físico e técnico.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "titulo",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "experiência",
        "liderança",
        "identificação com a torcida"
      ],
      "weaknesses": [
        "idade",
        "fadiga",
        "risco de lesão",
        "pressão emocional"
      ],
      "frequentEvents": [
        "poupar veterano",
        "última chance de título",
        "entrevista sobre fim de ciclo"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 95,
        "morale": 50
      },
      "traits": [
        "veteranos",
        "experiencia",
        "lideranca",
        "identificacao_com_a_torcida",
        "idade",
        "fadiga",
        "poupar_veterano",
        "ultima_chance_de_titulo"
      ],
      "opening": "O capitão reúne os veteranos depois que a fisioterapia recomenda poupar dois titulares na estreia.",
      "dilemma": "Buscar o último título juntos exige escolher entre tempo de jogo e pernas inteiras para a decisão.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "veteranos",
          "fim_de_ciclo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_002_azarao_financeiro",
      "number": 2,
      "label": "Azarão Financeiro",
      "category": "sobrevivência",
      "description": "A crise financeira obriga o clube a montar elenco barato com base e apostas. Cair seria uma tragédia institucional.",
      "objective": "evitar rebaixamento",
      "objectiveKey": "nao_cair",
      "rawObjective": "não cair",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "sobrevivencia",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "base motivada",
        "baixa expectativa técnica",
        "unidade pela sobrevivência"
      ],
      "weaknesses": [
        "elenco curto",
        "pouca profundidade",
        "risco de vender talentos"
      ],
      "frequentEvents": [
        "proposta por promessa",
        "pressão após derrotas",
        "chance de herói improvável"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "sobrevivencia",
        "base_motivada",
        "baixa_expectativa_tecnica",
        "unidade_pela_sobrevivencia",
        "elenco_curto",
        "pouca_profundidade",
        "proposta_por_promessa",
        "pressao_apos_derrotas"
      ],
      "opening": "Uma proposta pela maior promessa chega à mesa na semana em que o caixa já não cobre todo o elenco.",
      "dilemma": "A base precisa garantir a permanência enquanto o clube resiste à venda que pagaria as contas.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "nao_cair",
          "sobrevivencia",
          "crise",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_003_gigante_adormecido",
      "number": 3,
      "label": "Gigante Adormecido",
      "category": "reconstrução",
      "description": "Clube tradicional tenta voltar ao topo depois de anos medianos. A torcida lembra do passado e tem pouca paciência.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "unbalanced",
      "strengthTier": "good",
      "strengths": [
        "tradição",
        "torcida grande",
        "estrutura"
      ],
      "weaknesses": [
        "ansiedade coletiva",
        "comparação com o passado",
        "crise rápida"
      ],
      "frequentEvents": [
        "cobrança por clássico",
        "ídolo opinando na mídia",
        "pressão por contratação"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "reconstrucao",
        "tradicao",
        "torcida_grande",
        "estrutura",
        "ansiedade_coletiva",
        "comparacao_com_o_passado",
        "cobranca_por_classico",
        "idolo_opinando_na_midia"
      ],
      "opening": "Um ídolo cobra reforços na rádio antes do primeiro clássico de uma torcida cansada de campanhas medianas.",
      "dilemma": "A estrutura para voltar aos playoffs existe, mas cada tropeço reacende a comparação com os anos de glória.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "reconstrucao",
          "paciencia",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_004_base_de_ouro",
      "number": 4,
      "label": "Base de Ouro",
      "category": "formação",
      "description": "Uma geração muito talentosa da base chega ao profissional ao mesmo tempo. O clube precisa decidir entre desenvolver e competir.",
      "objective": "desenvolver jovens",
      "objectiveKey": "desenvolver_base",
      "rawObjective": "desenvolver base",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "desenvolvimento",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "potencial",
        "energia",
        "identidade futura"
      ],
      "weaknesses": [
        "inexperiência",
        "oscilação",
        "assédio de clubes ricos"
      ],
      "frequentEvents": [
        "dar minutos à promessa",
        "erro decisivo de jovem",
        "venda milionária"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "formacao",
        "potencial",
        "energia",
        "identidade_futura",
        "inexperiencia",
        "oscilacao",
        "dar_minutos_a_promessa",
        "erro_decisivo_de_jovem"
      ],
      "opening": "Três jogadores da base aparecem entre os titulares na abertura, e um olheiro de um clube rico já pede credencial.",
      "dilemma": "Dar espaço à geração de ouro pode custar pontos agora e acelerar sua saída depois.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "desenvolver_base",
          "base",
          "desenvolvimento",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_005_dinheiro_novo",
      "number": 5,
      "label": "Dinheiro Novo",
      "category": "projeto rico",
      "description": "Novo investidor injeta dinheiro e exige resultado rápido. O elenco é caro, mas ainda sem identidade coletiva.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "elite",
      "budgetBias": 1.63,
      "pressure": "muito alta",
      "fanPressure": "alta",
      "boardPressure": "muito alta",
      "mediaExposure": "muito alta",
      "ambition": "titulo",
      "rosterProfile": "expensive_unbalanced",
      "strengthTier": "good",
      "strengths": [
        "orçamento",
        "contratações fortes",
        "ambição"
      ],
      "weaknesses": [
        "ego no elenco",
        "pressa",
        "rejeição de rivais"
      ],
      "frequentEvents": [
        "estrela insatisfeita",
        "cobrança pública",
        "contratação de impacto"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 25,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "projeto_rico",
        "orcamento",
        "contratacoes_fortes",
        "ambicao",
        "ego_no_elenco",
        "pressa",
        "estrela_insatisfeita",
        "cobranca_publica"
      ],
      "opening": "O novo investidor anuncia uma contratação de impacto enquanto a estrela atual reclama de seu papel no time.",
      "dilemma": "O dinheiro compra talento, mas a corrida pelo título depende de construir um elenco que aceite dividir o protagonismo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "investidor",
          "pressa",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_006_fabrica_de_promessas",
      "number": 6,
      "label": "Fábrica de Promessas",
      "category": "formação",
      "description": "O clube é conhecido por revelar talentos e vender caro. Ganhar importa, mas formar jogadores é parte da identidade.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "scout",
        "base forte",
        "potencial de evolução"
      ],
      "weaknesses": [
        "perde atletas cedo",
        "falta de veteranos",
        "torcida dividida"
      ],
      "frequentEvents": [
        "proposta internacional",
        "promessa pedindo espaço",
        "veterano questiona juventude"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "formacao",
        "scout",
        "base_forte",
        "potencial_de_evolucao",
        "perde_atletas_cedo",
        "falta_de_veteranos",
        "proposta_internacional",
        "promessa_pedindo_espaco"
      ],
      "opening": "Uma proposta internacional chega pelo jovem destaque que acabou de pedir mais minutos no profissional.",
      "dilemma": "A fábrica precisa continuar formando e vendendo sem esvaziar a equipe antes de competir.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "base",
          "desenvolvimento",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_007_tropa_operaria",
      "number": 7,
      "label": "Tropa Operária",
      "category": "coletivo",
      "description": "Equipe sem estrelas, construída em defesa, disciplina e sacrifício. Ninguém quer enfrentá-los em jogo duro.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "coesão",
        "defesa",
        "resiliência"
      ],
      "weaknesses": [
        "pouca criatividade",
        "ataque previsível",
        "dependência física"
      ],
      "frequentEvents": [
        "treino pesado",
        "jogo truncado",
        "elogio ao sistema coletivo"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialFatigue": 10,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 62,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "coletivo",
        "coesao",
        "defesa",
        "resiliencia",
        "pouca_criatividade",
        "ataque_previsivel",
        "treino_pesado",
        "jogo_truncado"
      ],
      "opening": "Depois de um treino defensivo exaustivo, o adversário neutraliza as principais rotas de ataque e desafia o time a criar pontos.",
      "dilemma": "A disciplina que levou a tropa aos playoffs pode cobrar um preço físico e limitar o ataque.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "coesao",
          "disciplina",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_008_clube_dos_artistas",
      "number": 8,
      "label": "Clube dos Artistas",
      "category": "talento instável",
      "description": "Elenco cheio de jogadores talentosos, criativos e difíceis de controlar. Quando encaixa, encanta. Quando não, implode.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "defense_first",
      "strengthTier": "good",
      "strengths": [
        "talento individual",
        "improviso",
        "marketing"
      ],
      "weaknesses": [
        "indisciplina",
        "ego",
        "oscilação"
      ],
      "frequentEvents": [
        "craque reclama",
        "treinador cobra ordem",
        "show contra rival"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "talento_instavel",
        "talento_individual",
        "improviso",
        "marketing",
        "indisciplina",
        "ego",
        "craque_reclama",
        "treinador_cobra_ordem"
      ],
      "opening": "O craque reclama da liberdade que perdeu após o treinador exigir uma jogada ensaiada no clássico.",
      "dilemma": "A criatividade capaz de encantar a liga também ameaça a ordem necessária para chegar aos playoffs.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "ego",
          "oscilacao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_009_rebaixado_ferido",
      "number": 9,
      "label": "Rebaixado Ferido",
      "category": "retorno",
      "description": "O clube acabou de voltar de uma queda traumática. A temporada é sobre dignidade, estabilidade e cicatrizar a relação com a torcida.",
      "objective": "evitar rebaixamento",
      "objectiveKey": "nao_cair",
      "rawObjective": "não cair",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "sobrevivencia",
      "rosterProfile": "low_budget_fight",
      "strengthTier": "low",
      "strengths": [
        "sede de resposta",
        "torcida mobilizada",
        "humildade"
      ],
      "weaknesses": [
        "medo de nova queda",
        "ambiente sensível",
        "memória traumática"
      ],
      "frequentEvents": [
        "fantasma do rebaixamento",
        "vitória simbólica",
        "torcida protesta"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "retorno",
        "sede_de_resposta",
        "torcida_mobilizada",
        "humildade",
        "medo_de_nova_queda",
        "ambiente_sensivel",
        "fantasma_do_rebaixamento",
        "vitoria_simbolica"
      ],
      "opening": "Na volta à elite, uma derrota cedo faz a arquibancada repetir o canto da temporada do rebaixamento.",
      "dilemma": "A sede de resposta precisa virar estabilidade antes que o medo de outra queda domine o grupo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "nao_cair",
          "retorno",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_010_campeao_em_crise",
      "number": 10,
      "label": "Campeão em Crise",
      "category": "queda pós-título",
      "description": "O atual campeão manteve nome e camisa, mas perdeu intensidade. Todos querem derrubá-lo e a cobrança é cruel.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "alta",
      "boardPressure": "muito alta",
      "mediaExposure": "muito alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "experiência vencedora",
        "respeito dos rivais",
        "elenco acostumado a decisão"
      ],
      "weaknesses": [
        "acomodação",
        "caça dos adversários",
        "comparação com ano anterior"
      ],
      "frequentEvents": [
        "pergunta sobre ressaca",
        "veterano criticado",
        "jogo com clima de final"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "queda_pos_titulo",
        "experiencia_vencedora",
        "respeito_dos_rivais",
        "elenco_acostumado_a_decisao",
        "acomodacao",
        "caca_dos_adversarios",
        "pergunta_sobre_ressaca",
        "veterano_criticado"
      ],
      "opening": "O campeão abre a defesa do título com um veterano vaiado e perguntas sobre a intensidade que desapareceu.",
      "dilemma": "Repetir a conquista exige vencer rivais preparados para caçá-lo sem viver da reputação do ano passado.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "queda_pos_titulo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_011_time_do_bairro",
      "number": 11,
      "label": "Time do Bairro",
      "category": "identidade local",
      "description": "Clube profundamente ligado à comunidade local. Cada jogo parece representar a cidade inteira.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "pertencimento",
        "mandante forte",
        "torcida próxima"
      ],
      "weaknesses": [
        "orçamento curto",
        "pressão emocional",
        "dificuldade fora de casa"
      ],
      "frequentEvents": [
        "evento comunitário",
        "jogo em casa lotado",
        "crítica por esquecer raízes"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 70,
        "morale": 50
      },
      "traits": [
        "identidade_local",
        "pertencimento",
        "mandante_forte",
        "torcida_proxima",
        "orcamento_curto",
        "pressao_emocional",
        "evento_comunitario",
        "jogo_em_casa_lotado"
      ],
      "opening": "A associação do bairro organiza um ginásio lotado, mas o calendário começa com três jogos fora.",
      "dilemma": "O vínculo com a comunidade sustenta o clube em casa e cobra uma resposta onde a torcida não consegue acompanhá-lo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "identidade_local",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_012_império_em_declínio",
      "number": 12,
      "label": "Império em Declínio",
      "category": "decadência",
      "description": "Um clube que dominou a liga por anos agora tenta aceitar que o ciclo acabou.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "tradição",
        "estrutura",
        "memória vencedora"
      ],
      "weaknesses": [
        "elenco envelhecido",
        "negação interna",
        "torcida impaciente"
      ],
      "frequentEvents": [
        "comparação com antigas lendas",
        "derrota simbólica",
        "pedido de renovação"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "decadencia",
        "tradicao",
        "estrutura",
        "memoria_vencedora",
        "elenco_envelhecido",
        "negacao_interna",
        "comparacao_com_antigas_lendas",
        "derrota_simbolica"
      ],
      "opening": "Uma derrota para um antigo freguês faz a imprensa reeditar fotos da última dinastia do clube.",
      "dilemma": "Renovar um elenco envelhecido exige admitir o fim do império antes que a nostalgia destrua a campanha.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "decadencia",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_013_revolução_tática",
      "number": 13,
      "label": "Revolução Tática",
      "category": "inovação",
      "description": "Comissão moderna propõe um estilo novo, analítico e agressivo. Parte do elenco compra a ideia, parte resiste.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "inovação",
        "preparo estratégico",
        "surpresa"
      ],
      "weaknesses": [
        "adaptação lenta",
        "resistência de veteranos",
        "risco de parecer teimosia"
      ],
      "frequentEvents": [
        "mudança de sistema",
        "jogador questiona método",
        "vitória valida ideia"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "inovacao",
        "preparo_estrategico",
        "surpresa",
        "adaptacao_lenta",
        "resistencia_de_veteranos",
        "mudanca_de_sistema",
        "jogador_questiona_metodo"
      ],
      "opening": "No primeiro treino do novo sistema, um veterano se recusa a ocupar a posição que os dados recomendam.",
      "dilemma": "A revolução tática precisa produzir vitórias enquanto o elenco ainda aprende a confiar nela.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "inovacao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_014_clube_vitrine",
      "number": 14,
      "label": "Clube Vitrine",
      "category": "mercado",
      "description": "O clube aceita ser ponte para atletas crescerem e saírem. O desafio é competir sem apego.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "baixa",
      "fanPressure": "baixa",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "prospect_core",
      "strengthTier": "normal",
      "strengths": [
        "atrai talentos",
        "boa gestão financeira",
        "elenco jovem"
      ],
      "weaknesses": [
        "perde peças rápido",
        "baixa identificação",
        "planejamento instável"
      ],
      "frequentEvents": [
        "olheiro estrangeiro",
        "venda no meio da temporada",
        "torcida cobra ambição"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 32,
        "morale": 50
      },
      "traits": [
        "mercado",
        "atrai_talentos",
        "boa_gestao_financeira",
        "elenco_jovem",
        "perde_pecas_rapido",
        "baixa_identificacao",
        "olheiro_estrangeiro",
        "venda_no_meio_da_temporada"
      ],
      "opening": "Um olheiro estrangeiro aparece no treino do destaque que comanda o início da temporada.",
      "dilemma": "Ser vitrine financia o clube, mas cada venda ameaça a continuidade de que o time precisa para competir.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "mercado",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_015_torcida_infernal",
      "number": 15,
      "label": "Torcida Infernal",
      "category": "pressão popular",
      "description": "A torcida transforma o ginásio em caldeirão, mas também vira contra o time rápido.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "muito alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "unbalanced",
      "strengthTier": "normal",
      "strengths": [
        "mando forte",
        "energia emocional",
        "intimidação"
      ],
      "weaknesses": [
        "impaciência",
        "crise amplificada",
        "jovens sentem pressão"
      ],
      "frequentEvents": [
        "vaias após derrota",
        "mosaico histórico",
        "jogador pede apoio"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 98,
        "morale": 50
      },
      "traits": [
        "pressao_popular",
        "mando_forte",
        "energia_emocional",
        "intimidacao",
        "impaciencia",
        "crise_amplificada",
        "vaias_apos_derrota",
        "mosaico_historico"
      ],
      "opening": "O ginásio recebe o elenco com um mosaico, e as primeiras vaias surgem antes do intervalo.",
      "dilemma": "A energia da arquibancada pode empurrar a equipe ou esmagar os jovens a cada erro.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "pressao_popular",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_016_elenco_sem_casa",
      "number": 16,
      "label": "Elenco Sem Casa",
      "category": "nomadismo",
      "description": "Problemas no ginásio obrigam o clube a jogar longe de sua torcida. A temporada vira teste de resistência mental.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "low_budget_fight",
      "strengthTier": "low",
      "strengths": [
        "união pela dificuldade",
        "baixa pressão local",
        "resiliência"
      ],
      "weaknesses": [
        "viagens longas",
        "fadiga",
        "perda de mando"
      ],
      "frequentEvents": [
        "jogo em cidade neutra",
        "reclamação logística",
        "torcida organiza caravana"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialFatigue": 10,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 62,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "nomadismo",
        "uniao_pela_dificuldade",
        "baixa_pressao_local",
        "resiliencia",
        "viagens_longas",
        "fadiga",
        "jogo_em_cidade_neutra",
        "reclamacao_logistica"
      ],
      "opening": "O primeiro mando será numa cidade neutra, a horas de viagem da torcida que prometeu uma caravana.",
      "dilemma": "A união nascida do deslocamento precisa compensar a fadiga e a perda do próprio ginásio.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "nomadismo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_017_lenda_no_banco",
      "number": 17,
      "label": "Lenda no Banco",
      "category": "ídolo treinador",
      "description": "Um dos maiores ídolos do clube assume como treinador. O carinho inicial é enorme, mas a cobrança pode destruir o mito.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "identificação",
        "liderança simbólica",
        "apoio inicial"
      ],
      "weaknesses": [
        "inexperiência",
        "proteção excessiva",
        "crítica vira drama"
      ],
      "frequentEvents": [
        "ídolo questionado",
        "clássico emocional",
        "coletiva defendendo legado"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 0,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "idolo_treinador",
        "identificacao",
        "lideranca_simbolica",
        "apoio_inicial",
        "inexperiencia",
        "protecao_excessiva",
        "idolo_questionado",
        "classico_emocional"
      ],
      "opening": "O novo treinador entra na quadra sob o canto de seu nome como jogador antes de comandar o primeiro clássico.",
      "dilemma": "O ídolo precisa tomar decisões impopulares sem deixar que a cobrança destrua seu legado.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "idolo_treinador",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_018_comissao_dividida",
      "number": 18,
      "label": "Comissão Dividida",
      "category": "conflito interno",
      "description": "Preparador, auxiliar e diretoria discordam sobre carga, estratégia e prioridades. O técnico precisa mediar antes que vaze.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "média",
      "boardPressure": "alta",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "unbalanced",
      "strengthTier": "normal",
      "strengths": [
        "especialistas fortes",
        "debate interno",
        "profissionalismo"
      ],
      "weaknesses": [
        "ruído",
        "decisões lentas",
        "vazamento"
      ],
      "frequentEvents": [
        "fisioterapia alerta",
        "auxiliar discorda",
        "diretoria cobra alinhamento"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 62,
        "morale": 50
      },
      "traits": [
        "conflito_interno",
        "especialistas_fortes",
        "debate_interno",
        "profissionalismo",
        "ruido",
        "decisoes_lentas",
        "fisioterapia_alerta",
        "auxiliar_discorda"
      ],
      "opening": "Um alerta da fisioterapia contradiz o plano do auxiliar, e a diretoria exige explicações antes do jogo.",
      "dilemma": "O técnico precisa usar seus especialistas sem permitir que a divergência vire vazamento e paralisia.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "conflito_interno",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_019_clube_academia",
      "number": 19,
      "label": "Clube Academia",
      "category": "ciência esportiva",
      "description": "Projeto baseado em dados, controle de carga e desenvolvimento físico. A pergunta é se o jogo aceita tanta racionalidade.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "controle de carga",
        "prevenção",
        "evolução física"
      ],
      "weaknesses": [
        "torcida acha frio",
        "atletas impacientes",
        "poupar em jogo importante"
      ],
      "frequentEvents": [
        "relatório de fadiga",
        "estrela poupada",
        "vitória da metodologia"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "ciencia_esportiva",
        "controle_de_carga",
        "prevencao",
        "evolucao_fisica",
        "torcida_acha_frio",
        "atletas_impacientes",
        "relatorio_de_fadiga",
        "estrela_poupada"
      ],
      "opening": "O relatório de carga recomenda poupar a estrela justamente na noite em que a torcida mais espera vê-la.",
      "dilemma": "O método pode proteger o elenco para a temporada inteira, mas precisa sobreviver à cobrança de cada partida.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "ciencia_esportiva",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_020_selecao_de_estrangeiros",
      "number": 20,
      "label": "Seleção de Estrangeiros",
      "category": "elenco global",
      "description": "Muitos atletas de fora chegam com estilos, línguas e culturas diferentes. O talento é grande, a coesão ainda não.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "média",
      "boardPressure": "alta",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "talento diverso",
        "experiência internacional",
        "imprevisibilidade"
      ],
      "weaknesses": [
        "barreira cultural",
        "adaptação",
        "pouca identidade local"
      ],
      "frequentEvents": [
        "conflito cultural",
        "torcida abraça estrangeiro",
        "problema de comunicação"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 62,
        "morale": 50
      },
      "traits": [
        "elenco_global",
        "talento_diverso",
        "experiencia_internacional",
        "imprevisibilidade",
        "barreira_cultural",
        "adaptacao",
        "conflito_cultural",
        "torcida_abraca_estrangeiro"
      ],
      "opening": "Dois reforços discutem uma instrução no treino porque a tradução chegou tarde demais.",
      "dilemma": "O talento internacional só vira força coletiva se o clube superar idioma, adaptação e distância da torcida.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "elenco_global",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_021_orgulho_da_base_local",
      "number": 21,
      "label": "Orgulho da Base Local",
      "category": "territorial",
      "description": "A torcida quer ver atletas da cidade em quadra. Contratar demais pode ser visto como trair a identidade.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "identidade local",
        "apoio aos jovens",
        "pertencimento"
      ],
      "weaknesses": [
        "limite técnico",
        "pressão em pratas da casa",
        "mercado restrito"
      ],
      "frequentEvents": [
        "base pede passagem",
        "contratação rejeitada",
        "jovem decide clássico"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 70,
        "morale": 50
      },
      "traits": [
        "territorial",
        "identidade_local",
        "apoio_aos_jovens",
        "pertencimento",
        "limite_tecnico",
        "pressao_em_pratas_da_casa",
        "base_pede_passagem",
        "contratacao_rejeitada"
      ],
      "opening": "Um jovem da cidade decide o amistoso e a torcida reage mal à notícia de outro reforço de fora.",
      "dilemma": "Valorizar a base local fortalece o pertencimento, mas estreita as opções quando faltar qualidade.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "territorial",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_022_projeto_militar",
      "number": 22,
      "label": "Projeto Militar",
      "category": "disciplina",
      "description": "Elenco montado em hierarquia, regras rígidas e intensidade. Funciona até alguém sentir que perdeu liberdade.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "disciplina",
        "defesa",
        "regularidade"
      ],
      "weaknesses": [
        "rigidez",
        "conflito com criativos",
        "desgaste"
      ],
      "frequentEvents": [
        "regra quebrada",
        "treino fechado",
        "capitão cobra grupo"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "disciplina",
        "defesa",
        "regularidade",
        "rigidez",
        "conflito_com_criativos",
        "regra_quebrada",
        "treino_fechado"
      ],
      "opening": "Depois que uma regra do treino é quebrada, o capitão pede punição para o jogador mais criativo do elenco.",
      "dilemma": "A hierarquia sustenta a defesa, mas pode expulsar a liberdade que decidiria jogos apertados.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "disciplina",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_023_rivalidade_sangrenta",
      "number": 23,
      "label": "Rivalidade Sangrenta",
      "category": "clássicos",
      "description": "A temporada inteira parece girar em torno dos jogos contra o rival. Ganhar o clássico pode salvar tudo; perder pode incendiar tudo.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "motivação em clássicos",
        "torcida mobilizada",
        "narrativa forte"
      ],
      "weaknesses": [
        "obsessão",
        "perde foco contra pequenos",
        "pressão extrema"
      ],
      "frequentEvents": [
        "semana de clássico",
        "provocação do rival",
        "derrota vira crise"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 0,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "classicos",
        "motivacao_em_classicos",
        "torcida_mobilizada",
        "narrativa_forte",
        "obsessao",
        "perde_foco_contra_pequenos",
        "semana_de_classico",
        "provocacao_do_rival"
      ],
      "opening": "Uma provocação do rival circula no vestiário antes de uma rodada que ainda tem outros adversários.",
      "dilemma": "A rivalidade mobiliza o clube, mas a obsessão pelo clássico pode custar a classificação.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "classicos",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_024_equipe_silenciosa",
      "number": 24,
      "label": "Equipe Silenciosa",
      "category": "baixa exposição",
      "description": "Clube discreto, sem grandes estrelas e sem barulho. A força está em trabalhar longe dos holofotes.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "baixa",
      "fanPressure": "baixa",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "tranquilidade",
        "coesão",
        "baixa pressão"
      ],
      "weaknesses": [
        "pouca receita",
        "falta de estrela",
        "invisibilidade"
      ],
      "frequentEvents": [
        "imprensa ignora",
        "sequência surpreendente",
        "jogador pede reconhecimento"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": -15,
        "initialFatigue": 10,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 62,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 25,
        "morale": 50
      },
      "traits": [
        "baixa_exposicao",
        "tranquilidade",
        "coesao",
        "baixa_pressao",
        "pouca_receita",
        "falta_de_estrela",
        "imprensa_ignora",
        "sequencia_surpreendente"
      ],
      "opening": "A imprensa ignora a terceira vitória seguida, e um titular pergunta por que ninguém conhece seu nome.",
      "dilemma": "Trabalhar em silêncio protege a coesão, mas a invisibilidade limita receita e reconhecimento.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "baixa_exposicao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_025_estrelas_e_reservas",
      "number": 25,
      "label": "Estrelas e Reservas",
      "category": "desigualdade",
      "description": "O elenco tem alguns jogadores muito caros e reservas bem abaixo. A diferença salarial ameaça o vestiário.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "estrelas decisivas",
        "marketing",
        "alto teto"
      ],
      "weaknesses": [
        "ciúme salarial",
        "banco fraco",
        "dependência"
      ],
      "frequentEvents": [
        "reserva reclama",
        "estrela pede privilégio",
        "lesão expõe elenco curto"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "desigualdade",
        "estrelas_decisivas",
        "marketing",
        "alto_teto",
        "ciume_salarial",
        "banco_fraco",
        "reserva_reclama",
        "estrela_pede_privilegio"
      ],
      "opening": "Uma lesão tira a principal estrela da rotação, e o reserva que ganha minutos cobra o mesmo respeito salarial.",
      "dilemma": "O brilho dos titulares precisa sobreviver a um banco curto e à distância entre contratos.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "desigualdade",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_026_o_time_da_virada",
      "number": 26,
      "label": "O Time da Virada",
      "category": "mentalidade",
      "description": "Equipe conhecida por buscar jogos impossíveis. O problema é que costuma começar mal demais.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "resiliência",
        "moral em decisão",
        "torcida acredita"
      ],
      "weaknesses": [
        "início lento",
        "desgaste emocional",
        "risco de depender do caos"
      ],
      "frequentEvents": [
        "virada épica",
        "cobrança por concentração",
        "preleção emocional"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "mentalidade",
        "resiliencia",
        "moral_em_decisao",
        "torcida_acredita",
        "inicio_lento",
        "desgaste_emocional",
        "virada_epica",
        "cobranca_por_concentracao"
      ],
      "opening": "Após mais uma virada improvável, o treinador mostra ao elenco o placar do primeiro quarto.",
      "dilemma": "A fé nas reações mantém o grupo vivo, mas começar sempre atrás consome energia demais.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "mentalidade",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_027_defesa_de_ferro",
      "number": 27,
      "label": "Defesa de Ferro",
      "category": "defensivo",
      "description": "A identidade do clube é defender cada posse como se fosse final. O ataque, porém, vive no limite.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "defesa",
        "regularidade",
        "jogos duros"
      ],
      "weaknesses": [
        "ataque pobre",
        "baixa atratividade",
        "depende de placar baixo"
      ],
      "frequentEvents": [
        "torcida pede ousadia",
        "vitória feia",
        "especialista elogia defesa"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "defensivo",
        "defesa",
        "regularidade",
        "jogos_duros",
        "ataque_pobre",
        "baixa_atratividade",
        "torcida_pede_ousadia",
        "vitoria_feia"
      ],
      "opening": "A defesa segura o favorito, mas a última jogada termina sem uma chance clara de finalização.",
      "dilemma": "A identidade de ferro pode levar o time longe apenas se alguém encontrar pontos quando o placar apertar.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "defensivo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_028_ataque_espetáculo",
      "number": 28,
      "label": "Ataque Espetáculo",
      "category": "ofensivo",
      "description": "O clube quer jogar bonito, acelerar e pontuar muito. A torcida ama, a defesa sofre.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "defense_first",
      "strengthTier": "normal",
      "strengths": [
        "ataque",
        "entretenimento",
        "ritmo"
      ],
      "weaknesses": [
        "defesa frágil",
        "fadiga",
        "oscilações"
      ],
      "frequentEvents": [
        "placar absurdo",
        "crítica à defesa",
        "astro vira destaque"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "ofensivo",
        "ataque",
        "entretenimento",
        "ritmo",
        "defesa_fragil",
        "fadiga",
        "placar_absurdo",
        "critica_a_defesa"
      ],
      "opening": "O astro tem uma atuação histórica, enquanto o rival pontua livremente do outro lado.",
      "dilemma": "O espetáculo ofensivo precisa de proteção defensiva para não virar apenas um placar vistoso.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "ofensivo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_029_temporada_de_luto",
      "number": 29,
      "label": "Temporada de Luto",
      "category": "emocional",
      "description": "O clube vive uma perda simbólica recente. A temporada mistura homenagem, dor e tentativa de reconstrução.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "alta",
      "ambition": "estabilidade",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "união emocional",
        "propósito",
        "torcida solidária"
      ],
      "weaknesses": [
        "peso psicológico",
        "mídia sensível",
        "quedas emocionais"
      ],
      "frequentEvents": [
        "homenagem antes do jogo",
        "jogador chora",
        "vitória dedicada"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 62,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "emocional",
        "uniao_emocional",
        "proposito",
        "torcida_solidaria",
        "peso_psicologico",
        "midia_sensivel",
        "homenagem_antes_do_jogo",
        "jogador_chora"
      ],
      "opening": "Uma homenagem antes da estreia deixa o elenco em silêncio até o aquecimento.",
      "dilemma": "Honrar a perda recente pode unir o clube, mas a dor não desaparece quando a bola sobe.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "emocional",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_030_diretoria_impaciente",
      "number": 30,
      "label": "Diretoria Impaciente",
      "category": "gestão instável",
      "description": "A diretoria troca de rumo rápido e quer resultado imediato. O técnico vive sob avaliação constante.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "média",
      "boardPressure": "muito alta",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "recursos",
        "cobrança profissional",
        "ambição"
      ],
      "weaknesses": [
        "instabilidade",
        "medo de errar",
        "pressão em sequência ruim"
      ],
      "frequentEvents": [
        "reunião emergencial",
        "boato de demissão",
        "vitória dá sobrevida"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 73,
        "morale": 50
      },
      "traits": [
        "gestao_instavel",
        "recursos",
        "cobranca_profissional",
        "ambicao",
        "instabilidade",
        "medo_de_errar",
        "reuniao_emergencial",
        "boato_de_demissao"
      ],
      "opening": "Um boato de demissão chega ao técnico depois de duas derrotas e antes da reunião da diretoria.",
      "dilemma": "A busca por resultado imediato ameaça a estabilidade necessária para corrigir a equipe.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "gestao_instavel",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_031_presidente_populista",
      "number": 31,
      "label": "Presidente Populista",
      "category": "política interna",
      "description": "O presidente fala demais, promete demais e interfere demais. A torcida gosta do show até os resultados falharem.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "playoffs",
      "rosterProfile": "prospect_core",
      "strengthTier": "normal",
      "strengths": [
        "mobilização",
        "marketing",
        "ambição pública"
      ],
      "weaknesses": [
        "interferência",
        "promessas irreais",
        "crise midiática"
      ],
      "frequentEvents": [
        "presidente dá entrevista",
        "contratação política",
        "técnico precisa responder"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 95,
        "morale": 50
      },
      "traits": [
        "politica_interna",
        "mobilizacao",
        "marketing",
        "ambicao_publica",
        "interferencia",
        "promessas_irreais",
        "presidente_da_entrevista",
        "contratacao_politica"
      ],
      "opening": "O presidente promete um reforço ao vivo sem avisar a comissão que já planejava outra posição.",
      "dilemma": "A mobilização pública precisa virar resultado sem entregar a direção esportiva às promessas de palanque.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "politica_interna",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_032_elenco_de_aluguel",
      "number": 32,
      "label": "Elenco de Aluguel",
      "category": "curto prazo",
      "description": "Muitos jogadores chegaram por empréstimo ou contrato curto. Todos querem aparecer, poucos pensam no clube.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "baixa",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "fome individual",
        "flexibilidade",
        "talento disponível"
      ],
      "weaknesses": [
        "baixa identificação",
        "egoísmo",
        "renovação difícil"
      ],
      "frequentEvents": [
        "jogador pensa no próximo contrato",
        "torcida cobra entrega",
        "empresário pressiona"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 38,
        "morale": 50
      },
      "traits": [
        "curto_prazo",
        "fome_individual",
        "flexibilidade",
        "talento_disponivel",
        "baixa_identificacao",
        "egoismo",
        "jogador_pensa_no_proximo_contrato",
        "torcida_cobra_entrega"
      ],
      "opening": "No treino, um atleta emprestado comenta a próxima janela enquanto a torcida pede entrega no jogo decisivo.",
      "dilemma": "Transformar contratos curtos em compromisso coletivo é o desafio de um elenco pronto para se dispersar.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "curto_prazo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_033_reino_dos_veteranos",
      "number": 33,
      "label": "Reino dos Veteranos",
      "category": "hierarquia",
      "description": "Veteranos mandam no vestiário. A experiência ajuda, mas jovens e comissão podem se sentir engolidos.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "liderança",
        "casca",
        "controle emocional"
      ],
      "weaknesses": [
        "panelinha",
        "resistência a mudança",
        "jovens sem espaço"
      ],
      "frequentEvents": [
        "veterano barra mudança",
        "promessa insatisfeita",
        "capitão salva crise"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "hierarquia",
        "lideranca",
        "casca",
        "controle_emocional",
        "panelinha",
        "resistencia_a_mudanca",
        "veterano_barra_mudanca",
        "promessa_insatisfeita"
      ],
      "opening": "Os veteranos barram uma mudança de rotação e uma promessa pede conversa com o treinador.",
      "dilemma": "A casca do grupo ajuda sob pressão, mas seu poder pode impedir a renovação.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "hierarquia",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_034_juventude_insolente",
      "number": 34,
      "label": "Juventude Insolente",
      "category": "jovem ousado",
      "description": "Elenco jovem, provocador e sem medo. Pode surpreender gigantes ou se perder em imaturidade.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "alta",
      "ambition": "estabilidade",
      "rosterProfile": "prospect_core",
      "strengthTier": "low",
      "strengths": [
        "energia",
        "ousadia",
        "evolução"
      ],
      "weaknesses": [
        "indisciplina",
        "oscilação",
        "erros bobos"
      ],
      "frequentEvents": [
        "provocação em clássico",
        "bronca coletiva",
        "jovem decide jogo"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "jovem_ousado",
        "energia",
        "ousadia",
        "evolucao",
        "indisciplina",
        "oscilacao",
        "provocacao_em_classico",
        "bronca_coletiva"
      ],
      "opening": "Uma provocação de um novato esquenta o clássico, e o mesmo jogador decide o treino com uma jogada ousada.",
      "dilemma": "A insolência jovem pode derrubar gigantes se a comissão conseguir conter seus erros evitáveis.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "jovem_ousado",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_035_clube_empresa",
      "number": 35,
      "label": "Clube Empresa",
      "category": "eficiência",
      "description": "Gestão profissional, metas claras e cobrança racional. O desafio é criar alma em um projeto frio.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "média",
      "boardPressure": "alta",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "organização",
        "orçamento",
        "processos"
      ],
      "weaknesses": [
        "baixa paixão",
        "atritos com tradição",
        "decisões frias"
      ],
      "frequentEvents": [
        "venda racional de ídolo",
        "meta trimestral",
        "torcida protesta contra CEO"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "eficiencia",
        "organizacao",
        "orcamento",
        "processos",
        "baixa_paixao",
        "atritos_com_tradicao",
        "venda_racional_de_idolo",
        "meta_trimestral"
      ],
      "opening": "O CEO apresenta uma meta trimestral no dia em que a torcida protesta pela possível venda de um ídolo.",
      "dilemma": "A gestão eficiente precisa provar que seus números ainda representam as pessoas do clube.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "eficiencia",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_036_romanticos_da_historia",
      "number": 36,
      "label": "Românticos da História",
      "category": "tradição",
      "description": "O clube acredita que jogar de certo jeito importa tanto quanto vencer. Romper com a tradição custa caro.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "muito alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "identidade",
        "torcida fiel",
        "camisa pesada"
      ],
      "weaknesses": [
        "pouca flexibilidade",
        "resistência tática",
        "nostalgia"
      ],
      "frequentEvents": [
        "mudança de estilo rejeitada",
        "ídolo elogia postura",
        "derrota honrosa vira debate"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 98,
        "morale": 50
      },
      "traits": [
        "tradicao",
        "identidade",
        "torcida_fiel",
        "camisa_pesada",
        "pouca_flexibilidade",
        "resistencia_tatica",
        "mudanca_de_estilo_rejeitada",
        "idolo_elogia_postura"
      ],
      "opening": "Uma vitória pragmática recebe vaias de parte da arquibancada, que exige o estilo consagrado pelos antigos ídolos.",
      "dilemma": "Preservar a maneira de jogar pode custar resultados, mas abandoná-la ameaça a identidade do clube.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "tradicao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_037_time_de_copas",
      "number": 37,
      "label": "Time de Copas",
      "category": "mata-mata",
      "description": "Na liga regular oscila, mas em jogo eliminatório vira outro animal. A temporada é sobre chegar vivo.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "decisão",
        "frieza",
        "experiência em mata-mata"
      ],
      "weaknesses": [
        "irregularidade",
        "pouco foco na fase regular",
        "risco de classificação baixa"
      ],
      "frequentEvents": [
        "jogo decisivo",
        "descanso estratégico",
        "torcida acredita em milagre"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "mata_mata",
        "decisao",
        "frieza",
        "experiencia_em_mata_mata",
        "irregularidade",
        "pouco_foco_na_fase_regular",
        "jogo_decisivo",
        "descanso_estrategico"
      ],
      "opening": "A comissão calcula quantos minutos poupar antes de uma rodada decisiva da fase regular.",
      "dilemma": "O time precisa chegar inteiro ao mata-mata sem perder a vaga por desprezar o caminho até ele.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "mata_mata",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_038_maldição_do_quase",
      "number": 38,
      "label": "Maldição do Quase",
      "category": "trauma competitivo",
      "description": "O clube bate na trave há anos. Cada jogo grande carrega o medo de repetir o fracasso.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "qualidade",
        "experiência acumulada",
        "fome"
      ],
      "weaknesses": [
        "ansiedade em finais",
        "fantasma do passado",
        "pressão crescente"
      ],
      "frequentEvents": [
        "pergunta sobre trauma",
        "erro no fim",
        "vitória quebra tabu"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "trauma_competitivo",
        "qualidade",
        "experiencia_acumulada",
        "fome",
        "ansiedade_em_finais",
        "fantasma_do_passado",
        "pergunta_sobre_trauma",
        "erro_no_fim"
      ],
      "opening": "Um erro no fim do jogo reabre na coletiva a pergunta sobre todas as finais perdidas.",
      "dilemma": "A experiência de chegar perto só vira título quando o grupo deixar de jogar contra o próprio passado.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "trauma_competitivo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_039_favorito_arrogante",
      "number": 39,
      "label": "Favorito Arrogante",
      "category": "elite",
      "description": "Elenco se sabe superior e age como tal. A confiança ajuda, mas pode virar soberba.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "elite",
      "budgetBias": 1.63,
      "pressure": "muito alta",
      "fanPressure": "alta",
      "boardPressure": "muito alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "talento",
        "profundidade",
        "confiança"
      ],
      "weaknesses": [
        "acomodação",
        "subestima rivais",
        "antipatia externa"
      ],
      "frequentEvents": [
        "derrota chocante",
        "fala arrogante",
        "treino de humildade"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 25
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 95,
        "morale": 50
      },
      "traits": [
        "elite",
        "talento",
        "profundidade",
        "confianca",
        "acomodacao",
        "subestima_rivais",
        "derrota_chocante",
        "fala_arrogante"
      ],
      "opening": "Depois de uma fala soberba, o favorito sofre uma derrota para o último colocado.",
      "dilemma": "A confiança de um elenco profundo precisa resistir à tentação de tratar qualquer rival como vencido.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "elite",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_040_pacto_da_sobrevivencia",
      "number": 40,
      "label": "Pacto da Sobrevivência",
      "category": "resistência",
      "description": "Jogadores, comissão e torcida sabem que a missão é sobreviver juntos. Cada ponto é celebrado como título.",
      "objective": "evitar rebaixamento",
      "objectiveKey": "nao_cair",
      "rawObjective": "não cair",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "sobrevivencia",
      "rosterProfile": "low_budget_fight",
      "strengthTier": "low",
      "strengths": [
        "união",
        "humildade",
        "luta"
      ],
      "weaknesses": [
        "limitação técnica",
        "fadiga",
        "pouca reposição"
      ],
      "frequentEvents": [
        "empate heroico",
        "lesão preocupa",
        "torcida canta após derrota"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15,
        "initialFatigue": 10,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 62,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 63,
        "morale": 50
      },
      "traits": [
        "resistencia",
        "uniao",
        "humildade",
        "luta",
        "limitacao_tecnica",
        "fadiga",
        "empate_heroico",
        "lesao_preocupa"
      ],
      "opening": "A torcida canta depois de um empate difícil, enquanto o departamento médico confirma outra baixa.",
      "dilemma": "O pacto de sobrevivência exige somar pontos com um elenco cuja entrega supera a reposição disponível.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "nao_cair",
          "resistencia",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_041_dinastia_da_base",
      "number": 41,
      "label": "Dinastia da Base",
      "category": "ciclo campeão",
      "description": "Uma geração formada no clube já venceu nas categorias inferiores e agora tenta dominar o profissional.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "entrosamento",
        "identidade",
        "potencial"
      ],
      "weaknesses": [
        "salto competitivo",
        "ego de geração vencedora",
        "assédio"
      ],
      "frequentEvents": [
        "reunião da geração",
        "primeiro clássico adulto",
        "proposta por líder jovem"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "ciclo_campeao",
        "entrosamento",
        "identidade",
        "potencial",
        "salto_competitivo",
        "ego_de_geracao_vencedora",
        "reuniao_da_geracao",
        "primeiro_classico_adulto"
      ],
      "opening": "A geração campeã na base treina junta para seu primeiro clássico entre profissionais.",
      "dilemma": "O entrosamento vencedor precisa sobreviver ao salto de nível, aos egos e ao assédio externo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "ciclo_campeao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_042_clube_de_colonia",
      "number": 42,
      "label": "Clube de Colônia",
      "category": "comunidade cultural",
      "description": "A equipe representa uma comunidade específica e carrega símbolos culturais fortes. Pertencimento é força e cobrança.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "identidade",
        "torcida fiel",
        "eventos culturais"
      ],
      "weaknesses": [
        "mercado limitado",
        "pressão simbólica",
        "pouca neutralidade"
      ],
      "frequentEvents": [
        "festa comunitária",
        "crítica por descaracterizar elenco",
        "jogador vira símbolo"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 70,
        "morale": 50
      },
      "traits": [
        "comunidade_cultural",
        "identidade",
        "torcida_fiel",
        "eventos_culturais",
        "mercado_limitado",
        "pressao_simbolica",
        "festa_comunitaria",
        "critica_por_descaracterizar_elenco"
      ],
      "opening": "A festa da comunidade lota o ginásio, e uma contratação de fora já provoca debate sobre os símbolos do clube.",
      "dilemma": "Representar a colônia traz apoio fiel, mas cada escolha de elenco carrega uma cobrança cultural.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "comunidade_cultural",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_043_projeto_universitario",
      "number": 43,
      "label": "Projeto Universitário",
      "category": "desenvolvimento",
      "description": "Equipe ligada a formação acadêmica, ciência e atletas estudantes. O calendário esportivo disputa espaço com a vida fora da quadra.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "baixa",
      "fanPressure": "baixa",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "low_budget_fight",
      "strengthTier": "low",
      "strengths": [
        "inteligência tática",
        "ambiente formativo",
        "baixa pressão"
      ],
      "weaknesses": [
        "rotina dupla",
        "pouca verba",
        "atletas saem cedo"
      ],
      "frequentEvents": [
        "semana de provas",
        "pesquisa de desempenho",
        "atleta escolhe estudo"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 25,
        "morale": 50
      },
      "traits": [
        "desenvolvimento",
        "inteligencia_tatica",
        "ambiente_formativo",
        "baixa_pressao",
        "rotina_dupla",
        "pouca_verba",
        "semana_de_provas",
        "pesquisa_de_desempenho"
      ],
      "opening": "Uma semana de provas coincide com dois jogos, e o capitão pede para sair mais cedo do treino.",
      "dilemma": "O projeto acadêmico precisa formar pessoas e atletas sem perder a equipe para calendários incompatíveis.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "desenvolvimento",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_044_furia_da_capital",
      "number": 44,
      "label": "Fúria da Capital",
      "category": "mercado grande",
      "description": "Clube de cidade grande, com mídia pesada e torcida barulhenta. Tudo vira pauta.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "titulo",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "receita",
        "visibilidade",
        "atração de jogadores"
      ],
      "weaknesses": [
        "pressão diária",
        "crise viral",
        "polêmica constante"
      ],
      "frequentEvents": [
        "manchete pesada",
        "coletiva tensa",
        "arena lotada"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "mercado_grande",
        "receita",
        "visibilidade",
        "atracao_de_jogadores",
        "pressao_diaria",
        "crise_viral",
        "manchete_pesada",
        "coletiva_tensa"
      ],
      "opening": "Uma manchete transforma uma discussão de treino em crise antes da estreia na arena lotada.",
      "dilemma": "A visibilidade da capital atrai recursos, mas dá a cada conflito o tamanho de uma temporada.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "mercado_grande",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_045_orgulho_do_interior",
      "number": 45,
      "label": "Orgulho do Interior",
      "category": "interior forte",
      "description": "Representa uma cidade menor contra os gigantes. A identidade é derrubar favoritos.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "mando forte",
        "motivação contra grandes",
        "comunidade"
      ],
      "weaknesses": [
        "orçamento",
        "viagens",
        "pouca profundidade"
      ],
      "frequentEvents": [
        "gigante visita ginásio",
        "cidade mobilizada",
        "jogador recebe proposta"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 70,
        "morale": 50
      },
      "traits": [
        "interior_forte",
        "mando_forte",
        "motivacao_contra_grandes",
        "comunidade",
        "orcamento",
        "viagens",
        "gigante_visita_ginasio",
        "cidade_mobilizada"
      ],
      "opening": "A cidade prepara a visita de um gigante, e seu melhor jogador recebe uma proposta justamente nessa semana.",
      "dilemma": "O orgulho do interior cresce ao desafiar favoritos, mas precisa reter força com orçamento e elenco curtos.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "interior_forte",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_046_elenco_remendado",
      "number": 46,
      "label": "Elenco Remendado",
      "category": "lesões",
      "description": "O clube começa a temporada com vários atletas voltando de lesão. A gestão de carga define o destino.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "profundidade médica",
        "superação",
        "retornos importantes"
      ],
      "weaknesses": [
        "risco físico",
        "ritmo baixo",
        "medo de recaída"
      ],
      "frequentEvents": [
        "retorno gradual",
        "torcida pede titular",
        "fisioterapia veta atleta"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "lesoes",
        "profundidade_medica",
        "superacao",
        "retornos_importantes",
        "risco_fisico",
        "ritmo_baixo",
        "retorno_gradual",
        "torcida_pede_titular"
      ],
      "opening": "A fisioterapia veta um titular que a torcida esperava ver de volta já na abertura.",
      "dilemma": "A profundidade médica pode recuperar o elenco, desde que a pressa não transforme retornos em novas lesões.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "lesoes",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_047_time_sem_capitao",
      "number": 47,
      "label": "Time Sem Capitão",
      "category": "liderança",
      "description": "O antigo líder saiu e ninguém assumiu o vestiário. Talento existe, direção emocional não.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "unbalanced",
      "strengthTier": "normal",
      "strengths": [
        "espaço para novos líderes",
        "talento distribuído",
        "renovação"
      ],
      "weaknesses": [
        "vácuo de liderança",
        "conflitos pequenos",
        "queda em pressão"
      ],
      "frequentEvents": [
        "escolha de capitão",
        "grupo dividido",
        "jovem assume voz"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "lideranca",
        "espaco_para_novos_lideres",
        "talento_distribuido",
        "renovacao",
        "vacuo_de_lideranca",
        "conflitos_pequenos",
        "escolha_de_capitao",
        "grupo_dividido"
      ],
      "opening": "Sem o antigo capitão, dois jogadores dão instruções opostas no último tempo de um amistoso.",
      "dilemma": "O talento distribuído precisa encontrar uma voz confiável antes de enfrentar jogos sob pressão.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "lideranca",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_048_estatua_viva",
      "number": 48,
      "label": "Estátua Viva",
      "category": "ídolo intocável",
      "description": "Um ídolo ainda joga, mas já não entrega o mesmo nível. Tirar minutos dele pode ser correto e perigoso.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "muito alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "identificação",
        "liderança",
        "marketing"
      ],
      "weaknesses": [
        "queda técnica",
        "constrangimento",
        "torcida dividida"
      ],
      "frequentEvents": [
        "ídolo no banco",
        "golpe de realidade",
        "último grande jogo"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 98,
        "morale": 50
      },
      "traits": [
        "idolo_intocavel",
        "identificacao",
        "lideranca",
        "marketing",
        "queda_tecnica",
        "constrangimento",
        "idolo_no_banco",
        "golpe_de_realidade"
      ],
      "opening": "O ídolo começa no banco pela primeira vez e a arquibancada olha para o treinador antes de olhar o placar.",
      "dilemma": "Reduzir os minutos de uma lenda pode melhorar o time e dividir quem ainda espera sua melhor versão.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "idolo_intocavel",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_049_o_estrangeiro_salvador",
      "number": 49,
      "label": "O Estrangeiro Salvador",
      "category": "estrela importada",
      "description": "Uma estrela estrangeira chega para mudar o patamar do clube. Tudo passa por adaptação, idioma e expectativa.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "talento diferencial",
        "marketing",
        "nova referência"
      ],
      "weaknesses": [
        "adaptação",
        "dependência",
        "choque cultural"
      ],
      "frequentEvents": [
        "estreia midiática",
        "tradução no vestiário",
        "estrela cobra reforços"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "estrela_importada",
        "talento_diferencial",
        "marketing",
        "nova_referencia",
        "adaptacao",
        "dependencia",
        "estreia_midiatica",
        "traducao_no_vestiario"
      ],
      "opening": "O reforço estrangeiro estreia sob câmeras, mas precisa de tradução para entender a última jogada desenhada.",
      "dilemma": "A estrela pode elevar o clube se a adaptação impedir que todo o projeto dependa dela.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "estrela_importada",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_050_clube_endividado",
      "number": 50,
      "label": "Clube Endividado",
      "category": "crise financeira",
      "description": "A dívida limita escolhas e cada decisão tem consequência financeira. Competir sem quebrar é o desafio.",
      "objective": "evitar rebaixamento",
      "objectiveKey": "nao_cair",
      "rawObjective": "não cair",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "muito alta",
      "fanPressure": "alta",
      "boardPressure": "muito alta",
      "mediaExposure": "média",
      "ambition": "sobrevivencia",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "urgência",
        "base valorizada",
        "criatividade"
      ],
      "weaknesses": [
        "vendas forçadas",
        "salários atrasados",
        "elenco instável"
      ],
      "frequentEvents": [
        "atraso salarial",
        "proposta inevitável",
        "diretoria pede corte"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 88,
        "morale": 50
      },
      "traits": [
        "crise_financeira",
        "urgencia",
        "base_valorizada",
        "criatividade",
        "vendas_forcadas",
        "salarios_atrasados",
        "atraso_salarial",
        "proposta_inevitavel"
      ],
      "opening": "Os salários atrasam antes de uma proposta por um titular que a equipe não pode perder.",
      "dilemma": "A criatividade para competir encontra limite quando pagar a dívida exige desmontar o elenco.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "nao_cair",
          "crise_financeira",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_051_maquina_de_marketing",
      "number": 51,
      "label": "Máquina de Marketing",
      "category": "imagem",
      "description": "O clube sabe vender espetáculo, camisa e narrativa. Às vezes a imagem corre mais rápido que o basquete.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "muito alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "receita",
        "visibilidade",
        "atração"
      ],
      "weaknesses": [
        "distrações",
        "jogadores viram produto",
        "pressão de patrocinador"
      ],
      "frequentEvents": [
        "campanha publicitária",
        "atleta reclama de agenda",
        "patrocinador cobra estrela"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 88,
        "morale": 50
      },
      "traits": [
        "imagem",
        "receita",
        "visibilidade",
        "atracao",
        "distracoes",
        "jogadores_viram_produto",
        "campanha_publicitaria",
        "atleta_reclama_de_agenda"
      ],
      "opening": "Uma campanha publicitária ocupa a manhã da estrela no dia de um treino importante.",
      "dilemma": "A receita da imagem ajuda a atrair talento, mas pode afastar os jogadores dos treinos e das partidas.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "imagem",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_052_sombra_do_rival",
      "number": 52,
      "label": "Sombra do Rival",
      "category": "inferioridade local",
      "description": "O clube vive comparado ao rival maior da cidade. A temporada é uma busca por respeito.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "motivação",
        "identidade de resistência",
        "fome em clássico"
      ],
      "weaknesses": [
        "complexo de inferioridade",
        "obsessão",
        "mídia comparativa"
      ],
      "frequentEvents": [
        "rival contrata estrela",
        "clássico decisivo",
        "torcida cobra postura"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "inferioridade_local",
        "motivacao",
        "identidade_de_resistencia",
        "fome_em_classico",
        "complexo_de_inferioridade",
        "obsessao",
        "rival_contrata_estrela",
        "classico_decisivo"
      ],
      "opening": "O rival anuncia uma estrela e os torcedores do clube menor cobram resposta antes mesmo do clássico.",
      "dilemma": "Buscar respeito exige usar a comparação como combustível sem deixar que ela dite toda a temporada.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "inferioridade_local",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_053_dono_do_estado",
      "number": 53,
      "label": "Dono do Estado",
      "category": "hegemonia regional",
      "description": "O clube domina regionalmente, mas quer provar que é nacional. Perder localmente é humilhação.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "estrutura",
        "torcida regional",
        "confiança"
      ],
      "weaknesses": [
        "arrogância local",
        "pressão nacional",
        "rivais motivados"
      ],
      "frequentEvents": [
        "final regional",
        "zebra local",
        "viagem nacional decisiva"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "hegemonia_regional",
        "estrutura",
        "torcida_regional",
        "confianca",
        "arrogancia_local",
        "pressao_nacional",
        "final_regional",
        "zebra_local"
      ],
      "opening": "Uma derrota regional inesperada ameaça a confiança antes da viagem que pode provar o valor nacional do clube.",
      "dilemma": "Dominar o estado já não basta, mas perseguir o topo nacional torna cada tropeço local mais humilhante.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "hegemonia_regional",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_054_clube_sem_memoria",
      "number": 54,
      "label": "Clube Sem Memória",
      "category": "identidade frágil",
      "description": "Projeto novo, sem tradição clara. Tudo precisa ser construído do zero: torcida, símbolos e história.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "baixa",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "liberdade",
        "modernidade",
        "baixo peso histórico"
      ],
      "weaknesses": [
        "pouca torcida",
        "sem identidade",
        "baixa pressão positiva"
      ],
      "frequentEvents": [
        "criar mascote",
        "primeiro ídolo",
        "campanha para atrair torcida"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 32,
        "morale": 50
      },
      "traits": [
        "identidade_fragil",
        "liberdade",
        "modernidade",
        "baixo_peso_historico",
        "pouca_torcida",
        "sem_identidade",
        "criar_mascote",
        "primeiro_idolo"
      ],
      "opening": "A diretoria abre uma votação para o primeiro mascote enquanto o time procura seu primeiro líder em quadra.",
      "dilemma": "A liberdade de inventar uma tradição precisa virar pertencimento antes que a falta de história esvazie as arquibancadas.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "identidade_fragil",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_055_os_inquebraveis",
      "number": 55,
      "label": "Os Inquebráveis",
      "category": "resiliência física",
      "description": "Equipe conhecida por intensidade absurda e preparo físico. O limite entre força e lesão é fino.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "condicionamento",
        "pressão defensiva",
        "ritmo"
      ],
      "weaknesses": [
        "fadiga acumulada",
        "lesões musculares",
        "queda no fim"
      ],
      "frequentEvents": [
        "treino extremo",
        "fisiologia alerta",
        "adversário cansa"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "resiliencia_fisica",
        "condicionamento",
        "pressao_defensiva",
        "ritmo",
        "fadiga_acumulada",
        "lesoes_musculares",
        "treino_extremo",
        "fisiologia_alerta"
      ],
      "opening": "O adversário pede ar após um treino aberto, e a fisiologia alerta que os próprios atletas já passaram do limite.",
      "dilemma": "A intensidade que sufoca rivais pode cobrar lesões e queda de rendimento no fim da temporada.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "resiliencia_fisica",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_056_clube_das_finais",
      "number": 56,
      "label": "Clube das Finais",
      "category": "decisivo",
      "description": "O clube sempre chega longe, mas cada temporada só é julgada no mata-mata.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "casca",
        "frieza",
        "planejamento"
      ],
      "weaknesses": [
        "fase regular desvalorizada",
        "pressão em semifinal",
        "torcida exige final"
      ],
      "frequentEvents": [
        "rodar elenco",
        "semifinal histórica",
        "crítica por poupar"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "decisivo",
        "casca",
        "frieza",
        "planejamento",
        "fase_regular_desvalorizada",
        "pressao_em_semifinal",
        "rodar_elenco",
        "semifinal_historica"
      ],
      "opening": "A torcida critica a rotação ampla na fase regular, embora a comissão mire a semifinal.",
      "dilemma": "Planejar outra final exige manter a vaga e a confiança de quem julga o clube apenas pelo mata-mata.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "decisivo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_057_banco_de_luxo",
      "number": 57,
      "label": "Banco de Luxo",
      "category": "profundidade",
      "description": "O clube tem reservas que seriam titulares em outros times. Administrar minutos e ego é o grande problema.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "elite",
      "budgetBias": 1.63,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "média",
      "ambition": "titulo",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "profundidade",
        "rotação",
        "competição interna"
      ],
      "weaknesses": [
        "ego",
        "insatisfação",
        "difícil hierarquia"
      ],
      "frequentEvents": [
        "reserva pede troca",
        "lesão não assusta",
        "treino vira disputa"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 25
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "profundidade",
        "rotacao",
        "competicao_interna",
        "ego",
        "insatisfacao",
        "reserva_pede_troca",
        "lesao_nao_assusta"
      ],
      "opening": "Um reserva pede troca depois de atuar poucos minutos numa vitória em que o banco decidiu o jogo.",
      "dilemma": "A profundidade só será vantagem se a rotação não transformar competição interna em ressentimento.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "profundidade",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_058_fome_de_primeiro_titulo",
      "number": 58,
      "label": "Fome de Primeiro Título",
      "category": "busca histórica",
      "description": "Clube competitivo que nunca foi campeão. A cidade inteira sente que chegou a hora.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "motivação",
        "torcida mobilizada",
        "projeto maduro"
      ],
      "weaknesses": [
        "ansiedade",
        "medo de fracasso",
        "peso histórico"
      ],
      "frequentEvents": [
        "campanha histórica",
        "pergunta sobre tabu",
        "jogador promete título"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "busca_historica",
        "motivacao",
        "torcida_mobilizada",
        "projeto_maduro",
        "ansiedade",
        "medo_de_fracasso",
        "campanha_historica",
        "pergunta_sobre_tabu"
      ],
      "opening": "A cidade prepara uma festa para um título que o clube ainda não ganhou, e a pergunta sobre o tabu domina a coletiva.",
      "dilemma": "A fome da primeira conquista precisa superar o medo de falhar justamente quando o projeto amadureceu.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "busca_historica",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_059_geracao_perdida",
      "number": 59,
      "label": "Geração Perdida",
      "category": "talento desperdiçado",
      "description": "Um grupo talentoso nunca confirmou expectativas. Esta pode ser a última chance antes da desmontagem.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "talento",
        "urgência",
        "experiência"
      ],
      "weaknesses": [
        "frustração acumulada",
        "desconfiança",
        "risco de debandada"
      ],
      "frequentEvents": [
        "última chance",
        "estrela questionada",
        "proposta por peça-chave"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "talento_desperdicado",
        "talento",
        "urgencia",
        "experiencia",
        "frustracao_acumulada",
        "desconfianca",
        "ultima_chance",
        "estrela_questionada"
      ],
      "opening": "Uma proposta por peça-chave chega antes da reunião que decidirá o futuro da geração.",
      "dilemma": "O talento acumulado tem uma última chance de cumprir a promessa antes que a frustração desmonte o grupo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "talento_desperdicado",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_060_clube_dos_retorno",
      "number": 60,
      "label": "Clube dos Retornos",
      "category": "nostalgia ativa",
      "description": "Vários jogadores formados no clube voltam mais velhos para tentar fechar histórias pendentes.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "identificação",
        "experiência",
        "histórias pessoais"
      ],
      "weaknesses": [
        "idade",
        "expectativa nostálgica",
        "ritmo"
      ],
      "frequentEvents": [
        "retorno emocionado",
        "lesão de veterano",
        "jogo contra ex-clube"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "nostalgia_ativa",
        "identificacao",
        "experiencia",
        "historias_pessoais",
        "idade",
        "expectativa_nostalgica",
        "retorno_emocionado",
        "lesao_de_veterano"
      ],
      "opening": "Um ex-jogador volta ao ginásio entre aplausos, mas sente o ritmo no primeiro coletivo.",
      "dilemma": "As histórias que unem os retornados precisam render nos jogos sem ficar presas à saudade.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "nostalgia_ativa",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_061_o_laboratorio",
      "number": 61,
      "label": "O Laboratório",
      "category": "experimental",
      "description": "O clube aceita testar métodos, jovens e táticas. Pode descobrir o futuro ou virar bagunça.",
      "objective": "desenvolver jovens",
      "objectiveKey": "desenvolver_base",
      "rawObjective": "desenvolver base",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "baixa",
      "fanPressure": "baixa",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "desenvolvimento",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "inovação",
        "aprendizado",
        "flexibilidade"
      ],
      "weaknesses": [
        "instabilidade",
        "falta de padrão",
        "resultados ruins"
      ],
      "frequentEvents": [
        "teste tático",
        "dado surpreendente",
        "torcida não entende escolha"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 25,
        "morale": 50
      },
      "traits": [
        "experimental",
        "inovacao",
        "aprendizado",
        "flexibilidade",
        "instabilidade",
        "falta_de_padrao",
        "teste_tatico",
        "dado_surpreendente"
      ],
      "opening": "Um dado do laboratório recomenda uma formação inédita depois de três derrotas seguidas.",
      "dilemma": "Experimentar pode descobrir o próximo caminho do clube ou prolongar a falta de padrão.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "desenvolver_base",
          "experimental",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_062_a_muralha_caseira",
      "number": 62,
      "label": "A Muralha Caseira",
      "category": "mando de quadra",
      "description": "Em casa o time cresce absurdamente; fora, parece outro elenco. O calendário pesa muito.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "mando forte",
        "torcida",
        "confiança local"
      ],
      "weaknesses": [
        "fraqueza fora",
        "viagens",
        "dependência do ginásio"
      ],
      "frequentEvents": [
        "sequência fora",
        "ginásio lotado",
        "preparação para viagem"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "mando_de_quadra",
        "mando_forte",
        "torcida",
        "confianca_local",
        "fraqueza_fora",
        "viagens",
        "sequencia_fora",
        "ginasio_lotado"
      ],
      "opening": "O ginásio está lotado na estreia, mas o calendário seguinte leva a equipe para uma longa sequência fora.",
      "dilemma": "A confiança do mando precisa viajar com o elenco se o clube quiser deixar de ter duas versões.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "mando_de_quadra",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_063_clube_religioso_da_rotina",
      "number": 63,
      "label": "Clube da Rotina",
      "category": "ritual",
      "description": "Equipe muito dependente de rotina, rituais e preparação. Mudanças de calendário desorganizam tudo.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "defense_first",
      "strengthTier": "normal",
      "strengths": [
        "organização",
        "consistência",
        "disciplina"
      ],
      "weaknesses": [
        "pouca adaptação",
        "sofre com imprevisto",
        "rigidez"
      ],
      "frequentEvents": [
        "viagem alterada",
        "rotina mantida",
        "atleta quebra ritual"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "ritual",
        "organizacao",
        "consistencia",
        "disciplina",
        "pouca_adaptacao",
        "sofre_com_imprevisto",
        "viagem_alterada",
        "rotina_mantida"
      ],
      "opening": "Uma mudança de horário interrompe o ritual pré-jogo e um titular pede para repetir todo o aquecimento.",
      "dilemma": "A disciplina dá consistência ao time até que um imprevisto exija adaptação real.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "ritual",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_064_panelinha_dos_craques",
      "number": 64,
      "label": "Panelinha dos Craques",
      "category": "grupo fechado",
      "description": "Os melhores jogadores são amigos e se protegem. Isso cria química, mas exclui parte do elenco.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "química entre estrelas",
        "talento",
        "decisão"
      ],
      "weaknesses": [
        "vestiário partido",
        "reservas isolados",
        "resistência à comissão"
      ],
      "frequentEvents": [
        "reserva reclama",
        "craques defendem colega",
        "técnico confronta panelinha"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "grupo_fechado",
        "quimica_entre_estrelas",
        "talento",
        "decisao",
        "vestiario_partido",
        "reservas_isolados",
        "reserva_reclama",
        "craques_defendem_colega"
      ],
      "opening": "Os craques defendem um amigo após a reclamação pública de um reserva deixado fora da rotação.",
      "dilemma": "A química entre estrelas decide partidas, mas não sustenta um vestiário partido.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "grupo_fechado",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_065_clube_de_treinador",
      "number": 65,
      "label": "Clube de Treinador",
      "category": "sistema forte",
      "description": "A maior estrela é o treinador e seu sistema. Jogadores entram e saem, a ideia permanece.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "sistema",
        "clareza",
        "regularidade"
      ],
      "weaknesses": [
        "dependência do técnico",
        "atletas criativos limitados",
        "previsibilidade"
      ],
      "frequentEvents": [
        "convite ao treinador",
        "jogador brilha no sistema",
        "crítica por rigidez"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "sistema_forte",
        "sistema",
        "clareza",
        "regularidade",
        "dependencia_do_tecnico",
        "atletas_criativos_limitados",
        "convite_ao_treinador",
        "jogador_brilha_no_sistema"
      ],
      "opening": "Um clube rival procura o treinador enquanto a equipe comemora outra vitória desenhada por seu sistema.",
      "dilemma": "A clareza tática mantém o elenco competitivo, mas sua dependência de uma pessoa expõe o projeto.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "sistema_forte",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_066_herdeiros_da_lenda",
      "number": 66,
      "label": "Herdeiros da Lenda",
      "category": "sucessão",
      "description": "Uma lenda se aposentou e deixou sombra enorme. O novo líder precisa provar que não é só substituto.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "motivação",
        "renovação",
        "história forte"
      ],
      "weaknesses": [
        "comparação injusta",
        "ansiedade do sucessor",
        "torcida nostálgica"
      ],
      "frequentEvents": [
        "camisa pesada",
        "lenda visita treino",
        "novo líder decide jogo"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "sucessao",
        "motivacao",
        "renovacao",
        "historia_forte",
        "comparacao_injusta",
        "ansiedade_do_sucessor",
        "camisa_pesada",
        "lenda_visita_treino"
      ],
      "opening": "A lenda aposentada visita o treino no dia em que o novo líder herda sua antiga camisa.",
      "dilemma": "O sucessor precisa assumir o time sem ser julgado a cada lance pela sombra do ídolo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "sucessao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_067_clube_das_promessas_quebradas",
      "number": 67,
      "label": "Promessas Quebradas",
      "category": "frustração",
      "description": "Atletas antes tratados como fenômenos tentam recuperar carreira. O elenco mistura talento e cicatrizes.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "talento escondido",
        "motivação pessoal",
        "baixo custo"
      ],
      "weaknesses": [
        "confiança baixa",
        "histórico de lesão",
        "instabilidade"
      ],
      "frequentEvents": [
        "redenção individual",
        "recaída emocional",
        "jogador reencontra forma"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "frustracao",
        "talento_escondido",
        "motivacao_pessoal",
        "baixo_custo",
        "confianca_baixa",
        "historico_de_lesao",
        "redencao_individual",
        "recaida_emocional"
      ],
      "opening": "Um antigo prodígio volta a pontuar bem, e o exame seguinte reacende o medo de outra recaída.",
      "dilemma": "A redenção dos desacreditados depende de reconstruir confiança sem ignorar seus limites físicos.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "frustracao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_068_a_fortaleza_defensiva",
      "number": 68,
      "label": "Fortaleza Defensiva",
      "category": "território",
      "description": "Ginásio pequeno, torcida em cima e defesa sufocante. O adversário sente cada erro.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "defense_first",
      "strengthTier": "low",
      "strengths": [
        "mando",
        "defesa",
        "intimidação"
      ],
      "weaknesses": [
        "ataque limitado",
        "depende do ambiente",
        "problemas em arenas grandes"
      ],
      "frequentEvents": [
        "jogo em ginásio antigo",
        "adversário reclama",
        "torcida vira fator"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 70,
        "morale": 50
      },
      "traits": [
        "territorio",
        "mando",
        "defesa",
        "intimidacao",
        "ataque_limitado",
        "depende_do_ambiente",
        "jogo_em_ginasio_antigo",
        "adversario_reclama"
      ],
      "opening": "O rival reclama da pressão do ginásio pequeno depois de passar o jogo preso na defesa local.",
      "dilemma": "A fortaleza defensiva precisa funcionar também longe do barulho que costuma protegê-la.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "territorio",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_069_meninos_contra_homens",
      "number": 69,
      "label": "Meninos contra Homens",
      "category": "transição",
      "description": "Elenco jovem encara adversários muito mais físicos. O crescimento vem na pancada.",
      "objective": "desenvolver jovens",
      "objectiveKey": "desenvolver_base",
      "rawObjective": "desenvolver base",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "desenvolvimento",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "potencial",
        "velocidade",
        "aprendizado"
      ],
      "weaknesses": [
        "força física",
        "ingenuidade",
        "medo em jogos duros"
      ],
      "frequentEvents": [
        "jogo físico",
        "promessa ganha massa",
        "veterano adversário provoca"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 42,
        "morale": 50
      },
      "traits": [
        "transicao",
        "potencial",
        "velocidade",
        "aprendizado",
        "forca_fisica",
        "ingenuidade",
        "jogo_fisico",
        "promessa_ganha_massa"
      ],
      "opening": "Um veterano adversário provoca os novatos após levar a melhor nas disputas do início do jogo.",
      "dilemma": "A velocidade dos meninos só se torna competitiva quando eles suportarem o contato e aprenderem com ele.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "desenvolver_base",
          "transicao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_070_cacadores_de_gigantes",
      "number": 70,
      "label": "Caçadores de Gigantes",
      "category": "zebra",
      "description": "Equipe cresce contra favoritos e perde pontos bobos contra times parecidos.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "motivação contra grandes",
        "surpresa",
        "jogo emocional"
      ],
      "weaknesses": [
        "irregularidade",
        "subestima pequenos",
        "foco instável"
      ],
      "frequentEvents": [
        "vitória sobre líder",
        "derrota inexplicável",
        "preleção por foco"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "zebra",
        "motivacao_contra_grandes",
        "surpresa",
        "jogo_emocional",
        "irregularidade",
        "subestima_pequenos",
        "vitoria_sobre_lider",
        "derrota_inexplicavel"
      ],
      "opening": "A equipe derruba o líder e, três dias depois, perde concentração diante de um rival direto.",
      "dilemma": "Caçar gigantes rende manchetes, mas a vaga depende de respeitar os jogos comuns.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "zebra",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_071_elenco_internacional_sub23",
      "number": 71,
      "label": "Sub-23 Global",
      "category": "prospecção",
      "description": "Jovens de vários países são reunidos em projeto de desenvolvimento internacional.",
      "objective": "desenvolver jovens",
      "objectiveKey": "desenvolver_base",
      "rawObjective": "desenvolver base",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "baixa",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "desenvolvimento",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "potencial global",
        "diversidade",
        "mercado futuro"
      ],
      "weaknesses": [
        "adaptação",
        "idioma",
        "falta de líderes"
      ],
      "frequentEvents": [
        "jovem homesick",
        "olheiro visita",
        "aula de idioma no clube"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 38,
        "morale": 50
      },
      "traits": [
        "prospeccao",
        "potencial_global",
        "diversidade",
        "mercado_futuro",
        "adaptacao",
        "idioma",
        "jovem_homesick",
        "olheiro_visita"
      ],
      "opening": "Um jovem pede ajuda com o idioma na mesma semana em que um olheiro vem avaliar seu futuro.",
      "dilemma": "O potencial global precisa criar laços de equipe antes que adaptação e mercado dispersem o grupo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "desenvolver_base",
          "prospeccao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_072_o_clube_dos_capitaes",
      "number": 72,
      "label": "Clube dos Capitães",
      "category": "liderança demais",
      "description": "Elenco tem muitos líderes acostumados a mandar. O excesso de voz pode virar disputa de comando.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "experiência",
        "responsabilidade",
        "leitura de jogo"
      ],
      "weaknesses": [
        "conflito de liderança",
        "ego",
        "decisão coletiva lenta"
      ],
      "frequentEvents": [
        "reunião de líderes",
        "capitães discordam",
        "grupo se organiza sozinho"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "lideranca_demais",
        "experiencia",
        "responsabilidade",
        "leitura_de_jogo",
        "conflito_de_lideranca",
        "ego",
        "reuniao_de_lideres",
        "capitaes_discordam"
      ],
      "opening": "A reunião de líderes termina com dois capitães defendendo planos contrários para a última posse.",
      "dilemma": "A experiência coletiva só ajuda se alguém puder encerrar o debate quando a decisão for urgente.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "lideranca_demais",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_073_a_aposta_do_rookie",
      "number": 73,
      "label": "A Aposta do Rookie",
      "category": "promessa central",
      "description": "A temporada gira em torno de uma promessa absurda. Proteger, desenvolver ou acelerar?",
      "objective": "desenvolver jovens",
      "objectiveKey": "desenvolver_base",
      "rawObjective": "desenvolver base",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "desenvolvimento",
      "rosterProfile": "prospect_core",
      "strengthTier": "normal",
      "strengths": [
        "potencial estrela",
        "marketing",
        "energia nova"
      ],
      "weaknesses": [
        "pressão precoce",
        "dependência narrativa",
        "risco de lesão"
      ],
      "frequentEvents": [
        "rookie decide jogo",
        "mídia exagera",
        "veterano orienta jovem"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "promessa_central",
        "potencial_estrela",
        "marketing",
        "energia_nova",
        "pressao_precoce",
        "dependencia_narrativa",
        "rookie_decide_jogo",
        "midia_exagera"
      ],
      "opening": "O novato decide um jogo de treino e já aparece na capa como salvador da temporada.",
      "dilemma": "Acelerar seu talento pode trazer vitórias, mas a pressão precoce ameaça seu desenvolvimento.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "desenvolver_base",
          "promessa_central",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_074_clube_das_cicatrizes",
      "number": 74,
      "label": "Clube das Cicatrizes",
      "category": "superação",
      "description": "O elenco é formado por atletas rejeitados, lesionados ou desacreditados. Todos têm algo a provar.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "low_budget_fight",
      "strengthTier": "low",
      "strengths": [
        "fome",
        "união",
        "resiliência"
      ],
      "weaknesses": [
        "limitações reais",
        "histórico físico",
        "confiança frágil"
      ],
      "frequentEvents": [
        "história pessoal viraliza",
        "adversário subestima",
        "jogador desaba após vitória"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 62,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "superacao",
        "fome",
        "uniao",
        "resiliencia",
        "limitacoes_reais",
        "historico_fisico",
        "historia_pessoal_viraliza",
        "adversario_subestima"
      ],
      "opening": "Um atleta desacreditado chora depois da primeira vitória, e seu histórico de lesões volta às perguntas da imprensa.",
      "dilemma": "A fome de provar valor une o elenco, mas suas cicatrizes ainda podem limitar a campanha.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "superacao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_075_o_rolo_compressor",
      "number": 75,
      "label": "Rolo Compressor",
      "category": "favorito físico",
      "description": "Equipe enorme, forte e profunda. Quer atropelar no físico, mas pode sofrer contra velocidade e espaçamento.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "média",
      "ambition": "titulo",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "força",
        "rebote",
        "profundidade física"
      ],
      "weaknesses": [
        "lentidão",
        "faltas",
        "previsibilidade"
      ],
      "frequentEvents": [
        "adversário corre muito",
        "domínio no garrafão",
        "pivô reclama de minutos"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "favorito_fisico",
        "forca",
        "rebote",
        "profundidade_fisica",
        "lentidao",
        "faltas",
        "adversario_corre_muito",
        "dominio_no_garrafao"
      ],
      "sportIds": [
        "basquete"
      ],
      "opening": "O garrafão domina a estreia até que o adversário abre a quadra e arrasta os pivôs para longe da cesta.",
      "dilemma": "A força física precisa encontrar resposta para a velocidade que a liga usa contra ela.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "favorito_fisico",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_076_o_time_pequeno_brilhante",
      "number": 76,
      "label": "Pequeno Brilhante",
      "category": "small ball",
      "description": "Elenco baixo, rápido e técnico. Pode abrir defesas ou ser esmagado fisicamente.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "velocidade",
        "arremesso",
        "espaçamento"
      ],
      "weaknesses": [
        "rebote",
        "defesa física",
        "cansaço"
      ],
      "frequentEvents": [
        "chuva de bolas",
        "massacre no rebote",
        "decisão sobre pivô"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "small_ball",
        "velocidade",
        "arremesso",
        "espacamento",
        "rebote",
        "defesa_fisica",
        "chuva_de_bolas",
        "massacre_no_rebote"
      ],
      "sportIds": [
        "basquete"
      ],
      "opening": "Uma chuva de arremessos decide a primeira vitória, seguida de uma derrota em que o time perde todos os rebotes longos.",
      "dilemma": "A velocidade e o espaçamento precisam sobreviver às noites em que o tamanho do rival pesa.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "small_ball",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_077_sindicato_dos_reservas",
      "number": 77,
      "label": "Sindicato dos Reservas",
      "category": "banco inquieto",
      "description": "Reservas querem mais espaço e acreditam que os titulares têm privilégios demais.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "competição interna",
        "profundidade",
        "energia do banco"
      ],
      "weaknesses": [
        "ciúme",
        "vazamento",
        "queda de coesão"
      ],
      "frequentEvents": [
        "reserva fala demais",
        "rotação ampliada",
        "titular se incomoda"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "banco_inquieto",
        "competicao_interna",
        "profundidade",
        "energia_do_banco",
        "ciume",
        "vazamento",
        "reserva_fala_demais",
        "rotacao_ampliada"
      ],
      "opening": "Um reserva reclama da rotação na coletiva, e o titular que perdeu minutos exige explicações.",
      "dilemma": "Dar voz ao banco pode ampliar a energia do time ou aprofundar a disputa por privilégios.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "banco_inquieto",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_078_a_cidade_contra_todos",
      "number": 78,
      "label": "A Cidade Contra Todos",
      "category": "orgulho cívico",
      "description": "A cidade sente que a liga despreza o clube. Cada jogo vira afirmação coletiva.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "unbalanced",
      "strengthTier": "low",
      "strengths": [
        "motivação",
        "mando forte",
        "narrativa de injustiça"
      ],
      "weaknesses": [
        "paranoia",
        "pressão emocional",
        "conflito com arbitragem"
      ],
      "frequentEvents": [
        "erro de arbitragem",
        "prefeito aparece",
        "torcida lota treino"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "orgulho_civico",
        "motivacao",
        "mando_forte",
        "narrativa_de_injustica",
        "paranoia",
        "pressao_emocional",
        "erro_de_arbitragem",
        "prefeito_aparece"
      ],
      "opening": "Após uma marcação contestada, a cidade lota o treino e o prefeito pede uma reação pública.",
      "dilemma": "A sensação de injustiça mobiliza o clube, mas pode desviar sua atenção para a arbitragem.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "orgulho_civico",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_079_clube_da_virada_financeira",
      "number": 79,
      "label": "Virada Financeira",
      "category": "recuperação econômica",
      "description": "Após anos quebrado, o clube começa a se organizar. O desafio é não gastar antes da hora.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "média",
      "boardPressure": "alta",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "gestão melhorando",
        "esperança",
        "planejamento"
      ],
      "weaknesses": [
        "tentação de gasto",
        "trauma financeiro",
        "elenco médio"
      ],
      "frequentEvents": [
        "patrocínio novo",
        "pedido por reforço",
        "diretoria segura orçamento"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 62,
        "morale": 50
      },
      "traits": [
        "recuperacao_economica",
        "gestao_melhorando",
        "esperanca",
        "planejamento",
        "tentacao_de_gasto",
        "trauma_financeiro",
        "patrocinio_novo",
        "pedido_por_reforco"
      ],
      "opening": "Um novo patrocínio libera margem no orçamento e o primeiro pedido por reforço chega à diretoria.",
      "dilemma": "A virada financeira só se consolida se a esperança não virar gasto prematuro.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "recuperacao_economica",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_080_a_batalha_dos_egos",
      "number": 80,
      "label": "Batalha dos Egos",
      "category": "superestrelas",
      "description": "Várias estrelas querem ser protagonistas. O talento é absurdo; a bola é uma só.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "elite",
      "budgetBias": 1.63,
      "pressure": "muito alta",
      "fanPressure": "alta",
      "boardPressure": "muito alta",
      "mediaExposure": "muito alta",
      "ambition": "titulo",
      "rosterProfile": "defense_first",
      "strengthTier": "good",
      "strengths": [
        "talento elite",
        "decisão",
        "marketing"
      ],
      "weaknesses": [
        "ego",
        "hierarquia",
        "defesa negligenciada"
      ],
      "frequentEvents": [
        "estrela cobra bola",
        "coletiva tensa",
        "jogo vencido no talento"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 25,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "superestrelas",
        "talento_elite",
        "decisao",
        "marketing",
        "ego",
        "hierarquia",
        "estrela_cobra_bola",
        "coletiva_tensa"
      ],
      "opening": "Duas estrelas pedem a última posse no mesmo treino, enquanto a defesa do grupo volta a falhar.",
      "dilemma": "O talento de elite precisa aceitar uma hierarquia e contribuir em todas as fases do jogo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "superestrelas",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_081_o_clube_paciente",
      "number": 81,
      "label": "Clube Paciente",
      "category": "longo prazo",
      "description": "Diretoria aceita perder agora para vencer depois. O problema é saber se a torcida também aceita.",
      "objective": "desenvolver jovens",
      "objectiveKey": "desenvolver_base",
      "rawObjective": "desenvolver base",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "desenvolvimento",
      "rosterProfile": "prospect_core",
      "strengthTier": "normal",
      "strengths": [
        "planejamento",
        "desenvolvimento",
        "baixa cobrança interna"
      ],
      "weaknesses": [
        "torcida impaciente",
        "derrotas acumuladas",
        "risco de desmobilização"
      ],
      "frequentEvents": [
        "derrota com evolução",
        "diretoria banca técnico",
        "torcida pede reforço"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 42,
        "morale": 50
      },
      "traits": [
        "longo_prazo",
        "planejamento",
        "desenvolvimento",
        "baixa_cobranca_interna",
        "torcida_impaciente",
        "derrotas_acumuladas",
        "derrota_com_evolucao",
        "diretoria_banca_tecnico"
      ],
      "opening": "A diretoria banca o treinador após uma derrota em que três jovens mostram evolução.",
      "dilemma": "O plano de longo prazo precisa sobreviver à impaciência de uma torcida que conta derrotas agora.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "desenvolver_base",
          "longo_prazo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_082_a_temporada_do_centenario",
      "number": 82,
      "label": "Temporada do Centenário",
      "category": "data simbólica",
      "description": "O clube completa data histórica e quer uma campanha à altura. Cerimônias, ídolos e pressão se misturam.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "mobilização",
        "receita",
        "sentido histórico"
      ],
      "weaknesses": [
        "pressão simbólica",
        "agenda cheia",
        "comparações"
      ],
      "frequentEvents": [
        "jogo comemorativo",
        "uniforme especial",
        "ídolos cobram título"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "data_simbolica",
        "mobilizacao",
        "receita",
        "sentido_historico",
        "pressao_simbolica",
        "agenda_cheia",
        "jogo_comemorativo",
        "uniforme_especial"
      ],
      "opening": "O uniforme do centenário é apresentado com antigos ídolos antes de um jogo tratado como celebração obrigatória.",
      "dilemma": "A memória mobiliza o clube, mas a campanha não pode ser decidida pelo peso de cada cerimônia.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "data_simbolica",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_083_o_clube_sem_paciencia",
      "number": 83,
      "label": "Clube Sem Paciência",
      "category": "crise instantânea",
      "description": "Qualquer derrota vira fim do mundo. A cultura interna não sabe atravessar sequência ruim.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "muito alta",
      "fanPressure": "muito alta",
      "boardPressure": "muito alta",
      "mediaExposure": "muito alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "ambição",
        "cobrança",
        "recursos"
      ],
      "weaknesses": [
        "ansiedade",
        "instabilidade",
        "vazamentos"
      ],
      "frequentEvents": [
        "duas derrotas viram crise",
        "reunião com organizada",
        "diretoria cobra resposta"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 15,
        "initialFatigue": 10,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 100,
        "morale": 50
      },
      "traits": [
        "crise_instantanea",
        "ambicao",
        "cobranca",
        "recursos",
        "ansiedade",
        "instabilidade",
        "duas_derrotas_viram_crise",
        "reuniao_com_organizada"
      ],
      "opening": "Duas derrotas provocam uma reunião de crise e vazam rumores de mudanças no elenco.",
      "dilemma": "A ambição só vira resultado se a cultura do clube aprender a atravessar uma sequência ruim.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "crise_instantanea",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_084_a_escola_de_armadores",
      "number": 84,
      "label": "Escola de Armadores",
      "category": "tradição posicional",
      "description": "Clube historicamente revela grandes armadores. A torcida valoriza inteligência, passe e controle de ritmo.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "prospect_core",
      "strengthTier": "normal",
      "strengths": [
        "criação",
        "leitura de jogo",
        "base especializada"
      ],
      "weaknesses": [
        "dependência do armador",
        "falta de força interior",
        "pressão sobre jovens"
      ],
      "frequentEvents": [
        "armador jovem erra",
        "ídolo da posição visita",
        "debate sobre ritmo"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "tradicao_posicional",
        "criacao",
        "leitura_de_jogo",
        "base_especializada",
        "dependencia_do_armador",
        "falta_de_forca_interior",
        "armador_jovem_erra",
        "idolo_da_posicao_visita"
      ],
      "sportIds": [
        "basquete"
      ],
      "opening": "Um armador jovem erra o último passe e encontra um ídolo da posição esperando por ele no treino seguinte.",
      "dilemma": "A escola de criação precisa desenvolver seu herdeiro sem deixar toda a equipe dependente dele.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "tradicao_posicional",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_085_torre_gemea",
      "number": 85,
      "label": "Torres Gêmeas",
      "category": "garrafão dominante",
      "description": "Dois pivôs dominantes definem a identidade do time. A liga tenta obrigá-los a jogar longe da cesta.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "good",
      "strengths": [
        "garrafão",
        "rebote",
        "proteção de aro"
      ],
      "weaknesses": [
        "espaçamento",
        "velocidade adversária",
        "faltas"
      ],
      "frequentEvents": [
        "pivôs juntos ou separados",
        "adversário abre quadra",
        "domínio físico"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "garrafao_dominante",
        "garrafao",
        "rebote",
        "protecao_de_aro",
        "espacamento",
        "velocidade_adversaria",
        "pivos_juntos_ou_separados",
        "adversario_abre_quadra"
      ],
      "sportIds": [
        "basquete"
      ],
      "opening": "Os dois pivôs controlam o rebote, até o rival usar cinco jogadores abertos e forçar uma escolha de rotação.",
      "dilemma": "A identidade no garrafão precisa resistir a espaçamento, faltas e corridas para longe do aro.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "garrafao_dominante",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_086_chuva_de_tres",
      "number": 86,
      "label": "Chuva de Três",
      "category": "arremesso",
      "description": "Tudo gira em torno do perímetro. Quando cai, é massacre. Quando não cai, vira desespero.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "defense_first",
      "strengthTier": "normal",
      "strengths": [
        "arremesso",
        "runs rápidos",
        "espetáculo"
      ],
      "weaknesses": [
        "variância",
        "rebote longo",
        "defesa vulnerável"
      ],
      "frequentEvents": [
        "noite histórica",
        "frio coletivo",
        "treino de seleção de arremesso"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "arremesso",
        "runs_rapidos",
        "espetaculo",
        "variancia",
        "rebote_longo",
        "noite_historica",
        "frio_coletivo"
      ],
      "sportIds": [
        "basquete"
      ],
      "opening": "Depois de uma noite de arremessos recorde, o mesmo quinteto não encontra a cesta no jogo seguinte.",
      "dilemma": "O perímetro pode esmagar rivais, mas precisa de um plano quando as bolas de três param de cair.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "arremesso",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_087_clube_do_contra_ataque",
      "number": 87,
      "label": "Clube do Contra-Ataque",
      "category": "transição",
      "description": "Equipe vive de correr, roubar bola e atacar antes da defesa montar. Ritmo é vida.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "velocidade",
        "pressão",
        "energia"
      ],
      "weaknesses": [
        "meia quadra fraca",
        "fadiga",
        "erros"
      ],
      "frequentEvents": [
        "adversário baixa ritmo",
        "treino de transição",
        "jogador pede mais controle"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "transicao",
        "velocidade",
        "pressao",
        "energia",
        "meia_quadra_fraca",
        "fadiga",
        "adversario_baixa_ritmo",
        "treino_de_transicao"
      ],
      "opening": "O adversário reduz o ritmo e obriga o time a executar ataques longos pela primeira vez na rodada.",
      "dilemma": "A velocidade produz vantagens, mas a vaga depende de construir jogadas sem entregar energia ao cansaço.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "transicao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_088_o_monge_e_os_caos",
      "number": 88,
      "label": "O Monge e o Caos",
      "category": "treinador calmo",
      "description": "Treinador calmo tenta comandar elenco emocional e explosivo. O contraste pode virar equilíbrio ou ruptura.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "controle emocional",
        "gestão de crise",
        "serenidade"
      ],
      "weaknesses": [
        "elenco impulsivo",
        "torcida quer sangue",
        "risco de parecer passivo"
      ],
      "frequentEvents": [
        "jogador explode",
        "técnico protege grupo",
        "coletiva serena irrita torcida"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "treinador_calmo",
        "controle_emocional",
        "gestao_de_crise",
        "serenidade",
        "elenco_impulsivo",
        "torcida_quer_sangue",
        "jogador_explode",
        "tecnico_protege_grupo"
      ],
      "opening": "Um jogador explode com a arbitragem, e a coletiva serena do treinador irrita a arquibancada.",
      "dilemma": "A calma no comando precisa conter os impulsos do elenco sem parecer indiferença.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "treinador_calmo",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_089_reconstrucao_pos_escandalo",
      "number": 89,
      "label": "Pós-Escândalo",
      "category": "reputação",
      "description": "O clube tenta limpar imagem após crise institucional. Cada erro parece confirmar velhos problemas.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "média",
      "boardPressure": "alta",
      "mediaExposure": "muito alta",
      "ambition": "estabilidade",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "vontade de mudar",
        "governança",
        "apoio por transparência"
      ],
      "weaknesses": [
        "desconfiança",
        "mídia agressiva",
        "patrocinador sensível"
      ],
      "frequentEvents": [
        "pergunta sobre passado",
        "nova regra interna",
        "patrocinador cobra postura"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0,
        "mediaExposure": 20
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 69,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 73,
        "morale": 50
      },
      "traits": [
        "reputacao",
        "vontade_de_mudar",
        "governanca",
        "apoio_por_transparencia",
        "desconfianca",
        "midia_agressiva",
        "pergunta_sobre_passado",
        "nova_regra_interna"
      ],
      "opening": "A primeira nova regra de conduta entra em vigor, e a imprensa pergunta se o clube mudou de verdade.",
      "dilemma": "Reconstruir a confiança exige transparência constante porque qualquer erro revive o escândalo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "reputacao",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_090_clube_do_povo",
      "number": 90,
      "label": "Clube do Povo",
      "category": "popular",
      "description": "Torcida numerosa e emocional exige raça, identificação e acesso. Jogador que parece distante sofre.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "muito alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "unbalanced",
      "strengthTier": "normal",
      "strengths": [
        "apoio massivo",
        "identificação",
        "pressão positiva"
      ],
      "weaknesses": [
        "cobrança emocional",
        "exposição",
        "conflito com estrela fria"
      ],
      "frequentEvents": [
        "treino aberto",
        "jogador abraça torcida",
        "vaias por falta de entrega"
      ],
      "modifiers": {
        "initialPressure": 25,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 64,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 98,
        "morale": 50
      },
      "traits": [
        "popular",
        "apoio_massivo",
        "identificacao",
        "pressao_positiva",
        "cobranca_emocional",
        "exposicao",
        "treino_aberto",
        "jogador_abraca_torcida"
      ],
      "opening": "Um treino aberto reúne milhares, mas uma estrela sai sem cumprimentar quem a esperou.",
      "dilemma": "O apoio popular exige identificação visível, além de resultados e talento dentro da equipe.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "popular",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_091_time_de_grife",
      "number": 91,
      "label": "Time de Grife",
      "category": "elite social",
      "description": "Clube rico, elegante e cobrado por imagem. Vencer feio também incomoda.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "elite",
      "budgetBias": 1.63,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "expensive_unbalanced",
      "strengthTier": "good",
      "strengths": [
        "estrutura",
        "atração",
        "patrocínio"
      ],
      "weaknesses": [
        "elitização",
        "pressão estética",
        "distância popular"
      ],
      "frequentEvents": [
        "evento de patrocinador",
        "crítica por falta de alma",
        "contratação badalada"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 25
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "elite_social",
        "estrutura",
        "atracao",
        "patrocinio",
        "elitizacao",
        "pressao_estetica",
        "evento_de_patrocinador",
        "critica_por_falta_de_alma"
      ],
      "opening": "O patrocinador organiza uma apresentação luxuosa após uma vitória que a torcida chamou de sem alma.",
      "dilemma": "A imagem refinada atrai recursos, mas o clube precisa vencer sem perder a conexão com as arquibancadas.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "elite_social",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_092_sobreviventes_da_viagem",
      "number": 92,
      "label": "Sobreviventes da Viagem",
      "category": "calendário pesado",
      "description": "A equipe enfrenta a pior logística da liga. Fadiga, sono e deslocamento são adversários fixos.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "low_budget_fight",
      "strengthTier": "low",
      "strengths": [
        "resiliência",
        "união",
        "adaptação"
      ],
      "weaknesses": [
        "fadiga",
        "lesões",
        "queda fora de casa"
      ],
      "frequentEvents": [
        "voo atrasado",
        "treino regenerativo",
        "comissão pede descanso"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialFatigue": 10,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 62,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 42,
        "morale": 50
      },
      "traits": [
        "calendario_pesado",
        "resiliencia",
        "uniao",
        "adaptacao",
        "fadiga",
        "lesoes",
        "voo_atrasado",
        "treino_regenerativo"
      ],
      "opening": "Um voo atrasado deixa a equipe sem treino completo antes do primeiro jogo longe de casa.",
      "dilemma": "A resiliência nas viagens precisa compensar sono, fadiga e risco físico ao longo do calendário.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "calendario_pesado",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_093_clube_sem_estrelas",
      "number": 93,
      "label": "Clube Sem Estrelas",
      "category": "igualitário",
      "description": "Ninguém é muito maior que ninguém. A força está na distribuição, mas falta alguém para decidir.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "baixa",
      "mediaExposure": "baixa",
      "ambition": "estabilidade",
      "rosterProfile": "defense_first",
      "strengthTier": "low",
      "strengths": [
        "coesão",
        "defesa coletiva",
        "baixo ego"
      ],
      "weaknesses": [
        "falta de clutch",
        "pouco marketing",
        "limite técnico"
      ],
      "frequentEvents": [
        "quem decide o último arremesso",
        "vitória coletiva",
        "torcida pede craque"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": -15,
        "initialCohesion": 12
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 62,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 42,
        "morale": 50
      },
      "traits": [
        "igualitario",
        "coesao",
        "defesa_coletiva",
        "baixo_ego",
        "falta_de_clutch",
        "pouco_marketing",
        "quem_decide_o_ultimo_arremesso",
        "vitoria_coletiva"
      ],
      "opening": "Na jogada decisiva, quatro jogadores trocam passes porque nenhum se assume como responsável por concluí-la.",
      "dilemma": "A distribuição fortalece o coletivo, mas jogos apertados exigem alguém disposto a concluir a jogada.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "igualitario",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_094_a_ultima_vaga",
      "number": 94,
      "label": "A Última Vaga",
      "category": "play-in",
      "description": "O elenco foi montado para brigar até o fim pela última vaga. Cada confronto direto pesa o dobro.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "foco em confronto direto",
        "resiliência",
        "clareza de meta"
      ],
      "weaknesses": [
        "margem pequena",
        "pressão por tabela",
        "dependência de rivais"
      ],
      "frequentEvents": [
        "jogo de seis pontos",
        "cálculo de classificação",
        "poupar ou vencer agora"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "play_in",
        "foco_em_confronto_direto",
        "resiliencia",
        "clareza_de_meta",
        "margem_pequena",
        "pressao_por_tabela",
        "jogo_de_seis_pontos",
        "calculo_de_classificacao"
      ],
      "opening": "A tabela coloca um rival direto na estreia e já circulam cálculos para a vaga final.",
      "dilemma": "Cada confronto de seis pontos pede urgência sem deixar a equipe refém das contas dos adversários.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "play_in",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_095_o_clube_do_treinamento",
      "number": 95,
      "label": "Clube do Treinamento",
      "category": "desenvolvimento diário",
      "description": "O time acredita que treino resolve tudo. Bons treinos aumentam moral; treinos ruins viram presságio.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "defense_first",
      "strengthTier": "normal",
      "strengths": [
        "evolução",
        "disciplina",
        "controle"
      ],
      "weaknesses": [
        "excesso de treino",
        "fadiga",
        "frustração quando não transfere"
      ],
      "frequentEvents": [
        "treino perfeito",
        "carga questionada",
        "atleta pede folga"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 48,
        "morale": 50
      },
      "traits": [
        "desenvolvimento_diario",
        "evolucao",
        "disciplina",
        "controle",
        "excesso_de_treino",
        "fadiga",
        "treino_perfeito",
        "carga_questionada"
      ],
      "opening": "O elenco sai animado de um treino perfeito e perde o jogo seguinte sem repetir nenhuma execução.",
      "dilemma": "Treinar mais pode acelerar a evolução ou cansar um grupo que precisa transferir trabalho para partidas reais.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "desenvolvimento_diario",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_096_crise_de_identidade",
      "number": 96,
      "label": "Crise de Identidade",
      "category": "transição cultural",
      "description": "O clube não sabe se quer ser formador, comprador, defensivo ou espetáculo. A temporada precisa definir uma cara.",
      "objective": "terminar no meio da tabela",
      "objectiveKey": "meio_de_tabela",
      "rawObjective": "meio de tabela",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "média",
      "boardPressure": "média",
      "mediaExposure": "média",
      "ambition": "estabilidade",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "flexibilidade",
        "chance de redefinir",
        "elenco misto"
      ],
      "weaknesses": [
        "confusão",
        "torcida dividida",
        "decisões contraditórias"
      ],
      "frequentEvents": [
        "reunião sobre filosofia",
        "mudança de estilo",
        "jogador pede clareza"
      ],
      "modifiers": {
        "initialPressure": 0,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 52,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 81,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 55,
        "morale": 50
      },
      "traits": [
        "transicao_cultural",
        "flexibilidade",
        "chance_de_redefinir",
        "elenco_misto",
        "confusao",
        "torcida_dividida",
        "reuniao_sobre_filosofia",
        "mudanca_de_estilo"
      ],
      "opening": "Uma reunião sobre filosofia termina com diretoria, comissão e atletas defendendo três estilos diferentes.",
      "dilemma": "A flexibilidade do elenco só vira vantagem quando o clube escolher uma identidade que consiga sustentar.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "meio_de_tabela",
          "transicao_cultural",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_097_o_clube_das_lendas_jovens",
      "number": 97,
      "label": "Lendas Jovens",
      "category": "precocidade",
      "description": "Atletas muito jovens já são tratados como ídolos. A fama veio antes da maturidade.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "média",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "normal",
      "strengths": [
        "talento precoce",
        "marketing",
        "torcida apaixonada"
      ],
      "weaknesses": [
        "imaturidade",
        "pressão precoce",
        "ego inflado"
      ],
      "frequentEvents": [
        "jovem dá entrevista polêmica",
        "torcida idolatra",
        "veterano cobra humildade"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 0,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 83,
        "morale": 50
      },
      "traits": [
        "precocidade",
        "talento_precoce",
        "marketing",
        "torcida_apaixonada",
        "imaturidade",
        "pressao_precoce",
        "jovem_da_entrevista_polemica",
        "torcida_idolatra"
      ],
      "opening": "Um jovem dá uma entrevista provocativa sob aplausos da torcida, e um veterano o chama para conversar.",
      "dilemma": "O talento precoce precisa amadurecer antes que a idolatria transforme confiança em descuido.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "precocidade",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_098_a_frente_fria",
      "number": 98,
      "label": "Frente Fria",
      "category": "controle emocional",
      "description": "Equipe fria, calculista e pouco emotiva. Ganha sem drama, mas às vezes parece sem alma.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "medio",
      "budgetBias": 1,
      "pressure": "media",
      "fanPressure": "baixa",
      "boardPressure": "média",
      "mediaExposure": "baixa",
      "ambition": "playoffs",
      "rosterProfile": "balanced",
      "strengthTier": "normal",
      "strengths": [
        "controle",
        "consistência",
        "baixa oscilação"
      ],
      "weaknesses": [
        "pouca conexão",
        "dificuldade em viradas emocionais",
        "torcida morna"
      ],
      "frequentEvents": [
        "vitória protocolar",
        "torcida pede paixão",
        "jogo quente testa frieza"
      ],
      "modifiers": {
        "initialPressure": -10,
        "budgetFlexibility": 0
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 45,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 88,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 32,
        "morale": 50
      },
      "traits": [
        "controle_emocional",
        "controle",
        "consistencia",
        "baixa_oscilacao",
        "pouca_conexao",
        "dificuldade_em_viradas_emocionais",
        "vitoria_protocolar",
        "torcida_pede_paixao"
      ],
      "opening": "Uma vitória controlada recebe poucos aplausos, e um confronto tenso se aproxima no calendário.",
      "dilemma": "A frieza que reduz erros precisa coexistir com a energia necessária para reagir quando o plano falhar.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "controle_emocional",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_099_o_clube_dos_milagres",
      "number": 99,
      "label": "Clube dos Milagres",
      "category": "improvável",
      "description": "A história recente é cheia de vitórias impossíveis. A torcida acredita até quando a estatística ri.",
      "objective": "chegar aos playoffs",
      "objectiveKey": "playoffs",
      "rawObjective": "playoffs",
      "budgetLevel": "baixo",
      "budgetBias": 0.57,
      "pressure": "media",
      "fanPressure": "alta",
      "boardPressure": "baixa",
      "mediaExposure": "alta",
      "ambition": "playoffs",
      "rosterProfile": "veteran_win_now",
      "strengthTier": "low",
      "strengths": [
        "fé coletiva",
        "resiliência",
        "decisão emocional"
      ],
      "weaknesses": [
        "dependência de épicos",
        "baixa regularidade",
        "risco de ilusão"
      ],
      "frequentEvents": [
        "milagre no estouro",
        "analistas duvidam",
        "torcida canta antes da virada"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": -15,
        "initialFatigue": 10
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 10,
        "injuryRisk": 5,
        "pressureLevel": 77,
        "morale": 50
      },
      "traits": [
        "improvavel",
        "fe_coletiva",
        "resiliencia",
        "decisao_emocional",
        "dependencia_de_epicos",
        "baixa_regularidade",
        "milagre_no_estouro",
        "analistas_duvidam"
      ],
      "opening": "A torcida canta por outra virada impossível antes mesmo de o time sofrer o primeiro ponto.",
      "dilemma": "A crença nos milagres ajuda nas decisões, mas não substitui a regularidade que evita o desespero.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "playoffs",
          "improvavel",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    },
    {
      "id": "lore_100_a_nova_ordem",
      "number": 100,
      "label": "A Nova Ordem",
      "category": "mudança de era",
      "description": "Um clube emergente ameaça a velha hierarquia da liga. Os gigantes não aceitam dividir o trono.",
      "objective": "brigar pelo titulo",
      "objectiveKey": "ser_campeao",
      "rawObjective": "ser campeão",
      "budgetLevel": "alto",
      "budgetBias": 1.33,
      "pressure": "alta",
      "fanPressure": "alta",
      "boardPressure": "alta",
      "mediaExposure": "alta",
      "ambition": "titulo",
      "rosterProfile": "balanced",
      "strengthTier": "good",
      "strengths": [
        "ambição",
        "talento ascendente",
        "energia de ruptura"
      ],
      "weaknesses": [
        "inimizade dos grandes",
        "pressão inédita",
        "falta de experiência no topo"
      ],
      "frequentEvents": [
        "vitória contra potência",
        "provocação dos veteranos da liga",
        "primeira final histórica"
      ],
      "modifiers": {
        "initialPressure": 15,
        "budgetFlexibility": 15
      },
      "initialTeamState": {
        "boardTrust": 50,
        "fanSupport": 59,
        "lockerRoom": 50,
        "staffTrust": 50,
        "clubTraditionAlignment": 50,
        "mediaRelationship": 74,
        "groupCohesion": 50,
        "squadFatigue": 0,
        "injuryRisk": 0,
        "pressureLevel": 90,
        "morale": 50
      },
      "traits": [
        "mudanca_de_era",
        "ambicao",
        "talento_ascendente",
        "energia_de_ruptura",
        "inimizade_dos_grandes",
        "pressao_inedita",
        "vitoria_contra_potencia",
        "provocacao_dos_veteranos_da_liga"
      ],
      "opening": "Uma vitória sobre uma potência põe o clube emergente na rota da primeira final e provoca os veteranos da liga.",
      "dilemma": "A nova ordem precisa confirmar seu talento sob uma pressão que nunca enfrentou no topo.",
      "decisionSummary": {
        "decisionCount": 10,
        "decisionTypes": [
          "controle_carga",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ],
        "sampleTitles": [
          "Pedido da fisioterapia antes da rodada pesada",
          "Pergunta incômoda na entrevista pós-jogo",
          "Conversa fechada com o elenco",
          "Reunião de cobrança com a diretoria",
          "Pressão da arquibancada"
        ],
        "tags": [
          "controle_carga",
          "ser_campeao",
          "mudanca_de_era",
          "entrevista_pos_jogo",
          "vestiario",
          "diretoria",
          "torcida",
          "mercado",
          "base",
          "conflito_interno",
          "classico",
          "estrategia"
        ]
      }
    }
  ]
};

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralLoreDatasets
  };
})();
