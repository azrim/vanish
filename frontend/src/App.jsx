import { useCallback, useState } from 'react';
import GenerateEmail from './components/GenerateEmail';
import InboxList from './components/InboxList';
import EmailViewer from './components/EmailViewer';

export default function App() {
  const [address, setAddress] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleGenerated = useCallback((nextAddress) => {
    setAddress(nextAddress);
    setSelectedEmail(null);
  }, []);

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Vanish home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span><strong>Vanish</strong><small>disposable inbox</small></span>
        </a>
        <span className="header-badge"><span className="status-dot" />No signup</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">PRIVATE BY DEFAULT</p>
        <h1 id="page-title">Email that disappears.</h1>
        <p className="hero-copy">A fast, disposable inbox for the moments you don’t want to keep.</p>
      </section>

      <GenerateEmail onGenerated={handleGenerated} />

      {selectedEmail ? (
        <EmailViewer email={selectedEmail} onBack={() => setSelectedEmail(null)} />
      ) : (
        <InboxList address={address} onSelect={setSelectedEmail} />
      )}

      <footer className="site-footer">
        <span>Messages expire automatically after 24 hours.</span>
        <span className="footer-separator">•</span>
        <span>Vanish <span aria-hidden="true">✦</span></span>
      </footer>
    </main>
  );
}
