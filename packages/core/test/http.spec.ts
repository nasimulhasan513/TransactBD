import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import nock from "nock";
import { http } from "../src/http";

describe("http", () => {
  const baseUrl = "https://api.example.test";

  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("retries on 500 then succeeds", async () => {
    nock(baseUrl).get("/ping").reply(500, { error: "boom" });
    nock(baseUrl).get("/ping").reply(200, { ok: true });
    const res = await http<{ ok: boolean }>("/ping", {}, { baseUrl, retries: 1 });
    expect(res.ok).toBe(true);
  });

  it("does not retry on 400", async () => {
    nock(baseUrl).get("/bad").reply(400, { error: "bad" });
    await expect(http("/bad", {}, { baseUrl, retries: 2 })).rejects.toMatchObject({
      status: 400,
    });
  });

  it("times out requests", async () => {
    nock(baseUrl).get("/slow").delay(50).reply(200, { ok: true });
    await expect(http("/slow", {}, { baseUrl, timeoutMs: 10, retries: 0 })).rejects.toMatchObject({
      name: "NetworkError",
    });
  });
});
