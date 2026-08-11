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
    getDomains()
      .then(async available => {
        setDomains(available);
        const first = available[0]?.domain;
        if (!first) throw new Error('No domains available');
        setDomain(first);
        const created = await generateEmail(first);
        setEmail(created.address);
        onGenerated(created.address);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
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

  function copy() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="card">
      <label className="field-label">Your Temporary Address</label>
      {loading && !email ? <div className="email-bar"><span className="email-address">Generating…</span></div> : (
        <>
          <div className="email-bar">
            <span className="email-address">{email}</span>
            <button className={`btn-copy-email ${copied ? 'copied' : ''}`} onClick={copy} aria-label="Copy email">{copied ? '✓' : '📋'}</button>
          </div>
          <div className="action-row">
            <button className="btn" onClick={() => setCustomOpen(open => !open)}>✏️ Custom email</button>
            <button className="btn" onClick={() => create()} disabled={loading}>🔄 New address</button>
          </div>
        </>
      )}
      {customOpen && (
        <div className="custom-panel">
          <select className="domain-select" value={domain} onChange={event => setDomain(event.target.value)} aria-label="Email domain">
            {domains.map(item => <option key={item.id} value={item.domain}>{item.domain}</option>)}
          </select>
          <div className="custom-row">
            <input className="custom-input" value={prefix} onChange={event => setPrefix(event.target.value.replace(/[^a-z0-9._+-]/gi, '').toLowerCase())} placeholder="your-prefix" aria-label="Email prefix" />
            <button className="btn btn-primary" onClick={() => create(prefix)} disabled={!prefix || loading}>Use address</button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="form-error">{error}</p>}
    </div>
  );
}
