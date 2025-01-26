const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/deleteAccount", async (req, res) => {
  const email = req.session.user ? req.session.user.email : null;

  if (!email) {
    return res.status(401).json({ error: "ユーザーがログインしていません" });
  }

  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "退会に失敗しました。後ほど再試行してください。" });
    }

    // 1. 注文を確認
    db.query(
      "SELECT * FROM orders WHERE user_email = ?",
      [email],
      (err, orders) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({
              error: "退会に失敗しました。後ほど再試行してください。",
            });
          });
        }

        // 配送中または準備中の注文があるか確認
        const hasShippingOrders = orders.some(
          (order) =>
            order.status !== "delivered" && order.status !== "cancelled"
        );

        if (hasShippingOrders) {
          return db.rollback(() => {
            return res.status(409).json({
              error:
                "お届けが完了していない注文があるため、会員情報を削除できません。",
            });
          });
        }

        // 2. 注文を削除
        db.query("DELETE FROM orders WHERE user_email = ?", [email], (err) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({
                error: "退会に失敗しました。後ほど再試行してください。",
              });
            });
          }

          // 3. ユーザーを削除
          db.query("DELETE FROM users WHERE email = ?", [email], (err) => {
            if (err) {
              return db.rollback(() => {
                return res.status(500).json({
                  error: "退会に失敗しました。後ほど再試行してください。",
                });
              });
            }

            // トランザクションをコミット
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  return res.status(500).json({
                    error: "退会に失敗しました。後ほど再試行してください。",
                  });
                });
              }

              // セッションを破棄
              req.session.destroy((err) => {
                if (err) {
                  return res.status(500).json({
                    error: "退会に失敗しました。後ほど再試行してください。",
                  });
                }

                // クッキーを削除
                res.clearCookie("connect.sid", {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax",
                });

                // 完了メッセージ
                res.status(200).json({
                  redirectTo: "http://100.64.1.100:8081/index.html",
                });
              });
            });
          });
        });
      }
    );
  });
});

module.exports = router;
