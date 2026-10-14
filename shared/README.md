# Shared

Esta pasta e o inicio do jogo base modular.

- `base-game.js` cria o namespace `window.TemporadaTotal`.
- Cada modalidade carrega um `sport-manifest.js` antes do script principal.
- Os scripts atuais ainda sao adaptadores legados: continuam donos da simulacao, mas registram `state`, `actions` e o manifesto no runtime compartilhado.

Proximos passos naturais:

1. Mover funcoes repetidas para `shared/`.
2. Trocar constantes locais por campos do manifesto.
3. Criar adaptadores pequenos por modalidade contendo apenas regras especificas.
