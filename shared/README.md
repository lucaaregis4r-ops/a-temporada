# Shared

Esta pasta reúne a base compartilhada do jogo.

- `base-game.js` cria o namespace `window.TemporadaTotal`.
- Cada modalidade carrega um `sport-manifest.js` antes do script principal.
- Os scripts de modalidade ainda controlam a simulação. Eles registram `state`, `actions` e o manifesto no runtime compartilhado.

## Próximas etapas

1. Mover funções repetidas para `shared/`.
2. Trocar constantes locais por campos do manifesto.
3. Manter em cada modalidade apenas as regras específicas.
