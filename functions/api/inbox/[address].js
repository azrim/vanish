import { supaSelect } from '../../_shared/supabase.js';
import { error, json } from '../../_shared/response.js';

export async function onRequestGet(context) {
  try {
    const address = decodeURIComponent(context.params.address).toLowerCase();
    const accounts = await supaSelect('temp_addresses', `select=id,expires_at&address=eq.${encodeURIComponent(address)}&limit=1`);
    if (!accounts.length || new Date(accounts[0].expires_at) <= new Date()) return json([]);

    const messages = await supaSelect('messages', `select=id,from_addr,subject,received_at&temp_address_id=eq.${accounts[0].id}&order=received_at.desc`);
    return json(messages);
  } catch (err) {
    console.error('inbox', err);
    return error('Unable to load inbox');
  }
}
