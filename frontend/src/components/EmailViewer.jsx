import { useEffect, useState } from 'react';
import { readEmail } from '../lib/api';

export default function EmailViewer({ email, onBack }) {
  const [fullEmail, setFullEmail] = useState(email);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readEmail(email.id).then(setFullEmail).catch(() => {}).finally(() => setLoading(false));
  }, [email.id]);

  return <section className="reader-card" aria-labelledby="message-title">
    <button className="back-button" onClick={onBack}>← Back to inbox</button>
    <div className="reader-heading"><p className="card-kicker">MESSAGE</p><h2 id="message-title">{fullEmail.subject || '(no subject)'}</h2><div className="reader-meta"><span>From <strong>{fullEmail.from_addr}</strong></span><span>{new Date(fullEmail.received_at).toLocaleString()}</span></div></div>
    {loading ? <div className="empty-state"><span className="loader" /><p>Opening message…</p></div> : <div className="reader-body">{fullEmail.body_text || '(empty message)'}</div>}
  </section>;
}
