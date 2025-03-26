const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/order", (req, res) => {
  const { orderData, orderItemsData, isGuest, guestInfo } = req.body;

  // トランザクションを開始
  db.beginTransaction((err) => {
    if (err) {
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
            console.log(err);
            return db.rollback(() => {
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
                console.log(err);
                return db.rollback(() => {
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
                  return db.rollback(() => {
                    res.status(500).json({
                      error:
                        "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。",
                    });
                  });
                }

                // 成功したらレスポンス
                res.status(200).json({
                  success: true,
                  message: "注文が正常に処理されました。",
                  orderId,
                });
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

module.exports = router;
