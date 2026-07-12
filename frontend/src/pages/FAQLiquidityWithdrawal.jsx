import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'How long does a withdrawal take?',
    answer:
      'Typically 5–60 minutes, excluding holidays or unforeseen technical issues. In our operating history, one instance took longer but was resolved within one day.',
  },
  {
    question: 'Is there a minimum holding period before I can withdraw?',
    answer:
      'Withdrawals can be requested at any time; specific terms and conditions are detailed in the Investor Agreement.',
  },
  {
    question: 'Are there limits on withdrawal amount or frequency?',
    answer:
      'No limits apply.',
  },
  {
    question: 'What happens if many investors withdraw at the same time?',
    answer:
      'This does not pose an operational issue for us.',
  },
];

export const FAQLiquidityWithdrawal = () => (
  <FAQCategory
    title="Liquidity & Withdrawal"
    description="Get clarity on withdrawal timing, limits, and how liquidity is managed."
    items={items}
  />
);
