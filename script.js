function parsePrice(p) {
    return Number(p.replace(/[₱,]/g, "").trim());
}

const productsMap = new Map();

document.querySelectorAll(".col-sm-4.col-6.d-flex").forEach(item => {
    const nameEl = item.querySelector(".product-name");
    const priceEl = item.querySelector(".currency-idr1");

    if (!nameEl || !priceEl) return;

    const name = nameEl.textContent.trim();
    const priceRaw = priceEl.textContent.trim();

    const price = parsePrice(priceRaw);
    const pricePlus3 = Math.round(price * 1.03);

    if (price > 40) {
        productsMap.set(name, {
            name,
            price: `₱${pricePlus3.toLocaleString("en-PH")}`
        });
    }

    
});

const products = Array.from(productsMap.values());

console.log(JSON.stringify(products));