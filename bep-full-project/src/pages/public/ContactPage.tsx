export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          যোগাযোগ
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          কোনো সমস্যা, feedback অথবা business inquiry থাকলে আমাদের সাথে যোগাযোগ করুন।
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-4">
              Email
            </h2>

            <p className="text-cyan-400">
              support@yourdomain.top
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-4">
              Platform
            </h2>

            <p className="text-gray-300">
              Best Exam Preparation (BEP)
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-4">
            Support Hours
          </h2>

          <p className="text-gray-300">
            Saturday - Thursday
          </p>

          <p className="text-gray-400 mt-2">
            10:00 AM - 10:00 PM (BST)
          </p>
        </div>
      </div>
    </div>
  );
}
