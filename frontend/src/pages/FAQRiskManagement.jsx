import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'What happens if the strategy experiences a major loss — can I lose my entire capital?',
    answer:
      'Our risk management is strictly disciplined and documented in the Investor Agreement. If monthly drawdown reaches 25%, risk per trade is automatically reduced by 0.5% until the account recovers. Every position carries predefined Take Profit and Stop Loss levels, and Risk Per Trade is capped between 0.5%–2.5% at all times.',
  },
  {
    question: 'Who manages my funds, and what is their track record?',
    answer:
      'Our trading track record is publicly verifiable via our MQL5 portfolio link, so you can review historical performance independently at any time.',
  },
  {
    question: 'What is short-selling, and is it the same as gambling?',
    answer:
      'Short-selling is a strategy used when we expect an asset\'s price to decline. If the price falls, the position may profit; if it rises, it may lose money. It is a regulated trading technique used in FX and commodities, not gambling.',
  },
  {
    question: 'Why can you profit even when the market is falling?',
    answer:
      'Because we can trade both directions. By using short-selling, we can seek opportunities when prices decline as well as when they rise.',
  },
];

export const FAQRiskManagement = () => (
  <FAQCategory
    title="Risk Management"
    description="Understand the controls and strategies we use to protect capital and manage downside risk."
    items={items}
  />
);
