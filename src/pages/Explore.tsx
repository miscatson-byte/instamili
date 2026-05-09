import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Search as SearchIcon } from 'lucide-react'

export default function Explore() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    
    const { data } = await supabase
      .from('users')
      .select('id, username, full_name, avatar_url, bio')
      .ilike('username', `%${query}%`)
      .limit(20)

    setResults(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
          />
        </div>
      </form>

      {loading && <p className="text-center text-gray-500">Searching...</p>}

      <div className="space-y-4">
        {results.map((user) => (
          <Link
            key={user.id}
            to={`/profile/${user.username}`}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300">
              {user.avatar_url && (
                <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500">{user.full_name}</p>
            </div>
          </Link>
        ))}
      </div>

      {results.length === 0 && query && !loading && (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  )
}