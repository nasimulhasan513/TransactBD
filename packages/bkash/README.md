## @transactbd/bkash

bKash adapter with token caching.

### Config

- `baseUrl`, `appKey`, `appSecret`, `username`, `password`, `timeoutMs?`

### Example

```ts
import { BkashGateway } from "@transactbd/bkash";

const bkash = new BkashGateway({ baseUrl, appKey, appSecret, username, password });
const intent = await bkash.createPayment({
  method: "bkash",
  amount: { value: 100, currency: "BDT" },
});
```
