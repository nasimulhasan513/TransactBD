import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { NagadGateway } from "../src";

describe("NagadGateway", () => {
  const baseUrl = "https://sandbox.nagad.com.bd";
  const gw = new NagadGateway({
    baseUrl,
    merchantId: "m",
    privateKey: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
    publicKey: "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----",
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

  it("createPayment returns redirect", async () => {
    nock(baseUrl)
      .post("/init")
      .reply(200, { redirectURL: "https://r", trxId: "N1", status: "SUCCESS" });
    const res = await gw.createPayment({
      method: "nagad",
      amount: { value: 120, currency: "BDT" },
    });
    expect(res.redirectUrl).toBe("https://r");
    expect(res.providerReference).toBe("N1");
  });

  it("getPayment maps status", async () => {
    nock(baseUrl)
      .get(/query.*/)
      .reply(200, { status: "SUCCESS", amount: "120" });
    const res = await gw.getPayment("N1");
    expect(res.status).toBe("succeeded");
  });
});
