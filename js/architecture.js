// ═══════════════════════════════════════════════════════════════
// JOBBY — Interactividad de la página Arquitectura (AS-IS / TO-BE)
// Vanilla JS. Todos los elementos se consultan con guards.
// ═══════════════════════════════════════════════════════════════

const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

// ── 1. Segmented control AS-IS | TO-BE ────────────────────────
const archTabs = document.querySelectorAll(".segmented [role='tab']");
const compareTable = document.querySelector(".compare-table");
const comparePanel = document.getElementById("compare-table");

archTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    archTabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    const target = tab.dataset.target;
    if (compareTable) {
      compareTable.classList.toggle("highlight-asis", target === "asis");
      compareTable.classList.toggle("highlight-tobe", target === "tobe");
    }
    if (comparePanel) comparePanel.setAttribute("aria-labelledby", tab.id);
    const section = document.getElementById(target);
    if (section) section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});

// ── 2. Stepper de 5 estados ───────────────────────────────────
const STATE_INFO = {
  borrador: {
    title: "Borrador",
    text: "El documento se crea al registrarse la venta, con los datos del cliente y los productos. Aún no tiene validez fiscal.",
  },
  local: {
    title: "Emitido localmente",
    text: "Estado de contingencia: se generó con numeración local y resolución de contingencia. La DIAN no respondió y el sincronizador vigila el tiempo de permanencia; si supera el umbral, emite una alerta.",
  },
  firmado: {
    title: "Firmado",
    text: "Se aplica la firma digital XAdES-B y se obtiene el CUFE/CUDE. El documento queda íntegro y listo para transmitir.",
  },
  transmitido: {
    title: "Transmitido",
    text: "El documento fue enviado a la DIAN (directamente o desde la cola de contingencia) y está esperando su respuesta de validación.",
  },
  aceptado: {
    title: "Aceptado",
    text: "La DIAN validó el documento y devolvió su aceptación. Se notifica al cliente y el cierre queda completo.",
  },
};

const stateNodes = document.querySelectorAll(".state-node");
const statePanel = document.getElementById("state-panel");

function showState(node) {
  const data = STATE_INFO[node.dataset.state];
  if (!data || !statePanel) return;
  stateNodes.forEach((n) => n.setAttribute("aria-selected", String(n === node)));
  statePanel.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
}

stateNodes.forEach((node) => {
  node.addEventListener("click", () => showState(node));
  node.addEventListener("mouseenter", () => showState(node));
  node.addEventListener("focus", () => showState(node));
});

// ── 3. Simulación de caída de la DIAN ─────────────────────────
const simulateBtn = document.getElementById("simulate-btn");
const resetBtn = document.getElementById("reset-btn");
const simStatus = document.getElementById("sim-status");
const simSteps = Array.from(document.querySelectorAll("#tobe-flow [data-sim-step]"))
  .concat(Array.from(document.querySelectorAll("[data-branch='contingencia'][data-sim-step]")));
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

const FINAL_MESSAGE = "DIAN restablecida · 99 % de documentos conciliados automáticamente";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function showToast(message) {
  if (!toastMessage || !toast) return;
  toastMessage.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 5000);
}

function clearSimulation() {
  simSteps.forEach((step) => {
    step.classList.remove("sim-active", "sim-done", "sim-contingencia");
  });
  toast?.classList.remove("show");
  if (simStatus) simStatus.textContent = "Listo para simular una caída de 45 minutos.";
}

async function runSimulation() {
  if (!simulateBtn) return;
  clearSimulation();
  simulateBtn.disabled = true;
  if (simStatus) simStatus.textContent = "Simulación iniciada: caída de la DIAN";
  document.getElementById("tobe")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

  const delay = reduceMotion ? 0 : 600;
  for (const step of simSteps) {
    step.classList.add("sim-active");
    if (step.dataset.branch === "contingencia") step.classList.add("sim-contingencia");
    await wait(delay);
    step.classList.remove("sim-active");
    step.classList.add("sim-done");
  }

  if (simStatus) simStatus.textContent = "DIAN restablecida, documentos conciliados";
  showToast(FINAL_MESSAGE);
  simulateBtn.disabled = false;
}

simulateBtn?.addEventListener("click", runSimulation);
resetBtn?.addEventListener("click", clearSimulation);

// ── 4. Resaltado del ancla activa ─────────────────────────────
const archLinks = document.querySelectorAll(".arch-nav a");
const archSections = ["comparacion", "asis", "tobe", "roadmap"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window && archSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        archLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-140px 0px -60% 0px" }
  );
  archSections.forEach((section) => observer.observe(section));
}
