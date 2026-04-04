const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
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
