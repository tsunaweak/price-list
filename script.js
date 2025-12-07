function parsePrice(p) {
  return Number(p.replace(/[₱,]/g, "").trim());
}

const replace = {
  "301 Diamonds ( 274 + 27  )": "Normal Starlight (301 Diamonds)",
  "749 Diamonds ( 667 + 82  )": "Starlight Plus (749 Diamonds)",
};

const skip = [
  "Weekly Diamond Pass x2",
  "Weekly Diamond Pass x3",
  "Weekly Diamond Pass x4",
  "Weekly Diamond Pass x5",
];

const productsMap = new Map();

document
  .querySelectorAll(".row-category .col-sm-4.col-6.d-flex")
  .forEach((item) => {
    const nameEl = item.querySelector(".product-name");
    const priceEl = item.querySelector(".currency-idr1");

    if (!nameEl || !priceEl) return;

    let name = nameEl.textContent.trim();

    if (skip.includes(name)) return;

    name = replace[name] ?? name;

    const priceRaw = priceEl.textContent.trim();

    const price = parsePrice(priceRaw);
    const sellingPrice = Math.round(price * 1.02);

    const cleaned = name.replace(/Diamonds\s*\([^)]*\)/, "").trim();

    if (price > 40) {
      productsMap.set(name, {
        name,
        qty: cleaned,
        price: `₱${sellingPrice.toLocaleString("en-PH")}`,
        originalPrice: price,
        sellingPrice: sellingPrice,
      });
    }
  });

const products = Array.from(productsMap.values());

console.log(JSON.stringify(products));
