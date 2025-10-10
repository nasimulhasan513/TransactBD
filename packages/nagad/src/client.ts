import { http } from "@transactbd/core";

export interface NagadConfig {
  baseUrl: string;
  merchantId: string;
  privateKey: string;
  publicKey: string;
  timeoutMs?: number;
}

export class NagadClient {
  constructor(private readonly config: NagadConfig) {}

  init(payload: Record<string, unknown>): Promise<any> {
    return http(
      "/init",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  query(trxId: string): Promise<any> {
    return http(
      `/query?trxId=${encodeURIComponent(trxId)}`,
      { method: "GET" },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  refund(trxId: string, amount?: number): Promise<any> {
    return http(
      "/refund",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ trxId, amount }),
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }
}
