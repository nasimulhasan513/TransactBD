import { z } from "zod";
import { ValidationError } from "./errors";

const keySchema = z
  .string()
  .min(8)
  .max(200)
  .regex(/^[A-Za-z0-9_\-:.]+$/);

export function normalizeIdempotencyKey(input?: string): string | undefined {
  if (input == null) return undefined;
  const result = keySchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid idempotency key", { issues: result.error.issues });
  }
  return input;
}
