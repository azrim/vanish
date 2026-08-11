// Minimal Supabase REST adapter used by Pages Functions.
const URL = 'https://fxmmiieaoajwpribvhfz.supabase.co';
const KEY = 'sb_publishable_HkqeNFSWDZoA1Rc2YuhG0g_MukfccdV';

async function supaFetch(path, options = {}) {
  const response = await fetch(`${URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) throw new Error(await response.text());
  return response.status === 204 ? null : response.json();
}

export const supaSelect = (table, query = '') => supaFetch(`${table}?${query}`);
export const supaInsert = (table, value) => supaFetch(table, {
  method: 'POST',
  body: JSON.stringify(value),
});
