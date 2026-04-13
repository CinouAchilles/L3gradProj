import Product from "../models/product.model.js";
import { generateChatCompletion } from "../services/groq.js";
import { normalizeCategory, buildCatalogContext } from "../services/aiCatalog.js";

const MIN_BUDGET = 40000;

const parseSelectedIds = (selectedProductIds = []) =>
  Array.isArray(selectedProductIds)
    ? selectedProductIds.map((id) => String(id || "").trim()).filter(Boolean)
    : [];

const compactProduct = (product) => ({
  _id: product._id,
  name: product.name,
  category: product.category,
  price: product.price,
});

const buildAssistantSystemPrompt = ({ catalogContext, selectedParts }) => {
  return [
    "You are HardWorx AI, an expert PC-building assistant for a computer store.",
    "Rules:",
    "1) Prioritize recommendations from the provided catalog.",
    "2) Use your hardware knowledge for compatibility and bottleneck analysis.",
    "3) If compatibility is uncertain, say what data is missing.",
    "4) Keep answers practical and concise.",
    "4) If user asks for alternatives, suggest in-stock-style items from catalog context.",
    "5) Mention estimated bottleneck/compatibility caveats when relevant.",
    "6) You do not have live internet browsing; rely on hardware knowledge and provided catalog.",
    "Catalog context (JSON):",
    JSON.stringify(catalogContext),
    "Selected parts from current user context (JSON):",
    JSON.stringify(selectedParts),
  ].join("\n");
};

const purposeWeights = {
  gaming: {
    gpu: 0.34,
    cpu: 0.2,
    motherboard: 0.12,
    ram: 0.11,
    storage: 0.1,
    psu: 0.08,
    case: 0.05,
  },
  productivity: {
    gpu: 0.2,
    cpu: 0.26,
    motherboard: 0.13,
    ram: 0.14,
    storage: 0.12,
    psu: 0.09,
    case: 0.06,
  },
  balanced: {
    gpu: 0.28,
    cpu: 0.22,
    motherboard: 0.12,
    ram: 0.12,
    storage: 0.12,
    psu: 0.09,
    case: 0.05,
  },
};

const buildPlanCategories = ["cpu", "gpu", "motherboard", "ram", "storage", "psu", "case"];

const inferCategory = (product) => normalizeCategory(product);

const pickBestWithinBudget = (products, partBudget) => {
  if (!products.length) return null;
  const sorted = [...products].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  const affordable = sorted.filter((p) => Number(p.price || 0) <= partBudget);
  return affordable.length ? affordable[affordable.length - 1] : sorted[0];
};

const generateBudgetBuild = (catalogProducts, budget, purpose) => {
  const weights = purposeWeights[purpose] || purposeWeights.balanced;
  const byCategory = buildPlanCategories.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  for (const product of catalogProducts) {
    const normalized = inferCategory(product);
    if (byCategory[normalized]) {
      byCategory[normalized].push(product);
    }
  }

  const selected = [];
  for (const category of buildPlanCategories) {
    const partBudget = budget * (weights[category] || 0.1);
    const picked = pickBestWithinBudget(byCategory[category], partBudget);
    if (picked) selected.push(picked);
  }

  const subtotal = selected.reduce((sum, p) => sum + Number(p.price || 0), 0);

  return {
    selected,
    subtotal,
    remainingBudget: budget - subtotal,
    missingCategories: buildPlanCategories.filter(
      (category) => !selected.some((p) => inferCategory(p) === category),
    ),
  };
};

const loadCatalogAndSelection = async (selectedIds = []) => {
  const products = await Product.find({}).lean();
  const selectedProducts = selectedIds.length
    ? products.filter((p) => selectedIds.includes(String(p._id)))
    : [];

  return { products, selectedProducts };
};

const askAI = async ({ system, user, temperature = 0.35 }) =>
  generateChatCompletion(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature },
  );

export const chatWithAI = async (req, res) => {
  try {
    const { prompt, selectedProductIds } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const selectedIds = parseSelectedIds(selectedProductIds);
    const { products, selectedProducts } = await loadCatalogAndSelection(selectedIds);

    const catalogContext = buildCatalogContext(products);
    const systemPrompt = buildAssistantSystemPrompt({
      catalogContext,
      selectedParts: selectedProducts,
    });

    const reply = await askAI({ system: systemPrompt, user: prompt, temperature: 0.35 });

    res.json({
      reply,
      selectedParts: selectedProducts.map(compactProduct),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkCompatibility = async (req, res) => {
  try {
    const { selectedProductIds } = req.body || {};
    const selectedIds = parseSelectedIds(selectedProductIds);

    if (!selectedIds.length) {
      return res.status(400).json({
        error: "selectedProductIds is required and must contain at least one product id",
      });
    }

    const { products, selectedProducts } = await loadCatalogAndSelection(selectedIds);

    if (!selectedProducts.length) {
      return res.status(404).json({
        error: "No matching products found for selectedProductIds",
      });
    }

    const reply = await askAI({
      system:
        "You are a PC compatibility and bottleneck expert. Analyze selected parts using hardware knowledge. Keep it concise and actionable.",
      user: `Analyze these selected parts for compatibility and bottleneck risk: ${JSON.stringify(
        selectedProducts,
      )}. Give: 1) compatibility verdict, 2) bottleneck risk, 3) quick upgrade recommendations from this catalog context: ${JSON.stringify(
        buildCatalogContext(products),
      )}`,
      temperature: 0.25,
    });

    return res.json({
      reply,
      selectedParts: selectedProducts.map(compactProduct),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createBuildPlan = async (req, res) => {
  try {
    const { budget, purpose = "balanced" } = req.body || {};
    const numericBudget = Number(budget);

    if (!Number.isFinite(numericBudget) || numericBudget < MIN_BUDGET) {
      return res.status(400).json({
        error: `budget is required and must be a valid number (minimum ${MIN_BUDGET} DA)`,
      });
    }

    const products = await Product.find({}).lean();
    if (!products.length) {
      return res.status(404).json({ error: "No products available for planning" });
    }

    const plan = generateBudgetBuild(products, numericBudget, purpose);

    const compactPlan = plan.selected.map(compactProduct);

    const aiSummary = await askAI({
      system:
        "You are HardWorx AI. Explain build plans in 2-3 short lines for store customers.",
      user: `Summarize this PC build plan for purpose=${purpose} and budget=${numericBudget} DA. Selected parts=${JSON.stringify(
        compactPlan,
      )}. Remaining budget=${plan.remainingBudget} DA. Keep it short and mention only the most important compatibility note if needed.`,
      temperature: 0.35,
    });

    return res.json({
      plan: {
        purpose,
        budget: numericBudget,
        subtotal: plan.subtotal,
        remainingBudget: plan.remainingBudget,
        missingCategories: plan.missingCategories,
        selectedParts: compactPlan,
      },
      selectedProductIds: compactPlan.map((p) => p._id),
      summary: aiSummary,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
