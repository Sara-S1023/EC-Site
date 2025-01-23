const express = require("express");
const bcrypt = require("bcrypt"); // パスワード暗号化用
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/register", async (req, res) => {
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
        res
          .status(200)
          .json({ redirectTo: "http://100.64.1.100:8081/user/login.html" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

module.exports = router;
