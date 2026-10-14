(function () {
  const SPEED_INTERVALS = {
    normal: 480,
    "2x": 220,
    "5x": 80
  };

  function mean(values) {
    return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
  }

  function median(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function standardDeviation(values) {
    const avg = mean(values);
    return Math.sqrt(mean(values.map((value) => (value - avg) ** 2)));
  }

  function summarize(values) {
    return {
      avg: Number(mean(values).toFixed(2)),
      median: Number(median(values).toFixed(2)),
      min: Math.min(...values),
      max: Math.max(...values),
      sd: Number(standardDeviation(values).toFixed(2))
    };
  }

  function createLiveSimulation({ adapter, homeTeam, awayTeam, onUpdate } = {}) {
    if (!adapter) {
      throw new Error("LiveSimulation precisa de um adapter de modalidade.");
    }

    let timer = null;
    let speed = "normal";
    let finalized = false;
    const state = adapter.createInitialMatchState(homeTeam, awayTeam);

    function emit() {
      if (typeof onUpdate === "function") {
        onUpdate(getState());
      }
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function finalizeIfNeeded() {
      if (!finalized && state.status === "finished") {
        adapter.normalizeFinalStats?.(state);
        finalized = true;
      }
    }

    function runTick() {
      if (state.status === "finished") {
        stopTimer();
        finalizeIfNeeded();
        emit();
        return state;
      }
      state.status = "running";
      const event = adapter.simulateTick(state, homeTeam, awayTeam);
      if (event) {
        adapter.applyEvent(state, event);
      }
      if (adapter.isMatchFinished(state)) {
        state.status = "finished";
        stopTimer();
        finalizeIfNeeded();
      }
      emit();
      return state;
    }

    function start() {
      if (state.status === "finished") return;
      stopTimer();
      state.status = "running";
      timer = setInterval(runTick, SPEED_INTERVALS[speed] || SPEED_INTERVALS.normal);
      emit();
    }

    function pause() {
      if (state.status !== "finished") {
        state.status = "paused";
      }
      stopTimer();
      emit();
    }

    function tick() {
      stopTimer();
      return runTick();
    }

    function setSpeed(nextSpeed) {
      speed = SPEED_INTERVALS[nextSpeed] ? nextSpeed : "normal";
      state.speed = speed;
      if (state.status === "running") {
        start();
      } else {
        emit();
      }
    }

    function setCoaching(patch, meta) {
      if (patch?.lineChange && adapter.substituteEntireLine) {
        const ok = adapter.substituteEntireLine(state, patch.lineChange.teamId || "home");
        if (ok && window.TemporadaTotal?.LiveCoaching?.applyCoachingCommand) {
          window.TemporadaTotal.LiveCoaching.applyCoachingCommand(state, {}, {
            label: meta?.label || "Troca de linha completa realizada"
          });
        }
        emit();
        return state.coaching;
      }
      if (patch?.timeout && adapter.applyTimeout) {
        const ok = adapter.applyTimeout(state, patch.timeout.teamId || "home");
        if (ok && window.TemporadaTotal?.LiveCoaching?.applyCoachingCommand) {
          window.TemporadaTotal.LiveCoaching.applyCoachingCommand(state, patch, {
            label: meta?.label || "Tempo técnico solicitado"
          });
        }
        emit();
        return state.coaching;
      }
      if (patch?.substitution && adapter.applySubstitution) {
        const sub = patch.substitution;
        const ok = adapter.applySubstitution(state, sub.teamId || "home", sub.outId, sub.inId);
        if (ok && window.TemporadaTotal?.LiveCoaching?.applyCoachingCommand) {
          window.TemporadaTotal.LiveCoaching.applyCoachingCommand(state, {}, {
            label: meta?.label || "Substituicao realizada"
          });
        }
        emit();
        return state.coaching;
      }
      if (window.TemporadaTotal?.LiveCoaching?.applyCoachingCommand) {
        window.TemporadaTotal.LiveCoaching.applyCoachingCommand(state, patch, meta);
      } else {
        state.coaching = { ...(state.coaching || {}), ...(patch || {}) };
      }
      emit();
      return state.coaching;
    }

    function finish() {
      stopTimer();
      let guard = 0;
      while (state.status !== "finished" && guard < 1200) {
        runTick();
        guard += 1;
      }
      state.status = "finished";
      finalizeIfNeeded();
      emit();
    }

    function getState() {
      return state;
    }

    return { start, pause, tick, setSpeed, setCoaching, finish, getState };
  }

  function buildDebugRoster(sportId, teamId) {
    const prefix = teamId === "home" ? "Casa" : "Fora";
    const maps = {
      basquete: ["PG", "SG", "SF", "PF", "C", "G", "F", "C"],
      volei: ["LEV", "OPO", "PON", "PON", "CEN", "CEN", "LIB", "PON"],
      futsal: ["GOL", "FIX", "ALA", "ALA", "PIVO", "ALA", "FIX", "GOL"]
    };
    return (maps[sportId] || maps.basquete).map((pos, index) => ({
      id: `${teamId}-${index + 1}`,
      name: `${prefix} ${index + 1}`,
      teamId,
      pos,
      usage: index < 5 ? 1.1 : 0.6,
      shooting: 72 + (index % 4) * 4,
      finishing: 72 + (index % 5) * 3,
      threepoint: 70 + (index % 3) * 5,
      passing: 72 + (index % 4) * 4,
      defense: 72 + (index % 5) * 3,
      rebound: 70 + (index % 4) * 5,
      serve: 72 + (index % 4) * 4,
      attack: 72 + (index % 5) * 4,
      block: 70 + (index % 4) * 5,
      reception: pos === "LIB" ? 88 : 70 + (index % 4) * 4,
      setting: pos === "LEV" ? 88 : 68 + (index % 4) * 4,
      goalkeeping: pos === "GOL" ? 86 : 35
    }));
  }

  function buildDebugTeam(sportId, teamId, rating = 76) {
    return {
      id: teamId,
      name: teamId === "home" ? "Time Casa" : "Time Fora",
      rating,
      offense: rating,
      defense: rating,
      threeRate: 0.37,
      pace: "balanced",
      roster: buildDebugRoster(sportId, teamId)
    };
  }

  function getAdapter(sportId) {
    const registry = {
      basquete: window.TemporadaTotal?.BasketballMatchAdapter,
      volei: window.TemporadaTotal?.VolleyballMatchAdapter,
      futsal: window.TemporadaTotal?.FutsalMatchAdapter
    };
    return registry[sportId];
  }

  function collectDefaultSummary(sportId, state) {
    const rows = Object.values(state.playerStats || {});
    const byTeam = (teamId, key) => rows
      .filter((row) => row.teamId === teamId)
      .reduce((sum, row) => sum + (Number(row[key]) || 0), 0);

    if (sportId === "basquete") {
      return {
        points: [state.score.home, state.score.away],
        possessions: [Math.ceil((state.clock.tick || 0) / 2), Math.floor((state.clock.tick || 0) / 2)],
        turnovers: [byTeam("home", "turnovers"), byTeam("away", "turnovers")],
        rebounds: [byTeam("home", "rebounds"), byTeam("away", "rebounds")],
        assists: [byTeam("home", "assists"), byTeam("away", "assists")],
        threeAttempted: [byTeam("home", "threeAttempted"), byTeam("away", "threeAttempted")],
        fta: [byTeam("home", "fta"), byTeam("away", "fta")]
      };
    }

    if (sportId === "volei") {
      return {
        sets: [state.completedSets?.length || 0],
        pointsPerSet: (state.completedSets || []).map((set) => set.home + set.away),
        aces: [byTeam("home", "aces"), byTeam("away", "aces")],
        serveErrors: [byTeam("home", "serveErrors"), byTeam("away", "serveErrors")],
        receptionErrors: [byTeam("home", "receptionErrors"), byTeam("away", "receptionErrors")],
        attackPoints: [byTeam("home", "attackPoints"), byTeam("away", "attackPoints")],
        blocks: [byTeam("home", "blocks"), byTeam("away", "blocks")],
        errors: [byTeam("home", "errors"), byTeam("away", "errors")]
      };
    }

    return {
      goals: [state.score.home, state.score.away],
      shots: [byTeam("home", "shots"), byTeam("away", "shots")],
      shotsOnTarget: [byTeam("home", "shotsOnTarget"), byTeam("away", "shotsOnTarget")],
      fouls: [byTeam("home", "foulsCommitted"), byTeam("away", "foulsCommitted")],
      yellowCards: [byTeam("home", "yellowCards"), byTeam("away", "yellowCards")],
      saves: [byTeam("home", "saves"), byTeam("away", "saves")],
      turnovers: [byTeam("home", "turnovers"), byTeam("away", "turnovers")]
    };
  }

  function getCalibrationAlerts(sportId, metrics) {
    const ranges = {
      basquete: { points: [75, 110], turnovers: [8, 20], threeAttempted: [18, 46], fta: [10, 32] },
      volei: { sets: [3, 5], aces: [2, 12], serveErrors: [5, 22], receptionErrors: [2, 14], blocks: [3, 16] },
      futsal: { goals: [1, 6], shots: [18, 45], shotsOnTarget: [6, 18], fouls: [4, 12], yellowCards: [0, 4], turnovers: [8, 25] }
    };
    return Object.entries(ranges[sportId] || {}).flatMap(([key, [min, max]]) => {
      const avg = metrics[key]?.avg;
      if (avg == null || (avg >= min && avg <= max)) return [];
      return [`${key}: media ${avg} fora da faixa ${min}-${max}`];
    });
  }

  function debugSimulateManyMatches(sportId, n = 500) {
    const adapter = getAdapter(sportId);
    if (!adapter) {
      console.warn(`[debugSimulateManyMatches] Adapter nao carregado para ${sportId}.`);
      return null;
    }

    const buckets = {};
    for (let index = 0; index < n; index += 1) {
      const homeTeam = buildDebugTeam(sportId, "home", 76);
      const awayTeam = buildDebugTeam(sportId, "away", 76);
      const sim = createLiveSimulation({ adapter, homeTeam, awayTeam });
      sim.finish();
      const summary = adapter.getTeamSummary?.(sim.getState()) || collectDefaultSummary(sportId, sim.getState());
      Object.entries(summary).forEach(([key, values]) => {
        buckets[key] = buckets[key] || [];
        buckets[key].push(...(Array.isArray(values) ? values : [values]).map(Number).filter(Number.isFinite));
      });
    }

    const metrics = Object.fromEntries(Object.entries(buckets).map(([key, values]) => [key, summarize(values)]));
    const alerts = getCalibrationAlerts(sportId, metrics);
    console.group(`debugSimulateManyMatches: ${sportId} (${n})`);
    console.table(metrics);
    if (alerts.length) console.warn("Alertas de calibracao:", alerts);
    else console.info("Calibracao dentro das faixas principais.");
    console.groupEnd();
    return { sportId, n, metrics, alerts };
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    createLiveSimulation,
    debugSimulateManyMatches
  };
})();
