const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.get("/products", (req, res) => {
  const query = "select data from products;"; // productsテーブルからすべての商品を取得
  db.query(query, (err, results) => {
    if (err) {
      console.error("データベースエラー:", err);
      res.status(500).json({ error: "データベースエラーが発生しました" });
      return;
    }
    res.status(200).json(results); // 結果をJSON形式で返す
  });
});

module.exports = router;
