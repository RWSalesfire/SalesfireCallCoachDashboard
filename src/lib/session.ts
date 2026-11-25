// Signed session cookie. The value is "<expiry>.<signature>", where the signature is
// an HMAC-SHA256 of the expiry made with SESSION_SECRET. Nothing is stored server-side:
// a cookie is valid only if the signature matches and the expiry has not passed.
// Uses Web Crypto so it runs in both the Edge middleware and Node route handlers.

export const SESSION_COOKIE = 'auth_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 characters');
  }
  return secret;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(now: number = Date.now()): Promise<string> {
  const expires = String(Math.floor(now / 1000) + SESSION_MAX_AGE_SECONDS);
  return `${expires}.${await sign(expires)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  now: number = Date.now()
): Promise<boolean> {
  if (!token) return false;
  const [expires, signature, ...rest] = token.split('.');
  if (!expires || !signature || rest.length > 0 || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Math.floor(now / 1000)) return false;
  try {
    return constantTimeEqual(signature, await sign(expires));
  } catch {
    return false; // missing secret: fail closed
  }
}
