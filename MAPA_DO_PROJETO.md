# Mapa do Projeto

Entrada principal atual:

- `Clique aqui para jogar.html`: entrada das quatro carreiras principais: basquete, futsal, vôlei masculino e vôlei feminino.

Carreira procedural compartilhada:

- `shared/game-state.js`: estado jogavel da carreira procedural.
- `shared/game-shell-ui.js`: interface da carreira procedural unificada, nav bar em pills e Central focada em 2 níveis.
- `shared/decision-network-engine.js`: motor narrativo de redes de decisões com memória de escolhas, desdobramentos agendados e arcos narrativos.
- `shared/minigames-engine.js`: engine modular de minigames de precisão (arremesso, passe e saque) com buffs de partida e áudio arcade nativo.
- `shared/phaser-enhancements.js`: camada visual opcional com Phaser para cards, cenas da carreira e partida ao vivo.
- `shared/procedural-career-save.js`: saves procedurais separados por modalidade, com fallback local e opcao de pasta do PC.
- `shared/calendar-engine.js`: calendario, eventos, jogos e decisoes da carreira.
- `shared/procedural-*-generator.js`: geradores de clube, liga, elenco, atletas e mercado.
- `shared/procedural-decision-bank*.js`: banco grande de decisoes e seletor por contexto.
- `Lores e decisões/Banco_100_Lores_Liga.md` e o complemento narrativo: fontes das histórias dos clubes; `tools/build-procedural-lore-datasets.js` gera o dataset consumido pelas carreiras.

Modalidades procedurais:

- `temporada-basquete/procedural.html`: entrada procedural do basquete.
- `Temporada Futsal/procedural.html`: entrada procedural do futsal.
- `temporada-basquete/generation-config.js`: configuracao de geracao do basquete.
- `temporada-basquete/match-adapter.js`: simulacao ao vivo do basquete.
- `temporada-volei/procedural.html`: entrada principal do volei procedural (com index.html redirecionando).
- `temporada-volei/generation-config.js`: configuracao de geracao do volei.
- `temporada-volei/match-adapter.js`: simulacao ao vivo do volei.
- `temporada-volei-feminino/index.html`: entrada procedural do volei feminino.
- `temporada-volei-feminino/generation-config.js`: override feminino do gerador de atletas.

Conteudo e diagnostico:

- `Lores e decisões/`: fontes narrativas e banco bruto de decisoes.
- `temporada-total-saves/`: pasta de saves locais em formato JSON gerados pelos jogadores.
- `analises/`: CSVs e diagnosticos gerados.
- `tools/`: scripts de exportacao, calibragem e diagnostico.
- `Mudanças/`: planos, arquitetura e historico de implementacao.
- `AGENTS.md`: guia completo de desenvolvimento para agentes de IA e desenvolvedores.

Backup Histórico:
- Backup completo de segurança preservado em: `/home/lucasregis/Área de trabalho/Projetos/Backup/A temporada - Backup Completo Antes da Refatoracao`.
