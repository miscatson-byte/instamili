import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: any | null
  profile: any | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: any) => void
  setProfile: (profile: any) => void
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),

  signUp: async (email, password, username, fullName) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        }
      }
    })
    
    if (authError) throw authError
    
    return authData
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    set({ user: data.user, isAuthenticated: true })
    
    // Profile fetch ko try-catch mein rakhein - agar fail bhi ho toh login successful rahe
    try {
      await get().fetchProfile()
    } catch (profileErr) {
      console.warn('Profile fetch failed:', profileErr)
    }
    
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, isAuthenticated: false })
  },

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle() // .single() ki jagah .maybeSingle() use karein

    if (error) {
      console.warn('Profile fetch error:', error.message)
      set({ profile: null })
      return
    }

    if (data) {
      set({ profile: data })
    }
  }
}))