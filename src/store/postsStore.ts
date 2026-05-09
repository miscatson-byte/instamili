import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface Post {
  id: string
  user_id: string
  image_url: string
  caption: string
  likes_count: number
  comments_count: number
  created_at: string
  user?: {
    username: string
    avatar_url: string
  }
}

interface PostsState {
  posts: Post[]
  isLoading: boolean
  
  fetchPosts: () => Promise<void>
  createPost: (imageFile: File, caption: string) => Promise<void>
  likePost: (postId: string) => Promise<void>
  unlikePost: (postId: string) => Promise<void>
  addComment: (postId: string, content: string) => Promise<void>
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true })
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(username, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      set({ posts: data })
    }
    
    set({ isLoading: false })
  },

  createPost: async (imageFile, caption) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('Not authenticated')

    // 1. Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('posts')
      .upload(fileName, imageFile)

    if (uploadError) throw uploadError

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(fileName)

    // 3. Create post in database
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        caption,
      })

    if (error) throw error
    
    // 4. Refresh posts
    await get().fetchPosts()
  },

  likePost: async (postId) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, post_id: postId })

    if (error) throw error
  },

  unlikePost: async (postId) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId)

    if (error) throw error
  },

  addComment: async (postId, content) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        post_id: postId,
        content,
      })

    if (error) throw error
  },
}))