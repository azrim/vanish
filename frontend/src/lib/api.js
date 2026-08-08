const BASE = import.meta.env.VITE_API_URL || '';

export async function getDomains() {
  const res = await fetch(`${BASE}/api/domains`);
  return res.json();
}

export async function generateEmail(domain) {
  const res = await fetch(`${BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

export async function getInbox(address) {
  const res = await fetch(`${BASE}/api/inbox/${encodeURIComponent(address)}`);
  return res.json();
}

export async function readEmail(id) {
  const res = await fetch(`${BASE}/api/read/${id}`);
  return res.json();
}
