import { useState } from 'react';
import api from '../lib/api';

export default function CommentBox({ postId, onCommentPosted }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await api.post('/comments', { post_id: postId, content });
      setContent('');
      onCommentPosted?.();
    } catch (err) {
      alert('Failed to post comment: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thought..."
        style={{
          width: '100%', minHeight: '80px', padding: '0.5rem',
          background: '#252529', border: '1px solid #444', color: '#e0e0e5',
          borderRadius: '4px'
        }}
      />
      <button
        type="submit"
        style={{
          marginTop: '0.5rem', padding: '0.3rem 1rem',
          background: '#4a6b78', color: 'white', border: 'none',
          borderRadius: '4px', cursor: 'pointer'
        }}
      >
        Post
      </button>
    </form>
  );
}