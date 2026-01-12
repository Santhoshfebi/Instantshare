import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useState } from 'react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Admin Sub Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Navigation */}
            <nav className="flex items-center gap-6">
              <NavLink
                to="/admin/events"
                className={({ isActive }) =>
                  `text-sm font-medium border-b-2 pb-1 transition ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`
                }
              >
                Events
              </NavLink>

              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `text-sm font-medium border-b-2 pb-1 transition ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`
                }
              >
                Settings
              </NavLink>
            </nav>

            {/* Right: Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Menu ▾
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-sm z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm
                               text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
