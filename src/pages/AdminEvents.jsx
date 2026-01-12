import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)

    if (error) setError(error.message)
    else setEvents(data || [])
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) alert(error.message)
    else fetchEvents()
  }

  // Function to get the cover image URL from Supabase storage
  const getCoverImageUrl = (eventId) => {
    if (!eventId) return null
    const { data } = supabase.storage.from('wedding-events').getPublicUrl(`${eventId}/cover.jpg`)
    return data.publicUrl
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Events</h1>
        <Link
          to="/admin/events/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          + Create Event
        </Link>
      </div>

      {/* Events Grid */}
      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
            >
              {/* Cover Image */}
              <div className="h-40 w-full bg-gray-200">
                <img
                  src={getCoverImageUrl(event.id) || 'https://via.placeholder.com/400x250?text=No+Cover'}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1 wrap-break-word">
                    {event.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-1">
                    Created on: {new Date(event.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm wrap-break-word">
                    Slug: {event.slug}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between gap-2">
                  <Link
                    to={`/admin/events/${event.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-center text-sm transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-center text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




