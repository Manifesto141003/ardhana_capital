import { useEffect, useState } from 'react';

export const LiveTrade = () => {
  const [tradeData, setTradeData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveTrade = async () => {
      try {
        const response = await fetch('/api/livetrade');
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const payload = await response.json();
        setTradeData(payload);
        setStatus('loaded');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    fetchLiveTrade();
    const interval = setInterval(fetchLiveTrade, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#080b10] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0b1220]/90 p-8 shadow-2xl shadow-black/30">
          <h1 className="text-4xl font-bold mb-4">Live Trade Data</h1>
          <p className="text-sm text-white/60 mb-8">
            This route is intentionally hidden. Access it directly at <span className="font-semibold">/performance/livetrade</span>.
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-white/50">Source</div>
                <div className="mt-2 text-lg font-semibold text-white">{tradeData.source || 'unknown'}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-white/50">Last update</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {tradeData.timestamp ? new Date(tradeData.timestamp).toLocaleString() : '—'}
                </div>
              </div>

              {tradeData.data && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <pre className="whitespace-pre-wrap text-sm text-white/80">{JSON.stringify(tradeData.data, null, 2)}</pre>
                </div>
              )}

              {tradeData.notice && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-200">
                  {tradeData.notice}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};