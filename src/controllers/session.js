const express = require("express");
const router = express.Router();

router.get("/session", (req, res) => {
  if (req.session.user) {
    // セッションが存在する場合
    res.json({
      isLoggedIn: true, // ログイン状態を示すフラグ
      user: req.session.user, // ユーザー情報も返す（必要な場合）
    });
  } else {
    // セッションが存在しない場合
    res.json({
      isLoggedIn: false, // ログインしていないことを示すフラグ
    });
  }
});
module.exports = router;
