// TODO: verify official SSLCommerz webhook/callback signature if available
export async function verifyCallback(
  payload: string | Buffer,
  _headers: Record<string, string>,
): Promise<{ ok: boolean; event?: unknown }> {
  try {
    // For now, assume callback is form-encoded or JSON without signature
    const text = typeof payload === "string" ? payload : payload.toString("utf8");
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Keep as raw text if not valid JSON
    }
    return { ok: true, event: parsed };
  } catch {
    return { ok: false };
  }
}
