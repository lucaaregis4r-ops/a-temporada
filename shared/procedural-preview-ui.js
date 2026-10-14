(function () {
  const DEFAULT_SEED = "OLYMPICO-2026";

  function formatNumber(value, digits = 1) {
    const number = Number(value) || 0;
    return Number.isInteger(number) ? String(number) : number.toFixed(digits);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getArchetypeLabel(player) {
    return player.archetype?.label || player.tag || "Sem arquetipo";
  }

  function getFilteredPlayers(players, filters) {
    return players.filter((player) => {
      const positionMatch = filters.position === "all" || player.pos === filters.position;
      const archetypeMatch = filters.archetype === "all" || getArchetypeLabel(player) === filters.archetype;
      return positionMatch && archetypeMatch;
    });
  }

  function getOptions(players, getter) {
    return [...new Set(players.map(getter).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function renderOption(value, label, selected) {
    return `<option value="${escapeHtml(value)}"${selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
  }

  function renderSummary(result) {
    const summary = result.summary || {};
    const warningCount = result.warnings?.length || 0;
    return `
      <div class="procedural-summary-grid">
        <article class="metric-card procedural-metric">
          <span>Jogadores</span>
          <strong>${result.players.length}</strong>
        </article>
        <article class="metric-card procedural-metric">
          <span>Habilidade media</span>
          <strong>${formatNumber(summary.currentAbility?.avg)}</strong>
          <div class="player-meta">desvio ${formatNumber(summary.currentAbility?.sd)}</div>
        </article>
        <article class="metric-card procedural-metric">
          <span>Potencial medio</span>
          <strong>${formatNumber(summary.potential?.avg)}</strong>
          <div class="player-meta">90+ em ${countPercent(result.players, (player) => player.potential >= 90)}%</div>
        </article>
        <article class="metric-card procedural-metric">
          <span>Folha estimada</span>
          <strong>$${formatNumber(summary.salary?.total)}M</strong>
          <div class="player-meta">media $${formatNumber(summary.salary?.avg)}M</div>
        </article>
        <article class="metric-card procedural-metric ${warningCount ? "has-warning" : ""}">
          <span>Warnings</span>
          <strong>${warningCount}</strong>
          <div class="player-meta">${warningCount ? "revisar calibragem" : "sem alerta"}</div>
        </article>
      </div>
    `;
  }

  function countPercent(players, predicate) {
    if (!players.length) return "0";
    return formatNumber((players.filter(predicate).length / players.length) * 100);
  }

  function renderWarnings(warnings) {
    if (!warnings?.length) {
      return `<div class="procedural-warning-list is-clean">Nenhum alerta de calibragem para esta classe.</div>`;
    }
    return `
      <div class="procedural-warning-list">
        ${warnings.map((warning) => `<div>${escapeHtml(warning)}</div>`).join("")}
      </div>
    `;
  }

  function renderPlayerTable(players) {
    if (!players.length) {
      return `<div class="procedural-empty">Nenhum jogador encontrado com os filtros atuais.</div>`;
    }
    return `
      <div class="table-wrap procedural-table-wrap">
        <table class="standings-table procedural-player-table">
          <thead>
            <tr>
              <th>Jogador</th>
              <th>Pos</th>
              <th>Idade</th>
              <th>Alt</th>
              <th>CA</th>
              <th>POT</th>
              <th>Gap</th>
              <th>Salario</th>
              <th>3PT</th>
              <th>Fis</th>
              <th>Tat</th>
              <th>Tec</th>
              <th>Def</th>
            </tr>
          </thead>
          <tbody>
            ${players.map((player) => `
              <tr>
                <td>
                  <strong>${escapeHtml(player.name)}</strong>
                  <div class="player-meta">${escapeHtml(getArchetypeLabel(player))}</div>
                </td>
                <td><span class="status-pill">${escapeHtml(player.pos)}</span></td>
                <td>${player.age}</td>
                <td>${player.heightCm}</td>
                <td>${player.currentAbility}</td>
                <td>${player.potential}</td>
                <td>${player.potential - player.currentAbility}</td>
                <td>$${formatNumber(player.salary)}M</td>
                <td>${player.threePoint}</td>
                <td>${player.physical}</td>
                <td>${player.tactical}</td>
                <td>${player.technique}</td>
                <td>${player.defense}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderTopLists(result) {
    const topCurrent = result.summary?.topPlayers?.currentAbility || [];
    const topPotential = result.summary?.topPlayers?.potential || [];
    const topProspects = result.summary?.topProspects || [];
    return `
      <div class="procedural-top-grid">
        ${renderTopCard("Top habilidade atual", topCurrent, "currentAbility")}
        ${renderTopCard("Top potencial", topPotential, "potential")}
        ${renderTopCard("Top prospects", topProspects, "developmentGap")}
      </div>
    `;
  }

  function renderTopCard(title, rows, key) {
    return `
      <article class="procedural-top-card">
        <h3>${escapeHtml(title)}</h3>
        ${rows.slice(0, 5).map((row) => `
          <div class="procedural-top-row">
            <span>${escapeHtml(row.name)} <small>${escapeHtml(row.pos)}</small></span>
            <strong>${formatNumber(row[key], 0)}</strong>
          </div>
        `).join("")}
      </article>
    `;
  }

  function renderScoutPanel(players) {
    return `
      <div class="procedural-scout-grid">
        ${players.slice(0, 6).map((player) => `
          <article class="procedural-scout-card">
            <span class="status-pill">${escapeHtml(player.pos)}</span>
            <h3>${escapeHtml(player.name)}</h3>
            <div class="player-meta">${escapeHtml(getArchetypeLabel(player))} | CA ${player.currentAbility} / POT ${player.potential}</div>
            <ul>
              ${(player.scoutNotes || []).slice(0, 3).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderDistribution(result) {
    const byPosition = result.summary?.byPosition || {};
    const total = Math.max(1, result.players.length);
    return `
      <div class="procedural-distribution">
        ${Object.entries(byPosition).map(([position, count]) => `
          <div>
            <span>${escapeHtml(position)}</span>
            <strong>${count}</strong>
            <div class="procedural-bar"><i style="width:${Math.round((count / total) * 100)}%"></i></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderRosterPreview(roster) {
    const summary = roster.summary || {};
    return `
      <div class="procedural-roster-preview">
        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Elenco</span>
            <strong>${summary.rosterSize || roster.players.length}</strong>
            <div class="player-meta">seed ${escapeHtml(roster.seed)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Folha</span>
            <strong>$${formatNumber(summary.totalSalary)}M</strong>
            <div class="player-meta">saldo $${formatNumber(summary.budgetLeft)}M</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Idade media</span>
            <strong>${formatNumber(summary.averageAge)}</strong>
            <div class="player-meta">${formatNumber(summary.averageHeight)} cm</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Forca media</span>
            <strong>${formatNumber(summary.averageCurrentAbility)}</strong>
            <div class="player-meta">pot ${formatNumber(summary.averagePotential)}</div>
          </article>
          <article class="metric-card procedural-metric ${roster.warnings?.length ? "has-warning" : ""}">
            <span>Diagnostico</span>
            <strong>${roster.warnings?.length || 0}</strong>
            <div class="player-meta">${roster.warnings?.length ? "pontos de atencao" : "sem alerta"}</div>
          </article>
        </div>

        ${renderWarnings(roster.warnings)}
        ${renderRosterPositionGrid(summary.strengthByPosition || {})}

        <div class="procedural-roster-grid">
          ${renderRosterGroup("Provaveis titulares", roster.starters || [])}
          ${renderRosterGroup("Rotacao", roster.rotation || [])}
          ${renderRosterGroup("Prospects", roster.prospects || [])}
        </div>

        <div class="procedural-roster-notes">
          <article>
            <span>Carencias</span>
            <strong>${summary.needs?.length ? summary.needs.join(" | ") : "Sem carencia grave"}</strong>
          </article>
          <article>
            <span>Excessos</span>
            <strong>${summary.excesses?.length ? summary.excesses.join(" | ") : "Sem excesso grave"}</strong>
          </article>
        </div>

        ${renderRosterTable(roster.players || [])}
      </div>
    `;
  }

  function renderRosterPositionGrid(strengthByPosition) {
    return `
      <div class="procedural-distribution procedural-position-strength">
        ${["PG", "SG", "SF", "PF", "C"].map((position) => {
          const row = strengthByPosition[position] || {};
          return `
            <div>
              <span>${position}</span>
              <strong>${formatNumber(row.currentAbility || 0)}</strong>
              <div class="player-meta">${row.count || 0} atletas | pot ${formatNumber(row.potential || 0)}</div>
              <div class="procedural-bar"><i style="width:${Math.min(100, Math.round(row.currentAbility || 0))}%"></i></div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderRosterGroup(title, players) {
    return `
      <article class="procedural-top-card">
        <h3>${escapeHtml(title)}</h3>
        ${players.map((player) => `
          <div class="procedural-top-row">
            <span>${escapeHtml(player.name)} <small>${escapeHtml(player.pos)}</small></span>
            <strong>${player.currentAbility}/${player.potential}</strong>
          </div>
        `).join("") || '<div class="player-meta">Sem atletas neste grupo.</div>'}
      </article>
    `;
  }

  function renderRosterTable(players) {
    const sorted = players.slice().sort((a, b) => a.rosterSlot - b.rosterSlot);
    return `
      <div class="table-wrap procedural-table-wrap">
        <table class="standings-table procedural-player-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Jogador</th>
              <th>Pos</th>
              <th>Papel</th>
              <th>Idade</th>
              <th>CA</th>
              <th>POT</th>
              <th>Gap</th>
              <th>Salario</th>
              <th>Risco</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((player) => `
              <tr>
                <td>${player.rosterSlot}</td>
                <td>
                  <strong>${escapeHtml(player.name)}</strong>
                  <div class="player-meta">${escapeHtml(getArchetypeLabel(player))}</div>
                </td>
                <td><span class="status-pill">${escapeHtml(player.pos)}</span></td>
                <td>${escapeHtml(player.rosterRole || "roster")}</td>
                <td>${player.age}</td>
                <td>${player.currentAbility}</td>
                <td>${player.potential}</td>
                <td>${player.potential - player.currentAbility}</td>
                <td>$${formatNumber(player.salary)}M</td>
                <td>${escapeHtml(player.riskLabel || "-")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderClubPreview(club) {
    const roster = club.roster || {};
    const decisionSummary = club.lore?.decisionSummary || {};
    const calibrationWarnings = club.calibrationWarnings || [];
    return `
      <div class="procedural-club-preview">
        <div class="procedural-club-hero">
          <div>
            <span class="eyebrow">Clube procedural</span>
            <h2>${escapeHtml(club.name)}</h2>
            <p>${escapeHtml(club.lore?.description || "")}</p>
          </div>
          <div class="procedural-club-badge">
            <span>${escapeHtml(club.city)}</span>
            <strong>${escapeHtml(club.lore?.label || "Lore prototipo")}</strong>
          </div>
        </div>

        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Orcamento</span>
            <strong>$${formatNumber(club.budget)}M</strong>
            <div class="player-meta">folha $${formatNumber(roster.summary?.totalSalary)}M</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Forca estimada</span>
            <strong>${formatNumber(club.rating?.overall)}</strong>
            <div class="player-meta">CA ${formatNumber(club.rating?.current)} | POT ${formatNumber(club.rating?.potential)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Pressao</span>
            <strong>${escapeHtml(club.pressure)}</strong>
            <div class="player-meta">${escapeHtml(club.ambition)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Objetivo</span>
            <strong>${escapeHtml(club.objective)}</strong>
          </article>
        </div>

        <div class="procedural-roster-notes">
          <article>
            <span>Forcas</span>
            <strong>${club.strengths?.length ? club.strengths.map(escapeHtml).join(" | ") : "A definir"}</strong>
          </article>
          <article>
            <span>Fraquezas</span>
            <strong>${club.weaknesses?.length ? club.weaknesses.map(escapeHtml).join(" | ") : "A definir"}</strong>
          </article>
          <article>
            <span>Calibragem</span>
            <strong>${club.calibrationMeta?.applied ? `aplicada (${escapeHtml(club.calibrationMeta.style || "-")})` : "nao aplicada"}</strong>
            <div class="player-meta">${calibrationWarnings.length ? calibrationWarnings.map(escapeHtml).join(" | ") : "sem warnings"}</div>
          </article>
        </div>

        <div class="procedural-club-grid">
          <article class="procedural-top-card">
            <h3>Leitura do clube</h3>
            ${(club.scoutNotes || []).map((note) => `<div class="procedural-note-line">${escapeHtml(note)}</div>`).join("")}
          </article>
          <article class="procedural-top-card">
            <h3>Comportamento no mercado</h3>
            <div class="procedural-top-row"><span>Agressividade</span><strong>${escapeHtml(club.marketBehavior?.aggressiveness)}</strong></div>
            <div class="procedural-top-row"><span>Foco</span><strong>${escapeHtml(club.marketBehavior?.focus)}</strong></div>
            <div class="procedural-top-row"><span>Estilo</span><strong>${escapeHtml(club.rosterStyle)}</strong></div>
          </article>
          <article class="procedural-top-card">
            <h3>Decisoes da lore</h3>
            <div class="procedural-top-row"><span>Categoria</span><strong>${escapeHtml(club.lore?.category || "-")}</strong></div>
            <div class="procedural-top-row"><span>Eventos</span><strong>${formatNumber(decisionSummary.decisionCount || 0, 0)}</strong></div>
            ${(decisionSummary.sampleTitles || []).slice(0, 3).map((title) => `<div class="procedural-note-line">${escapeHtml(title)}</div>`).join("")}
          </article>
        </div>

        ${renderRosterPositionGrid(roster.summary?.strengthByPosition || {})}
        <div class="procedural-roster-grid">
          ${renderRosterGroup("Provaveis titulares", roster.starters || [])}
          ${renderRosterGroup("Rotacao", roster.rotation || [])}
          ${renderRosterGroup("Prospects", roster.prospects || [])}
        </div>
        ${renderRosterTable(roster.players || [])}
      </div>
    `;
  }

  function getTeamById(league, teamId) {
    return (league.teams || []).find((team) => team.id === teamId) || null;
  }

  function renderLeagueTeamMini(team) {
    if (!team) return "";
    return `
      <div class="procedural-top-row">
        <span>${escapeHtml(team.name)} <small>${escapeHtml(team.lore?.label || "")}</small></span>
        <strong>${formatNumber(team.rating?.overall)}</strong>
      </div>
    `;
  }

  function renderLeagueSummary(league) {
    const summary = league.summary || {};
    const diagnostics = league.diagnostics || {};
    return `
      <div class="procedural-summary-grid">
        <article class="metric-card procedural-metric">
          <span>Clubes</span>
          <strong>${summary.teamCount || league.teams.length}</strong>
          <div class="player-meta">seed ${escapeHtml(league.seed)}</div>
        </article>
        <article class="metric-card procedural-metric">
          <span>Forca media</span>
          <strong>${formatNumber(summary.averageOverall)}</strong>
          <div class="player-meta">${formatNumber(summary.minOverall)} - ${formatNumber(summary.maxOverall)}</div>
        </article>
        <article class="metric-card procedural-metric">
          <span>Orcamento medio</span>
          <strong>$${formatNumber(summary.averageBudget)}M</strong>
          <div class="player-meta">folha ${formatNumber(summary.averageSalaryPressure)}%</div>
        </article>
        <article class="metric-card procedural-metric ${summary.warnings?.length ? "has-warning" : ""}">
          <span>Warnings</span>
          <strong>${(summary.warnings?.length || 0) + (diagnostics.warnings?.length || 0)}</strong>
          <div class="player-meta">${summary.warnings?.length || diagnostics.warnings?.length ? "revisar liga" : "sem alerta"}</div>
        </article>
      </div>
    `;
  }

  function renderLeagueDebugTable(title, rows) {
    return `
      <article class="procedural-top-card procedural-debug-card">
        <h3>${escapeHtml(title)}</h3>
        <div class="table-wrap procedural-mini-table-wrap">
          <table class="standings-table procedural-mini-table">
            <thead>
              <tr>
                <th>Grupo</th>
                <th>N</th>
                <th>OVR</th>
                <th>Idade</th>
                <th>Folha</th>
                <th>Prospects</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  <td>${escapeHtml(row.label)}</td>
                  <td>${row.count}</td>
                  <td>${formatNumber(row.averageOverall)}</td>
                  <td>${formatNumber(row.averageAge)}</td>
                  <td>${formatNumber(row.averageSalaryPressure)}%</td>
                  <td>${formatNumber(row.averageProspects)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </article>
    `;
  }

  function renderLeagueDiagnostics(league) {
    const diagnostics = league.diagnostics;
    if (!diagnostics) return "";
    const tierRows = Object.values(diagnostics.byStrengthTier || {}).sort((a, b) => a.label.localeCompare(b.label));
    const styleRows = Object.values(diagnostics.byRosterStyle || {}).sort((a, b) => b.count - a.count);
    const leagueTierRows = Object.values(diagnostics.byLeagueTier || {}).sort((a, b) => b.averageOverall - a.averageOverall);
    return `
      <div class="procedural-league-diagnostics">
        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Gap topo/fundo</span>
            <strong>${formatNumber(diagnostics.strengthSpread?.gap)}</strong>
            <div class="player-meta">${formatNumber(diagnostics.strengthSpread?.topAverage)} vs ${formatNumber(diagnostics.strengthSpread?.bottomAverage)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Range geral</span>
            <strong>${formatNumber(diagnostics.overallRange)}</strong>
            <div class="player-meta">mediana ${formatNumber(diagnostics.overallMedian)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Folha p90</span>
            <strong>${formatNumber(diagnostics.salaryPressure?.p90)}%</strong>
            <div class="player-meta">max ${formatNumber(diagnostics.salaryPressure?.max)}%</div>
          </article>
          <article class="metric-card procedural-metric ${diagnostics.warnings?.length ? "has-warning" : ""}">
            <span>Debug warnings</span>
            <strong>${diagnostics.warnings?.length || 0}</strong>
            <div class="player-meta">${diagnostics.warnings?.length ? diagnostics.warnings.map(escapeHtml).join(" | ") : "distribuicao ok"}</div>
          </article>
        </div>
        <div class="procedural-league-debug-grid">
          ${renderLeagueDebugTable("Por strength tier", tierRows)}
          ${renderLeagueDebugTable("Por estilo", styleRows.slice(0, 8))}
          ${renderLeagueDebugTable("Por faixa da liga", leagueTierRows)}
        </div>
      </div>
    `;
  }

  function renderLeagueSimulation(simulation) {
    if (!simulation) return "";
    const summary = simulation.summary || {};
    return `
      <div class="procedural-league-simulation">
        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Campeao simulado</span>
            <strong>${escapeHtml(summary.championName || "-")}</strong>
            <div class="player-meta">rank projetado ${summary.championProjectedRank || "-"}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Top 4 preservado</span>
            <strong>${formatNumber(summary.top4RetentionPct)}%</strong>
            <div class="player-meta">${summary.top4Retention || 0}/4 favoritos</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Taxa de zebra</span>
            <strong>${formatNumber(summary.upsetRate)}%</strong>
            <div class="player-meta">correlacao ${formatNumber(summary.rankCorrelation, 2)}</div>
          </article>
          <article class="metric-card procedural-metric ${summary.warnings?.length ? "has-warning" : ""}">
            <span>Sim warnings</span>
            <strong>${summary.warnings?.length || 0}</strong>
            <div class="player-meta">${summary.warnings?.length ? summary.warnings.map(escapeHtml).join(" | ") : "comportamento ok"}</div>
          </article>
        </div>

        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead>
              <tr>
                <th>Sim</th>
                <th>Proj</th>
                <th>Clube</th>
                <th>V-D</th>
                <th>Saldo</th>
                <th>OVR</th>
                <th>Lore</th>
              </tr>
            </thead>
            <tbody>
              ${(simulation.standings || []).map((row) => `
                <tr>
                  <td>${row.simulatedRank}</td>
                  <td>${row.projectedRank}</td>
                  <td><strong>${escapeHtml(row.name)}</strong></td>
                  <td>${row.wins}-${row.losses}</td>
                  <td>${row.pointDiff > 0 ? "+" : ""}${row.pointDiff}</td>
                  <td>${formatNumber(row.rating)}</td>
                  <td>${escapeHtml(row.loreLabel)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderLeagueNarrativeDebug(narrativeDebug) {
    if (!narrativeDebug) return "";
    const warningRows = (narrativeDebug.teams || [])
      .filter((team) => team.warnings?.length)
      .slice(0, 8);
    return `
      <div class="procedural-league-diagnostics">
        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Objetivos coerentes</span>
            <strong>${formatNumber(narrativeDebug.objectiveAlignmentPct)}%</strong>
            <div class="player-meta">resultado vs lore</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Decisoes fortes</span>
            <strong>${narrativeDebug.highDecisionTeams || 0}</strong>
            <div class="player-meta">lores com alta alavanca</div>
          </article>
          <article class="metric-card procedural-metric ${narrativeDebug.lowImpactHighDecisionTeams ? "has-warning" : ""}">
            <span>Baixo impacto</span>
            <strong>${narrativeDebug.lowImpactHighDecisionTeams || 0}</strong>
            <div class="player-meta">decisao alta, pouca mudanca</div>
          </article>
          <article class="metric-card procedural-metric ${narrativeDebug.warnings?.length ? "has-warning" : ""}">
            <span>Narrativa warnings</span>
            <strong>${narrativeDebug.warnings?.length || 0}</strong>
            <div class="player-meta">${narrativeDebug.warnings?.length ? narrativeDebug.warnings.map(escapeHtml).join(" | ") : "coerencia ok"}</div>
          </article>
        </div>

        ${warningRows.length ? `
          <div class="table-wrap procedural-table-wrap">
            <table class="standings-table procedural-league-table">
              <thead>
                <tr>
                  <th>Clube</th>
                  <th>Obj.</th>
                  <th>Proj</th>
                  <th>Sim</th>
                  <th>Decisao</th>
                  <th>Sens.</th>
                  <th>Warnings</th>
                </tr>
              </thead>
              <tbody>
                ${warningRows.map((team) => `
                  <tr>
                    <td><strong>${escapeHtml(team.name)}</strong><div class="player-meta">${escapeHtml(team.loreLabel)}</div></td>
                    <td>${escapeHtml(team.objectiveProfile)}</td>
                    <td>${team.projectedRank}</td>
                    <td>${team.simulatedRank}</td>
                    <td>${escapeHtml(team.decisionLeverage?.label || "-")} (${formatNumber(team.decisionLeverage?.score)})</td>
                    <td>${team.decisionSensitivity ? `${team.decisionSensitivity.rankSwing} rank / ${team.decisionSensitivity.winsSwing}V` : "-"}</td>
                    <td>${team.warnings.map(escapeHtml).join(" | ")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderCareerLab(careerLab) {
    if (!careerLab) {
      return `<div class="procedural-empty">Gere uma liga para abrir a carreira experimental.</div>`;
    }
    const baseline = careerLab.baselineRow || {};
    const decision = careerLab.decisionRow || {};
    const delta = careerLab.resultDelta || {};
    const effect = careerLab.userPackage?.teamEffect || {};
    const stateDelta = careerLab.userPackage?.stateDelta || {};
    const rotation = careerLab.rotation || {};
    const rotationSummary = rotation.summary || {};
    return `
      <div class="procedural-league-preview">
        <div class="procedural-club-hero procedural-league-hero">
          <div>
            <span class="eyebrow">P6 - Carreira experimental</span>
            <h2>${escapeHtml(careerLab.userTeamName || "Seu clube")}</h2>
            <p>Simulacao isolada: suas decisoes alteram a temporada procedural sem mexer em save, mercado ou modo principal.</p>
          </div>
          <div class="procedural-club-badge">
            <span>Filosofia atual</span>
            <strong>${escapeHtml(careerLab.userStrategy)}</strong>
            <div class="player-meta">efeito ${formatNumber(effect.ratingDelta)} OVR | vol ${formatNumber(effect.volatilityDelta, 3)}</div>
          </div>
        </div>

        <div class="procedural-toolbar">
          <label class="control-card">
            <span>Direcao das decisoes</span>
            <select data-procedural-user-strategy>
              ${[
                ["balanced", "Equilibrada"],
                ["aggressive", "Agressiva"],
                ["development", "Desenvolver jovens"],
                ["conservative", "Poupar / controlar carga"],
                ["crisis_control", "Controle de crise"],
                ["lore_fit", "Coerente com a lore"]
              ].map(([value, label]) => renderOption(value, label, value === careerLab.userStrategy)).join("")}
            </select>
          </label>
          <div class="procedural-filter-count">
            <span>Impacto no ranking</span>
            <strong>${delta.rankSwing > 0 ? "+" : ""}${delta.rankSwing || 0}</strong>
          </div>
          <div class="procedural-filter-count">
            <span>Impacto em vitorias</span>
            <strong>${delta.winsSwing > 0 ? "+" : ""}${delta.winsSwing || 0}</strong>
          </div>
        </div>

        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Sem suas decisoes</span>
            <strong>${baseline.simulatedRank || "-"}o</strong>
            <div class="player-meta">${baseline.wins || 0}-${baseline.losses || 0} | saldo ${baseline.pointDiff || 0}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Com suas decisoes</span>
            <strong>${decision.simulatedRank || "-"}o</strong>
            <div class="player-meta">${decision.wins || 0}-${decision.losses || 0} | saldo ${decision.pointDiff || 0}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Moral / coesao</span>
            <strong>${stateDelta.morale > 0 ? "+" : ""}${formatNumber(stateDelta.morale || 0)}</strong>
            <div class="player-meta">coesao ${stateDelta.groupCohesion > 0 ? "+" : ""}${formatNumber(stateDelta.groupCohesion || 0)}</div>
          </article>
          <article class="metric-card procedural-metric ${Number(stateDelta.squadFatigue || 0) > 0 ? "has-warning" : ""}">
            <span>Fadiga / risco</span>
            <strong>${stateDelta.squadFatigue > 0 ? "+" : ""}${formatNumber(stateDelta.squadFatigue || 0)}</strong>
            <div class="player-meta">lesao ${stateDelta.injuryRisk > 0 ? "+" : ""}${formatNumber(stateDelta.injuryRisk || 0)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Campeao mudou?</span>
            <strong>${delta.championChanged ? "Sim" : "Nao"}</strong>
            <div class="player-meta">${escapeHtml(careerLab.decisionSimulation?.summary?.championName || "-")}</div>
          </article>
        </div>

        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Plano de rotacao</span>
            <strong>${escapeHtml(rotationSummary.plan || rotation.plan || "-")}</strong>
            <div class="player-meta">${rotationSummary.activePlayers || 0} atletas ativos</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Titulares / banco</span>
            <strong>${formatNumber(rotationSummary.starterAverage || 0)}</strong>
            <div class="player-meta">banco ${formatNumber(rotationSummary.benchAverage || 0)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Min. prospects</span>
            <strong>${formatNumber(rotationSummary.prospectMinutes || 0)}</strong>
            <div class="player-meta">desenvolvimento ${formatNumber(rotation.effect?.developmentDelta || 0)}</div>
          </article>
          <article class="metric-card procedural-metric ${Number(rotation.effect?.fatigueDelta || 0) > 1 ? "has-warning" : ""}">
            <span>Carga top 5</span>
            <strong>${formatNumber(rotationSummary.topFiveMinutes || 0)}</strong>
            <div class="player-meta">fadiga ${formatNumber(rotation.effect?.fatigueDelta || 0)}</div>
          </article>
        </div>

        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead>
              <tr>
                <th>Papel</th>
                <th>Jogador</th>
                <th>Pos</th>
                <th>Min</th>
                <th>CA</th>
                <th>POT</th>
                <th>Risco</th>
              </tr>
            </thead>
            <tbody>
              ${(rotation.rows || []).filter((row) => row.minutes > 0).slice(0, 10).map((row) => `
                <tr>
                  <td><span class="status-pill">${escapeHtml(row.role)}</span></td>
                  <td><strong>${escapeHtml(row.name)}</strong></td>
                  <td>${escapeHtml(row.pos)}</td>
                  <td>${formatNumber(row.minutes)}</td>
                  <td>${formatNumber(row.currentAbility, 0)}</td>
                  <td>${formatNumber(row.potential, 0)}</td>
                  <td>${formatNumber((row.injuryRisk || 0) * 100)}%</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead>
              <tr>
                <th>Sim</th>
                <th>Proj</th>
                <th>Clube</th>
                <th>V-D</th>
                <th>Saldo</th>
                <th>Lore</th>
              </tr>
            </thead>
            <tbody>
              ${(careerLab.decisionSimulation?.standings || []).map((row) => `
                <tr class="${row.teamId === careerLab.userTeamId ? "is-user-team" : ""}">
                  <td>${row.simulatedRank}</td>
                  <td>${row.projectedRank}</td>
                  <td><strong>${escapeHtml(row.name)}</strong></td>
                  <td>${row.wins}-${row.losses}</td>
                  <td>${row.pointDiff > 0 ? "+" : ""}${row.pointDiff}</td>
                  <td>${escapeHtml(row.loreLabel)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderLeaguePreview(league) {
    const userTeam = getTeamById(league, league.userTeamId);
    const favorites = (league.summary?.favorites || []).map((id) => getTeamById(league, id));
    const playoffBubble = (league.summary?.playoffBubble || []).map((id) => getTeamById(league, id));
    const survivalFight = (league.summary?.survivalFight || []).map((id) => getTeamById(league, id));
    return `
      <div class="procedural-league-preview">
        <div class="procedural-club-hero procedural-league-hero">
          <div>
            <span class="eyebrow">Liga procedural</span>
            <h2>${escapeHtml(league.seed)}</h2>
            <p>Preview isolado da liga completa. Nenhum clube, atleta, save ou mercado real e alterado.</p>
          </div>
          <div class="procedural-club-badge">
            <span>Seu clube inicial</span>
            <strong>${escapeHtml(userTeam?.name || "-")}</strong>
            <div class="player-meta">${escapeHtml(userTeam?.lore?.label || "")} | rank ${userTeam?.projectedRank || "-"}</div>
          </div>
        </div>

        ${renderLeagueSummary(league)}
        ${renderWarnings([...(league.summary?.warnings || []), ...(league.diagnostics?.warnings || [])])}
        ${renderLeagueDiagnostics(league)}
        ${renderLeagueSimulation(league.simulation)}
        ${renderLeagueNarrativeDebug(league.narrativeDebug)}

        <div class="procedural-league-groups">
          <article class="procedural-top-card">
            <h3>Favoritos</h3>
            ${favorites.map(renderLeagueTeamMini).join("")}
          </article>
          <article class="procedural-top-card">
            <h3>Briga por playoffs</h3>
            ${playoffBubble.slice(0, 5).map(renderLeagueTeamMini).join("")}
          </article>
          <article class="procedural-top-card">
            <h3>Parte baixa</h3>
            ${survivalFight.map(renderLeagueTeamMini).join("")}
          </article>
        </div>

        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Clube</th>
                <th>Lore</th>
                <th>Tier</th>
                <th>Estilo</th>
                <th>OVR</th>
                <th>CA</th>
                <th>POT</th>
                <th>Idade</th>
                <th>Orc.</th>
                <th>Folha</th>
                <th>Objetivo</th>
              </tr>
            </thead>
            <tbody>
              ${(league.standingsPreview || []).map((team) => `
                <tr class="${team.id === league.userTeamId ? "is-user-team" : ""}">
                  <td>${team.projectedRank}</td>
                  <td>
                    <strong>${escapeHtml(team.name)}</strong>
                    <div class="player-meta">${escapeHtml(team.city)} | ${escapeHtml(team.leagueTier)}</div>
                  </td>
                  <td>${escapeHtml(team.lore?.label || "-")}</td>
                  <td><span class="status-pill">${escapeHtml(team.strengthTier)}</span></td>
                  <td>${escapeHtml(team.rosterStyle)}</td>
                  <td>${formatNumber(team.rating?.overall)}</td>
                  <td>${formatNumber(team.rating?.current)}</td>
                  <td>${formatNumber(team.rating?.potential)}</td>
                  <td>${formatNumber(team.rating?.averageAge)}</td>
                  <td>$${formatNumber(team.budget)}M</td>
                  <td>${formatNumber(team.rating?.salaryPressure)}%</td>
                  <td>${escapeHtml(team.objective)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderMarketSourceCard(title, market, sourceLabel) {
    const summary = market?.summary || {};
    return `
      <article class="procedural-top-card">
        <h3>${escapeHtml(title)}</h3>
        <div class="procedural-top-row"><span>Fonte</span><strong>${escapeHtml(sourceLabel)}</strong></div>
        <div class="procedural-top-row"><span>Atletas</span><strong>${summary.count || market?.players?.length || 0}</strong></div>
        <div class="procedural-top-row"><span>Salario medio</span><strong>$${formatNumber(summary.averageSalary)}M</strong></div>
        <div class="procedural-top-row"><span>Forca estimada</span><strong>${formatNumber(summary.averageCurrentAbility)}</strong></div>
        <div class="procedural-top-row"><span>Potencial</span><strong>${formatNumber(summary.averagePotential)}</strong></div>
      </article>
    `;
  }

  function renderMarketMiniTable(title, players, source) {
    return `
      <article class="procedural-top-card procedural-debug-card">
        <h3>${escapeHtml(title)}</h3>
        <div class="table-wrap procedural-mini-table-wrap">
          <table class="standings-table procedural-mini-table">
            <thead>
              <tr>
                <th>Jogador</th>
                <th>Pos</th>
                <th>CA</th>
                <th>POT</th>
                <th>Sal.</th>
                <th>Perfil</th>
              </tr>
            </thead>
            <tbody>
              ${(players || []).slice(0, 10).map((player) => `
                <tr>
                  <td>
                    <strong>${escapeHtml(player.name)}</strong>
                    <div class="player-meta">${escapeHtml(getArchetypeLabel(player))}</div>
                  </td>
                  <td>${escapeHtml(player.pos)}</td>
                  <td>${formatNumber(player.currentAbility, 0)}</td>
                  <td>${formatNumber(player.potential, 0)}</td>
                  <td>$${formatNumber(player.salary)}M</td>
                  <td>${escapeHtml(source === "legacy" ? player.marketFit || player.pool || "-" : player.marketFit || "-")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </article>
    `;
  }

  function renderMarketComparison(fixedMarket, market) {
    if (!fixedMarket) {
      return `
        <div class="procedural-warning-list is-clean">
          Mercado fixo indisponivel neste laboratorio isolado. Abra o jogo completo para comparar com o mercado legado.
        </div>
      `;
    }
    const fixedSummary = fixedMarket.summary || {};
    const proceduralSummary = market.summary || {};
    const salaryDelta = (proceduralSummary.averageSalary || 0) - (fixedSummary.averageSalary || 0);
    const abilityDelta = (proceduralSummary.averageCurrentAbility || 0) - (fixedSummary.averageCurrentAbility || 0);
    return `
      <div class="procedural-league-groups">
        ${renderMarketSourceCard("Mercado fixo atual", fixedMarket, fixedMarket.label || "script.js")}
        ${renderMarketSourceCard("Mercado procedural", market, market.profile)}
        <article class="procedural-top-card">
          <h3>Diferenca procedural</h3>
          <div class="procedural-top-row"><span>Salario medio</span><strong>${salaryDelta > 0 ? "+" : ""}$${formatNumber(salaryDelta)}M</strong></div>
          <div class="procedural-top-row"><span>Forca media</span><strong>${abilityDelta > 0 ? "+" : ""}${formatNumber(abilityDelta)}</strong></div>
          <div class="procedural-top-row"><span>Atletas</span><strong>${(market.players?.length || 0) - (fixedMarket.players?.length || 0)}</strong></div>
          <div class="procedural-top-row"><span>Status</span><strong>somente preview</strong></div>
        </article>
      </div>
      <div class="procedural-league-groups">
        ${renderMarketMiniTable("Top fixo por valor", (fixedMarket.players || []).slice().sort((a, b) => b.marketValueScore - a.marketValueScore), "legacy")}
        ${renderMarketMiniTable("Top procedural por valor", (market.players || []).slice().sort((a, b) => b.marketValueScore - a.marketValueScore), "procedural")}
      </div>
    `;
  }

  function renderMarketFitPreview(fit) {
    if (!fit) {
      return `<div class="procedural-empty">Gere um clube e um mercado para calcular encaixes.</div>`;
    }
    return `
      <div class="procedural-summary-grid">
        <article class="metric-card procedural-metric">
          <span>Clube analisado</span>
          <strong>${escapeHtml(fit.clubName || "-")}</strong>
          <div class="player-meta">${escapeHtml(fit.intent || "balanced")}</div>
        </article>
        <article class="metric-card procedural-metric">
          <span>Espaco financeiro</span>
          <strong>$${formatNumber(fit.budgetLeft)}M</strong>
          <div class="player-meta">preview, sem contratar</div>
        </article>
        <article class="metric-card procedural-metric">
          <span>Carencias</span>
          <strong>${fit.neededPositions?.length ? fit.neededPositions.join(" / ") : "Nenhuma"}</strong>
          <div class="player-meta">${fit.warnings?.length || 0} alertas</div>
        </article>
        <article class="metric-card procedural-metric ${fit.warnings?.length ? "has-warning" : ""}">
          <span>Melhor encaixe</span>
          <strong>${formatNumber(fit.topFits?.[0]?.clubFitScore || 0)}</strong>
          <div class="player-meta">${escapeHtml(fit.topFits?.[0]?.name || "-")}</div>
        </article>
      </div>
      ${renderWarnings(fit.warnings)}
      <div class="table-wrap procedural-table-wrap">
        <table class="standings-table procedural-league-table">
          <thead>
            <tr>
              <th>Fit</th>
              <th>Jogador</th>
              <th>Pos</th>
              <th>CA</th>
              <th>POT</th>
              <th>Salario</th>
              <th>Cabe?</th>
              <th>Depois</th>
              <th>Saida sugerida</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            ${(fit.topFits || []).map((player) => `
              <tr>
                <td><strong>${formatNumber(player.clubFitScore)}</strong></td>
                <td>
                  <strong>${escapeHtml(player.name)}</strong>
                  <div class="player-meta">${escapeHtml(getArchetypeLabel(player))}</div>
                </td>
                <td><span class="status-pill">${escapeHtml(player.pos)}</span></td>
                <td>${formatNumber(player.currentAbility, 0)}</td>
                <td>${formatNumber(player.potential, 0)}</td>
                <td>$${formatNumber(player.salary)}M</td>
                <td>${player.affordable ? "Sim" : "Nao"}</td>
                <td>
                  <strong>${escapeHtml(player.sandbox?.verdict || "-")}</strong>
                  <div class="player-meta">CA ${player.sandbox?.delta?.averageCurrentAbility > 0 ? "+" : ""}${formatNumber(player.sandbox?.delta?.averageCurrentAbility || 0)} | folha ${player.sandbox?.delta?.totalSalary > 0 ? "+" : ""}$${formatNumber(player.sandbox?.delta?.totalSalary || 0)}M</div>
                </td>
                <td>${escapeHtml(player.sandbox?.outgoing?.name || "Sem corte")}</td>
                <td>${escapeHtml(player.clubFitReason)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderMarketPreview(market, fixedMarketSnapshot, marketFit) {
    if (!market) {
      return `<div class="procedural-empty">Gerador de mercado procedural ainda nao carregado.</div>`;
    }
    const fixedMarket = window.TemporadaTotal?.getLegacyBasketballMarketSnapshot?.() || fixedMarketSnapshot || null;
    const summary = market.summary || {};
    return `
      <div class="procedural-league-preview">
        <div class="procedural-club-hero procedural-league-hero">
          <div>
            <span class="eyebrow">P7.1 - Comparacao de mercado</span>
            <h2>${escapeHtml(market.seed)}</h2>
            <p>Compara o mercado fixo atual com agentes livres procedurais. Nao contrata, nao altera mercado fixo e nao salva nada.</p>
          </div>
          <div class="procedural-club-badge">
            <span>Perfil do mercado</span>
            <strong>${escapeHtml(market.profile)}</strong>
            <div class="player-meta">${market.count} atletas disponiveis</div>
          </div>
        </div>

        <div class="procedural-toolbar">
          <label class="control-card">
            <span>Perfil</span>
            <select data-procedural-market-profile>
              ${[
                ["balanced", "Equilibrado"],
                ["win_now", "Vencer agora"],
                ["budget", "Baixo custo"],
                ["development", "Desenvolvimento"]
              ].map(([value, label]) => renderOption(value, label, value === market.profile)).join("")}
            </select>
          </label>
          <div class="procedural-filter-count">
            <span>Modo seguro</span>
            <strong>Preview</strong>
          </div>
        </div>

        <div class="procedural-summary-grid">
          <article class="metric-card procedural-metric">
            <span>Atletas</span>
            <strong>${summary.count || market.players.length}</strong>
            <div class="player-meta">seed ${escapeHtml(market.seed)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Salario medio</span>
            <strong>$${formatNumber(summary.averageSalary)}M</strong>
            <div class="player-meta">total $${formatNumber(summary.totalSalary)}M</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Forca media</span>
            <strong>${formatNumber(summary.averageCurrentAbility)}</strong>
            <div class="player-meta">pot ${formatNumber(summary.averagePotential)}</div>
          </article>
          <article class="metric-card procedural-metric">
            <span>Idade / gap</span>
            <strong>${formatNumber(summary.averageAge)}</strong>
            <div class="player-meta">gap ${formatNumber(summary.averageDevelopmentGap)}</div>
          </article>
          <article class="metric-card procedural-metric ${market.warnings?.length ? "has-warning" : ""}">
            <span>Warnings</span>
            <strong>${market.warnings?.length || 0}</strong>
            <div class="player-meta">${market.warnings?.length ? "revisar mercado" : "sem alerta"}</div>
          </article>
        </div>

        ${renderWarnings(market.warnings)}
        ${renderMarketComparison(fixedMarket, market)}
        ${renderMarketFitPreview(marketFit)}

        <div class="procedural-league-groups">
          <article class="procedural-top-card">
            <h3>Distribuicao por posicao</h3>
            ${Object.entries(summary.byPosition || {}).map(([position, count]) => `
              <div class="procedural-top-row"><span>${escapeHtml(position)}</span><strong>${count}</strong></div>
            `).join("")}
          </article>
          <article class="procedural-top-card">
            <h3>Perfil do mercado</h3>
            ${Object.entries(summary.byPool || {}).map(([pool, count]) => `
              <div class="procedural-top-row"><span>${escapeHtml(pool)}</span><strong>${count}</strong></div>
            `).join("")}
          </article>
          <article class="procedural-top-card">
            <h3>Melhores valores</h3>
            ${(summary.topValue || []).slice(0, 5).map((player) => `
              <div class="procedural-top-row">
                <span>${escapeHtml(player.name)} <small>${escapeHtml(player.pos)}</small></span>
                <strong>${formatNumber(player.marketValueScore)}</strong>
              </div>
            `).join("")}
          </article>
        </div>

        <div class="table-wrap procedural-table-wrap">
          <table class="standings-table procedural-league-table">
            <thead>
              <tr>
                <th>Jogador</th>
                <th>Pos</th>
                <th>Idade</th>
                <th>CA</th>
                <th>POT</th>
                <th>Gap</th>
                <th>Salario</th>
                <th>Valor</th>
                <th>Mercado</th>
                <th>Risco</th>
              </tr>
            </thead>
            <tbody>
              ${(market.players || []).map((player) => `
                <tr>
                  <td>
                    <strong>${escapeHtml(player.name)}</strong>
                    <div class="player-meta">${escapeHtml(getArchetypeLabel(player))}</div>
                  </td>
                  <td><span class="status-pill">${escapeHtml(player.pos)}</span></td>
                  <td>${player.age}</td>
                  <td>${player.currentAbility}</td>
                  <td>${player.potential}</td>
                  <td>${player.developmentGap}</td>
                  <td>$${formatNumber(player.salary)}M</td>
                  <td>${formatNumber(player.marketValueScore)}</td>
                  <td>${escapeHtml(player.marketFit)}</td>
                  <td>${escapeHtml(player.riskLabel || "-")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function createProceduralPreviewUI(root, options = {}) {
    if (!root) return null;

    const state = {
      seed: options.seed || DEFAULT_SEED,
      count: options.count || 200,
      strengthTier: options.strengthTier || "normal",
      viewMode: "class",
      position: "all",
      archetype: "all",
      result: null,
      roster: null,
      club: null,
      league: null,
      careerLab: null,
      market: null,
      fixedMarket: null,
      marketFit: null,
      marketProfile: "balanced",
      userStrategy: "balanced"
    };

    function generate() {
      if (!window.TemporadaTotal?.previewProceduralBasketballClass) {
        root.innerHTML = `
          <div class="procedural-empty">
            Modulos procedurais nao carregados. Confira a ordem dos scripts no index.html.
          </div>
        `;
        return;
      }
      state.result = window.TemporadaTotal.previewProceduralBasketballClass(state.seed, state.count, {
        strengthTier: state.strengthTier,
        silent: true
      });
      state.roster = window.TemporadaTotal?.generateProceduralBasketballRoster?.(state.seed, {
        budget: 78
      }) || null;
      state.club = window.TemporadaTotal?.generateProceduralBasketballClub?.(state.seed) || null;
      state.league = window.TemporadaTotal?.generateProceduralBasketballLeague?.(state.seed, {
        size: 16,
        userTeamIndex: 0
      }) || null;
      if (state.league && window.TemporadaTotal?.simulateProceduralLeagueSeason) {
        state.league.simulation = window.TemporadaTotal.simulateProceduralLeagueSeason(state.league, {
          simulationIndex: 1
        });
      }
      if (state.league && state.league.simulation && window.TemporadaTotal?.analyzeProceduralNarrative) {
        state.league.narrativeDebug = window.TemporadaTotal.analyzeProceduralNarrative(state.league, state.league.simulation, {
          simulationIndex: 1
        });
      }
      state.careerLab = window.TemporadaTotal?.simulateProceduralCareerLab?.(state.league, {
        userStrategy: state.userStrategy,
        simulationIndex: 1
      }) || null;
      state.market = window.TemporadaTotal?.generateProceduralBasketballMarket?.(state.seed, {
        count: 24,
        profile: state.marketProfile
      }) || null;
      state.fixedMarket = window.TemporadaTotal?.getLegacyBasketballMarketSnapshot?.() || null;
      state.marketFit = state.club && state.market && window.TemporadaTotal?.analyzeProceduralMarketFitForClub
        ? window.TemporadaTotal.analyzeProceduralMarketFitForClub(state.club, state.market, { limit: 8 })
        : null;
      state.position = "all";
      state.archetype = "all";
      render();
    }

    function render() {
      const result = state.result;
      if (!result) {
        root.innerHTML = `<div class="procedural-empty">Clique em gerar para visualizar uma classe procedural.</div>`;
        return;
      }

      const archetypes = getOptions(result.players, getArchetypeLabel);
      const filteredPlayers = getFilteredPlayers(result.players, state);
      root.innerHTML = `
        <div class="procedural-preview-panel">
          <div class="procedural-toolbar">
            <label class="control-card">
              <span>Seed</span>
              <input data-procedural-seed type="text" value="${escapeHtml(state.seed)}">
            </label>
            <label class="control-card">
              <span>Quantidade</span>
              <input data-procedural-count type="number" min="20" max="500" step="10" value="${state.count}">
            </label>
            <label class="control-card">
              <span>Tier</span>
              <select data-procedural-tier>
                ${["normal", "low", "good", "elite", "prospect"].map((tier) => renderOption(tier, tier, tier === state.strengthTier)).join("")}
              </select>
            </label>
            <button class="primary-button" data-procedural-generate type="button">Gerar preview</button>
          </div>

          <div class="procedural-mode-toggle">
            <button class="${state.viewMode === "class" ? "is-active" : ""}" data-procedural-mode="class" type="button">Classe de jogadores</button>
            <button class="${state.viewMode === "roster" ? "is-active" : ""}" data-procedural-mode="roster" type="button">Elenco gerado</button>
            <button class="${state.viewMode === "club" ? "is-active" : ""}" data-procedural-mode="club" type="button">Clube gerado</button>
            <button class="${state.viewMode === "league" ? "is-active" : ""}" data-procedural-mode="league" type="button">Liga gerada</button>
            <button class="${state.viewMode === "career" ? "is-active" : ""}" data-procedural-mode="career" type="button">Carreira experimental</button>
            <button class="${state.viewMode === "market" ? "is-active" : ""}" data-procedural-mode="market" type="button">Mercado procedural</button>
          </div>

          ${state.viewMode === "market" ? renderMarketPreview(state.market, state.fixedMarket, state.marketFit) : state.viewMode === "career" ? renderCareerLab(state.careerLab) : state.viewMode === "league" && state.league ? renderLeaguePreview(state.league) : state.viewMode === "club" && state.club ? renderClubPreview(state.club) : state.viewMode === "roster" && state.roster ? renderRosterPreview(state.roster) : `
            ${renderSummary(result)}
            ${renderWarnings(result.warnings)}
            ${renderDistribution(result)}

            <div class="procedural-filters">
              <label class="control-card">
                <span>Posicao</span>
                <select data-procedural-position>
                  ${renderOption("all", "Todas", state.position === "all")}
                  ${["PG", "SG", "SF", "PF", "C"].map((position) => renderOption(position, position, position === state.position)).join("")}
                </select>
              </label>
              <label class="control-card">
                <span>Arquetipo</span>
                <select data-procedural-archetype>
                  ${renderOption("all", "Todos", state.archetype === "all")}
                  ${archetypes.map((archetype) => renderOption(archetype, archetype, archetype === state.archetype)).join("")}
                </select>
              </label>
              <div class="procedural-filter-count">
                <span>Resultado filtrado</span>
                <strong>${filteredPlayers.length}</strong>
              </div>
            </div>

            ${renderTopLists(result)}
            ${renderScoutPanel(filteredPlayers)}
            ${renderPlayerTable(filteredPlayers)}
          `}
        </div>
      `;
    }

    root.addEventListener("click", (event) => {
      if (!event.target.closest("[data-procedural-generate]")) return;
      state.seed = root.querySelector("[data-procedural-seed]")?.value.trim() || DEFAULT_SEED;
      state.count = Math.min(500, Math.max(20, Number(root.querySelector("[data-procedural-count]")?.value) || 200));
      state.strengthTier = root.querySelector("[data-procedural-tier]")?.value || "normal";
      generate();
    });

    root.addEventListener("click", (event) => {
      const modeButton = event.target.closest("[data-procedural-mode]");
      if (!modeButton) return;
      state.viewMode = modeButton.dataset.proceduralMode || "class";
      render();
    });

    root.addEventListener("change", (event) => {
      if (event.target.matches("[data-procedural-position]")) {
        state.position = event.target.value;
        render();
      }
      if (event.target.matches("[data-procedural-archetype]")) {
        state.archetype = event.target.value;
        render();
      }
      if (event.target.matches("[data-procedural-tier]")) {
        state.strengthTier = event.target.value;
      }
      if (event.target.matches("[data-procedural-user-strategy]")) {
        state.userStrategy = event.target.value || "balanced";
        state.careerLab = window.TemporadaTotal?.simulateProceduralCareerLab?.(state.league, {
          userStrategy: state.userStrategy,
          simulationIndex: 1
        }) || null;
        render();
      }
      if (event.target.matches("[data-procedural-market-profile]")) {
        state.marketProfile = event.target.value || "balanced";
        state.market = window.TemporadaTotal?.generateProceduralBasketballMarket?.(state.seed, {
          count: 24,
          profile: state.marketProfile
        }) || null;
        state.fixedMarket = window.TemporadaTotal?.getLegacyBasketballMarketSnapshot?.() || state.fixedMarket;
        state.marketFit = state.club && state.market && window.TemporadaTotal?.analyzeProceduralMarketFitForClub
          ? window.TemporadaTotal.analyzeProceduralMarketFitForClub(state.club, state.market, { limit: 8 })
          : null;
        render();
      }
    });

    generate();
    return { generate, render };
  }

  function autoInitProceduralPreview() {
    const root = document.querySelector("[data-procedural-preview-root]");
    if (root) createProceduralPreviewUI(root);
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    createProceduralPreviewUI
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInitProceduralPreview);
  } else {
    autoInitProceduralPreview();
  }
})();
