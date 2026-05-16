export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          আমাদের সম্পর্কে
        </h1>

        <p className="text-gray-300 text-lg leading-8 mb-8">
          Best Exam Preparation (BEP) হলো একটি আধুনিক Bengali-first EdTech platform
          যা বাংলাদেশের শিক্ষার্থীদের জন্য তৈরি করা হয়েছে।
        </p>

        <p className="text-gray-400 leading-8 mb-6">
          BEP এর লক্ষ্য হলো Class 6 থেকে Masters level পর্যন্ত শিক্ষার্থীদের জন্য
          smart learning experience তৈরি করা যেখানে থাকবে:
        </p>

        <ul className="space-y-3 text-gray-300">
          <li>• প্রশ্ন ব্যাংক</li>
          <li>• MCQ / CQ / SQ Practice</li>
          <li>• Mock Exams</li>
          <li>• Progress Analytics</li>
          <li>• AI Study Assistant</li>
          <li>• Community Learning</li>
          <li>• Premium Learning Resources</li>
        </ul>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-4">
            আমাদের লক্ষ্য
          </h2>

          <p className="text-gray-300 leading-8">
            বাংলাদেশের শিক্ষার্থীদের জন্য একটি premium, smart, scalable এবং
            technology-driven শিক্ষা platform তৈরি করা যেখানে learning হবে
            modern, interactive এবং accessible।
          </p>
        </div>
      </div>
    </div>
  );
}
