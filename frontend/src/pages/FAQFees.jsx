import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'Are there any hidden fees beyond the performance fee?',
    answer:
      'No hidden fees. The only additional charge is an early-withdrawal penalty if you withdraw outside our semester (6-month) fee cycle.',
  },
  {
    question: 'How is the performance fee calculated — gross or net profit?',
    answer:
      'Performance fee is 20% of net profit, calculated on a Beginning of Period (BOP) basis.',
  },
  {
    question: 'Is there a fixed management fee regardless of profit/loss?',
    answer:
      'A flat 1% AUM-based management fee applies based on the trading result (none if no growth), in addition to the 20% performance fee on net profit.',
  },
];

export const FAQFees = () => (
  <FAQCategory
    title="Fees"
    description="Find out how our fees are structured and what costs apply to your investment."
    items={items}
  />
);
