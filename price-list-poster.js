// Elements
      const templateSelect = document.getElementById("templateSelect");
      const layoutModeSelect = document.getElementById("layoutMode");
      const singleDivPctInput = document.getElementById("singleDivPct");
      const jsonInput = document.getElementById("jsonInput");

      const featuredDivPctInput = document.getElementById("featuredDivPct");

      // Featured text position controls
      const fQtyOffsetXInput = document.getElementById("fQtyOffsetX");
      const fQtyOffsetYInput = document.getElementById("fQtyOffsetY");
      const fQtyAnchorSelect = document.getElementById("fQtyAnchor");
      const fPriceOffsetXInput = document.getElementById("fPriceOffsetX");
      const fPriceOffsetYInput = document.getElementById("fPriceOffsetY");
      const fPriceAnchorSelect = document.getElementById("fPriceAnchor");

      const rowLimitInput = document.getElementById("rowLimit");
      const rowSpacingInput = document.getElementById("rowSpacing");
      const colSpacingInput = document.getElementById("colSpacing");

      const pillWidthInput = document.getElementById("pillWidth");
      const pillHeightInput = document.getElementById("pillHeight");
      const pillRadiusInput = document.getElementById("pillRadius");
      const topPadInput = document.getElementById("topPad");

      const dividerWInput = document.getElementById("dividerW");
      const dividerHInput = document.getElementById("dividerH");
      const dividerRInput = document.getElementById("dividerR");
      const dividerYInput = document.getElementById("dividerY");
      const dividerXPctInput = document.getElementById("dividerXPct");

      const textFontSizeInput = document.getElementById("textFontSize");
      const fontFamilySelect = document.getElementById("fontFamily");

      // qty two-line controls
      const qtyTwoLineSelect = document.getElementById("qtyTwoLine");
      const qtyLineGapInput = document.getElementById("qtyLineGap");
      const qtyBottomScaleInput = document.getElementById("qtyBottomScale");

      const qtyOffsetXInput = document.getElementById("qtyOffsetX");
      const qtyOffsetYInput = document.getElementById("qtyOffsetY");
      const qtyAnchorSelect = document.getElementById("qtyAnchor");

      const priceOffsetXInput = document.getElementById("priceOffsetX");
      const priceOffsetYInput = document.getElementById("priceOffsetY");
      const priceAnchorSelect = document.getElementById("priceAnchor");

      // ✅ Icon controls
      const iconEnabledSelect = document.getElementById("iconEnabled");
      const iconModeSelect = document.getElementById("iconMode");
      const perFallbackToGlobalSelect = document.getElementById(
        "perFallbackToGlobal"
      );
      const iconPlacementSelect = document.getElementById("iconPlacement");
      const iconUploadInput = document.getElementById("iconUpload");
      const iconSizeInput = document.getElementById("iconSize");
      const iconPadInput = document.getElementById("iconPad");
      const iconGapInput = document.getElementById("iconGap");
      const iconOffsetXInput = document.getElementById("iconOffsetX");
      const iconOffsetYInput = document.getElementById("iconOffsetY");

      // Per-pill UI
      const perIconWrap = document.getElementById("perIconWrap");
      const perIconList = document.getElementById("perIconList");
      const clearPerIconsBtn = document.getElementById("clearPerIconsBtn");

      // Holds uploaded GLOBAL icon as base64 data URL
      let uploadedIconDataUrl = "";

      // index -> base64 data URL (per-pill)
      const perPillIconMap = new Map();

      const pillFillInput = document.getElementById("pillFill");
      const textColorInput = document.getElementById("textColor");
      const dividerColorInput = document.getElementById("dividerColor");

      const outlineModeSelect = document.getElementById("outlineMode");
      const outlineColorInput = document.getElementById("outlineColor");
      const outlineWInput = document.getElementById("outlineW");

      const svgContainer = document.getElementById("svgContainer");
      const previewSize = document.getElementById("previewSize");
      const itemCount = document.getElementById("itemCount");
      const modePill = document.getElementById("modePill");

      // ===== Table Editor Elements =====
      const tableModal = document.getElementById("tableModal");
      const tableBody = document.getElementById("tableBody");
      const closeTableBtn = document.getElementById("closeTableBtn");
      const addRowBtn = document.getElementById("addRowBtn");

      // Table state
      let tableItems = [];

      // Helpers for table
      function toNumber(v, fallback = 0) {
        const n =
          typeof v === "number" ? v : parseFloat(String(v ?? "").trim());
        return Number.isFinite(n) ? n : fallback;
      }

      function normalizeRow(it) {
        const row =
          it && typeof it === "object" && !Array.isArray(it) ? { ...it } : {};
        row.name = String(row.name ?? "");
        row.qty = String(row.qty ?? "");
        row.originalPrice = toNumber(row.originalPrice, 0);
        row.sellingPrice = toNumber(row.sellingPrice, 0);
        row.price =
          row.price ?? (row.sellingPrice ? `₱${row.sellingPrice}` : "");
        return row;
      }

      function parseJsonSafe() {
        try {
          const v = JSON.parse(jsonInput.value);
          return Array.isArray(v) ? v.map(normalizeRow) : [];
        } catch {
          return [];
        }
      }

      function syncJsonFromTable() {
        jsonInput.value = JSON.stringify(tableItems, null, 2);
      }

      function renderTable() {
        tableBody.innerHTML = "";

        tableItems.forEach((row, i) => {
          const margin =
            toNumber(row.sellingPrice, 0) - toNumber(row.originalPrice, 0);

          const tr = document.createElement("tr");

          const tdName = document.createElement("td");
          const tdQty = document.createElement("td");
          const tdOrig = document.createElement("td");
          const tdSell = document.createElement("td");
          const tdMargin = document.createElement("td");
          const tdAct = document.createElement("td");

          const nameInput = document.createElement("input");
          nameInput.className = "tableInput";
          nameInput.value = row.name;

          const qtyInput = document.createElement("input");
          qtyInput.className = "tableInput";
          qtyInput.value = row.qty;

          tdOrig.className = "readonlyCell";
          tdOrig.textContent = String(row.originalPrice);

          const sellInput = document.createElement("input");
          sellInput.className = "tableInput";
          sellInput.type = "number";
          sellInput.step = "any";
          sellInput.value = String(row.sellingPrice);

          tdMargin.className = "readonlyCell";
          tdMargin.textContent = `₱${margin}`;

          const actWrap = document.createElement("div");
          actWrap.className = "miniActions";

          const dupBtn = document.createElement("button");
          dupBtn.type = "button";
          dupBtn.textContent = "Duplicate";
          dupBtn.addEventListener("click", () => duplicateRow(i));

          const delBtn = document.createElement("button");
          delBtn.type = "button";
          delBtn.textContent = "Delete";
          delBtn.addEventListener("click", () => deleteRow(i));

          actWrap.appendChild(dupBtn);
          actWrap.appendChild(delBtn);

          tdAct.appendChild(actWrap);

          tdName.appendChild(nameInput);
          tdQty.appendChild(qtyInput);
          tdSell.appendChild(sellInput);

          tr.appendChild(tdName);
          tr.appendChild(tdQty);
          tr.appendChild(tdOrig);
          tr.appendChild(tdSell);
          tr.appendChild(tdMargin);
          tr.appendChild(tdAct);

          nameInput.addEventListener("input", () => {
            row.name = nameInput.value;
            syncJsonFromTable();
            generateSVG();
          });

          qtyInput.addEventListener("input", () => {
            row.qty = qtyInput.value;
            syncJsonFromTable();
            generateSVG();
          });

          sellInput.addEventListener("input", () => {
            row.sellingPrice = toNumber(sellInput.value, 0);
            row.price = row.sellingPrice ? `₱${row.sellingPrice}` : "";

            // update only the margin cell (no rerender, focus stays)
            const margin =
              toNumber(row.sellingPrice, 0) - toNumber(row.originalPrice, 0);
            tdMargin.textContent = `₱${margin}`;

            syncJsonFromTable();
            generateSVG();
          });

          tableBody.appendChild(tr);
        });
      }

      function openTableEditor() {
        tableItems = parseJsonSafe();
        renderTable();
        tableModal.classList.add("open");
        tableModal.setAttribute("aria-hidden", "false");
      }

      function closeTableEditor() {
        tableModal.classList.remove("open");
        tableModal.setAttribute("aria-hidden", "true");
      }

      function addRow() {
        tableItems.push(
          normalizeRow({
            name: "",
            qty: "",
            price: "",
            originalPrice: 0,
            sellingPrice: 0,
          })
        );
        syncJsonFromTable();
        renderTable();
        generateSVG();
      }

      function deleteRow(i) {
        tableItems.splice(i, 1);
        syncJsonFromTable();
        renderTable();
        generateSVG();
      }

      function duplicateRow(i) {
        tableItems.splice(i + 1, 0, normalizeRow({ ...tableItems[i] }));
        syncJsonFromTable();
        renderTable();
        generateSVG();
      }

      // Close modal when clicking backdrop
      tableModal.addEventListener("click", (e) => {
        if (e.target === tableModal) closeTableEditor();
      });
      // Esc closes modal
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && tableModal.classList.contains("open")) {
          closeTableEditor();
        }
      });

      closeTableBtn.addEventListener("click", closeTableEditor);
      addRowBtn.addEventListener("click", addRow);

      // ===== Templates (updated: include name + original/selling) =====
      const TEMPLATES = {
        mlbb: {
          defaultData: [
            {
              name: "Weekly Diamond Pass",
              qty: "Weekly Diamond Pass",
              price: "₱94",
              originalPrice: 91,
              sellingPrice: 94,
            },
            {
              name: "WDP",
              qty: "WDP",
              price: "₱87",
              originalPrice: 85,
              sellingPrice: 87,
            },
            {
              name: "Normal Starlight",
              qty: "Normal\nStarlight",
              price: "₱237",
              originalPrice: 230,
              sellingPrice: 237,
            },
            {
              name: "Starlight Plus",
              qty: "Starlight\nPlus",
              price: "₱583",
              originalPrice: 560,
              sellingPrice: 583,
            },
            {
              name: "56",
              qty: "56",
              price: "₱44",
              originalPrice: 42,
              sellingPrice: 44,
            },
            {
              name: "168",
              qty: "168",
              price: "₱132",
              originalPrice: 126,
              sellingPrice: 132,
            },
          ],
          settings: {
            layoutMode: "two",
            singleDivPct: 63,
            featuredDivPct: 63,

            fQtyOffsetX: 0,
            fQtyOffsetY: 0,
            fQtyAnchor: "auto",
            fPriceOffsetX: 0,
            fPriceOffsetY: 0,
            fPriceAnchor: "auto",

            qtyTwoLine: "off",
            qtyLineGap: 14,
            qtyBottomScale: 72,

            rowLimit: 28,
            rowSpacing: 55,
            colSpacing: 40,

            pillW: 260,
            pillH: 40,
            pillR: 18,
            topPad: 0,

            dividerW: 3,
            dividerH: 22,
            dividerR: 1.5,
            dividerY: 9,
            dividerXPct: 50,

            fontSize: 18,
            fontFamily: "League+Spartan",

            qtyOffsetX: 0,
            qtyOffsetY: 0,
            qtyAnchor: "auto",
            priceOffsetX: 0,
            priceOffsetY: 0,
            priceAnchor: "auto",

            iconEnabled: "on",
            iconMode: "global",
            perFallbackToGlobal: "on",
            iconPlacement: "outside",
            iconSize: 26,
            iconPad: 12,
            iconGap: 10,
            iconOffsetX: 0,
            iconOffsetY: 0,

            outlineMode: "none",
          },
        },
        valorant: {
          defaultData: [
            {
              name: "475 Points",
              qty: "475 Points",
              price: "₱194",
              originalPrice: 180,
              sellingPrice: 194,
            },
            {
              name: "1000 Points",
              qty: "1000 Points",
              price: "₱388",
              originalPrice: 360,
              sellingPrice: 388,
            },
            {
              name: "2050 Points",
              qty: "2050 Points",
              price: "₱778",
              originalPrice: 740,
              sellingPrice: 778,
            },
            {
              name: "3650 Points",
              qty: "3650 Points",
              price: "₱1,362",
              originalPrice: 1300,
              sellingPrice: 1362,
            },
          ],
          settings: {
            layoutMode: "one",
            singleDivPct: 63,
            featuredDivPct: 63,

            fQtyOffsetX: 0,
            fQtyOffsetY: 0,
            fQtyAnchor: "auto",
            fPriceOffsetX: 0,
            fPriceOffsetY: 0,
            fPriceAnchor: "auto",

            qtyTwoLine: "off",
            qtyLineGap: 14,
            qtyBottomScale: 72,

            rowLimit: 28,
            rowSpacing: 65,
            colSpacing: 40,

            pillW: 330,
            pillH: 50,
            pillR: 16,
            topPad: 0,

            dividerW: 3,
            dividerH: 40,
            dividerR: 1.5,
            dividerY: 5,
            dividerXPct: 63,

            fontSize: 18,
            fontFamily: "League+Spartan",

            qtyOffsetX: 0,
            qtyOffsetY: 0,
            qtyAnchor: "auto",
            priceOffsetX: 0,
            priceOffsetY: 0,
            priceAnchor: "auto",

            iconEnabled: "off",
            iconMode: "global",
            perFallbackToGlobal: "on",
            iconPlacement: "inside",
            iconSize: 26,
            iconPad: 12,
            iconGap: 10,
            iconOffsetX: 0,
            iconOffsetY: 0,

            outlineMode: "none",
          },
        },
        hok: {
          defaultData: [
            {
              name: "60",
              qty: "60",
              price: "₱0",
              originalPrice: 0,
              sellingPrice: 0,
            },
            {
              name: "300",
              qty: "300",
              price: "₱0",
              originalPrice: 0,
              sellingPrice: 0,
            },
            {
              name: "680",
              qty: "680",
              price: "₱0",
              originalPrice: 0,
              sellingPrice: 0,
            },
          ],
          settings: {
            layoutMode: "two",
            singleDivPct: 63,
            featuredDivPct: 63,

            fQtyOffsetX: 0,
            fQtyOffsetY: 0,
            fQtyAnchor: "auto",
            fPriceOffsetX: 0,
            fPriceOffsetY: 0,
            fPriceAnchor: "auto",

            qtyTwoLine: "off",
            qtyLineGap: 14,
            qtyBottomScale: 72,

            rowLimit: 28,
            rowSpacing: 55,
            colSpacing: 40,

            pillW: 260,
            pillH: 50,
            pillR: 18,
            topPad: 0,

            dividerW: 3,
            dividerH: 22,
            dividerR: 1.5,
            dividerY: 9,
            dividerXPct: 50,

            fontSize: 18,
            fontFamily: "League+Spartan",

            qtyOffsetX: 0,
            qtyOffsetY: 0,
            qtyAnchor: "auto",
            priceOffsetX: 0,
            priceOffsetY: 0,
            priceAnchor: "auto",

            iconEnabled: "on",
            iconMode: "global",
            perFallbackToGlobal: "on",
            iconPlacement: "inside",
            iconSize: 26,
            iconPad: 12,
            iconGap: 10,
            iconOffsetX: 0,
            iconOffsetY: 0,

            outlineMode: "none",
          },
        },
      };

      // Fonts
      function preloadFonts() {
        [...fontFamilySelect.options].forEach((opt) => {
          const val = opt.value;
          const q = opt.getAttribute("query") || "&display=swap";
          if (val === "Arial") return;
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `https://fonts.googleapis.com/css2?family=${val}${q}`;
          document.head.appendChild(link);
        });
      }

      function loadGoogleFont() {
        const opt = fontFamilySelect.options[fontFamilySelect.selectedIndex];
        const val = opt.value;
        if (val === "Arial") return;

        const q = opt.getAttribute("query") || "&display=swap";
        const old = document.getElementById("dynamicFontLoader");
        if (old) old.remove();

        const link = document.createElement("link");
        link.id = "dynamicFontLoader";
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${val}${q}`;
        document.head.appendChild(link);
      }

      function escXml(s) {
        return String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      }

      function resolveAnchor(pref, fallback) {
        return pref && pref !== "auto" ? pref : fallback;
      }

      function splitQtyTwoLine(raw) {
        const s = String(raw ?? "").trim();
        if (!s) return { top: "", bottom: "" };

        if (s.includes("\n")) {
          const parts = s
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean);
          if (parts.length >= 2) {
            return { top: parts[0], bottom: parts.slice(1).join("\n") };
          }
          return { top: s.replace(/\n/g, " ").trim(), bottom: "" };
        }

        const idx = s.lastIndexOf(" ");
        if (idx <= 0) return { top: s, bottom: "" };

        const top = s.slice(0, idx).trim();
        const bottom = s.slice(idx + 1).trim();
        if (!top || !bottom) return { top: s, bottom: "" };

        return { top, bottom };
      }

      function updatePerIconVisibility() {
        const show =
          iconEnabledSelect.value === "on" && iconModeSelect.value === "per";
        perIconWrap.style.display = show ? "block" : "none";
      }

      function syncPerIconUI(items) {
        const active =
          iconEnabledSelect.value === "on" && iconModeSelect.value === "per";
        if (!active) return;

        perIconList.innerHTML = "";

        items.forEach((it, idx) => {
          const row = document.createElement("div");
          row.style.display = "grid";
          row.style.gridTemplateColumns = "1fr 1fr";
          row.style.gap = "10px";
          row.style.alignItems = "center";

          const left = document.createElement("div");
          left.className = "pill";
          left.style.justifyContent = "space-between";
          left.style.gap = "10px";
          left.style.width = "100%";
          left.innerHTML = `<span>${escXml(
            it.qty ?? ""
          )}</span><span style="opacity:.8">${escXml(it.price ?? "")}</span>`;

          const right = document.createElement("div");
          right.className = "field";

          const file = document.createElement("input");
          file.type = "file";
          file.accept = "image/*";
          file.dataset.index = String(idx);

          file.addEventListener("change", (e) => {
            const input = e.target;
            const i = parseInt(input.dataset.index, 10);
            const f = input.files && input.files[0];

            if (!f) {
              perPillIconMap.delete(i);
              generateSVG();
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              perPillIconMap.set(i, String(reader.result || ""));
              generateSVG();
            };
            reader.readAsDataURL(f);
          });

          const smallHint = document.createElement("div");
          smallHint.className = "hint";
          smallHint.style.marginTop = "6px";
          smallHint.textContent = perPillIconMap.has(idx)
            ? "✅ Per-pill icon set"
            : "No per-pill icon";

          right.appendChild(file);
          right.appendChild(smallHint);

          row.appendChild(left);
          row.appendChild(right);

          perIconList.appendChild(row);
        });
      }

      clearPerIconsBtn.addEventListener("click", () => {
        perPillIconMap.clear();
        generateSVG();
      });

      // Resolve which icon URL a pill should use
      function resolvePillIconUrl(cfg, item, index) {
        if (!cfg.iconEnabled) return "";
        if (cfg.iconMode === "global") return cfg.iconDataUrl || "";

        const per = perPillIconMap.get(index) || item._iconDataUrl || "";
        if (per) return per;

        const fallbackOn = cfg.perFallbackToGlobal === true;
        if (fallbackOn && cfg.iconDataUrl) return cfg.iconDataUrl;

        return "";
      }

      function buildIconDefs(cfg, items) {
        if (!cfg.iconEnabled) return "";

        const symbols = [];
        if (cfg.iconDataUrl) {
          symbols.push(`
    <symbol id="iconSymbol" viewBox="0 0 1 1" overflow="visible">
      <image x="0" y="0" width="1" height="1" href="${cfg.iconDataUrl}" preserveAspectRatio="xMidYMid meet" />
    </symbol>`);
        }

        if (cfg.iconMode === "per") {
          const seen = new Map();
          let n = 0;

          (items || []).forEach((it) => {
            const url = it._resolvedIconUrl;
            if (!url) return;

            if (cfg.iconDataUrl && url === cfg.iconDataUrl) {
              it._iconSymbolId = "iconSymbol";
              return;
            }

            if (!seen.has(url)) {
              const id = `iconSymbol_${n++}`;
              seen.set(url, id);
              symbols.push(`
    <symbol id="${id}" viewBox="0 0 1 1" overflow="visible">
      <image x="0" y="0" width="1" height="1" href="${url}" preserveAspectRatio="xMidYMid meet" />
    </symbol>`);
            }
            it._iconSymbolId = seen.get(url);
          });
        }

        if (!symbols.length) return "";
        return `
  <defs>${symbols.join("\n")}
  </defs>`;
      }

      function applyTemplate(templateKey) {
        const tpl = TEMPLATES[templateKey];
        if (!tpl) return;

        // Reset icon state when switching templates
        uploadedIconDataUrl = "";
        iconUploadInput.value = "";
        perPillIconMap.clear();

        jsonInput.value = JSON.stringify(tpl.defaultData, null, 2);
        const s = tpl.settings;

        layoutModeSelect.value = s.layoutMode ?? "two";
        singleDivPctInput.value = s.singleDivPct ?? 63;
        featuredDivPctInput.value = s.featuredDivPct ?? 63;

        fQtyOffsetXInput.value = s.fQtyOffsetX ?? 0;
        fQtyOffsetYInput.value = s.fQtyOffsetY ?? 0;
        fQtyAnchorSelect.value = s.fQtyAnchor ?? "auto";
        fPriceOffsetXInput.value = s.fPriceOffsetX ?? 0;
        fPriceOffsetYInput.value = s.fPriceOffsetY ?? 0;
        fPriceAnchorSelect.value = s.fPriceAnchor ?? "auto";

        qtyTwoLineSelect.value = s.qtyTwoLine ?? "off";
        qtyLineGapInput.value = s.qtyLineGap ?? 14;
        qtyBottomScaleInput.value = s.qtyBottomScale ?? 72;

        rowLimitInput.value = s.rowLimit ?? 28;
        rowSpacingInput.value = s.rowSpacing ?? 55;
        colSpacingInput.value = s.colSpacing ?? 40;

        pillWidthInput.value = s.pillW;
        pillHeightInput.value = s.pillH;
        pillRadiusInput.value = s.pillR;
        topPadInput.value = s.topPad;

        dividerWInput.value = s.dividerW;
        dividerHInput.value = s.dividerH;
        dividerRInput.value = s.dividerR;
        dividerYInput.value = s.dividerY;
        dividerXPctInput.value = s.dividerXPct ?? 50;

        textFontSizeInput.value = s.fontSize;
        fontFamilySelect.value = s.fontFamily;

        qtyOffsetXInput.value = s.qtyOffsetX ?? 0;
        qtyOffsetYInput.value = s.qtyOffsetY ?? 0;
        qtyAnchorSelect.value = s.qtyAnchor ?? "auto";

        priceOffsetXInput.value = s.priceOffsetX ?? 0;
        priceOffsetYInput.value = s.priceOffsetY ?? 0;
        priceAnchorSelect.value = s.priceAnchor ?? "auto";

        iconEnabledSelect.value = s.iconEnabled ?? "off";
        iconModeSelect.value = s.iconMode ?? "global";
        perFallbackToGlobalSelect.value = s.perFallbackToGlobal ?? "on";
        iconPlacementSelect.value = s.iconPlacement ?? "inside";
        iconSizeInput.value = s.iconSize ?? 26;
        iconPadInput.value = s.iconPad ?? 12;
        iconGapInput.value = s.iconGap ?? 10;
        iconOffsetXInput.value = s.iconOffsetX ?? 0;
        iconOffsetYInput.value = s.iconOffsetY ?? 0;

        outlineModeSelect.value = s.outlineMode ?? "none";

        loadGoogleFont();
        updatePerIconVisibility();
        generateSVG();
      }

      function drawPill({
        x,
        y,
        w,
        h,
        r,
        topPad,
        qty,
        price,
        fontSize,
        fontName,
        fill,
        textColor,
        dividerColor,
        dividerW,
        dividerH,
        dividerR,
        dividerY,
        outlineMode,
        outlineColor,
        outlineW,
        dividerXOverride,
        side,

        qtyOffsetX,
        qtyOffsetY,
        qtyAnchorPref,
        priceOffsetX,
        priceOffsetY,
        priceAnchorPref,

        qtyTwoLine,
        qtyLineGap,
        qtyBottomScale,

        iconEnabled,
        iconPlacement,
        iconSymbolId,
        iconSize,
        iconPad,
        iconGap,
        iconOffsetX,
        iconOffsetY,
      }) {
        const cyDefault = y + topPad + h / 2;

        const divX =
          typeof dividerXOverride === "number"
            ? dividerXOverride - dividerW / 2
            : x + w / 2 - dividerW / 2;

        let leftTextXDefault,
          leftAnchorDefault,
          rightTextXDefault,
          rightAnchorDefault;

        if (side === "single") {
          leftTextXDefault = x + 42;
          leftAnchorDefault = "start";

          const rightSegmentW = x + w - (divX + dividerW);
          rightTextXDefault = divX + dividerW + rightSegmentW / 2;
          rightAnchorDefault = "middle";
        } else {
          leftTextXDefault = x + w * 0.25;
          leftAnchorDefault = "middle";
          rightTextXDefault = x + w * 0.75;
          rightAnchorDefault = "middle";
        }

        const hasIcon = !!iconEnabled && !!iconSymbolId && (iconSize || 0) > 0;
        const placeOutside = hasIcon && iconPlacement === "outside";
        const outsidePeek = 0.45;

        if (hasIcon) {
          const insideShift = (iconPad || 0) + iconSize + (iconGap || 0);
          const outsideShift =
            (iconPad || 0) + iconSize * (1 - outsidePeek) + (iconGap || 0);

          if (side === "single") {
            leftTextXDefault = x + (placeOutside ? outsideShift : insideShift);
            leftAnchorDefault = "start";
          } else {
            const nominalCenter = x + w * 0.25;
            const minSafeX =
              x + (placeOutside ? outsideShift : insideShift) + 10;
            if (minSafeX > nominalCenter) leftTextXDefault = minSafeX + 10;
          }
        }

        const leftTextX = leftTextXDefault + (qtyOffsetX || 0);
        const leftTextY = cyDefault + (qtyOffsetY || 0);
        const leftAnchor = resolveAnchor(qtyAnchorPref, leftAnchorDefault);

        const rightTextX = rightTextXDefault + (priceOffsetX || 0);
        const rightTextY = cyDefault + (priceOffsetY || 0);
        const rightAnchor = resolveAnchor(priceAnchorPref, rightAnchorDefault);

        const addOutline =
          outlineMode === "both" ||
          (outlineMode === "left" && side !== "right");

        const strokeAttr = addOutline
          ? `stroke="${outlineColor}" stroke-width="${outlineW}"`
          : "";

        let iconSvg = "";
        if (hasIcon) {
          const baseX = placeOutside
            ? x - iconSize * outsidePeek + (iconPad || 0)
            : x + (iconPad || 0);

          const ix = baseX + (iconOffsetX || 0);
          const iy = cyDefault - iconSize / 2 + (iconOffsetY || 0);

          iconSvg = `
    <use href="#${iconSymbolId}" x="${ix}" y="${iy}" width="${iconSize}" height="${iconSize}" />
  `;
        }

        const wantsTwoLine = qtyTwoLine === true;
        const parts = wantsTwoLine
          ? splitQtyTwoLine(qty)
          : { top: qty, bottom: "" };
        const qtyIsTwoLine = wantsTwoLine && !!parts.bottom;

        let qtyTextSvg = "";
        if (qtyIsTwoLine) {
          const { top, bottom } = parts;
          const gap = Number.isFinite(qtyLineGap) ? qtyLineGap : 14;
          const bottomScale = Number.isFinite(qtyBottomScale)
            ? qtyBottomScale
            : 0.72;

          const topY = leftTextY - gap / 2;
          const bottomY = leftTextY + gap / 2;

          qtyTextSvg = `
    <text x="${leftTextX}" y="${topY}"
      fill="${textColor}" font-size="${fontSize}" font-family="${fontName}"
      font-weight="800" text-anchor="${leftAnchor}" dominant-baseline="middle">${escXml(
            top
          )}</text>

    <text x="${leftTextX}" y="${bottomY}"
      fill="${textColor}" font-size="${
            fontSize * bottomScale
          }" font-family="${fontName}"
      font-weight="800" text-anchor="${leftAnchor}" dominant-baseline="middle">${escXml(
            bottom
          )}</text>
  `;
        } else {
          qtyTextSvg = `
    <text x="${leftTextX}" y="${leftTextY}"
      fill="${textColor}" font-size="${fontSize}" font-family="${fontName}"
      font-weight="800" text-anchor="${leftAnchor}" dominant-baseline="middle">${escXml(
            qty
          )}</text>
  `;
        }

        return `
  <rect x="${x}" y="${
          y + topPad
        }" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${strokeAttr} />
  <rect x="${divX}" y="${
          y + dividerY
        }" width="${dividerW}" height="${dividerH}" rx="${dividerR}" fill="${dividerColor}" />

  ${iconSvg}

  ${qtyTextSvg}

  <text x="${rightTextX}" y="${rightTextY}"
    fill="${textColor}" font-size="${fontSize}" font-family="${fontName}"
    font-weight="800" text-anchor="${rightAnchor}" dominant-baseline="middle">${escXml(
          price
        )}</text>
`;
      }

      function computeLeftBleed(cfg) {
        if (!cfg.iconEnabled) return 0;
        if (cfg.iconPlacement !== "outside") return 0;
        const outsidePeek = 0.45;
        return Math.ceil((cfg.iconSize || 0) * outsidePeek);
      }

      function renderTwoColumnInto(items, cfg, yOffset) {
        const leftCount = Math.ceil(items.length / 2);
        const dividerXInPill = (cfg.pillW * cfg.dividerXPct) / 100;

        let out = "";
        items.slice(0, leftCount).forEach((item, i) => {
          out += drawPill({
            x: 0,
            y: yOffset + i * cfg.rowSpacing,
            w: cfg.pillW,
            h: cfg.pillH,
            r: cfg.pillR,
            topPad: cfg.topPad,
            qty: item.qty ?? "",
            price: item.price ?? "",
            fontSize: cfg.fontSize,
            fontName: cfg.fontName,
            fill: cfg.fill,
            textColor: cfg.textColor,
            dividerColor: cfg.dividerColor,
            dividerW: cfg.dividerW,
            dividerH: cfg.dividerH,
            dividerR: cfg.dividerR,
            dividerY: cfg.dividerY,
            outlineMode: cfg.outlineMode,
            outlineColor: cfg.outlineColor,
            outlineW: cfg.outlineW,
            side: "left",
            dividerXOverride: dividerXInPill,

            qtyOffsetX: cfg.qtyOffsetX,
            qtyOffsetY: cfg.qtyOffsetY,
            qtyAnchorPref: cfg.qtyAnchorPref,
            priceOffsetX: cfg.priceOffsetX,
            priceOffsetY: cfg.priceOffsetY,
            priceAnchorPref: cfg.priceAnchorPref,

            qtyTwoLine: cfg.qtyTwoLine,
            qtyLineGap: cfg.qtyLineGap,
            qtyBottomScale: cfg.qtyBottomScale,

            iconEnabled: cfg.iconEnabled,
            iconPlacement: cfg.iconPlacement,
            iconSymbolId: item._iconSymbolId || "",
            iconSize: cfg.iconSize,
            iconPad: cfg.iconPad,
            iconGap: cfg.iconGap,
            iconOffsetX: cfg.iconOffsetX,
            iconOffsetY: cfg.iconOffsetY,
          });
        });

        items.slice(leftCount).forEach((item, i) => {
          const pillX = cfg.pillW + cfg.colSpacing;
          out += drawPill({
            x: pillX,
            y: yOffset + i * cfg.rowSpacing,
            w: cfg.pillW,
            h: cfg.pillH,
            r: cfg.pillR,
            topPad: cfg.topPad,
            qty: item.qty ?? "",
            price: item.price ?? "",
            fontSize: cfg.fontSize,
            fontName: cfg.fontName,
            fill: cfg.fill,
            textColor: cfg.textColor,
            dividerColor: cfg.dividerColor,
            dividerW: cfg.dividerW,
            dividerH: cfg.dividerH,
            dividerR: cfg.dividerR,
            dividerY: cfg.dividerY,
            outlineMode: cfg.outlineMode,
            outlineColor: cfg.outlineColor,
            outlineW: cfg.outlineW,
            side: "right",
            dividerXOverride: pillX + dividerXInPill,

            qtyOffsetX: cfg.qtyOffsetX,
            qtyOffsetY: cfg.qtyOffsetY,
            qtyAnchorPref: cfg.qtyAnchorPref,
            priceOffsetX: cfg.priceOffsetX,
            priceOffsetY: cfg.priceOffsetY,
            priceAnchorPref: cfg.priceAnchorPref,

            qtyTwoLine: cfg.qtyTwoLine,
            qtyLineGap: cfg.qtyLineGap,
            qtyBottomScale: cfg.qtyBottomScale,

            iconEnabled: cfg.iconEnabled,
            iconPlacement: cfg.iconPlacement,
            iconSymbolId: item._iconSymbolId || "",
            iconSize: cfg.iconSize,
            iconPad: cfg.iconPad,
            iconGap: cfg.iconGap,
            iconOffsetX: cfg.iconOffsetX,
            iconOffsetY: cfg.iconOffsetY,
          });
        });

        const height = leftCount * cfg.rowSpacing;
        return { out, height };
      }

      function renderTwoColumn(items, cfg) {
        const leftBleed = computeLeftBleed(cfg);
        const baseW = cfg.pillW * 2 + cfg.colSpacing;
        const svgW = baseW + leftBleed;

        const defs = buildIconDefs(cfg, items);

        const leftCount = Math.ceil(items.length / 2);
        const svgH = leftCount * cfg.rowSpacing;

        let svg = `<svg width="${svgW}" height="${svgH}"
    viewBox="${-leftBleed} 0 ${svgW} ${svgH}"
    xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <rect x="${-leftBleed}" y="0" width="${svgW}" height="${svgH}" fill="transparent"/>`;

        svg += renderTwoColumnInto(items, cfg, 0).out;
        svg += "\n</svg>";
        return svg;
      }

      function renderOneColumn(items, cfg) {
        const leftBleed = computeLeftBleed(cfg);
        const baseW = cfg.pillW;
        const svgW = baseW + leftBleed;
        const svgH = items.length * cfg.rowSpacing;

        const defs = buildIconDefs(cfg, items);

        let svg = `<svg width="${svgW}" height="${svgH}"
    viewBox="${-leftBleed} 0 ${svgW} ${svgH}"
    xmlns="http://www.w3.org/2000/svg">
    ${defs}
  <rect x="${-leftBleed}" y="0" width="${svgW}" height="${svgH}" fill="transparent"/>`;

        const dividerX = (cfg.pillW * cfg.singleDivPct) / 100;

        items.forEach((item, i) => {
          svg += drawPill({
            x: 0,
            y: i * cfg.rowSpacing,
            w: cfg.pillW,
            h: cfg.pillH,
            r: cfg.pillR,
            topPad: cfg.topPad,
            qty: item.qty ?? "",
            price: item.price ?? "",
            fontSize: cfg.fontSize,
            fontName: cfg.fontName,
            fill: cfg.fill,
            textColor: cfg.textColor,
            dividerColor: cfg.dividerColor,
            dividerW: cfg.dividerW,
            dividerH: cfg.dividerH,
            dividerR: cfg.dividerR,
            dividerY: cfg.dividerY,
            outlineMode: cfg.outlineMode,
            outlineColor: cfg.outlineColor,
            outlineW: cfg.outlineW,
            dividerXOverride: dividerX,
            side: "single",

            qtyOffsetX: cfg.qtyOffsetX,
            qtyOffsetY: cfg.qtyOffsetY,
            qtyAnchorPref: cfg.qtyAnchorPref,
            priceOffsetX: cfg.priceOffsetX,
            priceOffsetY: cfg.priceOffsetY,
            priceAnchorPref: cfg.priceAnchorPref,

            qtyTwoLine: cfg.qtyTwoLine,
            qtyLineGap: cfg.qtyLineGap,
            qtyBottomScale: cfg.qtyBottomScale,

            iconEnabled: cfg.iconEnabled,
            iconPlacement: cfg.iconPlacement,
            iconSymbolId: item._iconSymbolId || "",
            iconSize: cfg.iconSize,
            iconPad: cfg.iconPad,
            iconGap: cfg.iconGap,
            iconOffsetX: cfg.iconOffsetX,
            iconOffsetY: cfg.iconOffsetY,
          });
        });

        svg += "\n</svg>";
        return svg;
      }

      function renderTiered(items, cfg) {
        const leftBleed = computeLeftBleed(cfg);
        const baseW = cfg.pillW * 2 + cfg.colSpacing;
        const svgW = baseW + leftBleed;

        const defs = buildIconDefs(cfg, items);

        if (!items || items.length === 0) {
          return `<svg width="${svgW}" height="1" viewBox="${-leftBleed} 0 ${svgW} 1" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        const featured = items[0];
        const rest = items.slice(1);

        const featuredW = cfg.pillW;
        const featuredH = cfg.pillH;
        const featuredX = (baseW - featuredW) / 2;
        const featuredY = 0;

        const featuredDivX = featuredX + (featuredW * cfg.featuredDivPct) / 100;

        const listY = cfg.rowSpacing;
        const list = renderTwoColumnInto(rest, cfg, listY);
        const svgH = listY + (rest.length ? list.height : 0);
        const finalH = Math.max(svgH, cfg.rowSpacing);

        let svg = `<svg width="${svgW}" height="${finalH}"
    viewBox="${-leftBleed} 0 ${svgW} ${finalH}"
    xmlns="http://www.w3.org/2000/svg">
     ${defs}
  <rect x="${-leftBleed}" y="0" width="${svgW}" height="${finalH}" fill="transparent"/>`;

        svg += drawPill({
          x: featuredX,
          y: featuredY,
          w: featuredW,
          h: featuredH,
          r: cfg.pillR,
          topPad: cfg.topPad,
          qty: featured.qty ?? "",
          price: featured.price ?? "",
          fontSize: cfg.fontSize,
          fontName: cfg.fontName,
          fill: cfg.fill,
          textColor: cfg.textColor,
          dividerColor: cfg.dividerColor,
          dividerW: cfg.dividerW,
          dividerH: cfg.dividerH,
          dividerR: cfg.dividerR,
          dividerY: cfg.dividerY,
          outlineMode: cfg.outlineMode,
          outlineColor: cfg.outlineColor,
          outlineW: cfg.outlineW,
          dividerXOverride: featuredDivX,
          side: "single",

          qtyOffsetX: cfg.fQtyOffsetX,
          qtyOffsetY: cfg.fQtyOffsetY,
          qtyAnchorPref: cfg.fQtyAnchorPref,
          priceOffsetX: cfg.fPriceOffsetX,
          priceOffsetY: cfg.fPriceOffsetY,
          priceAnchorPref: cfg.fPriceAnchorPref,

          qtyTwoLine: cfg.qtyTwoLine,
          qtyLineGap: cfg.qtyLineGap,
          qtyBottomScale: cfg.qtyBottomScale,

          iconEnabled: cfg.iconEnabled,
          iconPlacement: cfg.iconPlacement,
          iconSymbolId: featured._iconSymbolId || "",
          iconSize: cfg.iconSize,
          iconPad: cfg.iconPad,
          iconGap: cfg.iconGap,
          iconOffsetX: cfg.iconOffsetX,
          iconOffsetY: cfg.iconOffsetY,
        });

        svg += list.out;
        svg += "\n</svg>";
        return svg;
      }

      function generateSVG() {
        let rawItems;
        try {
          rawItems = JSON.parse(jsonInput.value);
        } catch {
          svgContainer.innerHTML = `<div class="error">Invalid JSON!</div>`;
          previewSize.textContent = "—";
          itemCount.textContent = "—";
          updatePerIconVisibility();
          return;
        }

        const limit = parseInt(rowLimitInput.value, 10);
        if (!isNaN(limit) && limit > 0) rawItems = rawItems.slice(0, limit);

        const cfg = {
          layoutMode: layoutModeSelect.value,
          singleDivPct: parseFloat(singleDivPctInput.value) || 63,
          featuredDivPct: parseFloat(featuredDivPctInput.value) || 63,

          rowSpacing: parseFloat(rowSpacingInput.value),
          colSpacing: parseFloat(colSpacingInput.value),

          pillW: parseFloat(pillWidthInput.value),
          pillH: parseFloat(pillHeightInput.value),
          pillR: parseFloat(pillRadiusInput.value),
          topPad: parseFloat(topPadInput.value),

          dividerW: parseFloat(dividerWInput.value),
          dividerH: parseFloat(dividerHInput.value),
          dividerR: parseFloat(dividerRInput.value),
          dividerY: parseFloat(dividerYInput.value),
          dividerXPct: parseFloat(dividerXPctInput.value) || 50,

          fontSize: parseFloat(textFontSizeInput.value),
          fontName: `${fontFamilySelect.value.replace(
            /\+/g,
            " "
          )}, Arial, sans-serif`,

          qtyTwoLine: qtyTwoLineSelect.value === "on",
          qtyLineGap: parseFloat(qtyLineGapInput.value) || 14,
          qtyBottomScale: (parseFloat(qtyBottomScaleInput.value) || 72) / 100,

          qtyOffsetX: parseFloat(qtyOffsetXInput.value) || 0,
          qtyOffsetY: parseFloat(qtyOffsetYInput.value) || 0,
          qtyAnchorPref: qtyAnchorSelect.value,

          priceOffsetX: parseFloat(priceOffsetXInput.value) || 0,
          priceOffsetY: parseFloat(priceOffsetYInput.value) || 0,
          priceAnchorPref: priceAnchorSelect.value,

          fQtyOffsetX: parseFloat(fQtyOffsetXInput.value) || 0,
          fQtyOffsetY: parseFloat(fQtyOffsetYInput.value) || 0,
          fQtyAnchorPref: fQtyAnchorSelect.value,

          fPriceOffsetX: parseFloat(fPriceOffsetXInput.value) || 0,
          fPriceOffsetY: parseFloat(fPriceOffsetYInput.value) || 0,
          fPriceAnchorPref: fPriceAnchorSelect.value,

          iconEnabled: iconEnabledSelect.value === "on",
          iconMode: iconModeSelect.value,
          perFallbackToGlobal: perFallbackToGlobalSelect.value === "on",
          iconPlacement: iconPlacementSelect.value,
          iconDataUrl: uploadedIconDataUrl,
          iconSize: parseFloat(iconSizeInput.value) || 0,
          iconPad: parseFloat(iconPadInput.value) || 0,
          iconGap: parseFloat(iconGapInput.value) || 0,
          iconOffsetX: parseFloat(iconOffsetXInput.value) || 0,
          iconOffsetY: parseFloat(iconOffsetYInput.value) || 0,

          fill: pillFillInput.value,
          textColor: textColorInput.value,
          dividerColor: dividerColorInput.value,

          outlineMode: outlineModeSelect.value,
          outlineColor: outlineColorInput.value,
          outlineW: parseFloat(outlineWInput.value),
        };

        // Normalize to ensure original/selling exist; keep existing qty/price if provided
        const items = rawItems.map((it, idx) => {
          const base = normalizeRow(it);
          const perIcon = perPillIconMap.get(idx) || "";
          const item2 = { ...base, _iconDataUrl: perIcon, _iconSymbolId: "" };
          item2._resolvedIconUrl = resolvePillIconUrl(cfg, item2, idx);
          return item2;
        });

        if (cfg.iconMode === "global") {
          items.forEach((it) => {
            it._iconSymbolId = cfg.iconDataUrl ? "iconSymbol" : "";
          });
        }

        updatePerIconVisibility();
        syncPerIconUI(items);

        let svg;
        if (cfg.layoutMode === "one") svg = renderOneColumn(items, cfg);
        else if (cfg.layoutMode === "tiered") svg = renderTiered(items, cfg);
        else svg = renderTwoColumn(items, cfg);

        svgContainer.innerHTML = svg;

        modePill.textContent =
          cfg.layoutMode === "one"
            ? "One Column"
            : cfg.layoutMode === "tiered"
            ? "Tiered"
            : "Two Columns";

        itemCount.textContent = `${items.length} items`;

        const svgEl = svgContainer.querySelector("svg");
        if (svgEl)
          previewSize.textContent = `${svgEl.getAttribute(
            "width"
          )}×${svgEl.getAttribute("height")}`;
        else previewSize.textContent = "—";
      }

      function downloadSVG() {
        const svg = document.querySelector("#svgContainer svg");
        if (!svg) return alert("Generate SVG first!");
        const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${templateSelect.value}-price-list.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }

      function downloadJPG() {
        const svgElement = document.querySelector("#svgContainer svg");
        if (!svgElement) return alert("Generate SVG first!");

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          canvas.toBlob(
            function (blob) {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `${templateSelect.value}-price-list.jpg`;
              link.click();
            },
            "image/jpeg",
            0.95
          );
        };
        img.onerror = function () {
          alert("Error rendering SVG to image. Try again.");
        };
        img.src = url;
      }

      // Upload GLOBAL icon → base64
      iconUploadInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
          uploadedIconDataUrl = "";
          generateSVG();
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          uploadedIconDataUrl = String(reader.result || "");
          generateSVG();
        };
        reader.readAsDataURL(file);
      });

      // events
      templateSelect.addEventListener("change", () =>
        applyTemplate(templateSelect.value)
      );
      fontFamilySelect.addEventListener("change", () => {
        loadGoogleFont();
        generateSVG();
      });

      iconEnabledSelect.addEventListener("input", () => {
        updatePerIconVisibility();
        generateSVG();
      });
      iconModeSelect.addEventListener("input", () => {
        updatePerIconVisibility();
        generateSVG();
      });

      [
        layoutModeSelect,
        singleDivPctInput,
        jsonInput,
        featuredDivPctInput,

        fQtyOffsetXInput,
        fQtyOffsetYInput,
        fQtyAnchorSelect,
        fPriceOffsetXInput,
        fPriceOffsetYInput,
        fPriceAnchorSelect,

        qtyTwoLineSelect,
        qtyLineGapInput,
        qtyBottomScaleInput,

        rowLimitInput,
        rowSpacingInput,
        colSpacingInput,
        pillWidthInput,
        pillHeightInput,
        pillRadiusInput,
        topPadInput,
        dividerWInput,
        dividerHInput,
        dividerRInput,
        dividerYInput,
        dividerXPctInput,
        textFontSizeInput,
        qtyOffsetXInput,
        qtyOffsetYInput,
        qtyAnchorSelect,
        priceOffsetXInput,
        priceOffsetYInput,
        priceAnchorSelect,

        perFallbackToGlobalSelect,
        iconPlacementSelect,
        iconSizeInput,
        iconPadInput,
        iconGapInput,
        iconOffsetXInput,
        iconOffsetYInput,

        pillFillInput,
        textColorInput,
        dividerColorInput,
        outlineModeSelect,
        outlineColorInput,
        outlineWInput,
      ].forEach((el) => el.addEventListener("input", generateSVG));

      // init
      (function init() {
        preloadFonts();
        loadGoogleFont();
        applyTemplate("mlbb");
      })();


