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
  initDBdata();
  initTimer();
  initFavorite();
  initFixProductBorder();
  initSlider();
  initCart();
  initOrders();
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

  function initDBdata() {
    fetch("http://100.64.1.100:8080/api/users", {
      method: "GET",
      credentials: "include", // これを追加して、クッキーをリクエストに含める
    })
      .then((response) => response.json())
      .then((data) => {
        const user = data[0];
        $("#name").val(user.user_name);
        $("#email").val(user.email);

        const postCode = user.address ? user.address.split(",")[0] : "";
        const address = user.address ? user.address.split(",")[1] : "";
        let gender = "other";
        if (user.gender === "M") {
          gender = "male";
        } else if (user.gender === "F") {
          gender = "female";
        }
        const bithday = user.birthday ? user.birthday : "";
        const date = new Date(bithday);
        // yyyy-mm-dd形式に変換
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // 月は0から始まるので1を足す
        const dd = String(date.getDate()).padStart(2, "0"); // 日に0埋め

        // 結果をyyyy-mm-dd形式にフォーマット
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        $("#postalCode").val(postCode);
        $("#address").val(address);
        $("#gender").val(gender);
        $("#birthdate").val(formattedDate);
      });
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

  async function initOrders() {
    let data = await fetchSession();

    if (data.isLoggedIn) {
      try {
        // ユーザーのメールアドレスをクエリパラメータとしてURLに追加
        const userEmail = data.user.email; // ユーザーのメールアドレス (セッション情報から取得)
        const url = new URL("http://100.64.1.100:8080/api/order");
        url.searchParams.append("user_email", userEmail); // クエリパラメータを追加

        const response = await fetch(url, {
          method: "GET",
          credentials: "include", // クッキーをリクエストに含める
        });

        const order_data = await response.json();
        if (order_data.noData) {
          console.log(order_data.error);
          $(".no-order").removeClass("hidden");
          return;
        } else {
          $(".no-order").addClass("hidden");
        }

        order_data.forEach((order) => {
          const order_date = new Date(order.created_at);
          const year = order_date.getFullYear();
          const month = order_date.getMonth() + 1;
          const date = order_date.getDate();
          let total_fee = 0;
          let ship_fee = 0;
          let status = "準備中";
          if (order.status === "shipped") {
            status = "配送中";
          } else if (order.status === "delivered") {
            status = "配達完了";
          } else if (order.status === "cancelled") {
            status = "キャンセル";
          }
          let payment = "クレジットカード";
          if (order.payment === "bank") {
            payment = "銀行振り込み";
          } else if (order.payment === "cash") {
            payment = "代引き";
          }

          // 注文内容部分作成
          let item_li = "";
          order.items.forEach((item) => {
            let price = Math.floor(item.price);
            total_fee += Number(price);
            item_li += `
                  <li>
                    商品名: ${item.product_name} - サイズ: ${
              item.size
            } - 価格: ${String(price).replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            )}円　${item.quantity}個
                  </li>
                `;
          });

          if (order.shipping_fee) {
            ship_fee = 499;
            item_li += `
                  <li>
                    送料: ${ship_fee}円
                  </li>
                `;
          }

          const order_card = document.createElement("div");
          order_card.classList.add("card", "order-card");
          order_card.innerHTML =
            `
            <div class="card-header">
                            <h5 class="card-title">注文 #${order.id}</h5>
                            <p class="card-subtitle text-muted">
                              ${year}年${month}月${date}日
                            </p>
                          </div>
                          <div class="card-body">
                            <!-- 注文ステータス -->
                            <p class="order-status text-success">${status}</p>

                            <!-- お届け先情報 -->
                            <div class="order-details">
                              <strong>お届け先氏名：</strong> ${order.shipping_name_kanji}<br />
                              <strong>住所：</strong> ${order.shipping_address}<br />
                              <strong>メールアドレス：</strong> ${order.shipping_email}
                            </div>

                            <!-- 商品詳細 -->
                            <div class="mt-3">
                              <strong>注文内容:</strong>
                              <ul>` +
            item_li +
            `<li>
                    合計: ${String(total_fee + ship_fee).replace(
                      /(\d)(?=(\d{3})+(?!\d))/g,
                      "$1,"
                    )}円
                  </li>
            </ul>
                            </div>

                            <!-- 支払い方法 -->
                            <p class="order-details">
                              <strong>支払い方法:</strong> ${payment}
                            </p>
                          </div>
          `;

          $(".orderCard-outer").after(order_card);
        });
      } catch (error) {
        console.log(error);
        return; // エラーが発生した場合、データがないものとして処理
      }
    }
  }

  async function fetchSession() {
    try {
      const response = await fetch("http://100.64.1.100:8080/api/session", {
        method: "GET",
        credentials: "include", // クッキーをリクエストに含める
      });

      const data = await response.json();
      return data;
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

    $(".api-link").on("click", async function (event) {
      const data = await fetchSession();

      if (data.isLoggedIn) {
        // ログインしている場合、ユーザー用ページに遷移
        window.location.href = "http://100.64.1.100:8081/user/user.html";
      } else {
        // ログインしていない場合、ログインページに遷移
        window.location.href = "http://100.64.1.100:8081/user/login.html";
      }
    });

    $(".update-btn").on("click", function (event) {
      event.preventDefault();

      let gender = null;
      if ($("#gender").val() === "male") {
        gender = "M";
      } else if ($("#gender").val() === "female") {
        gender = "F";
      }
      const userData = {
        email: $("#email").val(),
        address: $("#postalCode").val() + "," + $("#address").val(),
        gender: gender,
        birthdate: $("#birthdate").val(),
      };

      fetch("http://100.64.1.100:8080/api/users", {
        method: "POST", // HTTPメソッドをPOSTに指定
        headers: {
          "Content-Type": "application/json", // JSONとして送る
        },
        body: JSON.stringify(userData), // 送信するデータをJSONに変換
      })
        .then((response) => {
          if (!response.ok) {
            // レスポンスが正常でない場合のエラーハンドリング
            throw new Error("Network response was not ok");
          }
          return response.json(); // レスポンスをJSONとして処理
        })
        .then((data) => {
          console.log("登録成功:", data);
          // 必要な処理をここに追加（例：画面の更新や通知）
        })
        .catch((error) => {
          console.error("エラーが発生しました:", error);
          // エラーハンドリングの処理（例：エラーメッセージを表示）
        });
    });

    $(".logout-text").on("click", function (event) {
      event.preventDefault();

      fetch("http://100.64.1.100:8080/api/logout", {
        method: "POST", // POSTメソッドを使用
        credentials: "include", // クッキーをリクエストに含める
      })
        .then((response) => {
          if (!response.ok) {
            // HTTPステータスが200番台以外の場合にエラーメッセージを表示
            if ($(".error-text").children().length === 0) {
              const error_text =
                `
                <p>` +
                response.error +
                `</p>`;
              $(".error-text").append(error_text);
            }

            return Promise.reject("ログアウト処理に失敗しました。");
          }
          return response.json();
        })
        .then((data) => {
          if (data.redirectTo) {
            // ログアウト成功時に指定されたURLにリダイレクト
            window.location.href = data.redirectTo;
          } else {
            console.error("リダイレクトURLが取得できませんでした。");
          }
        })
        .catch((error) => {
          // エラーハンドリングの強化
          console.error("ログアウト処理でエラーが発生しました:", error);
          alert("ログアウト処理に失敗しました。再度試してください。");
        });
    });

    $(".delete-text").on("click", function (event) {
      event.preventDefault(); // デフォルトのリンクの動作を防止
      // ダイアログを表示
      var deleteModal = new bootstrap.Modal($("#deleteAccountModal"));
      deleteModal.show();
    });

    $("#confirmDeleteBtn").on("click", function () {});
    document
      .getElementById("confirmDeleteBtn")
      .addEventListener("click", function () {
        // 退会処理をサーバーにリクエスト
        fetch("http://100.64.1.100:8080/api/deleteAccount", {
          method: "POST", // POSTメソッドを使用
          credentials: "include", // クッキーをリクエストに含める
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.redirectTo) {
              // ダイアログを閉じる
              var deleteModal = bootstrap.Modal.getInstance(
                $("#deleteAccountModal")
              );
              deleteModal.hide();
              // 退会成功後に指定されたURLにリダイレクト
              window.location.href = data.redirectTo;
            } else {
              if ($(".error-text").children().length === 0) {
                const error_text =
                  `
                <p>` +
                  data.error +
                  `</p>`;
                $(".error-text").append(error_text);
                console.error("退会処理に失敗しました");
              } else {
                $(".error-text").find("p").text(data.error);
              }
            }
          })
          .catch((error) => {
            console.error("退会処理でエラーが発生しました:", error);
          });
      });
  }
});
