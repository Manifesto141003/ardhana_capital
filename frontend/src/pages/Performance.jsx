import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* =====================
   TOOLTIP
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

export const Performance = () => {
  const [viewMode, setViewMode] = useState('quarterly');
  const scrollRef = useRef(null);

  /* AUTO SCROLL KE AKHIR */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [viewMode]);

  /* SCROLL BUTTON */
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const quarterlyData = [
    { title: 'Quarter I', period: 'Aug – Oct 2025', return: 29.4, benchmark: 29.4, outperformance: 0, status: 'done' },
    { title: 'Quarter II', period: 'Nov 2025 – Jan 2026', return: 6.79, benchmark: 6.79, outperformance: 0, status: 'done' },
    { title: 'Quarter III', period: 'Feb – Apr 2026', return: 17.58, benchmark: 17.58, outperformance: 0, status: 'ongoing' },
    { title: 'Quarter IV', period: 'May – Jul 2026', return: 0, benchmark: 0, outperformance: 0, status: 'Not Started' },
    { title: 'Quarter V', period: 'Aug – Oct 2026', return: 0, benchmark: 0, outperformance: 0, status: 'Not Started' },
  ];

  const yearlyData = [
    { year: '2025', return: 26.09, benchmark: 26.09, status: 'done' },
    { year: '2026', return: 28.86, benchmark: 28.86, status: 'ongoing' },
  ];

  const data = viewMode === 'quarterly' ? quarterlyData : yearlyData;

  /* Chart data with a zero start point */
  const chartData = viewMode === 'quarterly'
    ? [{ title: 'Start', return: 0, benchmark: 0 }, ...quarterlyData]
    : [{ year: 'Start', return: 0, benchmark: 0 }, ...yearlyData];

  const totalReturn = '+62.48%';

  const badgeStyle = (status) =>
    status === 'done'
      ? 'bg-emerald-500/15 text-emerald-400'
      : 'bg-orange-500/15 text-orange-400';

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
          {['quarterly', 'yearly'].map(v => (
            <Button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-10 ${
                viewMode === v
                  ? 'bg-[#B88A3B] text-black'
                  : 'bg-white/5 text-white/60'
              }`}
            >
              {v === 'quarterly' ? 'Quarterly' : 'Yearly'}
            </Button>
          ))}
        </div>

        {/* =====================
            HORIZONTAL SCROLL
        ===================== */}
        <div className="relative mb-20 group">

          {/* LEFT FADE */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-20 md:w-24 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 md:w-24 bg-gradient-to-l from-black via-black/60 to-transparent z-10" />

          {/* LEFT ARROW */}
          <button
            onClick={() => scroll('left')}
            className="
              hidden md:flex
              absolute left-6 top-1/2 -translate-y-1/2 z-20
              bg-black/60 hover:bg-black/80
              border border-white/10
              p-3 rounded-full
              opacity-0 group-hover:opacity-100
              transition
            "
          >
            ←
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={() => scroll('right')}
            className="
              hidden md:flex
              absolute right-6 top-1/2 -translate-y-1/2 z-20
              bg-black/60 hover:bg-black/80
              border border-white/10
              p-3 rounded-full
              opacity-0 group-hover:opacity-100
              transition
            "
          >
            →
          </button>

          {/* SAFE AREA WRAPPER */}
          <div className="px-16 md:px-20">

            {/* SCROLL AREA */}
            <div
              ref={scrollRef}
              className="
                flex gap-6 overflow-x-auto pb-4
                snap-x snap-mandatory scroll-smooth
                scrollbar-hide
              "
            >
              {data.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="
                    min-w-[85%]
                    sm:min-w-[60%]
                    md:min-w-[40%]
                    lg:min-w-[25%]
                    snap-start
                    rounded-2xl bg-[#0B0F14] border border-[#1B2A3F]
                    p-6 hover:border-[#B88A3B]/40 transition
                  "
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {p.title || p.year}
                      </h3>
                      {p.period && (
                        <p className="text-xs text-white/45">{p.period}</p>
                      )}
                    </div>

                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${badgeStyle(p.status)}`}>
                      {p.status === 'done' ? 'Completed' : p.status === 'ongoing' ? 'Ongoing' : 'Not Started'}
                    </span>
                  </div>

                  <p className="text-sm text-white/50 mb-1">Return</p>

                  <div className={`flex items-center gap-2 text-3xl font-bold ${
                    p.return >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {p.return >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {p.return > 0 && '+'}
                    {p.return}%
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-sm text-white/60">
                    Benchmark: {p.benchmark > 0 && '+'}{p.benchmark}%
                  </div>

                  {p.outperformance !== undefined && (
                    <div className="pt-2 text-sm">
                      Outperformance:{' '}
                      <span className="text-emerald-400 font-semibold">
                        +{p.outperformance}%
                      </span>
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
              {viewMode === 'quarterly'
                ? '2025–2026 Performance'
                : 'Cumulative Performance'}
            </h3>
            <span className="text-3xl font-bold text-emerald-400">
              {totalReturn}
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey={viewMode === 'quarterly' ? 'title' : 'year'}
                  padding={{ left: 0, right: 20 }}
                  tickFormatter={(v) => (v === 'Start' ? '' : v)}
                  stroke="rgba(255,255,255,0.5)"
                />
                <YAxis
                  domain={[0, 'auto']}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />

                <Line
                  connectNulls={true}
                  type="monotone"
                  dataKey="return"
                  stroke="#22E36F"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  connectNulls={true}
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#9CA3AF"
                  strokeDasharray="4 6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};