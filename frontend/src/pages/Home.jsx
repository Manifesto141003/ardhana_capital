import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { ArrowRight, TrendingUp, Shield, LineChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Home = () => {
  const [counts, setCounts] = useState({
    aum: 0,
    clients: 0,
    return: 0,
    year: 2018,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        aum: Math.floor(6 * progress),
        clients: Math.floor(10 * progress),
        return: (18.15 * progress).toFixed(1),
        year: 2025,
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      value: `$${counts.aum}K`,
      label: 'Assets Under Management',
      color: 'text-[#E2C17B]',
    },
    {
      value: `${counts.clients}+`,
      label: 'Trusted Clients',
      color: 'text-[#E2C17B]',
    },
    {
      value: `${counts.return}%`,
      label: 'Avg Quarterly Return',
      color: 'text-[#E2C17B]',
    },
    {
      value: counts.year,
      label: 'Established',
      color: 'text-[#E2C17B]',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#162840] via-black to-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#A67D32]/30 bg-[#A67D32]/10 text-sm"
          >
            <TrendingUp className="w-4 h-4 text-[#E2C17B]" />
            <span className="text-[#E2C17B]/90">
              99% Data-Driven Fund Management
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-5xl md:text-6xl font-bold leading-tight"
          >
            Ardhana <br />
            <span className="bg-gradient-to-r from-[#BFAA6B] via-[#A67D32] to-[#8C693E] bg-clip-text text-transparent">
              Capital
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-white/60 max-w-3xl mx-auto"
          >
            Elite fund management powered by data intelligence and disciplined risk management.
            We educate, we transparency, we perform.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/performance">
              <Button className="
                bg-[#A67D32] 
                hover:bg-[#BFAA6B]
                text-black 
                hover:text-black
                font-semibold 
                px-8 h-12
                transition-colors
                ">
                 View Portfolio Performance
              </Button>
            </Link>
            <Link to="/approach">
              <Button
              variant="outline"
              className="
             border-[#A67D32]/50 
             text-[#E2C17B]
             hover:bg-[#A67D32]/25
             hover:text-white
             transition-colors
             px-8 h-12">
             Learn Our Approach
            </Button>
            </Link>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#0D0D0D] border border-[#162840] p-6 text-center"
              >
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wide text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="pt-28">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-[#BFAA6B] via-[#A67D32] to-[#8C693E] bg-clip-text text-transparent">
                Ardhana Capital
              </span>
            </h2>
            <p className="text-white/60">
              Data intelligence combined with disciplined execution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: LineChart, title: 'Data-Driven', desc: 'Quantitative & market intelligence' },
              { icon: Shield, title: 'Risk Management', desc: 'Capital protection first' },
              { icon: TrendingUp, title: 'Consistent Returns', desc: '18.15% avg quarterly' },
              { icon: Users, title: 'Client Education', desc: 'Transparent partnership' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-[#0D0D0D] border border-[#162840] p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-[#A67D32]/15 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[#E2C17B]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#ffffff]">
                  {f.title}
                </h3>
                <p className="text-white/60">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
