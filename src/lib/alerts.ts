// Alerts: Telegram messages to Russell and healthchecks.io pings.
// Both are best-effort: an alerting failure must never break the pipeline,
// so errors are logged, not thrown.

export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[alerts] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set; alert not sent:', text);
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: `Call Coach: ${text}`, disable_web_page_preview: true }),
    });
    if (!res.ok) console.error('[alerts] Telegram send failed', res.status, await res.text());
  } catch (err) {
    console.error('[alerts] Telegram send error', err);
  }
}

// healthchecks.io dead man's switch. Ping on success; '/fail' marks a failure.
// If no success ping arrives on schedule, healthchecks.io alerts on its own.
export async function pingHealthcheck(url: string | undefined, outcome: 'success' | 'fail'): Promise<void> {
  if (!url) return;
  try {
    await fetch(outcome === 'fail' ? `${url}/fail` : url, { method: 'POST' });
  } catch (err) {
    console.error('[alerts] healthcheck ping failed', err);
  }
}

// Running out of free API credit has stopped the pipeline before (Oct 2026),
// hidden inside per-call error messages. Detect it so it alerts as urgent.
const CREDIT_ERROR = /credit balance|insufficient|quota|billing|payment required|\b402\b/i;

export function isCreditError(message: string): boolean {
  return CREDIT_ERROR.test(message);
}
