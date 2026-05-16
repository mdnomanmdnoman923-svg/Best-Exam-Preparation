// bep-full-project/src/data/cmsSeed.ts

export interface CMSHeroSection {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  bannerImage: string;
}

export interface CMSFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CMSPricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  highlighted?: boolean;
}

export interface CMSHomePage {
  hero: CMSHeroSection;
  features: CMSFeature[];
  pricing: CMSPricingPlan[];
}

export interface CMSAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt: string;
}

export interface CMSConfig {
  homePage: CMSHomePage;
  announcements: CMSAnnouncement[];
}

export const cmsSeed: CMSConfig = {
  homePage: {
    hero: {
      title: 'বাংলাদেশের স্মার্ট AI শিক্ষার প্ল্যাটফর্ম',
      subtitle:
        'Class 6 থেকে Masters পর্যন্ত প্রশ্নব্যাংক, মডেল টেস্ট, AI Tutor এবং Analytics সহ সম্পূর্ণ Bengali-first EdTech অভিজ্ঞতা।',
      primaryButton: 'এখনই শুরু করুন',
      secondaryButton: 'ডেমো দেখুন',
      bannerImage:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    },

    features: [
      {
        id: 'feature-ai',
        title: 'AI Study Assistant',
        description:
          'বাংলায় AI tutor যা instant explanation এবং smart guidance দেয়।',
        icon: 'Bot',
      },
      {
        id: 'feature-exam',
        title: 'Mock Exam Engine',
        description:
          'সময় নির্ধারিত পরীক্ষা এবং leaderboard system সহ real exam experience।',
        icon: 'Timer',
      },
      {
        id: 'feature-analytics',
        title: 'Performance Analytics',
        description:
          'Weak topic analysis, progress tracking এবং score insights।',
        icon: 'BarChart3',
      },
      {
        id: 'feature-community',
        title: 'Learning Community',
        description:
          'Discussion, peer learning এবং competitive ranking system।',
        icon: 'Users',
      },
    ],

    pricing: [
      {
        id: 'free-plan',
        name: 'Free',
        price: 0,
        duration: 'মাস',
        features: [
          'Limited Practice',
          'Basic Question Bank',
          'Community Access',
          'Daily Quiz',
        ],
      },

      {
        id: 'premium-plan',
        name: 'Premium',
        price: 299,
        duration: 'মাস',
        highlighted: true,
        features: [
          'Unlimited Practice',
          'AI Tutor Access',
          'Advanced Analytics',
          'All Mock Exams',
          'Premium Community',
        ],
      },

      {
        id: 'pro-plan',
        name: 'Elite',
        price: 599,
        duration: 'মাস',
        features: [
          'সব Premium Feature',
          'Live Batch Access',
          'Exclusive Notes',
          'Priority Support',
          'Advanced AI Mentoring',
        ],
      },
    ],
  },

  announcements: [
    {
      id: 'announcement-1',
      title: 'নতুন HSC 2026 Question Bank যুক্ত হয়েছে',
      content:
        'Physics, Chemistry এবং Biology এর নতুন board-standard MCQ যোগ করা হয়েছে।',
      type: 'success',
      createdAt: '2026-05-16T10:00:00Z',
    },

    {
      id: 'announcement-2',
      title: 'সার্ভার মেইনটেন্যান্স আপডেট',
      content:
        'শনিবার রাত ২টা থেকে ৩টা পর্যন্ত maintenance চলবে।',
      type: 'warning',
      createdAt: '2026-05-15T18:30:00Z',
    },
  ],
};

export default cmsSeed;
