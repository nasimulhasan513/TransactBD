export class PaymentError extends Error {
	code: string;
	details?: unknown;

	constructor(message: string, code = "PAYMENT_ERROR", details?: unknown, cause?: unknown) {
		super(message);
		this.name = "PaymentError";
		this.code = code;
		this.details = details;
		if (cause) (this as any).cause = cause;
	}
}

export class AuthError extends PaymentError {
	constructor(message = "Authentication failed", details?: unknown, cause?: unknown) {
		super(message, "AUTH_ERROR", details, cause);
		this.name = "AuthError";
	}
}

export class NetworkError extends PaymentError {
	status?: number;
	constructor(message = "Network error", details?: unknown, cause?: unknown, status?: number) {
		super(message, "NETWORK_ERROR", details, cause);
		this.name = "NetworkError";
		this.status = status;
	}
}

export class WebhookError extends PaymentError {
	constructor(message = "Webhook verification failed", details?: unknown, cause?: unknown) {
		super(message, "WEBHOOK_ERROR", details, cause);
		this.name = "WebhookError";
	}
}

export class ValidationError extends PaymentError {
	constructor(message = "Validation failed", details?: unknown, cause?: unknown) {
		super(message, "VALIDATION_ERROR", details, cause);
		this.name = "ValidationError";
	}
}

