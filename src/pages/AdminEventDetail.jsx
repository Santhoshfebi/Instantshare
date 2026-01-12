import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { QRCodeCanvas } from 'qrcode.react'

export default function AdminEventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [coverUrl, setCoverUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [folder, setFolder] = useState('')
  const [existingFolders, setExistingFolders] = useState([])
  const dropRef = useRef(null)

  // Fetch event and photos
  useEffect(() => {
    fetchEvent()
    fetchPhotos()
  }, [])

  // Update existing folders
  useEffect(() => {
    const folders = Array.from(
      new Set(photos.map(photo => photo.file_path.split('/')[1] || 'uncategorized'))
    )
    setExistingFolders(folders)
  }, [photos])

  // Drag & drop
  useEffect(() => {
    const div = dropRef.current
    if (!div) return

    const handleDragOver = (e) => {
      e.preventDefault()
      div.classList.add('border-blue-400')
    }
    const handleDragLeave = () => div.classList.remove('border-blue-400')
    const handleDrop = async (e) => {
      e.preventDefault()
      div.classList.remove('border-blue-400')
      const files = e.dataTransfer.files
      if (files.length === 0) return
      await uploadFiles(files)
    }

    div.addEventListener('dragover', handleDragOver)
    div.addEventListener('dragleave', handleDragLeave)
    div.addEventListener('drop', handleDrop)

    return () => {
      div.removeEventListener('dragover', handleDragOver)
      div.removeEventListener('dragleave', handleDragLeave)
      div.removeEventListener('drop', handleDrop)
    }
  }, [dropRef, folder])

  const fetchEvent = async () => {
    const { data } = await supabase.from('events').select('*').eq('id', id).single()
    setEvent(data)

    const { data: coverData } = supabase.storage.from('wedding-events').getPublicUrl(`${id}/cover.jpg`)
    setCoverUrl(coverData.publicUrl)
  }

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: true })
    setPhotos(data || [])
  }

  const uploadFiles = async (files) => {
    if (!folder.trim()) {
      setError('Please enter a folder name.')
      return
    }
    setUploading(true)
    setError('')
    try {
      for (let file of files) {
        const filePath = `${id}/${folder.trim()}/${Date.now()}-${file.name}`
        await supabase.storage.from('wedding-events').upload(filePath, file)
        await supabase.from('photos').insert([{ event_id: id, file_path: filePath }])
      }
      fetchPhotos()
    } catch (err) {
      setError(err.message)
    }
    setUploading(false)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    uploadFiles(files)
  }

  const handleDelete = async (photo) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      const { error: storageError } = await supabase.storage.from('wedding-events').remove([photo.file_path])
      if (storageError) throw storageError

      const { error: dbError } = await supabase.from('photos').delete().eq('id', photo.id)
      if (dbError) throw dbError

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    } catch (err) {
      alert(err.message)
    }
  }

  // QR code URL uses environment variable
  const baseUrl = import.meta.env.VITE_APP_BASE_URL
  const qrValue = event ? `${baseUrl}/event/${event.slug.trim().toLowerCase()}` : ''

  const downloadQR = () => {
    const canvas = document.getElementById('qrCodeCanvas')
    if (!canvas) return
    const pngUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = `${event.slug}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!event) return <p className="text-gray-600">Loading...</p>

  const groupedPhotos = photos.reduce((acc, photo) => {
    const parts = photo.file_path.split('/')
    const folderName = parts[1] || 'uncategorized'
    if (!acc[folderName]) acc[folderName] = []
    acc[folderName].push(photo)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
          <p className="text-gray-500 text-sm">Slug: {event.slug}</p>
          {event.event_date && (
            <p className="text-gray-500 text-sm">{new Date(event.event_date).toLocaleDateString()}</p>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg shadow inline-block text-center">
          <QRCodeCanvas id="qrCodeCanvas" value={qrValue} size={120} />
          <button
            onClick={downloadQR}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm transition"
          >
            Download QR
          </button>
          <p className="text-xs text-gray-500 mt-1">Share this with your client</p>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Cover Image</h2>
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full max-h-64 object-cover rounded-lg shadow" />
        ) : (
          <p className="text-gray-500">No cover image uploaded</p>
        )}
      </div>

      {/* Folder Input */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium text-sm">Folder:</label>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="Enter folder name"
            className="border px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {existingFolders.length > 0 && (
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="border px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Select existing folder--</option>
            {existingFolders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Drag-and-Drop Upload */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Upload Photos</h2>
        <div
          ref={dropRef}
          className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center text-gray-500 hover:border-blue-400 transition cursor-pointer"
          onClick={() => document.getElementById('fileInput').click()}
        >
          {uploading ? 'Uploading...' : 'Drag & drop images here, or click to select files'}
        </div>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Gallery grouped by folder */}
      {Object.keys(groupedPhotos).map((folderName) => (
        <div key={folderName}>
          <h3 className="text-lg font-semibold mt-4">{folderName}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
            {groupedPhotos[folderName].map((photo) => {
              const { data: urlData } = supabase.storage
                .from('wedding-events')
                .getPublicUrl(photo.file_path)
              const imageUrl = urlData.publicUrl
              return (
                <div key={photo.id} className="relative group">
                  <img
                    src={imageUrl}
                    alt="event"
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />
                  <a
                    href={imageUrl}
                    download
                    className="absolute bottom-2 right-2 bg-white text-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition text-sm shadow"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(photo)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition text-sm shadow"
                  >
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
