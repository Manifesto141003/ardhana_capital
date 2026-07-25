import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS livetrade_snapshot (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      account_balance REAL,
      equity REAL,
      margin REAL,
      floating_profit REAL,
      positions_json TEXT,
      updated_at INTEGER
    )
  `);
}

export default async function handler(request, response) {
  await ensureTable();

  if (request.method === 'POST') {
    const apiKey = request.headers['x-api-key'];
    if (apiKey !== process.env.LIVETRADE_API_KEY) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { accountBalance, equity, margin, floatingProfit, positions } = request.body;

    await db.execute({
      sql: `
        INSERT INTO livetrade_snapshot (id, account_balance, equity, margin, floating_profit, positions_json, updated_at)
        VALUES (1, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          account_balance = excluded.account_balance,
          equity = excluded.equity,
          margin = excluded.margin,
          floating_profit = excluded.floating_profit,
          positions_json = excluded.positions_json,
          updated_at = excluded.updated_at
      `,
      args: [
        accountBalance ?? null,
        equity ?? null,
        margin ?? null,
        floatingProfit ?? null,
        JSON.stringify(positions ?? []),
        Date.now(),
      ],
    });

    return response.status(200).json({ ok: true });
  }

  if (request.method === 'GET') {
    const result = await db.execute('SELECT * FROM livetrade_snapshot WHERE id = 1');
    const row = result.rows[0];

    if (!row) {
      return response.status(200).json({
        source: 'livetrade-mt4',
        timestamp: null,
        data: null,
        notice: 'Belum ada data masuk dari EA.',
      });
    }

    return response.status(200).json({
      source: 'livetrade-mt4',
      timestamp: row.updated_at,
      data: {
        accountBalance: row.account_balance,
        equity: row.equity,
        margin: row.margin,
        floatingProfit: row.floating_profit,
        positions: JSON.parse(row.positions_json || '[]'),
      },
    });
  }

  return response.status(405).json({ error: 'Method not allowed' });
}