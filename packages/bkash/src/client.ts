import { http } from "@transactbd/core";
import type { BkashConfig } from "./token";

export class BkashClient {
  constructor(private readonly config: BkashConfig) {}

  create(token: string, payload: Record<string, unknown>): Promise<any> {
    return http(
      "/create",
      {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: token },
        body: JSON.stringify(payload),
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  execute(token: string, paymentId: string): Promise<any> {
    return http(
      "/execute",
      {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: token },
        body: JSON.stringify({ paymentID: paymentId }),
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  query(token: string, trxId: string): Promise<any> {
    return http(
      `/payment/status?trxID=${encodeURIComponent(trxId)}`,
      { method: "GET", headers: { Authorization: token } },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  refund(token: string, trxId: string, amount?: number): Promise<any> {
    return http(
      "/refund",
      {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: token },
        body: JSON.stringify({ trxID: trxId, amount }),
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }
}
