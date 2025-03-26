const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("POST /api/register", () => {
  /*it("正常な入力でユーザー登録成功後、200ステータスとリダイレクト先を返す", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        name: "FAN",
        email: "fan@email.com",
        password: "pass",
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body.redirectTo).toBe(
      "http://100.64.1.100:8081/user/login.html"
    );
  });

  it("すべての項目が入力されていない場合、400ステータスとメッセージを返す", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        name: null,
        email: "gunpii@email.com",
        password: "pass",
      })
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("すべての項目を入力してください。");
  });

  it("メールアドレスがすでに登録されている場合、409ステータスとメッセージを返す", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        name: "山口 大樹",
        email: "gunpii@email.com",
        password: "pass",
      })
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      "このメールアドレスはすでに使用されています。"
    );
  });*/

  it("サーバーエラーが発生した場合、500ステータスとメッセージを返す", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        name: "あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
        email: "neko@email.com",
        password: "pass",
      })
      .expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("データベースエラー");
  });
});
