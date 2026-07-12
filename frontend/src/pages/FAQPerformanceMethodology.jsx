import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'Why does the performance shown differ from what I experience personally?',
    answer:
      'The percentage shown reflects our fund\'s Time-Weighted Return (TWR), which isolates strategy performance from investor cash flows. Personal return can differ based on your entry date because deposits made later are exposed for less time.',
  },
  {
    question: 'How is ownership divided when multiple investors share one account?',
    answer:
      'Ownership is allocated strictly pro-rata to each investor\'s contribution. All gains, losses, and fees are then calculated proportional to each investor\'s share of the account.',
  },
  {
    question: 'Do you charge fees if my portfolio hasn\'t grown since I joined?',
    answer:
      'No. We only charge performance fees on actual net profit generated for your capital. If your portion of the portfolio is flat or negative, no performance fee applies to that portion.',
  },
  {
    question: 'How do you calculate TWR, and who calculates it?',
    answer:
      'We calculate TWR using the standard formula that removes the effect of investor contributions and withdrawals. Our operations team computes and verifies it monthly from the live trading account and official trade statements.',
  },
  {
    question: 'What instruments do you trade?',
    answer:
      'We trade Forex (FX) pairs and commodities.',
  },
  {
    question: 'Where can I see the portfolio?',
    answer: (
      <span>
        You can view the portfolio on MQL5 at{' '}
        <a
          href="https://www.mql5.com/en/search#!keyword=rooast77"
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#A67D32] hover:underline"
        >
          https://www.mql5.com/en/search#!keyword=rooast77
        </a>
      </span>
    ),
  },
];

export const FAQPerformanceMethodology = () => (
  <FAQCategory
    title="Performance & Methodology"
    description="Learn how performance is measured and how ownership and fees are applied within the fund."
    items={items}
  />
);
