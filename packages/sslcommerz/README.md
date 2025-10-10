## @transactbd/sslcommerz

SSLCommerz adapter implementing hosted checkout.

### Install

```
pnpm add @transactbd/sslcommerz @transactbd/core
```

### Config

- `baseUrl`, `storeId`, `storePassword`, `timeoutMs?`, `defaultCurrency=BDT`

You can also set via env: `SSL_BASE_URL`, `SSL_STORE_ID`, `SSL_STORE_PASSWORD`, `SSL_DEFAULT_CURRENCY`.

### Usage

```ts
import { SslCommerzGateway } from "@transactbd/sslcommerz";

const ssl = new SslCommerzGateway({ baseUrl, storeId, storePassword });
const intent = await ssl.createPayment({
  method: "sslcommerz",
  amount: { value: 100, currency: "BDT" },
});
```

The `PaymentIntent` includes a `redirectUrl` for hosted checkout.
