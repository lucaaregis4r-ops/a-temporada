(function () {
  const namespace = (window.TemporadaTotal = window.TemporadaTotal || {});

  function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // =========================================================================
  // BANCO DE ARCOS NARRATIVOS E REDES DE DECISÕES RAMIFICADAS
  // =========================================================================
  const STORY_ARCS = {
    // -----------------------------------------------------------------------
    // ARCO 1: O ÚLTIMO BAILE (Veteranos e Limite Físico)
    // -----------------------------------------------------------------------
    arc_last_dance: {
      id: "arc_last_dance",
      name: "O Último Baile",
      category: "lore",
      description: "A geração veterana busca a última glória enquanto o corpo pede descanso.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Vestiário dos Veteranos",
          situation: "Após uma semana puxada de treinos, os principais líderes veteranos pedem uma conversa reservada. A fisioterapia recomendou controle rígido de minutos para evitar lesões graves na rodada que se aproxima.",
          choices: [
            {
              id: "preserve_veterans",
              label: "Poupar veteranos e rodar o banco",
              description: "Priorizar a integridade física. Menos intensidade no próximo jogo, mas pernas inteiras para a reta final.",
              effects: { morale: 2, fatigue: -8, courtBoost: -2.5, chemistry: 3 },
              delayDays: 4,
              nextNode: "node_bench_reaction",
              requiresMatchResult: false,
              flag: "veteranos_poupados"
            },
            {
              id: "push_veterans",
              label: "Força máxima! Titulares em quadra",
              description: "Exigir o limite da experiência. Mais força no jogo de imediato, assumindo o risco de estafa muscular.",
              effects: { morale: 5, fatigue: 10, courtBoost: 4.0, chemistry: -2 },
              delayDays: 3,
              nextNode: "node_high_stakes_game",
              requiresMatchResult: true,
              flag: "veteranos_no_limite"
            }
          ]
        },
        node_bench_reaction: {
          id: "node_bench_reaction",
          title: "A Oportunidade dos Reservas",
          situation: "Com os líderes no banco, os jovens suplentes ganharam espaço. No vestiário, um dos reservas promete entregar a vida para provar que a equipe não depende só dos medalhões.",
          choices: [
            {
              id: "empower_bench",
              label: "Dar confiança total e cobrar protagonismo",
              description: "Os reservas entram motivados e a moral do grupo sobe.",
              effects: { morale: 6, chemistry: 5, playerDev: 3, courtBoost: 2.0 },
              delayDays: 7,
              nextNode: "node_veterans_legacy",
              requiresMatchResult: false,
              flag: "banco_afirmado"
            },
            {
              id: "cautious_bench",
              label: "Montar esquema tático conservador e seguro",
              description: "Evitar erros e garantir consistência defensiva.",
              effects: { defense: 3, fatigue: -3, courtBoost: 1.0 },
              delayDays: 7,
              nextNode: "node_veterans_legacy",
              requiresMatchResult: false,
              flag: "jogo_seguro"
            }
          ]
        },
        node_high_stakes_game: {
          id: "node_high_stakes_game",
          title: "A Conta da Intensidade",
          situation: "Os veteranos foram ao limite na quadra. Agora a comissão médica apresenta o balanço: exaustão pesada, mas o vestiário está em clima de guerra pelo título.",
          choices: [
            {
              id: "ice_baths_recovery",
              label: "Investir em fisioterapia intensiva (Custos extras)",
              description: "Gastar $2M do caixa em recuperação acelerada para mantê-los disponíveis.",
              effects: { budget: -2, fatigue: -12, morale: 4, courtBoost: 2.5 },
              delayDays: 6,
              nextNode: "node_veterans_legacy",
              requiresMatchResult: false,
              flag: "recuperacao_cara"
            },
            {
              id: "grit_it_out",
              label: "Superar na raça e manter a rotina normal",
              description: "Sem gastos extras. O time absorve o cansaço como parte da identidade guerreira.",
              effects: { morale: 3, fatigue: 4, courtBoost: 1.0 },
              delayDays: 6,
              nextNode: "node_veterans_legacy",
              requiresMatchResult: false,
              flag: "raça_pura"
            }
          ]
        },
        node_veterans_legacy: {
          id: "node_veterans_legacy",
          title: "O Legado da Temporada",
          situation: "A diretoria convoca uma coletiva para exaltar a liderança do grupo. A torcida esgota os ingressos para os próximos confrontos, confiante na união da equipe.",
          choices: [
            {
              id: "rally_fans",
              label: "Convocar a torcida para lotar o ginásio/arena",
              description: "Clima de festa e pressão total sobre os adversários em casa.",
              effects: { fanTrust: 12, morale: 5, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "uniao_total_concluida"
            },
            {
              id: "calm_hub",
              label: "Blindar o grupo do oba-oba e manter os pés no chão",
              description: "Concentração máxima antes da fase eliminatória.",
              effects: { chemistry: 6, defense: 3, courtBoost: 2.0 },
              delayDays: null,
              nextNode: null,
              flag: "foco_absoluto_concluido"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 2: O MOTIM DA ESTRELA (Conflito de Ego e Liderança)
    // -----------------------------------------------------------------------
    arc_rebel_star: {
      id: "arc_rebel_star",
      name: "O Motim da Estrela",
      category: "elenco",
      description: "O principal pontuador do time questiona suas ordens táticas publicamente.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "Atraso e Desafio Tático",
          situation: "Durante a preparação tática, o principal jogador do time chega atrasado e critica o plano de jogo na frente de todos: 'Esse esquema me prende. Se eu não chutar/finalizar livre, a gente não vai a lugar nenhum.'",
          choices: [
            {
              id: "bench_the_star",
              label: "Punir e mandar para o banco no próximo jogo",
              description: "Manter a autoridade do comando técnico. O grupo respeita a hierarquia, mas perde poder de fogo momentâneo.",
              effects: { morale: -3, chemistry: 6, courtBoost: -3.0, boardPressure: -1 },
              delayDays: 4,
              nextNode: "node_star_press_leak",
              requiresMatchResult: false,
              flag: "estrela_punida"
            },
            {
              id: "appease_star",
              label: "Chamar em particular e ajustar o ataque para ele",
              description: "Dar a bola na mão do craque. Mais poder ofensivo imediato, mas outros jogadores se sentem desprestigiados.",
              effects: { morale: 4, chemistry: -6, courtBoost: 3.5, offense: 4 },
              delayDays: 5,
              nextNode: "node_locker_division",
              requiresMatchResult: false,
              flag: "estrela_agradada"
            }
          ]
        },
        node_star_press_leak: {
          id: "node_star_press_leak",
          title: "Vazamento para a Imprensa",
          situation: "Após o banco, o empresário do jogador solta uma nota na mídia insinuando que o atleta quer sair: 'Falta ambição ao treinador'. A diretoria liga cobrando explicações urgentes.",
          choices: [
            {
              id: "face_the_board",
              label: "Peitar a diretoria: 'Quem escala o time sou eu!'",
              description: "Postura de líder inabalável. A torcida ama a coragem, mas a diretoria monitora seus resultados com lupa.",
              effects: { fanTrust: 8, boardPressure: 2, morale: 4 },
              delayDays: 6,
              nextNode: "node_star_ultimatum",
              requiresMatchResult: true,
              flag: "tecnico_bancou"
            },
            {
              id: "conciliate_board",
              label: "Fazer as pazes publicamente e reintegrar o craque",
              description: "Apagar o incêndio com panos quentes. Alivia a diretoria e restaura o elenco completo.",
              effects: { boardPressure: -2, chemistry: 2, morale: 2, courtBoost: 2.0 },
              delayDays: 6,
              nextNode: "node_star_peace",
              requiresMatchResult: false,
              flag: "paz_selada"
            }
          ]
        },
        node_locker_division: {
          id: "node_locker_division",
          title: "Racha no Vestiário",
          situation: "Com a estrela monopolizando as bolas, os atletas defensivos e coadjuvantes fazem um treino apático. 'Se ele joga sozinho, ele que marque na defesa sozinho.'",
          choices: [
            {
              id: "confront_roleplayers",
              label: "Cobrar sacrifício: 'As estrelas ganham jogos, a defesa ganha títulos!'",
              description: "Discurso duro de vestiário para alinhar as expectativas coletivas.",
              effects: { chemistry: 4, defense: 4, fatigue: 5, courtBoost: 1.5 },
              delayDays: 5,
              nextNode: "node_star_peace",
              requiresMatchResult: false,
              flag: "vestiario_enquadrado"
            },
            {
              id: "share_touches",
              label: "Redistribuir o jogo e exigir que a estrela passe a bola",
              description: "Obrigá-lo a criar jogadas para os companheiros, melhorando a fluidez coletiva.",
              effects: { chemistry: 7, courtBoost: 2.5, offense: 2 },
              delayDays: 5,
              nextNode: "node_star_peace",
              requiresMatchResult: false,
              flag: "ataque_coletivo"
            }
          ]
        },
        node_star_ultimatum: {
          id: "node_star_ultimatum",
          title: "A Prova dos Fatos",
          situation: "Após a crise com a imprensa, o jogo decisivo chegou. Se vencer, sua postura será aclamada como genial; se perder, a cabeça do técnico estará a prêmio.",
          choices: [
            {
              id: "win_vindication",
              label: "Colocar o time focado no plano tático",
              description: "A equipe entra mordendo e determinada a provar sua força coletiva.",
              effects: { morale: 6, courtBoost: 4.0, fanTrust: 5 },
              delayDays: null,
              nextNode: null,
              flag: "crise_superada_com_vitoria"
            }
          ]
        },
        node_star_peace: {
          id: "node_star_peace",
          title: "Paz Armada e Foco na Taça",
          situation: "O vestiário encontrou um equilíbrio. A estrela entendeu que precisa do grupo e os coadjuvantes respeitam seu talento. O clube entra na fase mais forte da temporada.",
          choices: [
            {
              id: "cement_unity",
              label: "Celebrar com jantar de confraternização",
              description: "Gastar $1M do caixa para selar a amizade do grupo antes dos playoffs.",
              effects: { budget: -1, chemistry: 8, morale: 6, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "grupo_fechado_campeao"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 3: O PRODÍGIO DA BASE (Aposta de Risco vs Lapidação)
    // -----------------------------------------------------------------------
    arc_wonderkid: {
      id: "arc_wonderkid",
      name: "O Prodígio da Base",
      category: "formacao",
      description: "Um garoto de 17 anos da base está voando nos treinos e pede passagem.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "Descoberta no Treino Aberto",
          situation: "O técnico da equipe sub-20 bate na sua porta: 'O garoto prodígio não tem mais o que aprender na base. Ele está destruindo nossos zagueiros/bloqueadores nos treinos. Se você não colocar ele no time principal agora, olheiros europeus vão levar.'",
          choices: [
            {
              id: "start_the_kid",
              label: "Promover e lançar como titular já no próximo jogo!",
              description: "Aposta arrojada. A torcida se empolga com a joia caseira. Se ele render, vira craque instantâneo (+6 Overall).",
              effects: { fanTrust: 10, morale: 4, courtBoost: 2.0, playerDev: 6 },
              delayDays: 4,
              nextNode: "node_kid_spotlight",
              requiresMatchResult: true,
              flag: "prodígio_titular"
            },
            {
              id: "bench_and_mentor",
              label: "Colocar no banco e escalar um veterano para ser mentor",
              description: "Cuidado na lapidação. Menos pressão sobre o garoto e evolução gradual e segura.",
              effects: { chemistry: 5, playerDev: 3, defense: 2 },
              delayDays: 6,
              nextNode: "node_kid_growing",
              requiresMatchResult: false,
              flag: "prodígio_lapidado"
            }
          ]
        },
        node_kid_spotlight: {
          id: "node_kid_spotlight",
          title: "Os Holofotes Sobre o Menino",
          situation: "Após estrear como titular, a cidade só fala do menino prodígio. Um grande empresário internacional aparece oferecendo uma proposta irrecusável de compra: $15M na mesa pelo passe do atleta.",
          choices: [
            {
              id: "reject_and_keep",
              label: "Recusar a venda: 'Ele é o futuro do nosso clube!'",
              description: "Segurar a joia para buscar títulos. A torcida vai à loucura de orgulho.",
              effects: { fanTrust: 15, morale: 6, courtBoost: 3.0, chemistry: 4 },
              delayDays: 7,
              nextNode: "node_kid_championship_run",
              requiresMatchResult: false,
              flag: "joia_mantida"
            },
            {
              id: "sell_for_cash",
              label: "Vender por $15M e reestruturar os cofres do clube",
              description: "Negócio milionário que resolve as finanças do clube, mas gera descontentamento esportivo.",
              effects: { budget: 15, fanTrust: -8, morale: -3, boardPressure: -3 },
              delayDays: 7,
              nextNode: "node_cash_reinvestment",
              requiresMatchResult: false,
              flag: "joia_vendida"
            }
          ]
        },
        node_kid_growing: {
          id: "node_kid_growing",
          title: "A Evolução Madura",
          situation: "Seguindo os conselhos dos veteranos, o jovem entra no segundo tempo de partidas controladas e ganha confiança sem queimar etapas.",
          choices: [
            {
              id: "unleash_playoffs",
              label: "Soltar o garoto na reta final da temporada como fator surpresa",
              description: "Adversários não têm scout sobre o ritmo dele. Arma secreta na manga!",
              effects: { courtBoost: 4.0, morale: 5, playerDev: 4 },
              delayDays: null,
              nextNode: null,
              flag: "arma_secreta_ativada"
            }
          ]
        },
        node_kid_championship_run: {
          id: "node_kid_championship_run",
          title: "A Bandeira do Clube",
          situation: "O prodígio assume a responsabilidade de decidir jogos grandes. Com a torcida ao lado, o clube ganha um novo ídolo para liderar a campanha.",
          choices: [
            {
              id: "legendary_run",
              label: "Entregar a faixa de esperança do time ao garoto",
              description: "Confiança inabalável rumo à disputa da taça.",
              effects: { morale: 8, courtBoost: 3.5, fanTrust: 10 },
              delayDays: null,
              nextNode: null,
              flag: "idolo_consagrado"
            }
          ]
        },
        node_cash_reinvestment: {
          id: "node_cash_reinvestment",
          title: "Cofres Cheios, Cobrança Redobrada",
          situation: "Com os $15M em caixa, a diretoria exige que o dinheiro seja revertido em infraestrutura médica e bônus de vitória para os jogadores remanescentes.",
          choices: [
            {
              id: "distribute_bonuses",
              label: "Pagar bicho gordo por vitória no vestiário ($4M)",
              description: "Dinheiro vivo na mão dos atletas. Vontade redobrada de vencer!",
              effects: { budget: -4, morale: 8, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "bicho_pago"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 4: CRISE FINANCEIRA E PATROCÍNIO (Gestão de Sobrevivência)
    // -----------------------------------------------------------------------
    arc_financial_crisis: {
      id: "arc_financial_crisis",
      name: "O Rombo nos Cofres",
      category: "financas",
      description: "O patrocinador principal atrasa repasse e coloca os salários em xeque.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "Alerta Vermelho na Tesouraria",
          situation: "O diretor financeiro entra na sala do técnico pálido: 'O patrocinador master entrou em recuperação judicial e não vai pagar as parcelas deste mês. Se não fizermos algo agora, a folha de pagamento vai atrasar na semana que vem.'",
          choices: [
            {
              id: "controversial_sponsor",
              label: "Aceitar patrocínio de casa de apostas polêmica (+ $12M)",
              description: "Dinheiro entra na hora e salva as contas, mas parte da torcida e da imprensa critica a parceria moralmente.",
              effects: { budget: 12, fanTrust: -6, boardPressure: -2, morale: 2 },
              delayDays: 5,
              nextNode: "node_sponsor_backlash",
              requiresMatchResult: false,
              flag: "patrocinio_polemico"
            },
            {
              id: "austerity_and_talk",
              label: "Reunir o elenco, ser transparente e pedir pacto de honra",
              description: "Sem dinheiro sujo. Cortar viagens de luxo e pedir que o grupo jogue pelo clube até normalizar.",
              effects: { chemistry: 8, morale: -2, fatigue: 4, budget: 2 },
              delayDays: 6,
              nextNode: "node_solidarity_run",
              requiresMatchResult: true,
              flag: "pacto_de_honra"
            }
          ]
        },
        node_sponsor_backlash: {
          id: "node_sponsor_backlash",
          title: "Protestos no Portão do Ginásio",
          situation: "Com os salários em dia graças ao novo patrocinador, um grupo de torcedores tradicionais faz faixas criticando o patrocinador. Mas o time treina tranquilo sem medo de boleto atrasado.",
          choices: [
            {
              id: "donate_to_community",
              label: "Doar $1.5M do patrocínio para projetos sociais do bairro",
              description: "Ação de relações públicas brilhante que cala os críticos e vira o jogo com a torcida.",
              effects: { budget: -1.5, fanTrust: 10, morale: 4 },
              delayDays: null,
              nextNode: null,
              flag: "crise_financeira_resolvida_com_sucesso"
            },
            {
              id: "ignore_protests",
              label: "Ignorar o barulho e focar no desempenho da equipe",
              description: "O que importa é taça e salário em dia. Os resultados vão calar qualquer crítica.",
              effects: { courtBoost: 2.0, boardPressure: -2 },
              delayDays: null,
              nextNode: null,
              flag: "foco_em_resultado"
            }
          ]
        },
        node_solidarity_run: {
          id: "node_solidarity_run",
          title: "O Time do Povo",
          situation: "Sensibilizados pela transparência da comissão técnica, os atletas criam um ambiente de companheirismo blindado. 'Ninguém vai parar a gente!'",
          choices: [
            {
              id: "blood_in_the_eyes",
              label: "Entrar em quadra como leões com o sangue nos olhos",
              description: "Motivação visceral que transforma a adversidade em força incontrolável.",
              effects: { morale: 8, courtBoost: 4.5, fanTrust: 8 },
              delayDays: null,
              nextNode: null,
              flag: "superacao_heroica"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 5: O CLÁSSICO DA CIDADE (Rivalidade Mortal)
    // -----------------------------------------------------------------------
    arc_derby_rivalry: {
      id: "arc_derby_rivalry",
      name: "Semana de Clássico",
      category: "rivalidade",
      description: "O maior rival regional está no caminho. A cidade ferve.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "A Provocação do Técnico Adversário",
          situation: "Na coletiva antes do dérbi, o treinador rival ironiza seu clube: 'Eles tremem em jogo grande. Vamos atropelar dentro da casa deles.' A imprensa repercute a frase e o vestiário reage indignado.",
          choices: [
            {
              id: "fire_back_press",
              label: "Revidar na mesma moeda: 'Eles vão sair de cabeça baixa!'",
              description: "Incendiar o clássico. A torcida compra o barulho e o ginásio/arena vira um caldeirão (+Pressão, +Foco ofensivo).",
              effects: { fanTrust: 10, morale: 6, courtBoost: 4.0, fatigue: 4 },
              delayDays: 3,
              nextNode: "node_derby_war",
              requiresMatchResult: true,
              flag: "classico_incendiado"
            },
            {
              id: "cold_tactics",
              label: "Frieza absoluta: 'A resposta será na bola e na tática.'",
              description: "Manter a cabeça no lugar. Blindar o time do calor emocional para não cometer faltas bobas.",
              effects: { defense: 4, chemistry: 5, courtBoost: 2.5 },
              delayDays: 3,
              nextNode: "node_derby_war",
              requiresMatchResult: true,
              flag: "classico_calculado"
            }
          ]
        },
        node_derby_war: {
          id: "node_derby_war",
          title: "O Pós-Clássico",
          situation: "A poeira do dérbi assentou. O resultado do clássico moldou a alma da temporada e os torcedores nunca vão esquecer essa batalha.",
          choices: [
            {
              id: "derby_aftermath_party",
              label: "Capitalizar o momento e acelerar rumo aos playoffs",
              description: "A energia do clássico vira combustível para o restante da campanha.",
              effects: { morale: 7, fanTrust: 8, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "classico_vencido_e_celebrado"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 6: RACHA NO VESTIÁRIO (Velha Guarda vs Nova Geração)
    // -----------------------------------------------------------------------
    arc_locker_room_split: {
      id: "arc_locker_room_split",
      name: "Racha no Vestiário",
      category: "elenco",
      description: "Divergência entre veteranos e jovens talentos ameaça implodir o ambiente da equipe.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Vestiário Fraturado",
          situation: "Após discussões quentes nos treinos, o capitão veterano e os jovens talentos romperam relações. Veteranos cobram respeito à hierarquia, enquanto os jovens reclamam que não recebem a bola em posições de destaque.",
          choices: [
            {
              id: "back_veterans",
              label: "Apoiar a Velha Guarda e exigir respeito à hierarquia",
              description: "Cobrar disciplina e postura profissional dos mais jovens.",
              effects: { morale: -2, chemistry: 4, defense: 3, courtBoost: 1.5, boardConfidence: 3 },
              delayDays: 3,
              nextNode: "node_youngsters_ultimatum",
              requiresMatchResult: false,
              flag: "hierarquia_veteranos"
            },
            {
              id: "back_youth",
              label: "Dar carta branca à Juventude e acelerar a renovação",
              description: "Apostar no talento emergente mesmo contrariando os medalhões.",
              effects: { morale: 4, playerDev: 4, chemistry: -4, courtBoost: 1.0 },
              delayDays: 3,
              nextNode: "node_veteran_cold_shoulder",
              requiresMatchResult: false,
              flag: "renovacao_jovem"
            },
            {
              id: "force_truce",
              label: "Confinar o elenco num jantar de conciliação a portas fechadas",
              description: "Investir $1M do caixa do clube para reunir o grupo sem comissão técnica e selar um pacto.",
              effects: { budget: -1.0, morale: 5, chemistry: 6, fatigue: -3, courtBoost: 2.0 },
              delayDays: 4,
              nextNode: "node_united_front",
              requiresMatchResult: false,
              flag: "pacto_reconciliacao"
            }
          ]
        },
        node_youngsters_ultimatum: {
          id: "node_youngsters_ultimatum",
          title: "O Desabafo dos Jovens",
          situation: "Os atletas mais jovens sentem que o clube está estagnado no passado. Um dos suplentes pede uma conversa sincera sobre seu futuro na rotação.",
          choices: [
            {
              id: "promise_starter_minutes",
              label: "Garantir minutos importantes na rotação da próxima partida",
              description: "Dar a chance prática para provarem seu valor dentro de quadra.",
              effects: { courtBoost: 2.5, morale: 4, playerDev: 3 },
              delayDays: 5,
              nextNode: "node_united_front",
              requiresMatchResult: true,
              flag: "minutos_prometidos"
            },
            {
              id: "bench_punishment",
              label: "Manter postura rígida: 'Aqui joga quem treina melhor'",
              description: "Sem concessões. Quem reclamar assiste a partida da arquibancada.",
              effects: { chemistry: 2, morale: -3, boardConfidence: 3 },
              delayDays: 5,
              nextNode: "node_united_front",
              requiresMatchResult: false,
              flag: "pulso_firme"
            }
          ]
        },
        node_veteran_cold_shoulder: {
          id: "node_veteran_cold_shoulder",
          title: "O Silêncio dos Líderes",
          situation: "Os veteranos diminuíram a comunicação em quadra e deixaram de orientar a equipe nos tempos técnicos.",
          choices: [
            {
              id: "appeal_to_pride",
              label: "Conversa reservada apelando ao orgulho e legado histórico",
              description: "Tocar no brio e na responsabilidade de ídolo.",
              effects: { morale: 6, courtBoost: 3.0, chemistry: 3 },
              delayDays: 4,
              nextNode: "node_united_front",
              requiresMatchResult: false,
              flag: "orgulho_recuperado"
            },
            {
              id: "phase_out_veteran",
              label: "Afastar o líder mais descontente da viagem seguinte",
              description: "Demonstrar autoridade máxima, cortando o problema na raiz.",
              effects: { chemistry: 3, morale: -4, defense: -2 },
              delayDays: 4,
              nextNode: "node_united_front",
              requiresMatchResult: false,
              flag: "lider_afastado"
            }
          ]
        },
        node_united_front: {
          id: "node_united_front",
          title: "O Novo Vestiário",
          situation: "Após os confrontos internos, a equipe redefiniu suas regras de convivência e entra na reta seguinte com papéis claros.",
          choices: [
            {
              id: "leadership_committee",
              label: "Criar conselho conjunto unindo veteranos e novatos",
              description: "Ambiente blindado e química máxima para a briga por troféus.",
              effects: { chemistry: 7, morale: 5, courtBoost: 3.5 },
              delayDays: null,
              nextNode: null,
              flag: "conselho_criado_sucesso"
            },
            {
              id: "all_in_title",
              label: "Focar toda a energia na quadra: 'A única paz é vencer'",
              description: "Clima competitivo e cobrança feroz por vitórias.",
              effects: { fanTrust: 6, courtBoost: 4.0 },
              delayDays: null,
              nextNode: null,
              flag: "guerra_competitiva_sucesso"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 7: O PATROCÍNIO VIRAL (Comercial vs Esportivo)
    // -----------------------------------------------------------------------
    arc_viral_sponsorship: {
      id: "arc_viral_sponsorship",
      name: "O Patrocínio Viral",
      category: "mercado",
      description: "Uma investidora de tecnologia oferece aporte milionário com exigências midiáticas.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "A Proposta da Empresa de Tecnologia",
          situation: "Uma marca global de mídia e inteligência oferece $3.5M para estampar a camisa principal. Em troca, exigem câmeras exclusivas nos bastidores e campanhas semanais com os atletas mais carismáticos.",
          choices: [
            {
              id: "accept_viral_deal",
              label: "Aceitar a parceria com foco em explosão de marca ($3.5M)",
              description: "Cofre cheio e expansão de torcida, assumindo alguma distração nas redes sociais.",
              effects: { budget: 3.5, fanTrust: 8, chemistry: -3, courtBoost: -1.0 },
              delayDays: 3,
              nextNode: "node_viral_locker_room",
              requiresMatchResult: false,
              flag: "contrato_viral_assinado"
            },
            {
              id: "negotiate_boundaries",
              label: "Exigir cláusula de proteção de foco desportivo ($2.0M)",
              description: "Reduzir o valor para preservar a privacidade do vestiário e da preparação.",
              effects: { budget: 2.0, fanTrust: 4, chemistry: 2, courtBoost: 1.0 },
              delayDays: 4,
              nextNode: "node_commercial_compromise",
              requiresMatchResult: false,
              flag: "contrato_equilibrado"
            },
            {
              id: "reject_commercial_circus",
              label: "Rejeitar a proposta: 'Aqui respiramos apenas esporte'",
              description: "Ganhar o respeito eterno da torcida tradicional e dos atletas focados.",
              effects: { budget: 0, fanTrust: 7, morale: 5, chemistry: 5, courtBoost: 2.5 },
              delayDays: 4,
              nextNode: "node_purist_rally",
              requiresMatchResult: false,
              flag: "proposta_rejeitada"
            }
          ]
        },
        node_viral_locker_room: {
          id: "node_viral_locker_room",
          title: "Câmeras e Tendências",
          situation: "Um vídeo gravado no treino bateu 10 milhões de visualizações, mas rivais estão zombando nas redes dizendo que o clube virou reality show.",
          choices: [
            {
              id: "lean_into_hype",
              label: "Entrar na onda e usar o hype para intimidar os rivais",
              description: "Transformar a atenção midiática em postura dominante na arena.",
              effects: { morale: 5, courtBoost: 2.5, fanTrust: 6 },
              delayDays: null,
              nextNode: null,
              flag: "hype_dominante_concluido"
            },
            {
              id: "lock_down_content",
              label: "Proibir celulares no centro de treinamento antes dos jogos",
              description: "Priorizar foco esportivo total para calar os críticos.",
              effects: { boardConfidence: -2, chemistry: 5, defense: 3, courtBoost: 2.0 },
              delayDays: null,
              nextNode: null,
              flag: "blindagem_concluida"
            }
          ]
        },
        node_commercial_compromise: {
          id: "node_commercial_compromise",
          title: "O Bônus por Rendimento",
          situation: "O patrocinador anuncia uma premiação extra de $1.0M se a equipe vencer o próximo confronto televisionado.",
          choices: [
            {
              id: "share_bonus_staff",
              label: "Prometer ratear o bônus com toda a comissão e funcionários",
              description: "Apoio unânime e motivação no teto em todos os setores do clube.",
              effects: { morale: 7, chemistry: 6, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "bonus_dividido_concluido"
            },
            {
              id: "reinvest_tech",
              label: "Investir o bônus em softwares de recuperação física",
              description: "Redução sensível de fadiga para os atletas titulares.",
              effects: { fatigue: -8, playerDev: 3, courtBoost: 2.0 },
              delayDays: null,
              nextNode: null,
              flag: "recuperacao_tecnologica_concluida"
            }
          ]
        },
        node_purist_rally: {
          id: "node_purist_rally",
          title: "A Alma do Ginásio",
          situation: "A torcida organizada prepara um mosaico gigante na arquibancada comemorando a lealdade do clube às suas raízes.",
          choices: [
            {
              id: "fan_tribute_speech",
              label: "Fazer discurso inflamado convidando a massa para empurrar o time",
              description: "Ginásio em clima de caldeirão nos jogos decisivos.",
              effects: { fanTrust: 12, courtBoost: 3.5, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "alma_tradicional_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 8: A POLÊMICA DE ARBITRAGEM (Pressão e Coletiva Quente)
    // -----------------------------------------------------------------------
    arc_scandal_referee: {
      id: "arc_scandal_referee",
      name: "A Polêmica da Arbitragem",
      category: "diretoria",
      description: "Um apito polêmico contra a equipe incendeia a imprensa e exige posicionamento.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Apito Controverso",
          situation: "Uma decisão duvidosa da arbitragem no final da partida anterior gerou revolta no vestiário e na torcida. Na sala de coletiva, repórteres pressionam com perguntas incisivas.",
          choices: [
            {
              id: "explode_press",
              label: "Detonar a arbitragem publicamente: 'Fomos roubados!'",
              description: "Incendiar o vestiário e a torcida, assumindo o risco de punição do tribunal da liga.",
              effects: { fanTrust: 8, morale: 6, courtBoost: 2.5, boardConfidence: -4 },
              delayDays: 3,
              nextNode: "node_tribunal_threat",
              requiresMatchResult: false,
              flag: "declaracao_explosiva"
            },
            {
              id: "diplomatic_criticism",
              label: "Postura elegante: 'Erros acontecem, mas esperamos coerência'",
              description: "Proteger a imagem institucional do clube sem passar pano para o erro.",
              effects: { boardConfidence: 5, chemistry: 3, courtBoost: 1.0 },
              delayDays: 4,
              nextNode: "node_referee_respect",
              requiresMatchResult: false,
              flag: "postura_diplomatica"
            },
            {
              id: "ironic_silence",
              label: "Silêncio irônico e foco no trabalho: 'Quem viu, sabe'",
              description: "Canalizar o inconformismo em treinos de intensidade dobrada.",
              effects: { morale: 4, defense: 4, courtBoost: 2.0 },
              delayDays: 3,
              nextNode: "node_referee_respect",
              requiresMatchResult: false,
              flag: "silencio_estrategico"
            }
          ]
        },
        node_tribunal_threat: {
          id: "node_tribunal_threat",
          title: "A Notificação do Tribunal",
          situation: "A federação abre procedimento disciplinar contra o clube, exigindo retratação formal ou pagamento de $1.2M de multa administrativa.",
          choices: [
            {
              id: "pay_and_defend",
              label: "Pagar a multa e manter a cabeça erguida: 'Não nos calarão'",
              description: "O vestiário abraça a causa como uma guerra contra o sistema.",
              effects: { budget: -1.2, morale: 8, courtBoost: 3.5, fanTrust: 6 },
              delayDays: null,
              nextNode: null,
              flag: "martir_concluido"
            },
            {
              id: "formal_apology",
              label: "Emitir nota de desculpas protocolar para evitar a sanção",
              description: "A diretoria agradece o bom senso e o caixa fica intacto.",
              effects: { boardConfidence: 4, morale: -2, chemistry: 2 },
              delayDays: null,
              nextNode: null,
              flag: "retratacao_concluida"
            }
          ]
        },
        node_referee_respect: {
          id: "node_referee_respect",
          title: "O Respeito da Liga",
          situation: "A postura madura do clube ganha elogios nos canais esportivos e os próximos trios de arbitragem entram mais atentos nos seus jogos.",
          choices: [
            {
              id: "capitalise_respect",
              label: "Manter a frieza e focar estritamente nas jogadas de quadra",
              description: "Menos faltas cometidas e consistência exemplar nos jogos.",
              effects: { chemistry: 5, defense: 3, courtBoost: 2.5 },
              delayDays: null,
              nextNode: null,
              flag: "respeito_arbitragem_concluido"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 9: A REVOLUÇÃO TÁTICA (Análise de Dados vs Tradição)
    // -----------------------------------------------------------------------
    arc_tactical_revolution: {
      id: "arc_tactical_revolution",
      name: "A Revolução Tática",
      category: "tática",
      description: "O setor de inteligência propõe um sistema inovador para quebrar as defesas rivais.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Dossiê da Análise de Dados",
          situation: "O time de analistas desenvolveu um modelo estatístico que recomenda abandonar jogadas tradicionais e adotar padrões ultra-rápidos de posicionamento.",
          choices: [
            {
              id: "adopt_moneyball",
              label: "Adotar o novo sistema de imediato em 100% dos treinos",
              description: "Salto tático expressivo, com curva de adaptação inicial dos atletas.",
              effects: { playerDev: 4, chemistry: -2, courtBoost: 3.5, morale: 2 },
              delayDays: 3,
              nextNode: "node_data_evolution",
              requiresMatchResult: true,
              flag: "moneyball_adotado"
            },
            {
              id: "hybrid_system",
              label: "Implementação híbrida gradual respeitando o estilo atual",
              description: "Evolução segura sem causar estranhamento no elenco.",
              effects: { chemistry: 4, courtBoost: 2.0, playerDev: 2 },
              delayDays: 4,
              nextNode: "node_hybrid_success",
              requiresMatchResult: false,
              flag: "sistema_hibrido"
            },
            {
              id: "trust_feeling",
              label: "Rejeitar o dossiê: 'Esporte se decide com coração e leitura'",
              description: "Valorizar a intuição dos jogadores veteranos e sua liberdade.",
              effects: { morale: 6, chemistry: 5, courtBoost: 1.5, playerDev: -1 },
              delayDays: 4,
              nextNode: "node_feeling_victory",
              requiresMatchResult: false,
              flag: "intuição_mantida"
            }
          ]
        },
        node_data_evolution: {
          id: "node_data_evolution",
          title: "O Teste de Fogo Estatístico",
          situation: "Os adversários já começam a estudar suas novas movimentações. É hora de consolidar a identidade.",
          choices: [
            {
              id: "refine_tactics",
              label: "Aprimorar as variantes táticas para manter a imprevisibilidade",
              description: "A equipe se torna uma das mais difíceis de marcar da liga.",
              effects: { courtBoost: 4.0, playerDev: 4, chemistry: 4 },
              delayDays: null,
              nextNode: null,
              flag: "vanguarda_tatica_concluida"
            }
          ]
        },
        node_hybrid_success: {
          id: "node_hybrid_success",
          title: "O Equilíbrio Perfeito",
          situation: "A mistura de rigor estatístico com criatividade livre colocou a equipe em alta sintonia.",
          choices: [
            {
              id: "consolidate_playbook",
              label: "Oficializar o playbook definitivo para a fase de mata-mata",
              description: "Consistência e tranquilidade para os momentos de pressão máxima.",
              effects: { chemistry: 6, defense: 4, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "playbook_oficial_concluido"
            }
          ]
        },
        node_feeling_victory: {
          id: "node_feeling_victory",
          title: "A Alma da Quadra",
          situation: "Os atletas jogam com alegria e liberdade espontânea, contagiando as arquibancadas.",
          choices: [
            {
              id: "passion_identity",
              label: "Manter a confiança na garra dos jogadores até o apito final",
              description: "Time copeiro e temido nos momentos decisivos.",
              effects: { morale: 7, fanTrust: 6, courtBoost: 2.5 },
              delayDays: null,
              nextNode: null,
              flag: "paixao_quadra_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 10: O SACRIFÍCIO DO CRAQUE (Encruzilhada Médica)
    // -----------------------------------------------------------------------
    arc_injury_crisis_gamble: {
      id: "arc_injury_crisis_gamble",
      name: "O Sacrifício do Craque",
      category: "elenco",
      description: "O atleta mais decisivo sente dores e o departamento médico faz um alerta severo.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Alerta do Departamento Médico",
          situation: "O principal pontuador do elenco sentiu uma fisgada muscular às vésperas de uma rodada decisiva. O médico avisa: se jogar agora, pode sofrer uma lesão de meses; se for poupado, o time perde seu poder de fogo imediato.",
          choices: [
            {
              id: "infiltrate_and_play",
              label: "Infiltração médica e titularidade no sacrifício",
              description: "Força máxima em quadra assumindo o risco clínico extremo.",
              effects: { courtBoost: 5.0, morale: 4, chemistry: 1, fatigue: 12 },
              delayDays: 3,
              nextNode: "node_sacrifice_fallout",
              requiresMatchResult: true,
              flag: "craque_no_sacrificio"
            },
            {
              id: "protect_player_long_term",
              label: "Vetar categoricamente o atleta para garantir sua integridade",
              description: "Confiar no elenco coletivo e poupar a estrela para os playoffs.",
              effects: { courtBoost: -2.5, fatigue: -6, morale: 2, chemistry: 5 },
              delayDays: 3,
              nextNode: "node_team_steps_up",
              requiresMatchResult: true,
              flag: "craque_preservado"
            },
            {
              id: "emergency_bench_option",
              label: "Colocar no banco como arma secreta apenas se estiver perdendo",
              description: "Uso milimetricamente controlado apenas em situação de emergência.",
              effects: { courtBoost: 1.5, fatigue: 2, morale: 3 },
              delayDays: 3,
              nextNode: "node_clutch_gamble",
              requiresMatchResult: true,
              flag: "banco_estrategico"
            }
          ]
        },
        node_sacrifice_fallout: {
          id: "node_sacrifice_fallout",
          title: "O Sangue pela Camisa",
          situation: "O craque deixou tudo em quadra. A torcida o ovaciona de pé e o vestiário foi contagiado pelo exemplo de entrega.",
          choices: [
            {
              id: "honor_sacrifice",
              label: "Conceder descanso absoluto na semana de treinos seguinte",
              description: "Recuperação acelerada com o grupo motivado a retribuir o esforço.",
              effects: { morale: 8, chemistry: 6, fatigue: -8, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "sacrificio_honrado_concluido"
            }
          ]
        },
        node_team_steps_up: {
          id: "node_team_steps_up",
          title: "A Força do Coletivo",
          situation: "Sem o líder em quadra, os outros atletas dividiram as responsabilidades e mostraram maturidade surpreendente.",
          choices: [
            {
              id: "praise_collective",
              label: "Exaltar o crescimento do grupo: 'Não dependemos de ninguém'",
              description: "Autoestima coletiva fortalecida para o restante da campanha.",
              effects: { playerDev: 4, chemistry: 7, courtBoost: 3.5, morale: 6 },
              delayDays: null,
              nextNode: null,
              flag: "coletivo_afirmado_concluido"
            }
          ]
        },
        node_clutch_gamble: {
          id: "node_clutch_gamble",
          title: "A Arma no Banco",
          situation: "A estratégia de preservar a estrela deu fôlego e o time soube controlar o ritmo da partida.",
          choices: [
            {
              id: "steady_rotation",
              label: "Manter o elenco saudável para a grande decisão da temporada",
              description: "Equipe 100% inteira fisicamente na hora da verdade.",
              effects: { fatigue: -10, morale: 5, courtBoost: 2.5 },
              delayDays: null,
              nextNode: null,
              flag: "estrategia_medica_concluida"
            }
          ]
        }
      }
    }
  };

  // =========================================================================
  // MOTOR DE REDES DE DECISÕES
  // =========================================================================

  function initNarrativeState(gameState) {
    if (!gameState.narrativeState) {
      gameState.narrativeState = {
        activeArcs: [],
        completedArcs: [],
        scheduledEvents: [],
        storyFlags: {},
        decisionHistory: []
      };
    }
    return gameState.narrativeState;
  }

  // Identifica o arco inicial compatível com a Lore do clube
  function pickInitialArcForClub(club) {
    const loreId = String(club?.lore?.id || "").toLowerCase();
    const traits = String(club?.lore?.rosterProfile || club?.objective || "").toLowerCase();

    if (loreId.includes("last_dance") || loreId.includes("veteran")) return "arc_last_dance";
    if (loreId.includes("base") || loreId.includes("promessa") || traits.includes("young")) return "arc_wonderkid";
    if (loreId.includes("financeir") || loreId.includes("divida") || traits.includes("budget")) return "arc_financial_crisis";
    if (loreId.includes("artista") || loreId.includes("ego") || traits.includes("fast")) return "arc_rebel_star";
    return "arc_derby_rivalry";
  }

  // Inicia um arco no estado
  function startStoryArc(gameState, arcId) {
    const arc = STORY_ARCS[arcId];
    if (!arc) return null;
    const nState = initNarrativeState(gameState);

    // Evitar iniciar o mesmo arco duas vezes
    if (nState.activeArcs.some((a) => a.arcId === arcId) || nState.completedArcs.includes(arcId)) {
      return null;
    }

    const arcInstance = {
      arcId,
      name: arc.name,
      category: arc.category,
      currentNodeId: "node_1",
      startedDay: gameState.currentDay || 1,
      startedWeek: gameState.currentWeek || 1
    };

    nState.activeArcs.push(arcInstance);
    return arcInstance;
  }

  // Obtém a decisão ativa atual (se houver algum nó de arco pronto para ser decidido)
  function getActiveNarrativeDecision(gameState) {
    const nState = initNarrativeState(gameState);

    // Verificar primeiro se há eventos agendados que chegaram ao dia atual
    const dueIndex = nState.scheduledEvents.findIndex((ev) => Number(ev.triggerDay) <= Number(gameState.currentDay));
    if (dueIndex >= 0) {
      const scheduled = nState.scheduledEvents.splice(dueIndex, 1)[0];
      const arc = STORY_ARCS[scheduled.arcId];
      const node = arc?.nodes?.[scheduled.nodeId];
      if (node) {
        return formatDecisionForGame(gameState, arc, node);
      }
    }

    // Se não há agendado, verificar se o nó 1 de algum arco ativo ainda não foi tomado
    for (const active of nState.activeArcs) {
      const arc = STORY_ARCS[active.arcId];
      const node = arc?.nodes?.[active.currentNodeId];
      if (node && !active.decisionPendingId) {
        return formatDecisionForGame(gameState, arc, node);
      }
    }

    return null;
  }

  function formatDecisionForGame(gameState, arc, node) {
    const club = gameState.userTeam || {};
    return {
      id: `decision-${arc.id}-${node.id}-${gameState.currentDay}`,
      sourceDecisionId: `${arc.id}:${node.id}`,
      arcId: arc.id,
      nodeId: node.id,
      title: node.title,
      text: node.situation,
      lead: node.situation,
      urgency: node.urgency || "alta",
      choices: node.choices.map((c) => ({
        id: c.id,
        label: c.label,
        description: c.description,
        effectText: c.description,
        effects: c.effects,
        flag: c.flag,
        nextNode: c.nextNode,
        delayDays: c.delayDays,
        requiresMatchResult: c.requiresMatchResult
      }))
    };
  }

  // Aplica a escolha tomada na rede de decisões
  function resolveNarrativeChoice(gameState, decision, choiceId) {
    const choice = (decision.choices || []).find((c) => c.id === choiceId) || decision.choices?.[0];
    if (!choice) return null;

    const nState = initNarrativeState(gameState);
    const effects = choice.effects || {};

    // 1. Aplicar efeitos imediatos no GameState
    if (window.TemporadaTotal.GameState) {
      window.TemporadaTotal.GameState.applyTeamDeltas?.(gameState, {
        morale: effects.morale || 0,
        chemistry: effects.chemistry || 0,
        fatigue: effects.fatigue || 0
      });

      // Modificadores orçamentários
      if (effects.budget && gameState.summary) {
        gameState.summary.budgetLeft = (Number(gameState.summary.budgetLeft) || 0) + Number(effects.budget);
        if (gameState.userTeam) {
          gameState.userTeam.budget = (Number(gameState.userTeam.budget) || 20) + Number(effects.budget);
        }
      }

      // Modificador de força/quadra para as próximas partidas
      if (effects.courtBoost) {
        gameState.decisionMatchModifier = (Number(gameState.decisionMatchModifier) || 0) + Number(effects.courtBoost);
      }

      // Desenvolvimento de jogadores jovens
      if (effects.playerDev && gameState.roster) {
        const youngest = gameState.roster.filter((p) => Number(p.age || 25) <= 22).slice(0, 2);
        youngest.forEach((p) => {
          p.currentAbility = Math.min(99, (Number(p.currentAbility) || 70) + Number(effects.playerDev));
          p.potential = Math.max(p.potential || 80, p.currentAbility + 4);
        });
        gameState.summary = window.TemporadaTotal.GameState.summarizeTeam?.(gameState.roster, gameState.teamState) || gameState.summary;
      }
    }

    // 2. Gravar flag e histórico da rede
    if (choice.flag) {
      nState.storyFlags[choice.flag] = true;
    }

    nState.decisionHistory.unshift({
      arcId: decision.arcId,
      arcName: STORY_ARCS[decision.arcId]?.name || "Decisão",
      nodeId: decision.nodeId,
      title: decision.title,
      chosenLabel: choice.label,
      effectsSummary: choice.description,
      day: gameState.currentDay || 1,
      week: gameState.currentWeek || 1
    });

    // 3. Atualizar o arco ativo
    const arcInstance = nState.activeArcs.find((a) => a.arcId === decision.arcId);
    if (arcInstance) {
      if (choice.nextNode) {
        arcInstance.currentNodeId = choice.nextNode;
        const triggerDay = Number(gameState.currentDay || 1) + (Number(choice.delayDays) || 4);

        nState.scheduledEvents.push({
          arcId: decision.arcId,
          nodeId: choice.nextNode,
          triggerDay,
          requiresMatchResult: Boolean(choice.requiresMatchResult)
        });
      } else {
        // Arco concluído
        nState.activeArcs = nState.activeArcs.filter((a) => a.arcId !== decision.arcId);
        nState.completedArcs.push(decision.arcId);
      }
    }

    // Registrar no Log de Bastidores
    if (window.TemporadaTotal.GameState?.addLog) {
      window.TemporadaTotal.GameState.addLog(
        gameState,
        "narrative",
        `Decisão: ${decision.title}`,
        `Escolha tomada: "${choice.label}". Consequências aplicadas no vestiário e na quadra!`
      );
    }

    // Notificação e feedback sonoro
    if (window.TemporadaTotal.MinigamesEngine?.playArcadeSound) {
      window.TemporadaTotal.MinigamesEngine.playArcadeSound("good");
    }

    return {
      success: true,
      appliedChoice: choice,
      decision
    };
  }

  // Verifica e inicia novos arcos conforme a temporada progride
  function checkSeasonArcTriggers(gameState) {
    const nState = initNarrativeState(gameState);

    // Se já há um arco ativo no momento, não encavalar outro ao mesmo tempo
    if (nState.activeArcs.length > 0) return;

    const week = Number(gameState.currentWeek || 1);
    const completed = nState.completedArcs || [];

    // Semana 1: Iniciar arco de Lore inicial
    if (completed.length === 0) {
      const initialArcId = pickInitialArcForClub(gameState.userTeam);
      startStoryArc(gameState, initialArcId);
      return;
    }

    // Identificar rendimento do clube
    const standing = gameState.standings?.find((s) => s.teamId === gameState.userTeam?.id);
    const losses = standing ? Number(standing.losses || 0) : 0;
    const wins = standing ? Number(standing.wins || 0) : 0;

    // Disparadores dinâmicos baseados no momento do time:
    // 1. Crise recente após derrota ou sequência negativa -> Racha no Vestiário
    if (nState.storyFlags.last_match_loss && losses >= 2 && !completed.includes("arc_locker_room_split")) {
      startStoryArc(gameState, "arc_locker_room_split");
      return;
    }

    // 2. Boa fase e vitórias consecutivas -> Patrocínio Viral e Hype Comercial
    if (wins >= 2 && week >= 2 && !completed.includes("arc_viral_sponsorship")) {
      startStoryArc(gameState, "arc_viral_sponsorship");
      return;
    }

    // 3. Semana 2-3: Motim da Estrela ou Racha no Vestiário
    if (week >= 2 && !completed.includes("arc_rebel_star")) {
      startStoryArc(gameState, "arc_rebel_star");
      return;
    }
    if (week >= 3 && !completed.includes("arc_locker_room_split")) {
      startStoryArc(gameState, "arc_locker_room_split");
      return;
    }

    // 4. Semana 4: Polêmica de Arbitragem ou Dérbi Histórico
    if (week >= 4 && !completed.includes("arc_scandal_referee")) {
      startStoryArc(gameState, "arc_scandal_referee");
      return;
    }
    if (week >= 4 && !completed.includes("arc_derby_rivalry")) {
      startStoryArc(gameState, "arc_derby_rivalry");
      return;
    }

    // 5. Semana 5: Prodígio da Base ou Revolução Tática de Dados
    if (week >= 5 && !completed.includes("arc_wonderkid")) {
      startStoryArc(gameState, "arc_wonderkid");
      return;
    }
    if (week >= 5 && !completed.includes("arc_tactical_revolution")) {
      startStoryArc(gameState, "arc_tactical_revolution");
      return;
    }

    // 6. Semana 6-7: Reta Decisiva e Sacrifício do Craque (Lesão/Fadiga)
    if (week >= 6 && !completed.includes("arc_injury_crisis_gamble")) {
      startStoryArc(gameState, "arc_injury_crisis_gamble");
      return;
    }

    // 7. Semana 8+: Crise Financeira de Fim de Temporada ou O Último Baile
    if (week >= 8 && !completed.includes("arc_financial_crisis")) {
      startStoryArc(gameState, "arc_financial_crisis");
      return;
    }
    if (week >= 9 && !completed.includes("arc_last_dance")) {
      startStoryArc(gameState, "arc_last_dance");
      return;
    }
  }

  // Notifica a rede de decisões que uma partida foi disputada
  function onMatchCompleted(gameState, matchResult) {
    if (!gameState) return;
    const nState = initNarrativeState(gameState);
    const userWon = matchResult?.winnerId ? matchResult.winnerId === gameState.userTeam?.id : (Number(matchResult?.homeScore || 0) > Number(matchResult?.awayScore || 0));
    nState.lastMatchWon = userWon;

    // Se houver eventos agendados aguardando resultado de jogo, acelerar para o dia seguinte
    nState.scheduledEvents.forEach((ev) => {
      if (ev.requiresMatchResult) {
        ev.requiresMatchResult = false;
        ev.triggerDay = Math.min(ev.triggerDay, Number(gameState.currentDay || 1) + 1);
        ev.matchWon = userWon;
      }
    });

    if (userWon) {
      nState.storyFlags.last_match_win = true;
      delete nState.storyFlags.last_match_loss;
    } else {
      nState.storyFlags.last_match_loss = true;
      delete nState.storyFlags.last_match_win;
    }
  }

  // Renderiza a Árvore de Decisões e História para a nova aba do jogo
  function renderDecisionNetworkView(gameState) {
    const nState = initNarrativeState(gameState);
    const history = nState.decisionHistory || [];
    const active = nState.activeArcs || [];

    return `
      <section class="procedural-game-section story-network-view">
        <div class="story-network-hero">
          <div>
            <span class="eyebrow">Rede de Decisões • História da Carreira</span>
            <h2>Crônicas da Temporada</h2>
            <p>Cada resposta no vestiário molda os próximos capítulos. Veja as decisões que você tomou e os arcos que estão em andamento.</p>
          </div>
          <div class="story-network-stats">
            <div>
              <span>Arcos Ativos</span>
              <strong>${active.length}</strong>
            </div>
            <div>
              <span>Decisões Tomadas</span>
              <strong>${history.length}</strong>
            </div>
          </div>
        </div>

        ${gameState.pendingDecision ? `
          <div class="story-pending-alert-box">
            <div class="pending-alert-header">
              <span class="dilemma-tag">🚨 DILEMA EM ABERTO NO VESTIÁRIO</span>
              <span class="dilemma-date">Semana ${gameState.currentWeek || 1} • Dia ${gameState.currentDay || 1}</span>
            </div>
            <h3>${escapeHtml(gameState.pendingDecision.title)}</h3>
            <p>${escapeHtml(gameState.pendingDecision.text || "")}</p>
            <div class="dilemma-choices-container">
              ${(gameState.pendingDecision.choices || []).map((choice) => `
                <button class="dilemma-choice-card" data-decision-choice="${escapeHtml(choice.id)}" type="button">
                  <div class="choice-card-header">
                    <span class="choice-select-indicator">▶</span>
                    <strong>${escapeHtml(choice.label)}</strong>
                  </div>
                  <p class="choice-card-consequence">${escapeHtml(choice.effectText || choice.description || "")}</p>
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        ${active.length ? `
          <div class="story-active-arcs-card">
            <h3>⚡ Arcos Narrativos em Andamento</h3>
            <div class="active-arcs-list">
              ${active.map((a) => {
                const arcConfig = STORY_ARCS[a.arcId];
                return `
                  <article class="active-arc-chip">
                    <span class="arc-category-badge">${arcConfig?.category || "Trama"}</span>
                    <strong>${escapeHtml(arcConfig?.name || a.name)}</strong>
                    <p>${escapeHtml(arcConfig?.description || "Desenvolvendo desdobramentos...")}</p>
                  </article>
                `;
              }).join("")}
            </div>
          </div>
        ` : ""}

        <div class="story-timeline-section">
          <h3>Linha do Tempo das Suas Escolhas</h3>
          ${history.length ? `
            <div class="story-timeline-stream">
              ${history.map((item, idx) => `
                <div class="timeline-node-card">
                  <div class="node-marker">${history.length - idx}</div>
                  <div class="node-body">
                    <div class="node-head">
                      <span class="node-date">Semana ${item.week} • Dia ${item.day}</span>
                      <span class="node-arc-name">${escapeHtml(item.arcName)}</span>
                    </div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <div class="node-chosen">
                      <span>Sua Decisão:</span>
                      <strong>"${escapeHtml(item.chosenLabel)}"</strong>
                    </div>
                    <p class="node-effect">${escapeHtml(item.effectsSummary)}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : `
            <div class="timeline-empty-box">
              <span class="empty-icon">📖</span>
              <strong>A história está apenas começando</strong>
              <p>Avance os dias e responda aos dilemas do vestiário para construir a rede de decisões do seu clube.</p>
            </div>
          `}
        </div>
      </section>
    `;
  }

  namespace.DecisionNetworkEngine = {
    STORY_ARCS,
    initNarrativeState,
    startStoryArc,
    getActiveNarrativeDecision,
    resolveNarrativeChoice,
    checkSeasonArcTriggers,
    onMatchCompleted,
    renderDecisionNetworkView
  };
})();
