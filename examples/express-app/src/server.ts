import express from "express";
import "dotenv/config";
import { makeWebhookHandler } from "@transactbd/express";
import { bkash, ssl, nagad } from "./gateways";

const app = express();

app.use(express.json({ verify: (req, _res, buf) => ((req as any).rawBody = buf) }));

app.post("/payments", async (req, res) => {
  try {
    const { method, amount, customer, metadata, callbackUrls } = req.body || {};
    const gateway = method === "bkash" ? bkash : method === "nagad" ? nagad : ssl;
    const intent = await gateway.createPayment({
      method,
      amount,
      customer,
      metadata,
      callbackUrls,
    });
    res.json(intent);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "bad_request" });
  }
});

app.get("/payments/:provider/:ref", async (req, res) => {
  const { provider, ref } = req.params as any;
  const gateway = provider === "bkash" ? bkash : provider === "nagad" ? nagad : ssl;
  const intent = await gateway.getPayment(ref);
  res.json(intent);
});

app.post("/webhooks/bkash", makeWebhookHandler(bkash));
app.post("/webhooks/sslcommerz", makeWebhookHandler(ssl));
app.post("/webhooks/nagad", makeWebhookHandler(nagad));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
