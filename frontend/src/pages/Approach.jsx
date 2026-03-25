import { motion } from 'framer-motion';
import { Lightbulb, Database, Target, Award } from 'lucide-react';

export const Approach = () => {
  const principles = [
    {
      icon: Database,
      title: 'Data Intelligence',
      description:
        'Every investment decision is supported by comprehensive data analysis. We process market data, historical patterns, and real-time indicators to identify high-probability opportunities.',
    },
    {
      icon: Target,
      title: 'Disciplined Execution',
      description:
        'We follow strict entry and exit criteria based on our quantitative models. Emotional decision-making is eliminated through systematic rules and automated alerts.',
    },
    {
      icon: Lightbulb,
      title: 'Continuous Learning',
      description:
        'Markets evolve, and so do we. Our team continuously refines our models and strategies based on new data, changing market conditions, and emerging opportunities.',
    },
    {
      icon: Award,
      title: 'Client Success',
      description:
        'Your success is our success. We align our interests with yours through transparent fee structures and a commitment to long-term partnership.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#162840] via-black to-black">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">
            Our{' '}
            <span className="bg-gradient-to-r from-[#E2C17B] via-[#B88A3B] to-[#8C693E] bg-clip-text text-transparent">
              Approach
            </span>
          </h1>
          <p className="text-white/60 text-lg">
            Four core principles guide every decision we make at Ardhana Capital.
          </p>
        </motion.div>

        {/* PRINCIPLES */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-8 hover:border-[#B88A3B]/40 transition"
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#B88A3B]/15 flex items-center justify-center">
                  <principle.icon className="w-6 h-6 text-[#B88A3B]" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {principle.title}
              </h3>

              <p className="text-white/60 leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* INVESTMENT PROCESS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-[#0B0F14] border border-[#1B2A3F] p-10"
        >
          <h3 className="text-3xl font-bold mb-10 text-white text-center">
            Investment Process
          </h3>

          <div className="space-y-8">

            {[
              {
                title: 'Market Analysis',
                description:
                  'We classify market conditions as either ranging or trending and apply quantitative risk assessment before allocating capital to any trade.',
              },
              {
                title: 'Opportunity Identification',
                description:
                  'Our team identifies market patterns based on historical and backtested data that align with our portfolio strategy.',
              },
              {
                title: 'Risk Assessment',
                description:
                  'Each position is evaluated for risk exposure and proper position sizing relative to current market conditions to ensure disciplined risk management.',
              },
              {
                title: 'Execution & Monitoring',
                description:
                  'Trades are executed systematically, and positions are continuously monitored using predefined exit criteria and stop-loss parameters.',
              },
              {
                title: 'Performance Review',
                description:
                  'We conduct comprehensive quarterly reviews to evaluate strategy effectiveness, identify areas for refinement, and communicate performance results transparently to our clients.',
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#B88A3B]/20 flex items-center justify-center text-[#B88A3B] font-bold">
                    {index + 1}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </motion.div>

      </div>
    </div>
  );
};
