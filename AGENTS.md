# Guia do Desenvolvedor & Instruções para Agentes de IA (`AGENTS.md`)

> **Projeto:** *A Temporada — Sports Manager & Arcade Procedural*  
> **Arquitetura:** Vanilla JS Modular (Zero Build Step / Zero Dependências NPM Obrigatórias)  
> **Entrada do Jogo:** `Clique aqui para jogar.html`

---

## 1. Visão Geral e Filosofia do Projeto

*A Temporada* é um jogo de gerenciamento esportivo procedural com minigames arcade integrados que roda 100% no navegador (HTML5, Canvas 2D, Web Audio API, LocalStorage e File System Access API).

### Princípios Invioláveis para Agentes:
1. **Zero Build Step:** Todo código deve rodar diretamente no navegador sem necessidade de transpilador (`babel`), empacotador (`webpack`, `vite`, etc.) ou instalação obrigatória de pacotes via `npm`.
2. **Namespace Unificado:** Todas as engines e utilitários compartilham o objeto global `window.TemporadaTotal = window.TemporadaTotal || {}`.
3. **Integridade de Sintaxe:** Antes de finalizar qualquer alteração, valide todos os arquivos JS modificados com `node -c <arquivo.js>`.
4. **Backup Preservado:** Caso precise consultar o estado histórico original anterior à grande refatoração de navegação e decisões, há uma cópia completa e intocada em:  
   `/home/lucasregis/Área de trabalho/Projetos/Backup/A temporada - Backup Completo Antes da Refatoracao`.

---

## 2. Mapa de Diretórios Limpo

```text
.
├── Clique aqui para jogar.html         # Launcher oficial / Seletor de modalidades e retomar save
├── AGENTS.md                          # Este guia completo para agentes e desenvolvedores
├── README.md                          # Apresentação geral do jogo e como jogar
├── MAPA_DO_PROJETO.md                 # Mapeamento técnico de arquivos
├── CONTEXTO_DO_PROJETO.md             # Contexto de negócio, regras de negócio e lore
│
├── shared/                            # NÚCLEO COMPARTILHADO DA ENGINE
│   ├── decision-network-engine.js     # Redes de decisões ramificadas com memória e arcos narrativos
│   ├── minigames-engine.js            # Minigames em Canvas 60fps (arremesso, pênalti, saque) + áudio arcade
│   ├── game-shell-ui.js               # Shell de interface unificada, nav bar em pills e Central em 2 níveis
│   ├── calendar-engine.js             # Motor de avanço de calendário, eventos e simulação de partidas
│   ├── game-state.js                  # Estado central da carreira, cálculo de vitais e aplicação de bônus
│   ├── procedural-career-save.js      # Persistência via LocalStorage e pasta do disco
│   ├── live-simulation.js             # Motor de simulação lance-a-lance
│   ├── live-match-ui.js               # Interface de transmissão da partida ao vivo
│   ├── roster-ui.js                   # Visualização e gestão do elenco
│   ├── team-hub-ui.js                 # Painel tático e visualização da quadra
│   ├── calendar-ui.js                 # Calendário mensal e visualização de rodadas
│   ├── procedural-*-generator.js      # Geradores procedurais de clubes, ligas, jogadores e mercado
│   └── phaser-enhancements.js         # Camada visual opcional em Phaser para cenas gráficas
│
├── temporada-basquete/                # Modalidade: Basquete Masculino
│   ├── procedural.html                # Entrada da carreira procedural de basquete
│   ├── styles.css                     # FOLHA DE ESTILOS UNIVERSAL DO JOGO
│   ├── match-adapter.js               # Adaptador de partida de basquete
│   └── generation-config.js           # Pesos e calibragem de atributos do basquete
│
├── Temporada Futsal/                  # Modalidade: Futsal
│   ├── procedural.html                # Entrada da carreira procedural de futsal
│   ├── match-adapter.js               # Adaptador de partida de futsal
│   └── generation-config.js           # Pesos e calibragem de atributos do futsal
│
├── temporada-volei/                   # Modalidade: Vôlei Masculino
│   ├── procedural.html                # Entrada da carreira procedural de vôlei masculino
│   ├── index.html                     # Redirecionador automático para procedural.html
│   ├── match-adapter.js               # Adaptador de partida de vôlei
│   └── generation-config.js           # Pesos e calibragem de atributos do vôlei
│
├── temporada-volei-feminino/          # Modalidade: Vôlei Feminino
│   ├── index.html                     # Entrada da carreira procedural de vôlei feminino
│   └── generation-config.js           # Override de nomes e calibragem feminina
│
├── temporada-natacao/                 # Modalidade: Natação (Módulo experimental com meetings e provas)
├── temporada-total-saves/             # Pasta padrão de saves em disco (JSONs gerados pelo usuário)
├── Lores e decisões/                  # Banco bruto de 100 lores de clubes e 2000 eventos narrativos
├── tools/                             # Scripts Node.js para geração de datasets e calibragem
├── analises/                          # Relatórios e CSVs de balanceamento de ligas e sementes
└── Mudanças/                          # Documentação histórica de planos e decisões de design
```

---

## 3. As Engines Centrais em Detalhes

### 3.1. Rede de Decisões Ramificadas (`shared/decision-network-engine.js`)
Substitui escolhas isoladas por **arcos narrativos dinâmicos com desdobramentos**:
* **Estrutura dos Arcos:** Armazenados em `STORY_ARCS`. Cada arco tem múltiplos nós (`node_1`, `node_bench_reaction`, etc.).
* **Estrutura de um Nó:**
  ```javascript
  node_example: {
    id: "node_example",
    title: "Título do Dilema",
    situation: "Texto imersivo da situação no vestiário...",
    choices: [
      {
        id: "choice_a",
        label: "Opção A",
        description: "Explicação das consequências...",
        effects: { morale: 2, fatigue: -5, courtBoost: -1.5, chemistry: 2, budget: 1.0 },
        flag: "flag_escolha_a",          // Registrada em state.narrativeState.storyFlags
        nextNode: "node_proximo_capitulo",// Próximo nó engatilhado
        delayDays: 4,                    // Quantos dias depois o próximo nó acontece
        requiresMatchResult: true        // Se o próximo nó depende do resultado da partida seguinte
      }
    ]
  }
  ```
* **Impactos Mecânicos Diretos:**
  * `courtBoost`: Modifica diretamente a força da equipe nos jogos (`state.decisionMatchModifier`).
  * `budget`: Altera o saldo em caixa do clube (`state.summary.budgetLeft`).
  * `playerDev`: Evolui a habilidade dos jogadores mais jovens do elenco.
  * `morale`, `chemistry`, `fatigue`: Afetam o desempenho e clima do grupo.
* **Gancho de Partida:** Quando uma partida é jogada, `DecisionNetworkEngine.onMatchCompleted(state, matchResult)` é chamado automaticamente para avançar arcos que aguardavam o desfecho do jogo (ex.: clássico ou revolta pós-derrota).
* **Visualização:** A aba `📜 Crônicas & Decisões` renderiza a linha do tempo de todas as decisões tomadas pelo jogador e os arcos em andamento via `renderDecisionNetworkView(state)`.

### 3.2. Motor de Minigames Arcade (`shared/minigames-engine.js`)
Oferece jogabilidade interativa rápida com impacto direto no desempenho da equipe:
* **Renderização:** Canvas 2D em 60fps com animação senoidal do cursor e zona verde de *sweet spot*.
* **Áudio Nativo:** Sintetizador Web Audio API (`playArcadeSound('hit' | 'perfect' | 'miss')`) sem necessidade de carregar arquivos MP3/WAV externos.
* **Modalidades Suportadas:**
  * Basquete: Arremesso / Lance Livre (sweet spot centralizado).
  * Futsal: Cobrança de Pênalti / Finalização (sweet spot dinâmico).
  * Vôlei: Saque Viagem / Tempo de Bola (sweet spot oscilante).
* **Aplicação do Bônus:**
  * O jogador clica ou aperta a barra de espaço para parar o cursor na zona verde.
  * O resultado calcula nota (`PERFEITO`, `MUITO BOM`, `BOM`), ganho de moral, química e bônus de rating (até `+4.5`).
  * O bônus é salvo em `state.minigameBuff` e aplicado tanto na simulação rápida (`calendar-engine.js`) quanto na partida ao vivo (`match-adapter.js`). É consumido após o apito final via `consumeMatchPerformanceBoost(state)`.

### 3.3. Interface Unificada e Navegação (`shared/game-shell-ui.js`)
* **Draft de Contratos Arcade (Estilo 7 a 0: Roll → Build → Play):**
  * Tela de abertura da carreira com foco único e sem roadblocks técnicos.
  * 3 Propostas de Contrato em destaque com arquétipos claros:
    * 🏆 **O Favorito ao Título:** OVR alto, cobrança máxima por troféus, folha salarial pesada.
    * ⚔️ **O Desafiante:** Pelotão intermediário superior, equilíbrio financeiro, briga por vaga nos playoffs.
    * 🚀 **A Reconstrução:** Elenco jovem com alto teto de desenvolvimento, orçamento curto, desafio tático.
  * Botão de Ação Rápida `[🎲 Sortear Novas Propostas (Roll)]` para sortear novas franquias procedurais instantaneamente.
  * Botão direto `[⚡ ASSINAR CONTRATO]` que inicia a carreira imediatamente no Hub (`state.status = "playing"`), eliminando telas intermediárias de confirmação/introdução.
  * Gaveta retrátil `[📋 Ver Todos os Clubes da Liga]` para escolha manual de qualquer clube sem poluir a interface.
* **Barra de Navegação em Pills (`game-main-nav-bar`):**
  * `🏢 Central` (`hub`): O coração da carreira.
  * `📋 Elenco & Tática` (`roster`): Visual da quadra/campo, titulares, reservas e mercado.
  * `🎯 Treino` (`training`): O minigame arcade e foco tático da semana.
  * `🏆 Tabela & Rodadas` (`league`): Classificação limpa e calendário.
  * `📜 Crônicas & Decisões` (`story`): A árvore de decisões e arcos narrativos.
  * `💾 Saves` (`saves`): Gerenciador de saves.
* **Central Focada em 2 Níveis:**
  1. **Ação Prioritária (Topo):**
     * Se houver decisão pendente: Card dramático com opções e badges de impacto imediato.
     * Se for dia de jogo: Duelo em destaque com botões diretos: `[🎮 Ir para Partida ao Vivo]` ou `[⚡ Simular Partida Agora]`.
     * Se for dia livre: Rotina da semana, seletor de foco tático e botão `[⏩ Avançar Dia]`.
  2. **Grid Auxiliar:**
     * Termômetro do Clube: Barras visuais de apoio da torcida, cobrança da diretoria, caixa e vestiário.
     * Radar & Bastidores: Próximo confronto no calendário e as 3 últimas notícias.

### 3.4. Ciclo do Calendário (`shared/calendar-engine.js`)
* `advanceDay(state)`:
  1. Verifica se há novos arcos para disparar (`checkSeasonArcTriggers`).
  2. Processa eventos do dia (treinos, folgas, mercado, jogos).
  3. Checa se a rede de decisões tem um evento agendado pronto para o dia atual.
  4. Avança o dia do calendário.
* `processEvent(state, event)`: Processa partidas rápidas ou chama decisões.

---

## 4. Como Adicionar Novos Recursos

### Como Adicionar um Novo Arco Narrativo:
1. Abra `shared/decision-network-engine.js`.
2. Adicione uma nova chave ao objeto `STORY_ARCS`:
   ```javascript
   arc_meu_novo_arco: {
     id: "arc_meu_novo_arco",
     name: "Nome da Trama",
     category: "elenco", // ou "diretoria", "torcida", "mercado"
     description: "Breve resumo...",
     nodes: {
       node_1: { ... },
       node_2: { ... }
     }
   }
   ```
3. No método `checkSeasonArcTriggers(gameState)`, adicione a condição para dispará-lo (ex.: em uma semana específica, se o time tiver muitas derrotas, etc.).

### Como Adicionar um Novo Minigame:
1. Abra `shared/minigames-engine.js`.
2. Adicione as configurações de estilo no objeto `MINIGAME_CONFIGS` para a nova modalidade.
3. Se necessário, implemente o desenho específico no método `renderMinigame(instance)`.

---

## 5. Como Testar e Verificar Alterações

### Teste de Sintaxe dos Módulos Principais:
Execute no terminal:
```bash
node -c shared/game-state.js && \
node -c shared/minigames-engine.js && \
node -c shared/decision-network-engine.js && \
node -c shared/calendar-engine.js && \
node -c shared/game-shell-ui.js
```

### Teste de Integração Automatizado:
Execute o script de teste de ponta a ponta:
```bash
node scratch/test_pipeline.js
```
Saída esperada:
```text
All scripts loaded into VM successfully!
--- Testing Minigames Engine Buff ---
Match performance boost: 4.5
--- Testing Decision Network Engine ---
Active arcs: [ 'arc_derby_rivalry' ]
--- Testing Narrative Choice Resolution ---
History length: 1
--- Testing Match Completed Notification ---
>>> ALL TESTS PASSED SUCCESSFULLY! <<<
```

### Teste no Navegador:
Basta abrir `Clique aqui para jogar.html` no seu navegador web favorito (Chrome, Firefox, Edge, etc.) ou iniciar um servidor estático local:
```bash
npx serve .
# ou
python3 -m http.server 8000
```
