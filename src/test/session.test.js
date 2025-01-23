const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("GET /api/session", () => {
  let agent;

  beforeAll(() => {
    // セッションを維持したままでリクエストを送信するために agent を作成
    agent = request.agent(app);
  });

  // 正常系
  it("セッションがある場合、フラグがtrue&レスポンスにユーザー情報が格納されること", async () => {
    await agent
      .post("/api/login")
      .send({ email: "sara@email.com", password: "pass" })
      .expect(200);

    const response = await agent.get("/api/session");

    expect(response.body.isLoggedIn).toBe(true);
    expect(response.body.user).toHaveProperty("email");
  });

  // 異常系
  it("セッションがない場合、フラグがfalseになること", async () => {
    const response = await request(app).get("/api/session");

    expect(response.body.isLoggedIn).toBe(false);
  });
});
