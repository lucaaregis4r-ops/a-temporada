# Funcionamento do Sistema de Lores da Liga — Guia para Codex

## 1. Separação recomendada dos arquivos

Recomendo separar o projeto em pelo menos dois arquivos de design:

1. `Funcionamento_Sistema_Lores_Codex.md`
   - Explica como o sistema funciona.
   - Define entidades, variáveis, gatilhos, decisões, impactos e integração com a simulação.
   - Deve ser tratado pelo Codex como documento técnico de implementação.

2. `Banco_100_Lores_Liga.md`
   - Contém apenas as lores disponíveis para gerar equipes, temporadas e narrativas.
   - Deve ser tratado como banco de conteúdo narrativo.
   - Futuramente pode virar JSON, JS object, YAML ou banco de dados.

Essa separação evita misturar regra de sistema com conteúdo. O Codex entende melhor quando o arquivo de funcionamento diz “como calcular” e o arquivo de lores diz “quais histórias existem”.

---

## 2. Objetivo do sistema

O sistema de lores deve transformar a liga em uma simulação esportiva com camadas narrativas.

A temporada não deve ser apenas uma sequência de jogos. Cada equipe precisa ter:

- identidade histórica;
- expectativa da torcida;
- pressão da diretoria;
- relação com mídia;
- orçamento e limitações;
- conflitos internos possíveis;
- decisões recorrentes;
- objetivos coerentes com sua lore;
- efeitos no desempenho dentro de quadra.

A lore não substitui atributos técnicos. Ela modifica o contexto em que os atributos aparecem.

Exemplo: uma equipe forte tecnicamente pode render menos se estiver velha, desgastada, dividida internamente ou pressionada pela torcida. Uma equipe limitada pode render acima do esperado se tiver coesão alta, baixa pressão e objetivo realista.

---

## 3. Entidades principais

### 3.1 Liga

A liga deve conter:

- equipes participantes;
- calendário;
- classificação;
- rivalidades;
- jogos importantes;
- eventos globais;
- histórico da temporada;
- tabela de decisões narrativas.

As equipes controladas pela IA também devem ter lores ativas. Elas não precisam receber decisões com a mesma profundidade do usuário, mas devem ter modificadores, crises, objetivos e comportamento coerente.

### 3.2 Equipe

Cada equipe deve possuir:

```js
team = {
  id: 'team_01',
  name: 'Nome da Equipe',
  loreId: 'lore_last_dance',
  budgetLevel: 'baixo | medio | alto | elite',
  seasonObjective: 'campeao | playoffs | meio_tabela | nao_cair | desenvolver_base',
  rivals: [],
  roster: [],
  staff: [],
  teamState: {},
  activeEvents: [],
  seasonHistory: []
}
```

### 3.3 Atleta

Cada atleta deve conter dados técnicos e narrativos:

```js
player = {
  id: 'player_01',
  name: 'Nome do Atleta',
  age: 24,
  overall: 78,
  potential: 84,
  role: 'titular | reserva | promessa | idolo | lider',
  fatigue: 0,
  morale: 50,
  injuryRisk: 0,
  fanRelation: 50,
  coachRelation: 50,
  lockerRoomRelation: 50,
  traits: ['capitao', 'decisivo', 'brigao']
}
```

### 3.4 Comissão técnica

A comissão deve gerar sugestões e alertas:

- preparação física: poupar jogador, reduzir carga, controlar minutagem;
- fisioterapia: risco de lesão, retorno gradual, tratamento;
- auxiliar técnico: mudança estratégica, treino específico, rotação;
- psicologia: conversa com grupo, proteção de atleta, gestão de crise;
- assessoria de imprensa: resposta pública, coletiva, blindagem do elenco;
- diretoria: cobrança, meta financeira, pressão por resultado.

---

## 4. Variáveis narrativas principais

Todas as variáveis podem usar escala de `0 a 100`.

```js
teamState = {
  boardTrust: 50,              // confiança da diretoria
  fanSupport: 50,              // apoio da torcida
  lockerRoom: 50,              // clima interno do elenco
  staffTrust: 50,              // confiança da comissão técnica
  clubTraditionAlignment: 50,  // alinhamento com a história do clube
  mediaRelationship: 50,       // relação com imprensa
  groupCohesion: 50,           // coesão coletiva
  squadFatigue: 0,             // desgaste médio do elenco
  injuryRisk: 0,               // risco médio de lesão
  pressureLevel: 50,           // pressão geral
  morale: 50                   // moral coletiva
}
```

Interpretação:

- `0 a 30`: crise ou estado muito ruim;
- `31 a 45`: alerta;
- `46 a 60`: neutro/estável;
- `61 a 80`: positivo;
- `81 a 100`: excelente.

---

## 5. Relações entre variáveis

As variáveis devem influenciar umas às outras.

Exemplos:

```js
if (teamState.squadFatigue > 75) {
  teamState.injuryRisk += 10
  teamState.morale -= 4
  teamState.staffTrust -= 3
}

if (teamState.mediaRelationship < 30) {
  teamState.pressureLevel += 8
  teamState.fanSupport -= 5
}

if (teamState.groupCohesion > 75 && teamState.morale > 65) {
  teamState.performanceBonus += 3
}
```

Importante: nenhum modificador narrativo deve destruir a simulação sozinho. Eles devem atuar como bônus ou penalidades leves/moderadas, acumuláveis.

---

## 6. Decisões narrativas

As decisões podem aparecer em quatro momentos:

1. Antes do jogo.
2. Depois do jogo.
3. Durante semanas de treino.
4. Em momentos especiais da temporada.

Tipos de decisões:

- entrevista pós-jogo;
- poupar ou não atleta;
- expor ou proteger jogador;
- escutar ou ignorar comissão;
- priorizar base ou veteranos;
- aceitar venda de jogador importante;
- mudar estratégia;
- enfrentar crise de imprensa;
- lidar com rivalidade;
- gerir jogador insatisfeito;
- responder cobrança da diretoria.

Modelo sugerido:

```js
decision = {
  id: 'decision_rest_star',
  title: 'Poupar o principal jogador?',
  description: 'A fisioterapia alerta que o atleta está em risco após uma sequência pesada.',
  trigger: {
    squadFatigueMin: 70,
    importantPlayerInjuryRiskMin: 65
  },
  options: [
    {
      label: 'Poupar o jogador',
      effects: {
        fanSupport: -3,
        staffTrust: +8,
        injuryRisk: -12,
        playerMorale: -2
      }
    },
    {
      label: 'Usar o jogador normalmente',
      effects: {
        fanSupport: +3,
        staffTrust: -8,
        injuryRisk: +15,
        playerMorale: +2
      }
    }
  ]
}
```

---

## 7. Gatilhos de eventos

Eventos devem surgir de combinações entre:

- lore da equipe;
- momento da temporada;
- sequência de resultados;
- fadiga;
- moral;
- apoio da torcida;
- confiança da diretoria;
- relação com imprensa;
- características dos atletas.

Exemplo:

```js
if (
  team.loreId === 'lore_last_dance' &&
  teamState.squadFatigue > 70 &&
  teamState.fanSupport > 60
) {
  generateEvent('veterans_need_rest_but_fans_expect_show')
}
```

---

## 8. Integração com desempenho em quadra

A lore deve afetar desempenho por meio de modificadores pequenos.

Sugestão:

```js
performanceModifier = 0

if (teamState.morale > 70) performanceModifier += 2
if (teamState.groupCohesion > 75) performanceModifier += 2
if (teamState.pressureLevel > 80) performanceModifier -= 2
if (teamState.squadFatigue > 75) performanceModifier -= 3
if (teamState.lockerRoom < 35) performanceModifier -= 3
```

Esses valores podem afetar:

- tomada de decisão;
- eficiência ofensiva;
- eficiência defensiva;
- erros;
- bolas decisivas;
- consistência;
- chance de lesão;
- desempenho em clássicos;
- desempenho fora de casa.

---

## 9. Como usar o arquivo de 100 lores

Cada lore deve ser convertida em objeto.

Modelo:

```js
lore = {
  id: 'lore_last_dance',
  name: 'The Last Dance',
  category: 'veteranos',
  summary: 'Geração histórica faz sua última temporada junta.',
  objective: 'ser_campeao',
  budget: 'medio',
  fanPressure: 'alta',
  boardPressure: 'alta',
  mediaExposure: 'alta',
  strengths: ['experiencia', 'lideranca', 'identificacao'],
  weaknesses: ['idade', 'fadiga', 'risco_lesao'],
  frequentEvents: ['poupar_veterano', 'cobranca_titulo', 'entrevista_sobre_fim_de_ciclo'],
  modifiers: {
    initialFanSupport: +20,
    initialPressure: +20,
    initialFatigue: +10,
    budgetFlexibility: -10
  }
}
```

---

## 10. Prompt para Codex

Use este prompt quando for implementar:

> Leia os arquivos `Funcionamento_Sistema_Lores_Codex.md` e `Banco_100_Lores_Liga.md`. Primeiro, não altere mercado, save, simulação principal ou UI principal. Crie uma camada isolada de preview de lores. A implementação deve transformar cada lore em um objeto de dados, permitir selecionar uma lore para uma equipe e gerar um `teamState` inicial coerente com essa lore. Depois, crie uma função de preview que mostre: objetivo da temporada, pressão inicial, orçamento, riscos narrativos, eventos prováveis, forças, fraquezas e modificadores iniciais. Só depois dessa etapa, prepare a integração futura com decisões narrativas e desempenho em quadra.
