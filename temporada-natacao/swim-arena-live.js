/**
 * A Temporada - Natação
 * Motor de Transmissão ao Vivo e Simulação Visual de Piscina Olímpica (Canvas 2D 60fps)
 * Zero Build Step / Vanilla JS Modular
 */
(function () {
  const namespace = (window.TemporadaTotal = window.TemporadaTotal || {});

  // Sintetizador Web Audio API para o ambiente da piscina
  let audioCtx = null;
  function getAudioContext() {
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

  function playSwimSound(type) {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "horn") {
        // Buzina de largada eletrônica (beep agudo e firme)
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now); // A5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "splash") {
        // Som de entrada na água
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "touch") {
        // Batida na placa eletrônica
        osc.type = "sine";
        osc.frequency.setValueAtTime(1046.5, now); // C6
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === "fanfare") {
        // Fanfarra de pódio
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.18, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.3);
        });
      }
    } catch (_) {}
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "--:--.--";
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remaining = (seconds - minutes * 60).toFixed(2).padStart(5, "0");
      return `${minutes}:${remaining}`;
    }
    return seconds.toFixed(2);
  }

  class SwimArenaLiveViewer {
    constructor(container, options = {}) {
      this.container = container;
      this.event = options.event || { id: "50_free", label: "50m Livre", distance: 50, stroke: "freestyle" };
      this.entries = options.entries || []; // 8 raias
      this.meet = options.meet || { name: "Troféu Brasil", city: "Rio de Janeiro" };
      this.onFinish = options.onFinish || null;
      this.onNextEvent = options.onNextEvent || null;
      this.onSkipAll = options.onSkipAll || null;

      this.speed = 1.0;
      this.paused = false;
      this.animFrame = null;
      this.raceTime = 0; // segundos simulados
      this.raceFinished = false;
      this.state = "countdown"; // countdown, racing, finished, podium
      this.countdown = 3; // contagem regressiva para largada

      // Duração visual proporcional (cada piscina de 50m dura cerca de 4 segundos na animação para ser emocionante)
      this.distance = this.event.distance || 50;
      this.totalLaps = Math.max(1, Math.round(this.distance / 50));
      this.fastestRealTime = Math.min(...this.entries.map((e) => e.time || 22));
      this.durationScale = this.distance <= 100 ? 5.5 : this.distance <= 200 ? 9.0 : 14.0;
      this.timeMultiplier = this.fastestRealTime / this.durationScale;

      this.particles = [];
      this.setupDOM();
      this.initSwimmers();
      this.startCountdown();
    }

    initSwimmers() {
      // 8 raias numeradas de 1 a 8
      this.swimmers = this.entries.map((entry, index) => {
        const lane = index + 1;
        return {
          lane,
          name: entry.name || `Atleta ${lane}`,
          club: entry.club || "Clube",
          clubColor: entry.clubColor || (entry.teamId === "player-team" ? "#00f2fe" : "#f59e0b"),
          isPlayer: entry.teamId === "player-team" || entry.isPlayer,
          realTime: entry.time,
          strategy: entry.strategy || "equilibrada",
          currentLap: 0,
          lapProgress: 0, // 0 a 1 em cada piscina
          direction: 1, // 1 = indo para a direita, -1 = voltando para a esquerda
          distanceCovered: 0,
          finished: false,
          finishTime: null,
          place: null,
          x: 0,
          y: 0,
          strokePhase: Math.random() * Math.PI * 2
        };
      });
    }

    setupDOM() {
      this.container.innerHTML = `
        <div class="swim-live-shell">
          <header class="swim-live-header">
            <div class="swim-live-title-group">
              <span class="swim-meet-badge">🏆 ${this.meet.name} • ${this.meet.city}</span>
              <h2 class="swim-event-title">${this.event.label} ${this.event.categoryLabel || ""}</h2>
              <div class="swim-record-strip">
                <span>WR: <strong>${this.event.wrLabel || "46.80"}</strong></span>
                <span>BR: <strong>${this.event.brLabel || "47.84"}</strong></span>
                <span class="swim-live-timer">Tempo: <strong id="swim-hud-clock">00:00.00</strong></span>
              </div>
            </div>

            <div class="swim-live-controls">
              <button type="button" class="swim-ctrl-btn" id="swim-btn-pause">⏸️ Pausar</button>
              <div class="swim-speed-selector">
                <button type="button" class="swim-speed-pill is-active" data-speed="1">1x</button>
                <button type="button" class="swim-speed-pill" data-speed="2">2x</button>
                <button type="button" class="swim-speed-pill" data-speed="4">4x</button>
              </div>
              <button type="button" class="swim-ctrl-btn swim-btn-skip" id="swim-btn-skip-race">⏭️ Pular Prova</button>
            </div>
          </header>

          <div class="swim-arena-viewport">
            <div class="swim-canvas-wrapper">
              <canvas id="swim-live-canvas" width="860" height="420"></canvas>
              <div id="swim-countdown-overlay" class="swim-countdown-overlay">
                <span class="countdown-caption">ÀS SUAS MARCAS...</span>
                <strong class="countdown-number">3</strong>
              </div>
            </div>

            <aside class="swim-live-leaderboard">
              <div class="leaderboard-head">
                <span>#</span>
                <span>Raia / Nadador</span>
                <span>Clube</span>
                <span>Parcial</span>
              </div>
              <div id="swim-leaderboard-rows" class="leaderboard-rows">
                <!-- Linhas das raias atualizadas ao vivo -->
              </div>
            </aside>
          </div>

          <footer class="swim-live-footer">
            <div class="swim-live-ticker" id="swim-live-ticker">
              Aguardando sinal de partida dos árbitros da FINA / CBDA...
            </div>
          </footer>

          <div id="swim-podium-modal" class="swim-podium-overlay" style="display:none;">
            <!-- Pódio renderizado após a chegada -->
          </div>
        </div>
      `;

      this.canvas = this.container.querySelector("#swim-live-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.clockEl = this.container.querySelector("#swim-hud-clock");
      this.tickerEl = this.container.querySelector("#swim-live-ticker");
      this.countdownOverlay = this.container.querySelector("#swim-countdown-overlay");
      this.leaderboardEl = this.container.querySelector("#swim-leaderboard-rows");
      this.podiumModal = this.container.querySelector("#swim-podium-modal");

      // Binds dos botões
      const pauseBtn = this.container.querySelector("#swim-btn-pause");
      pauseBtn.addEventListener("click", () => {
        this.paused = !this.paused;
        pauseBtn.textContent = this.paused ? "▶️ Retomar" : "⏸️ Pausar";
      });

      this.container.querySelectorAll(".swim-speed-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.container.querySelectorAll(".swim-speed-pill").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          this.speed = parseFloat(btn.dataset.speed);
        });
      });

      this.container.querySelector("#swim-btn-skip-race").addEventListener("click", () => {
        this.instantFinish();
      });
    }

    startCountdown() {
      let count = 3;
      const numEl = this.countdownOverlay.querySelector(".countdown-number");
      const captionEl = this.countdownOverlay.querySelector(".countdown-caption");

      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          numEl.textContent = count;
        } else if (count === 0) {
          numEl.textContent = "BIP!";
          numEl.style.color = "#ff3b30";
          captionEl.textContent = "LARGADA!";
          playSwimSound("horn");
          setTimeout(() => playSwimSound("splash"), 250);
        } else {
          clearInterval(interval);
          this.countdownOverlay.style.display = "none";
          this.state = "racing";
          this.tickerEl.textContent = `Largada sensacional! Todos na água em ${this.event.label}!`;
          this.renderLeaderboard();
          this.loop();
        }
      }, 700);
    }

    loop() {
      if (this.state === "finished") return;

      if (!this.paused) {
        const deltaSec = (1 / 60) * this.speed;
        this.update(deltaSec);
      }

      this.draw();
      this.animFrame = requestAnimationFrame(() => this.loop());
    }

    update(deltaSec) {
      this.raceTime += deltaSec * this.timeMultiplier;
      if (this.clockEl) this.clockEl.textContent = formatTime(this.raceTime);

      let allFinished = true;

      this.swimmers.forEach((swimmer) => {
        if (swimmer.finished) return;

        allFinished = false;
        // Progresso proporcional ao tempo real estimado
        const totalDuration = swimmer.realTime;
        const progress = Math.min(1.0, this.raceTime / totalDuration);

        // Ajuste de curva tática
        let tacticalBoost = 1.0;
        if (swimmer.strategy === "explosiva") {
          tacticalBoost = progress < 0.4 ? 1.04 : 0.97;
        } else if (swimmer.strategy === "negativa") {
          tacticalBoost = progress > 0.65 ? 1.05 : 0.97;
        } else if (swimmer.strategy === "economica") {
          tacticalBoost = 0.98;
        }

        const effectiveProgress = Math.min(1.0, progress * tacticalBoost);
        swimmer.distanceCovered = effectiveProgress * this.distance;

        // Cálculo da volta atual e posição na piscina
        const lapProgressFull = effectiveProgress * this.totalLaps;
        swimmer.currentLap = Math.floor(lapProgressFull);
        swimmer.lapProgress = lapProgressFull - swimmer.currentLap;
        swimmer.direction = swimmer.currentLap % 2 === 0 ? 1 : -1;

        swimmer.strokePhase += deltaSec * 8 * this.speed;

        // Se completou a distância
        if (effectiveProgress >= 1.0 || this.raceTime >= swimmer.realTime) {
          swimmer.finished = true;
          swimmer.finishTime = swimmer.realTime;
          playSwimSound("touch");
          this.createSplash(swimmer.direction === 1 ? this.canvas.width - 50 : 50, swimmer.y, 25);
        }
      });

      // Ordena nadadores por distância percorrida
      this.swimmers.sort((a, b) => {
        if (a.finished && b.finished) return a.finishTime - b.finishTime;
        if (a.finished) return -1;
        if (b.finished) return 1;
        return b.distanceCovered - a.distanceCovered;
      });

      // Atribui posições
      this.swimmers.forEach((swimmer, idx) => {
        swimmer.place = idx + 1;
      });

      // Atualiza leaderboard a cada poucos frames
      if (Math.floor(this.raceTime * 10) % 3 === 0) {
        this.renderLeaderboard();
      }

      // Atualiza ticker com emoção
      if (this.swimmers[0]) {
        const leader = this.swimmers[0];
        if (allFinished) {
          this.tickerEl.innerHTML = `🏁 <strong>FIM DE PROVA!</strong> Vitória emocionante de <strong>${leader.name}</strong> (${leader.club}) com o tempo de <strong>${formatTime(leader.finishTime)}</strong>!`;
        } else if (this.distance > 50 && leader.currentLap === this.totalLaps - 1 && leader.lapProgress > 0.6) {
          this.tickerEl.innerHTML = `🔥 <strong>ÚLTIMOS METROS!</strong> ${leader.name} sustenta a ponta na raia ${leader.lane}! Disputa alucinante pela medalha!`;
        } else if (this.distance > 50 && leader.lapProgress > 0.9) {
          this.tickerEl.innerHTML = `🔄 <strong>VIRADA OLÍMPICA!</strong> Nadadores tocam a parede e impulsionam na borda!`;
        }
      }

      if (allFinished && !this.raceFinished) {
        this.raceFinished = true;
        this.state = "finished";
        setTimeout(() => this.showPodiumModal(), 1200);
      }
    }

    renderLeaderboard() {
      if (!this.leaderboardEl) return;
      const sorted = [...this.swimmers].sort((a, b) => (a.place || 99) - (b.place || 99));

      this.leaderboardEl.innerHTML = sorted
        .map((s) => {
          const medal = s.place === 1 ? "🥇" : s.place === 2 ? "🥈" : s.place === 3 ? "🥉" : `${s.place}º`;
          const isPlayerClass = s.isPlayer ? "is-user-team" : "";
          const displayTime = s.finished ? formatTime(s.finishTime) : `${Math.round(s.distanceCovered)}m`;
          return `
            <div class="leaderboard-row ${isPlayerClass}">
              <span class="row-rank">${medal}</span>
              <div class="row-swimmer">
                <span class="row-lane-badge" style="background:${s.clubColor};">R${s.lane}</span>
                <strong class="row-name">${s.name}</strong>
              </div>
              <span class="row-club">${s.club}</span>
              <strong class="row-time">${displayTime}</strong>
            </div>
          `;
        })
        .join("");
    }

    createSplash(x, y, count = 10) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          radius: Math.random() * 3 + 1,
          alpha: 1.0
        });
      }
    }

    draw() {
      const { ctx, canvas } = this;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Fundo da água (Piscina Olímpica)
      const waterGrad = ctx.createLinearGradient(0, 0, 0, h);
      waterGrad.addColorStop(0, "#011627");
      waterGrad.addColorStop(0.5, "#012a4a");
      waterGrad.addColorStop(1, "#011627");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, w, h);

      // Efeito de caustics / reflexos da água
      ctx.save();
      ctx.fillStyle = "rgba(0, 245, 255, 0.04)";
      for (let i = 0; i < 6; i++) {
        const cx = (Date.now() / 30 + i * 160) % (w + 100) - 50;
        ctx.beginPath();
        ctx.arc(cx, (h / 6) * i, 70, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const laneHeight = h / 8;
      const poolLeft = 70;
      const poolRight = w - 70;
      const poolWidth = poolRight - poolLeft;

      // Desenho das 8 raias
      for (let i = 0; i < 8; i++) {
        const laneY = i * laneHeight;

        // Bóias flutuantes de separação de raia
        ctx.strokeStyle = i === 3 || i === 4 ? "#ffd100" : i === 2 || i === 5 ? "#00f2fe" : "#ef4444";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(poolLeft, laneY);
        ctx.lineTo(poolRight, laneY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bloco de partida à esquerda
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(10, laneY + 8, 45, laneHeight - 16);
        ctx.fillStyle = "#ffd100";
        ctx.fillRect(50, laneY + 12, 6, laneHeight - 24);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px 'Bebas Neue', Impact, sans-serif";
        ctx.fillText(`R${i + 1}`, 22, laneY + laneHeight / 2 + 5);

        // Placa touchpad amarela na borda direita
        ctx.fillStyle = "#ffd100";
        ctx.fillRect(poolRight, laneY + 4, 8, laneHeight - 8);
      }

      // Linha de ritmo do Recorde Mundial (WR Pace Line)
      if (this.state === "racing") {
        const wrProgress = Math.min(1.0, this.raceTime / (this.event.worldRecord || 22));
        const wrLapFull = wrProgress * this.totalLaps;
        const wrLap = Math.floor(wrLapFull);
        const wrLapProg = wrLapFull - wrLap;
        const wrDir = wrLap % 2 === 0 ? 1 : -1;
        const wrX = wrDir === 1 ? poolLeft + wrLapProg * poolWidth : poolRight - wrLapProg * poolWidth;

        ctx.save();
        ctx.strokeStyle = "rgba(0, 242, 254, 0.75)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(wrX, 0);
        ctx.lineTo(wrX, h);
        ctx.stroke();

        ctx.fillStyle = "#00f2fe";
        ctx.font = "900 10px sans-serif";
        ctx.fillText("WR PACE", wrX - 22, 14);
        ctx.restore();
      }

      // Desenha nadadores
      this.swimmers.forEach((swimmer) => {
        const laneY = (swimmer.lane - 1) * laneHeight;
        const laneCenterY = laneY + laneHeight / 2;
        swimmer.y = laneCenterY;

        let posX = poolLeft;
        if (swimmer.direction === 1) {
          posX = poolLeft + swimmer.lapProgress * poolWidth;
        } else {
          posX = poolRight - swimmer.lapProgress * poolWidth;
        }
        swimmer.x = posX;

        this.drawSwimmer(ctx, swimmer, posX, laneCenterY);
      });

      // Partículas de água
      this.updateAndDrawParticles(ctx);
    }

    drawSwimmer(ctx, swimmer, x, y) {
      const dir = swimmer.direction;
      const strokeType = this.event.stroke || "freestyle";

      ctx.save();
      ctx.translate(x, y);
      if (dir === -1) {
        ctx.scale(-1, 1);
      }

      // Rastro de bolhas / esteira d'água
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(-16 - i * 10, (Math.sin(swimmer.strokePhase + i) * 4), 3 - i * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Corpo do nadador (torso hidrodinâmico)
      ctx.fillStyle = swimmer.clubColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Touca de natação
      ctx.fillStyle = swimmer.isPlayer ? "#00f5ff" : "#ffffff";
      ctx.beginPath();
      ctx.arc(8, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Óculos espelhados
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(10, -2, 4, 4);

      // Braçadas animadas conforme o estilo
      const armCycle = Math.sin(swimmer.strokePhase);
      ctx.strokeStyle = swimmer.isPlayer ? "#38bdf8" : "#cbd5e1";
      ctx.lineWidth = 3;

      if (strokeType === "butterfly") {
        // Borboleta: braços abrem e mergulham juntos
        ctx.beginPath();
        ctx.moveTo(2, -6);
        ctx.lineTo(8 + armCycle * 8, -14);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(2, 6);
        ctx.lineTo(8 + armCycle * 8, 14);
        ctx.stroke();
      } else if (strokeType === "breaststroke") {
        // Peito: puxada circular
        const flare = Math.sin(swimmer.strokePhase) * 10;
        ctx.beginPath();
        ctx.moveTo(4, 0);
        ctx.lineTo(12, flare);
        ctx.stroke();
      } else if (strokeType === "backstroke") {
        // Costas: braço para trás
        ctx.beginPath();
        ctx.moveTo(-2, -4);
        ctx.lineTo(armCycle * 12, -12);
        ctx.stroke();
      } else {
        // Crawl / Freestyle padrão: braçadas alternadas
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.lineTo(8 + armCycle * 10, -10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(2, 4);
        ctx.lineTo(8 - armCycle * 10, 10);
        ctx.stroke();
      }

      // Badge com número da raia sobre a cabeça
      ctx.fillStyle = swimmer.isPlayer ? "#ffd100" : "#ffffff";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText(`${swimmer.lane}`, -4, -9);

      ctx.restore();
    }

    updateAndDrawParticles(ctx) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    instantFinish() {
      this.swimmers.forEach((swimmer) => {
        swimmer.finished = true;
        swimmer.finishTime = swimmer.realTime;
        swimmer.distanceCovered = this.distance;
      });

      this.swimmers.sort((a, b) => a.finishTime - b.finishTime);
      this.swimmers.forEach((s, idx) => {
        s.place = idx + 1;
      });

      this.raceFinished = true;
      this.state = "finished";
      this.renderLeaderboard();
      this.showPodiumModal();
    }

    showPodiumModal() {
      playSwimSound("fanfare");
      const top3 = this.swimmers.slice(0, 3);
      const isPlayerPodium = top3.some((s) => s.isPlayer);

      this.podiumModal.style.display = "flex";
      this.podiumModal.innerHTML = `
        <div class="swim-podium-card">
          <div class="podium-header">
            <span class="podium-eyebrow">RESULTADO OFICIAL DA PROVA</span>
            <h2>${this.event.label} ${this.event.categoryLabel || ""}</h2>
            <p>${this.meet.name} • ${this.meet.city}</p>
          </div>

          <div class="podium-pedestals">
            <!-- 2º Lugar (Prata) -->
            <div class="pedestal-column pedestal-silver">
              <span class="medal-icon">🥈</span>
              <strong class="podium-name">${top3[1]?.name || "--"}</strong>
              <span class="podium-club">${top3[1]?.club || "--"}</span>
              <strong class="podium-time">${formatTime(top3[1]?.finishTime)}</strong>
              <div class="pedestal-block">2º</div>
            </div>

            <!-- 1º Lugar (Ouro) -->
            <div class="pedestal-column pedestal-gold">
              <span class="medal-icon">🥇</span>
              <strong class="podium-name">${top3[0]?.name || "--"}</strong>
              <span class="podium-club">${top3[0]?.club || "--"}</span>
              <strong class="podium-time">${formatTime(top3[0]?.finishTime)}</strong>
              <div class="pedestal-block">1º</div>
            </div>

            <!-- 3º Lugar (Bronze) -->
            <div class="pedestal-column pedestal-bronze">
              <span class="medal-icon">🥉</span>
              <strong class="podium-name">${top3[2]?.name || "--"}</strong>
              <span class="podium-club">${top3[2]?.club || "--"}</span>
              <strong class="podium-time">${formatTime(top3[2]?.finishTime)}</strong>
              <div class="pedestal-block">3º</div>
            </div>
          </div>

          ${isPlayerPodium ? `<div class="podium-congrats-banner">🎉 SEU CLUBE CONQUISTOU MEDALHA NESTA PROVA!</div>` : ""}

          <div class="podium-full-table">
            <table class="podium-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Raia</th>
                  <th>Nadador</th>
                  <th>Clube</th>
                  <th>Tempo Final</th>
                  <th>Pontos</th>
                </tr>
              </thead>
              <tbody>
                ${this.swimmers
                  .map((s) => {
                    const points = this.event.points ? this.event.points[s.place - 1] || 0 : 0;
                    return `
                      <tr class="${s.isPlayer ? "is-player-row" : ""}">
                        <td><strong>${s.place}º</strong></td>
                        <td>R${s.lane}</td>
                        <td><strong>${s.name}</strong></td>
                        <td>${s.club}</td>
                        <td>${formatTime(s.finishTime)}</td>
                        <td>+${points} pts</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="podium-actions">
            <button type="button" class="swim-primary-btn" id="swim-podium-next">
              Avançar para Próxima Prova →
            </button>
            <button type="button" class="swim-secondary-btn" id="swim-podium-sim-rest">
              ⚡ Simular Restante da Etapa
            </button>
          </div>
        </div>
      `;

      this.podiumModal.querySelector("#swim-podium-next").addEventListener("click", () => {
        this.destroy();
        if (typeof this.onNextEvent === "function") {
          this.onNextEvent(this.swimmers);
        } else if (typeof this.onFinish === "function") {
          this.onFinish(this.swimmers);
        }
      });

      this.podiumModal.querySelector("#swim-podium-sim-rest").addEventListener("click", () => {
        this.destroy();
        if (typeof this.onSkipAll === "function") {
          this.onSkipAll();
        } else if (typeof this.onFinish === "function") {
          this.onFinish(this.swimmers);
        }
      });
    }

    destroy() {
      if (this.animFrame) {
        cancelAnimationFrame(this.animFrame);
      }
    }
  }

  function launchRaceViewer(container, options = {}) {
    if (!container) return null;
    return new SwimArenaLiveViewer(container, options);
  }

  namespace.SwimArenaLive = {
    launchRaceViewer,
    playSwimSound,
    formatTime
  };
})();
