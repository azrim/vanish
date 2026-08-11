import { useCallback, useEffect, useState } from 'react';
import { getInbox } from '../lib/api';

export default function InboxList({ address, onSelect }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!address) return;
    try {
      setError('');
      setEmails(await getInbox(address));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    setLoading(true);
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return <section className="inbox-card" aria-labelledby="inbox-title">
    <div className="inbox-heading">
      <div><div className="inbox-title-row"><h2 id="inbox-title">Inbox</h2><span className="live-pill"><span className="status-dot" />Live</span></div><p className="inbox-address">{address || 'Create an address to activate your inbox'}</p></div>
      <button className="icon-button" onClick={refresh} aria-label="Refresh inbox" title="Refresh inbox">↻</button>
    </div>

    {loading ? <div className="empty-state"><span className="loader" /><p>Checking your inbox…</p></div> : error ? <div className="empty-state"><span className="empty-icon">!</span><p>{error}</p><button className="text-button" onClick={refresh}>Try again</button></div> : emails.length === 0 ? <div className="empty-state"><span className="empty-icon">✉</span><h3>Waiting for emails</h3><p>Emails sent to this address will appear here automatically.</p></div> : <div className="message-list">
      {emails.map(email => <button className="message-row" key={email.id} onClick={() => onSelect(email)}>
        <span className="message-avatar">{(email.from_addr || '?')[0].toUpperCase()}</span>
        <span className="message-copy"><strong>{email.from_addr}</strong><span>{email.subject || '(no subject)'}</span></span>
        <time dateTime={email.received_at}>{new Date(email.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
      </button>)}
    </div>}
  </section>;
}
