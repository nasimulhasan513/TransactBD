import { describe, it, expect } from "vitest";
import { verifyWebhook } from "../src/webhook";

describe("Nagad webhook verify", () => {
  it("returns false without signature", async () => {
    const res = await verifyWebhook(JSON.stringify({ a: 1 }), {}, "PUBLIC_KEY");
    expect(res.ok).toBe(false);
  });
});
