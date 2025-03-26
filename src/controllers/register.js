const express = require("express");
const bcrypt = require("bcrypt"); // パスワード暗号化用
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  const pattern =
    /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "すべての項目を入力してください。" });
  }

  if (!pattern.test(email)) {
    /*パターンにマッチした場合*/
    return res.status(400).json({
      error: "不正なメールアドレスの形式です。再度確認してください。",
    });
  }

  if (String(password) !== String(confirm_password)) {
    return res.status(400).json({
      error:
        "パスワードと確認用パスワードが一致しません。再度確認してください。",
    });
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
