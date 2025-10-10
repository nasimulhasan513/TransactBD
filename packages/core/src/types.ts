export type Currency = "BDT";

export type PaymentMethod = "bkash" | "sslcommerz" | "nagad";

export interface Amount {
	value: number;
	currency: Currency;
}

export type PaymentStatus =
	| "requires_action"
	| "pending"
	| "succeeded"
	| "failed"
	| "canceled"
	| "refunded"
	| "partially_refunded";

export interface PaymentIntent {
	id: string;
	method: PaymentMethod;
	amount: Amount;
	description?: string;
	metadata?: Record<string, unknown>;
	status: PaymentStatus;
	providerReference?: string;
	redirectUrl?: string;
}

export interface CreateParams {
	method: PaymentMethod;
	amount: Amount;
	customer?: {
		name?: string;
		email?: string;
		phone?: string;
	};
	callbackUrls?: {
		successUrl?: string;
		failUrl?: string;
		cancelUrl?: string;
		webhookUrl?: string;
	};
	metadata?: Record<string, unknown>;
	idempotencyKey?: string;
}

