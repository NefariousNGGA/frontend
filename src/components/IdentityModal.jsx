import { useState } from 'react';
import api from '../lib/api';

export default function IdentityModal({ onIdentitySet }) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) return;

    // Ensure username starts with @
    const finalUsername = username.startsWith('@') ? username : `@${username}`;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/users', {
        display_name: displayName.trim(),
        username: finalUsername
      });

      // Save token to localStorage
      localStorage.setItem('plato_token', res.token);
      onIdentitySet(res.user);
    } catch (err) {
      setError(err.message || 'Failed to create identity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,15,19,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1a1a1d', padding: '2rem', borderRadius: '8px',
        width: '90%', maxWidth: '400px', border: '1px solid #333'
      }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.4rem' }}>Enter Plato’s Lair</h2>
        {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Wanderer"
            style={{ width: '100%', padding: '0.5rem', background: '#252529', border: '1px solid #444', color: '#e0e0e5' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., @ghost"
            style={{ width: '100%', padding: '0.5rem', background: '#252529', border: '1px solid #444', color: '#e0e0e5' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '0.6rem', background: '#4a6b78',
            border: 'none', color: 'white', cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}