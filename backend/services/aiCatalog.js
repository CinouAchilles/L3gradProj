const normalizeWhitespace = (value = "") => value.replace(/\s+/g, " ").trim();

const buildSearchText = (product) =>
  normalizeWhitespace(`${product?.name || ""} ${product?.description || ""} ${product?.category || ""}`);

export const normalizeCategory = (product) => {
  const text = buildSearchText(product).toLowerCase();

  if (/\b(cpu|processor|ryzen|intel core|threadripper|xeon)\b/.test(text)) return "cpu";
  if (/\b(gpu|graphics|geforce|rtx|gtx|radeon)\b/.test(text)) return "gpu";
  if (/\b(motherboard|mainboard|b650|b660|z790|x670|h610|am4|am5|lga)\b/.test(text)) return "motherboard";
  if (/\b(ram|memory|ddr4|ddr5)\b/.test(text)) return "ram";
  if (/\b(psu|power supply|80\+|watt)\b/.test(text)) return "psu";
  if (/\b(ssd|hdd|nvme|storage|m\.2)\b/.test(text)) return "storage";
  if (/\b(case|chassis|tower)\b/.test(text)) return "case";
  if (/\b(cooler|cooling|fan|aio|liquid)\b/.test(text)) return "cooling";
  return (product?.category || "other").toLowerCase();
};

export const buildCatalogContext = (products = []) => {
  return products.slice(0, 80).map((p) => ({
    _id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: normalizeWhitespace((p.description || "").slice(0, 200)),
  }));
};
