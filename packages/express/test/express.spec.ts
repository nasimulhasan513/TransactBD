import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { makeWebhookHandler } from "../src";

const okGateway = {
  verifyWebhook: async () => ({ ok: true }),
} as any;

const badGateway = {
  verifyWebhook: async () => ({ ok: false }),
} as any;

describe("makeWebhookHandler", () => {
  it("returns 200 for ok", async () => {
    const app = express();
    app.use(express.json({ verify: (req, _res, buf) => ((req as any).rawBody = buf) }));
    app.post("/webhook", makeWebhookHandler(okGateway));
    await request(app).post("/webhook").send({ a: 1 }).expect(200);
  });

  it("returns 400 for invalid", async () => {
    const app = express();
    app.use(express.json({ verify: (req, _res, buf) => ((req as any).rawBody = buf) }));
    app.post("/webhook", makeWebhookHandler(badGateway));
    await request(app).post("/webhook").send({ a: 1 }).expect(400);
  });
});
