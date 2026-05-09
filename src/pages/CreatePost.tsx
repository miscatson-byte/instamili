import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostsStore } from '../store/postsStore'
import { ImagePlus, MapPin, Hash, Video } from 'lucide-react'

export default function CreatePost() {
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [isVideo, setIsVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { createPost } = usePostsStore()
  const navigate = useNavigate()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsVideo(selectedFile.type.startsWith('video/'))
    
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    try {
      // Parse hashtags
      const hashtagList = hashtags
        .split(' ')
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.replace('#', '').toLowerCase())

      await createPost(file, caption, hashtagList, location || undefined, isVideo)
      navigate(isVideo ? '/reels' : '/')
    } catch (err: any) {
      alert(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create New Post</h1>
      
      {/* File Type Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setIsVideo(false); fileInputRef.current?.click() }}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            !isVideo ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <ImagePlus className="w-5 h-5" />
          Photo
        </button>
        <button
          type="button"
          onClick={() => { setIsVideo(true); fileInputRef.current?.click() }}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            isVideo ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <Video className="w-5 h-5" />
          Reel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preview */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {preview ? (
            isVideo ? (
              <video src={preview} className="w-full h-full object-cover" controls />
            ) : (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="text-center text-gray-400">
              <ImagePlus className="w-12 h-12 mx-auto mb-2" />
              <p>Click to upload {isVideo ? 'video' : 'image'}</p>
            </div>
          )}
        </div>

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          rows={3}
        />

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Add location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        {/* Hashtags */}
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="#travel #food #lifestyle"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Posting...' : `Share ${isVideo ? 'Reel' : 'Post'}`}
        </button>
      </form>
    </div>
  )
}