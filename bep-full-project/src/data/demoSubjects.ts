// bep-full-project/src/data/demoSubjects.ts

export interface DemoChapter {
  id: string;
  name: string;
  totalQuestions: number;
}

export interface DemoSubject {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  totalQuestions: number;
  totalChapters: number;
  chapters: DemoChapter[];
}

export const demoSubjects: DemoSubject[] = [
  {
    id: 'subject-physics',
    name: 'Physics',
    slug: 'physics',
    icon: 'Atom',
    color: '#06B6D4',
    description:
      'SSC, HSC এবং Admission এর জন্য সম্পূর্ণ Physics preparation system।',
    totalQuestions: 3250,
    totalChapters: 12,

    chapters: [
      {
        id: 'phy-ch-1',
        name: 'ভৌত রাশি',
        totalQuestions: 280,
      },
      {
        id: 'phy-ch-2',
        name: 'গতিবিদ্যা',
        totalQuestions: 420,
      },
      {
        id: 'phy-ch-3',
        name: 'নিউটনের সূত্র',
        totalQuestions: 360,
      },
    ],
  },

  {
    id: 'subject-chemistry',
    name: 'Chemistry',
    slug: 'chemistry',
    icon: 'FlaskConical',
    color: '#A855F7',
    description:
      'Board + Admission standard Chemistry question bank এবং smart analytics।',
    totalQuestions: 2980,
    totalChapters: 10,

    chapters: [
      {
        id: 'chem-ch-1',
        name: 'পরমাণুর গঠন',
        totalQuestions: 340,
      },
      {
        id: 'chem-ch-2',
        name: 'রাসায়নিক বন্ধন',
        totalQuestions: 280,
      },
    ],
  },

  {
    id: 'subject-math',
    name: 'Mathematics',
    slug: 'mathematics',
    icon: 'Sigma',
    color: '#F59E0B',
    description:
      'Creative math solving, shortcut techniques এবং AI-assisted explanation।',
    totalQuestions: 4100,
    totalChapters: 15,

    chapters: [
      {
        id: 'math-ch-1',
        name: 'বীজগণিত',
        totalQuestions: 500,
      },
      {
        id: 'math-ch-2',
        name: 'ত্রিকোণমিতি',
        totalQuestions: 450,
      },
    ],
  },

  {
    id: 'subject-biology',
    name: 'Biology',
    slug: 'biology',
    icon: 'Dna',
    color: '#10B981',
    description:
      'Medical এবং Board exam এর জন্য biology mastery platform।',
    totalQuestions: 3600,
    totalChapters: 14,

    chapters: [
      {
        id: 'bio-ch-1',
        name: 'কোষ ও টিস্যু',
        totalQuestions: 390,
      },
      {
        id: 'bio-ch-2',
        name: 'জিনতত্ত্ব',
        totalQuestions: 310,
      },
    ],
  },
];

export default demoSubjects;
