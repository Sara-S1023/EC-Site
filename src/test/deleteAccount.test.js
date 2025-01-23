const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("POST /api/deleteAccount", () => {
  let agent;

  beforeAll(() => {
    // セッションを維持したままでリクエストを送信するために agent を作成
    agent = request.agent(app);
  });

  // 正常系
  it("ログイン後、退会処理が成功市リダイレクト先が返還されること", async () => {
    // まず、ユーザーがログインしていることを確認
    await agent
      .post("/api/login")
      .send({ email: "vrh@email.com", password: "pass" })
      .expect(200);

    // 退会処理を行う
    const response = await agent.post("/api/deleteAccount").expect(200);

    expect(response.status).toBe(200);
    expect(response.body.redirectTo).toBe(
      "http://100.64.1.100:8081/index.html"
    );

    // 退会後にセッションが削除されていることを確認
    const sessionResponse = await agent.get("/api/session").expect(200);
    expect(response.body.redirectTo).toBe(
      "http://100.64.1.100:8081/index.html"
    );
    expect(sessionResponse.body.isLoggedIn).toBe(false); // ログインしていない状態を確認
  });

  // 異常系
  it("ログインしていない場合、401ステータスとエラーメッセージが返されること", async () => {
    const response = await request(app).post("/api/deleteAccount").send({
      email: undefined,
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("ユーザーがログインしていません");
  });

  // 異常系
  it("データベースエラーが発生した場合、500ステータスとエラーメッセージが返されること", async () => {
    // まず、ユーザーがログインしていることを確認
    await agent
      .post("/api/login")
      .send({ email: "kouta@email.com", password: "pass" })
      .expect(200);

    const response = await agent.post("/api/deleteAccount").expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "退会に失敗しました。後ほど再試行してください。"
    );
  });
});
