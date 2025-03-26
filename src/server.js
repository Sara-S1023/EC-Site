const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // db.js をインポート
const path = require("path");
const session = require("express-session");

const app = express();
app.use(express.json()); // JSONリクエストを処理
app.use(express.urlencoded({ extended: true })); // フォームデータを処理

// public フォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, "public")));

const port = 8080;

const sessionRoutes = require("./controllers/session");
const loginRoutes = require("./controllers/login");
const logoutRoutes = require("./controllers/logout");
const registerRoutes = require("./controllers/register");
const deleteAccountRoutes = require("./controllers/deleteAccount");
const getUsersRoutes = require("./controllers/getUsers");
const postUsersRoutes = require("./controllers/postUsers");
const productRoutes = require("./controllers/products");
const getOrderRoutes = require("./controllers/getOrder");
const postOrderRoutes = require("./controllers/postOrder");

// セッション設定
app.use(
  session({
    secret: "nfhoUGYudluygua", // セッションの秘密鍵
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // セッションの有効期限（1時間）
      httpOnly: true, // セキュリティ
      secure: false, // HTTPでも使用可能に設定（開発環境ではfalse）
    },
    credentials: "include",
  })
);

// CORS ミドルウェアを使用
app.use(
  cors({
    origin: "http://100.64.1.100:8081", // フロントエンドのURLを指定
    credentials: true, // クッキーを送信するために必要
  })
);

// データベース接続テスト
db.connect((err) => {
  if (err) {
    console.error("データベース接続エラー:", err.stack);
    return;
  }
  console.log("データベースに接続されました");
});

app.use("/api", sessionRoutes);
app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api", logoutRoutes);
app.use("/api", registerRoutes);
app.use("/api", deleteAccountRoutes);
app.use("/api", getUsersRoutes);
app.use("/api", postUsersRoutes);
app.use("/api", productRoutes);
app.use("/api", getOrderRoutes);
app.use("/api", postOrderRoutes);

module.exports = app;

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
