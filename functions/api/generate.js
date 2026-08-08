import { getSupabase } from '../_shared/supabase.js';

function randomString(len = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { domain } = body;

  if (!domain) {
    return new Response(JSON.stringify({ error: 'domain required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = getSupabase();
  const localPart = randomString(12);
  const address = `${localPart}@${domain}`;

  const { data, error } = await supabase
    .from('temp_addresses')
    .insert({ address, domain, local_part })
    .select()
    .single();

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
