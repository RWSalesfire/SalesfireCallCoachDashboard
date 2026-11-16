// Sends email from Russell's Gmail via an app password (SMTP).

import nodemailer from 'nodemailer';

let transport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (transport) return transport;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD not set');
  transport = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
  return transport;
}

export async function sendEmail(opts: { to: string[]; subject: string; html: string; text: string }): Promise<void> {
  await getTransport().sendMail({
    from: `Russell Westgarth <${process.env.GMAIL_USER}>`,
    to: opts.to.join(', '),
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}
