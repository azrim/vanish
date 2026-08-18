// Email Worker — receives inbound emails via CF Email Routing
import { supaInsert, supaSelect } from '../_shared/supabase.js';

function decodeBase64(str) {
  try {
    return atob(str.replace(/\s+/g, ''));
  } catch {
    return str;
  }
}

function decodeQuotedPrintable(str) {
  return str.replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
            .replace(/=\r?\n/g, '');
}

function decodePart(content, encoding) {
  if (!content) return '';
  const enc = (encoding || '').toLowerCase().trim();
  if (enc === 'base64') return decodeBase64(content);
  if (enc === 'quoted-printable') return decodeQuotedPrintable(content);
  return content;
}

function parseMime(raw) {
  const headersEnd = raw.indexOf('\r\n\r\n');
  if (headersEnd === -1) return { text: '', html: '' };

  const headerBlock = raw.slice(0, headersEnd);
  const bodyBlock = raw.slice(headersEnd + 4);

  const boundaryMatch = headerBlock.match(/boundary=([^;\r\n\s"]+)/i);
  const boundary = boundaryMatch ? boundaryMatch[1].replace(/^["']|["']$/g, '') : null;

  if (!boundary) {
    const ctypeMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);
    const encMatch = headerBlock.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
    const ctype = ctypeMatch?.[1]?.trim() || '';
    const enc = encMatch?.[1]?.trim() || '';
    const decoded = decodePart(bodyBlock, enc);
    if (ctype.includes('text/plain')) return { text: decoded, html: '' };
    if (ctype.includes('text/html')) return { text: '', html: decoded };
    return { text: decoded, html: '' };
  }

  const delimiter = `\r\n--${boundary}`;
  const parts = bodyBlock.split(delimiter);
  let text = '', html = '';

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed === '--') continue;

    const partHeadersEnd = trimmed.indexOf('\r\n\r\n');
    if (partHeadersEnd === -1) continue;

    const partHeaders = trimmed.slice(0, partHeadersEnd);
    const partBody = trimmed.slice(partHeadersEnd + 4);

    const pTypeMatch = partHeaders.match(/Content-Type:\s*([^\r\n]+)/i);
    const pEncMatch = partHeaders.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
    const pType = pTypeMatch?.[1]?.trim() || '';
    const pEnc = pEncMatch?.[1]?.trim() || '';

    const decoded = decodePart(partBody, pEnc);

    if (pType.includes('text/plain')) text += decoded;
    else if (pType.includes('text/html')) html += decoded;
  }

  if (!text && !html) {
    const decoded = decodePart(bodyBlock, '');
    return { text: decoded, html: '' };
  }

  return { text: text.trim(), html: html.trim() };
}

export async function emailHandler(message) {
  const to = (message.headers.get('to') || '').toLowerCase();
  const from = message.headers.get('from') || '';
  const subject = message.headers.get('subject') || '(no subject)';

  const rawEmail = await new Response(message.raw).text();
  const { text: bodyText, html: bodyHtml } = parseMime(rawEmail);

  const addrs = await supaSelect('temp_addresses', `select=id&address=eq.${encodeURIComponent(to)}`);
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