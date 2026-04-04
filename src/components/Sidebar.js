import React from 'react';

const NAV = [
  { section: 'OVERVIEW', items: [
    { id: 'dashboard', icon: '🏠', label: '대시보드' },
    { id: 'report',    icon: '📋', label: '매매 리포트' },
  ]},
  { section: 'MARKET', items: [
    { id: 'kis',   icon: '📈', label: 'KIS 주식' },
    { id: 'upbit', icon: '🪙', label: '업비트 코인' },
  ]},
];

export default function Sidebar({ page, setPage, open }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-mark">
          <div className="logo-icon">📊</div>
          <div>
            <div className="logo-text">NEXTTRADE</div>
            <div className="logo-sub">Personal</div>
          </div>
        </div>
      </div>
      <nav className="nav">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {items.map(({ id, icon, label }) => (
              <div
                key={id}
                className={`nav-item${page === id ? ' active' : ''}`}
                onClick={() => setPage(id)}
              >
                <span className="nav-icon">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
