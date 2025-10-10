## Express Example App

Minimal server demonstrating all three gateways behind a unified API.

### Setup

1. Copy `.env.example` to `.env` and fill sandbox credentials (if available).
2. Install and build: `pnpm i && pnpm --filter express-app build`
3. Start: `pnpm --filter express-app start`

### Endpoints

- `POST /payments` – body `{ method, amount, customer?, metadata?, callbackUrls? }`
- `GET /payments/:provider/:ref`
- `POST /webhooks/:provider`

### Env variables

- SSL: `SSL_BASE_URL`, `SSL_STORE_ID`, `SSL_STORE_PASSWORD`, `SSL_DEFAULT_CURRENCY`
- bKash: `BKASH_BASE_URL`, `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`, `BKASH_TIMEOUT_MS`
- Nagad: `NAGAD_BASE_URL`, `NAGAD_MERCHANT_ID`, `NAGAD_PRIVATE_KEY`, `NAGAD_PUBLIC_KEY`, `NAGAD_TIMEOUT_MS`
