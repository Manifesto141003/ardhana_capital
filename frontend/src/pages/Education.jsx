import { motion } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, AlertTriangle } from 'lucide-react';

export const Education = () => {
  const principles = [
    {
      icon: TrendingUp,
      title: 'Judge by Quarter, Not by Trade',
      description:
        'Individual trades can be misleading. Our data shows that quarterly performance provides a more accurate picture of fund health and strategy effectiveness.',
    },
    {
      icon: Shield,
      title: 'Losses Are Normal',
      description:
        'Even the best funds experience losses. What matters is how we manage risk and maintain positive returns over time. Our transparent approach shows both wins and losses.',
    },
    {
      icon: BarChart3,
      title: '99% Data-Driven Decisions',
      description:
        'We rely on quantitative analysis, historical patterns, and real-time market data to make informed investment decisions, minimizing emotional bias.',
    },
    {
      icon: AlertTriangle,
      title: 'Risk Management First',
      description:
        'Capital preservation is paramount. Our systematic approach focuses on managing downside risk while capturing upside opportunities.',
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
            Client{' '}
            <span className="bg-gradient-to-r from-[#E2C17B] via-[#B88A3B] to-[#8C693E] bg-clip-text text-transparent">
              Education
            </span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We believe informed clients make better investment partners. Understanding our approach is
            key to long-term success.
          </p>
        </motion.div>

        {/* PRINCIPLES */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-6 hover:border-[#B88A3B]/40 transition"
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#B88A3B]/10 flex items-center justify-center">
                  <principle.icon className="w-6 h-6 text-[#E2C17B]" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {principle.title}
              </h3>

              <p className="text-white/60 leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* PHILOSOPHY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Investment Philosophy
          </h3>

          <div className="space-y-6 text-white/60 leading-relaxed">
            <p>
              At Ardhana Capital, we practice evidence-based investing. Our philosophy is built on
              decades of market research, quantitative analysis, and disciplined execution. We believe
              that sustainable outperformance comes from a systematic approach, not market timing or
              speculation.
            </p>

            <p>
              We educate our clients on the realities of investing — including the fact that temporary
              losses are a natural part of any growth strategy. What distinguishes successful investors
              is their ability to stay disciplined during market volatility and focus on long-term
              objectives.
            </p>

            <p>
              Our commitment to transparency means you'll always know where your capital is invested,
              how it's performing, and why we made each strategic decision. Our quarterly reports break
              down every aspect of fund performance with full transparency.
            </p>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: '100%',
              subtitle: 'Portfolio Visibility',
              description: 'Complete transparency into holdings and performance',
            },
            {
              title: 'Quarterly',
              subtitle: 'Detailed Reports',
              description: 'Comprehensive breakdowns of fund performance',
            },
            {
              title: 'Real-Time',
              subtitle: 'Data Access',
              description: 'Up-to-date portfolio information when you need it',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-6 text-center hover:border-[#B88A3B]/40 transition"
            >
              <div className="text-3xl font-bold text-[#E2C17B] mb-2">
                {item.title}
              </div>

              <div className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                {item.subtitle}
              </div>

              <div className="text-xs text-white/50">
                {item.description}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};
