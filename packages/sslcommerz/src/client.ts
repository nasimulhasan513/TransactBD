import { http } from "@transactbd/core";

export interface SslCommerzConfig {
  baseUrl: string;
  storeId: string;
  storePassword: string;
  timeoutMs?: number;
  defaultCurrency?: "BDT";
}

export interface InitResponse {
  status: string;
  sessionkey?: string;
  GatewayPageURL?: string;
  tran_id?: string;
  [key: string]: unknown;
}

export interface QueryResponse {
  status: string;
  tran_id?: string;
  amount?: string;
  currency?: string;
  tran_date?: string;
  val_id?: string;
  store_amount?: string;
  card_type?: string;
  card_no?: string;
  bank_tran_id?: string;
  [key: string]: unknown;
}

export interface RefundResponse {
  status: string;
  refund_ref_id?: string;
  refund_amount?: string;
  [key: string]: unknown;
}

export class SslCommerzClient {
  constructor(private readonly config: SslCommerzConfig) {}

  initSession(params: Record<string, string | number>): Promise<InitResponse> {
    const body = new URLSearchParams({
      store_id: this.config.storeId,
      store_passwd: this.config.storePassword,
      currency: this.config.defaultCurrency ?? "BDT",
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    } as Record<string, string>);
    return http<InitResponse>(
      "/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  query(params: { val_id?: string; tran_id?: string }): Promise<QueryResponse> {
    const search = new URLSearchParams({
      store_id: this.config.storeId,
      store_passwd: this.config.storePassword,
      val_id: params.val_id ?? "",
      tran_id: params.tran_id ?? "",
    });
    return http<QueryResponse>(
      `/validator/api/validationserverAPI.php?${search.toString()}`,
      { method: "GET" },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }

  refund(params: {
    refund_amount: number;
    refund_remarks?: string;
    bank_tran_id: string;
  }): Promise<RefundResponse> {
    const body = new URLSearchParams({
      store_id: this.config.storeId,
      store_passwd: this.config.storePassword,
      refund_amount: String(params.refund_amount),
      refund_remarks: params.refund_remarks ?? "",
      bank_tran_id: params.bank_tran_id,
    });
    return http<RefundResponse>(
      "/validator/api/merchantTransIDvalidationAPI.php",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      },
      { baseUrl: this.config.baseUrl, timeoutMs: this.config.timeoutMs },
    );
  }
}
