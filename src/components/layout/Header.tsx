import { Search, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4">
      <h1 
  className="text-xl font-bold bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] bg-clip-text text-transparent"
>
  Instamili
</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search"
            className="bg-gray-100 dark:bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <button className="relative">
          <div className="w-5 h-5 rounded-full bg-red-500 absolute -top-1 -right-1 text-[10px] text-white flex items-center justify-center">
            3
          </div>
          <Heart className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}