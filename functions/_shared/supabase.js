// Direct REST calls to Supabase — no SDK dependency
const URL = 'https://fxmmiieaoajwpribvhfz.supabase.co';
const KEY = 'sb_publishable_HkqeNFSWDZoA1Rc2YuhG0g_MukfccdV';

async function supaFetch(path, opts = {}) {
  const url = `${URL}/rest/v1/${path}`;
  const headers = {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'Prefer': opts.prefer || 'return=representation',
    ...opts.headers,
  };
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function supaSelect(table, query = '') {
  return supaFetch(`${table}?${query}`);
}

export async function supaInsert(table, data) {
  return supaFetch(table, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
