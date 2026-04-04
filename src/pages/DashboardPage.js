import React, { useState, useEffect, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import * as api from '../services/api';

function ControlBtn({ label, onClick, variant = 'start', disabled }) {
  return (
    <button
      className={`ctrl-btn ctrl-btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function StatusDot({ active }) {
  return <span className={`status-dot ${active ? 'on' : 'off'}`} />;
}

export default function DashboardPage() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState({});
  const [error, setError]     = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getStatus();
      setStatus(data);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const call = async (key, fn) => {
    setLoading(l => ({ ...l, [key]: true }));
    try {
      await fn();
      await fetchStatus();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(l => ({ ...l, [key]: false }));
    }
  };

  const kisActive   = status?.kis_active;
  const upbitActive = status?.upbit_active;
  const allActive   = kisActive && upbitActive;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">대시보드</div>
          <div className="page-sub">자동매매 제어 및 전체 상태</div>
        </div>
        <div className="live-badge">
          <div className="live-dot" />
          실시간 연동
        </div>
      </div>

      {error && (
        <div className="alert-error" onClick={() => setError(null)}>
          ⚠️ {error} <span style={{ opacity: .5 }}>(클릭하여 닫기)</span>
        </div>
      )}

      {/* Status cards */}
      <div className="stat-grid">
        <GlassCard className="stat-card">
          <div className="stat-top">
            <div className="stat-label">전체 상태</div>
            <StatusDot active={allActive} />
          </div>
          <div className={`stat-value ${allActive ? 'green' : 'muted'}`}>
            {status ? (allActive ? '실행중' : '중지됨') : '—'}
          </div>
          <div className="stat-change">KIS + 업비트</div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-top">
            <div className="stat-label">KIS 주식</div>
            <StatusDot active={kisActive} />
          </div>
          <div className={`stat-value ${kisActive ? 'green' : 'muted'}`}>
            {status ? (kisActive ? '실행중' : '중지됨') : '—'}
          </div>
          <div className="stat-change">한국투자증권</div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-top">
            <div className="stat-label">업비트 코인</div>
            <StatusDot active={upbitActive} />
          </div>
          <div className={`stat-value ${upbitActive ? 'green' : 'muted'}`}>
            {status ? (upbitActive ? '실행중' : '중지됨') : '—'}
          </div>
          <div className="stat-change">Upbit</div>
        </GlassCard>

        <GlassCard className="stat-card" style={{ cursor: 'pointer' }} onClick={fetchStatus}>
          <div className="stat-top">
            <div className="stat-label">상태 갱신</div>
            <span style={{ fontSize: 18 }}>🔄</span>
          </div>
          <div className="stat-value" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            클릭하여 갱신
          </div>
          <div className="stat-change">GET /trading/status</div>
        </GlassCard>
      </div>

      {/* Controls */}
      <div className="control-section">
        {/* All */}
        <GlassCard className="control-card">
          <div className="control-card-title">
            <span>🔁</span> 전체 자동매매
          </div>
          <div className="control-card-desc">KIS 주식 + 업비트 코인 동시 제어</div>
          <div className="control-btns">
            <ControlBtn
              label="전체 시작"
              variant="start"
              disabled={loading.all_start}
              onClick={() => call('all_start', api.startAll)}
            />
            <ControlBtn
              label="전체 중지"
              variant="stop"
              disabled={loading.all_stop}
              onClick={() => call('all_stop', api.stopAll)}
            />
          </div>
        </GlassCard>

        {/* KIS */}
        <GlassCard className="control-card">
          <div className="control-card-title">
            <span>📈</span> KIS 주식
            <StatusDot active={kisActive} />
          </div>
          <div className="control-card-desc">POST /trading/kis/start · /stop</div>
          <div className="control-btns">
            <ControlBtn
              label="KIS 시작"
              variant="start"
              disabled={loading.kis_start}
              onClick={() => call('kis_start', api.startKis)}
            />
            <ControlBtn
              label="KIS 중지"
              variant="stop"
              disabled={loading.kis_stop}
              onClick={() => call('kis_stop', api.stopKis)}
            />
          </div>
        </GlassCard>

        {/* Upbit */}
        <GlassCard className="control-card">
          <div className="control-card-title">
            <span>🪙</span> 업비트 코인
            <StatusDot active={upbitActive} />
          </div>
          <div className="control-card-desc">POST /trading/upbit/start · /stop</div>
          <div className="control-btns">
            <ControlBtn
              label="업비트 시작"
              variant="start"
              disabled={loading.upbit_start}
              onClick={() => call('upbit_start', api.startUpbit)}
            />
            <ControlBtn
              label="업비트 중지"
              variant="stop"
              disabled={loading.upbit_stop}
              onClick={() => call('upbit_stop', api.stopUpbit)}
            />
          </div>
        </GlassCard>
      </div>

      {/* Raw status */}
      {status && (
        <GlassCard style={{ marginTop: 20 }}>
          <div className="section-title">응답 데이터 <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>GET /trading/status</span></div>
          <pre className="api-result success" style={{ marginTop: 10 }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        </GlassCard>
      )}
    </div>
  );
}
