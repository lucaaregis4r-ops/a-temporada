(function () {
  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function average(rows, getter) {
    return rows.reduce((sum, row) => sum + (Number(getter(row)) || 0), 0) / Math.max(1, rows.length);
  }

  function median(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    if (!sorted.length) return 0;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function groupBy(rows, getter) {
    return rows.reduce((groups, row) => {
      const key = getter(row) || "indefinido";
      groups[key] = groups[key] || [];
      groups[key].push(row);
      return groups;
    }, {});
  }

  function countPlayers(team, predicate) {
    return (team.roster?.players || []).filter(predicate).length;
  }

  function summarizeGroup(label, teams) {
    return {
      label,
      count: teams.length,
      averageOverall: round(average(teams, (team) => team.rating?.overall)),
      averageCurrent: round(average(teams, (team) => team.rating?.current)),
      averagePotential: round(average(teams, (team) => team.rating?.potential)),
      averageBudget: round(average(teams, (team) => team.budget)),
      averageSalaryPressure: round(average(teams, (team) => team.rating?.salaryPressure)),
      averageAge: round(average(teams, (team) => team.rating?.averageAge)),
      averageProspects: round(average(teams, (team) => countPlayers(team, (player) => player.potential - player.currentAbility >= 10)), 2),
      averageDefense: round(average(teams, (team) => team.rating?.defense)),
      averageShooting: round(average(teams, (team) => team.rating?.shooting))
    };
  }

  function getStrengthSpread(league) {
    const teams = league.standingsPreview || league.teams || [];
    const top = teams.slice(0, 4);
    const bottom = teams.slice(-4);
    return {
      topAverage: round(average(top, (team) => team.rating?.overall)),
      bottomAverage: round(average(bottom, (team) => team.rating?.overall)),
      gap: round(average(top, (team) => team.rating?.overall) - average(bottom, (team) => team.rating?.overall))
    };
  }

  function buildDiagnosticWarnings(league, diagnostics) {
    const warnings = [];
    if (diagnostics.strengthSpread.gap < 4.5) warnings.push("top_bottom_gap_too_small");
    if (diagnostics.strengthSpread.gap > 10) warnings.push("top_bottom_gap_too_large");
    if (diagnostics.overallRange < 5.5) warnings.push("overall_range_too_flat");
    if (diagnostics.overallRange > 12) warnings.push("overall_range_too_chaotic");
    if (diagnostics.salaryPressure.p90 > 135) warnings.push("salary_pressure_p90_too_high");
    if (diagnostics.salaryPressure.median < 65) warnings.push("salary_pressure_median_too_low");
    if ((diagnostics.byStrengthTier.low?.averageOverall || 0) > (diagnostics.byStrengthTier.normal?.averageOverall || 99)) warnings.push("low_tier_stronger_than_normal");
    if ((diagnostics.byStrengthTier.good?.averageOverall || 0) < (diagnostics.byStrengthTier.normal?.averageOverall || 0)) warnings.push("good_tier_weaker_than_normal");
    if ((diagnostics.byLeagueTier.favorito?.averageOverall || 0) - (diagnostics.byLeagueTier.sobrevivencia?.averageOverall || 0) < 4.5) warnings.push("favorites_not_clear_enough");
    if ((league.summary?.warnings || []).length) warnings.push("league_summary_has_warnings");
    return warnings;
  }

  function percentile(values, p) {
    const sorted = values.slice().sort((a, b) => a - b);
    if (!sorted.length) return 0;
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
    return sorted[index];
  }

  function mapGroupSummaries(groups) {
    return Object.fromEntries(Object.entries(groups).map(([label, teams]) => [label, summarizeGroup(label, teams)]));
  }

  function analyzeProceduralLeague(league) {
    const teams = league.teams || [];
    const standings = league.standingsPreview || teams.slice().sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));
    const overallValues = teams.map((team) => Number(team.rating?.overall) || 0);
    const salaryPressureValues = teams.map((team) => Number(team.rating?.salaryPressure) || 0);
    const diagnostics = {
      seed: league.seed,
      teamCount: teams.length,
      overallRange: round(Math.max(...overallValues) - Math.min(...overallValues)),
      overallMedian: round(median(overallValues)),
      strengthSpread: getStrengthSpread({ ...league, standingsPreview: standings }),
      salaryPressure: {
        median: round(median(salaryPressureValues)),
        p90: round(percentile(salaryPressureValues, 90)),
        max: round(Math.max(...salaryPressureValues))
      },
      byStrengthTier: mapGroupSummaries(groupBy(teams, (team) => team.strengthTier)),
      byRosterStyle: mapGroupSummaries(groupBy(teams, (team) => team.rosterStyle)),
      byLeagueTier: mapGroupSummaries(groupBy(teams, (team) => team.leagueTier)),
      topFour: standings.slice(0, 4).map((team) => team.id),
      bottomFour: standings.slice(-4).map((team) => team.id),
      warnings: []
    };
    diagnostics.warnings = buildDiagnosticWarnings(league, diagnostics);
    return diagnostics;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralLeagueDebug: {
      analyzeProceduralLeague
    },
    analyzeProceduralLeague
  };
})();
