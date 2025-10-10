## @transactbd/nagad

Nagad adapter with RSA signature verification helpers.

### Config

- `baseUrl`, `merchantId`, `privateKey`, `publicKey`, `timeoutMs?`

### Example

```ts
import { NagadGateway } from "@transactbd/nagad";

const nagad = new NagadGateway({ baseUrl, merchantId, privateKey, publicKey });
const intent = await nagad.createPayment({
  method: "nagad",
  amount: { value: 100, currency: "BDT" },
});
```
