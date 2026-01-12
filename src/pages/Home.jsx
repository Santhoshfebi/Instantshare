import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Capture Your Perfect Moments
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 drop-shadow-md">
            Professional Wedding Photography & Client Galleries
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/event/sample-event"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium shadow-md"
            >
              View Gallery
            </Link>

            <Link
              to="/admin"
              className="bg-white hover:bg-gray-100 transition text-gray-800 px-6 py-3 rounded-lg font-medium shadow-md"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </section>

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
            Book Your Session Today
          </h2>
          <p className="mb-6 text-lg md:text-xl">
            Let's create timeless memories together. Contact us to get started.
          </p>
          <Link
            to="/admin"
            className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Admin Login / Get Started
          </Link>
        </div>
      </section>
    </div>
  )
}
