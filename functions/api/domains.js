import { getSupabase } from '../_shared/supabase.js';

export async function onRequestGet(context) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('is_active', true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
