const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const loreDir = fs.readdirSync(root, { withFileTypes: true })
  .find((entry) => entry.isDirectory() && entry.name.startsWith("Lores"))?.name;

if (!loreDir) {
  throw new Error("Pasta de lores nao encontrada.");
}

const sourceFile = fs.readdirSync(path.join(root, loreDir))
  .find((name) => name.includes("Banco_2000") && name.endsWith(".json"));

if (!sourceFile) {
  throw new Error("Banco_2000_Decisoes_Ramificadas_Unificado.json nao encontrado.");
}

function compactText(value, limit = 520) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1).trim()}...` : text;
}

function compactEffects(effects) {
  return Object.fromEntries(
    Object.entries(effects || {})
      .filter(([, value]) => Number.isFinite(Number(value)))
      .map(([key, value]) => [key, Number(value)])
  );
}

function compactOption(option) {
  return {
    optionId: option.optionId || "",
    label: compactText(option.label, 90),
    description: compactText(option.description, 240),
    effects: compactEffects(option.effects),
    riskProfile: option.branching?.optionMemory?.riskProfile || ""
  };
}

const sourcePath = path.join(root, loreDir, sourceFile);
const rows = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const compactRows = rows.map((decision) => ({
  decisionId: decision.decisionId,
  loreId: decision.loreId,
  loreName: decision.loreName,
  loreCategory: decision.loreCategory,
  decisionType: decision.decisionType,
  title: compactText(decision.title, 130),
  situation: compactText(decision.situation || decision.trigger, 620),
  options: (decision.options || []).slice(0, 3).map(compactOption),
  cooldownWeeks: Number(decision.cooldownWeeks) || 0,
  priority: decision.priority || "",
  tags: (decision.tags || []).slice(0, 14)
}));

const output = `// Arquivo gerado por tools/build-procedural-decision-bank-data.js.\n// Fonte: ${loreDir}/${sourceFile}\n(function () {\n  window.TemporadaTotal = {\n    ...(window.TemporadaTotal || {}),\n    ProceduralDecisionBankData: ${JSON.stringify(compactRows)}\n  };\n})();\n`;

const outputPath = path.join(root, "shared", "procedural-decision-bank-data.js");
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Geradas ${compactRows.length} decisoes em ${path.relative(root, outputPath)}.`);
