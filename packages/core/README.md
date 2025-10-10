## @transactbd/core

Core types and utilities for TransactBD.

### Features

- Typed errors: `PaymentError`, `AuthError`, `NetworkError`, `WebhookError`, `ValidationError`
- HTTP client with retries (429/5xx), timeout, safe JSON
- Canonical types: `PaymentIntent`, `CreateParams`, `PaymentStatus`
- Idempotency key normalization

### Usage

```ts
import { http, PaymentError } from "@transactbd/core";

const data = await http("/ping", { method: "GET" }, { baseUrl: "https://api" });
```
