export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          Terms & Conditions
        </h1>

        <div className="space-y-8 text-gray-300 leading-8">
          <p>
            BEP platform ব্যবহার করার মাধ্যমে আপনি নিচের terms মেনে নিচ্ছেন।
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Platform Usage
            </h2>

            <ul className="space-y-2">
              <li>• Platform শুধুমাত্র educational purpose এর জন্য ব্যবহার করা যাবে।</li>
              <li>• কোনো ধরনের illegal activity অনুমোদিত নয়।</li>
              <li>• Account sharing সীমিত বা restricted হতে পারে।</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Content Ownership
            </h2>

            <p>
              BEP এর content, branding এবং design intellectual property হিসেবে সংরক্ষিত।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Account Security
            </h2>

            <p>
              User নিজের account credentials নিরাপদ রাখার জন্য দায়ী।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Service Changes
            </h2>

            <p>
              আমরা যেকোনো সময় platform এর feature বা policy পরিবর্তন করার অধিকার রাখি।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Contact
            </h2>

            <p className="text-cyan-400">
              support@yourdomain.top
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
