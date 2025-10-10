## TransactBD

Unified Node.js/TypeScript SDK for Bangladesh payment gateways: bKash, SSLCommerz, and Nagad. Monorepo with core contracts/utilities, provider adapters, an Express helper, and an example server.

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

### Open source and contributions

TransactBD is an open-source project focused on Bangladesh payment gateways to make integrations easier and portable across providers. If you want to improve reliability, coverage, or docs, please open a PR and contribute — contribution areas are welcome: adapters, tests/mocks, docs, DX, and examples.
