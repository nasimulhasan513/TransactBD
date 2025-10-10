import { setTimeout as sleep } from "node:timers/promises";
import { fetch, RequestInit, Response } from "undici";
import { NetworkError, AuthError, PaymentError } from "./errors";

export interface HttpOptions {
  baseUrl: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
}

function isRetriableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const result = await promise;
    clearTimeout(timeout);
    return result;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export async function http<T = unknown>(
  path: string,
  init: RequestInit = {},
  options: HttpOptions,
): Promise<T> {
  const { baseUrl, headers = {}, timeoutMs = 10_000, retries = 3 } = options;
  const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      const request = fetch(url, {
        ...init,
        headers: { ...(init.headers as any), ...headers },
        signal: undefined, // handled by withTimeout
      });
      const res = await withTimeout<Response>(request as Promise<Response>, timeoutMs);
      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        const redacted =
          typeof body === "object" ? { ...body, token: undefined, secret: undefined } : body;
        if (res.status === 401 || res.status === 403) {
          throw new AuthError("Unauthorized", { status: res.status, body: redacted });
        }
        const error = new NetworkError(
          `HTTP ${res.status}`,
          { status: res.status, body: redacted },
          undefined,
          res.status,
        );
        (error as any).response = res;
        throw error;
      }

      return body as T;
    } catch (err: any) {
      lastError = err;
      const status = err?.status ?? err?.response?.status;
      const retriable = typeof status === "number" ? isRetriableStatus(status) : true;
      attempt++;
      if (!retriable || attempt > retries) {
        if (err?.name === "AbortError") {
          throw new NetworkError("Request timed out", { url }, err);
        }
        if (err instanceof PaymentError) throw err;
        throw new NetworkError("Network failure", { url }, err);
      }
      const backoff = Math.min(1000 * 2 ** attempt, 8000) + Math.random() * 200;
      await sleep(backoff);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unknown HTTP error");
}
