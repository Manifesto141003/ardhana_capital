import { motion } from 'framer-motion';
import { Target, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const RiskMetrics = () => {
  const metrics = [
    {
      icon: Target,
      title: 'Sharpe Ratio',
      value: '1.96',
      description: 'Risk-adjusted return measure',
      color: 'text-primary',
    },
    {
      icon: TrendingDown,
      title: 'Max Drawdown',
      value: '-17%',
      description: 'Largest peak-to-trough decline',
      color: 'text-destructive',
    },
    {
      icon: Activity,
      title: 'Win Rate',
      value: '42.48%',
      description: 'Percentage of profitable quarters',
      color: 'text-success',
    },
    {
      icon: BarChart3,
      title: 'Volatility',
      value: '19.41%',
      description: 'Standard deviation of returns',
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#162840] via-black to-black">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center mb-14"
        >
          <h1 className="text-5xl font-bold mb-6">
            Risk{' '}
            <span className="bg-gradient-to-r from-[#E2C17B] via-[#B88A3B] to-[#8C693E] bg-clip-text text-transparent">
              Metrics
            </span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Data-driven risk management ensures capital preservation while capturing opportunities.
          </p>
        </motion.div>

        {/* METRIC CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-6 hover:border-[#B88A3B]/40 transition"
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#B88A3B]/10 flex items-center justify-center">
                  <metric.icon className="w-6 h-6 text-[#E2C17B]" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {metric.title}
              </h3>

              <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
                {metric.value}
              </div>

              <p className="text-sm text-white/50">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* PHILOSOPHY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Risk Management Philosophy
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#E2C17B]">
                Quantitative Analysis
              </h4>
              <p className="text-white/60 leading-relaxed">
                We employ sophisticated statistical models to measure, monitor, and manage risk across
                all portfolio positions. Our systematic approach ensures consistent application of risk
                parameters.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#E2C17B]">
                Diversification Strategy
              </h4>
              <p className="text-white/60 leading-relaxed">
                Strategic allocation across asset classes, sectors, and geographies reduces concentration
                risk while maintaining exposure to high-conviction opportunities.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#E2C17B]">
                Downside Protection
              </h4>
              <p className="text-white/60 leading-relaxed">
                Position sizing and stop-loss disciplines protect capital during adverse market
                conditions. Our maximum drawdown of -17% demonstrates disciplined risk control.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#E2C17B]">
                Continuous Monitoring
              </h4>
              <p className="text-white/60 leading-relaxed">
                Real-time portfolio analytics and daily risk assessments enable rapid response to
                changing market dynamics and emerging risks.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
