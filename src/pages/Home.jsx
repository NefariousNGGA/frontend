import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitForm, setSubmitForm] = useState({ title: '', content: '', mood_tags: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await api.get('/posts');
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleSubmission = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const tags = submitForm.mood_tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/posts/submit', {
        title: submitForm.title || null,
        content: submitForm.content,
        mood_tags: tags
      });
      setSubmitMessage('Thought submitted for review. Thank you.');
      setSubmitForm({ title: '', content: '', mood_tags: '' });
    } catch (err) {
      setSubmitMessage('Submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Gathering thoughts...</div>;

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Recent Reflections</h2>
        <button
          onClick={() => setShowSubmit(!showSubmit)}
          style={{
            padding: '0.3rem 0.8rem', background: '#3a5a66',
            border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          {showSubmit ? 'Cancel' : 'Share a Thought'}
        </button>
      </div>

      {showSubmit && (
        <form onSubmit={handleSubmission} style={{ marginBottom: '2rem', padding: '1rem', background: '#1a1a1d', borderRadius: '8px' }}>
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="text"
              placeholder="Title (optional)"
              value={submitForm.title}
              onChange={e => setSubmitForm({...submitForm, title: e.target.value})}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '0.8rem' }}>
            <textarea
              placeholder="Your thought..."
              rows="5"
              value={submitForm.content}
              onChange={e => setSubmitForm({...submitForm, content: e.target.value})}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="text"
              placeholder="Mood tags (e.g., melancholy, hope)"
              value={submitForm.mood_tags}
              onChange={e => setSubmitForm({...submitForm, mood_tags: e.target.value})}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !submitForm.content.trim()}
            style={{
              padding: '0.4rem 1rem', background: '#4a6b78',
              border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            {submitting ? 'Submitting...' : 'Send to Curator'}
          </button>
          {submitMessage && (
            <div style={{ marginTop: '0.5rem', color: submitMessage.includes('failed') ? '#ff6b6b' : '#88ffaa' }}>
              {submitMessage}
            </div>
          )}
        </form>
      )}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{
            marginBottom: '2rem', paddingBottom: '1.5rem',
            borderBottom: '1px solid #2a2a2e'
          }}>
            <h3>
              <Link to={`/post/${post.id}`} style={{ color: '#e0e0e5', textDecoration: 'none' }}>
                {post.title || 'Untitled'}
              </Link>
            </h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              by <Link to={`/${post.author_username}`} style={{ color: '#6a5f8c' }}>
                {post.author_display_name}
              </Link>
              {post.mood_tags?.length > 0 && (
                <span> • {post.mood_tags.map(t => `#${t}`).join(', ')}</span>
              )}
            </p>
            <p style={{ color: '#ccc', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              {post.content.length > 200 
                ? post.content.substring(0, 200) + '...' 
                : post.content}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>
              {Math.ceil(post.content.split(/\s+/).length / 200)} min read
            </p>
          </div>
        ))
      )}
    </div>
  );
}