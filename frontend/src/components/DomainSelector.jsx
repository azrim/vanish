import { useState, useEffect } from 'react';
import { getDomains } from '../lib/api';

export default function DomainSelector({ value, onChange }) {
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    getDomains().then(setDomains).catch(console.error);
  }, []);

  return (
    <select className="domain-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Choose a domain...</option>
      {domains.map(d => (
        <option key={d.id} value={d.domain}>{d.domain}</option>
      ))}
    </select>
  );
}
