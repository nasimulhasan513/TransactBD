import type { CreateParams, PaymentGateway, PaymentIntent } from "@transactbd/core";
import { normalizeIdempotencyKey } from "@transactbd/core";
import { SslCommerzClient, type SslCommerzConfig } from "./client";
import { toPaymentIntent } from "./mapper";
import { verifyCallback } from "./webhook";

export type { SslCommerzConfig };

export class SslCommerzGateway implements PaymentGateway {
  private client: SslCommerzClient;

  constructor(private readonly config: SslCommerzConfig) {
    this.client = new SslCommerzClient(config);
  }

  async createPayment(params: CreateParams): Promise<PaymentIntent> {
    normalizeIdempotencyKey(params.idempotencyKey);
    const init = await this.client.initSession({
      total_amount: params.amount.value,
      currency: params.amount.currency,
      tran_id: params.metadata?.tran_id || `ssl_${Date.now()}`,
      success_url: params.callbackUrls?.successUrl || "",
      fail_url: params.callbackUrls?.failUrl || "",
      cancel_url: params.callbackUrls?.cancelUrl || "",
      cus_name: params.customer?.name || "",
      cus_email: params.customer?.email || "",
      cus_phone: params.customer?.phone || "",
    });
    return toPaymentIntent(init as any);
  }

  async getPayment(providerRef: string): Promise<PaymentIntent> {
    const q = await this.client.query({ tran_id: providerRef });
    return toPaymentIntent(q as any);
  }

  async refund(providerRef: string, amount?: number): Promise<{ status: "refunded" | "partial" }> {
    await this.client.refund({ bank_tran_id: providerRef, refund_amount: amount ?? 0 });
    return { status: amount ? "partial" : "refunded" };
  }

  async verifyWebhook(
    payload: string | Buffer,
    headers: Record<string, string>,
  ): Promise<{ ok: boolean; event?: any }> {
    return verifyCallback(payload, headers);
  }
}
