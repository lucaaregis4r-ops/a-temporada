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
    },

    // -----------------------------------------------------------------------
    // ARCO 11: O MOTIM DA FAIXA (Liderança vs Estrelato)
    // -----------------------------------------------------------------------
    arc_captain_mutiny: {
      id: "arc_captain_mutiny",
      name: "O Motim da Faixa",
      category: "elenco",
      description: "O capitão histórico entra em rota de colisão com a nova estrela contratada.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Choque de Lideranças",
          situation: "O capitão mais antigo e identificado do clube pede uma reunião de portas fechadas. Ele reclama que a principal contratação da temporada não cumpre as regras do vestiário e exige privilégios táticos. 'Ou você cobra ele com o mesmo rigor, ou o grupo racha.'",
          choices: [
            {
              id: "back_captain",
              label: "Bancar a liderança do capitão e enquadrar a estrela",
              description: "A tradição e a hierarquia do vestiário prevalecem. A química sobe, mas a estrela fica emburrada.",
              effects: { chemistry: 6, morale: 2, courtBoost: 1.5, boardPressure: 2 },
              delayDays: 4,
              nextNode: "node_captain_empowered",
              requiresMatchResult: false,
              flag: "capitao_prestigiado"
            },
            {
              id: "back_star",
              label: "Dar respaldo à estrela: 'O talento vence jogos'",
              description: "Priorizar o desequilíbrio técnico individual. Mais força em quadra, mas o capitão ameaça pedir rescisão.",
              effects: { courtBoost: 4.0, morale: 3, chemistry: -6 },
              delayDays: 4,
              nextNode: "node_star_empowered",
              requiresMatchResult: true,
              flag: "estrela_protegida"
            },
            {
              id: "open_dialogue",
              label: "Chamar os dois para um almoço de conciliação a portas fechadas",
              description: "Diplomacia pura para alinhar o ego da estrela com o respeito ao capitão.",
              effects: { chemistry: 4, morale: 5, courtBoost: 2.0 },
              delayDays: 5,
              nextNode: "node_united_leadership",
              requiresMatchResult: false,
              flag: "conciliacao_fechada"
            }
          ]
        },
        node_captain_empowered: {
          id: "node_captain_empowered",
          title: "A Resposta do Capitão",
          situation: "Com autoridade renovada, o capitão comanda os treinos com intensidade militar. O grupo fecha com ele e a disciplina salta aos olhos.",
          choices: [
            {
              id: "cement_discipline",
              label: "Consolidar a cartilha rígida para todo o elenco",
              description: "Vestiário blindado e foco coletivo inabalável.",
              effects: { chemistry: 8, courtBoost: 3.0, fanTrust: 6 },
              delayDays: null,
              nextNode: null,
              flag: "disciplina_restaurada"
            }
          ]
        },
        node_star_empowered: {
          id: "node_star_empowered",
          title: "O Show Solo da Estrela",
          situation: "Sentindo-se dono do time, o craque assume todas as bolas decisivas da partida seguinte com requintes de gênio e desdém pelos críticos.",
          choices: [
            {
              id: "ride_the_wave",
              label: "Deixar o craque livre como líder técnico absoluto",
              description: "Se ele decidir jogos, o resultado abafa qualquer atrito do vestiário.",
              effects: { courtBoost: 4.5, morale: 6, boardPressure: -3 },
              delayDays: null,
              nextNode: null,
              flag: "era_da_estrela"
            }
          ]
        },
        node_united_leadership: {
          id: "node_united_leadership",
          title: "A Dupla Imbatível",
          situation: "A conversa franca surtiu efeito. Capitão e estrela comemoram pontos juntos e criam uma conexão explosiva em quadra.",
          choices: [
            {
              id: "celebrate_harmony",
              label: "Celebrar a sinergia e mirar o topo da tabela",
              description: "O ambiente perfeito para buscar os grandes objetivos do ano.",
              effects: { chemistry: 10, morale: 8, courtBoost: 4.0 },
              delayDays: null,
              nextNode: null,
              flag: "harmonia_perfeita"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 12: O CADERNO VAZADO (Tática & Espionagem)
    // -----------------------------------------------------------------------
    arc_secret_scout_leak: {
      id: "arc_secret_scout_leak",
      name: "O Caderno Vazado",
      category: "tatica",
      description: "Um relatório de scout confidencial do clube vaza e expõe seus pontos fracos.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "Planilhas Secretas na Rede",
          situation: "Um ex-integrante da comissão técnica vazou em redes sociais as jogadas ensaiadas, mapas de calor e os pontos fracos dos seus titulares. Os técnicos rivais já baixaram o material para anular seus esquemas na rodada que vem.",
          choices: [
            {
              id: "radical_overhaul",
              label: "Mudar radicalmente as jogadas ensaiadas em treinos fechados",
              description: "Enganar os rivais com esquemas inéditos. Exige muito dos jogadores e cansa as pernas, mas gera fator surpresa.",
              effects: { courtBoost: 4.0, fatigue: 8, chemistry: -2 },
              delayDays: 4,
              nextNode: "node_tactical_ambush",
              requiresMatchResult: true,
              flag: "esquema_reinventado"
            },
            {
              id: "double_down",
              label: "Manter o plano com convicção: 'Eles sabem o que fazemos, mas não como parar'",
              description: "Confiar na excelência da execução. O time treina com brio e raiva para provar superioridade.",
              effects: { morale: 6, chemistry: 4, courtBoost: 2.0 },
              delayDays: 4,
              nextNode: "node_defiant_victory",
              requiresMatchResult: true,
              flag: "conviccao_inabalavel"
            }
          ]
        },
        node_tactical_ambush: {
          id: "node_tactical_ambush",
          title: "A Emboscada Tática",
          situation: "O adversário se preparou para o plano antigo e foi pego totalmente de surpresa pela nova dinâmica tática da sua equipe.",
          choices: [
            {
              id: "masterclass_praise",
              label: "Consolidar o novo playbook e registrar a vitória na prancheta",
              description: "A flexibilidade tática vira a grande marca registrada do clube.",
              effects: { courtBoost: 3.5, morale: 5, fanTrust: 6 },
              delayDays: null,
              nextNode: null,
              flag: "genio_tatico_concluido"
            }
          ]
        },
        node_defiant_victory: {
          id: "node_defiant_victory",
          title: "A Prova do Talento",
          situation: "Mesmo com o adversário antecipando movimentações, seus jogadores superaram a marcação na qualidade técnica e no suor.",
          choices: [
            {
              id: "proud_postgame",
              label: "Exaltar o vestiário na coletiva: 'Nossa força é imparável'",
              description: "Autoestima máxima no grupo para os jogos seguintes.",
              effects: { morale: 8, chemistry: 6, fanTrust: 8 },
              delayDays: null,
              nextNode: null,
              flag: "superacao_tatica_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 13: A FÚRIA DAS ARQUIBANCADAS (Torcida & Pressão)
    // -----------------------------------------------------------------------
    arc_superfan_pressure: {
      id: "arc_superfan_pressure",
      name: "A Fúria das Arquibancadas",
      category: "torcida",
      description: "A principal torcida organizada exige cobrança olho no olho após oscilações.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "Portões Fechados no CT",
          situation: "Cinquenta integrantes da organizada mais tradicional bloqueiam a entrada do centro de treinamento com batuques e faixas: 'Queremos raça ou o bicho vai pegar'. O presidente pede cautela, mas os torcedores exigem falar com você e o capitão.",
          choices: [
            {
              id: "open_gates_dialogue",
              label: "Abrir os portões e falar de peito aberto com os torcedores",
              description: "Mostrar respeito à paixão da arquibancada e pedir pacto de apoio na próxima rodada.",
              effects: { fanTrust: 10, morale: 4, chemistry: 3 },
              delayDays: 4,
              nextNode: "node_fan_alliance",
              requiresMatchResult: true,
              flag: "pacto_com_torcida"
            },
            {
              id: "call_security_shield",
              label: "Blindar o elenco, acionar a segurança e treinar em sigilo",
              description: "Proteger os atletas de ameaças. O grupo se une pelo sentimento de cerco e defesa mútua.",
              effects: { chemistry: 7, fanTrust: -8, courtBoost: 2.5 },
              delayDays: 4,
              nextNode: "node_bunker_resolve",
              requiresMatchResult: true,
              flag: "elenco_blindado"
            }
          ]
        },
        node_fan_alliance: {
          id: "node_fan_alliance",
          title: "O Caldeirão Inflamado",
          situation: "A torcida comprou o discurso do treinador. No ginásio, o apoio é ensurdecedor do primeiro ao último minuto, empurrando o time.",
          choices: [
            {
              id: "embrace_the_roar",
              label: "Agradecer à galera e transformar o ginásio num alçapão",
              description: "Fator casa implacável para o resto da temporada.",
              effects: { fanTrust: 12, courtBoost: 4.0, morale: 6 },
              delayDays: null,
              nextNode: null,
              flag: "caldeirao_concluido"
            }
          ]
        },
        node_bunker_resolve: {
          id: "node_bunker_resolve",
          title: "Nós Contra o Mundo",
          situation: "Isolados das vaias externas, os jogadores formaram um pacto silencioso de vestiário e comemoram cada jogada com raiva e sangue nos olhos.",
          choices: [
            {
              id: "silence_the_critics",
              label: "Manter o pacto blindado: 'Apenas nós sabemos o que passamos'",
              description: "Resiliência psicológica absurda nos momentos de aperto.",
              effects: { chemistry: 9, courtBoost: 3.5, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "bunker_concluido"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 14: A PROPOSTA INTERNACIONAL (Finanças & Mercado)
    // -----------------------------------------------------------------------
    arc_foreign_investor: {
      id: "arc_foreign_investor",
      name: "A Proposta Internacional",
      category: "financas",
      description: "Um fundo internacional oferece milhões em troca de concessões comerciais e táticas.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "A Maleta de Dólares",
          situation: "Executivos de um conglomerado esportivo internacional chegam com uma proposta oficial: $8M de investimento imediato no caixa do clube, em troca de amistosos de marketing no exterior e inclusão de um jovem atleta indicado por eles na rotação titular.",
          choices: [
            {
              id: "accept_investment",
              label: "Aceitar a injeção de capital e integrar o reforço indicado",
              description: "Cofres cheios e tranquilidade financeira. O vestiário estranha a imposição, mas o clube ganha poder de mercado.",
              effects: { budget: 8, boardPressure: -4, chemistry: -4, playerDev: 2 },
              delayDays: 5,
              nextNode: "node_investor_expansion",
              requiresMatchResult: false,
              flag: "investimento_estrangeiro_aceito"
            },
            {
              id: "refuse_for_autonomy",
              label: "Recusar a proposta: 'Nenhum investidor escala o meu time'",
              description: "Proteger a meritocracia e a soberania do técnico. O elenco aplaude a postura firme.",
              effects: { chemistry: 8, morale: 6, courtBoost: 2.0, fanTrust: 6 },
              delayDays: 5,
              nextNode: "node_sovereign_identity",
              requiresMatchResult: false,
              flag: "autonomia_bancada"
            }
          ]
        },
        node_investor_expansion: {
          id: "node_investor_expansion",
          title: "A Marca Global",
          situation: "Com os $8M em caixa, a diretoria modernizou a academia e contratou analistas de elite. O clube agora respira ar de gigante internacional.",
          choices: [
            {
              id: "reinvest_in_squad",
              label: "Aplicar fundos em estrutura de recuperação física e tecnologia",
              description: "Acelerar a evolução dos atletas e reduzir a fadiga do elenco.",
              effects: { fatigue: -10, playerDev: 4, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "modernizacao_concluida"
            }
          ]
        },
        node_sovereign_identity: {
          id: "node_sovereign_identity",
          title: "O Respeito à Camisa",
          situation: "A recusa ganhou as manchetes locais como um ato de coragem e lealdade às raízes do clube. Os sócios celebram a dignidade da comissão técnica.",
          choices: [
            {
              id: "harness_pride",
              label: "Usar o orgulho da comunidade como força motriz da equipe",
              description: "União total entre arquibancada, diretoria e elenco.",
              effects: { fanTrust: 10, morale: 8, courtBoost: 3.5 },
              delayDays: null,
              nextNode: null,
              flag: "soberania_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 15: A MURALHA DE AÇO (Tática & Identidade)
    // -----------------------------------------------------------------------
    arc_iron_defense: {
      id: "arc_iron_defense",
      name: "A Muralha de Aço",
      category: "tatica",
      description: "A comissão técnica propõe adotar o sistema mais impiedoso e defensivo do campeonato.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Cadeado Defensivo",
          situation: "Diante do poderio ofensivo dos concorrentes, seu auxiliar traz uma proposta audaciosa: abandonar o jogo bonito e transformar o clube em uma máquina de sufocar adversários, com dobras agressivas e ritmo travado. Os alas temem perder números individuais.",
          choices: [
            {
              id: "implement_iron_curtain",
              label: "Impor a 'Muralha de Aço': 'Aqui ninguém faz cesta fácil'",
              description: "Foco absoluto em defesa física e desgastante. Exige sacrifício e gera cansaço, mas tranca o placar.",
              effects: { courtBoost: 4.5, fatigue: 8, morale: 1, chemistry: 2 },
              delayDays: 4,
              nextNode: "node_fortress_proven",
              requiresMatchResult: true,
              flag: "muralha_adotada"
            },
            {
              id: "balanced_transition",
              label: "Preferir transição veloz e liberdade criativa no ataque",
              description: "Manter o ataque fluido com arremessos livres e moral elevada dos artilheiros.",
              effects: { morale: 6, chemistry: 4, courtBoost: 2.0 },
              delayDays: 4,
              nextNode: "node_offensive_spark",
              requiresMatchResult: true,
              flag: "ataque_livre"
            }
          ]
        },
        node_fortress_proven: {
          id: "node_fortress_proven",
          title: "O Pavor dos Rivais",
          situation: "Os adversários saem de quadra exaustos e desorientados pela sua marcação sufocante. A liga reconhece seu clube como o mais indigesto de enfrentar.",
          choices: [
            {
              id: "cement_defense",
              label: "Consagrar a identidade: 'Campeonatos se vencem na defesa'",
              description: "Eficiência defensiva que garante consistência em qualquer quadra.",
              effects: { courtBoost: 4.0, fanTrust: 6, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "muralha_consagrada"
            }
          ]
        },
        node_offensive_spark: {
          id: "node_offensive_spark",
          title: "O Fogo Ofensivo",
          situation: "O time joga leve, solto e com placares altos. A torcida se encanta com a velocidade e os lances plásticos das vitórias.",
          choices: [
            {
              id: "enjoy_firepower",
              label: "Confiar na pontaria e no talento dos finalizadores",
              description: "Moral nas nuvens e confiança plena dos pontuadores.",
              effects: { morale: 8, courtBoost: 3.5, fanTrust: 8 },
              delayDays: null,
              nextNode: null,
              flag: "fogo_ofensivo_concluido"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 16: A NOITE MÁGICA DO CALOURO (Base & Revelação)
    // -----------------------------------------------------------------------
    arc_rookie_breakout: {
      id: "arc_rookie_breakout",
      name: "A Noite Mágica do Calouro",
      category: "base",
      description: "Um reserva esquecido entra no sufoco e faz a partida da vida, incendiando a torcida.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "A Estrela da Madrugada",
          situation: "Com titulares apagados no último quarto, você colocou um calouro jovem da ponta do banco. Em seis minutos, o garoto meteu bolas improváveis, roubou bolas e incendiou a arena. O ginásio gritou seu nome e os jornais estampam sua foto exigindo titularidade já.",
          choices: [
            {
              id: "promote_to_starter",
              label: "Efetivar o jovem calouro no quinteto titular da próxima rodada",
              description: "Apostar no calor do momento e no talento bruto. O titular veterano vai para o banco insatisfeito.",
              effects: { playerDev: 6, courtBoost: 3.5, chemistry: -3, morale: 4 },
              delayDays: 4,
              nextNode: "node_rookie_pressure",
              requiresMatchResult: true,
              flag: "calouro_titular"
            },
            {
              id: "protect_and_mentor",
              label: "Manter como arma secreta do banco e blindar contra a euforia",
              description: "Não pular etapas. O veterano mantém a titularidade e acolhe o garoto como mentor.",
              effects: { chemistry: 6, playerDev: 3, morale: 3, courtBoost: 2.0 },
              delayDays: 4,
              nextNode: "node_balanced_growth",
              requiresMatchResult: false,
              flag: "calouro_lapidado"
            }
          ]
        },
        node_rookie_pressure: {
          id: "node_rookie_pressure",
          title: "O Teste de Fogo",
          situation: "Com as luzes da imprensa apontadas para ele, o calouro confirmou que tem personalidade de sobra e correspondeu em quadra com jogadas decisivas.",
          choices: [
            {
              id: "crown_new_star",
              label: "Declarar o nascimento de uma nova jóia da liga",
              description: "O valor de mercado e a confiança do garoto vão às alturas.",
              effects: { playerDev: 6, morale: 7, courtBoost: 3.5, fanTrust: 8 },
              delayDays: null,
              nextNode: null,
              flag: "calouro_consagrado"
            }
          ]
        },
        node_balanced_growth: {
          id: "node_balanced_growth",
          title: "A Rotação Perfeita",
          situation: "Saindo do banco no momento certo, o calouro vira o 6º homem mais temido da competição, mudando o ritmo de qualquer partida.",
          choices: [
            {
              id: "lethal_sixth_man",
              label: "Elogiar a maturidade do grupo e a força do banco de reservas",
              description: "Elenco profundo e sem vaidades, pronto para jogos longos.",
              effects: { chemistry: 8, courtBoost: 3.5, morale: 6 },
              delayDays: null,
              nextNode: null,
              flag: "sexto_homem_concluido"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 17: O CHÃO SAGRADO EM OBRAS (Estrutura & Clube)
    // -----------------------------------------------------------------------
    arc_stadium_renovation: {
      id: "arc_stadium_renovation",
      name: "O Chão Sagrado em Obras",
      category: "infraestrutura",
      description: "Problemas no piso e refletores do ginásio ameaçam interdição da casa do clube.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "A Interdição da Quadra",
          situation: "Uma vistoria técnica da liga apontou infiltrações e desníveis no piso da sua arena. O laudo é direto: ou o clube investe $2.5M em reformas urgentes nos próximos dias, ou terá que viajar centenas de quilômetros para jogar em uma arena neutra e fria.",
          choices: [
            {
              id: "pay_for_renovation",
              label: "Aprovar reforma de emergência do próprio bolso do clube ($2.5M)",
              description: "Gastar do caixa para proteger o santuário da torcida e garantir jogos em casa.",
              effects: { budget: -2.5, fanTrust: 8, courtBoost: 3.0, morale: 3 },
              delayDays: 5,
              nextNode: "node_reopened_temple",
              requiresMatchResult: false,
              flag: "reforma_bancada"
            },
            {
              id: "play_on_road",
              label: "Mandar jogos em arena neutra e economizar o dinheiro",
              description: "Preservar o saldo bancário, mas aceitar desgaste de viagens e perda do calor da torcida.",
              effects: { budget: 1.0, fatigue: 6, fanTrust: -6, courtBoost: -2.0 },
              delayDays: 5,
              nextNode: "node_nomad_grit",
              requiresMatchResult: true,
              flag: "temporada_nomade"
            }
          ]
        },
        node_reopened_temple: {
          id: "node_reopened_temple",
          title: "A Reinauguração Épica",
          situation: "O piso novo ficou impecável e a acústica do ginásio virou uma panela de pressão. A torcida lotou a reabertura em festa memorável.",
          choices: [
            {
              id: "celebrate_home_fortress",
              label: "Comemorar o mando intacto: 'Aqui dentro mandamos nós'",
              description: "Energia vibrante que intimida qualquer visitante.",
              effects: { courtBoost: 4.0, fanTrust: 10, morale: 6 },
              delayDays: null,
              nextNode: null,
              flag: "templo_restaurado"
            }
          ]
        },
        node_nomad_grit: {
          id: "node_nomad_grit",
          title: "Os Guerreiros da Estrada",
          situation: "Jogando sempre fora de casa, o elenco desenvolveu uma casca grossa incomparável, comemorando vitórias na casa do adversário.",
          choices: [
            {
              id: "praise_road_mentality",
              label: "Exaltar o espírito guerreiro: 'Ganhamos em qualquer chão'",
              description: "Frieza psicológica impressionante para partidas decisivas.",
              effects: { chemistry: 7, courtBoost: 3.0, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "guerreiros_estrada_concluido"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 18: O PODCAST DA DISCÓRDIA (Imprensa & Redes)
    // -----------------------------------------------------------------------
    arc_media_circus: {
      id: "arc_media_circus",
      name: "O Podcast da Discórdia",
      category: "imprensa",
      description: "Um titular influente fala pelos cotovelos em um programa ao vivo e expõe o vestiário.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "Microfone Aberto, Crise Aberta",
          situation: "Sem consultar a assessoria, um dos principais jogadores foi a um podcast famoso e soltou o verbo: criticou a intensidade dos treinos, alfinetou colegas de equipe e debochou do próximo adversário. Os cortes explodiram nas redes e o vestiário está fervendo.",
          choices: [
            {
              id: "heavy_fine_and_retract",
              label: "Multar o atleta em 20% do salário e exigir retratação pública",
              description: "Demonstrar disciplina inegociável. O vestiário aplaude a firmeza, embora o atleta fique de cara feia.",
              effects: { chemistry: 6, morale: -2, budget: 0.8, boardPressure: -2 },
              delayDays: 4,
              nextNode: "node_discipline_reinforced",
              requiresMatchResult: false,
              flag: "multa_aplicada"
            },
            {
              id: "fuel_the_hype",
              label: "Abraçar a polêmica: 'Ele falou o que pensa, agora sustentem na bola'",
              description: "Transformar a arrogância em postura competitiva agressiva. Time entra pilhado para provar o deboche.",
              effects: { courtBoost: 4.0, morale: 5, fanTrust: -4, chemistry: -2 },
              delayDays: 4,
              nextNode: "node_swagger_response",
              requiresMatchResult: true,
              flag: "polemica_como_combustivel"
            }
          ]
        },
        node_discipline_reinforced: {
          id: "node_discipline_reinforced",
          title: "A Retratação no Vestiário",
          situation: "O jogador pediu desculpas olhando nos olhos de cada companheiro e treinou com seriedade exemplar para se redimir.",
          choices: [
            {
              id: "close_ranks",
              label: "Virar a página e focar na bola em quadra",
              description: "O episódio serviu de lição e fortaleceu o respeito mútuo.",
              effects: { chemistry: 8, morale: 6, courtBoost: 2.5 },
              delayDays: null,
              nextNode: null,
              flag: "disciplina_vencedora"
            }
          ]
        },
        node_swagger_response: {
          id: "node_swagger_response",
          title: "A Resposta no Placar",
          situation: "Sob vaias ferozes da torcida adversária, o time bancou as provocações e atropelou em quadra com uma atuação intimidadora.",
          choices: [
            {
              id: "enjoy_the_villain_role",
              label: "Adotar o papel de vilões temidos da temporada",
              description: "A confiança desmedida vira um escudo psicológico potente.",
              effects: { courtBoost: 4.5, morale: 8, fanTrust: 4 },
              delayDays: null,
              nextNode: null,
              flag: "viloes_consagrados"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 19: O MÉTODO DE ALTA PERFORMANCE (Fisiologia & Carga)
    // -----------------------------------------------------------------------
    arc_fitness_revolution: {
      id: "arc_fitness_revolution",
      name: "O Método de Alta Performance",
      category: "fisiologia",
      description: "Uma nova metodologia de recuperação física e monitoramento biológico é apresentada ao clube.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "A Revolução do Sono e da Carga",
          situation: "O novo chefe da preparação física traz uma metodologia internacional: rastreadores de sono, banheiras de gelo obrigatórias e controle calórico rígido. Parte dos atletas tradicionais acha um exagero invasivo, mas os dados prometem regeneração muscular recorde.",
          choices: [
            {
              id: "full_protocol_adoption",
              label: "Adotar o protocolo 100% de forma mandatória para todos",
              description: "Fadiga reduz drasticamente e as pernas voam em quadra, apesar do resmungo inicial dos atletas.",
              effects: { fatigue: -14, playerDev: 3, morale: -1, chemistry: 2 },
              delayDays: 5,
              nextNode: "node_peak_engine",
              requiresMatchResult: false,
              flag: "protocolo_rigido_adotado"
            },
            {
              id: "flexible_protocol",
              label: "Tornar facultativo e adaptar conforme o conforto de cada jogador",
              description: "Respeitar a individualidade e manter o vestiário leve e sorridente.",
              effects: { morale: 6, chemistry: 5, fatigue: -5 },
              delayDays: 5,
              nextNode: "node_happy_harmony",
              requiresMatchResult: false,
              flag: "protocolo_flexivel"
            }
          ]
        },
        node_peak_engine: {
          id: "node_peak_engine",
          title: "O Fôlego Interminável",
          situation: "Na reta final dos jogos, enquanto os rivais estão com a língua de fora, seu time corre a quadra inteira com intensidade de primeiro minuto.",
          choices: [
            {
              id: "outrun_everyone",
              label: "Aproveitar a superioridade atlética na velocidade",
              description: "Vantagem física decisiva nos minutos cruciais.",
              effects: { courtBoost: 4.0, fatigue: -8, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "maquina_fisica_concluida"
            }
          ]
        },
        node_happy_harmony: {
          id: "node_happy_harmony",
          title: "O Clima Descontraído",
          situation: "Sem cobranças invasivas, os jogadores vêm treinar com alegria contagiante e a química entre os atletas salta aos olhos.",
          choices: [
            {
              id: "flow_with_joy",
              label: "Celebrar a leveza do grupo rumo às vitórias",
              description: "Vestiário feliz joga mais solto e decide nos momentos de aperto.",
              effects: { chemistry: 8, morale: 8, courtBoost: 3.0 },
              delayDays: null,
              nextNode: null,
              flag: "harmonia_fisica_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 20: A CORRENTE DA VIRADA (Empatia & Comunidade)
    // -----------------------------------------------------------------------
    arc_miracle_run: {
      id: "arc_miracle_run",
      name: "A Corrente da Virada",
      category: "empatia",
      description: "A história de superação do time comove a cidade e atrai atenção nacional.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Xodó do Campeonato",
          situation: "A entrega heroica do elenco em quadra virou símbolo de esperança para a comunidade local. Uma grande emissora quer produzir uma reportagem especial de meia hora sobre o clube e acompanhar a rotina dos atletas dentro e fora do ginásio.",
          choices: [
            {
              id: "open_doors_fame",
              label: "Abrir o clube para a imprensa e abraçar o carinho da cidade",
              description: "Apoio popular espetacular e atração de novos patrocínios (+ $3M), mas com pequenas distrações nos treinos.",
              effects: { fanTrust: 12, budget: 3, morale: 5, courtBoost: -1.0 },
              delayDays: 5,
              nextNode: "node_beloved_champions",
              requiresMatchResult: true,
              flag: "time_do_povo_aberto"
            },
            {
              id: "stay_focused_modest",
              label: "Agradecer o carinho mas fechar o foco: 'Primeiro a taça, depois o show'",
              description: "Evitar qualquer desvio de foco. Concentração cirúrgica para a competição.",
              effects: { courtBoost: 3.5, chemistry: 7, morale: 4 },
              delayDays: 5,
              nextNode: "node_silent_assassins",
              requiresMatchResult: true,
              flag: "foco_cirurgico"
            }
          ]
        },
        node_beloved_champions: {
          id: "node_beloved_champions",
          title: "A Onda de Amor Popular",
          situation: "As crianças da cidade usam a camisa do seu clube nas escolas e a arquibancada canta sem parar o hino do time durante as partidas.",
          choices: [
            {
              id: "ride_community_energy",
              label: "Jogar pela cidade e retribuir o carinho em quadra",
              description: "Motivação transcendental que supera qualquer cansaço.",
              effects: { fanTrust: 14, morale: 8, courtBoost: 4.0 },
              delayDays: null,
              nextNode: null,
              flag: "onda_popular_concluida"
            }
          ]
        },
        node_silent_assassins: {
          id: "node_silent_assassins",
          title: "A Eficiência Silenciosa",
          situation: "Longe dos holofotes e bajulações, o time treinou com frieza impecável e executou cada jogada com precisão milimétrica.",
          choices: [
            {
              id: "pure_professionalism",
              label: "Manter a postura implacável e profissional",
              description: "Foco puro em vitórias sem espaço para deslizes.",
              effects: { courtBoost: 4.5, chemistry: 8, morale: 5 },
              delayDays: null,
              nextNode: null,
              flag: "eficiencia_silenciosa_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 21: A CHANTAGEM DO EMPRESÁRIO (Mercado & Bastidores)
    // -----------------------------------------------------------------------
    arc_contract_blackmail: {
      id: "arc_contract_blackmail",
      name: "A Chantagem do Empresário",
      category: "mercado",
      description: "Um agente influente ameaça forçar a saída de um titular chave no meio da temporada.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Ultimato do Agente",
          situation: "O empresário do titular mais valorizado do seu elenco procura a diretoria com uma proposta de um clube rival: 'Ou renovam agora com aumento de $2M e cláusula facilitada, ou meu atleta vai entrar desmotivado na rodada decisiva para preservar o físico.'",
          choices: [
            {
              id: "pay_the_ransom",
              label: "Ceder ao pedido e garantir o atleta comprometido em quadra ($2M)",
              description: "Gastar do orçamento para não perder a força esportiva imediata no momento chave.",
              effects: { budget: -2, courtBoost: 3.5, morale: 2, boardPressure: 2 },
              delayDays: 4,
              nextNode: "node_money_settled",
              requiresMatchResult: true,
              flag: "chantagem_paga"
            },
            {
              id: "bench_and_stand_firm",
              label: "Bancar a autoridade: 'Quem chantageia o clube vai sentar no banco'",
              description: "Mandar um recado inegociável de respeito ao clube. Promover um reserva guerreiro e peitar o empresário.",
              effects: { chemistry: 8, morale: 4, courtBoost: -1.0, playerDev: 3 },
              delayDays: 4,
              nextNode: "node_moral_victory",
              requiresMatchResult: true,
              flag: "autoridade_bancada"
            }
          ]
        },
        node_money_settled: {
          id: "node_money_settled",
          title: "O Retorno em Cestas",
          situation: "Com os bolsos cheios e a renovação assinada, o atleta entrou focado e desequilibrou a rodada com números maiúsculos.",
          choices: [
            {
              id: "demand_trophy",
              label: "Cobrar a taça em troca do investimento feito",
              description: "A obrigação agora é entregar o troféu no final da temporada.",
              effects: { courtBoost: 4.0, morale: 6 },
              delayDays: null,
              nextNode: null,
              flag: "retorno_pago_concluido"
            }
          ]
        },
        node_moral_victory: {
          id: "node_moral_victory",
          title: "A Vitória da Dignidade",
          situation: "O reserva escalado no lugar da estrela jogou com uma garra comovente e o vestiário aplaudiu a coragem do treinador de pé.",
          choices: [
            {
              id: "honor_over_stars",
              label: "Consolidar a união do grupo: 'Aqui a camisa é maior que qualquer nome'",
              description: "Entrosamento e química lendários no vestiário.",
              effects: { chemistry: 10, morale: 8, courtBoost: 3.5, fanTrust: 8 },
              delayDays: null,
              nextNode: null,
              flag: "dignidade_vencedora_concluida"
            }
          ]
        }
      }
    },

    // -----------------------------------------------------------------------
    // ARCO 22: A SOMBRA DO CARRASCO (Psicológico & Tabu)
    // -----------------------------------------------------------------------
    arc_taboo_nemesis: {
      id: "arc_taboo_nemesis",
      name: "A Sombra do Carrasco",
      category: "psicologico",
      description: "O confronto contra o adversário que é o pesadelo histórico do clube se aproxima.",
      nodes: {
        node_1: {
          id: "node_1",
          title: "O Fantasma do Tabu",
          situation: "O próximo duelo no calendário é contra o maior carrasco da história recente do clube: o time que venceu os últimos seis confrontos diretos e eliminou vocês em temporadas passadas. A imprensa traz estatísticas humilhantes e o vestiário sente a pressão invisível.",
          choices: [
            {
              id: "psychological_reset",
              label: "Contratar sessão especial de psicologia esportiva e foco no presente",
              description: "Trabalhar a mente dos atletas, quebrar traumas do passado e encarar o jogo como página em branco.",
              effects: { morale: 6, chemistry: 5, courtBoost: 3.0, budget: -0.5 },
              delayDays: 4,
              nextNode: "node_taboo_broken",
              requiresMatchResult: true,
              flag: "preparo_mental_feito"
            },
            {
              id: "war_mentality",
              label: "Treino de fúria e indignação: 'Vamos quebrar esse tabu no dente!'",
              description: "Pilha emocional no limite. Agressividade total nos duelos corpo a corpo em quadra.",
              effects: { courtBoost: 4.5, fatigue: 6, chemistry: 2 },
              delayDays: 4,
              nextNode: "node_grudge_battle",
              requiresMatchResult: true,
              flag: "furia_ativada"
            }
          ]
        },
        node_taboo_broken: {
          id: "node_taboo_broken",
          title: "O Fim da Maldição",
          situation: "Com frieza e inteligência emocional, a equipe jogou com serenidade e liquidou o carrasco, exorcizando os fantasmas históricos.",
          choices: [
            {
              id: "soar_to_glory",
              label: "Comemorar a quebra do tabu e liberar o potencial para o título",
              description: "Sem o peso do passado nos ombros, o time ganha asas na competição.",
              effects: { morale: 10, courtBoost: 4.5, fanTrust: 10, chemistry: 6 },
              delayDays: null,
              nextNode: null,
              flag: "tabu_quebrado_concluido"
            }
          ]
        },
        node_grudge_battle: {
          id: "node_grudge_battle",
          title: "A Batalha Campal",
          situation: "Em um jogo elétrico, tenso e disputado em cada centímetro de chão, o time mostrou brio e colocou o rival no seu devido lugar.",
          choices: [
            {
              id: "proud_warriors",
              label: "Celebrar a vitória heroica na força bruta",
              description: "Moral gigante e respeito absoluto conquistado na liga.",
              effects: { courtBoost: 4.0, morale: 8, fanTrust: 8 },
              delayDays: null,
              nextNode: null,
              flag: "batalha_vencida_concluida"
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

  // Identifica o arco inicial compatível com a Lore do clube de forma verdadeiramente aleatória e diversa
  function pickInitialArcForClub(club, gameState) {
    const loreId = String(club?.lore?.id || "").toLowerCase();
    const traits = String(club?.lore?.rosterProfile || club?.rosterStyle || "").toLowerCase();
    const objective = String(club?.objective || "").toLowerCase();
    const tier = String(club?.strengthTier || club?.lore?.strengthTier || "").toLowerCase();

    // Pool de arcos elegíveis para a abertura da temporada
    const pool = [];

    // Arcos universais e táticos de início de trabalho
    pool.push("arc_derby_rivalry");
    pool.push("arc_secret_scout_leak");
    pool.push("arc_fitness_revolution");
    pool.push("arc_superfan_pressure");
    pool.push("arc_iron_defense");
    pool.push("arc_tactical_revolution");

    // Reconstrução / Base / Orçamento curto / Time jovem
    if (tier === "low" || traits.includes("prospect") || traits.includes("young") || objective.includes("jovens") || objective.includes("rebaixamento") || traits.includes("fight") || traits.includes("budget")) {
      pool.push("arc_wonderkid", "arc_rookie_breakout", "arc_miracle_run", "arc_stadium_renovation");
      // O rombo nos cofres entra como apenas uma possibilidade rara entre muitas
      pool.push("arc_financial_crisis");
    }

    // Favoritos / Título / Veteranos / Estrelas
    if (tier === "good" || traits.includes("veteran") || objective.includes("titulo") || objective.includes("playoff") || traits.includes("win_now")) {
      pool.push("arc_last_dance", "arc_rebel_star", "arc_captain_mutiny", "arc_foreign_investor", "arc_contract_blackmail", "arc_taboo_nemesis", "arc_media_circus");
    }

    // Candidatos equilibrados / meio de tabela
    pool.push("arc_media_circus", "arc_taboo_nemesis", "arc_captain_mutiny");

    // Pesos temáticos adicionais se a lore tiver menção expressa
    if (loreId.includes("veteran") || loreId.includes("last_dance")) pool.push("arc_last_dance", "arc_last_dance");
    if (loreId.includes("base") || loreId.includes("promessa")) pool.push("arc_wonderkid", "arc_rookie_breakout");
    if (loreId.includes("rival") || loreId.includes("derbi")) pool.push("arc_derby_rivalry", "arc_taboo_nemesis");

    // Filtrar válidos existentes no banco
    const valid = pool.filter((id) => Boolean(STORY_ARCS[id]));
    const finalPool = valid.length ? valid : Object.keys(STORY_ARCS);

    // Seleção verdadeiramente aleatória para nunca repetir a mesma abertura
    const roll = Math.floor(Math.random() * finalPool.length);
    return finalPool[roll];
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
      status: "awaiting_choice",
      startedDay: gameState.currentDay || 1,
      startedWeek: gameState.currentWeek || 1
    };

    nState.activeArcs.push(arcInstance);
    return arcInstance;
  }

  // Obtém a decisão ativa atual (se houver algum nó de arco pronto para ser decidido)
  function getActiveNarrativeDecision(gameState) {
    const nState = initNarrativeState(gameState);

    // 1. Verificar primeiro se há eventos agendados que chegaram ao dia atual
    const dueIndex = nState.scheduledEvents.findIndex((ev) => Number(ev.triggerDay) <= Number(gameState.currentDay));
    if (dueIndex >= 0) {
      const scheduled = nState.scheduledEvents.splice(dueIndex, 1)[0];
      const arc = STORY_ARCS[scheduled.arcId];
      const node = arc?.nodes?.[scheduled.nodeId];
      const arcInstance = nState.activeArcs.find((a) => a.arcId === scheduled.arcId);
      if (arcInstance) {
        arcInstance.currentNodeId = scheduled.nodeId;
        arcInstance.status = "awaiting_choice";
      }
      if (node) {
        return formatDecisionForGame(gameState, arc, node);
      }
    }

    // 2. Se há um arco ativo recém-iniciado no nó 1 aguardando a primeira escolha
    for (const active of nState.activeArcs) {
      if (active.currentNodeId === "node_1" && active.status === "awaiting_choice") {
        const arc = STORY_ARCS[active.arcId];
        const node = arc?.nodes?.["node_1"];
        if (node) {
          return formatDecisionForGame(gameState, arc, node);
        }
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
  function resolveNarrativeChoice(gameState, decisionOrChoiceId, maybeChoiceId) {
    let decision = typeof decisionOrChoiceId === "object" ? decisionOrChoiceId : null;
    let choiceId = typeof decisionOrChoiceId === "string" ? decisionOrChoiceId : maybeChoiceId;

    if (!decision) {
      decision = gameState.pendingDecision;
    }
    if (!decision) {
      const nState = initNarrativeState(gameState);
      for (const active of nState.activeArcs) {
        const arc = STORY_ARCS[active.arcId];
        const node = arc?.nodes?.[active.currentNodeId];
        if (node) {
          decision = formatDecisionForGame(gameState, arc, node);
          break;
        }
      }
    }
    if (!decision) return null;

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
        arcInstance.status = "scheduled_waiting";
        const delay = Number(choice.delayDays) || 4;
        const triggerDay = Number(gameState.currentDay || 1) + delay;

        nState.scheduledEvents.push({
          arcId: decision.arcId,
          nodeId: choice.nextNode,
          triggerDay,
          requiresMatchResult: Boolean(choice.requiresMatchResult)
        });
      } else {
        // Arco concluído com sucesso
        nState.activeArcs = nState.activeArcs.filter((a) => a.arcId !== decision.arcId);
        nState.completedArcs.push(decision.arcId);
        nState.lastCompletedDay = Number(gameState.currentDay || 1);
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

    // Se já há um arco ativo ou evento agendado pendente, dar espaço e não encavalar
    if (nState.activeArcs.length > 0 || nState.scheduledEvents.length > 0) return;

    const currentDay = Number(gameState.currentDay || 1);
    const week = Number(gameState.currentWeek || 1);
    const completed = nState.completedArcs || [];

    // Semana 1: Iniciar arco inicial aleatório e temático para o clube
    if (completed.length === 0 && currentDay <= 7) {
      const initialArcId = pickInitialArcForClub(gameState.userTeam, gameState);
      startStoryArc(gameState, initialArcId);
      return;
    }

    // Intervalo de respiro entre arcos principais (ao menos 4 dias sem arcos pesados)
    const lastDay = Number(nState.lastCompletedDay || 0);
    if (currentDay - lastDay < 4) return;

    // Identificar momento e contexto atual do clube
    const standing = gameState.standings?.find((s) => s.teamId === gameState.userTeam?.id);
    const losses = standing ? Number(standing.losses || 0) : 0;
    const wins = standing ? Number(standing.wins || 0) : 0;
    const morale = Number(gameState.summary?.moraleAverage || gameState.teamState?.morale || 50);
    const fatigue = Number(gameState.summary?.fatigueAverage || gameState.teamState?.fatigue || 20);

    const candidates = [];

    // Momento de crise / derrotas / moral baixa
    if ((losses >= 2 || morale < 45 || nState.storyFlags.last_match_loss) && week >= 2) {
      candidates.push("arc_locker_room_split", "arc_captain_mutiny", "arc_superfan_pressure", "arc_media_circus", "arc_iron_defense");
    }

    // Momento de euforia / vitórias consecutivas / boa fase
    if ((wins >= 2 || morale >= 65 || nState.lastMatchWon) && week >= 2) {
      candidates.push("arc_viral_sponsorship", "arc_miracle_run", "arc_foreign_investor", "arc_rookie_breakout");
    }

    // Fadiga física acumulada
    if (fatigue >= 50 && week >= 3) {
      candidates.push("arc_injury_crisis_gamble", "arc_last_dance", "arc_fitness_revolution");
    }

    // Arcos gerais de meio de temporada (semana 3 em diante)
    if (week >= 3) {
      candidates.push(
        "arc_rebel_star",
        "arc_tactical_revolution",
        "arc_secret_scout_leak",
        "arc_taboo_nemesis",
        "arc_stadium_renovation",
        "arc_scandal_referee"
      );
    }

    // Reta decisiva (semana 5 em diante)
    if (week >= 5) {
      candidates.push(
        "arc_contract_blackmail",
        "arc_wonderkid",
        "arc_last_dance",
        "arc_financial_crisis"
      );
    }

    // Filtrar os que já foram concluídos nesta carreira
    const available = candidates.filter((id) => !completed.includes(id) && STORY_ARCS[id]);
    if (!available.length) return;

    // Seleção verdadeiramente aleatória
    const chosen = available[Math.floor(Math.random() * available.length)];
    startStoryArc(gameState, chosen);
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
    pickInitialArcForClub,
    startStoryArc,
    getActiveNarrativeDecision,
    resolveNarrativeChoice,
    checkSeasonArcTriggers,
    onMatchCompleted,
    renderDecisionNetworkView
  };
})();
