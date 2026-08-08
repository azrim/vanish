import { useState } from 'react';
import DomainSelector from './DomainSelector';
import { generateEmail } from '../lib/api';

export default function GenerateEmail({ onGenerated }) {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const data = await generateEmail(domain);
      setEmail(data.address);
      onGenerated(data.address);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNew = () => {
    setEmail('');
    setCopied(false);
  };

  return (
    <div className="card">
      {!email ? (
        <>
          <label style={{fontSize: '0.75rem', fontWeight: 600, color: '#8e8ea0', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px'}}>
            Select Domain
          </label>
          <DomainSelector value={domain} onChange={setDomain} />
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={!domain || loading}
            style={{width: '100%', marginTop: '4px'}}
          >
            {loading ? '⏳' : '⚡'} Generate Email
          </button>
        </>
      ) : (
        <>
          <label style={{fontSize: '0.75rem', fontWeight: 600, color: '#8e8ea0', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px'}}>
            Your Temporary Address
          </label>
          <div className="email-bar">
            <span className="email-address">{email}</span>
            <button className={`btn-copy-email ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Copy">
              {copied ? '✓' : '📋'}
            </button>
          </div>
          <div className="action-row">
            <button className="btn" onClick={handleNew}>
              🔄 New address
            </button>
          </div>
        </>
      )}
    </div>
  );
}
