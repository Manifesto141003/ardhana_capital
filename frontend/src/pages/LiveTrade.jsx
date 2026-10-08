import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';

function getTimestamp(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const numericValue = Number(value);
    return numericValue < 1e12 ? numericValue * 1000 : numericValue;
  }

  const parsedValue = Date.parse(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function isToday(value) {
  const timestamp = getTimestamp(value);
  if (timestamp === null) return false;

  const date = new Date(timestamp);
  const today = new Date();
  return date.getUTCFullYear() === today.getFullYear()
    && date.getUTCMonth() === today.getMonth()
    && date.getUTCDate() === today.getDate();
}

function formatTime(value) {
  const timestamp = getTimestamp(value);
  if (timestamp === null) return '—';

  const date = new Date(timestamp);
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())} `
    + `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : '—';
}

function getTradeTime(trade, ...keys) {
  return keys.map((key) => trade?.[key]).find((value) => value !== null && value !== undefined);
}

function TradeTable({ trades, kind }) {
  if (!trades.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/60">
        {kind === 'open' ? 'No currently open positions.' : 'No trades closed today.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
      <table className="min-w-full whitespace-nowrap text-left text-sm text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-white/60">
            <th className="px-4 py-3">Ticket</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Volume</th>
            <th className="px-4 py-3">{kind === 'open' ? 'Open price' : 'Close price'}</th>
            {kind === 'open' ? (
              <>
                <th className="px-4 py-3">S/L</th>
                <th className="px-4 py-3">T/P</th>
                <th className="px-4 py-3">Floating P/L</th>
              </>
            ) : (
              <th className="px-4 py-3">Profit</th>
            )}
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => {
            const time = kind === 'open'
              ? getTradeTime(trade, 'openTime', 'open_time', 'time')
              : getTradeTime(trade, 'closeTime', 'close_time');
            const ticket = trade.ticket ?? trade.id ?? `${time}-${trade.symbol}-${index}`;
            const profit = kind === 'open'
              ? getTradeTime(trade, 'floatingProfit', 'profit')
              : trade.profit;

            return (
              <tr key={ticket} className="border-b border-white/10 last:border-0">
                <td className="px-4 py-3 font-medium text-white">{trade.ticket ?? trade.id ?? '—'}</td>
                <td className="px-4 py-3">{formatTime(time)}</td>
                <td className="px-4 py-3 uppercase">{trade.symbol || '—'}</td>
                <td className="px-4 py-3 capitalize">{trade.type || trade.side || '—'}</td>
                <td className="px-4 py-3">{formatNumber(trade.volume)}</td>
                <td className="px-4 py-3">{formatNumber(kind === 'open' ? trade.openPrice ?? trade.open_price : trade.closePrice, 4)}</td>
                {kind === 'open' ? (
                  <>
                    <td className="px-4 py-3">{formatNumber(trade.stopLoss ?? trade.stop_loss, 4)}</td>
                    <td className="px-4 py-3">{formatNumber(trade.takeProfit ?? trade.take_profit, 4)}</td>
                    <td className={`px-4 py-3 font-semibold ${Number(profit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatNumber(profit)}
                    </td>
                  </>
                ) : (
                  <td className={`px-4 py-3 font-semibold ${Number(profit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatNumber(profit)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const LiveTrade = () => {
  const [tradeData, setTradeData] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentOpenTrades = Array.isArray(tradeData?.data?.positions)
    ? tradeData.data.positions
    : [];

  const todayClosedTrades = useMemo(() => (
    history.filter((trade) => isToday(getTradeTime(trade, 'closeTime', 'close_time')))
  ), [history]);

  const fetchLiveTrade = useCallback(async () => {
    try {
      const response = await fetch('/api/livetrade');
      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const payload = await response.json();
      setTradeData(payload);
      setStatus('loaded');
      setError(null);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/livetrade/history');
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const payload = await response.json();
      setHistory(Array.isArray(payload) ? payload : payload.trades || []);
      setHistoryError(null);
    } catch (err) {
      setHistoryError(err.message);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchLiveTrade(), fetchHistory()]);
    setIsRefreshing(false);
  }, [fetchHistory, fetchLiveTrade]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#080b10] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0b1220]/90 p-6 sm:p-8 shadow-2xl shadow-black/30">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Live Trade Data</h1>
            <button
              type="button"
              onClick={refreshData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
              aria-label="Refresh live trade data"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mb-8">
            Showing all currently open positions and trades closed today ({new Date().toLocaleDateString('id-ID')}). Updates every 8 seconds.
          </p>

          {status === 'loading' && (
            <div className="text-white/70">Loading live trade data...</div>
          )}

          {status === 'error' && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {status === 'loaded' && tradeData && (
            <div className="space-y-6">
              {tradeData.notice && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200">
                  {tradeData.notice}
                </div>
              )}

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">Currently open positions</h2>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">{currentOpenTrades.length}</span>
                </div>
                <TradeTable trades={currentOpenTrades} kind="open" />
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">Trades closed today</h2>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">{todayClosedTrades.length}</span>
                </div>
                {historyError && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200">
                    Trade history unavailable: {historyError}
                  </div>
                )}
                <TradeTable trades={todayClosedTrades} kind="closed" />
              </section>

              <p className="text-xs text-white/40">
                Last update: {tradeData.timestamp ? new Date(tradeData.timestamp).toLocaleTimeString('id-ID') : '—'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};