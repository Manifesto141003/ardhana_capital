import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS trade_history (
      ticket INTEGER PRIMARY KEY,
      symbol TEXT,
      type TEXT,
      volume REAL,
      open_price REAL,
      stop_loss REAL,
      take_profit REAL,
      close_price REAL,
      open_time INTEGER,
      close_time INTEGER,
      commission REAL,
      taxes REAL,
      swap REAL,
      profit REAL
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

    const { trades } = request.body;
    if (!Array.isArray(trades)) {
      return response.status(400).json({ error: 'trades must be an array' });
    }

    for (const t of trades) {
      await db.execute({
        sql: `
          INSERT INTO trade_history
            (ticket, symbol, type, volume, open_price, stop_loss, take_profit, close_price, open_time, close_time, commission, taxes, swap, profit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(ticket) DO NOTHING
        `,
        args: [
          t.ticket,
          t.symbol,
          t.type,
          t.volume,
          t.openPrice,
          t.stopLoss ?? null,
          t.takeProfit ?? null,
          t.closePrice,
          t.openTime,
          t.closeTime,
          t.commission ?? null,
          t.taxes ?? 0,
          t.swap ?? null,
          t.profit,
        ],
      });
    }

    return response.status(200).json({ ok: true, inserted: trades.length });
  }

  if (request.method === 'GET') {
    const result = await db.execute(
      'SELECT * FROM trade_history ORDER BY close_time DESC'
    );

    const trades = result.rows.map((row) => ({
      ticket: row.ticket,
      symbol: row.symbol,
      type: row.type,
      volume: row.volume,
      openPrice: row.open_price,
      stopLoss: row.stop_loss,
      takeProfit: row.take_profit,
      closePrice: row.close_price,
      openTime: row.open_time,
      closeTime: row.close_time,
      commission: row.commission,
      taxes: row.taxes,
      swap: row.swap,
      profit: row.profit,
    }));

    return response.status(200).json({ trades });
  }

  return response.status(405).json({ error: 'Method not allowed' });
}