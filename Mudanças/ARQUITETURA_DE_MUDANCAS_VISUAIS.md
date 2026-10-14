# Arquitetura de Mudancas Visuais

Documento vivo para guiar a evolucao visual e jogavel do `temporada-basquete/procedural.html`.

## Objetivo

Transformar o laboratorio procedural em uma primeira carreira jogavel, sem perder a seguranca do ambiente isolado.

O visual deve ajudar o usuario a entender:

- onde esta na temporada;
- o que acontece ao avancar o tempo;
- como o elenco muda;
- como o clube esta se comportando;
- o que acontece na liga;
- quais oportunidades aparecem no mercado;
- quais acontecimentos ficaram registrados no log.

## Regra de Seguranca

Enquanto esta frente estiver separada do jogo legado:

- usar apenas save procedural versionado;
- nao carregar `temporada-basquete/script.js`;
- nao alterar mercado fixo;
- nao alterar a temporada do jogo completo;
- nao misturar `localStorage` do procedural com o save legado;
- manter o laboratorio antigo disponivel;
- criar UI modular em `shared/`.

## V1 - Temporada Procedural Isolada

Status:
Implementada como primeira versao minima.

Arquivos criados:

- `shared/game-state.js`;
- `shared/calendar-engine.js`;
- `shared/game-shell-ui.js`;
- `shared/calendar-ui.js`;
- `shared/roster-ui.js`;
- `shared/player-card-ui.js`;
- `shared/team-hub-ui.js`.

Arquivos alterados:

- `temporada-basquete/procedural.html`;
- `temporada-basquete/styles.css`;
- `ARQUITETURA_DE_MUDANCAS.md`;
- `CONTEXTO_DO_PROJETO.md`.

O que a V1 entrega:

- gerar temporada por seed;
- apresentar o clube antes de entrar no calendario;
- exibir abas internas:
  - Calendario;
  - Elenco;
  - Equipe;
  - Liga;
  - Partida;
  - Mercado;
  - Log.
- avancar dia;
- avancar semana;
- jogar uma partida ao vivo quando houver jogo no dia;
- processar eventos:
  - treino;
  - descanso;
  - jogo;
  - narrativa;
  - mercado.
- renderizar cards de jogadores;
- mostrar central da equipe;
- mostrar tabela simples da liga;
- mostrar historico de acontecimentos.

Atualizacao V1.1:

- A primeira tela agora apresenta clube, lore, objetivo, forca, orcamento, pontos fortes, fraquezas e top da liga antes de comecar.
- A aba `Partida` foi adicionada.
- Eventos `match` no calendario mostram o botao `Jogar ao vivo`.
- A partida ao vivo reutiliza:
  - `shared/match-events.js`;
  - `shared/live-coaching.js`;
  - `shared/live-simulation.js`;
  - `shared/live-match-ui.js`;
  - `temporada-basquete/match-adapter.js`.
- Ao salvar o resultado ao vivo, a tabela e o log da temporada procedural sao atualizados.

Atualizacao V1.2:

- Calendario recebeu animacao de entrada nos eventos.
- Eventos agora possuem:
  - marcador visual por tipo;
  - sigla do tipo de evento;
  - efeito previsto antes de avancar;
  - pulso leve em eventos de jogo.
- Cards de jogadores receberam:
  - hover com elevacao;
  - brilho sutil;
  - barras animadas de forca, moral e fadiga;
  - destaque visual para atletas desgastados.
- Foi adicionado suporte a `prefers-reduced-motion` para reduzir animacoes quando o usuario preferir menos movimento.

Atualizacao V1.3:

- Eventos narrativos agora podem gerar uma decisao pendente.
- O calendario mostra painel de decisao com escolhas e efeitos previstos.
- O avanco de dia/semana pausa enquanto ha decisao pendente.
- Ao escolher uma resposta:
  - efeitos sao aplicados ao estado procedural;
  - moral, quimica, fadiga ou desenvolvimento podem mudar;
  - o evento narrativo e marcado como processado;
  - o log registra a escolha.
- A aba Mercado agora possui botao `Contratar sandbox`.
- Contratacao sandbox:
  - altera apenas o estado isolado da pagina;
  - usa saida sugerida quando o elenco esta cheio;
  - atualiza elenco, resumo financeiro e log;
  - ainda nao salva nada e nao toca mercado real.

Atualizacao V1.4:

- Mercado sandbox foi redesenhado em cards de oportunidade.
- Cada card mostra:
  - fit;
  - posicao;
  - CA;
  - potencial;
  - salario;
  - se cabe no orcamento;
  - veredito do sandbox;
  - delta de CA e folha;
  - saida sugerida.
- Contratacoes sandbox so ficam disponiveis na primeira semana.
- Apos a semana 1, o mercado permanece visivel para leitura, mas o botao fica bloqueado.
- Contraste reforcado na camada procedural para evitar texto claro em fundo claro.

Atualizacao V1.5:

- A aba Mercado deixou de aparecer na navegacao depois da semana 1.
- Se a janela fecha enquanto o usuario esta na aba Mercado, a interface volta para Calendario.
- A barra superior da carreira ganhou leitura rapida de:
  - semana;
  - dia;
  - campanha;
  - quimica;
  - fadiga.
- O Calendario virou uma central da semana com:
  - card principal do dia atual;
  - campanha do time;
  - proximo jogo;
  - estado do vestiario;
  - barra de progresso da temporada;
  - faixa visual com os 7 dias da semana.
- A faixa semanal destaca o dia atual e marca dias ja processados.
- A responsividade foi ajustada para os novos cards e para a faixa semanal em telas pequenas.

Atualizacao V1.6:

- A aba Elenco ganhou filtros e ordenacao sem alterar os dados reais.
- Agora e possivel filtrar por posicao.
- Agora e possivel ordenar por:
  - overall;
  - potencial;
  - fadiga;
  - moral;
  - idade.
- A tela mostra um painel rapido com:
  - titulares provaveis;
  - atletas desgastados;
  - atletas com moral baixa;
  - prospects.
- Os cinco melhores por overall recebem selo de `Titular provavel`.
- Atletas com grande diferenca entre potencial e overall recebem selo de `Prospecto`.
- Cards indicam alertas de fadiga e moral baixa.
- A responsividade do painel de elenco foi ajustada.

Atualizacao V1.7:

- A aba Equipe virou um painel de decisao mais forte.
- A tela agora mostra:
  - leitura da comissao;
  - campanha e forma recente;
  - risco financeiro;
  - foco sugerido;
  - barras de quimica, moral, fadiga e forca media.
- Foi criado o conceito de `foco semanal` na carreira procedural isolada.
- O usuario pode escolher:
  - equilibrar;
  - recuperar;
  - treinar forte;
  - fechar grupo;
  - buscar resultado.
- Cada foco aplica efeitos leves no estado isolado e registra a decisao no log.
- A escolha nao usa save real e nao altera o jogo completo.

## Proximos Passos Visuais

### V1.8 - Mercado como decisao do jogador

- transformar contratacao sandbox em fluxo com confirmacao;
- permitir comparar antes/depois em modal ou painel;
- filtrar atletas por posicao, custo e fit;
- manter sem persistencia ate a V2.

### V1.9 - Log narrativo melhor

- agrupar por semana;
- diferenciar resultado, mercado, treino e narrativa;
- destacar acontecimentos importantes.

## V2 - Carreira Procedural Separada

Status:
Iniciada.

Objetivo:
Permitir que o procedural deixe de ser apenas sandbox descartavel e vire um modo proprio, sem invadir o jogo completo legado.

Atualizacao V2.0:

- Criado `shared/procedural-career-save.js`.
- O save procedural usa chave propria de `localStorage`:
  - `temporada_procedural_careers_v1`.
- O schema de save procedural comecou em `SCHEMA_VERSION = 1`.
- A carreira procedural agora permite:
  - nomear carreira;
  - salvar;
  - carregar;
  - excluir.
- `temporada-basquete/procedural.html` deixou de se apresentar como laboratorio sem persistencia.
- A tela agora se apresenta como `Carreira Procedural`, com save proprio e separado.
- O mercado e as contratacoes deixam de aparecer como sandbox na interface principal da carreira.
- O laboratorio antigo de calibragem continua recolhivel na mesma pagina.

Limites mantidos:

- nao carrega `temporada-basquete/script.js`;
- nao usa o save legado;
- nao altera mercado fixo;
- nao altera temporada principal;
- nao integra ainda com tela principal do jogo completo.

### V2.1 - Entrada oficial do modo procedural

Status:
Implementada.

- A tela `Clique aqui para jogar.html` foi reorganizada como escolha de modo.
- A `Carreira Procedural` virou o destaque principal da tela inicial.
- O `Jogo completo` do basquete ficou separado como modo legado.
- O `Laboratorio procedural` virou caminho secundario de calibragem.
- O link do laboratorio aponta para `temporada-basquete/procedural.html#laboratorio`.
- O bloco de laboratorio em `procedural.html` recebeu `id="laboratorio"`.
- Ao abrir `#laboratorio`, o bloco recolhivel abre automaticamente.
- A tela inicial tambem separa as outras modalidades:
  - volei;
  - futsal;
  - natacao.

### V2.2 - Migrations e validacao de saves

Status:
Implementada.

- `shared/procedural-career-save.js` ganhou validacao de payload.
- Saves invalidos retornam erros estruturados em vez de quebrar a tela.
- O carregamento agora passa por normalizacao/migracao.
- A migracao garante campos novos como:
  - `careerMeta`;
  - `teamState.weeklyFocus`;
  - `rosterView`;
  - `processedEventIds`;
  - `log`;
  - `status`;
  - `activeTab`.
- O painel de save da carreira mostra mensagens amigaveis de sucesso/erro.
- Foi adicionado export de JSON.
- Foi adicionado import de JSON.
- Imports recebem novo `careerMeta.id`, evitando sobrescrever o save original.
- Campos temporarios de UI, como mensagem e rascunho de JSON, nao entram no save final.

### V2.3 - Tela de carreira salva

Status:
Implementada.

- A listagem de carreiras salvas agora aparece como cards.
- Cada card mostra:
  - nome da carreira;
  - clube;
  - data/hora do save;
  - campanha;
  - semana;
  - dia;
  - saldo;
  - versao do schema.
- O card da carreira atual recebe destaque visual.
- Saves com warnings de validacao recebem alerta visual.
- Cada card tem acoes diretas:
  - continuar;
  - exportar;
  - excluir.
- A exclusao agora usa confirmacao visual em dois passos:
  - primeiro clique marca o card;
  - segundo clique confirma;
  - cancelar remove a marcacao.
- O seletor antigo continua disponivel como fallback compacto.

### V2.4 - Tela inicial interna da carreira

- antes de gerar automaticamente uma nova carreira, mostrar:
  - continuar ultimo save;
  - carregar uma carreira;
  - nova carreira por seed;
  - abrir laboratorio.
- reduzir a sensacao de que uma seed nova aparece sem escolha.

## V3 - Imersao da Carreira Procedural

Status:
Iniciada.

Objetivo:
Transformar a carreira procedural em uma experiencia de gestao esportiva, reduzindo a aparencia de painel tecnico/debug.

Atualizacao V3.0:

- Criada a aba `Central do Clube` como primeira aba da carreira.
- A navegacao principal passa a priorizar:
  - Central do Clube;
  - Calendario;
  - Elenco;
  - Equipe;
  - Liga;
  - Partida;
  - Mercado, apenas na semana 1;
  - Diario.
- Informacoes tecnicas foram movidas para `Configuracoes avancadas`:
  - codigo da temporada;
  - gerar nova carreira;
  - nome da carreira;
  - salvar;
  - carregar;
  - excluir;
  - exportar JSON;
  - importar JSON;
  - backup JSON;
  - cards de saves.
- A Central do Clube mostra:
  - identidade do clube;
  - lore/campanha narrativa;
  - objetivo;
  - estilo;
  - pressao da diretoria;
  - situacao financeira;
  - confianca da torcida calculada;
  - leitura da comissao;
  - semana/dia;
  - proximo jogo;
  - campanha;
  - moral, quimica e fadiga;
  - principal alerta da semana.
- O foco semanal foi reapresentado como decisao narrativa com descricao de impacto antes do clique.
- Criado `Diario da Comissao` dentro da Central do Clube, reutilizando o log existente em linguagem de temporada.
- A aba Log foi renomeada visualmente para `Diario da Temporada`.
- A aba Mercado ganhou selecao de jogador e painel de comparacao com o elenco.
- A comparacao de mercado mostra:
  - jogador do mercado;
  - jogador comparavel do elenco;
  - diferenca de overall;
  - diferenca de potencial;
  - diferenca salarial;
  - impacto na folha;
  - leitura de risco;
  - impacto esperado em quimica e moral;
  - quem pode perder espaco ou sair.
- Os cards do mercado agora usam leituras de decisao como:
  - Reforco imediato;
  - Promessa cara;
  - Bom encaixe;
  - Nao cabe no orcamento;
  - Custo alto para pouco ganho;
  - Troca equilibrada;
  - Contratacao de rotacao.
- Os cards do elenco ganharam tags narrativas calculadas:
  - Titular provavel;
  - Sexto homem;
  - Rotacao;
  - Promessa;
  - Veterano;
  - Lider;
  - Em baixa;
  - Irritado com minutos;
  - Risco fisico;
  - Especialista defensivo;
  - Arremessador confiavel;
  - Projeto de desenvolvimento.
- A aba Liga ganhou `Panorama da Liga` e raio-x de adversario selecionado.
- O usuario pode clicar em um clube da tabela para destacar seu perfil.

Pontos ainda abertos:

- Criar tela inicial interna antes de gerar a primeira seed automaticamente.
- Refinar o texto narrativo do diario para eventos especificos, em vez de reaproveitar todos os textos do log literalmente.
- Adicionar confirmacao visual mais rica para contratacoes de mercado.

## Direcao UI 7a0

Etapa 1:

- Criada a casca visual `career-landing`.
- O jogo completo e a carreira procedural agora abrem com uma tela limpa antes de mostrar os sistemas antigos.
- `shared/career-home-ui.js` revela a interface existente ao clicar em `Comecar carreira` ou `Continuar save`.

Etapa 2:

- A navegacao principal do basquete completo foi reduzida em runtime para:
  - Central;
  - Elenco;
  - Mercado;
  - Calendario;
  - Partida;
  - Liga.
- Os botoes `Procedural`, `Lesoes` e `Editor` foram movidos para `Modo Desenvolvedor`.
- O `Modo Desenvolvedor` fica recolhido por padrao.
- Nenhum painel antigo foi removido.
- A reorganizacao acontece em `shared/career-home-ui.js` antes do `script.js` capturar os botoes de aba.

Etapa 3:

- Criado `shared/weekly-hub-ui.js`.
- Criada a secao `weekly-hub` no painel Central do basquete completo.
- A Central da Semana reaproveita dados existentes:
  - rodada/semana;
  - proxima partida;
  - posicao/campanha;
  - moral;
  - orcamento disponivel;
  - alerta principal;
  - decisao pendente.
- Antes de iniciar temporada, usa placeholders seguros.
- O botao principal leva para Mercado antes da temporada e para Calendario/Temporada depois.
- Botoes secundarios levam para Elenco, Mercado e Partida.
- Nenhuma regra de temporada, mercado, save ou simulacao foi alterada.

Etapa 4:

- A linguagem visivel da carreira procedural foi limpa para parecer jogo, nao laboratorio.
- A tela `procedural.html` deixou de falar em:
  - save antigo;
  - save versionado;
  - modo separado;
  - preview/calibragem na chamada principal.
- O bloco tecnico da carreira procedural agora aparece como `Modo Desenvolvedor`.
- O shell procedural tambem usa `Modo Desenvolvedor` para ferramentas internas.
- A aba Liga deixou de dizer que os clubes foram `gerados pela seed` e passou a dizer que eles disputam a temporada.
- O nome padrao da carreira nao exibe mais a seed diretamente.
- O menu do jogo completo continua mantendo Procedural/Lesoes/Editor recolhidos em Modo Desenvolvedor.

Preparacao da Etapa 5 - Dinheiro disponivel no mercado:

- O mercado do basquete completo ganhou leitura visual mais forte para `Dinheiro disponivel`.
- Os IDs existentes `market-budget-left` e `market-budget-used` foram mantidos para nao quebrar o `script.js`.
- A carreira procedural agora mostra, na aba Mercado:
  - dinheiro disponivel;
  - orcamento gerado pela lore;
  - folha atual;
  - leitura financeira simples.
- O dinheiro procedural vem do estado ja existente (`summary.budget`, `summary.totalSalary`, `summary.budgetLeft`) e respeita o orcamento criado pela lore do clube.
- Nenhuma regra de contratacao, save, geracao procedural ou simulacao foi alterada.

Preparacao da Etapa 5 - Raio-x de atributos:

- Os cards de atletas da carreira procedural agora revelam atributos detalhados no hover/foco.
- O raio-x mostra:
  - 3PT;
  - fisico;
  - tatica;
  - tecnica;
  - defesa.
- Os valores ja existiam no objeto do jogador; a mudanca apenas expõe esses dados de forma contextual.
- A interacao tambem funciona com teclado usando foco no card.

Etapa 5 - Mercado comparativo:

- Os cards do mercado procedural agora mostram leituras rapidas de:
  - perfil;
  - principal forca;
  - risco.
- Cada card passou a ter botao explicito `Comparar`.
- O clique no card ainda seleciona o atleta, mas o fluxo ficou mais claro para o usuario.
- O painel de comparacao existente continua mostrando atleta do mercado x jogador comparavel do elenco.
- O botao `Contratar` continua respeitando a janela da primeira semana.
- Nenhum algoritmo de mercado, save ou simulacao foi alterado.

Etapa 6 - Elenco vivo:

- Os cards de atletas da carreira procedural agora mostram:
  - funcao/papel no elenco;
  - status fisico;
  - forma recente;
  - moral e fadiga;
  - scout curto;
  - raio-x de atributos no hover/foco;
  - acoes rapidas.
- As acoes `Detalhes`, `Poupar`, `Funcao` e `Conversar` aparecem desativadas com tooltip de etapa futura.
- O resumo do elenco cita nomes de atletas desgastados ou com moral baixa quando houver alerta.
- Nenhum sistema psicologico, save, simulacao ou regra de elenco foi alterado.

Etapa 7 - Bastidores da temporada:

- Criado o componente visual `season-backstage-feed`.
- A Central do Clube agora mostra `Bastidores da Semana`.
- A aba Diario foi reapresentada como `Bastidores da Temporada`.
- O feed transforma logs existentes em leituras curtas de carreira:
  - treino;
  - descanso;
  - jogo;
  - mercado;
  - decisoes;
  - bastidores narrativos;
  - foco da comissao.
- Eventos de save ficam fora do feed narrativo para nao quebrar a imersao.
- Nenhum motor novo de narrativa, save, mercado ou simulacao foi criado.

Etapa 8 - Partida ao vivo mais dinamica:

- A partida ao vivo ganhou faixa de transmissao com:
  - ultimo lance destacado;
  - momento atual;
  - posse estimada;
  - status da partida em linguagem de jogo.
- Foram adicionadas acoes rapidas:
  - pedir tempo;
  - mudar defesa;
  - rodar banco;
  - acelerar;
  - pausar.
- As acoes rapidas reaproveitam `onPause`, `onSpeed` e `onCoachingChange`; o motor de simulacao nao foi reescrito.
- As estatisticas completas passaram a ficar recolhidas em `Estatisticas completas`, deixando placar e narracao como foco principal.
- O layout recebeu ajustes responsivos para a transmissao em telas menores.

Etapa 9 - Microinteracoes e movimento:

- Botoes principais receberam pulso visual sutil para reforcar acao principal.
- Eventos novos no calendario/feed recebem destaque curto.
- O painel de comparacao do mercado virou painel lateral no desktop e fluxo normal em telas menores.
- O painel lateral entra com fade/slide curto ao trocar comparacao.
- Cards e faixas existentes continuam com animacoes leves ja criadas em etapas anteriores.
- `prefers-reduced-motion` agora usa regra global com `animation`, `transition` e `scroll-behavior` desativados.
- Nenhuma regra de jogo, simulacao, mercado ou save foi alterada.

Etapa 10 - Revisao final de experiencia:

- Revisada a linguagem visivel da carreira para reduzir termos tecnicos no fluxo principal.
- `Carreira Procedural` passou a aparecer como `Carreira` na navegacao.
- A aba `Diario` virou `Bastidores`.
- Rotulos visiveis de `Lore` foram trocados por `Contexto`.
- Fallbacks como `clube procedural`, `clube gerado` e `mercado procedural indisponivel` foram trocados por linguagem de carreira.
- Termos tecnicos continuam existindo apenas em IDs/classes, scripts, Modo Desenvolvedor ou documentos.
- A experiencia agora responde melhor:
  - proxima acao: Central/Calendario;
  - estado do time: Central e Elenco;
  - mercado: comparacao e dinheiro disponivel;
  - partida: transmissao ao vivo;
  - historia: Bastidores.

Correcao visual pos-Etapa 10:

- Cards claros da carreira receberam regra especifica de contraste.
- `metric-card`, notas de elenco, badges, tabelas e caixas claras dentro de `procedural-game-root` agora forcam texto escuro.
- A correcao evita texto branco/claro sobre fundo branco ou cinza claro.

## Migracao visual para o volei

Plano criado em `PLANO_MIGRACAO_VISUAL_VOLEI.md` e ampliado para migracao procedural + visual.

Diretriz:

- levar a mesma experiencia visual e jogavel do basquete procedural para o volei;
- criar carreira procedural isolada do volei, nao apenas alterar o `index.html` legado;
- adaptar geracao de atletas, clube/liga, calendario, mercado, save, decisoes e partida ao vivo;
- adaptar leituras para sets, rally, saque, recepcao, ataque, bloqueio e defesa;
- nao copiar conceitos de basquete como reboteiro/assistente;
- corrigir antes a repeticao de decisoes no motor procedural comum.

Correcao comum antes da migracao:

- `shared/procedural-decision-bank-data.js` foi gerado a partir do banco real de 2000 decisoes.
- `shared/procedural-decision-bank.js` escolhe decisoes por lore/tags e converte efeitos do banco para o estado jogavel.
- `shared/calendar-engine.js` passou a usar o banco nos eventos `narrative`, com fallback fixo apenas se o banco nao estiver disponivel.
- `state.usedDecisionIds` e `state.decisionMemory` evitam repeticao dentro da carreira e entram no save procedural.
- Confirmado: o banco de lores ja e usado pela geracao de clubes via `shared/procedural-club-generator.js`.

Inicio da migracao procedural do volei:

- Criado `temporada-volei/procedural.html` como primeira entrada isolada de carreira procedural do volei.
- Criado `temporada-volei/generation-config.js` com fundamentos, posicoes e arquetipos de volei.
- Geradores compartilhados de elenco, clube e liga foram abertos para `sportId: "volei"` com wrappers especificos.
- `shared/game-state.js` e `shared/game-shell-ui.js` agora aceitam carreira procedural de volei e selecionam `VolleyballMatchAdapter` na partida ao vivo.
- A etapa ainda e base tecnica: proximas fases precisam polir UI propria do volei, mercado, textos, estatisticas e simulacao curta no navegador.
- Continuidade: a calibragem de clubes do basquete nao roda mais em clubes de volei, o mercado de basquete nao e chamado pelo calendario do volei, a aba Mercado fica oculta ate a adaptacao propria, e a leitura visual/textual de clubes passou a falar de ataque, saque, recepcao, bloqueio e linha de passe.
- Ajuste de elenco: o raio-x dos cards de atletas agora troca atributos por modalidade. No volei, mostra saque, ataque, bloqueio, passe/recepcao, levantamento e defesa, sem exibir `3PT`.
- Fase de Central da Semana do volei iniciada: Central, Calendario e Equipe agora trocam textos e focos para a linguagem do volei, incluindo saque, recepcao, linha de passe, cobertura, rallies e fechamento de set. A simulacao rapida do calendario no volei passou a usar sets.
- Fase de Partida ao Vivo do volei iniciada: `shared/live-match-ui.js` agora renderiza faixa de sets, set atual, rally e parciais no volei, troca lideres para fundamentos de volei e adapta comandos ao vivo para saque, recepcao, rotacao e risco de ataque.
- Fase de Mercado do volei iniciada: `generateProceduralVolleyballMarket` usa `VolleyballGenerationConfig`, a aba Mercado volta na semana 1 do procedural do volei, cards/comparacao usam fundamentos de volei e o calendario registra oportunidades reais do novo mercado.
- Fase de Estatisticas do volei iniciada: `shared/game-state.js` acumula estatisticas de volei em partidas rapidas/ao vivo salvas e `shared/roster-ui.js` renderiza lideres/tabela por pontuador, sacador, bloqueador, passe, defesa e eficiencia.
- Auditoria do plano do volei reconheceu pendencias nao bloqueantes: navegacao curta do `index.html` legado, bastidores mais especificos, teste de partida ao vivo no navegador, validacao de estatisticas ao vivo e refinamento de decisoes por contexto de volei.
- Fase de Contraste/Polimento iniciada: `temporada-volei/styles.css` recebeu regras para manter textos escuros em cards claros, mercado, comparacao, tabelas, estatisticas e status pills do procedural de volei.
- Smoke test no Chrome headless validou o `temporada-volei/procedural.html`: fluxo inicial da carreira, abas principais, Mercado na semana 1, Elenco/Mercado/Partida com linguagem de volei e sem termos bloqueados de basquete nas telas testadas.
- Pendencias atrasadas tratadas em primeira versao: navegacao curta do legado via `career-home-ui`, bastidores com personagens/fundamentos de volei, filtro de decisoes incompatíveis com volei e smoke test sintetico para salvamento de estatisticas ao vivo.
- Decisoes do procedural de volei ganharam leitura contextual em runtime: rodagem, sets controlados, saque inicial, linha de passe, levantador, cobertura, salto e sequencias de saque aparecem sem alterar o banco original de 2000 decisoes.
- `temporada-volei/index.html` agora integra a carreira procedural em uma aba principal `Carreira`, mantendo `procedural.html` como modo isolado e carregando o shell procedural completo dentro do jogo existente.
- A entrada principal do volei virou V2: `index.html` abre no `Jogo V2` procedural; o legado fica preservado em `Jogo V1`; telas antigas internas ficam recolhidas no `Modo Desenvolvedor`.
- Decisoes do V2 do volei agora deixam impacto visivel e esportivo: painel `Impacto de quadra`, indicadores de saque/passe/ataque/bloqueio/defesa/carga e modificador leve na partida rapida.
