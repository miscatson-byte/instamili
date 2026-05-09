import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { Send } from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  sender?: {
    username: string
    avatar_url: string
  }
}

export default function Messages() {
  const { user, profile } = useAuthStore()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
      
      // Real-time subscription
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${selectedUser.id}`,
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [selectedUser])

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('messages')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
    
    if (data) {
      const userIds = [...new Set(data.flatMap(m => [m.sender_id, m.receiver_id]))]
        .filter(id => id !== user?.id)
      
      const { data: users } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .in('id', userIds)
      
      setConversations(users || [])
    }
    setLoading(false)
  }

  const fetchMessages = async (otherUserId: string) => {
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(username, avatar_url)
      `)
      .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user?.id,
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
      })

    if (!error) {
      setNewMessage('')
      fetchMessages(selectedUser.id)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r dark:border-gray-800 overflow-y-auto">
        <h2 className="p-4 font-bold text-xl border-b dark:border-gray-800">Messages</h2>
        
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedUser(conv)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 ${
              selectedUser?.id === conv.id ? 'bg-gray-50 dark:bg-gray-900' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-300">
              {conv.avatar_url && (
                <img src={conv.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            <span className="font-semibold">{conv.username}</span>
          </button>
        ))}

        {conversations.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No conversations yet</p>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300">
                {selectedUser.avatar_url && (
                  <img src={selectedUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                )}
              </div>
              <span className="font-semibold">{selectedUser.username}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.sender_id === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-800 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message..."
                className="flex-1 px-4 py-2 rounded-full border dark:bg-gray-900 dark:border-gray-700"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 text-blue-500 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}