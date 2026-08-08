import { useState } from 'react';
import GenerateEmail from './components/GenerateEmail';
import InboxList from './components/InboxList';
import EmailViewer from './components/EmailViewer';

export default function App() {
  const [address, setAddress] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleGenerated = (addr) => {
    setAddress(addr);
    setSelectedEmail(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">✉</div>
          <div>
            <div className="logo-text">Vanish</div>
            <div className="logo-sub">disposable inbox</div>
          </div>
        </div>
        <h1>Temporary Email</h1>
        <p>Instant disposable inbox. No signup needed.</p>
      </header>

      <GenerateEmail onGenerated={handleGenerated} />

      {selectedEmail ? (
        <EmailViewer email={selectedEmail} onBack={() => setSelectedEmail(null)} />
      ) : (
        <InboxList address={address} onSelect={setSelectedEmail} />
      )}

      <div className="footer">
        <p>Inboxes are automatically deleted after 24 hours</p>
      </div>
    </div>
  );
}
