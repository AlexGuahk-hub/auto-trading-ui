import React, { useState, useEffect, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import Toast from '../components/Toast';
import * as api from '../services/api';

let toastId = 0;

function StatusDot({ active }) {
  return <span className={`status-dot ${active ? 'on' : 'off'}`} />;
}

export default function DashboardPage() {
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState({});
  const [toasts,  setToasts]  = useState([]);

  const addToast = useCallback((text, type = 'error') => {
    const id = ++toastId;
    setToasts(t => [...t, { id, type, text }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getStatus();
      setStatus(data);
    } catch (e) {
      addToast(`상태 조회 실패: ${e.message}`);
    }
  }, [addToast]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const call = useCallback(async (key, fn, successMsg) => {
    setLoading(l => ({ ...l, [key]: true }));
    try {
      await fn();
      await fetchStatus();
      if (successMsg) addToast(successMsg, 'success');
    } catch (e) {
      addToast(e.message);
    } finally {
      setLoading(l => ({ ...l, [key]: false }));
    }
  }, [fetchStatus, addToast]);

  const kisActive   = status?.kis?.enabled;
  const upbitActive = status?.upbit?.enabled;
  const allActive   = kisActive && upbitActive;

  // 버튼 disabled 상태 — 이미 해당 상태면 같은 동작 버튼 비활성
  const isLoading = (key) => !!loading[key];
  const anyLoading = Object.values(loading).some(Boolean);

  return (
    <div className="page-content">
      <Toast messages={toasts} onRemove={removeToast} />

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
          <div className="stat-value" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
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
            <StatusDot active={allActive} />
          </div>
          <div className="control-card-desc">KIS 주식 + 업비트 코인 동시 제어</div>
          <div className="control-btns">
            <button
              className="ctrl-btn ctrl-btn--start"
              disabled={anyLoading || allActive}
              onClick={() => call('all_start', api.startAll, '전체 자동매매를 시작했습니다.')}
            >
              {isLoading('all_start') ? '시작 중…' : '전체 시작'}
            </button>
            <button
              className="ctrl-btn ctrl-btn--stop"
              disabled={anyLoading || (!kisActive && !upbitActive)}
              onClick={() => call('all_stop', api.stopAll, '전체 자동매매를 중지했습니다.')}
            >
              {isLoading('all_stop') ? '중지 중…' : '전체 중지'}
            </button>
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
            <button
              className="ctrl-btn ctrl-btn--start"
              disabled={anyLoading || kisActive}
              onClick={() => call('kis_start', api.startKis, 'KIS 주식 자동매매를 시작했습니다.')}
            >
              {isLoading('kis_start') ? '시작 중…' : 'KIS 시작'}
            </button>
            <button
              className="ctrl-btn ctrl-btn--stop"
              disabled={anyLoading || !kisActive}
              onClick={() => call('kis_stop', api.stopKis, 'KIS 주식 자동매매를 중지했습니다.')}
            >
              {isLoading('kis_stop') ? '중지 중…' : 'KIS 중지'}
            </button>
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
            <button
              className="ctrl-btn ctrl-btn--start"
              disabled={anyLoading || upbitActive}
              onClick={() => call('upbit_start', api.startUpbit, '업비트 자동매매를 시작했습니다.')}
            >
              {isLoading('upbit_start') ? '시작 중…' : '업비트 시작'}
            </button>
            <button
              className="ctrl-btn ctrl-btn--stop"
              disabled={anyLoading || !upbitActive}
              onClick={() => call('upbit_stop', api.stopUpbit, '업비트 자동매매를 중지했습니다.')}
            >
              {isLoading('upbit_stop') ? '중지 중…' : '업비트 중지'}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Raw status */}
      {status && (
        <GlassCard style={{ marginTop: 4 }}>
          <div className="section-title">
            응답 데이터{' '}
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>GET /trading/status</span>
          </div>
          <pre className="api-result success" style={{ marginTop: 10 }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        </GlassCard>
      )}
    </div>
  );
}
