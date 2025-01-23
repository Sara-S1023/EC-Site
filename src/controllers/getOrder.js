const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.get("/order", (req, res) => {
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
            res.status(200).json(ordersWithItems);
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

module.exports = router;
