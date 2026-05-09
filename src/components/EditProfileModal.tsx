import { useState } from 'react'
import { supabase } from '../lib/supabase' // ✅ ADD THIS

export default function EditProfileModal() {
  const [file, setFile] = useState<File | null>(null)

  const updateAvatar = async (file: File) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const fileName = `avatar-${user.id}.jpg`
    
    await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)

    await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    await updateAvatar(file)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button type="submit">Update Avatar</button>
    </form>
  )
}