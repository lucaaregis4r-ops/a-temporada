(function () {
  const DEFAULT_COACHING = {
    tactic: "balanced",
    pace: "normal",
    rotationPlan: "balanced",
    defensivePressure: "normal",
    offensiveFocus: "balanced",
    riskTolerance: "normal",
    updatedAtTick: 0,
    activeInstructions: []
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function createDefaultCoachingState(initial = {}) {
    return {
      ...DEFAULT_COACHING,
      ...(initial || {}),
      activeInstructions: Array.isArray(initial.activeInstructions) ? initial.activeInstructions.slice() : []
    };
  }

  function normalizeCoachingPatch(patch = {}) {
    const allowed = {
      tactic: ["balanced", "defense_first", "run_and_gun", "protect_lead", "power_play", "set_piece", "development"],
      pace: ["slow", "normal", "fast"],
      rotationPlan: ["balanced", "short_rotation", "development", "load_management", "defense_first"],
      defensivePressure: ["low", "normal", "high"],
      offensiveFocus: ["balanced", "paint", "three_point", "pivot", "wide", "set_piece", "star_player"],
      riskTolerance: ["safe", "normal", "high"]
    };
    return Object.fromEntries(Object.entries(patch).filter(([key, value]) => (
      Object.prototype.hasOwnProperty.call(allowed, key) && allowed[key].includes(value)
    )));
  }

  function applyCoachingCommand(state, patch = {}, meta = {}) {
    state.coaching = createDefaultCoachingState(state.coaching || {});
    const normalizedPatch = normalizeCoachingPatch(patch);
    state.coaching = {
      ...state.coaching,
      ...normalizedPatch,
      updatedAtTick: state.clock?.tick || 0,
      activeInstructions: [
        {
          tick: state.clock?.tick || 0,
          label: meta.label || "Ajuste tatico",
          patch: normalizedPatch
        },
        ...(state.coaching.activeInstructions || [])
      ].slice(0, 8)
    };
    return state.coaching;
  }

  function getCoachingModifiers(coaching = {}) {
    const current = createDefaultCoachingState(coaching);
    const pace = {
      slow: { possessionTarget: 0.86, turnover: -0.03, shot: -0.015, foul: -0.025 },
      normal: { possessionTarget: 1, turnover: 0, shot: 0, foul: 0 },
      fast: { possessionTarget: 1.18, turnover: 0.045, shot: 0.028, foul: 0.035 }
    }[current.pace] || {};
    const tactic = {
      balanced: { shot: 0, defense: 0, turnover: 0, foul: 0 },
      defense_first: { shot: -0.02, defense: 0.045, turnover: -0.02, foul: 0.02, turnoverForced: 0.05 },
      run_and_gun: { shot: 0.035, defense: -0.03, turnover: 0.04, foul: 0.02 },
      protect_lead: { shot: -0.012, defense: 0.035, turnover: -0.035, foul: -0.02 },
      power_play: { shot: 0.065, defense: -0.07, turnover: 0.05, foul: 0.02, powerPlay: 1 },
      set_piece: { shot: 0.04, defense: -0.01, turnover: -0.02, setPiece: 1 },
      development: { shot: -0.015, defense: -0.01, turnover: 0.025, foul: 0, benchUsage: 0.45, youthBonus: 1 }
    }[current.tactic] || {};
    const pressure = {
      low: { defense: -0.02, turnoverForced: -0.03, foul: -0.035 },
      normal: { defense: 0, turnoverForced: 0, foul: 0 },
      high: { defense: 0.04, turnoverForced: 0.06, foul: 0.045 }
    }[current.defensivePressure] || {};
    const focus = {
      balanced: { threeRate: 0, shot: 0 },
      paint: { threeRate: -0.22, shot: 0.035, foul: 0.035 },
      three_point: { threeRate: 0.32, shot: -0.015 },
      pivot: { pivotRate: 0.35, shot: 0.035, foul: 0.03 },
      wide: { wideRate: 0.35, turnover: -0.018, shot: 0.02 },
      set_piece: { setPiece: 1, shot: 0.03, turnover: -0.015 },
      star_player: { usageTop: 0.55, turnover: 0.025, shot: 0.03 }
    }[current.offensiveFocus] || {};
    const risk = {
      safe: { turnover: -0.025, shot: -0.01, foul: -0.018 },
      normal: { turnover: 0, shot: 0, foul: 0 },
      high: { turnover: 0.03, shot: 0.022, foul: 0.02 }
    }[current.riskTolerance] || {};
    const rotation = {
      balanced: { benchUsage: 0, fatigueDrain: 1.0, onCourtBonus: 0 },
      short_rotation: { benchUsage: -0.45, fatigueDrain: 1.45, usageTop: 0.4, onCourtBonus: 0.035 },
      development: { benchUsage: 0.5, fatigueDrain: 0.7, shot: -0.015, youthBonus: 1 },
      load_management: { benchUsage: 0.4, fatigueDrain: 0.6, shot: -0.012 },
      defense_first: { benchUsage: -0.1, defense: 0.04, turnoverForced: 0.035 }
    }[current.rotationPlan] || {};

    return [pace, tactic, pressure, focus, risk, rotation].reduce((merged, item) => {
      Object.entries(item).forEach(([key, value]) => {
        merged[key] = (Number(merged[key]) || 0) + Number(value);
      });
      return merged;
    }, {});
  }

  function getOffensiveCoachingModifiers(coaching = {}) {
    const all = getCoachingModifiers(coaching);
    return {
      possessionTarget: all.possessionTarget || 1,
      turnover: all.turnover || 0,
      shot: all.shot || 0,
      threeRate: all.threeRate || 0,
      usageTop: all.usageTop || 0,
      benchUsage: all.benchUsage || 0,
      foul: all.foul && all.foul < 0 ? all.foul : 0
    };
  }

  function getDefensiveCoachingModifiers(coaching = {}) {
    const current = createDefaultCoachingState(coaching);
    const all = getCoachingModifiers(coaching);
    const pressureFoul = {
      low: -0.012,
      normal: 0,
      high: 0.014
    }[current.defensivePressure] || 0;
    return {
      defense: all.defense || 0,
      turnoverForced: all.turnoverForced || 0,
      foul: pressureFoul
    };
  }

  function applyProbabilityModifier(value, modifier, min, max) {
    return clamp((Number(value) || 0) + (Number(modifier) || 0), min, max);
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    LiveCoaching: {
      createDefaultCoachingState,
      applyCoachingCommand,
      getCoachingModifiers,
      getOffensiveCoachingModifiers,
      getDefensiveCoachingModifiers,
      applyProbabilityModifier
    }
  };
})();
