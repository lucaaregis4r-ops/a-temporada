# Arquitetura da Mudanca

Documento vivo para guiar a evolucao procedural de "A Temporada" sem perder contexto, sem quebrar o jogo atual e sem misturar experimentos com mercado, saves ou temporada antes da hora.

## 1. Estado Atual

O procedural esta em fase de laboratorio controlado.

Ja foi feito:

- Etapa 1: RNG deterministico por seed.
- Etapa 2: geracao procedural de jogadores de basquete no console.
- Etapa 3: scout notes, preview estatistico, diagnostico e calibragem matematica.

Ainda nao entramos na Etapa 4.

A Etapa 4 sera algo como: gerar um elenco procedural utilizavel em modo isolado, sem substituir o mercado atual.

Etapa visual atual:

- P1 - Preview Visual Isolado do Procedural: implementado no basquete.
- P2 - Preview Visual de Elenco: iniciado no basquete em modo isolado.
- P3 - Preview Visual de Clube: iniciado no basquete com lores prototipo.
- Banco real de lores conectado em modo isolado.
- P4 - Preview Visual da Liga Completa: primeira versao implementada no basquete.

## 2. Objetivo Final

O objetivo final do procedural nao e apenas gerar jogadores soltos.

O objetivo e gerar uma liga procedural completa, deterministica por seed, com clubes, elencos, orcamentos, objetivos e narrativas proprias.

A cadeia desejada e:

```txt
Seed -> Liga -> Clubes -> Lores -> Orcamentos -> Elencos -> Mercado -> Temporada -> Narrativa emergente
```

Cada seed deve gerar sempre a mesma liga inicial.

Exemplo:

- `OLYMPICO-2026` deve gerar sempre a mesma estrutura inicial.
- `CRUZEIRO-2030` deve gerar outra liga, tambem estavel.

## 3. Filosofia da Liga Procedural

O usuario nao deve comecar com um elenco vazio para montar tudo do zero.

Ele deve assumir uma equipe que ja existe dentro da liga, com:

- lore;
- identidade esportiva;
- elenco inicial;
- orcamento;
- objetivo de temporada;
- pressao interna;
- pontos fortes e fracos;
- contexto competitivo.

A funcao do usuario sera ajustar esse clube:

- contratar;
- dispensar;
- trocar;
- reorganizar rotacao;
- administrar folha salarial;
- lidar com expectativas;
- tentar cumprir ou superar o objetivo definido.

Observacao implementada:

- O mercado da carreira procedural ja mostra o dinheiro disponivel do clube.
- Esse valor vem do orcamento gerado pela lore, descontando a folha atual do elenco.
- A UI tambem mostra orcamento da lore e folha atual para deixar claro por que certos clubes tem mais ou menos margem de contratacao.

As equipes adversarias tambem precisam existir dentro da mesma logica. A dificuldade do usuario so faz sentido quando comparada com uma liga viva, com favoritos, clubes medios, rivais diretos, equipes em crise e candidatos ao rebaixamento.

## 4. Dois Niveis de Geracao

### 4.1 Equipe do Usuario

A equipe controlavel deve ser gerada como um clube real dentro da liga procedural.

Ela deve conter:

- id estavel por seed;
- nome;
- cidade;
- lore;
- orcamento;
- elenco inicial;
- objetivo da temporada;
- nivel de pressao;
- desafio principal;
- estilo de elenco;
- pontos fortes;
- pontos fracos;
- margem de manobra no mercado.

Exemplos de desafios:

- candidata ao titulo com elenco veterano e caro;
- clube jovem com foco em desenvolvimento;
- equipe tradicional em crise;
- equipe rica, mas mal montada;
- recem-promovido tentando evitar rebaixamento;
- equipe media buscando playoffs;
- time com ataque forte e defesa fraca;
- time defensivo, fisico e limitado tecnicamente;
- clube com pouca verba, mas boa base;
- elenco talentoso, mas desequilibrado;
- equipe velha tentando uma ultima chance de titulo;
- equipe em reconstrucao.

### 4.2 Liga Completa

A liga deve conter todas as outras equipes com identidade propria.

Ela deve gerar:

- favoritos ao titulo;
- equipes fortes;
- equipes de meio de tabela;
- clubes em reconstrucao;
- clubes ricos mal montados;
- candidatos ao rebaixamento;
- rivais diretos;
- distribuicao coerente de forca;
- variacao de orcamento;
- variedade de perfis e estilos.

O usuario precisa sentir que seu clube esta inserido em um ecossistema competitivo.

Diretriz de UI aplicada:

- No fluxo jogavel, a linguagem deve falar como carreira esportiva.
- Termos como seed, calibragem, preview, sandbox e save legado ficam restritos a Modo Desenvolvedor ou aos documentos tecnicos.
- A liga deve ser apresentada como temporada viva, nao como resultado de geracao.

## 5. Lores Manuais Como Base Estrutural

As mais de 100 lores serao elaboradas manualmente pelo Lucas.

Elas nao devem ser apenas textos decorativos.

Cada lore deve influenciar a geracao do clube.

Uma lore pode afetar:

- orcamento;
- reputacao;
- objetivo;
- pressao;
- ambicao;
- idade media do elenco;
- risco financeiro;
- tolerancia a jovens;
- estilo de elenco;
- perfil de contratacao;
- margem para erros;
- paciencia da diretoria;
- tipo de scout notes;
- narrativa inicial.

Exemplo de estrutura futura:

```js
{
  id: "veteran_title_window",
  label: "Ultima janela de titulo",
  description: "Clube caro, experiente e pressionado para vencer agora.",
  budgetBias: 1.25,
  ageBias: 1.18,
  pressure: "high",
  ambition: "title",
  rosterStyle: "veteran_core",
  riskLevel: "medium",
  objective: "brigar pelo titulo",
  playerBias: {
    age: "older",
    currentAbility: "high",
    potential: "lower"
  }
}
```

As lores devem funcionar como presets narrativos e matematicos.

## 6. Regras de Seguranca

Enquanto o procedural estiver em preview:

- Nao mexer no save.
- Nao substituir o mercado atual.
- Nao conectar diretamente na temporada.
- Nao alterar a UI principal antes de validar.
- Nao alterar jogadores fixos.
- Nao alterar IDs existentes.
- Nao refatorar `script.js` sem necessidade real.
- Nao salvar nada no `localStorage`.
- Manter tudo isolado e testavel por console ou painel de debug.
- Toda geracao precisa usar `createSeededRng`.
- Nenhuma geracao procedural deve usar `Math.random`.
- Identidade de clube deve respeitar a modalidade: nomes de volei usam municipios/sufixos proprios do volei e nao podem receber termos como `Basquete`.

## 7. Arquitetura Atual dos Modulos

### Shared

- `shared/base-game.js`
  - Namespace `window.TemporadaTotal`.
  - Registro de manifesto.
  - Ponte com runtime legado.

- `shared/seeded-rng.js`
  - RNG deterministico.
  - Expoe `createSeededRng(seed)`.

- `shared/procedural-datasets.js`
  - Datasets base de nomes, cidades e perfis.

- `shared/procedural-lore-datasets.js`
  - Dataset gerado a partir da pasta `Lores e decisoes`.
  - Contem 100 lores reais estruturadas.
  - Contem indice leve das 1000 decisoes especificas por lore para preview.
  - O banco tambem possui 1000 decisoes genericas/sistemicas, ainda nao conectadas.
  - Nao carrega o JSON completo de decisoes no runtime.

- `shared/procedural-scouting.js`
  - Scout notes derivadas de atributos e riscos.

- `shared/procedural-player-generator.js`
  - Geracao de jogadores.
  - Atualmente validada para basquete.

- `shared/procedural-debug.js`
  - Preview estatistico e warnings.

- `shared/procedural-club-calibration.js`
  - Calibragem pos-geracao de clubes.
  - Corrige incoerencias entre lore, tier, estilo, idade, folha e forca.

- `shared/procedural-club-generator.js`
  - Geracao de clubes com lore, elenco, orcamento, objetivo e calibragem.

- `shared/procedural-league-generator.js`
  - Geracao de liga completa em modo preview.
  - Usa clubes calibrados e monta ranking, favoritos, briga por playoffs, parte baixa e rivais diretos.

- `shared/procedural-league-debug.js`
  - Diagnostico estatistico da liga procedural.
  - Mede distribuicao de forca, gap topo/fundo, folha, idade, potencial, prospects e warnings.

- `shared/procedural-season-simulator.js`
  - Simulacao isolada de temporada procedural.
  - Usa a liga gerada em preview para simular tabela, campeao, zebras, retencao de favoritos e correlacao entre ranking projetado e resultado.

- `shared/procedural-narrative-debug.js`
  - Diagnostico narrativo da liga procedural.
  - Cruza lore, objetivo, ranking projetado, resultado simulado e sensibilidade a decisoes.
  - Mede se decisoes fortes teriam impacto proporcional no destino do clube em simulacao isolada.

- `shared/procedural-decision-engine.js`
  - Motor de decisoes procedurais em modo laboratorio.
  - Traduz efeitos do banco de decisoes para `teamState`, `teamEffects`, rating, volatilidade e pressao simulada.
  - Ainda nao altera save, mercado, temporada real ou estado principal.

- `shared/procedural-career-lab.js`
  - Primeira integracao controlada da carreira procedural.
  - Compara uma temporada base contra uma temporada influenciada pelas decisoes do usuario.
  - Funciona em modo laboratorio, sem criar save e sem substituir a temporada principal.

- `shared/procedural-rotation-engine.js`
  - Motor procedural de titulares, rotacao e minutos.
  - Gera plano de rotacao por filosofia do usuario/lore.
  - Converte escolha de minutos em efeito de rating, volatilidade, desenvolvimento e fadiga.

- `shared/procedural-market-generator.js`
  - Gerador isolado de mercado procedural.
  - Cria agentes livres por seed, perfil de mercado e configuracao da modalidade.
  - Ainda nao contrata, nao substitui o mercado fixo e nao altera saves.

- `shared/live-coaching.js`
  - Comandos continuos de tecnico durante simulacao ao vivo.
  - Cria estado `coaching` e aplica mudancas de tatica, ritmo, rotacao, pressao defensiva, foco ofensivo e tolerancia a risco sem reiniciar a partida.

- `shared/match-events.js`, `shared/live-simulation.js`, `shared/live-match-ui.js`
  - Arquitetura de partida ao vivo.
  - Nao fazem parte direta da geracao de liga, mas continuam como base de simulacao.

### Basquete

- `temporada-basquete/generation-config.js`
  - Config procedural especifica do basquete.
  - Posicoes, atributos, arquetipos, tiers e salario.

- `temporada-basquete/script.js`
  - Ainda concentra mercado, saves, temporada, editor e renderizacao.
  - Deve continuar protegido ate que o procedural tenha preview e modelo de integracao.

## 8. Funcoes Procedurais Atuais

```js
window.TemporadaTotal.createSeededRng(seed)
window.TemporadaTotal.generateProceduralBasketballPlayers(seed, count)
window.TemporadaTotal.debugProceduralPlayers(seed, count)
window.TemporadaTotal.previewProceduralBasketballClass(seed, count, options)
```

Essas funcoes:

- nao alteram `state`;
- nao alteram save;
- nao alteram mercado;
- nao conectam na temporada;
- servem apenas para geracao, preview e calibragem.

## 9. Modelo Futuro de Mundo

Modelo alvo:

```js
state.world = {
  seed,
  sportId,
  createdAt,
  league: {
    id,
    name,
    size,
    strengthProfile,
    budgetProfile
  },
  userTeamId,
  teams: [],
  players: [],
  freeAgents: [],
  lorePackId
};
```

Equipe:

```js
{
  id,
  name,
  city,
  loreId,
  lore,
  budget,
  reputation,
  pressure,
  ambition,
  objective,
  strengthTier,
  rosterStyle,
  rosterIds,
  strengths,
  weaknesses,
  scoutNotes,
  marketBehavior
}
```

Jogador:

```js
{
  id,
  name,
  age,
  gender,
  teamId,
  pos,
  position,
  heightCm,
  salary,
  currentAbility,
  potential,
  attributes,
  archetype,
  personality,
  physicalProfile,
  development,
  volatility,
  injuryRisk,
  scoutNotes
}
```

Nada disso deve entrar no save real antes da etapa de integracao controlada.

## 10. Roadmap Seguro

### P1 - Preview Visual Isolado do Procedural

Status:
Implementado como primeira versao no basquete.

Objetivo:
Criar um painel visual de debug para visualizar o procedural sem substituir mercado.

Esse painel deve preparar o caminho para visualizar, no futuro:

- jogadores gerados;
- elencos gerados;
- times gerados;
- orcamentos;
- perfis de clubes;
- lore;
- forca estimada;
- comparacao entre equipes.

Escopo inicial seguro:

- seed input;
- botao gerar;
- tabela de jogadores;
- filtros por posicao/arquetipo;
- cards de resumo;
- scout notes;
- warnings de calibragem.

Arquivos provaveis:

- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`

Arquivos usados na primeira versao:

- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`

Evitar:

- `script.js`, se possivel;
- `localStorage`;
- alterar mercado;
- alterar temporada.

Criterio de sucesso:

- painel visual funciona;
- seed igual mostra os mesmos jogadores;
- mercado atual segue intacto;
- nenhum save e criado ou alterado.

Observacao:
As lores manuais ainda nao sao necessarias nesta etapa. Elas passam a ser necessarias a partir de P3/P4, quando o gerador comecar a criar clubes e liga completa.

### P2 - Preview Visual de Elenco

Objetivo:
Gerar um elenco fechado a partir de seed e perfil, ainda sem integrar ao jogo.

Deve mostrar:

- elenco completo;
- folha salarial;
- idade media;
- forca por posicao;
- excesso/carencia por posicao;
- potenciais titulares;
- prospects;
- riscos.

Arquivos provaveis:

- `shared/procedural-roster-generator.js`
- `shared/procedural-preview-ui.js`
- `temporada-basquete/generation-config.js`

Arquivos usados na primeira versao:

- `shared/procedural-roster-generator.js`
- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`

Criterio de sucesso:

- gera elenco coerente;
- nao substitui elenco atual;
- nao altera save.

Status:
Primeira versao implementada como modo "Elenco gerado" dentro da aba Procedural do basquete. Ainda nao substitui mercado, elenco atual, temporada ou save.

### P3 - Preview Visual de Clube

Objetivo:
Gerar um clube completo em modo preview.

Deve mostrar:

- nome;
- cidade;
- lore;
- orcamento;
- objetivo;
- pressao;
- estilo de montagem;
- elenco inicial;
- pontos fortes e fracos.

Arquivos provaveis:

- `shared/procedural-club-generator.js`
- `shared/procedural-lore-datasets.js`
- `shared/procedural-preview-ui.js`

Arquivos usados na primeira versao:

- `shared/procedural-club-generator.js`
- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`

Criterio de sucesso:

- mesma seed gera mesmo clube;
- lore influencia atributos estruturais;
- usuario consegue entender o desafio daquele clube.

Status:
Primeira versao implementada na aba Procedural do basquete. Usa lores prototipo internas para validar estrutura. As lores oficiais do Lucas ainda nao foram conectadas.

Atualizacao:
As 100 lores oficiais da pasta `Lores e decisoes` foram convertidas para `shared/procedural-lore-datasets.js` por meio de `tools/build-procedural-lore-datasets.js`. O gerador de clubes agora usa esse banco real quando carregado, mantendo fallback para as lores prototipo. A UI de clube mostra categoria da lore, quantidade de decisoes especificas indexadas e exemplos de decisoes.

### P4 - Preview Visual da Liga Completa

Objetivo:
Gerar a liga inteira em preview.

Preparacao antes da P4:

- Gerado CSV de calibragem com 100 seeds de clubes em `analises/calibragem-clubes-100-seeds.csv`.
- Criado script reproduzivel em `tools/export-procedural-club-seeds.js`.
- Primeira leitura indicou pressao salarial muito alta em alguns perfis, especialmente clubes de baixo orcamento com folha acima do teto.
- Gerada exportacao completa com clubes e atletas:
  - `analises/calibragem-completa-clubes-100-seeds.csv`
  - `analises/calibragem-completa-atletas-100-seeds.csv`
  - `tools/export-procedural-full-calibration.js`
- A exportacao completa permite calibrar atributos, potencial, salario, risco, arquetipos, perfis psicologicos, perfis fisicos e encaixe dos atletas dentro das lores de clube.
- Antes da calibragem final, o banco real de lores foi conectado. Proximas exportacoes devem ser refeitas usando as lores reais, nao os prototipos.
- Calibragem refeita com as lores reais conectadas usando o prefixo `CALIBRAGEM-BASQUETE-LORES-REAIS`.
- Os arquivos `calibragem-completa-clubes-100-seeds.csv` e `calibragem-completa-atletas-100-seeds.csv` agora refletem o banco real de 100 lores.
- Resultado da nova amostra:
  - 100 clubes.
  - 1200 atletas.
  - overall medio dos clubes: 76.4.
  - pressao salarial media: 94.4%.
  - pressao salarial maxima: 166%.
  - CA media dos atletas: 73.9.
  - potencial medio dos atletas: 81.9.
  - salario medio dos atletas: 5.5.
- A calibragem ainda indica problema relevante: clubes de baixo orcamento podem nascer com folha muito acima do teto.

Deve mostrar:

- tabela de clubes gerados;
- tiers de forca;
- orcamentos;
- favoritos;
- clubes medios;
- candidatos ao rebaixamento;
- rivais diretos;
- comparacao com o clube do usuario.

Arquivos provaveis:

- `shared/procedural-league-generator.js`
- `shared/procedural-club-generator.js`
- `shared/procedural-preview-ui.js`

Arquivos usados na primeira versao:

- `shared/procedural-league-generator.js`
- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`

Criterio de sucesso:

- liga e deterministica;
- distribuicao de forca e coerente;
- cada clube tem identidade propria;
- usuario consegue ver o contexto competitivo.

Status:
Primeira versao implementada como modo "Liga gerada" dentro da aba Procedural do basquete. A liga gera 16 clubes calibrados por seed, mostra o ranking projetado, favoritos, briga por playoffs, parte baixa e destaca o clube inicial do usuario. Continua sem alterar save, mercado, temporada ou `state`.

Validacao inicial:

- Mesma seed gera a mesma liga.
- Seed diferente gera outra liga.
- Teste `P4-TESTE` gerou 16 clubes.
- Spread de forca no teste: 7.2 pontos de overall.
- Warnings de liga no teste: 0.

### P5 - Calibragem da Distribuicao de Forca da Liga

Objetivo:
Criar debug estatistico para a liga.

Medir:

- media de forca por tier;
- diferenca entre favoritos e rebaixamento;
- folha salarial por tier;
- idade media por perfil;
- potencial medio;
- quantidade de prospects;
- equilibrio entre ataque/defesa.

Criterio de sucesso:

- warnings indicam ligas desbalanceadas;
- favoritos parecem favoritos;
- candidatos ao rebaixamento parecem vulneraveis;
- ha variedade sem caos.

Status:
Primeira versao implementada como diagnostico isolado da liga.

Arquivos usados:

- `shared/procedural-league-debug.js`
- `shared/procedural-league-generator.js`
- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`
- `tools/export-procedural-league-debug.js`

O modo "Liga gerada" agora mostra:

- gap entre media do topo e media da parte baixa;
- range geral de overall;
- mediana de overall;
- p90 e maximo de pressao salarial;
- resumo por `strengthTier`;
- resumo por `rosterStyle`;
- resumo por faixa da liga.

Validacao inicial:

- Exportado `analises/debug-ligas-50-seeds.csv`.
- 50 ligas testadas.
- 32 ligas apresentaram algum warning de distribuicao.
- Gap medio topo/fundo: 4.9 de overall.

Leitura:
A P5 revelou que a liga ainda esta um pouco compactada. O debug ja funciona, mas a proxima calibragem deve aumentar a diferenca entre favoritos e parte baixa sem destruir a coerencia dos clubes.

### P5.1 - Simulacao de Temporadas Procedurais

Objetivo:
Simular temporadas inteiras da liga procedural em laboratorio para validar tanto a geracao da liga quanto o comportamento esportivo dos clubes.

Arquivos usados:

- `shared/procedural-season-simulator.js`
- `shared/procedural-preview-ui.js`
- `temporada-basquete/index.html`
- `temporada-basquete/styles.css`
- `tools/export-procedural-season-simulations.js`

O simulador mede:

- campeao simulado;
- rank projetado do campeao;
- preservacao do top 4;
- taxa de zebras;
- correlacao entre ranking projetado e ranking simulado;
- classificacao completa simulada.

Validacao inicial:

- Exportado `analises/simulacao-ligas-50-seeds.csv`.
- Exportado `analises/simulacao-classificacoes-50-seeds.csv`.
- 50 ligas simuladas.
- 800 linhas de classificacao geradas.
- Top 4 medio preservado: 56%.
- Taxa media de zebra: 13.8%.
- Correlacao media entre ranking projetado e simulado: 0.595.
- Ligas com warnings de simulacao: 8.
- Ligas com warnings de geracao: 27.

Leitura:
A simulacao em si parece ter taxa de zebra saudavel, mas a correlacao moderada e os warnings de geracao reforcam o diagnostico da P5: a liga ainda precisa abrir mais distancia entre favoritos, bloco medio e parte baixa.

### P5.2 - Abertura de Diferenca Entre Faixas da Liga

Objetivo:
Aplicar uma calibragem de faixa competitiva na liga, sem reescrever o gerador de clubes, para separar melhor favoritos, bloco de playoffs, meio e parte baixa.

Implementacao:

- `shared/procedural-league-generator.js` passou a aplicar `applyLeagueStrengthCalibration`.
- A calibragem usa o ranking inicial da liga e aplica ajustes leves por faixa:
  - favoritos recebem bonus;
  - bloco de playoffs recebe bonus menor;
  - meio de tabela recebe leve reducao;
  - parte baixa recebe reducao maior.
- O ajuste e registrado em `team.leagueCalibration`.
- Os warnings agregados da liga foram limpos para focar em problemas coletivos, separando diagnostico de clube fino do diagnostico de liga.

Resultado apos rerodar 50 ligas:

- Gap medio topo/fundo: 8.1 de overall.
- Antes era 4.9.
- Ligas com warnings de debug: 8 de 50.
- Antes eram 32 de 50.

Resultado apos rerodar 50 temporadas simuladas:

- Top 4 medio preservado: 67%.
- Antes era 56%.
- Taxa media de zebra: 17.1%.
- Antes era 13.8%.
- Correlacao media ranking projetado vs simulado: 0.749.
- Antes era 0.595.
- Warnings de simulacao: 3 ligas.
- Warnings de geracao: 5 ligas.

Leitura:
A abertura de diferenca melhorou bastante a sustentacao do ranking projetado sem matar zebras. Os warnings restantes sao principalmente `few_low_tier_teams` e `few_good_tier_teams`, ou seja, agora o proximo ajuste e diversidade/composicao de tiers na liga.

### P5.3 - Calibragem de Composicao de Tiers da Liga

Objetivo:
Garantir que cada liga procedural tenha uma quantidade minima de equipes de parte baixa e de equipes boas, evitando que algumas seeds criem uma liga visualmente competitiva, mas pobre em diversidade de perfis.

Implementacao:

- `shared/procedural-league-generator.js` passou a aplicar `ensureLeagueTierDiversity`.
- A calibragem roda depois da geracao dos clubes e antes da montagem do ranking projetado.
- Para uma liga de 16 clubes, o alvo minimo atual e:
  - 3 clubes `low`;
  - 3 clubes `good`.
- A escolha preserva a identidade competitiva:
  - se faltam clubes `low`, os clubes mais fracos da seed sao puxados para `low`;
  - se faltam clubes `good`, os clubes mais fortes disponiveis sao puxados para `good`.
- Ajustes ficam registrados em `team.leagueCompositionCalibration`.
- O retorno da liga agora inclui `compositionCalibration`, com alvos e mudancas aplicadas.

Resultado apos rerodar 50 ligas:

- Gap medio topo/fundo: 8.1 de overall.
- Warnings de debug: 0 de 50.
- Antes eram 8 de 50 apos a P5.2.

Resultado apos rerodar 50 temporadas simuladas:

- Top 4 medio preservado: 67%.
- Taxa media de zebra: 17.1%.
- Correlacao media ranking projetado vs simulado: 0.749.
- Warnings de simulacao: 3 ligas.
- Warnings de geracao: 0 ligas.
- Antes os warnings de geracao eram 5 ligas.

Leitura:
A composicao de tiers agora esta estavel sem mexer na taxa de zebra nem na correlacao. A liga procedural ficou mais legivel: favoritos continuam fortes, parte baixa existe em toda seed e o bloco de bons times nao some por acaso.

### P5.4 - Diagnostico Narrativo e Impacto Proporcional de Decisoes

Objetivo:
Validar se a liga procedural nao apenas e coerente matematicamente, mas tambem sustenta narrativas: objetivos fazem sentido, lores combinam com destino esportivo e decisoes relevantes conseguem afetar o rumo da temporada de forma proporcional.

Implementacao:

- `shared/procedural-season-simulator.js` passou a aceitar `teamEffects` opcionais em modo isolado.
- Esses efeitos permitem simular cenarios hipoteticos sem alterar a liga real:
  - boas decisoes: bonus leve de rating e menor volatilidade;
  - mas decisoes: penalidade leve de rating e maior volatilidade.
- `shared/procedural-narrative-debug.js` foi criado para analisar:
  - alinhamento entre objetivo e resultado;
  - lores de titulo que chegam fracas demais;
  - lores de playoffs projetadas abaixo demais;
  - clubes de desenvolvimento sem base de crescimento;
  - times `low` ou `good` com resultado extremo demais;
  - lores com alta alavanca de decisao, mas baixo impacto simulado.
- `tools/export-procedural-narrative-debug.js` exporta:
  - `analises/narrativa-ligas-50-seeds.csv`;
  - `analises/narrativa-clubes-50-seeds.csv`.
- A aba Procedural do basquete agora mostra um resumo de diagnostico narrativo no modo "Liga gerada".

Resultado apos analisar 50 ligas:

- 50 ligas analisadas.
- 800 clubes analisados.
- Objetivos coerentes em media: 52%.
- Ligas com warnings narrativos: 50 de 50.
- Clubes com lore de decisao forte e baixo impacto simulado: 159.
- A simulacao esportiva principal continuou estavel:
  - warnings de debug: 0 de 50;
  - warnings de geracao: 0;
  - gap topo/fundo: 8.1;
  - top 4 preservado: 67%;
  - zebras: 17.1%;
  - correlacao: 0.749.

Leitura:
A P5.4 mostrou que a geracao e a simulacao ja estao boas como estrutura competitiva, mas o sistema de decisoes ainda nao afeta o destino da liga de forma suficiente. Hoje as decisoes do banco de lores existem como contexto e diagnostico, mas ainda nao estao conectadas como motor continuo de temporada. Isso deve virar uma etapa propria antes de considerar a liga procedural madura.

Observacao importante:
O sistema futuro de titulares, rotacao e substituicoes tambem deve entrar nessa arquitetura. Ele e uma ponte natural entre decisao do usuario e resultado esportivo, porque permite que escolhas como poupar veteranos, desenvolver jovens, encurtar rotacao ou mudar quinteto tenham impacto mais profundo e mais legivel na simulacao.

### P5.5 - Motor de Decisoes Procedurais em Laboratorio

Objetivo:
Criar uma primeira camada testavel para transformar o banco real de 2000 decisoes em impacto esportivo proporcional, sem integrar ainda ao save, mercado, UI principal ou temporada real.

Implementacao:

- Criado `shared/procedural-decision-engine.js`.
- O motor expoe:
  - `createInitialDecisionState(team)`;
  - `applyEffects(state, effects)`;
  - `convertDecisionStateToTeamEffect(initialState, finalState)`;
  - `inferDecisionStrategy(team)`;
  - `simulateDecisionPackage(team, decisions, options)`;
  - `simulateLeagueDecisionPackages(league, decisions, options)`.
- O motor converte efeitos como:
  - `fadiga`;
  - `risco_lesao`;
  - `rel_torcida`;
  - `rel_diretoria`;
  - `rel_elenco`;
  - `rel_comissao`;
  - `coesao`;
  - `desempenho`;
  - `moral`;
  - `pressao`;
  - `desenvolvimento_base`;
  - `orcamento`;
  - `imprensa`.
- A saida principal e um pacote `teamEffects` compativel com `simulateProceduralLeagueSeason`.
- O banco pesado `Banco_2000_Decisoes_Ramificadas_Unificado.json` nao foi colocado no runtime normal do browser.
- Criado `tools/export-procedural-decision-impact.js`.
- O exportador gera:
  - `analises/impacto-decisoes-ligas-25-seeds.csv`;
  - `analises/impacto-decisoes-clubes-25-seeds.csv`.
- Estrategias testadas:
  - `balanced`;
  - `aggressive`;
  - `development`;
  - `conservative`;
  - `crisis_control`;
  - `lore_fit`, em que cada clube escolhe a estrategia mais coerente com sua lore.

Resultado da primeira amostra:

- 25 seeds analisadas.
- 6 estrategias por seed.
- 150 linhas de liga.
- 2400 linhas de clube.
- Troca media de campeao: 13.3%.
- Swing medio absoluto de ranking: 0.8 posicao.
- Swing medio absoluto de vitorias: 0.3.
- No modo `lore_fit`:
  - campeao mudou em 20% das seeds;
  - correlacao media de ranking ficou em 0.722;
  - taxa de zebra ficou em 18%.
- A simulacao principal sem decisoes continuou estavel:
  - top 4 preservado: 67%;
  - zebra: 17.1%;
  - correlacao: 0.749;
  - warnings de geracao: 0.

Leitura:
As decisoes agora afetam o destino da liga em laboratorio, especialmente no campeao e em alguns deslocamentos individuais, mas o impacto medio ainda e moderado. Isso e bom como primeiro passo seguro: nao virou caos. A proxima calibragem deve aumentar a diferenca entre decisoes boas, neutras e ruins, talvez aplicando decisoes apenas ao usuario e a rivais-chave, ou usando rotacao/titulares para tornar escolhas como poupar, acelerar jovens e encurtar banco mais visiveis.

Proxima etapa candidata:
P5.6 - Sistema procedural de titulares, rotacao e substituicoes em laboratorio.

### P6 - Integracao Controlada Com Criacao de Elenco

Objetivo:
Permitir usar um elenco procedural em modo experimental, sem remover o modo atual.

Regras:

- modo atual continua padrao;
- procedural fica atras de escolha explicita;
- save antigo continua funcionando;
- IDs precisam ser estaveis.

Risco:
Medio.

So fazer depois de P1-P5.

### P6.0 - Carreira Experimental Sem Save

Objetivo:
Dar ao usuario a primeira capacidade real de mudar o rumo de uma temporada procedural por meio de decisoes, mantendo tudo em laboratorio e sem salvar nada.

Implementacao:

- Criado `shared/procedural-career-lab.js`.
- A aba Procedural do basquete ganhou o modo "Carreira experimental".
- O usuario escolhe uma filosofia de decisao:
  - equilibrada;
  - agressiva;
  - desenvolvimento de jovens;
  - controle de carga;
  - controle de crise;
  - coerente com a lore.
- O laboratorio compara:
  - temporada base;
  - temporada com decisoes do usuario.
- A tela mostra:
  - ranking antes/depois;
  - vitorias antes/depois;
  - saldo antes/depois;
  - alteracoes de moral, coesao, fadiga e risco;
  - efeito em rating e volatilidade;
  - classificacao simulada com o clube do usuario destacado.
- Criado `tools/export-procedural-career-lab.js`.
- O export gera `analises/carreira-experimental-50-seeds.csv`.

Resultado inicial:

- 50 seeds analisadas.
- 6 filosofias por seed.
- 300 cenarios.
- Swing medio absoluto de ranking: 0.3 posicao.
- Swing medio absoluto de vitorias: 0.2.
- Troca de campeao: 4%.
- Filosofias com maior deslocamento medio:
  - equilibrada: 0.4 rank;
  - desenvolvimento: 0.4 rank;
  - controle de crise: 0.4 rank.

Leitura:
A P6.0 ja permite que decisoes do usuario alterem o rumo da temporada procedural, mas de forma ainda bem controlada. Isso e adequado para a primeira integracao sem save. Para que o impacto fique mais perceptivel e estrategico, a proxima etapa ainda deve ser P5.6/P6.1: titulares, rotacao e substituicoes. Essa camada deve transformar escolhas como poupar veteranos, dar minutos a jovens ou encurtar banco em efeitos mais claros dentro da simulacao.

### P6.1 - Titulares, Rotacao e Minutos em Laboratorio

Objetivo:
Fazer as decisoes do usuario aparecerem de forma mais concreta na simulacao, traduzindo filosofias como encurtar banco, desenvolver jovens ou poupar veteranos em titulares, minutos e efeitos esportivos.

Implementacao:

- Criado `shared/procedural-rotation-engine.js`.
- O motor expoe:
  - `buildRotation(team, options)`;
  - `inferRotationPlan(team, strategy)`;
  - `getPlanFromStrategy(strategy)`;
  - `getTeamEffectFromRotation(rotation)`.
- Planos atuais:
  - `balanced`;
  - `short_rotation`;
  - `development`;
  - `load_management`;
  - `defense_first`.
- A P6.0 agora incorpora a rotacao na carreira experimental.
- A aba Procedural, em "Carreira experimental", mostra:
  - plano de rotacao;
  - atletas ativos;
  - media dos titulares;
  - media do banco;
  - minutos de prospects;
  - carga do top 5;
  - tabela dos atletas usados e minutagem.
- `tools/export-procedural-career-lab.js` passou a exportar metricas de rotacao:
  - plano;
  - atletas ativos;
  - media titulares/banco;
  - minutos de prospects;
  - minutos de alto risco;
  - carga do top 5;
  - delta de rating e fadiga da rotacao.

Resultado apos rerodar 50 seeds:

- 300 cenarios analisados.
- Swing medio absoluto de ranking: 1.5 posicao.
- Antes da rotacao era 0.3.
- Swing medio absoluto de vitorias: 0.8.
- Antes era 0.2.
- Troca de campeao: 14.7%.
- Antes era 4%.
- Por filosofia:
  - equilibrada: 1.6 rank;
  - agressiva/banco curto: 1.5 rank;
  - desenvolvimento: 1.4 rank;
  - controle de carga: 1.2 rank;
  - controle de crise/defesa: 1.6 rank;
  - coerente com lore: 1.5 rank.

Leitura:
A camada de rotacao fez exatamente o papel esperado: aumentou a capacidade do usuario de mudar o rumo da temporada sem conectar save ou temporada principal. Agora a decisao nao e apenas um modificador abstrato; ela muda minutos, uso de jovens, carga dos principais e risco. A proxima evolucao deve calibrar melhor substituicoes automáticas e, depois, permitir uma integracao opcional com uma nova carreira procedural real.

### P6.2 - Intervencoes Continuas Durante a Simulacao Ao Vivo

Objetivo:
Permitir que mudancas de tatica, ritmo, rotacao e abordagem ocorram enquanto a simulacao ao vivo esta rodando, sem depender de checkpoints fixos e sem reiniciar a partida.

Implementacao:

- Criado `shared/live-coaching.js`.
- `shared/live-simulation.js` agora expoe `setCoaching(patch, meta)`.
- O estado vivo da partida passa a conter:
  - `coaching.tactic`;
  - `coaching.pace`;
  - `coaching.rotationPlan`;
  - `coaching.defensivePressure`;
  - `coaching.offensiveFocus`;
  - `coaching.riskTolerance`;
  - `coaching.activeInstructions`.
- `shared/live-match-ui.js` ganhou controles continuos na tela de Partida ao Vivo:
  - tatica;
  - ritmo;
  - rotacao;
  - pressao defensiva;
  - foco ofensivo;
  - risco.
- `temporada-basquete/match-adapter.js` passou a ler `state.coaching` a cada posse.
- No basquete, os comandos afetam:
  - alvo de posses/ritmo;
  - taxa de erro;
  - taxa de faltas;
  - volume de bolas de 3;
  - chance de acerto;
  - pressao defensiva;
  - uso de titulares e banco.
- `temporada-basquete/script.js` conecta a UI ao `liveMatchController.setCoaching`.

Validacao inicial:

- Sintaxe validada em:
  - `shared/live-coaching.js`;
  - `shared/live-simulation.js`;
  - `shared/live-match-ui.js`;
  - `temporada-basquete/match-adapter.js`;
  - `temporada-basquete/script.js`.
- Teste automatizado:
  - partida avancou 20 ticks;
  - comando aplicado em tempo real: ritmo rapido, correr, bolas de 3 e pressao alta;
  - partida continuou ate 40 ticks sem reiniciar;
  - `state.coaching.updatedAtTick` registrou o ajuste no tick 20;
  - eventos seguintes foram gerados com o novo estado.

Leitura:
A P6.2 cria a base certa para o que o Lucas pediu: a simulacao nao para para esperar uma decisao; ela continua viva, e o usuario pode mudar o comportamento do time durante o fluxo. A proxima calibragem deve medir o impacto medio desses comandos em muitas partidas e depois replicar o contrato para volei e futsal.

### P6.3 - Calibragem das Intervencoes Continuas

Objetivo:
Medir se os comandos ao vivo mudam a partida na direcao certa e em intensidade aceitavel, sem virarem botoes magicos.

Implementacao:

- Criado `tools/export-live-coaching-impact.js`.
- O export simula varios jogos de basquete com comandos aplicados durante a partida.
- Cenarios atuais:
  - `baseline`;
  - `run_and_gun_3pt`;
  - `defense_high_pressure`;
  - `protect_lead_safe`;
  - `short_rotation_star`;
  - `development_minutes`.
- Gerado `analises/impacto-comandos-ao-vivo-120-jogos.csv`.
- Ajustes feitos apos a primeira leitura:
  - separacao entre modificadores ofensivos e defensivos em `shared/live-coaching.js`;
  - correcao do modificador de ritmo, que estava invertido;
  - suavizacao da defesa alta;
  - aumento leve do sinal de foco em bolas de 3.

Resultado apos 120 jogos por cenario:

- `baseline`:
  - placar casa: 87.4;
  - margem: +1.7;
  - 3PA: 23.5;
  - turnovers: 13.7.
- `run_and_gun_3pt`:
  - placar casa: 93.4;
  - margem: -1.0;
  - 3PA: 33.5;
  - turnovers: 18.8.
- `defense_high_pressure`:
  - placar casa: 79.1;
  - margem: +4.2;
  - 3PA: 22.7;
  - turnovers: 11.4.
- `protect_lead_safe`:
  - placar casa: 80.6;
  - margem: +3.2;
  - 3PA: 23.0;
  - turnovers: 10.0.
- `short_rotation_star`:
  - placar casa: 86.5;
  - margem: -1.4;
  - 3PA: 23.4;
  - turnovers: 14.8.
- `development_minutes`:
  - placar casa: 85.2;
  - margem: -2.5;
  - 3PA: 24.4;
  - turnovers: 14.8.

Leitura:
Os comandos agora estao se comportando de forma legivel. Correr e chutar de 3 aumenta volume e erro; proteger vantagem reduz ritmo e perda de bola; defesa alta reduz placar e melhora margem sem explodir. A proxima etapa deve replicar o contrato continuo para volei e futsal, respeitando as regras especificas de cada modalidade.

### P7 - Integracao Futura Com Mercado

Objetivo:
Transformar `freeAgents` e excedentes de elenco em mercado procedural.

Regras:

- primeiro comparar mercado fixo e procedural lado a lado;
- depois permitir usar mercado procedural em nova carreira;
- nunca substituir saves antigos automaticamente.

Risco:
Alto.

### P7.0 - Mercado Procedural em Preview

Objetivo:
Criar a primeira camada de mercado procedural em laboratorio, sem trocar o mercado fixo, sem contratar atletas e sem mexer em save.

Implementacao:

- Criado `shared/procedural-market-generator.js`.
- O gerador expoe:
  - `generateProceduralMarket(options)`;
  - `generateProceduralBasketballMarket(seed, options)`;
  - `ProceduralMarketGenerator.summarizeMarket(players, profile)`;
  - `ProceduralMarketGenerator.getMarketWarnings(players, summary, profile)`.
- A aba Procedural do basquete ganhou o modo "Mercado procedural".
- O preview mostra:
  - resumo de salario, forca, potencial, idade e warnings;
  - distribuicao por posicao;
  - distribuicao por perfil de mercado;
  - melhores valores;
  - tabela de atletas livres gerados.
- Perfis atuais:
  - `balanced`;
  - `win_now`;
  - `budget`;
  - `development`.
- Criado `tools/export-procedural-market-preview.js`.
- O export gera:
  - `analises/mercado-procedural-50-seeds.csv`;
  - `analises/mercado-procedural-jogadores-50-seeds.csv`.

Resultado da primeira amostra:

- 50 seeds analisadas.
- 4 perfis por seed.
- 200 cenarios de mercado.
- 4800 atletas gerados.
- Salario medio geral: $4.8M.
- Forca media geral: 70.2.
- Mercados com warnings: 20 de 200.
- Por perfil:
  - `balanced`: salario medio $4.8M, CA 70.2, POT 78.4, 9 warnings.
  - `win_now`: salario medio $6.2M, CA 75.5, POT 81.5, 0 warnings.
  - `budget`: salario medio $3.8M, CA 65.6, POT 74.0, 11 warnings.
  - `development`: salario medio $4.6M, CA 69.4, POT 78.6, 0 warnings.

Leitura:
O mercado procedural agora existe como laboratorio seguro. A diferenca entre perfis aparece: vencer agora gera mais impacto e custo, baixo custo gera atletas mais baratos e fracos, desenvolvimento aumenta a presenca de prospects. O proximo passo deve comparar esse mercado procedural com o mercado fixo atual, ainda em modo visual, antes de permitir qualquer contratacao real.

### P7.1 - Comparacao Visual Entre Mercado Fixo e Procedural

Objetivo:
Permitir comparar o mercado fixo atual do `script.js` com o mercado procedural por seed, ainda sem contratar atletas procedurais, sem alterar estado principal e sem mexer em saves.

Implementacao:

- `temporada-basquete/script.js` ganhou uma ponte read-only:
  - `getLegacyBasketballMarketSnapshot(division)`.
- A ponte retorna:
  - divisao;
  - nome da categoria;
  - teto salarial;
  - lista clonada dos atletas fixos;
  - resumo de salario, forca estimada, potencial estimado e distribuicao por posicao/perfil.
- Como o mercado fixo nao possui `currentAbility` e `potential`, a P7.1 calcula esses campos apenas como estimativa visual de comparacao.
- `shared/procedural-preview-ui.js` agora mostra, no modo "Mercado procedural":
  - card do mercado fixo atual;
  - card do mercado procedural;
  - diferenca de salario medio, forca media e quantidade de atletas;
  - top 10 do mercado fixo por valor estimado;
  - top 10 do mercado procedural por valor estimado.

Regras mantidas:

- Nenhum atleta procedural pode ser contratado nesta etapa.
- O mercado fixo continua sendo a unica fonte usada pela aba Mercado real.
- Nenhum save antigo foi alterado.
- Nenhum campo novo foi persistido em `localStorage`.

Leitura:
A P7.1 cria a mesa de comparacao necessaria antes de integrar mercado procedural de verdade. Agora da para calibrar se o procedural esta barato, caro, forte, fraco, jovem demais ou parecido demais com o mercado fixo atual.

### P7.2 - Encaixe Entre Necessidades do Clube e Mercado

Objetivo:
Criar uma regua de encaixe entre o clube procedural gerado e os atletas disponiveis no mercado procedural, ainda sem permitir contratacao real.

Implementacao:

- `shared/procedural-market-generator.js` ganhou:
  - `analyzeMarketFitForClub(club, market, options)`;
  - `calculateClubMarketFitScore(player, club)`;
  - export publico `analyzeProceduralMarketFitForClub`.
- A analise considera:
  - carencias por posicao do elenco;
  - orcamento restante;
  - intencao de mercado do clube;
  - estilo de elenco;
  - valor relativo do atleta;
  - risco;
  - prontidao atual versus potencial.
- A aba Procedural, no modo "Mercado procedural", agora mostra:
  - clube analisado;
  - intencao de mercado;
  - espaco financeiro;
  - carencias detectadas;
  - melhor encaixe;
  - tabela dos 8 melhores encaixes.
- `tools/export-procedural-market-preview.js` passou a gerar tambem:
  - `analises/mercado-procedural-encaixes-50-seeds.csv`.

Resultado da primeira amostra:

- 50 seeds.
- 4 perfis de mercado por seed.
- 1600 encaixes ranqueados.
- Media do melhor encaixe por perfil:
  - `balanced`: 49.6.
  - `win_now`: 53.4.
  - `budget`: 51.7.
  - `development`: 50.5.
- Taxa de melhor encaixe cabendo no orcamento:
  - `balanced`: 96%.
  - `win_now`: 92%.
  - `budget`: 96%.
  - `development`: 96%.
- Motivos mais frequentes nos encaixes:
  - cabe no espaco financeiro;
  - ajuda imediatamente;
  - encaixa no plano de desenvolvimento;
  - cobre carencia por posicao.

Leitura:
A P7.2 comeca a transformar o mercado procedural em tomada de decisao. Ainda nao ha contratacao, mas o jogo ja consegue explicar por que um atleta faria sentido para aquele clube especifico. Isso prepara uma futura P7.3 com simulacao de contratacao em sandbox antes de mexer no mercado real.

### P7.3 - Simulacao de Contratacao em Sandbox

Objetivo:
Permitir visualizar o impacto de uma contratacao procedural sem alterar elenco real, mercado fixo, save ou temporada.

Implementacao:

- `shared/procedural-market-generator.js` ganhou:
  - `simulateMarketSigning(club, player, options)`;
  - export publico `simulateProceduralMarketSigning`.
- O sandbox simula:
  - atleta entrando no elenco;
  - saida sugerida automatica quando o elenco ja esta cheio;
  - resumo antes/depois;
  - delta de habilidade atual media;
  - delta de potencial medio;
  - delta de folha;
  - orcamento restante depois;
  - carencias resolvidas;
  - veredito textual.
- A aba Procedural, no modo "Mercado procedural", agora mostra para cada encaixe:
  - veredito do movimento;
  - delta de CA media;
  - delta de folha;
  - jogador sugerido para saida;
  - motivo do encaixe.
- `tools/export-procedural-market-preview.js` passou a incluir os campos de sandbox dentro de:
  - `analises/mercado-procedural-encaixes-50-seeds.csv`.

Resultado da primeira amostra:

- 50 seeds.
- 4 perfis por seed.
- 200 melhores encaixes analisados como top 1 de cada cenario.
- Vereditos dos melhores encaixes:
  - movimento neutro: 106.
  - exige ajuste financeiro: 41.
  - melhora clara: 37.
  - ganho de teto: 16.
- Deltas medios por perfil no melhor encaixe:
  - `balanced`: CA +0.21, POT +0.42, folha +$0.4M.
  - `win_now`: CA +0.35, POT +0.44, folha +$1.2M.
  - `budget`: CA -0.20, POT +0.22, folha -$0.6M.
  - `development`: CA +0.25, POT +0.59, folha +$0.6M.
- Em 102 dos 200 melhores encaixes nao houve warning de sandbox.
- Warnings principais:
  - `sandbox_no_sporting_gain`;
  - `sandbox_salary_over_budget`.

Leitura:
A P7.3 ainda nao deve ser usada como botao de contratacao. Ela funciona como uma mesa de decisao: mostra que alguns atletas sao bons encaixes narrativos/financeiros, mas nem todos melhoram o elenco imediatamente. Isso e desejavel para o manager, porque a escolha passa a ter trade-offs reais antes de virar uma acao persistida.

### P8 - Integracao Futura Com Temporada e Save

Objetivo:
Persistir `state.world` em novas carreiras procedurais.

Regras:

- schema version claro;
- migracao segura;
- fallback para saves antigos;
- validacao de carregar/salvar antes de liberar.

Risco:
Alto.

### P8.0 - Laboratorio Procedural Separado

Objetivo:
Separar o laboratorio procedural em um HTML proprio, para testar mundo, clube, liga, carreira experimental, mercado e sandbox sem carregar o jogo completo nem o `script.js` legado.

Implementacao:

- Criado `temporada-basquete/procedural.html`.
- O novo HTML carrega:
  - modulos compartilhados procedurais;
  - configuracao procedural do basquete;
  - `shared/procedural-preview-ui.js`;
  - `temporada-basquete/styles.css`.
- O novo HTML nao carrega:
  - `temporada-basquete/script.js`;
  - simulacao principal;
  - mercado real;
  - saves;
  - custom config.
- A tela inicial `Clique aqui para jogar.html` ganhou um atalho para "Lab Procedural".
- `shared/procedural-preview-ui.js` agora mostra uma mensagem amigavel quando o mercado fixo legado nao esta disponivel no laboratorio isolado.
- `temporada-basquete/styles.css` recebeu ajuste minimo para links com `.tab-button` terem o mesmo visual dos botoes de aba.

Regras mantidas:

- Nenhum save foi alterado.
- Nenhum mercado real foi substituido.
- Nenhuma contratacao real foi criada.
- O laboratorio isolado continua sendo ambiente de calibragem.

Leitura:
Esse HTML separado e a ponte certa antes da P8 real. Ele permite evoluir a carreira procedural, mercado e mundo persistivel com menos ruido do jogo legado. A P8 de verdade deve comecar so depois de definirmos como uma nova carreira procedural sera criada, carregada e salva sem afetar saves antigos.

### P8.1 - Primeira Temporada Jogavel no HTML Procedural

Objetivo:
Transformar `temporada-basquete/procedural.html` de laboratorio puro em uma primeira temporada procedural jogavel, mantendo o ambiente isolado e sem carregar o `script.js` legado.

Implementacao:

- Criado `shared/game-state.js`.
  - Cria estado global isolado da temporada procedural.
  - Gera liga, clube controlado, elenco, tabela, resumo de equipe e log.
  - Nao usa save real.
- Criado `shared/calendar-engine.js`.
  - Gera calendario de 84 dias.
  - Processa eventos:
    - `training`;
    - `rest`;
    - `match`;
    - `narrative`;
    - `market`.
  - Expoe avancar dia e avancar semana.
- Criadas UIs modulares:
  - `shared/game-shell-ui.js`;
  - `shared/calendar-ui.js`;
  - `shared/roster-ui.js`;
  - `shared/player-card-ui.js`;
  - `shared/team-hub-ui.js`.
- `temporada-basquete/procedural.html` agora mostra a carreira procedural como tela principal.
- O laboratorio antigo continua disponivel em uma area recolhivel.
- `temporada-basquete/styles.css` recebeu estilos para:
  - abas internas;
  - calendario;
  - eventos;
  - cards de jogadores;
  - central da equipe;
  - tabela;
  - log.
- Criado `ARQUITETURA_DE_MUDANCAS_VISUAIS.md` para guiar a evolucao visual da carreira procedural.

Abas internas da primeira versao:

- Calendario;
- Elenco;
- Equipe;
- Liga;
- Mercado;
- Log.

Validacao:

- Sintaxe validada nos novos JS.
- Teste isolado criou uma temporada com:
  - 16 clubes;
  - 12 atletas no elenco controlado;
  - calendario ativo;
  - log inicial.
- Avancar uma semana levou o estado ao dia 8, semana 2, processou 7 eventos e registrou 1 jogo na tabela.

Leitura:
A P8.1 cria o primeiro loop jogavel do procedural: gerar temporada, ver elenco, avancar tempo, processar eventos e acompanhar mudancas. Ainda nao ha save, contratacao real ou integracao com o jogo completo. O proximo passo visual deve melhorar a leitura do calendario e dar mais controle ao usuario sobre foco semanal, elenco e mercado.

### P8.2 - Apresentacao da Temporada e Partida ao Vivo Procedural

Objetivo:
Reduzir a entrada abrupta na carreira procedural e conectar a simulacao em tempo real aos jogos do calendario.

Implementacao:

- `shared/game-state.js` agora inicia a carreira em `status: intro`.
- A primeira tela apresenta:
  - clube controlado;
  - lore;
  - objetivo;
  - forca;
  - orcamento;
  - pontos fortes;
  - fraquezas;
  - primeiros clubes da liga.
- `shared/game-shell-ui.js` ganhou:
  - tela de apresentacao;
  - acao `Comecar temporada`;
  - aba interna `Partida`;
  - preparacao de partida ao vivo a partir do evento `match`;
  - salvamento do resultado ao vivo no estado procedural.
- `shared/calendar-ui.js` mostra `Jogar ao vivo` nos eventos de jogo ainda nao processados.
- `temporada-basquete/procedural.html` passou a carregar:
  - `shared/match-events.js`;
  - `shared/live-coaching.js`;
  - `shared/live-simulation.js`;
  - `shared/live-match-ui.js`;
  - `temporada-basquete/match-adapter.js`.
- `shared/calendar-engine.js` ganhou `applyExternalMatchResult(state, event, liveState)`.

Validacao:

- Teste isolado criou temporada procedural.
- Encontrou jogo no dia 6.
- Rodou 10 ticks de simulacao ao vivo.
- Salvou resultado externo.
- Evento foi marcado como processado.
- Tabela registrou 1 jogo.

Leitura:
Agora o procedural tem dois caminhos para jogos: resultado rapido ao avancar o calendario, ou partida ao vivo quando o usuario escolhe jogar. Isso reforca o principio de que o usuario decide quanto controle quer ter sobre a temporada.

## 11. Onde a Etapa 4 Entra

Ainda nao estamos na Etapa 4.

Etapa 4, no plano original, significa gerar um elenco procedural sem substituir o mercado atual.

Antes disso, o caminho seguro e:

1. P1 - preview visual de jogadores: feito.
2. P2 - preview visual de elenco: iniciado/primeira versao feita.
3. P3 - preview visual de clube: iniciado/primeira versao feita.
4. Validar distribuicao, folha, posicoes, orcamento, objetivo e pressao.
5. So entao iniciar a Etapa 4 real.

## 12. Riscos Evitados Ate Agora

- Nenhum save foi alterado.
- Mercado atual nao foi substituido.
- Jogadores fixos continuam existindo.
- Temporada nao foi conectada ao procedural.
- UI principal ainda nao depende do procedural.
- `script.js` foi evitado nas etapas procedurais recentes.

## 13. Regras Para Futuras Mudancas

Antes de implementar uma nova etapa:

1. Conferir este documento.
2. Identificar se a etapa toca save, mercado, `state`, temporada ou UI principal.
3. Se tocar, criar modo opcional e fallback.
4. Rodar testes de determinismo.
5. Atualizar este documento ao final.

## 14. Log de Decisoes

- O procedural comecou pelo RNG deterministico.
- A primeira geracao real foi limitada a jogadores de basquete no console.
- O preview estatistico foi criado antes de qualquer UI.
- A calibragem matematica veio antes de integrar com mercado.
- O objetivo final foi expandido: gerar liga completa, nao apenas jogadores.
- As lores manuais serao base estrutural do gerador, nao apenas textos decorativos.
- P1 foi iniciado com uma aba visual isolada no basquete.
- P2 foi iniciado com geracao e visualizacao isolada de elenco.
- P3 foi iniciado com geracao e visualizacao isolada de clube usando lores prototipo.
- As lores manuais foram conectadas em modo preview por `shared/procedural-lore-datasets.js`.
- As decisoes ramificadas ainda nao foram integradas como sistema jogavel; por enquanto existe apenas indice leve das decisoes especificas por lore para preview.
- Antes da P4, foi gerado um CSV com 100 seeds para calibrar matematica de clubes, orcamentos, folhas e ratings.
- Depois foi gerada uma exportacao completa com 100 clubes e 1200 atletas para calibragem individual e coletiva.
- A calibragem completa foi refeita com as 100 lores reais conectadas.
- Foi criada uma camada pos-geracao de calibragem em `shared/procedural-club-calibration.js`.
- O gerador de clubes agora pode gerar raw ou calibrado:
  - calibrado por padrao;
  - raw usando `{ calibrate: false }` para testes.
- A camada expoe:
  - `calibrateClubSeed(rawClub, lore, seed)`;
  - `validateClubSeedProfile(club, lore)`;
  - `ProceduralClubCalibration.metricSnapshot(club)`.
- Foi criado `tools/export-procedural-calibration-comparison.js` para comparar raw vs calibrado.
- O comparativo atual fica em `analises/comparativo-calibragem-clubes-100-seeds.csv`.
- Resultado apos calibragem nas 100 seeds:
  - warnings pos-calibragem: 0.
  - overall medio raw: 76.4.
  - overall medio calibrado: 75.8.
  - pressao salarial media raw: 94.4%.
  - pressao salarial media calibrada: 88.2%.
  - pressao salarial maxima calibrada: 127.8%.
- Os CSVs `analises/calibragem-completa-clubes-100-seeds.csv` e `analises/calibragem-completa-atletas-100-seeds.csv` foram regenerados ja com a camada calibrada.
- P4 foi iniciada em modo preview isolado com `shared/procedural-league-generator.js`.
- A aba Procedural agora tem o modo "Liga gerada".
- P5 foi iniciada com `shared/procedural-league-debug.js` e `tools/export-procedural-league-debug.js`.
- O primeiro CSV de P5 fica em `analises/debug-ligas-50-seeds.csv`.
- Foi criada a P5.1 com simulacao isolada de temporada procedural.
- A simulacao exporta `analises/simulacao-ligas-50-seeds.csv` e `analises/simulacao-classificacoes-50-seeds.csv`.
- P5.2 abriu a diferenca entre faixas da liga usando calibragem pos-geracao no `procedural-league-generator`.
- P5.3 calibrou a diversidade de tiers da liga com `ensureLeagueTierDiversity`.
- A composicao minima atual garante 3 clubes `low` e 3 clubes `good` em ligas de 16 times.
- Apos P5.3, 50 ligas ficaram com 0 warnings de debug e 0 warnings de geracao nas simulacoes, mantendo gap topo/fundo de 8.1, top 4 preservado em 67%, zebras em 17.1% e correlacao media de 0.749.
- P5.4 criou o diagnostico narrativo e a medicao inicial de impacto proporcional de decisoes.
- O achado principal da P5.4 e que a liga esta competitivamente estavel, mas decisoes ainda nao mudam destino de forma suficiente: 159 de 800 clubes analisados tiveram lore de decisao forte com baixo impacto simulado.
- Foi registrada a necessidade futura de um sistema de titulares, rotacao e substituicoes, automatico ou gerenciado, para aprofundar a relacao entre decisao do usuario e resultado esportivo.
- P5.5 criou o primeiro motor de decisoes procedurais em laboratorio.
- O motor usa o banco real de 2000 decisoes nos exports, mas nao carrega o JSON pesado no runtime normal do jogo.
- Na primeira amostra da P5.5, decisoes mudaram campeao em 13.3% dos cenarios e em 20% no modo `lore_fit`, mas o swing medio de tabela ainda ficou moderado.
- P6.0 criou a carreira experimental sem save.
- O usuario agora consegue escolher uma filosofia de decisao na aba Procedural e ver como isso muda a temporada simulada do seu clube.
- A primeira amostra da P6.0 mostrou impacto controlado: 0.3 rank medio absoluto, 0.2 vitorias e 4% de troca de campeao em 300 cenarios.
- P6.1 criou o motor de titulares, rotacao e minutos em laboratorio.
- Com a rotacao conectada, a carreira experimental subiu para 1.5 rank medio absoluto, 0.8 vitorias e 14.7% de troca de campeao em 300 cenarios.
- P6.2 criou intervencoes continuas durante a simulacao ao vivo no basquete.
- A partida ao vivo agora aceita mudancas de tatica, ritmo, rotacao, pressao, foco ofensivo e risco enquanto roda; os proximos ticks usam o novo estado `coaching`.
- P6.3 criou a calibragem dos comandos ao vivo com `tools/export-live-coaching-impact.js`.
- A primeira calibragem gerou `analises/impacto-comandos-ao-vivo-120-jogos.csv` e ajustou ritmo, separacao ofensiva/defensiva, defesa alta e foco em bolas de 3.
- P7.0 criou o mercado procedural em preview com `shared/procedural-market-generator.js`.
- A aba Procedural do basquete agora tem o modo "Mercado procedural", ainda sem contratacoes, saves ou substituicao do mercado fixo.
- A primeira exportacao P7.0 gerou `analises/mercado-procedural-50-seeds.csv` e `analises/mercado-procedural-jogadores-50-seeds.csv`.
- P7.1 criou a comparacao visual entre mercado fixo e mercado procedural.
- `temporada-basquete/script.js` agora expoe `getLegacyBasketballMarketSnapshot` como leitura segura para a aba Procedural.
- O modo "Mercado procedural" mostra cards e top 10 lado a lado, mas continua sem contratar atletas procedurais.
- P7.2 criou a regua de encaixe entre clube procedural e mercado procedural.
- O modo "Mercado procedural" agora mostra os 8 melhores encaixes para o clube gerado pela seed.
- O exportador P7 passou a gerar `analises/mercado-procedural-encaixes-50-seeds.csv`.
- P7.3 criou a simulacao de contratacao em sandbox.
- Cada encaixe agora mostra entrada, saida sugerida, delta de CA, delta de folha, orcamento depois e veredito, ainda sem alterar elenco real.
- P8.0 criou `temporada-basquete/procedural.html` como laboratorio procedural separado.
- A tela inicial agora tem atalho para "Lab Procedural".
- O laboratorio separado nao carrega `script.js`, mercado real ou saves.
- P8.1 criou a primeira temporada jogavel dentro de `temporada-basquete/procedural.html`.
- Foram criados `shared/game-state.js`, `shared/calendar-engine.js` e UIs modulares para calendario, elenco, equipe, mercado, liga e log.
- Foi criado `ARQUITETURA_DE_MUDANCAS_VISUAIS.md` para guiar os proximos passos da camada visual.
- P8.2 adicionou tela de apresentacao do clube/liga e conectou a partida ao vivo aos eventos `match` do calendario procedural.
- O usuario agora pode avancar jogo rapido pelo calendario ou escolher `Jogar ao vivo` quando houver partida no dia.
- P8.3 iniciou a melhoria visual do HTML procedural com animacoes leves no calendario e nos cards de jogadores.
- Calendario ganhou marcadores por tipo, efeito previsto e pulso em eventos de jogo; cards ganharam barras animadas de forca, moral e fadiga.
- P8.4 tornou decisoes narrativas e mercado jogaveis em sandbox no `procedural.html`.
- Eventos narrativos agora pausam o avanco ate o usuario escolher uma resposta; mercado permite `Contratar sandbox` alterando apenas o estado isolado da pagina.
- P8.5 melhorou a visualizacao do mercado sandbox e limitou contratacoes a primeira semana da carreira procedural.
- O mercado agora usa cards de oportunidade com fit, impacto, salario, saida sugerida e bloqueio visual quando a janela fecha.
- P8.6 / Visual V1.5 transformou o calendario procedural em central semanal e deixou o Mercado fora da navegacao apos a semana 1.
- A central semanal agora mostra status da temporada, card do dia atual, campanha, proximo jogo, vestiario, progresso da temporada e faixa de 7 dias.
- P8.7 / Visual V1.6 tornou o Elenco mais gerenciavel com filtro por posicao, ordenacao, painel de alertas e selos de titular/prospecto/desgaste.
- P8.8 / Visual V1.7 transformou Equipe em painel de decisao com leitura da comissao, risco financeiro, foco sugerido e foco semanal aplicavel.
- `teamState.weeklyFocus` registra escolhas como recuperar, treinar forte, fechar grupo, buscar resultado ou equilibrar, sempre no modo procedural separado.
- P8.9 / V2.0 iniciou a saida do sandbox com save procedural proprio, versionado e separado do save legado.
- Criado `shared/procedural-career-save.js` com `temporada_procedural_careers_v1`, permitindo salvar, carregar e excluir carreiras procedurais.
- `temporada-basquete/procedural.html` e a tela inicial agora apresentam o modo como `Carreira Procedural`, nao mais apenas como laboratorio.
- P8.10 / V2.1 reorganizou a tela inicial como escolha de modo: Carreira Procedural em destaque, Jogo Completo como legado e Laboratorio Procedural como calibragem.
- `temporada-basquete/procedural.html#laboratorio` abre automaticamente o bloco recolhivel do laboratorio antigo.
- P8.11 / V2.2 fortaleceu o save procedural com validacao, normalizacao/migracao, mensagens de erro, exportacao JSON e importacao JSON.
- Imports de carreira procedural recebem novo `careerMeta.id`, preservando o save original e mantendo a separacao do save legado.
- P8.12 / V2.3 melhorou a listagem de carreiras salvas com cards de clube, campanha, semana, dia, saldo, schema e acoes diretas.
- Exclusao de carreira procedural agora usa confirmacao visual em dois passos.
- P8.13 / V3.0 iniciou a refatoracao de imersao da carreira procedural.
- Criada a aba `Central do Clube`, movendo ferramentas tecnicas para `Configuracoes avancadas`.
- Mercado passou a ter selecao de jogador e comparacao com atleta do elenco, incluindo impacto esportivo, financeiro, quimica, moral e possivel saida.
- Elenco ganhou tags narrativas calculadas e Liga ganhou `Panorama da Liga` com raio-x de adversario.
- Direcao UI 7a0 Etapa 1 criou `career-landing` sem alterar logica de jogo.
- Direcao UI 7a0 Etapa 2 reduziu a navegacao principal do basquete completo para seis itens e moveu Procedural/Lesoes/Editor para `Modo Desenvolvedor`.
- Direcao UI 7a0 Etapa 3 criou `weekly-hub` como Central da Semana, usando dados existentes e placeholders seguros sem alterar regras.
- O motor procedural comum conectou o banco real de 2000 decisoes ao calendario da carreira.
- `shared/procedural-decision-bank-data.js` e gerado por `tools/build-procedural-decision-bank-data.js` a partir de `Lores e decisões/Banco_2000_Decisoes_Ramificadas_Unificado.json`.
- `shared/procedural-decision-bank.js` escolhe decisoes por lore/tags, evita repeticao por `state.usedDecisionIds` e converte efeitos narrativos para moral, quimica, fadiga e desenvolvimento.
- `shared/calendar-engine.js` passou a buscar decisoes no banco em eventos `narrative`, mantendo os templates antigos apenas como fallback seguro.
- `shared/game-state.js` e `shared/procedural-career-save.js` preservam memoria de decisoes em saves procedurais.
- Confirmado que as lores ja entram na geracao de clubes em `shared/procedural-club-generator.js` via `ProceduralLoreDatasets.lores`.
- O plano do volei foi reclassificado como migracao procedural e visual: o proximo bloco deve levar a carreira procedural jogavel do basquete para uma versao procedural do volei, com regras esportivas proprias.
- Iniciada a migracao procedural do volei.
- Criado `temporada-volei/procedural.html` para rodar carreira procedural isolada do volei.
- Criado `temporada-volei/generation-config.js` com fundamentos, posicoes, arquetipos e plano de elenco de volei.
- Geradores compartilhados de roster, clube e liga agora possuem wrappers `generateProceduralVolleyballRoster`, `generateProceduralVolleyballClub` e `generateProceduralVolleyballLeague`.
- `shared/game-state.js` e `shared/game-shell-ui.js` passaram a aceitar `sportId: "volei"` e selecionar `VolleyballMatchAdapter` na partida ao vivo.
- Teste automatico local ficou pendente nesta rodada porque chamadas ao Node e ao PowerShell passaram a travar durante a validacao.
- Continuidade da migracao do volei:
  - calibragem especifica do basquete foi limitada a `sportId: "basquete"`;
  - calendario do volei registra radar de scouting sem chamar mercado de basquete;
  - aba Mercado fica oculta no procedural do volei ate a criacao do mercado proprio;
  - textos de forcas/fraquezas de clubes passaram a respeitar fundamentos de volei;
  - `temporada-volei/styles.css` recebeu primeira camada visual para `body[data-sport-id="volei"]`.
- Raio-x dos atletas adaptado por modalidade: no volei os cards exibem saque, ataque, bloqueio, passe/recepcao, levantamento e defesa; `3PT` fica restrito ao basquete.
- Central da Semana do volei iniciada:
  - `shared/game-shell-ui.js`, `shared/calendar-ui.js` e `shared/team-hub-ui.js` adaptam textos para saque, recepcao, linha de passe, levantamento, cobertura, rallies e sets;
  - focos semanais do volei usam labels especificos como `Treinar saque`, `Ajustar passe`, `Fechar set` e `Recuperar salto`;
  - `shared/calendar-engine.js` cria `Partida contra ...` no volei e simula resultado rapido por sets.
- Partida ao Vivo do volei iniciada:
  - `shared/live-match-ui.js` detecta volei por `sets`, `setScore` ou schema de fundamentos;
  - UI ao vivo mostra sets, set atual, rally e parciais;
  - lideres do volei usam pontuador, sacador, bloqueio, passe, defesa e eficiencia;
  - comandos ao vivo usam linguagem de saque, recepcao, rotacao e risco de ataque.
- Mercado proprio do volei iniciado:
  - `shared/procedural-market-generator.js` expoe `generateProceduralVolleyballMarket`;
  - `shared/game-shell-ui.js` escolhe mercado por modalidade e reabre a aba Mercado no volei durante a semana 1;
  - cards/comparacao do mercado de volei usam saque, ataque, bloqueio, passe/recepcao, levantamento e defesa;
  - `shared/calendar-engine.js` registra oportunidade concreta do mercado de volei no log.
- Estatisticas e lideres do volei iniciados:
  - `shared/game-state.js` cria e acumula `seasonStats` especifico para volei;
  - partidas rapidas distribuem estatisticas por fundamentos entre titulares provaveis;
  - partidas ao vivo salvas tentam acumular `playerStats` reais do adapter;
  - `shared/roster-ui.js` mostra lideres/tabela de pontuador, sacador, bloqueador, passe, defesa e eficiencia;
  - `shared/procedural-career-save.js` migra saves antigos do procedural de volei com campos novos.
- Auditoria do plano do volei confirmou pendencias nao bloqueantes:
  - navegacao curta do `temporada-volei/index.html` legado;
  - bastidores mais especificos por fundamento/personagem;
  - teste da partida ao vivo no navegador;
  - validacao do salvamento de estatisticas ao vivo;
  - refinamento de decisoes do banco grande para textos/contextos de volei.
- Contraste/polimento do procedural de volei iniciado em `temporada-volei/styles.css`, reforcando legibilidade de cards claros, mercado, tabelas, estatisticas e status pills.
- Pendencias atrasadas do volei tratadas em primeira versao:
  - `temporada-volei/index.html` legado carrega `shared/career-home-ui.js`;
  - `shared/career-home-ui.js` move Estatisticas, Lesoes e Editor para Modo Desenvolvedor;
  - bastidores do volei ganharam leituras para oposto, libero, centrais, ponteiros, recepcao instavel e linha de passe;
  - `shared/procedural-decision-bank.js` filtra decisoes com termos muito especificos de outros esportes quando a carreira e de volei;
  - smoke test sintetico confirmou acumulacao de estatisticas ao vivo no elenco.
- Smoke test no Chrome headless validou `temporada-volei/procedural.html`: fluxo inicial, abas principais, Mercado na semana 1, telas Elenco/Mercado/Partida com linguagem de volei e sem termos bloqueados de basquete nas telas testadas.
- Decisoes do procedural de volei foram refinadas em runtime: `shared/procedural-decision-bank.js` adapta termos como minutos/jogos/bola subir para rodagem/sets/saque inicial, adiciona contexto de fundamentos por tipo de decisao e prefere decisoes compativeis antes de fallback.
- O procedural do volei foi integrado ao `temporada-volei/index.html` em uma aba principal `Carreira`, com o shell completo carregado no jogo existente e `procedural.html` preservado como modo isolado.
- A entrada principal do volei foi virada para V2: `temporada-volei/index.html` abre direto no procedural (`Jogo V2`), enquanto o legado permanece acessivel em `Jogo V1` e suas telas internas ficam no `Modo Desenvolvedor`.
- Primeira camada de impacto proporcional das decisoes do volei implementada: decisoes do calendario alimentam `teamState.volleyballImpact`, a Central mostra `Impacto de quadra` e a simulacao rapida usa modificador leve com decaimento apos partida.
