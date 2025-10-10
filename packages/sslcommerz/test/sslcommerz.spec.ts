import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SslCommerzGateway } from "../src";

describe("SslCommerzGateway", () => {
  const baseUrl = "https://sandbox.sslcommerz.com";
  const gw = new SslCommerzGateway({
    baseUrl,
    storeId: "store",
    storePassword: "pass",
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

  it("createPayment returns redirectUrl", async () => {
    nock(baseUrl)
      .post("/gwprocess/v4/api.php")
      .reply(200, { status: "SUCCESS", GatewayPageURL: "https://pay/redirect", tran_id: "T1" });
    const res = await gw.createPayment({
      method: "sslcommerz",
      amount: { value: 100, currency: "BDT" },
    });
    expect(res.redirectUrl).toBe("https://pay/redirect");
    expect(res.providerReference).toBe("T1");
  });

  it("getPayment maps status", async () => {
    nock(baseUrl)
      .get(/validator\/api\/validationserverAPI\.php.*/)
      .reply(200, { status: "VALID", tran_id: "T1", amount: "100", currency: "BDT" });
    const res = await gw.getPayment("T1");
    expect(res.status).toBe("succeeded");
  });
});
