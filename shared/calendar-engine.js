(function () {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function getStateRngSalt(state) {
    return [
      state?.sportId,
      state?.userTeam?.id,
      state?.userTeam?.name,
      state?.userTeam?.objective,
      state?.userTeam?.rosterStyle,
      state?.userTeam?.lore?.id
    ].filter(Boolean).map((item) => String(item)).join(":");
  }

  function getRng(state, suffix) {
    const rngSeed = `${state.seed}:calendar:${getStateRngSalt(state)}:${suffix}`;
    const loadedRng = window.TemporadaTotal?.createSeededRng?.(rngSeed);
    if (loadedRng) return loadedRng;
    let fallbackState = String(rngSeed).split("").reduce((sum, char) => sum + char.charCodeAt(0), 97);
    function next() {
      fallbackState = (fallbackState * 1664525 + 1013904223) >>> 0;
      return fallbackState / 4294967296;
    }
    return {
      next,
      int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
      pick: (rows) => rows[Math.floor(next() * rows.length)]
    };
  }

  function getOpponents(state) {
    return (state.league?.teams || []).filter((team) => team.id !== state.userTeam?.id);
  }

  function getTeamById(state, teamId) {
    return (state.league?.teams || []).find((team) => team.id === teamId) || null;
  }

  function getTeamRating(team) {
    return Number(team?.rating?.overall || team?.rating?.current) || 72;
  }

  function getMatchTeamSalt(team) {
    return [
      team?.id,
      team?.name,
      team?.lore?.id,
      team?.objective,
      team?.rosterStyle,
      team?.strengthTier
    ].filter(Boolean).map((item) => String(item)).join(":");
  }

  function shuffleTeams(state, teams, suffix) {
    const rng = getRng(state, suffix);
    const rows = teams.slice();
    for (let index = rows.length - 1; index > 0; index -= 1) {
      const swapIndex = rng.int(0, index);
      [rows[index], rows[swapIndex]] = [rows[swapIndex], rows[index]];
    }
    return rows;
  }

  function buildLeagueRoundMatches(state, day, userOpponentId) {
    const userTeamId = state.userTeam?.id;
    const teams = state.league?.teams || [];
    const otherTeams = teams.filter((team) => team.id !== userTeamId && team.id !== userOpponentId);
    const shuffled = shuffleTeams(state, otherTeams, `league-round:${day}`);
    const aiMatches = [];
    for (let index = 0; index < shuffled.length - 1; index += 2) {
      const home = shuffled[index];
      const away = shuffled[index + 1];
      if (home && away) aiMatches.push({ homeId: home.id, awayId: away.id });
    }
    return {
      roundId: `round-${day}`,
      userMatch: { homeId: userTeamId, awayId: userOpponentId },
      aiMatches
    };
  }

  function getGroupTeams(state, groupId) {
    return (state.league?.teams || []).filter((team) => team.groupId === groupId);
  }

  function createSingleRoundRobinRounds(teams) {
    const list = teams.slice();
    if (list.length % 2 === 1) list.push(null);
    const rounds = [];
    const totalRounds = list.length - 1;
    for (let round = 0; round < totalRounds; round += 1) {
      const matches = [];
      for (let index = 0; index < list.length / 2; index += 1) {
        const home = list[index];
        const away = list[list.length - 1 - index];
        if (home && away) matches.push({ homeId: home.id, awayId: away.id });
      }
      rounds.push(matches);
      list.splice(1, 0, list.pop());
    }
    return rounds;
  }

  function createTournamentGroupRounds(state) {
    const groups = state.league?.groups || [];
    const roundsByGroup = groups.map((group) => createSingleRoundRobinRounds(getGroupTeams(state, group.id)));
    const totalRounds = Math.max(...roundsByGroup.map((rounds) => rounds.length), 0);
    const rounds = [];
    for (let leg = 0; leg < 2; leg += 1) {
      for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
        const matches = [];
        roundsByGroup.forEach((groupRounds, groupIndex) => {
          const group = groups[groupIndex];
          (groupRounds[roundIndex] || []).forEach((match) => {
            matches.push(leg === 0
              ? { ...match, groupId: group.id, groupName: group.name }
              : { homeId: match.awayId, awayId: match.homeId, groupId: group.id, groupName: group.name });
          });
        });
        rounds.push({
          roundId: `group-round-${leg + 1}-${roundIndex + 1}`,
          stage: "group",
          groupRound: roundIndex + 1,
          leg: leg + 1,
          matches
        });
      }
    }
    return rounds;
  }

  function getStageMatchCount(stage) {
    return { round_of_16: 8, quarterfinal: 4, semifinal: 2, final: 1 }[stage] || 0;
  }

  function getKnockoutStageLabel(stage) {
    return {
      round_of_16: "Oitavas de final",
      quarterfinal: "Quartas de final",
      semifinal: "Semifinal",
      final: "Final"
    }[stage] || "Mata-mata";
  }

  function getTournamentConfig(state) {
    const userTeamId = state.userTeam?.id;
    const rounds = createTournamentGroupRounds(state);
    const events = [];
    let day = 6;
    function addPreparationEvents(prefix, matchDay, extra = {}) {
      const trainingDay = Math.max(1, matchDay - 3);
      const narrativeDay = Math.max(1, matchDay - 2);
      const restDay = Math.max(1, matchDay - 1);
      events.push(createEvent(`${prefix}-training`, trainingDay, "training", "Treino de preparacao", "Sessao curta para ajustar o plano da rodada.", extra));
      if (matchDay > 6) {
        events.push(createEvent(`${prefix}-narrative`, narrativeDay, "narrative", extra.knockout ? "Arvore do mata-mata" : "Bastidor da semana", "Uma situacao interna pede leitura antes da rodada.", extra));
      }
      events.push(createEvent(`${prefix}-rest`, restDay, "rest", "Recuperacao pre-jogo", "Controle de carga antes da proxima partida.", extra));
    }
    rounds.forEach((round, index) => {
      addPreparationEvents(`group-${index + 1}`, day, { stage: "group" });
      const userMatch = round.matches.find((match) => match.homeId === userTeamId || match.awayId === userTeamId);
      const opponentId = userMatch ? (userMatch.homeId === userTeamId ? userMatch.awayId : userMatch.homeId) : "";
      const opponent = getTeamById(state, opponentId);
      const title = userMatch
        ? `Grupo ${round.leg === 1 ? "ida" : "volta"} ${round.groupRound}: ${opponent?.name || "adversario"}`
        : `Rodada ${index + 1} dos grupos`;
      events.push(createEvent(`group-${index + 1}`, day, userMatch ? "match" : "league-round", title, "Rodada da fase de grupos.", {
        opponentId,
        stage: "group",
        groupRound: round.groupRound,
        leg: round.leg,
        leagueRound: {
          roundId: round.roundId,
          userMatch,
          aiMatches: round.matches.filter((match) => match !== userMatch)
        }
      }));
      day += 4;
    });
    [
      ["round_of_16", "Oitavas de final"],
      ["quarterfinal", "Quartas de final"],
      ["semifinal", "Semifinal"],
      ["final", "Final"]
    ].forEach(([stage, label]) => {
      addPreparationEvents(`knockout-${stage}`, day, { stage, knockout: true });
      events.push(createEvent(`knockout-${stage}`, day, "match", label, "Jogo unico de mata-mata.", {
        stage,
        knockout: true,
        opponentId: "",
        leagueRound: { roundId: `knockout-${stage}`, stage, aiMatches: [] }
      }));
      day += 5;
    });
    events.sort((a, b) => a.day - b.day || String(a.id).localeCompare(String(b.id)));
    return { events, maxDay: day + 2 };
  }

  function createEvent(id, day, type, title, description, extra = {}) {
    return {
      id,
      day,
      week: Math.ceil(day / 7),
      type,
      title,
      description,
      processed: false,
      ...extra
    };
  }

  function createSeasonCalendar(state) {
    if (state.league?.format?.type === "groups-knockout") {
      const tournament = getTournamentConfig(state);
      state.maxDays = Math.max(state.maxDays || 0, tournament.maxDay);
      return { events: tournament.events };
    }
    const events = [];
    const opponents = getOpponents(state);
    let matchIndex = 0;

    for (let day = 1; day <= state.maxDays; day += 1) {
      const dayOfWeek = ((day - 1) % 7) + 1;
      if (dayOfWeek === 1 || dayOfWeek === 3) {
        events.push(createEvent(`training-${day}`, day, "training", "Treino coletivo", "Sessao para evoluir entrosamento e desenvolvimento."));
      }
      if (dayOfWeek === 2 && day <= 7) {
        events.push(createEvent(`market-${day}`, day, "market", "Monitoramento de mercado", "A diretoria recebe oportunidades e rumores de agentes livres."));
      }
      if (dayOfWeek === 4) {
        events.push(createEvent(`narrative-${day}`, day, "narrative", "Evento de bastidor", "Uma situacao interna pede leitura do tecnico."));
      }
      if (dayOfWeek === 5) {
        events.push(createEvent(`rest-${day}`, day, "rest", "Recuperacao", "Dia de controle de carga e tratamento fisico."));
      }
      if (dayOfWeek === 6 && opponents.length) {
        const opponent = opponents[matchIndex % opponents.length];
        const isVolley = state.sportId === "volei";
        events.push(createEvent(`match-${day}`, day, "match", `${isVolley ? "Partida" : "Jogo"} contra ${opponent.name}`, "Partida oficial da temporada procedural.", {
          opponentId: opponent.id,
          leagueRound: buildLeagueRoundMatches(state, day, opponent.id)
        }));
        matchIndex += 1;
      }
      if (dayOfWeek === 7) {
        events.push(createEvent(`rest-${day}`, day, "rest", "Folga monitorada", "Recuperacao fisica e mental antes da nova semana."));
      }
    }

    return { events };
  }

  function getEventsForDay(state, day = state.currentDay) {
    return (state.calendar?.events || []).filter((event) => event.day === day);
  }

  function getUpcomingEvents(state, limit = 8) {
    return (state.calendar?.events || [])
      .filter((event) => !event.processed && event.day >= state.currentDay)
      .slice(0, limit);
  }

  function processTraining(state, event) {
    const rng = getRng(state, event.id);
    const developmentBoost = rng.next() < 0.45 ? 0.1 : 0;
    window.TemporadaTotal.GameState.applyTeamDeltas(state, {
      chemistry: 1.4,
      morale: 0.3,
      fatigue: 3.2,
      playerFatigue: 3.2
    });
    state.roster.forEach((player) => {
      if (developmentBoost && player.potential > player.currentAbility && rng.next() < 0.25) {
        player.currentAbility = round(Math.min(player.potential, player.currentAbility + developmentBoost));
      }
    });
    window.TemporadaTotal.GameState.addLog(state, "training", "Treino processado", "Entrosamento subiu, mas o elenco acumulou fadiga.");
  }

  function processRest(state) {
    window.TemporadaTotal.GameState.applyTeamDeltas(state, {
      morale: 0.5,
      fatigue: -5.5,
      playerFatigue: -6.5
    });
    window.TemporadaTotal.GameState.addLog(state, "rest", "Recuperacao concluida", "O elenco reduziu fadiga e recuperou parte da energia.");
  }

  function simulateAiBasketballMatch(state, match, suffix) {
    const home = getTeamById(state, match.homeId);
    const away = getTeamById(state, match.awayId);
    if (!home || !away) return null;
    const rng = getRng(state, `${suffix}:${getMatchTeamSalt(home)}:${getMatchTeamSalt(away)}`);
    const homeRating = getTeamRating(home) + 1.2;
    const awayRating = getTeamRating(away);
    const probability = clamp(0.5 + (homeRating - awayRating) / 24, 0.18, 0.82);
    const homeWins = rng.next() < probability;
    const baseScore = 78 + rng.int(0, 26);
    const margin = Math.max(1, Math.round(Math.abs(homeRating - awayRating) * 0.75 + rng.int(2, 12)));
    const homeScore = homeWins ? baseScore + margin : baseScore;
    const awayScore = homeWins ? baseScore : baseScore + margin;
    return {
      homeId: home.id,
      awayId: away.id,
      homeScore,
      awayScore,
      winnerId: homeWins ? home.id : away.id
    };
  }

  function simulateAiVolleyballMatch(state, match, suffix) {
    const home = getTeamById(state, match.homeId);
    const away = getTeamById(state, match.awayId);
    if (!home || !away) return null;
    const rng = getRng(state, `${suffix}:${getMatchTeamSalt(home)}:${getMatchTeamSalt(away)}`);
    const homeRating = getTeamRating(home) + 1;
    const awayRating = getTeamRating(away);
    const probability = clamp(0.5 + (homeRating - awayRating) / 22, 0.2, 0.8);
    const homeWins = rng.next() < probability;
    const loserSets = rng.next() < 0.2 ? 0 : rng.next() < 0.63 ? 1 : 2;
    return {
      homeId: home.id,
      awayId: away.id,
      homeScore: homeWins ? 3 : loserSets,
      awayScore: homeWins ? loserSets : 3,
      winnerId: homeWins ? home.id : away.id
    };
  }

  function simulateAiFutsalMatch(state, match, suffix) {
    const home = getTeamById(state, match.homeId);
    const away = getTeamById(state, match.awayId);
    if (!home || !away) return null;
    const rng = getRng(state, `${suffix}:${getMatchTeamSalt(home)}:${getMatchTeamSalt(away)}`);
    const homeRating = getTeamRating(home) + 0.8;
    const awayRating = getTeamRating(away);
    const edge = clamp((homeRating - awayRating) / 18, -0.35, 0.35);
    const homeGoals = Math.max(0, Math.round(2.1 + edge + rng.float(-1.4, 2.2)));
    const awayGoals = Math.max(0, Math.round(2.0 - edge + rng.float(-1.4, 2.2)));
    return {
      homeId: home.id,
      awayId: away.id,
      homeScore: homeGoals,
      awayScore: awayGoals,
      winnerId: homeGoals === awayGoals ? null : homeGoals > awayGoals ? home.id : away.id
    };
  }

  function processLeagueRound(state, event) {
    if (!event) return [];
    state.processedLeagueRoundIds = Array.isArray(state.processedLeagueRoundIds) ? state.processedLeagueRoundIds : [];
    const round = event.leagueRound || buildLeagueRoundMatches(state, event.day, event.opponentId);
    const roundId = round.roundId || `round-${event.day}`;
    if (state.processedLeagueRoundIds.includes(roundId)) return [];
    const results = (round.aiMatches || [])
      .map((match, index) => state.sportId === "volei"
        ? simulateAiVolleyballMatch(state, match, `${roundId}:ai:${index}`)
        : state.sportId === "futsal"
          ? simulateAiFutsalMatch(state, match, `${roundId}:ai:${index}`)
          : simulateAiBasketballMatch(state, match, `${roundId}:ai:${index}`))
      .filter(Boolean);
    results.forEach((result) => window.TemporadaTotal.GameState.updateMatchResult(state, result));
    state.processedLeagueRoundIds.push(roundId);
    if (results.length) {
      const highlight = results
        .slice()
        .sort((a, b) => Math.abs((b.homeScore || 0) - (b.awayScore || 0)) - Math.abs((a.homeScore || 0) - (a.awayScore || 0)))[0];
      const home = getTeamById(state, highlight.homeId);
      const away = getTeamById(state, highlight.awayId);
      window.TemporadaTotal.GameState.addLog(
        state,
        "match",
        "Rodada da liga",
        `${results.length} jogos paralelos simulados. Destaque: ${home?.name || "Casa"} ${highlight.homeScore} x ${highlight.awayScore} ${away?.name || "Fora"}.`
      );
    }
    return results;
  }

  function getGroupStandings(state, groupId) {
    return (state.standings || [])
      .filter((row) => row.groupId === groupId)
      .sort((a, b) => (b.points || b.wins * 3) - (a.points || a.wins * 3) || b.wins - a.wins || b.pointDiff - a.pointDiff || b.pointsFor - a.pointsFor || b.rating - a.rating);
  }

  function ensureKnockoutState(state) {
    state.knockout = state.knockout || { rounds: {}, eliminatedTeamIds: [], championId: "" };
    state.knockout.rounds = state.knockout.rounds || {};
    state.knockout.eliminatedTeamIds = state.knockout.eliminatedTeamIds || [];
    return state.knockout;
  }

  function createRoundOf16Matches(state) {
    const groups = state.league?.groups || [];
    const first = groups.map((group) => getGroupStandings(state, group.id)[0]).filter(Boolean);
    const second = groups.map((group) => getGroupStandings(state, group.id)[1]).filter(Boolean);
    const pairings = [
      [first[0], second[1]], [first[1], second[0]],
      [first[2], second[3]], [first[3], second[2]],
      [first[4], second[5]], [first[5], second[4]],
      [first[6], second[7]], [first[7], second[6]]
    ];
    return pairings.filter(([home, away]) => home && away).map(([home, away], index) => ({
      id: `r16-${index + 1}`,
      homeId: home.teamId,
      awayId: away.teamId,
      stage: "round_of_16"
    }));
  }

  function createNextKnockoutMatches(previousMatches, stage) {
    const winners = (previousMatches || []).map((match) => match.winnerId).filter(Boolean);
    const matches = [];
    for (let index = 0; index < winners.length; index += 2) {
      if (winners[index] && winners[index + 1]) {
        matches.push({ id: `${stage}-${matches.length + 1}`, homeId: winners[index], awayId: winners[index + 1], stage });
      }
    }
    return matches;
  }

  function getKnockoutMatchesForStage(state, stage) {
    const knockout = ensureKnockoutState(state);
    if (knockout.rounds[stage]?.matches?.length) return knockout.rounds[stage].matches;
    const matches = stage === "round_of_16"
      ? createRoundOf16Matches(state)
      : stage === "quarterfinal"
        ? createNextKnockoutMatches(knockout.rounds.round_of_16?.matches, stage)
        : stage === "semifinal"
          ? createNextKnockoutMatches(knockout.rounds.quarterfinal?.matches, stage)
          : createNextKnockoutMatches(knockout.rounds.semifinal?.matches, stage);
    knockout.rounds[stage] = { stage, matches };
    return matches;
  }

  function simulateAiMatchBySport(state, match, suffix) {
    if (state.sportId === "volei") return simulateAiVolleyballMatch(state, match, suffix);
    if (state.sportId === "futsal") return simulateAiFutsalMatch(state, match, suffix);
    return simulateAiBasketballMatch(state, match, suffix);
  }

  function simulateFutsalPenaltyShootout(state, user, opponent, seedSuffix = "penalties") {
    const rng = getRng(state, `${seedSuffix}:${getMatchTeamSalt(user)}:${getMatchTeamSalt(opponent)}`);
    const rows = [];
    let home = 0;
    let away = 0;
    let kicks = 0;
    const chance = (team) => clamp(0.68 + ((Number(team?.rating?.overall) || 72) - 72) * 0.003, 0.58, 0.82);
    while (kicks < 5 || home === away) {
      kicks += 1;
      const homeGoal = rng.next() < chance(user);
      const awayGoal = rng.next() < chance(opponent);
      if (homeGoal) home += 1;
      if (awayGoal) away += 1;
      rows.push({ kick: kicks, homeGoal, awayGoal });
      const remaining = Math.max(0, 5 - kicks);
      if (kicks >= 5 && home !== away) break;
      if (kicks < 5 && Math.abs(home - away) > remaining) break;
      if (kicks > 10 && home !== away) break;
    }
    return {
      home,
      away,
      winnerId: home > away ? user.id : opponent.id,
      rows
    };
  }

  function resolveKnockoutEvent(state, event) {
    if (!event?.knockout) return null;
    const stage = event.stage;
    const matches = getKnockoutMatchesForStage(state, stage);
    const userTeamId = state.userTeam?.id;
    const knockout = ensureKnockoutState(state);
    if (knockout.eliminatedTeamIds.includes(userTeamId)) {
      event.processed = true;
      event.title = `${getKnockoutStageLabel(stage)} sem seu clube`;
      event.description = "Seu clube ja foi eliminado desta edicao.";
      return null;
    }
    const userMatch = matches.find((match) => match.homeId === userTeamId || match.awayId === userTeamId);
    if (!userMatch) {
      if (!knockout.eliminatedTeamIds.includes(userTeamId)) knockout.eliminatedTeamIds.push(userTeamId);
      if (!knockout.userEliminatedStage) knockout.userEliminatedStage = stage === "round_of_16" ? "Fase de grupos" : getKnockoutStageLabel(stage);
      event.processed = true;
      window.TemporadaTotal.GameState.addLog(state, "match", `${getKnockoutStageLabel(stage)} sem seu clube`, "Seu clube nao esta nesta fase do mata-mata.");
      return null;
    }
    const opponentId = userMatch.homeId === userTeamId ? userMatch.awayId : userMatch.homeId;
    const opponent = getTeamById(state, opponentId);
    event.opponentId = opponentId;
    event.title = `${getKnockoutStageLabel(stage)} contra ${opponent?.name || "adversario"}`;
    event.leagueRound = {
      roundId: `knockout-${stage}`,
      stage,
      userMatch,
      aiMatches: matches.filter((match) => match !== userMatch && !match.winnerId)
    };
    return opponent;
  }

  function finalizeKnockoutRound(state, event, userResult = null) {
    if (!event?.knockout) return;
    const stage = event.stage;
    const matches = getKnockoutMatchesForStage(state, stage);
    const knockout = ensureKnockoutState(state);
    const roundId = event.leagueRound?.roundId || `knockout-${stage}`;
    if (state.processedLeagueRoundIds?.includes(roundId)) return;
    (event.leagueRound?.aiMatches || []).forEach((match, index) => {
      const result = simulateAiMatchBySport(state, match, `${roundId}:ai:${index}`);
      if (!result) return;
      match.homeScore = result.homeScore;
      match.awayScore = result.awayScore;
      if (!result.winnerId && state.sportId === "futsal") {
        const home = getTeamById(state, match.homeId);
        const away = getTeamById(state, match.awayId);
        const penalties = simulateFutsalPenaltyShootout(state, home, away, `${roundId}:ai:${index}`);
        match.penalties = penalties;
        match.decidedBy = "penalties";
        match.winnerId = penalties.winnerId;
      } else {
        match.winnerId = result.winnerId || (result.homeScore >= result.awayScore ? result.homeId : result.awayId);
      }
    });
    if (userResult) {
      const userMatch = matches.find((match) => (
        (match.homeId === userResult.homeId && match.awayId === userResult.awayId)
        || (match.homeId === userResult.awayId && match.awayId === userResult.homeId)
      ));
      if (userMatch) {
        const sameOrder = userMatch.homeId === userResult.homeId;
        userMatch.homeScore = sameOrder ? userResult.homeScore : userResult.awayScore;
        userMatch.awayScore = sameOrder ? userResult.awayScore : userResult.homeScore;
        userMatch.winnerId = userResult.winnerId;
        if (userResult.penalties) {
          userMatch.penalties = sameOrder ? userResult.penalties : {
            ...userResult.penalties,
            home: userResult.penalties.away,
            away: userResult.penalties.home
          };
        }
        if (userResult.decidedBy) userMatch.decidedBy = userResult.decidedBy;
      }
    }
    matches.forEach((match) => {
      const loserId = match.winnerId === match.homeId ? match.awayId : match.winnerId === match.awayId ? match.homeId : "";
      if (loserId && !knockout.eliminatedTeamIds.includes(loserId)) knockout.eliminatedTeamIds.push(loserId);
      if (loserId && loserId === state.userTeam?.id) {
        knockout.userEliminatedStage = getKnockoutStageLabel(stage);
        knockout.userEliminationMatch = {
          stage,
          homeId: match.homeId,
          awayId: match.awayId,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          winnerId: match.winnerId
        };
      }
    });
    if (stage === "final") {
      knockout.championId = matches[0]?.winnerId || "";
    }
    state.processedLeagueRoundIds = Array.isArray(state.processedLeagueRoundIds) ? state.processedLeagueRoundIds : [];
    state.processedLeagueRoundIds.push(roundId);
  }

  function getResolvedMatchOpponent(state, event) {
    if (event?.knockout) {
      const knockoutOpponent = resolveKnockoutEvent(state, event);
      return event.processed ? null : knockoutOpponent;
    }
    return (state.league?.teams || []).find((team) => team.id === event.opponentId) || getOpponents(state)[0] || null;
  }

  function simulateSimpleMatch(state, event) {
    if (state.sportId === "volei") return simulateSimpleVolleyballMatch(state, event);
    if (state.sportId === "futsal") return simulateSimpleFutsalMatch(state, event);
    const resolvedOpponent = getResolvedMatchOpponent(state, event);
    if (!resolvedOpponent) return;
    const user = state.userTeam;
    const rng = getRng(state, `${event.id}:${getMatchTeamSalt(user)}:${getMatchTeamSalt(resolvedOpponent)}`);
    const performanceBoost = window.TemporadaTotal.GameState.getMatchPerformanceBoost?.(state) || 0;
    const userRating = (Number(user?.rating?.overall) || 72)
      + performanceBoost
      + (Number(state.teamState.chemistry) - 50) * 0.04
      - Math.max(0, Number(state.summary?.fatigueAverage || 0) - 40) * 0.05;
    const opponentRating = Number(resolvedOpponent?.rating?.overall) || 72;
    const probability = clamp(0.5 + (userRating - opponentRating) / 22, 0.18, 0.82);
    const userWins = rng.next() < probability;
    const baseScore = 78 + rng.int(0, 24);
    const margin = Math.max(1, Math.round(Math.abs(userRating - opponentRating) * 0.9 + rng.int(2, 13)));
    const userScore = userWins ? baseScore + margin : baseScore;
    const opponentScore = userWins ? baseScore : baseScore + margin;
    const homeId = user.id;
    const awayId = resolvedOpponent.id;
    const result = {
      homeId,
      awayId,
      homeScore: userScore,
      awayScore: opponentScore,
      winnerId: userWins ? user.id : resolvedOpponent.id
    };

    if (event?.knockout) finalizeKnockoutRound(state, event, result);
    else {
      window.TemporadaTotal.GameState.updateMatchResult(state, result);
      processLeagueRound(state, event);
    }
    window.TemporadaTotal.GameState.recordQuickVolleyballMatchStats?.(state, result, rng);
    window.TemporadaTotal.GameState.applyTeamDeltas(state, {
      morale: userWins ? 3 : -2.5,
      fatigue: 6,
      playerFatigue: 7
    });
    window.TemporadaTotal.GameState.addLog(
      state,
      "match",
      userWins ? "Vitoria na rodada" : "Derrota na rodada",
      `${user.name} ${userScore} x ${opponentScore} ${resolvedOpponent.name}.${performanceBoost ? ` Bônus de preparação: ${performanceBoost > 0 ? "+" : ""}${performanceBoost}.` : ""}`
    );
    window.TemporadaTotal.GameState.consumeMatchPerformanceBoost?.(state);
    window.TemporadaTotal.DecisionNetworkEngine?.onMatchCompleted?.(state, result);
  }

  function simulateSimpleVolleyballMatch(state, event) {
    const resolvedOpponent = getResolvedMatchOpponent(state, event);
    if (!resolvedOpponent) return;
    const user = state.userTeam;
    const rng = getRng(state, `${event.id}:${getMatchTeamSalt(user)}:${getMatchTeamSalt(resolvedOpponent)}`);
    const performanceBoost = window.TemporadaTotal.GameState.getMatchPerformanceBoost?.(state) || 0;
    const userRating = (Number(user?.rating?.overall) || 72)
      + performanceBoost
      + (Number(state.teamState.chemistry) - 50) * 0.035
      - Math.max(0, Number(state.summary?.fatigueAverage || 0) - 40) * 0.045;
    const opponentRating = Number(resolvedOpponent?.rating?.overall) || 72;
    const probability = clamp(0.5 + (userRating - opponentRating) / 20, 0.2, 0.8);
    const userWins = rng.next() < probability;
    const loserSets = rng.next() < 0.18 ? 0 : rng.next() < 0.62 ? 1 : 2;
    const userSets = userWins ? 3 : loserSets;
    const opponentSets = userWins ? loserSets : 3;
    const result = {
      homeId: user.id,
      awayId: resolvedOpponent.id,
      homeScore: userSets,
      awayScore: opponentSets,
      winnerId: userWins ? user.id : resolvedOpponent.id
    };

    if (event?.knockout) finalizeKnockoutRound(state, event, result);
    else {
      window.TemporadaTotal.GameState.updateMatchResult(state, result);
      processLeagueRound(state, event);
    }
    window.TemporadaTotal.GameState.applyTeamDeltas(state, {
      morale: userWins ? 3 : -2.5,
      fatigue: 5.5,
      playerFatigue: 6.5
    });
    window.TemporadaTotal.GameState.addLog(
      state,
      "match",
      userWins ? "Vitoria em sets" : "Derrota em sets",
      `${user.name} ${userSets} x ${opponentSets} ${resolvedOpponent.name}.${performanceBoost ? ` Bônus de preparação: ${performanceBoost > 0 ? "+" : ""}${performanceBoost}.` : ""}`
    );
    window.TemporadaTotal.GameState.consumeMatchPerformanceBoost?.(state);
    window.TemporadaTotal.DecisionNetworkEngine?.onMatchCompleted?.(state, result);
  }

  function simulateSimpleFutsalMatch(state, event) {
    const resolvedOpponent = getResolvedMatchOpponent(state, event);
    if (!resolvedOpponent) return;
    const user = state.userTeam;
    const rng = getRng(state, `${event.id}:${getMatchTeamSalt(user)}:${getMatchTeamSalt(resolvedOpponent)}`);
    const performanceBoost = window.TemporadaTotal.GameState.getMatchPerformanceBoost?.(state) || 0;
    const userRating = (Number(user?.rating?.overall) || 72)
      + performanceBoost
      + (Number(state.teamState.chemistry) - 50) * 0.035
      - Math.max(0, Number(state.summary?.fatigueAverage || 0) - 40) * 0.04;
    const opponentRating = Number(resolvedOpponent?.rating?.overall) || 72;
    const edge = clamp((userRating - opponentRating) / 18, -0.42, 0.42);
    const userScore = Math.max(0, Math.round(2.2 + edge + rng.float(-1.5, 2.3)));
    const opponentScore = Math.max(0, Math.round(2.0 - edge + rng.float(-1.5, 2.3)));
    const userWins = userScore > opponentScore;
    const draw = !event?.knockout && userScore === opponentScore;
    const penalties = event?.knockout && userScore === opponentScore
      ? simulateFutsalPenaltyShootout(state, user, resolvedOpponent, `${event.id}:simple`)
      : null;
    const knockoutUserWins = penalties ? penalties.winnerId === user.id : userWins;
    const result = {
      homeId: user.id,
      awayId: resolvedOpponent.id,
      homeScore: userScore,
      awayScore: opponentScore,
      winnerId: draw ? null : (userWins || knockoutUserWins) ? user.id : resolvedOpponent.id,
      ...(penalties ? { decidedBy: "penalties", penalties } : {})
    };

    if (event?.knockout) finalizeKnockoutRound(state, event, result);
    else {
      window.TemporadaTotal.GameState.updateMatchResult(state, result);
      processLeagueRound(state, event);
    }
    window.TemporadaTotal.GameState.applyTeamDeltas(state, {
      morale: userWins ? 3 : draw ? 0.5 : -2.5,
      fatigue: 6,
      playerFatigue: 7
    });
    window.TemporadaTotal.GameState.addLog(
      state,
      "match",
      penalties ? (penalties.winnerId === user.id ? "Vitoria nos penaltis" : "Derrota nos penaltis") : userWins ? "Vitoria na rodada" : draw ? "Empate na rodada" : "Derrota na rodada",
      `${user.name} ${userScore} x ${opponentScore} ${resolvedOpponent.name}.${performanceBoost ? ` Bônus de preparação: ${performanceBoost > 0 ? "+" : ""}${performanceBoost}.` : ""}${penalties ? ` Penaltis: ${penalties.home}-${penalties.away}.` : ""}`
    );
    window.TemporadaTotal.GameState.consumeMatchPerformanceBoost?.(state);
    window.TemporadaTotal.DecisionNetworkEngine?.onMatchCompleted?.(state, result);
  }

  function getVolleyballDecisionImpact(decision, choice) {
    const text = `${decision?.decisionType || ""} ${decision?.title || ""} ${decision?.text || ""} ${choice?.label || ""} ${choice?.description || ""}`.toLowerCase();
    const effects = choice?.effects || {};
    const morale = Number(effects.morale || 0) + Number(effects.playerMorale || 0) * 0.4;
    const chemistry = Number(effects.chemistry || 0);
    const fatigue = Number(effects.fatigue || 0) + Number(effects.playerFatigue || 0) * 0.25;
    const impact = {
      serve: chemistry * 0.25 + morale * 0.08,
      reception: chemistry * 0.28 + morale * 0.1,
      attack: morale * 0.18 + chemistry * 0.14,
      block: chemistry * 0.16,
      defense: chemistry * 0.18 + morale * 0.08,
      load: fatigue * 0.22
    };

    if (text.includes("saque")) impact.serve += 1.2;
    if (text.includes("recepcao") || text.includes("recepção") || text.includes("passe")) impact.reception += 1.2;
    if (text.includes("ataque") || text.includes("atacante") || text.includes("oposto")) impact.attack += 1;
    if (text.includes("bloqueio") || text.includes("central")) impact.block += 1;
    if (text.includes("defesa") || text.includes("cobertura") || text.includes("libero") || text.includes("líbero")) impact.defense += 1;
    if (text.includes("carga") || text.includes("poupar") || text.includes("recuperar")) impact.load -= 1;
    if (text.includes("forca maxima") || text.includes("força máxima") || text.includes("treino forte")) impact.load += 1.2;

    Object.keys(impact).forEach((key) => {
      impact[key] = Math.round(Math.max(-3, Math.min(3, impact[key])) * 10) / 10;
    });
    return impact;
  }

  function formatVolleyballImpactRead(impact = {}) {
    const labels = {
      serve: "saque",
      reception: "passe",
      attack: "ataque",
      block: "bloqueio",
      defense: "defesa",
      load: "carga"
    };
    const rows = Object.entries(labels)
      .map(([key, label]) => ({ key, label, value: Number(impact[key]) || 0 }))
      .filter((row) => Math.abs(row.value) >= 0.2)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 3);
    if (!rows.length) return "Impacto leve nos fundamentos da semana.";
    return rows.map((row) => `${row.label} ${row.value > 0 ? "+" : ""}${round(row.value, 1)}`).join(", ");
  }

  function applyExternalMatchResult(state, event, liveState) {
    if (event?.knockout) resolveKnockoutEvent(state, event);
    const opponent = (state.league?.teams || []).find((team) => team.id === event?.opponentId) || getOpponents(state)[0];
    const user = state.userTeam;
    const isVolley = state.sportId === "volei" || liveState?.sets;
    const userScore = isVolley ? Number(liveState?.sets?.home) || 0 : Number(liveState?.score?.home) || 0;
    const opponentScore = isVolley ? Number(liveState?.sets?.away) || 0 : Number(liveState?.score?.away) || 0;
    const result = {
      homeId: user.id,
      awayId: opponent.id,
      homeScore: userScore,
      awayScore: opponentScore,
      winnerId: userScore === opponentScore ? null : userScore > opponentScore ? user.id : opponent.id
    };
    if (event?.knockout && state.sportId === "futsal" && !result.winnerId) {
      const penalties = simulateFutsalPenaltyShootout(state, user, opponent, `${event.id}:live`);
      result.winnerId = penalties.winnerId;
      result.decidedBy = "penalties";
      result.penalties = penalties;
    } else if (event?.knockout && !result.winnerId) {
      const rng = getRng(state, `${event.id}:penalties:${getMatchTeamSalt(user)}:${getMatchTeamSalt(opponent)}`);
      result.winnerId = rng.next() < 0.5 ? user.id : opponent.id;
      result.decidedBy = "penalties";
    }
    if (event?.knockout) finalizeKnockoutRound(state, event, result);
    else {
      window.TemporadaTotal.GameState.updateMatchResult(state, result);
      processLeagueRound(state, event);
    }
    if (isVolley) window.TemporadaTotal.GameState.recordLiveVolleyballMatchStats?.(state, liveState);
    const userWon = result.winnerId ? result.winnerId === user.id : userScore > opponentScore;
    const draw = userScore === opponentScore;
    window.TemporadaTotal.GameState.applyTeamDeltas(state, {
      morale: userWon ? 3.5 : draw ? 0.5 : -2.5,
      fatigue: 6,
      playerFatigue: 7
    });
    window.TemporadaTotal.GameState.addLog(
      state,
      "match",
      result.decidedBy === "penalties" ? (userWon ? "Vitoria nos penaltis" : "Derrota nos penaltis") : userWon ? "Vitoria ao vivo" : draw ? "Empate ao vivo" : "Derrota ao vivo",
      `${user.name} ${userScore} x ${opponentScore} ${opponent.name}.${result.penalties ? ` Penaltis: ${result.penalties.home}-${result.penalties.away}.` : ""} Resultado salvo a partir da simulacao ao vivo.`
    );
    if (isVolley) window.TemporadaTotal.GameState.decayVolleyballImpact?.(state, 1.1);
    window.TemporadaTotal.DecisionNetworkEngine?.onMatchCompleted?.(state, result);
    if (event) {
      event.processed = true;
      if (!state.processedEventIds.includes(event.id)) state.processedEventIds.push(event.id);
    }
    return state;
  }

  function getFallbackNarrativeTemplates() {
    return [
      {
        title: "Lideranca do elenco",
        text: "Um veterano pede uma conversa franca sobre o nivel de cobranca da semana.",
        choices: [
          { id: "trust_vets", label: "Dar voz aos lideres", effectText: "Moral +2, quimica +1", effects: { morale: 2, chemistry: 1, playerMorale: 1 } },
          { id: "push_group", label: "Aumentar exigencia", effectText: "Quimica +2, fadiga +2", effects: { chemistry: 2, fatigue: 1, playerFatigue: 2 } }
        ]
      },
      {
        title: "Cobrança da diretoria",
        text: "A diretoria quer uma resposta competitiva e pergunta qual sera o foco imediato.",
        choices: [
          { id: "short_term", label: "Priorizar resultado agora", effectText: "Moral +1, fadiga +3", effects: { morale: 1, fatigue: 2, playerFatigue: 3 } },
          { id: "protect_plan", label: "Proteger o plano de longo prazo", effectText: "Quimica +1, moral -1", effects: { chemistry: 1, morale: -1, playerMorale: -0.4 } }
        ]
      },
      {
        title: "Jovem ganha moral",
        text: "Um prospecto treinou acima do esperado e a comissao quer decidir como lidar com a oportunidade.",
        choices: [
          { id: "give_minutes", label: "Prometer minutos", effectText: "Moral +1, desenvolvimento +0.2", effects: { morale: 1, chemistry: 0.5, development: 0.2 } },
          { id: "keep_pressure", label: "Manter cobranca interna", effectText: "Quimica +1, moral neutra", effects: { chemistry: 1 } }
        ]
      },
      {
        title: "Ruido externo",
        text: "A imprensa questiona o planejamento e tenta transformar uma fase normal em crise.",
        choices: [
          { id: "face_media", label: "Responder publicamente", effectText: "Moral +1, pressao +1", effects: { morale: 1, fatigue: 1 } },
          { id: "close_doors", label: "Fechar o grupo", effectText: "Quimica +2, moral -1", effects: { chemistry: 2, morale: -1 } }
        ]
      }
    ];
  }

  function processNarrative(state, event) {
    const networkDecision = window.TemporadaTotal?.DecisionNetworkEngine?.getActiveNarrativeDecision?.(state);
    if (networkDecision?.choices?.length) {
      networkDecision.eventId = event.id;
      state.pendingDecision = networkDecision;
      event.awaitingDecision = true;
      window.TemporadaTotal.GameState.addLog(
        state,
        "narrative",
        `Vestiário: ${networkDecision.title}`,
        `${networkDecision.text} Escolha sua postura para avançar.`
      );
      return;
    }

    const bankDecision = window.TemporadaTotal?.ProceduralDecisionBank?.pickDecisionForTeam?.(state, event);
    if (bankDecision?.choices?.length) {
      state.usedDecisionIds = Array.isArray(state.usedDecisionIds) ? state.usedDecisionIds : [];
      if (bankDecision.sourceDecisionId && !state.usedDecisionIds.includes(bankDecision.sourceDecisionId)) {
        state.usedDecisionIds.push(bankDecision.sourceDecisionId);
      }
      state.decisionDeckCursor = (Number(state.decisionDeckCursor) || 0) + 1;
      state.pendingDecision = bankDecision;
      event.awaitingDecision = true;
      window.TemporadaTotal.GameState.addLog(
        state,
        "narrative",
        "Decisao pendente",
        `${bankDecision.title}: escolha uma resposta para avancar.`
      );
      return;
    }

    const rng = getRng(state, event.id);
    const templates = getFallbackNarrativeTemplates();
    const picked = rng.pick(templates);
    state.pendingDecision = {
      id: `decision-${event.id}`,
      eventId: event.id,
      title: picked.title,
      text: picked.text,
      choices: picked.choices
    };
    event.awaitingDecision = true;
    window.TemporadaTotal.GameState.addLog(state, "narrative", "Decisao pendente", `${picked.title}: escolha uma resposta para avancar.`);
  }

  function applyNarrativeDecision(state, choiceId) {
    const decision = state.pendingDecision;
    if (!decision) return state;
    const choice = (decision.choices || []).find((item) => item.id === choiceId) || decision.choices?.[0];
    if (!choice) return state;

    if (decision.arcId && decision.nodeId && window.TemporadaTotal?.DecisionNetworkEngine?.resolveNarrativeChoice) {
      window.TemporadaTotal.DecisionNetworkEngine.resolveNarrativeChoice(state, decision, choice.id);
    } else {
      window.TemporadaTotal.GameState.applyTeamDeltas(state, choice.effects || {});
    }

    let courtImpact = null;
    let courtImpactSummary = "";
    if (state.sportId === "volei") {
      courtImpact = getVolleyballDecisionImpact(decision, choice);
      courtImpactSummary = formatVolleyballImpactRead(courtImpact);
      courtImpact.summary = courtImpactSummary;
      window.TemporadaTotal.GameState.addVolleyballImpact?.(state, courtImpact, `${decision.title}: ${choice.label}`);
    }
    window.TemporadaTotal.GameState.addUniversalDecisionImpact?.(state, decision, choice);
    if (choice.effects?.development) {
      state.roster.forEach((player, index) => {
        if (index < 4 && player.potential > player.currentAbility) {
          player.currentAbility = round(Math.min(player.potential, player.currentAbility + Number(choice.effects.development)));
        }
      });
      state.summary = window.TemporadaTotal.GameState.summarizeTeam(state.roster, state.teamState);
    }
    const event = (state.calendar?.events || []).find((item) => item.id === decision.eventId);
    if (event) {
      event.processed = true;
      event.awaitingDecision = false;
      if (!state.processedEventIds.includes(event.id)) state.processedEventIds.push(event.id);
    }
    state.usedDecisionIds = Array.isArray(state.usedDecisionIds) ? state.usedDecisionIds : [];
    if (decision.sourceDecisionId && !state.usedDecisionIds.includes(decision.sourceDecisionId)) {
      state.usedDecisionIds.push(decision.sourceDecisionId);
    }
    state.decisionMemory = Array.isArray(state.decisionMemory) ? state.decisionMemory : [];
      state.decisionMemory.unshift({
        id: decision.sourceDecisionId || decision.id,
        eventId: decision.eventId || "",
        decisionType: decision.decisionType || "narrative",
        loreId: decision.loreId || "",
        tags: decision.tags || [],
        title: decision.title,
        text: decision.text || "",
        choiceId: choice.id,
      choiceLabel: choice.label,
      branchTags: choice.branchTags || [],
      day: state.currentDay,
      effects: choice.effects || {},
      courtImpact,
      courtImpactSummary
    });
    state.decisionMemory = state.decisionMemory.slice(0, 40);
    const impactRead = state.sportId === "volei"
      ? ` Impacto de quadra: ${courtImpactSummary || "leve nos fundamentos da semana"}.`
      : "";
    window.TemporadaTotal.GameState.addLog(state, "decision", decision.title, `${choice.label}: ${choice.effectText}.${impactRead}`);
    state.pendingDecision = null;
    return state;
  }

  function processMarket(state) {
    if (state.sportId === "futsal") {
      const market = window.TemporadaTotal?.generateProceduralFutsalMarket?.(state.seed, {
        count: 24,
        profile: "balanced"
      });
      const fit = market && window.TemporadaTotal?.analyzeProceduralMarketFitForClub
        ? window.TemporadaTotal.analyzeProceduralMarketFitForClub(state.userTeam, market, { limit: 1 })
        : null;
      const top = fit?.topFits?.[0];
      window.TemporadaTotal.GameState.addLog(
        state,
        "market",
        "Mercado monitorado",
        top ? `${top.name} (${top.pos}) surgiu como encaixe ${top.clubFitScore} para a rotacao.` : "A comissao observou goleiros, fixos, alas e pivos para a janela inicial."
      );
      return;
    }
    if (state.sportId === "volei") {
      const market = window.TemporadaTotal?.generateProceduralVolleyballMarket?.(state.seed, {
        count: 24,
        profile: "balanced"
      });
      const fit = market && window.TemporadaTotal?.analyzeProceduralMarketFitForClub
        ? window.TemporadaTotal.analyzeProceduralMarketFitForClub(state.userTeam, market, { limit: 1 })
        : null;
      const top = fit?.topFits?.[0];
      window.TemporadaTotal.GameState.addLog(
        state,
        "market",
        "Radar de mercado",
        top ? `${top.name} (${top.pos}) surgiu como encaixe ${top.clubFitScore} para a rotacao.` : "A comissao observou levantadores, ponteiros e centrais para a janela inicial."
      );
      return;
    }
    const market = window.TemporadaTotal?.generateProceduralBasketballMarket?.(state.seed, {
      count: 24,
      profile: "balanced"
    });
    const fit = market && window.TemporadaTotal?.analyzeProceduralMarketFitForClub
      ? window.TemporadaTotal.analyzeProceduralMarketFitForClub(state.userTeam, market, { limit: 1 })
      : null;
    const top = fit?.topFits?.[0];
    window.TemporadaTotal.GameState.addLog(
      state,
      "market",
      "Oportunidade de mercado",
      top ? `${top.name} (${top.pos}) apareceu como encaixe ${top.clubFitScore}. Por enquanto e apenas monitoramento.` : "A equipe de scouting monitorou o mercado, sem recomendacao clara."
    );
  }

  function processEvent(state, event) {
    if (!event || event.processed) return state;
    if (state.pendingDecision) return state;
    if (event.type === "training") processTraining(state, event);
    if (event.type === "rest") processRest(state, event);
    if (event.type === "league-round") processLeagueRound(state, event);
    if (event.type === "match") simulateSimpleMatch(state, event);
    if (event.type === "narrative") processNarrative(state, event);
    if (event.type === "market") processMarket(state, event);
    if (event.awaitingDecision) return state;
    event.processed = true;
    state.processedEventIds.push(event.id);
    return state;
  }

  function advanceDay(state) {
    if (state.status === "completed") return state;
    if (state.pendingDecision) return state;

    window.TemporadaTotal?.DecisionNetworkEngine?.checkSeasonArcTriggers?.(state);

    getEventsForDay(state).forEach((event) => processEvent(state, event));
    if (state.pendingDecision) return state;

    if (!state.pendingDecision && window.TemporadaTotal?.DecisionNetworkEngine?.getActiveNarrativeDecision) {
      const netDecision = window.TemporadaTotal.DecisionNetworkEngine.getActiveNarrativeDecision(state);
      if (netDecision) {
        state.pendingDecision = netDecision;
        window.TemporadaTotal.GameState.addLog(
          state,
          "narrative",
          `Crônicas: ${netDecision.title}`,
          `${netDecision.text} Decisão estratégica necessária.`
        );
        return state;
      }
    }
    if (state.currentDay >= state.maxDays) {
      state.status = "completed";
      const standing = (state.standings || []).find((row) => row.teamId === state.userTeam?.id);
      const rank = (state.standings || []).findIndex((row) => row.teamId === state.userTeam?.id) + 1;
      const campaign = standing ? `${standing.wins} vitórias, ${standing.draws || 0} empates e ${standing.losses} derrotas` : "campanha encerrada";
      window.TemporadaTotal.GameState.addLog(
        state,
        "system",
        "Fim da temporada",
        `${state.userTeam?.name || "O clube"} encerrou a temporada em ${rank || "-"}º lugar, com ${campaign}. A próxima campanha começa com as escolhas feitas aqui.`
      );
      return state;
    }
    state.currentDay = Math.min(state.maxDays, state.currentDay + 1);
    state.currentWeek = Math.ceil(state.currentDay / 7);
    return state;
  }

  function advanceWeek(state) {
    for (let index = 0; index < 7 && state.status !== "completed"; index += 1) {
      advanceDay(state);
      if (state.pendingDecision) break;
    }
    return state;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    CalendarEngine: {
      createSeasonCalendar,
      getEventsForDay,
      getUpcomingEvents,
      processEvent,
      advanceDay,
      advanceWeek,
      applyExternalMatchResult,
      resolveKnockoutEvent,
      applyNarrativeDecision
    }
  };
})();
