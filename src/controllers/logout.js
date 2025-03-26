const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "ログアウトに失敗しました。後ほど再試行してください。",
      });
    }

    // クッキーを無効にするために、クッキーの有効期限を過去に設定
    res.clearCookie("connect.sid", {
      httpOnly: true, // httpOnly 属性を設定することによって、クライアント側のJavaScriptからアクセスできないようにする
      secure: false, // 開発環境で http を使っている場合は false、https を使う場合は true
      sameSite: "lax", // クロスサイトリクエストでクッキーを送信するための制限を設定
    });

    // ログアウト成功後にリダイレクト先URLを返す
    res.status(200).json({ redirectTo: "http://100.64.1.100:8081/index.html" });
  });
});

module.exports = router;
