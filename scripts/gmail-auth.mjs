#!/usr/bin/env node
// One-off: grant Call Coach send-only Gmail access and store it in Vercel.
//
//   node scripts/gmail-auth.mjs [path/to/credentials.json]
//
// Opens Google's consent page asking only for "Send email on your behalf"
// (scope gmail.send). After you click Allow, the client ID, client secret and
// refresh token go straight into Vercel production env vars. Nothing secret is
// printed. Revoke any time at https://myaccount.google.com/permissions.

import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { execFileSync, spawnSync } from 'node:child_process';
import { homedir } from 'node:os';

const credsPath = process.argv[2] || `${homedir()}/Russell-Linkedin-Content-Engine/credentials.json`;
const creds = JSON.parse(readFileSync(credsPath, 'utf8'));
const { client_id, client_secret } = creds.installed || creds.web;
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';

function saveToVercel(name, value) {
  spawnSync('vercel', ['env', 'rm', name, 'production', '-y'], { stdio: 'ignore' });
  const r = spawnSync('vercel', ['env', 'add', name, 'production'], { input: value, stdio: ['pipe', 'ignore', 'pipe'] });
  if (r.status !== 0) throw new Error(`Saving ${name} to Vercel failed: ${r.stderr}`);
  console.log(`Saved ${name} to Vercel`);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const code = url.searchParams.get('code');
  if (!code) { res.end(url.searchParams.get('error') || 'Waiting...'); return; }
  try {
    const redirect_uri = `http://localhost:${server.address().port}`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id, client_secret, redirect_uri, grant_type: 'authorization_code' }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.refresh_token) throw new Error(`No refresh token returned: ${tokens.error || 'unknown'}`);
    if (tokens.scope !== SCOPE) throw new Error(`Unexpected scope granted: ${tokens.scope}`);
    saveToVercel('GOOGLE_CLIENT_ID', client_id);
    saveToVercel('GOOGLE_CLIENT_SECRET', client_secret);
    saveToVercel('GMAIL_REFRESH_TOKEN', tokens.refresh_token);
    res.end('Done. Call Coach can now send email (send only). You can close this tab.');
    console.log('Done: send-only Gmail access granted and stored in Vercel.');
  } catch (err) {
    res.end(`Failed: ${err.message}`);
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(0, '127.0.0.1', () => {
  const redirect_uri = `http://localhost:${server.address().port}`;
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.search = new URLSearchParams({
    client_id, redirect_uri, response_type: 'code', scope: SCOPE,
    access_type: 'offline', prompt: 'consent',
  }).toString();
  console.log('Opening Google consent page (send-only Gmail access)...');
  execFileSync('open', [auth.toString()]);
});
