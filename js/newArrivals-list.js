// Isotope 初期化 (空の状態で開始)
const iso = new Isotope(".product-grid", {
  itemSelector: ".product-item",
  layoutMode: "fitRows",
});

// JSON データを取得して要素を追加
fetch("assets/data/products.json")
  .then((response) => response.json())
  .then((products) => {
    const productGrid = document.querySelector(".product-grid"); // Isotope 対象の親要素
    const fragment = document.createDocumentFragment(); // DOM 操作の最適化用
    const elements = []; // Isotope に追加する要素の配列

    for (const p of products) {
      if (p.season !== "2025Spring") {
        continue;
      }
      // 商品カードを作成
      const productItem = document.createElement("div");
      productItem.classList.add("product-item", p.gender);
      productItem.innerHTML = `
          <div class="product discount product_filter">
            <div class="product_image">
              <img src="${p.image}" alt="${p.name}" />
            </div>
            <div class="product_bubble product_bubble_left product_bubble_green d-flex flex-column align-items-center"><span>new</span></div>
            <div class="product_info">
              <h6 class="product_name">
                <a href="single.html">${p.name}</a>
              </h6>
              <div class="product_price">¥ ${p.price}</div>
            </div>
          </div>
        `;

      fragment.appendChild(productItem); // フラグメントに追加
      elements.push(productItem); // 配列に追加
    }

    // フラグメントを一括でDOMに追加
    productGrid.appendChild(fragment);

    // Isotope に新しい要素を追加
    iso.appended(elements);

    // レイアウトを再計算
    iso.layout();
  })
  .catch((error) => console.error("エラー:", error));
