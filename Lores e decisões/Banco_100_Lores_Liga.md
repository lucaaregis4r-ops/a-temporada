# Banco de 100 Lores para Liga Esportiva

Este arquivo contém 100 lores de equipes/temporadas para serem usadas como banco narrativo. Ele deve ficar separado do arquivo de funcionamento do sistema.

Cada lore pode ser transformada futuramente em objeto JS/JSON. O objetivo é dar ao Codex conteúdo suficiente para gerar equipes com identidade, objetivos, pressões, eventos e modificadores iniciais.

---

## 001 — The Last Dance

**ID:** `lore_001_last_dance`  
**Categoria:** veteranos  
**Resumo:** Uma geração histórica faz sua última temporada junta. A torcida quer mais um título, mas o tempo cobra preço físico e técnico.  
**Objetivo principal:** ser campeão  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** experiência, liderança, identificação com a torcida.  
**Fraquezas narrativas:** idade, fadiga, risco de lesão, pressão emocional.  
**Eventos frequentes:** poupar veterano, última chance de título, entrevista sobre fim de ciclo.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10; mediaExposure: +20`.

## 002 — Azarão Financeiro

**ID:** `lore_002_azarao_financeiro`  
**Categoria:** sobrevivência  
**Resumo:** A crise financeira obriga o clube a montar elenco barato com base e apostas. Cair seria uma tragédia institucional.  
**Objetivo principal:** não cair  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** base motivada, baixa expectativa técnica, unidade pela sobrevivência.  
**Fraquezas narrativas:** elenco curto, pouca profundidade, risco de vender talentos.  
**Eventos frequentes:** proposta por promessa, pressão após derrotas, chance de herói improvável.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15; initialFatigue: +10`.

## 003 — Gigante Adormecido

**ID:** `lore_003_gigante_adormecido`  
**Categoria:** reconstrução  
**Resumo:** Clube tradicional tenta voltar ao topo depois de anos medianos. A torcida lembra do passado e tem pouca paciência.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** tradição, torcida grande, estrutura.  
**Fraquezas narrativas:** ansiedade coletiva, comparação com o passado, crise rápida.  
**Eventos frequentes:** cobrança por clássico, ídolo opinando na mídia, pressão por contratação.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15`.

## 004 — Base de Ouro

**ID:** `lore_004_base_de_ouro`  
**Categoria:** formação  
**Resumo:** Uma geração muito talentosa da base chega ao profissional ao mesmo tempo. O clube precisa decidir entre desenvolver e competir.  
**Objetivo principal:** desenvolver base  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** potencial, energia, identidade futura.  
**Fraquezas narrativas:** inexperiência, oscilação, assédio de clubes ricos.  
**Eventos frequentes:** dar minutos à promessa, erro decisivo de jovem, venda milionária.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15`.

## 005 — Dinheiro Novo

**ID:** `lore_005_dinheiro_novo`  
**Categoria:** projeto rico  
**Resumo:** Novo investidor injeta dinheiro e exige resultado rápido. O elenco é caro, mas ainda sem identidade coletiva.  
**Objetivo principal:** ser campeão  
**Orçamento:** elite  
**Pressão da torcida:** alta  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** orçamento, contratações fortes, ambição.  
**Fraquezas narrativas:** ego no elenco, pressa, rejeição de rivais.  
**Eventos frequentes:** estrela insatisfeita, cobrança pública, contratação de impacto.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +25; mediaExposure: +20`.

## 006 — Fábrica de Promessas

**ID:** `lore_006_fabrica_de_promessas`  
**Categoria:** formação  
**Resumo:** O clube é conhecido por revelar talentos e vender caro. Ganhar importa, mas formar jogadores é parte da identidade.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** scout, base forte, potencial de evolução.  
**Fraquezas narrativas:** perde atletas cedo, falta de veteranos, torcida dividida.  
**Eventos frequentes:** proposta internacional, promessa pedindo espaço, veterano questiona juventude.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 007 — Tropa Operária

**ID:** `lore_007_tropa_operaria`  
**Categoria:** coletivo  
**Resumo:** Equipe sem estrelas, construída em defesa, disciplina e sacrifício. Ninguém quer enfrentá-los em jogo duro.  
**Objetivo principal:** playoffs  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** coesão, defesa, resiliência.  
**Fraquezas narrativas:** pouca criatividade, ataque previsível, dependência física.  
**Eventos frequentes:** treino pesado, jogo truncado, elogio ao sistema coletivo.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialFatigue: +10; initialCohesion: +12`.

## 008 — Clube dos Artistas

**ID:** `lore_008_clube_dos_artistas`  
**Categoria:** talento instável  
**Resumo:** Elenco cheio de jogadores talentosos, criativos e difíceis de controlar. Quando encaixa, encanta. Quando não, implode.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** talento individual, improviso, marketing.  
**Fraquezas narrativas:** indisciplina, ego, oscilação.  
**Eventos frequentes:** craque reclama, treinador cobra ordem, show contra rival.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 009 — Rebaixado Ferido

**ID:** `lore_009_rebaixado_ferido`  
**Categoria:** retorno  
**Resumo:** O clube acabou de voltar de uma queda traumática. A temporada é sobre dignidade, estabilidade e cicatrizar a relação com a torcida.  
**Objetivo principal:** não cair  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** sede de resposta, torcida mobilizada, humildade.  
**Fraquezas narrativas:** medo de nova queda, ambiente sensível, memória traumática.  
**Eventos frequentes:** fantasma do rebaixamento, vitória simbólica, torcida protesta.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 010 — Campeão em Crise

**ID:** `lore_010_campeao_em_crise`  
**Categoria:** queda pós-título  
**Resumo:** O atual campeão manteve nome e camisa, mas perdeu intensidade. Todos querem derrubá-lo e a cobrança é cruel.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** experiência vencedora, respeito dos rivais, elenco acostumado a decisão.  
**Fraquezas narrativas:** acomodação, caça dos adversários, comparação com ano anterior.  
**Eventos frequentes:** pergunta sobre ressaca, veterano criticado, jogo com clima de final.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15; mediaExposure: +20`.

## 011 — Time do Bairro

**ID:** `lore_011_time_do_bairro`  
**Categoria:** identidade local  
**Resumo:** Clube profundamente ligado à comunidade local. Cada jogo parece representar a cidade inteira.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** pertencimento, mandante forte, torcida próxima.  
**Fraquezas narrativas:** orçamento curto, pressão emocional, dificuldade fora de casa.  
**Eventos frequentes:** evento comunitário, jogo em casa lotado, crítica por esquecer raízes.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15`.

## 012 — Império em Declínio

**ID:** `lore_012_império_em_declínio`  
**Categoria:** decadência  
**Resumo:** Um clube que dominou a liga por anos agora tenta aceitar que o ciclo acabou.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** tradição, estrutura, memória vencedora.  
**Fraquezas narrativas:** elenco envelhecido, negação interna, torcida impaciente.  
**Eventos frequentes:** comparação com antigas lendas, derrota simbólica, pedido de renovação.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15`.

## 013 — Revolução Tática

**ID:** `lore_013_revolução_tática`  
**Categoria:** inovação  
**Resumo:** Comissão moderna propõe um estilo novo, analítico e agressivo. Parte do elenco compra a ideia, parte resiste.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** inovação, preparo estratégico, surpresa.  
**Fraquezas narrativas:** adaptação lenta, resistência de veteranos, risco de parecer teimosia.  
**Eventos frequentes:** mudança de sistema, jogador questiona método, vitória valida ideia.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 014 — Clube Vitrine

**ID:** `lore_014_clube_vitrine`  
**Categoria:** mercado  
**Resumo:** O clube aceita ser ponte para atletas crescerem e saírem. O desafio é competir sem apego.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** atrai talentos, boa gestão financeira, elenco jovem.  
**Fraquezas narrativas:** perde peças rápido, baixa identificação, planejamento instável.  
**Eventos frequentes:** olheiro estrangeiro, venda no meio da temporada, torcida cobra ambição.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: +0`.

## 015 — Torcida Infernal

**ID:** `lore_015_torcida_infernal`  
**Categoria:** pressão popular  
**Resumo:** A torcida transforma o ginásio em caldeirão, mas também vira contra o time rápido.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** mando forte, energia emocional, intimidação.  
**Fraquezas narrativas:** impaciência, crise amplificada, jovens sentem pressão.  
**Eventos frequentes:** vaias após derrota, mosaico histórico, jogador pede apoio.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +0`.

## 016 — Elenco Sem Casa

**ID:** `lore_016_elenco_sem_casa`  
**Categoria:** nomadismo  
**Resumo:** Problemas no ginásio obrigam o clube a jogar longe de sua torcida. A temporada vira teste de resistência mental.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** união pela dificuldade, baixa pressão local, resiliência.  
**Fraquezas narrativas:** viagens longas, fadiga, perda de mando.  
**Eventos frequentes:** jogo em cidade neutra, reclamação logística, torcida organiza caravana.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialFatigue: +10; initialCohesion: +12`.

## 017 — Lenda no Banco

**ID:** `lore_017_lenda_no_banco`  
**Categoria:** ídolo treinador  
**Resumo:** Um dos maiores ídolos do clube assume como treinador. O carinho inicial é enorme, mas a cobrança pode destruir o mito.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** identificação, liderança simbólica, apoio inicial.  
**Fraquezas narrativas:** inexperiência, proteção excessiva, crítica vira drama.  
**Eventos frequentes:** ídolo questionado, clássico emocional, coletiva defendendo legado.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +0; mediaExposure: +20`.

## 018 — Comissão Dividida

**ID:** `lore_018_comissao_dividida`  
**Categoria:** conflito interno  
**Resumo:** Preparador, auxiliar e diretoria discordam sobre carga, estratégia e prioridades. O técnico precisa mediar antes que vaze.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** alta  
**Exposição na mídia:** média

**Forças narrativas:** especialistas fortes, debate interno, profissionalismo.  
**Fraquezas narrativas:** ruído, decisões lentas, vazamento.  
**Eventos frequentes:** fisioterapia alerta, auxiliar discorda, diretoria cobra alinhamento.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 019 — Clube Academia

**ID:** `lore_019_clube_academia`  
**Categoria:** ciência esportiva  
**Resumo:** Projeto baseado em dados, controle de carga e desenvolvimento físico. A pergunta é se o jogo aceita tanta racionalidade.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** controle de carga, prevenção, evolução física.  
**Fraquezas narrativas:** torcida acha frio, atletas impacientes, poupar em jogo importante.  
**Eventos frequentes:** relatório de fadiga, estrela poupada, vitória da metodologia.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +15`.

## 020 — Seleção de Estrangeiros

**ID:** `lore_020_selecao_de_estrangeiros`  
**Categoria:** elenco global  
**Resumo:** Muitos atletas de fora chegam com estilos, línguas e culturas diferentes. O talento é grande, a coesão ainda não.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** média  
**Pressão da diretoria:** alta  
**Exposição na mídia:** média

**Forças narrativas:** talento diverso, experiência internacional, imprevisibilidade.  
**Fraquezas narrativas:** barreira cultural, adaptação, pouca identidade local.  
**Eventos frequentes:** conflito cultural, torcida abraça estrangeiro, problema de comunicação.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +15; initialFatigue: +10`.

## 021 — Orgulho da Base Local

**ID:** `lore_021_orgulho_da_base_local`  
**Categoria:** territorial  
**Resumo:** A torcida quer ver atletas da cidade em quadra. Contratar demais pode ser visto como trair a identidade.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** identidade local, apoio aos jovens, pertencimento.  
**Fraquezas narrativas:** limite técnico, pressão em pratas da casa, mercado restrito.  
**Eventos frequentes:** base pede passagem, contratação rejeitada, jovem decide clássico.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15`.

## 022 — Projeto Militar

**ID:** `lore_022_projeto_militar`  
**Categoria:** disciplina  
**Resumo:** Elenco montado em hierarquia, regras rígidas e intensidade. Funciona até alguém sentir que perdeu liberdade.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** disciplina, defesa, regularidade.  
**Fraquezas narrativas:** rigidez, conflito com criativos, desgaste.  
**Eventos frequentes:** regra quebrada, treino fechado, capitão cobra grupo.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 023 — Rivalidade Sangrenta

**ID:** `lore_023_rivalidade_sangrenta`  
**Categoria:** clássicos  
**Resumo:** A temporada inteira parece girar em torno dos jogos contra o rival. Ganhar o clássico pode salvar tudo; perder pode incendiar tudo.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** motivação em clássicos, torcida mobilizada, narrativa forte.  
**Fraquezas narrativas:** obsessão, perde foco contra pequenos, pressão extrema.  
**Eventos frequentes:** semana de clássico, provocação do rival, derrota vira crise.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +0; mediaExposure: +20`.

## 024 — Equipe Silenciosa

**ID:** `lore_024_equipe_silenciosa`  
**Categoria:** baixa exposição  
**Resumo:** Clube discreto, sem grandes estrelas e sem barulho. A força está em trabalhar longe dos holofotes.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** tranquilidade, coesão, baixa pressão.  
**Fraquezas narrativas:** pouca receita, falta de estrela, invisibilidade.  
**Eventos frequentes:** imprensa ignora, sequência surpreendente, jogador pede reconhecimento.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: -15; initialFatigue: +10; initialCohesion: +12`.

## 025 — Estrelas e Reservas

**ID:** `lore_025_estrelas_e_reservas`  
**Categoria:** desigualdade  
**Resumo:** O elenco tem alguns jogadores muito caros e reservas bem abaixo. A diferença salarial ameaça o vestiário.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** estrelas decisivas, marketing, alto teto.  
**Fraquezas narrativas:** ciúme salarial, banco fraco, dependência.  
**Eventos frequentes:** reserva reclama, estrela pede privilégio, lesão expõe elenco curto.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 026 — O Time da Virada

**ID:** `lore_026_o_time_da_virada`  
**Categoria:** mentalidade  
**Resumo:** Equipe conhecida por buscar jogos impossíveis. O problema é que costuma começar mal demais.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** resiliência, moral em decisão, torcida acredita.  
**Fraquezas narrativas:** início lento, desgaste emocional, risco de depender do caos.  
**Eventos frequentes:** virada épica, cobrança por concentração, preleção emocional.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 027 — Defesa de Ferro

**ID:** `lore_027_defesa_de_ferro`  
**Categoria:** defensivo  
**Resumo:** A identidade do clube é defender cada posse como se fosse final. O ataque, porém, vive no limite.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** defesa, regularidade, jogos duros.  
**Fraquezas narrativas:** ataque pobre, baixa atratividade, depende de placar baixo.  
**Eventos frequentes:** torcida pede ousadia, vitória feia, especialista elogia defesa.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0; initialFatigue: +10`.

## 028 — Ataque Espetáculo

**ID:** `lore_028_ataque_espetáculo`  
**Categoria:** ofensivo  
**Resumo:** O clube quer jogar bonito, acelerar e pontuar muito. A torcida ama, a defesa sofre.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** ataque, entretenimento, ritmo.  
**Fraquezas narrativas:** defesa frágil, fadiga, oscilações.  
**Eventos frequentes:** placar absurdo, crítica à defesa, astro vira destaque.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10`.

## 029 — Temporada de Luto

**ID:** `lore_029_temporada_de_luto`  
**Categoria:** emocional  
**Resumo:** O clube vive uma perda simbólica recente. A temporada mistura homenagem, dor e tentativa de reconstrução.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** alta

**Forças narrativas:** união emocional, propósito, torcida solidária.  
**Fraquezas narrativas:** peso psicológico, mídia sensível, quedas emocionais.  
**Eventos frequentes:** homenagem antes do jogo, jogador chora, vitória dedicada.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialCohesion: +12`.

## 030 — Diretoria Impaciente

**ID:** `lore_030_diretoria_impaciente`  
**Categoria:** gestão instável  
**Resumo:** A diretoria troca de rumo rápido e quer resultado imediato. O técnico vive sob avaliação constante.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** média  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** alta

**Forças narrativas:** recursos, cobrança profissional, ambição.  
**Fraquezas narrativas:** instabilidade, medo de errar, pressão em sequência ruim.  
**Eventos frequentes:** reunião emergencial, boato de demissão, vitória dá sobrevida.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +15; initialFatigue: +10`.

## 031 — Presidente Populista

**ID:** `lore_031_presidente_populista`  
**Categoria:** política interna  
**Resumo:** O presidente fala demais, promete demais e interfere demais. A torcida gosta do show até os resultados falharem.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** mobilização, marketing, ambição pública.  
**Fraquezas narrativas:** interferência, promessas irreais, crise midiática.  
**Eventos frequentes:** presidente dá entrevista, contratação política, técnico precisa responder.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; mediaExposure: +20`.

## 032 — Elenco de Aluguel

**ID:** `lore_032_elenco_de_aluguel`  
**Categoria:** curto prazo  
**Resumo:** Muitos jogadores chegaram por empréstimo ou contrato curto. Todos querem aparecer, poucos pensam no clube.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** fome individual, flexibilidade, talento disponível.  
**Fraquezas narrativas:** baixa identificação, egoísmo, renovação difícil.  
**Eventos frequentes:** jogador pensa no próximo contrato, torcida cobra entrega, empresário pressiona.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: +0`.

## 033 — Reino dos Veteranos

**ID:** `lore_033_reino_dos_veteranos`  
**Categoria:** hierarquia  
**Resumo:** Veteranos mandam no vestiário. A experiência ajuda, mas jovens e comissão podem se sentir engolidos.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** liderança, casca, controle emocional.  
**Fraquezas narrativas:** panelinha, resistência a mudança, jovens sem espaço.  
**Eventos frequentes:** veterano barra mudança, promessa insatisfeita, capitão salva crise.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 034 — Juventude Insolente

**ID:** `lore_034_juventude_insolente`  
**Categoria:** jovem ousado  
**Resumo:** Elenco jovem, provocador e sem medo. Pode surpreender gigantes ou se perder em imaturidade.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** alta

**Forças narrativas:** energia, ousadia, evolução.  
**Fraquezas narrativas:** indisciplina, oscilação, erros bobos.  
**Eventos frequentes:** provocação em clássico, bronca coletiva, jovem decide jogo.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15`.

## 035 — Clube Empresa

**ID:** `lore_035_clube_empresa`  
**Categoria:** eficiência  
**Resumo:** Gestão profissional, metas claras e cobrança racional. O desafio é criar alma em um projeto frio.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** média  
**Pressão da diretoria:** alta  
**Exposição na mídia:** baixa

**Forças narrativas:** organização, orçamento, processos.  
**Fraquezas narrativas:** baixa paixão, atritos com tradição, decisões frias.  
**Eventos frequentes:** venda racional de ídolo, meta trimestral, torcida protesta contra CEO.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +15`.

## 036 — Românticos da História

**ID:** `lore_036_romanticos_da_historia`  
**Categoria:** tradição  
**Resumo:** O clube acredita que jogar de certo jeito importa tanto quanto vencer. Romper com a tradição custa caro.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** identidade, torcida fiel, camisa pesada.  
**Fraquezas narrativas:** pouca flexibilidade, resistência tática, nostalgia.  
**Eventos frequentes:** mudança de estilo rejeitada, ídolo elogia postura, derrota honrosa vira debate.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +0; initialFatigue: +10`.

## 037 — Time de Copas

**ID:** `lore_037_time_de_copas`  
**Categoria:** mata-mata  
**Resumo:** Na liga regular oscila, mas em jogo eliminatório vira outro animal. A temporada é sobre chegar vivo.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** decisão, frieza, experiência em mata-mata.  
**Fraquezas narrativas:** irregularidade, pouco foco na fase regular, risco de classificação baixa.  
**Eventos frequentes:** jogo decisivo, descanso estratégico, torcida acredita em milagre.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10`.

## 038 — Maldição do Quase

**ID:** `lore_038_maldição_do_quase`  
**Categoria:** trauma competitivo  
**Resumo:** O clube bate na trave há anos. Cada jogo grande carrega o medo de repetir o fracasso.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** qualidade, experiência acumulada, fome.  
**Fraquezas narrativas:** ansiedade em finais, fantasma do passado, pressão crescente.  
**Eventos frequentes:** pergunta sobre trauma, erro no fim, vitória quebra tabu.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15`.

## 039 — Favorito Arrogante

**ID:** `lore_039_favorito_arrogante`  
**Categoria:** elite  
**Resumo:** Elenco se sabe superior e age como tal. A confiança ajuda, mas pode virar soberba.  
**Objetivo principal:** ser campeão  
**Orçamento:** elite  
**Pressão da torcida:** alta  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** alta

**Forças narrativas:** talento, profundidade, confiança.  
**Fraquezas narrativas:** acomodação, subestima rivais, antipatia externa.  
**Eventos frequentes:** derrota chocante, fala arrogante, treino de humildade.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +25`.

## 040 — Pacto da Sobrevivência

**ID:** `lore_040_pacto_da_sobrevivencia`  
**Categoria:** resistência  
**Resumo:** Jogadores, comissão e torcida sabem que a missão é sobreviver juntos. Cada ponto é celebrado como título.  
**Objetivo principal:** não cair  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** união, humildade, luta.  
**Fraquezas narrativas:** limitação técnica, fadiga, pouca reposição.  
**Eventos frequentes:** empate heroico, lesão preocupa, torcida canta após derrota.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15; initialFatigue: +10; initialCohesion: +12`.

## 041 — Dinastia da Base

**ID:** `lore_041_dinastia_da_base`  
**Categoria:** ciclo campeão  
**Resumo:** Uma geração formada no clube já venceu nas categorias inferiores e agora tenta dominar o profissional.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** entrosamento, identidade, potencial.  
**Fraquezas narrativas:** salto competitivo, ego de geração vencedora, assédio.  
**Eventos frequentes:** reunião da geração, primeiro clássico adulto, proposta por líder jovem.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 042 — Clube de Colônia

**ID:** `lore_042_clube_de_colonia`  
**Categoria:** comunidade cultural  
**Resumo:** A equipe representa uma comunidade específica e carrega símbolos culturais fortes. Pertencimento é força e cobrança.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** identidade, torcida fiel, eventos culturais.  
**Fraquezas narrativas:** mercado limitado, pressão simbólica, pouca neutralidade.  
**Eventos frequentes:** festa comunitária, crítica por descaracterizar elenco, jogador vira símbolo.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15; initialFatigue: +10`.

## 043 — Projeto Universitário

**ID:** `lore_043_projeto_universitario`  
**Categoria:** desenvolvimento  
**Resumo:** Equipe ligada a formação acadêmica, ciência e atletas estudantes. O calendário esportivo disputa espaço com a vida fora da quadra.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** inteligência tática, ambiente formativo, baixa pressão.  
**Fraquezas narrativas:** rotina dupla, pouca verba, atletas saem cedo.  
**Eventos frequentes:** semana de provas, pesquisa de desempenho, atleta escolhe estudo.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: -15`.

## 044 — Fúria da Capital

**ID:** `lore_044_furia_da_capital`  
**Categoria:** mercado grande  
**Resumo:** Clube de cidade grande, com mídia pesada e torcida barulhenta. Tudo vira pauta.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** receita, visibilidade, atração de jogadores.  
**Fraquezas narrativas:** pressão diária, crise viral, polêmica constante.  
**Eventos frequentes:** manchete pesada, coletiva tensa, arena lotada.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15; mediaExposure: +20`.

## 045 — Orgulho do Interior

**ID:** `lore_045_orgulho_do_interior`  
**Categoria:** interior forte  
**Resumo:** Representa uma cidade menor contra os gigantes. A identidade é derrubar favoritos.  
**Objetivo principal:** playoffs  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** mando forte, motivação contra grandes, comunidade.  
**Fraquezas narrativas:** orçamento, viagens, pouca profundidade.  
**Eventos frequentes:** gigante visita ginásio, cidade mobilizada, jogador recebe proposta.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15; initialFatigue: +10`.

## 046 — Elenco Remendado

**ID:** `lore_046_elenco_remendado`  
**Categoria:** lesões  
**Resumo:** O clube começa a temporada com vários atletas voltando de lesão. A gestão de carga define o destino.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** profundidade médica, superação, retornos importantes.  
**Fraquezas narrativas:** risco físico, ritmo baixo, medo de recaída.  
**Eventos frequentes:** retorno gradual, torcida pede titular, fisioterapia veta atleta.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 047 — Time Sem Capitão

**ID:** `lore_047_time_sem_capitao`  
**Categoria:** liderança  
**Resumo:** O antigo líder saiu e ninguém assumiu o vestiário. Talento existe, direção emocional não.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** espaço para novos líderes, talento distribuído, renovação.  
**Fraquezas narrativas:** vácuo de liderança, conflitos pequenos, queda em pressão.  
**Eventos frequentes:** escolha de capitão, grupo dividido, jovem assume voz.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 048 — Estátua Viva

**ID:** `lore_048_estatua_viva`  
**Categoria:** ídolo intocável  
**Resumo:** Um ídolo ainda joga, mas já não entrega o mesmo nível. Tirar minutos dele pode ser correto e perigoso.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** identificação, liderança, marketing.  
**Fraquezas narrativas:** queda técnica, constrangimento, torcida dividida.  
**Eventos frequentes:** ídolo no banco, golpe de realidade, último grande jogo.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +0`.

## 049 — O Estrangeiro Salvador

**ID:** `lore_049_o_estrangeiro_salvador`  
**Categoria:** estrela importada  
**Resumo:** Uma estrela estrangeira chega para mudar o patamar do clube. Tudo passa por adaptação, idioma e expectativa.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** talento diferencial, marketing, nova referência.  
**Fraquezas narrativas:** adaptação, dependência, choque cultural.  
**Eventos frequentes:** estreia midiática, tradução no vestiário, estrela cobra reforços.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 050 — Clube Endividado

**ID:** `lore_050_clube_endividado`  
**Categoria:** crise financeira  
**Resumo:** A dívida limita escolhas e cada decisão tem consequência financeira. Competir sem quebrar é o desafio.  
**Objetivo principal:** não cair  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** média

**Forças narrativas:** urgência, base valorizada, criatividade.  
**Fraquezas narrativas:** vendas forçadas, salários atrasados, elenco instável.  
**Eventos frequentes:** atraso salarial, proposta inevitável, diretoria pede corte.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15`.

## 051 — Máquina de Marketing

**ID:** `lore_051_maquina_de_marketing`  
**Categoria:** imagem  
**Resumo:** O clube sabe vender espetáculo, camisa e narrativa. Às vezes a imagem corre mais rápido que o basquete.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** muito alta

**Forças narrativas:** receita, visibilidade, atração.  
**Fraquezas narrativas:** distrações, jogadores viram produto, pressão de patrocinador.  
**Eventos frequentes:** campanha publicitária, atleta reclama de agenda, patrocinador cobra estrela.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15; mediaExposure: +20`.

## 052 — Sombra do Rival

**ID:** `lore_052_sombra_do_rival`  
**Categoria:** inferioridade local  
**Resumo:** O clube vive comparado ao rival maior da cidade. A temporada é uma busca por respeito.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** motivação, identidade de resistência, fome em clássico.  
**Fraquezas narrativas:** complexo de inferioridade, obsessão, mídia comparativa.  
**Eventos frequentes:** rival contrata estrela, clássico decisivo, torcida cobra postura.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10`.

## 053 — Dono do Estado

**ID:** `lore_053_dono_do_estado`  
**Categoria:** hegemonia regional  
**Resumo:** O clube domina regionalmente, mas quer provar que é nacional. Perder localmente é humilhação.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** estrutura, torcida regional, confiança.  
**Fraquezas narrativas:** arrogância local, pressão nacional, rivais motivados.  
**Eventos frequentes:** final regional, zebra local, viagem nacional decisiva.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 054 — Clube Sem Memória

**ID:** `lore_054_clube_sem_memoria`  
**Categoria:** identidade frágil  
**Resumo:** Projeto novo, sem tradição clara. Tudo precisa ser construído do zero: torcida, símbolos e história.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** liberdade, modernidade, baixo peso histórico.  
**Fraquezas narrativas:** pouca torcida, sem identidade, baixa pressão positiva.  
**Eventos frequentes:** criar mascote, primeiro ídolo, campanha para atrair torcida.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: +0; initialFatigue: +10`.

## 055 — Os Inquebráveis

**ID:** `lore_055_os_inquebraveis`  
**Categoria:** resiliência física  
**Resumo:** Equipe conhecida por intensidade absurda e preparo físico. O limite entre força e lesão é fino.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** condicionamento, pressão defensiva, ritmo.  
**Fraquezas narrativas:** fadiga acumulada, lesões musculares, queda no fim.  
**Eventos frequentes:** treino extremo, fisiologia alerta, adversário cansa.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10`.

## 056 — Clube das Finais

**ID:** `lore_056_clube_das_finais`  
**Categoria:** decisivo  
**Resumo:** O clube sempre chega longe, mas cada temporada só é julgada no mata-mata.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** casca, frieza, planejamento.  
**Fraquezas narrativas:** fase regular desvalorizada, pressão em semifinal, torcida exige final.  
**Eventos frequentes:** rodar elenco, semifinal histórica, crítica por poupar.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 057 — Banco de Luxo

**ID:** `lore_057_banco_de_luxo`  
**Categoria:** profundidade  
**Resumo:** O clube tem reservas que seriam titulares em outros times. Administrar minutos e ego é o grande problema.  
**Objetivo principal:** ser campeão  
**Orçamento:** elite  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** média

**Forças narrativas:** profundidade, rotação, competição interna.  
**Fraquezas narrativas:** ego, insatisfação, difícil hierarquia.  
**Eventos frequentes:** reserva pede troca, lesão não assusta, treino vira disputa.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +25`.

## 058 — Fome de Primeiro Título

**ID:** `lore_058_fome_de_primeiro_titulo`  
**Categoria:** busca histórica  
**Resumo:** Clube competitivo que nunca foi campeão. A cidade inteira sente que chegou a hora.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** motivação, torcida mobilizada, projeto maduro.  
**Fraquezas narrativas:** ansiedade, medo de fracasso, peso histórico.  
**Eventos frequentes:** campanha histórica, pergunta sobre tabu, jogador promete título.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15`.

## 059 — Geração Perdida

**ID:** `lore_059_geracao_perdida`  
**Categoria:** talento desperdiçado  
**Resumo:** Um grupo talentoso nunca confirmou expectativas. Esta pode ser a última chance antes da desmontagem.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** média

**Forças narrativas:** talento, urgência, experiência.  
**Fraquezas narrativas:** frustração acumulada, desconfiança, risco de debandada.  
**Eventos frequentes:** última chance, estrela questionada, proposta por peça-chave.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 060 — Clube dos Retornos

**ID:** `lore_060_clube_dos_retorno`  
**Categoria:** nostalgia ativa  
**Resumo:** Vários jogadores formados no clube voltam mais velhos para tentar fechar histórias pendentes.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** identificação, experiência, histórias pessoais.  
**Fraquezas narrativas:** idade, expectativa nostálgica, ritmo.  
**Eventos frequentes:** retorno emocionado, lesão de veterano, jogo contra ex-clube.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10`.

## 061 — O Laboratório

**ID:** `lore_061_o_laboratorio`  
**Categoria:** experimental  
**Resumo:** O clube aceita testar métodos, jovens e táticas. Pode descobrir o futuro ou virar bagunça.  
**Objetivo principal:** desenvolver base  
**Orçamento:** baixo  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** inovação, aprendizado, flexibilidade.  
**Fraquezas narrativas:** instabilidade, falta de padrão, resultados ruins.  
**Eventos frequentes:** teste tático, dado surpreendente, torcida não entende escolha.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: -15; initialFatigue: +10`.

## 062 — A Muralha Caseira

**ID:** `lore_062_a_muralha_caseira`  
**Categoria:** mando de quadra  
**Resumo:** Em casa o time cresce absurdamente; fora, parece outro elenco. O calendário pesa muito.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** mando forte, torcida, confiança local.  
**Fraquezas narrativas:** fraqueza fora, viagens, dependência do ginásio.  
**Eventos frequentes:** sequência fora, ginásio lotado, preparação para viagem.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 063 — Clube da Rotina

**ID:** `lore_063_clube_religioso_da_rotina`  
**Categoria:** ritual  
**Resumo:** Equipe muito dependente de rotina, rituais e preparação. Mudanças de calendário desorganizam tudo.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** organização, consistência, disciplina.  
**Fraquezas narrativas:** pouca adaptação, sofre com imprevisto, rigidez.  
**Eventos frequentes:** viagem alterada, rotina mantida, atleta quebra ritual.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 064 — Panelinha dos Craques

**ID:** `lore_064_panelinha_dos_craques`  
**Categoria:** grupo fechado  
**Resumo:** Os melhores jogadores são amigos e se protegem. Isso cria química, mas exclui parte do elenco.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** química entre estrelas, talento, decisão.  
**Fraquezas narrativas:** vestiário partido, reservas isolados, resistência à comissão.  
**Eventos frequentes:** reserva reclama, craques defendem colega, técnico confronta panelinha.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.

## 065 — Clube de Treinador

**ID:** `lore_065_clube_de_treinador`  
**Categoria:** sistema forte  
**Resumo:** A maior estrela é o treinador e seu sistema. Jogadores entram e saem, a ideia permanece.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** sistema, clareza, regularidade.  
**Fraquezas narrativas:** dependência do técnico, atletas criativos limitados, previsibilidade.  
**Eventos frequentes:** convite ao treinador, jogador brilha no sistema, crítica por rigidez.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0; initialFatigue: +10`.

## 066 — Herdeiros da Lenda

**ID:** `lore_066_herdeiros_da_lenda`  
**Categoria:** sucessão  
**Resumo:** Uma lenda se aposentou e deixou sombra enorme. O novo líder precisa provar que não é só substituto.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** motivação, renovação, história forte.  
**Fraquezas narrativas:** comparação injusta, ansiedade do sucessor, torcida nostálgica.  
**Eventos frequentes:** camisa pesada, lenda visita treino, novo líder decide jogo.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 067 — Promessas Quebradas

**ID:** `lore_067_clube_das_promessas_quebradas`  
**Categoria:** frustração  
**Resumo:** Atletas antes tratados como fenômenos tentam recuperar carreira. O elenco mistura talento e cicatrizes.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** talento escondido, motivação pessoal, baixo custo.  
**Fraquezas narrativas:** confiança baixa, histórico de lesão, instabilidade.  
**Eventos frequentes:** redenção individual, recaída emocional, jogador reencontra forma.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialFatigue: +10`.

## 068 — Fortaleza Defensiva

**ID:** `lore_068_a_fortaleza_defensiva`  
**Categoria:** território  
**Resumo:** Ginásio pequeno, torcida em cima e defesa sufocante. O adversário sente cada erro.  
**Objetivo principal:** playoffs  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** mando, defesa, intimidação.  
**Fraquezas narrativas:** ataque limitado, depende do ambiente, problemas em arenas grandes.  
**Eventos frequentes:** jogo em ginásio antigo, adversário reclama, torcida vira fator.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15`.

## 069 — Meninos contra Homens

**ID:** `lore_069_meninos_contra_homens`  
**Categoria:** transição  
**Resumo:** Elenco jovem encara adversários muito mais físicos. O crescimento vem na pancada.  
**Objetivo principal:** desenvolver base  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** potencial, velocidade, aprendizado.  
**Fraquezas narrativas:** força física, ingenuidade, medo em jogos duros.  
**Eventos frequentes:** jogo físico, promessa ganha massa, veterano adversário provoca.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialFatigue: +10`.

## 070 — Caçadores de Gigantes

**ID:** `lore_070_cacadores_de_gigantes`  
**Categoria:** zebra  
**Resumo:** Equipe cresce contra favoritos e perde pontos bobos contra times parecidos.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** motivação contra grandes, surpresa, jogo emocional.  
**Fraquezas narrativas:** irregularidade, subestima pequenos, foco instável.  
**Eventos frequentes:** vitória sobre líder, derrota inexplicável, preleção por foco.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialFatigue: +10`.

## 071 — Sub-23 Global

**ID:** `lore_071_elenco_internacional_sub23`  
**Categoria:** prospecção  
**Resumo:** Jovens de vários países são reunidos em projeto de desenvolvimento internacional.  
**Objetivo principal:** desenvolver base  
**Orçamento:** médio  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** potencial global, diversidade, mercado futuro.  
**Fraquezas narrativas:** adaptação, idioma, falta de líderes.  
**Eventos frequentes:** jovem homesick, olheiro visita, aula de idioma no clube.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: +0`.

## 072 — Clube dos Capitães

**ID:** `lore_072_o_clube_dos_capitaes`  
**Categoria:** liderança demais  
**Resumo:** Elenco tem muitos líderes acostumados a mandar. O excesso de voz pode virar disputa de comando.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** experiência, responsabilidade, leitura de jogo.  
**Fraquezas narrativas:** conflito de liderança, ego, decisão coletiva lenta.  
**Eventos frequentes:** reunião de líderes, capitães discordam, grupo se organiza sozinho.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +15`.

## 073 — A Aposta do Rookie

**ID:** `lore_073_a_aposta_do_rookie`  
**Categoria:** promessa central  
**Resumo:** A temporada gira em torno de uma promessa absurda. Proteger, desenvolver ou acelerar?  
**Objetivo principal:** desenvolver base  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** potencial estrela, marketing, energia nova.  
**Fraquezas narrativas:** pressão precoce, dependência narrativa, risco de lesão.  
**Eventos frequentes:** rookie decide jogo, mídia exagera, veterano orienta jovem.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 074 — Clube das Cicatrizes

**ID:** `lore_074_clube_das_cicatrizes`  
**Categoria:** superação  
**Resumo:** O elenco é formado por atletas rejeitados, lesionados ou desacreditados. Todos têm algo a provar.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** média

**Forças narrativas:** fome, união, resiliência.  
**Fraquezas narrativas:** limitações reais, histórico físico, confiança frágil.  
**Eventos frequentes:** história pessoal viraliza, adversário subestima, jogador desaba após vitória.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialCohesion: +12`.

## 075 — Rolo Compressor

**ID:** `lore_075_o_rolo_compressor`  
**Categoria:** favorito físico  
**Resumo:** Equipe enorme, forte e profunda. Quer atropelar no físico, mas pode sofrer contra velocidade e espaçamento.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** média

**Forças narrativas:** força, rebote, profundidade física.  
**Fraquezas narrativas:** lentidão, faltas, previsibilidade.  
**Eventos frequentes:** adversário corre muito, domínio no garrafão, pivô reclama de minutos.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15; initialFatigue: +10`.

## 076 — Pequeno Brilhante

**ID:** `lore_076_o_time_pequeno_brilhante`  
**Categoria:** small ball  
**Resumo:** Elenco baixo, rápido e técnico. Pode abrir defesas ou ser esmagado fisicamente.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** velocidade, arremesso, espaçamento.  
**Fraquezas narrativas:** rebote, defesa física, cansaço.  
**Eventos frequentes:** chuva de bolas, massacre no rebote, decisão sobre pivô.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 077 — Sindicato dos Reservas

**ID:** `lore_077_sindicato_dos_reservas`  
**Categoria:** banco inquieto  
**Resumo:** Reservas querem mais espaço e acreditam que os titulares têm privilégios demais.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** competição interna, profundidade, energia do banco.  
**Fraquezas narrativas:** ciúme, vazamento, queda de coesão.  
**Eventos frequentes:** reserva fala demais, rotação ampliada, titular se incomoda.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 078 — A Cidade Contra Todos

**ID:** `lore_078_a_cidade_contra_todos`  
**Categoria:** orgulho cívico  
**Resumo:** A cidade sente que a liga despreza o clube. Cada jogo vira afirmação coletiva.  
**Objetivo principal:** playoffs  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** alta

**Forças narrativas:** motivação, mando forte, narrativa de injustiça.  
**Fraquezas narrativas:** paranoia, pressão emocional, conflito com arbitragem.  
**Eventos frequentes:** erro de arbitragem, prefeito aparece, torcida lota treino.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15`.

## 079 — Virada Financeira

**ID:** `lore_079_clube_da_virada_financeira`  
**Categoria:** recuperação econômica  
**Resumo:** Após anos quebrado, o clube começa a se organizar. O desafio é não gastar antes da hora.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** alta  
**Exposição na mídia:** média

**Forças narrativas:** gestão melhorando, esperança, planejamento.  
**Fraquezas narrativas:** tentação de gasto, trauma financeiro, elenco médio.  
**Eventos frequentes:** patrocínio novo, pedido por reforço, diretoria segura orçamento.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 080 — Batalha dos Egos

**ID:** `lore_080_a_batalha_dos_egos`  
**Categoria:** superestrelas  
**Resumo:** Várias estrelas querem ser protagonistas. O talento é absurdo; a bola é uma só.  
**Objetivo principal:** ser campeão  
**Orçamento:** elite  
**Pressão da torcida:** alta  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** talento elite, decisão, marketing.  
**Fraquezas narrativas:** ego, hierarquia, defesa negligenciada.  
**Eventos frequentes:** estrela cobra bola, coletiva tensa, jogo vencido no talento.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +25; mediaExposure: +20`.

## 081 — Clube Paciente

**ID:** `lore_081_o_clube_paciente`  
**Categoria:** longo prazo  
**Resumo:** Diretoria aceita perder agora para vencer depois. O problema é saber se a torcida também aceita.  
**Objetivo principal:** desenvolver base  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** planejamento, desenvolvimento, baixa cobrança interna.  
**Fraquezas narrativas:** torcida impaciente, derrotas acumuladas, risco de desmobilização.  
**Eventos frequentes:** derrota com evolução, diretoria banca técnico, torcida pede reforço.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 082 — Temporada do Centenário

**ID:** `lore_082_a_temporada_do_centenario`  
**Categoria:** data simbólica  
**Resumo:** O clube completa data histórica e quer uma campanha à altura. Cerimônias, ídolos e pressão se misturam.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** mobilização, receita, sentido histórico.  
**Fraquezas narrativas:** pressão simbólica, agenda cheia, comparações.  
**Eventos frequentes:** jogo comemorativo, uniforme especial, ídolos cobram título.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15; mediaExposure: +20`.

## 083 — Clube Sem Paciência

**ID:** `lore_083_o_clube_sem_paciencia`  
**Categoria:** crise instantânea  
**Resumo:** Qualquer derrota vira fim do mundo. A cultura interna não sabe atravessar sequência ruim.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** muito alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** ambição, cobrança, recursos.  
**Fraquezas narrativas:** ansiedade, instabilidade, vazamentos.  
**Eventos frequentes:** duas derrotas viram crise, reunião com organizada, diretoria cobra resposta.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +15; initialFatigue: +10; mediaExposure: +20`.

## 084 — Escola de Armadores

**ID:** `lore_084_a_escola_de_armadores`  
**Categoria:** tradição posicional  
**Resumo:** Clube historicamente revela grandes armadores. A torcida valoriza inteligência, passe e controle de ritmo.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** criação, leitura de jogo, base especializada.  
**Fraquezas narrativas:** dependência do armador, falta de força interior, pressão sobre jovens.  
**Eventos frequentes:** armador jovem erra, ídolo da posição visita, debate sobre ritmo.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 085 — Torres Gêmeas

**ID:** `lore_085_torre_gemea`  
**Categoria:** garrafão dominante  
**Resumo:** Dois pivôs dominantes definem a identidade do time. A liga tenta obrigá-los a jogar longe da cesta.  
**Objetivo principal:** playoffs  
**Orçamento:** alto  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** garrafão, rebote, proteção de aro.  
**Fraquezas narrativas:** espaçamento, velocidade adversária, faltas.  
**Eventos frequentes:** pivôs juntos ou separados, adversário abre quadra, domínio físico.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +15; initialFatigue: +10`.

## 086 — Chuva de Três

**ID:** `lore_086_chuva_de_tres`  
**Categoria:** arremesso  
**Resumo:** Tudo gira em torno do perímetro. Quando cai, é massacre. Quando não cai, vira desespero.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** arremesso, runs rápidos, espetáculo.  
**Fraquezas narrativas:** variância, rebote longo, defesa vulnerável.  
**Eventos frequentes:** noite histórica, frio coletivo, treino de seleção de arremesso.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 087 — Clube do Contra-Ataque

**ID:** `lore_087_clube_do_contra_ataque`  
**Categoria:** transição  
**Resumo:** Equipe vive de correr, roubar bola e atacar antes da defesa montar. Ritmo é vida.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** velocidade, pressão, energia.  
**Fraquezas narrativas:** meia quadra fraca, fadiga, erros.  
**Eventos frequentes:** adversário baixa ritmo, treino de transição, jogador pede mais controle.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0; initialFatigue: +10`.

## 088 — O Monge e o Caos

**ID:** `lore_088_o_monge_e_os_caos`  
**Categoria:** treinador calmo  
**Resumo:** Treinador calmo tenta comandar elenco emocional e explosivo. O contraste pode virar equilíbrio ou ruptura.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** controle emocional, gestão de crise, serenidade.  
**Fraquezas narrativas:** elenco impulsivo, torcida quer sangue, risco de parecer passivo.  
**Eventos frequentes:** jogador explode, técnico protege grupo, coletiva serena irrita torcida.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 089 — Pós-Escândalo

**ID:** `lore_089_reconstrucao_pos_escandalo`  
**Categoria:** reputação  
**Resumo:** O clube tenta limpar imagem após crise institucional. Cada erro parece confirmar velhos problemas.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** alta  
**Exposição na mídia:** muito alta

**Forças narrativas:** vontade de mudar, governança, apoio por transparência.  
**Fraquezas narrativas:** desconfiança, mídia agressiva, patrocinador sensível.  
**Eventos frequentes:** pergunta sobre passado, nova regra interna, patrocinador cobra postura.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0; mediaExposure: +20`.

## 090 — Clube do Povo

**ID:** `lore_090_clube_do_povo`  
**Categoria:** popular  
**Resumo:** Torcida numerosa e emocional exige raça, identificação e acesso. Jogador que parece distante sofre.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** muito alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** apoio massivo, identificação, pressão positiva.  
**Fraquezas narrativas:** cobrança emocional, exposição, conflito com estrela fria.  
**Eventos frequentes:** treino aberto, jogador abraça torcida, vaias por falta de entrega.  
**Modificadores iniciais sugeridos:** `initialPressure: +25; budgetFlexibility: +0`.

## 091 — Time de Grife

**ID:** `lore_091_time_de_grife`  
**Categoria:** elite social  
**Resumo:** Clube rico, elegante e cobrado por imagem. Vencer feio também incomoda.  
**Objetivo principal:** ser campeão  
**Orçamento:** elite  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** estrutura, atração, patrocínio.  
**Fraquezas narrativas:** elitização, pressão estética, distância popular.  
**Eventos frequentes:** evento de patrocinador, crítica por falta de alma, contratação badalada.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +25`.

## 092 — Sobreviventes da Viagem

**ID:** `lore_092_sobreviventes_da_viagem`  
**Categoria:** calendário pesado  
**Resumo:** A equipe enfrenta a pior logística da liga. Fadiga, sono e deslocamento são adversários fixos.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** resiliência, união, adaptação.  
**Fraquezas narrativas:** fadiga, lesões, queda fora de casa.  
**Eventos frequentes:** voo atrasado, treino regenerativo, comissão pede descanso.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialFatigue: +10; initialCohesion: +12`.

## 093 — Clube Sem Estrelas

**ID:** `lore_093_clube_sem_estrelas`  
**Categoria:** igualitário  
**Resumo:** Ninguém é muito maior que ninguém. A força está na distribuição, mas falta alguém para decidir.  
**Objetivo principal:** meio de tabela  
**Orçamento:** baixo  
**Pressão da torcida:** média  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** baixa

**Forças narrativas:** coesão, defesa coletiva, baixo ego.  
**Fraquezas narrativas:** falta de clutch, pouco marketing, limite técnico.  
**Eventos frequentes:** quem decide o último arremesso, vitória coletiva, torcida pede craque.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: -15; initialCohesion: +12`.

## 094 — A Última Vaga

**ID:** `lore_094_a_ultima_vaga`  
**Categoria:** play-in  
**Resumo:** O elenco foi montado para brigar até o fim pela última vaga. Cada confronto direto pesa o dobro.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** foco em confronto direto, resiliência, clareza de meta.  
**Fraquezas narrativas:** margem pequena, pressão por tabela, dependência de rivais.  
**Eventos frequentes:** jogo de seis pontos, cálculo de classificação, poupar ou vencer agora.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0`.

## 095 — Clube do Treinamento

**ID:** `lore_095_o_clube_do_treinamento`  
**Categoria:** desenvolvimento diário  
**Resumo:** O time acredita que treino resolve tudo. Bons treinos aumentam moral; treinos ruins viram presságio.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** evolução, disciplina, controle.  
**Fraquezas narrativas:** excesso de treino, fadiga, frustração quando não transfere.  
**Eventos frequentes:** treino perfeito, carga questionada, atleta pede folga.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0; initialFatigue: +10`.

## 096 — Crise de Identidade

**ID:** `lore_096_crise_de_identidade`  
**Categoria:** transição cultural  
**Resumo:** O clube não sabe se quer ser formador, comprador, defensivo ou espetáculo. A temporada precisa definir uma cara.  
**Objetivo principal:** meio de tabela  
**Orçamento:** médio  
**Pressão da torcida:** média  
**Pressão da diretoria:** média  
**Exposição na mídia:** média

**Forças narrativas:** flexibilidade, chance de redefinir, elenco misto.  
**Fraquezas narrativas:** confusão, torcida dividida, decisões contraditórias.  
**Eventos frequentes:** reunião sobre filosofia, mudança de estilo, jogador pede clareza.  
**Modificadores iniciais sugeridos:** `initialPressure: +0; budgetFlexibility: +0`.

## 097 — Lendas Jovens

**ID:** `lore_097_o_clube_das_lendas_jovens`  
**Categoria:** precocidade  
**Resumo:** Atletas muito jovens já são tratados como ídolos. A fama veio antes da maturidade.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** alta  
**Pressão da diretoria:** média  
**Exposição na mídia:** alta

**Forças narrativas:** talento precoce, marketing, torcida apaixonada.  
**Fraquezas narrativas:** imaturidade, pressão precoce, ego inflado.  
**Eventos frequentes:** jovem dá entrevista polêmica, torcida idolatra, veterano cobra humildade.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +0; initialFatigue: +10`.

## 098 — Frente Fria

**ID:** `lore_098_a_frente_fria`  
**Categoria:** controle emocional  
**Resumo:** Equipe fria, calculista e pouco emotiva. Ganha sem drama, mas às vezes parece sem alma.  
**Objetivo principal:** playoffs  
**Orçamento:** médio  
**Pressão da torcida:** baixa  
**Pressão da diretoria:** média  
**Exposição na mídia:** baixa

**Forças narrativas:** controle, consistência, baixa oscilação.  
**Fraquezas narrativas:** pouca conexão, dificuldade em viradas emocionais, torcida morna.  
**Eventos frequentes:** vitória protocolar, torcida pede paixão, jogo quente testa frieza.  
**Modificadores iniciais sugeridos:** `initialPressure: -10; budgetFlexibility: +0`.

## 099 — Clube dos Milagres

**ID:** `lore_099_o_clube_dos_milagres`  
**Categoria:** improvável  
**Resumo:** A história recente é cheia de vitórias impossíveis. A torcida acredita até quando a estatística ri.  
**Objetivo principal:** playoffs  
**Orçamento:** baixo  
**Pressão da torcida:** alta  
**Pressão da diretoria:** baixa  
**Exposição na mídia:** alta

**Forças narrativas:** fé coletiva, resiliência, decisão emocional.  
**Fraquezas narrativas:** dependência de épicos, baixa regularidade, risco de ilusão.  
**Eventos frequentes:** milagre no estouro, analistas duvidam, torcida canta antes da virada.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: -15; initialFatigue: +10`.

## 100 — A Nova Ordem

**ID:** `lore_100_a_nova_ordem`  
**Categoria:** mudança de era  
**Resumo:** Um clube emergente ameaça a velha hierarquia da liga. Os gigantes não aceitam dividir o trono.  
**Objetivo principal:** ser campeão  
**Orçamento:** alto  
**Pressão da torcida:** alta  
**Pressão da diretoria:** alta  
**Exposição na mídia:** alta

**Forças narrativas:** ambição, talento ascendente, energia de ruptura.  
**Fraquezas narrativas:** inimizade dos grandes, pressão inédita, falta de experiência no topo.  
**Eventos frequentes:** vitória contra potência, provocação dos veteranos da liga, primeira final histórica.  
**Modificadores iniciais sugeridos:** `initialPressure: +15; budgetFlexibility: +15`.
