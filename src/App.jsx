import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from './lib/api';
import IdentityModal from './components/IdentityModal';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import NotificationBell from './components/NotificationBell';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('gloomy');
  const navigate = useNavigate();

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('plato_theme') || 'gloomy';
    setTheme(saved);
    document.body.className = saved;

    const checkIdentity = async () => {
      const token = localStorage.getItem('plato_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/me');
        setUser(res.user);
      } catch (err) {
        localStorage.removeItem('plato_token');
      }
      setLoading(false);
    };

    checkIdentity();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'gloomy' ? 'lighter' : 'gloomy';
    setTheme(newTheme);
    localStorage.setItem('plato_theme', newTheme);
    document.body.className = newTheme;
  };

  const handleIdentitySet = (user) => {
    setUser(user);
    navigate('/');
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Awakening Plato’s Lair...</div>;
  }

  if (!user) {
    return <IdentityModal onIdentitySet={handleIdentitySet} />;
  }

  return (
    <>
      <Header user={user} onToggleTheme={toggleTheme} />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/:username" element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  );
}

function Header({ user, onToggleTheme }) {
  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '1rem 1rem',
      borderBottom: '1px solid var(--border)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => window.location = '/'}>
        Plato’s Lair
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleTheme}
          style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text)', width: '32px', height: '32px',
            borderRadius: '50%', fontSize: '0.8rem', cursor: 'pointer'
          }}
        >
          {document.body.classList.contains('lighter') ? '🌑' : '🌕'}
        </button>
        <span style={{ color: 'var(--muted)' }}>as {user.display_name}</span>
        <NotificationBell />
      </div>
    </header>
  );
        }
