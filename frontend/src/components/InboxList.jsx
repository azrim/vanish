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
    const interval = setInterval(fetchInbox, 5000);
    return () => clearInterval(interval);
  }, [fetchInbox]);

  if (!address) {
    return (
      <div className="card">
        <div className="inbox-header">
          <div className="inbox-title">Inbox</div>
        </div>
        <div className="empty-state">
          <div className="icon">📬</div>
          <div className="title">Generate an email to start</div>
          <div className="subtitle">Choose a domain and generate your temporary address</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card inbox-card">
      <div className="inbox-header">
        <div className="inbox-title">
          Inbox
          <div className="inbox-status">
            <span className="dot"></span>
            Active
          </div>
        </div>
        <button className="btn-refresh" onClick={fetchInbox} title="Refresh">🔄</button>
      </div>

      {!loading && emails.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✉️</div>
          <div className="title">Waiting for emails</div>
          <div className="subtitle">Emails sent to your address will appear here</div>
        </div>
      ) : loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      ) : (
        <div className="email-list">
          {emails.map(email => (
            <div key={email.id} className="email-item" onClick={() => onSelect(email)}>
              <div>
                <div className="from">{email.from_addr}</div>
                <div className="subject">{email.subject}</div>
              </div>
              <div className="time">{new Date(email.received_at).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
