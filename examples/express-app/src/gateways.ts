import { BkashGateway } from "@transactbd/bkash";
import { SslCommerzGateway } from "@transactbd/sslcommerz";
import { NagadGateway } from "@transactbd/nagad";

export const ssl = new SslCommerzGateway({
  baseUrl: process.env.SSL_BASE_URL || "",
  storeId: process.env.SSL_STORE_ID || "",
  storePassword: process.env.SSL_STORE_PASSWORD || "",
});

export const bkash = new BkashGateway({
  baseUrl: process.env.BKASH_BASE_URL || "",
  appKey: process.env.BKASH_APP_KEY || "",
  appSecret: process.env.BKASH_APP_SECRET || "",
  username: process.env.BKASH_USERNAME || "",
  password: process.env.BKASH_PASSWORD || "",
  timeoutMs: Number(process.env.BKASH_TIMEOUT_MS || 10000),
});

export const nagad = new NagadGateway({
  baseUrl: process.env.NAGAD_BASE_URL || "",
  merchantId: process.env.NAGAD_MERCHANT_ID || "",
  privateKey: process.env.NAGAD_PRIVATE_KEY || "",
  publicKey: process.env.NAGAD_PUBLIC_KEY || "",
  timeoutMs: Number(process.env.NAGAD_TIMEOUT_MS || 10000),
});
