// Email Worker — receives inbound emails via CF Email Routing
// This runs as a Pages Function, not the standalone Worker

import { supaInsert, supaSelect } from '../_shared/supabase.js';

export async function emailHandler(message) {
  const to = message.headers.get('to') || '';
  const from = message.headers.get('from') || '';
  const subject = message.headers.get('subject') || '(no subject)';

  const rawEmail = await new Response(message.raw).text();

  let bodyText = '';
  let bodyHtml = '';

  const textMatch = rawEmail.match(/Content-Type: text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?=\r?\n--|$)/i);
  const htmlMatch = rawEmail.match(/Content-Type: text\/html[\s\S]*?\r?\n\r?\n([\s\S]*?)(?=\r?\n--|$)/i);

  if (textMatch) bodyText = textMatch[1].trim();
  if (htmlMatch) bodyHtml = htmlMatch[1].trim();

  if (!bodyText && !bodyHtml) {
    const bodyStart = rawEmail.indexOf('\r\n\r\n');
    if (bodyStart > -1) bodyText = rawEmail.substring(bodyStart + 4).trim();
  }

  const addrs = await supaSelect('temp_addresses', `select=id&address=eq.${encodeURIComponent(to.toLowerCase())}`);
  if (!addrs.length) return;

  await supaInsert('messages', {
    temp_address_id: addrs[0].id,
    from_addr: from,
    subject,
    body_text: bodyText,
    body_html: bodyHtml,
    raw_email: rawEmail,
  });
}

export const onRequest = emailHandler;
