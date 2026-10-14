# Plano de Migracao Procedural e Visual - Volei

Este documento guia a aplicacao, no `temporada-volei`, das melhorias visuais, procedurais e de jogabilidade feitas primeiro no basquete.
O objetivo nao e apenas deixar o volei mais bonito: e criar uma versao jogavel de carreira procedural para volei, com calendario, elenco, mercado, decisoes, liga, save proprio e partida ao vivo adaptada ao esporte.

## Objetivo

Levar o volei para a mesma direcao de experiencia:

- menos cara de painel tecnico;
- mais cara de carreira esportiva;
- navegacao curta;
- central de semana;
- mercado mais claro;
- elenco vivo;
- bastidores;
- partida ao vivo com transmissao simples;
- textos legiveis em cards claros;
- carreira procedural isolada;
- geracao de clube/liga/elenco;
- calendario jogavel;
- decisoes por lore/contexto;
- mercado com janela inicial;
- save procedural proprio;
- partida ao vivo de volei;
- sem reescrever o jogo legado inteiro.

## Regra principal

O volei nao deve virar uma copia cega do basquete.

Tudo que for visual e fluxo pode ser reaproveitado. Tudo que for regra esportiva precisa respeitar o volei:

- melhor de 5 sets;
- vence quem ganha 3 sets;
- estatisticas de saque, recepcao, ataque, bloqueio, defesa e erros;
- lideres como atacante, bloqueador, sacador, passador/recepcao e defensor;
- nada de reboteiro ou assistente como leitura principal.

## Estado atual observado

- `temporada-volei/index.html` ainda usa a estrutura antiga de abas:
  - Base;
  - Comissao;
  - Mercado;
  - Temporada;
  - Partida;
  - Estatisticas;
  - Lesoes;
  - Editor;
  - Tabela.
- `temporada-volei/script.js` ainda concentra grande parte da logica.
- `temporada-volei/match-adapter.js` ja existe e deve ser preservado.
- A UI visual 7a0 foi aplicada primeiro ao basquete/procedural, principalmente em:
  - `shared/career-home-ui.js`;
  - `shared/weekly-hub-ui.js`;
  - `shared/live-match-ui.js`;
  - `shared/game-shell-ui.js`;
  - `shared/player-card-ui.js`;
  - `shared/roster-ui.js`;
  - `shared/calendar-ui.js`;
  - `temporada-basquete/styles.css`.
- A carreira procedural do basquete tambem inclui mudancas de jogabilidade que devem ser migradas:
  - `temporada-basquete/procedural.html` como modo isolado;
  - `shared/game-state.js`;
  - `shared/calendar-engine.js`;
  - `shared/procedural-career-save.js`;
  - `shared/procedural-decision-bank-data.js`;
  - `shared/procedural-decision-bank.js`;
  - `shared/procedural-market-generator.js`;
  - UI modular de calendario, elenco, equipe, liga, mercado, log e partida ao vivo.

## Escopo de jogabilidade para o volei

A migracao do volei deve cobrir:

- criar `temporada-volei/procedural.html` como carreira procedural isolada;
- reaproveitar o shell comum de carreira;
- criar/adaptar configuracao procedural de atletas de volei;
- gerar atributos de volei:
  - saque;
  - ataque;
  - bloqueio;
  - recepcao;
  - defesa;
  - levantamento;
  - fisico;
  - leitura tatica.
- gerar elenco com posicoes de volei:
  - levantador;
  - oposto;
  - ponteiro;
  - central;
  - libero.
- adaptar mercado para encaixe por posicao e fundamento;
- conectar calendario, decisoes e save procedural;
- conectar partida ao vivo ao `temporada-volei/match-adapter.js`;
- criar estatisticas e lideres coerentes com volei.

## Banco de lores e decisoes

O banco de lores ja e usado pela geracao procedural comum em `shared/procedural-club-generator.js`, via `window.TemporadaTotal.ProceduralLoreDatasets.lores`.

O banco grande de decisoes agora deve ser considerado parte do runtime procedural comum:

- `shared/procedural-decision-bank-data.js` carrega uma versao compacta das 2000 decisoes;
- `shared/procedural-decision-bank.js` escolhe decisoes por lore/tags;
- `shared/calendar-engine.js` usa esse banco em eventos `narrative`;
- `state.usedDecisionIds` evita repeticao dentro da mesma carreira;
- o fallback fixo so deve aparecer quando o banco estiver indisponivel.

## Fase V1 - Carreira procedural isolada do volei

Criar a entrada procedural do volei sem mexer no jogo completo:

- criar `temporada-volei/procedural.html`;
- carregar os modulos compartilhados de carreira;
- carregar `temporada-volei/sport-manifest.js` e `temporada-volei/match-adapter.js`;
- criar/adaptar `temporada-volei/generation-config.js` se necessario;
- manter `temporada-volei/index.html` legado intacto.

## Fase V2 - Casca visual e navegacao

### V2.1 - Tela inicial de carreira

Aplicar no volei a mesma casca visual usada no basquete:

- adicionar `career-landing`;
- carregar `../shared/career-home-ui.js`;
- manter o jogo antigo escondido ate o usuario clicar em comecar/continuar;
- nao remover abas antigas.

### V2.2 - Navegacao curta

Reduzir a navegacao principal para:

```txt
Central | Elenco | Mercado | Calendario | Partida | Liga
```

Mapeamento sugerido:

- Base -> Central;
- Comissao -> Elenco ou Central;
- Mercado -> Mercado;
- Temporada -> Calendario;
- Partida -> Partida;
- Tabela -> Liga;
- Estatisticas -> Elenco ou Partida;
- Lesoes -> Modo Desenvolvedor ou Elenco;
- Editor -> Modo Desenvolvedor.

## Fase V3 - Central da semana no volei

Criar uma central reaproveitando `shared/weekly-hub-ui.js`, mas com textos de volei:

- proximo jogo;
- rodada;
- posicao na liga;
- moral;
- orcamento;
- alerta de desgaste;
- decisao pendente;
- botao principal.

Textos devem falar de sets, virada, pressao de saque, recepcao e rotacao.

## Fase V4 - Mercado do volei

Melhorar o mercado sem alterar o algoritmo:

- destacar dinheiro disponivel;
- mostrar perfil do atleta;
- mostrar forca principal:
  - saque;
  - ataque;
  - bloqueio;
  - recepcao;
  - defesa;
  - levantamento.
- mostrar risco:
  - caro;
  - encaixe ruim;
  - recepcao fraca;
  - fisico;
  - baixa moral.
- criar botao `Comparar`;
- comparar atleta de mercado com jogador da mesma posicao.

## Fase V5 - Elenco vivo do volei

Adaptar os cards vivos para atributos do volei:

- nome;
- posicao;
- funcao;
- status fisico;
- moral;
- forma recente;
- scout curto;
- acoes rapidas desativadas:
  - Detalhes;
  - Poupar;
  - Funcao;
  - Conversar.

Raio-x de atributos no hover/foco:

- saque;
- ataque;
- bloqueio;
- recepcao;
- defesa;
- levantamento, quando fizer sentido.

## Fase V6 - Bastidores do volei

Criar/usar `season-backstage-feed` com textos de volei:

- pressao apos derrota em sets;
- recepcao instavel;
- oposto pedindo protagonismo;
- central em grande fase;
- libero cobrando organizacao defensiva;
- ponteiros oscilando;
- diretoria cobrando playoffs/titulo/permanencia.

Cada evento deve ter no maximo duas frases.

## Fase V7 - Partida ao vivo do volei

A partida ao vivo precisa parecer transmissao de volei:

- placar de sets como principal;
- placar do set atual;
- melhor de 5;
- primeiro a 3 sets vence;
- destaque para rally atual;
- ultimo lance;
- momento:
  - set point;
  - match point;
  - virada;
  - sequencia de saque;
  - erro de recepcao.
- acoes rapidas:
  - pedir tempo;
  - mudar pressao de saque;
  - reforcar recepcao;
  - rodar banco;
  - acelerar simulacao.

Estatisticas completas ficam recolhidas.

## Fase V8 - Estatisticas e lideres de volei

As estatisticas precisam abandonar leituras de basquete:

- lider de pontos;
- melhor sacador;
- melhor bloqueador;
- melhor atacante;
- melhor recepcao/passador;
- melhor defensor;
- eficiencia por fundamento.

Nao usar rebotes ou assistencias como leitura principal.

## Fase V9 - Contraste e polimento

Aplicar a regra aprendida no basquete:

- card claro nunca herda texto claro;
- `metric-card`, tabelas, cards de contexto e badges devem forcar texto escuro quando o fundo for claro;
- respeitar `prefers-reduced-motion`;
- evitar textos brancos em fundo branco/cinza claro.

## Fase V10 - Decisoes

Antes de ampliar a carreira do volei, corrigir no procedural comum:

- o calendario jogavel hoje usa poucos templates fixos;
- o banco grande de decisoes existe, mas nao esta conectado a `processNarrative`;
- conectar o banco de decisoes por lore/contexto;
- evitar repetir a mesma decisao na mesma carreira;
- registrar decisoes ja usadas em `state.usedDecisionIds`;
- usar fallback fixo apenas quando o banco nao tiver decisao compativel.

## Ordem recomendada

1. Corrigir decisoes repetidas no motor procedural comum. **Concluido.**
2. Criar `temporada-volei/procedural.html` isolado. **Iniciado.**
3. Criar/adaptar geracao procedural de atletas e clubes de volei. **Iniciado.**
4. Aplicar casca visual e navegacao curta no volei.
5. Criar Central da Semana no volei.
6. Melhorar mercado do volei.
7. Adaptar Elenco vivo para atributos de volei.
8. Adaptar Partida ao Vivo para transmissao de volei.
9. Criar estatisticas e lideres coerentes com volei.
10. Aplicar contraste/polimento.
11. Testar uma temporada curta no volei.

## Historico de implementacao

### Inicio da Fase V1

- Criado `temporada-volei/procedural.html` como entrada isolada da carreira procedural de volei.
- Criado `temporada-volei/generation-config.js` com atributos, posicoes, arquetipos e plano de elenco de volei.
- `shared/procedural-roster-generator.js` passou a aceitar `config.rosterPlan`, `config.starterPositions` e posicoes da modalidade.
- Criado wrapper `generateProceduralVolleyballRoster`.
- `shared/procedural-club-generator.js` passou a conseguir gerar clube para `sportId: "volei"` usando `VolleyballGenerationConfig`.
- Criado wrapper `generateProceduralVolleyballClub`.
- `shared/procedural-league-generator.js` passou a escolher o gerador de clubes por modalidade.
- Criado wrapper `generateProceduralVolleyballLeague`.
- `shared/game-state.js` passou a aceitar `createProceduralGameState({ sportId: "volei" })` e a montar times ao vivo com atributos de volei.
- `shared/game-shell-ui.js` passou a detectar `data-sport-id="volei"` e usar `VolleyballMatchAdapter` na partida ao vivo.
- A validacao automatica local ficou pendente porque o ambiente de comandos travou ao chamar Node/PowerShell durante o smoke test.

### Continuidade da Fase V1/V2

- A calibragem de clubes criada para basquete deixou de ser aplicada automaticamente em clubes de volei.
- O evento `market` do calendario procedural do volei agora registra radar de scouting, sem chamar mercado de basquete.
- A aba Mercado ficou temporariamente escondida ate a Fase V4; agora voltou na semana 1 com mercado proprio por fundamento/posicao.
- A leitura de forcas/fraquezas de clube foi adaptada para volei:
  - ataque e saque;
  - recepcao e bloqueio;
  - linha de passe;
  - pressao ofensiva.
- `temporada-volei/styles.css` recebeu uma primeira camada visual para `body[data-sport-id="volei"]`, mantendo a casca compartilhada mas com identidade de quadra/rede.

### Ajuste de raio-x dos atletas

- `shared/player-card-ui.js` agora detecta `sportId: "volei"` ou atributos de volei no atleta.
- O raio-x do atleta de volei nao mostra mais `3PT`.
- Atributos exibidos no volei:
  - saque;
  - ataque;
  - bloqueio;
  - passe/recepcao;
  - levantamento;
  - defesa.
- Tags narrativas do volei usam termos como `Passe confiavel`, `Pressao ofensiva` e `Bloqueio forte`.
- `shared/roster-ui.js` passa `sportId` para os cards.
- `shared/game-state.js` preserva `sportId` nos jogadores normalizados.

### Fase V3 - Central da semana do volei iniciada

- `shared/game-shell-ui.js` passou a adaptar a Central para `sportId: "volei"`.
- A Central do volei usa textos de:
  - sets;
  - saque;
  - recepcao;
  - linha de passe;
  - levantamento;
  - cobertura;
  - rallies.
- Decisao da semana ganhou labels proprios:
  - Treinar saque;
  - Ajustar passe;
  - Fechar set;
  - Recuperar salto.
- Bastidores do volei agora narram treino, descanso, partida e decisoes com linguagem de quadra.
- `shared/calendar-ui.js` adapta efeitos previstos e cards do calendario para volei.
- `shared/team-hub-ui.js` adapta foco sugerido, sistema de jogo e radar futuro.
- `shared/calendar-engine.js` passou a criar eventos como `Partida contra ...` no volei.
- A simulacao rapida do calendario para volei agora gera resultado por sets, como `3 x 1`, em vez de placar de basquete.

### Fase V7 - Partida ao vivo do volei iniciada

- Estamos na Fase V7 do plano.
- `shared/live-match-ui.js` agora detecta estado de volei por `sets`, `setScore` ou schema de fundamentos.
- A transmissao ao vivo do volei ganhou faixa especifica com:
  - sets;
  - placar do set atual;
  - rally;
  - parciais fechadas.
- O momento da partida identifica:
  - rally em andamento;
  - set apertado;
  - set point;
  - match point;
  - sequencia forte;
  - tempo tecnico.
- Lideres do volei trocaram rebote/assistencia por:
  - pontuador;
  - sacador;
  - bloqueio;
  - passe;
  - defesa;
  - eficiencia.
- Comandos ao vivo do volei usam linguagem de saque, recepcao, linha defensiva, rodar rotacao e forcar saque/ataque.
- `temporada-volei/styles.css` recebeu `volley-live-strip` para destacar a central de sets/rally.

### Fase V4 - Mercado do volei iniciado

- `shared/procedural-market-generator.js` ganhou `generateProceduralVolleyballMarket`.
- O mercado do volei usa `VolleyballGenerationConfig`, gerando atletas com:
  - saque;
  - ataque;
  - bloqueio;
  - recepcao/passe;
  - levantamento;
  - defesa.
- Warnings de mercado passaram a considerar posicoes do volei:
  - levantadores;
  - atacantes;
  - centrais;
  - liberos.
- A aba Mercado voltou a aparecer no procedural do volei durante a semana 1.
- `shared/game-shell-ui.js` escolhe o gerador de mercado por modalidade.
- Cards de mercado do volei mostram perfil, forca e risco por fundamento, sem `3PT`.
- A comparacao do mercado ganhou leitura de sistema/passe quando o atleta e de volei.
- `shared/calendar-engine.js` conecta eventos `market` do volei ao novo mercado procedural e registra oportunidade concreta no log.
- Smoke test local gerou mercado de volei com posicoes LEV, OPP, PON, CEN e LIB e fundamentos esperados.

### Fase V8 - Estatisticas e lideres do volei iniciada

- `shared/game-state.js` agora cria `seasonStats` especifico para volei.
- Estatisticas acumuladas do volei incluem:
  - jogos;
  - sets jogados;
  - pontos;
  - aces;
  - ataques;
  - pontos de ataque;
  - erros de ataque;
  - bloqueios;
  - recepcoes;
  - passes positivos;
  - erros de recepcao;
  - defesas;
  - assistencias de levantamento;
  - erros;
  - eficiencia.
- Partidas rapidas do calendario distribuem estatisticas de volei entre titulares provaveis.
- Partidas ao vivo salvas tentam acumular `playerStats` reais do `VolleyballMatchAdapter`.
- `shared/roster-ui.js` ganhou painel de `Estatisticas do Volei` dentro da aba Elenco.
- Lideres do elenco no volei:
  - pontuador;
  - sacador;
  - bloqueador;
  - passe;
  - defesa;
  - eficiencia.
- Tabela responsiva do elenco mostra acumulado por atleta e fundamento.
- `shared/procedural-career-save.js` migra saves procedurais antigos de volei para incluir os novos campos de estatistica.
- Smoke test local confirmou acumulacao de estatisticas apos partida rapida.

## Situacao atual do plano

- Fase V1: base procedural criada e funcional como primeira versao.
- Fase V2: casca visual do procedural criada; navegacao curta do `index.html` legado ainda pendente.
- Fase V3: Central/Calendario/Equipe iniciados com linguagem de volei.
- Fase V4: mercado proprio do volei conectado na semana 1; ainda pode receber refinamento visual apos testes.
- Fase V5: elenco/raio-x iniciado com atributos de volei.
- Fase V6: bastidores iniciados; ainda falta banco de eventos mais especificos por personagem/fundamento.
- Fase V7: partida ao vivo iniciada com transmissao por sets/rally; validada em smoke test no navegador headless.
- Fase V8: estatisticas e lideres do elenco conectados.
- Fase V9: em andamento agora, contraste/polimento final.
- Fase V10: banco grande de decisoes conectado e leitura fina do volei iniciada com adaptacao textual/contextual.

## Pendencias antes do fechamento

- Aplicar navegacao curta tambem no `temporada-volei/index.html` legado. **Tratado em primeira versao.**
- Testar no navegador uma temporada curta do `temporada-volei/procedural.html`. **Validado em smoke test headless; ainda vale teste manual visual.**
- Refinar bastidores com eventos especificos de oposto, libero, centrais e ponteiros. **Tratado em primeira versao.**
- Verificar se a partida ao vivo do volei salva estatisticas reais do adapter em todos os casos. **Validado com smoke test sintetico; a tela ao vivo tambem abriu no smoke headless.**
- Revisar decisoes do banco grande em contexto de volei, filtrando textos que so facam sentido para outros esportes. **Filtro inicial implementado; segunda passada de refinamento aplicada.**

### Fase V9 - Contraste e polimento iniciada

- `temporada-volei/styles.css` recebeu regras especificas para `body[data-sport-id="volei"] .procedural-game-root`.
- Cards claros do procedural de volei agora forcam texto escuro em:
  - metric cards;
  - mercado;
  - comparacao de mercado;
  - cards de elenco;
  - tabelas;
  - tabela de estatisticas do volei;
  - status pills.
- A camada de contraste foi ampliada para cobrir tambem:
  - Central e comandos da semana;
  - calendario e eventos;
  - hub da equipe;
  - cards procedurais de atletas e raio-x;
  - controles do elenco;
  - detalhes recolhidos da partida ao vivo.
- O procedural de volei passou a respeitar melhor `prefers-reduced-motion` nos cards/eventos animados e barras de progresso.

### Fase V10 - Decisoes do volei refinadas

- `shared/procedural-decision-bank.js` ganhou normalizacao de texto antes do filtro de compatibilidade esportiva.
- O filtro do volei agora considera tambem labels e descricoes das opcoes antes de liberar uma decisao.
- Termos muito especificos de basquete/futebol foram ampliados na lista de bloqueio:
  - tres pontos;
  - enterrada;
  - bandeja;
  - goleira;
  - cartoes;
  - penalti;
  - escanteio.
- Textos vindos do banco passam por reparo de mojibake antes de serem exibidos no volei.
- Adaptacao textual do volei foi ampliada para:
  - rodagem em vez de minutos;
  - partidas/sets em vez de jogos quando fizer sentido;
  - escolha de sistema/rotacao em vez de escalacao generica.
- Smoke test local carregou 2000 decisoes, sorteou decisoes de volei e nao encontrou termos bloqueados nem mojibake no texto final.
- `procedural-volley-stats` ganhou grid proprio para lideres e tabela.
- Cabeçalho da tabela de estatisticas do volei recebeu fundo claro e texto escuro.
- Linhas alternadas da tabela ganharam destaque sutil em verde.
- Smoke test local renderizou Calendario, Elenco e Equipe do procedural de volei depois de avancar dias, sem erro de runtime.

### Fechamento das pendencias atrasadas

- `temporada-volei/index.html` legado agora carrega `../shared/career-home-ui.js`.
- `shared/career-home-ui.js` tambem move Estatisticas, Lesoes e Editor para `Modo Desenvolvedor`, mantendo a navegacao curta.
- Bastidores do volei ganharam leituras especificas para:
  - oposto;
  - libero;
  - centrais;
  - ponteiros;
  - recepcao instavel;
  - linha de passe.
- `shared/procedural-decision-bank.js` filtra, no volei, decisoes com termos muito especificos de basquete/futebol/futsal como rebote, bola de 3, garrafao, cesta, gol, goleiro e cartao.
- Smoke test sintetico confirmou que `recordLiveVolleyballMatchStats` acumula estatisticas reais de `playerStats` do adapter no elenco.
- Smoke test no Chrome headless abriu `temporada-volei/procedural.html`, iniciou o fluxo da carreira, encontrou as abas Central, Calendario, Elenco, Equipe, Liga, Mercado, Partida e Bastidores, confirmou Mercado na semana 1 e nao encontrou termos bloqueados como `3PT`, `bola de 3`, `reboteiro` ou `cestinha` nas telas testadas.

### Fase V10 - Decisoes refinadas para volei

- `shared/procedural-decision-bank.js` ganhou adaptacao leve de texto para `sportId: "volei"`.
- O banco original de 2000 decisoes nao foi alterado; a adaptacao acontece apenas na normalizacao para o calendario.
- Decisoes do volei agora recebem uma frase de contexto esportivo conforme o tipo:
  - controle de carga fala de salto, ombro e explosao;
  - estrategia fala de saque, recepcao e cobertura;
  - base fala de rodagem, pressao de saque e linha de passe;
  - mercado fala de posicao, passe, bloqueio e custo;
  - vestiario/conflito fala de levantador, atacantes e cobertura;
  - classico fala de viradas, set points e sequencias de saque.
- Termos genericos foram suavemente adaptados para o volei, por exemplo:
  - `minutos` -> `rodagem`;
  - `jogos controlados` -> `sets controlados`;
  - `jogo grande` -> `partida grande`;
  - `bola subir` -> `saque inicial`;
  - `rodada pesada` -> `sequencia pesada`.
- A selecao de decisoes no volei agora prefere sempre decisoes compativeis; se a lore exata nao tiver alternativa segura, busca outra decisao compativel antes de cair no fallback fixo.
- Smoke test no Chrome headless avancou o calendario ate uma decisao real do banco e confirmou:
  - decisao encontrada;
  - contexto de volei presente;
  - nenhum termo bloqueado como `3PT`, `bola de 3`, `reboteiro`, `cestinha`, `goleiro` ou `cartao`.

### Integracao do procedural no index do volei

- `temporada-volei/index.html` agora possui uma aba principal `Carreira`.
- A aba usa `data-tab-panel="carreira-procedural"` e renderiza o mesmo shell jogavel do `procedural.html`:
  - Central do Clube;
  - Calendario;
  - Elenco;
  - Equipe;
  - Liga;
  - Mercado;
  - Partida;
  - Bastidores.
- O `procedural.html` isolado foi preservado e continua acessivel pelo botao `Abrir isolado`.
- A pagina principal do volei passou a carregar os modulos procedurais necessarios:
  - datasets e lores;
  - banco de decisoes;
  - geradores de jogador, elenco, clube, liga e mercado;
  - save procedural;
  - calendario;
  - UIs de elenco/equipe/calendario;
  - shell procedural.
- `index.html` tambem carrega a base visual de `temporada-basquete/styles.css` antes de `temporada-volei/styles.css`, como ja acontecia no `procedural.html`, para manter a aba integrada com layout completo.
- Smoke test no Chrome headless abriu `temporada-volei/index.html`, clicou em `Carreira`, iniciou o fluxo procedural e confirmou:
  - aba principal ativa;
  - painel procedural ativo;
  - shell carregado;
  - abas internas presentes;
  - textos de volei presentes;
  - nenhum termo bloqueado como `3PT`, `bola de 3`, `reboteiro` ou `cestinha`.

### Virada de entrada - V2 como jogo principal

- `temporada-volei/index.html` agora abre direto no `Jogo V2`, a carreira procedural integrada.
- O jogo antigo foi preservado como aba principal `Jogo V1`.
- As telas internas antigas do V1 ficam recolhidas no `Modo Desenvolvedor`:
  - Comissao;
  - Mercado;
  - Temporada;
  - Partida;
  - Estatisticas;
  - Lesoes;
  - Editor;
  - Tabela.
- `shared/career-home-ui.js` detecta o index de volei com procedural integrado e troca a navegacao principal para:
  - `Jogo V2`;
  - `Jogo V1`.
- `temporada-volei/script.js` passou a respeitar `document.body.dataset.activeTab`, permitindo que o HTML defina a aba inicial sem quebrar o legado.
- `temporada-volei/procedural.html` continua existindo como modo isolado e agora aponta de volta para `Jogo V2 integrado`.
- `Clique aqui para jogar.html` agora apresenta o volei como `V2 procedural` e avisa que o jogo antigo fica dentro da aba `Jogo V1`.
- Smoke test no Chrome headless confirmou:
  - `temporada-volei/index.html` abre em `carreira-procedural`;
  - topo mostra apenas `Jogo V1` e `Jogo V2`;
  - shell procedural carrega;
  - botao `Jogo V1` funciona;
  - botao `Jogo V2` volta ao procedural.

### Impacto proporcional das decisoes - primeira camada

- Decisoes tomadas no calendario do volei agora geram impactos temporarios de quadra.
- `shared/game-state.js` ganhou `teamState.volleyballImpact` com indicadores:
  - saque;
  - passe/recepcao;
  - ataque;
  - bloqueio;
  - defesa;
  - carga.
- `shared/calendar-engine.js` converte a decisao escolhida em impacto de fundamento conforme texto, tipo e efeitos.
- O impacto entra como modificador leve na simulacao rapida de partidas de volei.
- Depois da partida rapida, o impacto decai gradualmente para nao virar bonus permanente.
- `shared/game-shell-ui.js` mostra o painel `Impacto de quadra` na Central do Clube.
- `temporada-volei/styles.css` recebeu o bloco visual `Procedural volleyball decision impact`.
- Smoke test no Chrome headless confirmou:
  - decisao real encontrada;
  - escolha aplicada;
  - painel `Impacto de quadra` exibido;
  - fundamentos com valores nao zerados apos a decisao.

### Impacto proporcional das decisoes - segunda camada

- `shared/calendar-engine.js` agora gera uma leitura curta do impacto da escolha, destacando ate tres fundamentos principais.
- A memoria de decisoes passou a guardar:
  - `courtImpact`;
  - `courtImpactSummary`.
- O log da decisao no volei agora mostra impacto concreto, como `passe +1.9, saque +1.8, defesa +1.4`, em vez de apenas uma frase generica.
- `shared/game-state.js` preserva `lastSummary` dentro de `teamState.volleyballImpact`.
- `shared/game-shell-ui.js` exibe o resumo curto dentro do painel `Impacto de quadra`.
- Partidas ao vivo salvas tambem fazem o impacto de quadra decair, assim como as partidas rapidas.
- `temporada-volei/styles.css` recebeu acabamento para `volley-impact-summary`.
- Smoke test local aplicou uma decisao sintetica de volei e confirmou:
  - evento processado;
  - memoria com resumo de impacto;
  - log com fundamentos concretos;
  - painel preparado para exibir `lastSummary`.
