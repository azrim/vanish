import { supaSelect } from '../_shared/supabase.js';

export async function onRequestGet() {
  const data = await supaSelect('domains', 'select=*&is_active=eq.true');
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
