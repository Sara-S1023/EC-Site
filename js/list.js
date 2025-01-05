jQuery(document).ready(function ($) {
  "use strict";

  /* 
    
        1. Vars and Inits
    
        */

  var hamburger = $(".hamburger_container");
  var menu = $(".hamburger_menu");
  var menuActive = false;
  var hamburgerClose = $(".hamburger_close");
  var fsOverlay = $(".fs_menu_overlay");

  $(window).on("resize", function () {
    initFixProductBorder();
  });

  initMenu();
  initLineupProduct();
  initTimer();
  initFavorite();
  initFixProductBorder();
  initSlider();
  setEvents();

  /* 
    
        3. Init Menu
    
        */

  function initMenu() {
    if (hamburger.length) {
      hamburger.on("click", function () {
        if (!menuActive) {
          openMenu();
        } else {
          closeMenu();
        }
      });
    }

    if (fsOverlay.length) {
      fsOverlay.on("click", function () {
        if (menuActive) {
          closeMenu();
        }
      });
    }

    if (hamburgerClose.length) {
      hamburgerClose.on("click", function () {
        if (menuActive) {
          closeMenu();
        }
      });
    }

    if ($(".menu_item").length) {
      var items = document.getElementsByClassName("menu_item");
      var i;

      for (i = 0; i < items.length; i++) {
        if (items[i].classList.contains("has-children")) {
          items[i].onclick = function () {
            this.classList.toggle("active");
            var panel = this.children[1];
            if (panel.style.maxHeight) {
              panel.style.maxHeight = null;
            } else {
              panel.style.maxHeight = panel.scrollHeight + "px";
            }
          };
        }
      }
    }
  }

  function openMenu() {
    menu.addClass("active");
    // menu.css('right', "0");
    fsOverlay.css("pointer-events", "auto");
    menuActive = true;
  }

  function closeMenu() {
    menu.removeClass("active");
    fsOverlay.css("pointer-events", "none");
    menuActive = false;
  }

  /* 
    
        4. Init Timer
    
        */

  function initTimer() {
    if ($(".timer").length) {
      // Uncomment line below and replace date
      // var target_date = new Date("Dec 7, 2017").getTime();

      // comment lines below
      var date = new Date();
      date.setDate(date.getDate() + 3);
      var target_date = date.getTime();
      //----------------------------------------

      // variables for time units
      var days, hours, minutes, seconds;

      var d = $("#day");
      var h = $("#hour");
      var m = $("#minute");
      var s = $("#second");

      setInterval(function () {
        // find the amount of "seconds" between now and target
        var current_date = new Date().getTime();
        var seconds_left = (target_date - current_date) / 1000;

        // do some time calculations
        days = parseInt(seconds_left / 86400);
        seconds_left = seconds_left % 86400;

        hours = parseInt(seconds_left / 3600);
        seconds_left = seconds_left % 3600;

        minutes = parseInt(seconds_left / 60);
        seconds = parseInt(seconds_left % 60);

        // display result
        d.text(days);
        h.text(hours);
        m.text(minutes);
        s.text(seconds);
      }, 1000);
    }
  }

  /* 
    
        5. Init Favorite
    
        */

  function initFavorite() {
    if ($(".favorite").length) {
      var favs = $(".favorite");

      favs.each(function () {
        var fav = $(this);
        var active = false;
        if (fav.hasClass("active")) {
          active = true;
        }

        fav.on("click", function () {
          if (active) {
            fav.removeClass("active");
            active = false;
          } else {
            fav.addClass("active");
            active = true;
          }
        });
      });
    }
  }

  /* 
    
        6. Init Fix Product Border
    
        */

  function initFixProductBorder() {
    if ($(".product_filter").length) {
      var products = $(".product_filter:visible");
      var wdth = window.innerWidth;

      // reset border
      products.each(function () {
        $(this).css("border-right", "solid 1px #e9e9e9");
      });

      // if window width is 991px or less

      if (wdth < 480) {
        for (var i = 0; i < products.length; i++) {
          var product = $(products[i]);
          product.css("border-right", "none");
        }
      } else if (wdth < 576) {
        if (products.length < 5) {
          var product = $(products[products.length - 1]);
          product.css("border-right", "none");
        }
        for (var i = 1; i < products.length; i += 2) {
          var product = $(products[i]);
          product.css("border-right", "none");
        }
      } else if (wdth < 768) {
        if (products.length < 5) {
          var product = $(products[products.length - 1]);
          product.css("border-right", "none");
        }
        for (var i = 2; i < products.length; i += 3) {
          var product = $(products[i]);
          product.css("border-right", "none");
        }
      } else if (wdth < 992) {
        if (products.length < 5) {
          var product = $(products[products.length - 1]);
          product.css("border-right", "none");
        }
        for (var i = 3; i < products.length; i += 4) {
          var product = $(products[i]);
          product.css("border-right", "none");
        }
      }

      //if window width is larger than 991px
      else {
        if (products.length < 5) {
          var product = $(products[products.length - 1]);
          product.css("border-right", "none");
        }
        for (var i = 4; i < products.length; i += 5) {
          var product = $(products[i]);
          product.css("border-right", "none");
        }
      }
    }
  }

  /* 
    
        8. Init Slider
    
        */

  function initSlider() {
    if ($(".product_slider").length) {
      var slider1 = $(".product_slider");

      slider1.owlCarousel({
        loop: false,
        dots: false,
        nav: false,
        responsive: {
          0: { items: 1 },
          480: { items: 2 },
          768: { items: 3 },
          991: { items: 4 },
          1280: { items: 5 },
          1440: { items: 5 },
        },
      });

      if ($(".product_slider_nav_left").length) {
        $(".product_slider_nav_left").on("click", function () {
          slider1.trigger("prev.owl.carousel");
        });
      }

      if ($(".product_slider_nav_right").length) {
        $(".product_slider_nav_right").on("click", function () {
          slider1.trigger("next.owl.carousel");
        });
      }
    }
  }

  function initLineupProduct() {
    // URLパラメータからproductIdを取得
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("keyword") ? urlParams.get("keyword") : "";
    const gender = urlParams.get("gender") ? urlParams.get("gender") : "";
    const category = urlParams.get("category") ? urlParams.get("category") : "";

    if (keyword === "" && gender === "" && category === "") {
      makeAnyItem("");
      return;
    }

    // Isotope 初期化 (空の状態で開始)
    const iso = new Isotope(".product-grid", {
      itemSelector: ".product-item",
      layoutMode: "fitRows",
    });

    // JSON データを取得して要素を追加
    fetch("../assets/data/products.json")
      .then((response) => response.json())
      .then((products) => {
        const productGrid = document.querySelector(".product-grid"); // Isotope 対象の親要素
        const fragment = document.createDocumentFragment(); // DOM 操作の最適化用
        const elements = []; // Isotope に追加する要素の配列

        for (const p of products) {
          if (keyword !== "") {
            if (
              p.name.match(keyword) === null &&
              p.tag.match(keyword) === null
            ) {
              continue;
            }
          } else {
            if (
              (gender !== "" && gender !== p.gender) ||
              (category !== "" && category !== p.category)
            ) {
              continue;
            }
          }

          const oldPrice = p.oldPrice
            ? `
            <span>${p.oldPrice}</span>
          `
            : "";
          // 商品カードを作成
          const productItem = document.createElement("div");
          productItem.classList.add("product-item", p.gender);
          productItem.innerHTML =
            `
            <div class="product discount product_filter">
              <div class="product_image">
                <img src="../${p.image}" alt="${p.name}" />
              </div>
              <div class="product_info">
                <h6 class="product_name">
                  <a href="product-detail.html?productId=${p.id}">${p.name}</a>
                </h6>
                <div class="product_price">¥ ${p.price}` +
            oldPrice +
            `</div>
              </div>
            </div>
          `;

          fragment.appendChild(productItem); // フラグメントに追加
          elements.push(productItem); // 配列に追加
        }

        if (elements.length !== 0) {
          // フラグメントを一括でDOMに追加
          productGrid.appendChild(fragment);

          // Isotope に新しい要素を追加
          iso.appended(elements);

          // レイアウトを再計算
          iso.layout();
        } else {
          makeAnyItem(keyword);
        }
      })
      .catch((error) => console.error("エラー:", error));
  }

  function makeAnyItem(keyword) {
    const anyItem_outer = document.querySelector(".anyItem-outer");
    const anyItem_div = document.createElement("div");
    anyItem_div.classList.add("anyItem-div");
    anyItem_div.innerHTML =
      `
      <p>検索結果なし</p><p>検索結果が見つかりませんでした："` +
      keyword +
      `"</p>`;

    anyItem_outer.appendChild(anyItem_div);
  }

  function setEvents() {
    $(".search-form").on("submit", function (event) {
      const inputText = $(".search-input").val().trim();
      if (!inputText) {
        event.preventDefault();
      }
    });
  }
});
