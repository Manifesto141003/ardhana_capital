import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* =====================
   TOOLTIP – Portfolio
===================== */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  if (label === 'Start') return null;

  const r = payload.find(p => p.dataKey === 'return')?.value;
  const b = payload.find(p => p.dataKey === 'benchmark')?.value;

  return (
    <div className="bg-[#0B0F14] border border-white/10 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="text-xs text-white/50 mb-2">{label}</p>
      <div className="flex justify-between">
        <span className="text-white/60">Benchmark</span>
        <span className="text-white font-medium">{b}%</span>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-emerald-400">Return</span>
        <span className="text-emerald-400 font-semibold">+{r}%</span>
      </div>
    </div>
  );
};

/* =====================
   TOOLTIP – Market Bar Chart
===================== */
const MarketTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div className="bg-[#0B0F14] border border-white/10 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="text-xs text-white/50 mb-2">{label}</p>
      <p className={`font-semibold ${v >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {v >= 0 ? '+' : ''}{v?.toFixed(2)}%
      </p>
    </div>
  );
};

/* =====================
   MARKET DATA
===================== */
const MARKET_DATA = [
  {label: 'Ardhana',    value: 56.05,  hargaAwal: '~$2200',  hargaAkhir: '~$6000' },
  { label: 'GOLD',      value: 35.23,  hargaAwal: '~$1,950',  hargaAkhir: '~$2,637' },
  { label: 'Crude Oil', value: 25.00,  hargaAwal: '~$80',     hargaAkhir: '~$100'   },
  { label: 'S&P 500',   value: -6.18,  hargaAwal: '6,501.86', hargaAkhir: '~6,100'  },
  { label: 'BTC',       value: -6.15,  hargaAwal: '~$65,000', hargaAkhir: '~$61,000'},
  { label: 'JPM',       value: -7.14,  hargaAwal: '~$210',    hargaAkhir: '~$195'   },
  { label: 'BRK.B',     value: -3.37,  hargaAwal: '~$445',    hargaAkhir: '~$430'   },
  { label: 'IHSG',      value: -2.76,  hargaAwal: '~7,250',   hargaAkhir: '~7,050'  },
  { label: 'BBCA',      value: -22.29, hargaAwal: '8,300',    hargaAkhir: '6,450'   },
  { label: 'NVDA',      value: -32.60, hargaAwal: '178.06',   hargaAkhir: '~$120'   },
];

/* =====================
   MAIN COMPONENT
===================== */
export const Performance = () => {
  const [viewMode, setViewMode] = useState('quarterly');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [viewMode]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  /* ---- DATA ---- */
  const quarterlyData = [
    { title: 'Quarter I',   period: 'Aug – Oct 2025',      return: 29.4,  benchmark: 29.4,  outperformance: 0, status: 'done'        },
    { title: 'Quarter II',  period: 'Nov 2025 – Jan 2026', return: 6.79,  benchmark: 6.79,  outperformance: 0, status: 'done'        },
    { title: 'Quarter III', period: 'Feb – Apr 2026',      return: 3.66, benchmark: 12.92, outperformance: 0, status: 'ongoing'     },
    { title: 'Quarter IV',  period: 'May – Jul 2026',      return: 0,     benchmark: 0,     outperformance: 0, status: 'Not Started' },
    { title: 'Quarter V',   period: 'Aug – Oct 2026',      return: 0,     benchmark: 0,     outperformance: 0, status: 'Not Started' },
  ];

  const yearlyData = [
    { year: '2025', return: 26.09, benchmark: 26.09, status: 'done'    },
    { year: '2026', return: 13.60, benchmark: 28.86, status: 'ongoing' },
  ];

  const data = viewMode === 'quarterly' ? quarterlyData : yearlyData;

  const chartData = viewMode === 'quarterly'
    ? [{ title: 'Start', return: 0, benchmark: 0 }, ...quarterlyData]
    : [{ year: 'Start', return: 0, benchmark: 0 }, ...yearlyData];

  const totalReturn = '+43.24%';

  const badgeStyle = (status) =>
    status === 'done'
      ? 'bg-emerald-500/15 text-emerald-400'
      : status === 'ongoing'
      ? 'bg-orange-500/15 text-orange-400'
      : 'bg-white/10 text-white/40';

  const positiveCount = MARKET_DATA.filter(d => d.value >= 0).length;
  const negativeCount = MARKET_DATA.filter(d => d.value < 0).length;

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#162840] via-black to-black">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-bold mb-4">
            Portfolio{' '}
            <span className="bg-gradient-to-r from-[#E2C17B] via-[#B88A3B] to-[#8C693E] bg-clip-text text-transparent">
              Performance
            </span>
          </h1>
          <p className="text-white/60 text-lg">
            Transparent, disciplined, data-driven results
          </p>
        </motion.div>

        {/* TOGGLE */}
        <div className="flex justify-center gap-3 mb-14">
          {['quarterly', 'yearly', 'comparison'].map(v => (
            <Button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-8 capitalize ${
                viewMode === v
                  ? 'bg-[#B88A3B] text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {v === 'quarterly' ? 'Quarterly' : v === 'yearly' ? 'Yearly' : 'Comparison'}
            </Button>
          ))}
        </div>

        {/* =====================
            QUARTERLY / YEARLY VIEW
        ===================== */}
        {viewMode !== 'comparison' && (
          <>
            {/* HORIZONTAL SCROLL CARDS */}
            <div className="relative mb-20 group">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-20 md:w-24 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-20 md:w-24 bg-gradient-to-l from-black via-black/60 to-transparent z-10" />

              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 border border-white/10 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
              >←</button>
              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 border border-white/10 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
              >→</button>

              <div className="px-16 md:px-20">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
                >
                  {data.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="min-w-[85%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[25%] snap-start rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-6 hover:border-[#B88A3B]/40 transition"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{p.title || p.year}</h3>
                          {p.period && <p className="text-xs text-white/45">{p.period}</p>}
                        </div>
                        <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${badgeStyle(p.status)}`}>
                          {p.status === 'done' ? 'Completed' : p.status === 'ongoing' ? 'Ongoing' : 'Not Started'}
                        </span>
                      </div>

                      <p className="text-sm text-white/50 mb-1">Return</p>
                      <div className={`flex items-center gap-2 text-3xl font-bold ${p.return >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.return >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {p.return > 0 && '+'}{p.return}%
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 text-sm text-white/60">
                        Benchmark: {p.benchmark > 0 && '+'}{p.benchmark}%
                      </div>

                      {p.outperformance !== undefined && (
                        <div className="pt-2 text-sm">
                          Outperformance:{' '}
                          <span className="text-emerald-400 font-semibold">+{p.outperformance}%</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {viewMode === 'quarterly' ? '2025–2026 Performance' : 'Cumulative Performance'}
                </h3>
                <span className="text-3xl font-bold text-emerald-400">{totalReturn}</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey={viewMode === 'quarterly' ? 'title' : 'year'}
                      padding={{ left: 0, right: 20 }}
                      tickFormatter={(v) => (v === 'Start' ? '' : v)}
                      stroke="rgba(255,255,255,0.5)"
                    />
                    <YAxis domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line connectNulls type="monotone" dataKey="return" stroke="#22E36F" strokeWidth={3} dot={false} />
                    <Line connectNulls type="monotone" dataKey="benchmark" stroke="#9CA3AF" strokeDasharray="4 6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* =====================
            COMPARISON VIEW — MARKET BAR CHART
        ===================== */}
        {viewMode === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* SUMMARY STATS */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-5 text-center">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">Assets Tracked</p>
                <p className="text-3xl font-bold text-white">{MARKET_DATA.length}</p>
              </div>
              <div className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-5 text-center">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">Positive</p>
                <p className="text-3xl font-bold text-emerald-400">{positiveCount}</p>
              </div>
              <div className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-5 text-center">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">Negative</p>
                <p className="text-3xl font-bold text-red-400">{negativeCount}</p>
              </div>
            </div>

            {/* BAR CHART */}
            <div className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold text-white">Market Return Comparison</h3>
                <span className="text-xs text-white/30 uppercase tracking-widest">% Change</span>
              </div>
              <p className="text-xs text-white/40 mb-6">
                Perbandingan pergerakan harga aset dari harga awal ke harga akhir periode
              </p>

              {/* LEGEND */}
              <div className="flex gap-5 mb-6">
                <span className="flex items-center gap-2 text-xs text-white/50">
                  <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" /> Positif
                </span>
                <span className="flex items-center gap-2 text-xs text-white/50">
                  <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Negatif
                </span>
              </div>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MARKET_DATA}
                    layout="vertical"
                    margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `${v}%`}
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={80}
                      stroke="rgba(255,255,255,0.0)"
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)', fontWeight: 500 }}
                    />
                    <Tooltip content={<MarketTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{
                      position: 'right',
                      formatter: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
                      fill: 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                    }}>
                      {MARKET_DATA.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.value >= 0 ? '#22E36F' : '#ef4444'}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* DETAIL CARDS */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {MARKET_DATA.map((asset) => (
                  <div key={asset.label} className="rounded-xl bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{asset.label}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${asset.value >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}
                      />
                    </div>
                    <p
                      className={`text-xl font-bold ${asset.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {asset.value >= 0 ? '+' : ''}{asset.value.toFixed(2)}%
                    </p>
                    <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/35 space-y-0.5">
                      <p>Awal: {asset.hargaAwal}</p>
                      <p>Akhir: {asset.hargaAkhir}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PERIOD INDICATOR */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-white/50 mb-2">Periode Analisis</p>
                <p className="text-2xl font-bold text-white">
                  1 Agustus 2025 <span className="text-white/40 mx-3">–</span> 31 Maret 2026
                </p>
                <p className="text-xs text-white/35 mt-2">Performa aset selama 8 bulan investasi</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};