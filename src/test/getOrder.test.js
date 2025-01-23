const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("GET /api/order", () => {
  it("注文が正常に取得できた場合、200ステータスと注文情報を返す", async () => {
    const response = await request(app)
      .get("/api/order")
      .query({ user_email: "sara@email.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("id", 62);
    expect(response.body[0].items).toHaveLength(1);
    expect(response.body[0].items[0].product_id).toBe(10);
  });

  it("データベースエラーが発生した場合、500ステータスとエラーメッセージを返す", async () => {
    const response = await request(app)
      .get("/api/order")
      .query({ user_email: "sara@email.com" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "データベースエラーが発生しました。後ほど再試行してください。"
    );
  });

  it("注文が見つからない場合、404ステータスとエラーメッセージを返す", async () => {
    const response = await request(app)
      .get("/api/order")
      .query({ user_email: "notfound@example.com" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("注文がありません");
    expect(response.body.noData).toBe(true);
  });

  it("注文アイテム情報の取得に失敗した場合、500ステータスとエラーメッセージを返す", async () => {
    const response = await request(app)
      .get("/api/order")
      .query({ user_email: "sara@email.com" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("注文アイテム情報の取得エラー");
  });
});
