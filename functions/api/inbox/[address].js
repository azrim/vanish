import { supaSelect } from '../../_shared/supabase.js';

export async function onRequestGet(context) {
  const address = decodeURIComponent(context.params.address);

  // Get temp address ID
  const addrs = await supaSelect('temp_addresses', `select=id&address=eq.${encodeURIComponent(address)}`);
  if (!addrs.length) {
    return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
  }

  // Get messages
  const messages = await supaSelect('messages', `select=id,from_addr,subject,received_at&temp_address_id=eq.${addrs[0].id}&order=received_at.desc`);
  return new Response(JSON.stringify(messages), {
    headers: { 'Content-Type': 'application/json' },
  });
}
