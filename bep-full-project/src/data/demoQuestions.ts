// bep-full-project/src/data/demoQuestions.ts

export interface DemoQuestion {
  id: string;
  subject: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[];
}

export const demoQuestions: DemoQuestion[] = [
  {
    id: 'phy-001',
    subject: 'Physics',
    chapter: 'ভৌত রাশি',
    difficulty: 'easy',
    question: 'SI পদ্ধতিতে বলের একক কী?',
    options: ['Joule', 'Pascal', 'Newton', 'Watt'],
    correctAnswer: 2,
    explanation:
      'SI পদ্ধতিতে বলের একক হলো Newton (N)।',
    tags: ['physics', 'si-unit'],
  },

  {
    id: 'phy-002',
    subject: 'Physics',
    chapter: 'গতিবিদ্যা',
    difficulty: 'medium',
    question:
      'কোনো বস্তুর বেগ দ্বিগুণ করলে গতিশক্তি কত গুণ হবে?',
    options: ['২ গুণ', '৩ গুণ', '৪ গুণ', '৮ গুণ'],
    correctAnswer: 2,
    explanation:
      'গতিশক্তি KE = 1/2mv²। বেগ দ্বিগুণ হলে শক্তি ৪ গুণ হবে।',
    tags: ['kinetic-energy', 'motion'],
  },

  {
    id: 'chem-001',
    subject: 'Chemistry',
    chapter: 'পরমাণুর গঠন',
    difficulty: 'medium',
    question: 'ইলেকট্রনের চার্জ কত?',
    options: [
      '-1.6 × 10⁻¹⁹ C',
      '+1.6 × 10⁻¹⁹ C',
      '0 C',
      '1 Coulomb',
    ],
    correctAnswer: 0,
    explanation:
      'ইলেকট্রনের চার্জ ঋণাত্মক এবং এর মান -1.6 × 10⁻¹⁹ C।',
    tags: ['electron', 'atom'],
  },

  {
    id: 'math-001',
    subject: 'Mathematics',
    chapter: 'বীজগণিত',
    difficulty: 'hard',
    question: 'x² - 5x + 6 = 0 সমীকরণের মূল কত?',
    options: ['2, 3', '1, 6', '-2, -3', '5, 6'],
    correctAnswer: 0,
    explanation:
      '(x - 2)(x - 3)=0 ⇒ x = 2, 3',
    tags: ['algebra', 'quadratic'],
  },

  {
    id: 'bio-001',
    subject: 'Biology',
    chapter: 'কোষ ও টিস্যু',
    difficulty: 'easy',
    question:
      'মানবদেহের ক্ষুদ্রতম গঠনগত ও কার্যগত একক কোনটি?',
    options: ['টিস্যু', 'অঙ্গ', 'কোষ', 'অস্থি'],
    correctAnswer: 2,
    explanation:
      'কোষ হলো জীবদেহের ক্ষুদ্রতম গঠনগত ও কার্যগত একক।',
    tags: ['cell', 'biology'],
  },
];

export default demoQuestions;
