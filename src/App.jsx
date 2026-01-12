import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminEvents from './pages/AdminEvents'
import AdminEventDetail from './pages/AdminEventDetail'
import PublicGallery from './pages/PublicGallery'
import AdminSettings from './pages/AdminSettings'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import AdminCreateEvent from './pages/AdminCreateEvent'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:slug" element={<PublicGallery />} />

        {/* Admin login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin area (protected + layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="events" element={<AdminEvents />} />
          <Route path="/admin/events/new" element={<AdminCreateEvent />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="events/:id" element={<AdminEventDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
