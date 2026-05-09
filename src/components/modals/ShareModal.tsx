import { useState } from 'react'
import { X, Link, Facebook, Twitter, MessageCircle } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postUrl: string
}

export default function ShareModal({ isOpen, onClose, postUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    { icon: Facebook, label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { icon: Twitter, label: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}` },
    { icon: MessageCircle, label: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(postUrl)}` },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h2 className="font-semibold">Share</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-4 space-y-3">
          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
          >
            <Link className="w-5 h-5" />
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {/* Social Links */}
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              <link.icon className="w-5 h-5" />
              <span>Share to {link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}