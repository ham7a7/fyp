import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">AI Chatbot Builder</h1>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                Register
              </Link>

            </div>
          </div>
        </div>
      </nav>
      <script
  src="http://localhost:3000/widget.js"
  data-bot-id="eefd9f672de0c27a">
</script>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Intelligent Chatbots
            <span className="block text-blue-600 mt-2">With Ease</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, customize, and deploy AI-powered chatbots for your business
            without writing a single line of code.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold text-lg border-2 border-blue-600"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Easy to Build</h3>
              <p className="text-gray-600">
                Create chatbots with our intuitive interface. No coding required.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Deployment</h3>
              <p className="text-gray-600">
                Deploy your chatbots instantly and start engaging with users.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track performance and improve your bot with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

