const TOXIC_PATTERNS = [
  /hate\s*speech/i,
  /kill\s+(yourself|them|him|her|people)/i,
  /suicide/i,
  /terror/i,
  /explosive/i,
  /bomb/i,
  /weapon/i,
  /racial\s+slur/i,
  /sex\s*crime/i,
  /child\s*(abuse|porn)/i,
];

const OFF_DOMAIN_PATTERNS = [
  /politic/i,
  /election/i,
  /medical/i,
  /diagnos/i,
  /prescrib/i,
  /immigration/i,
  /lawyer/i,
];

const MAX_USER_MESSAGE_CHARS = parseInt(Deno.env.get("MAX_USER_MESSAGE_CHARS") || "4000", 10);

/**
 * Basic safety filter for user text to block toxic/off-domain content.
 * Returns true if safe, false if blocked.
 */
export function isMessageSafe(text: string): boolean {
  if (!text || typeof text !== "string") return true;

  if (text.length > MAX_USER_MESSAGE_CHARS) {
    return false;
  }

  const lowered = text.toLowerCase();
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(lowered)) return false;
  }
  for (const pattern of OFF_DOMAIN_PATTERNS) {
    if (pattern.test(lowered)) return false;
  }

  return true;
}
