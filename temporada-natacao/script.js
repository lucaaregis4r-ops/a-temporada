/**
 * A Temporada - Natação: Circuito Brasileiro de Alta Performance
 * Motor de Gestão Esportiva, Tática de Raia, Clubes Procedurais e Simulação de Provas
 * Vanilla JS Modular / Zero Build Step
 */

(function () {
  const namespace = (window.TemporadaTotal = window.TemporadaTotal || {});

  const TEAM_SIZE = 10;
  const MIN_PER_GENDER = 4;
  const SALARY_CAP = 96;
  const STORAGE_KEY = "temporada-total-natacao-v4";
  const USER_TEAM_ID = "player-team";
  const ENTRIES_PER_EVENT = 2;
  const MAX_EVENTS_PER_SWIMMER = 4;
  const LEAGUE_SIZE = 12; // Liga nacional com 12 clubes procedurais

  // Clubes Tradicionais de Referência
  const SWIMMING_CLUBS = [
    { id: "minas", name: "Minas Tênis Clube", city: "Belo Horizonte, MG", color: "#003882", crest: "MTC", lore: "Maior potência formadora do país, referência em estilos e infraestrutura olímpica.", budget: 95, bonus: { technique: 3, medley: 4 } },
    { id: "pinheiros", name: "E.C. Pinheiros", city: "São Paulo, SP", color: "#00205b", crest: "ECP", lore: "Clube poliesportivo de elite, famoso por velocistas implacáveis e medalhistas mundiais.", budget: 96, bonus: { sprint: 4, turns: 2 } },
    { id: "unisanta", name: "Unisanta", city: "Santos, SP", color: "#00a3e0", crest: "UNI", lore: "Tradição em águas rápidas, maratonas e nadadores de meio-fundo com resistência de aço.", budget: 94, bonus: { endurance: 4, recovery: 2 } },
    { id: "flamengo", name: "C.R. Flamengo", city: "Rio de Janeiro, RJ", color: "#c3141e", crest: "CRF", lore: "Força da Gávea, especialistas em peito, garra nas chegadas e grande pressão da torcida.", budget: 93, bonus: { breaststroke: 4, sprint: 2 } },
    { id: "corinthians", name: "S.C. Corinthians", city: "São Paulo, SP", color: "#1a1a1a", crest: "SCCP", lore: "A força do Parque São Jorge. Nadadores aguerridos que crescem em provas decisivas.", budget: 92, bonus: { mentality: 4, sprint: 2 } },
    { id: "gnu", name: "Grêmio Náutico União", city: "Porto Alegre, RS", color: "#1c408e", crest: "GNU", lore: "Resistência do sul. Fundistas incansáveis que dominam os 400m, 800m e 1500m livre.", budget: 91, bonus: { endurance: 5, recovery: 3 } },
    { id: "sesi", name: "Sesi-SP", city: "São Paulo, SP", color: "#da291c", crest: "SESI", lore: "Projeto moderno focado em biomecânica, dados de virada e desenvolvimento de promessas.", budget: 90, bonus: { technique: 4, turns: 4 } },
    { id: "marlins", name: "Marlins Aquatic Club", city: "Florianópolis, SC", color: "#00f2fe", crest: "MAC", lore: "Nova força emergente fundada com metodologia inovadora e foco no circuito nacional.", budget: 94, bonus: { sprint: 2, technique: 2 } }
  ];

  // As 8 Etapas Nacionais do Circuito
  const MEETS = [
    { id: 1, week: 1, name: "Troféu Abertura", city: "Santos, SP", pool: "Piscina Rápida de 50m", note: "Piscina em nível do mar, tempos rápidos para abrir o calendário." },
    { id: 2, week: 2, name: "Copa de Outono", city: "Curitiba, PR", pool: "Piscina Térmica 50m", note: "Água densa e temperatura fria; nadadores com alta resistência se destacam." },
    { id: 3, week: 3, name: "Festival de Estilos", city: "Belo Horizonte, MG", pool: "Parque Aquático Minas", note: "Etapa com alto peso técnico em medley, peito e costas." },
    { id: 4, week: 4, name: "Meeting Nacional", city: "Brasília, DF", pool: "Complexo Cláudio Coutinho", note: "Clima seco do Planalto Central; exige gestão cuidadosa de hidratação e oxigênio." },
    { id: 5, week: 5, name: "Circuito Sul-Brasileiro", city: "Porto Alegre, RS", pool: "Piscina Olímpica GNU", note: "Fundo e meio-fundo em alta demanda; 400m, 800m e 1500m pesam dobrado." },
    { id: 6, week: 6, name: "Troféu Velocidade", city: "Recife, PE", pool: "Parque Santos Dumont", note: "Calor nordestino favorece explosão nos 50m e 100m livre e borboleta." },
    { id: 7, week: 7, name: "Campeonato das Capitais", city: "Rio de Janeiro, RJ", pool: "Parque Maria Lenk", note: "Piscina olímpica de nível internacional; etapa preliminar decisiva." },
    { id: 8, week: 8, name: "Grande Final do Circuito", city: "Fortaleza, CE", pool: "Centro de Formação Olímpica", note: "A grande decisão de campeões do ano com transmissão ao vivo completa!" }
  ];

  // 18 Provas Oficiais (Categorizadas para navegação visual e sem sobrecarga)
  const EVENT_DEFINITIONS = [
    // Provas Masculinas
    { id: "M_50_free", gender: "M", category: "velocidade", categoryLabel: "Masculino", stroke: "freestyle", distance: 50, label: "50m Livre", wrLabel: "WR 20.91", brLabel: "BR 20.91 (Cielo)", worldRecord: 20.91, brazilRecord: 20.91, variance: 0.35, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_100_free", gender: "M", category: "velocidade", categoryLabel: "Masculino", stroke: "freestyle", distance: 100, label: "100m Livre", wrLabel: "WR 46.80", brLabel: "BR 46.91", worldRecord: 46.80, brazilRecord: 46.91, variance: 0.65, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_200_free", gender: "M", category: "fundo", categoryLabel: "Masculino", stroke: "freestyle", distance: 200, label: "200m Livre", wrLabel: "WR 1:42.00", brLabel: "BR 1:44.66", worldRecord: 102.00, brazilRecord: 104.66, variance: 1.15, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_400_free", gender: "M", category: "fundo", categoryLabel: "Masculino", stroke: "freestyle", distance: 400, label: "400m Livre", wrLabel: "WR 3:40.07", brLabel: "BR 3:43.31", worldRecord: 220.07, brazilRecord: 223.31, variance: 2.10, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_1500_free", gender: "M", category: "fundo", categoryLabel: "Masculino", stroke: "freestyle", distance: 1500, label: "1500m Livre", wrLabel: "WR 14:30.67", brLabel: "BR 14:48.88", worldRecord: 870.67, brazilRecord: 888.88, variance: 4.80, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_100_back", gender: "M", category: "estilos", categoryLabel: "Masculino", stroke: "backstroke", distance: 100, label: "100m Costas", wrLabel: "WR 51.60", brLabel: "BR 52.95", worldRecord: 51.60, brazilRecord: 52.95, variance: 0.68, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_100_breast", gender: "M", category: "estilos", categoryLabel: "Masculino", stroke: "breaststroke", distance: 100, label: "100m Peito", wrLabel: "WR 56.88", brLabel: "BR 58.74", worldRecord: 56.88, brazilRecord: 58.74, variance: 0.72, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_100_fly", gender: "M", category: "velocidade", categoryLabel: "Masculino", stroke: "butterfly", distance: 100, label: "100m Borboleta", wrLabel: "WR 49.45", brLabel: "BR 50.80", worldRecord: 49.45, brazilRecord: 50.80, variance: 0.70, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "M_200_im", gender: "M", category: "medley", categoryLabel: "Masculino", stroke: "medley", distance: 200, label: "200m Medley", wrLabel: "WR 1:52.61", brLabel: "BR 1:55.64", worldRecord: 112.61, brazilRecord: 115.64, variance: 1.25, points: [18, 14, 12, 10, 8, 6, 4, 2] },

    // Provas Femininas
    { id: "F_50_free", gender: "F", category: "velocidade", categoryLabel: "Feminino", stroke: "freestyle", distance: 50, label: "50m Livre", wrLabel: "WR 23.61", brLabel: "BR 24.25", worldRecord: 23.61, brazilRecord: 24.25, variance: 0.38, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_100_free", gender: "F", category: "velocidade", categoryLabel: "Feminino", stroke: "freestyle", distance: 100, label: "100m Livre", wrLabel: "WR 51.71", brLabel: "BR 52.85", worldRecord: 51.71, brazilRecord: 52.85, variance: 0.68, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_200_free", gender: "F", category: "fundo", categoryLabel: "Feminino", stroke: "freestyle", distance: 200, label: "200m Livre", wrLabel: "WR 1:52.23", brLabel: "BR 1:56.57", worldRecord: 112.23, brazilRecord: 116.57, variance: 1.20, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_400_free", gender: "F", category: "fundo", categoryLabel: "Feminino", stroke: "freestyle", distance: 400, label: "400m Livre", wrLabel: "WR 3:55.38", brLabel: "BR 4:04.40", worldRecord: 235.38, brazilRecord: 244.40, variance: 2.25, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_800_free", gender: "F", category: "fundo", categoryLabel: "Feminino", stroke: "freestyle", distance: 800, label: "800m Livre", wrLabel: "WR 8:04.79", brLabel: "BR 8:32.96", worldRecord: 484.79, brazilRecord: 512.96, variance: 3.80, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_100_back", gender: "F", category: "estilos", categoryLabel: "Feminino", stroke: "backstroke", distance: 100, label: "100m Costas", wrLabel: "WR 57.13", brLabel: "BR 59.61", worldRecord: 57.13, brazilRecord: 59.61, variance: 0.72, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_100_breast", gender: "F", category: "estilos", categoryLabel: "Feminino", stroke: "breaststroke", distance: 100, label: "100m Peito", wrLabel: "WR 1:04.13", brLabel: "BR 1:07.12", worldRecord: 64.13, brazilRecord: 67.12, variance: 0.76, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_100_fly", gender: "F", category: "velocidade", categoryLabel: "Feminino", stroke: "butterfly", distance: 100, label: "100m Borboleta", wrLabel: "WR 55.18", brLabel: "BR 56.94", worldRecord: 55.18, brazilRecord: 56.94, variance: 0.74, points: [18, 14, 12, 10, 8, 6, 4, 2] },
    { id: "F_200_im", gender: "F", category: "medley", categoryLabel: "Feminino", stroke: "medley", distance: 200, label: "200m Medley", wrLabel: "WR 2:06.12", brLabel: "BR 2:11.84", worldRecord: 126.12, brazilRecord: 131.84, variance: 1.30, points: [18, 14, 12, 10, 8, 6, 4, 2] }
  ];

  // Mercado de Nadadores
  const MARKET = [
    // Masculino
    { id: 1, gender: "M", name: "Lucas Valério", age: 22, salary: 11, freestyle: 90, backstroke: 64, breaststroke: 50, butterfly: 74, sprint: 92, endurance: 74, technique: 82, turns: 86, mentality: 80, recovery: 74, tag: "⚡ Velocista Puro", specialty: "50m/100m Livre" },
    { id: 2, gender: "M", name: "Mateus Prado", age: 25, salary: 10, freestyle: 86, backstroke: 68, breaststroke: 55, butterfly: 62, sprint: 79, endurance: 89, technique: 84, turns: 80, mentality: 83, recovery: 78, tag: "🦈 Fundo & Meio-fundo", specialty: "200m/400m Livre" },
    { id: 3, gender: "M", name: "Enzo Salles", age: 21, salary: 9, freestyle: 76, backstroke: 90, breaststroke: 52, butterfly: 60, sprint: 82, endurance: 76, technique: 86, turns: 88, mentality: 79, recovery: 74, tag: "🛡️ Costas Olímpico", specialty: "100m Costas" },
    { id: 4, gender: "M", name: "Bruno Neri", age: 24, salary: 9, freestyle: 72, backstroke: 56, breaststroke: 91, butterfly: 54, sprint: 76, endurance: 78, technique: 85, turns: 75, mentality: 84, recovery: 75, tag: "🏊 Peito de Ferro", specialty: "100m Peito" },
    { id: 5, gender: "M", name: "Caio Mota", age: 23, salary: 10, freestyle: 78, backstroke: 62, breaststroke: 56, butterfly: 89, sprint: 85, endurance: 80, technique: 83, turns: 78, mentality: 82, recovery: 72, tag: "🦋 Voo da Borboleta", specialty: "100m Borboleta" },
    { id: 6, gender: "M", name: "Guilherme Porto", age: 27, salary: 8, freestyle: 82, backstroke: 78, breaststroke: 72, butterfly: 75, sprint: 78, endurance: 85, technique: 87, turns: 82, mentality: 86, recovery: 78, tag: "🔄 Mestre do Medley", specialty: "200m Medley" },
    { id: 7, gender: "M", name: "Rafael Luz", age: 19, salary: 6, freestyle: 81, backstroke: 66, breaststroke: 45, butterfly: 74, sprint: 86, endurance: 70, technique: 76, turns: 79, mentality: 73, recovery: 70, tag: "🚀 Promessa de Sprint", specialty: "50m Livre" },
    { id: 8, gender: "M", name: "Thiago Serra", age: 26, salary: 7, freestyle: 75, backstroke: 84, breaststroke: 50, butterfly: 64, sprint: 76, endurance: 80, technique: 83, turns: 85, mentality: 80, recovery: 76, tag: "🛡️ Linha de Costas", specialty: "100m Costas" },
    { id: 9, gender: "M", name: "Henrique Maia", age: 19, salary: 5, freestyle: 70, backstroke: 58, breaststroke: 82, butterfly: 50, sprint: 71, endurance: 74, technique: 78, turns: 70, mentality: 75, recovery: 72, tag: "🏊 Jovem Peitista", specialty: "100m Peito" },
    { id: 10, gender: "M", name: "Otávio Barros", age: 24, salary: 7, freestyle: 84, backstroke: 62, breaststroke: 50, butterfly: 76, sprint: 83, endurance: 76, technique: 78, turns: 79, mentality: 80, recovery: 74, tag: "⚡ Largada Explosiva", specialty: "100m Livre" },

    // Feminino
    { id: 11, gender: "F", name: "Beatriz Nogueira", age: 23, salary: 11, freestyle: 91, backstroke: 68, breaststroke: 54, butterfly: 72, sprint: 93, endurance: 76, technique: 85, turns: 86, mentality: 82, recovery: 76, tag: "⚡ Rainha dos 50m", specialty: "50m/100m Livre" },
    { id: 12, gender: "F", name: "Larissa Dias", age: 25, salary: 10, freestyle: 87, backstroke: 72, breaststroke: 58, butterfly: 66, sprint: 80, endurance: 91, technique: 86, turns: 82, mentality: 84, recovery: 80, tag: "🦈 Resistência Pura", specialty: "400m/800m Livre" },
    { id: 13, gender: "F", name: "Camila Vianna", age: 22, salary: 9, freestyle: 78, backstroke: 89, breaststroke: 55, butterfly: 63, sprint: 82, endurance: 78, technique: 87, turns: 89, mentality: 80, recovery: 75, tag: "🛡️ Elegância de Costas", specialty: "100m Costas" },
    { id: 14, gender: "F", name: "Mariana Lins", age: 24, salary: 9, freestyle: 74, backstroke: 58, breaststroke: 90, butterfly: 55, sprint: 78, endurance: 80, technique: 86, turns: 78, mentality: 85, recovery: 76, tag: "🏊 Peito Cirúrgico", specialty: "100m Peito" },
    { id: 15, gender: "F", name: "Fernanda Rios", age: 23, salary: 10, freestyle: 80, backstroke: 64, breaststroke: 58, butterfly: 90, sprint: 87, endurance: 81, technique: 84, turns: 80, mentality: 83, recovery: 74, tag: "🦋 Ataque de Borboleta", specialty: "100m Borboleta" },
    { id: 16, gender: "F", name: "Juliana Frota", age: 26, salary: 8, freestyle: 83, backstroke: 80, breaststroke: 74, butterfly: 77, sprint: 80, endurance: 86, technique: 88, turns: 84, mentality: 87, recovery: 79, tag: "🔄 Medley Versátil", specialty: "200m Medley" },
    { id: 17, gender: "F", name: "Helena Castro", age: 18, salary: 6, freestyle: 82, backstroke: 65, breaststroke: 46, butterfly: 72, sprint: 86, endurance: 72, technique: 77, turns: 78, mentality: 74, recovery: 72, tag: "🚀 Nova Estrela", specialty: "50m/100m Livre" },
    { id: 18, gender: "F", name: "Sofia Meireles", age: 25, salary: 7, freestyle: 76, backstroke: 85, breaststroke: 52, butterfly: 65, sprint: 78, endurance: 82, technique: 84, turns: 86, mentality: 81, recovery: 77, tag: "🛡️ Costas Estável", specialty: "100m Costas" },
    { id: 19, gender: "F", name: "Isabela Duarte", age: 19, salary: 5, freestyle: 72, backstroke: 60, breaststroke: 83, butterfly: 52, sprint: 73, endurance: 75, technique: 79, turns: 72, mentality: 76, recovery: 74, tag: "🏊 Peito Promissor", specialty: "100m Peito" },
    { id: 20, gender: "F", name: "Marina Paiva", age: 24, salary: 7, freestyle: 85, backstroke: 64, breaststroke: 52, butterfly: 78, sprint: 85, endurance: 78, technique: 80, turns: 81, mentality: 81, recovery: 75, tag: "⚡ Tiro Perfeito", specialty: "100m Livre" }
  ];

  // ==========================================================================
  // BANCO EXPANDIDO DE HISTÓRIAS & DILEMAS NARRATIVOS (24 DILEMAS)
  // ==========================================================================
  const SWIMMING_DILEMMAS = [
    {
      id: "arc_swim_suits",
      title: "A Polêmica dos Trajes de Alta Tecnologia",
      tag: "Regulamento & Tecnologia",
      text: "A comissão técnica propõe a aquisição de um lote importado de trajes hidrodinâmicos de fibra de carbono. Eles reduzem a turbulência e garantem centésimos vitais, mas custam caro e geram debate sobre tradição versus inovação.",
      choices: [
        { id: "suit_buy", label: "Comprar Trajes de Ponta", description: "Gasta R$ 18k do caixa, mas garante -0.15s no tempo de todos os nadadores na etapa.", effects: { budget: -18, timeReduction: 0.15, morale: 4, boardTrust: 2 } },
        { id: "suit_training", label: "Focar em Biomecânica Tradicional", description: "Poupa os recursos e intensifica o treino técnico de pegada de água (+2 Técnica).", effects: { technique: 2, morale: -2, boardTrust: -1 } }
      ]
    },
    {
      id: "arc_swim_relay",
      title: "O Desgaste da Estrela Principal",
      tag: "Gestão do Elenco",
      text: "O principal velocista do time está com dores musculares após a última etapa e pediu para ser poupado de uma prova para se concentrar no ouro individual. Os outros atletas cobram compromisso total.",
      choices: [
        { id: "relay_protect", label: "Preservar a Estrela para o Ouro", description: "Garante frescor máximo para a prova chave individual (+10 Frescor), arriscando perder pontos coletivos.", effects: { freshnessRecovery: 10, chemistry: -4, morale: 2 } },
        { id: "relay_demand", label: "Exigir Comprometimento Integral", description: "O atleta nada todas as 4 provas programadas, fortalecendo a união e química do grupo (+6 Química).", effects: { chemistry: 6, morale: 3 } }
      ]
    },
    {
      id: "arc_swim_taper",
      title: "Aposta no Polimento (Taper) Radical",
      tag: "Ciência do Esporte",
      text: "O fisiologista sugere cortar 60% do volume de treino na semana do Meeting Nacional para tentar bater o Recorde Brasileiro. O risco é o grupo perder base aeróbica para as provas de 400m e 1500m.",
      choices: [
        { id: "taper_radical", label: "Polimento Agressivo (All-in no Recorde)", description: "+3 de Explosão e Velocidade nos tiros curtos, mas -3 de Resistência de Fundo.", effects: { sprint: 3, endurance: -3, boardTrust: 3 } },
        { id: "taper_balanced", label: "Manter Periodização Equilibrada", description: "Carga segura e estável para manter todos os atletas competitivos em todas as distâncias.", effects: { endurance: 1, recovery: 2 } }
      ]
    },
    {
      id: "arc_swim_ncaa",
      title: "Convite Universitário Internacional",
      tag: "Mercado & Janela",
      text: "Uma universidade americana da Divisão 1 da NCAA fez proposta de bolsa integral para sua jovem revelação. Você pode antecipar a renovação com ajuda de custo ou liberá-lo com bônus de compensação.",
      choices: [
        { id: "ncaa_renew", label: "Oferecer Patrocínio Local e Blindar", description: "Custo de R$ 15k para manter a jóia no clube por mais um ciclo olímpico.", effects: { budget: -15, morale: 5, chemistry: 3 } },
        { id: "ncaa_release", label: "Apoiar a Carreira no Exterior", description: "O atleta viaja ao fim do ano; o clube recebe R$ 25k de taxa de formação e prestígio internacional.", effects: { budget: 25, boardTrust: 4, morale: -3 } }
      ]
    },
    {
      id: "arc_swim_cryo",
      title: "A Batalha das Banheiras de Criogenia",
      tag: "Infraestrutura & Ciência",
      text: "O departamento de fisiologia solicita a instalação de câmaras de imersão criogênica a -110°C para reduzir o ácido lático entre as sessões matutinas e vespertinas.",
      choices: [
        { id: "cryo_buy", label: "Instalar Criogenia de Última Geração", description: "Investe R$ 20k do caixa. Os nadadores recuperam +15% de frescor físico pós-etapa.", effects: { budget: -20, freshnessRecovery: 15, morale: 4 } },
        { id: "cryo_traditional", label: "Manter Banheiras de Gelo Manuais", description: "Economiza o orçamento e foca na disciplina e superação do vestiário (+2 Mentalidade).", effects: { mentality: 2, chemistry: 2 } }
      ]
    },
    {
      id: "arc_swim_rivalry",
      title: "Provocação na Borda no Aquecimento",
      tag: "Vestiário & Clássico",
      text: "No aquecimento oficial, o técnico do principal clube rival declarou na imprensa que seus atletas 'nadam com medo nas viradas decisivas'. O clima ferveu no cais.",
      choices: [
        { id: "rivalry_fire", label: "Responder na Piscina com Sangue nos Olhos", description: "Atletas entram em estado de fúria competitiva (+4 Velocidade na etapa, mas maior desgaste).", effects: { sprint: 4, timeReduction: 0.20, morale: 5 } },
        { id: "rivalry_ice", label: "Manter Foco Clínico e Sangue Frio", description: "Treinador exige foco estrito nos tempos e técnica de nado (+3 Técnica e Viradas).", effects: { technique: 3, turns: 2, boardTrust: 2 } }
      ]
    },
    {
      id: "arc_swim_heater",
      title: "A Pane no Aquecedor da Piscina",
      tag: "Crise na Sede",
      text: "Uma falha no termostato central da sede deixou a piscina olímpica a 16°C em pleno inverno. Treinar nessas condições pode causar lesões ou forjar uma casca mental lendária.",
      choices: [
        { id: "heater_rent", label: "Alugar Horário em Complexo Privado", description: "Gasta R$ 12k de emergência para garantir água aquecida e preservar os músculos dos atletas.", effects: { budget: -12, freshnessRecovery: 8, boardTrust: 1 } },
        { id: "heater_sparta", label: "Nadar na Água Fria (Espírito Espartano)", description: "Forja resiliência brutal no grupo (+4 Mentalidade, +2 Resistência), apesar de reclamações.", effects: { mentality: 4, endurance: 2, morale: -3 } }
      ]
    },
    {
      id: "arc_swim_sponsor",
      title: "Patrocínio Polêmico de Isotônico",
      tag: "Marketing & Finanças",
      text: "Uma gigante de bebidas energéticas oferece R$ 35k imediatos de patrocínio de touca, mas exige consumo obrigatório de uma fórmula densa que alguns atletas relatam causar desconforto gástrico.",
      choices: [
        { id: "sponsor_accept", label: "Assinar o Contrato Milionário", description: "Injeção de R$ 35k no caixa do clube, com queixas pontuais no vestiário.", effects: { budget: 35, boardTrust: 4, morale: -2 } },
        { id: "sponsor_reject", label: "Recusar e Proteger o Bem-Estar Físico", description: "Prioriza a saúde digestiva e a individualidade dos atletas (+5 Química do Grupo).", effects: { chemistry: 5, morale: 3 } }
      ]
    },
    {
      id: "arc_swim_prodigy",
      title: "A Revelação de 16 Anos",
      tag: "Categorias de Base",
      text: "Um jovem nadador da base cravou tempo digno de pódio adulto na seletiva interna. A diretoria quer colocá-lo de titular imediatamente para gerar manchetes nacionais.",
      choices: [
        { id: "prodigy_rush", label: "Promover Imediatamente à Equipe Titular", description: "Gera euforia da torcida e atrai patrocinadores (+3 Moral, +$15k bônus de marketing).", effects: { budget: 15, morale: 4, boardTrust: 3 } },
        { id: "prodigy_mature", label: "Seguir a Cartilha de Maturação Gradual", description: "Protege o atleta da queima precoce e desenvolve sua técnica básica (+3 Técnica geral).", effects: { technique: 3, mentality: 2 } }
      ]
    },
    {
      id: "arc_swim_underwater",
      title: "O Limite dos 15 Metros Submersos",
      tag: "Regulamento & Arbitragem",
      text: "Seus atletas de costas estão saindo da água exatamente na marca regulamentar de 15 metros. Árbitros rivais pressionam a federação para aplicar desclassificações sumárias.",
      choices: [
        { id: "underwater_edge", label: "Manter a Estratégia no Limite da Linha", description: "Garante -0.22s de vantagem hidrodinâmica na saída, assumindo risco tático calculado.", effects: { timeReduction: 0.22, sprint: 2 } },
        { id: "underwater_safe", label: "Emergir aos 13 Metros com Margem Segura", description: "Elimina qualquer risco de desclassificação e aprimora a transição de braçada de superfície.", effects: { technique: 2, boardTrust: 2 } }
      ]
    },
    {
      id: "arc_swim_altitude",
      title: "Camping de Altitude em Campos do Jordão",
      tag: "Periodização & Fisiologia",
      text: "A comissão técnica sugere 10 dias de treinamento em altitude moderada na serra para estimular a produção natural de hemoglobina antes da etapa de meio-fundo.",
      choices: [
        { id: "altitude_go", label: "Subir a Serra para o Camping", description: "Custo de R$ 18k. Melhora significativamente a resistência pulmonar nos 400m e 1500m (+4 Resistência).", effects: { budget: -18, endurance: 4, recovery: 2 } },
        { id: "altitude_stay", label: "Permanecer na Sede Focando em Velocidade", description: "Poupa recursos e intensifica largadas do bloco e tempos de reação (+3 Velocidade).", effects: { sprint: 3, turns: 2 } }
      ]
    },
    {
      id: "arc_swim_burnout",
      title: "Ansiedade Pré-Competitiva do Astro",
      tag: "Saúde Mental & Liderança",
      text: "O recordista de borboleta do time confessou à comissão técnica estar sob estresse paralisante devido à cobrança por índices olímpicos e medo de falhar na etapa.",
      choices: [
        { id: "burnout_counsel", label: "Contratar Sessões com Psicólogo Esportivo", description: "Investe R$ 8k. Fortalece o equilíbrio emocional e a tomada de decisão sob pressão (+5 Mentalidade).", effects: { budget: -8, mentality: 5, morale: 4 } },
        { id: "burnout_teammates", label: "Roda de Conversa e Apoio do Vestiário", description: "Capitães da equipe assumem a responsabilidade e acolhem o atleta (+6 Química do time).", effects: { chemistry: 6, morale: 2 } }
      ]
    },
    {
      id: "arc_swim_goggles",
      title: "A Guerra dos Óculos Hidrodinâmicos",
      tag: "Equipamentos & Aerodinâmica",
      text: "Uma marca premium forneceu protótipos de óculos espelhados sem vedação de silicone tradicional, reduzindo o arrasto de cabeça mas gerando queixas de pressão ocular.",
      choices: [
        { id: "goggles_enforce", label: "Padronizar Modelo Ultra-Aerodinâmico", description: "Garante -0.08s de redução de tempo em provas de velocidade, com adaptação dolorosa.", effects: { timeReduction: 0.08, sprint: 2, morale: -2 } },
        { id: "goggles_free", label: "Liberar Escolha Individual de Conforto", description: "Atletas nadam tranquilos e confiantes com seus equipamentos de preferência (+3 Química).", effects: { chemistry: 3, technique: 1 } }
      ]
    },
    {
      id: "arc_swim_distance_revolt",
      title: "A Revolta dos Nadadores de Fundo",
      tag: "Equidade & Vestiário",
      text: "Os especialistas em 800m e 1500m livre reclamam formalmente que os bônus por vitória e destaques nas redes sociais do clube privilegiam apenas os velocistas dos 50m.",
      choices: [
        { id: "dist_equalize", label: "Equalizar Premiações e Valorizar o Fundo", description: "Gasta R$ 14k do caixa em premiações justas. Vestiário alcança harmonia perfeita (+6 Química).", effects: { budget: -14, chemistry: 6, morale: 3 } },
        { id: "dist_merit", label: "Manter Foco de Mídia nos Tiros Curtos", description: "Diretoria foca no apelo de público da velocidade (+3 Diretoria, descontentamento no fundo).", effects: { boardTrust: 3, chemistry: -4 } }
      ]
    },
    {
      id: "arc_swim_contamination",
      title: "Alerta de Contaminação em Lote de Suplementos",
      tag: "Ética & Antidoping",
      text: "A agência antidoping emitiu alerta preventivo sobre um lote de aminoácidos com traços residuais não declarados. O fabricante jura inocência, mas a etapa se aproxima.",
      choices: [
        { id: "doping_discard", label: "Descartar Imediatamente e Comprar Certificado", description: "Gasta R$ 16k em lote europeu lacrado. Segurança jurídica e tranquilidade absoluta (+4 Moral).", effects: { budget: -16, morale: 4, boardTrust: 3 } },
        { id: "doping_gamble", label: "Manter Suplementação com Testes Internos", description: "Economiza o orçamento e confia na análise interna laboratorial (+poupa caixa).", effects: { chemistry: -2, boardTrust: -1 } }
      ]
    },
    {
      id: "arc_swim_saltwater",
      title: "Treinamento em Piscina de Água Salobra",
      tag: "Inovação Metodológica",
      text: "Um resort esportivo litorâneo oferece 3 dias de treino em piscina de água salinizada, que aumenta a flutuabilidade e a sensibilidade de sustentação do quadril.",
      choices: [
        { id: "salt_accept", label: "Realizar o Workshop de Flutuabilidade", description: "Custo de R$ 10k. Atletas aprimoram sensibilidade de tração e alinhamento do tronco (+3 Técnica).", effects: { budget: -10, technique: 3, recovery: 2 } },
        { id: "salt_decline", label: "Focar em Repetições na Piscina Olímpica Oficial", description: "Mantém a calibragem de ritmo exata da piscina de competição (+2 Viradas de borda).", effects: { turns: 2 } }
      ]
    },
    {
      id: "arc_swim_mixed_relay",
      title: "A Estrutura do Revezamento Misto",
      tag: "Estratégia Coletiva",
      text: "Há divergência acirrada na comissão sobre a ordem dos gêneros no revezamento 4x100m medley misto: abrir com velocidade masculina ou guardar os homens para a virada final?",
      choices: [
        { id: "mixed_aggressive", label: "Ataque Frontal: Homens Abrindo na Liderança", description: "Garante ondas limpas e dianteira imediata na prova coletiva (+3 Velocidade de saída).", effects: { sprint: 3, chemistry: 2 } },
        { id: "mixed_comeback", label: "Volta Heroica: Fechamento com Velocista Masculino", description: "Estratégia de ultrapassagem eletrizante na perna final que empolga a arquibancada (+4 Moral).", effects: { morale: 4, mentality: 2 } }
      ]
    },
    {
      id: "arc_swim_doc",
      title: "Série Documental de Streaming no Vestiário",
      tag: "Mídia & Imagem",
      text: "Uma produtora internacional oferece R$ 30k para gravar uma série sobre os bastidores da equipe, com microfones e câmeras nos momentos de maior tensão pré-prova.",
      choices: [
        { id: "doc_sign", label: "Permitir Acesso e Faturar a Verba", description: "Entrada de R$ 30k no caixa do clube, com leve distração de foco da equipe durante a semana.", effects: { budget: 30, boardTrust: 3, morale: -2 } },
        { id: "doc_refuse", label: "Blindar o Vestiário e Proteger a Privacidade", description: "Foco 100% monástico na raia, valorizando o compromisso com o troféu (+4 Mentalidade).", effects: { mentality: 4, chemistry: 4 } }
      ]
    },
    {
      id: "arc_swim_nutrition",
      title: "Mudança na Dieta dos Fundistas",
      tag: "Nutrição Esportiva",
      text: "O novo chefe de nutrição quer substituir os pratos volumosos de massas por uma abordagem cetogênica ciclada para otimizar a queima de gordura e leveza dos fundistas.",
      choices: [
        { id: "nutri_precision", label: "Implementar o Novo Protocolo Científico", description: "Custo de R$ 9k em alimentos nobres. Ganho de eficiência aeróbica nos 1500m (+3 Resistência).", effects: { budget: -9, endurance: 3, recovery: 2 } },
        { id: "nutri_tradition", label: "Manter o Cardápio Tradicional dos Nadadores", description: "Atletas comem com prazer o cardápio familiar e mantêm a moral alta (+3 Moral).", effects: { morale: 3, chemistry: 2 } }
      ]
    },
    {
      id: "arc_swim_monaco",
      title: "Convite para Meeting Internacional em Mônaco",
      tag: "Calendário & Prestígio",
      text: "Um convite de prestígio chegou da Europa oferecendo R$ 25k de compensação para a equipe disputar um torneio de gala, no meio do calendário do circuito nacional.",
      choices: [
        { id: "monaco_go", label: "Embarcar para o Torneio na Europa", description: "Injeção de R$ 25k de prestígio e caixa, mas o fuso horário gera desgaste na etapa seguinte.", effects: { budget: 25, boardTrust: 5, freshnessRecovery: -12 } },
        { id: "monaco_stay", label: "Declinar e Focar 100% no Título Brasileiro", description: "Demonstra compromisso inabalável com a conquista do circuito nacional (+6 Química).", effects: { chemistry: 6, morale: 3 } }
      ]
    },
    {
      id: "arc_swim_waves",
      title: "As Ondulações da Piscina Rasa",
      tag: "Adaptação Ambiental",
      text: "A piscina da próxima etapa no litoral é rasa e tem calhas laterais curtas, gerando marola intensa para quem nadar nas raias externas 1 e 8.",
      choices: [
        { id: "waves_tackle", label: "Treinar em Água Turbulenta Similada", description: "Prepara os atletas para encarar a marola e braçadas pesadas (+3 Técnica de pegada).", effects: { technique: 3, mentality: 2 } },
        { id: "waves_power", label: "Intensificar Força Bruta de Saída", description: "Aumenta a cadência de braçadas para cortar a água por cima (+3 Velocidade de sprint).", effects: { sprint: 3 } }
      ]
    },
    {
      id: "arc_swim_turns",
      title: "A Nova Biomecânica de Virada no Peito",
      tag: "Biomecânica de Precisão",
      text: "O treinador assistente desenvolveu um ângulo de aproximação mais agressivo para o toque de duas mãos na virada de peito, raspando preciosos centésimos.",
      choices: [
        { id: "turns_adopt", label: "Adotar a Virada Agressiva", description: "Garante -0.16s de tempo nas provas de peito, exigindo precisão milimétrica dos peitistas.", effects: { timeReduction: 0.16, turns: 3 } },
        { id: "turns_solid", label: "Manter a Virada Canônica Consagrada", description: "Zero risco de advertência da arbitragem e segurança nos momentos de pressão (+2 Técnica).", effects: { technique: 2, boardTrust: 1 } }
      ]
    },
    {
      id: "arc_swim_curfew",
      title: "Quebra de Toque de Recolher na Concentração",
      tag: "Disciplina & Liderança",
      text: "Dois atletas veteranos foram flagrados retornando às 2 da manhã para o hotel da delegação após celebração na cidade sede da etapa.",
      choices: [
        { id: "curfew_suspend", label: "Aplicar Suspensão Exemplar na Etapa", description: "Reforça a autoridade da diretoria e a disciplina do clube (+5 Diretoria, perde vagas nas provas).", effects: { boardTrust: 5, chemistry: -2 } },
        { id: "curfew_fine", label: "Multa Salarial Interna e Cobrança no Cais", description: "Preserva os nadadores na disputa por medalhas e cobra redenção na raia (+2 Moral).", effects: { morale: 2, chemistry: 3 } }
      ]
    },
    {
      id: "arc_swim_legend",
      title: "O Retorno do Ex-Medalhista Olímpico",
      tag: "Herança & Prestígio",
      text: "Um ícone da natação de 33 anos, multicampeão aposentado, quer retornar ao esporte e pede vaga no clube para encerrar a carreira em grande estilo.",
      choices: [
        { id: "legend_sign", label: "Contratar o Ícone como Capitão Moral", description: "Custo de R$ 16k em salário. Traz liderança inestimável e moral gigantesca para todo o elenco (+8 Moral).", effects: { budget: -16, morale: 8, chemistry: 5 } },
        { id: "legend_pass", label: "Agradecer e Manter o Foco nos Jovens", description: "Mantém a folha enxuta e foca a verba no desenvolvimento dos novos talentos (+poupa caixa).", effects: { boardTrust: 2, mentality: 1 } }
      ]
    }
  ];

  // ==========================================================================
  // BANCO EXPANDIDO PROCEDURAL DE CLUBES AQUÁTICOS (32 PREFIXOS & 32 CIDADES)
  // ==========================================================================
  const PROCEDURAL_PREFIXES = [
    "Clube de Regatas", "Associação Aquática", "Grêmio Náutico", "Sociedade Hídrica",
    "Complexo Olímpico", "Marlins Clube", "Tubarões Aquáticos", "Golfinhos de Natação",
    "Academia Hídrica", "Esporte Clube Águas", "Centro Aquático", "Botafogo Aquático",
    "Águas Claras Natação", "Albatroz Natação", "Canto do Rio Natação", "Estrela do Mar Aquática",
    "Ilhabela Natação", "Fluvial Náutico", "Iate Clube Aquático", "Sport Club Oceano",
    "Sociedade Hídrica Nacional", "Baleias Natação", "União Aquática", "Atlético Náutico",
    "Tritões Clube", "Piranhas Natação", "São Paulo Aquático", "Parque Aquático",
    "Água Viva Clube", "Cascavel Náutico", "Tubarão Branco Natação", "Cruzeiro Aquático"
  ];

  const PROCEDURAL_CITIES = [
    // Sudeste
    { city: "Santos, SP", acronymBase: "SAN" }, { city: "Rio de Janeiro, RJ", acronymBase: "RIO" },
    { city: "São Paulo, SP", acronymBase: "SPO" }, { city: "Belo Horizonte, MG", acronymBase: "BHO" },
    { city: "Campinas, SP", acronymBase: "CPQ" }, { city: "Niterói, RJ", acronymBase: "NIT" },
    { city: "Vitória, ES", acronymBase: "VIX" }, { city: "Ribeirão Preto, SP", acronymBase: "RAO" },
    // Sul
    { city: "Florianópolis, SC", acronymBase: "FLN" }, { city: "Curitiba, PR", acronymBase: "CWB" },
    { city: "Porto Alegre, RS", acronymBase: "POA" }, { city: "Joinville, SC", acronymBase: "JOI" },
    { city: "Caxias do Sul, RS", acronymBase: "CXS" }, { city: "Londrina, PR", acronymBase: "LDB" },
    { city: "Balneário Camboriú, SC", acronymBase: "BCU" },
    // Centro-Oeste
    { city: "Brasília, DF", acronymBase: "BSB" }, { city: "Goiânia, GO", acronymBase: "GYN" },
    { city: "Campo Grande, MS", acronymBase: "CGR" }, { city: "Cuiabá, MT", acronymBase: "CGB" },
    // Nordeste
    { city: "Recife, PE", acronymBase: "REC" }, { city: "Salvador, BA", acronymBase: "SSA" },
    { city: "Fortaleza, CE", acronymBase: "FOR" }, { city: "Natal, RN", acronymBase: "NAT" },
    { city: "Maceió, AL", acronymBase: "MCZ" }, { city: "João Pessoa, PB", acronymBase: "JPA" },
    { city: "Aracaju, SE", acronymBase: "AJU" }, { city: "São Luís, MA", acronymBase: "SLZ" },
    { city: "Ilhéus, BA", acronymBase: "IOS" },
    // Norte
    { city: "Belém, PA", acronymBase: "BEL" }, { city: "Manaus, AM", acronymBase: "MAO" },
    { city: "Palmas, TO", acronymBase: "PMW" }, { city: "Porto Velho, RO", acronymBase: "PVH" }
  ];

  const PROCEDURAL_PALETTES = [
    { color: "#00f2fe", secondaryColor: "#003882" },
    { color: "#facc15", secondaryColor: "#00205b" },
    { color: "#00c49f", secondaryColor: "#0369a1" },
    { color: "#fb923c", secondaryColor: "#9a3412" },
    { color: "#f43f5e", secondaryColor: "#881337" },
    { color: "#a855f7", secondaryColor: "#3b82f6" },
    { color: "#10b981", secondaryColor: "#064e3b" },
    { color: "#38bdf8", secondaryColor: "#1e293b" },
    { color: "#f59e0b", secondaryColor: "#1e1b4b" },
    { color: "#06b6d4", secondaryColor: "#eab308" },
    { color: "#84cc16", secondaryColor: "#0f172a" },
    { color: "#dc2626", secondaryColor: "#ffffff" },
    { color: "#9333ea", secondaryColor: "#06b6d4" },
    { color: "#14b8a6", secondaryColor: "#020617" },
    { color: "#eab308", secondaryColor: "#09090b" },
    { color: "#0f766e", secondaryColor: "#d97706" }
  ];

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function generateProceduralClubProposals() {
    const shuffledPrefixes = shuffle(PROCEDURAL_PREFIXES);
    const shuffledCities = shuffle(PROCEDURAL_CITIES);
    const shuffledPalettes = shuffle(PROCEDURAL_PALETTES);

    const archetypes = [
      {
        archetype: "favorito",
        archetypeTitle: "🏆 O Favorito ao Título",
        tagline: "Potência Olímpica • Cobrança Imediata",
        badge: "🏆 O FAVORITO",
        accentClass: "is-favorito",
        budget: 110 + Math.floor(Math.random() * 6),
        objective: "🥇 Título Nacional Obrigatório",
        boardPressure: "Máxima (Cobrança por vitória em toda etapa)",
        traitName: "🏆 Tradição & Recordes",
        traitDescription: "+4 em Velocidade e Viradas. Bônus de moral extra em etapas com múltiplos ouros.",
        bonus: { sprint: 4, turns: 3, technique: 2 },
        lore: "Potência tradicional com piscina aquecida de 50 metros e investimento maciço. A diretoria exige o troféu já nesta temporada.",
        startingRosterIds: [1, 3, 4, 5, 10, 11, 13, 14, 15, 20]
      },
      {
        archetype: "desafiante",
        archetypeTitle: "⚔️ O Desafiante",
        tagline: "Equilíbrio Tático • Briga por Pódio",
        badge: "⚔️ O DESAFIANTE",
        accentClass: "is-desafiante",
        budget: 94 + Math.floor(Math.random() * 5),
        objective: "🥈 Pódio Geral & Vagas Sul-Americanas",
        boardPressure: "Moderada (Confiança na metodologia)",
        traitName: "⚙️ Biomecânica de Raia",
        traitDescription: "+4 em Resistência e Técnica. Atletas sofrem 25% menos fadiga entre provas e executam voltas negativas precisas.",
        bonus: { endurance: 4, technique: 4, recovery: 3 },
        lore: "Centro aquático ultra-moderno focado em análise científica de braçada e dados biomecânicos. Forte candidato a quebrar hegemonias.",
        startingRosterIds: [2, 3, 6, 8, 10, 12, 13, 16, 18, 20]
      },
      {
        archetype: "reconstrucao",
        archetypeTitle: "🚀 A Reconstrução",
        tagline: "Academia de Promessas • Fome de Glória",
        badge: "🚀 A RECONSTRUÇÃO",
        accentClass: "is-reconstrucao",
        budget: 82 + Math.floor(Math.random() * 5),
        objective: "🚀 Revelar Talentos & Top 4 no Circuito",
        boardPressure: "Tranquila (Foco na evolução a longo prazo)",
        traitName: "🔥 Fome de Glória",
        traitDescription: "Atletas jovens recuperam 20% mais frescor e ganham o dobro de atributos em etapas bem-sucedidas.",
        bonus: { mentality: 5, recovery: 4, sprint: 3 },
        lore: "Projeto inovador de formação de atletas. Com orçamento enxuto e ambiente leve, a aposta é na garra da juventude para surpreender.",
        startingRosterIds: [1, 4, 7, 9, 10, 11, 14, 17, 19, 20]
      }
    ];

    return archetypes.map((arch, idx) => {
      const cityObj = shuffledCities[idx] || shuffledCities[0];
      const prefix = shuffledPrefixes[idx] || shuffledPrefixes[0];
      const palette = shuffledPalettes[idx] || shuffledPalettes[0];
      const cityNameOnly = cityObj.city.split(",")[0].trim();
      const name = `${prefix} ${cityNameOnly}`;
      const prefixAcronym = prefix.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const crest = (prefixAcronym + cityObj.acronymBase[0]).toUpperCase();

      const stars = arch.startingRosterIds.slice(0, 4).map((id) => MARKET.find((m) => m.id === id)).filter(Boolean);

      return {
        id: `procedural_club_${Date.now()}_${idx}`,
        name,
        city: cityObj.city,
        crest,
        color: palette.color,
        secondaryColor: palette.secondaryColor,
        ...arch,
        previewStars: stars
      };
    });
  }

  // Gera a liga inteira de 12 clubes procedurais para o circuito
  function generateProceduralLeagueClubs(userClub, leagueSize = LEAGUE_SIZE) {
    const needed = leagueSize - 1; // 11 clubes adversários
    const shuffledPrefixes = shuffle(PROCEDURAL_PREFIXES);
    const shuffledCities = shuffle(PROCEDURAL_CITIES);
    const shuffledPalettes = shuffle(PROCEDURAL_PALETTES);

    const rivalArchetypes = [
      { archetype: "favorito", bonus: { sprint: 3, turns: 3 }, tag: "Potência Rival" },
      { archetype: "desafiante", bonus: { endurance: 3, technique: 3 }, tag: "Força Emergente" },
      { archetype: "reconstrucao", bonus: { mentality: 4, recovery: 3 }, tag: "Academia Jovem" },
      { archetype: "estilos", bonus: { technique: 4, breaststroke: 3 }, tag: "Tradição em Estilos" },
      { archetype: "fundo", bonus: { endurance: 5, recovery: 4 }, tag: "Mestres do Fundo" },
      { archetype: "velocistas", bonus: { sprint: 5, turns: 2 }, tag: "Tiros Curtos" }
    ];

    const rivals = [];
    let pIdx = 3, cIdx = 3, palIdx = 3;

    for (let i = 0; i < needed; i++) {
      const prefix = shuffledPrefixes[pIdx % shuffledPrefixes.length];
      const cityObj = shuffledCities[cIdx % shuffledCities.length];
      const palette = shuffledPalettes[palIdx % shuffledPalettes.length];
      const arch = rivalArchetypes[i % rivalArchetypes.length];

      pIdx++; cIdx++; palIdx++;
      const cityNameOnly = cityObj.city.split(",")[0].trim();
      const name = `${prefix} ${cityNameOnly}`;
      if (name === userClub.name) {
        cIdx++;
      }

      const prefixAcronym = prefix.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const crest = (prefixAcronym + cityObj.acronymBase[0]).toUpperCase();

      rivals.push({
        id: `opp_club_${i + 1}`,
        name,
        city: cityObj.city,
        crest,
        color: palette.color,
        secondaryColor: palette.secondaryColor,
        archetype: arch.archetype,
        bonus: arch.bonus,
        baseRating: 78 + (i % 5) * 2.5
      });
    }

    return rivals;
  }

  // ==========================================================================
  // ESTADO CENTRAL DA CARREIRA DE NATAÇÃO
  // ==========================================================================
  const state = {
    club: SWIMMING_CLUBS[0],
    customClubName: "",
    selectedIds: [1, 2, 3, 4, 5, 11, 12, 13, 14, 15],
    season: null,
    activeTab: "arena", // arena, roster, circuit, story
    selectedCategory: "todas", // todas, velocidade, fundo, estilos, medley
    selectedSwimmerFilter: null,
    tacticsByEvent: {}, // { [eventId]: [tactic1, tactic2] }
    lineup: {}, // { [eventId]: [swimmerId1, swimmerId2] }
    minigameBuff: null,
    storyDecisionsHistory: [],
    activeDilemma: null,
    seenDilemmaIds: [],
    currentProposals: [],
    isInDraftMode: false
  };

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "--:--.--";
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remaining = (seconds - minutes * 60).toFixed(2).padStart(5, "0");
      return `${minutes}:${remaining}`;
    }
    return seconds.toFixed(2);
  }

  function createEmptyLineup() {
    return Object.fromEntries(
      EVENT_DEFINITIONS.map((event) => [event.id, Array.from({ length: ENTRIES_PER_EVENT }, () => "")])
    );
  }

  function createEmptyTactics() {
    return Object.fromEntries(
      EVENT_DEFINITIONS.map((event) => [event.id, Array.from({ length: ENTRIES_PER_EVENT }, () => "equilibrada")])
    );
  }

  function getSelectedSwimmers() {
    return MARKET.filter((swimmer) => state.selectedIds.includes(swimmer.id));
  }

  function getSelectedByGender(gender) {
    return getSelectedSwimmers().filter((swimmer) => swimmer.gender === gender);
  }

  function getClubName() {
    return state.customClubName.trim() || state.club.name;
  }

  function getMeetInfo() {
    return state.season ? MEETS[state.season.currentMeetIndex] || null : MEETS[0];
  }

  function getAdjustedSwimmer(swimmer) {
    const progress = state.season?.progress?.[swimmer.id] || {};
    const freshness = state.season?.freshness?.[swimmer.id] ?? 92;
    const clubBonus = state.club.bonus || {};

    return {
      ...swimmer,
      freestyle: clamp(swimmer.freestyle + (progress.freestyle || 0), 40, 99),
      backstroke: clamp(swimmer.backstroke + (progress.backstroke || 0), 40, 99),
      breaststroke: clamp(swimmer.breaststroke + (progress.breaststroke || 0) + (clubBonus.breaststroke || 0), 40, 99),
      butterfly: clamp(swimmer.butterfly + (progress.butterfly || 0), 40, 99),
      sprint: clamp(swimmer.sprint + (progress.sprint || 0) + (clubBonus.sprint || 0), 40, 99),
      endurance: clamp(swimmer.endurance + (progress.endurance || 0) + (clubBonus.endurance || 0), 40, 99),
      technique: clamp(swimmer.technique + (progress.technique || 0) + (clubBonus.technique || 0), 40, 99),
      turns: clamp(swimmer.turns + (progress.turns || 0) + (clubBonus.turns || 0), 40, 99),
      mentality: clamp(swimmer.mentality + (progress.mentality || 0) + (clubBonus.mentality || 0), 40, 99),
      recovery: clamp(swimmer.recovery + (progress.recovery || 0) + (clubBonus.recovery || 0), 40, 99),
      freshness
    };
  }

  function getEventPerformanceIndex(swimmer, event) {
    const strokeAttr = swimmer[event.stroke] || swimmer.freestyle;
    let score = strokeAttr * 0.45 + swimmer.technique * 0.25;

    if (event.distance <= 100) {
      score += swimmer.sprint * 0.2 + swimmer.turns * 0.1;
    } else {
      score += swimmer.endurance * 0.2 + swimmer.recovery * 0.1;
    }
    return score;
  }

  function getProjectedEventTime(swimmer, event, meet, noise = 0, strategy = "equilibrada") {
    const performance = getEventPerformanceIndex(swimmer, event);
    const freshnessFactor = 1 - (swimmer.freshness - 88) * 0.0018;
    const recordGap = event.brazilRecord / event.worldRecord - 1;
    const baselineGap = recordGap * 0.5;

    let rawTime = event.worldRecord * (1 + baselineGap + (100 - performance) * 0.0055) * freshnessFactor;

    // Estratégia de Passagem
    if (strategy === "explosiva") {
      rawTime *= event.distance <= 100 ? 0.985 : 1.015;
    } else if (strategy === "negativa") {
      rawTime *= swimmer.technique >= 80 ? 0.982 : 1.008;
    } else if (strategy === "economica") {
      rawTime *= 1.02;
    }

    // Minigame Buff
    if (state.minigameBuff && typeof state.minigameBuff.timeReduction === "number") {
      rawTime -= state.minigameBuff.timeReduction;
    }

    return Math.max(event.worldRecord * 1.005, rawTime + noise);
  }

  function getAssignmentCounts() {
    const counts = {};
    getSelectedSwimmers().forEach((s) => { counts[s.id] = 0; });
    EVENT_DEFINITIONS.forEach((event) => {
      (state.lineup[event.id] || []).forEach((swimmerId) => {
        if (counts[swimmerId] !== undefined) counts[swimmerId] += 1;
      });
    });
    return counts;
  }

  function getMedalPrediction(projectedTime, event) {
    const benchmark = event.worldRecord * (1 + (event.brazilRecord / event.worldRecord - 1) * 0.5 + (100 - 80) * 0.0055);
    if (projectedTime < benchmark * 0.995) {
      return { text: "🥇 Ouro Provável", className: "medal-gold" };
    }
    if (projectedTime < benchmark * 1.008) {
      return { text: "🥈 Briga por Medalha", className: "medal-silver" };
    }
    if (projectedTime < benchmark * 1.022) {
      return { text: "🥉 Disputa de Pódio", className: "medal-bronze" };
    }
    return { text: "Top 6", className: "medal-points" };
  }

  function validateLineup() {
    if (!state.season) return { valid: false, message: "Inicie o circuito para validar a escalação." };
    for (const event of EVENT_DEFINITIONS) {
      const entries = state.lineup[event.id] || [];
      if (entries.some((val) => !val)) {
        return { valid: false, message: `Escalação incompleta em ${event.label} ${event.categoryLabel}. Preencha as 2 vagas (ou use a Escalação Automática).` };
      }
      if (entries[0] === entries[1]) {
        return { valid: false, message: `${event.label} precisa de 2 nadadores diferentes.` };
      }
    }
    const counts = getAssignmentCounts();
    const over = Object.entries(counts).find(([, total]) => total > MAX_EVENTS_PER_SWIMMER);
    if (over) {
      const swimmer = MARKET.find((s) => String(s.id) === over[0]);
      return { valid: false, message: `${swimmer?.name || "Um atleta"} ultrapassou o limite de ${MAX_EVENTS_PER_SWIMMER} provas.` };
    }
    return { valid: true, message: "Escalação completa e aprovada para a etapa!" };
  }

  // ==========================================================================
  // ESCALAÇÃO INTELIGENTE: MIN-COST MAX-FLOW (MCMF)
  // Garante matematicamente ZERO sobrecarga: limite máximo de 4 provas por atleta!
  // ==========================================================================
  function solveLineupMCMF(swimmers, events, costFn) {
    const numSwimmers = swimmers.length;
    const numEvents = events.length;
    const S = 0;
    const T = 1 + numSwimmers + numEvents;
    const numNodes = T + 1;

    const adj = Array.from({ length: numNodes }, () => []);

    function addEdge(from, to, cap, cost) {
      const a = { to, cap, flow: 0, cost, rev: adj[to].length };
      const b = { to: from, cap: 0, flow: 0, cost: -cost, rev: adj[from].length };
      adj[from].push(a);
      adj[to].push(b);
    }

    // Source -> Swimmers: capacidade 4 (limite máximo absoluto de 4 provas por atleta!), custo 0
    for (let i = 0; i < numSwimmers; i++) {
      addEdge(S, 1 + i, MAX_EVENTS_PER_SWIMMER, 0);
    }

    // Swimmers -> Events: capacidade 1 (um atleta não pode nadar a mesma prova duas vezes!), custo = tempo projetado
    for (let i = 0; i < numSwimmers; i++) {
      for (let j = 0; j < numEvents; j++) {
        addEdge(1 + i, 1 + numSwimmers + j, 1, costFn(swimmers[i], events[j]));
      }
    }

    // Events -> Sink: capacidade 2 (cada prova oficial exige exatamente 2 atletas!), custo 0
    for (let j = 0; j < numEvents; j++) {
      addEdge(1 + numSwimmers + j, T, ENTRIES_PER_EVENT, 0);
    }

    // Fluxo com caminhos aumentantes de menor custo
    let totalFlow = 0;
    const targetFlow = numEvents * ENTRIES_PER_EVENT;

    while (totalFlow < targetFlow) {
      const dist = Array(numNodes).fill(Infinity);
      const parent = Array(numNodes).fill(null);
      const inQueue = Array(numNodes).fill(false);
      const queue = [S];

      dist[S] = 0;
      inQueue[S] = true;

      while (queue.length > 0) {
        const u = queue.shift();
        inQueue[u] = false;

        for (const edge of adj[u]) {
          if (edge.cap - edge.flow > 0 && dist[edge.to] > dist[u] + edge.cost + 1e-9) {
            dist[edge.to] = dist[u] + edge.cost;
            parent[edge.to] = { u, edge };
            if (!inQueue[edge.to]) {
              queue.push(edge.to);
              inQueue[edge.to] = true;
            }
          }
        }
      }

      if (dist[T] === Infinity) break;

      let curr = T;
      while (curr !== S) {
        const { u, edge } = parent[curr];
        edge.flow += 1;
        adj[edge.to][edge.rev].flow -= 1;
        curr = u;
      }
      totalFlow += 1;
    }

    const assignments = {};
    events.forEach((ev) => { assignments[ev.id] = []; });

    for (let i = 0; i < numSwimmers; i++) {
      for (const edge of adj[1 + i]) {
        if (edge.flow === 1 && edge.to > numSwimmers && edge.to < T) {
          const eventIdx = edge.to - 1 - numSwimmers;
          const ev = events[eventIdx];
          assignments[ev.id].push(swimmers[i].id);
        }
      }
    }

    return assignments;
  }

  function autoLineup() {
    if (!state.season) return;
    const currentMeet = getMeetInfo();
    const swimmers = getSelectedSwimmers().map(getAdjustedSwimmer);
    if (!swimmers.length) return;

    const newLineup = createEmptyLineup();
    const newTactics = createEmptyTactics();

    // Executa o otimizador MCMF separado por gênero (Masculino e Feminino)
    ["M", "F"].forEach((gender) => {
      const genderSwimmers = swimmers.filter((s) => s.gender === gender);
      const genderEvents = EVENT_DEFINITIONS.filter((ev) => ev.gender === gender);
      if (genderSwimmers.length === 0 || genderEvents.length === 0) return;

      const assignments = solveLineupMCMF(
        genderSwimmers,
        genderEvents,
        (s, ev) => getProjectedEventTime(s, ev, currentMeet, 0, "equilibrada")
      );

      genderEvents.forEach((ev) => {
        const pair = assignments[ev.id] || [];
        newLineup[ev.id][0] = pair[0] !== undefined ? pair[0] : "";
        newLineup[ev.id][1] = pair[1] !== undefined ? pair[1] : "";

        // Táticas inteligentes recomendadas por distância
        [0, 1].forEach((slot) => {
          if (ev.distance <= 50) newTactics[ev.id][slot] = "explosiva";
          else if (ev.distance >= 400) newTactics[ev.id][slot] = "negativa";
          else newTactics[ev.id][slot] = "equilibrada";
        });
      });
    });

    state.lineup = newLineup;
    state.tacticsByEvent = newTactics;
    saveState();
    render();
  }

  function optimizeTactics() {
    EVENT_DEFINITIONS.forEach((event) => {
      state.tacticsByEvent[event.id] = state.tacticsByEvent[event.id] || ["equilibrada", "equilibrada"];
      if (event.distance <= 50) {
        state.tacticsByEvent[event.id] = ["explosiva", "explosiva"];
      } else if (event.distance >= 400) {
        state.tacticsByEvent[event.id] = ["negativa", "negativa"];
      } else {
        state.tacticsByEvent[event.id] = ["equilibrada", "equilibrada"];
      }
    });
    saveState();
    renderArenaTab();
  }

  function clearLineup() {
    state.lineup = createEmptyLineup();
    saveState();
    renderArenaTab();
  }

  // ==========================================================================
  // SELETOR INTERATIVO DE NADADOR (POP-UP / MODAL ÁGIL)
  // ==========================================================================
  function openSwimmerPicker(eventId, slotIndex, gender) {
    const modal = document.getElementById("swim-picker-modal");
    const container = document.getElementById("picker-candidates-container");
    const titleEl = document.getElementById("picker-modal-title");
    const subEl = document.getElementById("picker-modal-sub");
    if (!modal || !container) return;

    const event = EVENT_DEFINITIONS.find((ev) => ev.id === eventId);
    if (!event) return;

    const currentMeet = getMeetInfo();
    const otherSlot = slotIndex === 0 ? 1 : 0;
    const currentPartnerId = state.lineup[eventId]?.[otherSlot];
    const counts = getAssignmentCounts();

    const candidates = getSelectedSwimmers()
      .filter((s) => s.gender === gender)
      .map(getAdjustedSwimmer)
      .map((s) => {
        const projected = getProjectedEventTime(s, event, currentMeet);
        const assigned = counts[s.id] || 0;
        const isPartner = s.id === currentPartnerId;
        const isMaxed = assigned >= MAX_EVENTS_PER_SWIMMER && state.lineup[eventId]?.[slotIndex] !== s.id;
        return { swimmer: s, projected, assigned, isPartner, isMaxed };
      });

    // Ordena pelo mais rápido
    candidates.sort((a, b) => a.projected - b.projected);

    titleEl.textContent = `Escalar: ${event.label} (${event.categoryLabel})`;
    subEl.textContent = `${event.distance}m • ${event.wrLabel} • ${event.brLabel}`;

    container.innerHTML = candidates.map((item, idx) => {
      const s = item.swimmer;
      const isTopTime = idx === 0;
      const prediction = getMedalPrediction(item.projected, event);
      const isDisabled = item.isPartner || item.isMaxed;
      const reasonBadge = item.isPartner
        ? '<span class="picker-candidate-badge" style="color:var(--danger);">Já na outra raia</span>'
        : item.isMaxed
        ? '<span class="picker-candidate-badge" style="color:var(--danger);">Limite de 4 provas atingido</span>'
        : isTopTime
        ? '<span class="picker-candidate-badge" style="color:var(--gold);">🌟 Mais Rápido do Time</span>'
        : "";

      return `
        <article class="picker-candidate-card ${isTopTime ? "is-recommended" : ""} ${isDisabled ? "is-disabled" : ""}" data-swimmer-id="${s.id}">
          <div class="picker-candidate-info">
            <div class="swimmer-avatar-mini" style="border-color:${state.club.color};">${s.gender === "M" ? "🏊‍♂️" : "🏊‍♀️"}</div>
            <div class="picker-candidate-name">
              <strong>${s.name} ${reasonBadge}</strong>
              <span>${s.specialty} • Frescor ${s.freshness}% • ${item.assigned}/4 Provas</span>
            </div>
          </div>
          <div class="picker-candidate-metrics">
            <span class="medal-prediction-badge ${prediction.className}">${prediction.text}</span>
            <span class="picker-time-highlight">⏱️ ${formatTime(item.projected)}</span>
            <button type="button" class="picker-select-btn" ${isDisabled ? "disabled" : ""}>
              Escalar
            </button>
          </div>
        </article>
      `;
    }).join("");

    container.querySelectorAll(".picker-candidate-card:not(.is-disabled)").forEach((card) => {
      card.addEventListener("click", () => {
        const swimmerId = Number(card.dataset.swimmerId);
        state.lineup[eventId] = state.lineup[eventId] || ["", ""];
        state.lineup[eventId][slotIndex] = swimmerId;
        modal.style.display = "none";
        saveState();
        renderArenaTab();
      });
    });

    modal.style.display = "flex";
  }

  function closeSwimmerPicker() {
    const modal = document.getElementById("swim-picker-modal");
    if (modal) modal.style.display = "none";
  }

  // ==========================================================================
  // OPONENTES PROCEDURAIS E SIMULAÇÃO DE ETAPA
  // ==========================================================================
  function getOpponentEntriesForEvent(event, meet) {
    const opponentClubs = (state.season?.opponentClubs && state.season.opponentClubs.length >= 6)
      ? state.season.opponentClubs
      : generateProceduralLeagueClubs(state.club, LEAGUE_SIZE);

    // Seleciona 6 clubes adversários para compor as 8 raias olímpicas da bateria principal
    return opponentClubs.slice(0, 6).map((opponent, idx) => {
      const noise = (Math.random() - 0.5) * event.variance;
      const baseRating = (opponent.baseRating || 80) + Math.sin(meet.id * 2 + idx) * 4;
      const simulatedSwimmer = {
        freestyle: baseRating,
        backstroke: baseRating,
        breaststroke: baseRating,
        butterfly: baseRating,
        sprint: baseRating,
        endurance: baseRating,
        technique: baseRating,
        turns: baseRating,
        mentality: baseRating,
        recovery: baseRating,
        freshness: 90
      };
      const time = getProjectedEventTime(simulatedSwimmer, event, meet, noise);
      return {
        id: `opp_${opponent.id || idx}_${idx}`,
        name: `Nadador ${opponent.crest}`,
        club: opponent.name,
        clubColor: opponent.color,
        isPlayer: false,
        time,
        strategy: "equilibrada"
      };
    });
  }

  function runLiveMeetSimulation() {
    const validation = validateLineup();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const currentMeet = getMeetInfo();
    let currentEventIndex = 0;
    const allEventsResults = [];

    function playNextEvent() {
      if (currentEventIndex >= EVENT_DEFINITIONS.length) {
        finishMeetResults(allEventsResults);
        return;
      }

      const event = EVENT_DEFINITIONS[currentEventIndex];
      const selectedMap = Object.fromEntries(getSelectedSwimmers().map((s) => [s.id, getAdjustedSwimmer(s)]));

      const userEntries = (state.lineup[event.id] || []).map((swimmerId, slot) => {
        const s = selectedMap[swimmerId];
        const strategy = state.tacticsByEvent[event.id]?.[slot] || "equilibrada";
        const time = getProjectedEventTime(s, event, currentMeet, (Math.random() - 0.5) * event.variance, strategy);
        return {
          id: s.id,
          name: s.name,
          club: getClubName(),
          clubColor: state.club.color,
          isPlayer: true,
          teamId: USER_TEAM_ID,
          time,
          strategy
        };
      });

      const opponentEntries = getOpponentEntriesForEvent(event, currentMeet);
      const allEntries = [...userEntries, ...opponentEntries].sort((a, b) => a.time - b.time);
      const laneOrder = [4, 5, 3, 6, 2, 7, 1, 8];
      const laneEntries = Array(8);
      allEntries.forEach((entry, idx) => {
        const lane = laneOrder[idx] || (idx + 1);
        laneEntries[lane - 1] = { ...entry, lane };
      });

      const container = document.getElementById("swim-live-modal-mount");
      const modal = document.getElementById("swim-live-modal");
      if (modal) modal.style.display = "block";

      window.TemporadaTotal.SwimArenaLive.launchRaceViewer(container, {
        event,
        entries: laneEntries,
        meet: currentMeet,
        onNextEvent: (finishedSwimmers) => {
          allEventsResults.push({ event, swimmers: finishedSwimmers });
          currentEventIndex += 1;
          playNextEvent();
        },
        onSkipAll: () => {
          for (let i = currentEventIndex; i < EVENT_DEFINITIONS.length; i++) {
            const ev = EVENT_DEFINITIONS[i];
            const uEntries = (state.lineup[ev.id] || []).map((swimmerId, slot) => {
              const s = selectedMap[swimmerId];
              const strategy = state.tacticsByEvent[ev.id]?.[slot] || "equilibrada";
              return {
                id: s.id,
                name: s.name,
                club: getClubName(),
                clubColor: state.club.color,
                isPlayer: true,
                teamId: USER_TEAM_ID,
                time: getProjectedEventTime(s, ev, currentMeet, (Math.random() - 0.5) * ev.variance, strategy)
              };
            });
            const oppEntries = getOpponentEntriesForEvent(ev, currentMeet);
            const combined = [...uEntries, ...oppEntries].sort((a, b) => a.time - b.time).map((s, idx) => ({ ...s, place: idx + 1 }));
            allEventsResults.push({ event: ev, swimmers: combined });
          }
          if (modal) modal.style.display = "none";
          finishMeetResults(allEventsResults);
        }
      });
    }

    playNextEvent();
  }

  function simulateFastMeet() {
    const validation = validateLineup();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const currentMeet = getMeetInfo();
    const selectedMap = Object.fromEntries(getSelectedSwimmers().map((s) => [s.id, getAdjustedSwimmer(s)]));
    const allEventsResults = [];

    EVENT_DEFINITIONS.forEach((event) => {
      const userEntries = (state.lineup[event.id] || []).map((swimmerId, slot) => {
        const s = selectedMap[swimmerId];
        const strategy = state.tacticsByEvent[event.id]?.[slot] || "equilibrada";
        const time = getProjectedEventTime(s, event, currentMeet, (Math.random() - 0.5) * event.variance, strategy);
        return {
          id: s.id,
          name: s.name,
          club: getClubName(),
          clubColor: state.club.color,
          isPlayer: true,
          teamId: USER_TEAM_ID,
          time
        };
      });
      const oppEntries = getOpponentEntriesForEvent(event, currentMeet);
      const combined = [...userEntries, ...oppEntries].sort((a, b) => a.time - b.time).map((s, idx) => ({ ...s, place: idx + 1 }));
      allEventsResults.push({ event, swimmers: combined });
    });

    finishMeetResults(allEventsResults);
  }

  function getNextDilemma() {
    state.seenDilemmaIds = state.seenDilemmaIds || [];
    let available = SWIMMING_DILEMMAS.filter((d) => !state.seenDilemmaIds.includes(d.id));
    if (available.length === 0) {
      state.seenDilemmaIds = [];
      available = SWIMMING_DILEMMAS;
    }
    const chosen = available[Math.floor(Math.random() * available.length)];
    state.seenDilemmaIds.push(chosen.id);
    return chosen;
  }

  function finishMeetResults(allEventsResults) {
    const currentMeet = getMeetInfo();
    const clubPoints = {};
    const clubMedals = {};

    const allClubs = [
      state.club,
      ...(state.season?.opponentClubs || generateProceduralLeagueClubs(state.club, LEAGUE_SIZE))
    ];

    allClubs.forEach((c) => {
      clubPoints[c.name] = 0;
      clubMedals[c.name] = { gold: 0, silver: 0, bronze: 0 };
    });
    clubPoints[getClubName()] = 0;
    clubMedals[getClubName()] = { gold: 0, silver: 0, bronze: 0 };

    let userGolds = 0, userSilvers = 0, userBronzes = 0;

    allEventsResults.forEach(({ event, swimmers }) => {
      swimmers.forEach((s) => {
        const pts = event.points[s.place - 1] || 0;
        clubPoints[s.club] = (clubPoints[s.club] || 0) + pts;

        if (s.place === 1) {
          clubMedals[s.club] = clubMedals[s.club] || { gold: 0, silver: 0, bronze: 0 };
          clubMedals[s.club].gold += 1;
          if (s.isPlayer) userGolds += 1;
        } else if (s.place === 2) {
          clubMedals[s.club] = clubMedals[s.club] || { gold: 0, silver: 0, bronze: 0 };
          clubMedals[s.club].silver += 1;
          if (s.isPlayer) userSilvers += 1;
        } else if (s.place === 3) {
          clubMedals[s.club] = clubMedals[s.club] || { gold: 0, silver: 0, bronze: 0 };
          clubMedals[s.club].bronze += 1;
          if (s.isPlayer) userBronzes += 1;
        }
      });
    });

    const meetStandings = Object.entries(clubPoints)
      .map(([name, points]) => ({ name, points, medals: clubMedals[name] || { gold: 0, silver: 0, bronze: 0 } }))
      .sort((a, b) => b.points - a.points);

    state.season.meetResults.push({
      meet: currentMeet.name,
      city: currentMeet.city,
      week: currentMeet.week,
      standings: meetStandings,
      userPoints: clubPoints[getClubName()] || 0,
      userRank: meetStandings.findIndex((s) => s.name === getClubName()) + 1,
      medals: { gold: userGolds, silver: userSilvers, bronze: userBronzes }
    });

    meetStandings.forEach((entry) => {
      let overall = state.season.overallStandings.find((s) => s.name === entry.name);
      if (!overall) {
        overall = { name: entry.name, points: 0, gold: 0, silver: 0, bronze: 0, isPlayer: entry.name === getClubName() };
        state.season.overallStandings.push(overall);
      }
      overall.points += entry.points;
      overall.gold += entry.medals.gold;
      overall.silver += entry.medals.silver;
      overall.bronze += entry.medals.bronze;
    });

    state.season.overallStandings.sort((a, b) => b.points - a.points);
    state.minigameBuff = null;

    // Atualiza fadiga dos nadadores escalados
    const counts = getAssignmentCounts();
    getSelectedSwimmers().forEach((s) => {
      const assignments = counts[s.id] || 0;
      const drain = assignments * 7;
      const recovery = 8 + (s.recovery || 70) * 0.05;
      state.season.freshness[s.id] = clamp((state.season.freshness[s.id] || 90) - drain + recovery, 50, 100);
    });

    state.season.currentMeetIndex += 1;
    if (state.season.currentMeetIndex < MEETS.length) {
      state.lineup = createEmptyLineup();
      state.activeDilemma = getNextDilemma();
    } else {
      state.activeDilemma = null;
    }

    saveState();
    render();
    switchTab("circuit");
  }

  // ==========================================================================
  // INICIALIZAÇÃO DA CARREIRA & SALVAMENTO
  // ==========================================================================
  function createSeason() {
    const freshness = {};
    const progress = {};
    getSelectedSwimmers().forEach((s) => {
      freshness[s.id] = 92;
      progress[s.id] = { sprint: 0, endurance: 0, technique: 0, turns: 0, recovery: 0 };
    });

    const opponentClubs = generateProceduralLeagueClubs(state.club, LEAGUE_SIZE);

    const overallStandings = [
      { name: getClubName(), points: 0, gold: 0, silver: 0, bronze: 0, isPlayer: true },
      ...opponentClubs.map((c) => ({
        name: c.name,
        points: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        isPlayer: false
      }))
    ];

    return {
      started: true,
      currentMeetIndex: 0,
      freshness,
      progress,
      meetResults: [],
      overallStandings,
      opponentClubs,
      treasury: state.club.budget || 95,
      morale: 85,
      chemistry: 80,
      boardTrust: 80,
      seenDilemmaIds: []
    };
  }

  function selectClubProposal(index) {
    const proposal = state.currentProposals[index] || state.currentProposals[0];
    if (!proposal) return;

    state.club = proposal;
    state.selectedIds = proposal.startingRosterIds || [1, 2, 3, 4, 5, 11, 12, 13, 14, 15];
    state.season = createSeason();
    state.season.started = true;
    state.lineup = createEmptyLineup();
    state.tacticsByEvent = createEmptyTactics();
    state.seenDilemmaIds = [];
    state.activeDilemma = getNextDilemma();
    state.isInDraftMode = false;
    autoLineup();
    saveState();
    render();
    switchTab("arena");
  }

  function startNewDraft() {
    state.currentProposals = generateProceduralClubProposals();
    state.isInDraftMode = true;
    state.season = null;
    saveState();
    renderDraftScreen();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        club: state.club,
        customClubName: state.customClubName,
        selectedIds: state.selectedIds,
        season: state.season,
        activeTab: state.activeTab,
        selectedCategory: state.selectedCategory,
        lineup: state.lineup,
        tacticsByEvent: state.tacticsByEvent,
        minigameBuff: state.minigameBuff,
        storyDecisionsHistory: state.storyDecisionsHistory,
        activeDilemma: state.activeDilemma,
        seenDilemmaIds: state.seenDilemmaIds,
        currentProposals: state.currentProposals,
        isInDraftMode: state.isInDraftMode,
        savedAt: new Date().toISOString()
      }));
    } catch (_) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.club) state.club = data.club;
        if (data.customClubName) state.customClubName = data.customClubName;
        if (Array.isArray(data.selectedIds)) state.selectedIds = data.selectedIds;
        if (data.season) state.season = data.season;
        if (data.activeTab) state.activeTab = data.activeTab;
        if (data.selectedCategory) state.selectedCategory = data.selectedCategory;
        if (data.lineup) state.lineup = data.lineup;
        if (data.tacticsByEvent) state.tacticsByEvent = data.tacticsByEvent;
        if (data.minigameBuff) state.minigameBuff = data.minigameBuff;
        if (data.storyDecisionsHistory) state.storyDecisionsHistory = data.storyDecisionsHistory;
        if (data.activeDilemma) state.activeDilemma = data.activeDilemma;
        if (Array.isArray(data.seenDilemmaIds)) state.seenDilemmaIds = data.seenDilemmaIds;
        if (Array.isArray(data.currentProposals)) state.currentProposals = data.currentProposals;
        if (typeof data.isInDraftMode === "boolean") state.isInDraftMode = data.isInDraftMode;
      }
    } catch (_) {}
  }

  // ==========================================================================
  // RENDERIZAÇÃO DA INTERFACE VISUAL
  // ==========================================================================
  function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll(".swim-nav-pill").forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.tab === tabId);
    });
    document.querySelectorAll(".swim-tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `tab-${tabId}`);
    });
    saveState();
  }

  function renderDraftScreen() {
    const draftScreen = document.getElementById("swim-draft-screen");
    const topbar = document.getElementById("swim-main-topbar");
    const navBar = document.getElementById("swim-main-nav-bar");
    const grid = document.getElementById("draft-proposals-grid");

    if (!draftScreen || !grid) return;

    if (state.isInDraftMode) {
      draftScreen.style.display = "block";
      if (topbar) topbar.style.display = "none";
      if (navBar) navBar.style.display = "none";
      document.querySelectorAll(".swim-tab-panel").forEach((p) => { p.style.display = "none"; });

      if (!state.currentProposals || state.currentProposals.length === 0) {
        state.currentProposals = generateProceduralClubProposals();
      }

      grid.innerHTML = state.currentProposals.map((prop, idx) => `
        <article class="arcade-proposal-card ${prop.accentClass || ""}">
          <div class="proposal-card-header">
            <span class="proposal-archetype-badge">${prop.badge}</span>
            <span style="font-size:0.75rem; color:var(--text-dim); font-weight:800;">${prop.tagline}</span>
          </div>

          <div class="proposal-crest-wrapper">
            <div class="proposal-crest" style="background-color:${prop.color};">
              ${prop.crest}
            </div>
            <div class="proposal-club-info">
              <h3>${prop.name}</h3>
              <span>📍 ${prop.city}</span>
            </div>
          </div>

          <p class="proposal-lore-quote">"${prop.lore}"</p>

          <div class="proposal-trait-box">
            <span class="proposal-trait-name">⚡ ${prop.traitName}</span>
            <p class="proposal-trait-desc">${prop.traitDescription}</p>
          </div>

          <div class="proposal-specs-row">
            <div class="proposal-spec-item">
              <span>Orçamento</span>
              <strong>$${prop.budget}M</strong>
            </div>
            <div class="proposal-spec-item">
              <span>Diretoria</span>
              <strong style="color:var(--gold); font-size:0.85rem;">${prop.boardPressure.split(" ")[0]}</strong>
            </div>
            <div class="proposal-spec-item">
              <span>Plantel</span>
              <strong>10 Atletas</strong>
            </div>
          </div>

          <div class="proposal-roster-preview">
            <span class="roster-preview-title">Destaques do Elenco Inicial:</span>
            <div class="roster-preview-chips">
              ${(prop.previewStars || []).map((s) => `<span class="roster-preview-chip">${s.gender === "M" ? "🏊‍♂️" : "🏊‍♀️"} ${s.name} (${s.specialty})</span>`).join("")}
            </div>
          </div>

          <button type="button" class="arcade-sign-btn" data-proposal-index="${idx}">
            ⚡ ASSINAR CONTRATO & CAIR NA ÁGUA
          </button>
        </article>
      `).join("");

      grid.querySelectorAll(".arcade-sign-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.proposalIndex);
          selectClubProposal(idx);
        });
      });
    } else {
      draftScreen.style.display = "none";
      if (topbar) topbar.style.display = "flex";
      if (navBar) navBar.style.display = "flex";
      document.querySelectorAll(".swim-tab-panel").forEach((p) => {
        p.style.display = p.id === `tab-${state.activeTab}` ? "block" : "none";
      });
    }
  }

  function renderTopBar() {
    const club = state.club;
    const crestEl = document.getElementById("club-crest-display");
    const nameEl = document.getElementById("club-name-display");
    const cityEl = document.getElementById("club-city-display");

    if (crestEl) {
      crestEl.textContent = club.crest;
      crestEl.style.backgroundColor = club.color;
    }
    if (nameEl) nameEl.textContent = getClubName();
    if (cityEl) cityEl.textContent = `${club.city} • ${club.badge || "Circuito Nacional"}`;

    const budgetEl = document.getElementById("vital-budget-value");
    const moraleEl = document.getElementById("vital-morale-value");
    const chemistryEl = document.getElementById("vital-chem-value");
    const stageEl = document.getElementById("vital-stage-value");

    if (budgetEl) budgetEl.textContent = `$${state.season ? state.season.treasury : club.budget}M`;
    if (moraleEl) moraleEl.textContent = `${state.season ? state.season.morale : 85}%`;
    if (chemistryEl) chemistryEl.textContent = `${state.season ? state.season.chemistry : 80}%`;
    if (stageEl) stageEl.textContent = state.season ? `${state.season.currentMeetIndex + 1} / 8` : "1 / 8";
  }

  function renderWorkloadStrip() {
    const container = document.getElementById("workload-chips-container");
    const counterEl = document.getElementById("workload-assigned-counter");
    if (!container) return;

    const swimmers = getSelectedSwimmers().map(getAdjustedSwimmer);
    const counts = getAssignmentCounts();
    let totalAssigned = 0;

    container.innerHTML = swimmers.map((s) => {
      const assigned = counts[s.id] || 0;
      totalAssigned += assigned;
      const isOver = assigned > MAX_EVENTS_PER_SWIMMER;
      const isMaxed = assigned === MAX_EVENTS_PER_SWIMMER;
      const isNearLimit = assigned === MAX_EVENTS_PER_SWIMMER - 1;
      const isActiveFilter = state.selectedSwimmerFilter === s.id;

      const countClass = isMaxed ? "is-maxed" : isNearLimit ? "is-near-limit" : "is-safe";

      return `
        <div class="workload-chip ${isOver ? "is-overloaded" : ""} ${isActiveFilter ? "is-active-filter" : ""}" data-swimmer-id="${s.id}">
          <div class="workload-chip-avatar">${s.gender === "M" ? "🏊‍♂️" : "🏊‍♀️"}</div>
          <div class="workload-chip-info">
            <span class="workload-chip-name">${s.name}</span>
            <span class="workload-chip-specialty">${s.specialty}</span>
          </div>
          <div class="workload-chip-badges">
            <span class="workload-count-badge ${countClass}">${assigned}/4</span>
            <span class="freshness-meter ${s.freshness < 80 ? "warn" : ""}">${s.freshness}%</span>
          </div>
        </div>
      `;
    }).join("");

    if (counterEl) {
      counterEl.textContent = `Inscrições: ${totalAssigned} / 36 Vagas`;
    }

    container.querySelectorAll(".workload-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const swimmerId = Number(chip.dataset.swimmerId);
        state.selectedSwimmerFilter = state.selectedSwimmerFilter === swimmerId ? null : swimmerId;
        renderArenaTab();
      });
    });
  }

  function renderTacticalEventGrid() {
    const eventsGrid = document.getElementById("events-tactical-grid");
    if (!eventsGrid) return;

    const currentMeet = getMeetInfo();
    const swimmersMap = Object.fromEntries(getSelectedSwimmers().map(getAdjustedSwimmer).map((s) => [s.id, s]));
    const counts = getAssignmentCounts();

    // Filtra por categoria selecionada
    let filteredEvents = EVENT_DEFINITIONS;
    if (state.selectedCategory !== "todas") {
      filteredEvents = filteredEvents.filter((ev) => ev.category === state.selectedCategory);
    }

    // Se houver filtro de nadador ativo no monitor
    if (state.selectedSwimmerFilter) {
      filteredEvents = filteredEvents.filter((ev) => {
        const slots = state.lineup[ev.id] || [];
        return slots.includes(state.selectedSwimmerFilter);
      });
    }

    if (filteredEvents.length === 0) {
      eventsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg);">
          <p style="font-size: 1.1rem; margin-bottom: 8px;">Nenhuma prova encontrada para este filtro.</p>
          <button type="button" class="btn-tactical-action" id="btn-reset-filters">Restaurar Todas as 18 Provas</button>
        </div>
      `;
      document.getElementById("btn-reset-filters")?.addEventListener("click", () => {
        state.selectedCategory = "todas";
        state.selectedSwimmerFilter = null;
        renderArenaTab();
      });
      return;
    }

    eventsGrid.innerHTML = filteredEvents.map((event) => {
      const slot0Id = state.lineup[event.id]?.[0] || "";
      const slot1Id = state.lineup[event.id]?.[1] || "";
      const tactic0 = state.tacticsByEvent[event.id]?.[0] || "equilibrada";
      const tactic1 = state.tacticsByEvent[event.id]?.[1] || "equilibrada";

      function renderSlot(slotIndex, swimmerId, tactic) {
        if (!swimmerId) {
          return `
            <button type="button" class="slot-empty-btn" data-event-id="${event.id}" data-slot="${slotIndex}" data-gender="${event.gender}">
              <span class="slot-add-icon">➕</span>
              <span>Escalar ${slotIndex === 0 ? "1º" : "2º"} Atleta (${event.categoryLabel})</span>
            </button>
          `;
        }

        const s = swimmersMap[swimmerId];
        if (!s) {
          return `
            <button type="button" class="slot-empty-btn" data-event-id="${event.id}" data-slot="${slotIndex}" data-gender="${event.gender}">
              <span class="slot-add-icon">➕</span>
              <span>Escalar Atleta</span>
            </button>
          `;
        }

        const projected = getProjectedEventTime(s, event, currentMeet, 0, tactic);
        const prediction = getMedalPrediction(projected, event);
        const assignedCount = counts[s.id] || 0;

        const tacticLabels = {
          explosiva: "🚀 Explosiva",
          equilibrada: "⏱️ Equilibrada",
          negativa: "🌊 Volta Negativa",
          economica: "🛡️ Gestão"
        };

        return `
          <div class="slot-filled-card">
            <div class="slot-swimmer-main" data-event-id="${event.id}" data-slot="${slotIndex}" data-gender="${event.gender}" title="Clique para trocar de atleta">
              <div class="swimmer-avatar-mini" style="border-color:${state.club.color};">${s.gender === "M" ? "🏊‍♂️" : "🏊‍♀️"}</div>
              <div class="slot-swimmer-details">
                <div class="slot-swimmer-name-row">
                  <strong>${s.name}</strong>
                  <span class="slot-time-badge">⏱️ ${formatTime(projected)}</span>
                </div>
                <div class="slot-swimmer-sub">
                  <span class="medal-prediction-badge ${prediction.className}">${prediction.text}</span>
                  <span class="workload-mini-pill">${assignedCount}/4 provas</span>
                </div>
              </div>
            </div>

            <div class="slot-tactics-bar">
              <button type="button" class="slot-tactic-cycle-btn tactic-${tactic}" data-event-id="${event.id}" data-slot="${slotIndex}" title="Clique para alternar o ritmo da prova">
                ${tacticLabels[tactic] || tactic}
              </button>
              <button type="button" class="slot-remove-btn" data-event-id="${event.id}" data-slot="${slotIndex}" title="Remover atleta da prova">
                ✕
              </button>
            </div>
          </div>
        `;
      }

      return `
        <article class="event-tactical-card" data-category="${event.category}">
          <div class="event-card-head">
            <span class="event-badge">${event.categoryLabel} • ${event.distance}m ${event.stroke.toUpperCase()}</span>
            <span class="event-badge" style="color:var(--gold); border-color:var(--gold);">18 pts em jogo</span>
          </div>

          <h4 class="event-name">${event.label}</h4>
          <div class="event-records-line">
            WR <strong>${event.wrLabel.replace("WR ", "")}</strong> • BR <strong>${event.brLabel.replace("BR ", "")}</strong>
          </div>

          <div class="event-slots-container">
            <div class="swim-slot-item">
              ${renderSlot(0, slot0Id, tactic0)}
            </div>
            <div class="swim-slot-item">
              ${renderSlot(1, slot1Id, tactic1)}
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Bindings de clique nos slots vazios ou no nome do nadador para abrir o Picker Modal
    eventsGrid.querySelectorAll(".slot-empty-btn, .slot-swimmer-main").forEach((el) => {
      el.addEventListener("click", () => {
        const evId = el.dataset.eventId;
        const slot = Number(el.dataset.slot);
        const gender = el.dataset.gender;
        openSwimmerPicker(evId, slot, gender);
      });
    });

    // Binding para ciclar estratégias de nado com 1 clique
    const TACTIC_CYCLE = ["explosiva", "equilibrada", "negativa", "economica"];
    eventsGrid.querySelectorAll(".slot-tactic-cycle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const evId = btn.dataset.eventId;
        const slot = Number(btn.dataset.slot);
        state.tacticsByEvent[evId] = state.tacticsByEvent[evId] || ["equilibrada", "equilibrada"];
        const current = state.tacticsByEvent[evId][slot] || "equilibrada";
        const nextIdx = (TACTIC_CYCLE.indexOf(current) + 1) % TACTIC_CYCLE.length;
        state.tacticsByEvent[evId][slot] = TACTIC_CYCLE[nextIdx];
        saveState();
        renderArenaTab();
      });
    });

    // Binding para remover nadador da raia
    eventsGrid.querySelectorAll(".slot-remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const evId = btn.dataset.eventId;
        const slot = Number(btn.dataset.slot);
        if (state.lineup[evId]) {
          state.lineup[evId][slot] = "";
          saveState();
          renderArenaTab();
        }
      });
    });
  }

  function renderArenaTab() {
    const currentMeet = getMeetInfo();
    const heroTitle = document.getElementById("stage-hero-title");
    const heroDesc = document.getElementById("stage-hero-desc");
    const heroCity = document.getElementById("stage-hero-city");
    const heroWeek = document.getElementById("stage-hero-week");

    if (heroTitle) heroTitle.textContent = currentMeet.name;
    if (heroDesc) heroDesc.textContent = currentMeet.note;
    if (heroCity) heroCity.textContent = currentMeet.city;
    if (heroWeek) heroWeek.textContent = `Semana ${currentMeet.week} • Circuito Nacional`;

    // Banner de aquecimento
    const buffBannerContainer = document.getElementById("arena-buff-banner-container");
    if (buffBannerContainer) {
      if (state.minigameBuff) {
        buffBannerContainer.innerHTML = `
          <div class="buff-banner" style="display:flex; justify-content:space-between; align-items:center; padding:14px 20px; background:rgba(0, 242, 254, 0.12); border:1px solid var(--cyan-neon); border-radius:var(--radius-md); margin-bottom:20px;">
            <div>
              <strong style="color:var(--cyan-neon); font-size:0.95rem;">⚡ AQUECIMENTO ATIVO (-${(state.minigameBuff.timeReduction || 0).toFixed(2)}s)</strong>
              <span style="display:block; font-size:0.8rem; color:var(--text-muted);">${state.minigameBuff.buffSummary}</span>
            </div>
            <button type="button" class="swim-action-btn swim-action-btn--secondary" id="btn-re-warmup" style="padding:6px 14px; font-size:0.8rem;">
              Refazer Aquecimento
            </button>
          </div>
        `;
        document.getElementById("btn-re-warmup")?.addEventListener("click", openWarmupModal);
      } else {
        buffBannerContainer.innerHTML = "";
      }
    }

    renderWorkloadStrip();
    renderTacticalEventGrid();
  }

  function renderRosterTab() {
    const container = document.getElementById("swimmer-cards-grid");
    if (!container) return;

    const swimmers = getSelectedSwimmers().map(getAdjustedSwimmer);
    container.innerHTML = swimmers.map((s) => `
      <article class="swimmer-card">
        <div class="swimmer-card-head">
          <div class="swimmer-avatar" style="border-color:${state.club.color};">
            ${s.gender === "M" ? "🏊‍♂️" : "🏊‍♀️"}
          </div>
          <div class="swimmer-identity">
            <strong>${s.name}</strong>
            <span>${s.age} anos • ${s.tag}</span>
          </div>
        </div>

        <div class="swimmer-stats-table">
          <div class="stat-item"><span>Velocidade:</span> <strong>${s.sprint}</strong></div>
          <div class="stat-item"><span>Resistência:</span> <strong>${s.endurance}</strong></div>
          <div class="stat-item"><span>Técnica:</span> <strong>${s.technique}</strong></div>
          <div class="stat-item"><span>Viradas:</span> <strong>${s.turns}</strong></div>
          <div class="stat-item"><span>Recuperação:</span> <strong>${s.recovery}</strong></div>
          <div class="stat-item"><span>Frescor:</span> <strong>${s.freshness}%</strong></div>
        </div>

        <div class="swimmer-medals-strip">
          <span>🥇 ${s.golds || 0}</span>
          <span>🥈 ${s.silvers || 0}</span>
          <span>🥉 ${s.bronzes || 0}</span>
          <span style="margin-left:auto; color:var(--cyan-neon); font-size:0.75rem;">$${s.salary}k/mês</span>
        </div>
      </article>
    `).join("");
  }

  function renderCircuitTab() {
    const tableBody = document.getElementById("circuit-standings-body");
    if (!tableBody) return;

    const standings = state.season?.overallStandings || [
      { name: getClubName(), points: 0, gold: 0, silver: 0, bronze: 0, isPlayer: true }
    ];

    tableBody.innerHTML = standings.map((entry, idx) => `
      <tr class="${entry.isPlayer ? "is-user-team" : ""}">
        <td><strong>${idx + 1}º</strong></td>
        <td><strong>${entry.name}</strong></td>
        <td style="color:var(--gold);"><strong>${entry.gold || 0}</strong></td>
        <td style="color:var(--silver);"><strong>${entry.silver || 0}</strong></td>
        <td style="color:var(--bronze);"><strong>${entry.bronze || 0}</strong></td>
        <td><strong style="color:var(--cyan-neon); font-size:1.1rem;">${entry.points || 0}</strong> pts</td>
      </tr>
    `).join("");
  }

  function renderDilemmasTab() {
    const container = document.getElementById("dilemma-container");
    if (!container) return;

    if (!state.activeDilemma) {
      container.innerHTML = `
        <div class="dilemma-card" style="border-color:var(--line);">
          <div class="dilemma-head">
            <span class="dilemma-tag">Vestiário em Calmaria</span>
          </div>
          <h3 class="dilemma-title">Nenhuma Crise Imediata</h3>
          <p class="dilemma-text">O foco da equipe está 100% voltado para as raias na etapa atual. Continue o bom trabalho de gestão!</p>
        </div>
      `;
      return;
    }

    const d = state.activeDilemma;
    container.innerHTML = `
      <div class="dilemma-card">
        <div class="dilemma-head">
          <span class="dilemma-tag">⚠️ ${d.tag}</span>
        </div>
        <h3 class="dilemma-title">${d.title}</h3>
        <p class="dilemma-text">${d.text}</p>
        <div class="dilemma-choices-grid">
          ${d.choices.map((c) => `
            <div class="choice-box" data-choice-id="${c.id}">
              <div>
                <strong>${c.label}</strong>
                <p>${c.description}</p>
              </div>
              <div class="choice-badges">
                ${Object.entries(c.effects).map(([key, val]) => `<span class="effect-badge is-buff">${key}: ${val > 0 ? "+" : ""}${val}</span>`).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    container.querySelectorAll(".choice-box").forEach((box) => {
      box.addEventListener("click", () => {
        const choiceId = box.dataset.choiceId;
        const choice = d.choices.find((c) => c.id === choiceId);
        if (choice) {
          applyDilemmaChoice(choice);
        }
      });
    });
  }

  function applyDilemmaChoice(choice) {
    if (choice.effects.budget && state.season) state.season.treasury += choice.effects.budget;
    if (choice.effects.morale && state.season) state.season.morale = clamp(state.season.morale + choice.effects.morale, 20, 100);
    if (choice.effects.chemistry && state.season) state.season.chemistry = clamp(state.season.chemistry + choice.effects.chemistry, 20, 100);
    if (choice.effects.boardTrust && state.season) state.season.boardTrust = clamp(state.season.boardTrust + choice.effects.boardTrust, 20, 100);

    // Bônus de recuperação de frescor de todo o elenco
    if (choice.effects.freshnessRecovery && state.season?.freshness) {
      getSelectedSwimmers().forEach((s) => {
        state.season.freshness[s.id] = clamp((state.season.freshness[s.id] || 90) + choice.effects.freshnessRecovery, 50, 100);
      });
    }

    // Bônus de atributos nos nadadores
    ["sprint", "endurance", "technique", "turns", "recovery", "mentality"].forEach((attr) => {
      if (choice.effects[attr] && state.season?.progress) {
        getSelectedSwimmers().forEach((s) => {
          state.season.progress[s.id] = state.season.progress[s.id] || {};
          state.season.progress[s.id][attr] = (state.season.progress[s.id][attr] || 0) + choice.effects[attr];
        });
      }
    });

    if (choice.effects.timeReduction) {
      state.minigameBuff = {
        tier: "dilemma",
        timeReduction: choice.effects.timeReduction,
        buffSummary: "Vantagem Tática de Bastidores!"
      };
    }

    state.storyDecisionsHistory.push({
      dilemma: state.activeDilemma.title,
      choice: choice.label,
      week: state.season ? state.season.currentMeetIndex + 1 : 1
    });
    state.activeDilemma = null;
    saveState();
    render();
  }

  function openWarmupModal() {
    const modal = document.getElementById("natacao-minigame-modal");
    const container = document.getElementById("natacao-minigame-container");
    if (!modal || !container) return;

    modal.style.display = "flex";
    container.innerHTML = "";

    window.TemporadaTotal.MinigamesEngine.launchMinigame(container, {
      sportId: "natacao",
      gameState: state,
      onBuffApplied: (buff) => {
        state.minigameBuff = buff;
        saveState();
        renderArenaTab();
      },
      onPlayLive: () => {
        modal.style.display = "none";
        render();
        runLiveMeetSimulation();
      },
      onSimulate: () => {
        modal.style.display = "none";
        render();
        simulateFastMeet();
      },
      onFinish: () => {
        modal.style.display = "none";
        render();
      },
      onCancel: () => {
        modal.style.display = "none";
        render();
      }
    });
  }

  function bindEvents() {
    // Abas de navegação
    document.querySelectorAll(".swim-nav-pill").forEach((pill) => {
      pill.addEventListener("click", () => switchTab(pill.dataset.tab));
    });

    // Filtros de Categoria de Prova
    document.querySelectorAll(".event-cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".event-cat-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.selectedCategory = btn.dataset.category;
        renderTacticalEventGrid();
      });
    });

    // Ações táticas da Arena
    document.getElementById("btn-auto-lineup")?.addEventListener("click", autoLineup);
    document.getElementById("btn-optimize-tactics")?.addEventListener("click", optimizeTactics);
    document.getElementById("btn-clear-lineup")?.addEventListener("click", clearLineup);

    // Fechar modal do seletor de nadador
    document.getElementById("btn-close-picker")?.addEventListener("click", closeSwimmerPicker);

    // Botões de simulação e arcade
    document.getElementById("btn-live-race")?.addEventListener("click", runLiveMeetSimulation);
    document.getElementById("btn-fast-sim")?.addEventListener("click", simulateFastMeet);
    document.getElementById("btn-warmup-arcade")?.addEventListener("click", openWarmupModal);

    // Botão de sortear novas propostas (Roll)
    document.getElementById("btn-roll-proposals")?.addEventListener("click", () => {
      state.currentProposals = generateProceduralClubProposals();
      renderDraftScreen();
    });

    // Botão na topbar para trocar de clube / reiniciar
    document.getElementById("btn-topbar-new-draft")?.addEventListener("click", () => {
      if (confirm("Deseja sortear novos clubes procedurais e iniciar um novo contrato?")) {
        startNewDraft();
      }
    });
  }

  function render() {
    renderDraftScreen();
    if (!state.isInDraftMode) {
      renderTopBar();
      renderArenaTab();
      renderRosterTab();
      renderCircuitTab();
      renderDilemmasTab();
    }
  }

  // ==========================================================================
  // INICIALIZAÇÃO DO JOGO
  // ==========================================================================
  loadState();

  if (!state.currentProposals || state.currentProposals.length === 0) {
    state.currentProposals = generateProceduralClubProposals();
  }

  // Se não houver temporada salva no localStorage:
  if (!state.season) {
    const firstProposal = state.currentProposals[0];
    state.club = firstProposal;
    state.selectedIds = firstProposal.startingRosterIds;
    state.season = createSeason();
    state.lineup = createEmptyLineup();
    state.tacticsByEvent = createEmptyTactics();
    autoLineup();

    // Se estiver em navegador real, exibe o Draft para o jogador escolher o seu clube!
    if (typeof window !== "undefined" && typeof document !== "undefined" && document.getElementById) {
      state.isInDraftMode = true;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    render();
    if (!state.isInDraftMode) {
      switchTab(state.activeTab || "arena");
    }
  });

  namespace.SwimmingEngine = {
    state,
    SWIMMING_CLUBS,
    EVENT_DEFINITIONS,
    MARKET,
    MEETS,
    SWIMMING_DILEMMAS,
    autoLineup,
    optimizeTactics,
    clearLineup,
    openSwimmerPicker,
    closeSwimmerPicker,
    generateProceduralClubProposals,
    generateProceduralLeagueClubs,
    selectClubProposal,
    startNewDraft,
    runLiveMeetSimulation,
    simulateFastMeet,
    openWarmupModal,
    switchTab,
    saveState,
    loadState,
    validateLineup,
    getProjectedEventTime,
    getAdjustedSwimmer,
    getSelectedSwimmers,
    getMeetInfo,
    applyDilemmaChoice,
    getAssignmentCounts
  };
})();
