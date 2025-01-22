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
  initTimer();
  initDisplayCart();
  changeTotalFee();
  initFixProductBorder();
  initSlider();
  initCart();
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

  function initCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length !== 0) {
      const numIcon =
        `
        <span id="checkout_items" class="checkout_items">` +
        cart.length +
        `</span>`;
      $(".fa-shopping-cart").after(numIcon);
    }
  }

  function changeDisplay(cart) {
    if (cart.length === 0) {
      $(".noItem-text").removeClass("hidden");
      $(".total-outer").addClass("hidden");
      $(".checkBtn").addClass("hidden");

      return false;
    } else {
      $(".noItem-text").addClass("hidden");
      $(".total-outer").removeClass("hidden");
      $(".checkBtn").removeClass("hidden");

      return true;
    }
  }

  function initDisplayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item_flg = changeDisplay(cart);
    if (item_flg) {
      cart.forEach((item) => {
        const _price = item.price.replace(/,/g, "");
        const total_fee = String(_price * item.quantity).replace(
          /(\d)(?=(\d{3})+(?!\d))/g,
          "$1,"
        );

        // 数量のセレクトボックス作成
        let num_select = "";
        for (var i = 1; i <= item.quantity + 20; i++) {
          if (i == item.quantity) {
            num_select +=
              `
                  <option value="` +
              i +
              `" selected>` +
              i +
              `</option>
          `;
          } else {
            num_select +=
              `
                  <option value="` +
              i +
              `">` +
              i +
              `</option>
          `;
          }
        }

        const card_div = document.createElement("div");
        card_div.classList.add("card", "mb-3", "item-card");
        $(card_div).attr("cardId", item.id);
        card_div.innerHTML =
          `
          <div class="row g-0">
              <div class="col-md-3">
                  <img src="../${item.image}" alt="${item.name}" style="max-height: 200px;">
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <h4 class="card-name" data-url="${item.id}">${item.name}</h4>
                      <h4 class="card-price">¥ ` +
          total_fee +
          `</h4>
                      <p class="delete-product" style="margin-bottom: 5px">削除する</p>
                      <div>
                          <p class="item-price" data ="${item.price}">price : ${item.price}</p>
                          <p class="item-color" data ="${item.color}">color : ${item.color}</p>
                          <p class="item-size" data ="${item.size}">size : ${item.size}</p>
                      </div>
                      <div>
                          <h5 class="item-num">個数：</h5><select class="form-select" aria-label="Default select example">` +
          num_select +
          `</select>
                      </div>
                  </div>
              </div>
          </div>
      `;
        $(".cart-outer").append(card_div);
      });
    }
  }

  function changeTotalFee() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item_fee = 0;

    for (var item of cart) {
      const item_price = item.price.replace(/,/g, "");
      const item_total = item_price * item.quantity;
      item_fee += item_total;
    }

    const ship_fee = item_fee >= 10000 ? 0 : 499;

    const _item_fee = String(item_fee).replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1,"
    );

    let total_fee = Number(item_fee) + Number(ship_fee);
    const _total_fee = String(total_fee).replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1,"
    );
    $(".item-fee").text("¥ " + _item_fee);
    $(".ship-fee").text("¥ " + ship_fee);
    $(".total-fee").text("¥ " + _total_fee);
  }

  async function fetchSession() {
    try {
      const response = await fetch("http://100.64.1.100:8080/api/session", {
        method: "GET",
        credentials: "include", // クッキーをリクエストに含める
      });

      const data = await response.json();

      // セッションが存在する場合、trueを返す
      if (data.isLoggedIn) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("セッション確認エラー:", error);
      return false; // エラーが発生した場合、セッションがないものとして処理
    }
  }

  function setEvents() {
    $(".search-form").on("submit", function (event) {
      const inputText = $(".search-input").val().trim();
      if (!inputText) {
        event.preventDefault();
      }
    });

    $(".checkBtn").on("click", function () {
      window.location.href = "./checkout.html";
    });

    $(document).on("click", ".card-name", function () {
      const productId = $(this).attr("data-url");
      if (productId) {
        window.location.href =
          "../product/product-detail.html?productId=" + productId; // URLに遷移
      } else {
        console.warn("URL is not defined for this element.");
      }
    });

    $(document).on("change", ".form-select", function () {
      const this_card = $(this).closest(".item-card");
      const price = this_card
        .find(".item-price")
        .attr("data")
        .replace(/,/g, "");
      const total_fee = String(price * $(this).val()).replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "$1,"
      );
      $(this_card)
        .find(".card-price")
        .text("¥ " + total_fee);

      // ローカルストレージの内容を変更
      const item_id = this_card.attr("cardId");
      const item_size = $(this_card).find(".item-size").attr("data");
      const cart = JSON.parse(localStorage.getItem("cart"));

      const _item = cart.find(
        (item) => item.id == item_id && item.size == item_size
      );

      if (_item) {
        _item.quantity = $(this).val();
      }

      // 更新されたカートをローカルストレージに保存
      localStorage.setItem("cart", JSON.stringify(cart));

      changeTotalFee();
    });

    $(document).on("click", ".delete-product", function () {
      const this_card = $(this).closest(".item-card");
      this_card.remove();

      // 属性値を取得
      const item_id = this_card.attr("cardId");
      const item_size = $(this_card).find(".item-size").attr("data");

      // ローカルストレージからカートを取得
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // 削除対象のアイテムのインデックスを取得
      const _itemIndex = cart.findIndex(
        (item) => item.id == item_id && item.size == item_size
      );

      // 要素が存在する場合に削除
      if (_itemIndex !== -1) {
        cart.splice(_itemIndex, 1); // 配列から削除
        localStorage.setItem("cart", JSON.stringify(cart)); // 更新した配列を保存
        $(".checkout_items").text(cart.length);
        console.log("Item removed from cart:", cart);
      } else {
        console.log("Item not found in cart.");
      }

      changeTotalFee();
      changeDisplay(JSON.parse(localStorage.getItem("cart")) || []);
    });

    $(".api-link").on("click", async function (event) {
      const isLoggedIn = await fetchSession();

      if (isLoggedIn) {
        // ログインしている場合、ユーザー用ページに遷移
        window.location.href = "http://100.64.1.100:8081/user/user.html";
      } else {
        // ログインしていない場合、ログインページに遷移
        window.location.href = "http://100.64.1.100:8081/user/login.html";
      }
    });
  }
});
