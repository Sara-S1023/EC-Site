const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("POST /api/login", () => {
  // 正常系
  it("ログインに成功した場合、200ステータス&リダイレクト先の返還とセッションにユーザー情報が格納されること", async () => {
    const response = await request(app).post("/api/login").send({
      email: "sara@email.com",
      password: "pass",
    });

    expect(response.status).toBe(200);
    expect(response.body.redirectTo).toBe(
      "http://100.64.1.100:8081/index.html"
    );
  });

  // 異常系（不正なメールアドレス）
  it("存在しないメールアドレスでログインしようとした場合、401ステータスとエラーメッセージが返されること", async () => {
    const response = await request(app).post("/api/login").send({
      email: "nonexistent@example.com",
      password: "pass",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "メールアドレスまたはパスワードが間違っています。"
    );
  });

  // 異常系（不正なパスワード）
  it("間違ったパスワードでログインしようとした場合、401ステータスとエラーメッセージが返されること", async () => {
    const response = await request(app).post("/api/login").send({
      email: "sara@email.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "メールアドレスまたはパスワードが間違っています。"
    );
  });

  // 異常系（不正な入力形式）
  it("不正な形式のメールアドレスを送信した場合、400ステータスとエラーメッセージが返されること", async () => {
    const response = await request(app).post("/api/login").send({
      email: "invalid-email-format",
      password: "anyPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "不正なメールアドレスの形式です。再度確認してください。"
    );
  });
});
