## @transactbd/bkash

bKash adapter with token caching.

### Install

```
pnpm add @transactbd/bkash @transactbd/core
```

### Config

- `baseUrl`, `appKey`, `appSecret`, `username`, `password`, `timeoutMs?`

You can also set via environment variables (recommended):

- `BKASH_BASE_URL`, `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`, `BKASH_TIMEOUT_MS`

### Usage

```ts
import { BkashGateway } from "@transactbd/bkash";

const bkash = new BkashGateway({ baseUrl, appKey, appSecret, username, password });
const intent = await bkash.createPayment({
  method: "bkash",
  amount: { value: 100, currency: "BDT" },
  customer: { name: "Alice", phone: "+8801XXXXXXXXX" },
  callbackUrls: { successUrl: "https://example.com/success" },
});

// Query later by provider reference
const polled = await bkash.getPayment(intent.providerReference!);

// Refund (full or partial)
await bkash.refund(intent.providerReference!, 50);
```
