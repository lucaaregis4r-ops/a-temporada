# Sistema de Ramificações para Decisões

Este documento separa as decisões em duas camadas:

1. **Decisões exclusivas de lore/campanha**: eventos específicos de uma campanha, como The Last Dance, Azarão, reconstrução, crise financeira etc.
2. **Decisões genéricas sistêmicas**: eventos que podem aparecer em qualquer campanha, conforme fase da temporada, variáveis, cooldown e contexto.

A ramificação transforma cada opção em algo com memória. Ou seja: a escolha do jogador não termina no clique. Ela pode gerar consequência atrasada, desbloquear eventos futuros, bloquear repetições e marcar padrões de comportamento do treinador.

## Estrutura recomendada

Cada opção passa a ter o campo `branching`:

```js
{
  optionId: "...",
  text: "...",
  effects: { ... },
  branching: {
    branchId: "...",
    branchType: "delayed_consequence",
    optionMemory: {
      chosenText: "...",
      riskProfile: "boa_aposta | equilibrada | alto_risco",
      mainAffectedVariables: ["fadiga", "rel_elenco"],
      minimumCooldownWeeks: 2
    },
    branchOutcomes: [
      {
        outcome: "positive",
        probabilityWeight: 55,
        delayWeeks: 1,
        effects: { ... },
        unlocksDecisionTags: ["..."],
        setsMemoryFlags: ["..."]
      },
      {
        outcome: "mixed",
        probabilityWeight: 25,
        delayWeeks: 2,
        effects: { ... }
      },
      {
        outcome: "negative",
        probabilityWeight: 20,
        delayWeeks: 2,
        effects: { ... }
      }
    ],
    nextDecisionRules: [ ... ]
  }
}
```

## Lógica de jogo sugerida

```js
function resolveDecisionChoice(gameState, decision, chosenOption) {
  applyImmediateEffects(gameState, chosenOption.effects);

  saveDecisionMemory(gameState, {
    decisionId: decision.decisionId,
    optionId: chosenOption.optionId,
    flags: chosenOption.branching.optionMemory,
    week: gameState.currentWeek
  });

  scheduleBranchOutcome(gameState, {
    sourceDecisionId: decision.decisionId,
    sourceOptionId: chosenOption.optionId,
    outcomes: chosenOption.branching.branchOutcomes,
    evaluationWeek: gameState.currentWeek + pickDelay(chosenOption.branching.branchOutcomes)
  });
}

function resolveScheduledBranch(gameState, scheduledBranch) {
  const outcome = weightedPick(scheduledBranch.outcomes, gameState);
  applyEffects(gameState, outcome.effects);
  addMemoryFlags(gameState, outcome.setsMemoryFlags);
  unlockDecisionTags(gameState, outcome.unlocksDecisionTags);
}
```

## Por que isso é importante

Sem ramificação, a decisão é apenas um modificador numérico. Com ramificação, ela vira história: uma escolha sobre poupar atletas pode gerar confiança da fisioterapia, irritação da torcida, lesão evitada, cobrança da diretoria ou crise se vier derrota.

## Regra importante

As ramificações não devem ser todas exibidas ao jogador. O jogador vê a situação e escolhe. O sistema guarda consequências prováveis em segundo plano.
