const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("POST /api/users", () => {
  it("ユーザー情報の更新が正常に行われた場合、200ステータスを返す", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "test@email.com",
        address: "2222222,神奈川県川崎市川崎区",
        gender: "F",
        birthdate: "1990-01-01",
      })
      .expect(200);

    expect(response.status).toBe(200);
  });

  it("データベースエラーが発生した場合、500ステータスとメッセージを返す", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "test@email.com",
        address: "2222222,神奈川県川崎市川崎区",
        gender: "H",
        birthdate: "1990-01-01",
      })
      .expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "ユーザー情報の更新に失敗しました。後ほど再試行してください。"
    );
  });
});
