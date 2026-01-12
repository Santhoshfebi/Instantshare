import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* Hero Section */}
      

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
            <p className="text-gray-600">
              High-resolution photos delivered with professional editing.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Client Galleries</h3>
            <p className="text-gray-600">
              Shareable QR codes for your events, easy downloads.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Memorable Moments</h3>
            <p className="text-gray-600">
              Capture the joy and emotion of your special day forever.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upload Your Memories Today ...!
          </h2>
          <p className="mb-6 text-lg md:text-xl">
            Let's create timeless memories together. Contact us to get started.
          </p>
          <Link
            to="/admin"
            className="bg-white text-2xl text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Admin Login / Get Started
          </Link>
        </div>
      </section>
    </div>
  )
}
