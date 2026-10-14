(function () {
  let nextEventId = 1;

  function normalizeTags(tags) {
    if (!tags) return [];
    return Array.isArray(tags) ? tags.filter(Boolean) : [String(tags)];
  }

  function createMatchEvent(event = {}) {
    return {
      id: event.id || `evt-${Date.now()}-${nextEventId++}`,
      sport: event.sport || "",
      type: event.type || "generic",
      teamId: event.teamId || "",
      playerId: event.playerId || "",
      assistedBy: event.assistedBy || null,
      secondaryPlayerId: event.secondaryPlayerId || null,
      minute: event.minute ?? 0,
      period: event.period ?? null,
      set: event.set ?? null,
      rally: event.rally ?? null,
      value: event.value ?? 0,
      description: event.description || "",
      statDeltas: event.statDeltas || {},
      scoreDelta: event.scoreDelta || null,
      tags: normalizeTags(event.tags)
    };
  }

  function createEmptyPlayerStats(roster = [], statsSchema = []) {
    const stats = {};
    const fields = statsSchema.map((item) => item.key);
    roster.forEach((player) => {
      stats[player.id] = {
        playerId: player.id,
        playerName: player.name,
        teamId: player.teamId,
        position: player.pos || player.position || "",
        ...Object.fromEntries(fields.map((field) => [field, 0]))
      };
    });
    return stats;
  }

  function applyStatDeltas(playerStats = {}, event = {}) {
    Object.entries(event.statDeltas || {}).forEach(([playerId, deltas]) => {
      if (!playerStats[playerId]) return;
      Object.entries(deltas || {}).forEach(([key, amount]) => {
        playerStats[playerId][key] = (Number(playerStats[playerId][key]) || 0) + (Number(amount) || 0);
      });
    });
  }

  function applyScoreDelta(score = {}, event = {}) {
    if (event.scoreDelta) {
      score.home = (Number(score.home) || 0) + (Number(event.scoreDelta.home) || 0);
      score.away = (Number(score.away) || 0) + (Number(event.scoreDelta.away) || 0);
      return;
    }

    const teamId = event.teamId;
    if (!event.value || !teamId) return;
    if (teamId === "home") score.home = (Number(score.home) || 0) + Number(event.value);
    if (teamId === "away") score.away = (Number(score.away) || 0) + Number(event.value);
  }

  function recalculateEfficiency(playerStats = {}, calculatePlayerEfficiency, calculatePlayerRating) {
    Object.values(playerStats).forEach((stats) => {
      stats.efficiency = calculatePlayerEfficiency ? calculatePlayerEfficiency(stats) : stats.efficiency || 0;
      if (calculatePlayerRating) {
        stats.rating = calculatePlayerRating(stats);
      }
    });
  }

  function applyEventToMatchState(state, event, adapter) {
    const normalizedEvent = createMatchEvent(event);
    state.events.unshift(normalizedEvent);
    state.events = state.events.slice(0, state.maxEvents || 80);
    applyScoreDelta(state.score, normalizedEvent);
    applyStatDeltas(state.playerStats, normalizedEvent);
    recalculateEfficiency(state.playerStats, adapter?.calculatePlayerEfficiency, adapter?.calculatePlayerRating);
    return normalizedEvent;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    MatchEvents: {
      createMatchEvent,
      createEmptyPlayerStats,
      applyStatDeltas,
      applyScoreDelta,
      applyEventToMatchState,
      recalculateEfficiency
    }
  };
})();
