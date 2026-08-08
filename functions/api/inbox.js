import { getSupabase } from '../_shared/supabase.js';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const address = decodeURIComponent(url.pathname.split('/').pop());

  if (!address) {
    return new Response(JSON.stringify({ error: 'address required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = getSupabase();

  // Get temp address ID
  const { data: tempAddr, error: addrErr } = await supabase
    .from('temp_addresses')
    .select('id')
    .eq('address', address)
    .single();

  if (addrErr || !tempAddr) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get messages
  const { data: messages, error: msgErr } = await supabase
    .from('messages')
    .select('id, from_addr, subject, received_at')
    .eq('temp_address_id', tempAddr.id)
    .order('received_at', { ascending: false });

  if (msgErr) {
    return new Response(JSON.stringify({ error: msgErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(messages), {
    headers: { 'Content-Type': 'application/json' },
  });
}
