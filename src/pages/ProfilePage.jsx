import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // We'll set up routing next
import api from '../lib/api';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.get(`/profiles/${username}`);
        setProfile(data);
      } catch (err) {
        alert('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;
  if (!profile) return <div style={{ padding: '2rem' }}>Profile not found</div>;

  const { user, recent_comments } = profile;
  const lastSeen = new Date(user.last_seen).toLocaleDateString();

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>{user.display_name}</h1>
      <p style={{ color: '#aaa' }}>{user.username} • Joined {new Date(user.created_at).toLocaleDateString()}</p>
      <p>Last seen: {lastSeen}</p>

      <h2>Recent Whispers</h2>
      {recent_comments.length === 0 ? (
        <p>No recent comments</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recent_comments.map(c => (
            <li key={c.id} style={{ marginBottom: '1rem', padding: '0.8rem', background: '#1a1a1d', borderRadius: '4px' }}>
              <div>{c.content}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.3rem' }}>
                on “{c.post_title}”
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}