## @transactbd/express

Express glue for TransactBD webhooks with raw body support.

### Example

```ts
import { makeWebhookHandler } from "@transactbd/express";
app.use(express.json({ verify: (req, _res, buf) => ((req as any).rawBody = buf) }));
app.post("/webhooks/bkash", makeWebhookHandler(bkash));
```
