export default function EmailViewer({ email, onBack }) {
  return (
    <div className="viewer">
      <div className="viewer-inner">
        <button className="btn-back" onClick={onBack}>← Back to inbox</button>
        <div className="viewer-header">
          <h2>{email.subject}</h2>
          <div className="viewer-meta">
            <span>From: <strong>{email.from_addr}</strong></span>
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
    </div>
  );
}
