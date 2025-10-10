import type { CreateParams, PaymentGateway, PaymentIntent } from "@transactbd/core";
import { normalizeIdempotencyKey } from "@transactbd/core";
import { NagadClient, type NagadConfig } from "./client";
import { mapStatus } from "./mapper";
import { verifyWebhook as verifySig } from "./webhook";

export type { NagadConfig };

export class NagadGateway implements PaymentGateway {
  private client: NagadClient;

  constructor(private readonly config: NagadConfig) {
    this.client = new NagadClient(config);
  }

  async createPayment(params: CreateParams): Promise<PaymentIntent> {
    normalizeIdempotencyKey(params.idempotencyKey);
    const res: any = await this.client.init({
      amount: params.amount.value,
      currency: params.amount.currency,
      reference: params.metadata?.reference || `ng_${Date.now()}`,
    });
    return {
      id: res.trxId || res.paymentId || "",
      method: "nagad",
      amount: params.amount,
      status: mapStatus(res.status || "initiated"),
      providerReference: res.trxId || res.paymentId,
      redirectUrl: res.redirectURL,
    };
  }

  async getPayment(providerRef: string): Promise<PaymentIntent> {
    const res: any = await this.client.query(providerRef);
    return {
      id: providerRef,
      method: "nagad",
      amount: { value: Number(res.amount || 0), currency: "BDT" },
      status: mapStatus(res.status || "processing"),
      providerReference: providerRef,
    };
  }

  async refund(providerRef: string, amount?: number): Promise<{ status: "refunded" | "partial" }> {
    await this.client.refund(providerRef, amount);
    return { status: amount ? "partial" : "refunded" };
  }

  async verifyWebhook(
    payload: string | Buffer,
    headers: Record<string, string>,
  ): Promise<{ ok: boolean; event?: any }> {
    return verifySig(payload, headers, this.config.publicKey);
  }
}
