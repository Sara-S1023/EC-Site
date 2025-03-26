const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("GET /api/users", () => {
  let agent;

  beforeAll(() => {
    // セッションを維持したままでリクエストを送信するために agent を作成
    agent = request.agent(app);
  });

  // 正常系
  it("セッションにユーザー情報があり正常にデータが取得できた場合、200ステータス&レスポンスにユーザー情報が格納されること", async () => {
    await agent
      .post("/api/login")
      .send({ email: "sara@email.com", password: "pass" })
      .expect(200);

    const response = await agent.get("/api/users").expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  // 異常系
  it("セッションがない場合、401ステータスとエラーメッセージが返されること", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("セッションがありません");
  });

  // 異常系
  it("データベースエラーが発生した場合、500ステータスとエラーメッセージが返されること", async () => {
    await agent
      .post("/api/login")
      .send({ email: "sara@email.com", password: "pass" })
      .expect(200);

    const response = await agent.get("/api/users").expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("データベースエラーが発生しました");
  });
});
