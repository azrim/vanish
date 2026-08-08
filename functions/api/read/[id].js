import { getSupabase } from '../../_shared/supabase.js';

export async function onRequestGet(context) {
  const id = context.params.id;
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get the temp address for to_addr
  const { data: tempAddr } = await supabase
    .from('temp_addresses')
    .select('address')
    .eq('id', data.temp_address_id)
    .single();

  return new Response(JSON.stringify({ ...data, to_addr: tempAddr?.address }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
