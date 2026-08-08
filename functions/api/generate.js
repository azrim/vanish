import { supaInsert } from '../_shared/supabase.js';

function randomString(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let r = '';
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

export async function onRequestPost(context) {
  const { domain } = await context.request.json();
  if (!domain) {
    return new Response(JSON.stringify({ error: 'domain required' }), { status: 400 });
  }

  const localPart = randomString();
  const address = `${localPart}@${domain}`;

  const data = await supaInsert('temp_addresses', { address, domain, local_part: localPart });
  return new Response(JSON.stringify(data[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
