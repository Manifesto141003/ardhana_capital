import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Performance & Methodology',
    description: 'How performance is measured and how ownership, fees, and calculations are handled.',
    path: '/faq/performance-methodology',
  },
  {
    title: 'Risk Management',
    description: 'Our risk controls, stop loss discipline, and how we manage downside exposure.',
    path: '/faq/risk-management',
  },
  {
    title: 'Liquidity & Withdrawal',
    description: 'Withdrawal timing, limits, and how we manage liquidity for investors.',
    path: '/faq/liquidity-withdrawal',
  },
  {
    title: 'Fees',
    description: 'What fees apply, how they are calculated, and whether hidden charges exist.',
    path: '/faq/fees',
  },
  {
    title: 'Transparency & Reporting',
    description: 'How performance is reported, audited, and shared with investors.',
    path: '/faq/transparency-reporting',
  },
  {
    title: 'Legal & Structure',
    description: 'Regulation, legal form, and how long the fund has been operating.',
    path: '/faq/legal-structure',
  },
  {
    title: 'Onboarding & General',
    description: 'How to monitor performance and what sets this fund apart from other investments.',
    path: '/faq/onboarding-general',
  },
];

export const FAQ = () => {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#020617] text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto pb-12"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-[#A67D32]/80">
            Frequently Asked Questions
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            FAQ Categories
          </h1>
          <p className="mt-4 text-base text-white/70">
            Select a topic to view the full set of frequently asked questions for that category.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-[#0D1320]/80 p-8 shadow-xl shadow-[#020617]/20"
            >
              <h2 className="text-2xl font-semibold text-white">{category.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">{category.description}</p>
              <Link
                to={category.path}
                className="mt-6 inline-flex items-center rounded-full bg-[#A67D32] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#BFAA6B]"
              >
                Explore {category.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
