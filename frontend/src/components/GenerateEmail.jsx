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

  return (
    <div className="generator">
      <div className="generator-row">
        <DomainSelector value={domain} onChange={setDomain} />
        {email ? (
          <button className={`btn btn-copy ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied!' : email}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleGenerate} disabled={!domain || loading}>
            {loading ? '⏳' : '⚡'} Generate
          </button>
        )}
      </div>
      {email && (
        <div className="countdown">
          Email ini akan hangus dalam 24 jam
        </div>
      )}
    </div>
  );
}
