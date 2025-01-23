const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/users", (req, res) => {
  const { email, address, gender, birthdate } = req.body;
  const query =
    "UPDATE users SET address = ?, gender = ?, birthday = ? WHERE email = ?";
  db.query(query, [address, gender, birthdate, email], (err, results) => {
    if (err) {
      console.error("データベースエラー:", err);
      res.status(500).json({ error: "データベースエラーが発生しました" });
      return;
    }
    res.status(200).json(results); // 結果をJSON形式で返す
  });
});

module.exports = router;
