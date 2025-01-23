const express = require("express");
const db = require("../config/db"); // db.js をインポート
const router = express.Router();

router.post("/deleteAccount", (req, res) => {
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
      res
        .status(200)
        .json({ redirectTo: "http://100.64.1.100:8081/index.html" });
    });
  });
});

module.exports = router;
