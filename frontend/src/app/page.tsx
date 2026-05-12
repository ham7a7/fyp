import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI Chatbot Builder
            </h1>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-blue-600 px-5 py-2.5 rounded-full shadow hover:bg-blue-700 hover:shadow-lg transition-all"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
            Build Intelligent Chatbots
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
              Without Writing Code
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create, customize, and deploy AI-powered chatbots for your business in minutes. Enhance customer engagement effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 shadow-md hover:shadow-xl"
            >
              Start Building Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 shadow-sm"
            >
              Live Demo
            </Link>
          </div>

          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Intuitive Builder</h3>
              <p className="text-gray-500 leading-relaxed">
                Visual interface to create complex conversational flows. No technical expertise or coding required.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Deploy</h3>
              <p className="text-gray-500 leading-relaxed">
                Generate an embed link and add your chatbot to any website with just a single line of code.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Deep Analytics</h3>
              <p className="text-gray-500 leading-relaxed">
                Gain actionable insights from user interactions to continuously improve your bot's performance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

