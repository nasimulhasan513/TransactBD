type PaymentStatus =
  | "requires_action"
  | "pending"
  | "succeeded"
  | "failed"
  | "canceled"
  | "refunded"
  | "partially_refunded";

interface Amount {
  value: number;
  currency: "BDT";
}

interface PaymentIntent {
  id: string;
  method: "sslcommerz";
  amount: Amount;
  description?: string;
  metadata?: Record<string, unknown>;
  status: PaymentStatus;
  providerReference?: string;
  redirectUrl?: string;
}

export function mapStatus(provider: string): PaymentStatus {
  const s = provider.toLowerCase();
  if (s === "initiated" || s === "processing") return "pending";
  if (s === "valid" || s === "success" || s === "completed") return "succeeded";
  if (s === "failed" || s === "cancelled" || s === "expired") return "failed";
  return "pending";
}

export function toPaymentIntent(input: {
  tran_id?: string;
  amount?: string | number;
  currency?: string;
  status?: string;
  GatewayPageURL?: string;
}): PaymentIntent {
  const amount: Amount = {
    value: Number(input.amount ?? 0),
    currency: "BDT",
  };
  return {
    id: input.tran_id ?? "",
    method: "sslcommerz",
    amount,
    status: mapStatus(input.status ?? ""),
    providerReference: input.tran_id,
    redirectUrl: input.GatewayPageURL,
  };
}
