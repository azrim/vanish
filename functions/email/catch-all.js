import { getSupabase } from '../_shared/supabase.js';

// CF Email Worker: receives forwarded emails
// Forward type: sends full email as RFC 822 body
export async function emailHandler(message) {
  const supabase = getSupabase();

  // Parse headers
  const to = message.headers.get('to') || '';
  const from = message.headers.get('from') || '';
  const subject = message.headers.get('subject') || '(no subject)';

  // Read raw email body
  const rawEmail = await new Response(message.raw).text();

  // Extract text/html parts (simple parsing)
  let bodyText = '';
  let bodyHtml = '';

  // Try to extract from MIME parts
  const textMatch = rawEmail.match(/Content-Type: text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?=\r?\n--|$)/i);
  const htmlMatch = rawEmail.match(/Content-Type: text\/html[\s\S]*?\r?\n\r?\n([\s\S]*?)(?=\r?\n--|$)/i);

  if (textMatch) bodyText = textMatch[1].trim();
  if (htmlMatch) bodyHtml = htmlMatch[1].trim();

  // If no MIME parts found, use raw body
  if (!bodyText && !bodyHtml) {
    const bodyStart = rawEmail.indexOf('\r\n\r\n');
    if (bodyStart > -1) {
      bodyText = rawEmail.substring(bodyStart + 4).trim();
    }
  }

  // Find temp address
  const { data: tempAddr } = await supabase
    .from('temp_addresses')
    .select('id')
    .eq('address', to.toLowerCase())
    .single();

  if (!tempAddr) {
    console.log('No temp address found for:', to);
    return;
  }

  // Insert message
  const { error } = await supabase
    .from('messages')
    .insert({
      temp_address_id: tempAddr.id,
      from_addr: from,
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      raw_email: rawEmail,
    });

  if (error) {
    console.error('Failed to insert message:', error);
  }
}

export const onRequest = emailHandler;
