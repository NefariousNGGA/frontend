import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function ReactionBar({ postId }) {
  const [reactions, setReactions] = useState({ counts: {}, my_reaction: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [postId]);

  const loadReactions = async () => {
    try {
      const data = await api.get(`/reactions/post/${postId}`);
      setReactions(data);
    } catch (err) {
      console.error('Failed to load reactions', err);
    }
  };

  const handleReact = async (emoji) => {
    if (loading) return;
    setLoading(true);
    try {
      await api.post('/reactions', { post_id: postId, emoji });
      loadReactions();
    } catch (err) {
      alert('Reaction failed');
    } finally {
      setLoading(false);
    }
  };

  const emojis = ['🕯️', '🌫️', '🕊️', '💀', '👁️', '💭', '🌧️'];

  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {emojis.map(emoji => {
        const count = reactions.counts[emoji] || 0;
        const isActive = reactions.my_reaction === emoji;
        return (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            disabled={loading}
            style={{
              background: isActive ? '#3a5a66' : '#252529',
              border: '1px solid #444',
              color: '#e0e0e5',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            {emoji} {count > 0 ? count : ''}
          </button>
        );
      })}
    </div>
  );
}