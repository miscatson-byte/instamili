import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const { error } = await signUp(email, password, username);
    
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-black">
      <div className="w-[350px] p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[10px] text-center">
        <h1 className="text-[36px] mb-8 bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] bg-clip-text text-transparent font-bold">
          Instamili
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 mb-2.5 border border-gray-200 dark:border-gray-700 rounded-[5px] outline-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-2.5 border border-gray-200 dark:border-gray-700 rounded-[5px] outline-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 mb-4 border border-gray-200 dark:border-gray-700 rounded-[5px] outline-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
          />

          {error && (
            <p className="text-[#ed4956] text-sm mb-2.5">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm mb-2.5">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 border-none rounded-lg bg-[#0095f6] text-white font-bold text-base cursor-pointer hover:bg-[#0077c2] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-5 text-gray-500 text-sm">
          Have an account?{' '}
          <Link to="/login" className="text-[#0095f6] font-bold no-underline hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}