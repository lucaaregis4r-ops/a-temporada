# DIREÇÃO DE UI — A TEMPORADA INSPIRADA NO 7A0

> **Objetivo deste documento:** guiar o Codex em mudanças pequenas, sequenciais e testáveis.
>
> **Regra principal:** não tentar “refazer o jogo” de uma vez. Cada etapa deve terminar com o jogo abrindo normalmente no navegador.

---

## 0. Como o Codex deve usar este documento

Antes de alterar qualquer arquivo:

1. Ler este documento inteiro.
2. Implementar **somente uma etapa por vez**.
3. Depois de cada etapa, responder:
   - arquivos alterados;
   - funções/componentes criados;
   - o que foi mantido sem alteração;
   - como testar no navegador;
   - riscos ou pendências.
4. Não apagar sistemas existentes.
5. Não mexer em simulação, geração procedural, save ou mercado antes da etapa correspondente.
6. Preferir esconder/reorganizar elementos antes de remover lógica.
7. Evitar mudanças gigantes em `script.js` quando for possível criar arquivos menores e isolados.

---

## 1. Referência visual: 7a0

Site de referência: <https://7a0.com.br/>

O 7a0 funciona porque a tela comunica uma ação simples:

> **Roll → Build → Simulate**

A interface não mostra todos os sistemas ao mesmo tempo. Ela apresenta:

- um título forte;
- uma frase curta;
- uma ação principal;
- uma estrutura em etapas;
- poucos dados permanentes;
- campo/quadra como elemento visual central;
- cards compactos;
- botões com peso visual claro;
- sensação de fluxo, não de dashboard.

### Prints/referências para consulta

> Salvar estes prints manualmente na pasta `docs/referencias-7a0/`, se quiser manter imagens locais no projeto.
>
> Como não é bom depender de imagem externa dentro do jogo, use estes prints apenas como inspiração visual.

#### Print 1 — Home / promessa do jogo

Referência: <https://7a0.com.br/>

O que observar:

- título grande;
- texto curto;
- botão principal evidente;
- promessa de jogo em uma frase;
- lista de jogadores como elemento visual, não como tabela pesada;
- fluxo em três passos logo abaixo.

Aplicação em “A Temporada”:

- trocar explicações longas por promessa curta;
- colocar uma ação principal;
- mostrar somente o resumo da carreira.

---

#### Print 2 — Fluxo em três passos

No 7a0:

1. Roll — sorteia seleção e Copa.
2. Build — escolhe o jogador.
3. Simulate — simula o resultado.

Adaptação para “A Temporada”:

1. Gerar cenário.
2. Montar elenco.
3. Jogar semana.

Este fluxo deve aparecer na tela inicial da carreira.

---

#### Print 3 — Tela de montagem

Referência visual: listas compactas, botões claros e campo como elemento central.

Aplicação:

- o mercado não deve parecer uma planilha;
- elenco e mercado devem parecer escolhas de carreira;
- comparar atleta atual x atleta disponível deve ser fácil.

---

#### Print 4 — Simulação / campo

Aplicação:

- na tela de partida, usar placar fixo;
- mostrar evento atual com destaque;
- manter estatísticas completas recolhidas;
- priorizar narração curta e decisões rápidas.

---

## 2. Diagnóstico do estado atual

Arquivos principais já existentes:

- `index.html`: jogo completo, com várias abas.
- `procedural.html`: carreira procedural separada.
- `styles.css`: estilo principal.
- `script.js`: lógica principal do jogo completo.
- vários arquivos em `../shared/`, incluindo geração procedural, mercado, calendário, elenco, partida ao vivo e save.

Problema atual:

A interface mostra muitos sistemas ao mesmo tempo:

- Base;
- Comissão;
- Mercado;
- Temporada;
- Partida;
- Procedural;
- Lesões;
- Editor;
- Tabela.

Isso é útil para desenvolvimento, mas deixa a experiência parecida com painel interno. A nova direção deve transformar isso em jogo.

---

## 3. Nova estrutura de experiência

A experiência principal deve ser organizada assim:

```text
Tela Inicial
   ↓
Gerar Cenário
   ↓
Montar Elenco
   ↓
Definir Estilo
   ↓
Central da Semana
   ↓
Partida / Mercado / Elenco / Liga
```

A navegação principal deve ter poucos itens:

```text
Central | Elenco | Mercado | Calendário | Partida | Liga
```

Tudo que for técnico deve ir para:

```text
Modo Desenvolvedor
```

Itens do Modo Desenvolvedor:

- Procedural preview;
- seed;
- calibragem;
- laboratório;
- editor;
- logs técnicos;
- configurações avançadas.

---

# ETAPA 1 — Criar casca visual nova sem alterar lógica

## Objetivo

Criar uma nova camada visual de entrada, inspirada no 7a0, sem mexer no funcionamento do jogo.

## Arquivos sugeridos

Criar:

- `shared/career-home-ui.js` ou arquivo equivalente.
- Se preferir manter por modalidade: `temporada-basquete/career-home-ui.js`.

Alterar:

- `index.html`;
- `procedural.html`, se necessário;
- `styles.css`.

## O que implementar

Criar uma seção inicial chamada `career-landing`.

Ela deve conter:

```html
<section class="career-landing">
  <div class="career-hero">
    <p class="eyebrow">A Temporada</p>
    <h1>Monte o elenco. Sobreviva à liga.</h1>
    <p class="hero-text">
      Você recebeu um clube, um orçamento curto e uma temporada inteira para provar que o projeto merece continuar.
    </p>

    <div class="hero-actions">
      <button class="primary-button">Começar carreira</button>
      <button class="secondary-button">Continuar save</button>
    </div>
  </div>

  <div class="career-loop">
    <article>
      <strong>01</strong>
      <span>Gerar cenário</span>
    </article>
    <article>
      <strong>02</strong>
      <span>Montar elenco</span>
    </article>
    <article>
      <strong>03</strong>
      <span>Jogar semana</span>
    </article>
  </div>
</section>
```

## Regras

- Não apagar o conteúdo atual.
- Apenas esconder o jogo principal até o usuário clicar em “Começar carreira” ou “Continuar save”.
- Se ainda não existir função segura para continuar save, o botão pode apenas mostrar a tela principal atual.
- O botão “Começar carreira” deve levar o usuário para a Central ou para o fluxo procedural atual, sem quebrar o save.

## Critério de conclusão

A etapa está pronta quando:

- o jogo abre com uma tela inicial mais limpa;
- o botão principal leva para o jogo;
- os sistemas antigos ainda existem;
- nenhuma aba antiga foi removida ainda.

---

# ETAPA 2 — Reduzir navegação principal

## Objetivo

Trocar a navegação cheia por uma navegação curta e jogável.

## Navegação nova

```text
Central | Elenco | Mercado | Calendário | Partida | Liga
```

## Mapeamento dos menus antigos

| Menu antigo | Novo destino |
|---|---|
| Base | Central |
| Comissão | Central ou Elenco |
| Mercado | Mercado |
| Temporada | Calendário / Central |
| Partida | Partida |
| Procedural | Modo Desenvolvedor |
| Lesões | Elenco ou Central |
| Editor | Modo Desenvolvedor |
| Tabela | Liga |

## Regras

- Não excluir painéis antigos.
- Apenas alterar a forma como aparecem.
- Criar um menu secundário chamado `Modo Desenvolvedor`.
- O Modo Desenvolvedor deve ficar recolhido por padrão.

## Critério de conclusão

A etapa está pronta quando:

- a navegação principal tem no máximo 6 itens;
- debug/editor/procedural ficam escondidos em Modo Desenvolvedor;
- o usuário comum não vê seed, laboratório ou calibragem na primeira experiência.

---

# ETAPA 3 — Criar Central da Semana

## Objetivo

Criar uma tela principal que responda:

> O que importa agora?

## Estrutura da Central

Criar uma seção ou componente chamado:

```text
weekly-hub
```

Ela deve mostrar:

- semana atual ou rodada atual;
- próxima partida;
- posição na tabela;
- moral do elenco;
- orçamento disponível;
- alerta principal;
- decisão pendente;
- botão de ação principal.

## Exemplo visual

```text
SEMANA 7

Próximo jogo
Olympico x Minas Norte

Situação
5º lugar · 4V · 2D

Alerta
Seu pivô titular está desgastado.

Decisão
Poupar no treino ou manter intensidade?

[Ação principal: Preparar semana]
[Ver elenco] [Ver mercado] [Simular partida]
```

## Placeholders seguros

Se algum dado ainda não existir, usar placeholders:

- “Rodada não iniciada”
- “Sem alerta no momento”
- “Tabela disponível após iniciar temporada”
- “Moral ainda não calculada”

## Regras

- Não criar lógica complexa nova nesta etapa.
- Reaproveitar dados já existentes.
- A Central pode começar como uma composição visual de dados já disponíveis.

## Critério de conclusão

A etapa está pronta quando:

- existe uma tela “Central”;
- ela tem um botão principal claro;
- ela mostra resumo da temporada sem parecer tabela;
- ela funciona antes e depois de iniciar a temporada.

---

# ETAPA 4 — Limpeza de informações técnicas

## Objetivo

Tirar da experiência principal qualquer informação que quebre a imersão.

## Esconder ou mover

Mover para Modo Desenvolvedor:

- seed;
- preview procedural;
- laboratório antigo;
- calibragem;
- logs de geração;
- mensagens técnicas;
- editor de configuração;
- qualquer texto como “preview isolado”, “sem alterar save”, “debug”, “seguro”.

## Importante

Essas informações podem continuar existindo, mas não devem aparecer no fluxo principal.

## Critério de conclusão

A etapa está pronta quando:

- a tela principal parece jogo, não ambiente de teste;
- o usuário só vê informações técnicas se abrir Modo Desenvolvedor.

---

# ETAPA 5 — Mercado comparativo

## Objetivo

Transformar o mercado em decisão prática.

## Problema atual

O mercado tem atletas e atributos, mas o jogador precisa pensar demais para entender o impacto da contratação.

## Novo comportamento

Cada card do mercado deve ter:

- nome;
- posição;
- custo;
- perfil;
- força principal;
- risco;
- botão “Comparar”;
- botão “Contratar”.

## Comparação

Ao clicar em “Comparar”, abrir painel lateral ou modal:

```text
Atleta atual x Atleta do mercado

Custo
Técnica
Físico
Defesa
Tática
Potencial
Moral
Risco físico
Encaixe no estilo
```

No fim, mostrar uma frase:

```text
Essa troca melhora sua defesa e presença física, mas reduz arremesso de 3.
```

## Regras

- Não alterar o algoritmo do mercado nesta etapa.
- Apenas mudar visualização e comparação.
- Se não existir atleta da mesma posição no elenco, mostrar:
  “Nenhum jogador equivalente no elenco atual.”

## Critério de conclusão

A etapa está pronta quando:

- o jogador entende rapidamente por que contratar alguém;
- existe comparação lado a lado;
- o mercado deixa de parecer uma lista bruta.

---

# ETAPA 6 — Elenco vivo

## Objetivo

Fazer o elenco parecer um grupo de pessoas/personagens, não uma tabela.

## Novo card de jogador

Cada jogador deve mostrar:

```text
Nome
Posição · Função
Status físico
Moral
Forma recente
Scout curto
Ações rápidas
```

Ações rápidas possíveis:

- Ver detalhes;
- Poupar;
- Alterar função;
- Conversar.

## Regras

- Se ações ainda não existirem, criar botões desativados com tooltip:
  “Disponível em etapa futura.”
- Não criar sistema psicológico complexo agora.
- Priorizar apresentação.

## Critério de conclusão

A etapa está pronta quando:

- elenco tem leitura rápida;
- cada atleta parece ter papel no time;
- lesões/desgaste aparecem junto do elenco, não isolados em aba perdida.

---

# ETAPA 7 — Bastidores da temporada

## Objetivo

Criar narrativa acumulada da carreira.

## Novo componente

```text
season-backstage-feed
```

Deve registrar:

- decisões tomadas;
- consequências;
- lesões;
- resultados importantes;
- mudanças de moral;
- pressão da diretoria;
- evolução de atletas.

## Exemplo

```text
Após a derrota para o Minas Norte, a diretoria começou a questionar o projeto.
O elenco ainda confia no trabalho, mas a próxima rodada virou um jogo de pressão.
```

## Regras

- Começar com eventos simples.
- Não gerar textos enormes.
- Cada evento deve ter no máximo 2 frases.
- Preferir narrativa curta e forte.

## Critério de conclusão

A etapa está pronta quando:

- decisões importantes aparecem registradas;
- a temporada começa a parecer uma história.

---

# ETAPA 8 — Partida ao vivo mais dinâmica

## Objetivo

Transformar a partida em transmissão simples, não relatório.

## Deve conter

- placar fixo;
- quarto/período;
- tempo;
- posse atual;
- último evento destacado;
- botões de ritmo;
- ações rápidas.

## Ações rápidas

- Pedir tempo;
- Mudar defesa;
- Rodar banco;
- Acelerar;
- Pausar.

## Regras

- Não reescrever o motor de simulação.
- Alterar primeiro a apresentação.
- Eventos novos devem aparecer com destaque visual.

## Critério de conclusão

A etapa está pronta quando:

- partida parece viva;
- usuário entende o placar e o momento;
- estatísticas completas ficam secundárias.

---

# ETAPA 9 — Microinterações e movimento

## Objetivo

Dar sensação de fluidez sem exagerar.

## Adicionar

- fade/slide ao trocar cards;
- destaque no botão principal;
- animação curta para novo evento;
- cards expansíveis;
- painel lateral para comparação;
- transição de semana.

## Regras

- Nada de animações longas.
- Nada que atrapalhe celular.
- Respeitar `prefers-reduced-motion`.

CSS obrigatório:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

## Critério de conclusão

A etapa está pronta quando:

- a interface parece mais viva;
- continua leve;
- não quebra mobile.

---

# ETAPA 10 — Revisão final de experiência

## Checklist final

O jogo deve responder bem a estas perguntas:

- Eu sei qual é minha próxima ação?
- Eu entendo o estado do meu time?
- Eu consigo acessar elenco, mercado e calendário sem me perder?
- As informações técnicas estão escondidas?
- A partida parece um evento?
- O mercado ajuda a decidir?
- A temporada parece uma história?
- A interface parece jogo, não dashboard?

---

## Ordem obrigatória de implementação

1. Tela inicial.
2. Navegação reduzida.
3. Central da Semana.
4. Modo Desenvolvedor.
5. Mercado comparativo.
6. Elenco vivo.
7. Bastidores.
8. Partida ao vivo.
9. Microinterações.
10. Revisão final.

Não pular etapas.

---

## Prompt curto para usar com o Codex

Leia o arquivo `DIRECAO_UI_7A0_A_TEMPORADA.md`.

Implemente somente a próxima etapa ainda não concluída.

Regras:

- não refatore o jogo inteiro;
- não apague sistemas existentes;
- não altere simulação, saves ou geração procedural se a etapa não pedir;
- mantenha o jogo abrindo no navegador;
- ao final, liste arquivos alterados, funções criadas e como testar;
- se encontrar dependência confusa, pare e explique antes de mudar.

Comece pela ETAPA 1.
