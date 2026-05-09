import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story } from '../../types';

interface StoryViewerProps {
  isOpen: boolean;
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  isOpen,
  stories,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) => {
  if (!isOpen || !stories.length) return null;

  const currentStory = stories[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[380px] h-[92vh] rounded-3xl overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <img 
          src={currentStory.image} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="" 
        />
        
        {/* Progress Bars */}
        <div className="absolute top-5 left-5 right-5 flex gap-1 z-10">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-px bg-white/30 rounded">
              {idx === currentIndex && (
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '100%' }} 
                  transition={{ duration: 4 }} 
                  className="h-px bg-white" 
                  onAnimationComplete={onNext}
                />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-5 flex items-center gap-3 z-20 text-white">
          <img 
            src={currentStory.avatar} 
            className="w-8 h-8 rounded-full ring-1 ring-white" 
            alt="" 
          />
          <span className="font-semibold text-sm">{currentStory.username}</span>
        </div>

        {/* Navigation */}
        <button 
          onClick={onPrev} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          <X className="rotate-180" />
        </button>
        <button 
          onClick={onNext} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          <X />
        </button>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
