const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // パスワード暗号化用
const db = require("./config/db"); // db.js をインポート
const path = require("path");
const session = require("express-session");

const app = express();
app.use(express.json()); // JSONリクエストを処理
app.use(express.urlencoded({ extended: true })); // フォームデータを処理

// public フォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, "public")));

const port = 8080;

// セッション設定
app.use(
  session({
    secret: "nfhoUGYudluygua", // セッションの秘密鍵
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // セッションの有効期限（1時間）
      httpOnly: true, // セキュリティ
      secure: false, // HTTPでも使用可能に設定（開発環境ではfalse）
    },
    credentials: "include",
  })
);

// CORS ミドルウェアを使用
app.use(
  cors({
    origin: "http://100.64.1.100:8081", // フロントエンドのURLを指定
    credentials: true, // クッキーを送信するために必要
  })
);

// データベース接続テスト
db.connect((err) => {
  if (err) {
    console.error("データベース接続エラー:", err.stack);
    return;
  }
  console.log("データベースに接続されました");
});

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    // セッションが存在する場合
    res.json({
      isLoggedIn: true, // ログイン状態を示すフラグ
      user: req.session.user, // ユーザー情報も返す（必要な場合）
    });
  } else {
    // セッションが存在しない場合
    res.json({
      isLoggedIn: false, // ログインしていないことを示すフラグ
    });
  }
});

// ログイン処理（POSTリクエスト）
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // メールアドレスの存在確認
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "サーバーエラーが発生しました。後ほど再試行してください。",
        });
      }

      // ユーザーが見つからない場合
      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "メールアドレスまたはパスワードが間違っています。" });
      }

      const user = results[0];

      // パスワードの照合
      const passwordMatch = await bcrypt.compare(password, user.passward);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ error: "メールアドレスまたはパスワードが間違っています。" });
      }

      // パスワードが一致した場合、セッションにユーザー情報を保存
      req.session.user = {
        email: user.email,
        name: user.user_name,
      };

      req.session.save(() => {
        res.json({ redirectTo: "http://100.64.1.100:8081/index.html" });
      });
    }
  );
});

// ログアウト処理
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "ログアウトに失敗しました。後ほど再試行してください。",
      });
    }

    // クッキーを無効にするために、クッキーの有効期限を過去に設定
    res.clearCookie("connect.sid", {
      httpOnly: true, // httpOnly 属性を設定することによって、クライアント側のJavaScriptからアクセスできないようにする
      secure: false, // 開発環境で http を使っている場合は false、https を使う場合は true
      sameSite: "lax", // クロスサイトリクエストでクッキーを送信するための制限を設定
    });

    // ログアウト成功後にリダイレクト先URLを返す
    res.json({ redirectTo: "http://100.64.1.100:8081/index.html" });
  });
});

// API: 商品情報を取得
app.get("/api/products", (req, res) => {
  const query = "select data from products;"; // productsテーブルからすべての商品を取得
  db.query(query, (err, results) => {
    if (err) {
      console.error("データベースエラー:", err);
      res.status(500).json({ error: "データベースエラーが発生しました" });
      return;
    }
    res.json(results); // 結果をJSON形式で返す
  });
});

// 新規会員登録API
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "すべての項目を入力してください。" });
  }

  try {
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // データベースにユーザー情報を挿入
    db.query(
      "INSERT INTO users (user_name, email, passward) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error(err);

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              error: "このメールアドレスはすでに使用されています。",
            });
          }

          return res.status(500).json({ error: "データベースエラー" });
        }
        res.json({ redirectTo: "http://100.64.1.100:8081/user/login.html" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

// API: ユーザー情報を取得
app.get("/api/users", (req, res) => {
  if (req.session.user) {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [req.session.user.email], (err, results) => {
      if (err) {
        console.error("データベースエラー:", err);
        res.status(500).json({ error: "データベースエラーが発生しました" });
        return;
      }
      res.json(results); // 結果をJSON形式で返す
    });
  } else {
    res.status(401).json({ error: "セッションがありません" });
  }
});

// API: ユーザー情報を登録
app.post("/api/users", (req, res) => {
  const { email, address, gender, birthdate } = req.body;
  const query =
    "UPDATE users SET address = ?, gender = ?, birthday = ? WHERE email = ?";
  db.query(query, [address, gender, birthdate, email], (err, results) => {
    if (err) {
      console.error("データベースエラー:", err);
      res.status(500).json({ error: "データベースエラーが発生しました" });
      return;
    }
    res.json(results); // 結果をJSON形式で返す
  });
});

// 退会処理
app.post("/api/deleteAccount", (req, res) => {
  const email = req.session.user?.email;

  if (!email) {
    return res.status(401).json({ error: "ユーザーがログインしていません" });
  }

  // ユーザーをデータベースから削除
  db.query("DELETE FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("データベースエラー:", err);
      return res.status(500).json({
        error: "退会に失敗しました。後ほど再試行してください。",
      });
    }

    // セッションを破棄
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "退会に失敗しました。後ほど再試行してください。" });
      }

      // クッキーを削除
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: false, // 開発環境では false
        sameSite: "lax",
      });

      // 退会処理完了後にリダイレクト先を返す
      res.json({ redirectTo: "http://100.64.1.100:8081/index.html" });
    });
  });
});

app.get("/api/order", (req, res) => {
  const { user_email } = req.query;

  // まず、ordersテーブルから注文情報を取得
  db.query(
    "SELECT id, status, total_amount, created_at, shipping_name_kanji, shipping_email, shipping_address, payment, shipping_fee FROM orders WHERE user_email = ?",
    [user_email],
    (err, orders) => {
      if (err) {
        console.error("データベースエラー:", err);
        return res.status(500).json({
          error: "データベースエラーが発生しました。後ほど再試行してください。",
        });
      }

      // 注文情報が取得できた場合
      if (orders.length > 0) {
        // 各注文に対して order_items を取得
        const orderPromises = orders.map((order) => {
          return new Promise((resolve, reject) => {
            // order_id を使って order_items テーブルからアイテム情報を取得
            db.query(
              "SELECT product_id, product_name, quantity, price, size FROM order_items WHERE order_id = ?",
              [order.id],
              (err, items) => {
                if (err) {
                  reject("注文アイテム情報の取得エラー");
                } else {
                  order.items = items; // 注文に対応するアイテム情報を追加
                  resolve(order); // 取得した注文を返す
                }
              }
            );
          });
        });

        // すべての注文アイテムが取得できたら、最終的に結果を返す
        Promise.all(orderPromises)
          .then((ordersWithItems) => {
            // 注文情報とアイテム情報が結合されたデータを返す
            res.json(ordersWithItems);
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ error: "注文アイテム情報の取得エラー", noData: true });
          });
      } else {
        // 注文がない場合
        res.status(404).json({ error: "注文がありません", noData: true });
      }
    }
  );
});

app.post("/api/order", (req, res) => {
  const { orderData, orderItemsData, isGuest, guestInfo } = req.body;

  // トランザクションを開始
  db.beginTransaction((err) => {
    if (err) {
      console.log("トランザクション開始エラー");
      return res.status(500).json({
        error:
          "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
      });
    }

    if (isGuest) {
      // ゲストユーザーとして仮のアカウントを作成
      const guestEmail = `guest_${Date.now()}@example.com`; // ランダムなゲストメールアドレスを生成
      const guestName = guestInfo.name;

      // ゲストユーザーを `guest_users` テーブルに挿入
      db.query(
        "INSERT INTO guest_users (guest_email, guest_name) VALUES (?, ?)",
        [guestEmail, guestName],
        (err, result) => {
          if (err) {
            // エラー発生時にトランザクションをロールバック
            return db.rollback(() => {
              console.log("ゲストユーザーの保存エラー");
              res.status(500).json({
                error:
                  "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
              });
            });
          }

          // ゲストユーザーが作成されたら、注文処理を続行
          const insertOrderQuery = `
          INSERT INTO orders (guest_email, shipping_name_kanji, shipping_name_kana, shipping_email, shipping_address, total_amount, memo, payment, shipping_fee)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
          db.query(
            insertOrderQuery,
            [
              guestEmail,
              orderData.shipping_name_kanji,
              orderData.shipping_name_kana,
              orderData.shipping_email,
              orderData.shipping_address,
              orderData.total_amount,
              orderData.memo,
              orderData.payment,
              orderData.shipping_fee,
            ],
            (err, orderResult) => {
              if (err) {
                return db.rollback(() => {
                  console.log("注文情報の挿入エラー");
                  res.status(500).json({
                    success: false,
                    error:
                      "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
                  });
                });
              }

              const orderId = orderResult.insertId; // 新規作成された注文ID

              // 注文が挿入された後、order_items にアイテム情報を挿入
              const orderItemsPromises = orderItemsData.map((item) => {
                item.price = item.price.replace(",", ""); // '7,000' → '7000'
                item.price = parseFloat(item.price); // '7000' → 7000 (数値型)

                const insertItemQuery = `
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size)
                VALUES (?, ?, ?, ?, ?, ?);
              `;
                return new Promise((resolve, reject) => {
                  db.query(
                    insertItemQuery,
                    [
                      orderId,
                      item.id,
                      item.name,
                      item.quantity,
                      item.price,
                      item.size,
                    ],
                    (err, result) => {
                      if (err) {
                        return db.rollback(() => {
                          console.log("注文商品情報の保存に失敗しました");
                          reject(
                            "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。"
                          );
                        });
                      } else {
                        resolve(result);
                      }
                    }
                  );
                });
              });

              // 全ての商品情報を挿入後にコミット
              Promise.all(orderItemsPromises)
                .then(() => {
                  db.commit((err) => {
                    if (err) {
                      console.log("コミットエラー");
                      // コミット失敗時のロールバック
                      return db.rollback(() => {
                        res.status(500).json({
                          success: false,
                          error:
                            "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
                        });
                      });
                    }

                    // 成功したらレスポンス
                    res.status(200).json({
                      success: true,
                      message: "注文が正常に処理されました。",
                    });
                  });
                })
                .catch((error) => {
                  db.rollback(() => {
                    res.status(500).json({ success: false, error });
                  });
                });
            }
          );
        }
      );
    } else {
      // 登録ユーザーとしての注文処理（既存のユーザー）
      const insertOrderQuery = `
      INSERT INTO orders (user_email, shipping_name_kanji, shipping_name_kana, shipping_email, shipping_address, total_amount, memo, payment, shipping_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
      db.query(
        insertOrderQuery,
        [
          orderData.user_email,
          orderData.shipping_name_kanji,
          orderData.shipping_name_kana,
          orderData.shipping_email,
          orderData.shipping_address,
          orderData.total_amount,
          orderData.memo,
          orderData.payment,
          orderData.shipping_fee,
        ],
        (err, orderResult) => {
          if (err) {
            return db.rollback(() => {
              console.log("注文情報の挿入エラー");
              res.status(500).json({
                success: false,
                error:
                  "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
              });
            });
          }

          const orderId = orderResult.insertId; // 新規作成された注文ID
          // 各 orderItem を order_items テーブルに挿入
          const orderItemsPromises = orderItemsData.map((item) => {
            item.price = item.price.replace(",", ""); // '7,000' → '7000'
            item.price = parseFloat(item.price); // '7000' → 7000 (数値型)

            const insertItemQuery = `
            INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size)
            VALUES (?, ?, ?, ?, ?, ?);
          `;
            return new Promise((resolve, reject) => {
              db.query(
                insertItemQuery,
                [
                  orderId,
                  item.id,
                  item.name,
                  item.quantity,
                  item.price,
                  item.size,
                ],
                (err, result) => {
                  if (err) {
                    return db.rollback(() => {
                      console.log("注文商品情報の保存に失敗しました");
                      reject(
                        "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。"
                      );
                    });
                  } else {
                    resolve(result);
                  }
                }
              );
            });
          });

          // 全ての商品情報を挿入後に完了レスポンスを返す
          Promise.all(orderItemsPromises)
            .then(() => {
              db.commit((err) => {
                if (err) {
                  console.log("コミットエラー");
                  return db.rollback(() => {
                    res.status(500).json({
                      error:
                        "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
                    });
                  });
                }

                // 成功したらレスポンス
                res.json({ success: "注文が完了しました", orderId });
              });
            })
            .catch((error) => {
              db.rollback(() => {
                res.status(500).json({ error });
              });
            });
        }
      );
    }
  });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
