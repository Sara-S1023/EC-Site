const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("GET /api/products", () => {
  it("商品が正常に取得できた場合、200ステータスを返す", async () => {
    const response = await request(app).get("/api/products").expect(200);
  });

  it("データベースエラーが発生した場合、500ステータスとメッセージを返す", async () => {
    const response = await request(app).get("/api/products").expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("データベースエラーが発生しました");
  });
});
