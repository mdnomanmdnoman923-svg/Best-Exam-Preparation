export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-300 leading-8">
          <p>
            Best Exam Preparation (BEP) ব্যবহার করার মাধ্যমে আপনি এই privacy policy এর সাথে সম্মত হচ্ছেন।
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              আমরা কী তথ্য সংগ্রহ করি
            </h2>

            <ul className="space-y-2">
              <li>• নাম</li>
              <li>• Email Address</li>
              <li>• Phone Number</li>
              <li>• Education Information</li>
              <li>• Usage Analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              তথ্য কীভাবে ব্যবহার করা হয়
            </h2>

            <ul className="space-y-2">
              <li>• Platform উন্নত করার জন্য</li>
              <li>• Personalized learning experience দেওয়ার জন্য</li>
              <li>• Security এবং authentication এর জন্য</li>
              <li>• User support এর জন্য</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Data Security
            </h2>

            <p>
              আমরা Firebase security এবং modern encryption ব্যবহার করে user data সুরক্ষিত রাখি।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Contact
            </h2>

            <p>
              Privacy সম্পর্কিত কোনো প্রশ্ন থাকলে যোগাযোগ করুন:
            </p>

            <p className="text-cyan-400 mt-2">
              support@yourdomain.top
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
