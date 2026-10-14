(function () {
  const namespace = window.TemporadaTotal || {};
  const mountedGames = new Map();
  let resizeTimer = null;

  function reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }

  function canUsePhaser() {
    return Boolean(window.Phaser) && !reducedMotion();
  }

  function cleanupDetachedGames() {
    mountedGames.forEach((game, host) => {
      if (!document.body.contains(host)) {
        game.destroy(true);
        mountedGames.delete(host);
      }
    });
  }

  function ensureLayer(target, className, label) {
    if (!target) return null;
    target.classList.add("has-phaser-enhancement");
    let layer = target.querySelector(`:scope > .${className}`);
    if (!layer) {
      layer = document.createElement("div");
      layer.className = className;
      layer.setAttribute("aria-hidden", "true");
      layer.dataset.phaserLabel = label || "visual";
      target.prepend(layer);
    }
    return layer;
  }

  function destroyMounted(host) {
    const game = mountedGames.get(host);
    if (game) {
      game.destroy(true);
      mountedGames.delete(host);
    }
  }

  function resizeMounted() {
    mountedGames.forEach((game, host) => {
      const width = Math.max(220, Math.floor(host.clientWidth || 220));
      const height = Math.max(86, Math.floor(host.clientHeight || 86));
      game.scale?.resize(width, height);
      game.scene?.getScenes(true)?.forEach((scene) => scene.events.emit("enhancement-resize"));
    });
  }

  function scheduleResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resizeMounted, 120);
  }

  function getPalette(kind) {
    if (kind === "futsal") {
      return {
        line: 0x7dd3fc,
        accent: 0xc6ff00,
        ball: 0xf7f1df,
        shadow: 0x10141a
      };
    }
    if (kind === "volei") {
      return {
        line: 0xc6ff00,
        accent: 0x27d8ff,
        ball: 0xf7f1df,
        shadow: 0x10141a
      };
    }
    return {
      line: 0xffb000,
      accent: 0xff5a1f,
      ball: 0xf7f1df,
      shadow: 0x10141a
    };
  }

  function createCourtScene(kind, mode) {
    return class CourtScene extends Phaser.Scene {
      create() {
        this.kind = kind;
        this.mode = mode;
        this.palette = getPalette(kind);
        this.lines = this.add.graphics();
        this.trails = [];
        const trailCount = mode === "card" ? 5 : 8;
        for (let index = 0; index < trailCount; index += 1) {
          const dot = this.add.circle(0, 0, mode === "live" ? 3.4 : 2.6, this.palette.ball, 0.88);
          dot.phase = index / trailCount;
          dot.speed = 0.16 + index * 0.018;
          this.trails.push(dot);
        }
        this.marker = this.add.circle(0, 0, mode === "live" ? 7 : 5, this.palette.accent, 0.9);
        this.events.on("enhancement-resize", () => this.drawCourt());
        this.drawCourt();
      }

      drawCourt() {
        const width = this.scale.width;
        const height = this.scale.height;
        const g = this.lines;
        g.clear();
        g.lineStyle(1, this.palette.line, this.mode === "card" ? 0.18 : 0.28);
        g.strokeRect(width * 0.06, height * 0.18, width * 0.88, height * 0.64);
        g.lineBetween(width * 0.5, height * 0.18, width * 0.5, height * 0.82);

        if (this.kind === "futsal") {
          g.lineStyle(2, this.palette.line, this.mode === "live" ? 0.46 : 0.3);
          g.strokeCircle(width * 0.5, height * 0.5, Math.min(width, height) * 0.13);
          g.strokeRoundedRect(width * 0.06, height * 0.32, width * 0.15, height * 0.36, 10);
          g.strokeRoundedRect(width * 0.79, height * 0.32, width * 0.15, height * 0.36, 10);
          g.lineStyle(4, this.palette.accent, this.mode === "live" ? 0.52 : 0.34);
          g.lineBetween(width * 0.06, height * 0.42, width * 0.06, height * 0.58);
          g.lineBetween(width * 0.94, height * 0.42, width * 0.94, height * 0.58);
          return;
        }

        if (this.kind === "volei") {
          g.lineStyle(3, this.palette.line, this.mode === "live" ? 0.44 : 0.26);
          g.lineBetween(width * 0.5, height * 0.12, width * 0.5, height * 0.88);
          g.lineStyle(1, this.palette.accent, 0.24);
          g.lineBetween(width * 0.28, height * 0.18, width * 0.28, height * 0.82);
          g.lineBetween(width * 0.72, height * 0.18, width * 0.72, height * 0.82);
          return;
        }

        g.lineStyle(2, this.palette.accent, this.mode === "live" ? 0.36 : 0.22);
        g.strokeCircle(width * 0.5, height * 0.5, Math.min(width, height) * 0.18);
        g.strokeCircle(width * 0.14, height * 0.5, Math.min(width, height) * 0.11);
        g.strokeCircle(width * 0.86, height * 0.5, Math.min(width, height) * 0.11);
      }

      update(time) {
        const width = this.scale.width;
        const height = this.scale.height;
        const t = time * 0.001;
        const arcHeight = this.kind === "volei" ? 0.28 : 0.18;
        const baseY = this.kind === "volei" ? height * 0.5 : height * 0.58;

        this.trails.forEach((dot, index) => {
          const progress = (t * dot.speed + dot.phase) % 1;
          const wave = Math.sin(progress * Math.PI);
          dot.x = width * (0.1 + progress * 0.8);
          dot.y = baseY - wave * height * arcHeight + Math.sin(t * 2 + index) * 5;
          dot.alpha = 0.16 + wave * 0.52;
        });

        const mainProgress = (t * (this.mode === "live" ? 0.28 : 0.2)) % 1;
        const mainWave = Math.sin(mainProgress * Math.PI);
        this.marker.x = width * (0.1 + mainProgress * 0.8);
        this.marker.y = baseY - mainWave * height * arcHeight;
        this.marker.alpha = 0.44 + mainWave * 0.4;
      }
    };
  }

  function mountPhaser(host, options = {}) {
    if (!host || !canUsePhaser()) return false;
    cleanupDetachedGames();
    if (mountedGames.has(host)) return true;

    const width = Math.max(220, Math.floor(host.clientWidth || 220));
    const height = Math.max(86, Math.floor(host.clientHeight || 86));
    const kind = options.sportId === "volei" || options.kind === "volei"
      ? "volei"
      : options.sportId === "futsal" || options.kind === "futsal"
        ? "futsal"
        : "basquete";
    const mode = options.mode || "card";
    try {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: host,
        width,
        height,
        transparent: true,
        scale: {
          mode: Phaser.Scale.NONE,
          autoCenter: Phaser.Scale.NO_CENTER
        },
        scene: createCourtScene(kind, mode)
      });
      mountedGames.set(host, game);
      return true;
    } catch (error) {
      host.dataset.phaserError = "true";
      return false;
    }
  }

  function mountMenuCards(root = document) {
    const cards = Array.from(root.querySelectorAll(".mode-card"));
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const kind = text.includes("volei") ? "volei" : "basquete";
      const layer = ensureLayer(card, "phaser-card-layer", kind);
      mountPhaser(layer, { kind, mode: "card" });
    });
  }

  function mountCareerScene(root, state, options = {}) {
    if (!root) return;
    cleanupDetachedGames();
    const target = root.querySelector(".procedural-elimination-screen")
      || root.querySelector(".procedural-seed-hero")
      || root.querySelector(".procedural-career-header")
      || root.querySelector(".club-central")
      || root.querySelector(".procedural-game-section");
    const layer = ensureLayer(target, "phaser-career-layer", "career");
    mountPhaser(layer, {
      sportId: options.sportId || state?.sportId || state?.userTeam?.sportId,
      mode: "career"
    });
  }

  function mountLiveScene(root, state, options = {}) {
    if (!root) return;
    cleanupDetachedGames();
    const liveRoot = root.querySelector("[data-procedural-live-match-root]");
    const target = liveRoot?.parentElement;
    const layer = ensureLayer(target, "phaser-live-layer", "live");
    mountPhaser(layer, {
      sportId: options.sportId || state?.sportId || state?.userTeam?.sportId,
      mode: "live"
    });
  }

  function mountKnockoutScene(root, state, options = {}) {
    if (!root || !state?.knockout) return;
    cleanupDetachedGames();
    const stage = state.activeKnockoutStage || state.liveMatchStage || "";
    const target = root.querySelector(".procedural-knockout-panel") || root.querySelector(".procedural-game-section");
    const layer = ensureLayer(target, "phaser-knockout-layer", stage || "knockout");
    if (stage) layer.classList.add(`is-${stage}`);
    mountPhaser(layer, {
      sportId: options.sportId || state?.sportId || state?.userTeam?.sportId,
      mode: stage === "final" ? "live" : "career"
    });
  }

  function destroyAll() {
    mountedGames.forEach((game) => game.destroy(true));
    mountedGames.clear();
  }

  window.addEventListener("resize", scheduleResize);

  window.TemporadaTotal = {
    ...namespace,
    PhaserEnhancements: {
      mountMenuCards,
      mountCareerScene,
      mountKnockoutScene,
      mountLiveScene,
      destroyAll,
      destroyMounted
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountMenuCards());
  } else {
    mountMenuCards();
  }
})();
