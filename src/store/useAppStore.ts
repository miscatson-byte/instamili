import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, Contact, Reel } from '../types';
import { supabase } from '../lib/supabase';

// ─── Fake Auth User Type ───
interface FakeUser {
  email: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  link: string;
}

// ─── Chat Message Type ───
interface ChatMessage {
  id: number;
  sender: string;
  receiver: string;
  text: string;
  time: string;
}

const defaultFakeUser: FakeUser = {
  email: 'user@example.com',
  username: 'your_username',
  name: 'Your Name',
  avatar: 'https://i.pravatar.cc/150?img=20',
  bio: '📷 Photography enthusiast\n🌍 Travel | Food | Lifestyle',
  link: 'linktr.ee/yourname',
};

interface AppState {
  // ─── Existing State ───
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  toggleLike: (postId: number) => void;
  addComment: (postId: number, comment: any) => void;
  deleteComment: (postId: number, commentId: number) => void;
  editComment: (postId: number, commentId: number, newText: string) => void;
  
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  sendContactMessage: (contactId: number, message: any) => void;
  
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  markNotificationRead: (index: number) => void;
  
  reels: Reel[];
  setReels: (reels: Reel[]) => void;

  // ─── Supabase State ───
  user: any;
  isLoading: boolean;
  
  // ─── Supabase Actions ───
  fetchPosts: () => Promise<void>;
  addPostSupabase: (post: Partial<Post>) => Promise<void>;
  toggleLikeSupabase: (postId: number) => Promise<void>;
  addCommentSupabase: (postId: number, text: string) => Promise<void>;
  
  // Supabase Auth
  signUpSupabase: (email: string, password: string, username: string) => Promise<any>;
  signInSupabase: (email: string, password: string) => Promise<any>;
  signOutSupabase: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  setUser: (user: any) => void;
  
  // Realtime
  subscribeToRealtime: () => () => void;

  // ─── NEW: Fake Auth State ───
  fakeUser: FakeUser | null;
  isAuthenticated: boolean;
  
  // ─── NEW: Fake Auth Actions ───
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => void;
  updateProfile: (data: Partial<FakeUser>) => void;

  // ─── NEW: Chat Messages ───
  chatMessages: ChatMessage[];
  sendChatMessage: (receiver: string, text: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ═══════════════════════════════════════
      // EXISTING STATE
      // ═══════════════════════════════════════
      posts: [],
      setPosts: (posts) => set({ posts }),
      
      addPost: (post) => {
        set((state) => ({ posts: [...state.posts, post] }));
      },
      
      toggleLike: (postId) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
          ),
        }));
      },
      
      addComment: (postId, comment) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? { ...p, comments: [...(p.comments || []), comment] }
              : p
          ),
        }));
      },
      
      deleteComment: (postId, commentId) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments?.filter((c) => c.id !== commentId) || [],
                }
              : p
          ),
        }));
      },
      
      editComment: (postId, commentId, newText) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments?.map((c) =>
                    c.id === commentId ? { ...c, text: newText } : c
                  ),
                }
              : p
          ),
        }));
      },

      contacts: [],
      setContacts: (contacts) => set({ contacts }),
      sendContactMessage: (contactId, message) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === contactId
              ? { ...c, messages: [...(c.messages || []), message] }
              : c
          ),
        }));
      },

      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      markNotificationRead: (index) => {
        set((state) => ({
          notifications: state.notifications.map((n, i) =>
            i === index ? { ...n, read: true } : n
          ),
        }));
      },

      reels: [],
      setReels: (reels) => set({ reels }),

      // ═══════════════════════════════════════
      // SUPABASE INTEGRATION
      // ═══════════════════════════════════════
      
      user: null,
      isLoading: false,

      fetchPosts: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
          .from('posts')
          .select(`*, comments(*), likes(*)`)
          .order('created_at', { ascending: false });

        if (!error) {
          set({ posts: data || [], isLoading: false });
        } else {
          console.error('❌ Fetch error:', error);
          set({ isLoading: false });
        }
      },

      addPostSupabase: async (post) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('Please login first!');
          return;
        }

        const { data, error } = await supabase
          .from('posts')
          .insert([{ ...post, user_id: user.id }])
          .select();

        if (!error && data) {
          set((state) => ({ posts: [data[0], ...state.posts] }));
        }
      },

      toggleLikeSupabase: async (postId) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('Please login to like!');
          return;
        }

        const { data: existing } = await supabase
          .from('likes')
          .select('*')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        if (existing) {
          await supabase.from('likes').delete().eq('id', existing.id);
        } else {
          await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);
        }

        get().fetchPosts();
      },

      addCommentSupabase: async (postId, text) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('Please login to comment!');
          return;
        }

        const { error } = await supabase.from('comments').insert([{
          post_id: postId,
          user_id: user.id,
          username: user.email?.split('@')[0] || 'user',
          text,
        }]);

        if (!error) get().fetchPosts();
      },

      signUpSupabase: async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (!error && data.user) {
          await supabase.from('profiles').insert([{
            id: data.user.id,
            username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          }]);
        }
        return { data, error };
      },

      signInSupabase: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error) set({ user: data.user });
        return { data, error };
      },

      signOutSupabase: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },

      getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user });
        return user;
      },

      setUser: (user) => set({ user }),

      subscribeToRealtime: () => {
        console.log('🔴 Connecting to Realtime...');
        
        const channel = supabase
          .channel('realtime-posts')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'posts' },
            (payload) => {
              console.log('🆕 New Post:', payload.new);
              get().fetchPosts();
            }
          )
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'comments' },
            () => {
              console.log('💬 New Comment');
              get().fetchPosts();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'likes' },
            () => {
              console.log('❤️ Like Updated');
              get().fetchPosts();
            }
          )
          .subscribe((status) => {
            console.log('Realtime Status:', status);
          });

        return () => {
          console.log('🟢 Disconnecting Realtime...');
          supabase.removeChannel(channel);
        };
      },

      // ═══════════════════════════════════════
      // FAKE AUTH
      // ═══════════════════════════════════════
      
      fakeUser: null,
      isAuthenticated: false,

      signIn: async (email, password) => {
        set({ 
          fakeUser: { ...defaultFakeUser, email }, 
          isAuthenticated: true 
        });
        return { error: null };
      },

      signUp: async (email, password, username) => {
        set({ 
          fakeUser: { 
            ...defaultFakeUser, 
            email, 
            username, 
            name: username 
          }, 
          isAuthenticated: true 
        });
        return { error: null };
      },

      signOut: () => {
        set({ fakeUser: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          fakeUser: state.fakeUser ? { ...state.fakeUser, ...data } : null,
        }));
      },

      // ═══════════════════════════════════════
      // CHAT MESSAGES (NEW)
      // ═══════════════════════════════════════
      
      chatMessages: [],
      
      sendChatMessage: (receiver, text) => {
        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: get().fakeUser?.username || 'me',
          receiver,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
      },
    }),
    {
      name: 'instagram-clone-storage',
      partialize: (state) => ({ 
        fakeUser: state.fakeUser, 
        isAuthenticated: state.isAuthenticated,
        chatMessages: state.chatMessages,
      }),
    }
  )
);