# 🏆 A Temporada — Sports Manager & Arcade Procedural

Um jogo de gerenciamento esportivo procedural dinâmico e arcade construído diretamente em tecnologias web nativas (HTML5, Canvas 2D, Web Audio API, JavaScript Vanilla).

Escolha seu esporte, comande um clube gerado com identidade e história únicas, enfrente dilemas profundos de vestiário que ramificam a temporada e teste sua precisão em minigames de quadra para garantir vantagens decisivas nos jogos.

---

## ⚡ Como Jogar Imediatamente

Basta abrir o arquivo principal em qualquer navegador moderno:

👉 **[`Clique aqui para jogar.html`](Clique%20aqui%20para%20jogar.html)**

*(Não requer nenhuma instalação, servidor Node.js ou dependências externas).*

Se preferir rodar em um servidor web local:
```bash
npx serve .
# ou
python3 -m http.server 8000
```

---

## 🏀 Modalidades Disponíveis

| Esporte | Entrada Direta | Características |
| :--- | :--- | :--- |
| **🏀 Basquete Masculino** | `temporada-basquete/procedural.html` | Rotações, arremesso clutch e ritmo frenético |
| **⚽ Futsal** | `Temporada Futsal/procedural.html` | Pressão na quadra, faltas acumuladas e pênaltis |
| **🏐 Vôlei Masculino** | `temporada-volei/procedural.html` | Saque potente, bloqueio e tempo de virada de bola |
| **🏐 Vôlei Feminino** | `temporada-volei-feminino/index.html` | Rallies táticos, cobertura defensiva e transição rápida |
| **🏊 Natação** | `temporada-natacao/index.html` | Módulo experimental com meetings e provas individuais |

---

## 🎮 Principais Mecânicas

### 1. 📜 Redes de Decisões Ramificadas (`decision-network-engine.js`)
As decisões no vestiário e na imprensa não são eventos soltos e esquecidos:
* **Arcos com Memória:** Suas escolhas ativam desdobramentos futuros que acontecem dias depois.
* **Ganchos de Partida:** Resultados de vitórias ou derrotas em clássicos alteram o rumo da história do clube.
* **Impacto Mecânico:** Afetam o rendimento em quadra (`courtBoost`), moral, química, orçamento e evolução de jovens promessas.
* **Aba Crônicas & Decisões:** Acompanhe a linha do tempo e todos os arcos ativos da carreira.

### 2. 🎯 Minigames Arcade Interativos (`minigames-engine.js`)
Treine fundamentos antes dos jogos decisivos:
* **Sweet Spot em Canvas 60fps:** Teste seu timing de arremesso, finalização ou saque viagem.
* **Áudio Arcade Nativo:** Efeitos sonoros gerados dinamicamente via sintetizador Web Audio API.
* **Bônus Direto de Desempenho:** Acertos geram bônus de até `+4.5` de rating para o time na próxima partida (tanto na simulação rápida quanto na partida ao vivo).

### 3. 🏢 Central do Clube em 2 Níveis
Interface limpa, moderna e focada na ação:
* **Topo:** Foco imediato no que importa hoje (decisão urgente, duelo de partida ou avanço de rotina).
* **Base:** Termômetros visuais do clube (torcida, diretoria, caixa e vestiário) e radar de bastidores.

---

## 🛠️ Para Agentes de IA e Desenvolvedores

Todas as diretrizes arquiteturais, diagramas dos módulos, instruções de testes e convenções para adicionar novos arcos ou esportes estão detalhadas no guia oficial:

👉 **Consulte o [`AGENTS.md`](AGENTS.md)**

---

## 🛡️ Backup Histórico
Uma cópia de segurança completa do repositório antes da refatoração encontra-se preservada em:  
`/home/lucasregis/Área de trabalho/Projetos/Backup/A temporada - Backup Completo Antes da Refatoracao`.
