function parsePrice(p) {
  return Number(p.replace(/[₱,\s]/g, "").trim());
}

const replace = {
  "Weekly Diamond Pass": "WDP",
};

const skip = [
  "Weekly Diamond Pass x2",
  "Weekly Diamond Pass x3",
  "Weekly Diamond Pass x4",
  "Weekly Diamond Pass x5",
];

function extractQtyFromName(name) {
  const m = name.match(/(\d[\d,]*)\s*Diamonds/i);
  if (m) return m[1].replace(/,/g, "");
  return name; // fallback
}

const productsMap = new Map();

document.querySelectorAll("#productList .card-product").forEach((card) => {
  const nameEl = card.querySelector(".product-name");
  const priceEl = card.querySelector(".currency-idr1");
  if (!nameEl || !priceEl) return;

  let name = nameEl.textContent.trim();
  if (skip.includes(name)) return;

  name = replace[name] ?? name;

  const priceRaw = priceEl.textContent.trim();
  const originalPrice = parsePrice(priceRaw);
  if (!Number.isFinite(originalPrice)) return;

  // ✅ exclude if original price is < 40
  if (originalPrice < 40) return;

  // Optional: +3% selling price
  const sellingPrice = Math.round(originalPrice * 1.04);

  productsMap.set(name, {
    qty: extractQtyFromName(name),
    name,
    price: `₱${sellingPrice.toLocaleString("en-PH")}`,
    originalPrice,
    sellingPrice,
  });
});

console.log(JSON.stringify(Array.from(productsMap.values()), null, 2));
