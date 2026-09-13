import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FAQCategory = ({ title, description, items }) => {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#020617] text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto pb-12"
        >
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#A67D32]/80">
            FAQ Category
          </span>
          <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-sm sm:text-base text-white/70">
              {description}
            </p>
          )}
          <div className="mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Back to FAQ overview
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0D1320]/80 p-6 sm:p-8 shadow-xl shadow-[#020617]/20"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {item.question}
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-white/70">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
