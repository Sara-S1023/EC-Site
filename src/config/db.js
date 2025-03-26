const mysql = require("mysql2"); // mysql2を使用

const connection = mysql.createConnection({
  host: "localhost", // MySQLサーバーのホスト名
  user: "root", // MySQLユーザー名
  password: "nvsiYNdfgjUentivs2025!", // MySQLパスワード
  database: "products", // 使用するデータベース名
});

// データベース接続をエクスポート
module.exports = connection;
