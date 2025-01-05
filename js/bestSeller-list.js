/*fetch("assets/data/products.json")
  .then((response) => response.json())
  .then((products) => {
    const productSlider = document.getElementById("product-bestSeller");
    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
      if (product.season === "2025Spring") return;

      const item = document.createElement("div");
      item.classList.add("product_slider_item"); // Owl Carouselが動的に追加するクラスは自動で適用される
      item.innerHTML = `
        <div class="product-item">
          <div class="product discount">
            <div class="product_image">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product_info">
              <h6 class="product_name"><a href="single.html">${product.name}</a></h6>
              <div class="product_price">¥${product.price}</div>
            </div>
          </div>
        </div>
      `;

      fragment.appendChild(item);
    });

    productSlider.appendChild(fragment);*/

const productSlider = document.getElementById("product-bestSeller");

// 要素の追加が完了した後にOwl Carouselを初期化
$(productSlider).owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  },
});
/*})
  .catch((error) => console.error("エラー:", error));*/
