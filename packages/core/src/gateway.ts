import type { CreateParams, PaymentIntent } from "./types";

export interface PaymentGateway {
  createPayment(params: CreateParams): Promise<PaymentIntent>;
  getPayment(providerRef: string): Promise<PaymentIntent>;
  refund(providerRef: string, amount?: number): Promise<{ status: "refunded" | "partial" }>;
  verifyWebhook(
    payload: string | Buffer,
    headers: Record<string, string>,
  ): Promise<{ ok: boolean; event?: unknown }>;
}
