import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostsStore } from '../store/postsStore'
import { ImagePlus } from 'lucide-react'

export default function CreatePost() {
  const [caption, setCaption] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { createPost } = usePostsStore()
  const navigate = useNavigate()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return

    setLoading(true)
    try {
      await createPost(imageFile, caption)
      navigate('/')
    } catch (err: any) {
      alert(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover rounded-lg" />
          ) : (
            <label className="cursor-pointer">
              <ImagePlus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Click to upload image</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={!imageFile || loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Share'}
        </button>
      </form>
    </div>
  )
}