import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface Story {
  id: string
  user_id: string
  image_url: string
  created_at: string
  expires_at: string
  user?: {
    username: string
    avatar_url: string
  }
}

export const useStoriesStore = create((set, get) => ({
  stories: [] as Story[],
  
  fetchStories: async () => {
    const { data } = await supabase
      .from('stories')
      .select(`
        *,
        user:users(username, avatar_url)
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
    
    set({ stories: data || [] })
  },

  createStory: async (imageFile: File) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('Not authenticated')

    const fileName = `${user.id}-${Date.now()}.jpg`
    
    await supabase.storage.from('stories').upload(fileName, imageFile)
    const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(fileName)

    await supabase.from('stories').insert({
      user_id: user.id,
      image_url: publicUrl,
    })

    await (get() as any).fetchStories()
  }
}))