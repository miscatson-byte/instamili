import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface Post {
  id: string
  user_id: string
  image_url: string
  video_url?: string
  caption: string
  hashtags: string[]
  location?: string
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
  reels: Post[]
  isLoading: boolean
  
  fetchPosts: () => Promise<void>
  fetchReels: () => Promise<void>
  createPost: (file: File, caption: string, hashtags: string[], location?: string, isVideo?: boolean) => Promise<void>
  likePost: (postId: string) => Promise<void>
  unlikePost: (postId: string) => Promise<void>
  addComment: (postId: string, content: string) => Promise<void>
  searchByHashtag: (hashtag: string) => Promise<Post[]>
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  reels: [],
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true })
    const { data } = await supabase
      .from('posts')
      .select(`*, user:users(username, avatar_url)`)
      .is('video_url', null) // Sirf images
      .order('created_at', { ascending: false })
    
    set({ posts: data || [], isLoading: false })
  },

  fetchReels: async () => {
    set({ isLoading: true })
    const { data } = await supabase
      .from('posts')
      .select(`*, user:users(username, avatar_url)`)
      .not('video_url', 'is', null) // Sirf videos
      .order('created_at', { ascending: false })
    
    set({ reels: data || [], isLoading: false })
  },

  createPost: async (file, caption, hashtags, location, isVideo = false) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('Not authenticated')

    const bucket = isVideo ? 'videos' : 'posts'
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    // Upload file
    await supabase.storage.from(bucket).upload(fileName, file)
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)

    // Insert post
    const insertData: any = {
      user_id: user.id,
      caption,
      hashtags,
      location,
    }

    if (isVideo) {
      insertData.video_url = publicUrl
    } else {
      insertData.image_url = publicUrl
    }

    const { error } = await supabase.from('posts').insert(insertData)
    if (error) throw error
    
    await get().fetchPosts()
    if (isVideo) await get().fetchReels()
  },

  likePost: async (postId) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    await supabase.from('likes').insert({ user_id: user.id, post_id: postId })
  },

  unlikePost: async (postId) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId)
  },

  addComment: async (postId, content) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    await supabase.from('comments').insert({ user_id: user.id, post_id: postId, content })
  },

  searchByHashtag: async (hashtag) => {
    const { data } = await supabase
      .from('posts')
      .select(`*, user:users(username, avatar_url)`)
      .contains('hashtags', [hashtag])
      .order('created_at', { ascending: false })
    
    return data || []
  }
}))