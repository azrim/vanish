export default function EmailViewer({ email, onBack }) {
  return (
    <div className="viewer">
      <button className="btn-back" onClick={onBack}>← Kembali ke inbox</button>
      <div className="viewer-header">
        <h3>{email.subject}</h3>
        <div className="viewer-meta">
          <span>From: {email.from_addr}</span>
          <span>To: {email.to_addr || '—'}</span>
          <span>{new Date(email.received_at).toLocaleString()}</span>
        </div>
      </div>
      <div className="viewer-body">
        {email.body_html ? (
          <div dangerouslySetInnerHTML={{ __html: email.body_html }} />
        ) : (
          <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>
            {email.body_text || '(empty)'}
          </pre>
        )}
      </div>
    </div>
  );
}
