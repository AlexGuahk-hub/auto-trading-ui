import React, { useEffect } from 'react';

export default function Toast({ messages, onRemove }) {
  return (
    <div className="toast-container">
      {messages.map(({ id, type, text }) => (
        <ToastItem key={id} type={type} text={text} onRemove={() => onRemove(id)} />
      ))}
    </div>
  );
}

function ToastItem({ type, text, onRemove }) {
  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);

  return (
    <div className={`toast toast--${type}`} onClick={onRemove}>
      <span className="toast-icon">
        {type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
      </span>
      <span className="toast-text">{text}</span>
    </div>
  );
}
