const express = require("express");
const bcrypt = require("bcrypt"); // パスワード暗号化用
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const pattern =
    /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

  // メールアドレスの形式確認
  if (!pattern.test(email)) {
    /*パターンにマッチした場合*/
    return res.status(400).json({
      error: "不正なメールアドレスの形式です。再度確認してください。",
    });
  }

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
        res
          .status(200)
          .json({ redirectTo: "http://100.64.1.100:8081/index.html" });
      });
    }
  );
});

module.exports = router;
