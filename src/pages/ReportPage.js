import React, { useState, useCallback, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { getReportOrders } from '../services/api';

function today() {
  return new Date().toISOString().slice(0, 10);
}
function monthAgo() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

function fmtAmount(val) {
  if (val == null) return '—';
  return '₩' + Number(val).toLocaleString('ko-KR', { maximumFractionDigits: 0 });
}
function fmtQty(order) {
  if (order.exchange === 'KIS') {
    return order.quantity != null ? `${Number(order.quantity).toLocaleString()}주` : '—';
  }
  return order.quantity != null ? Number(order.quantity).toFixed(4) : '—';
}

export default function ReportPage() {
  const [startDate,    setStartDate]    = useState(monthAgo());
  const [endDate,      setEndDate]      = useState(today());
  const [exchangeFilter, setExchangeFilter] = useState('ALL');
  const [sideFilter,   setSideFilter]   = useState('전체');
  const [keyword,      setKeyword]      = useState('');
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportOrders(startDate, endDate, exchangeFilter);
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, exchangeFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const rows = orders.filter(r => {
    if (sideFilter === '매수' && r.side !== 'BUY')  return false;
    if (sideFilter === '매도' && r.side !== 'SELL') return false;
    if (keyword && !r.market.toLowerCase().includes(keyword.toLowerCase())) return false;
    return true;
  });

  const filled = rows.filter(r => r.status === 'FILLED');
  const failed = rows.filter(r => r.status === 'FAILED');
  const totalKrw = filled.reduce((s, r) => s + (r.amountKrw ? Number(r.amountKrw) : 0), 0);
  const buyCount  = filled.filter(r => r.side === 'BUY').length;
  const sellCount = filled.filter(r => r.side === 'SELL').length;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">매매 리포트</div>
          <div className="page-sub">주식 및 코인 매매 내역</div>
        </div>
        <div className="live-badge"><div className="live-dot" />실시간 연동</div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label: '총 주문',   value: `${rows.length}건`,   sub: `체결 ${filled.length} · 실패 ${failed.length}`, icon: '🔄' },
          { label: '체결',      value: `${filled.length}건`, sub: `매수 ${buyCount} · 매도 ${sellCount}`,           icon: '✅' },
          { label: '실패',      value: `${failed.length}건`, sub: rows.length > 0 ? `실패율 ${((failed.length / rows.length) * 100).toFixed(1)}%` : '—', icon: '❌' },
          { label: '총 거래금액', value: fmtAmount(totalKrw), sub: '체결 기준 합산',                                icon: '💰' },
        ].map(s => (
          <GlassCard key={s.label} className="stat-card">
            <div className="stat-top"><div className="stat-label">{s.label}</div><span style={{fontSize:18}}>{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change">{s.sub}</div>
          </GlassCard>
        ))}
      </div>

      {/* Filter */}
      <GlassCard className="filter-card">
        <div className="filter-title">조회 필터</div>
        <div className="filter-row">
          <div className="filter-group">
            <div className="filter-label">기간</div>
            <div className="filter-date-row">
              <input className="glass-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <span className="filter-date-sep">—</span>
              <input className="glass-input" type="date" value={endDate}   onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="filter-group" style={{ flex: 1 }}>
              <div className="filter-label">거래소</div>
              <select className="glass-input" value={exchangeFilter} onChange={e => setExchangeFilter(e.target.value)}>
                {['ALL','KIS','UPBIT'].map(v => <option key={v} value={v}>{v === 'ALL' ? '전체' : v === 'KIS' ? 'KIS(주식)' : 'UPBIT(코인)'}</option>)}
              </select>
            </div>
            <div className="filter-group" style={{ flex: 1 }}>
              <div className="filter-label">유형</div>
              <select className="glass-input" value={sideFilter} onChange={e => setSideFilter(e.target.value)}>
                {['전체','매수','매도'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-label">종목 검색</div>
            <input className="glass-input" placeholder="종목코드 (예: 005930, KRW-BTC)" value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <div className="filter-actions">
            <button className="btn-primary" style={{ flex: 1 }} onClick={fetchOrders}>조회</button>
            <button className="btn-ghost" onClick={() => { setSideFilter('전체'); setKeyword(''); }}>초기화</button>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="table-card">
        <div className="table-top">
          <div className="table-top-title">거래 내역</div>
          <div className="count-chip">총 {rows.length}건</div>
        </div>

        {error && (
          <div style={{ padding: '16px', color: 'var(--red)', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>불러오는 중...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{['날짜/시간','거래소','종목','유형','수량','금액(KRW)','전략','상태'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{r.createdAt}</td>
                    <td><span className={`tag ${r.exchange === 'KIS' ? 'stock' : 'coin'}`}>{r.exchange === 'KIS' ? '주식' : '코인'}</span></td>
                    <td className="symbol-name">{r.market}</td>
                    <td><span className={`tag ${r.side === 'BUY' ? 'buy' : 'sell'}`}>{r.side === 'BUY' ? '매수' : '매도'}</span></td>
                    <td>{fmtQty(r)}</td>
                    <td>{fmtAmount(r.amountKrw)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>{r.strategy || '—'}</td>
                    <td><span className={`tag ${r.status === 'FILLED' ? 'buy' : 'sell'}`}>{r.status === 'FILLED' ? '체결' : '실패'}</span></td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr><td colSpan={8} style={{textAlign:'center',color:'var(--text-muted)',padding:'32px'}}>조회 결과가 없습니다</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
