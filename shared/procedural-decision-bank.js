(function () {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function getRng(seed) {
    const factory = window.TemporadaTotal?.createSeededRng;
    if (factory) return factory(seed);
    let state = String(seed || "decision-bank").split("").reduce((sum, char) => sum + char.charCodeAt(0), 131);
    function next() {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    }
    return {
      next,
      int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
      pick: (items) => items[Math.floor(next() * items.length)]
    };
  }

  function getData() {
    return window.TemporadaTotal?.ProceduralDecisionBankData || [];
  }

  const KNOCKOUT_STAGE_LABELS = {
    round_of_16: "Oitavas",
    quarterfinal: "Quartas",
    semifinal: "Semifinal",
    final: "Final"
  };

  const KNOCKOUT_STAGE_TAGS = {
    round_of_16: ["oitavas", "entrada_mata_mata"],
    quarterfinal: ["quartas", "sobrevivencia"],
    semifinal: ["semifinal", "pressao_alta"],
    final: ["final", "titulo"]
  };

  const BASKETBALL_ONLY_LORE_IDS = new Set([
    "lore_075_o_rolo_compressor",
    "lore_076_o_time_pequeno_brilhante",
    "lore_084_a_escola_de_armadores",
    "lore_085_torre_gemea",
    "lore_086_chuva_de_tres"
  ]);

  function isKnockoutEvent(event) {
    return Boolean(event?.knockout || ["round_of_16", "quarterfinal", "semifinal", "final"].includes(event?.stage));
  }

  function getKnockoutDecisionBank() {
    if (window.TemporadaTotal?.ProceduralKnockoutDecisionBank?.length) {
      return window.TemporadaTotal.ProceduralKnockoutDecisionBank;
    }
    const stages = Object.keys(KNOCKOUT_STAGE_LABELS);
    const themes = [
      { key: "plano_pressao", title: "Pressao inicial", branch: "pressao_alta", text: "A comissao debate se vale sufocar o rival nos primeiros minutos ou guardar energia para o fim." },
      { key: "controle_emocional", title: "Cabeca fria", branch: "controle_emocional", text: "O elenco sente o peso do jogo unico e os lideres pedem uma direcao clara antes da bola rolar." },
      { key: "bola_parada", title: "Bola parada decisiva", branch: "bola_parada", text: "O auxiliar trouxe duas variacoes treinadas que podem decidir um duelo travado." },
      { key: "goleiro_linha", title: "Plano de emergencia", branch: "goleiro_linha", text: "O staff quer deixar preparado um plano agressivo caso o placar aperte no segundo tempo." },
      { key: "rotacao_curta", title: "Rotacao de confianca", branch: "rotacao_curta", text: "Alguns reservas pedem minutos, mas a espinha dorsal esta pronta para assumir carga maior." },
      { key: "marcacao_alvo", title: "Alvo do rival", branch: "marcacao_alvo", text: "A analise aponta um jogador adversario capaz de quebrar o jogo se receber liberdade." },
      { key: "penaltis", title: "Roteiro dos penaltis", branch: "penaltis", text: "O treino terminou com cobrancas e uma duvida: repetir a ordem segura ou surpreender." },
      { key: "capitao", title: "Voz do vestiario", branch: "lideranca", text: "O capitao pede participacao direta na palestra para proteger o grupo da ansiedade." },
      { key: "transicao", title: "Transicao curta", branch: "transicao", text: "O scout mostra que o rival perde organizacao quando a primeira pressao e superada." },
      { key: "arquibancada", title: "Ambiente pesado", branch: "ambiente", text: "A atmosfera promete ser hostil e o grupo precisa decidir como transformar ruido em foco." },
      { key: "favoritismo", title: "Peso do favoritismo", branch: "favoritismo", text: "A imprensa trata seu clube como favorito, mas a comissao teme relaxamento em jogo unico." },
      { key: "underdog", title: "Plano de zebra", branch: "zebra", text: "O adversario chega com mais nome e o staff quer escolher onde aceitar risco." }
    ];
    const intensities = [
      { key: "conservador", label: "Proteger a estrutura", effects: { morale: 2, chemistry: 2, fatigue: -2, reputation: 0 }, risk: "baixo", branch: "seguranca" },
      { key: "equilibrado", label: "Ajustar sem mudar a identidade", effects: { morale: 2, chemistry: 1, tactical: 2, fatigue: 1 }, risk: "medio", branch: "equilibrio" },
      { key: "agressivo", label: "Assumir o risco agora", effects: { morale: 4, tactical: 3, fatigue: 4, chemistry: -1 }, risk: "alto", branch: "ousadia" }
    ];
    const decisions = [];
    for (let index = 0; index < 300; index += 1) {
      const stage = stages[index % stages.length];
      const theme = themes[index % themes.length];
      const variant = Math.floor(index / themes.length) + 1;
      const stageLabel = KNOCKOUT_STAGE_LABELS[stage];
      decisions.push({
        decisionId: `knockout_${stage}_${theme.key}_${variant}`,
        loreId: "knockout",
        decisionType: `mata_mata_${theme.key}`,
        title: `${stageLabel}: ${theme.title}`,
        situation: `${theme.text} A escolha cria uma trilha propria para o restante do mata-mata.`,
        cooldownWeeks: 1,
        priority: stage === "final" || theme.key === "penaltis" ? "alta" : "media",
        tags: ["knockout", "mata_mata", stage, theme.branch, ...(KNOCKOUT_STAGE_TAGS[stage] || [])],
        options: intensities.map((intensity, optionIndex) => ({
          optionId: `knockout_${stage}_${theme.key}_${variant}_${intensity.key}`,
          label: intensity.label,
          description: optionIndex === 0
            ? "Reduz variancia e cobra disciplina coletiva."
            : optionIndex === 1
              ? "Mantem o plano base, com um ajuste claro para o duelo."
              : "Eleva o teto competitivo, aceitando desgaste e instabilidade.",
          effects: intensity.effects,
          riskProfile: intensity.risk,
          branchTags: ["knockout", theme.branch, intensity.branch, stage]
        }))
      });
    }
    window.TemporadaTotal = window.TemporadaTotal || {};
    window.TemporadaTotal.ProceduralKnockoutDecisionBank = decisions;
    return decisions;
  }

  function getStateDecisionSalt(state) {
    return [
      state?.sportId,
      state?.userTeam?.id,
      state?.userTeam?.name,
      state?.userTeam?.objective,
      state?.userTeam?.rosterStyle,
      state?.userTeam?.lore?.id
    ].filter(Boolean).map((item) => String(item)).join(":");
  }

  function getDecisionPoolForTeam(team, decisions = getData()) {
    const loreId = team?.lore?.id;
    const exact = decisions.filter((decision) => decision.loreId === loreId);
    if (exact.length) return exact;

    const tags = new Set([
      ...(team?.lore?.decisionSummary?.tags || []),
      ...(team?.lore?.traits || [])
    ]);
    const byTags = decisions.filter((decision) => (decision.tags || []).some((tag) => tags.has(tag)));
    return byTags.length ? byTags : decisions;
  }

  function getDecisionWeight(decision) {
    const priority = String(decision.priority || "").toLowerCase();
    if (priority.includes("alta")) return 4;
    if (priority.includes("media") || priority.includes("média")) return 2;
    return 1;
  }

  function pickWeighted(rows, rng) {
    if (!rows.length) return null;
    const total = rows.reduce((sum, row) => sum + getDecisionWeight(row), 0);
    let roll = (rng.float ? rng.float(0, total) : rng.next() * total);
    for (const row of rows) {
      roll -= getDecisionWeight(row);
      if (roll <= 0) return row;
    }
    return rows[rows.length - 1];
  }

  function getTeamDecisionTags(team) {
    return new Set([
      ...(team?.lore?.decisionSummary?.tags || []),
      ...(team?.lore?.traits || []),
      team?.objective,
      team?.rosterStyle
    ].filter(Boolean).map((tag) => String(tag)));
  }

  function uniqueByDecisionId(rows) {
    const seen = new Set();
    return rows.filter((row) => {
      const id = row?.decisionId;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function isDecisionTypeOnCooldown(state, decision) {
    const memory = Array.isArray(state.decisionMemory) ? state.decisionMemory : [];
    const type = decision?.decisionType;
    if (!type) return false;
    const currentDay = Number(state.currentDay) || 0;
    const cooldownDays = Math.max(7, (Number(decision.cooldownWeeks) || 2) * 7);
    return memory.some((entry) => {
      const entryType = entry?.decisionType || entry?.type;
      const entryDay = Number(entry?.day) || 0;
      return entryType === type && currentDay - entryDay < cooldownDays;
    });
  }

  function getRecentDecisionMemory(state, limit = 8) {
    return (Array.isArray(state.decisionMemory) ? state.decisionMemory : []).slice(0, limit);
  }

  function getDecisionTitleKey(decision) {
    return normalizeSearchText(decision?.title || "");
  }

  function hasRecentDecisionTitle(state, decision, limit = 8) {
    const titleKey = getDecisionTitleKey(decision);
    if (!titleKey) return false;
    return getRecentDecisionMemory(state, limit).some((entry) => normalizeSearchText(entry?.title || "") === titleKey);
  }

  function hasRecentDecisionType(state, decision, limit = 5) {
    const type = decision?.decisionType;
    if (!type) return false;
    return getRecentDecisionMemory(state, limit).some((entry) => (entry?.decisionType || entry?.type) === type);
  }

  function getUserStanding(state) {
    return (state.standings || []).find((row) => row.teamId === state.userTeam?.id) || null;
  }

  function getContextPressureLevel(state) {
    const standing = getUserStanding(state);
    const wins = Number(standing?.wins) || 0;
    const losses = Number(standing?.losses) || 0;
    const draws = Number(standing?.draws) || 0;
    const games = wins + losses + draws;
    const morale = Number(state.summary?.moraleAverage ?? state.teamState?.morale ?? 52);
    const fatigue = Number(state.summary?.fatigueAverage ?? state.teamState?.fatigue ?? 16);
    const objective = String(state.userTeam?.objective || "").toLowerCase();
    const ambitious = objective.includes("titulo") || objective.includes("playoff") || objective.includes("topo");
    const badRecord = losses > wins || (games >= 4 && wins <= 1);
    const goodRecord = games >= 3 && wins >= losses + 2;
    const fragileMood = morale <= 45 || fatigue >= 68;
    if (badRecord || fragileMood || (ambitious && games >= 3 && losses >= wins)) return "high";
    if (goodRecord && morale >= 50) return "low";
    return "normal";
  }

  function isPressureDecision(decision) {
    const text = collectDecisionSearchText(decision);
    return /\b(arquibancada|cobrar|cobranca|cobran[cç]a|crise|diretoria|impaciente|pressao|press[aã]o|responsavel|reuniao|reuni[aã]o|ultimato|demissao|demiss[aã]o|torcida impaciente|ruido|ru[ií]do|turbulencia|turbul[êe]ncia)\b/i.test(text);
  }

  function isContextuallyValidDecision(state, decision) {
    const pressure = getContextPressureLevel(state);
    if (pressure === "low" && isPressureDecision(decision)) return false;
    return true;
  }

  function getKnockoutBranchTags(state) {
    const tags = new Set();
    (Array.isArray(state.decisionMemory) ? state.decisionMemory : []).slice(0, 10).forEach((entry) => {
      (entry.branchTags || []).forEach((tag) => tags.add(String(tag)));
    });
    return tags;
  }

  function buildCandidatePool(state, decisions, event = null) {
    const sportId = state.sportId || state.userTeam?.sportId || "basquete";
    const compatible = decisions.filter((decision) => isDecisionCompatibleWithSport(decision, sportId));
    if (!compatible.length) return [];

    const used = new Set(state.usedDecisionIds || []);
    const teamPool = getDecisionPoolForTeam(state.userTeam, compatible);
    const freshTeam = teamPool.filter((decision) => !used.has(decision.decisionId));
    const freshGlobal = compatible.filter((decision) => !used.has(decision.decisionId));
    const pressureLevel = getContextPressureLevel(state);

    let candidates = uniqueByDecisionId(freshTeam);
    if (!candidates.length) candidates = uniqueByDecisionId(freshGlobal);
    if (!candidates.length) candidates = uniqueByDecisionId([...teamPool, ...compatible]);

    const cooledCandidates = candidates.filter((decision) => !isDecisionTypeOnCooldown(state, decision));
    if (cooledCandidates.length >= 6) candidates = cooledCandidates;
    const newTitleCandidates = candidates.filter((decision) => !hasRecentDecisionTitle(state, decision));
    if (newTitleCandidates.length >= 8) candidates = newTitleCandidates;
    const newTypeCandidates = candidates.filter((decision) => !hasRecentDecisionType(state, decision));
    if (newTypeCandidates.length >= 6) candidates = newTypeCandidates;
    const contextualCandidates = candidates.filter((decision) => isContextuallyValidDecision(state, decision));
    if (contextualCandidates.length) candidates = contextualCandidates;
    else if (pressureLevel === "low") {
      const globalContextual = uniqueByDecisionId(freshGlobal.length ? freshGlobal : compatible)
        .filter((decision) => isContextuallyValidDecision(state, decision));
      if (globalContextual.length) candidates = globalContextual;
    }
    return candidates;
  }

  function weightCandidatePoolForTeam(team, candidates, state = null) {
    const loreId = team?.lore?.id;
    const tags = getTeamDecisionTags(team);
    const branchTags = state ? getKnockoutBranchTags(state) : new Set();
    const weighted = [];
    candidates.forEach((decision) => {
      weighted.push(decision);
      if (decision.loreId === loreId) {
        for (let index = 0; index < 9; index += 1) weighted.push(decision);
      }
      if ((decision.tags || []).some((tag) => tags.has(tag))) {
        for (let index = 0; index < 3; index += 1) weighted.push(decision);
      }
      if ((decision.tags || []).some((tag) => branchTags.has(String(tag)))) {
        for (let index = 0; index < 4; index += 1) weighted.push(decision);
      }
    });
    return weighted;
  }

  function repairMojibake(text) {
    const value = String(text || "");
    if (!/[ÃÂ]/.test(value)) return value;
    try {
      return decodeURIComponent(escape(value));
    } catch (_) {
      return value
        .replaceAll("Ã¡", "a")
        .replaceAll("Ã ", "a")
        .replaceAll("Ã£", "a")
        .replaceAll("Ã¢", "a")
        .replaceAll("Ã©", "e")
        .replaceAll("Ãª", "e")
        .replaceAll("Ã­", "i")
        .replaceAll("Ã³", "o")
        .replaceAll("Ã´", "o")
        .replaceAll("Ãµ", "o")
        .replaceAll("Ãº", "u")
        .replaceAll("Ã§", "c");
    }
  }

  function normalizeSearchText(text) {
    return repairMojibake(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function isGenericChoiceLabel(label) {
    const key = normalizeSearchText(label || "").replace(/\s+/g, " ").trim();
    return /^op.{0,4}o\s*\d+$/i.test(key) || /^option\s*\d+$/i.test(key);
  }

  function getFallbackChoiceLabel(effects, index) {
    const postureLabels = ["Proteger o ambiente", "Ajustar o plano", "Assumir o risco"];
    if (postureLabels[index]) return postureLabels[index];
    const options = [
      { key: "tactical", positive: "Ajustar o plano de jogo", negative: "Simplificar a estrategia" },
      { key: "morale", positive: "Blindar o vestiario", negative: "Cobrar resposta imediata" },
      { key: "chemistry", positive: "Fortalecer o grupo", negative: "Mudar a hierarquia" },
      { key: "fatigue", positive: "Aceitar mais carga", negative: "Poupar energia" },
      { key: "development", positive: "Dar minutos aos jovens", negative: "Priorizar experiencia" },
      { key: "reputation", positive: "Assumir discurso publico", negative: "Tirar pressao externa" }
    ];
    const picked = options.find((item) => Number(effects[item.key]) !== 0);
    if (picked) return Number(effects[picked.key]) >= 0 ? picked.positive : picked.negative;
    return ["Escolher postura segura", "Manter equilibrio", "Assumir risco controlado"][index] || "Definir resposta da comissao";
  }

  function collectDecisionSearchText(decision) {
    const optionText = (decision.options || [])
      .map((option) => [
        option.label,
        option.description,
        option.riskProfile
      ].join(" "))
      .join(" ");
    return normalizeSearchText([
      decision.title,
      decision.situation,
      (decision.tags || []).join(" "),
      decision.decisionType,
      optionText
    ].join(" "));
  }

  function isDecisionCompatibleWithSport(decision, sportId) {
    if (!["basquete", "futsal", "volei"].includes(sportId)) return true;
    if (sportId !== "basquete" && BASKETBALL_ONLY_LORE_IDS.has(decision?.loreId)) return false;
    const text = collectDecisionSearchText(decision);
    const basketball = [
      /\barremess(?:o|os|a|ar)\b/, /\bbola de (?:tr[eê]s|3)\b/, /\b(?:tr[eê]s|3) pontos\b/,
      /\bgarraf[aã]o\b/, /\brebotes?\b/, /\bcest(?:a|inha)\b/, /\benterradas?\b/,
      /\bbandejas?\b/, /\barmadores?\b/, /\bpiv[oô]s?\b/, /\bquintetos?\b/, /\bbasquete\b/
    ];
    const futsal = [
      /\bgols?\b/, /\bgoleir[oa]s?\b/, /\bfutsal\b/, /\bfutebol\b/, /\bpenaltis?\b/,
      /\bescanteios?\b/, /\bcart[oõ]es?\b/, /\btiro de meta\b/
    ];
    const volleyball = [
      /\bsaques?\b/, /\brecep[cç][aã]o\b/, /\bliberos?\b/, /\blevantadores?\b/,
      /\brallies?\b/, /\bset points?\b/, /\bsets decisivos?\b/, /\bvoleibol\b/, /\bvolei\b/
    ];
    const blockedBySport = {
      basquete: [...futsal, ...volleyball],
      futsal: [...basketball, ...volleyball],
      volei: [...basketball, ...futsal]
    }[sportId];
    return !blockedBySport.some((pattern) => pattern.test(text));
  }

  function getVolleyballDecisionContext(decision) {
    const type = String(decision.decisionType || "").toLowerCase();
    const tags = (decision.tags || []).join(" ").toLowerCase();
    const text = `${type} ${tags}`;
    if (text.includes("controle_carga")) return "No volei, a escolha afeta salto, ombro e explosao nos sets seguintes.";
    if (text.includes("estrategia")) return "A comissao vai observar saque, recepcao e cobertura ja nos proximos rallies.";
    if (text.includes("base")) return "A rodagem precisa equilibrar desenvolvimento, pressao de saque e estabilidade da linha de passe.";
    if (text.includes("mercado")) return "A leitura passa por encaixe de posicao, passe, bloqueio e custo de elenco.";
    if (text.includes("vestiario") || text.includes("conflito")) return "A resposta mexe na comunicacao entre levantador, atacantes e cobertura.";
    if (text.includes("classico")) return "Semana de rivalidade costuma pesar em viradas, set points e sequencias de saque.";
    if (text.includes("diretoria")) return "A diretoria quer ver uma identidade de quadra mais clara nos proximos jogos.";
    if (text.includes("torcida")) return "A arquibancada reage rapido a erros de recepcao, bloqueios decisivos e viradas de set.";
    return "A decisao entra no clima da semana e pode aparecer na recepcao, no saque e na tomada de decisao em quadra.";
  }

  function adaptVolleyballText(text) {
    return repairMojibake(text)
      .replaceAll("minutos importantes", "rodagem importante")
      .replaceAll("Minutos importantes", "Rodagem importante")
      .replaceAll("minutos", "rodagem")
      .replaceAll("Minutos", "Rodagem")
      .replaceAll("dar minutos", "dar rodagem")
      .replaceAll("Dar minutos", "Dar rodagem")
      .replaceAll("jogos controlados", "sets controlados")
      .replaceAll("Jogos controlados", "Sets controlados")
      .replaceAll("jogo grande", "partida grande")
      .replaceAll("Jogo grande", "Partida grande")
      .replaceAll("bola subir", "saque inicial")
      .replaceAll("Bola subir", "Saque inicial")
      .replaceAll("rodada pesada", "sequencia pesada")
      .replaceAll("Rodada pesada", "Sequencia pesada")
      .replace(/\bjogo\b/g, "partida")
      .replace(/\bJogo\b/g, "Partida")
      .replace(/\bjogos\b/g, "partidas")
      .replace(/\bJogos\b/g, "Partidas")
      .replace(/\bescalar\b/g, "escolher na rotacao")
      .replace(/\bEscalar\b/g, "Escolher na rotacao")
      .replaceAll("risco de erro em partida grande", "risco de erro em set grande")
      .replaceAll("risco de erro em jogo grande", "risco de erro em set grande")
      .replaceAll("escolha tecnica", "escolha de sistema")
      .replaceAll("Escolha tecnica", "Escolha de sistema");
  }

  function addEffect(deltas, key, value) {
    const amount = Number(value) || 0;
    const normalized = String(key || "").toLowerCase();

    if (normalized === "fatigue" || normalized === "playerfatigue") {
      deltas.fatigue += amount;
      deltas.playerFatigue += amount;
    }
    if (normalized === "morale" || normalized === "playermorale") {
      deltas.morale += amount;
      deltas.playerMorale += amount;
    }
    if (normalized === "chemistry") {
      deltas.chemistry += amount;
    }
    if (normalized === "development") {
      deltas.development += amount;
    }
    if (normalized === "tactical") {
      deltas.chemistry += amount * 0.35;
      deltas.morale += amount * 0.2;
    }
    if (normalized.includes("fadiga") || normalized.includes("cansaco")) {
      deltas.fatigue += amount * 0.35;
      deltas.playerFatigue += amount * 0.45;
    }
    if (normalized.includes("risco_lesao") || normalized.includes("lesao")) {
      deltas.fatigue += amount * 0.12;
      deltas.playerFatigue += amount * 0.16;
    }
    if (normalized.includes("moral")) {
      deltas.morale += amount * 0.22;
      deltas.playerMorale += amount * 0.26;
    }
    if (normalized.includes("rel_elenco") || normalized.includes("vestiario") || normalized.includes("clima")) {
      deltas.morale += amount * 0.16;
      deltas.playerMorale += amount * 0.2;
      deltas.chemistry += amount * 0.14;
    }
    if (normalized.includes("coesao")) {
      deltas.chemistry += amount * 0.24;
    }
    if (normalized.includes("rel_comissao") || normalized.includes("comissao")) {
      deltas.chemistry += amount * 0.1;
    }
    if (normalized.includes("desempenho")) {
      deltas.morale += amount * 0.08;
      deltas.chemistry += amount * 0.07;
    }
    if (normalized.includes("desenvolvimento") || normalized.includes("base")) {
      deltas.development += amount * 0.016;
    }
    if (normalized.includes("pressao") || normalized.includes("risco_crise")) {
      deltas.morale -= amount * 0.1;
      deltas.fatigue += amount * 0.06;
    }
    if (normalized.includes("rel_torcida") || normalized.includes("rel_diretoria") || normalized.includes("confianca")) {
      deltas.morale += amount * 0.07;
    }
    if (normalized.includes("financeiro") || normalized.includes("orcamento")) {
      deltas.morale -= amount * 0.04;
    }
  }

  function convertBankEffects(effects = {}) {
    const deltas = {
      chemistry: 0,
      morale: 0,
      fatigue: 0,
      playerMorale: 0,
      playerFatigue: 0,
      development: 0
    };

    Object.entries(effects || {}).forEach(([key, value]) => addEffect(deltas, key, value));

    return {
      chemistry: round(clamp(deltas.chemistry, -6, 6)),
      morale: round(clamp(deltas.morale, -7, 7)),
      fatigue: round(clamp(deltas.fatigue, -9, 9)),
      playerMorale: round(clamp(deltas.playerMorale, -7, 7)),
      playerFatigue: round(clamp(deltas.playerFatigue, -10, 10)),
      development: round(clamp(deltas.development, -0.25, 0.35), 2)
    };
  }

  function formatSigned(value) {
    const number = round(value);
    return `${number > 0 ? "+" : ""}${number}`;
  }

  function formatEffectText(effects = {}) {
    const pieces = [];
    if (effects.morale) pieces.push(`Moral ${formatSigned(effects.morale)}`);
    if (effects.chemistry) pieces.push(`quimica ${formatSigned(effects.chemistry)}`);
    if (effects.fatigue) pieces.push(`fadiga ${formatSigned(effects.fatigue)}`);
    if (effects.development) pieces.push(`desenvolvimento ${formatSigned(effects.development)}`);
    return pieces.length ? pieces.join(", ") : "impacto leve no ambiente";
  }

  function normalizeChoice(option, decision, index, sportId) {
    const effects = convertBankEffects(option.effects || {});
    const label = sportId === "volei" ? adaptVolleyballText(option.label || "") : option.label;
    const description = sportId === "volei" ? adaptVolleyballText(option.description || "") : option.description;
    const cleanLabel = label && !isGenericChoiceLabel(label) ? label : getFallbackChoiceLabel(effects, index);
    return {
      id: option.optionId || `${decision.decisionId}-option-${index + 1}`,
      label: cleanLabel,
      description: description || formatEffectText(effects),
      effectText: formatEffectText(effects),
      effects,
      rawEffects: option.effects || {},
      riskProfile: option.riskProfile || "",
      branchTags: option.branchTags || option.nextTags || []
    };
  }

  function normalizeDecisionForCalendar(decision, event, sportId) {
    const baseText = sportId === "volei" ? adaptVolleyballText(decision.situation || "") : decision.situation;
    const sportContext = sportId === "volei" ? getVolleyballDecisionContext(decision) : "";
    return {
      id: `decision-${event?.id || decision.decisionId}`,
      eventId: event?.id || "",
      sourceDecisionId: decision.decisionId,
      decisionType: decision.decisionType || "narrative",
      loreId: decision.loreId || "",
      tags: decision.tags || [],
      title: sportId === "volei" ? adaptVolleyballText(decision.title || "Decisao de bastidor") : decision.title || "Decisao de bastidor",
      text: [baseText || "Uma situacao interna pede resposta da comissao.", sportContext].filter(Boolean).join(" "),
      choices: (decision.options || []).slice(0, 3).map((option, index) => normalizeChoice(option, decision, index, sportId))
    };
  }

  function pickDecisionForTeam(state, event) {
    const decisions = isKnockoutEvent(event)
      ? getKnockoutDecisionBank().filter((decision) => !event?.stage || decision.tags?.includes(event.stage))
      : getData();
    if (!decisions.length) return null;

    const candidates = buildCandidatePool(state, decisions, event);
    if (!candidates.length) return null;
    const weightedCandidates = weightCandidatePoolForTeam(state.userTeam, candidates, state);
    const memorySalt = (state.decisionMemory || [])
      .slice(0, 6)
      .map((entry) => `${entry.id || ""}:${entry.choiceId || ""}:${entry.day || ""}:${(entry.branchTags || []).join(",")}`)
      .join("|");
    const deckSeed = state.decisionDeckSeed || `${state.seed}:legacy-deck`;
    const cursor = Number(state.decisionDeckCursor) || 0;
    const rng = getRng(`${deckSeed}:decision-bank:${getStateDecisionSalt(state)}:${state.currentDay}:${cursor}:${state.usedDecisionIds?.length || 0}:${memorySalt}`);
    const picked = pickWeighted(weightedCandidates.length ? weightedCandidates : candidates, rng);
    return picked ? normalizeDecisionForCalendar(picked, event, state.sportId) : null;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralDecisionBank: {
      getData,
      isDecisionCompatibleWithSport,
      getDecisionPoolForTeam,
      convertBankEffects,
      normalizeDecisionForCalendar,
      pickDecisionForTeam,
      getKnockoutDecisionBank
    }
  };
})();
