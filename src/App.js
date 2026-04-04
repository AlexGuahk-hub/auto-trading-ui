import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import KisPage from './pages/KisPage';
import UpbitPage from './pages/UpbitPage';
import ReportPage from './pages/ReportPage';

const PAGES = {
  dashboard: <DashboardPage />,
  report:    <ReportPage />,
  kis:       <KisPage />,
  upbit:     <UpbitPage />,
};

const PAGE_LABELS = {
  dashboard: '대시보드',
  report:    '매매 리포트',
  kis:       'KIS 주식',
  upbit:     '업비트 코인',
};

export default function App() {
  const [page, setPage]         = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (id) => {
    setPage(id);
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      <div className="bg-gradient" />

      {/* Top bar */}
      <header className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
          <span /><span /><span />
        </button>
        <div className="topbar-logo">
          <div className="logo-icon-sm">📊</div>
          <span className="logo-text">NEXTTRADE</span>
        </div>
        <div className="topbar-page">{PAGE_LABELS[page]}</div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar drawer */}
      <Sidebar page={page} setPage={navigate} open={sidebarOpen} />

      {/* Main content */}
      <main className="main">
        {PAGES[page]}
      </main>
    </div>
  );
}
