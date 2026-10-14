# Relatório de Calibragem Completa — 100 Seeds
## Leitura geral
- Seeds analisadas: **100**.
- Lores diferentes na amostra: **68**.
- Overall médio: **76.39**, variando de **72.6** a **80.2**.
- Idade média geral: **25.96**, variando de **21.8** a **30.4**.
- Pressão salarial média: **94.4%**, variando de **44.9%** a **166.0%**.
- Seeds sinalizadas para revisão: **77**.

## Diagnóstico principal
O gerador já melhorou em relação à calibragem anterior porque a planilha agora tem mais colunas úteis: titulares, rotação, prospectos, folha, orçamento restante, warnings e scout notes. Mas ainda existe um problema estrutural: algumas lores estão recebendo estilos de elenco que contradizem a narrativa.

O ponto mais importante é separar: **lore não é tier de força**. A lore define o tipo de história; o tier define o nível competitivo; o roster_style define como essa força aparece no elenco.

## Sobre a célula/linha selecionada
### Interpretação como linha visual 15
- Clube: **Capital Porto Alegre Basquete**
- Lore: **Lenda no Banco**
- Strength tier: **normal**
- Roster style: **balanced**
- Ambição/objetivo: **playoffs / chegar aos playoffs**
- Overall/current/potential: **77.1 / 75.2 / 81.2**
- Idade média: **27.3**
- Folha: **102.2%**
- Leitura: coerente em força, mas a idade/estilo precisam reforçar a narrativa.

### Interpretação como iloc real 15
- Clube: **Metropolitano Vitoria Lobos**
- Lore: **Base de Ouro**
- Strength tier: **low**
- Roster style: **veteran_win_now**
- Ambição/objetivo: **desenvolvimento / desenvolver jovens**
- Overall/current/potential: **78.0 / 75.2 / 82.8**
- Idade média: **26.0**
- Folha: **157.4%**
- Leitura: coerente em força, mas a idade/estilo precisam reforçar a narrativa.

## Resumo por strength_tier
| Tier | N | Overall médio | Min | Max | Orçamento médio | Folha média |
|---|---:|---:|---:|---:|---:|---:|
| good | 27 | 76.11 | 72.6 | 79.7 | 103.3 | 64.9% |
| low | 20 | 76.17 | 74.1 | 78.1 | 42.55 | 147.3% |
| normal | 53 | 76.62 | 72.7 | 80.2 | 75.74 | 89.44% |

## Resumo por roster_style
| Estilo | N | Overall | Idade | Folha | Gap | Titulares | Rotação |
|---|---:|---:|---:|---:|---:|---:|---:|
| balanced | 34 | 76.17 | 26.18 | 76.23% | 7.81 | 81.27 | 70.58 |
| defense_first | 6 | 76.43 | 25.42 | 81.08% | 8.15 | 81.93 | 70.93 |
| expensive_unbalanced | 1 | 72.6 | 23.0 | 55.1% | 8.3 | 80.4 | 65.6 |
| low_budget_fight | 4 | 76.22 | 25.77 | 150.62% | 8.53 | 81.05 | 69.85 |
| prospect_core | 3 | 77.73 | 27.2 | 86.7% | 7.13 | 81.87 | 73.47 |
| unbalanced | 6 | 75.37 | 24.87 | 92.5% | 8.55 | 80.4 | 68.67 |
| veteran_win_now | 46 | 76.7 | 26.01 | 106.25% | 8.05 | 81.28 | 71.29 |

## 15 seeds mais urgentes para revisar
1. **CALIBRAGEM-BASQUETE-LORES-REAIS-071 — Capital Salvador Tropa / Base de Ouro: overall 76.1, idade 26.5, folha 156.2%. Problema: tier low com overall acima de 74 | veteran_win_now jovem demais | campanha de desenvolvimento velha demais | lore Base de Ouro pede roster_style prospect_core, mas veio veteran_win_now | lore Base de Ouro deveria ter núcleo jovem | gerador emitiu warning**
2. **CALIBRAGEM-BASQUETE-LORES-REAIS-016 — Metropolitano Vitoria Lobos / Base de Ouro: overall 78.0, idade 26.0, folha 157.4%. Problema: tier low com overall acima de 74 | veteran_win_now jovem demais | lore Base de Ouro pede roster_style prospect_core, mas veio veteran_win_now | lore Base de Ouro deveria ter núcleo jovem | gerador emitiu warning**
3. **CALIBRAGEM-BASQUETE-LORES-REAIS-019 — Central Rio de Janeiro Tropa / Pacto da Sobrevivência: overall 77.2, idade 27.2, folha 160.7%. Problema: tier low com overall acima de 74 | low_budget_fight com folha estourada | low_budget_fight forte demais | campanha de sobrevivência forte demais | gerador emitiu warning**
4. **CALIBRAGEM-BASQUETE-LORES-REAIS-003 — Metropolitano Campinas Dragons / O Laboratório: overall 75.6, idade 25.2, folha 154.3%. Problema: tier low com overall acima de 74 | veteran_win_now jovem demais | lore O Laboratório pede roster_style experimental, mas veio veteran_win_now | gerador emitiu warning**
5. **CALIBRAGEM-BASQUETE-LORES-REAIS-018 — Olimpico Recife Vikings / Elenco Remendado: overall 78.3, idade 25.9, folha 95.1%. Problema: tier normal fora do intervalo 72-78 | veteran_win_now jovem demais | lore Elenco Remendado pede roster_style medical_risk, mas veio veteran_win_now | lore Elenco Remendado deveria ter núcleo veterano**
6. **CALIBRAGEM-BASQUETE-LORES-REAIS-047 — Atletico Manaus Furia / O Laboratório: overall 75.8, idade 23.2, folha 137.0%. Problema: tier low com overall acima de 74 | veteran_win_now jovem demais | lore O Laboratório pede roster_style experimental, mas veio veteran_win_now | gerador emitiu warning**
7. **CALIBRAGEM-BASQUETE-LORES-REAIS-089 — Vanguarda Curitiba Clube / Dinastia da Base: overall 78.1, idade 27.3, folha 87.3%. Problema: tier normal fora do intervalo 72-78 | veteran_win_now jovem demais | lore Dinastia da Base pede roster_style prospect_core, mas veio veteran_win_now | lore Dinastia da Base deveria ter núcleo jovem**
8. **CALIBRAGEM-BASQUETE-LORES-REAIS-099 — Uniao Belo Horizonte Clube / O Laboratório: overall 75.9, idade 25.1, folha 144.4%. Problema: tier low com overall acima de 74 | veteran_win_now jovem demais | lore O Laboratório pede roster_style experimental, mas veio veteran_win_now | gerador emitiu warning**
9. **CALIBRAGEM-BASQUETE-LORES-REAIS-022 — Vanguarda Vitoria Lobos / Projeto Universitário: overall 75.2, idade 23.9, folha 142.5%. Problema: tier low com overall acima de 74 | low_budget_fight com folha estourada | low_budget_fight forte demais | gerador emitiu warning**
10. **CALIBRAGEM-BASQUETE-LORES-REAIS-031 — Imperial Curitiba Lobos / Clube das Cicatrizes: overall 74.4, idade 26.6, folha 135.5%. Problema: tier low com overall acima de 74 | low_budget_fight com folha estourada | low_budget_fight forte demais | gerador emitiu warning**
11. **CALIBRAGEM-BASQUETE-LORES-REAIS-039 — Estrela Porto Alegre Warriors / Elenco Remendado: overall 76.4, idade 24.6, folha 97.8%. Problema: veteran_win_now jovem demais | lore Elenco Remendado pede roster_style medical_risk, mas veio veteran_win_now | lore Elenco Remendado deveria ter núcleo veterano**
12. **CALIBRAGEM-BASQUETE-LORES-REAIS-041 — Estrela Recife Basquete / Clube das Cicatrizes: overall 78.1, idade 25.4, folha 163.8%. Problema: tier low com overall acima de 74 | low_budget_fight com folha estourada | low_budget_fight forte demais | gerador emitiu warning**
13. **CALIBRAGEM-BASQUETE-LORES-REAIS-051 — Real Porto Alegre Dragons / Reino dos Veteranos: overall 78.2, idade 26.7, folha 127.8%. Problema: tier normal fora do intervalo 72-78 | lore Reino dos Veteranos pede roster_style veteran_win_now, mas veio balanced | lore Reino dos Veteranos deveria ter núcleo veterano | gerador emitiu warning**
14. **CALIBRAGEM-BASQUETE-LORES-REAIS-015 — Capital Porto Alegre Basquete / Lenda no Banco: overall 77.1, idade 27.3, folha 102.2%. Problema: lore Lenda no Banco pede roster_style veteran_win_now, mas veio balanced | lore Lenda no Banco deveria ter núcleo veterano | gerador emitiu warning**
15. **CALIBRAGEM-BASQUETE-LORES-REAIS-037 — Real Belo Horizonte Tropa / Meninos contra Homens: overall 76.8, idade 23.9, folha 132.1%. Problema: tier low com overall acima de 74 | veteran_win_now jovem demais | veteran_win_now sem titulares fortes | gerador emitiu warning**

## Alvos recomendados
- `low`: overall 68–74.
- `normal`: overall 72–78.
- `good`: overall 76–82.
- `veteran_win_now`: idade média 28.5–32.5, titulares fortes, gap menor.
- `prospect_core`: idade média 21.5–25.5, potencial alto, gap alto.
- `low_budget_fight`: overall menor, folha controlada, orçamento curto.
- `unbalanced`: diferença clara entre titulares e rotação.

## Recomendação para o Codex
Não refazer o gerador do zero. Criar uma camada pós-geração chamada `calibrateClubSeed`, que recebe o clube gerado, lê a lore e aplica ajustes controlados com RNG determinístico.
