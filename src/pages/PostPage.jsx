import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import CommentBox from '../components/CommentBox';
import ReactionBar from '../components/ReactionBar';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await api.get(`/posts/${id}`);
        const commentData = await api.get(`/comments/post/${id}`);
        setPost(postData);
        setComments(commentData);
      } catch (err) {
        alert('Post not found');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleCommentPosted = async () => {
    const commentData = await api.get(`/comments/post/${id}`);
    setComments(commentData);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Delving into thought...</div>;
  if (!post) return <div style={{ padding: '2rem' }}>Post not found</div>;

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <h1>{post.title || 'Untitled'}</h1>
      <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
        by <Link to={`/${post.author_username}`} style={{ color: '#6a5f8c' }}>
          {post.author_display_name}
        </Link>
      </p>
      <div style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
        {post.content.split('\n').map((para, i) => (
          <p key={i} style={{ margin: '1rem 0' }}>{para}</p>
        ))}
      </div>

      <ReactionBar postId={post.id} />

      <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>Whispers ({comments.length})</h3>
      {comments.length === 0 ? (
        <p>No whispers yet.</p>
      ) : (
        <div style={{ marginBottom: '2rem' }}>
          {comments.map(c => (
            <div key={c.id} style={{
              padding: '0.8rem 0', borderBottom: '1px solid #2a2a2e'
            }}>
              <Link to={`/${c.username}`} style={{ color: '#6a5f8c' }}>
                {c.display_name}
              </Link>
              <div style={{ marginTop: '0.3rem', color: '#ccc' }}>{c.content}</div>
            </div>
          ))}
        </div>
      )}

      <CommentBox postId={post.id} onCommentPosted={handleCommentPosted} />
    </div>
  );
}