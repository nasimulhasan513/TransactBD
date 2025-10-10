// TODO: verify official SSLCommerz webhook/callback signature if available
export async function verifyCallback(
  payload: string | Buffer,
  headers: Record<string, string>,
): Promise<{ ok: boolean; event?: unknown }> {
  try {
    // For now, assume callback is form-encoded or JSON without signature
    const text = typeof payload === "string" ? payload : payload.toString("utf8");
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {}
    return { ok: true, event: parsed };
  } catch {
    return { ok: false };
  }
}
