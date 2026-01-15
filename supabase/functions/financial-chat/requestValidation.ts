import { z } from "https://esm.sh/zod@3.23.8";

// Limits (keep in sync with index.ts defaults or override via env)
const MAX_PAYLOAD_BYTES = parseInt(Deno.env.get("MAX_PAYLOAD_BYTES") || "50000", 10);
const MAX_MESSAGES = parseInt(Deno.env.get("MAX_MESSAGES") || "30", 10);
const MAX_MESSAGE_CHARS = parseInt(Deno.env.get("MAX_MESSAGE_CHARS") || "2000", 10);
const MAX_CONTEXT_DATA_CHARS = parseInt(Deno.env.get("MAX_CONTEXT_DATA_CHARS") || "12000", 10);

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(MAX_MESSAGE_CHARS, "Message too long"),
  suggestions: z.any().optional(), // preserved for compatibility; not used in validation
});

export const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
  conversationId: z.string().optional(),
  contextType: z.string().max(50).optional(),
  contextData: z.any().optional(),
  demo: z
    .object({
      demoProfileId: z.string(),
      state: z.any().optional(),
    })
    .optional(),
  viewMode: z.string().optional(),
  endpoint: z.string().optional(),
});

export type ParsedRequest = z.infer<typeof requestSchema>;

export class ValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Parse raw request body, enforce size and schema, and return typed payload.
 * Throws ValidationError on failure.
 */
export function parseAndValidateRequest(rawBody: string | null): ParsedRequest {
  if (rawBody && new TextEncoder().encode(rawBody).length > MAX_PAYLOAD_BYTES) {
    throw new ValidationError("Payload too large", 413);
  }

  let body: unknown = {};
  if (rawBody && rawBody.trim().length > 0) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      throw new ValidationError("Invalid JSON payload", 400);
    }
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    throw new ValidationError(msg, 400);
  }

  // Additional safeguard: limit contextData serialized size
  if (parsed.data.contextData) {
    const size = JSON.stringify(parsed.data.contextData).length;
    if (size > MAX_CONTEXT_DATA_CHARS) {
      throw new ValidationError("contextData too large", 400);
    }
  }

  return parsed.data;
}
