## @transactbd/sslcommerz

SSLCommerz adapter implementing hosted checkout.

### Config

- `baseUrl`, `storeId`, `storePassword`, `timeoutMs?`, `defaultCurrency=BDT`

### Example

```ts
import { SslCommerzGateway } from "@transactbd/sslcommerz";

const ssl = new SslCommerzGateway({ baseUrl, storeId, storePassword });
const intent = await ssl.createPayment({
  method: "sslcommerz",
  amount: { value: 100, currency: "BDT" },
});
```
