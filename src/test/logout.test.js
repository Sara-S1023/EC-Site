const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("POST /api/logout", () => {
  let agent;

  beforeAll(() => {
    // セッションを維持したままでリクエストを送信するために agent を作成
    agent = request.agent(app);
  });

  // 正常系
  it("ログアウトに成功し場合、200ステータス&レスポンスにリダイレクト先が格納されること", async () => {
    await agent
      .post("/api/login")
      .send({ email: "sara@email.com", password: "pass" })
      .expect(200);

    const response = await agent.post("/api/logout").expect(200);

    expect(response.status).toBe(200);
    expect(response.body.redirectTo).toBe(
      "http://100.64.1.100:8081/index.html"
    );
  });

  // 異常系
  it("セッションの破棄に失敗した場合、500ステータスとエラーメッセージが返されること", async () => {
    await agent
      .post("/api/login")
      .send({ email: "sara@email.com", password: "pass" })
      .expect(200);

    const response = await agent.post("/api/logout").expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "ログアウトに失敗しました。後ほど再試行してください。"
    );
  });
});
