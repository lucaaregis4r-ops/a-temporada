(function () {
  function revealCareer() {
    document.body.classList.add("career-has-started");
  }

  function compactMainNavigation() {
    const nav = document.querySelector(".season-nav");
    if (!nav) return;
    const debugMode = document.body.dataset.debug === "true" || new URLSearchParams(window.location.search).get("debug") === "1" || window.location.hash === "#laboratorio";
    const isVolleyballV2Index = document.body.dataset.sportId === "volei" && nav.querySelector('.tab-button[data-tab-target="carreira-procedural"]');

    const labels = isVolleyballV2Index
      ? {
        "carreira-procedural": "Carreira",
        "front-office": "Versão anterior"
      }
      : {
        "front-office": "Central",
        comissao: "Elenco",
        mercado: "Mercado",
        temporada: "Calendario",
        partida: "Partida",
        liga: "Liga"
      };
    const developerTargets = isVolleyballV2Index
      ? ["front-office", "comissao", "mercado", "temporada", "partida", "estatisticas", "lesoes", "editor", "liga"]
      : ["procedural", "estatisticas", "lesoes", "editor"];

    Object.entries(labels).forEach(([target, label]) => {
      const button = nav.querySelector(`.tab-button[data-tab-target="${target}"]`);
      if (button) button.textContent = label;
    });

    const developerButtons = developerTargets
      .map((target) => nav.querySelector(`.tab-button[data-tab-target="${target}"]`))
      .filter(Boolean);
    if (!developerButtons.length || document.querySelector(".developer-nav")) return;

    const details = document.createElement("details");
    details.className = "developer-nav";
    if (!debugMode) details.hidden = true;
    details.innerHTML = `
      <summary>
        <span>Modo Desenvolvedor</span>
        <strong>Ferramentas internas</strong>
      </summary>
      <div class="developer-nav-actions"></div>
    `;
    const actions = details.querySelector(".developer-nav-actions");
    developerButtons.forEach((button) => actions.appendChild(button));
    nav.insertAdjacentElement("afterend", details);
  }

  function bindCareerHome() {
    if (window.location.hash) revealCareer();
    compactMainNavigation();

    document.querySelectorAll("[data-career-start]").forEach((button) => {
      button.addEventListener("click", revealCareer);
    });
    document.querySelectorAll("[data-career-continue]").forEach((button) => {
      button.addEventListener("click", () => {
        revealCareer();
        requestAnimationFrame(() => {
          const savedCareers = document.querySelector(".procedural-seed-saves");
          savedCareers?.scrollIntoView({ behavior: "smooth", block: "start" });
          savedCareers?.querySelector("[data-game-action='load-career']")?.focus({ preventScroll: true });
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindCareerHome);
  } else {
    bindCareerHome();
  }
})();
