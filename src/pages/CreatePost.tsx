import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const { addPostSupabase, user } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!image.trim()) {
      setError('Please enter an image URL');
      return;
    }

    await addPostSupabase({
      image,
      caption,
      username: user?.email?.split('@')[0] || 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'user'}`,
    });

    navigate('/');
  };

  // Preview ke liye default image
  const previewImage = image || 'https://via.placeholder.com/400x400?text=Enter+Image+URL';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: '#fafafa'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '30px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Post</h2>

        {/* Image Preview */}
        <img 
          src={previewImage} 
          alt="Preview"
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '10px',
            marginBottom: '20px',
            background: '#f0f0f0'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Invalid+URL';
          }}
        />

        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Image URL (e.g., https://picsum.photos/400/400)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />

          {error && (
            <p style={{ color: '#ed4956', fontSize: '14px', marginBottom: '10px' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Share Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}