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
  initFixProduct();
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

  function initFixProduct() {
    // URLパラメータからproductIdを取得
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    // 取得したproductIdをもとに詳細データを表示
    fetch("../assets/data/products.json")
      .then((response) => response.json())
      .then((products) => {
        const product = products.find((p) => p.id == productId);
        if (product) {
          // 商品画像
          const image_outer = document.querySelector(".product-image-div");
          //商品画像横
          const info_outer = document.querySelector(".product-info-div");
          const productImage = document.createElement("div");
          const productInfo = document.createElement("div");

          // 商品画像部分HTML作成
          productImage.innerHTML = `
          <div class="product_image h-100 p-5 bg-body-tertiary border">
            <img src="../${product.image}" alt="${product.name}" />
            </div>
          `;
          image_outer.appendChild(productImage);

          // 商品価格部分HTML作成
          const price_div = product.oldPrice
            ? `
            <div class="detail_price_div">
                ¥ ${product.price}<span>¥ ${product.oldPrice}</span>
            </div>
          `
            : `
            <div class="detail_price_div">
                ¥ ${product.price}
            </div>
          `;

          // 商品サイズ部分HTML作成
          var size_div = "";
          const sizeArr = product.size.split(",");
          for (var s of sizeArr) {
            size_div +=
              `
            <button type="button" class="btn btn-outline-secondary sizeBtn"><div class="btnText">` +
              s +
              `
            </div></button>
            `;
          }

          // 商品タグ部分作成
          var tagsList = product.tag.split(",");
          var tags_div = "";
          for (var tag of tagsList) {
            tags_div +=
              `<span class="badge bg-light text-dark tag-badge">` +
              tag +
              `</span>`;
          }

          productInfo.innerHTML =
            `
            <div class="product-info margin-section">
                <div class="inner">
                    <section class="product-price-name">
                        <div>
							<h4>${product.name}</h4>
						</div>
                        ` +
            price_div +
            `
                    </section>
                    <div class="product-desc margin-section">
                        <p>${product.desc}</p>
                    </div>
                    ` +
            tags_div +
            `
                    <div class="product-color margin-section">
                        <h5>${product.color}</h5>
                    </div>
                    <div class="product-size margin-section">
                        <h5>Size</h5>` +
            size_div +
            `
                    </div>
                    <div class="d-grid gap-2 margin-section">
                        <button class="btn btn-danger addBtn" type="button">Add to Cart</button>
                    </div>
                    <div class="margin-section">
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                            </svg>
                         Free shipping on purchases over ¥ 10,000</p>
                    </div>
                </div>
            </div>
				
          `;
          info_outer.appendChild(productInfo);
        } else {
          console.error("Product not found");
        }
      });
  }

  function setEvents() {
    $(".search-form").on("submit", function (event) {
      const inputText = $(".search-input").val().trim();
      if (!inputText) {
        event.preventDefault();
      }
    });

    $(document).on("click", ".tag-badge", function () {
      const keyword = $(this).text();
      window.location.href = "../product/product-list.html?keyword=" + keyword;
    });
  }
});
