const request = require("supertest");
const app = require("../server"); // サーバーのインスタンスをインポート

describe("POST /api/order", () => {
  it("ゲストユーザーとして注文が正常に処理された場合、200ステータスとメッセージを返す", async () => {
    const orderData = {
      user_email: "guest",
      total_amount: 6499,
      shipping_name_kanji: "田中 太郎",
      shipping_name_kana: "タナカ タロウ",
      shipping_email: "tanaka@email.com",
      shipping_address: "0000000,北海道択捉島〇〇町1-1-1",
      memo: "置き配",
      payment: "bank",
      shipping_fee: true,
    };
    const orderItemsData = [
      {
        id: 15,
        name: "Smooth Half-pants",
        quantity: 1,
        price: "6,000",
        size: "L",
      },
    ];
    const guestInfo = {
      name: "タナカ タロウ",
    };
    const response = await request(app)
      .post("/api/order")
      .send({
        orderData,
        orderItemsData,
        isGuest: true,
        guestInfo,
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("注文が正常に処理されました。");
    expect(response.body.success).toBe(true);
  });

  it("登録ユーザーとして注文が正常に処理された場合、200ステータスとメッセージを返す", async () => {
    const orderData = {
      user_email: "sara@email.com",
      total_amount: 15000,
      shipping_name_kanji: "坂本 紗良",
      shipping_name_kana: "サカモト サラ",
      shipping_email: "sara@email.com",
      shipping_address: "1111111,東京都中央区日本橋2-2-2",
      memo: "置き配",
      payment: "cash",
      shipping_fee: false,
    };
    const orderItemsData = [
      {
        id: 9,
        name: "Engineer Boots",
        quantity: 1,
        price: "15,000",
        size: "22.0",
      },
    ];
    const guestInfo = {
      name: "サカモト サラ",
    };
    const response = await request(app)
      .post("/api/order")
      .send({
        orderData,
        orderItemsData,
        isGuest: false,
        guestInfo,
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("注文が正常に処理されました。");
    expect(response.body.success).toBe(true);
  });

  it("トランザクションエラーが発生した場合、500エラーとメッセージを返す", async () => {
    const orderData = {
      user_email: "sara@email.com",
      total_amount: "15,000",
      shipping_name_kanji: "坂本 紗良",
      shipping_name_kana: "サカモト サラ",
      shipping_email: "sara@email.com",
      shipping_address: "1111111" + "," + "東京都中央区日本橋2-2-2",
      memo: "",
      payment: "cash",
      shipping_fee: false,
    };
    const orderItemsData = [
      {
        id: 9,
        name: "Engineer Boots",
        quantity: 1,
        price: "15,000",
        size: "22.0",
      },
    ];
    const guestInfo = {
      name: "サカモト サラ",
    };
    const response = await request(app)
      .post("/api/order")
      .send({
        orderData,
        orderItemsData,
        isGuest: false,
        guestInfo,
      })
      .expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。"
    );
  });

  it("商品情報の挿入に失敗した場合、500エラーとメッセージを返す", async () => {
    const orderData = {
      user_email: "sara@email.com",
      total_amount: "15,000",
      shipping_name_kanji: "坂本 紗良",
      shipping_name_kana: "サカモト サラ",
      shipping_email: "sara@email.com",
      shipping_address: "1111111" + "," + "東京都中央区日本橋2-2-2",
      memo: "",
      payment: "cash",
      shipping_fee: false,
    };
    const orderItemsData = [
      {
        id: 100,
        name: "kimono",
        quantity: 1,
        price: "15,000",
        size: "22.0",
      },
    ];
    const guestInfo = {
      name: "サカモト サラ",
    };
    const response = await request(app)
      .post("/api/order")
      .send({
        orderData,
        orderItemsData,
        isGuest: false,
        guestInfo,
      })
      .expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。"
    );
  });

  it("注文情報の挿入に失敗した場合、500エラーとメッセージを返す", async () => {
    const orderData = {
      user_email: "sara@email.com",
      total_amount: "15,000",
      shipping_name_kanji: null,
      shipping_name_kana: "サカモト サラ",
      shipping_email: "sara@email.com",
      shipping_address: "1111111" + "," + "東京都中央区日本橋2-2-2",
      memo: "",
      payment: "cash",
      shipping_fee: false,
    };
    const orderItemsData = [
      {
        id: 9,
        name: "Engineer Boots",
        quantity: 1,
        price: "15,000",
        size: "22.0",
      },
    ];
    const guestInfo = {
      name: "サカモト サラ",
    };
    const response = await request(app)
      .post("/api/order")
      .send({
        orderData,
        orderItemsData,
        isGuest: false,
        guestInfo,
      })
      .expect(500);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "購入処理中に問題が発生しました。ネットワーク接続を確認し、もう一度お試しください。"
    );
  });
});
