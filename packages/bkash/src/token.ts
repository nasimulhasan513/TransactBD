import { http } from "@transactbd/core";

export interface BkashConfig {
  baseUrl: string;
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  timeoutMs?: number;
}

interface TokenResponse {
  id_token: string;
  expires_in: number; // seconds
}

export class BkashTokenManager {
  private cachedToken?: { value: string; expiresAt: number };
  private refreshing?: Promise<string>;

  constructor(private readonly config: BkashConfig) {}

  async getToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt - now > 60_000) {
      return this.cachedToken.value;
    }
    if (!this.refreshing) {
      this.refreshing = this.refresh();
    }
    try {
      return await this.refreshing;
    } finally {
      this.refreshing = undefined;
    }
  }

  private async refresh(): Promise<string> {
    const res = await http<TokenResponse>(
      "/token/grant",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          app_key: this.config.appKey,
          app_secret: this.config.appSecret,
          username: this.config.username,
          password: this.config.password,
        }),
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
    const expiresAt = Date.now() + (res.expires_in || 300) * 1000;
    this.cachedToken = { value: res.id_token, expiresAt };
    return res.id_token;
  }
}
