import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'

export default function PublicGallery() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchEventAndPhotos()
  }, [])

  const fetchEventAndPhotos = async () => {
    setLoading(true)
    try {
      // Case-insensitive slug lookup
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug.trim().toLowerCase())
        .single()
      if (eventError) throw eventError
      setEvent(eventData)

      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .select('*')
        .eq('event_id', eventData.id)
        .order('created_at', { ascending: true })
      if (photoError) throw photoError
      setPhotos(photoData || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (loading) return <p className="text-gray-500 text-center mt-8">Loading...</p>
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>
  if (!event) return <p className="text-gray-500 text-center mt-8">Event not found.</p>

  const groupedPhotos = photos.reduce((acc, photo) => {
    const parts = photo.file_path.split('/')
    const folderName = parts[1] || 'Uncategorized'
    if (!acc[folderName]) acc[folderName] = []
    acc[folderName].push(photo)
    return acc
  }, {})

  return (
    <div className="public-gallery max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
        {event.event_date && (
          <p className="text-gray-500 mt-1 text-2xl">{new Date(event.event_date).toLocaleDateString()}</p>
        )}
      </div>

      {Object.keys(groupedPhotos).length === 0 ? (
        <p className="text-gray-500 text-center">No photos uploaded yet.</p>
      ) : (
        Object.keys(groupedPhotos).map((folderName) => (
          <div key={folderName} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">{folderName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {groupedPhotos[folderName].map((photo) => {
                const { data: urlData } = supabase.storage
                  .from('wedding-events')
                  .getPublicUrl(photo.file_path)
                const imageUrl = urlData.publicUrl
                return (
                  <div key={photo.id} className="relative group cursor-pointer">
                    <img
                      src={imageUrl}
                      alt="wedding"
                      className="w-full h-40 object-cover rounded-lg shadow"
                      onClick={() => setSelectedImage(imageUrl)}
                    />
                    <a
                      href={imageUrl}
                      download
                      className="absolute bottom-2 right-2 bg-white text-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition text-sm shadow"
                    >
                      Download
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full mx-4">
            <img src={selectedImage} alt="Selected" className="w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
            <a
              href={selectedImage}
              download
              className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
