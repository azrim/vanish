import { supaSelect } from '../../_shared/supabase.js';

export async function onRequestGet(context) {
  const { id } = context.params;
  const msgs = await supaSelect('messages', `select=*&id=eq.${id}`);

  if (!msgs.length) {
    return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
  }

  const msg = msgs[0];
  // Get to_addr
  const addrs = await supaSelect('temp_addresses', `select=address&id=eq.${msg.temp_address_id}`);
  msg.to_addr = addrs[0]?.address || '';

  return new Response(JSON.stringify(msg), {
    headers: { 'Content-Type': 'application/json' },
  });
}
