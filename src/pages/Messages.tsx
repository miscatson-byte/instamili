import { useState } from 'react';
import { Search, Phone, Video, Info, Smile, Image, Heart, Send } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const conversations = [
  { id: 1, user: 'sara_travels', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'That beach looks amazing! 🏖️', time: '2m', unread: 2 },
  { id: 2, user: 'foodie_mike', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'You should try this recipe!', time: '1h', unread: 0 },
  { id: 3, user: 'alps_explorer', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'Next trip to Switzerland?', time: '3h', unread: 1 },
  { id: 4, user: 'urban_vibes', avatar: 'https://i.pravatar.cc/150?img=4', lastMessage: 'Great shot yesterday!', time: '1d', unread: 0 },
  { id: 5, user: 'art_daily', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Thanks for the support! 🎨', time: '2d', unread: 0 },
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const { fakeUser, chatMessages, sendChatMessage } = useAppStore();

  const currentChatMessages = chatMessages.filter(
    (m) => 
      (m.sender === fakeUser?.username && m.receiver === selectedChat.user) ||
      (m.sender === selectedChat.user && m.receiver === fakeUser?.username)
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendChatMessage(selectedChat.user, messageText);
    setMessageText('');
  };

  return (
    <div className="flex h-[calc(100vh-80px)] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-black">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg mb-4 text-black dark:text-white">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg outline-none text-sm text-black dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left
                ${selectedChat.id === chat.id ? 'bg-gray-50 dark:bg-gray-900' : ''}
              `}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.user} className="w-12 h-12 rounded-full object-cover" />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-black dark:text-white">{chat.user}</p>
                <p className="text-gray-500 text-sm truncate">{chat.lastMessage}</p>
              </div>
              <span className="text-gray-400 text-xs">{chat.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img src={selectedChat.avatar} alt={selectedChat.user} className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-black dark:text-white">{selectedChat.user}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
              <Phone className="w-5 h-5 text-black dark:text-white" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
              <Video className="w-5 h-5 text-black dark:text-white" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
              <Info className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>

        {/* Messages - Instagram Style */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentChatMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.sender === fakeUser?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2" style={{ maxWidth: '75%' }}>
                {/* Avatar for received messages */}
                {msg.sender !== fakeUser?.username && (
                  <img 
                    src={selectedChat.avatar} 
                    alt={msg.sender}
                    className="w-6 h-6 rounded-full flex-shrink-0 mb-1"
                  />
                )}
                
                <div 
                  className={`
                    px-3 py-2 rounded-2xl
                    ${msg.sender === fakeUser?.username 
                      ? 'bg-[#3797F0] text-white rounded-br-md' 
                      : 'bg-[#262626] text-white rounded-bl-md'
                    }
                  `}
                  style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    minWidth: '0'
                  }}
                >
                  <p className="text-sm" style={{ wordBreak: 'break-word' }}>
                    {msg.text}
                  </p>
                  <span className={`text-[10px] mt-1 block ${msg.sender === fakeUser?.username ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
              <Smile className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
              <Image className="w-6 h-6 text-gray-500" />
            </button>
            <input
              type="text"
              placeholder="Message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full outline-none text-sm text-black dark:text-white"
            />
            {messageText ? (
              <button onClick={handleSend} className="p-2 text-[#3797F0]">
                <Send className="w-6 h-6" />
              </button>
            ) : (
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                <Heart className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}