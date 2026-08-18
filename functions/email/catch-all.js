// Email Worker — receives inbound emails via CF Email Routing
import { supaInsert, supaSelect } from '../_shared/supabase.js';

function decodePart(content, encoding) {
  if (!content) return '';
  if (encoding === 'base64') {
    try {
      return atob(content.replace(/\s+/g, ''));
    } catch {
      return content;
    }
  }
  return content;
}

function parseMime(raw) {
  const headersEnd = raw.indexOf('\r\n\r\n');
  const headerBlock = raw.slice(0, headersEnd);
  const bodyBlock = raw.slice(headersEnd + 4);

  const contentTypeMatch = headerBlock.match(/Content-Type:\s*([^\r\n]+)/i);
  const transferEncodingMatch = headerBlock.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
  const boundaryMatch = headerBlock.match(/boundary=([^;\r\n]+)/i);

  const contentType = contentTypeMatch?.[1]?.trim() || '';
  const transferEncoding = (transferEncodingMatch?.[1]?.trim() || '').toLowerCase();
  const boundary = boundaryMatch?.[1]?.replace(/^["']|["']$/g, '');

  if (boundary && contentType.includes('multipart')) {
    const parts = bodyBlock.split(`--${boundary}`);
    let text = '', html = '';
    for (const part of parts) {
      if (!part.trim() || part.trim() === '--') continue;
      const partHeadersEnd = part.indexOf('\r\n\r\n');
      const partHeaders = part.slice(0, partHeadersEnd);
      const partBody = part.slice(partHeadersEnd + 4).trim();

      const pTypeMatch = partHeaders.match(/Content-Type:\s*([^\r\n]+)/i);
      const pEncMatch = partHeaders.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
      const pType = pTypeMatch?.[1]?.trim() || '';
      const pEnc = (pEncMatch?.[1]?.trim() || '').toLowerCase();

      const decoded = decodePart(partBody, pEnc);
      if (pType.includes('text/plain')) text += decoded;
      else if (pType.includes('text/html')) html += decoded;
    }
    return { text, html };
  }

  const decoded = decodePart(bodyBlock, transferEncoding);
  if (contentType.includes('text/plain')) return { text: decoded, html: '' };
  if (contentType.includes('text/html')) return { text: '', html: decoded };
  return { text: decoded, html: '' };
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