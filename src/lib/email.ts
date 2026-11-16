// Sends email as Russell through the Gmail API with a send-only grant
// (scope gmail.send: cannot read, search or delete mail). The grant is made
// once with `node scripts/gmail-auth.mjs`, which stores the refresh token in Vercel.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

async function accessToken(): Promise<string> {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error('Gmail not configured: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GMAIL_REFRESH_TOKEN missing');
  }
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    // invalid_grant = the permission was revoked or expired. Needs a re-run of
    // scripts/gmail-auth.mjs, so say that plainly in the alert.
    const hint = body.error === 'invalid_grant' ? ' Gmail send permission expired or revoked: re-run scripts/gmail-auth.mjs.' : '';
    throw new Error(`Gmail auth failed (${body.error || res.status}).${hint}`);
  }
  return body.access_token;
}

// RFC 2047 encoding so subjects with non-ASCII characters survive.
const encodeHeader = (s: string) => `=?UTF-8?B?${Buffer.from(s).toString('base64')}?=`;

function buildMime(from: string, to: string[], subject: string, html: string, text: string): string {
  const boundary = `cc_${Date.now().toString(36)}`;
  return [
    `From: Russell Westgarth <${from}>`,
    `To: ${to.join(', ')}`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(text).toString('base64'),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html).toString('base64'),
    `--${boundary}--`,
  ].join('\r\n');
}

export async function sendEmail(opts: { to: string[]; subject: string; html: string; text: string }): Promise<void> {
  const from = process.env.GMAIL_USER;
  if (!from) throw new Error('GMAIL_USER not set');
  const raw = Buffer.from(buildMime(from, opts.to, opts.subject, opts.html, opts.text)).toString('base64url');
  const res = await fetch(SEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) throw new Error(`Gmail send failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
}

// Cheap check that the grant still works, without sending anything. Used by
// the end-of-night run so a dead permission is caught before Monday.
export async function checkEmailAuth(): Promise<void> {
  await accessToken();
}
