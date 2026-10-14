(function () {
  function generatePotentialLabel(player) {
    const gap = (Number(player.potential) || 0) - (Number(player.currentAbility) || 0);
    if ((player.potential || 0) >= 92) return "Teto de estrela";
    if (gap >= 16) return "Grande margem de evolucao";
    if (gap >= 9) return "Boa margem de evolucao";
    if (gap >= 4) return "Crescimento moderado";
    return "Perfil quase pronto";
  }

  function generateRiskLabel(player) {
    const volatility = Number(player.volatility) || 0;
    const injuryRisk = Number(player.injuryRisk) || 0;
    if (volatility >= 0.75 || injuryRisk >= 0.2) return "Risco alto";
    if (volatility >= 0.58 || injuryRisk >= 0.15) return "Risco medio";
    return "Risco baixo";
  }

  function generatePlayerScoutNotes(player, config = {}) {
    const notes = [];
    const attributes = player.attributes || player;
    const threePoint = Number(attributes.threePoint) || 0;
    const physical = Number(attributes.physical) || 0;
    const tactical = Number(attributes.tactical) || 0;
    const technique = Number(attributes.technique) || 0;
    const defense = Number(attributes.defense) || 0;
    const currentAbility = Number(player.currentAbility) || 0;
    const potential = Number(player.potential) || currentAbility;
    const age = Number(player.age) || 0;
    const growthGap = potential - currentAbility;
    const salaryFactor = config.salaryWarningFactor || 0.22;

    if (threePoint >= 82) {
      notes.push("Arremesso confiavel para punir ajudas e espacamentos longos.");
    }
    if (threePoint >= 86 && technique >= 78) {
      notes.push("Pode virar espacador premium ou pontuador de perimetro se receber volume.");
    }
    if (defense >= 82) {
      notes.push("Impacto defensivo acima da media, com valor em trocas e contencao.");
    }
    if (physical >= 84) {
      notes.push("Presenca fisica clara em contato, transicao e disputa de espaco.");
    }
    if (tactical >= 84) {
      notes.push("Leitura de jogo madura; tende a tomar decisoes corretas sob pressao.");
    }
    if (technique >= 84) {
      notes.push("Fundamentos refinados e bom controle para executar acoes dificeis.");
    }
    if (growthGap >= 14) {
      notes.push("Alto teto de desenvolvimento se receber minutos e treino consistente.");
    }
    if (growthGap <= 4 && age >= 28) {
      notes.push("Jogador pronto para contribuir agora, mas com pouco crescimento restante.");
    }
    if ((Number(player.volatility) || 0) >= 0.7) {
      notes.push("Rendimento pode oscilar; pede gestao de confianca e papel bem definido.");
    }
    if ((Number(player.injuryRisk) || 0) >= 0.18) {
      notes.push("Risco fisico exige controle de carga e plano de recuperacao.");
    }
    if ((Number(player.salary) || 0) > currentAbility * salaryFactor) {
      notes.push("Contrato pede atencao: custo pode ficar alto para a producao atual.");
    }

    if (!notes.length) {
      notes.push("Perfil equilibrado, sem alerta extremo nos indicadores principais.");
    }
    return notes;
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralScouting: {
      generatePlayerScoutNotes,
      generatePotentialLabel,
      generateRiskLabel
    }
  };
})();
