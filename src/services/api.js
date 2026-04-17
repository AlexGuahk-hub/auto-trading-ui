const BASE_URL = process.env.REACT_APP_API_URL || '';

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    // 네트워크 오류 (연결 거부, CORS, 오프라인 등)
    if (!navigator.onLine) {
      throw new Error('인터넷 연결을 확인해주세요.');
    }
    throw new Error(`서버에 연결할 수 없습니다 (${BASE_URL}). 백엔드 서버가 실행 중인지 확인해주세요.`);
  }

  if (!res.ok) {
    let detail = '';
    try {
      const json = await res.json();
      detail = json.detail || json.message || json.error || '';
    } catch (_) {}
    throw new Error(detail || `오류 ${res.status}: ${res.statusText}`);
  }

  // 응답 본문이 없는 경우(204 No Content 등) 처리
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── Control ──────────────────────────────────────────────
export const getStatus        = ()  => request('GET',  '/trading/status');
export const startAll         = ()  => request('POST', '/trading/start');
export const stopAll          = ()  => request('POST', '/trading/stop');
export const startKis         = ()  => request('POST', '/trading/kis/start');
export const stopKis          = ()  => request('POST', '/trading/kis/stop');
export const startUpbit       = ()  => request('POST', '/trading/upbit/start');
export const stopUpbit        = ()  => request('POST', '/trading/upbit/stop');

// ── KIS ──────────────────────────────────────────────────
export const getKisToken      = ()     => request('GET', '/trading/kis/token');
export const getKisPrice      = (code) => request('GET', `/trading/kis/price/${code}`);
export const getKisBalance    = ()     => request('GET', '/trading/kis/balance');

// ── Upbit ─────────────────────────────────────────────────
export const getUpbitPrice    = (market) => request('GET', `/trading/upbit/price/${market}`);
export const getUpbitBalance  = ()       => request('GET', '/trading/upbit/balance');
export const getUpbitAccounts = ()       => request('GET', '/trading/upbit/accounts');

// ── Report ────────────────────────────────────────────────
export const getReportOrders = (from, to, exchange = 'ALL') =>
  request('GET', `/trading/report/orders?from=${from}&to=${to}&exchange=${exchange}`);
