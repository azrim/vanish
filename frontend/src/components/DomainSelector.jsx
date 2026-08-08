import { useState, useEffect } from 'react';
import { getDomains } from '../lib/api';

export default function DomainSelector({ value, onChange }) {
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    getDomains().then(setDomains).catch(console.error);
  }, []);

  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Pilih domain...</option>
      {domains.map(d => (
        <option key={d.id} value={d.domain}>{d.domain}</option>
      ))}
    </select>
  );
}
