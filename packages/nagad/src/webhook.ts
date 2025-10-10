import { verify } from "./crypto";

export async function verifyWebhook(
  payload: string | Buffer,
  headers: Record<string, string>,
  publicKey: string,
): Promise<{ ok: boolean; event?: unknown }> {
  try {
    const text = typeof payload === "string" ? payload : payload.toString("utf8");
    const signature = headers["x-signature"] || headers["X-Signature"] || "";
    const ok = signature ? verify(text, signature, publicKey) : false;
    if (!ok) return { ok: false };
    let event: unknown = text;
    try {
      event = JSON.parse(text);
    } catch {}
    return { ok: true, event };
  } catch {
    return { ok: false };
  }
}
