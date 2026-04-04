import React, { useState } from 'react';
import GlassCard from './GlassCard';

/**
 * Reusable block for an API call with:
 * - optional input fields
 * - a trigger button
 * - loading/error/result display
 *
 * Props:
 *   title      - section title
 *   method     - 'GET' | 'POST'
 *   endpoint   - e.g. '/trading/kis/balance'
 *   fields     - [{ name, placeholder }]  optional inputs
 *   onCall     - async fn(values) => data
 */
export default function ApiBlock({ title, method, endpoint, fields = [], onCall, children }) {
  const [values, setValues]   = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await onCall(values);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="api-block">
      <div className="api-block-header">
        <div>
          <span className={`method-badge method-${method.toLowerCase()}`}>{method}</span>
          <span className="api-endpoint">{endpoint}</span>
        </div>
        <span className="api-block-title">{title}</span>
      </div>

      {fields.length > 0 && (
        <div className="api-block-inputs">
          {fields.map(f => (
            <input
              key={f.name}
              className="glass-input"
              placeholder={f.placeholder}
              value={values[f.name] || ''}
              onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}
            />
          ))}
        </div>
      )}

      {children && <div className="api-block-extra">{children}</div>}

      <button className="btn-primary" onClick={handleCall} disabled={loading}>
        {loading ? '요청 중…' : '실행'}
      </button>

      {error && <div className="api-result error">❌ {error}</div>}
      {result !== null && (
        <pre className="api-result success">{JSON.stringify(result, null, 2)}</pre>
      )}
    </GlassCard>
  );
}
