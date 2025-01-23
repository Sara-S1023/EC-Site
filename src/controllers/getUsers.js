const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.get("/users", (req, res) => {
  if (req.session.user) {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [req.session.user.email], (err, results) => {
      if (err) {
        console.error("データベースエラー:", err);
        res.status(500).json({ error: "データベースエラーが発生しました" });
        return;
      }
      res.status(200).json(results); // 結果をJSON形式で返す
    });
  } else {
    res.status(401).json({ error: "セッションがありません" });
  }
});

module.exports = router;
