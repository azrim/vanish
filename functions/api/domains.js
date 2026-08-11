import { supaSelect } from '../_shared/supabase.js';
import { error, json } from '../_shared/response.js';

export async function onRequestGet() {
  try {
    return json(await supaSelect('domains', 'select=id,domain&is_active=eq.true&order=domain.asc'));
  } catch (err) {
    console.error('domains', err);
    return error('Unable to load domains');
  }
}
