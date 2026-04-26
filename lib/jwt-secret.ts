// Edge-runtime safe: no Node-only imports, so this can be shared between
// middleware.ts (Edge) and lib/auth.ts (Node).

const MIN_SECRET_LENGTH = 32;

let cached: Uint8Array | null = null;

/**
 * Returns the encoded JWT signing secret, throwing if JWT_SECRET is missing or
 * too weak. There is deliberately no fallback value: a hardcoded default would
 * let anyone who has read this repository forge session cookies.
 *
 * Read lazily (rather than at module load) so a missing secret fails loudly at
 * request time instead of breaking the production build.
 */
export function getJwtSecret(): Uint8Array {
  if (cached) return cached;

  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "JWT_SECRET is not set. Refusing to sign or verify session tokens. " +
        "Set JWT_SECRET in .env.local for local dev, and as an env var / Secret Manager " +
        "reference on the Cloud Run service for production."
    );
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters (got ${secret.length}).`
    );
  }

  cached = new TextEncoder().encode(secret);
  return cached;
}
