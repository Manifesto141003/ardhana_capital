import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'How can I monitor my investment performance in real time?',
    answer:
      'Via your personal MT4 terminal, and our COO is available 24/7 for any questions.',
  },
  {
    question: 'What makes this different from investing in mutual funds or stocks?',
    answer:
      'We provide comparative performance data, the flexibility to go both long and short, full real-time terminal transparency, and access to the world\'s largest and most liquid market — giving significant scalability advantage.',
  },
];

export const FAQOnboardingGeneral = () => (
  <FAQCategory
    title="Onboarding & General"
    description="Find answers about monitoring, onboarding, and how this opportunity differs from other investment options."
    items={items}
  />
);
