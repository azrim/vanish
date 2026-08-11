import { supaInsert, supaSelect } from '../_shared/supabase.js';
import { error, json } from '../_shared/response.js';

const LOCAL_PART = /^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?$/;
const MAX_TRIES = 3;

function randomPart(length = 12) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map(byte => 'abcdefghijklmnopqrstuvwxyz0123456789'[byte % 36]).join('');
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const domain = String(body.domain || '').trim().toLowerCase();
    const requested = String(body.local_part || '').trim().toLowerCase();

    if (!domain || !/^[a-z0-9.-]+$/.test(domain)) return error('Invalid domain', 400);
    if (requested && !LOCAL_PART.test(requested)) return error('Invalid email prefix', 400);

    const allowed = await supaSelect('domains', `select=domain&domain=eq.${encodeURIComponent(domain)}&is_active=eq.true`);
    if (!allowed.length) return error('Domain is not available', 400);

    for (let attempt = 0; attempt < MAX_TRIES; attempt += 1) {
      const localPart = requested || randomPart();
      const address = `${localPart}@${domain}`;
      const existing = await supaSelect('temp_addresses', `select=id&address=eq.${encodeURIComponent(address)}&limit=1`);
      if (existing.length) {
        if (requested) return error('That address is already taken', 409);
        continue;
      }

      const created = await supaInsert('temp_addresses', {
        address,
        domain,
        local_part: localPart,
      });
      return json(created[0], 201);
    }

    return error('Could not create an address, please retry', 503);
  } catch (err) {
    console.error('generate', err);
    return error('Unable to generate address');
  }
}
