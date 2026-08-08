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
        <h1>👻 Vanish</h1>
        <p>Temporary emails that disappear. Generate. Read. Gone.</p>
      </header>

      <GenerateEmail onGenerated={handleGenerated} />

      {selectedEmail ? (
        <EmailViewer email={selectedEmail} onBack={() => setSelectedEmail(null)} />
      ) : (
        <InboxList address={address} onSelect={setSelectedEmail} />
      )}
    </div>
  );
}
