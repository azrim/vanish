const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const getDomains = () => request('/api/domains');
export const generateEmail = (domain, localPart = '') => request('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ domain, local_part: localPart }),
});
export const getInbox = address => request(`/api/inbox/${encodeURIComponent(address)}`);
export const readEmail = id => request(`/api/read/${encodeURIComponent(id)}`);
