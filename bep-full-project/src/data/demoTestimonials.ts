// bep-full-project/src/data/demoTestimonials.ts

export interface DemoTestimonial {
  id: string;
  name: string;
  institution: string;
  exam: string;
  avatar: string;
  rating: number;
  review: string;
}

export const demoTestimonials: DemoTestimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Rakib Hasan',
    institution: 'Rajshahi College',
    exam: 'HSC 2026',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    rating: 5,
    review:
      'BEP এর AI explanation এবং mock exam system আমার preparation অনেক improve করেছে।',
  },

  {
    id: 'testimonial-2',
    name: 'Nusrat Jahan',
    institution: 'Viqarunnisa Noon School',
    exam: 'Medical Admission',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    rating: 5,
    review:
      'বাংলায় এত premium UI এবং smart analytics আগে কোনো platform এ পাইনি।',
  },

  {
    id: 'testimonial-3',
    name: 'Mehedi Hasan',
    institution: 'Dhaka Residential Model College',
    exam: 'Engineering Admission',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    rating: 4,
    review:
      'Leaderboard এবং daily practice streak আমাকে consistent থাকতে সাহায্য করেছে।',
  },

  {
    id: 'testimonial-4',
    name: 'Tasnia Rahman',
    institution: 'Holy Cross College',
    exam: 'SSC 2027',
    avatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
    rating: 5,
    review:
      'Question bank quality এবং instant solution system সত্যিই অসাধারণ।',
  },
];

export default demoTestimonials;
