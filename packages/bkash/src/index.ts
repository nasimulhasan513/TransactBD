import type { CreateParams, PaymentGateway, PaymentIntent } from "@transactbd/core";
import { normalizeIdempotencyKey } from "@transactbd/core";
import { BkashTokenManager, type BkashConfig } from "./token";
import { BkashClient } from "./client";
import { mapStatus } from "./mapper";

export type { BkashConfig };

export class BkashGateway implements PaymentGateway {
  private token: BkashTokenManager;
  private client: BkashClient;

  constructor(private readonly config: BkashConfig) {
    this.token = new BkashTokenManager(config);
    this.client = new BkashClient(config);
  }

  async createPayment(params: CreateParams): Promise<PaymentIntent> {
    normalizeIdempotencyKey(params.idempotencyKey);
    const jwt = await this.token.getToken();
    const res: any = await this.client.create(jwt, {
      amount: params.amount.value,
      currency: params.amount.currency,
      reference: params.metadata?.reference || `bk_${Date.now()}`,
    });
    return {
      id: res.paymentID || res.trxID || "",
      method: "bkash",
      amount: params.amount,
      status: mapStatus(res.status || "initiated"),
      providerReference: res.trxID || res.paymentID,
      redirectUrl: res.redirectURL,
    };
  }

  async getPayment(providerRef: string): Promise<PaymentIntent> {
    const jwt = await this.token.getToken();
    const res: any = await this.client.query(jwt, providerRef);
    return {
      id: providerRef,
      method: "bkash",
      amount: { value: Number(res.amount || 0), currency: "BDT" },
      status: mapStatus(res.status || "processing"),
      providerReference: providerRef,
    };
  }

  async refund(providerRef: string, amount?: number): Promise<{ status: "refunded" | "partial" }> {
    const jwt = await this.token.getToken();
    await this.client.refund(jwt, providerRef, amount);
    return { status: amount ? "partial" : "refunded" };
  }

  async verifyWebhook(
    payload: string | Buffer,
    _headers: Record<string, string>,
  ): Promise<{ ok: boolean; event?: any }> {
    try {
      const text = typeof payload === "string" ? payload : payload.toString("utf8");
      const event = JSON.parse(text);
      return { ok: true, event };
    } catch {
      return { ok: false };
    }
  }
}
