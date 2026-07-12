import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'How do I know the reported performance is accurate and not manipulated?',
    answer:
      'Every investor holds their own read-only MT4 terminal, showing the exact same live, real-time data as our own trading terminal. There is no delay or filtering — what you see is what is actually happening in the market.',
  },
  {
    question: 'Is there third-party audit verification?',
    answer:
      'Not yet formally, but we remain fully open to being audited by any investor at any time.',
  },
  {
    question: 'How often do I receive performance reports?',
    answer:
      'Reports are issued at month-end. For investors joining or exiting mid-cycle, entries are processed within a window on the 1st–3rd of the month, while exits can occur at any time and are reflected in the following month-end report.',
  },
  {
    question: 'If a major drawdown occurs, will I be notified immediately or only in the monthly report?',
    answer:
      'Everything is visible in real-time via your MT4 terminal — you do not need to wait for the monthly report to see what is happening.',
  },
];

export const FAQTransparencyReporting = () => (
  <FAQCategory
    title="Transparency & Reporting"
    description="See how performance, reporting, and visibility are delivered to investors."
    items={items}
  />
);
