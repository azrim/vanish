import { useState, useEffect } from 'react';
import DomainSelector from './DomainSelector';
import { generateEmail, getDomains } from '../lib/api';

export default function GenerateEmail({ onGenerated }) {
  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCustom, setShowCustom] = useState(false);
  const [customPrefix, setCustomPrefix] = useState('');

  // Auto-generate on mount
  useEffect(() => {
    getDomains().then(async (data) => {
      setDomains(data);
      if (data.length > 0) {
        const defaultDomain = data[0].domain;
        setDomain(defaultDomain);
        try {
          const result = await generateEmail(defaultDomain);
          setEmail(result.address);
          onGenerated(result.address);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleGenerate = async (selectedDomain) => {
    setLoading(true);
    try {
      const result = await generateEmail(selectedDomain || domain);
      setEmail(result.address);
      onGenerated(result.address);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleNew = async () => {
    setCopied(false);
    setShowCustom(false);
    setCustomPrefix('');
    await handleGenerate(domain);
  };

  const handleCustomGenerate = async () => {
    if (!customPrefix.trim()) return;
    // For now, generate with selected domain (custom prefix needs backend support)
    setShowCustom(false);
    await handleGenerate(domain);
  };

  const handleDomainChange = async (newDomain) => {
    setDomain(newDomain);
    if (email) {
      await handleGenerate(newDomain);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <label className="field-label">Your Temporary Address</label>
      
      {loading && !email ? (
        <div className="email-bar" style={{opacity: 0.7}}>
          <span className="email-address">Generating...</span>
        </div>
      ) : (
        <>
          <div className="email-bar">
            <span className="email-address">{email}</span>
            <button className={`btn-copy-email ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Copy">
              {copied ? '✓' : '📋'}
            </button>
          </div>

          <div className="action-row">
            <button className="btn" onClick={() => setShowCustom(!showCustom)}>
              ✏️ Custom email
            </button>
            <button className="btn" onClick={handleNew} disabled={loading}>
              {loading ? '⏳' : '🔄'} New address
            </button>
          </div>
        </>
      )}

      {showCustom && (
        <div className="custom-panel">
          <select className="domain-select" value={domain} onChange={e => handleDomainChange(e.target.value)}>
            {domains.map(d => (
              <option key={d.id} value={d.domain}>{d.domain}</option>
            ))}
          </select>
          <div className="custom-row">
            <input
              type="text"
              className="custom-input"
              placeholder="Enter custom prefix..."
              value={customPrefix}
              onChange={e => setCustomPrefix(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleCustomGenerate} disabled={!customPrefix.trim()}>
              Generate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
