import { useEffect, useState } from 'react';
import { generateEmail, getDomains } from '../lib/api';

export default function GenerateEmail({ onGenerated }) {
  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [prefix, setPrefix] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customOpen, setCustomOpen] = useState(false);

  useEffect(() => {
    getDomains().then(async (available) => {
      setDomains(available);
      const first = available[0]?.domain;
      if (!first) throw new Error('No domains available');
      setDomain(first);
      const created = await generateEmail(first);
      setEmail(created.address);
      onGenerated(created.address);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [onGenerated]);

  async function create(localPart = '', selectedDomain = domain) {
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const created = await generateEmail(selectedDomain, localPart);
      setEmail(created.address);
      setDomain(selectedDomain);
      onGenerated(created.address);
      setCustomOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="address-card" aria-labelledby="address-title">
      <div className="card-heading">
        <div><p className="card-kicker">YOUR TEMPORARY ADDRESS</p><h2 id="address-title">Ready when you are</h2></div>
        <span className="expiry-pill">24h lifetime</span>
      </div>

      {loading && !email ? <div className="address-bar is-loading">Creating your inbox…</div> : (
        <div className="address-bar">
          <span className="address-value">{email}</span>
          <button className="copy-button" onClick={copy} aria-label="Copy temporary email" title="Copy address">{copied ? '✓' : '⧉'}</button>
        </div>
      )}

      <div className="address-actions">
        <button className="secondary-button" onClick={() => setCustomOpen(open => !open)} aria-expanded={customOpen}>⌘ Custom address</button>
        <button className="primary-button" onClick={() => create()} disabled={loading}>↻ New address</button>
      </div>

      {customOpen && <div className="custom-panel">
        <select className="domain-select" value={domain} onChange={event => setDomain(event.target.value)} aria-label="Email domain">
          {domains.map(item => <option key={item.id} value={item.domain}>{item.domain}</option>)}
        </select>
        <div className="custom-row">
          <input className="custom-input" value={prefix} onChange={event => setPrefix(event.target.value.replace(/[^a-z0-9._+-]/gi, '').toLowerCase())} placeholder="your-prefix" aria-label="Email prefix" />
          <button className="primary-button" onClick={() => create(prefix)} disabled={!prefix || loading}>Use it</button>
        </div>
      </div>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
