import { createSign, createVerify } from "node:crypto";

export function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function sign(payload: string, privateKeyPem: string): string {
  const signer = createSign("RSA-SHA256");
  signer.update(payload);
  signer.end();
  const sig = signer.sign(privateKeyPem);
  return base64url(sig);
}

export function verify(payload: string, signatureB64Url: string, publicKeyPem: string): boolean {
  const verifier = createVerify("RSA-SHA256");
  verifier.update(payload);
  verifier.end();
  const sig = Buffer.from(signatureB64Url.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  return verifier.verify(publicKeyPem, sig);
}
