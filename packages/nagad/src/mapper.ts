type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "requires_action"
  | "canceled"
  | "refunded"
  | "partially_refunded";

export function mapStatus(providerStatus: string): PaymentStatus {
  const s = providerStatus.toLowerCase();
  if (s.includes("initiated") || s.includes("processing")) return "pending";
  if (s.includes("success") || s.includes("complete")) return "succeeded";
  if (s.includes("failed") || s.includes("cancel")) return "failed";
  return "pending";
}
