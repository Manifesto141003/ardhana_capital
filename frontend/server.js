const http = require('http');
const { URL } = require('url');

const API_KEY = process.env.LIVETRADE_API_KEY || 'changeme-shared-secret';

// Data cuma disimpan di RAM (in-memory) — hilang kalau proses di-restart.
// Cukup buat buktiin pipeline MT4 -> server -> dashboard jalan dulu.
let snapshot = {
  source: 'livetrade-mt4',
  timestamp: null,
  data: null,
  notice: 'Belum ada data live masuk dari EA.',
};
const history = new Map();

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    });
    return res.end();
  }

  if (url.pathname === '/api/livetrade') {
    if (req.method === 'GET') {
      return sendJson(res, 200, snapshot);
    }

    if (req.method === 'POST') {
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== API_KEY) {
        return sendJson(res, 401, { error: 'Unauthorized' });
      }

      try {
        const body = await collectRequestBody(req);
        snapshot = {
          source: body.source ?? 'livetrade-mt4',
          timestamp: Date.now(),
          data: {
            accountBalance: body.accountBalance ?? null,
            equity: body.equity ?? null,
            margin: body.margin ?? null,
            floatingProfit: body.floatingProfit ?? null,
            positions: Array.isArray(body.positions) ? body.positions : [],
          },
        };
        return sendJson(res, 200, { ok: true });
      } catch (error) {
        return sendJson(res, 400, { error: 'Invalid JSON payload', details: error.message });
      }
    }

    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (url.pathname === '/api/livetrade/history') {
    if (req.method === 'POST') {
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== API_KEY) {
        return sendJson(res, 401, { error: 'Unauthorized' });
      }

      try {
        const body = await collectRequestBody(req);
        const trades = Array.isArray(body.trades) ? body.trades : [];
        if (!trades.length) {
          return sendJson(res, 400, { error: 'Expected trades array' });
        }

        trades.forEach((trade) => {
          if (!trade.ticket || !trade.symbol) return;
          history.set(trade.ticket, {
            ticket: trade.ticket,
            symbol: trade.symbol,
            type: trade.type ?? null,
            volume: trade.volume ?? null,
            openPrice: trade.openPrice ?? null,
            stopLoss: trade.stopLoss ?? null,
            takeProfit: trade.takeProfit ?? null,
            closePrice: trade.closePrice ?? null,
            openTime: trade.openTime ?? null,
            closeTime: trade.closeTime ?? null,
            commission: trade.commission ?? null,
            taxes: trade.taxes ?? 0,
            swap: trade.swap ?? null,
            profit: trade.profit ?? null,
          });
        });

        return sendJson(res, 200, { ok: true, received: trades.length });
      } catch (error) {
        return sendJson(res, 400, { error: 'Invalid JSON payload', details: error.message });
      }
    }

    if (req.method === 'GET') {
      const trades = [...history.values()].sort((a, b) => (b.closeTime ?? 0) - (a.closeTime ?? 0));
      return sendJson(res, 200, { trades });
    }

    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  return sendJson(res, 404, { error: 'Not found' });
}

function requestListener(req, res) {
  handleRequest(req, res).catch((error) => {
    console.error('API server error:', error);
    sendJson(res, 500, { error: 'Server error', details: error.message });
  });
}

// Port 80: wajib untuk MT4 WebRequest (custom port seperti :4000 selalu
// gagal error 5200 — WebRequest cuma bisa port 80 untuk http:// / 443 untuk https://)
const serverForMT4 = http.createServer(requestListener);

// Port 4000: dipertahankan supaya package.json "proxy" / REACT_APP_BACKEND_URL
// yang sudah dikonfigurasi ke :4000 tidak perlu diubah.
const serverForFrontend = http.createServer(requestListener);

serverForMT4.on('error', (err) => {
  console.error(`GAGAL bind port 80: ${err.code} - ${err.message}`);
  console.error('Cek "netstat -ano | findstr :80" untuk lihat proses apa yang pakai port ini.');
});

serverForFrontend.on('error', (err) => {
  console.error(`GAGAL bind port 4000: ${err.code} - ${err.message}`);
  console.error('Cek "netstat -ano | findstr :4000" untuk lihat proses apa yang pakai port ini.');
});

serverForMT4.listen(80, () => {
  console.log('Livetrade MOCK API listening on http://localhost:80   <- untuk MT4 WebRequest');
});

serverForFrontend.listen(4000, () => {
  console.log('Livetrade MOCK API listening on http://localhost:4000 <- untuk CRA dev proxy');
});

console.log(`Use X-API-Key: ${API_KEY}`);
console.log('CATATAN: data disimpan di RAM saja (mock, tanpa database). Restart proses = data hilang.');