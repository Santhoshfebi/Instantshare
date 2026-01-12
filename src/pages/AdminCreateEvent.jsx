import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AdminCreateEvent() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const slug = generateSlug(name)

    try {
      // 1️⃣ Create event in Supabase
      const { data: eventData, error: insertError } = await supabase
        .from('events')
        .insert([{ name, slug, event_date: eventDate }])
        .select()
      if (insertError) throw insertError

      const eventId = eventData[0].id

      // 2️⃣ Upload cover image if selected
      if (coverFile) {
        const filePath = `${eventId}/cover.jpg`
        const { error: uploadError } = await supabase.storage
          .from('wedding-events')
          .upload(filePath, coverFile, { upsert: true })
        if (uploadError) throw uploadError
      }

      setLoading(false)
      navigate(`/admin/events/${eventId}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John & Jane Wedding"
          />
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full text-gray-700"
          />
          {coverFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {coverFile.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}
