import { useEffect, useState } from 'react';

function formatTime(unixSeconds) {
  if (!unixSeconds) return '—';
  return new Date(unixSeconds * 1000).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined) return '—';
  return Number(value).toFixed(digits);
}

export const LiveTradeHistory = () => {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/livetrade/history');
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const payload = await response.json();
        setHistory(Array.isArray(payload) ? payload : payload.trades || []);
        setStatus('loaded');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#080b10] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-[#0b1220]/90 p-8 shadow-2xl shadow-black/30">
          <h1 className="text-4xl font-bold mb-4">Live Trade History</h1>
          <p className="text-sm text-white/60 mb-8">
            This route is intentionally hidden. Access it directly at <span className="font-semibold">/performance/livetrade/history</span>.
          </p>

          {status === 'loading' && (
            <div className="text-white/70">Loading trade history...</div>
          )}

          {status === 'error' && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {status === 'loaded' && !history.length && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70">
              No closed-trade history has been received yet.
            </div>
          )}

          {status === 'loaded' && history.length > 0 && (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-4">
                <table className="min-w-full text-left text-sm text-white/80 whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/10 text-white/70">
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Symbol</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">S/L</th>
                      <th className="px-4 py-3">T/P</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Taxes</th>
                      <th className="px-4 py-3">Swap</th>
                      <th className="px-4 py-3">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((trade) => (
                      <tr key={trade.ticket} className="border-b border-white/10">
                        <td className="px-4 py-3 font-medium text-white">{trade.ticket}</td>
                        <td className="px-4 py-3">{formatTime(trade.openTime)}</td>
                        <td className="px-4 py-3 capitalize">{trade.type || 'unknown'}</td>
                        <td className="px-4 py-3">{formatNumber(trade.volume)}</td>
                        <td className="px-4 py-3 uppercase">{trade.symbol}</td>
                        <td className="px-4 py-3">{formatNumber(trade.openPrice, 4)}</td>
                        <td className="px-4 py-3">
                          {trade.stopLoss ? formatNumber(trade.stopLoss, 4) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {trade.takeProfit ? formatNumber(trade.takeProfit, 4) : '—'}
                        </td>
                        <td className="px-4 py-3">{formatTime(trade.closeTime)}</td>
                        <td className="px-4 py-3">{formatNumber(trade.closePrice, 4)}</td>
                        <td className="px-4 py-3">{formatNumber(trade.commission)}</td>
                        <td className="px-4 py-3">{formatNumber(trade.taxes ?? 0)}</td>
                        <td className="px-4 py-3">{formatNumber(trade.swap)}</td>
                        <td className={`px-4 py-3 font-semibold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatNumber(trade.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};