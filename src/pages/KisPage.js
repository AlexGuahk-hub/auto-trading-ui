import React from 'react';
import ApiBlock from '../components/ApiBlock';
import * as api from '../services/api';

export default function KisPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">KIS 주식</div>
          <div className="page-sub">한국투자증권 API 조회</div>
        </div>
        <span className="market-badge stock">주식</span>
      </div>

      <div className="api-grid">
        <ApiBlock
          title="토큰 발급 확인"
          method="GET"
          endpoint="/trading/kis/token"
          onCall={() => api.getKisToken()}
        />

        <ApiBlock
          title="주식 현재가"
          method="GET"
          endpoint="/trading/kis/price/{code}"
          fields={[{ name: 'code', placeholder: '종목코드 (예: 005930)' }]}
          onCall={(v) => api.getKisPrice(v.code)}
        />

        <ApiBlock
          title="주식 계좌 잔고"
          method="GET"
          endpoint="/trading/kis/balance"
          onCall={() => api.getKisBalance()}
        />
      </div>
    </div>
  );
}
