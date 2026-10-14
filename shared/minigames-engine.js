(function () {
  const namespace = (window.TemporadaTotal = window.TemporadaTotal || {});

  // Sintetizador de efeitos sonoros arcade usando Web Audio API nativo
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!soundEnabled) return null;
    try {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    } catch {
      return null;
    }
  }

  function playArcadeSound(type) {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "perfect") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.22); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === "good") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(587.33, now + 0.09); // D5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "miss") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(850, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio not permitted or blocked
    }
  }

  // Suíte rica de minijogos (3 drills arcade específicos por modalidade)
  const MINIGAME_SUITES = {
    basquete: [
      {
        id: "basquete_clutch",
        title: "Arremesso Clutch de 3",
        shortTitle: "Arremesso de 3",
        icon: "🏀",
        subtitle: "Calibre a mão no perímetro no ápice da parábola!",
        actionLabel: "ARREMESSAR!",
        courtColor: "#9c3c12",
        lineColor: "#fde047",
        ballColor: "#ff7a29",
        targetName: "Aro & Tabela",
        bonusLabel: "Arremesso Perimetral & Confiança Clutch",
        statBoost: "ataque",
        mechanic: "arc_shot",
        speed: 2.3,
        sweetSpotWidth: 12
      },
      {
        id: "basquete_pnr",
        title: "Passe Rápido & Pick-and-Roll",
        shortTitle: "Passe & Garrafão",
        icon: "⚡",
        subtitle: "Encontre a brecha entre os marcadores para acionar o pivô!",
        actionLabel: "PASSAR A BOLA!",
        courtColor: "#85310d",
        lineColor: "#38bdf8",
        ballColor: "#ff7a29",
        targetName: "Linha de Passe",
        bonusLabel: "Visão de Jogo & Entrosamento Rápido",
        statBoost: "quimica",
        mechanic: "moving_gap",
        speed: 3.1,
        sweetSpotWidth: 10
      },
      {
        id: "basquete_block",
        title: "Toco & Rebote Protetor",
        shortTitle: "Toco & Defesa",
        icon: "🛡️",
        subtitle: "Suba no tempo exato para barrar a infiltração adversária!",
        actionLabel: "DAR O TOCO!",
        courtColor: "#71270c",
        lineColor: "#f87171",
        ballColor: "#ff8c42",
        targetName: "Topo do Aro",
        bonusLabel: "Proteção de Garrafão & Rebote Firme",
        statBoost: "defesa",
        mechanic: "vertical_block",
        speed: 2.7,
        sweetSpotWidth: 11
      }
    ],
    futsal: [
      {
        id: "futsal_penalty",
        title: "Pênalti & Chute no Ângulo",
        shortTitle: "Pênalti no Ângulo",
        icon: "⚽",
        subtitle: "Acerte a gaveta fora do alcance do goleiro adversário!",
        actionLabel: "FINALIZAR!",
        courtColor: "#1e3a5f",
        lineColor: "#71d6eb",
        ballColor: "#ffffff",
        targetName: "Ângulo da Trave",
        bonusLabel: "Finalização Cirúrgica no Ângulo",
        statBoost: "ataque",
        mechanic: "moving_target",
        speed: 2.5,
        sweetSpotWidth: 12
      },
      {
        id: "futsal_gk",
        title: "Paredão do Goleiro",
        shortTitle: "Paredão / Defesa",
        icon: "🧤",
        subtitle: "Feche o ângulo e espalme o tiro à queima-roupa no reflexo!",
        actionLabel: "DEFENDER!",
        courtColor: "#172554",
        lineColor: "#facc15",
        ballColor: "#f8fafc",
        targetName: "Trave & Reflexo",
        bonusLabel: "Segurança de Goleiro & Defesa Blindada",
        statBoost: "defesa",
        mechanic: "gk_save",
        speed: 3.0,
        sweetSpotWidth: 10
      },
      {
        id: "futsal_tiki",
        title: "Tabelinha Rápida & Chute de Primeira",
        shortTitle: "Tabelinha & Chute",
        icon: "🎯",
        subtitle: "Devolva de primeira no espaço vazio da zaga!",
        actionLabel: "BATER DE CHAPA!",
        courtColor: "#134e4a",
        lineColor: "#a7f3d0",
        ballColor: "#ffffff",
        targetName: "Espaço Vazio",
        bonusLabel: "Velocidade de Transição & Pressão Alta",
        statBoost: "transicao",
        mechanic: "one_touch",
        speed: 2.6,
        sweetSpotWidth: 13
      }
    ],
    volei: [
      {
        id: "volei_serve",
        title: "Saque Viagem Potente",
        shortTitle: "Saque Ace",
        icon: "🏐",
        subtitle: "Salte no ponto mais alto e solte o braço na linha de fundo!",
        actionLabel: "SOLTAR O SAQUE!",
        courtColor: "#2d4a3e",
        lineColor: "#fde047",
        ballColor: "#ffdd53",
        targetName: "Linha de Fundo",
        bonusLabel: "Pressão de Saque & Aces Decisivos",
        statBoost: "saque",
        mechanic: "jump_serve",
        speed: 2.4,
        sweetSpotWidth: 12
      },
      {
        id: "volei_reception",
        title: "Manchete & Recepção Perfeita",
        shortTitle: "Recepção / Passe",
        icon: "🛡️",
        subtitle: "Amorteça o saque pesado e entregue na mão do levantador!",
        actionLabel: "AMORTECER PASSE!",
        courtColor: "#1e3a5f",
        lineColor: "#93c5fd",
        ballColor: "#fef08a",
        targetName: "Passe na Mão",
        bonusLabel: "Passe Estável & Qualidade de Rallies",
        statBoost: "passe",
        mechanic: "reception_cushion",
        speed: 2.8,
        sweetSpotWidth: 11
      },
      {
        id: "volei_spike",
        title: "Ataque na Paralela & Explora Bloqueio",
        shortTitle: "Ataque na Rede",
        icon: "💥",
        subtitle: "Acerte a diagonal rápida fugindo da mão do bloqueador central!",
        actionLabel: "CRAVAR NA QUADRA!",
        courtColor: "#3b1e54",
        lineColor: "#f472b6",
        ballColor: "#fde047",
        targetName: "Paralela Livre",
        bonusLabel: "Poder de Ataque & Virada de Bola",
        statBoost: "ataque",
        mechanic: "spike_timing",
        speed: 3.1,
        sweetSpotWidth: 10
      }
    ]
  };

  const MINIGAME_CONFIGS = {
    basquete: MINIGAME_SUITES.basquete[0],
    futsal: MINIGAME_SUITES.futsal[0],
    volei: MINIGAME_SUITES.volei[0]
  };

  class MinigameController {
    constructor(container, options = {}) {
      this.container = container;
      this.sportId = options.sportId || "basquete";
      this.suite = MINIGAME_SUITES[this.sportId] || MINIGAME_SUITES.basquete;

      const requestedDrillId = options.drillId || "";
      this.currentDrill = this.suite.find((d) => d.id === requestedDrillId) || this.suite[0];

      this.onFinish = options.onFinish || null;
      this.onPlayLive = options.onPlayLive || null;
      this.onSimulate = options.onSimulate || null;
      this.onCancel = options.onCancel || null;
      this.state = options.gameState || null;

      this.running = false;
      this.animFrame = null;
      this.attemptsLeft = 3;
      this.currentScore = 0;
      this.history = [];
      this.cursor = 0;
      this.direction = 1;
      this.speed = this.currentDrill.speed || 2.4;
      this.targetX = 50;
      this.targetSpeed = 1.6;
      this.targetDir = 1;

      this.render();
      this.bindEvents();
    }

    setDrill(drillId) {
      const found = this.suite.find((d) => d.id === drillId);
      if (!found || found.id === this.currentDrill.id) return;
      this.destroy();
      this.currentDrill = found;
      this.attemptsLeft = 3;
      this.currentScore = 0;
      this.history = [];
      this.cursor = 0;
      this.direction = 1;
      this.speed = found.speed || 2.4;
      this.targetX = 50;
      this.targetDir = 1;
      playArcadeSound("click");
      this.render();
      this.bindEvents();
    }

    render() {
      const drill = this.currentDrill;
      this.container.innerHTML = `
        <div class="arcade-minigame-wrapper">
          <!-- Seletor de Drills de Aquecimento -->
          <div class="arcade-drill-selector">
            <span class="drill-selector-label">Escolha o Desafio de Aquecimento:</span>
            <div class="drill-pills-row">
              ${this.suite.map((d) => `
                <button type="button" class="drill-pill-btn ${d.id === drill.id ? "is-active" : ""}" data-drill-id="${d.id}">
                  <span class="drill-pill-icon">${d.icon}</span>
                  <span class="drill-pill-name">${d.shortTitle}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="arcade-minigame-header">
            <div class="arcade-badge-row">
              <span class="arcade-chip sport-chip">${drill.icon} ${drill.title}</span>
              <span class="arcade-chip attempts-chip">Tentativas: <strong>${this.attemptsLeft}/3</strong></span>
              <span class="arcade-chip score-chip">Pontuação: <strong>${this.currentScore} pts</strong></span>
            </div>
            <p class="arcade-subtitle">${drill.subtitle}</p>
          </div>

          <div class="arcade-screen">
            <canvas class="arcade-canvas" width="640" height="260"></canvas>
            <div class="arcade-overlay-msg" style="display: none;"></div>
          </div>

          <!-- Barra de Medição / Timing Meter -->
          <div class="arcade-meter-container">
            <div class="arcade-meter-bar">
              <div class="meter-zone zone-miss-left"></div>
              <div class="meter-zone zone-good-left"></div>
              <div class="meter-zone zone-perfect"><span>SWEET SPOT</span></div>
              <div class="meter-zone zone-good-right"></div>
              <div class="meter-zone zone-miss-right"></div>
              <div class="meter-cursor"></div>
            </div>
          </div>

          <div class="arcade-controls">
            <button type="button" class="arcade-btn-shoot primary-arcade-button">
              <span class="btn-icon">⚡</span> ${drill.actionLabel} (Espaço)
            </button>
            <button type="button" class="arcade-btn-toggle-sound secondary-arcade-button" title="Ligar/Desligar Som">
              ${soundEnabled ? "🔊 Som Ativado" : "🔇 Som Mutado"}
            </button>
          </div>

          <div class="arcade-feedback-log">
            ${this.renderHistory()}
          </div>
        </div>
      `;

      this.canvas = this.container.querySelector(".arcade-canvas");
      this.ctx = this.canvas?.getContext("2d");
      this.cursorEl = this.container.querySelector(".meter-cursor");
      this.overlayEl = this.container.querySelector(".arcade-overlay-msg");
      this.startLoop();
    }

    renderHistory() {
      if (!this.history.length) {
        return `<p class="arcade-hint">Pressione o botão ou a barra de espaço no momento ideal para testar seus reflexos e ganhar bônus!</p>`;
      }
      return `
        <div class="arcade-history-tags">
          ${this.history.map((h, i) => `
            <span class="history-tag is-${h.rating}">#${i + 1}: ${h.label} (+${h.pts} pts)</span>
          `).join("")}
        </div>
      `;
    }

    bindEvents() {
      const shootBtn = this.container.querySelector(".arcade-btn-shoot");
      const soundBtn = this.container.querySelector(".arcade-btn-toggle-sound");

      shootBtn?.addEventListener("click", () => this.handleAction());
      soundBtn?.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? "🔊 Som Ativado" : "🔇 Som Mutado";
      });

      const drillBtns = this.container.querySelectorAll("[data-drill-id]");
      drillBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.setDrill(btn.dataset.drillId);
        });
      });

      this.keyHandler = (e) => {
        if (e.code === "Space" && this.running && this.attemptsLeft > 0) {
          e.preventDefault();
          this.handleAction();
        }
      };
      window.addEventListener("keydown", this.keyHandler);
    }

    startLoop() {
      this.running = true;
      let lastTime = performance.now();

      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min(32, now - lastTime) / 16.66;
        lastTime = now;

        // Atualizar cursor da barra de timing (0 a 100)
        this.cursor += this.direction * this.speed * dt;
        if (this.cursor >= 100) {
          this.cursor = 100;
          this.direction = -1;
        } else if (this.cursor <= 0) {
          this.cursor = 0;
          this.direction = 1;
        }

        if (this.cursorEl) {
          this.cursorEl.style.left = `${this.cursor}%`;
        }

        // Alvo móvel para drills dinâmicos
        if (this.currentDrill.mechanic === "moving_target" || this.currentDrill.mechanic === "moving_gap") {
          this.targetX += this.targetDir * this.targetSpeed * dt;
          if (this.targetX >= 75) {
            this.targetX = 75;
            this.targetDir = -1;
          } else if (this.targetX <= 25) {
            this.targetX = 25;
            this.targetDir = 1;
          }
        }

        this.drawCanvas();
        this.animFrame = requestAnimationFrame(loop);
      };

      this.animFrame = requestAnimationFrame(loop);
    }

    drawCanvas() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const drill = this.currentDrill;

      // Fundo estilizado com gradiente de holofotes
      ctx.fillStyle = drill.courtColor || "#0f172a";
      ctx.fillRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.4);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Linhas da quadra
      ctx.strokeStyle = drill.lineColor || "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, w - 36, h - 36);

      // Linha divisória
      ctx.beginPath();
      ctx.moveTo(w / 2, 18);
      ctx.lineTo(w / 2, h - 18);
      ctx.stroke();

      // Círculo central
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 42, 0, Math.PI * 2);
      ctx.stroke();

      // RENDERIZAÇÃO ESPECÍFICA DO DRILL
      if (drill.mechanic === "arc_shot") {
        // Basquete: Arremesso Clutch
        const basketX = w - 75;
        const basketY = h / 2;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(basketX + 22, basketY - 38, 8, 76); // Tabela
        ctx.strokeStyle = "#ff4400";
        ctx.lineWidth = 4;
        ctx.strokeRect(basketX - 16, basketY - 12, 38, 24); // Aro

        // Rede do aro
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(basketX - 14, basketY + 12);
        ctx.lineTo(basketX - 4, basketY + 36);
        ctx.lineTo(basketX + 18, basketY + 12);
        ctx.stroke();

        // Trajetória em arco da bola
        const ballX = 80 + (this.cursor / 100) * (basketX - 80);
        const arcHeight = Math.sin((this.cursor / 100) * Math.PI) * 80;
        const ballY = h / 2 + 35 - arcHeight;

        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (drill.mechanic === "moving_gap") {
        // Basquete: Passe Pick & Roll
        const gapX = (this.targetX / 100) * w;
        // Marcador 1
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(gapX - 40, h / 2 - 20, 16, 0, Math.PI * 2);
        ctx.fill();
        // Marcador 2
        ctx.beginPath();
        ctx.arc(gapX + 40, h / 2 + 20, 16, 0, Math.PI * 2);
        ctx.fill();

        // Brecha de passe verde neon
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(gapX - 25, 30, 50, h - 60);

        // Bola em trânsito
        const ballX = 60 + (this.cursor / 100) * (w - 120);
        const ballY = h / 2;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#111";
        ctx.stroke();
      } else if (drill.mechanic === "vertical_block") {
        // Basquete: Toco & Rebote
        const hoopX = w - 80;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(hoopX + 15, h / 2 - 50, 8, 100);
        ctx.strokeStyle = "#ff4400";
        ctx.lineWidth = 4;
        ctx.strokeRect(hoopX - 20, h / 2 - 15, 35, 20);

        // Mão defensiva subindo pelo cursor
        const handY = h - 40 - (this.cursor / 100) * (h - 70);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(hoopX - 15, handY, 20, 35);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("TOCO", hoopX - 14, handY + 20);

        // Bola descendo
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(hoopX - 5, h / 2 - 15, 12, 0, Math.PI * 2);
        ctx.fill();
      } else if (drill.mechanic === "moving_target") {
        // Futsal: Pênalti & Chute no Ângulo
        const goalX = w - 80;
        const goalY = h / 2 - 55;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.strokeRect(goalX, goalY, 45, 110);

        // Goleiro móvel
        const gkY = h / 2 - 30 + Math.sin(Date.now() / 240) * 38;
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(goalX + 12, gkY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("GK", goalX + 5, gkY + 4);

        // Alvo no ângulo
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.strokeRect(goalX + 2, goalY + 4, 30, 30);

        // Bola
        const ballX = 90 + (this.cursor / 100) * (w - 180);
        const ballY = h / 2 + 10;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (drill.mechanic === "gk_save") {
        // Futsal: Paredão do Goleiro
        const postX = 70;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.strokeRect(postX - 35, h / 2 - 60, 35, 120);

        // Goleiro defendendo controlado pelo cursor
        const keeperY = 40 + (this.cursor / 100) * (h - 80);
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(postX + 10, keeperY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("LUVAS", postX - 8, keeperY + 4);

        // Tiro veloz vindo da direita
        const shotX = w - 80 - Math.sin(Date.now() / 300) * 80;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(shotX, h / 2, 13, 0, Math.PI * 2);
        ctx.fill();
      } else if (drill.mechanic === "one_touch") {
        // Futsal: Tabelinha & Chute de Primeira
        const zoneX = w / 2;
        ctx.strokeStyle = "rgba(74, 222, 128, 0.5)";
        ctx.lineWidth = 3;
        ctx.strokeRect(zoneX - 40, h / 2 - 40, 80, 80);

        // Bola cruzada
        const ballX = 80 + (this.cursor / 100) * (w - 160);
        const ballY = h / 2 + Math.sin((this.cursor / 100) * Math.PI) * 30;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
      } else if (drill.mechanic === "jump_serve") {
        // Vôlei: Saque Viagem
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(w / 2 - 4, 15, 8, h - 30); // Rede

        // Linha de fundo / Zona de Ace
        const aceX = w - 90;
        ctx.fillStyle = "rgba(250, 204, 21, 0.25)";
        ctx.beginPath();
        ctx.arc(aceX, h / 2, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bola em parábola veloz
        const ballX = 60 + (this.cursor / 100) * (w - 140);
        const vArc = Math.sin((this.cursor / 100) * Math.PI) * 90;
        const ballY = h / 2 + 45 - vArc;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1d4ed8";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (drill.mechanic === "reception_cushion") {
        // Vôlei: Manchete & Recepção Perfeita
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(w / 2 - 4, 15, 8, h - 30); // Rede

        // Alvo do levantador
        const setterX = 140;
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.beginPath();
        ctx.arc(setterX, h / 2 - 20, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.stroke();

        // Bola vindo para o líbero
        const ballX = (w - 60) - (this.cursor / 100) * (w - 160);
        const ballY = 40 + Math.sin((this.cursor / 100) * Math.PI) * 80;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Vôlei: Ataque na Paralela & Bloqueio
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(w / 2 - 4, 15, 8, h - 30); // Rede

        // Bloqueadores na rede
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(w / 2 + 10, h / 2 - 50, 16, 45); // Bloqueio
        ctx.fillRect(w / 2 + 10, h / 2 + 5, 16, 45);

        // Paralela livre verde
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        ctx.strokeRect(w / 2 + 40, h / 2 - 50, 80, 25);

        const ballX = 60 + (this.cursor / 100) * (w - 120);
        const ballY = h / 2 - 40;
        ctx.fillStyle = drill.ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    handleAction() {
      if (!this.running || this.attemptsLeft <= 0) return;
      this.attemptsLeft -= 1;

      const distFromCenter = Math.abs(this.cursor - 50);
      const sweetWidth = this.currentDrill.sweetSpotWidth || 12;
      let rating = "miss";
      let label = "FORA!";
      let pts = 0;

      if (distFromCenter <= sweetWidth / 2) {
        rating = "perfect";
        label = this.sportId === "volei" ? "ACE PERFEITO!" : this.sportId === "basquete" ? "SWISH PERFEITO!" : "GOLAÇO NO ÂNGULO!";
        pts = 100;
        playArcadeSound("perfect");
      } else if (distFromCenter <= sweetWidth + 6) {
        rating = "good";
        label = this.sportId === "volei" ? "BOM GOLPE!" : this.sportId === "basquete" ? "CONVERTIDO!" : "BOM CHUTE!";
        pts = 60;
        playArcadeSound("good");
      } else {
        rating = "miss";
        label = this.sportId === "volei" ? "ERROU O GOLPE" : this.sportId === "basquete" ? "ERROU O ARO" : "DEFESA / FORA";
        pts = 10;
        playArcadeSound("miss");
      }

      this.currentScore += pts;
      this.history.push({ rating, label, pts });

      this.showOverlay(label, rating);

      const attemptsChip = this.container.querySelector(".attempts-chip strong");
      const scoreChip = this.container.querySelector(".score-chip strong");
      const historyBox = this.container.querySelector(".arcade-feedback-log");

      if (attemptsChip) attemptsChip.textContent = `${this.attemptsLeft}/3`;
      if (scoreChip) scoreChip.textContent = `${this.currentScore} pts`;
      if (historyBox) historyBox.innerHTML = this.renderHistory();

      if (this.attemptsLeft <= 0) {
        this.finishMinigame();
      }
    }

    showOverlay(text, rating) {
      if (!this.overlayEl) return;
      this.overlayEl.textContent = text;
      this.overlayEl.className = `arcade-overlay-msg is-${rating} show`;
      this.overlayEl.style.display = "block";

      setTimeout(() => {
        if (this.overlayEl) {
          this.overlayEl.className = "arcade-overlay-msg";
          this.overlayEl.style.display = "none";
        }
      }, 700);
    }

    finishMinigame() {
      this.running = false;
      cancelAnimationFrame(this.animFrame);

      let bonusTier = "none";
      let ratingBoost = 0;
      let moraleDelta = 0;
      let chemistryDelta = 0;
      let buffSummary = "";

      if (this.currentScore >= 220) {
        bonusTier = "elite";
        ratingBoost = 4.5;
        moraleDelta = 6;
        chemistryDelta = 5;
        buffSummary = `Aquecimento Impecável! (+${ratingBoost} de força na partida, +${moraleDelta} Moral, +${chemistryDelta} Química)`;
      } else if (this.currentScore >= 120) {
        bonusTier = "good";
        ratingBoost = 2.5;
        moraleDelta = 3;
        chemistryDelta = 3;
        buffSummary = `Bom Aquecimento! (+${ratingBoost} de força na partida, +${moraleDelta} Moral)`;
      } else {
        bonusTier = "modest";
        ratingBoost = 1.0;
        moraleDelta = 1;
        chemistryDelta = 1;
        buffSummary = `Aquecimento Regular (+${ratingBoost} de foco de quadra)`;
      }

      if (this.state && window.TemporadaTotal.GameState) {
        window.TemporadaTotal.GameState.applyMinigameBuff?.(this.state, {
          sportId: this.sportId,
          drillId: this.currentDrill.id,
          drillName: this.currentDrill.title,
          score: this.currentScore,
          tier: bonusTier,
          ratingBoost,
          moraleDelta,
          chemistryDelta,
          buffSummary,
          matchesRemaining: 1
        });
      }

      setTimeout(() => {
        this.container.innerHTML = `
          <div class="arcade-finish-screen is-${bonusTier}">
            <div class="finish-header">
              <span class="finish-trophy">${bonusTier === "elite" ? "🏆" : bonusTier === "good" ? "⭐" : "🎯"}</span>
              <h2>Aquecimento Concluído!</h2>
              <p class="finish-score">Pontuação de Quadra: <strong>${this.currentScore} / 300 pts</strong></p>
            </div>

            <div class="finish-reward-card">
              <span class="reward-title">BÔNUS APLICADO PARA A PRÓXIMA PARTIDA:</span>
              <strong class="reward-highlight">⚡ ${buffSummary}</strong>
              <p>O elenco está calibrado e este bônus entrará em ação na partida a seguir!</p>
            </div>

            <div class="finish-actions">
              <button type="button" class="primary-arcade-button arcade-finish-live">
                🎮 Ir para a Partida ao Vivo (com Bônus) →
              </button>
              <button type="button" class="secondary-arcade-button arcade-finish-sim">
                ⚡ Simular Partida Agora (com Bônus)
              </button>
              <button type="button" class="secondary-arcade-button arcade-restart-btn">
                ↻ Tentar Outro Treino
              </button>
              <button type="button" class="secondary-arcade-button arcade-back-hub">
                ◀ Voltar para a Central
              </button>
            </div>
          </div>
        `;

        const liveBtn = this.container.querySelector(".arcade-finish-live");
        const simBtn = this.container.querySelector(".arcade-finish-sim");
        const restartBtn = this.container.querySelector(".arcade-restart-btn");
        const backHubBtn = this.container.querySelector(".arcade-back-hub");

        liveBtn?.addEventListener("click", () => {
          this.destroy();
          if (typeof this.onPlayLive === "function") this.onPlayLive();
          else if (typeof this.onFinish === "function") this.onFinish();
        });

        simBtn?.addEventListener("click", () => {
          this.destroy();
          if (typeof this.onSimulate === "function") this.onSimulate();
          else if (typeof this.onFinish === "function") this.onFinish();
        });

        restartBtn?.addEventListener("click", () => {
          this.destroy();
          new MinigameController(this.container, {
            sportId: this.sportId,
            gameState: this.state,
            onFinish: this.onFinish,
            onPlayLive: this.onPlayLive,
            onSimulate: this.onSimulate,
            onCancel: this.onCancel
          });
        });

        backHubBtn?.addEventListener("click", () => {
          this.destroy();
          if (typeof this.onCancel === "function") this.onCancel();
          else if (typeof this.onFinish === "function") this.onFinish();
        });
      }, 700);
    }

    destroy() {
      this.running = false;
      cancelAnimationFrame(this.animFrame);
      if (this.keyHandler) {
        window.removeEventListener("keydown", this.keyHandler);
      }
    }
  }

  function launchMinigame(container, options = {}) {
    if (!container) return null;
    return new MinigameController(container, options);
  }

  namespace.MinigamesEngine = {
    launchMinigame,
    playArcadeSound,
    getMinigameConfig: (sportId) => MINIGAME_CONFIGS[sportId] || MINIGAME_CONFIGS.basquete,
    getMinigameSuite: (sportId) => MINIGAME_SUITES[sportId] || MINIGAME_SUITES.basquete
  };
})();
