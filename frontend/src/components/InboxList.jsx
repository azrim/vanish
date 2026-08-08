import { useState, useEffect, useCallback } from 'react';
import { getInbox } from '../lib/api';

export default function InboxList({ address, onSelect }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = useCallback(async () => {
    if (!address) return;
    try {
      const data = await getInbox(address);
      setEmails(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [address]);

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 5000); // auto-refresh 5s
    return () => clearInterval(interval);
  }, [fetchInbox]);

  if (!address) {
    return (
      <div className="empty">
        <div className="icon">👻</div>
        <p>Generate email dulu untuk mulai</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading inbox...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="empty">
        <div className="icon">📭</div>
        <p>Belum ada email masuk</p>
        <p style={{fontSize: '0.85rem', marginTop: '8px'}}>Auto-refresh setiap 5 detik</p>
      </div>
    );
  }

  return (
    <div className="inbox">
      <div className="inbox-header">
        <h2>Inbox ({emails.length})</h2>
        <button className="btn btn-copy" onClick={fetchInbox} style={{fontSize: '0.8rem'}}>
          🔄 Refresh
        </button>
      </div>
      <div className="inbox-list">
        {emails.map(email => (
          <div
            key={email.id}
            className="email-item unread"
            onClick={() => onSelect(email)}
          >
            <div>
              <div className="from">{email.from_addr}</div>
              <div className="subject">{email.subject}</div>
            </div>
            <div className="time">{new Date(email.received_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
