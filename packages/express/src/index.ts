import type { PaymentGateway } from "@transactbd/core";
import type { RequestHandler, Request, Response } from "express";

export function makeWebhookHandler(gateway: PaymentGateway): RequestHandler {
  return async (req: Request, res: Response) => {
    try {
      const rawBody = (req as any).rawBody as Buffer | undefined;
      const payload = rawBody ?? JSON.stringify(req.body ?? {});
      const headers: Record<string, string> = Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [
          k,
          Array.isArray(v) ? v.join(",") : String(v),
        ]),
      );
      const result = await gateway.verifyWebhook(payload as any, headers);
      if (result.ok) return res.status(200).json({ ok: true });
      return res.status(400).json({ ok: false });
    } catch (e) {
      return res.status(400).json({ ok: false });
    }
  };
}

type EventName = "payment.succeeded" | "payment.failed" | "refund.succeeded";
type Handler = (event: unknown) => void;

export class Events {
  private handlers: Map<EventName, Set<Handler>> = new Map();

  on(name: EventName, handler: Handler): void {
    if (!this.handlers.has(name)) this.handlers.set(name, new Set());
    this.handlers.get(name)!.add(handler);
  }

  off(name: EventName, handler: Handler): void {
    this.handlers.get(name)?.delete(handler);
  }

  emit(name: EventName, event: unknown): void {
    this.handlers.get(name)?.forEach((h) => h(event));
  }
}
