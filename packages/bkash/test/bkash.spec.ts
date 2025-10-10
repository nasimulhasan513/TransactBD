import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { BkashGateway } from "../src";

describe("BkashGateway", () => {
  const baseUrl = "https://sandbox.bkash.com";
  const gw = new BkashGateway({
    baseUrl,
    appKey: "k",
    appSecret: "s",
    username: "u",
    password: "p",
  });

  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("caches token between calls", async () => {
    nock(baseUrl).post("/token/grant").reply(200, { id_token: "jwt", expires_in: 300 });
    nock(baseUrl).post("/create").reply(200, { paymentID: "P1", redirectURL: "https://r" });
    nock(baseUrl)
      .get(/payment\/status.*/)
      .reply(200, { status: "COMPLETED", amount: "100" });
    const intent = await gw.createPayment({
      method: "bkash",
      amount: { value: 100, currency: "BDT" },
    });
    expect(intent.redirectUrl).toBe("https://r");
    const q = await gw.getPayment("trx");
    expect(q.status).toBe("succeeded");
  });

  it("retries on 500 during query", async () => {
    nock(baseUrl).post("/token/grant").reply(200, { id_token: "jwt", expires_in: 300 });
    nock(baseUrl)
      .get(/payment\/status.*/)
      .reply(500, { err: 1 });
    nock(baseUrl)
      .get(/payment\/status.*/)
      .reply(200, { status: "COMPLETED", amount: "50" });
    const q = await gw.getPayment("trx2");
    expect(q.status).toBe("succeeded");
  });
});
