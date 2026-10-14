# Contexto do Projeto

`A temporada` e um conjunto de jogos de gerenciamento esportivo. A ideia base e sempre a mesma: montar uma equipe, administrar recursos, treinar, simular uma temporada e reagir aos acontecimentos. Cada modalidade e uma interpretacao desse jogo base.

## Estado atual

- `temporada-basquete/`, `temporada-volei/` e `Temporada Futsal/` compartilham quase a mesma estrutura de UI, saves, mercado, comissao, eventos, lesoes, editor e liga.
- `temporada-natacao/` usa o mesmo conceito de temporada, mas com regras bem diferentes: provas, tempos, meetings e lineup por evento.
- `shared/base-game.js` e o novo ponto comum. Ele cria `window.TemporadaTotal`, registra o manifesto da modalidade e expoe o runtime atual em `window.SEASON_RUNTIME`.
- Cada pasta de modalidade tem um `sport-manifest.js`. Esse arquivo descreve a modalidade sem misturar dados grandes de atletas ou regras longas.

## Modelo mental

Pense em tres camadas:

1. **Jogo base**: estado, saves, helpers, calendario, tabela, renderizacao comum e contratos entre UI e simulacao.
2. **Adaptador da modalidade**: como calcular rating, como simular partida/prova, como pontuar tabela e quais atributos importam.
3. **Conteudo da modalidade**: atletas, adversarios, decisoes, treinos, textos, escudos e configuracoes customizadas.

Hoje os scripts grandes ainda misturam as tres camadas. A modularizacao inicial cria o encaixe para separar isso com seguranca nas proximas edicoes.

## Arquivos importantes

- `shared/base-game.js`: nucleo compartilhado e registro de runtime.
- `shared/match-events.js`: contrato comum de eventos e estatisticas por jogador.
- `shared/live-simulation.js`: controlador de simulacao ao vivo com start, pause, tick, velocidade e finalizar.
- `shared/live-match-ui.js`: UI reaproveitavel de placar, controles, log e tabela dinamica de stats.
- `shared/phaser-enhancements.js`: camada visual opcional com Phaser, usada apenas para animar cards, cabecalhos e a partida ao vivo sem alterar simulacao, save ou resultados.
- `shared/live-coaching.js`: comandos continuos de tecnico para mudar tatica, ritmo, rotacao, pressao, foco ofensivo e risco durante a simulacao ao vivo.
- `shared/seeded-rng.js`: RNG deterministico usado pela camada procedural.
- `shared/procedural-datasets.js`: nomes, municipios, sufixos por esporte e perfis base do procedural.
- `shared/procedural-lore-datasets.js`: 100 lores reais estruturadas a partir da pasta `Lores e decisoes`, com indice leve das decisoes especificas por lore.
- `shared/procedural-player-generator.js`: geracao procedural de atletas.
- `shared/procedural-roster-generator.js`: geracao procedural de elencos.
- `shared/procedural-club-calibration.js`: camada pos-geracao que calibra clubes por lore, tier, estilo, idade, folha e warnings.
- `shared/procedural-club-generator.js`: geracao procedural de clubes com lore, orcamento, elenco, objetivo, pressao e scout notes.
- `shared/procedural-league-generator.js`: geracao de liga procedural completa em modo preview, usando clubes calibrados.
- `shared/procedural-league-debug.js`: diagnostico estatistico da liga procedural, com distribuicao de forca, folha, idade, prospects e warnings.
- `shared/procedural-season-simulator.js`: simulacao isolada de temporadas procedurais para testar comportamento dos clubes gerados.
- `shared/procedural-narrative-debug.js`: diagnostico narrativo da liga procedural, cruzando objetivo, lore, resultado simulado e sensibilidade a decisoes.
- `shared/procedural-decision-engine.js`: motor de decisoes procedurais em laboratorio, traduzindo efeitos narrativos para `teamState` e `teamEffects` de simulacao.
- `shared/procedural-rotation-engine.js`: motor procedural de titulares, rotacao e minutos, convertendo filosofia do usuario em uso de elenco e efeitos esportivos.
- `shared/procedural-career-lab.js`: primeira integracao controlada da carreira procedural, comparando temporada base contra temporada com decisoes do usuario.
- `shared/procedural-market-generator.js`: gerador isolado de agentes livres procedurais por seed e perfil de mercado, ainda sem contratacao real ou alteracao de save.
- `shared/game-state.js`: estado global isolado da primeira temporada procedural jogavel.
- `shared/calendar-engine.js`: calendario procedural com eventos de treino, descanso, jogo, narrativa e mercado.
- `shared/game-shell-ui.js`: shell da carreira procedural isolada, com abas internas.
- `shared/calendar-ui.js`: UI da aba Calendario.
- `shared/roster-ui.js`: UI da aba Elenco.
- `shared/player-card-ui.js`: card reutilizavel de atleta.
- `shared/team-hub-ui.js`: UI da aba Equipe.
- `shared/README.md`: resumo rapido da pasta compartilhada.
- `*/sport-manifest.js`: manifesto de cada modalidade.
- `temporada-basquete/match-adapter.js`: primeiro adaptador funcional de partida ao vivo.
- `temporada-basquete/generation-config.js`: configuracao procedural de basquete, com atributos, posicoes, arquetipos, tiers e salario.
- `temporada-basquete/procedural.html`: laboratorio procedural isolado do basquete, sem carregar `script.js`, mercado real ou saves.
- `temporada-basquete/script.js`: ainda concentra o jogo legado; na P7.1 passou a expor `getLegacyBasketballMarketSnapshot` apenas como leitura segura do mercado fixo para comparacao procedural.
- `temporada-volei/match-adapter.js`: adaptador funcional de partida ao vivo do volei, com sets, rotacao e estatisticas por atleta.
- `temporada-volei-feminino/index.html`: entrada procedural do volei feminino, reaproveitando o motor do volei com geracao feminina e saves separados.
- `Temporada Futsal/match-adapter.js`: stub preparado para replicar a arquitetura do basquete.
- `*/custom-config.js`: personalizacoes de times, escudos e decisoes.
- `*/script.js`: adaptador legado com regras, dados e renderizacao daquela modalidade.
- `Clique aqui para jogar.html`: entrada principal enxuta, com Basquete Procedural, Volei Masculino e Volei Feminino.

## Como editar daqui para frente

- Mudancas que valem para basquete, volei e futsal devem primeiro ser pensadas como jogo base.
- Mudancas de regra especifica devem ficar no adaptador da modalidade.
- Conteudo novo deve ir para `custom-config.js` quando for personalizacao, ou para dados da modalidade quando fizer parte do jogo padrao.
- Antes de mexer em uma funcao duplicada, procurar equivalentes nos tres scripts de quadra. Se a assinatura for parecida, a funcao e candidata a ir para `shared/`.
- No fluxo principal, evitar termos tecnicos como seed, preview, calibragem, sandbox e save legado. Esses termos devem ficar em `Modo Desenvolvedor` ou em documentos de arquitetura.

## Contrato do manifesto

Campos atuais:

- `id`: identificador curto.
- `label`: nome exibivel.
- `storageKey`: chave principal de save.
- `customConfigStorageKey`: chave de editor customizado, quando existir.
- `rosterUnit`: nome da unidade do elenco.
- `defaultDivision`: categoria inicial.
- `defaultTrainingFocus`: treino inicial.
- `scoreModel`: tipo de placar.
- `standingsModel`: tipo de classificacao.
- `sharedFamily`: familia estrutural da modalidade.
- `coreLoop`: fluxo de jogo.
- `primaryStats`: atributos principais.
- `sportSpecificRules`: regras que pertencem so aquela modalidade.

## Proxima modularizacao recomendada

1. Extrair helpers puros repetidos: `clamp`, `roundStat`, `randomBetween`, `escapeHtml`, `formatHeightCm`.
2. Extrair saves e abas para um modulo comum.
3. Extrair staff, psicologia, scouting e decisoes para modulos compartilhados dos esportes de quadra.
4. Deixar cada modalidade com apenas dados, simulador e textos especificos.

## Simulacao ao vivo

A camada de partida ao vivo funciona por ticks:

1. `shared/live-simulation.js` controla status, velocidade e ciclo.
2. O adaptador da modalidade gera um evento por tick.
3. `shared/match-events.js` aplica placar e deltas de estatisticas.
4. `shared/live-match-ui.js` renderiza o estado usando o schema da modalidade.
5. `shared/live-coaching.js` permite alterar o estado `coaching` enquanto a partida esta rodando.

No basquete, a partida ao vivo fica na central rapida e, ao terminar, grava resultado no formato antigo da temporada e acumula `season.playerStats`. Volei e futsal devem repetir o mesmo padrao trocando apenas as regras dos seus adaptadores.

Intervencoes continuas atuais no basquete:

- tatica: equilibrada, defesa, correr, proteger vantagem, desenvolver;
- ritmo: lento, normal, rapido;
- rotacao: equilibrada, banco curto, jovens, poupar, defensiva;
- pressao defensiva: baixa, normal, alta;
- foco ofensivo: equilibrado, garrafao, bolas de 3, estrela;
- risco: seguro, normal, alto.

Essas mudancas podem ser feitas durante a simulacao ao vivo. Os proximos ticks passam a considerar o novo estado sem reiniciar a partida.

## Camada procedural

A camada procedural do basquete esta em modo de preview/laboratorio. Ela nao substitui saves, mercado ou temporada real.

Na carreira procedural, o mercado usa o orcamento gerado pela lore do clube. A UI da aba Mercado mostra `dinheiro disponivel`, `orcamento da lore` e `folha atual` a partir de `state.summary.budget`, `state.summary.totalSalary` e `state.summary.budgetLeft`.

No jogo completo do basquete, o mercado fixo continua usando os IDs antigos `market-budget-left` e `market-budget-used`; eles foram apenas destacados visualmente para deixar claro quanto dinheiro ainda esta disponivel.

Os jogadores procedurais de basquete continuam carregando atributos especificos como `threePoint`, `physical`, `tactical`, `technique` e `defense`. Os cards da carreira procedural mostram esses valores em um raio-x ao passar o mouse ou focar o card pelo teclado.

Na Etapa 5 da direcao visual, o mercado procedural passou a tratar cada oportunidade como decisao comparativa: card com perfil, forca principal, risco, botao `Comparar`, botao `Contratar` e painel atleta do mercado x jogador comparavel do elenco.

Na Etapa 6 da direcao visual, o elenco procedural ganhou cards mais vivos: status fisico, forma recente, papel no grupo, scout curto, raio-x de atributos e acoes rapidas desativadas para futuras interacoes como poupar, alterar funcao e conversar.

Na Etapa 7, o log da carreira procedural ganhou a apresentacao `season-backstage-feed`. A Central mostra bastidores recentes da semana, e a aba Diario mostra a temporada como narrativa curta de decisoes, resultados, mercado, treino e reacoes internas.

Na Etapa 8, a partida ao vivo ganhou apresentacao de transmissao: ultimo lance, posse estimada, momento do jogo, acoes rapidas e estatisticas completas recolhidas. As acoes rapidas reaproveitam coaching/velocidade/pausa existentes, sem reescrever o simulador.

Na Etapa 9, a UI procedural recebeu microinteracoes leves: pulso em botoes principais, destaque curto para evento novo, painel lateral de comparacao do mercado e regra global de `prefers-reduced-motion`.

Na Etapa 10, a revisao final de experiencia limpou termos tecnicos visiveis no fluxo principal: a navegacao usa `Carreira` e `Bastidores`, `Lore` virou `Contexto`, e fallbacks de interface usam linguagem de carreira em vez de laboratorio/procedural.

Correcao visual importante: cards claros dentro de `procedural-game-root` nao devem herdar texto claro. `metric-card`, `procedural-metric`, notas, badges e tabelas da carreira possuem regra de contraste com texto escuro para evitar branco sobre branco.

Foi criado `PLANO_MIGRACAO_VISUAL_VOLEI.md` para levar a experiencia visual do basquete ao volei, adaptando tudo para sets, rally, saque, recepcao, ataque, bloqueio e defesa.

Diagnostico de decisoes: a carreira jogavel carrega o banco de 2000 decisoes em `shared/procedural-decision-bank-data.js` e sorteia via `shared/procedural-decision-bank.js`. O sorteio considera seed, esporte, time, lore, objetivo e historico para evitar trilhas clonadas. O volei filtra/adapta termos para nao puxar vocabulario de basquete.

Identidade de clubes: `shared/procedural-datasets.js` possui listas especificas para basquete e volei. Clubes de volei nao devem usar sufixos como `Basquete`; eles usam municipios e nomes voltados a rede, saque, bloqueio, praia, vale, serra e rotacao.

O fluxo atual e:

```txt
Seed -> Lore real -> Clube -> Orcamento -> Elenco -> Atletas -> Liga -> Preview/CSV
```

Arquivos de apoio:

- `Lores e decisoes/Banco_100_Lores_Liga.md`: fonte manual das 100 lores.
- `Lores e decisoes/Banco_2000_Decisoes_Ramificadas_Unificado.json`: banco grande de decisoes ramificadas.
- `tools/build-procedural-lore-datasets.js`: converte as lores manuais para `shared/procedural-lore-datasets.js`.
- `tools/export-procedural-club-seeds.js`: exporta CSV de clubes.
- `tools/export-procedural-full-calibration.js`: exporta CSV completo de clubes e atletas.
- `tools/export-procedural-calibration-comparison.js`: exporta comparativo raw vs calibrado.
- `tools/export-procedural-league-debug.js`: exporta CSV de diagnostico de varias ligas procedurais.
- `tools/export-procedural-season-simulations.js`: exporta resultados de temporadas simuladas em varias ligas procedurais.
- `tools/export-procedural-narrative-debug.js`: exporta diagnostico narrativo e impacto hipotetico de decisoes por liga/clube.
- `tools/export-procedural-decision-impact.js`: exporta comparativo de impacto das decisoes procedurais por liga/clube usando o banco real de 2000 decisoes.
- `tools/export-procedural-career-lab.js`: exporta impacto da carreira experimental P6 por filosofia de decisao do usuario.
- `tools/export-live-coaching-impact.js`: exporta calibragem dos comandos continuos da partida ao vivo.
- `tools/export-procedural-market-preview.js`: exporta mercados procedurais em preview para calibrar agentes livres por perfil.
- `analises/calibragem-completa-clubes-100-seeds.csv`: calibragem atual de 100 clubes com lores reais.
- `analises/calibragem-completa-atletas-100-seeds.csv`: calibragem atual de 1200 atletas com lores reais.
- `analises/comparativo-calibragem-clubes-100-seeds.csv`: comparacao entre clube cru e clube calibrado.
- `analises/debug-ligas-50-seeds.csv`: diagnostico P5 com 50 ligas.
- `analises/simulacao-ligas-50-seeds.csv`: resumo de 50 temporadas procedurais simuladas.
- `analises/simulacao-classificacoes-50-seeds.csv`: classificacoes completas das 50 temporadas simuladas.
- `analises/narrativa-ligas-50-seeds.csv`: resumo narrativo P5.4 por liga.
- `analises/narrativa-clubes-50-seeds.csv`: diagnostico narrativo P5.4 por clube.
- `analises/impacto-decisoes-ligas-25-seeds.csv`: resumo P5.5 do impacto de pacotes de decisoes por liga.
- `analises/impacto-decisoes-clubes-25-seeds.csv`: diagnostico P5.5 do impacto de pacotes de decisoes por clube.
- `analises/carreira-experimental-50-seeds.csv`: diagnostico P6.0 do impacto das filosofias de decisao do usuario.
- `analises/impacto-comandos-ao-vivo-120-jogos.csv`: calibragem P6.3 dos comandos continuos de partida ao vivo.
- `analises/mercado-procedural-50-seeds.csv`: resumo P7.0 dos mercados procedurais gerados por seed e perfil.
- `analises/mercado-procedural-jogadores-50-seeds.csv`: lista P7.0 dos atletas gerados para o mercado procedural.
- `analises/mercado-procedural-encaixes-50-seeds.csv`: ranking P7.2 de encaixes entre clube gerado e mercado procedural.

Estado da calibragem atual:

- A exportacao foi refeita com o prefixo `CALIBRAGEM-BASQUETE-LORES-REAIS`.
- A amostra atual tem 100 clubes e 1200 atletas.
- A camada de calibragem pos-geracao esta ativa no gerador de clubes.
- Para obter o clube cru em testes, chamar `generateProceduralBasketballClub(seed, { calibrate: false })`.
- Para obter o clube calibrado, chamar `generateProceduralBasketballClub(seed)` ou `{ calibrate: true }`.
- No comparativo atual, os warnings pos-calibragem ficaram zerados nas 100 seeds e a pressao salarial maxima calibrada caiu para 127.8%.
- A P4 foi iniciada: `generateProceduralBasketballLeague(seed, { size: 16 })` gera uma liga em preview com ranking, favoritos, briga por playoffs, parte baixa e clube inicial do usuario.
- A aba Procedural do basquete possui o modo `Liga gerada`.
- A P5 foi iniciada: `analyzeProceduralLeague(league)` mede o balanceamento estatistico da liga.
- O primeiro debug de 50 ligas indicou gap medio topo/fundo de 4.9 de overall e 32 ligas com algum warning; a proxima calibragem deve abrir mais distancia entre favoritos e parte baixa.
- A P5.1 foi iniciada: `simulateProceduralLeagueSeason(league)` simula uma temporada procedural isolada.
- Em 50 ligas simuladas, o top 4 medio preservado foi 56%, a taxa media de zebra foi 13.8% e a correlacao media entre ranking projetado e simulado foi 0.595.
- A leitura atual e que a simulacao tem taxa de zebra plausivel, mas a geracao da liga ainda esta compactada.
- A P5.2 abriu a diferenca entre faixas da liga com `applyLeagueStrengthCalibration` em `shared/procedural-league-generator.js`.
- Depois da P5.2, em 50 ligas:
  - gap medio topo/fundo: 8.1;
  - warnings de debug: 8 de 50;
  - top 4 medio preservado em simulacao: 67%;
  - taxa media de zebra: 17.1%;
  - correlacao media ranking projetado vs simulado: 0.749;
  - warnings de simulacao: 3 ligas;
  - warnings de geracao: 5 ligas.
- A P5.3 calibrou a composicao/diversidade de tiers com `ensureLeagueTierDiversity` em `shared/procedural-league-generator.js`.
- Em ligas de 16 clubes, o alvo minimo atual e 3 clubes `low` e 3 clubes `good`.
- Depois da P5.3, em 50 ligas:
  - gap medio topo/fundo: 8.1;
  - warnings de debug: 0 de 50;
  - top 4 medio preservado em simulacao: 67%;
  - taxa media de zebra: 17.1%;
  - correlacao media ranking projetado vs simulado: 0.749;
  - warnings de simulacao: 3 ligas;
  - warnings de geracao: 0 ligas.
- A P5.4 criou `analyzeProceduralNarrative(league, simulation)` e adicionou `teamEffects` opcionais em `simulateProceduralLeagueSeason`.
- A P5.4 mede se objetivos, lores e resultados simulados combinam, alem de testar cenarios hipoteticos de boas/mas decisoes por clube.
- Resultado P5.4 em 50 ligas:
  - 800 clubes analisados;
  - objetivos coerentes em media: 52%;
  - ligas com warnings narrativos: 50 de 50;
  - clubes com lore de decisao forte e baixo impacto simulado: 159.
- A P5.5 criou o motor de decisoes procedurais em laboratorio.
- O motor usa o banco real de 2000 decisoes somente nos exports/ferramentas; o JSON pesado nao foi conectado ao runtime normal do browser.
- Estrategias testadas na P5.5:
  - `balanced`;
  - `aggressive`;
  - `development`;
  - `conservative`;
  - `crisis_control`;
  - `lore_fit`.
- Resultado P5.5 em 25 seeds:
  - 150 cenarios de liga;
  - 2400 linhas de clube;
  - troca media de campeao: 13.3%;
  - troca de campeao no modo `lore_fit`: 20%;
  - swing medio absoluto de ranking: 0.8;
  - swing medio absoluto de vitorias: 0.3.
- A P6.0 criou o modo `Carreira experimental` dentro da aba Procedural do basquete.
- O modo P6.0 nao cria save, nao altera mercado, nao altera temporada principal e nao mexe em `localStorage`.
- O usuario escolhe uma filosofia de decisao e ve comparacao entre temporada base e temporada influenciada por suas decisoes.
- Filosofias disponiveis:
  - equilibrada;
  - agressiva;
  - desenvolvimento de jovens;
  - controle de carga;
  - controle de crise;
  - coerente com a lore.
- Resultado P6.0 em 50 seeds:
  - 300 cenarios;
  - swing medio absoluto de ranking: 0.3;
  - swing medio absoluto de vitorias: 0.2;
  - troca de campeao: 4%.
- A P6.1 criou o motor de titulares, rotacao e minutos em laboratorio.
- Planos atuais de rotacao:
  - `balanced`;
  - `short_rotation`;
  - `development`;
  - `load_management`;
  - `defense_first`.
- A carreira experimental agora mostra plano de rotacao, atletas ativos, media dos titulares/banco, minutos de prospects, carga do top 5 e tabela de minutagem.
- Resultado P6.1 em 50 seeds:
  - 300 cenarios;
  - swing medio absoluto de ranking: 1.5;
  - swing medio absoluto de vitorias: 0.8;
  - troca de campeao: 14.7%.
- A P6.2 criou intervencoes continuas durante a simulacao ao vivo no basquete.
- `createLiveSimulation` agora expoe `setCoaching(patch, meta)`.
- O adapter de basquete le `state.coaching` a cada posse para alterar ritmo, erros, faltas, perfil de arremesso, defesa e uso de titulares/banco.
- A P6.3 criou a calibragem dos comandos ao vivo.
- Resultado P6.3 em 120 jogos por cenario:
  - `baseline`: 87.4 pontos da casa, margem +1.7, 23.5 bolas de 3 tentadas, 13.7 erros;
  - `run_and_gun_3pt`: 93.4 pontos, margem -1.0, 33.5 bolas de 3, 18.8 erros;
  - `defense_high_pressure`: 79.1 pontos, margem +4.2, 22.7 bolas de 3, 11.4 erros;
  - `protect_lead_safe`: 80.6 pontos, margem +3.2, 23.0 bolas de 3, 10.0 erros.
- Ajustes feitos na P6.3:
  - ritmo corrigido;
  - modificadores ofensivos e defensivos separados;
  - defesa alta suavizada;
  - foco em bolas de 3 ficou mais visivel.
- A P7.0 criou o mercado procedural em preview.
- `generateProceduralBasketballMarket(seed, { count, profile })` gera agentes livres sem tocar no mercado fixo, no save, no `state` ou no `localStorage`.
- Perfis atuais do mercado procedural:
  - `balanced`;
  - `win_now`;
  - `budget`;
  - `development`.
- A aba Procedural do basquete possui o modo `Mercado procedural`.
- Resultado P7.0 em 50 seeds e 4 perfis:
  - 200 cenarios de mercado;
  - 4800 atletas gerados;
  - salario medio geral: $4.8M;
  - forca media geral: 70.2;
  - mercados com warnings: 20 de 200.
- A P7.1 criou uma comparacao visual entre mercado fixo e mercado procedural dentro do modo `Mercado procedural`.
- A comparacao mostra:
  - resumo do mercado fixo;
  - resumo do mercado procedural;
  - diferenca de salario medio, forca media e quantidade de atletas;
  - top 10 dos dois mercados por valor estimado.
- A estimativa de `currentAbility` e `potential` do mercado fixo existe so para comparacao visual; ela nao muda a simulacao nem a contratacao real.
- A P7.2 criou a regua de encaixe entre clube procedural e mercado procedural.
- `analyzeProceduralMarketFitForClub(club, market, { limit })` retorna:
  - intencao de mercado do clube;
  - posicoes carentes;
  - espaco financeiro;
  - ranking de atletas por `clubFitScore`;
  - motivo do encaixe;
  - se o atleta cabe no orcamento.
- Resultado P7.2 em 50 seeds:
  - 1600 encaixes ranqueados;
  - melhor encaixe medio entre 49.6 e 53.4, dependendo do perfil;
  - melhor encaixe cabe no orcamento em 92% a 96% dos cenarios.
- A P7.3 criou a simulacao de contratacao em sandbox.
- `simulateProceduralMarketSigning(club, player, options)` retorna:
  - atleta que entra;
  - saida sugerida;
  - resumo antes/depois;
  - deltas de CA, potencial, folha e orcamento;
  - carencias resolvidas;
  - veredito;
  - warnings de sandbox.
- O CSV `analises/mercado-procedural-encaixes-50-seeds.csv` agora inclui campos de sandbox.
- Resultado P7.3 nos 200 melhores encaixes:
  - movimento neutro: 106;
  - exige ajuste financeiro: 41;
  - melhora clara: 37;
  - ganho de teto: 16.
- A P8.0 criou `temporada-basquete/procedural.html`.
- Esse HTML carrega apenas o laboratorio procedural:
  - jogadores;
  - elencos;
  - clubes;
  - liga;
  - carreira experimental;
  - mercado procedural;
  - sandbox de contratacao.
- O HTML isolado nao carrega `temporada-basquete/script.js`, nao acessa save, nao altera mercado real e nao depende da UI completa do jogo.
- A tela inicial `Clique aqui para jogar.html` possui atalho para `Carreira Procedural`.
- A P8.1 transformou `temporada-basquete/procedural.html` em uma primeira carreira procedural jogavel.
- A tela agora possui abas internas:
  - Calendario;
  - Elenco;
  - Equipe;
  - Liga;
  - Mercado;
  - Log.
- A carreira procedural isolada permite:
  - gerar temporada por seed;
  - ver elenco;
  - avancar dia;
  - avancar semana;
  - processar eventos;
  - ver tabela simples;
  - ver oportunidades de mercado em preview;
  - acompanhar acontecimentos no log.
- O laboratorio antigo de preview continua disponivel em uma area recolhivel dentro do mesmo HTML.
- Foi criado `ARQUITETURA_DE_MUDANCAS_VISUAIS.md` para guiar os proximos passos da camada visual/jogavel.
- A P8.2 adicionou uma tela inicial de apresentacao da temporada procedural.
- Antes de entrar no calendario, o usuario ve:
  - clube controlado;
  - lore;
  - objetivo;
  - forca;
  - orcamento;
  - pontos fortes e fracos;
  - primeiros clubes da liga.
- A P8.2 tambem conectou partida ao vivo aos eventos `match` do calendario procedural.
- Quando existe jogo no dia, a aba Calendario mostra `Jogar ao vivo`.
- Ao jogar ao vivo, a carreira procedural usa:
  - `shared/match-events.js`;
  - `shared/live-coaching.js`;
  - `shared/live-simulation.js`;
  - `shared/live-match-ui.js`;
  - `temporada-basquete/match-adapter.js`.
- Ao salvar o resultado ao vivo, `applyExternalMatchResult` atualiza tabela, log, moral e fadiga.
- Se o usuario apenas avancar o calendario, o evento `match` ainda usa resultado rapido.
- A P8.3 iniciou a melhoria visual da carreira procedural isolada.
- Calendario:
  - eventos entram com animacao;
  - tipos ganharam marcador visual;
  - eventos mostram efeito previsto;
  - jogos possuem pulso leve.
- Cards de jogadores:
  - hover com elevacao;
  - barras animadas de forca, moral e fadiga;
  - destaque para atletas desgastados.
- As animacoes respeitam `prefers-reduced-motion`.
- A P8.4 tornou decisoes e mercado jogaveis em sandbox.
- Decisoes:
  - eventos `narrative` podem criar `state.pendingDecision`;
  - o calendario mostra escolhas com efeitos previstos;
  - avancar dia/semana pausa enquanto ha decisao pendente;
  - escolher aplica efeitos e registra no log.
- Mercado:
  - a aba Mercado tem `Contratar sandbox`;
  - a contratacao altera apenas o estado isolado da pagina;
  - o sistema usa saida sugerida quando o elenco esta cheio;
  - elenco, resumo financeiro e log sao atualizados;
  - nada e salvo em save real.
- A P8.5 redesenhou a visualizacao do mercado sandbox.
- O mercado agora usa cards de oportunidade em vez de tabela seca.
- Cada card mostra fit, CA, potencial, salario, encaixe financeiro, veredito, delta de folha/CA e saida sugerida.
- Contratacoes sandbox so podem ocorrer na primeira semana.
- Depois da semana 1, o mercado continua visivel para leitura, mas o botao fica bloqueado.
- A camada procedural recebeu reforcos de contraste para evitar texto claro em fundos claros.
- A P8.6 / V1.5 melhorou a leitura do calendario procedural.
- O Mercado sandbox agora some da navegacao depois da primeira semana; se a janela fecha enquanto o usuario esta nele, a UI volta para Calendario.
- A carreira procedural ganhou uma barra de status com semana, dia, campanha, quimica e fadiga.
- O Calendario agora funciona como central da semana, com card do dia atual, campanha, proximo jogo, estado do vestiario, progresso da temporada e faixa semanal de 7 dias.
- A P8.7 / V1.6 melhorou a aba Elenco.
- O Elenco agora possui filtro por posicao, ordenacao por overall/potencial/fadiga/moral/idade, painel rapido de alertas e selos de titular provavel, prospecto, alerta fisico e moral baixa.
- A P8.8 / V1.7 transformou a aba Equipe em painel de decisao.
- Equipe agora mostra leitura da comissao, campanha/forma recente, risco financeiro, foco sugerido e barras de quimica, moral, fadiga e forca media.
- Foi criado `teamState.weeklyFocus` para a carreira procedural isolada.
- O usuario pode definir foco semanal em Equipe; a escolha aplica efeitos leves em moral/quimica/fadiga e registra no log da carreira procedural.
- A P8.9 / V2.0 iniciou a saida do sandbox.
- Foi criado `shared/procedural-career-save.js`.
- A carreira procedural agora tem save proprio e versionado em `localStorage`.
- Saves procedurais sao separados por modalidade:
  - basquete: `temporada_procedural_careers_v1_basquete`;
  - volei: `temporada_procedural_careers_v1_volei`;
  - volei feminino: `temporada_procedural_careers_v1_volei_feminino`;
  - a chave antiga `temporada_procedural_careers_v1` fica apenas como fonte de migracao/leitura de saves antigos.
- O save procedural permite nomear, salvar, salvar como novo, carregar, exportar, importar e excluir carreiras sem usar o save legado do `script.js`.
- Para muitos saves, a carreira procedural pode usar uma pasta do PC via File System Access API no Chrome/Edge; os arquivos ficam em `temporada-total-saves` com subpastas por modalidade.
- `temporada-basquete/procedural.html` deixou de se apresentar como laboratorio sem persistencia e passou a se apresentar como `Carreira Procedural`.
- O atalho da tela inicial tambem foi renomeado para `Carreira Procedural`.
- A P8.10 / V2.1 reorganizou `Clique aqui para jogar.html` como tela de escolha de modo.
- A tela inicial agora destaca `Carreira Procedural`, separa `Jogo completo` como legado e oferece `Laboratorio procedural` como caminho secundario de calibragem.
- O laboratorio em `procedural.html` recebeu `id="laboratorio"` e abre automaticamente quando acessado por `#laboratorio`.
- A P8.11 / V2.2 fortaleceu o save procedural.
- `shared/procedural-career-save.js` agora valida payloads, normaliza/migra saves carregados, exporta JSON e importa JSON.
- O painel de save da carreira mostra mensagens amigaveis de sucesso/erro.
- Imports recebem novo `careerMeta.id` para nao sobrescrever a carreira original.
- Campos temporarios de UI, como mensagens e rascunho de JSON, nao entram no save final.
- A P8.12 / V2.3 melhorou a listagem das carreiras salvas.
- Saves procedurais agora aparecem como cards com nome, clube, data do save, campanha, semana, dia, saldo e schema.
- O card da carreira atual recebe destaque; saves com warnings recebem alerta.
- Cada card permite continuar, exportar ou excluir.
- Exclusao usa confirmacao visual em dois passos.
- A P8.13 / V3.0 iniciou a refatoracao de imersao da carreira procedural.
- Foi criada a aba `Central do Clube` como primeira aba jogavel.
- As ferramentas tecnicas foram movidas para `Configuracoes avancadas`, incluindo codigo da temporada, save, carregar/excluir, export/import JSON e backup.
- A Central do Clube mostra identidade do clube, lore, objetivo, estilo, pressao da diretoria, situacao financeira, confianca da torcida, leitura da comissao, semana atual, proximo jogo, campanha, moral, quimica, fadiga e alerta principal.
- O foco semanal passou a aparecer como decisao narrativa com texto de impacto esperado.
- A Central do Clube inclui `Diario da Comissao`, reutilizando o log de acontecimentos recentes.
- A aba Log foi reposicionada visualmente como `Diario da Temporada`.
- A aba Mercado agora permite selecionar jogador e ver comparacao com atleta comparavel do elenco, diferencas de overall/potencial/salario, impacto na folha, risco, quimica, moral e possivel saida.
- Os cards de mercado agora usam leitura de decisao em vez de parecerem tabela tecnica.
- Os cards do elenco ganharam tags narrativas calculadas por papel, idade, potencial, moral, fadiga e atributos.
- A aba Liga ganhou Panorama da Liga e raio-x do adversario selecionado.
- Leitura atual: as decisoes do usuario ja afetam o destino da liga em laboratorio, tambem alteram o comportamento do time durante a partida ao vivo, e agora existe uma primeira carreira procedural separada e mais imersiva, com save proprio validado, central do clube, diario, cards de carreira salva, import/export JSON, calendario, elenco narrativo, mercado comparativo, liga com panorama e jogos ao vivo opcionais.
- Pela direcao `DIRECAO_UI_7A0_A_TEMPORADA.md`, a Etapa 1 criou a casca `career-landing`.
- Pela mesma direcao, a Etapa 2 reduziu a navegacao principal do basquete completo para Central, Elenco, Mercado, Calendario, Partida e Liga.
- `Procedural`, `Lesoes` e `Editor` agora ficam em `Modo Desenvolvedor`, recolhido por padrao, sem remover os paineis antigos.
- Pela direcao UI 7a0, a Etapa 3 criou `shared/weekly-hub-ui.js` e a secao `weekly-hub` no painel Central.
- A Central da Semana reaproveita dados existentes do jogo completo e usa placeholders seguros antes da temporada iniciar.
- Nenhuma regra de save, mercado, temporada ou simulacao foi alterada na Etapa 3.
- A camada procedural comum agora conecta o banco grande de decisoes ao calendario.
- Confirmado: as lores ja alimentam a geracao de clubes em `shared/procedural-club-generator.js`, usando `window.TemporadaTotal.ProceduralLoreDatasets.lores`.
- Criado `shared/procedural-decision-bank-data.js`, gerado a partir de `Lores e decisões/Banco_2000_Decisoes_Ramificadas_Unificado.json` com 2000 decisoes compactas.
- Criado `shared/procedural-decision-bank.js` para escolher decisoes por lore/tags, evitar repeticao e converter efeitos como fadiga, moral, coesao e desenvolvimento para o estado da carreira.
- `shared/calendar-engine.js` usa o banco em eventos `narrative` e mantem fallback fixo caso o banco nao esteja carregado.
- `shared/game-state.js` e `shared/procedural-career-save.js` agora preservam `usedDecisionIds` e `decisionMemory`.
- O plano do volei foi ampliado: a migracao nao e apenas visual, deve levar a carreira procedural jogavel do basquete para uma versao procedural do volei com regras, mercado, calendario, save, decisoes e partida ao vivo adaptados.
- A migracao procedural do volei foi iniciada.
- Criado `temporada-volei/procedural.html` como carreira procedural isolada.
- Criado `temporada-volei/generation-config.js` com posicoes LEV, OPP, PON, CEN e LIB, alem de atributos de saque, ataque, bloqueio, recepcao, levantamento, defesa, fisico e tatica.
- `shared/procedural-roster-generator.js`, `shared/procedural-club-generator.js` e `shared/procedural-league-generator.js` ganharam wrappers para volei.
- `shared/game-state.js` aceita `sportId: "volei"` e constroi times ao vivo com atributos de volei.
- `shared/game-shell-ui.js` detecta `data-sport-id="volei"` e usa `VolleyballMatchAdapter` na simulacao ao vivo.
- Validacao automatica desta etapa ficou pendente porque chamadas locais ao Node/PowerShell passaram a travar durante os testes.
- A continuidade da migracao protegeu o volei de regras ainda especificas do basquete:
  - calibragem de clubes do basquete nao roda mais para `sportId: "volei"`;
  - eventos `market` do calendario de volei nao chamam o mercado de basquete;
  - aba Mercado fica oculta no procedural do volei ate ganhar mercado proprio;
  - forcas/fraquezas de clube usam linguagem de ataque, saque, recepcao, bloqueio e linha de passe.
- O raio-x dos atletas foi adaptado por modalidade.
- No volei, `shared/player-card-ui.js` mostra saque, ataque, bloqueio, passe/recepcao, levantamento e defesa, removendo `3PT` do card.
- `shared/roster-ui.js` passa `sportId` para os cards e `shared/game-state.js` preserva `sportId` nos jogadores.
- A Central da Semana do volei foi iniciada.
- `shared/game-shell-ui.js`, `shared/calendar-ui.js` e `shared/team-hub-ui.js` agora adaptam textos para sets, saque, recepcao, linha de passe, levantamento, cobertura e rallies.
- Focos semanais do volei usam labels como `Treinar saque`, `Ajustar passe`, `Fechar set` e `Recuperar salto`.
- `shared/calendar-engine.js` cria eventos `Partida contra ...` no volei e a simulacao rapida gera resultado por sets.
- A migracao do volei esta agora na Fase V7: Partida ao Vivo.
- `shared/live-match-ui.js` detecta volei por `sets`, `setScore` ou schema de fundamentos e renderiza faixa de sets, set atual, rally e parciais.
- Lideres da partida ao vivo no volei usam pontuador, sacador, bloqueio, passe, defesa e eficiencia.
- Comandos ao vivo do volei receberam linguagem de saque, recepcao, rotacao, linha defensiva e forcar saque/ataque.
- Ainda faltam principalmente mercado proprio do volei, estatisticas/lideres completos de temporada, polimento final e teste de temporada curta.
- O mercado proprio do volei foi iniciado.
- `shared/procedural-market-generator.js` agora expoe `generateProceduralVolleyballMarket`, usando `VolleyballGenerationConfig`.
- `shared/game-shell-ui.js` voltou a exibir Mercado no procedural do volei durante a semana 1 e escolhe o gerador por modalidade.
- Cards e comparacao de mercado do volei mostram fundamentos como saque, ataque, bloqueio, passe/recepcao, levantamento e defesa, sem `3PT`.
- `shared/calendar-engine.js` conecta evento `market` do volei ao novo mercado procedural e registra uma oportunidade concreta no log.
- Validado com smoke test local: mercado de volei gerou LEV, OPP, PON, CEN e LIB com atributos de fundamentos.
- As estatisticas/lideres do volei foram iniciados.
- `shared/game-state.js` cria `seasonStats` especifico para volei e acumula estatisticas em partidas rapidas e partidas ao vivo salvas.
- `shared/roster-ui.js` mostra painel de `Estatisticas do Volei` com lideres e tabela por atleta.
- Lideres do volei usam pontuador, sacador, bloqueador, passe, defesa e eficiencia.
- `shared/procedural-career-save.js` migra saves procedurais antigos de volei para incluir os novos campos.
- Validado com smoke test local: apos uma partida rapida, atletas receberam pontos, aces, bloqueios, passes/defesas e eficiencia.
- Auditoria do plano de volei: ainda existem pendencias atras, mas nao bloqueantes para o procedural.
- Pendencias reconhecidas: navegacao curta do `temporada-volei/index.html` legado, bastidores mais especificos, teste no navegador da partida ao vivo, validacao de salvamento de estatisticas ao vivo e refinamento de decisoes do banco grande para contexto de volei.
- Fase V9 iniciada: `temporada-volei/styles.css` ganhou regras de contraste para cards, mercado, comparacao, tabelas, estatisticas e status pills dentro de `body[data-sport-id="volei"] .procedural-game-root`.
- Smoke test local renderizou Calendario, Elenco e Equipe do procedural de volei apos avancar dias, sem erro de runtime.
- Pendencias atrasadas do volei foram tratadas em primeira versao:
  - `temporada-volei/index.html` legado passou a carregar `shared/career-home-ui.js`;
  - `shared/career-home-ui.js` move Estatisticas, Lesoes e Editor para Modo Desenvolvedor;
  - bastidores do volei ganharam leituras com oposto, libero, centrais, ponteiros, recepcao instavel e linha de passe;
  - `shared/procedural-decision-bank.js` filtra decisoes incompatíveis com volei quando houver termos muito especificos de basquete/futebol/futsal;
  - `recordLiveVolleyballMatchStats` foi validado com smoke test sintetico acumulando `playerStats` reais no elenco.
- Smoke test no Chrome headless abriu `temporada-volei/procedural.html`, iniciou o fluxo da carreira, confirmou abas da carreira procedural, Mercado na semana 1, textos de volei em Elenco/Mercado/Partida e ausencia de termos bloqueados como `3PT`, `bola de 3`, `reboteiro` e `cestinha` nas telas testadas.
- Ainda resta teste manual visual de uma temporada curta completa e partida ao vivo completa, mas a validacao automatizada basica do procedural de volei esta fechada.
- A Fase V10 refinou as decisoes do volei sem alterar o banco original:
  - `shared/procedural-decision-bank.js` adapta textos em runtime para `sportId: "volei"`;
  - escolhas de volei preferem decisoes compativeis antes de recorrer ao fallback;
  - decisoes recebem contexto de saque, recepcao, cobertura, set point, linha de passe, levantador, ataque e carga de salto conforme o tipo;
  - smoke test no Chrome headless avancou ate uma decisao real e confirmou contexto de volei sem termos bloqueados de outros esportes.
- O procedural do volei foi integrado ao `temporada-volei/index.html`:
  - nova aba principal `Carreira`;
  - painel `data-tab-panel="carreira-procedural"` com `data-procedural-game-root`;
  - scripts procedurais carregados tambem no index;
  - `procedural.html` isolado preservado via botao `Abrir isolado`;
  - smoke test no Chrome headless confirmou aba ativa, shell carregado, abas internas e linguagem de volei.
- O `temporada-volei/index.html` virou a entrada principal do V2 procedural:
  - abre direto em `Jogo V2`;
  - preserva o jogo antigo em `Jogo V1`;
  - recolhe as telas antigas internas no `Modo Desenvolvedor`;
  - `script.js` respeita `document.body.dataset.activeTab`;
  - o launcher `Clique aqui para jogar.html` apresenta o volei como `V2 procedural`.
- Primeira camada de impacto proporcional das decisoes no V2 do volei:
  - `teamState.volleyballImpact` guarda saque, passe, ataque, bloqueio, defesa e carga;
  - decisoes do calendario alimentam esses indicadores;
  - a Central mostra `Impacto de quadra`;
  - partidas rapidas de volei usam um modificador leve vindo desses impactos;
  - impactos decaem apos partidas para nao virarem bonus permanente.

Regra de seguranca:

- Enquanto a camada procedural estiver em preview, nao conectar diretamente em `state`, `localStorage`, mercado, saves ou temporada principal.
