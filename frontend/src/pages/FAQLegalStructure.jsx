import { FAQCategory } from './FAQCategory';

const items = [
  {
    question: 'Is this fund registered or supervised by OJK or Bappebti?',
    answer:
      'Our broker is supervised by OJK and Bappebti.',
  },
  {
    question: 'What is the legal structure of this fund?',
    answer:
      'This is a private partnership.',
  },
  {
    question: 'How long has this fund been operating, and what’s the track record?',
    answer:
      'Operating since August 1, 2025.',
  },
];

export const FAQLegalStructure = () => (
  <FAQCategory
    title="Legal & Structure"
    description="Understand the legal framework, oversight, and track record of the fund."
    items={items}
  />
);
