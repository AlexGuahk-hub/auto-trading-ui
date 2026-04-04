import React from 'react';
import ApiBlock from '../components/ApiBlock';
import * as api from '../services/api';

export default function UpbitPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">업비트 코인</div>
          <div className="page-sub">Upbit API 조회</div>
        </div>
        <span className="market-badge coin">코인</span>
      </div>

      <div className="api-grid">
        <ApiBlock
          title="코인 현재가"
          method="GET"
          endpoint="/trading/upbit/price/{market}"
          fields={[{ name: 'market', placeholder: '마켓 코드 (예: KRW-BTC)' }]}
          onCall={(v) => api.getUpbitPrice(v.market)}
        />

        <ApiBlock
          title="KRW 잔고"
          method="GET"
          endpoint="/trading/upbit/balance"
          onCall={() => api.getUpbitBalance()}
        />

        <ApiBlock
          title="전체 보유 자산"
          method="GET"
          endpoint="/trading/upbit/accounts"
          onCall={() => api.getUpbitAccounts()}
        />
      </div>
    </div>
  );
}
