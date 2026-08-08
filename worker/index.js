// Vanish Email Worker
// Receives inbound emails via CF Email Routing and stores in Supabase

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fxmmiieaoajwpribvhfz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HkqeNFSWDZoA1Rc2YuhG0g_MukfccdV';

export default {
  async email(message, env, ctx) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const to = message.headers.get('to') || '';
    const from = message.headers.get('from') || '';
    const subject = message.headers.get('subject') || '(no subject)';

    // Read raw email
    const rawEmail = await new Response(message.raw).text();

    // Extract body parts
    let bodyText = '';
    let bodyHtml = '';

    const textMatch = rawEmail.match(/Content-Type: text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?=\r?\n--|$)/i);
    const htmlMatch = rawEmail.match(/Content-Type: text\/html[\s\S]*?\r?\n\r?\n([\s\S]*?)(?=\r?\n--|$)/i);

    if (textMatch) bodyText = textMatch[1].trim();
    if (htmlMatch) bodyHtml = htmlMatch[1].trim();

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
      console.error('Failed to insert:', error);
    }
  },
};
