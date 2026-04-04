import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';

const SAMPLE = [
  { date: '2024-04-03', market: '주식', symbol: '삼성전자',  type: '매도', qty: '50주',    price: '₩79,200',        pnl: '+₩124,000', rate: '+3.2%',  pos: true },
  { date: '2024-04-02', market: '코인', symbol: 'BTC/KRW',  type: '매도', qty: '0.05 BTC', price: '₩87,420,000',   pnl: '+₩320,000', rate: '+7.8%',  pos: true },
  { date: '2024-04-01', market: '주식', symbol: 'SK하이닉스', type: '매수', qty: '30주',    price: '₩182,500',       pnl: '—',         rate: '보유중',  pos: null },
  { date: '2024-03-29', market: '코인', symbol: 'ETH/KRW',  type: '매도', qty: '1.2 ETH', price: '₩4,920,000',    pnl: '-₩48,000',  rate: '-0.9%',  pos: false },
  { date: '2024-03-27', market: '주식', symbol: 'NAVER',    type: '매도', qty: '10주',    price: '₩198,000',       pnl: '+₩86,000',  rate: '+4.5%',  pos: true },
];

export default function ReportPage() {
  const [marketFilter, setMarketFilter] = useState('전체');
  const [typeFilter,   setTypeFilter]   = useState('전체');
  const [keyword,      setKeyword]      = useState('');
  const [startDate,    setStartDate]    = useState('2024-01-01');
  const [endDate,      setEndDate]      = useState('2024-04-04');

  const rows = SAMPLE.filter(r => {
    if (marketFilter !== '전체' && r.market !== marketFilter) return false;
    if (typeFilter   !== '전체' && r.type   !== typeFilter)   return false;
    if (keyword && !r.symbol.toLowerCase().includes(keyword.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">매매 리포트</div>
          <div className="page-sub">주식 및 코인 매매 내역 (샘플 데이터)</div>
        </div>
        <div className="live-badge"><div className="live-dot" />실시간 연동</div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label: '총 손익',    value: '+₩4,820,000', sub: '▲ +12.4% 수익률', cls: 'green', icon: '💰' },
          { label: '승률',       value: '68.3%',       sub: '41승 / 19패',       cls: '',      icon: '🎯' },
          { label: '총 거래',    value: '60건',         sub: '주식 38 · 코인 22', cls: '',      icon: '🔄' },
          { label: '평균 보유',  value: '4.2일',        sub: '최장 18일',         cls: '',      icon: '⏱'  },
        ].map(s => (
          <GlassCard key={s.label} className="stat-card">
            <div className="stat-top"><div className="stat-label">{s.label}</div><span style={{fontSize:18}}>{s.icon}</span></div>
            <div className={`stat-value ${s.cls}`}>{s.value}</div>
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
              <input className="glass-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="filter-group" style={{ flex: 1 }}>
              <div className="filter-label">마켓</div>
              <select className="glass-input" value={marketFilter} onChange={e => setMarketFilter(e.target.value)}>
                {['전체','주식','코인'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group" style={{ flex: 1 }}>
              <div className="filter-label">유형</div>
              <select className="glass-input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                {['전체','매수','매도'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-label">종목 검색</div>
            <input className="glass-input" placeholder="종목명 / 코드" value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <div className="filter-actions">
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => {}}>조회</button>
            <button className="btn-ghost" onClick={() => { setMarketFilter('전체'); setTypeFilter('전체'); setKeyword(''); }}>초기화</button>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="table-card">
        <div className="table-top">
          <div className="table-top-title">거래 내역</div>
          <div className="count-chip">총 {rows.length}건</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{['날짜','마켓','종목','유형','수량','매매가','손익','수익률'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td><span className={`tag ${r.market === '주식' ? 'stock' : 'coin'}`}>{r.market}</span></td>
                  <td className="symbol-name">{r.symbol}</td>
                  <td><span className={`tag ${r.type === '매수' ? 'buy' : 'sell'}`}>{r.type}</span></td>
                  <td>{r.qty}</td>
                  <td>{r.price}</td>
                  <td className={r.pos === true ? 'profit' : r.pos === false ? 'loss' : 'holding'}>{r.pnl}</td>
                  <td className={r.pos === true ? 'profit' : r.pos === false ? 'loss' : 'holding'}>{r.rate}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{textAlign:'center',color:'var(--text-muted)',padding:'32px'}}>조회 결과가 없습니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
