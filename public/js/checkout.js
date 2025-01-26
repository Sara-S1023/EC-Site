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
  initCartSection();
  initSetAddress();
  initFixProductBorder();
  initSlider();
  initCart();
  toggleCreditDetail();
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

  function initCartSection() {
    let item_total = 0;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.forEach((item) => {
      const _price = item.price.replace(/,/g, "");
      item_total += Number(_price * item.quantity);
      const fee = String(_price * item.quantity).replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "$1,"
      );

      const list = document.createElement("li");
      list.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "lh-sm"
      );
      list.innerHTML =
        `
            <div>
                <h6 class="my-0">${item.name}　${item.size}</h6>
                <small class="text-body-secondary">数量 ${item.quantity}</small>
            </div>
            <span class="text-body-secondary">¥ ` +
        fee +
        `</span>
        `;
      $(".total-fee").before(list);
    });

    if (item_total < 10000) {
      const ship_fee = 499;
      item_total += ship_fee;

      const ship_list = document.createElement("li");
      ship_list.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "lh-sm"
      );
      ship_list.innerHTML =
        `
            <div>
              <h6 class="my-0">送料</h6>
            </div>
            <span class="text-body-secondary">¥ ` +
        ship_fee +
        `</span>
        `;
      $(".total-fee").before(ship_list);
    }

    let item_total_comma = String(item_total).replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1,"
    );
    $(".total-fee")
      .find("strong")
      .text("¥ " + item_total_comma);
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

  async function initSetAddress() {
    const isLoggedIn = await fetchSession();

    if (!isLoggedIn) {
      // セッションがない場合、処理を停止
      return;
    }

    const data = await fetchUser();
    if (data) {
      const user = data[0];

      $("#email").val(user.email);
      $("#postnumber").val(user.address.split(",")[0]);
      $("#address").val(user.address.split(",")[1]);
    }
  }

  function toggleCreditDetail() {
    if ($("#credit").prop("checked")) {
      $(".credit-detail").removeClass("hidden"); // クレジットカード選択時
    } else {
      $(".credit-detail").addClass("hidden"); // 他の方法選択時
    }
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

  async function fetchUser() {
    try {
      const response = await fetch("http://100.64.1.100:8080/api/users", {
        method: "GET",
        credentials: "include", // クッキーをリクエストに含める
      });

      const data = await response.json();
      if (data.error) {
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
      return null; // エラーが発生した場合、セッションがないものとして処理
    }
  }

  function setEvents() {
    $(".search-form").on("submit", function (event) {
      const inputText = $(".search-input").val().trim();
      if (!inputText) {
        event.preventDefault();
      }
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

    $("input[name='paymentMethod']").on("change", function () {
      toggleCreditDetail();
    });

    $("#submit-btn").on("click", async function (event) {
      event.preventDefault();
      const cart = JSON.parse(localStorage.getItem("cart"));
      const user = await fetchUser();

      const user_email = user ? user[0].email : "guest";
      let total_amount = 0;
      cart.forEach((item) => {
        const price = item.price.replace(/,/g, "");
        total_amount += Number(price * item.quantity);
      });
      let shipping_fee = false;
      if (total_amount < 10000) {
        shipping_fee = true;
        total_amount += Number(499);
      }

      const firstName_kanji = $("#firstName-kanji").val();
      const lastName_kanji = $("#lastName-kanji").val();
      const firstName_kana = $("#firstName-kana").val();
      const lastName_kana = $("#lastName-kana").val();
      const shipping_email = $("#email").val();
      const post_number = $("#postnumber").val();
      const address = $("#address").val();
      const memo = $("#memo").val();
      const payment = $("input[name='paymentMethod']:checked").val();

      if (
        !firstName_kanji ||
        !lastName_kanji ||
        !firstName_kana ||
        !lastName_kana ||
        !shipping_email ||
        !post_number ||
        !address
      ) {
        $(".error-text").text(
          "未入力の項目があります。ご確認のうえ、もう一度やり直してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      const kanjiPattern = /^[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]+$/;
      if (
        !kanjiPattern.test(firstName_kanji) ||
        !kanjiPattern.test(lastName_kanji)
      ) {
        $(".error-text").text(
          "姓名欄は漢字、ひらがなまたはカタカナで入力してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      const kanaPattern = /^[\u30A0-\u30FF]+$/;
      if (
        !kanaPattern.test(firstName_kana) ||
        !kanaPattern.test(lastName_kana)
      ) {
        $(".error-text").text("セイメイ欄はカタカナで入力してください。");
        $(".error-text").removeClass("hidden");
        return;
      }

      const emailPattern =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
      if (!emailPattern.test(shipping_email)) {
        $(".error-text").text(
          "不正なメールアドレスの形式です。再度確認してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      const postPattern = /^\d{3}-\d{4}$/;
      if (!postPattern.test(post_number)) {
        $(".error-text").text(
          "郵便番号は「〇〇〇-〇〇〇〇」の形式で入力してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      if (
        payment === "credit" &&
        ($("#cc-name").val().length === 0 ||
          $("#cc-number").val().length === 0 ||
          $("#cc-expiration").val().length === 0 ||
          $("#cc-cvv").val().length === 0)
      ) {
        $(".error-text").text(
          "未入力の項目があります。ご確認のうえ、もう一度やり直してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      const ccNumberPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
      if (
        payment === "credit" &&
        !ccNumberPattern.test($("#cc-number").val())
      ) {
        $(".error-text").text(
          "カード番号は「〇〇〇〇-〇〇〇〇-〇〇〇〇-〇〇〇〇」の形式で入力してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      const ccExpiration = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (
        payment === "credit" &&
        !ccExpiration.test($("#cc-expiration").val())
      ) {
        $(".error-text").text(
          "カードの有効期限は「MM/YY」の形式で入力してください。"
        );
        $(".error-text").removeClass("hidden");
        return;
      }

      const orderData = {
        user_email: user_email,
        total_amount: total_amount,
        shipping_name_kanji: firstName_kanji + " " + lastName_kanji,
        shipping_name_kana: firstName_kana + " " + lastName_kana,
        shipping_email: shipping_email,
        shipping_address: post_number + "," + address,
        memo: memo,
        payment: payment,
        shipping_fee: shipping_fee,
      };

      const isGuest = user ? false : true; // ゲスト注文の判定
      const guestInfo = {
        name: firstName_kana + " " + lastName_kana,
      };

      const orderItemsData = cart;

      try {
        const response = await fetch("http://100.64.1.100:8080/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderData,
            orderItemsData,
            isGuest,
            guestInfo,
          }), // 両方のデータを一緒に送信
        });

        const data = await response.json();
        if (data.success) {
          // 注文完了ページに遷移など
          localStorage.clear();
          window.location.href = "./order-confirmation.html";
        } else {
          $(".error-text").text(data.error);
          $(".error-text").removeClass("hidden");
        }
      } catch (error) {
        console.error("注文処理エラー:", error);
      }
    });
  }
});
