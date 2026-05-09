import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (caption: string, image: string, file?: File) => void;
  isCreating: boolean;
}

const presetImages = [
  '/images/post1.jpg', '/images/post2.jpg', '/images/post3.jpg',
  '/images/post4.jpg', '/images/post5.jpg', '/images/post6.jpg', '/images/post7.jpg'
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  isCreating
}) => {
  const [caption, setCaption] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState(presetImages[0]);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!caption.trim()) return;
    onCreatePost(caption.trim(), selectedImage, uploadedFile || undefined);
    setCaption('');
    setSelectedImage(presetImages[0]);
    setUploadedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.96, y: 30, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }} 
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={e => e.stopPropagation()} 
        className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b flex justify-between items-center font-semibold dark:border-zinc-800">
          Create new post 
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-6">
          <div className="aspect-video bg-zinc-100 dark:bg-zinc-950 rounded-2xl overflow-hidden mb-4 relative">
            <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
            <label className="absolute bottom-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-2 transition">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-2 mb-5 overflow-auto pb-1">
            {presetImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => { setSelectedImage(img); setUploadedFile(null); }} 
                className={`rounded-xl overflow-hidden flex-shrink-0 border-2 ${selectedImage === img && !uploadedFile ? 'border-black dark:border-white' : 'border-transparent'}`}
              >
                <img src={img} className="w-14 h-14" alt="" />
              </button>
            ))}
          </div>

          <textarea 
            value={caption} 
            onChange={e => setCaption(e.target.value)} 
            placeholder="Write a caption..." 
            className="w-full h-24 resize-none rounded-2xl bg-zinc-100 dark:bg-zinc-950 p-4 text-sm outline-none border border-zinc-200 dark:border-zinc-800" 
          />
        </div>

        <div className="p-5 pt-0 flex justify-end">
          <button 
            disabled={!caption.trim() || isCreating} 
            onClick={handleSubmit} 
            className="bg-black hover:bg-zinc-800 text-white px-9 py-2.5 rounded-2xl disabled:opacity-60 font-semibold text-sm flex items-center gap-2 transition-all"
          >
            {isCreating ? 'Processing...' : 'Share post'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
