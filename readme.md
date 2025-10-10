## TransactBD

Unified TypeScript SDK for Bangladesh payment gateways: bKash, SSLCommerz, and Nagad. This monorepo includes core contracts/utilities, provider adapters, an Express helper, and a runnable example server.

### Packages

- `@transactbd/core`: Types, errors, HTTP client with retries/timeout, idempotency helpers
- `@transactbd/sslcommerz`: Hosted checkout adapter
- `@transactbd/bkash`: Tokenized checkout adapter (token caching)
- `@transactbd/nagad`: Adapter with RSA signature verification utilities
- `@transactbd/express`: Webhook glue for Express

### Scripts

- `pnpm build` – builds all packages
- `pnpm test` – runs tests across packages
- `pnpm lint` – lints sources
- `pnpm typecheck` – TypeScript project checks

### Example app

See `examples/express-app` for a minimal server exposing unified endpoints:

- `POST /payments` – create payment
- `GET /payments/:provider/:ref` – query payment
- `POST /webhooks/:provider` – webhook endpoints

Environment variables expected (fill sandbox creds):

- SSLCommerz: `SSL_BASE_URL`, `SSL_STORE_ID`, `SSL_STORE_PASSWORD`, `SSL_DEFAULT_CURRENCY`
- bKash: `BKASH_BASE_URL`, `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`, `BKASH_TIMEOUT_MS`
- Nagad: `NAGAD_BASE_URL`, `NAGAD_MERCHANT_ID`, `NAGAD_PRIVATE_KEY`, `NAGAD_PUBLIC_KEY`, `NAGAD_TIMEOUT_MS`

### Testing

`vitest` + `nock` used for HTTP; `supertest` for Express handler. Run `pnpm test`.

### Notes

- Secrets are never logged; errors redact sensitive data.
- Inputs validated via zod; idempotency keys normalized.

## Quick start

Prereqs: Node 18/20/22, pnpm.

1. Install and build

```
pnpm i
pnpm -w build
```

2. Run tests

```
pnpm -w test
```

3. Start the example server

```
cp examples/express-app/.env.example examples/express-app/.env
pnpm --filter express-app build && pnpm --filter express-app start
```

### Usage snippets

Core HTTP

```ts
import { http } from "@transactbd/core";
const data = await http("/ping", { method: "GET" }, { baseUrl: "https://api" });
```

Create an SSLCommerz payment

```ts
import { SslCommerzGateway } from "@transactbd/sslcommerz";
const ssl = new SslCommerzGateway({ baseUrl, storeId, storePassword });
const intent = await ssl.createPayment({
  method: "sslcommerz",
  amount: { value: 100, currency: "BDT" },
});
```

Express webhook

```ts
import express from "express";
import { makeWebhookHandler } from "@transactbd/express";
app.use(express.json({ verify: (req, _res, buf) => ((req as any).rawBody = buf) }));
app.post("/webhooks/sslcommerz", makeWebhookHandler(ssl));
```

### Links to package docs

- Core: `packages/core/README.md`
- SSLCommerz: `packages/sslcommerz/README.md`
- bKash: `packages/bkash/README.md`
- Nagad: `packages/nagad/README.md`
- Express: `packages/express/README.md`

### Open source and contributions

TransactBD is open-source to make Bangladesh gateway integrations easier and portable across providers. PRs welcome across adapters, tests/mocks, docs, DX, and examples. Author: Nasimul Hasan Deep. License: MIT.
